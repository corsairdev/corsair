import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { runInNewContext } from 'node:vm';

import {
	CAMPAIGN_INIT,
	CAMPAIGN_MAX_AGE_MS,
	CAMPAIGN_STORE_KEY,
	campaignFrom,
	campaignParams,
	handoffCampaign,
	storedCampaign,
} from './claim-campaign';

// Ported from lug.dev (hub apps/lug/src/lib/campaign.test.ts).

const NOW = Date.UTC(2026, 10, 17, 12);
const saved = (c: unknown, at = NOW) => JSON.stringify({ c, at });

// Runs the inline script the way the browser does, against a fake location and storage.
function runInit(
	search: string,
	store: Map<string, string>,
	opts: { throws?: boolean } = {},
) {
	const localStorage = {
		setItem(key: string, value: string) {
			if (opts.throws) throw new Error('SecurityError');
			store.set(key, value);
		},
	};
	runInNewContext(CAMPAIGN_INIT, {
		location: { search },
		localStorage,
		URLSearchParams,
	});
}

describe('campaignFrom', () => {
	it('reads the three tags Hub records and nothing else', () => {
		assert.deepEqual(
			campaignFrom(
				'?utm_source=piyushgarg_youtube&utm_medium=video&utm_campaign=gateway&utm_term=x&ref=y&step=pick',
			),
			{
				utm_source: 'piyushgarg_youtube',
				utm_medium: 'video',
				utm_campaign: 'gateway',
			},
		);
	});

	it('drops empty values and clips long ones to 200', () => {
		const c = campaignFrom(
			`?utm_source=%20%20&utm_campaign=${'a'.repeat(500)}`,
		);
		assert.equal(c.utm_source, undefined);
		assert.equal(c.utm_campaign?.length, 200);
	});
});

describe('storedCampaign', () => {
	it('reads back a saved visit', () => {
		assert.deepEqual(storedCampaign(saved({ utm_source: 'x' }), NOW + 1000), {
			utm_source: 'x',
		});
	});

	it('forgets a visit older than a week, or from the future', () => {
		assert.deepEqual(
			storedCampaign(
				saved({ utm_source: 'x' }, NOW - CAMPAIGN_MAX_AGE_MS - 1),
				NOW,
			),
			{},
		);
		assert.deepEqual(
			storedCampaign(saved({ utm_source: 'x' }, NOW + 60_000), NOW),
			{},
		);
	});

	it('survives garbage', () => {
		for (const raw of [
			null,
			'',
			'{',
			'[]',
			'null',
			'{"c":"x","at":1}',
			JSON.stringify({ c: { utm_source: 7 }, at: NOW }),
		]) {
			assert.deepEqual(storedCampaign(raw, NOW), {}, String(raw));
		}
	});
});

describe('handoffCampaign', () => {
	it("prefers the page's own tags", () => {
		assert.deepEqual(
			handoffCampaign('?utm_source=now', saved({ utm_source: 'before' }), NOW),
			{
				utm_source: 'now',
			},
		);
	});

	it('falls back to the saved visit once the flow has rewritten the query', () => {
		assert.deepEqual(
			handoffCampaign(
				'?step=review',
				saved({ utm_source: 'before', utm_medium: 'm' }),
				NOW,
			),
			{ utm_source: 'before', utm_medium: 'm' },
		);
	});
});

describe('campaignParams', () => {
	it('encodes each tag in a fixed order', () => {
		assert.equal(
			campaignParams({ utm_campaign: 'a b&c=d', utm_source: 'x' }),
			'&utm_source=x&utm_campaign=a%20b%26c%3Dd',
		);
	});

	it('is empty without tags', () => {
		assert.equal(campaignParams(undefined), '');
		assert.equal(campaignParams({}), '');
	});
});

describe('CAMPAIGN_INIT', () => {
	it('saves a tagged landing in the shape storedCampaign reads', () => {
		const store = new Map<string, string>();
		runInit(
			'?utm_source=piyushgarg_youtube&utm_campaign=gateway&step=pick',
			store,
		);
		assert.deepEqual(
			storedCampaign(store.get(CAMPAIGN_STORE_KEY) ?? null, Date.now()),
			{
				utm_source: 'piyushgarg_youtube',
				utm_campaign: 'gateway',
			},
		);
	});

	it('leaves the last tagged visit in place on an untagged one', () => {
		const store = new Map([
			[CAMPAIGN_STORE_KEY, saved({ utm_source: 'before' })],
		]);
		runInit('?step=review', store);
		assert.equal(
			store.get(CAMPAIGN_STORE_KEY),
			saved({ utm_source: 'before' }),
		);
	});

	it('never throws when storage is blocked', () => {
		assert.doesNotThrow(() =>
			runInit('?utm_source=x', new Map(), { throws: true }),
		);
	});

	it('clips like campaignFrom', () => {
		const store = new Map<string, string>();
		runInit(`?utm_source=${'a'.repeat(500)}`, store);
		assert.equal(
			storedCampaign(store.get(CAMPAIGN_STORE_KEY) ?? null, Date.now())
				.utm_source?.length,
			200,
		);
	});
});
