import { UNVERIFIED_ROUTES } from './endpoints/segments-v2';
import { activecampaignEndpointMeta } from './index';

/**
 * Keeps the honesty marker honest.
 *
 * `UNVERIFIED_ROUTES` records the operations whose URL could not be confirmed
 * against a live ActiveCampaign account. It is quoted in the PR body, so it
 * has to stay in step with the registry: an entry naming an operation that no
 * longer exists would understate the risk, and a V2 segment operation missing
 * from the set would hide it entirely.
 */

const META = activecampaignEndpointMeta as Record<
	string,
	{ riskLevel: string; description: string }
>;

const toKey = (path: string) =>
	path.replace(/\.(.)/g, (_m, c: string) => c.toUpperCase());

describe('unverified route declaration', () => {
	const registered = Object.keys(META).map(toKey);

	it('lists exactly the fourteen V2 segment operations', () => {
		expect(UNVERIFIED_ROUTES.size).toBe(14);
	});

	it('names only operations that actually exist', () => {
		expect(registered.length).toBeGreaterThan(0);
		for (const op of UNVERIFIED_ROUTES) {
			expect(registered).toContain(op);
		}
	});

	/**
	 * Every V2 segment operation must be declared unverified. If one is added
	 * later against a confirmed route, remove it from the set deliberately -
	 * this test failing is the prompt to do that.
	 */
	it('covers every V2 segment operation in the registry', () => {
		const v2 = registered.filter((k) => k.startsWith('segmentsV2'));
		expect(v2).toHaveLength(14);
		for (const op of v2) {
			expect(UNVERIFIED_ROUTES.has(op)).toBe(true);
		}
	});

	/**
	 * The legacy `/segments` collection answers 200 on a live account and is
	 * implemented separately, so it must not be marked unverified.
	 */
	it('does not mark the verified legacy segment operations', () => {
		const legacy = registered.filter(
			(k) => k.startsWith('segments') && !k.startsWith('segmentsV2'),
		);
		expect(legacy.length).toBeGreaterThan(0);
		for (const op of legacy) {
			expect(UNVERIFIED_ROUTES.has(op)).toBe(false);
		}
	});

	it('accounts for under 5 per cent of the operation surface', () => {
		// A sanity bound: if this ever grows large, the plugin has drifted from
		// being evidence-based and the PR body claim needs rewriting.
		const share = UNVERIFIED_ROUTES.size / Object.keys(META).length;
		expect(share).toBeLessThan(0.05);
	});
});
