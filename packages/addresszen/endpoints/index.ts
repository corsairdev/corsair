import { addresses } from './autocomplete';
import { availability } from './key';
import { addressUsa } from './resolve';
import { address } from './verify';

export const Autocomplete = {
	addresses,
};

export const Verify = {
	address,
};

export const Key = {
	availability,
};

export const Resolve = {
	addressUsa,
};

export * from './types';
