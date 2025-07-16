import "./styles/global.css";
import { svgs } from "./svg.js";
const APIKEY = "3HXW7VSTW8PT22AYJVU6ZKY35";
let city = "dhaka";

const locationDropdownToggle = document.querySelector(
    ".location-dropdown-toggle"
);
const locationDropdown = document.querySelector(".location-dropdown");

locationDropdownToggle.addEventListener("click", () => {
    locationDropdown.classList.toggle("hidden");
});

async function fetchWeatherData() {
    return await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=${APIKEY}&contentType=json`,
        { mode: "cors" }
    );
}

async function getWeatherData() {
    try {
        const response = await fetchWeatherData();
        if (!response.ok) {
            throw new Error("Resposne not OK");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

const weatherData = await getWeatherData();
console.log(weatherData);

const address = document.querySelector(".address");
const currentWeatherIcon = document.querySelector(".current-weather-icon-div");
const weatherIcon = svgs[weatherData.currentConditions.icon];
const currentTemp = document.querySelector(".current-temp");
const currentConditions = document.querySelector(".current-conditions");
const minTemp = document.querySelector(".min-temp-value");
const maxTemp = document.querySelector(".max-temp-value");
const feelsLike = document.querySelector(".feels-like-value");

currentWeatherIcon.innerHTML += weatherIcon;
address.innerHTML += weatherData.resolvedAddress;
currentTemp.innerHTML += `${weatherData.currentConditions.temp}&deg;`;
currentConditions.innerHTML += `${weatherData.currentConditions.conditions}`;

minTemp.innerHTML += `${weatherData.days[0].tempmin}&deg`;
maxTemp.innerHTML += `${weatherData.days[0].tempmax}&deg`;
feelsLike.innerHTML += `${weatherData.currentConditions.feelslike}&deg;`;

const sunriseValue = document.querySelector(".sunrise-value");
const rainValue = document.querySelector(".rain-value");
const humidityValue = document.querySelector(".humidity-value");
const windSpeedValue = document.querySelector(".wind-speed-value");
const pressureValue = document.querySelector(".pressure-value");
const sunsetValue = document.querySelector(".sunset-value");
const windDirectionValue = document.querySelector(".wind-direction-value");
const uvValue = document.querySelector(".uv-value");

sunriseValue.innerHTML += weatherData.currentConditions.sunrise;
sunsetValue.innerHTML += weatherData.currentConditions.sunset;
rainValue.innerHTML += `${weatherData.currentConditions.precipprob}%`;
humidityValue.innerHTML += `${weatherData.currentConditions.humidity}%`;
pressureValue.innerHTML += `${weatherData.currentConditions.pressure} mb`;
windSpeedValue.innerHTML += `${weatherData.currentConditions.windspeed} mph`;
windDirectionValue.innerHTML += `${weatherData.currentConditions.winddir}&deg;`;
uvValue.innerHTML += `${weatherData.currentConditions.uvindex}`;
