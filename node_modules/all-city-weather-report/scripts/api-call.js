//DOM Elements
let bodyElement = document.querySelector("body");
let loadingScreen = document.createElement("div");
let citySection = document.getElementById("top-section");
loadingScreen.setAttribute("class", "loading-screen");
citySection.parentNode.insertBefore(loadingScreen, citySection);

var allCityWeatherReport = {};

scriptsArray = [
  "./scripts/live-time.js",
  "./scripts/top-section.js",
  "./scripts/middle-section.js",
  "./scripts/bottom-section.js",
];

/**
 * This function is used to fetch initial weather report from server
 * @param {void} null It has no input parameters
 *
 * @return {Array} It returns weather report
 */
function requestWeatherDetails() {
  let weatherReport = new Promise((resolve, reject) => {
    fetch("http://localhost:9999/all-timezone-cities", {
      method: "GET",
    })
      .then((weatherResult) => {
        resolve(weatherResult.json());
      })
      .catch((errorMsg) => {
        reject(errorMsg);
      });
  });
  return weatherReport;
}

/**
 * This function is used to fetch Date, Time along with City Name from server
 * @param {string} cityName It denotes the city name
 *
 * @return {object} It returns date, time along with city name
 */
async function requestDateAndTime(cityName) {
  try {
    let dateAndTimeResult = await fetch(
      `http://localhost:9999?city=${cityName}`,
      {
        method: "GET",
      }
    );
    return dateAndTimeResult.json();
  } catch (error) {
    console.log("Error: " + error.message);
  }
}

/**
 * This function is useed to fetch next(N)hrs temperature from server
 * @param {string} dateAndTime It denotes the date and time of city fetched from previous api (?city=${cityName})
 * @param {number} hrs It denotes the number of hours required
 *
 * @return {object} It returns temperature for the specified hours
 */
async function requestConsecutiveTemperature(dateAndTime, hrs) {
  let consecutiveHrsResult = await fetch(
    "http://localhost:9999/hourly-forecast",
    {
      method: "POST",
      body: JSON.stringify({
        city_Date_Time_Name: dateAndTime,
        hours: hrs,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return consecutiveHrsResult.json();
}

/**
 * It is used to convert array elements into object
 * @param {Array} citiesArray It denotes the array to be converted
 * @param {string} key It denotes the key to be inserted to new object
 *
 * @return {object} It returns the newly formed object
 */
let arrayToObj = (citiesArray, key) => {
  return citiesArray.reduce((citiesObject, cityDetails) => {
    citiesObject[cityDetails[key].toLowerCase()] = cityDetails;
    return citiesObject;
  }, {});
};

/**
 * this function is used to call the api (/all-timezone-cities) to get initial weather data
 * which includes City Name, Temperature, Humidity, Date and Time & TimeZone
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 */
async function getInitialWeatherReport() {
  let weatherData = await requestWeatherDetails();
  allCityWeatherReport = arrayToObj(weatherData, "cityName");
  addScriptFiles();
}

/**
 * This function is used to call the api (?city=${cityName}) to get date and time of requested city
 * and invoke another api (/hourly-forecast) to get successive hours temperature based on output from previous api
 * @param {string} city It has no input parameters
 *
 * @return {void} It has no return type
 */
async function getSuccessiveTemp(city) {
  cityDateTimeName = await requestDateAndTime(
    allCityWeatherReport[city].cityName
  );
  successiveHrsData = await requestConsecutiveTemperature(
    cityDateTimeName.city_Date_Time_Name,
    6
  );
  allCityWeatherReport[city].nextFiveHrs = await successiveHrsData.temperature;
}

window.onload = getInitialWeatherReport();

/**
 * It is used to load all the script files
 * @param {void} null It has no input parameters
 *
 * @return {void} It exits out of the function when there no more script files available to load
 */
function addScriptFiles() {
  let scriptFile = scriptsArray.shift();
  if (!scriptFile) {
    setTimeout(removeLoadingScreen, 1000);
    return;
  }
  let loadingScript = document.createElement("script");
  loadingScript.src = scriptFile;
  loadingScript.onload = onScriptLoaded;
  let parentScript = document.getElementsByTagName("script")[0];
  parentScript.parentNode.insertBefore(loadingScript, parentScript.nextSibling);

  /**
   * It is a call back function which is used to call
   * addScriptFiles function when one script is loaded
   */
  function onScriptLoaded() {
    addScriptFiles();
  }
}

/**
 * It is used to remove the loading screen when all the data is fetched from server
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 */
function removeLoadingScreen() {
  bodyElement.removeChild(bodyElement.firstElementChild);
}

//It updates the timeline weather report for every hour
setInterval(() => {
  getInitialWeatherReport();
  checkCityData();
}, 3600000);
