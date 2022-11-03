var continentUpArrowText = "continent-up-arrow",
  continentDownArrowText = "continent-down-arrow",
  temperatureUpArrowText = "temperature-up-arrow",
  temperatureDownArrowText = "temperature-down-arrow",
  upArrowImage = "./assets/arrowUp.svg",
  downArrowImage = "./assets/arrowDown.svg",
  continentsInAscendingOrder,
  continentsInDescendingOrder,
  temperaturesInAscendingOrder,
  temperaturesInDescendingOrder,
  bottomCardsInterval = [];

continentsInAscendingOrder = cardCityDetails.weatherInfo.concat();
continentsInDescendingOrder = cardCityDetails.weatherInfo.concat();

//Bottom Container & sorting button ID's
let bottomCardsContainer = document.getElementById("bottom-card-container");
let continentSortingButton = document.getElementById("continent-sort-button");
let temperatureSortingButton = document.getElementById(
  "temperature-sort-button"
);

continentsInAscendingOrder.sort(function (a, b) {
  let timeZone1 = a.timeZone,
    timeZone2 = b.timeZone;

  if (timeZone1 > timeZone2) return 1;
  if (timeZone1 < timeZone2) return -1;
  return 0;
});

continentsInDescendingOrder.sort(function (a, b) {
  let timeZone1 = b.timeZone,
    timeZone2 = a.timeZone;

  if (timeZone1 > timeZone2) return 1;
  if (timeZone1 < timeZone2) return -1;
  return 0;
});

/**
 *cardsSort is used to sort the subset of cards using tempertaure, when Continent Name is same
 * @param {Array} temperatureData is used to fetch the array passed
 *
 * @return {Array} returns sorted array
 */
function cardsSort(temperatureData) {
  temperatureData.sort(function (a, b) {
    if (temperatureSortingButton.alt === temperatureUpArrowText) {
      if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
        let firstTemperature = parseInt(a.temperature),
          secondTemperature = parseInt(b.temperature);

        if (firstTemperature > secondTemperature) return 1;
        if (firstTemperature < secondTemperature) return -1;

        return 0;
      }
    } else {
      if (a.timeZone.split("/")[0] === b.timeZone.split("/")[0]) {
        let firstTemperature = parseInt(b.temperature),
          secondTemperature = parseInt(a.temperature);

        if (firstTemperature > secondTemperature) return 1;
        if (firstTemperature < secondTemperature) return -1;
        return 0;
      }
    }
  });
  return temperatureData;
}

/**
 * changeIconPathAndText is used to change the alternative text and
 * path of the Icon to be displayed with no return type
 * @param {string} type It is a string which is used to check the type of button to be changed
 * @param {string} content It is a string which describes the type of arrow
 *
 * @return {void} It has no return type
 */
function changeIconPathAndText(type, content) {
  if (type === "continent") {
    continentSortingButton.src =
      content === "up-arrow" ? downArrowImage : upArrowImage;
    continentSortingButton.alt =
      content === "up-arrow" ? continentDownArrowText : continentUpArrowText;
    continentSortingButton.title =
      content === "up-arrow"
        ? "Sort Cities in Ascending"
        : "Sort Cities in Descending";
  } else {
    temperatureSortingButton.src =
      content === "up-arrow" ? downArrowImage : upArrowImage;
    temperatureSortingButton.alt =
      content === "up-arrow"
        ? temperatureDownArrowText
        : temperatureUpArrowText;
    temperatureSortingButton.title =
      content === "up-arrow"
        ? "Sort Temperature's in Ascending"
        : "Sort Temperature's in Descending";
  }
}

continentSortingButton.addEventListener("click", () => {
  if (continentSortingButton.alt === continentUpArrowText) {
    changeIconPathAndText("continent", "up-arrow");
    continentsInDescendingOrder = cardsSort(continentsInDescendingOrder);
    updateBottomSectionCards(continentsInDescendingOrder);
  } else if (continentSortingButton.alt === continentDownArrowText) {
    changeIconPathAndText("continent", "down-arrow");
    temperaturesInAscendingOrder = cardsSort(continentsInAscendingOrder);
    updateBottomSectionCards(continentsInAscendingOrder);
  }
});

temperatureSortingButton.addEventListener("click", () => {
  if (continentSortingButton.alt === continentUpArrowText) {
    if (temperatureSortingButton.alt === temperatureUpArrowText) {
      changeIconPathAndText("temperature", "up-arrow");
      temperaturesInAscendingOrder = cardsSort(continentsInAscendingOrder);
      updateBottomSectionCards(temperaturesInAscendingOrder);
    } else {
      changeIconPathAndText("temperature", "down-arrow");
      temperaturesInDescendingOrder = cardsSort(continentsInAscendingOrder);
      updateBottomSectionCards(temperaturesInDescendingOrder);
    }
  } else {
    if (temperatureSortingButton.alt === temperatureUpArrowText) {
      changeIconPathAndText("temperature", "up-arrow");
      temperaturesInAscendingOrder = cardsSort(continentsInDescendingOrder);
      updateBottomSectionCards(temperaturesInAscendingOrder);
    } else {
      changeIconPathAndText("temperature", "down-arrow");
      temperaturesInDescendingOrder = cardsSort(continentsInDescendingOrder);
      updateBottomSectionCards(temperaturesInDescendingOrder);
    }
  }
});

/**
 * updateBottomSectionCards is used to change the value of cards based on userPreference
 * @param {Array} arrangeCity is used to fetch the array passed
 *
 * @return {void} It has no return type
 */
function updateBottomSectionCards(arrangeCity) {
  bottomCardsInterval.forEach((item) => {
    clearInterval(item);
  });
  bottomCardsContainer.innerHTML = null;
  for (let i = 0; i < 12; i++) {
    cardCityDetails.updateCardTime(arrangeCity[i].cityName.toLowerCase());
    bottomCardsContainer.innerHTML += `<div class = "container-contents">
      <p class = "continent">${arrangeCity[i].timeZone.split("/")[0]} </p>
      <p class = "card-temperature">${arrangeCity[i].temperature}</p>
      <p class = "city-time">${arrangeCity[i].cityName} ,
      <time id = "bottom-card-time${i}"> 
      ${
        cardFullTime[0] +
        ":" +
        cardFullTime[1] +
        " " +
        "<small>" +
        cardFullTime[2].split(" ")[1] +
        "</small>"
      }
      </time>
      </p>
      <p class = "bottom-card-humidity-value">
        <img class = "bottom-card-humidity-icon" src= "./assets/humidityIcon.svg"  title="Humidity Icon">${
          arrangeCity[i].humidity
        }
      </p>
    </div>`;

    bottomCardsInterval.push(
      setInterval(() => {
        cardCityDetails.updateCardTime(arrangeCity[i].cityName.toLowerCase());
        document.getElementById("bottom-card-time" + i).innerHTML =
          cardFullTime[0] +
          ":" +
          cardFullTime[1] +
          " " +
          "<small>" +
          cardFullTime[2].split(" ")[1] +
          "</small>";
      }, 1000)
    );
  }
}

//It ensures default order of bottom section cards when page loads
(function defaultSortingOfCards() {
  temperaturesInDescendingOrder = cardsSort(continentsInAscendingOrder);
  updateBottomSectionCards(temperaturesInDescendingOrder);
})();
