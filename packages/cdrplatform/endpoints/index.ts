import { price, purchase } from './cdr';
import { get } from './certificate';
import { check } from './health';

export const Cdr = {
	price,
	purchase,
};

export const Certificate = {
	get,
};

export const Health = {
	check,
};

export * from './types';
