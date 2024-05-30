import axios from 'axios';
import {API_KEY} from '../constants';
import {WeatherData} from '../src/interfaces';

interface LocationInterface {
  cityName: string;
  days?: number;
}

const forecastEndpoint = (params: LocationInterface) =>
  `/forecast.json?key=${API_KEY}&q=${
    params.cityName
  }&days=${params.days?.toString()}&aqi=no&alerts=no`;

const locationEndpoint = (params: LocationInterface) =>
  `/search.json?key=${API_KEY}&q=${params.cityName}`;

const axiosInstance = axios.create({
  baseURL: 'http://api.weatherapi.com/v1/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});


axiosInstance.interceptors.request.use((config) => {
  console.log(config)
  return config;
}, (error) => {

  return Promise.reject(error);
});

// Add a response interceptor
axiosInstance.interceptors.response.use((response) => {
  console.log(response)
  return response;
}, (error) => {
  console.log(error)
  return Promise.reject(error);
});

const apiCall = (url: string) => {
  return axiosInstance
    .get(url)
    .then(response => response.data)
    .catch(error => error);
};

// export const fetchWeatherForecast = (params: LocationInterface) => {
//   return axios
//     .get(
//       `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${
//         params.cityName
//       }&days=${params.days?.toString()}&aqi=no&alerts=no`,
//     )
//     .then(res => res.data).catch(error => error);;
// };

export const fetchWeatherForecast = (params: LocationInterface) => {
  return apiCall(forecastEndpoint(params));
};

export const fetchLocation = (params: LocationInterface) => {
  return apiCall(locationEndpoint(params));
};
