import { z } from 'zod';
import { ToneDenEndpointOutputSchemas } from './endpoints/types';
import {
	adCampaignEnvelope,
	adCampaignsEnvelope,
	attachmentEnvelope,
	attachmentStats,
	attachmentsEnvelope,
	deleted,
	expandedLink,
	insights,
	linkEnvelope,
	linksEnvelope,
	playbookEnvelope,
	userEnvelope,
	userListsEnvelope,
	validPathOk,
	validPathTaken,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a link list', () => {
		const parsed =
			ToneDenEndpointOutputSchemas.listUserLinks.parse(linksEnvelope);
		expect(parsed.links).toHaveLength(2);
		expect(parsed.links[0]?.title).toBe('New single');
	});

	it('keeps snake_case: the field is target_url, not targetUrl', () => {
		const parsed = ToneDenEndpointOutputSchemas.getLink.parse(linkEnvelope);
		expect(parsed.link.target_url).toBe('https://open.spotify.com/album/abc');
		expect(parsed.link).not.toHaveProperty('targetUrl');
	});

	it('parses a link whose nullable fields are all null', () => {
		const parsed = ToneDenEndpointOutputSchemas.getLink.parse(linkEnvelope);
		expect(parsed.link.custom_domain).toBeNull();
		expect(parsed.link.date).toBeNull();
		expect(parsed.link.price).toBeNull();
	});

	it('parses the validPath verdict with a reason', () => {
		const parsed = ToneDenEndpointOutputSchemas.validPath.parse(validPathTaken);
		expect(parsed.valid).toBe(false);
		expect(parsed.reason).toBe('That link URL is already in use.');
		expect(parsed.type).toBe('path');
	});

	it('parses the validPath verdict without a reason', () => {
		const parsed = ToneDenEndpointOutputSchemas.validPath.parse(validPathOk);
		expect(parsed.valid).toBe(true);
		expect(parsed.reason).toBeUndefined();
	});

	it('parses an expanded link template', () => {
		const parsed = ToneDenEndpointOutputSchemas.expandLink.parse(expandedLink);
		expect(parsed.is_active).toBe(true);
		expect(parsed.pixels).toHaveLength(2);
	});

	it('parses an insights series', () => {
		const parsed = ToneDenEndpointOutputSchemas.linkInsights.parse(insights);
		expect(parsed.data).toHaveLength(1);
		expect(parsed.series).toEqual([]);
	});

	it('parses an attachment list', () => {
		const parsed =
			ToneDenEndpointOutputSchemas.listUserAttachments.parse(
				attachmentsEnvelope,
			);
		expect(parsed.attachments[0]?.type).toBe('contest');
		expect(parsed.attachments[0]?.actions).toBe(0);
	});

	it('parses one attachment', () => {
		const parsed =
			ToneDenEndpointOutputSchemas.getAttachment.parse(attachmentEnvelope);
		expect(parsed.attachment.title).toBe('Win a vinyl');
	});

	it('parses an attachment stats body with totals', () => {
		const parsed =
			ToneDenEndpointOutputSchemas.attachmentEntries.parse(attachmentStats);
		expect(parsed.data).toHaveLength(1);
		expect(parsed.totals).toBeDefined();
	});

	it('parses a campaign list and one campaign separately', () => {
		expect(
			ToneDenEndpointOutputSchemas.listCampaigns.parse(adCampaignsEnvelope)
				.ad_campaigns,
		).toHaveLength(1);
		expect(
			ToneDenEndpointOutputSchemas.getCampaign.parse(adCampaignEnvelope)
				.ad_campaign.status,
		).toBe('active');
	});

	it('parses a playbook campaign', () => {
		const parsed =
			ToneDenEndpointOutputSchemas.getPlaybookCampaign.parse(playbookEnvelope);
		expect(parsed.playbook_campaign.template_id).toBe(12);
		expect(parsed.playbook_campaign.subcampaigns).toEqual([]);
	});

	it('parses a user profile', () => {
		const parsed = ToneDenEndpointOutputSchemas.getUser.parse(userEnvelope);
		expect(parsed.user.username).toBe('ada');
		expect(parsed.user.birthday).toBeNull();
	});

	it('parses a user list envelope', () => {
		const parsed =
			ToneDenEndpointOutputSchemas.listUserLists.parse(userListsEnvelope);
		expect(parsed.user_lists[0]?.size).toBe(4200);
	});

	it('parses a delete that answered with success', () => {
		expect(
			ToneDenEndpointOutputSchemas.deleteLink.parse(deleted),
		).toMatchObject({ success: true });
	});

	it('parses a delete that answered with an empty object', () => {
		expect(() =>
			ToneDenEndpointOutputSchemas.deleteLink.parse({}),
		).not.toThrow();
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a link list whose links is an object', () => {
		expect(() =>
			ToneDenEndpointOutputSchemas.listUserLinks.parse({ links: {} }),
		).toThrow(z.ZodError);
	});

	it('rejects a link whose click_count is a string', () => {
		const parsed = ToneDenEndpointOutputSchemas.getLink.safeParse({
			link: { click_count: '1200' },
		});
		// click_count is nullish but must be a number when present.
		expect(parsed.success).toBe(false);
	});

	it('rejects a validPath answer with no `valid` flag', () => {
		expect(() =>
			ToneDenEndpointOutputSchemas.validPath.parse({ reason: 'x' }),
		).toThrow(z.ZodError);
	});

	it('rejects an attachment list whose element is a string', () => {
		expect(() =>
			ToneDenEndpointOutputSchemas.listUserAttachments.parse({
				attachments: ['contest'],
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a campaign list whose array is missing', () => {
		expect(() => ToneDenEndpointOutputSchemas.listCampaigns.parse({})).toThrow(
			z.ZodError,
		);
	});

	it('rejects a delete result that is a bare string', () => {
		expect(() => ToneDenEndpointOutputSchemas.deleteLink.parse('ok')).toThrow(
			z.ZodError,
		);
	});
});
