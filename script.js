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
    const results = await db.exec(`
      SELECT id, word
      FROM words
      WHERE word LIKE '%${query}%'
      ORDER BY word COLLATE NOCASE
    `);

    const wordListDiv = document.getElementById('word-list');
    wordListDiv.innerHTML = ''; // Clear the list

    if (results.length > 0) {
      const words = results[0].values;
      words.forEach(word => {
        const wordElement = document.createElement('p');
        wordElement.classList.add('word');
        wordElement.textContent = word[1]; // Display only the Gurmukhi word
        wordElement.addEventListener('click', () => {
          fetchGurmukhiAndLineIds(word[0]);
        });
        wordListDiv.appendChild(wordElement);
      });
    } else {
      wordListDiv.innerHTML = '<p>No matching words found.</p>';
    }
  } catch (error) {
    console.error('Error searching words:', error);
    wordListDiv.innerHTML = '<p>Error searching words. Please check the console for details.</p>';
  }
}

// Fetch Gurmukhi, line IDs, and Shabad ID for a selected word
async function fetchGurmukhiAndLineIds(wordId) {
  try {
    const results = await db.exec(`
      SELECT l.id AS line_id, l.gurmukhi, l.shabad_id
      FROM word_line_mapping wlm
      JOIN lines l ON wlm.line_id = l.id
      WHERE wlm.word_id = ${wordId}
    `);

    const lineListDiv = document.getElementById('line-list');
    lineListDiv.innerHTML = ''; // Clear the list

    if (results.length > 0) {
      const lines = results[0].values;
      lines.forEach(line => {
        const lineElement = document.createElement('p');
        lineElement.classList.add('gurmukhi-line');
        lineElement.textContent = line[1]; // Display only the Gurmukhi text
        lineElement.addEventListener('click', () => {
          fetchAllLinesByShabad(line[2]);
        });
        lineListDiv.appendChild(lineElement);
      });
    } else {
      lineListDiv.innerHTML = '<p>No associated line IDs, Gurmukhi, or Shabad ID found.</p>';
    }
  } catch (error) {
    console.error('Error fetching Gurmukhi, Line IDs, and Shabad ID:', error);
    lineListDiv.innerHTML = '<p>Error fetching Gurmukhi, Line IDs, and Shabad ID. Please check the console for details.</p>';
  }
}

// Fetch all lines of the same Shabad and display in a popup
async function fetchAllLinesByShabad(shabadId) {
  try {
    const results = await db.exec(`
      SELECT l.id AS line_id, l.gurmukhi, l.shabad_id
      FROM lines l
      WHERE l.shabad_id = '${shabadId}'
      ORDER BY l.order_id
    `);

    const allLinesDiv = document.getElementById('all-lines');
    allLinesDiv.innerHTML = ''; // Clear the list

    if (results.length > 0) {
      const lines = results[0].values;
      lines.forEach(line => {
        const lineElement = document.createElement('p');
        lineElement.textContent = line[1]; // Display only the Gurmukhi text
        allLinesDiv.appendChild(lineElement);
      });

      // Show the popup
      const popup = document.getElementById('all-lines-popup');
      popup.classList.add('show-popup');

      // Add event listener to the close button
      const closeButton = popup.querySelector('.close-button');
      closeButton.addEventListener('click', () => {
        popup.classList.remove('show-popup');
      });
    } else {
      console.error('No lines found for Shabad ID:', shabadId);
      // Display an error message to the user
    }
  } catch (error) {
    console.error('Error fetching all lines for Shabad:', error);
    // Display an error message to the user
  }
}

// Initialize the database on page load
initDatabase();

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    searchWords(query);
  }
});