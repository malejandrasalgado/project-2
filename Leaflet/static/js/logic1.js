
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
var earthquakesmap = new L.LayerGroup();
var platesmap = new L.LayerGroup();


// Create a baseMaps objects to hold the Layers

var baseMaps = {
    "Satellite": satellitemap,
    "Grayscale": lightmap,
    "Outdoors": outdoorsmap
};


// Create an overlayMaps object to hold the earthquakes layer

var overlayMaps = {
    "Earthquakes": earthquakesmap,
    "Tectonic Plates": platesmap
};

// Create the map object with options
var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
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
var earthquakeJSON = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Link for Tectonic Plates geoJSON
var platesJSON = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json";

// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
function setColor(mag) {
    console.log("mag is",mag)
    switch (true) {
    case mag >= 5:
        return "#5d0128";
    case mag >= 4:
        return "#a80310";
    case mag >= 3:
        return "#fb2b0a";
    case mag >= 2:
        return "#fbc613";
    case mag >= 1:
        return "#fcf81e";
    default:
        return "#22fc20";
    }
}
// Main function to load earthquake data and update the map
d3.json(earthquakeJSON).then(function(earthquakes){
  // get a list of the earthquakes from the JSON
  var geoLayer = earthquakes.features;

    // iterate through the JSON for each earthquake and set a marker on the map
    for (var i = 0; i < geoLayer.length; i++) {
        // quake is one earthquake
        quake = geoLayer[i]
        // get a color to represent the magnitude of the quake
        color = setColor(quake.properties.mag);

        // Add a marker for the quake and set its size and color based on magnitude
        L.circleMarker([quake.geometry.coordinates[1],quake.geometry.coordinates[0]], {
          "radius": quake.properties.mag * 3,
          "fillColor": color,
          "color": color,
          "weight": 2,
          "fillOpacity": .7,
          "opacity": 1
        },
        // Add a popup with the quake data for when the marker is clicked
        ).addTo(earthquakesmap).bindPopup(("<h4>Location: " + quake.properties.place + 
        "</h4><hr><p>Date & Time: " + new Date(quake.properties.time) + 
        "</p><hr><p>Magnitude: " + quake.properties.mag + "</p>"));
    }

    // Set up the legend to display on bottom right of the screen
    magnitudeLevels = [0, 1, 2, 3, 4, 5];

    // construct HTML to show the legend as different colors for magnitudes
    var legendHTML = "<h3>Magnitude</h3>"

    for (var i = 0; i < magnitudeLevels.length; i++) {
        legendHTML += '<i style="background: ' + setColor(magnitudeLevels[i] + 1) + '"></i> ' +
            magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
    }
    // Update the legend on the form
    document.querySelector(".legend").innerHTML = legendHTML;

});

// function to add the tectonic plate data to the form
d3.json(platesJSON).then(function(plates){
    var myStyle = {
        color: "#fc8527",
        weight: 2
    // Add plateData to tectonicPlates LayerGroups 
    };
    var platesLayer = plates.features;
        // Create a GeoJSON Layer the plateData
        L.geoJson(plates, myStyle).addTo(platesmap);
});

