import { getPoint as getElevationPoint } from './elevation';
import { getPoint as getSolarPoint } from './solar';
import { getExtremesPoint, getStationsInArea, listStations } from './tide';
import { getPoint as getWeatherPoint } from './weather';

export const Weather = {
	getPoint: getWeatherPoint,
};

export const Solar = {
	getPoint: getSolarPoint,
};

export const Tide = {
	getExtremesPoint,
	listStations,
	getStationsInArea,
};

export const Elevation = {
	getPoint: getElevationPoint,
};

export * from './types';
