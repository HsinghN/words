// Path to your SQLite database file
const DB_PATH = './database.sqlite';

// Global variable for the database
let db = null;

// Initialize the database
async function initDatabase() {
    try {
        const SQL = await initSqlJs({ locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}` });
        const response = await fetch(DB_PATH);
        const buffer = await response.arrayBuffer();
        db = new SQL.Database(new Uint8Array(buffer));
        console.log('Database loaded successfully.');
    } catch (error) {
        console.error('Error initializing database:', error);
        alert('Error initializing database. Please check the console for details.');
    }
}

// Search for words in the database
async function searchWords(query) {
    try {
        if (db === null) {
            throw new Error('Database is not initialized');
        }

        const results = db.exec(`
            SELECT word_id, original_word
            FROM words
            WHERE unicode_word LIKE $query OR transliterated_word LIKE $query
            ORDER BY unicode_word COLLATE NOCASE                                          
        `, { $query: `${query}%` });

        const wordListDiv = document.getElementById('word-list');
        wordListDiv.innerHTML = ''; // Clear the list

        if (results.length > 0) {
            const words = results[0].values;

            // Create a table to display the results
            const table = document.createElement('table');

            // Create table header
            const headerRow = document.createElement('tr');
            const originalWordHeader = document.createElement('th');
            originalWordHeader.textContent = 'Original Word';
            headerRow.appendChild(originalWordHeader);
            table.appendChild(headerRow);

            // Create table rows for each word
            words.forEach(word => {
                const wordId = word[0];
                const originalWord = word[1];

                const row = document.createElement('tr');
                const originalWordCell = document.createElement('td');
                originalWordCell.textContent = originalWord;
                originalWordCell.classList.add('original-word');
                originalWordCell.addEventListener('click', () => displayStatistics(wordId, originalWord));

                row.appendChild(originalWordCell);
                table.appendChild(row);
            });

            wordListDiv.appendChild(table);
        } else {
            wordListDiv.innerHTML = '<p>No matching words found.</p>';
        }
    } catch (error) {
        console.error('Error searching words:', error);
        document.getElementById('word-list').innerHTML = '<p>Error searching words. Please check the console for details.</p>';
    }
}

// Initialize the database on page load
initDatabase();
