import axios from 'axios';
import {API_KEY} from '../constants';

interface LocationInterface {
  cityName: string;
  days?: number;
}

const forecastEndpoint = (params: LocationInterface) =>
  `/forecast.json?key=${API_KEY}&q=${params.cityName}&days=${params.days?.toString()}&aqi=no&alerts=no`;

const locationEndpoint = (params: LocationInterface) =>
  `/search.json?key=${API_KEY}&q=${params.cityName}`;

const axiosInstance = axios.create({
  baseURL: 'http://api.weatherapi.com/v1/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'},
});

const apiCall = (url: string) => {
  return axiosInstance
    .get(url)
    .then(response => response.data)
    .catch(error => error);
};

export const fetchWeatherForecast = (params: LocationInterface) => {
  return apiCall(forecastEndpoint(params));
};

export const fetchLocation = (params: LocationInterface) => {
  return apiCall(locationEndpoint(params));
};
