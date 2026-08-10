import {
	getForecastByLatLng as airQualityGetForecastByLatLng,
	getHistoryByLatLng as airQualityGetHistoryByLatLng,
	getHistoryByPostalCode as airQualityGetHistoryByPostalCode,
	getLatestByCity as airQualityGetLatestByCity,
	getLatestByCountryCode as airQualityGetLatestByCountryCode,
	getLatestByLatLng as airQualityGetLatestByLatLng,
	getLatestByPostalCode as airQualityGetLatestByPostalCode,
} from './air-quality';
import {
	getHistoryByContinent as disastersGetHistoryByContinent,
	getHistoryByCountryCode as disastersGetHistoryByCountryCode,
	getHistoryByDateRange as disastersGetHistoryByDateRange,
	getHistoryByLatLng as disastersGetHistoryByLatLng,
	getLatestByContinent as disastersGetLatestByContinent,
	getLatestByCountryCode as disastersGetLatestByCountryCode,
	getLatestByLatLng as disastersGetLatestByLatLng,
} from './disasters';
import {
	getByLatLng as elevationGetByLatLng,
	getByPlace as elevationGetByPlace,
} from './elevation';
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
import { getForecastByLatLng as iliGetForecastByLatLng } from './ili';
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
	getLatestByCountryCode: airQualityGetLatestByCountryCode,
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

export const Elevation = {
	getByLatLng: elevationGetByLatLng,
	getByPlace: elevationGetByPlace,
};

export const Ili = {
	getForecastByLatLng: iliGetForecastByLatLng,
};

export const Disasters = {
	getLatestByLatLng: disastersGetLatestByLatLng,
	getLatestByCountryCode: disastersGetLatestByCountryCode,
	getLatestByContinent: disastersGetLatestByContinent,
	getHistoryByLatLng: disastersGetHistoryByLatLng,
	getHistoryByCountryCode: disastersGetHistoryByCountryCode,
	getHistoryByContinent: disastersGetHistoryByContinent,
	getHistoryByDateRange: disastersGetHistoryByDateRange,
};

export const Geocode = {
	byPlace: geocodeByPlace,
	reverseByLatLng: geocodeReverseByLatLng,
};

export * from './types';
