var hour = [],
  consecutiveFiveHrs = [],
  hourlyIcon = [],
  hourlyTemperature = [],
  myInterval,
  imageFolderPath = "./assets/",
  warningText = "NIL";

/**
 * @class weatherDetails which includes getter/setter
 * and other methods to access the data from data.js
 */
class weatherDetails {
  constructor() {
    this.cityNames = Object.keys(allCityWeatherReport);
    this.weatherInfo = Object.values(allCityWeatherReport);

    this.setHumidity = function (input) {
      this.humidity = allCityWeatherReport[input].humidity;
    };
    this.getHumidity = function () {
      return this.humidity;
    };

    this.setPrecipitation = function (input) {
      this.precipitation = allCityWeatherReport[input].precipitation;
    };
    this.getPrecipitation = function () {
      return this.precipitation;
    };

    this.setTemperature = function (input) {
      this.temperature = allCityWeatherReport[input].temperature.split("°")[0];
    };
    this.getTemperature = function () {
      return this.temperature;
    };

    this.setSuccessiveHrsTemp = function (input) {
      this.nextConsecutiveHrs = allCityWeatherReport[input].nextFiveHrs;
    };
    this.getSuccessiveHrsTemp = function () {
      return this.nextConsecutiveHrs;
    };

    this.setTimeZone = function (input) {
      this.timeZone = allCityWeatherReport[input].timeZone;
    };
    this.getTimeZone = function () {
      return this.timeZone;
    };
  }
  updateTimeAndDate() {
    liveDateAndTime();
  }
}
var currentCityData = new weatherDetails();

//Input Box ID
let rawInput = document.getElementById("input-box");
rawInput.addEventListener("change", checkCityData);
//Date, time & cit-img ID's
let cityTime = document.getElementById("time");
let sessionIcon = document.getElementById("am-pm-logo");
let cityImg = document.getElementById("img-city");
let cityDate = document.getElementById("date");
//Weather report ID's
for (let i = 1; i <= 5; i++) {
  hourlyIcon.push(document.getElementById("weather-icon" + i));
  consecutiveFiveHrs.push(document.getElementById("hour-" + i));
  hourlyTemperature.push(document.getElementById("hourly-temperature-" + i));
}
//Temp, farenheit and other realted ID's
let temperatureInCelsius = document.getElementById("temperature");
let temperatureInFahrenheit = document.getElementById("fahrenheit");
let weatherHumidity = document.getElementById("humidity");
let weatherPrecipitation = document.getElementById("percipitation");
//Current status ID's
let currentIcon = document.getElementById("current-icon");
let currentTemperature = document.getElementById("current-temperature");
let currentText = document.getElementById("current-status");

// To change datalist element dynamically
let list = document.getElementById("cities");

//appending City Names to datalist
currentCityData.cityNames.forEach((city) => {
  let option = document.createElement("option");
  option.append(city.charAt(0).toUpperCase() + city.slice(1));
  list.appendChild(option);
});

/**
 * findIcon returns the path of the icon to be displayed based on temperature value
 * @param {number} matchingTemperature It compares the temperature value with the given condition
 *
 * @return {string} pathway to the icon to be displayed
 */
function findIcon(matchingTemperature) {
  if (matchingTemperature < 18) return imageFolderPath + "rainyIcon.svg";
  else if (matchingTemperature >= 18 && matchingTemperature <= 22)
    return imageFolderPath + "windyIcon.svg";
  else if (matchingTemperature >= 23 && matchingTemperature <= 29)
    return imageFolderPath + "cloudyIcon.svg";
  else return imageFolderPath + "sunnyIcon.svg";
}

/**
 * calculateSuccessiveHrsData is used to compute the consecutive hour
 * @param {void} null It has no arguments
 *
 * @return {void} It has no return type
 */
function calculateSuccessiveHrsData() {
  let initialTime = Number(fullTime[0]);
  let increamentValue = 1;
  for (let i = 0; i < currentCityData.getSuccessiveHrsTemp().length; i++) {
    let spaceBetweenTexts = " ";
    updatedTime = initialTime + increamentValue++;
    if (updatedTime > 12)
      hour[i] = updatedTime - 12 + spaceBetweenTexts + session;
    else if (updatedTime === 12) {
      session = session === "PM" ? " AM" : " PM";
      hour[i] = updatedTime + session;
    } else {
      hour[i] =
        updatedTime - 12
          ? updatedTime + spaceBetweenTexts + session
          : 12 + spaceBetweenTexts + session;
    }
  }
}

/**
 * updateWeatherReport is used to update the city Img,
 * current City weather data and consecutive hours weather report
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 */
function updateWeatherReports() {
  //To change the city logo
  cityImg.src = imageFolderPath + input + ".svg";

  //To change the current city weather report
  let cityTemperature = currentCityData.getTemperature();
  temperatureInCelsius.innerText = cityTemperature + " °C";
  temperatureInFahrenheit.innerText =
    (cityTemperature * (9 / 5) + 32).toFixed(1) + " °F";
  weatherHumidity.innerText = currentCityData.getHumidity();
  weatherPrecipitation.innerText = currentCityData.getPrecipitation();

  //To change successive weather reports
  currentText.innerText = "NOW";
  let actualTemperature = currentCityData.getTemperature();
  currentTemperature.innerText = actualTemperature;
  currentIcon.src = findIcon(actualTemperature);

  for (let i = 0; i < currentCityData.getSuccessiveHrsTemp().length; i++) {
    consecutiveFiveHrs[i].textContent = hour[i];
    let currentTemperature = currentCityData
      .getSuccessiveHrsTemp()
      [i].split("°")[0];
    hourlyTemperature[i].textContent = currentTemperature;
    hourlyIcon[i].src = findIcon(currentTemperature);
  }
}

/**
 * orderedWeatherReport is used to call two functions
 * calculateSuccessiveHrsData is used to calculate all the data need to be updated for successive hours
 * updateWeatherReports is used to update the UI with all computated data
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 */
function orderedWeatherReport() {
  calculateSuccessiveHrsData();
  updateWeatherReports();
}

/**
 * It is used to setValues to respective city selected by the user
 * @param {string} input It denotes the cityName input selected by user
 *
 * @return {void} It has no return type
 */
function setDataToSelectedCity(input) {
  currentCityData.setHumidity(input);
  currentCityData.setSuccessiveHrsTemp(input);
  currentCityData.setPrecipitation(input);
  currentCityData.setTemperature(input);
  currentCityData.setTimeZone(input);
}

/**
 * checkCityData function checks the input value and calls the respective function
 * to update the values
 * @param {void} null It has no arguments
 *
 * @return {void} It has no return type
 */
async function checkCityData() {
  input = rawInput.value.toLowerCase();
  clearInterval(myInterval);
  if (currentCityData.cityNames.includes(input)) {
    allCityWeatherReport[input].nextFiveHrs ?? (await getSuccessiveTemp(input));
    setDataToSelectedCity(input);
    currentCityData.updateTimeAndDate();
    myInterval = setInterval(currentCityData.updateTimeAndDate, 1000);
    if (document.getElementById("errorMsg")) clearCityNameErrorMsg();
  } else {
    displayWarnings();
  }
}

/**
 * This function is used to remove the City Name Error Msg after few seconds
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 */
function clearCityNameErrorMsg() {
  let citySelector = document.querySelector(".header");
  citySelector.removeChild(citySelector.firstElementChild);
}

/**
 * displayWarnings is used to display NIL values & shows warning when the user input
 * doesn't match the city with no return type
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 */
function displayWarnings() {
  cityImg.src =
    sessionIcon.src =
    currentIcon.src =
      imageFolderPath + "warning.svg";
  currentText.innerText =
    currentTemperature.innerText =
    cityTime.innerText =
    cityDate.innerText =
    temperatureInCelsius.innerText =
    weatherHumidity.innerText =
    temperatureInFahrenheit.innerText =
    weatherPrecipitation.innerText =
      warningText;

  hourlyIcon.forEach((element) => {
    element.src = imageFolderPath + "warning.svg";
  });

  consecutiveFiveHrs.forEach((element) => {
    element.textContent = warningText;
  });

  hourlyTemperature.forEach((element) => {
    element.textContent = warningText;
  });

  if (!document.getElementById("errorMsg")) {
    cityNameErrorMsg = document.createElement("div");
    cityNameErrorMsg.setAttribute("id", "errorMsg");
    cityNameErrorMsg.style = "color: red";
    cityNameErrorMsg.append("Enter a valid City Name");
    rawInput.parentNode.insertBefore(cityNameErrorMsg, rawInput);
  }
}

window.onload = checkCityData();
