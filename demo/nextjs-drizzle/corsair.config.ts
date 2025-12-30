import { corsair } from 'corsair';
import type { SlackDefaultSchema } from 'corsair/plugins';
import { config as dotenvConfig } from 'dotenv';
import { db } from './db';

dotenvConfig({ path: '.env.local' });

export const config = corsair({
	dbType: 'postgres',
	orm: 'drizzle',
	framework: 'nextjs',
	pathToCorsairFolder: './corsair',
	apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
	db: db,
	connection: process.env.DATABASE_URL!,
	plugins: [
		{
			name: 'slack',
			token: process.env.SLACK_TOKEN!,
			channels: {
				general: 'C0A3ZTB9X7X',
			},
			schema: {
				messages: true, // Use default
				channels: false, // Skip
				channel_members: (dbSchema: SlackDefaultSchema) => ({
					// Custom
					id: dbSchema.channels.id,
					member_id: dbSchema.members.id,
				}),
			},
		},
		{
			name: 'github',
			token: process.env.GITHUB_TOKEN!,
			schema: {
				issues: true,
				pull_requests: true,
			},
		},
		{
			name: 'linear',
			apiKey: process.env.LINEAR_API_KEY!,
			teamId: process.env.LINEAR_TEAM_ID!,
			schema: {
				issues: true,
			},
		},
		{
			name: 'gmail',
			accessToken: process.env.GMAIL_ACCESS_TOKEN!,
			refreshToken: process.env.GMAIL_REFRESH_TOKEN!,
			userId: process.env.GMAIL_USER_ID!,
			schema: {
				messages: true,
				threads: true,
				labels: true,
				drafts: true,
			},
		},
	],
});

export type Config = typeof config;

// access plugins like this
console.log(config.options.plugins);

