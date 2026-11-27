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

const POSITION_DESCRIPTIONS = [
    'Средство достижения цели (как вы действуете)',
    'Цель, к которой вы стремитесь',
    'Истинная ситуация (ваше реальное состояние)',
    'Образ действий, который подсказывает ситуация',
    'Безразличие / нейтральное отношение',
    'Безразличие / резервная трактовка',
    'Негативное отношение / источник стресса',
    'Стремление подавить потребность'
];

const COLOR_PSYCHOLOGY = {
    'blue':   'потребность в спокойствии, эмоциональной стабильности и глубокой привязанности',
    'green':  'потребность в самоутверждении, независимости и волевом контроле',
    'red':    'потребность в активном действии, достижении успеха и эмоциональной разрядке',
    'yellow': 'потребность в переменах, надежде на лучшее и общении',
    'violet': 'потребность в одобрении, творческом самовыражении и идеализме',
    'brown':  'потребность в физическом комфорте, безопасности и снятии напряжения',
    'black':  'потребность в независимости, протесте или отказе от давления извне',
    'gray':   'потребность в уединении, нейтралитете и отдыхе от обязательств'
};

const FULL_PAIR_TABLE = {
    '1+2': 'Чувство удовлетворенности, спокойствия, стремление к спокойной обстановке, нежелание участвовать в конфликтах.',
    '1+3': 'Гармоничный баланс между потребностью в покое и активной деятельностью.',
    '1+4': 'Стремление к зависимости от среды, потребность в поддержке и понимании.',
    '1+5': 'Тонкая эмоциональность, романтичность, потребность в глубоких привязанностях.',
    '1+6': 'Потребность в комфорте и защите не является главной.',
    '1+7': 'Стремление к независимости и контролю не является ведущим.',
    '1+0': 'Потребность в уединении и тишине, возможна усталость от общения.',
    '2+3': 'Автономность, самостоятельность в принятии решений, инициативность.',
    '2+4': 'Стремление к самоутверждению через активную деятельность и достижение целей.',
    '2+5': 'Стремление к признанию через творчество не является главным.',
    '2+6': 'Уверенность и комфорт не являются ведущими потребностями.',
    '2+7': 'Стремление к самоутверждению через независимость и контроль.',
    '2+0': 'Сдержанная настойчивость не актуальна.',
    '3+4': 'Направленность вовне, потребность активно действовать и добиваться успеха.',
    '3+5': 'Энергичность с творческим началом не актуальна.',
    '3+6': 'Активность ради комфорта не является главной.',
    '3+7': 'Сильная энергия, возможно, протестное поведение, готовность отстаивать позицию.',
    '3+0': 'Стремление действовать на фоне усталости не актуально.',
    '4+5': 'Мечтательность с оптимизмом, потребность в признании и переменах.',
    '4+6': 'Желание перемен с потребностью в стабильности не актуально.',
    '4+7': 'Стремление к переменам с независимостью не является главным.',
    '4+0': 'Стремление к оптимизму на фоне усталости не актуально.',
    '5+6': 'Потребность в утонченном комфорте и эстетике, тонкая чувствительность.',
    '5+7': 'Стремление к признанию и независимости не является главным.',
    '5+0': 'Мечтательность с уходом от реальности не актуальна.',
    '6+7': 'Стремление к комфорту и независимости одновременно.',
    '6+0': 'Потребность в отдыхе и расслаблении не является ведущей.',
    '7+0': 'Ярко выраженная потребность в уединении или протест, желание отгородиться.'
};

const ANXIETY_MEANINGS = {
    'blue': 'Неудовлетворенность эмоциональными отношениями, потребность в покое не удовлетворена.',
    'green': 'Ощущение препятствия к самореализации, нехватка волевого усилия или усталость от борьбы.',
    'red': 'Истощение сил, переутомление, неудовлетворенность активностью.',
    'yellow': 'Разочарование, ощущение пустоты, нехватка общения и положительных эмоций.'
};

const COMPENSATION_MEANINGS = {
    'gray': 'Компенсация через уход от реальности, пассивность, желание отгородиться от проблем.',
    'brown': 'Компенсация через поиск комфорта, безопасности, физического расслабления.',
    'black': 'Компенсация через протест, негативизм, отказ от взаимодействия с миром.'
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

// ============ НАВИГАЦИЯ И УТИЛИТЫ ============
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

function getFunctionalGroups(order) {
    return {
        '++': [order[0], order[1]],
        'xx': [order[2], order[3]],
        '==': [order[4], order[5]],
        '--': [order[6], order[7]]
    };
}

function getDetailedPositionText(index, colorId) {
    const color = COLOR_MAP[colorId];
    const cName = color.name.toLowerCase();
    const psych = COLOR_PSYCHOLOGY[colorId];
    const isMain = color.type === 'main';

    if (index === 0) {
        return `Средство достижения цели. Для реализации задуманного вы используете ${cName} цвет. Это значит, что в основе вашего способа действий лежит ${psych}. Вы подсознательно стремитесь действовать именно так, чтобы чувствовать себя уверенно.`;
    }
    if (index === 1) {
        return `Цель, к которой вы стремитесь. В данный момент вы хотите достичь состояния, которое ассоциируется у вас с ${cName} цветом. Ваша главная мотивация — удовлетворить ${psych}. Это то, чего вам не хватает для полного ощущения гармонии.`;
    }
    if (index === 2 || index === 3) {
        return `Истинная ситуация и реальное состояние. Сложившиеся обстоятельства или ваше текущее положение дел характеризуются ${cName} цветом. Вы ощущаете в этой ситуации ${psych}. Это отражает то, как вы на самом деле переживаете происходящее, независимо от своих планов.`;
    }
    if (index === 4 || index === 5) {
        return `Безразличие и нейтральное отношение. ${color.name} цвет находится в резерве. Это означает, что ${psych} в данный момент не является для вас актуальной или вы сознательно откладываете реализацию этой потребности как нецелесообразную.`;
    }
    if (index === 6) {
        return `Источник стресса и негативное отношение. Вы отвергаете ${cName} цвет, что указывает на подавление соответствующей потребности. Ситуация, связанная с ${psych}, вызывает напряжение, и вы вынуждены сдерживать эти стремления, так как их открытое проявление сейчас невыгодно.`;
    }
    if (index === 7) {
        return `Стремление подавить потребность. ${color.name} цвет на последнем месте означает категорическое неприятие. Вы пытаетесь полностью вытеснить из своего сознания ${psych}${isMain ? ', хотя это одна из ваших базовых потребностей, что создаёт внутренний конфликт' : ''}. Данная сфера жизни заблокирована.`;
    }
    return '';
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
function buildResult(rounds) {
    const main = rounds[0];
    const second = rounds[1];
    const groups = getFunctionalGroups(main);

    // 1. Расчет ОАН
    const autogenicNorm = ['blue', 'green', 'red', 'yellow', 'violet', 'brown', 'gray', 'black'];
    let anScore = 0;
    main.forEach((id, index) => {
        const normIndex = autogenicNorm.indexOf(id);
        if (normIndex !== -1) anScore += Math.abs(normIndex - index);
    });

    // 2. Расчет ВК
    const greenPos = main.indexOf('green');
    const redPos = main.indexOf('red');
    const vkScore = (18 - greenPos - redPos) / (18 + greenPos + redPos);

    // 3. Анализ тревог и компенсаций
    let anxietyScore = 0;
    let anxietySources = [];
    main.forEach((id, index) => {
        const color = COLOR_MAP[id];
        if (color.type === 'main' && index >= 5) {
            const pos = index + 1;
            const marks = pos === 6 ? 1 : pos === 7 ? 2 : 3;
            anxietyScore += marks;
            anxietySources.push({
                name: color.name,
                pos: pos,
                marks: '!'.repeat(marks),
                meaning: ANXIETY_MEANINGS[id]
            });
        }
    });

    let compScore = 0;
    let compSource = null;
    main.slice(0, 3).forEach((id, index) => {
        const color = COLOR_MAP[id];
        if (['gray', 'brown', 'black'].includes(id)) {
            const pos = index + 1;
            const marks = pos === 3 ? 1 : pos === 2 ? 2 : 3;
            if (marks > compScore) {
                compScore = marks;
                compSource = {
                    name: color.name,
                    pos: pos,
                    marks: '!'.repeat(marks),
                    meaning: COMPENSATION_MEANINGS[id]
                };
            }
        }
    });

    // 4. Оценка состояния
    let stressText = 'Устойчивость к стрессу: Высокая.';
    if (anScore > 20) stressText = 'Устойчивость к стрессу: Низкая (высокое нервно-психическое напряжение).';
    else if (anScore > 10) stressText = 'Устойчивость к стрессу: Средняя (умеренное напряжение).';

    let energyText = 'Энергетический баланс: Оптимальный.';
    if (vkScore < 0.5) energyText = 'Энергетический баланс: Хроническое переутомление, истощение.';
    else if (vkScore < 1) energyText = 'Энергетический баланс: Компенсируемое утомление.';
    else if (vkScore > 1.5) energyText = 'Энергетический баланс: Перевозбуждение, активная мобилизация сил.';

    // 5. Подробный разбор позиций
    const positions = main.map((id, index) => {
        return {
            position: index + 1,
            color: COLOR_MAP[id],
            title: POSITION_DESCRIPTIONS[index],
            detailedText: getDetailedPositionText(index, id)
        };
    });

    // 6. Пары для отображения в таблице
    const pairsList = [];
    for (let i = 0; i < 8; i += 2) {
        const pairIds = [main[i], main[i + 1]];
        const pairKey = [COLOR_MAP[main[i]].num, COLOR_MAP[main[i + 1]].num].sort((a,b)=>a-b).join('+');
        pairsList.push({
            ids: pairIds,
            key: pairKey,
            text: FULL_PAIR_TABLE[pairKey] || 'Нейтральное сочетание.'
        });
    }

    const matches = main.reduce((acc, id, i) => acc + (second[i] === id ? 1 : 0), 0);

    return {
        date: new Date().toISOString(),
        mainOrder: main,
        groups: groups,
        positions: positions,
        pairsList: pairsList,
        matches: matches,
        anxiety: { score: anxietyScore, sources: anxietySources },
        compensation: { score: compScore, source: compSource },
        metrics: {
            anScore: anScore,
            stressText: stressText,
            vkScore: vkScore.toFixed(2),
            energyText: energyText
        }
    };
}

function renderResult(result) {
    resultContent.innerHTML = '';

    // 1. Блок Количественных показателей
    const metricsBox = document.createElement('div');
    metricsBox.style.cssText = 'background:var(--bg); padding:16px; border-radius:12px; margin-bottom:24px; border-left:4px solid var(--primary);';
    
    const metricsTitle = document.createElement('div');
    metricsTitle.style.cssText = 'font-weight:bold; margin-bottom:12px; color:var(--primary); font-size:16px;';
    metricsTitle.textContent = 'Психофизиологические показатели';
    
    const anText = document.createElement('div');
    anText.style.cssText = 'font-size:14px; margin-bottom:8px; color:var(--text);';
    anText.innerHTML = `<strong>Отклонение от аутогенной нормы:</strong> ${result.metrics.anScore} <br><span style="color:var(--text-muted); font-size:13px;">${result.metrics.stressText}</span>`;
    
    const vkText = document.createElement('div');
    vkText.style.cssText = 'font-size:14px; color:var(--text);';
    vkText.innerHTML = `<strong>Вегетативный коэффициент:</strong> ${result.metrics.vkScore} <br><span style="color:var(--text-muted); font-size:13px;">${result.metrics.energyText}</span>`;

    metricsBox.appendChild(metricsTitle);
    metricsBox.appendChild(anText);
    metricsBox.appendChild(vkText);
    resultContent.appendChild(metricsBox);

    // 2. Функциональные группы
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

    // 3. Анализ тревог и компенсаций
    const analysisTitle = document.createElement('h2');
    analysisTitle.textContent = 'Тревоги и компенсации';
    analysisTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;color:var(--text);';
    resultContent.appendChild(analysisTitle);

    const anxietyBox = document.createElement('div');
    anxietyBox.style.cssText = 'background:var(--bg); padding:16px; border-radius:12px; margin-bottom:12px; border-left:4px solid var(--danger);';
    
    if (result.anxiety.score > 0) {
        const title = document.createElement('div');
        title.style.cssText = 'font-weight:bold; margin-bottom:8px; color:var(--danger);';
        title.textContent = `Тревога: ${result.anxiety.score} балл(ов)`;
        
        const list = document.createElement('ul');
        list.style.cssText = 'padding-left:20px; margin:0; font-size:14px; color:var(--text-muted);';
        
        result.anxiety.sources.forEach(s => {
            const li = document.createElement('li');
            li.style.marginBottom = '8px';
            li.innerHTML = `<strong>${s.name}</strong> на ${s.pos}-й позиции <span style="color:var(--danger);font-weight:bold;">${s.marks}</span><br><span style="font-size:13px;">${s.meaning}</span>`;
            list.appendChild(li);
        });
        anxietyBox.appendChild(title);
        anxietyBox.appendChild(list);
    } else {
        anxietyBox.innerHTML = '<div style="color:var(--text-muted);font-size:14px;">Явных признаков тревоги не обнаружено. Все основные цвета находятся в благоприятной зоне.</div>';
    }
    resultContent.appendChild(anxietyBox);

    if (result.compensation.score > 0) {
        const compBox = document.createElement('div');
        compBox.style.cssText = 'background:var(--bg); padding:16px; border-radius:12px; border-left:4px solid var(--primary);';
        
        const title = document.createElement('div');
        title.style.cssText = 'font-weight:bold; margin-bottom:8px; color:var(--primary);';
        title.textContent = `Компенсация: ${result.compensation.score} балл(ов)`;
        
        const desc = document.createElement('div');
        desc.style.cssText = 'font-size:14px; color:var(--text-muted);';
        const c = result.compensation.source;
        desc.innerHTML = `<strong>${c.name}</strong> на ${c.pos}-й позиции <span style="color:var(--primary);font-weight:bold;">${c.marks}</span><br><span style="font-size:13px;">${c.meaning}</span>`;
        
        compBox.appendChild(title);
        compBox.appendChild(desc);
        resultContent.appendChild(compBox);
    }

    // 4. Детальный разбор позиций
    const positionsTitle = document.createElement('h2');
    positionsTitle.textContent = 'Разбор позиций';
    positionsTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;color:var(--text);';
    resultContent.appendChild(positionsTitle);

    result.positions.forEach(pos => {
        const itemEl = document.createElement('div');
        itemEl.className = 'result-item';
        itemEl.style.flexDirection = 'column';
        itemEl.style.gap = '8px';

        // Заголовок позиции (свотч + название)
        const headerRow = document.createElement('div');
        headerRow.style.cssText = 'display:flex; align-items:center; gap:12px; width:100%;';

        const sw = document.createElement('div');
        sw.className = 'result-swatch';
        sw.style.background = pos.color.hex;
        sw.style.width = '32px';
        sw.style.height = '32px';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'result-name';
        titleDiv.style.fontSize = '15px';
        titleDiv.textContent = `${pos.position}. ${pos.title} (${pos.color.name})`;

        headerRow.appendChild(sw);
        headerRow.appendChild(titleDiv);

        // Подробный текст интерпретации
        const descText = document.createElement('div');
        descText.className = 'result-desc';
        descText.style.cssText = 'font-size:14px; line-height:1.6; color:var(--text-muted); padding-left:44px;';
        descText.textContent = pos.detailedText;

        itemEl.appendChild(headerRow);
        itemEl.appendChild(descText);
        resultContent.appendChild(itemEl);
    });

    // 5. Таблица всех пар (аккордеон)
    const accordion = document.createElement('details');
    accordion.className = 'pairs-accordion';
    
    const summary = document.createElement('summary');
    summary.textContent = 'Точная таблица интерпретаций пар';
    accordion.appendChild(summary);
    
    const pairsContent = document.createElement('div');
    pairsContent.className = 'pairs-content';
    
    result.pairsList.forEach(pair => {
        const entry = document.createElement('div');
        entry.className = 'pair-entry';
        
        const swatches = document.createElement('div');
        swatches.className = 'pair-swatches';
        pair.ids.forEach(id => {
            const sw = document.createElement('div');
            sw.className = 'pair-swatch';
            sw.style.background = COLOR_MAP[id].hex;
            swatches.appendChild(sw);
        });
        
        const textDiv = document.createElement('div');
        textDiv.className = 'pair-text';
        const colorNames = pair.ids.map(id => COLOR_MAP[id].name).join(' + ');
        textDiv.innerHTML = `<strong>${colorNames}:</strong> ${pair.text}`;
        
        entry.appendChild(swatches);
        entry.appendChild(textDiv);
        pairsContent.appendChild(entry);
    });
    
    accordion.appendChild(pairsContent);
    resultContent.appendChild(accordion);

    // 6. Устойчивость
    const stability = document.createElement('div');
    stability.className = 'result-summary';
    let stabilityText = 'Выбор был спонтанным — возможно, вы в состоянии перемен.';
    if (result.matches >= 6) {
        stabilityText = 'Высокая устойчивость предпочтений.';
    } else if (result.matches >= 3) {
        stabilityText = 'Умеренная устойчивость.';
    }
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

if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', mq.matches ? '#0d0d0f' : '#f5f5f7');
    };
    updateTheme();
    mq.addEventListener('change', updateTheme);
}