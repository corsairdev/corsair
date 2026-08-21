import {
	ClientaryClient,
	ClientaryContact,
	ClientaryEstimate,
	ClientaryInvoice,
	ClientaryProject,
	ClientaryTask,
} from './database';

export const ClientarySchema = {
	version: '1.0.0',
	entities: {
		clients: ClientaryClient,
		contacts: ClientaryContact,
		projects: ClientaryProject,
		invoices: ClientaryInvoice,
		estimates: ClientaryEstimate,
		tasks: ClientaryTask,
	},
} as const;
