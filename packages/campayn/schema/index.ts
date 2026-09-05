import {
	CampaynContact,
	CampaynList,
	CampaynMessage,
	CampaynReport,
	CampaynWebform,
} from './database';

export const CampaynSchema = {
	version: '1.0.0',
	entities: {
		lists: CampaynList,
		contacts: CampaynContact,
		messages: CampaynMessage,
		reports: CampaynReport,
		webforms: CampaynWebform,
	},
} as const;
