import {
	SnapchatActionEntity,
	SnapchatAdAccountEntity,
	SnapchatAdEntity,
	SnapchatAdSquadEntity,
	SnapchatBillingCenterEntity,
	SnapchatCampaignEntity,
	SnapchatCreativeEntity,
	SnapchatMediaEntity,
	SnapchatOrganizationEntity,
	SnapchatSchema,
	SnapchatSegmentEntity,
} from './schema';

describe('Snapchat schema', () => {
	it('declares a semver version', () => {
		expect(SnapchatSchema.version).toBeDefined();
		expect(SnapchatSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map for plugins without local sync', () => {
		expect(typeof SnapchatSchema.entities).toBe('object');
		expect(SnapchatSchema.entities).not.toBeNull();
		expect(Object.keys(SnapchatSchema.entities)).toEqual([]);
	});

	it('parses valid Organization entity', () => {
		const parsed = SnapchatOrganizationEntity.parse({
			id: 'org_123',
			name: 'Acme Corp',
			status: 'ACTIVE',
			country: 'US',
		});
		expect(parsed.id).toBe('org_123');
		expect(parsed.name).toBe('Acme Corp');
	});

	it('parses valid Ad Account entity', () => {
		const parsed = SnapchatAdAccountEntity.parse({
			id: 'adacc_123',
			name: 'Main Ad Account',
			organization_id: 'org_123',
			currency: 'USD',
		});
		expect(parsed.id).toBe('adacc_123');
		expect(parsed.currency).toBe('USD');
	});

	it('parses valid Campaign entity', () => {
		const parsed = SnapchatCampaignEntity.parse({
			id: 'camp_123',
			name: 'Summer Campaign',
			ad_account_id: 'adacc_123',
			daily_budget_micro: 50000000,
		});
		expect(parsed.id).toBe('camp_123');
		expect(parsed.daily_budget_micro).toBe(50000000);
	});

	it('parses valid AdSquad entity', () => {
		const parsed = SnapchatAdSquadEntity.parse({
			id: 'squad_123',
			name: 'Squad 1',
			campaign_id: 'camp_123',
			bid_micro: 1000000,
		});
		expect(parsed.id).toBe('squad_123');
	});

	it('parses valid Ad entity', () => {
		const parsed = SnapchatAdEntity.parse({
			id: 'ad_123',
			name: 'Story Ad',
			ad_squad_id: 'squad_123',
			creative_id: 'cr_123',
		});
		expect(parsed.id).toBe('ad_123');
	});

	it('parses valid Creative entity', () => {
		const parsed = SnapchatCreativeEntity.parse({
			id: 'cr_123',
			name: 'Video Creative',
			ad_account_id: 'adacc_123',
			type: 'SNAP_AD',
		});
		expect(parsed.id).toBe('cr_123');
	});

	it('parses valid Media entity', () => {
		const parsed = SnapchatMediaEntity.parse({
			id: 'med_123',
			name: 'Promo Video',
			ad_account_id: 'adacc_123',
			type: 'VIDEO',
			media_status: 'READY',
		});
		expect(parsed.id).toBe('med_123');
	});

	it('parses valid Segment entity', () => {
		const parsed = SnapchatSegmentEntity.parse({
			id: 'seg_123',
			name: 'High Value Customers',
			ad_account_id: 'adacc_123',
			source_type: 'CUSTOMER_LIST',
			approximate_number_users: 15000,
		});
		expect(parsed.id).toBe('seg_123');
		expect(parsed.approximate_number_users).toBe(15000);
	});

	it('parses valid BillingCenter entity', () => {
		const parsed = SnapchatBillingCenterEntity.parse({
			id: 'bc_123',
			name: 'HQ Billing',
			organization_id: 'org_123',
			email: 'billing@example.com',
		});
		expect(parsed.id).toBe('bc_123');
		expect(parsed.email).toBe('billing@example.com');
	});

	it('parses valid Action entity', () => {
		const parsed = SnapchatActionEntity.parse({
			id: 'act_123',
			name: 'SNAPCHAT_GET_AD_ACCOUNT',
			data: { ad_account_id: 'adacc_123' },
		});
		expect(parsed.id).toBe('act_123');
		expect(parsed.name).toBe('SNAPCHAT_GET_AD_ACCOUNT');
	});
});
