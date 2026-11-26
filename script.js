// ============ ДАННЫЕ ============
const COLORS = [
    { id: 'blue',   hex: '#1E3A6D', name: 'Темно-синий', type: 'main', num: 1 },
    { id: 'green',  hex: '#2E6B42', name: 'Сине-зеленый', type: 'main', num: 2 },
    { id: 'red',    hex: '#E32636', name: 'Оранжево-красный', type: 'main', num: 3 },
    { id: 'yellow', hex: '#F2C200', name: 'Светло-желтый', type: 'main', num: 4 },
    { id: 'violet', hex: '#6B2C91', name: 'Фиолетовый', type: 'additional', num: 5 },
    { id: 'brown',  hex: '#6B4226', name: 'Коричневый', type: 'additional', num: 6 },
    { id: 'black',  hex: '#1A1A1A', name: 'Черный', type: 'additional', num: 7 },
    { id: 'gray',   hex: '#8C8C8C', name: 'Серый', type: 'additional', num: 0 }
];

const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.id, c]));

const POSITION_MEANINGS = [
    'Средство достижения цели (как вы действуете)',
    'Цель, к которой вы стремитесь',
    'Истинная ситуация (ваше реальное состояние)',
    'Образ действий, который подсказывает ситуация',
    'Безразличие / нейтральное отношение',
    'Безразличие / резервная трактовка',
    'Негативное отношение / источник стресса',
    'Стремление подавить потребность'
];

const PAIR_INTERPRETATIONS = {
    '1+2': 'Чувство удовлетворенности, спокойствия, стремление к спокойной обстановке, нежелание участвовать в конфликтах.',
    '1+3': 'Гармоничный баланс между потребностью в покое и активной деятельностью.',
    '1+4': 'Стремление к зависимости от среды, потребность в поддержке и понимании.',
    '2+3': 'Автономность, самостоятельность в принятии решений, инициативность.',
    '2+4': 'Стремление к самоутверждению через активную деятельность и достижение целей.',
    '3+4': 'Направленность вовне, потребность активно действовать и добиваться успеха.',
    '1+5': 'Тонкая эмоциональность, романтичность, потребность в глубоких привязанностях.',
    '1+0': 'Потребность в уединении и тишине, возможна усталость от общения.',
    '2+7': 'Стремление к самоутверждению через независимость и контроль.',
    '3+7': 'Сильная энергия, возможно, протестное поведение, готовность отстаивать позицию.',
    '4+5': 'Мечтательность с оптимизмом, потребность в признании и переменах.',
    '4+0': 'Стремление к оптимизму на фоне усталости, возможна скрытая тревога.',
    '5+6': 'Потребность в утонченном комфорте и эстетике, тонкая чувствительность.',
    '6+7': 'Стремление к комфорту и независимости одновременно.',
    '0+7': 'Ярко выраженная потребность в уединении или протест, желание отгородиться.'
};

// ============ СОСТОЯНИЕ ============
let currentRound = 0;
let currentOrder = [];
let roundsResults = [];
let colorPool = [];
const HISTORY_KEY = 'luscher_history_v1';

// ============ DOM ============
const screens = {
    intro:   document.getElementById('intro-screen'),
    test:    document.getElementById('test-screen'),
    result:  document.getElementById('result-screen'),
    history: document.getElementById('history-screen'),
};
const colorsGrid       = document.getElementById('colors-grid');
const selectionPreview = document.getElementById('selection-preview');
const instruction      = document.getElementById('instruction');
const roundInfo        = document.getElementById('round-info');
const progressFill     = document.getElementById('progress-fill');
const resultContent    = document.getElementById('result-content');
const historyContent   = document.getElementById('history-content');

// ============ НАВИГАЦИЯ ============
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    if (screens[name]) {
        screens[name].classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============ ЛОГИКА ТЕСТА ============
function startTest() {
    currentRound = 0;
    roundsResults = [];
    colorPool = shuffle(COLORS);
    startRound();
    showScreen('test');
}

function startRound() {
    currentOrder = [];
    render();
}

function render() {
    roundInfo.textContent = `Раунд ${currentRound + 1} из 2`;
    const totalSelections = currentRound * 8 + currentOrder.length;
    progressFill.style.width = `${(totalSelections / 16) * 100}%`;

    if (currentOrder.length === 0) {
        instruction.textContent = 'Выберите самый приятный цвет';
    } else if (currentOrder.length < 7) {
        instruction.textContent = 'Выберите следующий по приятности';
    } else {
        instruction.textContent = 'Остался последний цвет';
    }

    colorsGrid.innerHTML = '';
    colorPool.forEach(color => {
        // Если цвет уже выбран — не показываем его (исчезает)
        if (currentOrder.includes(color.id)) return;

        const tile = document.createElement('div');
        tile.className = 'color-tile';
        tile.style.background = color.hex;
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', color.name);
        tile.addEventListener('click', () => selectColor(color.id));
        colorsGrid.appendChild(tile);
    });

    selectionPreview.innerHTML = '';
    currentOrder.forEach(id => {
        const dot = document.createElement('div');
        dot.className = 'preview-dot';
        dot.style.background = COLOR_MAP[id].hex;
        selectionPreview.appendChild(dot);
    });
}

function selectColor(id) {
    if (currentOrder.includes(id)) return;
    if (navigator.vibrate) navigator.vibrate(10);

    currentOrder.push(id);

    if (currentOrder.length === 8) {
        roundsResults.push([...currentOrder]);
        currentRound++;

        if (currentRound < 2) {
            setTimeout(startRound, 400);
        } else {
            setTimeout(() => {
                const result = buildResult(roundsResults);
                saveToHistory(result);
                renderResult(result);
                showScreen('result');
            }, 400);
        }
    } else {
        render();
    }
}

// ============ АНАЛИЗ РЕЗУЛЬТАТОВ ============
function getFunctionalGroups(order) {
    return {
        '++': [order[0], order[1]],
        'xx': [order[2], order[3]],
        '==': [order[4], order[5]],
        '--': [order[6], order[7]]
    };
}

function buildResult(rounds) {
    const main = rounds[0];
    const second = rounds[1];
    const groups = getFunctionalGroups(main);

    const positions = main.map((id, index) => {
        const color = COLOR_MAP[id];
        const pairId = index < 4 
            ? [COLOR_MAP[main[index * 2]].num, COLOR_MAP[main[index * 2 + 1]].num].sort((a,b)=>a-b).join('+')
            : null;
        
        return {
            position: index + 1,
            color: color,
            meaning: POSITION_MEANINGS[index],
            pairText: pairId ? (PAIR_INTERPRETATIONS[pairId] || 'Нейтральное сочетание.') : null
        };
    });

    const mainColorsInRejection = main.slice(5).filter(id => COLOR_MAP[id].type === 'main');
    const conflictText = mainColorsInRejection.length > 0
        ? `Внимание: основные цвета (${mainColorsInRejection.map(id => COLOR_MAP[id].name).join(', ')}) находятся в зоне отвержения. Это может указывать на неудовлетворенность базовых потребностей и внутренний конфликт.`
        : 'Основные потребности в целом удовлетворены.';

    const matches = main.reduce((acc, id, i) => acc + (second[i] === id ? 1 : 0), 0);

    return {
        date: new Date().toISOString(),
        mainOrder: main,
        groups: groups,
        positions: positions,
        conflictText: conflictText,
        matches: matches
    };
}

function renderResult(result) {
    resultContent.innerHTML = '';

    // Предупреждение о конфликте
    if (result.conflictText) {
        const warning = document.createElement('div');
        warning.className = 'result-summary';
        warning.style.borderLeft = '4px solid var(--primary)';
        warning.textContent = result.conflictText;
        resultContent.appendChild(warning);
    }

    // Функциональные группы
    const groupsTitle = document.createElement('h2');
    groupsTitle.textContent = 'Функциональные группы';
    groupsTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;color:var(--text);';
    resultContent.appendChild(groupsTitle);

    const groupsContainer = document.createElement('div');
    groupsContainer.style.cssText = 'display:flex; flex-direction:column; gap:8px; margin-bottom:24px;';

    const groupLabels = {
        '++': 'Явное предпочтение',
        'xx': 'Относительное предпочтение',
        '==': 'Безразличие',
        '--': 'Антипатия / отвержение'
    };

    Object.entries(result.groups).forEach(([key, colorIds]) => {
        const groupEl = document.createElement('div');
        groupEl.style.cssText = 'display:flex; align-items:center; gap:12px; padding:8px; background:var(--bg); border-radius:8px;';
        
        const label = document.createElement('span');
        label.style.cssText = 'font-weight:bold; width:60px; font-size:14px; color:var(--text);';
        label.textContent = key;

        const desc = document.createElement('span');
        desc.style.cssText = 'font-size:12px; color:var(--text-muted); width:140px;';
        desc.textContent = groupLabels[key];

        const swatches = document.createElement('div');
        swatches.style.cssText = 'display:flex; gap:6px;';
        colorIds.forEach(id => {
            const sw = document.createElement('div');
            sw.style.cssText = `width:24px; height:24px; border-radius:4px; background:${COLOR_MAP[id].hex}; border:1px solid var(--border);`;
            swatches.appendChild(sw);
        });

        groupEl.appendChild(label);
        groupEl.appendChild(desc);
        groupEl.appendChild(swatches);
        groupsContainer.appendChild(groupEl);
    });
    resultContent.appendChild(groupsContainer);

    // Детальный разбор позиций
    const positionsTitle = document.createElement('h2');
    positionsTitle.textContent = 'Разбор позиций и пар';
    positionsTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;color:var(--text);';
    resultContent.appendChild(positionsTitle);

    result.positions.forEach(pos => {
        const itemEl = document.createElement('div');
        itemEl.className = 'result-item';

        const sw = document.createElement('div');
        sw.className = 'result-swatch';
        sw.style.background = pos.color.hex;

        const text = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'result-name';
        name.textContent = `${pos.position}. ${pos.color.name}`;

        const meaning = document.createElement('div');
        meaning.className = 'result-desc';
        meaning.style.fontWeight = '500';
        meaning.style.color = 'var(--text)';
        meaning.textContent = pos.meaning;

        const pairDesc = document.createElement('div');
        pairDesc.className = 'result-desc';
        pairDesc.textContent = pos.pairText ? `В паре: ${pos.pairText}` : '';

        text.appendChild(name);
        text.appendChild(meaning);
        if (pos.pairText) text.appendChild(pairDesc);

        itemEl.appendChild(sw);
        itemEl.appendChild(text);
        resultContent.appendChild(itemEl);
    });

    // Устойчивость
    const stability = document.createElement('div');
    stability.className = 'result-summary';
    const stabilityText = result.matches >= 6
        ? 'Высокая устойчивость предпочтений.'
        : result.matches >= 3
            ? 'Умеренная устойчивость.'
            : 'Выбор был спонтанным — возможно, вы в состоянии перемен.';
    stability.innerHTML = `<strong>Совпадение двух проходов:</strong> ${result.matches} из 8. ${stabilityText}`;
    resultContent.appendChild(stability);
}

// ============ ИСТОРИЯ ============
function loadHistory() {
    try {
        const raw = localStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveToHistory(result) {
    try {
        const history = loadHistory();
        history.unshift(result);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
    } catch (e) {
        console.warn('Не удалось сохранить результат:', e);
    }
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function renderHistory() {
    const history = loadHistory();
    historyContent.innerHTML = '';

    if (history.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'empty-history';
        empty.textContent = 'Пока нет пройденных тестов.';
        historyContent.appendChild(empty);
        return;
    }

    history.forEach((entry, idx) => {
        const block = document.createElement('div');
        block.className = 'history-entry';

        const header = document.createElement('div');
        header.className = 'history-header';

        const date = document.createElement('div');
        date.className = 'history-date';
        date.textContent = formatDate(entry.date);

        const del = document.createElement('button');
        del.className = 'history-delete';
        del.textContent = 'Удалить';
        del.addEventListener('click', () => {
            const updated = loadHistory().filter((_, i) => i !== idx);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            renderHistory();
        });

        header.appendChild(date);
        header.appendChild(del);

        const colorsRow = document.createElement('div');
        colorsRow.className = 'history-colors';
        entry.mainOrder.forEach(id => {
            const sw = document.createElement('div');
            sw.className = 'history-swatch';
            sw.style.background = COLOR_MAP[id].hex;
            sw.title = COLOR_MAP[id].name;
            colorsRow.appendChild(sw);
        });

        block.appendChild(header);
        block.appendChild(colorsRow);
        historyContent.appendChild(block);
    });
}

// ============ ОБРАБОТЧИКИ КНОПОК ============
document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('restart-btn').addEventListener('click', () => showScreen('intro'));

document.getElementById('history-btn').addEventListener('click', () => {
    renderHistory();
    showScreen('history');
});

document.getElementById('to-history-btn').addEventListener('click', () => {
    renderHistory();
    showScreen('history');
});

document.getElementById('back-btn').addEventListener('click', () => showScreen('intro'));

document.getElementById('clear-history-btn').addEventListener('click', () => {
    if (confirm('Удалить всю историю прохождений?')) {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    }
});

// Экспорт в PDF
document.getElementById('pdf-btn').addEventListener('click', () => {
    const now = new Date().toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
    const resultTitle = document.querySelector('#result-screen h1');
    if (resultTitle) {
        resultTitle.setAttribute('data-print-date', `Дата прохождения: ${now}`);
    }
    setTimeout(() => { window.print(); }, 100);
});

// ============ PWA И ОБНОВЛЕНИЯ ============
if ('serviceWorker' in navigator) {
    let refreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });

    navigator.serviceWorker.register('service-worker.js').then(reg => {
        reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    const banner = document.getElementById('update-banner');
                    if (banner) {
                        banner.hidden = false;
                        document.getElementById('update-btn').addEventListener('click', () => {
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        });
                    }
                }
            });
        });
    });
}

// Тема
if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', mq.matches ? '#0d0d0f' : '#f5f5f7');
    };
    updateTheme();
    mq.addEventListener('change', updateTheme);
}