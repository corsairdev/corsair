import {
	DropboxSignAccount,
	DropboxSignApiApp,
	DropboxSignBulkSendJob,
	DropboxSignFax,
	DropboxSignSignatureRequest,
	DropboxSignTeam,
	DropboxSignTemplate,
} from './database';

export const DropboxSignSchema = {
	version: '1.0.0',
	entities: {
		account: DropboxSignAccount,
		signatureRequest: DropboxSignSignatureRequest,
		template: DropboxSignTemplate,
		apiApp: DropboxSignApiApp,
		team: DropboxSignTeam,
		fax: DropboxSignFax,
		bulkSendJob: DropboxSignBulkSendJob,
	},
} as const;

export {
	DropboxSignAccount,
	DropboxSignApiApp,
	DropboxSignBulkSendJob,
	DropboxSignFax,
	DropboxSignSignatureRequest,
	DropboxSignTeam,
	DropboxSignTemplate,
} from './database';
