
import React, { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  weathercode: number;
}

const getWeatherDescription = (code: number): string => {
  const descriptions: { [key: number]: string } = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Unknown weather';
};

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<{ data: WeatherData; location: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (latitude: number, longitude: number, locationName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data.');
      }
      const data = await response.json();
      if (data.error) {
        throw new Error(data.reason || 'An error occurred while fetching weather.');
      }
      setWeather({
        data: data.current_weather,
        location: locationName,
      });
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDefaultWeather = () => {
    // Amsterdam, the Netherlands
    fetchWeather(52.370216, 4.895168, 'Amsterdam, NL');
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude, 'Your Location');
        },
        (err) => {
          console.warn(`Geolocation error (${err.code}): ${err.message}`);
          fetchDefaultWeather();
        },
        {
          timeout: 10000,
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
      fetchDefaultWeather();
    }
  }, []);

  return (
    <div className="w-full text-center text-gray-300/90 text-xl md:text-2xl tracking-wide">
      {loading && <p>Loading weather...</p>}
      {error && <p>Could not load weather.</p>}
      {weather && (
        <div>
          <p>{weather.location}</p>
          <p className="font-semibold text-white">
            {Math.round(weather.data.temperature)}°C, {getWeatherDescription(weather.data.weathercode)}
          </p>
        </div>
      )}
    </div>
  );
};

export default Weather;
