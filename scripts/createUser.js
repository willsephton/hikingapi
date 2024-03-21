function showPopup() {
    const popupHtml = `
    <div class="popup-container">
        <h2 class="popupTitle">Create User</h2>
        <div class="input-field">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username">
        </div>
        <div class="input-field">
            <label for="password">Password:</label>
            <input type="text" id="password" name="password">
        </div>
        <div class="input-field">
            <label for="admin">Admin:</label>
            <input type="checkbox" id="admin" name="admin">
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
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var admin = document.getElementById('admin').checked; // Get checkbox value

    // Construct JSON object
    var data = {
        "username": username,
        "password": password,
        "admin": admin
    };

    // Send POST request
    fetch('/createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('User added successfully!');
        } else {
            throw new Error('Failed to create User');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to create user. Please try again.');
    });

    // Close the popup after submitting the form
    closePopup();
}
