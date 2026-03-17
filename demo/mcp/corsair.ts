import 'dotenv/config';
import { createCorsair, gmail, linear, slack } from 'corsair';
import sqlite from './db.js';

export const corsair = createCorsair({
	plugins: [
		slack(),
		linear(),
		gmail({
			permissions: {
				mode: 'cautious',
				overrides: {
					'messages.send': 'require_approval',
				},
			},
		}),
	],
	database: sqlite,
	kek: process.env.CORSAIR_KEK!,
	multiTenancy: false,
});
