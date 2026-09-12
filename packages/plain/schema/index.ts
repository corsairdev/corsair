import {
	PlainCompany,
	PlainCustomer,
	PlainCustomerGroup,
	PlainThread,
	PlainTier,
} from './database';

export const PlainSchema = {
	version: '1.0.0',
	entities: {
		customers: PlainCustomer,
		threads: PlainThread,
		companies: PlainCompany,
		tiers: PlainTier,
		customer_groups: PlainCustomerGroup,
	},
} as const;
