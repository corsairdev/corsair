import {
	BoxheroAttrEntity,
	BoxheroItemEntity,
	BoxheroLocationEntity,
	BoxheroMemberEntity,
	BoxheroPartnerEntity,
	BoxheroSimpleLocationTransactionEntity,
	BoxheroTeamEntity,
} from './database';

export const BoxheroSchema = {
	version: '1.0.0',
	entities: {
		team: BoxheroTeamEntity,
		member: BoxheroMemberEntity,
		location: BoxheroLocationEntity,
		partner: BoxheroPartnerEntity,
		item: BoxheroItemEntity,
		attr: BoxheroAttrEntity,
		transaction: BoxheroSimpleLocationTransactionEntity,
	},
} as const;

export * from './database';
