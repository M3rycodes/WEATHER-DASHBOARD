document.addEventListener("DOMContentLoaded", () => {
  const cityInput = document.querySelector(".city-input");
  const searchButton = document.querySelector("#search-btn");
  const locationButton = document.querySelector(".location-btn");
  const currentWeatherDiv = document.querySelector(".current-weather");
  const weatherCardsDiv = document.querySelector(".weather-cards");
  const searchHistoryList = document.querySelector("#search-history-list");

  const openWeatherMapApiKey = "2e5b577b362fd1ffde0a1b2d51cc1cc8";

  async function fetchWeatherData(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${openWeatherMapApiKey}`);
        if (!response.ok) {
            throw new Error("Weather data not available");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

  function displayCurrentWeather(weatherData) {
      const currentWeather = weatherData.list[0];
      const cityName = weatherData.city.name;
      const date = new Date(currentWeather.dt * 1000).toLocaleDateString("en-US");
      const weatherIconUrl = `https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`;
      const temperature = currentWeather.main.temp;
      const humidity = currentWeather.main.humidity;
      const windSpeed = currentWeather.wind.speed;

      document.querySelector(".city-name").textContent = cityName;
      document.querySelector(".date").textContent = date;
      document.querySelector(".weather-icon").src = weatherIconUrl;
      document.querySelector(".temperature").textContent = `Temperature: ${temperature}°C`;
      document.querySelector(".humidity").textContent = `Humidity: ${humidity}%`;
      document.querySelector(".wind-speed").textContent = `Wind Speed: ${windSpeed} M/S`;
  }

  function displayForecast(weatherData) {
      weatherCardsDiv.innerHTML = "";
      const forecast = weatherData.list.filter((_, index) => index % 8 === 0); // 8 intervals per day

      forecast.forEach(day => {
          const weatherCard = document.createElement("li");
          weatherCard.classList.add("card");

          const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString("en-US", {
              weekday: "long",
          });
          const weatherIconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;
          const temperature = day.main.temp;
          const windSpeed = day.wind.speed;
          const humidity = day.main.humidity;

          weatherCard.innerHTML = `
              <h3>${dayOfWeek}</h3>
              <img src="${weatherIconUrl}" alt="weather-icon">
              <h4>Temperature: ${temperature}°C</h4>
              <h4>Wind: ${windSpeed} M/S</h4>
              <h4>Humidity: ${humidity}%</h4>
          `;

          weatherCardsDiv.appendChild(weatherCard);
      });
  }

  function addCityToSearchHistory(cityName) {
      const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      if (!searchHistory.includes(cityName)) {
          searchHistory.push(cityName);
          localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
          renderSearchHistory();
      }
  }

  function renderSearchHistory() {
      const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
      searchHistoryList.innerHTML = "";
      searchHistory.forEach(cityName => {
          const li = document.createElement("li");
          li.textContent = cityName;
          li.addEventListener("click", async () => {
              const weatherData = await fetchWeatherData(cityName);
              displayCurrentWeather(weatherData);
              displayForecast(weatherData);
          });
          searchHistoryList.appendChild(li);
      });
  }

  searchButton.addEventListener("click", async () => {
      const cityName = cityInput.value;
      if (cityName) {
          const weatherData = await fetchWeatherData(cityName);
          if (weatherData) {
              displayCurrentWeather(weatherData);
              displayForecast(weatherData);
              addCityToSearchHistory(cityName);
          }
      }
  });

  locationButton.addEventListener("click", async () => {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async position => {
              const { latitude, longitude } = position.coords;
              try {
                  const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${openWeatherMapApiKey}`);
                  if (!response.ok) {
                    throw new Error("Weather data not available");
                } 
                  const weatherData = await response.json();
                  displayCurrentWeather(weatherData);
                  displayForecast(weatherData);
                  addCityToSearchHistory(weatherData.city.name);
              } catch (error) {
                  console.error("Error fetching weather data:", error);
              }
          });
      }
  });

  renderSearchHistory();
});
