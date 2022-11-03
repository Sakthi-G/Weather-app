var cardControllerValue = 4,
  iconSelected,
  cardsIcon,
  cardIconPath = "./assets/",
  cardTimeInterval = [];

let sunIcon = document.getElementById("sun-icon");
sunIcon.addEventListener("click", () => {
  updateCardsBasedOnIcon("sun");
});

let snowIcon = document.getElementById("snow-icon");
snowIcon.addEventListener("click", () => {
  updateCardsBasedOnIcon("snow");
});

let rainyIcon = document.getElementById("rain-icon");
rainyIcon.addEventListener("click", () => {
  updateCardsBasedOnIcon("rain");
});

let cardCounter = document.getElementById("spinner");
cardCounter.addEventListener("change", () => {
  changeCardCountValue();
});

let cardsContainer = document.getElementById("card-holder");
let cardHolder = document.getElementById("multiple-cards");

/**
 * This function is used to sort the cities based on the criteria provided as input
 * on descending order
 * @param {Array} citiesArray It is array of cities
 * @param {string} criteria It denotes the parameter to which the array has to be sorted
 *
 * @return {Array} returns the sorted array
 */
function sortCitiesDescendingBasedOnCriteria(citiesArray, criteria) {
  citiesArray.sort(function (a, b) {
    return parseInt(b[criteria]) - parseInt(a[criteria]);
  });
  return citiesArray;
}

/**
 * This function is used to sort the cities based on the criteria provided as input
 * on ascending order
 * @param {Array} citiesArray It is array of cities
 * @param {string} criteria It denotes the parameter to which the array has to be sorted
 *
 * @return {Array} returns the sorted array
 */
function sortCitiesAscendingBasedOnCriteria(citiesArray, criteria) {
  citiesArray.sort(function (a, b) {
    return parseInt(a[criteria]) - parseInt(b[criteria]);
  });
  return citiesArray;
}

/**
 * @class cardWeatherReport which consists of functions and variables
 * which based on filtered value
 * @extends {weatherDetails} It acts as a parent class
 */
class cardWeatherReport extends weatherDetails {
  constructor() {
    super();
    this.updateCardTime = function (cardDetails) {
      cardLiveTime(cardDetails);
    };

    this.sunnyCities = this.weatherInfo.filter(
      (value) =>
        parseInt(value.temperature) > 29 &&
        parseInt(value.humidity) < 50 &&
        parseInt(value.precipitation) >= 50
    );

    this.snowCities = this.weatherInfo.filter(
      (value) =>
        parseInt(value.temperature) >= 20 &&
        parseInt(value.temperature) <= 28 &&
        parseInt(value.humidity) > 50 &&
        parseInt(value.precipitation) < 50
    );

    this.rainyCities = this.weatherInfo.filter(
      (value) =>
        parseInt(value.temperature) < 20 && parseInt(value.humidity) >= 50
    );
  }
}
var cardCityDetails = new cardWeatherReport();

let sunnyCities = sortCitiesDescendingBasedOnCriteria(
  cardCityDetails.sunnyCities,
  "temperature"
);
let snowCities = sortCitiesDescendingBasedOnCriteria(
  cardCityDetails.snowCities,
  "precipitation"
);
let rainyCities = sortCitiesDescendingBasedOnCriteria(
  cardCityDetails.rainyCities,
  "humidity"
);

/**
 * makeContainerEmpty is used to empty the cards container
 * when number of cards are increased.
 * @param {void} null It accepts no parameter
 *
 * @return {void} It has no return type
 */
function makeContainerEmpty() {
  cardsContainer.innerHTML = null;
}

/**
 * This function is used to remove the border for the respective element
 * @param {string} element It accepts the element in which the border has to be removed
 * @param {string} property It accepts the property to be removed
 *
 * @return {void} It has no return type
 */
function removeStyling(element, property) {
  element.classList.remove(property);
}

/**
 * updateCardsBasedOnIcon function used to style the icon selected and update the cards-container
 * based on user's input
 * @param {string} climate stores the value of selected icon for further processing
 *
 * @return {void} It has no return type
 */
function updateCardsBasedOnIcon(climate) {
  switch (climate) {
    case "sun":
      sunIcon.classList.add("selected-icon");
      [snowIcon, rainyIcon].forEach((item) => {
        removeStyling(item, "selected-icon");
      });
      iconSelected = "sun";
      cardsIcon = cardIconPath + "sunnyIcon.svg";
      makeContainerEmpty();
      updateCards(sunnyCities);
      break;
    case "snow":
      snowIcon.classList.add("selected-icon");
      [sunIcon, rainyIcon].forEach((item) => {
        removeStyling(item, "selected-icon");
      });
      iconSelected = "snow";
      cardsIcon = cardIconPath + "snowflakeIcon.svg";
      makeContainerEmpty();
      updateCards(snowCities);
      break;
    case "rain":
      rainyIcon.classList.add("selected-icon");
      [snowIcon, sunIcon].forEach((item) => {
        removeStyling(item, "selected-icon");
      });
      iconSelected = "rain";
      cardsIcon = cardIconPath + "rainyIcon.svg";
      makeContainerEmpty();
      updateCards(rainyCities);
      break;
  }
}
/**
 * This function is used to display warning for card counter,
 * when user input is out of range
 * @param {void} null It has no input parameters
 *
 * @return {void} It has no return type
 *
 */
function displayWarningForCardCount() {
  cardCounter.setCustomValidity("Please enter number from 3 to 10");
  cardCounter.reportValidity();
}

/**
 * changeCardCountValue function is used to track the value provided in the controller
 * @param {void} null It has no input value
 *
 * @return {void} It has no return type
 */
function changeCardCountValue() {
  if (cardCounter.value < 3) {
    displayWarningForCardCount();
    cardCounter.value = cardControllerValue = cardCounter.min;
  } else if (cardCounter.value > 10) {
    displayWarningForCardCount();
    cardCounter.value = cardControllerValue = cardCounter.max;
  } else {
    cardControllerValue = cardCounter.value;
  }

  makeContainerEmpty();
  if (iconSelected === "sun") {
    updateCards(sunnyCities);
  } else if (iconSelected === "snow") {
    updateCards(snowCities);
  } else {
    updateCards(rainyCities);
  }
}

/**
 * generateElements is used to generate new elements with its respective attributeType,
 * attributeName, number of attributes to be created, contents to be appended to the element (if any),
 * img srouce to be appended (if any) & img alternative text to be set (if any).
 *
 * It returns the newly generated elements with its own properties.
 * @param {string} element It is the element to be created
 * @param {string} attributeType It is the attributeType to be set
 * @param {string} attributeName It is the attributeName to be appended
 * @param {number} [count=1] It denotes the number of attributes to be created
 * @param {string} [content=null] It denotes the content to be appened with the element
 * @param {string} [sourcePath=null] It denotes the img source path
 * @param {string} [alternativeText=null] It denotes the img alternative text
 *
 * @return {object} It return the newly created element
 */
function generateElements(
  element,
  attributeType,
  attributeName,
  count = 1,
  content = null,
  sourcePath = null,
  alternativeText = null
) {
  let newElement = document.createElement(element);
  for (let i = 0; i < count; i++) {
    if (count > 1) newElement.setAttribute(attributeType[i], attributeName[i]);
    else newElement.setAttribute(attributeType, attributeName);
  }
  if (content) newElement.append(content);

  if (sourcePath && alternativeText) {
    newElement.src = sourcePath;
    newElement.alt = alternativeText;
  }

  return newElement;
}

/**
 *updateCards function is used to change values of cards dynamically
 * @param {Array} cities array of city name and its properties
 *
 * @return {void} It has no return type
 */
function updateCards(cities) {
  cardTimeInterval.forEach((item) => {
    clearInterval(item);
  });
  for (let i = 0; i < cardControllerValue; i++) {
    if (i < cities.length) {
      let attributeTypes = ["class", "style"];
      let attributeNames = [
        "cards",
        `background-image: url('${cardIconPath}${cities[
          i
        ].cityName.toLowerCase()}.svg')`,
      ];

      let cardDiv = generateElements(
        "div",
        attributeTypes,
        attributeNames,
        attributeTypes.length
      );
      let cardDataDiv = generateElements("div", "class", "cards-weather-data");
      let cardHeading = generateElements(
        "p",
        "class",
        "card-data",
        1,
        cities[i].cityName
      );
      let cardCityTimeHolder = generateElements("p", "class", "card-data");
      cardCityDetails.updateCardTime(cities[i].cityName.toLowerCase());
      let cityTime = `<time id = "card-time${i}">
      ${
        cardFullTime[0] +
        ":" +
        cardFullTime[1] +
        " " +
        "<small>" +
        cardFullTime[2].split(" ")[1] +
        "</small>"
      }
      </time>`;
      cardCityTimeHolder.innerHTML += cityTime;

      cardCityDetails.setTimeZone(cities[i].cityName.toLowerCase());
      let cityDate = {
        currentDate: new Date().toLocaleDateString("en-US", {
          timeZone: cardCityDetails.getTimeZone(),
        }),
      };
      let cardCityDateHolder = generateElements(
        "p",
        "class",
        "card-data",
        1,
        liveDate.call(cityDate)
      );
      let humidityIconHolder = generateElements(
        "p",
        "class",
        "cards-weather-icons"
      );
      let humidityIcon = `<img class = "icons" 
      src="${cardIconPath}humidityIcon.svg" alt="humidity-icon" 
      title="Humidity Icon">${cities[i].humidity}`;
      humidityIconHolder.innerHTML = humidityIcon;

      let precipitationIconHolder = generateElements(
        "p",
        "class",
        "cards-weather-icons"
      );
      let precipitationIcon = `<img class = "icons" 
      src = "${cardIconPath}precipitationIcon.svg"
       alt ="precipitation-icon"  title="Precipitation Icon">${cities[i].precipitation}`;
      precipitationIconHolder.innerHTML = precipitationIcon;

      let backgroundImageDiv = generateElements(
        "div",
        "class",
        "cards-bg-image"
      );
      let cardIconHeading = generateElements("p", "class", "heading-icon");
      let weatherIcon = `<img class = "icons" 
      src = ${cardsIcon} alt ="weather-icon">${cities[i].temperature}`;
      cardIconHeading.innerHTML = weatherIcon;

      cardTimeInterval.push(
        setInterval(() => {
          cardCityDetails.updateCardTime(cities[i].cityName.toLowerCase());
          document.getElementById("card-time" + i).innerHTML =
            cardFullTime[0] +
            ":" +
            cardFullTime[1] +
            " " +
            "<small>" +
            cardFullTime[2].split(" ")[1] +
            "</small>";
        }, 1000)
      );

      (() => {
        cardsContainer.appendChild(cardDiv);
        cardDiv.appendChild(cardDataDiv);
        cardDataDiv.appendChild(cardHeading);
        cardDataDiv.appendChild(cardCityTimeHolder);
        cardDataDiv.appendChild(cardCityDateHolder);
        cardDataDiv.appendChild(humidityIconHolder);
        cardDataDiv.appendChild(precipitationIconHolder);
        cardDiv.appendChild(backgroundImageDiv);
        backgroundImageDiv.appendChild(cardIconHeading);
      })();
    }
  }
}

document.getElementById("left-arrow").addEventListener("click", () => {
  cardHolder.scrollLeft -=
    document.getElementsByClassName("cards")[0].clientWidth +
    (3 / 100) * cardHolder.clientWidth;
});

document.getElementById("right-arrow").addEventListener("click", () => {
  cardHolder.scrollLeft +=
    document.getElementsByClassName("cards")[0].clientWidth +
    (3 / 100) * cardHolder.clientWidth;
});

/**
 *setCarousel is used to display arrow icons based on screen resolution &
 * number of cards.
 * @param {void} null It has no arguments
 *
 * @return {void} It has no return type
 */
var setCarousel = () => {
  if (cardHolder.clientWidth < cardHolder.scrollWidth) {
    document.getElementById("left-arrow").style = "display: block";
    document.getElementById("right-arrow").style = "display:block";
  } else {
    document.getElementById("left-arrow").style = "display: none";
    document.getElementById("right-arrow").style = "display:none";
  }
  return setTimeout(setCarousel);
};
setTimeout(setCarousel, 1000);

/**
 *liveDate is used to display the live date
 * @param {string} entry It denotes the the date
 *
 * @return {string} returns a date which is in ordered format
 */
function liveDate() {
  let month, day, year;
  month = findMonth(new Date(this.currentDate.split("/")[0]));
  day = this.currentDate.split("/")[1];
  year = this.currentDate.split("/")[2];
  return day + "-" + month + "-" + year;
}

window.onload = updateCardsBasedOnIcon("sun");
