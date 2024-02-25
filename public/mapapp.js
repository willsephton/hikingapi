//! Map Stuff

const map = L.map ("map1");

const attrib="Map data copyright OpenStreetMap contributors, Open Database Licence";

L.tileLayer
        ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            { attribution: attrib } ).addTo(map);

let pos = [50.908, -1.4];            
map.setView(pos, 14);


//! Setting Up Markers on the Map

async function regionMarkers(region) {
    try {
    // Send a request to our remote URL
    const response = await fetch(`/obstructions`)
    if(response.status == 404) {
        alert("The point of interest was not found!");
    } else {
    
    // Remove any Layers
    
    
    // Parse the JSON.
    const points = await response.json();
    let markers = [];
    var marker;

    // Loop through the array of JSON objects and add the results to a <div>
    // Loop through the array of JSON objects and add the results to a <div>
    points.forEach(point => {
        let lon1 = point.longitude;
        let lat1 = point.latitude;
        let name1 = point.type;
        let desc1 = point.date + ' - ' + point.trail; // Combine date and trail
        let pointID = point.id;
        markers.push([lon1, lat1, desc1, name1, pointID]);
    });

    for (var i=0; i<markers.length; i++) {
           
        var lon = markers[i][0];
        var lat = markers[i][1];

        const node1 = document.createElement("div");
        const nodeH3 = document.createElement("h3");
        const pointName = document.createTextNode(`${markers[i][3]}`);
        const nodeH4 = document.createElement("h4");
        const pointDesc = document.createTextNode(`${markers[i][2]}`);
        const nodeH42 = document.createElement("h4");
        const pointID = document.createTextNode(`ID: ${markers[i][4]}`);
        nodeH3.appendChild(pointName);
        nodeH4.appendChild(pointDesc);
        nodeH42.appendChild(pointID);
        node1.appendChild(nodeH3);
        node1.appendChild(nodeH4);
        node1.appendChild(nodeH42);
        
        var markerLocation = new L.LatLng(lat, lon);
        marker = new L.Marker(markerLocation);
        map.addLayer(marker);
     
        marker.bindPopup(node1);
     }

    }
    } catch (e) {
        alert(`There was an error: ${e}`);
    }
};



// Make the AJAX run when we click a button
document.getElementById('regionSearch').addEventListener('click', ()=> {
    // Read the product type from a text field
    const empty = "";
    document.getElementById("results").innerHTML = empty;
    const region = document.getElementById('region').value;
    regionSearch(region);
    regionMarkers(region);
});
