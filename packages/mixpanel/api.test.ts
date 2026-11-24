import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { mixpanel } from './index';

/**
 * Live run against a throwaway Mixpanel project. Skipped unless the service
 * account, the project id and the project token are set. Writes use made-up
 * ids prefixed "corsair-plugin-test" and clean up after themselves.
 *
 * Some APIs are plan-gated, so on a free project the expected answer is an
 * error, not data: the Query API reports answer 402 plan_restricted, Data
 * Pipelines 401, the Platform API 404 and organization-level service account
 * calls 403 for a project service account. Those count as reached.
 */
const env = {
	MIXPANEL_SERVICE_ACCOUNT_USERNAME:
		process.env.MIXPANEL_SERVICE_ACCOUNT_USERNAME,
	MIXPANEL_SERVICE_ACCOUNT_SECRET: process.env.MIXPANEL_SERVICE_ACCOUNT_SECRET,
	MIXPANEL_PROJECT_ID: process.env.MIXPANEL_PROJECT_ID,
	MIXPANEL_PROJECT_TOKEN: process.env.MIXPANEL_PROJECT_TOKEN,
};
const missing = Object.entries(env)
	.filter(([, value]) => !value)
	.map(([name]) => name);
const describeIfKey = missing.length === 0 ? describe : describe.skip;
if (missing.length > 0) {
	console.warn(`Skipping Mixpanel live tests: set ${missing.join(', ')}.`);
}

const workspaceId = Number(process.env.MIXPANEL_WORKSPACE_ID ?? '0');
const organizationId = Number(process.env.MIXPANEL_ORGANIZATION_ID ?? '0');
const today = new Date().toISOString().slice(0, 10);
const RUN = `corsair-plugin-test-${Date.now()}`;

// The reason each plan gate gives, so an unrelated error with the same status
// (a wrong route's 404, a validation 400) still fails.
const GATE_REASONS: Record<number, RegExp> = {
	402: /plan_restricted/,
	401: /authorization failed/i,
	403: /does not have permissions/i,
};

// The Platform API's own 404 carries an error_id; a wrong route's does not.
function platformNotFound(error: ApiError): boolean {
	return (
		error.status === 404 &&
		typeof (error.body as { error_id?: unknown } | null)?.error_id === 'string'
	);
}

type Outcome = { op: string; result: 'pass' | 'gated' | 'fail'; note: string };
const outcomes: Outcome[] = [];

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'mixpanel', 'default');
	const corsair = createCorsair({
		plugins: [mixpanel()],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	// Stored the way a connect link stores them: api_key is the service
	// account secret, the rest are account fields.
	await corsair.mixpanel.keys.issue_new_dek();
	await corsair.mixpanel.keys.set_api_key(
		env.MIXPANEL_SERVICE_ACCOUNT_SECRET ?? '',
	);
	await corsair.mixpanel.keys.set_service_account_username(
		env.MIXPANEL_SERVICE_ACCOUNT_USERNAME ?? '',
	);
	await corsair.mixpanel.keys.set_project_id(env.MIXPANEL_PROJECT_ID ?? '');
	await corsair.mixpanel.keys.set_project_token(
		env.MIXPANEL_PROJECT_TOKEN ?? '',
	);
	if (process.env.MIXPANEL_GDPR_TOKEN) {
		await corsair.mixpanel.keys.set_gdpr_token(process.env.MIXPANEL_GDPR_TOKEN);
	}
	if (process.env.MIXPANEL_REGION) {
		await corsair.mixpanel.keys.set_region(process.env.MIXPANEL_REGION);
	}
	return { corsair, testDb };
}

/**
 * Runs one call. `gatedStatus` is the status a free project answers for a
 * plan-gated API; anything else failing fails the test.
 */
async function attempt<T>(
	op: string,
	fn: () => Promise<T>,
	gatedStatus?: number,
	gatedReason?: RegExp,
): Promise<T | undefined> {
	try {
		const value = await fn();
		outcomes.push({ op, result: 'pass', note: '' });
		return value;
	} catch (error) {
		if (
			gatedStatus !== undefined &&
			error instanceof ApiError &&
			error.status === gatedStatus &&
			(gatedStatus === 404
				? platformNotFound(error)
				: (gatedReason ?? GATE_REASONS[gatedStatus] ?? /./).test(error.message))
		) {
			outcomes.push({ op, result: 'gated', note: `${error.status}` });
			return undefined;
		}
		const note = error instanceof Error ? error.message.slice(0, 160) : 'error';
		outcomes.push({ op, result: 'fail', note });
		throw error;
	}
}

describeIfKey('mixpanel live', () => {
	jest.setTimeout(180_000);
	let client: Awaited<ReturnType<typeof createClient>>;
	const api = () => client.corsair.mixpanel.api;

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(() => {
		client?.testDb.cleanup();
		const pad = (text: string, n: number) => text.padEnd(n).slice(0, n);
		const lines = outcomes.map(
			(o) => `${pad(o.result.toUpperCase(), 6)} ${pad(o.op, 40)} ${o.note}`,
		);
		const count = (r: Outcome['result']) =>
			outcomes.filter((o) => o.result === r).length;
		console.log(
			`${lines.join('\n')}\n\nMixpanel live: ${count('pass')} passed, ${count('gated')} plan-gated (expected on a free project), ${count('fail')} failed, ${outcomes.length} calls`,
		);
	});

	it('ingests events', async () => {
		const events = [1, 2].map((n) => ({
			event: 'corsair-plugin-test',
			properties: {
				time: Math.floor(Date.now() / 1000) - n,
				distinct_id: `${RUN}-user`,
				$insert_id: `${RUN.slice(-20)}-${n}`,
				source: 'corsair',
			},
		}));
		const imported = await attempt('events.import', () =>
			api().events.import({ events }),
		);
		expect(imported?.num_records_imported).toBe(2);
		const tracked = await attempt('events.track', () =>
			api().events.track({
				events: [
					{
						event: 'corsair-plugin-test',
						properties: { distinct_id: `${RUN}-user` },
					},
				],
			}),
		);
		expect(tracked?.status).toBe(1);
	});

	it('round-trips a user profile', async () => {
		const distinct_id = `${RUN}-user`;
		await attempt('profiles.set', () =>
			api().profiles.set({ distinct_id, $set: { plan: 'test', seats: 1 } }),
		);
		await attempt('profiles.setOnce', () =>
			api().profiles.setOnce({ distinct_id, $set_once: { first_seen: today } }),
		);
		await attempt('profiles.increment', () =>
			api().profiles.increment({ distinct_id, $add: { seats: 2 } }),
		);
		await attempt('profiles.union', () =>
			api().profiles.union({ distinct_id, $union: { tags: ['a', 'b'] } }),
		);
		await attempt('profiles.append', () =>
			api().profiles.append({ distinct_id, $append: { tags: 'c' } }),
		);
		await attempt('profiles.remove', () =>
			api().profiles.remove({ distinct_id, $remove: { tags: 'a' } }),
		);
		await attempt('profiles.unset', () =>
			api().profiles.unset({ distinct_id, $unset: ['first_seen'] }),
		);
		await attempt('profiles.batchUpdate', () =>
			api().profiles.batchUpdate({
				updates: [{ $distinct_id: distinct_id, $set: { batch: true } }],
			}),
		);
		const found = await attempt('profiles.query', () =>
			api().profiles.query({
				distinct_id,
				output_properties: ['plan', 'seats'],
			}),
		);
		expect(Array.isArray(found?.results)).toBe(true);
		await attempt(
			'profiles.activity',
			() =>
				api().profiles.activity({
					distinct_ids: [distinct_id],
					from_date: today,
					to_date: today,
				}),
			402,
		);
		const deleted = await attempt('profiles.delete', () =>
			api().profiles.delete({ distinct_id }),
		);
		expect(deleted?.status).toBe(1);
	});

	it('round-trips a group profile', async () => {
		const ref = { group_key: 'company', group_id: `${RUN}-co` };
		await attempt('groups.set', () =>
			api().groups.set({ ...ref, $set: { tier: 'test' } }),
		);
		await attempt('groups.setOnce', () =>
			api().groups.setOnce({ ...ref, $set_once: { created: today } }),
		);
		await attempt('groups.union', () =>
			api().groups.union({ ...ref, $union: { regions: ['eu'] } }),
		);
		await attempt('groups.remove', () =>
			api().groups.remove({ ...ref, $remove: { regions: 'eu' } }),
		);
		await attempt('groups.unset', () =>
			api().groups.unset({ ...ref, $unset: ['created'] }),
		);
		await attempt('groups.batchUpdate', () =>
			api().groups.batchUpdate({
				updates: [
					{
						$group_key: ref.group_key,
						$group_id: ref.group_id,
						$set: { b: 1 },
					},
				],
			}),
		);
		await attempt('groups.delete', () => api().groups.delete(ref));
	});

	it('sends identity events', async () => {
		await attempt('identity.createIdentity', () =>
			api().identity.createIdentity({
				identified_id: `${RUN}-known`,
				anon_id: `${RUN}-anon`,
			}),
		);
		await attempt('identity.createAlias', () =>
			api().identity.createAlias({
				distinct_id: `${RUN}-known`,
				alias: `${RUN}-alias`,
			}),
		);
		// Projects on Simplified ID Merge (every new project) refuse $merge:
		// 400 "identity events are not allowed when project is using
		// simplified identity management".
		await attempt(
			'identity.merge',
			() =>
				api().identity.merge({
					distinct_ids: [`${RUN}-known`, `${RUN}-anon`],
				}),
			400,
			/simplified identity management/,
		);
	});

	it('reads raw export, lookup tables, service accounts and warehouse imports', async () => {
		const exported = await attempt('export.events', () =>
			api().export.events({ from_date: today, to_date: today, limit: 50 }),
		);
		expect(Array.isArray(exported?.events)).toBe(true);
		await attempt('lookupTables.list', () => api().lookupTables.list({}));
		await attempt('serviceAccounts.listForProject', () =>
			api().serviceAccounts.listForProject({}),
		);
		await attempt('warehouseImports.list', () =>
			api().warehouseImports.list({}),
		);
		if (organizationId > 0) {
			await attempt(
				'serviceAccounts.list',
				() => api().serviceAccounts.list({ organization_id: organizationId }),
				403,
			);
		}
	});

	it('round-trips an annotation', async () => {
		const tag = await attempt('annotations.createTag', () =>
			api().annotations.createTag({ name: RUN }),
		);
		await attempt('annotations.listTags', () => api().annotations.listTags({}));
		const created = await attempt('annotations.create', () =>
			api().annotations.create({
				date: `${today} 00:00:00`,
				description: RUN,
				tags: typeof tag?.id === 'number' ? [tag.id] : undefined,
			}),
		);
		const id = created?.results?.id;
		expect(typeof id).toBe('number');
		await attempt('annotations.get', () =>
			api().annotations.get({ annotation_id: id as number }),
		);
		await attempt('annotations.update', () =>
			api().annotations.update({
				annotation_id: id as number,
				description: `${RUN} updated`,
			}),
		);
		await attempt('annotations.list', () =>
			api().annotations.list({ fromDate: today, toDate: today }),
		);
		await attempt('annotations.delete', () =>
			api().annotations.delete({ annotation_id: id as number }),
		);
	});

	it('round-trips a Lexicon schema', async () => {
		const name = RUN;
		const schema = {
			description: 'corsair plugin test',
			properties: { plan: { type: 'string' } },
		};
		await attempt('lexicon.upsert', () =>
			api().lexicon.upsert({ entity_type: 'event', name, schema }),
		);
		await attempt('lexicon.get', () =>
			api().lexicon.get({ entity_type: 'event', name }),
		);
		await attempt('lexicon.listForEntity', () =>
			api().lexicon.listForEntity({ entity_type: 'event', entity_name: name }),
		);
		await attempt('lexicon.upsertMany', () =>
			api().lexicon.upsertMany({
				entries: [
					{ entityType: 'event', name: `${name}-2`, schemaJson: schema },
				],
				truncate: false,
			}),
		);
		await attempt('lexicon.list', () => api().lexicon.list({}));
		await attempt('lexicon.delete', () =>
			api().lexicon.delete({ entity_type: 'event', name }),
		);
		await attempt('lexicon.deleteForEntity', () =>
			api().lexicon.deleteForEntity({
				entity_type: 'event',
				entity_name: `${name}-2`,
			}),
		);
	});

	it('reads feature flags and experiments', async () => {
		await attempt('featureFlags.definitions', () =>
			api().featureFlags.definitions({}),
		);
		await attempt('featureFlags.evaluate', () =>
			api().featureFlags.evaluate({ distinct_id: `${RUN}-user` }),
		);
		if (workspaceId > 0) {
			await attempt('featureFlags.list', () =>
				api().featureFlags.list({ workspace_id: workspaceId }),
			);
			await attempt('experiments.list', () =>
				api().experiments.list({ workspace_id: workspaceId }),
			);
		}
	});

	it('round-trips a disabled feature flag and a draft experiment', async () => {
		if (workspaceId <= 0) return;
		const flag = {
			workspace_id: workspaceId,
			name: RUN,
			key: RUN,
			tags: [],
			status: 'disabled' as const,
			context: 'distinct_id',
			serving_method: 'remote_or_local' as const,
			ruleset: {
				variants: [
					{ key: 'on', value: true, is_control: false, split: 0 },
					{ key: 'off', value: false, is_control: true, split: 1 },
				],
				rollout: [{ rollout_percentage: 0, variant_splits: { on: 0, off: 1 } }],
			},
		};
		const created = await attempt('featureFlags.create', () =>
			api().featureFlags.create(flag),
		);
		const flagId = created?.results?.id;
		expect(typeof flagId).toBe('string');
		await attempt('featureFlags.get', () =>
			api().featureFlags.get({
				workspace_id: workspaceId,
				flag_id: flagId as string,
			}),
		);
		await attempt('featureFlags.update', () =>
			api().featureFlags.update({
				...flag,
				flag_id: flagId as string,
				description: 'updated',
			}),
		);
		await attempt('featureFlags.delete', () =>
			api().featureFlags.delete({
				workspace_id: workspaceId,
				flag_id: flagId as string,
			}),
		);

		const experiment = await attempt('experiments.create', () =>
			api().experiments.create({ workspace_id: workspaceId, name: RUN }),
		);
		const experimentId = experiment?.results?.id;
		expect(typeof experimentId).toBe('string');
		const ref = {
			workspace_id: workspaceId,
			experiment_id: experimentId as string,
		};
		await attempt('experiments.get', () => api().experiments.get(ref));
		await attempt('experiments.update', () =>
			api().experiments.update({ ...ref, description: 'updated' }),
		);
		await attempt('experiments.archive', () => api().experiments.archive(ref));
		await attempt('experiments.unarchive', () =>
			api().experiments.unarchive(ref),
		);
		await attempt('experiments.delete', () => api().experiments.delete(ref));
	});

	it('runs GDPR jobs for a made-up user', async () => {
		if (!process.env.MIXPANEL_GDPR_TOKEN) return;
		const distinct_ids = [`${RUN}-gdpr`];
		const retrieval = await attempt('gdpr.createRetrieval', () =>
			api().gdpr.createRetrieval({ distinct_ids }),
		);
		const retrievalId = retrieval?.results?.task_id;
		expect(typeof retrievalId).toBe('string');
		await attempt('gdpr.getRetrieval', () =>
			api().gdpr.getRetrieval({ tracking_id: retrievalId as string }),
		);
		const deletion = await attempt('gdpr.createDeletion', () =>
			api().gdpr.createDeletion({ distinct_ids }),
		);
		const deletionId = deletion?.results?.task_id;
		expect(typeof deletionId).toBe('string');
		await attempt('gdpr.getDeletion', () =>
			api().gdpr.getDeletion({ tracking_id: deletionId as string }),
		);
		await attempt('gdpr.cancelDeletion', () =>
			api().gdpr.cancelDeletion({ tracking_id: deletionId as string }),
		);
	});

	it('reaches the plan-gated APIs', async () => {
		await attempt('cohorts.list', () => api().cohorts.list({}), 402);
		await attempt('funnels.list', () => api().funnels.list({}), 402);
		await attempt(
			'events.names',
			() => api().events.names({ type: 'general' }),
			402,
		);
		await attempt(
			'segmentation.query',
			() =>
				api().segmentation.query({
					event: 'corsair-plugin-test',
					from_date: today,
					to_date: today,
				}),
			402,
		);
		await attempt(
			'retention.query',
			() =>
				api().retention.query({
					from_date: today,
					to_date: today,
					born_event: 'corsair-plugin-test',
				}),
			402,
		);
		await attempt(
			'jql.run',
			() =>
				api().jql.run({
					script:
						'function main() { return Events({from_date: "2026-01-01", to_date: "2026-01-01"}).reduce(mixpanel.reducer.count()); }',
				}),
			402,
		);
		await attempt('pipelines.list', () => api().pipelines.list({}), 401);
		await attempt(
			'dataDefinitions.list',
			() => api().dataDefinitions.list({ page_size: 5 }),
			404,
		);
	});
});
