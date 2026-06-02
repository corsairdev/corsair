import { list as archiveFilesList } from './archivefiles';
import { list as devicesList } from './devices';
import {
	addRegistrant,
	create,
	get,
	getSummary,
	list,
	update,
} from './meetings';
import { getPastMeeting } from './participants';
import {
	deleteMeeting,
	listAll,
	getMeeting as recordingsGetMeeting,
} from './recordings';
import { dailyUsage } from './reports';
import {
	listParticipants,
	addRegistrant as webinarsAddRegistrant,
	get as webinarsGet,
	list as webinarsList,
} from './webinars';

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
