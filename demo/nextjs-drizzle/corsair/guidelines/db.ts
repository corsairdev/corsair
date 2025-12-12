import { config } from '@/corsair.config';

export const db = {
	artists: {
		create: 'only signed in people',
		update: 'only person who created',
	},
};
