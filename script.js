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

// Уточнённые значения для каждой позиции (от 1 до 8)
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

// Интерпретации для зон предпочтения (++)
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

// Интерпретации для зон безразличия (==)
const INDIFFERENT_MEANINGS = {
    '1+1': 'Нейтральное отношение к покою и привязанности. Потребность в отдыхе временно отложена.',
    '1+2': 'Спокойствие и настойчивость сбалансированы, но не являются главными мотивами.',
    '1+3': 'Гармония между покоем и активностью не является основной потребностью в данный момент.',
    '1+4': 'Стремление к зависимости и поддержке не актуально или временно подавлено.',
    '1+5': 'Эмоциональная тонкость и романтичность не являются ведущими мотивами.',
    '1+6': 'Потребность в комфорте и защите не является главной.',
    '1+7': 'Стремление к независимости и контролю не является ведущим.',
    '1+0': 'Потребность в уединении не актуальна.',
    '2+2': 'Настойчивость и самоутверждение временно не являются главными.',
    '2+3': 'Автономность и инициативность не являются ведущими мотивами.',
    '2+4': 'Стремление к самоутверждению через деятельность не актуально.',
    '2+5': 'Стремление к признанию через творчество не является главным.',
    '2+6': 'Уверенность и комфорт не являются ведущими потребностями.',
    '2+7': 'Жёсткость и настойчивость не являются главными.',
    '2+0': 'Сдержанная настойчивость не актуальна.',
    '3+3': 'Активность и возбуждение временно не являются главными.',
    '3+4': 'Стремление к успеху и деятельности не является ведущим мотивом.',
    '3+5': 'Энергичность с творческим началом не актуальна.',
    '3+6': 'Активность ради комфорта не является главной.',
    '3+7': 'Готовность к протесту не является ведущей.',
    '3+0': 'Стремление действовать на фоне усталости не актуально.',
    '4+4': 'Оптимизм и надежда временно не являются ведущими.',
    '4+5': 'Мечтательность и оптимизм не являются главными.',
    '4+6': 'Желание перемен с потребностью в стабильности не актуально.',
    '4+7': 'Стремление к переменам с независимостью не является главным.',
    '4+0': 'Стремление к оптимизму на фоне усталости не актуально.',
    '5+5': 'Творчество и мечтательность временно не являются главными.',
    '5+6': 'Потребность в утончённом комфорте не актуальна.',
    '5+7': 'Стремление к признанию и независимости не является главным.',
    '5+0': 'Мечтательность с уходом от реальности не актуальна.',
    '6+6': 'Потребность в комфорте и безопасности временно не является главной.',
    '6+7': 'Стремление к комфорту и независимости не актуально.',
    '6+0': 'Потребность в отдыхе и расслаблении не является ведущей.',
    '7+7': 'Независимость и протест временно не являются главными.',
    '7+0': 'Потребность в уединении или протест не актуальны.',
    '0+0': 'Нейтральность и уединение не являются ведущими мотивами.'
};

// Интерпретации для зон отвержения (--)
const REJECTION_MEANINGS = {
    '1+1': 'Отвергается покой и привязанность. Возможна неудовлетворённость отношениями или потребность в переменах.',
    '1+2': 'Отвергается настойчивость и самоутверждение. Возможна неуверенность или усталость от борьбы.',
    '1+3': 'Отвергается активность и возбуждение. Возможна усталость, переутомление, потребность в отдыхе.',
    '1+4': 'Отвергается оптимизм и перемены. Возможна разочарованность, пессимизм.',
    '1+5': 'Отвергается потребность в признании. Возможно, признание сейчас неактуально или вызывает напряжение.',
    '1+6': 'Отвергается комфорт и безопасность. Возможна потребность в интенсивных переживаниях.',
    '1+7': 'Отвергается независимость и протест. Возможно, есть потребность в компромиссе или контроле.',
    '1+0': 'Отвергается нейтральность и уход. Возможна потребность в ярких впечатлениях и участии.',
    '2+2': 'Отвергается настойчивость и самоутверждение. Возможна неуверенность или усталость от борьбы.',
    '2+3': 'Отвергается автономность и инициативность. Возможно, вы чувствуете давление или нехватку самостоятельности.',
    '2+4': 'Отвергается стремление к самоутверждению. Возможно, вы не хотите брать на себя ответственность.',
    '2+5': 'Отвергается потребность в признании через творчество.',
    '2+6': 'Отвергается уверенность и комфорт. Возможно, вы ищете перемен или напряжения.',
    '2+7': 'Отвергается жёсткость и настойчивость. Возможно, вы устали от конфликтов.',
    '2+0': 'Отвергается сдержанная настойчивость.',
    '3+3': 'Отвергается активность и возбуждение. Возможна усталость, переутомление.',
    '3+4': 'Отвергается стремление к успеху. Возможно, вы не хотите брать на себя инициативу.',
    '3+5': 'Отвергается энергичность с творческим началом.',
    '3+6': 'Отвергается активность ради комфорта.',
    '3+7': 'Отвергается готовность к протесту. Возможно, вы ищете покоя.',
    '3+0': 'Отвергается стремление действовать на фоне усталости.',
    '4+4': 'Отвергается оптимизм и надежда. Возможна разочарованность.',
    '4+5': 'Отвергается мечтательность и оптимизм.',
    '4+6': 'Отвергается желание перемен с потребностью в стабильности.',
    '4+7': 'Отвергается стремление к переменам с независимостью.',
    '4+0': 'Отвергается стремление к оптимизму.',
    '5+5': 'Отвергается творчество и мечтательность.',
    '5+6': 'Отвергается потребность в утончённом комфорте.',
    '5+7': 'Отвергается стремление к признанию и независимости.',
    '5+0': 'Отвергается мечтательность с уходом от реальности.',
    '6+6': 'Отвергается потребность в комфорте и безопасности.',
    '6+7': 'Отвергается стремление к комфорту и независимости.',
    '6+0': 'Отвергается потребность в отдыхе и расслаблении.',
    '7+7': 'Отвергается независимость и протест.',
    '7+0': 'Отвергается потребность в уединении или протест.',
    '0+0': 'Отвергается нейтральность и уход.'
};

// Значения цветов для анализа тревог
const ANXIETY_MEANINGS = {
    'blue': 'Неудовлетворенность эмоциональными отношениями, потребность в покое не удовлетворена.',
    'green': 'Ощущение препятствия к самореализации, нехватка волевого усилия или усталость от борьбы.',
    'red': 'Истощение сил, переутомление, неудовлетворенность активностью.',
    'yellow': 'Разочарование, ощущение пустоты, нехватка общения и положительных эмоций.'
};

// Значения цветов для анализа компенсаций
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
function buildResult(rounds) {
    const main = rounds[0];
    const second = rounds[1];
    const groups = getFunctionalGroups(main);

    // Детальный разбор позиций и пар
    const positions = main.map((id, index) => {
        const color = COLOR_MAP[id];
        const posNum = index + 1;
        let pairText = '';

        if (index < 4) {
            // Для первых 4 позиций (зоны ++ и xx) используем PAIR_INTERPRETATIONS
            const pairId = [COLOR_MAP[main[index * 2]].num, COLOR_MAP[main[index * 2 + 1]].num].sort((a,b)=>a-b).join('+');
            pairText = PAIR_INTERPRETATIONS[pairId] || 'Нейтральное сочетание.';
        } else {
                   } else {
            // Для зон безразличия (==) и отвержения (--)
            // Если индекс 4 или 5, берем пару 4 и 5. Если 6 или 7, берем пару 6 и 7.
            const pairIndex = index < 6 ? 4 : 6; 
            const pairColors = [COLOR_MAP[main[pairIndex]], COLOR_MAP[main[pairIndex + 1]]];
            const pairKey = [pairColors[0].num, pairColors[1].num].sort((a,b)=>a-b).join('+');
            
            if (posNum <= 6) {
                pairText = INDIFFERENT_MEANINGS[pairKey] || 'Нейтральное сочетание.';
            } else {
                pairText = REJECTION_MEANINGS[pairKey] || 'Выраженное отвержение.';
            }
        }
        
        return {
            position: posNum,
            color: color,
            meaning: POSITION_DESCRIPTIONS[index],
            pairText: pairText
        };
    });

    // --- Анализ тревог и компенсаций ---
    let anxietyScore = 0;
    let anxietySources = [];
    
    // Проверка тревог (основные цвета на 6, 7, 8 позициях)
    main.forEach((id, index) => {
        const color = COLOR_MAP[id];
        if (color.type === 'main' && index >= 5) {
            const pos = index + 1; // 6, 7, 8
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

    // Проверка компенсаций (дополнительные цвета 0, 6, 7 на 1, 2, 3 позициях)
    main.slice(0, 3).forEach((id, index) => {
        const color = COLOR_MAP[id];
        if (['gray', 'brown', 'black'].includes(id)) {
            const pos = index + 1; // 1, 2, 3
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
    // -----------------------------------

    let conflictText = 'Основные потребности в целом удовлетворены.';
    if (anxietyScore > 0) {
        conflictText = `Обнаружена тревога (индекс: ${anxietyScore}). Основные потребности фрустрированы.`;
    }

    const matches = main.reduce((acc, id, i) => acc + (second[i] === id ? 1 : 0), 0);

    return {
        date: new Date().toISOString(),
        mainOrder: main,
        groups: groups,
        positions: positions,
        conflictText: conflictText,
        matches: matches,
        anxiety: { score: anxietyScore, sources: anxietySources },
        compensation: { score: compScore, source: compSource }
    };
}

function renderResult(result) {
    resultContent.innerHTML = '';

    // 1. Предупреждение о конфликте
    if (result.conflictText) {
        const warning = document.createElement('div');
        warning.className = 'result-summary';
        warning.style.borderLeft = '4px solid var(--primary)';
        warning.textContent = result.conflictText;
        resultContent.appendChild(warning);
    }

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

    // 3. Блок: Анализ тревог и компенсаций
    const analysisTitle = document.createElement('h2');
    analysisTitle.textContent = 'Анализ тревог и компенсаций';
    analysisTitle.style.cssText = 'font-size:18px;margin:24px 0 12px;color:var(--text);';
    resultContent.appendChild(analysisTitle);

    // Тревога
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

    // Компенсация
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

    // 5. Устойчивость
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
