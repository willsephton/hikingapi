function fetchAndDisplayObstructions() {
    fetch('/obstructions')
        .then(response => response.json())
        .then(obstructions => {
            const table = document.createElement('table');
            const headers = Object.keys(obstructions[0]); // Assuming all objects have the same properties
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = capitalizeFirstLetter(header); // Capitalize the first letter of the header
                headerRow.appendChild(th);
            });
            // Add headers for edit and delete buttons
            const editHeader = document.createElement('th');
            editHeader.textContent = '';
            headerRow.appendChild(editHeader);
            const deleteHeader = document.createElement('th');
            deleteHeader.textContent = '';
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
                editButton.classList.add('btn', 'btn-blue', 'btn-sm'); // Adding Tailwind CSS classes
                editButton.onclick = () => {
                    displayEditPopup(obstruction); // Call function to display edit popup with obstruction data
                };
                const editCell = document.createElement('td');
                editCell.appendChild(editButton);
                row.appendChild(editCell);
                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-red', 'btn-sm'); // Adding Tailwind CSS classes
                deleteButton.onclick = () => {
                    deleteObstruction(obstruction.id);
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
    console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function displayEditPopup(obstruction) {
    // Display the edit popup with pre-filled data from the obstruction object
    const popupHtml = `
    <div class="popup-container">
    <h2 class="popupTitle">Edit Obstruction</h2>
    <div class="input-field">
        <label for="type" class="form-label">Type:</label>
        <input type="text" id="type" name="type" value="${obstruction.type}" class="form-input">
    </div>
    <div class="input-field">
        <label for="longitude" class="form-label">Longitude:</label>
        <input type="number" id="longitude" name="longitude" value="${obstruction.longitude}" class="form-input">
    </div>
    <div class="input-field">
        <label for="latitude" class="form-label">Latitude:</label>
        <input type="number" id="latitude" name="latitude" value="${obstruction.latitude}" class="form-input">
    </div>
    <div class="input-field">
        <label for="date" class="form-label">Date:</label>
        <input type="datetime-local" id="date" name="date" value="${formatDate(obstruction.date)}" class="form-input">
    </div>
    <div class="input-field">
        <label for="trail" class="form-label">Trail:</label>
        <input type="text" id="trail" name="trail" value="${obstruction.trail}" class="form-input">
    </div>
    <div class="input-field">
        <label for="username" class="form-label">Username:</label>
        <input type="text" id="username" name="username" value="${obstruction.username}" class="form-input">
    </div>
    <div class="input-field">
        <label for="description" class="form-label">Description:</label>
        <textarea id="description" name="description" class="form-input">${obstruction.description}</textarea>
    </div>
    <div class="input-field">
        <label for="severity" class="form-label">Severity:</label>
            <textarea id="severity" name="severity" class="form-input">${obstruction.severity}</textarea>
    </div>
    <div class="input-field">
        <label for="approval" class="form-label">Approval:</label>
        <input type="checkbox" id="approval" name="approval" ${obstruction.approval ? 'checked' : ''} class="form-checkbox">
    </div>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onclick="submitEditForm(${obstruction.id})">Submit</button>
        <button class="btn bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded close-btn" onclick="closePopup()">Close</button>
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
    var username = document.getElementById('username').value; // New field
    var description = document.getElementById('description').value; // New field
    var severity = document.getElementById('severity').value; // New field
    var approval = document.getElementById('approval').checked;

    // Convert date to the desired format
    var formattedDate = new Date(date).toISOString();

    // Construct JSON object
    var data = {
        "id": obstructionId,
        "type": type,
        "longitude": longitude,
        "latitude": latitude,
        "date": formattedDate,
        "trail": trail,
        "username": username, // Include username in the data object
        "description": description, // Include description in the data object
        "severity": severity,
        "approval": approval
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
            // Refresh the obstructions table after deletion
            document.getElementById('obstructionsTable').innerHTML = '';
            fetchAndDisplayObstructions();
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

function closePopup() {
    document.querySelector('.popup-container').remove();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

fetchAndDisplayObstructions();
