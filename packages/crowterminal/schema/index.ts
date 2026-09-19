import {
	CrowterminalDataPoint,
	CrowterminalIncident,
	CrowterminalSkill,
	CrowterminalWebhook,
} from './database';

export const CrowterminalSchema = {
	version: '1.0.0',
	entities: {
		skills: CrowterminalSkill,
		dataPoints: CrowterminalDataPoint,
		webhooks: CrowterminalWebhook,
		incidents: CrowterminalIncident,
	},
} as const;

export * from './database';
