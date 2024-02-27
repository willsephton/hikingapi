function initMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 50.935020, lng: -1.396370 },
        zoom: 8
    });

    fetch('/obstructions')
        .then(response => response.json())
        .then(obstructions => {
            // Iterate over the obstructions data
            obstructions.forEach(obstruction => {
                // Create marker for each obstruction
                const marker = new google.maps.Marker({
                    position: { lat: obstruction.latitude, lng: obstruction.longitude },
                    map: map,
                    title: obstruction.type // You can set the title to whatever you want to display when the marker is clicked
                });
            });
        })
        .catch(error => {
            console.error('Error fetching obstructions:', error);
        });
}
