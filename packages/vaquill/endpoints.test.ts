import { Statutes } from './endpoints';
import {
	VaquillEndpointInputSchemas,
	VaquillEndpointOutputSchemas,
} from './endpoints/types';

/**
 * Every implemented endpoint pins its input and output schemas against a
 * fixture of the real vendor response; .github/PLUGIN_PR_RULES.md R2 requires
 * one test per endpoint.
 */

const SEARCH_HIT = {
	actId: 'USC_T42_C21_S1983',
	citation: '42 U.S.C. § 1983',
	title: 'Civil action for deprivation of rights',
	corpusType: 'USC',
	state: null,
	excerpt: 'Every person who, under color of any statute...',
};

describe('vaquill endpoints', () => {
	it('exports all 16 statute endpoints', () => {
		expect(Statutes.search).toBeDefined();
		expect(Statutes.count).toBeDefined();
		expect(Statutes.coverage).toBeDefined();
		expect(Statutes.divisions).toBeDefined();
		expect(Statutes.resolve).toBeDefined();
		expect(Statutes.resolveCitation).toBeDefined();
		expect(Statutes.section).toBeDefined();
		expect(Statutes.sections).toBeDefined();
		expect(Statutes.sectionBody).toBeDefined();
		expect(Statutes.sectionChanges).toBeDefined();
		expect(Statutes.sectionCitedBy).toBeDefined();
		expect(Statutes.sectionCrossState).toBeDefined();
		expect(Statutes.sectionDefinitions).toBeDefined();
		expect(Statutes.sectionRelated).toBeDefined();
		expect(Statutes.enactments).toBeDefined();
		expect(Statutes.extractCitations).toBeDefined();
	});

	describe('search', () => {
		it('accepts a natural language query with filters', () => {
			const parsed = VaquillEndpointInputSchemas.search.safeParse({
				query: 'insider trading penalties',
				corpusType: ['USC', 'CFR'],
				state: ['federal', 'ca'],
				limit: 10,
				matchType: 'phrase',
			});
			expect(parsed.success).toBe(true);
		});

		it('accepts a constitution article filter per the official API', () => {
			const parsed = VaquillEndpointInputSchemas.search.safeParse({
				query: 'due process',
				corpusType: 'CONSTITUTION',
				article: 'Amendment XIV',
			});
			expect(parsed.success).toBe(true);
		});

		it('accepts the corpus tokens added on 2026-10-07 and 2026-10-08', () => {
			for (const corpusType of [
				'FEDERAL_LOCAL_RULES',
				'STATE_REGISTER',
			] as const) {
				const parsed = VaquillEndpointInputSchemas.search.safeParse({
					query: 'open meeting',
					corpusType,
				});
				expect(parsed.success).toBe(true);
			}
		});

		it('accepts the four territories added on 2026-10-08', () => {
			for (const state of ['as', 'gu', 'mp', 'vi'] as const) {
				const parsed = VaquillEndpointInputSchemas.search.safeParse({
					query: 'public records',
					state,
				});
				expect(parsed.success).toBe(true);
			}
		});

		it('accepts a federal source slug and a field projection', () => {
			const parsed = VaquillEndpointInputSchemas.search.safeParse({
				query: 'due process',
				source: 'uscode',
				fields: ['actId', 'citation'],
			});
			expect(parsed.success).toBe(true);
		});

		it('rejects a query shorter than the vendor minimum', () => {
			const parsed = VaquillEndpointInputSchemas.search.safeParse({
				query: 'a',
			});
			expect(parsed.success).toBe(false);
		});

		it('rejects an unknown jurisdiction', () => {
			const parsed = VaquillEndpointInputSchemas.search.safeParse({
				query: 'statute of limitations',
				state: 'zz',
			});
			expect(parsed.success).toBe(false);
		});

		it('parses a real search page', () => {
			const parsed = VaquillEndpointOutputSchemas.search.safeParse({
				results: [SEARCH_HIT],
				count: 1,
				total: 42,
				offset: 0,
				hasMore: true,
				query: 'insider trading penalties',
				processingTimeMs: 812.4,
				creditsConsumed: 4,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('count', () => {
		it('accepts an empty body (counts the whole corpus)', () => {
			const parsed = VaquillEndpointInputSchemas.count.safeParse({});
			expect(parsed.success).toBe(true);
		});

		it('accepts a scoped count', () => {
			const parsed = VaquillEndpointInputSchemas.count.safeParse({
				corpusType: 'USC',
				titleNumber: 42,
			});
			expect(parsed.success).toBe(true);
		});

		it('parses a count response', () => {
			const parsed = VaquillEndpointOutputSchemas.count.safeParse({
				count: 8481,
				isExact: true,
				scope: { corpusType: 'USC', titleNumber: 42 },
				processingTimeMs: 1152.2,
				creditsConsumed: 1,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('coverage', () => {
		it('takes no input', () => {
			const parsed = VaquillEndpointInputSchemas.coverage.safeParse({});
			expect(parsed.success).toBe(true);
		});

		it('parses the coverage matrix', () => {
			const parsed = VaquillEndpointOutputSchemas.coverage.safeParse({
				data: {
					corpusTypes: [
						{
							token: 'USC',
							description: 'United States Code (federal statutes)',
							scope: 'federal',
						},
					],
					jurisdictions: [
						{
							code: 'ca',
							name: 'California',
							kind: 'state',
							sectionCount: 100000,
							hasData: true,
							statusBreakdown: {},
						},
					],
				},
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('divisions', () => {
		it('accepts a USC browse', () => {
			const parsed = VaquillEndpointInputSchemas.divisions.safeParse({
				corpusType: 'USC',
				titleNumber: 42,
				chapter: '21',
			});
			expect(parsed.success).toBe(true);
		});

		it('accepts the constitution corpora the official API browses', () => {
			const parsed = VaquillEndpointInputSchemas.divisions.safeParse({
				corpusType: 'CONSTITUTION',
				article: 'Amendment XIV',
			});
			expect(parsed.success).toBe(true);
		});

		it('rejects an unbrowsable corpus', () => {
			const parsed = VaquillEndpointInputSchemas.divisions.safeParse({
				corpusType: 'FEDERAL_REGISTER',
			});
			expect(parsed.success).toBe(false);
		});

		it('accepts a territory jurisdiction for a state code', () => {
			const parsed = VaquillEndpointInputSchemas.divisions.safeParse({
				corpusType: 'STATE',
				state: 'gu',
			});
			expect(parsed.success).toBe(true);
		});

		it('parses a divisions page', () => {
			const parsed = VaquillEndpointOutputSchemas.divisions.safeParse({
				corpusType: 'USC',
				level: 'sections',
				parentLabel: 'Title 42, Chapter 21',
				divisions: [
					{
						identifier: '1981',
						name: 'Civil action for deprivation of rights',
						kind: 'section',
						isLeaf: true,
						actId: 'USC_T42_C21_S1981',
					},
				],
				count: 1,
				truncated: false,
				creditsConsumed: 1,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('resolve', () => {
		it('accepts a batch of Bluebook citations', () => {
			const parsed = VaquillEndpointInputSchemas.resolve.safeParse({
				citations: ['42 U.S.C. 1983', 'Tex. Penal Code 22.01'],
				state: 'tx',
			});
			expect(parsed.success).toBe(true);
		});

		it('rejects an empty citation list', () => {
			const parsed = VaquillEndpointInputSchemas.resolve.safeParse({
				citations: [],
			});
			expect(parsed.success).toBe(false);
		});

		it('parses a resolve response with a miss', () => {
			const parsed = VaquillEndpointOutputSchemas.resolve.safeParse({
				results: [
					{
						resolved: true,
						inputCitation: '42 U.S.C. 1983',
						section: { actId: 'USC_T42_C21_S1983' },
					},
					{
						resolved: false,
						inputCitation: '42 U.S.C. 9999',
						section: null,
					},
				],
				resolvedCount: 1,
				count: 2,
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('section', () => {
		it('requires an act_id path param', () => {
			const parsed = VaquillEndpointInputSchemas.section.safeParse({});
			expect(parsed.success).toBe(false);
		});

		it('parses a section response', () => {
			const parsed = VaquillEndpointOutputSchemas.section.safeParse({
				section: SEARCH_HIT,
				processingTimeMs: 210.5,
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sections (batch)', () => {
		it('rejects more than 50 ids', () => {
			const parsed = VaquillEndpointInputSchemas.sections.safeParse({
				actIds: Array.from({ length: 51 }, (_, i) => `USC_T1_S${i}`),
			});
			expect(parsed.success).toBe(false);
		});

		it('parses a partial batch (notFound ids refunded)', () => {
			const parsed = VaquillEndpointOutputSchemas.sections.safeParse({
				sections: [SEARCH_HIT],
				notFound: ['USC_T99_C99_S9999'],
				notFoundDetail: [],
				count: 1,
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sectionBody', () => {
		it('accepts format and asOf options', () => {
			const parsed = VaquillEndpointInputSchemas.sectionBody.safeParse({
				act_id: 'USC_T42_C21_S1983',
				format: 'plain',
				asOf: '2020-01-15',
			});
			expect(parsed.success).toBe(true);
		});

		it('accepts the markdown and all formats per the official API', () => {
			for (const format of ['markdown', 'all', 'both'] as const) {
				const parsed = VaquillEndpointInputSchemas.sectionBody.safeParse({
					act_id: 'USC_T42_C21_S1983',
					format,
				});
				expect(parsed.success).toBe(true);
			}
		});

		it('rejects an unknown format', () => {
			const parsed = VaquillEndpointInputSchemas.sectionBody.safeParse({
				act_id: 'USC_T42_C21_S1983',
				format: 'pdf',
			});
			expect(parsed.success).toBe(false);
		});

		it('rejects a non-ISO asOf date', () => {
			const parsed = VaquillEndpointInputSchemas.sectionBody.safeParse({
				act_id: 'USC_T42_C21_S1983',
				asOf: 'January 2020',
			});
			expect(parsed.success).toBe(false);
		});

		it('parses a body response', () => {
			const parsed = VaquillEndpointOutputSchemas.sectionBody.safeParse({
				actId: 'USC_T42_C21_S1983',
				plain: 'Every person who, under color of any statute...',
				source: 'U.S. Code',
				sourceUrl: 'https://uscode.house.gov',
				available: true,
				creditsConsumed: 6,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sectionChanges', () => {
		it('accepts paging and change-kind filters', () => {
			const parsed = VaquillEndpointInputSchemas.sectionChanges.safeParse({
				act_id: 'USC_T26_C1_S1',
				limit: 3,
				sinceId: 100,
				changeKind: ['amended', 'removed'],
				order: 'desc',
			});
			expect(parsed.success).toBe(true);
		});

		it('rejects a limit above the vendor cap', () => {
			const parsed = VaquillEndpointInputSchemas.sectionChanges.safeParse({
				act_id: 'USC_T26_C1_S1',
				limit: 201,
			});
			expect(parsed.success).toBe(false);
		});

		it('parses a change history page', () => {
			const parsed = VaquillEndpointOutputSchemas.sectionChanges.safeParse({
				actId: 'USC_T26_C1_S1',
				section: SEARCH_HIT,
				changes: [
					{
						id: 12,
						changeKind: 'amended',
						detectedAt: '2026-01-05T00:00:00Z',
						citation: '26 U.S.C. § 1',
						hasDiff: true,
						corpusType: 'USC',
						state: null,
					},
				],
				total: 1,
				hasMore: false,
				cursor: null,
				creditsConsumed: 1,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sectionCitedBy', () => {
		it('accepts a limit up to the vendor cap of 100', () => {
			const parsed = VaquillEndpointInputSchemas.sectionCitedBy.safeParse({
				act_id: 'USC_T42_C21_S1983',
				limit: 100,
			});
			expect(parsed.success).toBe(true);
		});

		it('rejects a limit above the vendor cap', () => {
			const parsed = VaquillEndpointInputSchemas.sectionCitedBy.safeParse({
				act_id: 'USC_T42_C21_S1983',
				limit: 101,
			});
			expect(parsed.success).toBe(false);
		});

		it('parses a citers page', () => {
			const parsed = VaquillEndpointOutputSchemas.sectionCitedBy.safeParse({
				section: SEARCH_HIT,
				citers: [SEARCH_HIT],
				total: 1,
				truncated: false,
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sectionCrossState', () => {
		it('accepts a limit up to the vendor cap of 25 and rejects 26', () => {
			const accepted = VaquillEndpointInputSchemas.sectionCrossState.safeParse({
				act_id: 'USC_T42_C21_S1983',
				limit: 25,
			});
			expect(accepted.success).toBe(true);
			const rejected = VaquillEndpointInputSchemas.sectionCrossState.safeParse({
				act_id: 'USC_T42_C21_S1983',
				limit: 26,
			});
			expect(rejected.success).toBe(false);
		});

		it('parses a comparison with equivalents', () => {
			const parsed = VaquillEndpointOutputSchemas.sectionCrossState.safeParse({
				section: SEARCH_HIT,
				neighbors: [{ section: SEARCH_HIT, state: 'ny', similarity: 0.91 }],
				statesCovered: 5,
				creditsConsumed: 6,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sectionDefinitions', () => {
		it('takes only an act_id', () => {
			const parsed = VaquillEndpointInputSchemas.sectionDefinitions.safeParse({
				act_id: 'USC_T42_C21_S1983',
			});
			expect(parsed.success).toBe(true);
		});

		it('parses defined terms', () => {
			const parsed = VaquillEndpointOutputSchemas.sectionDefinitions.safeParse({
				section: SEARCH_HIT,
				definitionsSection: SEARCH_HIT,
				terms: [
					{
						term: 'color of law',
						definition: 'Acting under a government official’s authority.',
					},
				],
				total: 1,
				creditsConsumed: 4,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sectionRelated', () => {
		it('accepts a limit up to the vendor cap of 10 and rejects 11', () => {
			const accepted = VaquillEndpointInputSchemas.sectionRelated.safeParse({
				act_id: 'USC_T42_C21_S1983',
				limit: 10,
			});
			expect(accepted.success).toBe(true);
			const rejected = VaquillEndpointInputSchemas.sectionRelated.safeParse({
				act_id: 'USC_T42_C21_S1983',
				limit: 11,
			});
			expect(rejected.success).toBe(false);
		});

		it('parses neighbours either side', () => {
			const parsed = VaquillEndpointOutputSchemas.sectionRelated.safeParse({
				section: SEARCH_HIT,
				previous: [{ ...SEARCH_HIT, actId: 'USC_T42_C21_S1982' }],
				next: [{ ...SEARCH_HIT, actId: 'USC_T42_C21_S1984' }],
				container: 'USC_T42_C21',
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('resolveCitation (single)', () => {
		it('requires a cite param', () => {
			const parsed = VaquillEndpointInputSchemas.resolveCitation.safeParse({});
			expect(parsed.success).toBe(false);
		});

		it('parses a single-citation miss', () => {
			const parsed = VaquillEndpointOutputSchemas.resolveCitation.safeParse({
				resolved: false,
				inputCitation: '42 U.S.C. 9999',
				section: null,
				missReason: 'no_match',
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('enactments', () => {
		it('parses an enactments list', () => {
			const parsed = VaquillEndpointOutputSchemas.enactments.safeParse({
				actId: 'STATE_CA_Cciv_D3_P4_T5_C2_S1950.7',
				jurisdiction: 'ca',
				supported: true,
				enactments: [
					{
						sessionLawId: 'CA_1988_1234',
						citation: 'Cal. Stats. 1988, ch. 1234',
						action: 'amended',
					},
				],
				count: 1,
				creditsConsumed: 2,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('extractCitations', () => {
		it('requires text', () => {
			const parsed = VaquillEndpointInputSchemas.extractCitations.safeParse({});
			expect(parsed.success).toBe(false);
		});

		it('parses an extraction with resolve', () => {
			const parsed = VaquillEndpointOutputSchemas.extractCitations.safeParse({
				citations: [{ citation: '42 U.S.C. 1983', resolved: true }],
				counts: { found: 1, distinct: 1 },
				truncated: false,
				textChars: 210,
				extractorVersion: 'v3',
				creditsConsumed: 4,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('sessionLaws', () => {
		it('list requires a jurisdiction', () => {
			const parsed = VaquillEndpointInputSchemas.sessionLawsList.safeParse({});
			expect(parsed.success).toBe(false);
		});

		it('list accepts territory jurisdictions the statutes API does not', () => {
			for (const jurisdiction of ['gu', 'vi', 'mp', 'as'] as const) {
				const parsed = VaquillEndpointInputSchemas.sessionLawsList.safeParse({
					jurisdiction,
				});
				expect(parsed.success).toBe(true);
			}
		});

		it('search rejects a short query', () => {
			const parsed = VaquillEndpointInputSchemas.sessionLawsSearch.safeParse({
				query: 'a',
			});
			expect(parsed.success).toBe(false);
		});

		it('search accepts a limit of 25 and an offset of 59, and rejects one past either', () => {
			const accepted = VaquillEndpointInputSchemas.sessionLawsSearch.safeParse({
				query: 'tenant protections',
				limit: 25,
				offset: 59,
			});
			expect(accepted.success).toBe(true);
			const overLimit = VaquillEndpointInputSchemas.sessionLawsSearch.safeParse(
				{
					query: 'tenant protections',
					limit: 26,
				},
			);
			expect(overLimit.success).toBe(false);
			const overOffset =
				VaquillEndpointInputSchemas.sessionLawsSearch.safeParse({
					query: 'tenant protections',
					offset: 60,
				});
			expect(overOffset.success).toBe(false);
		});

		it('list accepts a limit of 200 and rejects 201', () => {
			const accepted = VaquillEndpointInputSchemas.sessionLawsList.safeParse({
				jurisdiction: 'ca',
				limit: 200,
			});
			expect(accepted.success).toBe(true);
			const rejected = VaquillEndpointInputSchemas.sessionLawsList.safeParse({
				jurisdiction: 'ca',
				limit: 201,
			});
			expect(rejected.success).toBe(false);
		});

		it('parses a list page', () => {
			const parsed = VaquillEndpointOutputSchemas.sessionLawsList.safeParse({
				results: [
					{
						sessionLawId: 'CA_1988_1234',
						jurisdiction: 'ca',
						citation: 'Cal. Stats. 1988, ch. 1234',
						textStatus: 'held',
					},
				],
				count: 1,
				hasMore: false,
				creditsConsumed: 1,
			});
			expect(parsed.success).toBe(true);
		});

		it('parses the changes feed', () => {
			const parsed = VaquillEndpointOutputSchemas.sessionLawsChanges.safeParse({
				changes: [
					{
						id: 5,
						jurisdiction: 'tx',
						changeKind: 'added',
						sessionLawId: 'TX_2025_99',
					},
				],
				count: 1,
				cursor: 5,
				hasMore: false,
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('alerts', () => {
		it('boards parses the documented envelope', () => {
			const parsed = VaquillEndpointOutputSchemas.boards.safeParse({
				data: {
					boards: [
						{
							corpusType: 'state',
							state: 'wa',
							label: 'State statutes WA',
							cadence: 'monthly',
							scopable: true,
							scopeBrowseCorpus: 'STATE',
						},
					],
					total: 244,
					hasMore: false,
				},
				meta: { processingTimeMs: 12.4, creditsConsumed: 0 },
			});
			expect(parsed.success).toBe(true);
		});

		it('watchesCreate requires a corpusType', () => {
			const parsed = VaquillEndpointInputSchemas.watchesCreate.safeParse({
				channel: 'webhook',
			});
			expect(parsed.success).toBe(false);
		});

		it('watchesCreate accepts a webhook watch with a scope', () => {
			const parsed = VaquillEndpointInputSchemas.watchesCreate.safeParse({
				corpusType: 'state',
				state: 'wa',
				channel: 'webhook',
				webhookUrl: 'https://example.com/hooks/vaquill',
				scope: { title: '21', part: '314' },
			});
			expect(parsed.success).toBe(true);
		});

		it('watchesCreate accepts a federal board and an omitted state', () => {
			const federal = VaquillEndpointInputSchemas.watchesCreate.safeParse({
				corpusType: 'federal_register',
				state: 'federal',
				channel: 'email',
				emailAddress: 'alerts@example.com',
			});
			expect(federal.success).toBe(true);
			const unscoped = VaquillEndpointInputSchemas.watchesCreate.safeParse({
				corpusType: 'cfr',
			});
			expect(unscoped.success).toBe(true);
		});

		it('watchesList accepts a limit of 200 and rejects 201', () => {
			const accepted = VaquillEndpointInputSchemas.watchesList.safeParse({
				limit: 200,
			});
			expect(accepted.success).toBe(true);
			const rejected = VaquillEndpointInputSchemas.watchesList.safeParse({
				limit: 201,
			});
			expect(rejected.success).toBe(false);
		});

		it('watchesDelete parses the empty 204 body', () => {
			const parsed =
				VaquillEndpointOutputSchemas.watchesDelete.safeParse(undefined);
			expect(parsed.success).toBe(true);
		});

		it('watchChanges parses the documented envelope', () => {
			const parsed = VaquillEndpointOutputSchemas.watchChanges.safeParse({
				data: {
					changes: [
						{
							id: 91,
							refreshLogId: 4412,
							corpusType: 'state_regulation',
							state: 'wa',
							changeKind: 'amended',
							actId: 'CFR_T33_P100_S100_901',
							citation: '33 C.F.R. § 100.901 (2026)',
							title: 'Special local regulations',
							detectedAt: '2026-08-07T04:10:00Z',
							hasDiff: true,
						},
					],
				},
				meta: {
					processingTimeMs: 12.0,
					creditsConsumed: 0,
					cursor: 91,
					hasMore: false,
				},
			});
			expect(parsed.success).toBe(true);
		});

		it('watchChangeDiff parses the documented data envelope', () => {
			const parsed = VaquillEndpointOutputSchemas.watchChangeDiff.safeParse({
				data: {
					changeId: 91,
					changeKind: 'amended',
					beforeText: 'An application...',
					afterText: 'An application for approval...',
					hasBefore: true,
					hasAfter: true,
				},
				meta: { processingTimeMs: 8.1, creditsConsumed: 1 },
			});
			expect(parsed.success).toBe(true);
		});
	});

	describe('account', () => {
		it('parses the credit balance', () => {
			const parsed = VaquillEndpointOutputSchemas.creditsBalance.safeParse({
				creditsRemaining: 8412,
				usdRemaining: 84.12,
				plan: 'payg',
				totalPurchased: 10000,
				totalConsumed: 1588,
				asOf: '2026-10-14T00:00:00Z',
			});
			expect(parsed.success).toBe(true);
		});

		it('parses the pricing card', () => {
			const parsed = VaquillEndpointOutputSchemas.creditsPricing.safeParse({
				dollarPerCredit: 0.01,
				minCredits: 1000,
				maxCredits: 1000000,
			});
			expect(parsed.success).toBe(true);
		});
	});
});
