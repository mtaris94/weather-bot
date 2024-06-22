const axios = require('axios');

const URL = 'https://api.weatherapi.com/v1/forecast.json';
const FORECAST_DAYS = 3;
async function fetchForecast(location) {
  return axios({
    url: URL,
    method:'get',
    params: {
      q: location,
      days: FORECAST_DAYS,
      key: process.env.WEATHER_API_KEY,
    },
    responseType: 'json',
  })
  .then((response) => {
    const city = response.data.location.name;
    const country = response.data.location.country;
    const locationName = `${city}, ${country}`;
    const time = response.data.location.localtime;

    const weatherData = response.data.forecast.forecastday.map((forecastDay) => {
      return {
        date: forecastDay.date,

        temperatureMinC: forecastDay.day.mintemp_c,
        temperatureMaxC: forecastDay.day.maxtemp_c,
        temperatureMinF: forecastDay.day.mintemp_f,
        temperatureMaxF: forecastDay.day.maxtemp_f,
      
        sunriseTime: forecastDay.astro.sunrise,
        sunsetTime: forecastDay.astro.sunset,
        moonriseTime: forecastDay.astro.moonrise,
        moonsetTime: forecastDay.astro.moonset,
        moon_phase: forecastDay.astro.moon_phase,

        precipitation: forecastDay.day.precip_mm,
        humidity: forecastDay.day.avghumidity,
        wind: forecastDay.day.maxwind_kph,

      };
    });

    return {
      locationName,
      weatherData,
      time,
    };
  })
  .catch((error) => {
    console.error(error);
    throw new Error(`Error fetching forecast for ${locationName}.`);
  });
}

module.exports = {
  fetchForecast,
}