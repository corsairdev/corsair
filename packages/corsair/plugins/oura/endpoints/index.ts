import { get as profileGet } from './profile';
import {
	getActivity as summaryGetActivity,
	getReadiness as summaryGetReadiness,
	getSleep as summaryGetSleep,
} from './summary';

export const Profile = {
	get: profileGet,
};

export const Summary = {
	getActivity: summaryGetActivity,
	getReadiness: summaryGetReadiness,
	getSleep: summaryGetSleep,
};

export * from './types';
