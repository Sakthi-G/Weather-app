let {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("all-city-weather-report");

process.on("message", (triggerData) => {
  switch (triggerData.startMsg) {
    case "fetchAllCityDetails":
      process.send(allTimeZones());
      break;
    case "fetchDataAndTime":
      process.send(timeForOneCity(triggerData.cityName));
      break;
    case "fetchSuccessiveHrsData":
      let nextNhours = nextNhoursWeather(
        triggerData.cityTDN,
        triggerData.hours,
        triggerData.weatherData
      );
      process.send(nextNhours);
      break;
  }
  process.exit();
});
