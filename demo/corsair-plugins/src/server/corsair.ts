import { createCorsair, linear, slack } from 'corsair';
import { pool } from '../db';

export const corsair = createCorsair({
	multiTenancy: true,
	database: pool,
	kek: process.env.CORSAIR_KEK!,
	approval: {
		timeout: '10m',
		onTimeout: 'deny',
	},
	plugins: [
		linear(),
		slack({
			permissions: {
				mode: 'cautious',
				overrides: {
					'messages.post': 'require_approval',
				},
			},
		}),
	],
});
