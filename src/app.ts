import { geocode } from './utils/geocode';
import { forecast } from './utils/forecast';

const main = async () => {
  const address = process.argv[2];

  if (!address) {
    return console.log('Please provide a location.');
  }

  try {
    const { latitude, longitude, location } = await geocode(address);
    const forecastData = await forecast(latitude, longitude);

    console.log(`${location}.\n${forecastData}`);
  } catch (error) {
    console.error('error :>> ', error);
  }
};

main();
