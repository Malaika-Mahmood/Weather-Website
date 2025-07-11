const iconElement = document.querySelector(".weatherIcon");
const weatherNotification = document.querySelector(".notification");
const weatherTemperature = document.querySelector(".TemperatureValue");
const weatherDescription = document.querySelector(".TemperatureDescription");
const Location = document.querySelector(".location");

// App Data
const weather = {};
weather.temperature = { unit: "celsius" };

// Constants
const KELVIN = 273;
const key = "82005d27a116c2880c8f0fcb866998a0"; // OpenWeatherMap API Key

// Check if browser supports geolocation
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    weatherNotification.style.display = "block";
    weatherNotification.innerHTML = "<p>Browser does not support Geolocation</p>";
}

// Set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

// Handle geolocation errors
function showError(error) {
    weatherNotification.style.display = "block";
    weatherNotification.innerHTML = `<p>${error.message}</p>`;
}

// Fetch weather data from API
function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
        .then(response => response.json()) // Properly return JSON
        .then(data => {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN); // Convert Kelvin to Celsius
            weather.iconId = data.weather[0].icon;
            weather.description = data.weather[0].description; // Fix for undefined description
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(() => {
            displayWeather();
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            weatherNotification.style.display = "block";
            weatherNotification.innerHTML = `<p>Failed to fetch weather data</p>`;
        });
}

// Display weather data in the UI
function displayWeather() {
   
    
    weatherTemperature.innerHTML = `${weather.temperature.value} °<span>c</span>`;
    weatherDescription.innerHTML = weather.description; // Fixed property name
    Location.innerHTML = `${weather.city}, ${weather.country}`;
}

function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

weatherTemperature.addEventListener("click", function () {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        weatherTemperature.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        weatherTemperature.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});
