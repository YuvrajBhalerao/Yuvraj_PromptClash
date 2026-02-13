const textInput = document.getElementById('textInput');
const fileInput = document.getElementById('fileInput');

const wordCountDisplay = document.getElementById('wordCount');
const charCountDisplay = document.getElementById('charCount');
const readTimeDisplay = document.getElementById('readTime');
const keywordsDisplay = document.getElementById('topKeywords');

// --- 1. Event Listener: Typing ---
textInput.addEventListener('input', () => {
    analyzeText(textInput.value);
});

// --- 2. Event Listener: File Upload ---
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use the FileReader API to read the text content
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const content = e.target.result;
        textInput.value = content; // Put text into the box
        analyzeText(content);      // Run the analysis immediately
    };

    reader.readAsText(file);
});

// --- 3. The Core Logic Function ---
function analyzeText(text) {
    // Character Count
    charCountDisplay.textContent = text.length;

    // Word Count
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    wordCountDisplay.textContent = wordCount;

    // Reading Time Logic
    const wordsPerSecond = 225 / 60; 
    const totalSeconds = Math.ceil(wordCount / wordsPerSecond);

    if (wordCount === 0) {
        readTimeDisplay.textContent = "0s";
    } else if (totalSeconds < 60) {
        readTimeDisplay.textContent = totalSeconds + "s";
    } else if (totalSeconds < 3600) {
        const minutes = Math.ceil(totalSeconds / 60);
        readTimeDisplay.textContent = minutes + "m";
    } else {
        const hours = Math.floor(totalSeconds / 3600);
        const remainingMinutes = Math.ceil((totalSeconds % 3600) / 60);
        readTimeDisplay.textContent = hours + "h " + remainingMinutes + "m";
    }

    // Keyword Logic
    if (words.length === 0) {
        keywordsDisplay.innerHTML = '<span style="color: #94a3b8; font-style: italic;">Waiting for text...</span>';
        return;
    }

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
        keywordsDisplay.innerHTML = '<span style="color: #94a3b8;">No long words found...</span>';
    } else {
        keywordsDisplay.innerHTML = sortedWords
            .map(([word, count]) => `<span class="tag">${word} (${count})</span>`)
            .join('');
    }
}
