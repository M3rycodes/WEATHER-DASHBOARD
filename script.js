const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector("#search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");

const openWeatherMapApiKey = '"9da25984643beac3e1384f5968baf23a"';

async function searchCity(cityName) {
  try {
    const geocoordinates = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=New York&limit=36&appid=${openWeatherMapApiKey}`
    );
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${openWeatherMapApiKey}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

const loadingIndicator = document.createElement("div");
loadingIndicator.classList.add("loading-indicator");
loadingIndicator.textContent = "Loading...";
document.body.appendChild(loadingIndicator);

// Remove the loading indicator.
document.body.removeChild(loadingIndicator);

const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}.png`;
};

function displayCityWeather(weatherData) {
  const cityName = weatherData.name;
  const date = new Date();
  const weatherIconUrl = getWeatherIconUrl(weatherData.weather[0].icon);
  const temperature = weatherData.main.temp;
  const humidity = weatherData.main.humidity;
  const windSpeed = weatherData.wind.speed;

  // Display the weather data on the page.
  document.querySelector(".city-name").textContent = cityName;
  document.querySelector(".date").textContent =
    date.toLocaleDateString("en-US");
  document.querySelector(".weather-icon").src = weatherIconUrl;

  document.querySelector(
    ".temperature"
  ).textContent = `Temperature: ${temperature}°C`;
  document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
  document.querySelector(
    ".wind-speed"
  ).textContent = `Wind Speed: ${windSpeed} M/S`;
}
// Make an API call to OpenWeatherMap to get the weather data for the specified city.
const response = await fetch(
  `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherMapApiKey}`
);
const weatherData = await response.json();

// Get the temperature, wind speed, and humidity from the weather data.
const temperature = weatherData.main.temp;
const windSpeed = weatherData.wind.speed;
const humidity = weatherData.main.humidity;

// Display the city's name and current temperature
console.log(`${cityName} ${temperature}°C`);

// Display the weather icon
const weatherIcon = document.createElement("img");
const weatherIconUrl = getWeatherIconUrl(weatherData.weather[0].icon);
weatherIcon.src = weatherIconUrl;
document.querySelector(".current-weather").appendChild(weatherIcon);

// Create a function to add a city to the search history.
function addCityToSearchHistory(cityName) {
  const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  searchHistory.push(cityName);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}

// Add an event listener to the search button to call the searchCity() function and add the city to the search history.
searchButton.addEventListener("click", async () => {
  const cityName = cityInput.value;
  const weatherData = await searchCity(cityName);
  displayCityWeather(weatherData);
  addCityToSearchHistory(cityName);
});

// 5-Day Forecast
const forecast = weatherData.forecast.daily;
const weatherCards = document.querySelector(".weather-cards");
weatherCards.innerHTML = "";

for (const day of forecast) {
  const weatherCard = document.createElement("li");
  weatherCard.classList.add("card");

  // Display the day of the week on the weather card.
  const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString("en-US", {
    weekday: "long",
  });
  weatherCard.innerHTML = +`<h3>${dayOfWeek}</h3>`;

  // Display the weather icon on the weather card.
  const weatherIconUrl = getWeatherIconUrl(day.weather[0].icon);
  weatherCard.innerHTML += `<img src="${weatherIconUrl}" alt="weather-icon">`;

  // Display the temperature on the weather card.
  weatherCard.innerHTML += `<h4>Temperature: ${day.temp.day}ºC</h4>`;

  // Display the wind speed on the weather card.
  weatherCard.innerHTML += `<h4>Wind: ${day.wind_speed} M/S</h4>`;

  // Display the humidity on the weather card.
  weatherCard.innerHTML += `<h4>Humidity: ${day.humidity}%</h4>`;

  // Append the weather card to the list of weather cards.
  weatherCards.appendChild(weatherCard);
}

searchButton.addEventListener("click", async () => {
  const cityName = cityInput.value;
  const weatherData = await searchCity(cityName);
  displayCityWeather(weatherData);
  addCityToSearchHistory(cityName);
});
