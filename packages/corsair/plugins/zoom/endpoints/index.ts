import {
	create,
	get,
	list,
	update,
	addRegistrant,
	getSummary,
} from './meetings';
import {
	getMeeting as recordingsGetMeeting,
	deleteMeeting,
	listAll,
} from './recordings';
import {
	get as webinarsGet,
	list as webinarsList,
	addRegistrant as webinarsAddRegistrant,
	listParticipants,
} from './webinars';
import { dailyUsage } from './reports';
import { getPastMeeting } from './participants';
import { list as devicesList } from './devices';
import { list as archiveFilesList } from './archivefiles';

export const Meetings = {
	create,
	get,
	list,
	update,
	addRegistrant,
	getSummary,
};

export const Recordings = {
	getMeeting: recordingsGetMeeting,
	deleteMeeting,
	listAll,
};

export const Webinars = {
	get: webinarsGet,
	list: webinarsList,
	addRegistrant: webinarsAddRegistrant,
	listParticipants,
};

export const Reports = {
	dailyUsage,
};

export const Participants = {
	getPastMeeting,
};

export const Devices = {
	list: devicesList,
};

export const ArchiveFiles = {
	list: archiveFilesList,
};

export * from './types';
