// Display statistics for the selected word
async function displayStatistics(wordId, originalWord) {
    const statisticsDiv = document.getElementById('statistics');
    statisticsDiv.innerHTML = `<h3>Statistics for "${originalWord}"</h3>`;

    try {
        // Total Occurrences
        const totalOccurrencesResult = db.exec(`
            SELECT COUNT(*)
            FROM word_line_mapping
            WHERE word_id = $wordId
        `, { $wordId: wordId });
        const totalOccurrences = totalOccurrencesResult.length > 0 ? totalOccurrencesResult[0].values[0][0] : 0;

        // Occurrences by Source
        const occurrencesBySourceResult = db.exec(`
            SELECT s.name_english, COUNT(*)
            FROM word_line_mapping wlm
            JOIN lines l ON wlm.line_id = l.id
            JOIN shabads sh ON l.shabad_id = sh.id
            JOIN sources s ON sh.source_id = s.id
            WHERE wlm.word_id = $wordId
            GROUP BY s.name_english
        `, { $wordId: wordId });
        const occurrencesBySource = occurrencesBySourceResult.length > 0 ? occurrencesBySourceResult[0].values : [];

        // Occurrences by Writer
        const occurrencesByWriterResult = db.exec(`
            SELECT w.name_english, COUNT(*)
            FROM word_line_mapping wlm
            JOIN lines l ON wlm.line_id = l.id
            JOIN shabads sh ON l.shabad_id = sh.id
            JOIN writers w ON sh.writer_id = w.id
            WHERE wlm.word_id = $wordId
            GROUP BY w.name_english
        `, { $wordId: wordId });
        const occurrencesByWriter = occurrencesByWriterResult.length > 0 ? occurrencesByWriterResult[0].values : [];

        // Total count of Shabads Containing Word
        const shabadsContainingWordCountResult = db.exec(`
            SELECT COUNT(DISTINCT sh.id)
            FROM word_line_mapping wlm
            JOIN lines l ON wlm.line_id = l.id
            JOIN shabads sh ON l.shabad_id = sh.id
            WHERE wlm.word_id = $wordId
        `, { $wordId: wordId });
        const shabadsContainingWordCount = shabadsContainingWordCountResult.length > 0 ? shabadsContainingWordCountResult[0].values[0][0] : 0;

        // Banis Containing Word
        const banisContainingWordResult = db.exec(`
            SELECT DISTINCT b.name_english
            FROM word_line_mapping wlm
            JOIN bani_lines bl ON wlm.line_id = bl.line_id
            JOIN banis b ON bl.bani_id = b.id
            WHERE wlm.word_id = $wordId
        `, { $wordId: wordId });
        const banisContainingWord = banisContainingWordResult.length > 0 ? banisContainingWordResult[0].values : [];

        // Sections Containing Word
        const sectionsContainingWordResult = db.exec(`
            SELECT DISTINCT s.name_english
            FROM word_line_mapping wlm
            JOIN lines l ON wlm.line_id = l.id
            JOIN shabads sh ON l.shabad_id = sh.id
            JOIN sections s ON sh.section_id = s.id
            WHERE wlm.word_id = $wordId
        `, { $wordId: wordId });
        const sectionsContainingWord = sectionsContainingWordResult.length > 0 ? sectionsContainingWordResult[0].values : [];

        // Subsections Containing Word
        const subsectionsContainingWordResult = db.exec(`
            SELECT DISTINCT ss.name_english
            FROM word_line_mapping wlm
            JOIN lines l ON wlm.line_id = l.id
            JOIN shabads sh ON l.shabad_id = sh.id
            JOIN subsections ss ON sh.subsection_id = ss.id
            WHERE wlm.word_id = $wordId
        `, { $wordId: wordId });
        const subsectionsContainingWord = subsectionsContainingWordResult.length > 0 ? subsectionsContainingWordResult[0].values : [];

        // Lines Containing Word (without line ID)
        const linesContainingWordResult = db.exec(`
            SELECT l.gurmukhi
            FROM word_line_mapping wlm
            JOIN lines l ON wlm.line_id = l.id
            WHERE wlm.word_id = $wordId
        `, { $wordId: wordId });
        const linesContainingWord = linesContainingWordResult.length > 0 ? linesContainingWordResult[0].values : [];

        // Displaying the statistical information
        const statsTable = document.createElement('table');

        // Total Occurrences
        const totalOccurrencesRow = document.createElement('tr');
        const totalOccurrencesLabelCell = document.createElement('td');
        totalOccurrencesLabelCell.textContent = 'Total Occurrences';
        const totalOccurrencesValueCell = document.createElement('td');
        totalOccurrencesValueCell.textContent = totalOccurrences;
        totalOccurrencesRow.appendChild(totalOccurrencesLabelCell);
        totalOccurrencesRow.appendChild(totalOccurrencesValueCell);
        statsTable.appendChild(totalOccurrencesRow);

        // Occurrences by Source
        const occurrencesBySourceRow = document.createElement('tr');
        const occurrencesBySourceLabelCell = document.createElement('td');
        occurrencesBySourceLabelCell.textContent = 'Occurrences by Source';
        const occurrencesBySourceValueCell = document.createElement('td');
        occurrencesBySourceValueCell.innerHTML = occurrencesBySource.map(row => `<div>${row[0]}: ${row[1]}</div>`).join('');
        occurrencesBySourceRow.appendChild(occurrencesBySourceLabelCell);
        occurrencesBySourceRow.appendChild(occurrencesBySourceValueCell);
        statsTable.appendChild(occurrencesBySourceRow);

        // Occurrences by Writer
        const occurrencesByWriterRow = document.createElement('tr');
        const occurrencesByWriterLabelCell = document.createElement('td');
        occurrencesByWriterLabelCell.textContent = 'Occurrences by Writer';
        const occurrencesByWriterValueCell = document.createElement('td');
        occurrencesByWriterValueCell.innerHTML = occurrencesByWriter.map(row => `<div>${row[0]}: ${row[1]}</div>`).join('');
        occurrencesByWriterRow.appendChild(occurrencesByWriterLabelCell);
        occurrencesByWriterRow.appendChild(occurrencesByWriterValueCell);
        statsTable.appendChild(occurrencesByWriterRow);

        // Total count of Shabads Containing Word
        const shabadsContainingWordRow = document.createElement('tr');
        const shabadsContainingWordLabelCell = document.createElement('td');
        shabadsContainingWordLabelCell.textContent = 'Shabads Containing Word';
        const shabadsContainingWordValueCell = document.createElement('td');
        shabadsContainingWordValueCell.textContent = shabadsContainingWordCount;
        shabadsContainingWordRow.appendChild(shabadsContainingWordLabelCell);
        shabadsContainingWordRow.appendChild(shabadsContainingWordValueCell);
        statsTable.appendChild(shabadsContainingWordRow);

        // Banis Containing Word
        const banisContainingWordRow = document.createElement('tr');
        const banisContainingWordLabelCell = document.createElement('td');
        banisContainingWordLabelCell.textContent = 'Banis Containing Word';
        const banisContainingWordValueCell = document.createElement('td');
        banisContainingWordValueCell.innerHTML = banisContainingWord.map(row => `<div>${row[0]}</div>`).join('');
        banisContainingWordRow.appendChild(banisContainingWordLabelCell);
        banisContainingWordRow.appendChild(banisContainingWordValueCell);
        statsTable.appendChild(banisContainingWordRow);

        // Sections Containing Word
        const sectionsContainingWordRow = document.createElement('tr');
        const sectionsContainingWordLabelCell = document.createElement('td');
        sectionsContainingWordLabelCell.textContent = 'Sections Containing Word';
        const sectionsContainingWordValueCell = document.createElement('td');
        sectionsContainingWordValueCell.innerHTML = sectionsContainingWord.map(row => `<div>${row[0]}</div>`).join('');
        sectionsContainingWordRow.appendChild(sectionsContainingWordLabelCell);
        sectionsContainingWordRow.appendChild(sectionsContainingWordValueCell);
        statsTable.appendChild(sectionsContainingWordRow);

        // Subsections Containing Word
        const subsectionsContainingWordRow = document.createElement('tr');
        const subsectionsContainingWordLabelCell = document.createElement('td');
        subsectionsContainingWordLabelCell.textContent = 'Subsections Containing Word';
        const subsectionsContainingWordValueCell = document.createElement('td');
        subsectionsContainingWordValueCell.innerHTML = subsectionsContainingWord.map(row => `<div>${row[0]}</div>`).join('');
        subsectionsContainingWordRow.appendChild(subsectionsContainingWordLabelCell);
        subsectionsContainingWordRow.appendChild(subsectionsContainingWordValueCell);
        statsTable.appendChild(subsectionsContainingWordRow);

        statisticsDiv.appendChild(statsTable);

        // Display lines containing word
        displayLines(linesContainingWord, originalWord);

    } catch (error) {
        console.error('Error displaying statistics:', error);
        statisticsDiv.innerHTML = '<p>Error displaying statistics. Please check the console for details.</p>';
    }
}
