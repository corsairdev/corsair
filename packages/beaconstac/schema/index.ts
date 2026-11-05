import {
	BeaconstacBulkQrCode,
	BeaconstacOrganization,
	BeaconstacPlace,
	BeaconstacQrCode,
	BeaconstacQrTemplate,
	BeaconstacTag,
	BeaconstacUser,
} from './database';

export const BeaconstacSchema = {
	version: '1.0.0',
	entities: {
		organizations: BeaconstacOrganization,
		users: BeaconstacUser,
		qrcodes: BeaconstacQrCode,
		qrTemplates: BeaconstacQrTemplate,
		tags: BeaconstacTag,
		places: BeaconstacPlace,
		bulkQrcodes: BeaconstacBulkQrCode,
	},
} as const;

export {
	BeaconstacBulkQrCode,
	BeaconstacOrganization,
	BeaconstacPlace,
	BeaconstacQrCode,
	BeaconstacQrTemplate,
	BeaconstacTag,
	BeaconstacUser,
} from './database';
