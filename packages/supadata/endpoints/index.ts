import {
	getMetadata,
	getTranscript,
	getTranscriptJob,
	mapWeb,
	scrapeWeb,
	searchYoutube,
} from './operations';

export const Transcript = {
	get: getTranscript,
	getJob: getTranscriptJob,
};

export const Metadata = {
	get: getMetadata,
};

export const Web = {
	scrape: scrapeWeb,
	map: mapWeb,
};

export const Youtube = {
	search: searchYoutube,
};

export * from './types';
