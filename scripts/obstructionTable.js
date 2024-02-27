function fetchAndDisplayObstructions() {
    fetch('/obstructions')
        .then(response => response.json())
        .then(obstructions => {
            const table = document.createElement('table');
            const headers = Object.keys(obstructions[0]); // Assuming all objects have the same properties
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            obstructions.forEach(obstruction => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = obstruction[header];
                    row.appendChild(td);
                });
                table.appendChild(row);
            });

            document.getElementById('obstructionsTable').appendChild(table);
        })
        .catch(error => {
            console.error('Error fetching obstructions:', error);
        });
}

fetchAndDisplayObstructions();