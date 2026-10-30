import {
	DreamstudioAccount,
	DreamstudioBalance,
	DreamstudioEngine,
	DreamstudioImage,
	DreamstudioOrganizationMembership,
} from './database';

export const DreamstudioSchema = {
	version: '1.0.0',
	entities: {
		accounts: DreamstudioAccount,
		balances: DreamstudioBalance,
		engines: DreamstudioEngine,
		images: DreamstudioImage,
		organizations: DreamstudioOrganizationMembership,
	},
} as const;

export {
	DreamstudioAccount,
	DreamstudioBalance,
	DreamstudioEngine,
	DreamstudioImage,
	DreamstudioOrganizationMembership,
} from './database';
