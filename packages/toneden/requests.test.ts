import {
	AttachmentsEndpoints,
	CampaignsEndpoints,
	LinksEndpoints,
	OfflineConversionsEndpoints,
	PlaybooksEndpoints,
	UserListsEndpoints,
	UsersEndpoints,
} from './endpoints';
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
import { captureError, invoke } from './test-helpers';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, when there is one.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://www.toneden.io');
	expect(sent.headers.get('authorization')).toBe('Bearer td-test-token');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('links', () => {
	it('links.list GETs v1/links with paging', async () => {
		respond(linksEnvelope);

		const result = (await invoke(LinksEndpoints.list, {
			target_type: 'music',
			limit: 25,
		})) as { links: unknown[] };

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/links',
			method: 'GET',
		});
		expect(lastRequest().params).toEqual({ target_type: 'music', limit: '25' });
		expect(result.links).toHaveLength(2);
	});

	it('links.listForUser GETs the user path', async () => {
		respond(linksEnvelope);

		await invoke(LinksEndpoints.listForUser, { user_id: 1 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/users/1/links');
	});

	it('links.get GETs one link', async () => {
		respond(linkEnvelope);

		const result = (await invoke(LinksEndpoints.get, { link_id: 48213 })) as {
			link: { id: number };
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/links/48213');
		expect(result.link.id).toBe(48213);
	});

	it('links.create POSTs only the fields it was given', async () => {
		respond(linkEnvelope);

		await invoke(LinksEndpoints.create, {
			title: 'New single',
			target_type: 'music',
			target_url: 'https://open.spotify.com/album/abc',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({
			title: 'New single',
			target_type: 'music',
			target_url: 'https://open.spotify.com/album/abc',
		});
	});

	it('links.update PUTs the body without the path id', async () => {
		respond(linkEnvelope);

		await invoke(LinksEndpoints.update, { link_id: 48213, title: 'Renamed' });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/links/48213');
		expect(lastRequest().method).toBe('PUT');
		// The id stays in the path; sending it in the body too could rename the
		// wrong record.
		expect(lastRequest().body).toEqual({ title: 'Renamed' });
	});

	it('links.update rejects an empty change', async () => {
		const error = await captureError(
			invoke(LinksEndpoints.update, { link_id: 48213 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('links.delete DELETEs by id', async () => {
		respond(deleted);

		await invoke(LinksEndpoints.delete, { link_id: 48213 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			path: '/api/v1/links/48213',
			method: 'DELETE',
		});
	});

	it('links.expand GETs the template link', async () => {
		respond(expandedLink);

		const result = (await invoke(LinksEndpoints.expand, {
			url: 'https://open.spotify.com/album/abc',
		})) as { pixels?: unknown[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/links/expand');
		expect(result.pixels).toHaveLength(2);
	});

	it('links.validPath returns the verdict rather than throwing', async () => {
		respond(validPathTaken);

		const result = (await invoke(LinksEndpoints.validPath, {
			path: 'new-single',
		})) as { valid: boolean; reason?: string | null };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/links/validPath');
		expect(lastRequest().params).toEqual({ path: 'new-single' });
		// A taken path is a successful call with a negative answer.
		expect(result.valid).toBe(false);
		expect(result.reason).toContain('already in use');
	});

	it('links.validPath parses an available path', async () => {
		respond(validPathOk);

		const result = (await invoke(LinksEndpoints.validPath, {
			path: 'fresh-path',
		})) as { valid: boolean };

		expect(result.valid).toBe(true);
	});

	it('links.insights GETs the insights route', async () => {
		respond(insights);

		await invoke(LinksEndpoints.insights, {
			link_id: 48213,
			metric: 'clicks',
			start_date: '2026-05-01',
			end_date: '2026-05-31',
			aggregate_interval: 'day',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/links/48213/insights');
		// ToneDen requires `metric` and names the window start_date/end_date.
		expect(lastRequest().params).toEqual({
			metric: 'clicks',
			start_date: '2026-05-01',
			end_date: '2026-05-31',
			aggregate_interval: 'day',
		});
	});

	it('links.insights refuses a call without a metric', async () => {
		const error = await captureError(
			invoke(LinksEndpoints.insights, { link_id: 48213 }),
		);
		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('links.insightsOverview GETs the overview route', async () => {
		respond(insights);

		await invoke(LinksEndpoints.insightsOverview, { link_id: 48213 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/links/48213/insights/overview');
	});
});

describe('attachments', () => {
	it('attachments.list GETs v1/attachments', async () => {
		respond(attachmentsEnvelope);

		const result = (await invoke(AttachmentsEndpoints.list, {})) as {
			attachments: unknown[];
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments');
		expect(result.attachments).toHaveLength(1);
	});

	it('attachments.listForUser GETs the user path', async () => {
		respond(attachmentsEnvelope);

		await invoke(AttachmentsEndpoints.listForUser, { user_id: 1 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/users/1/attachments');
	});

	it('attachments.get GETs one', async () => {
		respond(attachmentEnvelope);

		await invoke(AttachmentsEndpoints.get, { attachment_id: 9100 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments/9100');
	});

	it('attachments.create POSTs the fields it was given', async () => {
		respond(attachmentEnvelope);

		await invoke(AttachmentsEndpoints.create, {
			type: 'contest',
			title: 'Win a vinyl',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().body).toEqual({
			type: 'contest',
			title: 'Win a vinyl',
		});
	});

	it('attachments.update PUTs without the path id', async () => {
		respond(attachmentEnvelope);

		await invoke(AttachmentsEndpoints.update, {
			attachment_id: 9100,
			title: 'Win a signed vinyl',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments/9100');
		expect(lastRequest().body).toEqual({ title: 'Win a signed vinyl' });
	});

	it('attachments.update rejects an empty change', async () => {
		const error = await captureError(
			invoke(AttachmentsEndpoints.update, { attachment_id: 9100 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('attachments.delete DELETEs by id', async () => {
		respond(deleted);

		await invoke(AttachmentsEndpoints.delete, { attachment_id: 9100 });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
	});

	it('attachments.entries GETs the entries series', async () => {
		respond(attachmentStats);

		const result = (await invoke(AttachmentsEndpoints.entries, {
			attachment_id: 9100,
		})) as { data?: unknown[]; totals?: unknown };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments/9100/entries');
		expect(result.data).toHaveLength(1);
		expect(result.totals).toBeDefined();
	});

	it('attachments.entries and unlocks forward start_date and the interval', async () => {
		respond(attachmentStats);
		await invoke(AttachmentsEndpoints.entries, {
			attachment_id: 9100,
			start_date: '2026-05-01',
			aggregate_interval: 'week',
		});
		expect(lastRequest().params).toEqual({
			start_date: '2026-05-01',
			aggregate_interval: 'week',
		});

		respond(attachmentStats);
		await invoke(AttachmentsEndpoints.unlocks, {
			attachment_id: 9100,
			aggregate_interval: 'hour',
		});
		expect(lastRequest().path).toBe('/api/v1/attachments/9100/unlocks');
		expect(lastRequest().params).toEqual({ aggregate_interval: 'hour' });
	});

	it('attachments.entriesTotals GETs the totals route', async () => {
		respond(attachmentStats);

		await invoke(AttachmentsEndpoints.entriesTotals, { attachment_id: 9100 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments/9100/entries/totals');
	});

	it('attachments.unlocks GETs the unlocks series', async () => {
		respond(attachmentStats);

		await invoke(AttachmentsEndpoints.unlocks, { attachment_id: 9100 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments/9100/unlocks');
	});

	it('attachments.unlocksTotals GETs the totals route', async () => {
		respond(attachmentStats);

		await invoke(AttachmentsEndpoints.unlocksTotals, { attachment_id: 9100 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/attachments/9100/unlocks/totals');
	});

	it('attachments.unlockPlatforms GETs the platforms route', async () => {
		respond(attachmentStats);

		await invoke(AttachmentsEndpoints.unlockPlatforms, {
			attachment_id: 9100,
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/api/v1/attachments/9100/unlocks/platforms',
		);
	});
});

describe('campaigns', () => {
	it('campaigns.list GETs the user campaigns', async () => {
		respond(adCampaignsEnvelope);

		const result = (await invoke(CampaignsEndpoints.list, {
			user_id: 1,
		})) as { ad_campaigns: unknown[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/users/1/advertising/campaigns');
		expect(result.ad_campaigns).toHaveLength(1);
	});

	it('campaigns.get GETs one campaign', async () => {
		respond(adCampaignEnvelope);

		await invoke(CampaignsEndpoints.get, { campaign_id: 7788 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/advertising/campaigns/7788');
	});

	it('campaigns.create POSTs the given fields', async () => {
		respond(adCampaignEnvelope);

		await invoke(CampaignsEndpoints.create, {
			title: 'Spring tour',
			target_type: 'link',
			target: 'https://toneden.io/ada/new-single',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('POST');
		expect(lastRequest().path).toBe('/api/v1/advertising/campaigns');
		expect(lastRequest().body).toEqual({
			title: 'Spring tour',
			target_type: 'link',
			target: 'https://toneden.io/ada/new-single',
		});
	});

	it('campaigns.update PUTs without the path id', async () => {
		respond(adCampaignEnvelope);

		await invoke(CampaignsEndpoints.update, {
			campaign_id: 7788,
			status: 'paused',
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({ status: 'paused' });
	});

	it('campaigns.delete DELETEs the campaign', async () => {
		respond(deleted);

		await invoke(CampaignsEndpoints.delete, { campaign_id: 7788 });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
	});

	it('campaigns.insights GETs the insights route', async () => {
		respond(insights);

		await invoke(CampaignsEndpoints.insights, { campaign_id: 7788 });

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/api/v1/advertising/campaigns/7788/insights',
		);
	});

	it('campaigns.creativeInsights GETs the creative route', async () => {
		respond(insights);

		await invoke(CampaignsEndpoints.creativeInsights, { campaign_id: 7788 });

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/api/v1/advertising/campaigns/7788/creativeInsights',
		);
	});
});

describe('user lists and offline conversions', () => {
	it('userLists.list GETs the user lists', async () => {
		respond(userListsEnvelope);

		const result = (await invoke(UserListsEndpoints.list, {
			user_id: 1,
		})) as { user_lists: unknown[] };

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/users/1/advertising/userLists');
		expect(result.user_lists).toHaveLength(1);
	});

	it('userLists.create POSTs the account and type', async () => {
		respond(userListsEnvelope);

		await invoke(UserListsEndpoints.create, {
			external_ad_account_id: 'act_123',
			type: 'email',
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/advertising/userLists');
		expect(lastRequest().body).toEqual({
			external_ad_account_id: 'act_123',
			type: 'email',
		});
	});

	it('userLists.updateContacts POSTs the add list', async () => {
		respond(deleted);

		await invoke(UserListsEndpoints.updateContacts, {
			list_id: 55,
			add: [{ email: 'a@acme.com' }, { phone: '+15555550100', country: 'US' }],
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/api/v1/advertising/userLists/55/contacts',
		);
		// ToneDen takes contact objects, not bare strings.
		expect(lastRequest().body).toEqual({
			add: [{ email: 'a@acme.com' }, { phone: '+15555550100', country: 'US' }],
		});
	});

	it('userLists.updateContacts rejects a call with no change', async () => {
		const error = await captureError(
			invoke(UserListsEndpoints.updateContacts, { list_id: 55 }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('offlineConversions.upload POSTs to the user path', async () => {
		respond(deleted);

		await invoke(OfflineConversionsEndpoints.upload, {
			user_id: 1,
			events: [
				{
					user: { email: 'fan@example.com' },
					event: 'Purchase',
					timestamp: 1779000000,
					value: 25,
				},
			],
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe(
			'/api/v1/users/1/advertising/offlineConversions',
		);
		expect(lastRequest().method).toBe('POST');
		// The events go as a bare array; the user id stays in the path.
		expect(lastRequest().body).toEqual([
			{
				user: { email: 'fan@example.com' },
				event: 'Purchase',
				timestamp: 1779000000,
				value: 25,
			},
		]);
	});
});

describe('playbooks and users', () => {
	it('playbooks.get GETs one campaign', async () => {
		respond(playbookEnvelope);

		await invoke(PlaybooksEndpoints.get, { campaign_id: 9900 });

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/playbooks/campaigns/9900');
	});

	it('playbooks.create POSTs the template', async () => {
		respond(playbookEnvelope);

		await invoke(PlaybooksEndpoints.create, {
			title: 'Album rollout',
			template_id: 12,
		});

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/playbooks/campaigns');
		expect(lastRequest().body).toEqual({
			title: 'Album rollout',
			template_id: 12,
		});
	});

	it('playbooks.update PUTs without the path id', async () => {
		respond(playbookEnvelope);

		await invoke(PlaybooksEndpoints.update, {
			campaign_id: 9900,
			is_archived: true,
		});

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({ is_archived: true });
	});

	it('playbooks.delete DELETEs the campaign', async () => {
		respond(deleted);

		await invoke(PlaybooksEndpoints.delete, { campaign_id: 9900 });

		expectAuthenticated();
		expect(lastRequest().method).toBe('DELETE');
	});

	it('users.get GETs the profile', async () => {
		respond(userEnvelope);

		const result = (await invoke(UsersEndpoints.get, { user_id: 1 })) as {
			user: { username: string };
		};

		expectAuthenticated();
		expect(lastRequest().path).toBe('/api/v1/users/1');
		expect(result.user.username).toBe('ada');
	});

	it('users.update PUTs without the path id', async () => {
		respond(userEnvelope);

		await invoke(UsersEndpoints.update, { user_id: 1, display_name: 'Ada L.' });

		expectAuthenticated();
		expect(lastRequest().method).toBe('PUT');
		expect(lastRequest().body).toEqual({ display_name: 'Ada L.' });
	});

	it('users.update rejects a non-email address', async () => {
		const error = await captureError(
			invoke(UsersEndpoints.update, { user_id: 1, email: 'not-an-email' }),
		);

		expect((error as Error).name).toBe('ZodError');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
