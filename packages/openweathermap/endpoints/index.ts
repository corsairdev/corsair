import {
	current as airPollutionCurrent,
	forecast as airPollutionForecast,
	history as airPollutionHistory,
} from './air-pollution';
import { byZip, direct, reverse } from './geocoding';
import { timeMachine } from './history';
import { weatherMapTile } from './maps';
import {
	create,
	get,
	getMeasurements,
	list,
	remove,
	submitMeasurements,
	update,
} from './stations';
import { daySummary, overview } from './summary';
import {
	circleCity,
	forecast5Day,
	oneCall,
	current as weatherCurrent,
} from './weather';

export const Weather = {
	oneCall,
	current: weatherCurrent,
	forecast5Day,
	circleCity,
};

export const History = {
	timeMachine,
};

export const Summary = {
	daySummary,
	overview,
};

export const AirPollution = {
	current: airPollutionCurrent,
	forecast: airPollutionForecast,
	history: airPollutionHistory,
};

export const Geocoding = {
	direct,
	reverse,
	byZip,
};

export const Maps = {
	weatherMapTile,
};

export const Stations = {
	list,
	get,
	create,
	update,
	remove,
	getMeasurements,
	submitMeasurements,
};

export * from './types';
