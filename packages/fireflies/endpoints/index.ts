import { getOutputs } from './aiapp';
import {
	continueThread,
	createThread,
	deleteThread,
	getThread,
	getThreads,
} from './askfred';
import { upload } from './audio';
import {
	get,
	getAnalytics,
	getAudioUrl,
	getSummary,
	getVideoUrl,
	list,
} from './transcripts';
import { getCurrent, list as listUsers } from './users';

export const Transcripts = {
	list,
	get,
	getAnalytics,
	getAudioUrl,
	getVideoUrl,
	getSummary,
};
export const Users = { getCurrent, list: listUsers };
export const AskFred = {
	getThreads,
	getThread,
	createThread,
	continueThread,
	deleteThread,
};
export const Audio = { upload };
export const AiApp = { getOutputs };

export * from './types';
