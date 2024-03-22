function showPopup() {
    const popupHtml = `
    <div class="popup-container">
        <h2 class="popupTitle">Add Obstruction</h2>
        <div class="input-field">
            <label for="type">Type:</label>
            <input type="text" id="type" name="type">
        </div>
        <div class="input-field">
            <label for="longitude">Longitude:</label>
            <input type="number" id="longitude" name="longitude">
        </div>
        <div class="input-field">
            <label for="latitude">Latitude:</label>
            <input type="number" id="latitude" name="latitude">
        </div>
        <div class="input-field">
            <label for="date">Date:</label>
            <input type="datetime-local" id="date" name="date">
        </div>
        <div class="input-field">
            <label for="trail">Trail:</label>
            <input type="text" id="trail" name="trail">
        </div>
        <div class="input-field">
            <label for="approval">Approval:</label>
            <input type="checkbox" id="approval" name="approval">
        </div>
        <div class="input-field">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
        </div>
        <div class="input-field">
            <label for="description">Description:</label>
            <textarea id="description" name="description"></textarea>
        </div>
        <div class="input-field">
            <label for="severity">Severity:</label>
            <textarea id="severity" name="severity"></textarea>
        </div>
        <button class="btn" onclick="submitForm()">Submit</button>
        <button class="btn close-btn" onclick="closePopup()">Close</button>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function closePopup() {
    document.querySelector('.popup-container').remove();
}

function submitForm() {
    // Get input values
    var type = document.getElementById('type').value;
    var longitude = document.getElementById('longitude').value;
    var latitude = document.getElementById('latitude').value;
    var date = document.getElementById('date').value;
    var trail = document.getElementById('trail').value;
    var approval = document.getElementById('approval').checked; // Get checkbox value
    var username = document.getElementById('username').value;
    var description = document.getElementById('description').value;
    var severity = document.getElementById('severity').value;

    // Construct JSON object
    var data = {
        "type": type,
        "longitude": longitude,
        "latitude": latitude,
        "date": date,
        "trail": trail,
        "approval": approval,
        "username": username,
        "description": description,
        "severity": severity
    };

    // Send POST request
    fetch('/createObstruction', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('Obstruction added successfully!');
        } else {
            throw new Error('Failed to add obstruction');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add obstruction. Please try again.');
    });

    // Close the popup after submitting the form
    closePopup();
}
