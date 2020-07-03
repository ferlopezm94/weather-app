import express from 'express';
import hbs from 'hbs';
import path from 'path';

import { geocode } from './utils/geocode';
import { forecast } from './utils/forecast';

const app = express();

// Define paths for express configuration
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, '../templates/views');
const partialsDirectoryPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

// Setuo routes handlers
app.get('', (_req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'John Doe',
  });
});

app.get('/about', (_req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'John Doe',
  });
});

app.get('/help', (_req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'John Doe',
    message: 'We are here for you!',
  });
});

app.get('/weather', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.send({
      error: 'You must provide an address!',
    });
  }

  try {
    const { latitude, longitude, location } = await geocode(address as string);
    const forecastData = await forecast(latitude, longitude);

    res.send({
      forecast: forecastData,
      location,
      address,
    });
  } catch (error) {
    console.log('error :>> ', error.message);
    res.send({ error: error.message });
  }
});

app.get('/help/*', (_req, res) => {
  res.render('404', {
    title: '404',
    name: 'John Doe',
    errorMessage: 'Help article not found.',
  });
});

app.get('*', (_req, res) => {
  res.render('404', {
    title: '404',
    name: 'John Doe',
    errorMessage: 'Page not found.',
  });
});

app.listen(3000, () => console.log('Server up and running!'));
