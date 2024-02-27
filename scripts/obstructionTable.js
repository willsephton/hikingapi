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
            // Add headers for edit and delete buttons
            const editHeader = document.createElement('th');
            editHeader.textContent = 'Edit';
            headerRow.appendChild(editHeader);
            const deleteHeader = document.createElement('th');
            deleteHeader.textContent = 'Delete';
            headerRow.appendChild(deleteHeader);
            table.appendChild(headerRow);

            obstructions.forEach(obstruction => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = obstruction[header];
                    row.appendChild(td);
                });
                // Add edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => {
                    // Implement edit functionality here
                    // You can use the obstruction object to get the ID or other details
                    console.log('Edit clicked for obstruction:', obstruction);
                };
                const editCell = document.createElement('td');
                editCell.appendChild(editButton);
                row.appendChild(editCell);
                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => {
                    // Implement delete functionality here
                    // You can use the obstruction object to get the ID or other details
                    console.log('Delete clicked for obstruction:', obstruction);
                };
                const deleteCell = document.createElement('td');
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                table.appendChild(row);
            });

            document.getElementById('obstructionsTable').appendChild(table);
        })
        .catch(error => {
            console.error('Error fetching obstructions:', error);
        });
}

fetchAndDisplayObstructions();
