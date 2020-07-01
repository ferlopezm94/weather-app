import axios from 'axios';

interface GeocodeResponse {
  data: {
    features: {
      place_name: string;
      center: number[];
    }[];
  };
}

const baseURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const accessToken = process.env.MAPBOX_ACCESS_TOKEN || '';

export const geocode = async (address: string) => {
  const url = `${baseURL}/${encodeURIComponent(address)}.json?access_token=${accessToken}&limit=1`;

  try {
    const { data } = (await axios.get(url)) as GeocodeResponse;

    if (!data || !data.features || data.features.length === 0) {
      throw new Error('Unable to find location. Try another search.');
    }

    const { center, place_name } = data.features[0];

    return {
      latitude: center[1],
      longitude: center[0],
      location: place_name,
    };
  } catch (error) {
    if (error === 'Unable to find location. Try another search.') {
      throw new Error(error);
    }

    throw new Error('Unable to connect to location services!');
  }
};
