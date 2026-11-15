import { defineEndpoint } from './factory';

export const emailsGet = defineEndpoint('emails.get');

export const endpoints = {
	emails: {
		get: emailsGet,
	},
} as const;
