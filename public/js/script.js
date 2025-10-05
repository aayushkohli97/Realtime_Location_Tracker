const socket = io(); // Socket.io client connecting to server

if(navigator.geolocation){ // geolocation : Check if geolocation is supported
    navigator.geolocation.watchPosition((position) =>{ // Watch for changes in position
        const {latitude,longitude} = position.coords;
        socket.emit("send-location",{latitude, longitude});
    }, (error) =>{
        console.error("Error getting location:", error);
    },{
        enableHighAccuracy: true, // Enable high accuracy for better location data
        maximumAge: 0, // Do not use cached position
        timeout: 5000 // Timeout for getting position in milliseconds 
    }
);
}

const map = L.map("map").setView([0,0],10); // map with center at [0,0] and zoom level 10

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution : "OpenStreetMap",
}).addTo(map); // Add OpenStreetMap tile layer to the map 

const markers = {}; // Object to store markers by user ID

socket.on("receive-location", (data) =>{
    const {id,latitude,longitude} = data; // data ko khol ke latitude aur longitude nikaal lo
    map.setView([latitude, longitude],10); // Set map view to the received location
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]); // Update existing marker position
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map); // Add new marker to the map
    }
});

socket.on("disconnect", (id) =>{
    if(markers[id]) {
        map.removeLayer(markers[id]); // Remove marker from the map on disconnect
        delete markers[id]; // Delete marker from markers object
    }
    console.log(`Client disconnected: ${id}`); // Log disconnection
});