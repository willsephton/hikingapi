function initMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 50.935020, lng: -1.396370 },
        zoom: 8
    });

    // Initialize an empty info window
    const infoWindow = new google.maps.InfoWindow();

    fetch('/obstructions')
        .then(response => response.json())
        .then(obstructions => {
            // Iterate over the obstructions data
            obstructions.forEach(obstruction => {
                // Create marker for each obstruction
                const marker = new google.maps.Marker({
                    position: { lat: obstruction.latitude, lng: obstruction.longitude },
                    map: map,
                    title: obstruction.type
                });


                formattedDate = formatDate(obstruction.date)
                // Add click event listener to each marker
                marker.addListener('click', () => {
                    // Set the content of the info window to display the information of the obstruction
                    infoWindow.setContent(`<div><strong>ID:</strong> ${obstruction.id}</div>
                                            <div><strong>Type:</strong> ${obstruction.type}</div>
                                           <div><strong>Date:</strong> ${formattedDate}</div>
                                           <div><strong>Trail:</strong> ${obstruction.trail}</div>
                                           <div><strong>Username:</strong> ${obstruction.username}</div>
                                           <div><strong>Description:</strong> ${obstruction.description}</div>
                                           <div><strong>Approval:</strong> ${obstruction.approval ? 'Approved' : 'Pending'}</div>`);

                    // Open the info window at the marker's position
                    infoWindow.open(map, marker);
                });
            });
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