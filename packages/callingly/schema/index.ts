import {
	CallinglyCall,
	CallinglyClient,
	CallinglyLead,
	CallinglySchedule,
	CallinglyTeam,
	CallinglyTeamUser,
	CallinglyUser,
	CallinglyWebhookConfig,
} from './database';

export const CallinglySchema = {
	version: '1.0.0',
	entities: {
		leads: CallinglyLead,
		calls: CallinglyCall,
		users: CallinglyUser,
		teams: CallinglyTeam,
		teamUsers: CallinglyTeamUser,
		schedules: CallinglySchedule,
		clients: CallinglyClient,
		webhooks: CallinglyWebhookConfig,
	},
} as const;

export * from './database';
