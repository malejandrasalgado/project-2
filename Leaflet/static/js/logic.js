// Create the tiles layer that will be the background of our map

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>,\
    Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>,\
    Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

var outdoorsmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>,\
    Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
// one layer for the earthquake points and another for the tectonic plates
var layers = {
    locationmap2020: new L.LayerGroup(),
    locationmap2019: new L.LayerGroup(),
    locationmapDif: new L.LayerGroup()
}
// Create a baseMaps objects to hold the Layers

var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": lightmap,
    "Outdoors": outdoorsmap
};


// Create an overlayMaps object to hold the earthquakes layer

var overlayMaps = {
    "2020": layers.locationmap2020,
    "2019": layers.locationmap2019,
    "Change": layers.locationmapDif
};

// Create the map object with options
var map = L.map("map", {
    center: [-37.81523132324219,144.96360778808594],
    zoom: 15    ,
    layers: [lightmap, satellitemap, outdoorsmap]
});


// Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);

// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
  });

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  
// Add the info legend to the map
info.addTo(map);

  // Link for Earthquakes geoJSON
var locationJSON = "https://raw.githubusercontent.com/malejandrasalgado/project-2/main/data.geojson"



// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
function setColor(location) {
    switch (true) {
    case location >= 5:
        return "#5d0128";
    case location >= 4:
        return "#a80310";
    case location >= 3:
        return "#fb2b0a";
    case location >= 2:
        return "#fbc613";
    case location >= 1:
        return "#fcf81e";
    default:
        return "#F01010";
    }
}
// Main function to load location data and update the map
d3.json(locationJSON).then(function(location){
  // get a list of the earthquakes from the JSON
  var geoLayer = location.features;
  var layercode;

    // iterate through the JSON for each sensor  set a marker on the map
    for (var i = 0; i < geoLayer.length; i++) {
        
        // sensor is one location
        sensor = geoLayer[i]
        // get a color to represent the magnitude of the quake
        color = setColor(sensor.properties.Sensor);
        console.log("Coords ",[sensor.geometry.coordinates[1],sensor.geometry.coordinates[0]] );

        myObservations = sensor.properties;
        console.log(myObservations)
        // Add a marker for the location
        L.circleMarker([sensor.geometry.coordinates[1],sensor.geometry.coordinates[0]], {
            "radius": 3,
            "fillColor": color,
            "color": color,
            "weight": 2,
            "fillOpacity": .7,
            "opacity": 1
        },
        // Add a popup with the quake data for when the marker is clicked
        ).addTo(layers.locationmap2020).bindPopup(("<h4>Location: " + sensor.properties.Sensor));
        //"</h4><hr><p>Date & Time: " + new Date(quake.properties.time) + 
        //"</p><hr><p>Magnitude: " + quake.properties.mag + "</p>"));
    };
});





