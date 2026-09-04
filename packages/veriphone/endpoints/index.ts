import { get as getCoverage } from './coverage';
import { get as getCredits } from './credits';
import { verify } from './verify';

export const Verify = {
	verify,
};

export const Credits = {
	get: getCredits,
};

export const Coverage = {
	get: getCoverage,
};

export * from './types';
