const API_KEY = "02e997953dd0f5f536619ca2d19e3420"; 
const BASE_URL = "http://api.weatherstack.com/current";


document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim(); 


    if (city === "") {
        alert("Please enter a city name!");
        return;
    }


    const URL = `${BASE_URL}?access_key=${API_KEY}&query=${city}&units=m`;


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


            const weatherDescription = data.current.weather_descriptions[0].toLowerCase();
            const weatherIcon = data.current.weather_icons[0];


            if (weatherDescription.includes("rain")) {
                document.body.style.backgroundColor = "#a1c4fd"; 
            } else if (weatherDescription.includes("clear")) {
                document.body.style.backgroundColor = "#ffcc99"; 
            } else if (weatherDescription.includes("cloud")) {
                document.body.style.backgroundColor = "#d3d3d3";
            } else {
                document.body.style.backgroundColor = "#f0f0f0";
            }


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


            document.getElementById("whatsappInputContainer").style.display = "block";
            document.getElementById("sendMessageBtnContainer").style.display = "block";


            document.getElementById("sendMessageBtn").addEventListener("click", () => {
                const whatsappNumber = document.getElementById("whatsappNumber").value.trim();
                if (whatsappNumber === "") {
                    alert("Please enter a WhatsApp number!");
                    return;
                }


                const message = `Hi, the weather in ${data.location.name} is currently ${data.current.weather_descriptions[0]}. 
                Temperature: ${data.current.temperature}°C, Feels Like: ${data.current.feelslike}°C, 
                Humidity: ${data.current.humidity}%, Wind Speed: ${data.current.wind_speed} km/h.`;


                const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
                
                
                window.open(whatsappLink, "_blank");
            });
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            document.getElementById("weather").innerHTML =
                "<p>Unable to fetch weather data. Please try again later.</p>";
        });
});
