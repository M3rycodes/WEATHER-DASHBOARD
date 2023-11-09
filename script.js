const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards"); // Added missing variable
const searchHistoryList = document.getElementById("search-history-list");
const searchHistory = [];

const API_KEY = "9da25984643beac3e1384f5968baf23a"; // API Key for OpenWeatherMap API

const  createWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0) {
    return `<div class="details">
    <h3> ${cityName} (${weatherItem.dt_txt.split(" ") [0]}) </h3>
    <h4> Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h4>
    <h4> Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4> Humidity: ${weatherItem.main.humidity}%</h4>
    </div>
    <div class="icon"><img src=src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
      <h4>${weatherItem.weather[0].description}</h4>
      </div>`;
} else {
    return `<li class="card">
      <h2>(${weatherItem.dt_txt.split(" ") [0]})</h2>
      <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0]})</h2>
        <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}ºC</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/S </h4>
        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
       </li> `;
   }
};

const displaySearchHistory = () => {
    searchHistoryList.innerHTML = "";
    searchHistory.forEach((city) => {
      const li = document.createElement("li");
      li.textContent = city;
      li.addEventListener("click", () => getCityCoordinates(city));
      searchHistoryList.appendChild(li);
    });
  };
  

const getWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
       const uniqueForecastDays = [];
       const fiveDaysForecast = data.list.filter(forecast => {
           const forecastDate = new Date(forecast.dt_txt).getDate();
           if(!uniqueForecastDays.includes(forecastDate)) {
            return uniqueForecastDays.push(forecastDate);
          }
        });

        cityInput.value= "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        
        
        fiveDaysForecast.forEach((weatherItem, index) => {
           const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });        
    }).catch(() => {
        alert("An error occured while fetching the weather forecast!");
    });
}   

const getCityCoordinates = (cityName) => {
    const cityNameToSearch= cityName ||  cityInput.value.trim();
    if(!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, latitude, longitude} = data[0];

        searchHistory.push(cityName);
        
        displaySearchHistory();

        getWeatherDetails(name, latitude, longitude);
    }).catch(() => {
        alert("An error occured while fetching the coordinates!");
    });
};

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const{ latitude, longitude } = position.coords;
            const API_URL= `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
              fetch(API_URL).then(res => ResizeObserver.json()).then(data => {
                const {name} = data[0];
                getWeatherDeatails(name, latitude, longitude);
              }).catch(() => {
                 alert("An error occured while fetching the city name!");
              });
        },
        error => {
            if(error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            } else {
                alert("Geolocation request error. Please reset location permission.");
            }
        });
}    
        
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter"  && getCityCoordinates());
