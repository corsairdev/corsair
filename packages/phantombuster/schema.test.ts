import { PhantomBusterEndpointInputSchemas } from './endpoints/types';
import { PhantomBusterSchema } from './schema';

describe('PhantomBuster schema', () => {
	it('declares a semver version', () => {
		expect(PhantomBusterSchema.version).toBeDefined();
		expect(PhantomBusterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	/**
	 * Zero entities, deliberately: every operation is a live call against
	 * the PhantomBuster v2 API (agents, containers, scripts, branches, org
	 * storage, identities, captchas), not a record with a durable identity
	 * worth caching (see `schema/database.ts`).
	 */
	it('declares an empty entities map', () => {
		expect(typeof PhantomBusterSchema.entities).toBe('object');
		expect(PhantomBusterSchema.entities).not.toBeNull();
		expect(Object.keys(PhantomBusterSchema.entities)).toEqual([]);
	});
});

describe('PhantomBuster input schemas (docs-verified)', () => {
	it('fetchAgent requires a non-empty id', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAgent;
		expect(schema.safeParse({ id: 'abc123' }).success).toBe(true);
		expect(schema.safeParse({ id: '' }).success).toBe(false);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('fetchAllAgents takes no params (docs: array response, no search)', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAllAgents;
		expect(schema.safeParse({}).success).toBe(true);
	});

	it('launchAgent requires id and accepts docs-verified optionals', () => {
		const schema = PhantomBusterEndpointInputSchemas.launchAgent;
		expect(schema.safeParse({ id: 'abc' }).success).toBe(true);
		expect(
			schema.safeParse({ id: 'abc', argument: { search: 'foo' } }).success,
		).toBe(true);
		expect(
			schema.safeParse({ id: 'abc', arguments: { search: 'foo' } }).success,
		).toBe(true);
		expect(schema.safeParse({ id: 'abc', maxInstanceCount: 2 }).success).toBe(
			true,
		);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('fetchAgentOutput uses incremental params (docs: no status/mode/since)', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAgentOutput;
		expect(schema.safeParse({ id: 'abc' }).success).toBe(true);
		expect(schema.safeParse({ id: 'abc', fromOutputPos: 10 }).success).toBe(
			true,
		);
		expect(
			schema.safeParse({ id: 'abc', prevStatus: 'finished' }).success,
		).toBe(true);
		expect(schema.safeParse({ id: 'abc', prevStatus: 'invalid' }).success).toBe(
			false,
		);
	});

	it('saveAgent accepts the docs launchType enum (once / after agent)', () => {
		const schema = PhantomBusterEndpointInputSchemas.saveAgent;
		expect(schema.safeParse({ launchType: 'once' }).success).toBe(true);
		expect(schema.safeParse({ launchType: 'after agent' }).success).toBe(true);
		expect(schema.safeParse({ launchType: 'oneShot' }).success).toBe(false);
	});

	it('saveLeads requires linkedinProfileUrl per lead and caps at 20 (docs)', () => {
		const schema = PhantomBusterEndpointInputSchemas.saveLeads;
		expect(
			schema.safeParse({
				leads: [{ linkedinProfileUrl: 'https://linkedin.com/in/a' }],
			}).success,
		).toBe(true);
		expect(schema.safeParse({ leads: [] }).success).toBe(false);
		expect(schema.safeParse({ leads: [{ email: 'a@b.com' }] }).success).toBe(
			false,
		);
	});

	it('fetchAllContainers requires agentId', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchAllContainers;
		expect(schema.safeParse({ agentId: 'ag123' }).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('branches.create requires a branch name', () => {
		const schema = PhantomBusterEndpointInputSchemas.createBranch;
		expect(schema.safeParse({ name: 'staging' }).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('branches.fetchDiff requires a branch name (live API 400s without it)', () => {
		const schema = PhantomBusterEndpointInputSchemas.fetchBranchesDiff;
		expect(schema.safeParse({ name: 'master' }).success).toBe(true);
		expect(schema.safeParse({}).success).toBe(false);
	});

	it('branches.release requires name and at least one script id', () => {
		const schema = PhantomBusterEndpointInputSchemas.releaseBranch;
		expect(
			schema.safeParse({ name: 'master', scriptIds: ['s1'] }).success,
		).toBe(true);
		expect(schema.safeParse({ name: 'master', scriptIds: [] }).success).toBe(
			false,
		);
	});

	it('scripts.updateVisibility requires name, branch and a docs enum value', () => {
		const schema = PhantomBusterEndpointInputSchemas.updateScriptVisibility;
		expect(
			schema.safeParse({
				name: 'My Phantom.js',
				branch: 'master',
				visibility: 'public',
			}).success,
		).toBe(true);
		expect(
			schema.safeParse({
				name: 'My Phantom.js',
				branch: 'master',
				visibility: 'everyone',
			}).success,
		).toBe(false);
	});

	it('solveRecaptcha requires url, key and v2|v3', () => {
		const schema = PhantomBusterEndpointInputSchemas.solveRecaptcha;
		expect(
			schema.safeParse({ url: 'https://x.com', key: 'k', type: 'v3' }).success,
		).toBe(true);
		expect(
			schema.safeParse({ url: 'https://x.com', key: 'k', type: 'v1' }).success,
		).toBe(false);
	});

	it('requestAiCompletion requires at least one message', () => {
		const schema = PhantomBusterEndpointInputSchemas.requestAiCompletion;
		expect(
			schema.safeParse({ messages: [{ role: 'user', content: 'hi' }] }).success,
		).toBe(true);
		expect(schema.safeParse({ messages: [] }).success).toBe(false);
	});
});
