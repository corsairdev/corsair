import { point as elevationPoint } from './elevation';
import { point as solarPoint } from './solar';
import { extremesPoint, stationsArea, stationsList } from './tide';
import { point as weatherPoint } from './weather';

export const Elevation = {
	point: elevationPoint,
};

export const Tide = {
	stationsArea,
	stationsList,
	extremesPoint,
};

export const Solar = {
	point: solarPoint,
};

export const Weather = {
	point: weatherPoint,
};

export * from './types';
