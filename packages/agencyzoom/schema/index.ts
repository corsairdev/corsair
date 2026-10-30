import { AgencyZoomCustomer, AgencyZoomLead, AgencyZoomTask } from './database';

export const AgencyZoomSchema = {
	version: '1.0.0',
	entities: {
		leads: AgencyZoomLead,
		customers: AgencyZoomCustomer,
		tasks: AgencyZoomTask,
	},
} as const;
