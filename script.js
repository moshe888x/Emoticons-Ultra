// ===================================
// Data Arrays
// ===================================
const PARTS = {
  leftArms: [
    "(", "（", "╰(", "(づ", "(っ", "(ﾉ", "ヽ(", "ʕ", "ヾ", "ε", "٩(", 
    "(*", "ヽ(", "(⌒", "╭(", "༼", "ᕦ(", "ᕤ(", "⊂(", "⊃(", "ლ("
  ],
  rightArms: [
    ")", "）", ")╯", ")づ", ")っ", ")ﾉ", ")ノ", "ʔ", "ﾉ", "٩)", 
    "(*", ")⌒", ")╮", "༽", "ᕥ)", "ᕠ)", "⊂)", "⊃)", "ლ)"
  ],
  eyes: [
    "☉", "^", "°", "•", "¬", "ಠ", "´", "x", "X", "T", "ಥ", "⊙", 
    "♥", "❤", "♡", "✿", "☆", "◕", "•", "o", "u", "◉", "∪", "⌒", 
    "∘", "⌣", "｡", "☼", "◕", "◔", "✧", "✿"
  ],
  mouths: [
    "‿", "_", "o", "O", "ω", "﹏", "△", "∀", "3", "︿", "Д", "皿", 
    "益", "д", "ε", "з", "v", "▾", "ᗝ", "□", "╯", "~", "3", "ω", 
    "v", "▽", "∇"
  ],
  cheeks: [
    "///", "｀", "´", "♥", "♡", "✿", "o", "｡", "°", "*", ".", "~", 
    "ღ", "❁", "✿", "°"
  ],
  extras: [
    "☆", "♥", "♡", "✿", "★", "♪", "♫", "!!", "~", "☆ﾟ.*･｡ﾟ", "ノ", 
    "(っ˘з(˘⌣˘ )", "!", "?", "^.^", "❀", "✪", "❀", "✦", "✩", "✷", "✸", "✹"
  ]
};

// ===================================
// DOM Elements
// ===================================
const elements = {
  output: document.getElementById('output'),
  toast: document.getElementById('toast'),
  singleSymbolMode: document.getElementById('singleSymbolMode'),
  leftArm: document.getElementById('leftArm'),
  rightArm: document.getElementById('rightArm'),
  eyes: document.getElementById('eyes'),
  mouth: document.getElementById('mouth'),
  cheeks: document.getElementById('cheeks'),
  extra: document.getElementById('extra'),
  bulkCount: document.getElementById('bulkCount'),
  bulkOutput: document.getElementById('bulkOutput'),
  surpriseBtn: document.getElementById('surpriseBtn'),
  copyBtn: document.getElementById('copyBtn'),
  generateBulkBtn: document.getElementById('generateBulkBtn'),
  copyAllBtn: document.getElementById('copyAllBtn')
};

// ===================================
// Utility Functions
// ===================================
function getRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function showToast(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.className = `toast show${isError ? ' error' : ''}`;
  setTimeout(() => {
    elements.toast.className = 'toast';
  }, 2000);
}

async function copyToClipboard(text) {
  if (!text) {
    showToast('Nothing to copy!', true);
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// ===================================
// Emoticon Generation
// ===================================
function generateEmoticonString(useRandom = false) {
  const singleMode = elements.singleSymbolMode.checked;

  // Single symbol mode - only show extra
  if (singleMode) {
    return useRandom 
      ? getRandom(PARTS.extras) 
      : (elements.extra.value || "");
  }

  // Full Emoticon mode
  const parts = {
    leftArm: useRandom ? getRandom(PARTS.leftArms) : (elements.leftArm.value || ""),
    eyes: useRandom ? getRandom(PARTS.eyes) : (elements.eyes.value || ""),
    mouth: useRandom ? getRandom(PARTS.mouths) : (elements.mouth.value || ""),
    cheeks: useRandom ? getRandom(PARTS.cheeks) : (elements.cheeks.value || ""),
    rightArm: useRandom ? getRandom(PARTS.rightArms) : (elements.rightArm.value || ""),
    extra: useRandom ? getRandom(PARTS.extras) : (elements.extra.value || "")
  };

  // Build Emoticon: leftArm + eyes + cheeks + mouth + cheeks + eyes + rightArm + extra
  let Emoticon = "";
  if (parts.leftArm) Emoticon += parts.leftArm;
  if (parts.eyes) Emoticon += parts.eyes;
  if (parts.cheeks) Emoticon += parts.cheeks;
  if (parts.mouth) Emoticon += parts.mouth;
  if (parts.cheeks) Emoticon += parts.cheeks;
  if (parts.eyes) Emoticon += parts.eyes;
  if (parts.rightArm) Emoticon += parts.rightArm;
  if (parts.extra) Emoticon += parts.extra;

  return Emoticon;
}

function updateOutput(shouldAnimate = true) {
  const Emoticon = generateEmoticonString(false);
  elements.output.textContent = Emoticon;

  if (shouldAnimate) {
    elements.output.classList.add('pop');
    setTimeout(() => elements.output.classList.remove('pop'), 120);
  }
}

// ===================================
// Select Population
// ===================================
function populateSelect(selectElement, options) {
  selectElement.innerHTML = '';

  // Add "None" option
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.textContent = 'None';
  selectElement.appendChild(noneOption);

  // Add all options
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });
}

// ===================================
// Event Handlers
// ===================================
function handleSurpriseMe() {
  const Emoticon = generateEmoticonString(true);
  elements.output.textContent = Emoticon;
  elements.output.classList.add('pop');
  setTimeout(() => elements.output.classList.remove('pop'), 120);
}

async function handleCopy() {
  const text = elements.output.textContent;
  const success = await copyToClipboard(text);
  if (success) {
    showToast('Copied to clipboard! ✓');
  } else {
    showToast('Failed to copy', true);
  }
}

function handleGenerateBulk() {
  const count = Math.max(1, Math.min(1000, parseInt(elements.bulkCount.value) || 100));
  elements.bulkOutput.innerHTML = '';

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const Emoticon = generateEmoticonString(true);
    const span = document.createElement('span');

    span.textContent = Emoticon;
    span.className = 'Emoticon-item';
    span.tabIndex = 0;
    span.role = 'button';
    span.setAttribute('aria-label', `Select emoticon ${Emoticon}`);

    const selectEmoticon = () => {
      elements.output.textContent = Emoticon;
      elements.output.classList.add('pop');
      setTimeout(() => elements.output.classList.remove('pop'), 120);
      showToast('Selected!');
    };

    span.addEventListener('click', selectEmoticon);
    span.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectEmoticon();
      }
    });

    fragment.appendChild(span);
  }

  elements.bulkOutput.appendChild(fragment);
}

async function handleCopyAll() {
  const items = Array.from(elements.bulkOutput.children);
  
  if (items.length === 0) {
    showToast('Generate emoticons first!', true);
    return;
  }

  const allText = items.map(item => item.textContent).join('\n');
  const success = await copyToClipboard(allText);
  
  if (success) {
    showToast('All emoticons copied! ✓');
  } else {
    showToast('Failed to copy', true);
  }
}

// ===================================
// Initialization
// ===================================
function init() {
  // Populate all select elements
  populateSelect(elements.leftArm, PARTS.leftArms);
  populateSelect(elements.rightArm, PARTS.rightArms);
  populateSelect(elements.eyes, PARTS.eyes);
  populateSelect(elements.mouth, PARTS.mouths);
  populateSelect(elements.cheeks, PARTS.cheeks);
  populateSelect(elements.extra, PARTS.extras);

  // Add event listeners to selects for auto-update
  const selectElements = [
    elements.leftArm,
    elements.rightArm,
    elements.eyes,
    elements.mouth,
    elements.cheeks,
    elements.extra
  ];

  selectElements.forEach(select => {
    select.addEventListener('change', () => updateOutput(true));
  });

  // Add event listener for single symbol mode
  elements.singleSymbolMode.addEventListener('change', () => updateOutput(true));

  // Add button event listeners
  elements.surpriseBtn.addEventListener('click', handleSurpriseMe);
  elements.copyBtn.addEventListener('click', handleCopy);
  elements.generateBulkBtn.addEventListener('click', handleGenerateBulk);
  elements.copyAllBtn.addEventListener('click', handleCopyAll);

  // Initial render
  updateOutput(false);
}

// Start the app
init();
