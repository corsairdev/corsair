import { batch } from './batch';
import { check } from './check';
import { credits } from './credits';
import { status } from './status';

export const Check = {
	post: check,
};

export const Batch = {
	post: batch,
};

export const Credits = {
	get: credits,
};

export const Status = {
	get: status,
};

export * from './types';
