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
                    if (header === 'date') {
                        td.textContent = formatDate(obstruction[header]);
                    } else {
                        td.textContent = obstruction[header];
                    }
                    row.appendChild(td);
                });
                // Add edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.onclick = () => {
                    displayEditPopup(obstruction); // Call function to display edit popup with obstruction data
                };
                const editCell = document.createElement('td');
                editCell.appendChild(editButton);
                row.appendChild(editCell);
                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => {
                    deleteObstruction(obstruction.id); // Call function to delete obstruction
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

function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function displayEditPopup(obstruction) {
    // Display the edit popup with pre-filled data from the obstruction object
    const popupHtml = `
    <div class="popup-container">
        <h2>Edit Obstruction</h2>
        <div class="input-field">
            <label for="type">Type:</label>
            <input type="text" id="type" name="type" value="${obstruction.type}">
        </div>
        <div class="input-field">
            <label for="longitude">Longitude:</label>
            <input type="number" id="longitude" name="longitude" value="${obstruction.longitude}">
        </div>
        <div class="input-field">
            <label for="latitude">Latitude:</label>
            <input type="number" id="latitude" name="latitude" value="${obstruction.latitude}">
        </div>
        <div class="input-field">
            <label for="date">Date:</label>
            <input type="datetime-local" id="date" name="date" value="${formatDate(obstruction.date)}">
        </div>
        <div class="input-field">
            <label for="trail">Trail:</label>
            <input type="text" id="trail" name="trail" value="${obstruction.trail}">
        </div>
        <div class="input-field">
            <label for="approval">Approval:</label>
            <input type="checkbox" id="approval" name="approval" ${obstruction.approval ? 'checked' : ''}>
        </div>
        <button class="btn" onclick="submitEditForm(${obstruction.id})">Submit</button>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function submitEditForm(obstructionId) {
    // Get input values
    var type = document.getElementById('type').value;
    var longitude = document.getElementById('longitude').value;
    var latitude = document.getElementById('latitude').value;
    var date = document.getElementById('date').value;
    var trail = document.getElementById('trail').value;

    // Construct JSON object
    var data = {
        "id": obstructionId,
        "type": type,
        "longitude": longitude,
        "latitude": latitude,
        "date": date,
        "trail": trail
    };

    // Send POST request to update obstruction
    fetch(`/editObstruction/${obstructionId}`, { // Include ID in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Obstruction updated successfully!');
            // Close the popup after submitting the form
            document.querySelector('.popup-container').remove();
        } else {
            throw new Error('Failed to update obstruction');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update obstruction. Please try again.');
    });
}

function deleteObstruction(obstructionId) {
    // Send DELETE request to delete obstruction
    fetch(`/deleteObstruction/${obstructionId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('Obstruction deleted successfully!');
            // Refresh the obstructions table after deletion
            document.getElementById('obstructionsTable').innerHTML = '';
            fetchAndDisplayObstructions();
        } else {
            throw new Error('Failed to delete obstruction');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete obstruction. Please try again.');
    });
}

fetchAndDisplayObstructions();
