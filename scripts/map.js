function initMap() {
    // Initialize the map
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.825588, lng: -78.738358 },
        zoom: 8
    });

    // Example marker
    const marker = new google.maps.Marker({
        position: { lat: 35.825588, lng: -78.738358 },
        map: map,
        title: 'Marker'
    });
}
