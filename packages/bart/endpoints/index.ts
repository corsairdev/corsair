import {
	elevators as advisoriesElevators,
	list as advisoriesList,
	trainCount as advisoriesTrainCount,
} from './advisories';
import { station as etdStation } from './etd';
import { calculate as faresCalculate } from './fares';
import { info as routesInfo, list as routesList } from './routes';
import {
	arrivals as schedulesArrivals,
	departures as schedulesDepartures,
	routes as schedulesRoutes,
} from './schedules';
import {
	access as stationsAccess,
	info as stationsInfo,
	list as stationsList,
} from './stations';

export const Advisories = {
	list: advisoriesList,
	elevators: advisoriesElevators,
	trainCount: advisoriesTrainCount,
};

export const Etd = {
	station: etdStation,
};

export const Routes = {
	list: routesList,
	info: routesInfo,
};

export const Stations = {
	list: stationsList,
	info: stationsInfo,
	access: stationsAccess,
};

export const Schedules = {
	departures: schedulesDepartures,
	arrivals: schedulesArrivals,
	routes: schedulesRoutes,
};

export const Fares = {
	calculate: faresCalculate,
};

export * from './types';
