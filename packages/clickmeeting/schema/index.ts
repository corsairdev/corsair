import {
	ClickmeetingConferenceEntity,
	ClickmeetingContactEntity,
} from './database';

export const ClickmeetingSchema = {
	version: '1.0.0',
	entities: {
		conferences: ClickmeetingConferenceEntity,
		contacts: ClickmeetingContactEntity,
	},
} as const;

export * from './database';
