import { get as exampleGet } from './example';
import * as listVoices from './list-voices';

export const Example = {
	get: exampleGet,
};

export const endpoints = {
	AIVOOV_LIST_VOICES: listVoices,
};

export * from './types';
