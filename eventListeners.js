// Event listener for the search button
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        searchWords(query);
    }
});
