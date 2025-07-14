import "./styles/style.css";

const APIKEY = "3HXW7VSTW8PT22AYJVU6ZKY35";
let city = "dhaka";

// async function getWeatherData() {
//     return await fetch(
//         `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=${APIKEY}&contentType=json`,
//         { mode: "cors" }
//     );
// }

// async function logWeatherData() {
//     try {
//         const response = await getWeatherData();
//         if (!response.ok) {
//             throw new Error("Resposne not OK");
//         }

//         const data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.error(error);
//     }
// }

// logWeatherData();

const locationDropdownToggle = document.querySelector(
    ".location-dropdown-toggle"
);
const locationDropdown = document.querySelector(".location-dropdown");

locationDropdownToggle.addEventListener("click", () => {
    locationDropdown.classList.toggle("hidden");
});
