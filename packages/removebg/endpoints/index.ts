import { get } from './account';
import { submit } from './improvement';
import { remove } from './remove-background';

export const Account = {
	get,
};

export const RemoveBackground = {
	remove,
};

export const Improvement = {
	submit,
};

export * from './types';
