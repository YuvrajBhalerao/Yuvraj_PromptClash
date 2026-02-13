const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');

// Select all display elements
const wordCountDisplay = document.getElementById('wordCount');
const charCountDisplay = document.getElementById('charCount');
const readTimeDisplay = document.getElementById('readTime');
const paragraphCountDisplay = document.getElementById('paragraphCount');
const lineCountDisplay = document.getElementById('lineCount');
const pageCountDisplay = document.getElementById('pageCount');
const keywordsDisplay = document.getElementById('topKeywords');

// --- 1. Event Listener: Typing ---
textInput.addEventListener('input', () => {
    analyzeText(textInput.value);
});

// --- 2. Event Listener: File Upload ---
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        textInput.value = content; 
        analyzeText(content);      
    };
    reader.readAsText(file);
});

// --- 3. The Core Logic Function ---
function analyzeText(text) {
    if (!text) {
        // Reset everything if empty
        wordCountDisplay.textContent = 0;
        charCountDisplay.textContent = 0;
        readTimeDisplay.textContent = "0s";
        paragraphCountDisplay.textContent = 0;
        lineCountDisplay.textContent = 0;
        pageCountDisplay.textContent = 0;
        keywordsDisplay.innerHTML = '<span style="color: rgba(255,255,255,0.3);">Waiting for content...</span>';
        return;
    }

    // 1. Character Count
    charCountDisplay.textContent = text.length.toLocaleString();

    // 2. Word Count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    wordCountDisplay.textContent = wordCount.toLocaleString();

    // 3. Reading Time (Standard: 225 wpm)
    const wordsPerSecond = 225 / 60; 
    const totalSeconds = Math.ceil(wordCount / wordsPerSecond);
    
    if (totalSeconds < 60) {
        readTimeDisplay.textContent = totalSeconds + "s";
    } else if (totalSeconds < 3600) {
        const minutes = Math.ceil(totalSeconds / 60);
        readTimeDisplay.textContent = minutes + "m";
    } else {
        const hours = Math.floor(totalSeconds / 3600);
        const remainingMinutes = Math.ceil((totalSeconds % 3600) / 60);
        readTimeDisplay.textContent = hours + "h " + remainingMinutes + "m";
    }

    // 4. Paragraph Count (Splits by newlines, ignores empty lines)
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    paragraphCountDisplay.textContent = paragraphs.length;

    // 5. Line Count (Raw newlines)
    const lines = text.split(/\n/);
    lineCountDisplay.textContent = lines.length;

    // 6. Approx Pages (Standard A4: ~300 words)
    const pages = Math.ceil(wordCount / 300);
    pageCountDisplay.textContent = pages;

    // --- Keyword Logic ---
    const frequency = {};
    words.forEach(word => {
        const cleanWord = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleanWord.length > 4) {
            frequency[cleanWord] = (frequency[cleanWord] || 0) + 1;
        }
    });

    const sortedWords = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    if (sortedWords.length === 0) {
        keywordsDisplay.innerHTML = '<span style="color: rgba(255,255,255,0.3);">No keywords found...</span>';
    } else {
        keywordsDisplay.innerHTML = sortedWords
            .map(([word, count]) => `<span class="tag">${word} (${count})</span>`)
            .join('');
    }
}
