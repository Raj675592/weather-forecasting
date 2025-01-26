const API_KEY = "03fc1605cbb6064eed16e6bd7fe2a084"; // Replace with your actual API key
const BASE_URL = "https://api.weatherstack.com/current";

// Event Listener for the Search Button
document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim(); // Get the city input

    // Check if the city input is empty
    if (city === "") {
        alert("Please enter a city name!");
        return;
    }

    // Construct the URL to fetch weather data
    const URL = `${BASE_URL}?access_key=${API_KEY}&query=${city}&units=m`;

    // Fetch the weather data from the API
    fetch(URL)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            if (data.error) {
                alert("City not found. Please try another one.");
                return;
            }

            // Get the weather description and weather icon
            const weatherDescription = data.current.weather_descriptions[0].toLowerCase();
            const weatherIcon = data.current.weather_icons[0];

            // Change background color based on weather
            if (weatherDescription.includes("rain")) {
                document.body.style.backgroundColor = "#a1c4fd"; // Blueish for rain
            } else if (weatherDescription.includes("clear")) {
                document.body.style.backgroundColor = "#ffcc99"; // Light orange for clear weather
            } else if (weatherDescription.includes("cloud")) {
                document.body.style.backgroundColor = "#d3d3d3"; // Light grey for cloudy weather
            } else {
                document.body.style.backgroundColor = "#f0f0f0"; // Default color for unknown conditions
            }

            // Display weather information
            const weatherInfo = `
                <h2>Weather in ${data.location.name}, ${data.location.country}</h2>
                <p><strong>Temperature:</strong> ${data.current.temperature}°C</p>
                <p><strong>Feels Like:</strong> ${data.current.feelslike}°C</p>
                <p><strong>Weather:</strong> ${data.current.weather_descriptions[0]}</p>
                <p><strong>Humidity:</strong> ${data.current.humidity}%</p>
                <p><strong>Wind Speed:</strong> ${data.current.wind_speed} km/h</p>
                <img src="${weatherIcon}" alt="Weather Icon">
            `;
            document.getElementById("weather").innerHTML = weatherInfo;

            // Show the WhatsApp input field and "Send Message" button for all weather conditions
            document.getElementById("whatsappInputContainer").style.display = "block";
            document.getElementById("sendMessageBtnContainer").style.display = "block";

            // Handle clicking the "Send Weather Message" button
            document.getElementById("sendMessageBtn").addEventListener("click", () => {
                const whatsappNumber = document.getElementById("whatsappNumber").value.trim();
                if (whatsappNumber === "") {
                    alert("Please enter a WhatsApp number!");
                    return;
                }

                // Construct the message with weather details and description
                const message = `Hi, the weather in ${data.location.name} is currently ${data.current.weather_descriptions[0]}. 
                Temperature: ${data.current.temperature}°C, Feels Like: ${data.current.feelslike}°C, 
                Humidity: ${data.current.humidity}%, Wind Speed: ${data.current.wind_speed} km/h.`;

                // Create the WhatsApp link with the encoded message
                const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                
                // Open WhatsApp with the message
                window.open(whatsappLink, "_blank");
            });
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            document.getElementById("weather").innerHTML =
                "<p>Unable to fetch weather data. Please try again later.</p>";
        });
});
