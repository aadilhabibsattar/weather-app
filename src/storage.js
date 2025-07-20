const locationDropdown = document.querySelector(".location-dropdown");

export function saveLocationsToStorage() {
    const locationNames = Array.from(
        document.querySelectorAll(".dropdown-item .location-name")
    ).map((element) => element.textContent.trim());

    localStorage.setItem("savedLocations", JSON.stringify(locationNames));
}

export function loadLocationsFromLocalStorage() {
    const savedLocations =
        JSON.parse(localStorage.getItem("savedLocations")) || [];

    savedLocations.forEach((location) => {
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
    });
}
