// Create the tiles layer that will be the background of our map

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>,\
    Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
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
    locationmap2019: new L.LayerGroup()
}
// Create a baseMaps objects to hold the Layers

var baseMaps = {
    
    "Darkscale": darkmap,
    "Outdoors": outdoorsmap
};

// Create an overlayMaps object to hold the earthquakes layer

var overlayMaps = {
    "2020": layers.locationmap2020,
    "2019": layers.locationmap2019
};

// Create the map object with options
var map = L.map("map", {
    center: [-37.81523132324219,144.96360778808594],
    zoom: 15    ,
    layers: [darkmap, outdoorsmap]
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

  // Link for camera locations geoJSON
var locationJSON = "https://raw.githubusercontent.com/malejandrasalgado/project-2/main/dataFinal.geojson"

var geoLocation;

// creat two dim arry to hold historic westher from API
var weatherHistory = [];
weatherHistory[0]=[];
weatherHistory[1]=[];
console.log("weatherHistory ",weatherHistory)

var weatherAPIKey = VISUAL_CROSSING_API_KEY;
var weatherYear = 0;

function loadWeather(){
    requestXMLHttpRequest("2019-08-01","2019-08-31");
    console.log("0 is", weatherHistory[0])
    requestXMLHttpRequest("2020-08-01","2020-08-31");
    console.log("1 is", weatherHistory[1])
 
    return;
}

function requestXMLHttpRequest(startDate,endDate) {
    var urlString = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Melbourne%2CAustralia/"+startDate+"/"+endDate+"?unitGroup=metric&key="+weatherAPIKey+"&include=stats"
    // console.log(urlString);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json"; 
    xhr.open('GET', urlString);        

    xhr.onload = function () {
        if (xhr.status != 200) {
            console.log("XMLHttpRequest error: "+xhr.status);
            return;
        }
        processWeatherData(xhr.response);
        loadGeoJSON(xhr.response);
    };

    xhr.send();
    xhr.onerror = function() {
        console.log("XMLHttpRequest Request failed");
    };
} 

function processWeatherData(response) {
    if (!response) {
        console.log("Empty response");
        return;
    }
    if (response.errorCode > 0) {
        console.log("Error detected. errorCode=" + response.errorCode + ",message=" + response.message);
        return;
    }
    
    var weatherdays = response.days;
    var checkYear = response.days[0].datetime.split('-');
    
    if (checkYear[0] == "2019")
        weatherYear = 0;
    else
        weatherYear = 1;
    console.log(checkYear[0], weatherYear)
    for (j=0;j<31;j++){
        weatherHistory[weatherYear][j] = weatherdays[j].tempmin.toString() + "-" + weatherdays[j].tempmax.toString() + " C";
    }
}


function getWeather(wYear,wDate){
    var theWeather = "";
    // get the day in the date and subtract 1 from it to get position in weather array
    const dateBits = wDate.split('/');
    wDay = parseInt(dateBits[0])-1;   
    return weatherHistory[wYear][wDay];
}
// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
function setColor(layercode,total) {
    switch (layercode) {
    case layercode = "2020":
        return "#1e22fc";
    case layercode = "2019":
        return "#22fc1e";
    default:
        return "#F01010";
    }
}

// Function to Determine Color of Marker Based on the Magnitude of the Earthquake
function setLayer(layerdate) {
    return(layerdate.substring(layerdate.length-4,layerdate.length));
}

function loadGeoJSON(response) {
    // Get a list of all the cameras
    var geoLayer = geoLocation.features;
    var layercode;

    // iterate through the JSON for each sensor  set a marker on the map
    for (var i = 0; i < geoLayer.length; i++) {

        // sensor is one location
        sensor = geoLayer[i]
        layercode = setLayer(sensor.properties.data_date)
        var detailHtml = "";
        // get a color to represent the year of the data
        color = setColor(layercode, sensor.properties.dailyTotal);

        var currentCamera = sensor.properties.Sensor;
        var tbwidth = 2;
        var tbentry = 0;

        var geoLayer2 = geoLocation.features;

        detailHtml = '<table style="width:100%"><tr><th>Date</th><th>Pedestrian Count</th><th>Temperature</th><th>Date</th><th>Pedestrian Count</th><th>Temperature</th></tr>';

        var wYear = 0;
        if (layercode == "2020")
            wYear = 1;
        var wDay = 0;

        for (var x = 0; x < geoLayer2.length; x++) {
            cameradata = geoLayer2[x];

            var thisCamera = cameradata.properties.Sensor;
            var thisYear = setLayer(cameradata.properties.data_date);
            if (thisCamera == currentCamera &&
                thisYear == layercode) {
                if (tbentry == 0)
                    detailHtml += "<tr>"

                var dayWeather = getWeather(wYear, cameradata.properties.data_date);

                detailHtml += "<td>" + cameradata.properties.data_date + "</td>" +
                    '<td align="right">' + cameradata.properties.dailyTotal.toLocaleString("en-AU") + "</td>" +
                    "<td>" + dayWeather + "</td>";

                tbentry++;
            }

            if (tbentry == tbwidth) {
                tbentry = 0;
                detailHtml += "</tr>"
            }
        }

        if (tbentry == 1) {
            detailHtml += "</tr>"
        }
        detailHtml += "</table>";

        // Add a marker for the location
        L.circleMarker([sensor.geometry.coordinates[1], sensor.geometry.coordinates[0]], {
            "radius": sensor.properties.dailyTotal / 2000,
            //"fillColor": "#F01010",
            "color": color,
            "weight": 5,
            "fillOpacity": 1,
            "opacity": 1
        },
            // Add a popup with the location data for when the marker is clicked - add something fancy later
        ).addTo(overlayMaps[layercode]).bindPopup(("<h4>Location: " + sensor.properties.Sensor + "</h4><hr>" +
            // "</p><hr><p>Date: " + sensor.properties.data_date + "</p>" +
            // "<p>Total pedestrians: " + sensor.properties.dailyTotal.toLocaleString("en-AU") + "</p>")+
            detailHtml), { minWidth: 550 });
    };
}

d3.json(locationJSON).then(function (location) {
    geoLocation = location;
    // load weather from API and await call back to load the geo locations on the map
    loadWeather();
});

// Main function to load location data and update the map
//d3.json(locationJSON).then(function(location){
//   // Get a list of all the cameras
//  var geoLayer = location.features;
// var layercode;
//  // Call the API and get the weather for the period of interest
//  loadWeather();
//
//   // iterate through the JSON for each sensor  set a marker on the map
//    for (var i = 0; i < geoLayer.length; i++) {
//
//        // sensor is one location
//        sensor = geoLayer[i]
//        layercode = setLayer(sensor.properties.data_date)
//        var detailHtml = "";
//        // get a color to represent the year of the data
//        color = setColor(layercode,sensor.properties.dailyTotal);
//
//        var currentCamera = sensor.properties.Sensor;
//        var tbwidth = 2;
//        var tbentry = 0;
//
//        var geoLayer2 = location.features;
//
//        detailHtml = '<table style="width:100%"><tr><th>Date</th><th>Pedestrian Count</th><th>Weather</th><th>Date</th><th>Pedestrian Count</th><th>Weather</th></tr>';
//
//        var wYear = 0;
//        if (layercode == "2020" )
//            wYear = 1;
//        var wDay = 0;
//
//        for (var x = 0; x < geoLayer2.length; x++) {
//            cameradata = geoLayer2[x];
//
//            var thisCamera = cameradata.properties.Sensor;
//            var thisYear = setLayer(cameradata.properties.data_date);
//            if (thisCamera == currentCamera &&
//                thisYear ==layercode) {
//                    if(tbentry == 0)
//                        detailHtml += "<tr>"
//
//                    var dayWeather = getWeather(wYear,cameradata.properties.data_date);
//
//                    detailHtml += "<td>"+ cameradata.properties.data_date + "</td>" +
//                                    '<td align="right">'+ cameradata.properties.dailyTotal.toLocaleString("en-AU") +"</td>"+
//                                    "<td>"+ dayWeather + "</td>";
//
//                    tbentry++;
//            }
//
//            if (tbentry ==tbwidth){
//                tbentry = 0;
//                detailHtml += "</tr>"
//            }
//        }
//
//        if(tbentry ==1){
//            detailHtml += "</tr>"
//        }
//        detailHtml += "</table>";
//
//        // Add a marker for the location
//        L.circleMarker([sensor.geometry.coordinates[1],sensor.geometry.coordinates[0]], {
//            "radius": sensor.properties.dailyTotal/2000,
//            //"fillColor": "#F01010",
//            "color": color,
//            "weight": 5,
//            "fillOpacity": 1,
//            "opacity": 1
//        },
//        // Add a popup with the location data for when the marker is clicked - add something fancy later
//        ).addTo(overlayMaps[layercode]).bindPopup(("<h4>Location: " + sensor.properties.Sensor + "</h4><hr>" +
//        // "</p><hr><p>Date: " + sensor.properties.data_date + "</p>" +
//        // "<p>Total pedestrians: " + sensor.properties.dailyTotal.toLocaleString("en-AU") + "</p>")+
//        detailHtml ),{minWidth : 550});
//    };
//});





