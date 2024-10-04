document.getElementById("getWeather").addEventListener("click", function () {
  const city = document.getElementById("city").value;
  const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
    city
  )}&key=5e8c6430c4e4439fa6435b4d7a0e1557`;

  fetch(geoUrl)
    .then((response) => response.json())
    .then((geoData) => {
      if (geoData.results.length > 0) {
        const latitude = geoData.results[0].geometry.lat;
        const longitude = geoData.results[0].geometry.lng;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Paris`;

        return fetch(weatherUrl);
      } else {
        throw new Error("Ville non trouvée.");
      }
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.current_weather) {
        const weatherCode = data.current_weather.weathercode; // Code météo
        const temperature = data.current_weather.temperature; // Température
        const humidity = data.current_weather.humidity; // Humidité
        const windSpeed = data.current_weather.windspeed; // Vitesse du vent

        // Emoji en fonction du code météo
        let weatherEmoji = "";
        switch (weatherCode) {
          case 0:
            weatherEmoji = "☀️";
            break; // Ensoleillé
          case 1:
            weatherEmoji = "🌤️";
            break; // Partiellement nuageux
          case 2:
            weatherEmoji = "☁️";
            break; // Nuageux
          case 3:
            weatherEmoji = "🌧️";
            break; // Pluie
          case 4:
            weatherEmoji = "🌩️";
            break; // Orage
          default:
            weatherEmoji = "❓"; // Inconnu
        }

        document.getElementById("weatherResult").innerHTML = `
                    <div class="weather-icon">${weatherEmoji}</div>
                    <div class="weather-info">${temperature} °C</div>
                    <div>${city}</div>
                    <div class="wind-speed">💨 Vitesse du vent: ${windSpeed} km/h</div>
                `;
      } else {
        document.getElementById(
          "weatherResult"
        ).innerHTML = `<p>Une erreur est survenue lors de la récupération des données météorologiques.</p>`;
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      document.getElementById(
        "weatherResult"
      ).innerHTML = `<p>${error.message}</p>`;
    });
});

// Écouteur d'événement pour la touche "Entrée"
document.getElementById("city").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    document.getElementById("getWeather").click();
  }
});
