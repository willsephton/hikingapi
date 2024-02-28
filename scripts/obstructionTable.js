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
                    if (header === 'date') {
                        td.textContent = formatDate(obstruction[header]);
                    } else {
                        td.textContent = obstruction[header];
                    }
                    row.appendChild(td);
                });
                table.appendChild(row);
            });

            // Replace the existing obstructions table with the new one
            const existingTable = document.getElementById('obstructionsTable');
            existingTable.innerHTML = ''; // Clear existing content
            existingTable.appendChild(table);
        })
        .catch(error => {
            console.error('Error fetching obstructions:', error);
        });
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    return formattedDate;
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
            <input type="date" id="date" name="date" value="${obstruction.date}">
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
    var approval = document.getElementById('approval').checked; // Get the approval status from the checkbox

    // Construct JSON object
    var data = {
        "id": obstructionId,
        "type": type,
        "longitude": longitude,
        "latitude": latitude,
        "date": date,
        "trail": trail,
        "approval": approval // Include approval status in the data
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
