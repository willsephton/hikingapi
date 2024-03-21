function fetchAndDisplayUsers() {
    fetch('/users')
        .then(response => response.json())
        .then(users => {
            const table = document.createElement('table');
            const headers = Object.keys(users[0]); // Assuming all users have the same properties
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = capitalizeFirstLetter(header); // Capitalize the first letter of the header
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

            users.forEach(user => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    if (header === 'date') {
                        td.textContent = formatDate(user[header]);
                    } else {
                        td.textContent = user[header];
                    }
                    row.appendChild(td);
                });
                // Add edit button
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('btn', 'btn-blue', 'btn-sm'); // Adding Tailwind CSS classes
                editButton.onclick = () => {
                    displayEditPopup(user); // Call function to display edit popup with user data
                };
                const editCell = document.createElement('td');
                editCell.appendChild(editButton);
                row.appendChild(editCell);
                // Add delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-red', 'btn-sm'); // Adding Tailwind CSS classes
                deleteButton.onclick = () => {
                    deleteObstruction(user.id);
                };
                const deleteCell = document.createElement('td');
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                table.appendChild(row);
            });

            document.getElementById('usersTable').appendChild(table);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
}

function displayEditPopup(user) {
    // Display the edit popup with pre-filled data from the user object
    const popupHtml = `
    <div class="popup-container">
        <h2 class="popupTitle">Edit User</h2>
        <div class="input-field">
            <label for="username" class="form-label">Username:</label>
            <input type="text" id="username" name="username" value="${user.username}" class="form-input">
        </div>
        <div class="input-field">
            <label for="password" class="form-label">Password:</label>
            <input type="password" id="password" name="password" class="form-input">
        </div>
        <div class="input-field">
            <label for="admin" class="form-label">Admin:</label>
            <input type="checkbox" id="admin" name="admin" ${user.admin ? 'checked' : ''} class="form-checkbox">
        </div>
        <button class="btn bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded" onclick="submitEditForm(${user.id})">Submit</button>
        <button class="btn bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded close-btn" onclick="closePopup()">Close</button>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', popupHtml);
}

function submitEditForm(userId) {
    // Get input values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var admin = document.getElementById('admin').checked;

    // Construct JSON object
    var data = {
        "username": username,
        "password": password,
        "admin": admin
    };

    // Send POST request to update user
    fetch(`/editUser/${userId}`, { // Include ID in the URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            alert('User updated successfully!');
            // Close the popup after submitting the form
            document.querySelector('.popup-container').remove();
        } else {
            throw new Error('Failed to update user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update user. Please try again.');
    });
}

function deleteUser(userId) {
    // Send DELETE request to delete user
    fetch(`/deleteUser/${userId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            alert('User deleted successfully!');
            // Refresh the users table after deletion
            document.getElementById('usersTable').innerHTML = '';
            fetchAndDisplayUsers();
        } else {
            throw new Error('Failed to delete user');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete user. Please try again.');
    });
}

function closePopup() {
    document.querySelector('.popup-container').remove();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

fetchAndDisplayUsers();
