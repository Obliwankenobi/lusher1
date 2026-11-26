// ============ Данные ============
const COLORS = [
    { id: 'blue',   hex: '#1E3A6D', name: 'Темно-синий', type: 'main', num: 1 },
    { id: 'green',  hex: '#2E6B42', name: 'Сине-зеленый', type: 'main', num: 2 },
    { id: 'red',    hex: '#E32636', name: 'Оранжево-красный', type: 'main', num: 3 },
    { id: 'yellow', hex: '#F2C200', name: 'Светло-желтый', type: 'main', num: 4 },
    { id: 'violet', hex: '#6B2C91', name: 'Фиолетовый', type: 'additional', num: 5 },
    { id: 'brown',  hex: '#6B4226', name: 'Коричневый', type: 'additional', num: 6 },
    { id: 'black',  hex: '#1A1A1A', name: 'Черный', type: 'additional', num: 7 },
    { id: 'gray',   hex: '#8C8C8C', name: 'Серый', type: 'additional', num: 0 } // В методичке серый обозначается 0
];

const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.id, c]));

// Интерпретация одного цвета (одиночная позиция)
const SINGLE = {
    blue:   'Спокойствие, потребность в покое, привязанности, стабильности.',
    green:  'Воля, настойчивость, стремление к самоутверждению и признанию.',
    red:    'Активность, энергия, желание действовать, добиваться результата.',
    yellow: 'Оптимизм, надежда, потребность в переменах, общении, разрядке.',
    violet: 'Творчество, мечтательность, потребность в одобрении и признании.',
    brown:  'Потребность в комфорте, безопасности, уюте, физическом расслаблении.',
    black:  'Независимость, протест, стремление к контролю или уходу от проблем.',
    gray:   'Нейтральность, уединение, стремление отгородиться от впечатлений.',
};

// Ключ пары — цвета в отсортированном порядке (a+b)
// Интерпретация для пары "предпочтение" (позиции 1-4)
const PAIRS = {
    'blue+green':   'Потребность в покое и уверенности. Стремление к стабильности и одновременно — к самореализации. Баланс между уютом и достижением цели.',
    'blue+red':     'Гармония между покоем и активностью. Умение переключаться между отдыхом и деятельностью, эмоциональная устойчивость.',
    'blue+yellow':  'Потребность в спокойствии в сочетании с жаждой перемен. Поиск уютных, но живых впечатлений, общительность без напряжения.',
    'blue+violet':  'Тонкая эмоциональность, романтичность. Потребность в глубоких привязанностях и эстетике.',
    'blue+brown':   'Стремление к покою, комфорту и безопасности. Возможно, потребность в защите и расслаблении.',
    'blue+black':   'Стремление к спокойствию при этом твёрдость в позиции. Умение сохранять независимость, не поддаваясь давлению.',
    'blue+gray':    'Потребность в уединении и тишине. Возможна усталость от общения, желание отдохнуть.',

    'green+red':    'Сильная воля и энергия. Стремление к лидерству, инициативность, готовность действовать.',
    'green+yellow': 'Целеустремлённость с оптимизмом. Настойчивость в достижении цели, но с гибкостью и позитивным настроем.',
    'green+violet': 'Стремление к признанию, самоутверждению через творчество или эстетику. Тонкая самооценка.',
    'green+brown':  'Уверенность с потребностью в комфорте. Достижение цели ради ощущения стабильности.',
    'green+black':  'Жёсткость, настойчивость, стремление к контролю. Возможна упрямость и категоричность.',
    'green+gray':   'Сдержанная настойчивость. Достижение цели без лишних эмоций.',

    'red+yellow':   'Оптимизм, энергия, жажда деятельности и общения. Стремление к успеху, эмоциональный подъём.',
    'red+violet':   'Энергичность с творческим началом. Страстность, эмоциональность, желание нравиться.',
    'red+brown':    'Активность, направленная на достижение комфорта. Действие ради ощущения безопасности.',
    'red+black':    'Сильная энергия, возможно — протест. Готовность отстаивать позицию.',
    'red+gray':     'Стремление действовать на фоне усталости или безразличия. Возможен внутренний конфликт.',

    'yellow+violet': 'Мечтательность с оптимизмом. Потребность в переменах и признании. Творческий настрой.',
    'yellow+brown':  'Желание перемен с потребностью в стабильности. Поиск баланса между новым и уютным.',
    'yellow+black':  'Потребность в переменах с независимостью. Возможна импульсивность или протест.',
    'yellow+gray':   'Стремление к оптимизму на фоне усталости. Возможна скрытая тревога.',

    'violet+brown':  'Потребность в утончённом комфорте и эстетике. Тонкая чувствительность.',
    'violet+black':  'Стремление к признанию и независимости. Возможна эмоциональная напряжённость.',
    'violet+gray':   'Мечтательность с уходом от реальности. Потребность в уединении, возможна тревога.',

    'brown+black':   'Стремление к комфорту и независимости одновременно. Возможна жёсткость в защите своей зоны.',
    'brown+gray':    'Потребность в отдыхе, расслаблении, уходе от нагрузки.',

    'black+gray':    'Ярко выраженная потребность в уединении или протест. Возможна усталость, желание отгородиться.',
};

// Интерпретация для отвергаемых (позиции 5-8) — обычно имеет обратный смысл
const REJECTED = {
    blue:   'Отвергается покой и привязанность. Возможна неудовлетворённость отношениями или потребность в переменах.',
    green:  'Отвергается настойчивость и самоутверждение. Возможна неуверенность или усталость от борьбы.',
    red:    'Отвергается активность и возбуждение. Возможна усталость, переутомление, потребность в отдыхе.',
    yellow: 'Отвергается оптимизм и перемены. Возможна разочарованность, пессимизм, усталость от общения.',
    violet: 'Отвергается потребность в признании. Возможно, признание сейчас неактуально или вызывает напряжение.',
    brown:  'Отвергается комфорт и безопасность. Возможна потребность в интенсивных переживаниях.',
    black:  'Отвергается независимость и протест. Возможно, есть потребность в компромиссе или контроле.',
    gray:   'Отвергается нейтральность и уход. Возможна потребность в ярких впечатлениях и участии.',
};

// ============ Состояние ============
let currentRound = 0;
let remaining = [];
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

// ============ Навигация ============
function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============ Утилиты ============
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function pairKey(a, b) {
    return [a, b].sort().join('+');
}

// ============ Логика теста ============
function startTest() {
    currentRound = 0;
    roundsResults = [];
    colorPool = shuffle(COLORS);
    startRound();
    showScreen('test');
}

function startRound() {
    remaining = colorPool.map(c => c.id);
    currentOrder = [];
    render();
}

function getFunctionalGroups(order) {
    return {
        '++': [order[0], order[1]], // Явное предпочтение
        'xx': [order[2], order[3]], // Относительное предпочтение
        '==': [order[4], order[5]], // Безразличие
        '--': [order[6], order[7]]  // Антипатия / отвержение
    };
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
    remaining.forEach(id => {
        const color = COLOR_MAP[id];
        const tile = document.createElement('div');
        tile.className = 'color-tile';
        tile.style.background = color.hex;
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', color.name);
        tile.addEventListener('click', () => selectColor(id));
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
    remaining = remaining.filter(cid => cid !== id);   // ← НОВАЯ СТРОКА

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
// ============ Построение результата ============
function buildResult(rounds) {
    const main = rounds[0];
    const second = rounds[1];
    const groups = getFunctionalGroups(main);

    // Анализ позиций
    const positions = main.map((id, index) => {
        const color = COLOR_MAP[id];
        const pairId = index < 4 
            ? [COLOR_MAP[main[index * 2]].num, COLOR_MAP[main[index * 2 + 1]].num].sort((a,b)=>a-b).join('+')
            : null;
        
        return {
            position: index + 1,
            color: color,
            meaning: POSITION_MEANINGS[index],
            pairText: pairId ? (PAIR_INTERPRETATIONS[pairId] || 'Нейтральное сочетание.') : null,
            isMainColor: color.type === 'main'
        };
    });

    // Проверка на конфликт (основные цвета за пределами 5-й позиции)
    const mainColorsInRejection = main.slice(5).filter(id => COLOR_MAP[id].type === 'main');
    const conflictText = mainColorsInRejection.length > 0
        ? `Внимание: основные цвета (${mainColorsInRejection.map(id => COLOR_MAP[id].name).join(', ')}) находятся в зоне отвержения. Это может указывать на неудовлетворенность базовых потребностей и внутренний конфликт[reference:3].`
        : 'Основные потребности в целом удовлетворены.';

    // Устойчивость (совпадение двух проходов)
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

    // 1. Блок предупреждения (если есть конфликт)
    if (result.conflictText) {
        const warning = document.createElement('div');
        warning.className = 'result-summary';
        warning.style.borderLeft = '4px solid var(--primary)';
        warning.textContent = result.conflictText;
        resultContent.appendChild(warning);
    }

    // 2. Блок функциональных групп
    const groupsTitle = document.createElement('h2');
    groupsTitle.textContent = 'Функциональные группы';
    groupsTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;';
    resultContent.appendChild(groupsTitle);

    const groupsContainer = document.createElement('div');
    groupsContainer.className = 'groups-container';
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
        label.style.cssText = 'font-weight:bold; width:60px; font-size:14px;';
        label.textContent = key;

        const desc = document.createElement('span');
        desc.style.cssText = 'font-size:12px; color:var(--text-muted); width:120px;';
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

    // 3. Детальный разбор позиций
    const positionsTitle = document.createElement('h2');
    positionsTitle.textContent = 'Разбор позиций и пар';
    positionsTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;';
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
        meaning.textContent = pos.meaning;
        meaning.style.color = 'var(--text)';

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

    // 4. Устойчивость
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

    // --- Блок "отвергаемые" ---
    const rejTitle = document.createElement('h2');
    rejTitle.textContent = 'Отвергаемые';
    rejTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;color:var(--text);';
    resultContent.appendChild(rejTitle);

    result.rejected.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'result-item';

        const sw = document.createElement('div');
        sw.className = 'result-swatch';
        sw.style.background = COLOR_MAP[item.color].hex;

        const text = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'result-name';
        name.textContent = COLOR_MAP[item.color].name;

        const desc = document.createElement('div');
        desc.className = 'result-desc';
        desc.textContent = item.text;

        text.appendChild(name);
        text.appendChild(desc);
        itemEl.appendChild(sw);
        itemEl.appendChild(text);
        resultContent.appendChild(itemEl);
    });

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
    // +++ Группа (явное предпочтение)
    '1+2': 'Чувство удовлетворенности, спокойствия, стремление к спокойной обстановке, нежелание участвовать в конфликтах.',
    '1+3': 'Гармоничный баланс между потребностью в покое и активной деятельностью.',
    '1+4': 'Стремление к зависимости от среды, потребность в поддержке и понимании.',
    '2+3': 'Автономность, самостоятельность в принятии решений, инициативность.',
    '2+4': 'Стремление к самоутверждению через активную деятельность и достижение целей.',
    '3+4': 'Направленность вовне, потребность активно действовать и добиваться успеха.',
    
    // Сочетания с дополнительными цветами
    '1+5': 'Тонкая эмоциональность, романтичность, потребность в глубоких привязанностях.',
    '1+0': 'Потребность в уединении и тишине, возможна усталость от общения.',
    '2+7': 'Стремление к самоутверждению через независимость и контроль.',
    '3+7': 'Сильная энергия, возможно, протестное поведение, готовность отстаивать позицию.',
    '4+5': 'Мечтательность с оптимизмом, потребность в признании и переменах.',
    '4+0': 'Стремление к оптимизму на фоне усталости, возможна скрытая тревога.',
    
    // Сочетания дополнительных цветов
    '5+6': 'Потребность в утонченном комфорте и эстетике, тонкая чувствительность.',
    '6+7': 'Стремление к комфорту и независимости одновременно.',
    '0+7': 'Ярко выраженная потребность в уединении или протест, желание отгородиться.'
};

    
    // --- Итоговая сводка ---
    const summary = document.createElement('div');
    summary.className = 'result-summary';
    const stability = result.matches >= 6
        ? 'Высокая устойчивость предпочтений — выбор стабилен.'
        : result.matches >= 3
            ? 'Умеренная устойчивость — настроение относительно стабильно.'
            : 'Выбор был спонтанным — возможно, вы в состоянии перемен.';
    summary.innerHTML = `<strong>Совпадение двух проходов:</strong> ${result.matches} из 8 позиций. ${stability}`;
    resultContent.appendChild(summary);
}

// ============ История ============
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
        // Храним максимум 20 записей
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

// ============ Обработчики ============
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

// Обновление meta theme-color под системную тему
if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
        document.querySelector('meta[name="theme-color"]')
            .setAttribute('content', mq.matches ? '#0d0d0f' : '#f5f5f7');
    };
    updateTheme();
    mq.addEventListener('change', updateTheme);
}
