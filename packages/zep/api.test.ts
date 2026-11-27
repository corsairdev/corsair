import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { zep } from './index';

/**
 * Live run against a free Zep project. Skipped unless ZEP_API_KEY is set (CI
 * never runs files named api.test.ts).
 *
 *   ZEP_API_KEY=... npx jest api.test.ts
 *   (ZEP_LIVE_REPORT=<file> also writes one line per operation)
 *
 * Every step goes through createCorsair, so a pass means Zep answered 2xx and
 * the body matched the operation's output schema. The run makes throwaway
 * users, a thread, graphs, a user group, a context template, a batch and a
 * trace connection named corsair-live-<timestamp>, and deletes all of them at
 * the end, even when a step fails. Project settings a step writes are written
 * back to what they were.
 *
 * Agent Skills (agents.*) is in closed release; this project has it, so the
 * run makes a throwaway agent with a skill and a trace and deletes it.
 */
const key = process.env.ZEP_API_KEY;
const describeIfKey = key ? describe : describe.skip;
if (!key) console.warn('Skipping Zep live run: set ZEP_API_KEY.');

// `unknown` because each operation answers its own shape; steps read fields by name.
type Json = Record<string, unknown>;
const RUN = `corsair-live-${Date.now()}`;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** A list from a response: Zep's pages put rows in `items`; adds answer `{ <field>: [...] }`. */
const list = (value: unknown, field: string): Json[] =>
	((value as Json | undefined)?.[field] as Json[] | undefined) ??
	((value as Json | undefined)?.items as Json[] | undefined) ??
	[];
/** Zep wraps a created row with its ingestion task: `{ episode: {...}, task: {...} }`. */
const inner = (value: Json | undefined, field: string): Json | undefined =>
	(value?.[field] as Json | undefined) ?? value;

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'zep', 'default');
	const corsair = createCorsair({
		plugins: [zep({ key })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfKey('zep live', () => {
	jest.setTimeout(600_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	const report: Array<{ op: string; ok: boolean; note: string }> = [];
	const made: Record<string, string | undefined> = {};

	const call = async (op: string, args: Json = {}): Promise<Json> => {
		// `unknown` because the walk goes through the generated API object by name.
		let fn: unknown = (client as NonNullable<typeof client>).corsair.zep.api;
		for (const part of op.split('.')) {
			fn = (fn as Record<string, unknown>)[part];
		}
		return (await (fn as (input: Json) => Promise<unknown>)(args)) as Json;
	};
	/** Runs one operation and records it; a failure is recorded, not thrown. */
	const step = async (
		op: string,
		args: Json = {},
		note: (out: Json) => string = () => 'ok',
	): Promise<Json | undefined> => {
		try {
			const out = await call(op, args);
			report.push({ op, ok: true, note: note(out) });
			return out;
		} catch (error) {
			report.push({ op, ok: false, note: (error as Error).message });
			return undefined;
		}
	};
	/** An operation Zep refuses for a reason outside the plugin (plan, closed release, fake credential). */
	const refused = async (op: string, args: Json, status: RegExp) => {
		try {
			await call(op, args);
			report.push({ op, ok: true, note: 'ok (expected a refusal)' });
		} catch (error) {
			const message = (error as Error).message;
			report.push({
				op,
				ok: status.test(message),
				note: `refused as expected: ${message}`,
			});
		}
	};

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		if (client) {
			const cleanup: Array<[string, Json]> = [];
			if (made.connection) {
				cleanup.push([
					'traceConnections.delete',
					{ connection_uuid: made.connection },
				]);
			}
			if (made.template) {
				cleanup.push([
					'contextTemplates.delete',
					{ template_uuid: made.template },
				]);
			}
			if (made.agent) {
				const agent = await call('agents.get', {
					agent_uuid: made.agent,
				}).catch(() => undefined);
				if (agent) {
					cleanup.push([
						'agents.delete',
						{ agent_uuid: made.agent, expected_revision: agent.revision },
					]);
				}
			}
			if (made.group)
				cleanup.push(['userGroups.delete', { group_uuid: made.group }]);
			if (made.thread)
				cleanup.push(['threads.delete', { thread_uuid: made.thread }]);
			for (const name of ['user', 'user2']) {
				if (made[name])
					cleanup.push(['users.delete', { user_uuid: made[name] }]);
			}
			for (const name of ['graph', 'clone']) {
				if (made[name])
					cleanup.push(['graphs.delete', { graph_uuid: made[name] }]);
			}
			for (const [op, args] of cleanup) {
				await call(op, args).catch((error) =>
					console.warn(`cleanup ${op}: ${(error as Error).message}`),
				);
			}
			await client.testDb.cleanup?.();
		}
		const file = process.env.ZEP_LIVE_REPORT;
		if (file) writeFileSync(file, JSON.stringify(report, null, 2));
		const passed = report.filter((r) => r.ok).length;
		console.log(
			`zep live: ${passed}/${report.length} steps ok\n${report
				.map((r) => `${r.ok ? 'ok  ' : 'FAIL'} ${r.op}: ${r.note}`)
				.join('\n')}`,
		);
	});

	it('project settings (read, then write the same value back)', async () => {
		const project = await step('project.get', {}, (p) => String(p.name));
		if (project) {
			// Writes back the value it read: Zep refuses an update with no field.
			await step('project.update', {
				include_policy_violating_episodes:
					project.include_policy_violating_episodes ?? false,
			});
		}
		for (const [getter, setter] of [
			['project.getInstructions', 'project.setInstructions'],
			['project.getObservationSteering', 'project.setObservationSteering'],
			['project.getOntology', 'project.setOntology'],
			[
				'project.getUserSummaryInstructions',
				'project.setUserSummaryInstructions',
			],
		] as const) {
			const current = await step(getter);
			if (current) await step(setter, current);
		}
		// A free project answers 404 to inclusion rules, and to knowledge without
		// the knowledge_api account flag, for the read and the write alike.
		await refused('project.getInclusionRules', {}, /\b404\b/);
		await refused(
			'project.setInclusionRules',
			{ inclusion_rules: [] },
			/\b404\b/,
		);
		await refused('project.getKnowledge', {}, /\b404\b/);
		await refused('project.setKnowledge', { knowledge: [] }, /\b404\b/);
		const policy = await step('project.getContentPolicy');
		const revisions = await step('project.listContentPolicyRevisions', {
			page_size: 5,
		});
		const revision = list(revisions, 'revisions')[0];
		if (revision?.uuid) {
			await step('project.getContentPolicyRevision', {
				revision_uuid: revision.uuid,
			});
		}
		if (policy) {
			await step('project.setContentPolicy', {
				categories: policy.categories ?? [],
				rules: policy.rules ?? [],
			});
		}
		await step('debugLogs.enable');
	});

	it('users, thread, messages and context', async () => {
		await step('users.list', { page_size: 5 });
		const user = await step('users.create', {
			user_id: RUN,
			first_name: 'Ada',
			last_name: 'Lovelace',
			email: `${RUN}@example.com`,
			metadata: { source: 'corsair-live' },
		});
		if (!user) return;
		made.user = String(user.uuid);
		const user2 = await step('users.create', { user_id: `${RUN}-2` });
		if (user2) made.user2 = String(user2.uuid);
		await step('users.get', { user_uuid: made.user });
		await step('users.getByEmail', { email: `${RUN}@example.com` });
		await step('users.update', {
			user_uuid: made.user,
			last_name: 'King',
		});
		await step('users.lookup', { user_id: RUN });
		await step('lookup.developerIds', { users: [RUN] });
		const instructions = await step('users.getSummaryInstructions', {
			user_uuid: made.user,
		});
		await step('users.setSummaryInstructions', {
			user_uuid: made.user,
			instructions: [{ name: 'tone', text: 'Note the tone the user prefers.' }],
			inherited: instructions?.inherited === undefined ? undefined : false,
		});
		const thread = await step('threads.create', {
			user_uuid: made.user,
		});
		if (!thread) return;
		made.thread = String(thread.uuid);
		await step('threads.get', { thread_uuid: made.thread });
		await step('threads.list', { page_size: 5, user_uuid: made.user });
		// Lookups resolve developer-assigned ids; the onboarding wizard's thread has one.
		const threads = await step('threads.list', { page_size: 20 });
		const named = list(threads, 'items').find((t) => t.thread_id);
		if (named) {
			await step('threads.lookup', { thread_id: String(named.thread_id) });
			await step('lookup.developerIds', { threads: [String(named.thread_id)] });
		}
		const added = await step('threads.messages.add', {
			thread_uuid: made.thread,
			messages: [
				{ role: 'user', name: 'Ada', content: 'I moved to Lisbon last month.' },
				{ role: 'assistant', content: 'Noted: you live in Lisbon now.' },
			],
			return_context: true,
		});
		await sleep(15_000);
		const messages = await step('threads.messages.list', {
			thread_uuid: made.thread,
		});
		const message = list(messages, 'messages')[0] ?? list(added, 'messages')[0];
		if (message?.uuid) {
			await step('threads.messages.get', {
				thread_uuid: made.thread,
				message_uuid: message.uuid,
			});
			await step('threads.messages.update', {
				thread_uuid: made.thread,
				message_uuid: message.uuid,
				metadata: { checked: true },
			});
		}
		await step('threads.getContext', { thread_uuid: made.thread });
		await step('threads.getSummary', { thread_uuid: made.thread });
		await step('threads.listEpisodes', { thread_uuid: made.thread });
		await step('users.getNode', { user_uuid: made.user });
		await step('users.listUserGroups', { user_uuid: made.user });
	});

	it('user groups', async () => {
		await step('userGroups.list', { page_size: 5 });
		const group = await step('userGroups.create', {
			name: RUN,
			description: 'corsair live run',
		});
		if (!group) return;
		made.group = String(group.uuid);
		const got = await step('userGroups.get', { group_uuid: made.group });
		await step('userGroups.update', {
			group_uuid: made.group,
			description: 'corsair live run (updated)',
			expected_version: got?.version,
		});
		await step('userGroups.listMemberCandidates', {
			group_uuid: made.group,
		});
		if (made.user && made.user2) {
			await step('userGroups.addMembers', {
				group_uuid: made.group,
				user_uuids: [made.user, made.user2],
			});
			await step('userGroups.listMembers', { group_uuid: made.group });
			await step('userGroups.removeMember', {
				group_uuid: made.group,
				user_uuid: made.user2,
			});
			await step('userGroups.removeMembers', {
				group_uuid: made.group,
				user_uuids: [made.user],
			});
		}
		// Policy sets are admin routes: a project API key gets 403.
		await refused(
			'userGroups.listPolicySets',
			{ group_uuid: made.group },
			/\b403\b/,
		);
		const fake = '00000000-0000-0000-0000-000000000000';
		await refused(
			'userGroups.attachPolicySet',
			{ group_uuid: made.group, policy_set_uuid: fake },
			/\b(400|403|404)\b/,
		);
		await refused(
			'userGroups.detachPolicySet',
			{ group_uuid: made.group, policy_set_uuid: fake },
			/\b(400|403|404)\b/,
		);
	});

	it('graph, episodes, nodes, edges, search and settings', async () => {
		await step('graphs.list', { page_size: 5 });
		const graph = await step('graphs.create', {
			name: RUN,
			description: 'corsair live run',
		});
		if (!graph) return;
		made.graph = String(graph.uuid);
		const g = { graph_uuid: made.graph };
		await step('graphs.get', g);
		await step('graphs.update', {
			...g,
			description: 'corsair live (updated)',
		});
		const graphs = await step('graphs.list', { page_size: 20 });
		const namedGraph = list(graphs, 'items').find((x) => x.graph_id);
		if (namedGraph) {
			await step('graphs.lookup', { graph_id: String(namedGraph.graph_id) });
		}
		const added = await step('graphs.episodes.add', {
			...g,
			type: 'text',
			data: 'Ada Lovelace wrote the first published algorithm in 1843. She worked with Charles Babbage on the Analytical Engine.',
			source_description: 'corsair live run',
		});
		const episode = inner(added, 'episode');
		await sleep(20_000);
		const nodes = await step('graphs.nodes.add', {
			...g,
			nodes: [
				{ name: 'Lisbon', summary: 'Capital of Portugal.' },
				{ name: 'Porto', summary: 'City in northern Portugal.' },
			],
		});
		const edges = await step('graphs.edges.add', {
			...g,
			edges: [
				{
					fact: 'Porto lies north of Lisbon.',
					fact_name: 'LOCATED_NORTH_OF',
					source_node: { name: 'Porto' },
					target_node: { name: 'Lisbon' },
				},
			],
		});
		await sleep(5_000);
		if (episode?.uuid) {
			const e = { ...g, episode_uuid: episode.uuid };
			await step('graphs.episodes.get', e);
			await step('graphs.episodes.update', {
				...e,
				metadata: { checked: true },
			});
			await step('graphs.episodes.getDebugLogs', e);
			await step('graphs.episodes.listIngestionTraces', e);
		}
		await step('graphs.episodes.list', { ...g, page_size: 5 });
		const nodeList = await step('graphs.nodes.list', { ...g, page_size: 10 });
		const node =
			list(nodes, 'nodes')[0] ?? list(nodeList, 'nodes')[0] ?? undefined;
		if (node?.uuid) {
			const n = { ...g, node_uuid: node.uuid };
			await step('graphs.nodes.get', n);
			await step('graphs.nodes.update', { ...n, summary: 'Updated.' });
			await step('graphs.nodes.listNeighbors', n);
			await step('graphs.getSubgraph', {
				...g,
				seed_node_uuids: [node.uuid],
				depth: 1,
			});
		}
		const edgeList = await step('graphs.edges.list', { ...g, page_size: 10 });
		const edge = list(edges, 'edges')[0] ?? list(edgeList, 'edges')[0];
		if (edge?.uuid) {
			const ed = { ...g, edge_uuid: edge.uuid };
			await step('graphs.edges.get', ed);
			await step('graphs.edges.update', {
				...ed,
				fact: 'Porto is about 300 km north of Lisbon.',
			});
		}
		const query = 'Who wrote the first algorithm?';
		await step('graphs.searchEdges', { ...g, query });
		await step('graphs.searchNodes', { ...g, query });
		await step('graphs.searchEpisodes', { ...g, query });
		await step('graphs.searchObservations', { ...g, query });
		await step('graphs.searchThreadSummaries', { ...g, query });
		await step('graphs.getContext', { ...g, query });
		await step(
			'graphs.query',
			{
				graph_uuids: [made.graph],
				query,
				stream: true,
			},
			(out) => `${String(out.text ?? JSON.stringify(out)).length} chars`,
		);
		await step('graphs.observations.list', { ...g, page_size: 5 }).then(
			async (out) => {
				const obs = list(out, 'observations')[0];
				if (obs?.uuid) {
					await step('graphs.observations.get', {
						...g,
						observation_uuid: obs.uuid,
					});
				}
			},
		);
		await step('graphs.threadSummaries.list', g);
		await step('graphs.documentSummaries.list', g);
		await step('graphs.listMetadataKeys', g);
		await step('graphs.listContentPolicyEvents', g);
		await step('graphs.getContentPolicy', g);
		for (const [getter, setter] of [
			['graphs.getInstructions', 'graphs.setInstructions'],
			['graphs.getObservationSteering', 'graphs.setObservationSteering'],
			['graphs.getOntology', 'graphs.setOntology'],
		] as const) {
			const current = await step(getter, g);
			if (current) await step(setter, { ...current, ...g });
		}
		await refused('graphs.getInclusionRules', g, /\b404\b/);
		await refused(
			'graphs.setInclusionRules',
			{ ...g, inclusion_rules: [] },
			/\b404\b/,
		);
		await refused('graphs.getKnowledge', g, /\b404\b/);
		await refused(
			'graphs.setKnowledge',
			{
				...g,
				knowledge: [{ name: 'units', text: 'Distances are in kilometres.' }],
			},
			/\b404\b/,
		);
		await step('graphs.warm', g);
		const clone = await step('graphs.clone', g);
		if (clone) {
			const cloneUuid =
				(clone.graph as Json | undefined)?.uuid ??
				clone.uuid ??
				clone.graph_uuid;
			if (cloneUuid) made.clone = String(cloneUuid);
		}

		// Hyperedges need the project's hyperedges_enabled option and 2 to 100 pairs.
		const hyper = await step('graphs.hyperedges.add', {
			...g,
			fact: 'Ada, Charles and Mary worked on the Analytical Engine notes.',
			edges: [
				{
					name: 'WORKED_WITH',
					source_node: { name: 'Ada Lovelace' },
					target_node: { name: 'Charles Babbage' },
				},
				{
					name: 'WORKED_WITH',
					source_node: { name: 'Ada Lovelace' },
					target_node: { name: 'Mary Somerville' },
				},
			],
		});
		await step('graphs.hyperedges.list', g);
		const hyperUuid =
			hyper?.uuid ?? (hyper?.hyperedge as Json | undefined)?.uuid;
		if (hyperUuid) {
			const h = { ...g, hyperedge_uuid: hyperUuid };
			await step('graphs.hyperedges.get', h);
			await step('graphs.hyperedges.update', {
				...h,
				fact: 'Ada and Charles worked on the Analytical Engine.',
			});
			const member = await step('graphs.hyperedges.createEdge', {
				...h,
				name: 'WORKED_WITH',
				source_node: { name: 'Charles Babbage' },
				target_node: { name: 'Ada Lovelace' },
			});
			const memberUuid =
				member?.uuid ?? (member?.edge as Json | undefined)?.uuid;
			if (memberUuid) {
				await step('graphs.hyperedges.deleteEdge', {
					...h,
					edge_uuid: memberUuid,
				});
			}
			await step('graphs.hyperedges.delete', h);
		}
		if (edge?.uuid) {
			await step('graphs.edges.delete', { ...g, edge_uuid: edge.uuid });
		}
		if (node?.uuid) {
			await step('graphs.nodes.delete', { ...g, node_uuid: node.uuid });
		}
		if (episode?.uuid) {
			await step('graphs.episodes.delete', {
				...g,
				episode_uuid: episode.uuid,
			});
		}
	});

	it('context templates, batches and tasks', async () => {
		await step('contextTemplates.list', { page_size: 5 });
		const template = await step('contextTemplates.create', {
			name: RUN,
			template: '%{edges limit=5}',
		});
		if (template) {
			made.template = String(template.uuid ?? template.template_uuid);
			await step('contextTemplates.get', { template_uuid: made.template });
			await step('contextTemplates.update', {
				template_uuid: made.template,
				template: '%{edges limit=3}',
			});
		}
		await step('batches.list', { page_size: 5 });
		// Zep keeps processed batches (409 on delete), so the delete runs on a second, unprocessed one.
		const spare = await step('batches.create', {});
		if (spare?.uuid) {
			await step('batches.delete', { batch_uuid: spare.uuid });
		}
		const batch = await step('batches.create', {
			metadata: { source: 'corsair-live' },
		});
		if (batch && made.graph) {
			made.batch = String(batch.uuid);
			const b = { batch_uuid: made.batch };
			await step('batches.get', b);
			await step('batches.addItems', {
				...b,
				items: [
					{
						type: 'graph_episode',
						graph_uuid: made.graph,
						data: 'Charles Babbage designed the Difference Engine.',
						data_type: 'text',
					},
				],
			});
			await step('batches.listItems', b);
			const processed = await step('batches.process', b);
			const taskUuid = processed?.task_uuid ?? inner(processed, 'task')?.uuid;
			if (taskUuid) {
				await sleep(3_000);
				await step('tasks.get', { task_uuid: taskUuid });
			}
		}
		const tasks = await step('tasks.list', { page_size: 5 });
		const task = list(tasks, 'tasks')[0];
		if (task?.uuid && !report.some((r) => r.op === 'tasks.get')) {
			await step('tasks.get', { task_uuid: task.uuid });
		}
		if (made.template) {
			await step('contextTemplates.delete', { template_uuid: made.template });
			made.template = undefined;
		}
	});

	it('trace connections (made up credential)', async () => {
		await step('traceConnections.list', { page_size: 5 });
		// Zep checks the credential with the provider at create time: a made-up
		// one is refused with 422, so the routes behind it stay mocked.
		let connection: Json | undefined;
		try {
			connection = await call('traceConnections.create', {
				name: RUN,
				provider: 'langsmith',
				credential: 'lsv2_corsair_live_not_a_real_key',
				requests_per_minute: 1,
			});
			report.push({ op: 'traceConnections.create', ok: true, note: 'ok' });
		} catch (error) {
			const message = (error as Error).message;
			report.push({
				op: 'traceConnections.create',
				ok: /\b422\b/.test(message),
				note: `refused as expected: ${message}`,
			});
		}
		if (!connection) return;
		made.connection = String(connection.uuid);
		const c = { connection_uuid: made.connection };
		await step('traceConnections.get', c);
		await step('traceConnections.update', { ...c, requests_per_minute: 2 });
		await refused('traceConnections.verify', c, /\b(4\d\d|502)\b|fail/i);
		await refused('traceConnections.listProjects', c, /\b(4\d\d|502)\b/);
		await refused(
			'traceConnections.listTraces',
			{ ...c, provider_project_id: 'none' },
			/\b(4\d\d|502)\b/,
		);
		await refused(
			'traceConnections.getTrace',
			{ ...c, provider_project_id: 'none', trace_id: 'none' },
			/\b(4\d\d|502)\b/,
		);
		await step('traceConnections.delete', c);
		made.connection = undefined;
	});

	it('agent, skills, versions, traces and uses (Agent Skills)', async () => {
		await step('agents.list', { page_size: 5 });
		const agent = await step('agents.create', {
			agent_id: RUN,
			name: 'Corsair live run',
			security_domain: 'corsair.live',
			description: 'corsair live run',
		});
		if (!agent) return;
		made.agent = String(agent.uuid);
		const a = { agent_uuid: made.agent };
		/** Each write bumps the agent's revision; read it back before the next one. */
		const agentRevision = async () =>
			Number((await call('agents.get', a)).revision);
		await step('agents.get', a);
		await step('agents.update', {
			...a,
			expected_revision: await agentRevision(),
			description: 'corsair live run (updated)',
		});
		const policy = await step('agents.literalPolicy.get', a);
		if (policy) {
			await step('agents.literalPolicy.update', {
				...a,
				default: policy.default,
				allowlisted_classes: policy.allowlisted_classes,
				allowlisted_values: policy.allowlisted_values,
				expected_revision: policy.revision,
			});
		}
		const family = 'account-support';
		const definition = {
			name: 'Reset a password',
			description: 'Reset the password of a user who cannot sign in.',
			task_family: family,
			use_when: ['A user cannot sign in'],
			procedure: [
				{ instruction: 'Look up the user' },
				{ instruction: 'Send a reset link' },
			],
			done_when: ['The user has the reset link'],
		};
		const skill = await step('agents.skills.create', { ...a, definition });
		const trace = await step('agents.traces.create', {
			...a,
			objective: 'Reset the password for a user who cannot sign in',
			task_family: family,
		});
		await step('agents.skills.list', a);
		await step('agents.taskFamilies.list', a);
		await step('agents.getContext', {
			...a,
			objective: 'Help a user who cannot sign in',
		});
		await step('agents.skillCandidates.list', a);
		await step('agents.verifiers.list', a);
		await step('agents.traceImports.list', a);
		await step('agents.learning.listRuns', a);
		await step('agents.learning.get', { ...a, task_family: family });
		if (skill?.uuid) {
			const s = { ...a, skill_uuid: skill.uuid };
			const skillVersion = async () =>
				Number((await call('agents.skills.get', s)).current_version);
			await step('agents.skills.get', s);
			await step('agents.skills.versions.list', s);
			await step('agents.skills.versions.get', { ...s, version: 1 });
			await step('agents.skills.createVersion', {
				...s,
				definition: {
					...definition,
					procedure: [
						...definition.procedure,
						{ instruction: 'Confirm the sign-in' },
					],
				},
				expected_version: await skillVersion(),
			});
			await step('agents.skills.versions.compare', {
				...s,
				from_version: 1,
				to_version: 2,
			});
			await step('agents.skills.versions.restore', {
				...s,
				version: 1,
				expected_version: await skillVersion(),
			});
			await step('agents.skills.evaluations.create', {
				...s,
				evaluated_by: 'tool',
				evaluator_version: 'corsair-live-1',
				skill_version: 1,
				verdict: 'succeeded',
				controlled_test: true,
			});
			await step('agents.skills.approve', {
				...s,
				expected_version: await skillVersion(),
			});
			// A skill has a publication only once it is published to another agent.
			await refused('agents.skills.getPublication', s, /\b404\b/);
			await step('agents.skills.relations.list', s);
			await step('agents.skills.evidence.list', s);
			const search = await step('agents.skills.search', {
				...a,
				query: 'reset a password',
				task_family: family,
			});
			const exported = await step('agents.skills.versions.exports.create', {
				...s,
				version: 1,
			});
			const exportTask = inner(exported, 'task')?.uuid ?? exported?.task_uuid;
			if (exportTask) {
				await sleep(5_000);
				const zip = await step(
					'agents.skills.versions.exports.get',
					{ ...s, version: 1, task_uuid: exportTask },
					(out) =>
						`${String(out.contentType)}, ${String(out.byteLength)} bytes`,
				);
				// The exported package goes back in through the import route.
				if (zip?.contentBase64) {
					await step('agents.skills.importPackage', {
						...a,
						file: {
							base64: String(zip.contentBase64),
							filename: 'reset-a-password.zip',
							contentType: 'application/zip',
						},
					});
				}
			}
			if (trace?.uuid && search?.search_id) {
				const use = await step('agents.skills.uses.create', {
					...s,
					search_id: search.search_id,
					trace_uuid: trace.uuid,
					usage: 'used',
				});
				const useUuid = use?.uuid ?? inner(use, 'use')?.uuid;
				if (useUuid) {
					await step('agents.skills.uses.addOutcome', {
						...s,
						use_uuid: useUuid,
						outcome: 'succeeded',
					});
				}
			}
			await step('agents.skills.retire', {
				...s,
				expected_version: await skillVersion(),
			});
		}
		if (trace?.uuid) {
			const t = { ...a, trace_uuid: trace.uuid };
			const traceRevision = async () =>
				Number((await call('agents.traces.get', t)).revision);
			/** Waits out Zep's background finalization (close, summary repair). */
			const settle = async () => {
				for (let i = 0; i < 15; i++) {
					const got = await call('agents.traces.get', t);
					const state = (got.internal as Json | undefined)?.processing_state;
					if (state === 'idle' && got.status !== 'closing') return;
					await sleep(2_000);
				}
			};
			await step('agents.traces.get', t);
			const event = await step('agents.traces.appendEvent', {
				...t,
				event_type: 'observation',
				content: 'The user says the reset email never arrived.',
			});
			await step('agents.traces.listEvents', t);
			await step('agents.traces.update', {
				...t,
				expected_revision: await traceRevision(),
				task_family: family,
			});
			await step('agents.traces.close', {
				...t,
				expected_revision: await traceRevision(),
				outcome: 'succeeded',
			});
			// Closing finishes in the background; corrections and reopen need the closed state.
			for (let i = 0; i < 10; i++) {
				const status = String((await call('agents.traces.get', t)).status);
				if (status !== 'open' && status !== 'closing') {
					report.push({
						op: 'agents.traces.get',
						ok: true,
						note: `status ${status}`,
					});
					break;
				}
				await sleep(3_000);
			}
			// Task-family corrections need a closed (terminal) trace.
			await step('agents.traces.correctTaskFamily', {
				...t,
				expected_revision: await traceRevision(),
				task_family: 'password-reset',
				reason: 'corsair live run',
			});
			await step('agents.traces.listSummaryVersions', t);
			// Zep writes the summary in the background after the close.
			for (let i = 0; i < 6; i++) {
				const summary = await call('agents.traces.getSummary', t).catch(
					() => undefined,
				);
				if (summary) {
					report.push({ op: 'agents.traces.getSummary', ok: true, note: 'ok' });
					break;
				}
				if (i === 5) {
					await refused('agents.traces.getSummary', t, /\b404\b/);
				}
				await sleep(5_000);
			}
			await settle();
			await step('agents.traces.reopen', {
				...t,
				expected_revision: await traceRevision(),
			});
			await settle();
			const open = await call('agents.traces.get', t);
			const accepted =
				Number((open.internal as Json | undefined)?.next_sequence ?? 1) - 1;
			await step('agents.traces.abandon', {
				...t,
				expected_revision: Number(open.revision),
				highest_accepted_sequence: accepted,
			});
			await settle();
			// Deleting an event repairs the summary: Zep allows it on a finished (closed or abandoned) trace that has one.
			const eventUuid = event?.uuid ?? inner(event, 'event')?.uuid;
			if (eventUuid) {
				await step('agents.traces.deleteEvent', {
					...t,
					event_uuid: eventUuid,
					expected_revision: await traceRevision(),
				});
			}
			await step('agents.traces.list', a);
			await step('agents.traces.delete', {
				...t,
				expected_revision: await traceRevision(),
			});
		}
		// A task family exists once Zep has compiled one from traces (minutes later); a fresh agent has none.
		await refused(
			'agents.taskFamilies.rename',
			{ ...a, from_slug: family, to_slug: 'account-recovery' },
			/\b404\b/,
		);
		await step('agents.declareBreakingChange', {
			...a,
			expected_revision: await agentRevision(),
			version: 'v2',
		});
		await step('agents.delete', {
			...a,
			expected_revision: await agentRevision(),
		});
		made.agent = undefined;
	});

	it('deletes what it made', async () => {
		if (made.thread) {
			await step('threads.delete', { thread_uuid: made.thread });
			made.thread = undefined;
		}
		if (made.group) {
			await step('userGroups.delete', { group_uuid: made.group });
			made.group = undefined;
		}
		for (const name of ['clone', 'graph']) {
			if (made[name]) {
				await step('graphs.delete', { graph_uuid: made[name] });
				made[name] = undefined;
			}
		}
		for (const name of ['user2', 'user']) {
			if (made[name]) {
				await step('users.delete', { user_uuid: made[name] });
				made[name] = undefined;
			}
		}
		const failed = report.filter((r) => !r.ok);
		expect(failed).toEqual([]);
	});
});
