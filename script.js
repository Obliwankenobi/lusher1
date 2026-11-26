// 8 цветов теста Люшера
const COLORS = [
    { id: 'blue',      hex: '#1E3F8C', name: 'Тёмно-синий' },
    { id: 'green',     hex: '#2E7D4F', name: 'Зелёный' },
    { id: 'red',       hex: '#E32219', name: 'Красный' },
    { id: 'yellow',    hex: '#F2C200', name: 'Жёлтый' },
    { id: 'violet',    hex: '#6B2C91', name: 'Фиолетовый' },
    { id: 'brown',     hex: '#6B4226', name: 'Коричневый' },
    { id: 'black',     hex: '#1A1A1A', name: 'Чёрный' },
    { id: 'gray',      hex: '#8C8C8C', name: 'Серый' },
];

// Интерпретации (упрощённые, по первой позиции)
const INTERPRETATIONS = {
    blue:     'Спокойствие, гармония, потребность в покое и стабильности.',
    green:    'Настойчивость, воля, стремление к самоутверждению.',
    red:      'Активность, энергия, возбуждение, желание действовать.',
    yellow:   'Оптимизм, надежда, потребность в переменах и общении.',
    violet:   'Творчество, мечтательность, потребность в одобрении.',
    brown:    'Потребность в комфорте, безопасности, уюте.',
    black:    'Независимость, протест, стремление к контролю.',
    gray:     'Нейтральность, уединение, стремление отгородиться.',
};

// Состояние
let currentRound = 0;        // 0 и 1 (два прохода)
let remaining = [];          // доступные цвета в текущем раунде
let currentOrder = [];       // выбранные в текущем раунде
let roundsResults = [];      // результаты обоих раундов
let colorPool = [];          // исходная перестановка для обоих раундов

// DOM
const introScreen = document.getElementById('intro-screen');
const testScreen = document.getElementById('test-screen');
const resultScreen = document.getElementById('result-screen');
const colorsGrid = document.getElementById('colors-grid');
const selectionPreview = document.getElementById('selection-preview');
const instruction = document.getElementById('instruction');
const roundInfo = document.getElementById('round-info');
const resultContent = document.getElementById('result-content');

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startTest() {
    currentRound = 0;
    roundsResults = [];
    colorPool = shuffle(COLORS);
    startRound();
    showScreen(testScreen);
}

function startRound() {
    // Во втором раунде цвета идут в том же порядке, что и в первом
    remaining = colorPool.map(c => c.id);
    currentOrder = [];
    render();
}

function render() {
    roundInfo.textContent = `Раунд ${currentRound + 1} из 2`;
    instruction.textContent = currentOrder.length === 0
        ? 'Выберите самый приятный цвет'
        : currentOrder.length < 7
            ? 'Выберите следующий по приятности'
            : 'Выберите последний оставшийся цвет';

    colorsGrid.innerHTML = '';
    remaining.forEach(id => {
        const color = COLORS.find(c => c.id === id);
        const tile = document.createElement('div');
        tile.className = 'color-tile';
        tile.style.background = color.hex;
        tile.dataset.id = id;

        const order = currentOrder.indexOf(id);
        if (order !== -1) {
            tile.classList.add('selected');
            const badge = document.createElement('span');
            badge.className = 'order-badge';
            badge.textContent = order + 1;
            tile.appendChild(badge);
        } else {
            tile.addEventListener('click', () => selectColor(id));
        }

        colorsGrid.appendChild(tile);
    });

    // Превью выбора
    selectionPreview.innerHTML = '';
    currentOrder.forEach(id => {
        const color = COLORS.find(c => c.id === id);
        const dot = document.createElement('div');
        dot.className = 'preview-dot';
        dot.style.background = color.hex;
        selectionPreview.appendChild(dot);
    });
}

function selectColor(id) {
    if (currentOrder.includes(id)) return;
    currentOrder.push(id);

    if (currentOrder.length === 8) {
        // Раунд завершён
        roundsResults.push([...currentOrder]);
        currentRound++;

        if (currentRound < 2) {
            setTimeout(() => {
                startRound();
            }, 400);
        } else {
            setTimeout(showResults, 400);
        }
    } else {
        render();
    }
}

function showResults() {
    // Основной результат — первый раунд (по классике)
    const mainOrder = roundsResults[0];

    resultContent.innerHTML = '';

    const intro = document.createElement('p');
    intro.textContent = 'Ваш порядок предпочтений (первый выбор):';
    intro.style.marginBottom = '16px';
    resultContent.appendChild(intro);

    mainOrder.forEach((id, index) => {
        const color = COLORS.find(c => c.id === id);
        const item = document.createElement('div');
        item.className = 'result-item';

        const swatch = document.createElement('div');
        swatch.className = 'result-swatch';
        swatch.style.background = color.hex;

        const text = document.createElement('div');
        const name = document.createElement('div');
        name.className = 'result-name';
        name.textContent = `${index + 1}. ${color.name}`;

        const desc = document.createElement('div');
        desc.className = 'result-desc';
        // Интерпретация осмысленна для первых 4 позиций
        desc.textContent = index < 4
            ? INTERPRETATIONS[id]
            : 'Наименее предпочитаемый цвет.';

        text.appendChild(name);
        text.appendChild(desc);

        item.appendChild(swatch);
        item.appendChild(text);
        resultContent.appendChild(item);
    });

    // Совпадение двух раундов (показатель устойчивости)
    const second = roundsResults[1];
    const matches = mainOrder.reduce(
        (acc, id, i) => acc + (second[i] === id ? 1 : 0), 0
    );
    const stability = document.createElement('p');
    stability.style.marginTop = '20px';
    stability.style.fontSize = '14px';
    stability.style.color = '#666';
    stability.textContent = `Совпадение двух выборов: ${matches} из 8 позиций. ` +
        (matches >= 6
            ? 'Высокая устойчивость предпочтений.'
            : matches >= 3
                ? 'Умеренная устойчивость.'
                : 'Выбор был спонтанным — возможно, вы находитесь в состоянии перемен.');

    resultContent.appendChild(stability);
    showScreen(resultScreen);
}

// Обработчики
document.getElementById('start-btn').addEventListener('click', startTest);
document.getElementById('restart-btn').addEventListener('click', () => {
    showScreen(introScreen);
});