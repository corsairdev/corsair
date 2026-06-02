import {
	create as activitiesCreate,
	get as activitiesGet,
	getStreams as activitiesGetStreams,
	getZones as activitiesGetZones,
	list as activitiesList,
	listComments as activitiesListComments,
	listKudoers as activitiesListKudoers,
	listLaps as activitiesListLaps,
} from './activities';
import {
	getStats as athleteGetStats,
	getZones as athleteGetZones,
	getAthlete,
	updateAthlete,
} from './athletes';
import { get as clubsGet } from './clubs';
import { get as gearGet } from './gear';
import {
	exportGpx,
	exportTcx,
	get as routesGet,
	getStreams as routesGetStreams,
} from './routes';
import {
	effortsGet as segmentEffortsGet,
	effortsGetStreams as segmentEffortsGetStreams,
	explore as segmentsExplore,
	get as segmentsGet,
	getStreams as segmentsGetStreams,
	list as segmentsList,
	star as segmentsStar,
} from './segments';
import { create as uploadsCreate, get as uploadsGet } from './uploads';

export const Activities = {
	create: activitiesCreate,
	get: activitiesGet,
	list: activitiesList,
	getStreams: activitiesGetStreams,
	getZones: activitiesGetZones,
	listComments: activitiesListComments,
	listKudoers: activitiesListKudoers,
	listLaps: activitiesListLaps,
};

export const Athletes = {
	get: getAthlete,
	update: updateAthlete,
	getStats: athleteGetStats,
	getZones: athleteGetZones,
};

export const Segments = {
	explore: segmentsExplore,
	get: segmentsGet,
	getStreams: segmentsGetStreams,
	list: segmentsList,
	star: segmentsStar,
};

export const SegmentEfforts = {
	get: segmentEffortsGet,
	getStreams: segmentEffortsGetStreams,
};

export const Routes = {
	get: routesGet,
	getStreams: routesGetStreams,
	exportGpx,
	exportTcx,
};

export const Gear = {
	get: gearGet,
};

export const Clubs = {
	get: clubsGet,
};

export const Uploads = {
	create: uploadsCreate,
	get: uploadsGet,
};

export * from './types';
