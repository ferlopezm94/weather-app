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

app.get('/weather', (_req, res) => {
  res.send({
    forecast: 'It is raining',
    location: 'Chiapas',
  });
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
