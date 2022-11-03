var cityWeatherReports = [],
  startTime = new Date(),
  dayCheck = 14400000;

// Import Modules
let express = require("express");
let path = require("path");
let app = express();
const { fork } = require("child_process");
let bodyParser = require("body-parser");

// Middlewares to load static files
app.use("/index(.html)?", express.static(path.join(__dirname, "..")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// It is used to return all Cities Weather Report
app.get("/all-timezone-cities", (request, response) => {
  let currentTime = new Date();
  let childProcess = fork("./weather-data.js");
  childProcess.send({ startMsg: "fetchAllCityDetails" });
  if (currentTime - startTime > dayCheck) {
    startTime = new Date();
    childProcess.on("message", (weatherReport) => {
      cityWeatherReports = weatherReport;
      response.send(cityWeatherReports);
    });
  } else if (cityWeatherReports.length === 0) {
    childProcess.on("message", (weatherReport) => {
      cityWeatherReports = weatherReport;
      response.send(cityWeatherReports);
    });
  } else response.send(cityWeatherReports);
});

// It is used to return Date and Time for the requested city
app.get("/", (request, response) => {
  let city = request.query.city;
  let childProcess = fork("./weather-data.js");
  if (city) {
    childProcess.send({ startMsg: "fetchDataAndTime", cityName: city });
    childProcess.on("message", (dateAndTime) => {
      response.send(dateAndTime);
    });
  } else {
    response
      .status(404)
      .send({ Error: "Not a Valid EndPoint. Please check API Doc" });
  }
});

// It is used to return successive hours temperature data
app.post("/hourly-forecast", (request, response) => {
  let cityTDN = request.body.city_Date_Time_Name;
  let hours = request.body.hours;
  let childProcess = fork("./weather-data.js");
  if (cityTDN && hours) {
    childProcess.send({
      startMsg: "fetchSuccessiveHrsData",
      cityTDN: request.body.city_Date_Time_Name,
      hours: request.body.hours,
      weatherData: cityWeatherReports,
    }); 
    childProcess.on("message", (successiveHrsData) => {
      response.send(successiveHrsData);
    });
  } else {
    response
      .status(404)
      .send({ Error: "Not a Valid EndPoint. Please check API Doc" });
  }
});

app.listen(9999);
