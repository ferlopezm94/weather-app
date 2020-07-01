import axios from 'axios';

interface ForecastResponse {
  data: {
    current: {
      weather_descriptions: string[];
      temperature: number;
      feelslike: number;
    };
    error?: string;
  };
}

const baseURL = 'http://api.weatherstack.com';
const accessToken = process.env.WEATHER_STACK_ACCESS_TOKEN || '';

export const forecast = async (latitude: number, longitude: number) => {
  const url = `${baseURL}/current?access_key=${accessToken}&query=${latitude},${longitude}`;

  try {
    const { data } = (await axios.get(url)) as ForecastResponse;

    if (!data || data.error) {
      throw new Error('Unable to find location. Try another search.');
    }

    const { weather_descriptions, temperature, feelslike } = data.current;

    return `${weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out.`;
  } catch (error) {
    if (error === 'Unable to find location. Try another search.') {
      throw new Error(error);
    }

    throw new Error('Unable to connect to weather service!');
  }
};
