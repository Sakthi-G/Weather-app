var month, day, year;

/**
 * findMonth function converts number to its respective month name
 * @param {number} dt It holds the values of month number
 *
 * @return {string} month name
 */
function findMonth(dt) {
  let monthList = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "JUly",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return monthList[dt.getMonth()];
}

/**
 * liveDateAndTime function fetches the live time & date using city timezone
 * @param {void} null It has no input parameters
 *
 * @return {null} liveTime stops running when the input is empty/not matched
 */
function liveDateAndTime() {
  let currentTime = new Date().toLocaleString("en-US", {
    timeZone: currentCityData.getTimeZone(),
  });

  let timing = currentTime.split(",")[1].trim().split(" ")[0];
  fullTime = timing.split(":");
  time.innerHTML =
    fullTime[0] +
    ":" +
    fullTime[1] +
    ":" +
    "<small>" +
    fullTime[2] +
    "</small>";

  //To check session is "AM" or "PM"
  session = currentTime.split(",")[1].trim().split(" ")[1];
  if (session === "PM") sessionIcon.src = "./assets/pmState.svg";
  else sessionIcon.src = "./assets/amState.svg";

  //To fetch the date and store it in separate variable
  let currentDate = currentTime.split(",")[0];
  month = findMonth(new Date(currentDate.split("/")[0]));
  day = currentDate.split("/")[1];
  year = currentDate.split("/")[2];
  updateCityDate();
  orderedWeatherReport();
}

/**
 * cardLiveTime is used to fetch the time of the current card city
 * @param {string} cardInput It is the current card city name which is used to fetch the time
 *
 * @return {void} It has no return type
 */
function cardLiveTime(cardInput) {
  cardCityDetails.setTimeZone(cardInput);
  let cardTime = new Date().toLocaleTimeString("en-US", {
    timeZone: cardCityDetails.getTimeZone(),
  });
  cardFullTime = cardTime.split(":");
}

/**
 * updateCityAndTime is used to update the current city time and date
 * @param {void} null It has no arguments
 *
 * @return {void} It has no return type
 */
function updateCityDate() {
  date.innerText = day + "-" + month + "-" + year;
}
