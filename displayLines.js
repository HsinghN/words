// Display lines containing the word
function displayLines(linesContainingWord, originalWord) {
    const linesContainer = document.getElementById('lines');
    linesContainer.innerHTML = `<h3>Lines Containing "${originalWord}"</h3>`;
    
    const linesTable = document.createElement('table');
    linesContainingWord.forEach(line => {
        const row = document.createElement('tr');
        const lineCell = document.createElement('td');
        lineCell.textContent = line[0];
        lineCell.classList.add('gurmukhi-text'); // Add class for font styling
        row.appendChild(lineCell);
        linesTable.appendChild(row);

        // Log Line ID to console for debugging
        console.log(`Line: ${line[0]}`);
    });
    linesContainer.appendChild(linesTable);
}
