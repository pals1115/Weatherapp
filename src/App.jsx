import React, { useState } from 'react';
import axios from 'axios';
import ForecastCard from './components/ForecastCard';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const getWeather = async () => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    console.log("City entered:", city);
    console.log("API Key used:", apiKey);

    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setError('');

      // Fetch current weather
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeather(response.data);

      // Fetch forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
      );
      const dailyForecast = forecastResponse.data.list.filter((_, index) => index % 8 === 0);
      setForecast(dailyForecast);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('City not found. Please check the spelling.');
      setWeather(null);
      setForecast([]);
    }
  };

  const getBackgroundClass = () => {
    if (!weather) return 'app default';
    const condition = weather.weather[0].main;
    if (condition.includes('Clear')) return 'app sunny';
    if (condition.includes('Cloud')) return 'app cloudy';
    if (condition.includes('Rain')) return 'app rainy';
    if (condition.includes('Snow')) return 'app snowy';
    return 'app default';
  };

  return (
    <div className={getBackgroundClass()}>
      <h1>🌤️ Weather Dashboard</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={getWeather}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>{weather.name}, {weather.sys.country}</h2>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Weather icon"
          />
          <p>🌡️ Temperature: {weather.main.temp} °C</p>
          <p>☁️ Condition: {weather.weather[0].description}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬️ Wind: {weather.wind.speed} m/s</p>
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h3>5-Day Forecast</h3>
          <div className="forecast-cards">
            {forecast.map((item, index) => (
              <ForecastCard key={index} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
