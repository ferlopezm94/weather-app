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

type Callback = (error?: string, data?: string) => void;

const baseURL = 'http://api.weatherstack.com';
const accessToken = process.env.WEATHER_STACK_ACCESS_TOKEN || '';

export const forecast = async (latitude: string, longitude: string, callback: Callback) => {
  const url = `${baseURL}/current?access_key=${accessToken}&query=${latitude},${longitude}`;

  try {
    const { data } = (await axios.get(url)) as ForecastResponse;

    if (!data || data.error) {
      return callback('Unable to find location. Try another search.');
    }

    const { weather_descriptions, temperature, feelslike } = data.current;

    callback(
      undefined,
      `${weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out.`,
    );
  } catch (error) {
    callback('Unable to connect to weather service!');
  }
};

// request({ url, json: true }, (error, { body }) => {
//   if (error) {
//     callback('Unable to connect to weather service!');
//   } else if (body.error) {
//     callback('Unable to find location. Try another search.');
//   } else {
//     const { weather_descriptions, temperature, feelslike } = body.current;
//     callback(
//       undefined,
//       `${weather_descriptions[0]}. It is currently ${temperature} degrees out. It feels like ${feelslike} degrees out.`,
//     );
//   }
// });
