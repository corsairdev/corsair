import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { azuredevopsEndpointMeta } from './endpoints/catalog';
import { azuredevopsOperations } from './endpoints/manifest';
import { azuredevops } from './index';

/**
 * Live run against one Azure DevOps project. Skipped unless the PAT, the
 * organization and the project are set (CI never runs files named
 * api.test.ts):
 *
 *   AZURE_DEVOPS_PAT=... AZURE_DEVOPS_ORG=fabrikam AZURE_DEVOPS_PROJECT=Sandbox npx jest api.test.ts
 *
 * Use a throwaway project. Everything the run creates is named `ct-<stamp>`
 * and lives in that project: Git repositories (with pushes, branches, tags,
 * a pull request and its threads, a fork and an import), work items,
 * queries, area and iteration nodes, a team, a code wiki, a YAML pipeline
 * whose only job is agentless (`pool: server`, so it uses no parallel job),
 * a classic release definition with an agentless stage, an environment, a
 * variable group, a deployment group, a service connection, a feed,
 * dashboards, test plans and runs, a policy and a symbol request. The run
 * deletes all of it.
 *
 * It never writes outside the project: organization settings, processes,
 * users, groups, licences, security, PATs, extensions, audit streams,
 * service hooks and anything that sends mail are left out (see SKIPPED).
 * Every GET the plugin has is called once, with ids the run created where it
 * has them; a 4xx with Azure DevOps' own reason counts as the expected
 * answer for a placeholder id. Optional: AZURE_DEVOPS_LIVE_REPORT=<file>
 * writes each step as JSON.
 */
const key = process.env.AZURE_DEVOPS_PAT;
const organization = process.env.AZURE_DEVOPS_ORG;
const project = process.env.AZURE_DEVOPS_PROJECT ?? '';
const describeIfKey = key && organization && project ? describe : describe.skip;
if (!key || !organization || !project) {
	console.warn(
		'Skipping Azure DevOps live run: set AZURE_DEVOPS_PAT, AZURE_DEVOPS_ORG and AZURE_DEVOPS_PROJECT.',
	);
}

const STAMP = Date.now().toString(36);
const NAME = `ct-${STAMP}`;
const ZERO_SHA = '0000000000000000000000000000000000000000';
const ZERO_GUID = '00000000-0000-0000-0000-000000000000';
const MISSING_INT = 999999;
const TEXT_FILE = {
	base64: Buffer.from('Hello from the Corsair live run').toString('base64'),
	filename: 'ct.txt',
	contentType: 'application/octet-stream',
};
const PIPELINE_YAML = [
	'trigger: none',
	'pr: none',
	'jobs:',
	'- job: corsair',
	'  pool: server',
	'  steps:',
	'  - task: Delay@1',
	'    inputs:',
	"      delayForMinutes: '0'",
	'',
].join('\n');

/**
 * Operations the run leaves out because they act outside the test project or
 * reach people: the token is a person's full-access PAT.
 */
const SKIPPED: Array<[RegExp, string]> = [
	[
		/^memberEntitlementManagement\.[a-zA-Z]+\.(add|delete|update|remove)/,
		'users and licences',
	],
	[/^(tokens|tokenAdmin)\./, "the person's PATs, read or written"],
	[
		/^graph\.(avatars\.(delete|setAvatar)|groups\.(create|delete|update)|memberships\.(add|removeMembership)|requestAccess|servicePrincipals\.(create|delete)|users\.(create|delete|update))/,
		'organization users and groups',
	],
	[
		/^security\.(accessControlEntries\.|accessControlLists\.(remove|set)|permissions\.removePermission)/,
		'security ACLs',
	],
	[
		/^securityRoles\.roleassignments\.(set|remove|changeInheritance)/,
		'security role assignments',
	],
	[/^processes\.[a-zA-Z]+\.(?!get$|list$)/, 'organization processes'],
	[
		/^processadmin\.processes\.importProcessTemplate$/,
		'organization processes',
	],
	[/^wit\.fields\.(create|delete|update)$/, 'organization fields'],
	[/^wit\.projectProcessMigration\./, "changes the project's process"],
	[/^wit\.sendMail\./, 'sends mail'],
	[/^git\.pullRequestShare\./, 'sends mail'],
	[
		/^core\.(projects\.(create|delete|update|setProjectProperties)|avatar\.)/,
		'the project itself',
	],
	[
		/^audit\.streams\.(create|delete|updateStatus|updateStream)$/,
		'audit streams',
	],
	[
		/^extensionManagement\.installedExtensions\.(installExtensionByName|uninstallExtensionByName|update)$/,
		'organization extensions',
	],
	[
		/^hooks\.(diagnostics\.update|notifications\.create|subscriptions\.(create|delete|replaceSubscription))$/,
		'service hooks post to outside URLs',
	],
	[
		/^notification\.(diagnostics|settings|subscribers)\.update$|^notification\.subscriptions\.(create|delete|update|updateSubscriptionUserSettings)$/,
		'notification settings and mail subscriptions',
	],
	[
		/^distributedTask\.(agentclouds|agents|elasticpools|pools)\.(add|create|delete|update|replaceAgent)$/,
		'organization agent pools',
	],
	[/^distributedTask\.kubernetes\.(add|delete)$/, 'needs a cluster'],
	[
		/^distributedTask\.queues\.add$/,
		'adds an organization pool to the project',
	],
	[
		/^distributedTask\.variablegroups\.shareVariableGroup$/,
		'needs a second project',
	],
	[
		/^serviceEndpoint\.endpoints\.shareServiceEndpoint$/,
		'needs a second project',
	],
	[
		/^artifacts\.serviceSettings\.setGlobalPermissions$/,
		'organization feed permissions',
	],
	[/^tfvc\.changesets\.create$/, 'the project has no TFVC'],
	[
		/^testResults\.testsettings\.create$/,
		"can't be deleted: the API answers 'in use' even for a new one",
	],
	[/^test\.session\.create$/, 'exploratory sessions have no delete'],
	[
		/^permissionsReport\.permissionsReport\.create$/,
		'reports stay in the organization list, with no delete',
	],
];

type Step = {
	id: string;
	ok: boolean;
	expected?: boolean;
	note?: string;
	ms?: number;
};

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: (string | number)[]): unknown {
	let node = value;
	for (const part of path) {
		node =
			typeof node === 'object' && node !== null
				? (node as Record<string | number, unknown>)[part]
				: undefined;
	}
	return node;
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/**
 * A 4xx whose reason is Azure DevOps' own: the route exists and answered for
 * this input. Unknown routes answer with a controller or resource-location
 * message, or with no reason at all; those stay failures.
 */
const API_ANSWER = /^Azure DevOps (400|401|403|404|405|409|412|413|415|422):/;
const ROUTE_MISSING =
	/controller for path|is not registered|resource location|No HTTP resource|The resource cannot be found|Page not found|request failed$|Azure DevOps 404: Not Found$/i;

/** Some areas answer a missing record with a 500 that says so. */
const MISSING_500 =
	/^Azure DevOps 500: .*(does not exist|was not found|could not be found|cannot be found|not found\.|Not Found$|must not be Guid\.Empty|was not recognized|not recognized)/is;

function isApiAnswer(message: string): boolean {
	return (
		(API_ANSWER.test(message) && !ROUTE_MISSING.test(message)) ||
		MISSING_500.test(message)
	);
}

/** New organizations have classic build and release pipelines turned off. */
const CLASSIC_OFF = /classic pipelines are disabled/;
/** Test Plans needs the Basic + Test Plans access level. */
const NO_TEST_PLANS =
	/Azure DevOps 403: You are not authorized to access this API/;

/** A list's first item, whether the list is `{ value }` or header-paged `{ items: { value } }`. */
// `unknown` because the value is any parsed response.
function first(value: unknown, field: string): unknown {
	return (
		pick(value, 'value', 0, field) ??
		pick(value, 'items', 'value', 0, field) ??
		pick(value, 'items', 0, field)
	);
}

/** An object read back for a write: nulls dropped (requests take no nulls). */
// `unknown` because the value is any parsed response.
function clean(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(clean);
	if (typeof value !== 'object' || value === null) return value;
	return Object.fromEntries(
		Object.entries(value)
			.filter(([, v]) => v !== null)
			.map(([k, v]) => [k, clean(v)]),
	);
}

describeIfKey('azure devops live', () => {
	jest.setTimeout(3_600_000);
	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair
			.azuredevops.api;
		for (const part of id.split('.'))
			node = (node as Record<string, unknown>)[part];
		if (typeof node !== 'function') throw new Error(`no operation ${id}`);
		return node as AnyOp;
	};
	/** `project` goes only to the operations that take it. */
	function withProject(
		id: string,
		input: Record<string, unknown>,
	): Record<string, unknown> {
		const operation = azuredevopsOperations.find((o) => o.id === id);
		const takes = 'project' in ((operation?.input.properties ?? {}) as object);
		return takes ? { project, ...input } : input;
	}
	const steps: Step[] = [];
	const called = new Set<string>();
	const teardown: Array<{
		id: string;
		input: Record<string, unknown>;
		expected?: RegExp;
	}> = [];
	const left: string[] = [];
	/** Ids the run has, by parameter name (scoped keys win, see `valueFor`). */
	// `unknown` because ids are strings, numbers or lists.
	const P: Record<string, unknown> = { project };

	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'azuredevops', 'default');
		const corsair = createCorsair({
			plugins: [azuredevops({ key, organization })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	/**
	 * One call. `expected` is a pattern for an error that is the right answer
	 * (a feature the organization lacks); `probe` accepts any Azure DevOps 4xx
	 * (a placeholder id).
	 */
	async function step(
		id: string,
		input: Record<string, unknown> = {},
		opts: { expected?: RegExp; probe?: boolean } = {},
	): Promise<unknown> {
		const operation = azuredevopsOperations.find((o) => o.id === id);
		called.add(id);
		const started = Date.now();
		try {
			const value = await op(id)(withProject(id, input));
			steps.push({ id, ok: true, ms: Date.now() - started });
			return value;
		} catch (error) {
			const note = (error as Error).message.slice(0, 300);
			// A download route (badges, zips, symbol files) answers a missing
			// record with a bare 404; package routes answer a package that isn't
			// in the feed with a 500 that names the failed step.
			const ok =
				(opts.expected?.test(note) ?? false) ||
				(opts.probe === true &&
					(isApiAnswer(note) ||
						(operation?.response === 'file' &&
							/^Azure DevOps 404: Not Found$/.test(note)) ||
						(id.startsWith('artifactsPackageTypes.') &&
							/^Azure DevOps 500: (?!TF400898)\S/.test(note))));
			steps.push({ id, ok, expected: ok, note, ms: Date.now() - started });
			return undefined;
		}
	}
	const probe = (id: string, input: Record<string, unknown> = {}) =>
		step(id, input, { probe: true });

	/** Registers a delete that the last test runs (newest first). */
	function later(
		id: string,
		input: Record<string, unknown>,
		expected?: RegExp,
	) {
		teardown.push({ id, input, expected });
	}

	async function waitFor(
		read: () => Promise<unknown>,
		done: (value: unknown) => boolean,
		ms = 90_000,
	): Promise<unknown> {
		const until = Date.now() + ms;
		let value: unknown;
		while (Date.now() < until) {
			try {
				value = await read();
				if (done(value)) return value;
			} catch {}
			await sleep(3000);
		}
		return value;
	}

	const raw = (id: string, input: Record<string, unknown>) =>
		op(id)(withProject(id, input));

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		// Anything the last test could not delete gets one more try.
		for (const item of teardown.reverse()) {
			try {
				await raw(item.id, item.input);
			} catch (error) {
				const message = (error as Error).message;
				if (!/Azure DevOps (404|400)/.test(message))
					left.push(`${item.id}: ${message.slice(0, 200)}`);
			}
		}
		await client?.testDb.cleanup?.();
		const skipped = azuredevopsOperations
			.map((o) => o.id)
			.filter((id) => !called.has(id))
			.map((id) => ({
				id,
				why: SKIPPED.find(([pattern]) => pattern.test(id))?.[1] ?? 'not called',
			}));
		const report = process.env.AZURE_DEVOPS_LIVE_REPORT;
		if (report)
			writeFileSync(report, JSON.stringify({ steps, left, skipped }, null, 2));
		const failed = steps.filter((s) => !s.ok);
		const expected = steps.filter((s) => s.expected).length;
		console.log(
			`Azure DevOps live: ${steps.length - failed.length}/${steps.length} steps ok (${expected} expected errors), ${called.size}/${azuredevopsOperations.length} operations called, ${skipped.length} skipped, ${left.length} left\n${failed.map((s) => `  ${s.id}: ${s.note}`).join('\n')}`,
		);
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} Azure DevOps live steps failed, ${left.length} records left`,
			);
		}
	});

	it('reads who and where', async () => {
		const me = await step('profile.profiles.get', { id: 'me' });
		P.userId = pick(me, 'id');
		P.identityId = P.userId;
		P.ownerId = P.userId;
		P.memberId = P.userId;
		P.reviewerId = P.userId;
		P.storageKey = P.userId;
		const descriptor = await step('graph.descriptors.get', {
			storageKey: P.userId,
		});
		P.subjectDescriptor = pick(descriptor, 'value');
		P.userDescriptor = P.subjectDescriptor;
		P.descriptor = P.subjectDescriptor;
		const projectInfo = await step('core.projects.get', {
			projectId: project,
			includeCapabilities: true,
		});
		P.projectId = pick(projectInfo, 'id');
		P.projectIds = P.projectId;
		P.processTypeId = pick(
			projectInfo,
			'capabilities',
			'processTemplate',
			'templateTypeId',
		);
		P.processId = P.processTypeId;
		const teams = await step('core.teams.getTeams', {
			projectId: P.projectId,
		});
		P.team = pick(teams, 'value', 0, 'name');
		P.teamId = pick(teams, 'value', 0, 'id');
		const pools = await step('distributedTask.pools.getAgentPools', {});
		P.poolId = first(pools, 'id');
		P.poolIds = String(P.poolId);
		const queues = await step('distributedTask.queues.getAgentQueues', {});
		P.queueId = first(queues, 'id');
		P.queueIds = String(P.queueId);
		P.queueNames = first(queues, 'name');
		const groups = await step('graph.groups.list', {});
		P.groupDescriptor = first(groups, 'descriptor');
		P.scopeDescriptor = undefined;
		P.containerDescriptor = P.groupDescriptor;
		const namespaces = await step('security.securityNamespaces.query', {});
		P.securityNamespaceId = first(namespaces, 'namespaceId');
		const wits = await step('processes.workItemTypes.list', {
			processId: P.processId,
		});
		P.witRefName = first(wits, 'referenceName');
		P.witRefNameForBehaviors = P.witRefName;
		expect(P.projectId).toBeTruthy();
	});

	it('works a Git repository end to end', async () => {
		const repo = await step('git.repositories.create', {
			name: `${NAME}-repo`,
		});
		const repositoryId = pick(repo, 'id') as string;
		if (!repositoryId) return;
		P.repositoryId = repositoryId;
		P.repositoryNameOrId = repositoryId;
		P.repoId = repositoryId;
		later('git.repositories.deleteRepositoryFromRecycleBin', { repositoryId });
		later('git.repositories.delete', { repositoryId });

		const push = await step('git.pushes.create', {
			repositoryId,
			refUpdates: [{ name: 'refs/heads/main', oldObjectId: ZERO_SHA }],
			commits: [
				{
					comment: 'Add README and pipeline',
					changes: [
						{
							changeType: 'add',
							item: { path: '/README.md' },
							newContent: {
								content: '# Corsair live run\n',
								contentType: 'rawText',
							},
						},
						{
							changeType: 'add',
							item: { path: '/azure-pipelines.yml' },
							newContent: { content: PIPELINE_YAML, contentType: 'rawText' },
						},
						{
							changeType: 'add',
							item: { path: '/docs/home.md' },
							newContent: { content: '# Wiki home\n', contentType: 'rawText' },
						},
					],
				},
			],
		});
		const commitId = pick(push, 'commits', 0, 'commitId') as string;
		P.pushId = pick(push, 'pushId');
		P.commitId = commitId;
		P.objectId = commitId;
		P.sha1 = commitId;
		const feature = await step('git.pushes.create', {
			repositoryId,
			refUpdates: [{ name: 'refs/heads/ct-feature', oldObjectId: commitId }],
			commits: [
				{
					comment: 'Edit README',
					parents: [commitId],
					changes: [
						{
							changeType: 'edit',
							item: { path: '/README.md' },
							newContent: {
								content: '# Corsair live run\n\nEdited on a branch.\n',
								contentType: 'rawText',
							},
						},
					],
				},
			],
		});
		const featureCommit = pick(feature, 'commits', 0, 'commitId') as string;
		P.otherCommitId = featureCommit;

		await step('git.refs.updateRefs', {
			repositoryId,
			body: [
				{
					name: 'refs/heads/ct-extra',
					oldObjectId: ZERO_SHA,
					newObjectId: commitId,
				},
			],
		});
		await step('git.refs.updateRef', {
			repositoryId,
			filter: 'heads/ct-extra',
			isLocked: true,
		});
		await step('git.refs.updateRef', {
			repositoryId,
			filter: 'heads/ct-extra',
			isLocked: false,
		});
		const tag = await step('git.annotatedTags.create', {
			repositoryId,
			name: 'ct-tag',
			message: 'Corsair live tag',
			taggedObject: { objectId: commitId },
		});
		P['git.annotatedTags:objectId'] = pick(tag, 'objectId');
		await step('git.statuses.create', {
			repositoryId,
			commitId: featureCommit,
			state: 'succeeded',
			description: 'Corsair live status',
			context: { name: 'ct', genre: 'corsair' },
		});
		const tree = await raw('git.commits.get', {
			repositoryId,
			commitId,
		}).catch(() => undefined);
		P['git.trees:sha1'] = pick(tree, 'treeId');

		// A policy on main before the pull request, so it has an evaluation.
		const policy = await step('policy.configurations.create', {
			isEnabled: true,
			isBlocking: false,
			type: { id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd' },
			settings: {
				minimumApproverCount: 1,
				creatorVoteCounts: true,
				scope: [
					{ repositoryId, refName: 'refs/heads/main', matchKind: 'exact' },
				],
			},
		});
		const configurationId = pick(policy, 'id');
		if (configurationId) {
			P['policy:configurationId'] = configurationId;
			later('policy.configurations.delete', { configurationId });
			await step('policy.configurations.update', {
				configurationId,
				isEnabled: true,
				isBlocking: false,
				type: { id: 'fa4e907d-c16b-4a4c-9dfa-4906e5d171dd' },
				settings: {
					minimumApproverCount: 1,
					creatorVoteCounts: false,
					scope: [
						{ repositoryId, refName: 'refs/heads/main', matchKind: 'exact' },
					],
				},
			});
		}

		const pr = await step('git.pullRequests.create', {
			repositoryId,
			sourceRefName: 'refs/heads/ct-feature',
			targetRefName: 'refs/heads/main',
			title: `${NAME} pull request`,
			description: 'Opened by the Corsair live run.',
		});
		const pullRequestId = pick(pr, 'pullRequestId') as number;
		if (pullRequestId) {
			P.pullRequestId = pullRequestId;
			P.codeReviewId = pick(pr, 'codeReviewId');
			P['git:iterationId'] = 1;
			P['testResults:iterationId'] = 1;
			later('git.pullRequests.update', {
				repositoryId,
				pullRequestId,
				status: 'abandoned',
			});
			await step('git.pullRequests.update', {
				repositoryId,
				pullRequestId,
				title: `${NAME} pull request (edited)`,
			});
			const artifactId = `vstfs:///CodeReview/CodeReviewId/${P.projectId}/${pullRequestId}`;
			P.artifactId = artifactId;
			const evaluations = await waitFor(
				() => raw('policy.evaluations.list', { artifactId }),
				(v) =>
					Array.isArray(pick(v, 'value')) && pick(v, 'value', 0) !== undefined,
				30_000,
			);
			P.evaluationId = pick(evaluations, 'value', 0, 'evaluationId');
			if (P.evaluationId)
				await step('policy.evaluations.requeuePolicyEvaluation', {
					evaluationId: P.evaluationId,
				});

			const thread = await step('git.pullRequestThreads.create', {
				repositoryId,
				pullRequestId,
				status: 'active',
				comments: [
					{ content: 'First comment from the live run', commentType: 'text' },
				],
			});
			const threadId = pick(thread, 'id') as number;
			P.threadId = threadId;
			P.commentId = 1;
			if (threadId) {
				const reply = await step('git.pullRequestThreadComments.create', {
					repositoryId,
					pullRequestId,
					threadId,
					content: 'A reply',
					parentCommentId: 1,
					commentType: 'text',
				});
				const commentId = pick(reply, 'id') as number;
				await step('git.pullRequestThreadComments.update', {
					repositoryId,
					pullRequestId,
					threadId,
					commentId,
					content: 'A reply (edited)',
				});
				await step('git.pullRequestCommentLikes.create', {
					repositoryId,
					pullRequestId,
					threadId,
					commentId: 1,
				});
				await step('git.pullRequestCommentLikes.delete', {
					repositoryId,
					pullRequestId,
					threadId,
					commentId: 1,
				});
				await step('git.pullRequestThreadComments.delete', {
					repositoryId,
					pullRequestId,
					threadId,
					commentId,
				});
				await step('git.pullRequestThreads.update', {
					repositoryId,
					pullRequestId,
					threadId,
					status: 'fixed',
				});
			}
			const label = await step('git.pullRequestLabels.create', {
				repositoryId,
				pullRequestId,
				name: 'ct-label',
			});
			P.labelIdOrName = pick(label, 'id') ?? 'ct-label';
			const status = await step('git.pullRequestStatuses.create', {
				repositoryId,
				pullRequestId,
				state: 'succeeded',
				description: 'Corsair live',
				context: { name: 'ct-pr', genre: 'corsair' },
			});
			const statusId = pick(status, 'id');
			P.statusId = statusId;
			const iterStatus = await step('git.pullRequestIterationStatuses.create', {
				repositoryId,
				pullRequestId,
				iterationId: 1,
				state: 'pending',
				description: 'Corsair live',
				context: { name: 'ct-iter', genre: 'corsair' },
			});
			const iterationStatusId = pick(iterStatus, 'id');
			await step('git.pullRequestReviewers.createPullRequestReviewer', {
				repositoryId,
				pullRequestId,
				reviewerId: P.userId,
				vote: 0,
			});
			await step('git.pullRequestReviewers.updatePullRequestReviewer', {
				repositoryId,
				pullRequestId,
				reviewerId: P.userId,
				isFlagged: true,
			});
			await step('git.pullRequestReviewers.createPullRequestReviewers', {
				repositoryId,
				pullRequestId,
				body: [{ id: P.userId }],
			});
			await step('git.pullRequestReviewers.updatePullRequestReviewers', {
				repositoryId,
				pullRequestId,
				body: [{ id: P.userId, isRequired: false }],
			});
			await probe(
				'git.pullRequestReviewers.createUnmaterializedPullRequestReviewer',
				{
					repositoryId,
					pullRequestId,
					displayName: 'ct',
				},
			);
			await step('git.pullRequestProperties.update', {
				repositoryId,
				pullRequestId,
				body: [{ op: 'add', path: '/ct.key', value: 'ct-value' }],
			});
			await step('git.pullRequestAttachments.create', {
				repositoryId,
				pullRequestId,
				fileName: 'ct.txt',
				file: TEXT_FILE,
			});
			P.fileName = 'ct.txt';
			await step('git.pullRequestQuery.get', {
				repositoryId,
				queries: [{ type: 'lastMergeCommit', items: [featureCommit] }],
			});
			// The reads in the sweep use the records above; these deletes run last.
			later('git.pullRequestAttachments.delete', {
				repositoryId,
				pullRequestId,
				fileName: 'ct.txt',
			});
			later('git.pullRequestReviewers.delete', {
				repositoryId,
				pullRequestId,
				reviewerId: P.userId,
			});
			if (iterationStatusId) {
				P['git.pullRequestIterationStatuses:statusId'] = iterationStatusId;
				later('git.pullRequestIterationStatuses.delete', {
					repositoryId,
					pullRequestId,
					iterationId: 1,
					statusId: iterationStatusId,
				});
				await step(
					'git.pullRequestIterationStatuses.update',
					{
						repositoryId,
						pullRequestId,
						iterationId: 1,
						body: [
							{
								op: 'remove',
								from: '',
								path: `/${iterationStatusId}/properties/ct`,
								value: null,
							},
						],
					},
					{ probe: true },
				);
			}
			if (statusId) {
				later('git.pullRequestStatuses.delete', {
					repositoryId,
					pullRequestId,
					statusId,
				});
				await step(
					'git.pullRequestStatuses.update',
					{
						repositoryId,
						pullRequestId,
						body: [
							{
								op: 'remove',
								from: '',
								path: `/${statusId}/properties/ct`,
								value: null,
							},
						],
					},
					{ probe: true },
				);
			}
			// A pull request label is also a project tag.
			later('wit.tags.delete', { tagIdOrName: 'ct-label' });
			later('git.pullRequestLabels.delete', {
				repositoryId,
				pullRequestId,
				labelIdOrName: 'ct-label',
			});
		}

		const merge = await step('git.merges.create', {
			repositoryNameOrId: repositoryId,
			parents: [commitId, featureCommit],
			comment: 'Corsair live merge',
		});
		P.mergeOperationId = pick(merge, 'mergeOperationId');
		const cherry = await step('git.cherryPicks.create', {
			repositoryId,
			source: { commitList: [{ commitId: featureCommit }] },
			ontoRefName: 'refs/heads/main',
			generatedRefName: 'refs/heads/ct-cherry',
		});
		P.cherryPickId = pick(cherry, 'cherryPickId');
		const revert = await step('git.reverts.create', {
			repositoryId,
			source: { commitList: [{ commitId }] },
			ontoRefName: 'refs/heads/ct-feature',
			generatedRefName: 'refs/heads/ct-revert',
		});
		P.revertId = pick(revert, 'revertId');
		P.refName = 'refs/heads/ct-cherry';
		const favorite = await step('git.refsFavorites.create', {
			name: 'refs/heads/main',
			repositoryId,
			type: 'ref',
		});
		const favoriteId = pick(favorite, 'id');
		if (favoriteId) {
			P['git:favoriteId'] = favoriteId;
			later('git.refsFavorites.delete', { favoriteId });
		}
		await step('git.commits.getCommitsBatch', {
			repositoryId,
			$top: 5,
			itemVersion: { version: 'main', versionType: 'branch' },
		});
		await step('git.items.getItemsBatch', {
			repositoryId,
			itemDescriptors: [
				{ path: '/README.md', version: 'main', versionType: 'branch' },
			],
		});
		const readme = await raw('git.items.list', {
			repositoryId,
			scopePath: '/',
			recursionLevel: 'oneLevel',
		}).catch(() => undefined);
		const blob = (
			(pick(readme, 'value') as Array<Record<string, unknown>> | undefined) ??
			[]
		).find((item) => item.path === '/README.md');
		P['git.blobs:sha1'] = blob?.objectId;
		await step('git.blobs.getBlobsZip', {
			repositoryId,
			body: [blob?.objectId ?? commitId],
		});
		P.path = '/README.md';
		P['git:path'] = '/README.md';

		// A fork and an import, in repositories of their own.
		const fork = await step('git.repositories.create', {
			name: `${NAME}-fork`,
			parentRepository: { id: repositoryId, project: { id: P.projectId } },
		});
		const forkId = pick(fork, 'id') as string;
		if (forkId) {
			later('git.repositories.deleteRepositoryFromRecycleBin', {
				repositoryId: forkId,
			});
			later('git.repositories.delete', { repositoryId: forkId });
			P['git.forks:repositoryNameOrId'] = forkId;
			P.collectionId = P.projectId;
			const sync = await step('git.forks.createForkSyncRequest', {
				repositoryNameOrId: forkId,
				source: { repositoryId, projectId: P.projectId },
			});
			P.forkSyncOperationId = pick(sync, 'operationId');
		}
		const imported = await step('git.repositories.create', {
			name: `${NAME}-import`,
		});
		const importId = pick(imported, 'id') as string;
		if (importId) {
			later('git.repositories.deleteRepositoryFromRecycleBin', {
				repositoryId: importId,
			});
			later('git.repositories.delete', { repositoryId: importId });
			const request = await step('git.importRequests.create', {
				repositoryId: importId,
				parameters: {
					gitSource: { url: 'https://github.com/octocat/Hello-World.git' },
				},
			});
			const importRequestId = pick(request, 'importRequestId');
			P['git.importRequests:repositoryId'] = importId;
			P.importRequestId = importRequestId;
			const finished = await waitFor(
				() =>
					raw('git.importRequests.get', {
						repositoryId: importId,
						importRequestId,
					}),
				(v) =>
					['completed', 'failed', 'abandoned'].includes(
						String(pick(v, 'status')),
					),
			);
			// Only a failed import can be retried or abandoned.
			await step(
				'git.importRequests.update',
				{ repositoryId: importId, importRequestId, status: 'abandoned' },
				{ probe: String(pick(finished, 'status')) === 'completed' },
			);
		}
		await step('git.repositories.update', {
			repositoryId,
			name: `${NAME}-repo-renamed`,
		});
	});

	it('runs an agentless YAML pipeline and its build routes', async () => {
		const repositoryId = P.repositoryId as string;
		if (!repositoryId) return;
		const pipeline = await step('pipelines.pipelines.create', {
			name: `${NAME}-pipeline`,
			folder: '\\',
			configuration: {
				type: 'yaml',
				path: '/azure-pipelines.yml',
				repository: { id: repositoryId, type: 'azureReposGit' },
			},
		});
		const pipelineId = pick(pipeline, 'id') as number;
		if (!pipelineId) return;
		P.pipelineId = pipelineId;
		P.definitionId = pipelineId;
		P.definition = String(pipelineId);
		P['build:definitionId'] = pipelineId;
		later('build.definitions.delete', { definitionId: pipelineId });
		await step('pipelines.preview.preview', { pipelineId, previewRun: true });
		const run = await step('pipelines.runs.runPipeline', { pipelineId });
		const runId = pick(run, 'id') as number;
		if (runId) {
			P['pipelines:runId'] = runId;
			P.buildId = runId;
			P['build:buildId'] = runId;
			const finished = await waitFor(
				() => raw('pipelines.runs.get', { pipelineId, runId }),
				(v) => pick(v, 'state') === 'completed',
				240_000,
			);
			expect(pick(finished, 'state')).toBe('completed');
			later('build.builds.delete', { buildId: runId });
			const timeline = await raw('build.timeline.get', {
				buildId: runId,
			}).catch(() => undefined);
			const records =
				(pick(timeline, 'records') as Array<Record<string, unknown>>) ?? [];
			P.timelineId = pick(timeline, 'id');
			const stage = records.find((r) => r.type === 'Stage');
			P.stageRefName = stage?.identifier ?? '__default';
			const job = records.find((r) => r.type === 'Job');
			P.jobId = job?.id;
			P.logId = pick(job, 'log', 'id') ?? 1;
			const build = await raw('build.builds.get', { buildId: runId }).catch(
				() => undefined,
			);
			P['distributedTask:planId'] = pick(build, 'orchestrationPlan', 'planId');
			P['pipelines:logId'] = P.logId;
			P['build.sourceProviders:pullRequestId'] = String(P.pullRequestId ?? 1);
		}

		// A second definition through the build API, queued and cancelled.
		const definition = await step('build.definitions.create', {
			name: `${NAME}-build`,
			path: '\\',
			type: 'build',
			queue: { id: P.queueId },
			repository: {
				id: repositoryId,
				type: 'TfsGit',
				defaultBranch: 'refs/heads/main',
			},
			process: { type: 2, yamlFilename: '/azure-pipelines.yml' },
		});
		const definitionId = pick(definition, 'id') as number;
		if (definitionId) {
			later('build.definitions.delete', { definitionId });
			const full = (await raw('build.definitions.get', { definitionId }).catch(
				() => undefined,
			)) as Record<string, unknown> | undefined;
			if (full) {
				// The read's `project` reference isn't part of the write.
				const { project: _project, ...rest } = clean(full) as Record<
					string,
					unknown
				>;
				await step('build.definitions.update', {
					...rest,
					definitionId,
					description: 'Edited by the Corsair live run',
				});
			}
			await step('build.tags.addDefinitionTag', {
				definitionId,
				tag: 'ct-def',
			});
			await step('build.tags.addDefinitionTags', {
				definitionId,
				body: ['ct-def2'],
			});
			await step('build.tags.updateDefinitionTags', {
				definitionId,
				tagsToAdd: ['ct-def3'],
				tagsToRemove: ['ct-def2'],
			});
			await step('build.tags.deleteDefinitionTag', {
				definitionId,
				tag: 'ct-def',
			});
			await step('build.properties.updateDefinitionProperties', {
				definitionId,
				body: [{ op: 'add', path: '/ct', value: 'ct-value' }],
			});
			const queued = await step('build.builds.queue', {
				definition: { id: definitionId },
				sourceBranch: 'refs/heads/main',
			});
			const buildId = pick(queued, 'id') as number;
			if (buildId) {
				later('build.builds.delete', { buildId });
				await waitFor(
					() => raw('build.builds.get', { buildId }),
					(v) => pick(v, 'status') === 'completed',
					240_000,
				);
				await step('build.tags.addBuildTag', { buildId, tag: 'ct-build' });
				await step('build.tags.addBuildTags', { buildId, body: ['ct-build2'] });
				await step('build.tags.updateBuildTags', {
					buildId,
					tagsToAdd: ['ct-build3'],
					tagsToRemove: ['ct-build2'],
				});
				await step('build.tags.deleteBuildTag', { buildId, tag: 'ct-build' });
				await step('build.properties.updateBuildProperties', {
					buildId,
					body: [{ op: 'add', path: '/ct', value: 'ct-value' }],
				});
				await step('build.artifacts.create', {
					buildId,
					name: 'ct-drop',
					resource: { type: 'FilePath', data: '\\\\ct\\drop' },
				});
				P.artifactName = 'ct-drop';
				// keepForever is retired ("deprecated in favor of retention leases").
				await step('build.builds.updateBuild', {
					buildId,
					retainedByRelease: false,
				});
				await step('build.builds.updateBuilds', {
					body: [{ id: buildId, retainedByRelease: false }],
				});
				await step('build.builds.getBuildWorkItemsRefsFromCommits', {
					buildId,
					body: [P.commitId],
				});
				await step(
					'build.stages.update',
					{
						buildId,
						stageRefName: P.stageRefName ?? '__default',
						state: 'retry',
					},
					{ probe: true },
				);
				const lease = await step('build.leases.add', {
					body: [
						{
							definitionId,
							runId: buildId,
							ownerId: `User:${P.userId}`,
							daysValid: 1,
							protectPipeline: false,
						},
					],
				});
				const leaseId = pick(lease, 'value', 0, 'leaseId');
				if (leaseId) {
					P.leaseId = leaseId;
					P['build.leases:leasesToFetch'] = JSON.stringify([
						{ definitionId, ownerId: `User:${P.userId}`, runId: buildId },
					]);
					await step('build.leases.update', { leaseId, daysValid: 2 });
					later('build.leases.delete', { ids: String(leaseId) });
				}
			}
			P['build.definitions:definitionId'] = definitionId;
		}
		await step('build.folders.create', {
			path: `\\${NAME}`,
			description: 'Corsair live folder',
		});
		await step('build.folders.update', {
			path: `\\${NAME}`,
			bodyPath: `\\${NAME}-moved`,
			description: 'Corsair live folder (moved)',
		});
		later('build.folders.delete', { path: `\\${NAME}-moved` });
		await probe('build.templates.saveTemplate', {
			templateId: NAME,
			id: NAME,
			name: NAME,
			description: 'Corsair live template',
			template: {
				name: NAME,
				process: { type: 2, yamlFilename: '/azure-pipelines.yml' },
			},
		});
		later('build.templates.delete', { templateId: NAME });
		await probe('build.sourceProviders.restoreWebhooks', {
			providerName: 'github',
			body: ['push'],
		});
		// Project settings: written back with the values just read.
		const general = (await raw('build.generalSettings.get', {}).catch(
			() => undefined,
		)) as Record<string, unknown> | undefined;
		if (general) await step('build.generalSettings.update', { ...general });
		const retention = (await raw('build.retention.get', {}).catch(
			() => undefined,
		)) as Record<string, unknown> | undefined;
		if (retention)
			await step('build.retention.update', {
				artifactsRetention: {
					value: pick(retention, 'purgeArtifacts', 'value'),
				},
				pullRequestRunRetention: {
					value: pick(retention, 'purgePullRequestRuns', 'value'),
				},
				runRetention: { value: pick(retention, 'purgeRuns', 'value') },
				retainRunsPerProtectedBranch: {
					value: pick(retention, 'retainRunsPerProtectedBranch', 'value'),
				},
			});
		const settings = (await raw('build.settings.get', {}).catch(
			() => undefined,
		)) as Record<string, unknown> | undefined;
		if (settings) await step('build.settings.update', { ...settings });
	});

	it('creates project resources for pipelines', async () => {
		const environment = await step('distributedTask.environments.add', {
			name: `${NAME}-env`,
			description: 'Corsair live environment',
		});
		const environmentId = pick(environment, 'id') as number;
		if (environmentId) {
			P['distributedTask:environmentId'] = environmentId;
			later('distributedTask.environments.delete', { environmentId });
			await step('distributedTask.environments.update', {
				environmentId,
				name: `${NAME}-env`,
				description: 'Corsair live environment (edited)',
			});
			const check = await step('approvalsAndChecks.checkConfigurations.add', {
				type: { id: '8C6F20A7-A545-4486-9777-F762FAFE0D4D', name: 'Approval' },
				resource: {
					type: 'environment',
					id: String(environmentId),
					name: `${NAME}-env`,
				},
				settings: {
					approvers: [{ id: P.userId }],
					executionOrder: 1,
					instructions: 'Corsair live',
					blockedApprovers: [],
					minRequiredApprovers: 0,
				},
				timeout: 60,
			});
			const checkId = pick(check, 'id');
			if (checkId) {
				P['approvalsAndChecks:id'] = checkId;
				later('approvalsAndChecks.checkConfigurations.delete', { id: checkId });
				await step('approvalsAndChecks.checkConfigurations.update', {
					id: checkId,
					type: {
						id: '8C6F20A7-A545-4486-9777-F762FAFE0D4D',
						name: 'Approval',
					},
					resource: {
						type: 'environment',
						id: String(environmentId),
						name: `${NAME}-env`,
					},
					settings: {
						approvers: [{ id: P.userId }],
						executionOrder: 1,
						instructions: 'Corsair live (edited)',
						blockedApprovers: [],
						minRequiredApprovers: 0,
					},
					timeout: 120,
				});
			}
			await step('approvalsAndChecks.checkConfigurations.query', {
				body: [{ type: 'environment', id: String(environmentId) }],
			});
			P.resourceType = 'environment';
			P.resourceId = String(environmentId);
			if (P.pipelineId)
				await step(
					'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResource',
					{
						resourceType: 'environment',
						resourceId: String(environmentId),
						pipelines: [{ id: P.pipelineId, authorized: true }],
					},
				);
			await step(
				'approvalsAndChecks.pipelinePermissions.updatePipelinePermisionsForResources',
				{
					body: [
						{
							resource: { type: 'environment', id: String(environmentId) },
							pipelines: [],
							allPipelines: { authorized: false },
						},
					],
				},
			);
			await probe('approvalsAndChecks.checkEvaluations.evaluate', {
				resources: [{ type: 'environment', id: String(environmentId) }],
				context: {},
			});
			await probe('approvalsAndChecks.approvals.update', {
				body: [{ approvalId: ZERO_GUID, status: 'approved', comment: 'ct' }],
			});
		}

		const group = await step('distributedTask.variablegroups.add', {
			name: `${NAME}-vars`,
			type: 'Vsts',
			description: 'Corsair live variables',
			variables: { ct: { value: 'one' } },
			variableGroupProjectReferences: [
				{
					name: `${NAME}-vars`,
					projectReference: { id: P.projectId, name: project },
				},
			],
		});
		const groupId = pick(group, 'id') as number;
		if (groupId) {
			P['distributedTask:groupId'] = groupId;
			P.variableGroupId = groupId;
			later('distributedTask.variablegroups.delete', {
				groupId,
				projectIds: P.projectId,
			});
			await step('distributedTask.variablegroups.update', {
				groupId,
				name: `${NAME}-vars`,
				type: 'Vsts',
				variables: { ct: { value: 'two' } },
				variableGroupProjectReferences: [
					{
						name: `${NAME}-vars`,
						projectReference: { id: P.projectId, name: project },
					},
				],
			});
			await step('build.authorizedresources.authorizeProjectResources', {
				body: [
					{ type: 'variablegroup', id: String(groupId), authorized: false },
				],
			});
			if (P['build.definitions:definitionId'])
				await step('build.resources.authorizeDefinitionResources', {
					definitionId: P['build.definitions:definitionId'],
					body: [
						{ type: 'variablegroup', id: String(groupId), authorized: true },
					],
				});
		}

		const deployment = await step(
			'distributedTask.deploymentgroups.add',
			{ name: `${NAME}-dg`, description: 'Corsair live deployment group' },
			{ expected: CLASSIC_OFF },
		);
		const deploymentGroupId = pick(deployment, 'id') as number;
		if (deploymentGroupId) {
			P.deploymentGroupId = deploymentGroupId;
			later('distributedTask.deploymentgroups.delete', { deploymentGroupId });
			await step('distributedTask.deploymentgroups.update', {
				deploymentGroupId,
				name: `${NAME}-dg`,
				description: 'Corsair live deployment group (edited)',
			});
			await probe('distributedTask.targets.update', {
				deploymentGroupId,
				body: [{ id: MISSING_INT, tags: ['ct'] }],
			});
			await probe('distributedTask.targets.delete', {
				deploymentGroupId,
				targetId: MISSING_INT,
			});
		}

		const taskGroup = await step(
			'distributedTask.taskgroups.add',
			{
				name: `${NAME}-tg`,
				category: 'Utility',
				description: 'Corsair live task group',
				instanceNameFormat: `${NAME}-tg`,
				runsOn: ['Agent', 'DeploymentGroup'],
				version: { major: 1, minor: 0, patch: 0, isTest: false },
				inputs: [],
				tasks: [
					{
						displayName: 'Delay',
						enabled: true,
						inputs: { delayForMinutes: '0' },
						task: {
							id: '28782b92-5e8e-4458-9751-a71cd1492bae',
							versionSpec: '1.*',
							definitionType: 'task',
						},
					},
				],
			},
			{ expected: CLASSIC_OFF },
		);
		const taskGroupId = pick(taskGroup, 'id') as string;
		if (taskGroupId) {
			P.taskGroupId = taskGroupId;
			later('distributedTask.taskgroups.delete', { taskGroupId });
			await step('distributedTask.taskgroups.update', {
				...(taskGroup as Record<string, unknown>),
				taskGroupId,
				description: 'Corsair live task group (edited)',
			});
		}
		// Job routes that only an agent's own job token can use.
		const hub = 'build';
		P.hubName = hub;
		P.scopeIdentifier = P.projectId;
		const plan = P['distributedTask:planId'] ?? ZERO_GUID;
		await probe('distributedTask.events.postEvent', {
			scopeIdentifier: P.projectId,
			hubName: hub,
			planId: plan,
			name: 'TaskCompleted',
			jobId: ZERO_GUID,
			taskId: ZERO_GUID,
			result: 'succeeded',
		});
		await probe('distributedTask.logs.create', {
			scopeIdentifier: P.projectId,
			hubName: hub,
			planId: plan,
			path: 'ct.log',
		});
		await probe('distributedTask.logs.appendLogContent', {
			scopeIdentifier: P.projectId,
			hubName: hub,
			planId: plan,
			logId: MISSING_INT,
			file: TEXT_FILE,
		});
		await probe('distributedTask.records.update', {
			scopeIdentifier: P.projectId,
			hubName: hub,
			planId: plan,
			timelineId: ZERO_GUID,
			body: [],
		});
		await probe('distributedTask.oidctoken.create', {
			scopeIdentifier: P.projectId,
			hubName: hub,
			planId: plan,
			jobId: ZERO_GUID,
		});
		await probe('distributedTask.nodes.update', {
			poolId: P.poolId,
			elasticNodeId: MISSING_INT,
			state: 'deleted',
		});
		await probe('distributedTask.queues.delete', { queueId: MISSING_INT });
		await probe('distributedTask.targets.delete', {
			deploymentGroupId: MISSING_INT,
			targetId: MISSING_INT,
		});

		const endpoint = await step('serviceEndpoint.endpoints.create', {
			name: `${NAME}-se`,
			type: 'generic',
			url: 'https://example.com',
			description: 'Corsair live service connection',
			isShared: false,
			authorization: {
				scheme: 'UsernamePassword',
				parameters: { username: 'ct', password: 'ct-not-a-secret' },
			},
			serviceEndpointProjectReferences: [
				{
					name: `${NAME}-se`,
					projectReference: { id: P.projectId, name: project },
				},
			],
		});
		const endpointId = pick(endpoint, 'id') as string;
		if (endpointId) {
			P.endpointId = endpointId;
			P.endpointIds = endpointId;
			P.endpointNames = `${NAME}-se`;
			P.serviceEndpointId = endpointId;
			later('serviceEndpoint.endpoints.delete', {
				endpointId,
				projectIds: P.projectId,
			});
			const edited = {
				...(endpoint as Record<string, unknown>),
				description: 'Corsair live service connection (edited)',
				authorization: {
					scheme: 'UsernamePassword',
					parameters: { username: 'ct', password: 'ct-not-a-secret' },
				},
			};
			await step('serviceEndpoint.endpoints.updateServiceEndpoint', {
				...edited,
				endpointId,
			});
			await step('serviceEndpoint.endpoints.updateServiceEndpoints', {
				body: [edited],
			});
			await probe(
				'serviceEndpoint.endpoints.getServiceEndpointsWithRefreshedAuthentication',
				{
					endpointIds: endpointId,
					body: [],
				},
			);
			await probe('serviceEndpoint.endpointproxy.query', {
				endpointId,
				dataSourceName: 'ct',
				requestVerb: 'GET',
				endpointUrl: '{{endpoint.url}}',
			});
		}
	});

	it('works Boards: work items, comments, queries, nodes, tags and a team', async () => {
		const tag = `${NAME}-tag`;
		P.tagIdOrName = tag;
		const task = await step('wit.workItems.create', {
			type: 'Task',
			body: [
				{ op: 'add', path: '/fields/System.Title', value: `${NAME} task` },
				{ op: 'add', path: '/fields/System.Tags', value: tag },
			],
		});
		const id = pick(task, 'id') as number;
		if (!id) return;
		P.workItemId = id;
		P['wit:id'] = id;
		P.ids = String(id);
		P.workItemIds = String(id);
		P.workitemIds = String(id);
		later('wit.workItems.delete', { id, destroy: true });
		const issue = await step('wit.workItems.create', {
			type: 'Issue',
			body: [
				{ op: 'add', path: '/fields/System.Title', value: `${NAME} issue` },
			],
		});
		const issueId = pick(issue, 'id') as number;
		if (issueId) {
			await step('wit.workItems.update', {
				id,
				body: [
					{
						op: 'add',
						path: '/fields/System.Description',
						value: 'Edited by the Corsair live run.',
					},
					{
						op: 'add',
						path: '/relations/-',
						value: {
							rel: 'System.LinkTypes.Hierarchy-Reverse',
							url: pick(issue, 'url'),
						},
					},
				],
			});
			// Soft delete, restore, then delete for good.
			await step('wit.workItems.delete', { id: issueId });
			await step('wit.recyclebin.restoreWorkItem', {
				id: issueId,
				isDeleted: false,
			});
			await step('wit.workItems.delete', { id: issueId });
			P['wit.recyclebin:id'] = issueId;
			later('wit.recyclebin.destroyWorkItem', { id: issueId });
		}
		const extra = await step('wit.workItems.create', {
			type: 'Task',
			body: [
				{
					op: 'add',
					path: '/fields/System.Title',
					value: `${NAME} batch delete`,
				},
			],
		});
		if (pick(extra, 'id'))
			await step('wit.workItems.deleteWorkItems', {
				ids: [pick(extra, 'id')],
				destroy: true,
			});
		const comment = await step('wit.comments.addComment', {
			workItemId: id,
			text: 'Comment from the Corsair live run',
		});
		const commentId = pick(comment, 'id') as number;
		if (commentId) {
			P['wit:commentId'] = commentId;
			P['wit:version'] = 1;
			P.reactionType = 'like';
			await step('wit.comments.updateComment', {
				workItemId: id,
				commentId,
				text: 'Comment from the Corsair live run (edited)',
			});
			await step('wit.commentsReactions.create', {
				workItemId: id,
				commentId,
				reactionType: 'like',
			});
			await step('wit.commentsReactions.delete', {
				workItemId: id,
				commentId,
				reactionType: 'like',
			});
			// A second comment to delete; the first stays for the sweep's reads.
			const spare = await step('wit.comments.addComment', {
				workItemId: id,
				text: 'Comment to delete',
			});
			if (pick(spare, 'id'))
				await step('wit.comments.delete', {
					workItemId: id,
					commentId: pick(spare, 'id'),
				});
		}
		const attachment = await step('wit.attachments.create', {
			fileName: 'ct.txt',
			file: TEXT_FILE,
		});
		P['wit:id'] = id;
		P['wit.attachments:id'] = pick(attachment, 'id');
		const chunked = (await raw('wit.attachments.create', {
			fileName: 'ct-chunked.txt',
			uploadType: 'Chunked',
			file: { ...TEXT_FILE, base64: '' },
		}).catch(() => undefined)) as Record<string, unknown> | undefined;
		const size = Buffer.from(TEXT_FILE.base64, 'base64').length;
		await step(
			'wit.attachments.uploadChunk',
			{
				id: pick(chunked, 'id') ?? ZERO_GUID,
				fileName: 'ct-chunked.txt',
				contentRange: `bytes 0-${size - 1}/${size}`,
				file: TEXT_FILE,
			},
			{ probe: !chunked },
		);
		await step('wit.tags.update', { tagIdOrName: tag, name: `${tag}-renamed` });
		P.tagIdOrName = `${tag}-renamed`;
		later('wit.tags.delete', { tagIdOrName: `${tag}-renamed` });

		const folder = await step('wit.queries.create', {
			query: 'Shared Queries',
			name: NAME,
			isFolder: true,
		});
		const folderId = pick(folder, 'id') as string;
		if (folderId) {
			later('wit.queries.delete', { query: folderId });
			const query = await step('wit.queries.create', {
				query: folderId,
				name: `${NAME}-query`,
				wiql: `Select [System.Id] From WorkItems Where [System.Tags] Contains '${tag}'`,
			});
			const queryId = pick(query, 'id') as string;
			if (queryId) {
				P['wit:query'] = queryId;
				P['wit.wiql:id'] = queryId;
				await step('wit.queries.update', {
					query: queryId,
					name: `${NAME}-query-edited`,
				});
				await step('wit.queries.getQueriesBatch', {
					ids: [queryId],
					$expand: 'wiql',
				});
			}
		}
		await step('wit.tempQueries.create', {
			wiql: 'Select [System.Id] From WorkItems Where [System.TeamProject] = @project',
		});
		await step('wit.wiql.queryByWiql', {
			team: P.team,
			query: `Select [System.Id] From WorkItems Where [System.Title] = '${NAME} task'`,
		});
		await step('wit.artifactUriQuery.query', {
			artifactUris: [
				`vstfs:///Git/Commit/${P.projectId}%2F${P.repositoryId}%2F${P.commitId}`,
			],
		});
		await step('wit.reportingWorkItemRevisions.readReportingRevisionsPost', {
			fields: ['System.Id', 'System.Title'],
			types: ['Task'],
		});
		await step('wit.workItems.getWorkItemsBatch', {
			ids: [id],
			fields: ['System.Title'],
		});
		const template = await step('wit.templates.create', {
			team: P.team,
			name: `${NAME}-template`,
			description: 'Corsair live template',
			workItemTypeName: 'Task',
			fields: { 'System.Title': 'From a template' },
		});
		const templateId = pick(template, 'id');
		if (templateId) {
			P['wit:templateId'] = templateId;
			later('wit.templates.delete', { team: P.team, templateId });
			await step('wit.templates.replaceTemplate', {
				team: P.team,
				templateId,
				name: `${NAME}-template`,
				description: 'Corsair live template (edited)',
				workItemTypeName: 'Task',
				fields: { 'System.Title': 'From a template' },
			});
		}

		// Area and iteration nodes under the project root.
		for (const group of ['areas', 'iterations']) {
			const node = await step('wit.classificationNodes.createOrUpdate', {
				structureGroup: group,
				name: `${NAME}-${group}`,
			});
			if (pick(node, 'id')) {
				// A child under the new node: the nested path stays whole.
				await step('wit.classificationNodes.createOrUpdate', {
					structureGroup: group,
					path: `${NAME}-${group}`,
					name: 'child',
				});
				await step('wit.classificationNodes.get', {
					structureGroup: group,
					path: `${NAME}-${group}/child`,
				});
				later('wit.classificationNodes.delete', {
					structureGroup: group,
					path: `${NAME}-${group}-edited`,
				});
				await step('wit.classificationNodes.update', {
					structureGroup: group,
					path: `${NAME}-${group}`,
					name: `${NAME}-${group}-edited`,
				});
				P[`wit.classificationNodes:path`] = `${NAME}-${group}-edited`;
				P.structureGroup = group;
			}
		}

		const team = await step('core.teams.create', {
			projectId: P.projectId,
			name: `${NAME}-team`,
			description: 'Corsair live team',
		});
		const teamId = pick(team, 'id') as string;
		if (teamId) {
			P.ctTeam = `${NAME}-team`;
			P.ctTeamId = teamId;
			later('core.teams.delete', { projectId: P.projectId, teamId });
			await step('core.teams.update', {
				projectId: P.projectId,
				teamId,
				description: 'Corsair live team (edited)',
			});
		}
		await step('search.workItemSearchResults.fetchWorkItemSearchResults', {
			searchText: NAME,
			$top: 5,
		});
		await probe('search.codeSearchResults.fetchCodeSearchResults', {
			searchText: 'Corsair',
			$top: 5,
		});
		await step(
			'search.wikiSearchResults.fetchWikiSearchResults',
			{
				searchText: 'Corsair',
				$top: 5,
			},
			{ probe: true },
		);
		await step(
			'search.packageSearchResults.fetchPackageSearchResults',
			{
				searchText: 'ct',
				$top: 5,
			},
			{ probe: true },
		);
	});

	it('publishes a code wiki and edits its pages', async () => {
		if (!P.repositoryId) return;
		const wiki = await step('wiki.wikis.create', {
			name: `${NAME}-wiki`,
			type: 'codeWiki',
			projectId: P.projectId,
			repositoryId: P.repositoryId,
			mappedPath: '/docs',
			version: { version: 'main' },
		});
		const wikiIdentifier = pick(wiki, 'id') as string;
		if (!wikiIdentifier) return;
		P.wikiIdentifier = wikiIdentifier;
		later('wiki.wikis.delete', { wikiIdentifier });
		await step('wiki.wikis.update', {
			wikiIdentifier,
			versions: [{ version: 'main' }, { version: 'ct-feature' }],
		});
		const page = await step('wiki.pages.createOrUpdate', {
			wikiIdentifier,
			path: '/ct-page',
			content: '# Corsair live page',
			comment: 'Corsair live',
			'versionDescriptor.version': 'main',
		});
		const pageId = pick(page, 'id') as number;
		P.pageId = pageId;
		P['wiki:id'] = pageId;
		P['wiki:path'] = '/ct-page';
		if (pageId) {
			const fresh = await raw('wiki.pages.getPageById', {
				wikiIdentifier,
				id: pageId,
			}).catch(() => undefined);
			await step('wiki.pages.update', {
				wikiIdentifier,
				id: pageId,
				content: '# Corsair live page (edited)',
				ifMatch: pick(fresh, 'eTag'),
			});
		}
		await step('wiki.pageMoves.create', {
			wikiIdentifier,
			path: '/ct-page',
			newPath: '/ct-page-moved',
			'versionDescriptor.version': 'main',
		});
		P['wiki:path'] = '/ct-page-moved';
		await step('wiki.attachments.create', {
			wikiIdentifier,
			name: 'ct.txt',
			file: TEXT_FILE,
			'versionDescriptor.version': 'main',
		});
		await step('wiki.pagesBatch.get', {
			wikiIdentifier,
			top: 10,
			'versionDescriptor.version': 'main',
		});
		const second = await step('wiki.pages.createOrUpdate', {
			wikiIdentifier,
			path: '/ct-second',
			content: 'Second page',
			'versionDescriptor.version': 'main',
		});
		if (pick(second, 'id'))
			later('wiki.pages.deletePageById', {
				wikiIdentifier,
				id: pick(second, 'id'),
			});
		later('wiki.pages.deletePage', {
			wikiIdentifier,
			path: '/ct-page-moved',
			'versionDescriptor.version': 'main',
		});
	});

	it('works a project feed', async () => {
		const feed = await step('artifacts.feedManagement.createFeed', {
			name: `${NAME}-feed`,
			description: 'Corsair live feed',
		});
		const feedId = pick(feed, 'id') as string;
		if (!feedId) return;
		P.feedId = feedId;
		P.feed = feedId;
		P.feedName = `${NAME}-feed`;
		later('artifacts.feedRecycleBin.permanentDeleteFeed', { feedId });
		later('artifacts.feedManagement.deleteFeed', { feedId });
		await step('artifacts.feedManagement.updateFeed', {
			feedId,
			description: 'Corsair live feed (edited)',
		});
		const view = await step('artifacts.feedManagement.createFeedView', {
			feedId,
			name: 'ct-view',
			type: 'release',
			visibility: 'collection',
		});
		const viewId = pick(view, 'id') as string;
		if (viewId) {
			P.viewId = viewId;
			later('artifacts.feedManagement.deleteFeedView', { feedId, viewId });
			await step('artifacts.feedManagement.updateFeedView', {
				feedId,
				viewId,
				visibility: 'private',
			});
		}
		await step(
			'artifacts.feedManagement.setFeedPermissions',
			{
				feedId,
				body: [
					{ role: 'administrator', identityDescriptor: P.identityDescriptor },
				],
			},
			{ probe: true },
		);
		await step('artifacts.retentionPolicies.setRetentionPolicy', {
			feedId,
			countLimit: 10,
			daysToKeepRecentlyDownloadedPackages: 30,
		});
		later('artifacts.retentionPolicies.deleteRetentionPolicy', { feedId });
		await step('artifacts.recycleBin.emptyRecycleBin', { feedId });
		await step('artifacts.artifactDetails.queryPackageMetrics', {
			feedId,
			packageIds: [ZERO_GUID],
		});
		await probe('artifacts.artifactDetails.queryPackageVersionMetrics', {
			feedId,
			packageId: ZERO_GUID,
			packageVersionIds: [ZERO_GUID],
		});
		await probe('artifacts.provenance.createSession', {
			protocol: 'npm',
			feed: feedId,
			source: 'ct',
		});
		// Feed delete and restore, before the sweep reads the feed again.
		await step('artifacts.feedManagement.deleteFeed', { feedId });
		await step('artifacts.feedRecycleBin.restoreDeletedFeed', {
			feedId,
			body: [{ op: 'replace', path: '/isDeleted', value: false }],
		});
		// The feed holds no packages: each package write answers for a name
		// that isn't there.
		P.packageName = 'ct-none';
		P.unscopedPackageName = 'ct-none';
		P.packageScope = 'ct';
		P.packageVersion = '1.0.0';
		P.packageId = ZERO_GUID;
		P.packageVersionId = ZERO_GUID;
		P['artifactsPackageTypes:groupId'] = 'ct';
		P['artifactsPackageTypes:artifactId'] = 'ct';
		P.version = '1.0.0';
		P['artifactsPackageTypes:fileName'] = 'ct.jar';
		for (const operation of azuredevopsOperations) {
			if (
				!operation.id.startsWith('artifactsPackageTypes.') ||
				operation.method === 'GET'
			)
				continue;
			const input = inputFor(operation.id);
			if (operation.method !== 'DELETE') input.body = input.body ?? {};
			await probe(operation.id, input);
		}
	});

	it('works dashboards in its own team', async () => {
		// A team's last dashboard can't be deleted (VS402433): the dashboards
		// live in the run's team, which takes the last one with it.
		const team = P.ctTeam as string | undefined;
		if (!team) return;
		const spare = await step('dashboard.dashboards.create', {
			team,
			name: `${NAME}-dash-spare`,
		});
		const dashboard = await step('dashboard.dashboards.create', {
			team,
			name: `${NAME}-dash`,
			description: 'Corsair live dashboard',
		});
		const dashboardId = pick(dashboard, 'id') as string;
		if (!dashboardId) return;
		P.dashboardId = dashboardId;
		P['dashboard:team'] = team;
		later('dashboard.dashboards.delete', { team, dashboardId });
		const widget = {
			name: 'ct-markdown',
			contributionId:
				'ms.vss-dashboards-web.Microsoft.VisualStudioOnline.Dashboards.MarkdownWidget',
			position: { row: 1, column: 1 },
			size: { rowSpan: 1, columnSpan: 2 },
			settings: 'Corsair live widget',
			settingsVersion: { major: 1, minor: 0, patch: 0 },
		};
		const created = await step('dashboard.widgets.create', {
			team,
			dashboardId,
			...widget,
		});
		const widgetId = pick(created, 'id') as string;
		const fresh = async () =>
			clean(
				await raw('dashboard.widgets.getWidget', {
					team,
					dashboardId,
					widgetId,
				}).catch(() => undefined),
			) as Record<string, unknown> | undefined;
		const board = async () =>
			clean(
				await raw('dashboard.dashboards.get', { team, dashboardId }).catch(
					() => undefined,
				),
			) as Record<string, unknown> | undefined;
		if (widgetId) {
			P.widgetId = widgetId;
			await step('dashboard.widgets.updateWidget', {
				...(await fresh()),
				team,
				dashboardId,
				widgetId,
				settings: 'Corsair live widget (edited)',
			});
			await step('dashboard.widgets.replaceWidget', {
				...(await fresh()),
				team,
				dashboardId,
				widgetId,
				settings: 'Corsair live widget (replaced)',
			});
			const current = await board();
			await step('dashboard.widgets.updateWidgets', {
				team,
				dashboardId,
				eTag: pick(current, 'eTag'),
				body: [{ ...(await fresh()), settings: 'Corsair live widgets' }],
			});
			const again = await board();
			await step('dashboard.widgets.replaceWidgets', {
				team,
				dashboardId,
				eTag: pick(again, 'eTag'),
				body: pick(again, 'widgets') ?? [],
			});
			later('dashboard.widgets.delete', { team, dashboardId, widgetId });
		}
		const latest = await board();
		if (latest)
			await step('dashboard.dashboards.replaceDashboard', {
				...latest,
				team,
				dashboardId,
				description: 'Corsair live dashboard (edited)',
			});
		// The run team's list, put back as it was read.
		const list = clean(
			await raw('dashboard.dashboards.list', { team }).catch(() => undefined),
		);
		await step('dashboard.dashboards.replaceDashboards', {
			team,
			dashboardEntries: pick(list, 'dashboardEntries') ?? pick(list, 'value'),
		});
		if (!pick(spare, 'id')) return;
	});

	it("works the run team's boards and a delivery plan", async () => {
		const team = P.ctTeam as string | undefined;
		if (!team) return;
		P['work:team'] = team;
		// Settings written back with the values just read (the team is the run's own).
		const same = async (read: string, write: string, input = {}) => {
			const current = clean(
				await raw(read, { team, ...input }).catch(() => undefined),
			) as Record<string, unknown> | undefined;
			if (current) await step(write, { ...current, team, ...input });
			return current;
		};
		// A team made through the API has no backlog iteration or area yet: every
		// board route answers TF400497 until it does. The project's own are used.
		const defaults = await raw('work.teamsettings.get', { team: P.team }).catch(
			() => undefined,
		);
		await step('work.teamsettings.update', {
			team,
			backlogIteration: pick(defaults, 'backlogIteration', 'id'),
			defaultIterationMacro: '@currentIteration',
			bugsBehavior: 'off',
		});
		await step('work.teamfieldvalues.update', {
			team,
			defaultValue: project,
			values: [{ value: project, includeChildren: false }],
		});
		const boards = await raw('work.boards.list', { team }).catch(
			() => undefined,
		);
		const board = first(boards, 'name') as string | undefined;
		if (board) {
			P['work:board'] = board;
			await same(
				'work.boardusersettings.get',
				'work.boardusersettings.update',
				{
					board,
				},
			);
			await same(
				'work.cardrulesettings.get',
				'work.cardrulesettings.updateBoardCardRuleSettings',
				{
					board,
				},
			);
			await same(
				'work.cardsettings.get',
				'work.cardsettings.updateBoardCardSettings',
				{
					board,
				},
			);
			const columns = await raw('work.columns.list', { team, board }).catch(
				() => undefined,
			);
			await step('work.columns.update', {
				team,
				board,
				body: clean(pick(columns, 'value')) ?? [],
			});
			const rows = await raw('work.rows.list', { team, board }).catch(
				() => undefined,
			);
			await step('work.rows.update', {
				team,
				board,
				body: clean(pick(rows, 'value')) ?? [],
			});
			const charts = await raw('work.charts.list', { team, board }).catch(
				() => undefined,
			);
			const chart = first(charts, 'name') as string | undefined;
			if (chart) {
				P['work:name'] = chart;
				const current = await raw('work.charts.get', {
					team,
					board,
					name: chart,
				}).catch(() => undefined);
				// Writing a chart's own settings back answers TF400898 on every run.
				await step(
					'work.charts.update',
					{
						team,
						board,
						name: chart,
						settings: clean(pick(current, 'settings')) ?? {},
					},
					{ expected: /^Azure DevOps 400: TF400898/ },
				);
			}
		}
		const taskboard = await raw('work.taskboardColumns.get', { team }).catch(
			() => undefined,
		);
		await step(
			'work.taskboardColumns.update',
			{ team, body: clean(pick(taskboard, 'columns')) ?? [] },
			{ probe: true },
		);
		const taskboardRules = clean(
			await raw('work.cardrulesettings.get', {
				team,
				board: board ?? 'ct-none',
			}).catch(() => undefined),
		) as Record<string, unknown> | undefined;
		await step(
			'work.cardrulesettings.updateTaskboardCardRuleSettings',
			{ team, ...taskboardRules },
			{ probe: true },
		);
		const taskboardCards = clean(
			await raw('work.cardsettings.get', {
				team,
				board: board ?? 'ct-none',
			}).catch(() => undefined),
		) as Record<string, unknown> | undefined;
		await step(
			'work.cardsettings.updateTaskboardCardSettings',
			{ team, ...taskboardCards },
			{ probe: true },
		);
		// The project's first iteration, added to the run team and taken off again.
		const sprints = await raw('wit.classificationNodes.get', {
			structureGroup: 'iterations',
			$depth: 1,
		}).catch(() => undefined);
		const sprint = pick(sprints, 'children', 0, 'identifier') as
			| string
			| undefined;
		if (sprint) {
			const added = await step('work.iterations.postTeamIteration', {
				team,
				id: sprint,
			});
			if (pick(added, 'id')) {
				P['work:iterationId'] = sprint;
				later('work.iterations.delete', { team, id: sprint });
				// The team's new iteration takes a moment to count as selected.
				await waitFor(
					() => raw('work.teamdaysoff.get', { team, iterationId: sprint }),
					(v) => v !== undefined,
					60_000,
				);
				await step('work.teamdaysoff.update', {
					team,
					iterationId: sprint,
					daysOff: [],
				});
				await probe('work.capacities.update', {
					team,
					iterationId: sprint,
					teamMemberId: P.userId,
					activities: [],
					daysOff: [],
				});
				// A work item that isn't there answers TF237111 (no permission to save it).
				await step(
					'work.taskboardWorkItems.update',
					{
						team,
						iterationId: sprint,
						workItemId: MISSING_INT,
						newColumn: 'ct-none',
					},
					{ expected: /TF237111|is not a valid team iteration/ },
				);
			}
		}
		// A favorite the run team owns.
		const owned = await step(
			'favorite.favorites.createFavoriteOfOwner',
			{
				ownerScopeType: 'Team',
				ownerScopeId: P.ctTeamId,
				artifactType: 'Microsoft.TeamFoundation.Git.Repository',
				artifactId: P.repositoryId ?? ZERO_GUID,
				artifactName: `${NAME}-repo`,
				artifactScope: { type: 'Project', id: P.projectId },
			},
			{ probe: true },
		);
		if (pick(owned, 'id'))
			later('favorite.favorites.deleteFavoriteOfOwnerById', {
				favoriteId: pick(owned, 'id'),
				ownerScopeType: 'Team',
				ownerScopeId: P.ctTeamId,
				artifactType: 'Microsoft.TeamFoundation.Git.Repository',
				artifactScopeType: 'Project',
				artifactScopeId: P.projectId,
			});
		await probe('work.workitemsorder.reorderBacklogWorkItems', {
			team,
			ids: [MISSING_INT],
			previousId: 0,
			nextId: 0,
		});
		const plan = await step('work.plans.create', {
			name: `${NAME}-plan`,
			type: 'deliveryTimelineView',
			description: 'Corsair live delivery plan',
			properties: {
				teamBacklogMappings: [
					{
						teamId: P.ctTeamId,
						categoryReferenceName: 'Microsoft.RequirementCategory',
					},
				],
			},
		});
		const planId = pick(plan, 'id') as string | undefined;
		if (planId) {
			P['work.plans:id'] = planId;
			P['work.deliverytimeline:id'] = planId;
			later('work.plans.delete', { id: planId });
			// The full properties go back: an update without them answers "Value cannot be null. CardSettings".
			const saved = await raw('work.plans.get', { id: planId }).catch(
				() => undefined,
			);
			await step('work.plans.update', {
				id: planId,
				name: `${NAME}-plan`,
				type: 'deliveryTimelineView',
				revision: pick(saved, 'revision') ?? pick(plan, 'revision'),
				description: 'Corsair live delivery plan (edited)',
				properties: clean(pick(saved, 'properties')),
			});
		}
	});

	it('works a classic release with an agentless stage', async () => {
		const stage = {
			name: 'ct-stage',
			rank: 1,
			retentionPolicy: { daysToKeep: 1, releasesToKeep: 1, retainBuild: false },
			preDeployApprovals: {
				approvals: [{ rank: 1, isAutomated: true, isNotificationOn: false }],
			},
			postDeployApprovals: {
				approvals: [{ rank: 1, isAutomated: true, isNotificationOn: false }],
			},
			deployPhases: [
				{
					name: 'Agentless job',
					rank: 1,
					phaseType: 'runOnServer',
					deploymentInput: {
						parallelExecution: { parallelExecutionType: 'none' },
					},
					workflowTasks: [],
				},
			],
			conditions: [],
		};
		const definition = await step(
			'release.definitions.create',
			{
				name: `${NAME}-release`,
				path: '\\',
				description: 'Corsair live release',
				environments: [stage],
			},
			{ expected: CLASSIC_OFF },
		);
		await step('release.folders.create', {
			path: `\\${NAME}`,
			description: 'Corsair live folder',
		});
		// A rename: the route names the folder, the body its new path.
		await step('release.folders.update', {
			path: `\\${NAME}`,
			bodyPath: `\\${NAME}-moved`,
			description: 'Corsair live folder (edited)',
		});
		P['release:path'] = `\\${NAME}-moved`;
		later('release.folders.delete', { path: `\\${NAME}-moved` });
		const definitionId = pick(definition, 'id') as number;
		if (!definitionId) {
			// Classic pipelines are off: the release writes answer for a
			// definition that isn't there.
			await step(
				'release.definitions.update',
				{
					id: MISSING_INT,
					name: `${NAME}-release`,
					revision: 1,
					environments: [stage],
				},
				{ expected: CLASSIC_OFF, probe: true },
			);
			await step(
				'release.releases.create',
				{ definitionId: MISSING_INT, description: 'Corsair live release' },
				{ expected: CLASSIC_OFF, probe: true },
			);
			return;
		}
		P['release:definitionId'] = definitionId;
		P['release:definitionIdFilter'] = definitionId;
		later('release.definitions.delete', { definitionId, forceDelete: true });
		await step('release.definitions.update', {
			...(definition as Record<string, unknown>),
			description: 'Corsair live release (edited)',
		});
		const release = await step('release.releases.create', {
			definitionId,
			description: 'Corsair live release',
		});
		const releaseId = pick(release, 'id') as number;
		if (releaseId) {
			P['release:releaseId'] = releaseId;
			P.releaseId = releaseId;
			const environmentId = pick(release, 'environments', 0, 'id');
			P['release:environmentId'] = environmentId;
			P.releaseEnvId = environmentId;
			P['release:definitionEnvironmentId'] = pick(
				release,
				'environments',
				0,
				'definitionEnvironmentId',
			);
			await step('release.releases.updateReleaseResource', {
				releaseId,
				comment: 'Corsair live',
				keepForever: false,
			});
			const full = (await raw('release.releases.getRelease', {
				releaseId,
			}).catch(() => undefined)) as Record<string, unknown> | undefined;
			if (full)
				await step('release.releases.updateRelease', {
					...full,
					releaseId,
					description: 'Corsair live release (edited)',
				});
			await step('release.releases.updateReleaseEnvironment', {
				releaseId,
				environmentId,
				status: 'inProgress',
				comment: 'Corsair live deploy',
			});
			const deployed = await waitFor(
				() => raw('release.releases.getRelease', { releaseId }),
				(v) =>
					['succeeded', 'rejected', 'canceled', 'partiallySucceeded'].includes(
						String(pick(v, 'environments', 0, 'status')),
					),
				180_000,
			);
			P['release:attemptId'] = 1;
			P['release:releaseDeployPhaseId'] = pick(
				deployed,
				'environments',
				0,
				'deploySteps',
				0,
				'releaseDeployPhases',
				0,
				'id',
			);
			P['release:approvalId'] = pick(
				deployed,
				'environments',
				0,
				'preDeployApprovals',
				0,
				'id',
			);
		}
		await probe('release.approvals.update', {
			approvalId: MISSING_INT,
			status: 'approved',
			comments: 'ct',
		});
		await probe('release.gates.update', {
			gateStepId: MISSING_INT,
			comment: 'ct',
		});
		await probe('release.manualInterventions.update', {
			releaseId: releaseId ?? MISSING_INT,
			manualInterventionId: MISSING_INT,
			status: 'approved',
			comment: 'ct',
		});
	});

	it('works test plans, runs and results', async () => {
		const testCase = await step('wit.workItems.create', {
			type: 'Test Case',
			body: [
				{ op: 'add', path: '/fields/System.Title', value: `${NAME} test case` },
			],
		});
		const testCaseId = pick(testCase, 'id') as number;
		if (testCaseId) {
			P.testCaseId = testCaseId;
			P.testCaseIds = String(testCaseId);
			P.testIds = String(testCaseId);
		}
		const plan = await step(
			'testPlan.testPlans.create',
			{ name: `${NAME}-plan`, areaPath: project, iteration: project },
			{ expected: NO_TEST_PLANS },
		);
		const planId = pick(plan, 'id') as number;
		const rootSuite = pick(plan, 'rootSuite', 'id') as number;
		if (planId) {
			P.planId = planId;
			P['test:planId'] = planId;
			P['testPlan:planId'] = planId;
			later('testPlan.testPlans.delete', { planId });
			await step('testPlan.testPlans.update', {
				planId,
				description: 'Corsair live plan (edited)',
				revision: pick(plan, 'revision'),
			});
			const suite = await step('testPlan.testSuites.create', {
				planId,
				name: `${NAME}-suite`,
				suiteType: 'staticTestSuite',
				parentSuite: { id: rootSuite },
			});
			const suiteId = pick(suite, 'id') as number;
			P.suiteId = suiteId;
			if (suiteId) {
				later('testPlan.testSuites.delete', { planId, suiteId });
				await step('testPlan.testSuites.update', {
					planId,
					suiteId,
					name: `${NAME}-suite-edited`,
					revision: pick(suite, 'revision'),
					parentSuite: { id: rootSuite },
				});
				if (testCaseId) {
					await step('testPlan.suiteTestCase.add', {
						planId,
						suiteId,
						body: [{ workItem: { id: testCaseId } }],
					});
					await step(
						'testPlan.suiteTestCase.update',
						{
							planId,
							suiteId,
							body: [{ workItem: { id: testCaseId }, pointAssignments: [] }],
						},
						{ probe: true },
					);
					const points = await raw('testPlan.testPoint.getPointsList', {
						planId,
						suiteId,
					}).catch(() => undefined);
					const pointId = pick(points, 'value', 0, 'id');
					P.pointId = pointId;
					P.pointIds = String(pointId ?? MISSING_INT);
					await step('testPlan.testPoint.update', {
						planId,
						suiteId,
						body: [{ id: pointId, results: { outcome: 'passed' } }],
					});
					await step('test.points.update', {
						planId,
						suiteId,
						pointIds: String(pointId),
						resetToActive: true,
					});
					await step('test.points.getPointsByQuery', {
						pointsFilter: { testcaseIds: [testCaseId] },
					});
					await step('testPlan.testSuiteEntry.reorderSuiteEntries', {
						suiteId,
						body: [
							{ id: testCaseId, sequenceNumber: 0, suiteEntryType: 'testCase' },
						],
					});
					// The older test API on the same suite.
					await step(
						'test.testSuites.update',
						{
							planId,
							suiteId,
							testCaseIds: String(testCaseId),
							configurations: [],
						},
						{ probe: true },
					);
					await step('testPlan.suiteTestCase.removeTestCasesListFromSuite', {
						planId,
						suiteId,
						testIds: String(testCaseId),
					});
					await step('test.testSuites.add', {
						planId,
						suiteId,
						testCaseIds: String(testCaseId),
					});
					await step('test.testSuites.removeTestCasesFromSuiteUrl', {
						planId,
						suiteId,
						testCaseIds: String(testCaseId),
					});
				}
			}
			const cloned = await step('testPlan.testPlanClone.cloneTestPlan', {
				sourceTestPlan: { id: planId, suiteIds: [rootSuite] },
				destinationTestPlan: { name: `${NAME}-plan-clone`, project },
				cloneOptions: { copyAllSuites: false },
			});
			const clonePlan = pick(cloned, 'destinationTestPlan', 'id');
			if (clonePlan) later('testPlan.testPlans.delete', { planId: clonePlan });
			P['testPlan:cloneOperationId'] = pick(
				cloned,
				'cloneOperationResponse',
				'opId',
			);
			if (suiteId) {
				const suiteClone = await step(
					'testPlan.testSuiteClone.cloneTestSuite',
					{
						sourceTestSuite: { id: suiteId, projectName: project },
						destinationTestSuite: { id: rootSuite, projectName: project },
						cloneOptions: { copyAllSuites: false },
					},
				);
				P['testPlan.testSuiteClone:cloneOperationId'] = pick(
					suiteClone,
					'cloneOperationResponse',
					'opId',
				);
				if (testCaseId) {
					const caseClone = await step(
						'testPlan.testCaseClone.cloneTestCase',
						{
							sourceTestPlan: { id: planId, name: `${NAME}-plan` },
							sourceTestSuite: { id: suiteId },
							destinationTestPlan: { id: planId, name: `${NAME}-plan` },
							destinationTestSuite: { id: rootSuite },
							testCaseIds: [testCaseId],
							cloneOptions: { copyAllSuites: false },
						},
						{ probe: true },
					);
					P['testPlan.testCaseClone:cloneOperationId'] = pick(
						caseClone,
						'cloneOperationResponse',
						'opId',
					);
				}
			}
		}
		const configuration = await step('testPlan.configurations.create', {
			name: `${NAME}-config`,
			description: 'Corsair live configuration',
			values: [],
		});
		const configurationId = pick(configuration, 'id');
		if (configurationId) {
			P['testPlan:testConfigurationId'] = configurationId;
			P.testConfiguartionId = configurationId;
			later('testPlan.configurations.delete', {
				testConfiguartionId: configurationId,
			});
			await step('testPlan.configurations.update', {
				testConfiguartionId: configurationId,
				name: `${NAME}-config`,
				description: 'Corsair live configuration (edited)',
			});
		}
		const variable = await step('testPlan.variables.create', {
			name: `${NAME}-var`,
			description: 'Corsair live variable',
			values: ['one', 'two'],
		});
		const testVariableId = pick(variable, 'id');
		if (testVariableId) {
			P.testVariableId = testVariableId;
			later('testPlan.variables.delete', { testVariableId });
			await step('testPlan.variables.update', {
				testVariableId,
				name: `${NAME}-var`,
				values: ['one', 'two', 'three'],
			});
		}

		for (const area of ['test', 'testResults'] as const) {
			const run = await step(`${area}.runs.create`, {
				name: `${NAME}-${area}-run`,
				automated: true,
				state: 'InProgress',
				...(P.buildId ? { build: { id: String(P.buildId) } } : {}),
			});
			const runId = pick(run, 'id') as number;
			if (!runId) continue;
			P[`${area}:runId`] = runId;
			later(`${area}.runs.delete`, { runId });
			const results = await step(`${area}.results.add`, {
				runId,
				body: [
					{
						testCaseTitle: `${NAME} case`,
						automatedTestName: `Corsair.Live.${area}`,
						automatedTestStorage: 'corsair.dll',
						outcome: 'Passed',
						state: 'Completed',
					},
				],
			});
			const resultId =
				pick(results, 'value', 0, 'id') ?? pick(results, 0, 'id');
			P[`${area}:testCaseResultId`] = resultId;
			P[`${area}:resultId`] = resultId;
			P[`${area}:testResultId`] = resultId;
			P[`${area}:testCaseReferenceId`] = pick(
				results,
				'value',
				0,
				'testCaseReferenceId',
			);
			await step(`${area}.results.update`, {
				runId,
				body: [{ id: resultId, comment: 'Corsair live result (edited)' }],
			});
			const runAttachment = await step(
				`${area}.attachments.createTestRunAttachment`,
				{
					runId,
					stream: TEXT_FILE.base64,
					fileName: 'ct-run.txt',
					attachmentType: 'GeneralAttachment',
					comment: 'Corsair live',
				},
			);
			P[`${area}:attachmentId`] = pick(runAttachment, 'id');
			const resultAttachment = await step(
				`${area}.attachments.createTestResultAttachment`,
				{
					runId,
					testCaseResultId: resultId,
					stream: TEXT_FILE.base64,
					fileName: 'ct-result.txt',
					attachmentType: 'GeneralAttachment',
				},
			);
			await step(`${area}.runs.update`, {
				runId,
				state: 'Completed',
				comment: 'Corsair live run (edited)',
			});
			if (area === 'testResults') {
				later('testResults.attachments.deleteTestRunAttachment', {
					runId,
					attachmentId: pick(runAttachment, 'id'),
				});
				later('testResults.attachments.deleteTestResultAttachment', {
					runId,
					testCaseResultId: resultId,
					attachmentId: pick(resultAttachment, 'id'),
				});
				await step(
					'testResults.tags.update',
					{
						runId,
						tags: [{ operation: 'add', tag: { name: 'ct' } }],
					},
					{ probe: true },
				);
				await step(
					'testResults.testattachments.createTestRunLogStoreAttachment',
					{
						runId,
						stream: TEXT_FILE.base64,
						fileName: 'ct-log.txt',
						attachmentType: 'GeneralAttachment',
					},
					{ probe: true },
				);
				later('testResults.testattachments.delete', {
					runId,
					filename: 'ct-log.txt',
				});
				await probe('testResults.resultDocument.publishTestResultDocument', {
					runId,
					payload: { name: 'ct', stream: TEXT_FILE.base64 },
				});
				await probe(
					'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForRun',
					{
						runId,
						testLogStoreOperationType: 'read',
					},
				);
				await probe(
					'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForResult',
					{
						runId,
						resultId,
						subResultId: 0,
						filePath: 'ct.txt',
						type: 'generalAttachment',
					},
				);
				if (pick(results, 'value', 0, 'testCaseReferenceId'))
					await step(
						'testResults.resultMetaData.update',
						{
							testCaseReferenceId: pick(
								results,
								'value',
								0,
								'testCaseReferenceId',
							),
							flakyIdentifiers: [],
						},
						{ probe: true },
					);
			}
		}
		const failure = await step('testResults.testfailuretype.create', {
			name: `${NAME}-failure`,
		});
		if (pick(failure, 'id'))
			later('testResults.testfailuretype.delete', {
				failureTypeId: pick(failure, 'id'),
			});
		// Test settings can't be deleted once made ("in use", even a new one):
		// only the delete is called, for one that isn't there.
		await probe('testResults.testsettings.delete', {
			testSettingsId: MISSING_INT,
		});
		if (P.workItemId) {
			await step(
				'testResults.workitems.add',
				{
					testName: `Corsair.Live.${NAME}`,
					workItem: { id: String(P.workItemId) },
				},
				{ probe: true },
			);
			later('testResults.workitems.delete', {
				testName: `Corsair.Live.${NAME}`,
				workItemId: P.workItemId,
			});
		}
		if (P.buildId) {
			await probe('testResults.codecoverage.update', {
				buildId: P.buildId,
				coverageStats: [],
			});
			await probe(
				'testResults.testattachments.createBuildAttachmentInLogStore',
				{
					buildId: P.buildId,
					stream: TEXT_FILE.base64,
					fileName: 'ct-build.txt',
					attachmentType: 'GeneralAttachment',
				},
			);
			await probe(
				'testResults.testlogstoreendpoint.testLogStoreEndpointDetailsForBuild',
				{
					buildId: P.buildId,
					testLogStoreOperationType: 'read',
				},
			);
		}
		// Read queries sent as POST.
		await step(
			'test.testHistory.query',
			{
				automatedTestName: 'Corsair.Live.test',
				groupBy: 'branch',
				maxCompleteDate: new Date().toISOString(),
			},
			{ probe: true },
		);
		await step(
			'testResults.testHistory.query',
			{
				automatedTestName: 'Corsair.Live.testResults',
				groupBy: 'branch',
				maxCompleteDate: new Date().toISOString(),
			},
			{ probe: true },
		);
		await probe('testResults.history.query', {
			automatedTestName: 'Corsair.Live.testResults',
			groupBy: 'branch',
		});
		await step(
			'testResults.results.getTestResultsByQuery',
			{
				results: [],
				fields: ['outcome'],
				resultsFilter: { automatedTestName: 'Corsair.Live.testResults' },
			},
			{ probe: true },
		);
		await step(
			'testResults.results.getTestResultsByQueryWiql',
			{
				query: `SELECT * FROM TestResult WHERE TestRunId = ${P['testResults:runId'] ?? MISSING_INT}`,
			},
			{ probe: true },
		);
		await probe('testResults.resultMetaData.query', { body: [] });
		await step(
			'testResults.resultTrendByBuild.query',
			{ trendDays: 7 },
			{ probe: true },
		);
		await step(
			'testResults.resultTrendByRelease.query',
			{ trendDays: 7 },
			{ probe: true },
		);
		await probe(
			'testResults.resultsummarybyrelease.queryTestResultsSummaryForReleases',
			{
				body: [
					{
						releaseId: P.releaseId ?? MISSING_INT,
						releaseEnvId: P.releaseEnvId ?? MISSING_INT,
					},
				],
			},
		);
		await probe('testResults.resultsummarybyrequirement.query', {
			workItemIds: String(P.workItemId ?? MISSING_INT),
		});
		await probe('testResults.filecoverage.get', {
			filePath: 'README.md',
			pullRequestId: P.pullRequestId ?? MISSING_INT,
			pullRequestIterationId: 1,
			pullRequestBaseIterationId: 0,
			repoId: P.repositoryId ?? ZERO_GUID,
		});
		// Exploratory sessions have no delete: only the update is called, for one that isn't there.
		await probe('test.session.update', {
			team: P.team,
			id: MISSING_INT,
			state: 'completed',
		});
		// Project settings written back with the values just read.
		const retention = (await raw('test.resultRetentionSettings.get', {}).catch(
			() => undefined,
		)) as Record<string, unknown> | undefined;
		if (retention)
			await step('test.resultRetentionSettings.update', {
				automatedResultsRetentionDuration:
					retention.automatedResultsRetentionDuration,
				manualResultsRetentionDuration:
					retention.manualResultsRetentionDuration,
			});
		const resultSettings = (await raw('testResults.settings.get', {
			settingsType: 'all',
		}).catch(() => undefined)) as Record<string, unknown> | undefined;
		if (resultSettings)
			await step(
				'testResults.settings.update',
				{
					flakySettings: clean(resultSettings.flakySettings),
					newTestResultLoggingSettings: clean(
						resultSettings.newTestResultLoggingSettings,
					),
				},
				{ probe: true },
			);
		if (testCaseId) {
			// Each API deletes a test case work item for good; the older one gets a second case.
			const other = await step('wit.workItems.create', {
				type: 'Test Case',
				body: [
					{
						op: 'add',
						path: '/fields/System.Title',
						value: `${NAME} old test case`,
					},
				],
			});
			later('testPlan.testCases.delete', { testCaseId });
			if (pick(other, 'id'))
				later('test.testCases.delete', { testCaseId: pick(other, 'id') });
		}
	});

	it('works favorites, symbols and organization read queries', async () => {
		if (P.repositoryId) {
			const favorite = await step('favorite.favorites.createFavorite', {
				artifactType: 'Microsoft.TeamFoundation.Git.Repository',
				artifactId: P.repositoryId,
				artifactName: `${NAME}-repo`,
				artifactScope: { type: 'Project', id: P.projectId },
			});
			const favoriteId = pick(favorite, 'id');
			if (favoriteId) {
				P['favorite:favoriteId'] = favoriteId;
				P.artifactType = 'Microsoft.TeamFoundation.Git.Repository';
				P.artifactScopeType = 'Project';
				P.artifactScopeId = P.projectId;
				later('favorite.favorites.deleteFavoriteById', {
					favoriteId,
					artifactType: 'Microsoft.TeamFoundation.Git.Repository',
					artifactScopeType: 'Project',
					artifactScopeId: P.projectId,
				});
			}
		}
		const symbols = await step('symbol.requests.createRequests', {
			name: `${NAME}-symbols`,
			description: 'Corsair live symbol request',
		});
		const requestId = pick(symbols, 'id') as string;
		if (requestId) {
			P['symbol:requestId'] = requestId;
			P.requestName = `${NAME}-symbols`;
			later('symbol.requests.deleteRequestsRequestId', {
				requestId,
				synchronous: true,
			});
			await step('symbol.requests.updateRequestsRequestId', {
				requestId,
				description: 'Corsair live symbol request (edited)',
			});
			await step('symbol.requests.updateRequestsRequestName', {
				requestName: `${NAME}-symbols`,
				description: 'Corsair live symbol request (edited twice)',
			});
			await step(
				'symbol.requests.createRequestsRequestIdDebugEntries',
				{
					requestId,
					collection: 'debugentries',
					createBehavior: 'throwIfExists',
					debugEntries: [],
				},
				{ probe: true },
			);
		}
		const second = await step('symbol.requests.createRequests', {
			name: `${NAME}-symbols-2`,
		});
		if (pick(second, 'id'))
			later('symbol.requests.deleteRequestsRequestName', {
				requestName: `${NAME}-symbols-2`,
				synchronous: true,
			});
		await step('security.permissions.hasPermissionsBatch', {
			alwaysAllowAdministrators: false,
			evaluations: [
				{
					securityNamespaceId: '2e9eb7ed-3c0a-47d4-87c1-0ffdd275fd87',
					token: `repoV2/${P.projectId}`,
					permissions: 2,
				},
			],
		});
		await step('graph.subjectLookup.lookupSubjects', {
			lookupKeys: [{ descriptor: P.subjectDescriptor }],
		});
		await step('graph.subjectQuery.query', {
			query: 'ct-nobody',
			subjectKind: ['User'],
		});
		await step('hooks.publishers.queryPublishers', {});
		await probe('hooks.publishers.queryInputValues', {
			publisherId: 'tfs',
			inputValues: [{ inputId: 'projectId' }],
		});
		await step('hooks.subscriptions.createSubscriptionsQuery', {
			publisherId: 'tfs',
		});
		await step(
			'notification.subscriptions.query',
			{
				conditions: [{ subscriptionType: 'default' }],
			},
			{ probe: true },
		);
		await probe('tfvc.changesets.getBatchedChangesets', { changesetIds: [1] });
		await probe('tfvc.items.getItemsBatch', {
			itemDescriptors: [{ path: '$/' }],
		});
	});

	/** The input for an operation from the ids the run has. */
	function valueFor(id: string, name: string): unknown {
		const [area, resource] = id.split('.');
		for (const scoped of [
			`${id}:${name}`,
			`${area}.${resource}:${name}`,
			`${area}:${name}`,
			name,
		]) {
			if (P[scoped] !== undefined && P[scoped] !== null) return P[scoped];
		}
		return undefined;
	}
	function inputFor(id: string): Record<string, unknown> {
		const operation = azuredevopsOperations.find((o) => o.id === id);
		const props = (operation?.input.properties ?? {}) as Record<
			string,
			{ type?: string; 'x-corsair-in'?: string; enum?: unknown[] }
		>;
		const required = (operation?.input.required as string[] | undefined) ?? [];
		const input: Record<string, unknown> = {};
		for (const [name, schema] of Object.entries(props)) {
			const where = schema['x-corsair-in'];
			if (!required.includes(name) && where !== 'path') continue;
			const known = valueFor(id, name);
			if (known !== undefined) {
				input[name] = known;
				continue;
			}
			if (where === 'rawBody') {
				input[name] = name === 'file' ? TEXT_FILE : [];
			} else if (schema.enum?.length) {
				input[name] = schema.enum[0];
			} else if (schema.type === 'integer' || schema.type === 'number') {
				input[name] = MISSING_INT;
			} else if (schema.type === 'boolean') {
				input[name] = false;
			} else if (/id$/i.test(name)) {
				input[name] = ZERO_GUID;
			} else {
				input[name] = 'ct-none';
			}
		}
		return input;
	}

	/**
	 * Reads that answer a placeholder id without saying "not found" (seen on
	 * every run): an internal error, or a bare 404 from a download-style route.
	 */
	const KNOWN_ANSWERS: Record<string, RegExp> = {
		// Even with the definition, owner and run of a lease the run created.
		'build.leases.getRetentionLeasesByMinimalRetentionLeases':
			/^Azure DevOps 500: TF400898: An Internal Error Occurred/,
		'symbol.contents.get':
			/^Azure DevOps 500: TF400898: An Internal Error Occurred/,
		'symbol.symsrv.get': /^Azure DevOps 404: Not Found$/,
		'processadmin.processes.importProcessTemplateStatus':
			/^Azure DevOps 404: Not Found$/,
	};

	/** An id-shaped path value: a placeholder there can only answer "not found". */
	const ID_NAME = /(id|ids|descriptor|identifier)$/i;

	it('calls every read the plugin has', async () => {
		// Inputs whose type differs from the same name elsewhere.
		P['test.testSuites.get:testCaseIds'] = P.testCaseId ?? MISSING_INT;
		P['testPlan.suiteTestCase:testCaseId'] = String(
			P.testCaseId ?? MISSING_INT,
		);
		P['distributedTask.kubernetes:resourceId'] = MISSING_INT;
		P['audit:format'] = 'json';
		P.servicePrincipalDescriptor = `aadsp.${Buffer.from(ZERO_GUID).toString('base64url')}`;
		for (const operation of azuredevopsOperations) {
			if (called.has(operation.id)) continue;
			const risk =
				azuredevopsEndpointMeta[
					operation.id as keyof typeof azuredevopsEndpointMeta
				]?.riskLevel;
			if (operation.method !== 'GET' && risk !== 'read') continue;
			if (SKIPPED.some(([pattern]) => pattern.test(operation.id))) continue;
			const known = KNOWN_ANSWERS[operation.id];
			if (known)
				await step(operation.id, inputFor(operation.id), { expected: known });
			else await probe(operation.id, inputFor(operation.id));
		}
	});

	it('sends each remaining write with ids that are not there', async () => {
		// Writes whose id rides in the query or the body.
		await probe('serviceEndpoint.endpointproxy.executeServiceEndpointRequest', {
			endpointId: ZERO_GUID,
			dataSourceDetails: { dataSourceName: 'ct', requestVerb: 'GET' },
		});
		await step(
			'symbol.requests.createRequestsRequestNameDebugEntries',
			{
				requestName: `${NAME}-not-there`,
				collection: 'debugentries',
				debugEntries: [],
			},
			{ probe: true, expected: /^Azure DevOps 500: TF400898/ },
		);
		if (!called.has('testPlan.testPlanClone.cloneTestPlan')) {
			await probe('testPlan.testPlanClone.cloneTestPlan', {
				sourceTestPlan: { id: MISSING_INT },
				destinationTestPlan: { name: `${NAME}-clone`, project },
			});
			await probe('testPlan.testSuiteClone.cloneTestSuite', {
				sourceTestSuite: { id: MISSING_INT, projectName: project },
				destinationTestSuite: { id: MISSING_INT, projectName: project },
			});
			await probe('testPlan.testCaseClone.cloneTestCase', {
				sourceTestPlan: { id: MISSING_INT },
				sourceTestSuite: { id: MISSING_INT },
				destinationTestPlan: { id: MISSING_INT },
				destinationTestSuite: { id: MISSING_INT },
				testCaseIds: [MISSING_INT],
			});
		}
		// Writes the run had no record for (classic pipelines are off, Test
		// Plans needs its licence, packages need a client upload): each goes to
		// an id that doesn't exist, so it can only answer "not found". Only
		// routes with an id in the path qualify, so nothing gets created.
		for (const operation of azuredevopsOperations) {
			if (called.has(operation.id) || operation.method === 'GET') continue;
			// The last test restores a real repository and definition with these.
			if (
				/restoreRepositoryFromRecycleBin|restoreDefinition/.test(operation.id)
			)
				continue;
			if (SKIPPED.some(([pattern]) => pattern.test(operation.id))) continue;
			const props = (operation.input.properties ?? {}) as Record<
				string,
				{ type?: string; 'x-corsair-in'?: string }
			>;
			const ids = Object.entries(props).filter(
				([name, schema]) =>
					schema['x-corsair-in'] === 'path' &&
					name !== 'project' &&
					ID_NAME.test(name),
			);
			if (ids.length === 0) continue;
			const input = inputFor(operation.id);
			for (const [name, schema] of ids) {
				input[name] =
					schema.type === 'integer' || schema.type === 'number'
						? MISSING_INT
						: ZERO_GUID;
			}
			await probe(operation.id, input);
		}
	});

	it('deletes what it created', async () => {
		while (teardown.length > 0) {
			const item = teardown.pop() as (typeof teardown)[number];
			if (item.id === 'build.builds.delete') {
				// Every run gets retention leases (the branch's and the pipeline's
				// own); a build with a lease can't be deleted.
				const leases = await raw('build.builds.getRetentionLeasesForBuild', {
					buildId: item.input.buildId,
				}).catch(() => undefined);
				const ids = (
					(pick(leases, 'value') as Array<{ leaseId?: number }> | undefined) ??
					[]
				)
					.map((lease) => lease.leaseId)
					.filter((leaseId) => leaseId !== undefined);
				if (ids.length > 0)
					await step('build.leases.delete', { ids: ids.join(',') });
			}
			await step(item.id, item.input, {
				expected: item.expected ?? /Azure DevOps 404/,
			});
			if (item.id === 'git.repositories.delete') {
				// One restore from the recycle bin before the purge.
				if (!called.has('git.repositories.restoreRepositoryFromRecycleBin')) {
					await step('git.repositories.restoreRepositoryFromRecycleBin', {
						repositoryId: item.input.repositoryId,
						deleted: false,
					});
					// The restore takes a moment to show.
					await waitFor(
						() =>
							raw('git.repositories.getRepository', {
								repositoryId: item.input.repositoryId,
							}),
						(v) => pick(v, 'id') !== undefined,
						60_000,
					);
					await step('git.repositories.delete', item.input);
				}
			}
			if (
				item.id === 'build.definitions.delete' &&
				!called.has('build.definitions.restoreDefinition')
			) {
				await step('build.definitions.restoreDefinition', {
					definitionId: item.input.definitionId,
					deleted: false,
				});
				await step('build.definitions.delete', item.input);
			}
		}
		await step('build.tags.deleteTag', { tag: 'ct-build3' }, { probe: true });
		// A pull request label's tag outlives its pull request, and deleting it
		// by name answers 204 without deleting it: by id it goes.
		// The pull request teardown can bring it back for a few seconds: delete,
		// wait, look again.
		for (let attempt = 0; attempt < 3; attempt++) {
			const label = await raw('wit.tags.get', {
				tagIdOrName: 'ct-label',
			}).catch(() => undefined);
			if (!pick(label, 'id')) break;
			await step('wit.tags.delete', { tagIdOrName: pick(label, 'id') });
			await sleep(15_000);
		}
		// A restored repository can finish restoring after the delete that
		// followed it: anything of the run's still there goes now.
		await sleep(10_000);
		const repos = await raw('git.repositories.list', {}).catch(() => undefined);
		for (const repo of (pick(repos, 'value') as Array<{
			id: string;
			name: string;
		}>) ?? []) {
			if (!repo.name.startsWith(NAME)) continue;
			// The list can lag the deletes above: a 404 here is a repository already gone.
			await step(
				'git.repositories.delete',
				{ repositoryId: repo.id },
				{ expected: /Azure DevOps 404/ },
			);
			await sleep(3000);
			await step('git.repositories.deleteRepositoryFromRecycleBin', {
				repositoryId: repo.id,
			});
		}
	});
});
