function makeplot() {
  Plotly.d3.csv("./data.csv", function (data) { processData(data) });
}

let finalObj = {};
function processData(allRows) {
    for(let row of allRows){
        let data_date = row['data_date'];
        let Sensor = row['Sensor'];
        if(data_date){
            if(finalObj[data_date]){
                let innerObj = finalObj[data_date];
                if(Sensor && !innerObj[Sensor]){
                    innerObj[Sensor] = row;
                }
            }else{
                let obj = {};
                obj[Sensor] = row;
                finalObj[data_date] = obj;
            }
        }
       
    }
    var dataDateOptions = "";
    for (let dataDate of Object.keys(finalObj)) {
        dataDateOptions += "<option>" + dataDate + "</option>";
    }
    document.getElementById("data_date").innerHTML = dataDateOptions;
}

function changeDate(val){
    document.getElementById("lineChart").checked = false;
    if(finalObj[val]){
        var sensorOptions = "";
        for (let sensor of Object.keys(finalObj[val])) {
            sensorOptions += "<option>" + sensor + "</option>";
        }
        document.getElementById("sensor").innerHTML = sensorOptions;
    }else{
        document.getElementById("sensor").innerHTML = '<option value="" disabled selected>Select</option>';
    }
}

function plot(val){
    document.getElementById("lineChart").checked = false;
    let data_date = document.getElementById("data_date").value;
    if(data_date && val){
        let data = finalObj[data_date][val];
        makePlotly(data, data_date, val);
    }
}

function makePlotly(d, data_date, sensor) {
    var coloumn = ["Midnight",	"1am",	"2am",	"3am",	"4am",	"5am",	"6am",	"7am",	"8am",	"9am",	"10am",	"11am",	"Noon",	"1pm",	"2pm",	"3pm",	"4pm",	"5pm",	"6pm",	"7pm",	"8pm",	"9pm",	"10pm", "11pm"];

    var final = []
    for(let key of coloumn){
        let data = d[key];
        if(data){
            final.push(Number(data));
        }else{
            final.push(data);
        }
    }

    var traces = [{
        x: coloumn,
        y: final,
        type: 'bar'
    }];

    Plotly.newPlot('myDiv', traces,
        { title: 'Plotting data of ' +sensor+ ' on '+ data_date });
};

function changeToLine(val){
   
    var update = {
        type: document.getElementById("lineChart").checked ? "line" : "bar"
    };
    Plotly.restyle('myDiv', update, 0);
}

makeplot();