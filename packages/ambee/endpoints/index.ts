import {
	getForecastByLatLng as airQualityGetForecastByLatLng,
	getHistoryByLatLng as airQualityGetHistoryByLatLng,
	getHistoryByPostalCode as airQualityGetHistoryByPostalCode,
	getLatestByCity as airQualityGetLatestByCity,
	getLatestByLatLng as airQualityGetLatestByLatLng,
	getLatestByPostalCode as airQualityGetLatestByPostalCode,
} from './air-quality';
import {
	getLatestByLatLng as fireGetLatestByLatLng,
	getLatestByPlace as fireGetLatestByPlace,
	getRiskByLatLng as fireGetRiskByLatLng,
	getRiskByPlace as fireGetRiskByPlace,
} from './fire';
import {
	byPlace as geocodeByPlace,
	reverseByLatLng as geocodeReverseByLatLng,
} from './geocode';
import {
	getForecast as pollenGetForecast,
	getHistory as pollenGetHistory,
	getLatest as pollenGetLatest,
} from './pollen';
import {
	getForecast as weatherGetForecast,
	getHistory as weatherGetHistory,
	getLatest as weatherGetLatest,
} from './weather';

export const AirQuality = {
	getLatestByLatLng: airQualityGetLatestByLatLng,
	getLatestByCity: airQualityGetLatestByCity,
	getLatestByPostalCode: airQualityGetLatestByPostalCode,
	getHistoryByLatLng: airQualityGetHistoryByLatLng,
	getHistoryByPostalCode: airQualityGetHistoryByPostalCode,
	getForecastByLatLng: airQualityGetForecastByLatLng,
};

export const Weather = {
	getLatest: weatherGetLatest,
	getHistory: weatherGetHistory,
	getForecast: weatherGetForecast,
};

export const Pollen = {
	getLatest: pollenGetLatest,
	getHistory: pollenGetHistory,
	getForecast: pollenGetForecast,
};

export const Fire = {
	getLatestByLatLng: fireGetLatestByLatLng,
	getLatestByPlace: fireGetLatestByPlace,
	getRiskByLatLng: fireGetRiskByLatLng,
	getRiskByPlace: fireGetRiskByPlace,
};

export const Geocode = {
	byPlace: geocodeByPlace,
	reverseByLatLng: geocodeReverseByLatLng,
};

export * from './types';
