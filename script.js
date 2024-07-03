async function fetchWeather(location) {
  const apiKey = 'Key'; 
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      displayWeather(data);
      fetchForecast(location);
    } else {
      document.getElementById('weatherInfo').innerHTML = `<p>${data.message}</p>`;
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    document.getElementById('weatherInfo').innerHTML = '<p>Error fetching weather data. Please try again.</p>';
  }
}

async function fetchForecast(location) {
  const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "200") {
      displayForecast(data);
    } else {
      console.error('Error fetching forecast data:', data.message);
    }
  } catch (error) {
    console.error('Error fetching forecast data:', error);
  }
}

function displayWeather(data) {
  const weatherInfo = `
    <div class="weather-card">
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>${new Date().toLocaleDateString()}</p>
      <p class="temperature">${Math.round(data.main.temp)}°C</p>
      <p class="condition">${data.weather[0].description}</p>
      <div class="details">
        <p>High: ${Math.round(data.main.temp_max)}°C</p>
        <p>Low: ${Math.round(data.main.temp_min)}°C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p>Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
      </div>
      <div class="hourly-forecast" id="hourlyForecast"></div>
      <div class="daily-forecast" id="dailyForecast"></div>
    </div>
  `;
  document.getElementById('weatherInfo').innerHTML = weatherInfo;
}

function displayForecast(data) {
  let hourlyForecastHTML = '';
  let dailyForecastHTML = '';
  let currentDate = '';

  data.list.forEach((forecast, index) => {
    const date = new Date(forecast.dt * 1000);
    const hours = date.getHours();
    const day = date.toLocaleDateString('en-GB', { weekday: 'short' });

    if (index < 8) {
      hourlyForecastHTML += `
        <div>
          <p>${hours}:00</p>
          <p>${forecast.weather[0].description}</p>
          <p>${Math.round(forecast.main.temp)}°C</p>
        </div>
      `;
    }

    if (currentDate !== date.toLocaleDateString()) {
      dailyForecastHTML += `
        <div>
          <p>${day}</p>
          <p>Low: ${Math.round(forecast.main.temp_min)}°C</p>
          <p>High: ${Math.round(forecast.main.temp_max)}°C</p>
          <p>${forecast.weather[0].description}</p>
        </div>
      `;
      currentDate = date.toLocaleDateString();
    }
  });

  document.getElementById('hourlyForecast').innerHTML = hourlyForecastHTML;
  document.getElementById('dailyForecast').innerHTML = dailyForecastHTML;
}

function getWeather() {
  const location = document.getElementById('locationInput').value;
  if (location) {
    fetchWeather(location);
  } else {
    document.getElementById('weatherInfo').innerHTML = '<p>Please enter a location.</p>';
  }
}
