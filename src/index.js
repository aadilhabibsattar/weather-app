import "./styles/global.css";
import { svgs } from "./svg.js";
import { getGradient } from "./colors.js";
import {
    saveLocationsToStorage,
    loadLocationsFromLocalStorage,
} from "./storage.js";
import { formatToAmPm, formatHour, getDayOfWeek } from "./dates.js";

const APIKEY = "3HXW7VSTW8PT22AYJVU6ZKY35";
let location = "toronto";

let units = "metric";
let windSpeedUnit = "kph";

const errorMessageDiv = document.querySelector(".error-message");
const loadingOverlay = document.getElementById("loading-overlay");

const celsiusToggle = document.querySelector(".celsius");
const fahrenheitToggle = document.querySelector(".fahrenheit");

const locationDropdown = document.querySelector(".location-dropdown");
const locationDropdownToggle = document.querySelector(
    ".location-dropdown-toggle"
);
const saveLocationInputDiv = document.querySelector(".save-location-input-div");
const saveLocationInput = document.querySelector(".save-location-input");
const addSavedLocationButton = document.querySelector(
    ".add-saved-location-button"
);

const locationInput = document.querySelector(".location-input");
const searchIcon = document.querySelector(".search-icon");
const clearSearchIcon = document.querySelector(".clear-form-icon");

function convertToCelsius(temp) {
    return (temp - 32) / 1.8;
}

addSavedLocationButton.addEventListener("click", () => {
    saveLocationInputDiv.classList.toggle("hidden");
    saveLocationInput.focus();
});

saveLocationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const location = saveLocationInput.value.trim();
        if (!location) return;

        const newItem = document.createElement("div");
        newItem.classList.add("dropdown-item");
        newItem.innerHTML = `
            <div class="location-name">${location}</div>
            <div class="delete-location-button">
                <svg class="delete-location-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>window-close</title>
                    <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                </svg>
            </div>
        `;

        const referenceNode = document.querySelector(
            ".save-location-input-div"
        );

        locationDropdown.insertBefore(newItem, referenceNode);
        saveLocationsToStorage();
        saveLocationInput.value = "";
        saveLocationInputDiv.classList.toggle("hidden");
    }
});

locationDropdown.addEventListener("click", (event) => {
    const deleteButton = event.target.closest(".delete-location-button");
    if (deleteButton) {
        const dropdownItem = deleteButton.closest(".dropdown-item");
        if (dropdownItem) dropdownItem.remove();
        saveLocationsToStorage();
        return;
    }

    const dropdownItem = event.target.closest(".dropdown-item");
    if (dropdownItem) {
        const locationNameDiv = dropdownItem.querySelector(".location-name");
        if (locationNameDiv) {
            const locationName = locationNameDiv.textContent.trim();
            location = locationName;
            locationDropdown.classList.toggle("show");
            refreshPage();
        }
    }
});

celsiusToggle.addEventListener("click", () => {
    if (units == "us") {
        units = "metric";
        windSpeedUnit = "kph";
        celsiusToggle.classList.add("selected");
        fahrenheitToggle.classList.remove("selected");

        refreshPage();
        return;
    }
    return;
});

fahrenheitToggle.addEventListener("click", () => {
    if (units == "metric") {
        units = "us";
        windSpeedUnit = "mph";
        fahrenheitToggle.classList.add("selected");
        celsiusToggle.classList.remove("selected");

        refreshPage();
        return;
    }
    return;
});

locationInput.addEventListener("input", () => {
    if (locationInput.value.trim() !== "") {
        clearSearchIcon.classList.add("visible");
    } else {
        clearSearchIcon.classList.remove("visible");
    }
});

clearSearchIcon.addEventListener("click", () => {
    locationInput.value = "";
    clearSearchIcon.classList.remove("visible");
    locationInput.focus();
});

locationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        submitSearch();
        clearSearchIcon.classList.remove("visible");
        locationInput.value = "";
    }
});

searchIcon.addEventListener("click", (e) => {
    e.preventDefault();
    submitSearch();
    clearSearchIcon.classList.remove("visible");
    locationInput.value = "";
});

function submitSearch() {
    const locationName = locationInput.value.trim();
    if (locationName) {
        location = locationName;
        refreshPage();
    }
}

locationDropdownToggle.addEventListener("click", () => {
    locationDropdown.classList.toggle("show");
});

async function fetchWeatherData() {
    return await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${units}&key=${APIKEY}&contentType=json`,
        { mode: "cors" }
    );
}

async function getWeatherData() {
    try {
        const response = await fetchWeatherData();
        if (!response.ok) {
            throw new Error("Location not found or network error");
        }

        const data = await response.json();

        if (!data || data.error) {
            throw new Error(data.error || "Invalid location");
        }
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

let weatherData = await getWeatherData();

const address = document.querySelector(".address");
const currentWeatherIcon = document.querySelector(".current-weather-icon-div");
const currentTemp = document.querySelector(".current-temp");
const currentConditions = document.querySelector(".current-conditions");
const minTemp = document.querySelector(".min-temp-value");
const maxTemp = document.querySelector(".max-temp-value");
const feelsLike = document.querySelector(".feels-like-value");
const sunriseValue = document.querySelector(".sunrise-value");
const rainValue = document.querySelector(".rain-value");
const humidityValue = document.querySelector(".humidity-value");
const windSpeedValue = document.querySelector(".wind-speed-value");
const pressureValue = document.querySelector(".pressure-value");
const sunsetValue = document.querySelector(".sunset-value");
const windDirectionValue = document.querySelector(".wind-direction-value");
const uvValue = document.querySelector(".uv-value");
const hourlyWeatherDiv = document.querySelector(".hourly-weather");
const weeklyWeatherDiv = document.querySelector(".weekly-weather");

function clearPageInformation() {
    weeklyWeatherDiv.innerHTML = "";
    hourlyWeatherDiv.innerHTML = "";
}

function updatePageInformation() {
    clearPageInformation();

    const weatherIcon = svgs[weatherData.currentConditions.icon];
    currentWeatherIcon.innerHTML = weatherIcon;
    address.innerHTML = `${weatherData.resolvedAddress} - ${formatToAmPm(
        weatherData.currentConditions.datetime
    )}`;
    currentTemp.innerHTML = `${Math.round(
        weatherData.currentConditions.temp
    )}&deg;`;
    currentConditions.innerHTML = `${weatherData.currentConditions.conditions}`;

    minTemp.innerHTML = `${Math.round(weatherData.days[0].tempmin)}&deg`;
    maxTemp.innerHTML = `${Math.round(weatherData.days[0].tempmax)}&deg`;
    feelsLike.innerHTML = `${Math.round(
        weatherData.currentConditions.feelslike
    )}&deg;`;

    sunriseValue.innerHTML = formatToAmPm(
        weatherData.currentConditions.sunrise
    );
    sunsetValue.innerHTML = formatToAmPm(weatherData.currentConditions.sunset);
    rainValue.innerHTML = `${weatherData.currentConditions.precipprob}%`;
    humidityValue.innerHTML = `${Math.round(
        weatherData.currentConditions.humidity
    )}%`;
    pressureValue.innerHTML = `${weatherData.currentConditions.pressure} mb`;
    windSpeedValue.innerHTML = `${weatherData.currentConditions.windspeed} ${windSpeedUnit}`;
    windDirectionValue.innerHTML = `${weatherData.currentConditions.winddir}&deg;`;
    uvValue.innerHTML = `${weatherData.currentConditions.uvindex}`;

    const hoursToday = weatherData.days[0].hours;
    hoursToday.forEach((hour) => {
        const hourStr = hour.datetime.split(":")[0];
        const hourNum = parseInt(hourStr, 10);

        if (hourNum % 2 === 0) {
            const hourTime = formatHour(hour.datetime);
            const hourIcon = hour.icon;
            const hourTemp = hour.temp;

            addHourlyInfoToPage(hourTime, hourIcon, hourTemp);
        }
    });

    function addHourlyInfoToPage(hourTime, hourIcon, hourTemp) {
        hourlyWeatherDiv.innerHTML += `
        <div class="hour">
            <div class="hour-time hour-text">${hourTime}</div>
            <div class="hour-weather-icon">${svgs[hourIcon]}</div>
            <div class="hour-temp hour-text">${Math.round(hourTemp)}&deg;</div>
        </div>
        `;

        const hours = hourlyWeatherDiv.querySelectorAll(".hour");
        const lastHour = hours[hours.length - 1];

        const iconDiv = lastHour.querySelector(".hour-weather-icon svg");
        if (iconDiv) {
            iconDiv.classList.add("hour-icon");
        }
    }

    const weeklyWeather = weatherData.days;

    for (let i = 0; i < 7; i++) {
        const day = weeklyWeather[i];
        const weekdayName = getDayOfWeek(day.datetime);
        const minTemp = Math.round(day.tempmin);
        const maxTemp = Math.round(day.tempmax);
        const logo = svgs[`${day.icon}`];
        weeklyWeatherDiv.innerHTML += `
            <div class="weekday-container-div">
                <div class="weekday-name">${weekdayName}</div>
                <div class="weekday-weather-logo-div">${logo}</div>
                <div class="weekday-temp">
                    <div class="temp-low">${minTemp}&deg;</div>
                    <div class="temp-bar"></div>
                    <div class=temp-high">${maxTemp}&deg;</div>
                </div>
            </div>
            `;

        const weekdayLogo = document.querySelectorAll(
            ".weekday-weather-logo-div > svg"
        );
        weekdayLogo.forEach((logo) => {
            logo.classList.add("weekday-weather-icon");
            logo.classList.remove("weather-icon");
        });

        const tempBars = document.querySelectorAll(".temp-bar");
        tempBars.forEach((bar, index) => {
            const day = weeklyWeather[index];
            let minTemp = Math.round(day.tempmin);
            let maxTemp = Math.round(day.tempmax);

            if (units == "us") {
                minTemp = convertToCelsius(minTemp);
                maxTemp = convertToCelsius(maxTemp);
            }
            const gradient = getGradient(minTemp, maxTemp);
            bar.style.backgroundImage = gradient;
        });
    }
}

async function refreshPage() {
    errorMessageDiv.classList.add("hidden");
    loadingOverlay.classList.add("active");

    try {
        weatherData = await getWeatherData();
        console.log(weatherData);
        updatePageInformation();
    } catch (error) {
        errorMessageDiv.textContent = error.message;
        errorMessageDiv.classList.remove("hidden");
    } finally {
        loadingOverlay.classList.remove("active");
    }
}

updatePageInformation();
loadLocationsFromLocalStorage();
