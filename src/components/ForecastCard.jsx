import React from 'react';

const ForecastCard = ({ item }) => {
  const date = new Date(item.dt_txt).toLocaleDateString();

  return (
    <div className="forecast-card">
      <p>{date}</p>
      <img
        src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt="Forecast Icon"
      />
      <p>{item.main.temp} °C</p>
      <p>{item.weather[0].main}</p>
    </div>
  );
};

export default ForecastCard;
