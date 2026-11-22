// Response shapes from a live Laposta free account (11-21), trimmed. Ids are from deleted test resources.
import {
	GetCampaignContentOutputSchema,
	GetListOutputSchema,
} from './endpoints/types';

describe('Laposta live response shapes', () => {
	it('accepts a new list with null modified dates and empty notification emails', () => {
		const parsed = GetListOutputSchema.parse({
			list: {
				list_id: 'irzvwfotqx',
				timezone: 'Europe/Amsterdam',
				created: '2026-11-21 15:20:52',
				created_iso: '2026-11-21T15:20:52+01:00',
				modified: null,
				modified_iso: null,
				state: 'active',
				name: 'corsair-plugin-test',
				locked: false,
				remarks: 'corsair-plugin-test',
				subscribe_notification_email: '',
				unsubscribe_notification_email: '',
				members: { active: 0, unsubscribed: 0, cleaned: 0 },
			},
		});
		expect(parsed.list.modified).toBeNull();
	});

	it('accepts campaign content with an empty import_url', () => {
		const parsed = GetCampaignContentOutputSchema.parse({
			campaign: {
				account_id: 'renwgb8hrc',
				campaign_id: 'yairc5q3iq',
				html: '<html><body><p>corsair-plugin-test</p></body></html>',
				import_url: '',
			},
		});
		expect(parsed.campaign.import_url).toBe('');
	});
});
