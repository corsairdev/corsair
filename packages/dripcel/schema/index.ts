import {
	DripcelCampaign,
	DripcelContact,
	DripcelDelivery,
	DripcelEmailTemplate,
	DripcelReply,
	DripcelSale,
	DripcelSendLog,
	DripcelTag,
} from './database';

export const DripcelSchema = {
	version: '1.0.0',
	entities: {
		contacts: DripcelContact,
		campaigns: DripcelCampaign,
		tags: DripcelTag,
		deliveries: DripcelDelivery,
		emailTemplates: DripcelEmailTemplate,
		sales: DripcelSale,
		replies: DripcelReply,
		sendLogs: DripcelSendLog,
	},
} as const;

export {
	DripcelCampaign,
	DripcelContact,
	DripcelDelivery,
	DripcelEmailTemplate,
	DripcelReply,
	DripcelSale,
	DripcelSendLog,
	DripcelTag,
} from './database';
