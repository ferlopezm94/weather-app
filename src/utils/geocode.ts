import axios from 'axios';

interface GeocodeResponse {
  data: {
    features: {
      place_name: string;
      center: number[];
    }[];
  };
}

interface CallbackData {
  latitude: number;
  longitude: number;
  location: string;
}

type Callback = (error?: string, data?: CallbackData) => void;

const baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const accessToken = process.env.MAPBOX_ACCESS_TOKEN || '';

export const geocode = async (address: string, callback: Callback) => {
  const url = `${baseURL}/${encodeURIComponent(address)}.json?access_token=${accessToken}&limit=1`;

  try {
    const { data } = (await axios.get(url)) as GeocodeResponse;

    if (!data || !data.features || data.features.length === 0) {
      return callback('Unable to find location. Try another search.');
    }

    const { center, place_name } = data.features[0];

    callback(undefined, {
      latitude: center[1],
      longitude: center[0],
      location: place_name,
    });
  } catch (error) {
    callback('Unable to connect to location services!');
  }
};
