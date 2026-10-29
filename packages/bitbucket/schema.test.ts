/**
 * Asserts every official / live-captured key is declared in `schema/database.ts`.
 *
 * Entities strip unknown keys. `safeParse` alone would never notice a field
 * the schema forgot, so declared-key lists are the check.
 *
 * Official keys: https://developer.atlassian.com/cloud/bitbucket/swagger.v3.json
 * Live extras: GET /2.0/workspaces/bitbucket and GET /2.0/repositories?pagelen=1
 */

import { BitbucketSchema } from './schema';
import {
	BitbucketAccount,
	BitbucketBranchEntity,
	BitbucketCommitEntity,
	BitbucketIssueEntity,
	BitbucketPipelineEntity,
	BitbucketProjectEntity,
	BitbucketPullRequestEntity,
	BitbucketRepositoryEntity,
	BitbucketSnippetEntity,
	BitbucketTagEntity,
	BitbucketUserEntity,
	BitbucketWorkspaceEntity,
} from './schema/database';

const WORKSPACE_KEYS = [
	'uuid',
	'type',
	'name',
	'slug',
	'is_private',
	'is_personal',
	'is_privacy_enforced',
	'forking_mode',
	'sign_system_commits',
	'created_on',
	'updated_on',
	'links',
];
const USER_KEYS = [
	'uuid',
	'type',
	'display_name',
	'nickname',
	'username',
	'account_id',
	'account_status',
	'created_on',
	'has_2fa_enabled',
	'is_staff',
	'links',
];
const PROJECT_KEYS = [
	'uuid',
	'type',
	'key',
	'name',
	'description',
	'is_private',
	'created_on',
	'updated_on',
	'has_publicly_visible_repos',
	'owner',
	'links',
];
const REPOSITORY_KEYS = [
	'uuid',
	'type',
	'name',
	'full_name',
	'slug',
	'description',
	'scm',
	'website',
	'language',
	'size',
	'is_private',
	'has_issues',
	'has_wiki',
	'fork_policy',
	'enforced_signed_commits',
	'created_on',
	'updated_on',
	'owner',
	'workspace',
	'project',
	'parent',
	'mainbranch',
	'override_settings',
	'links',
];
const PULL_REQUEST_KEYS = [
	'id',
	'type',
	'title',
	'state',
	'draft',
	'queued',
	'reason',
	'comment_count',
	'task_count',
	'close_source_branch',
	'created_on',
	'updated_on',
	'author',
	'closed_by',
	'source',
	'destination',
	'merge_commit',
	'reviewers',
	'participants',
	'summary',
	'rendered',
	'links',
];
const ISSUE_KEYS = [
	'id',
	'type',
	'title',
	'state',
	'kind',
	'priority',
	'votes',
	'created_on',
	'updated_on',
	'edited_on',
	'reporter',
	'assignee',
	'repository',
	'milestone',
	'version',
	'component',
	'content',
	'links',
];
const SNIPPET_KEYS = [
	'id',
	'type',
	'title',
	'scm',
	'is_private',
	'created_on',
	'updated_on',
	'owner',
	'creator',
];
const PIPELINE_KEYS = [
	'uuid',
	'type',
	'build_number',
	'created_on',
	'completed_on',
	'build_seconds_used',
	'creator',
	'repository',
	'target',
	'trigger',
	'state',
	'configuration_sources',
	'links',
];
const COMMIT_KEYS = [
	'hash',
	'type',
	'date',
	'message',
	'author',
	'committer',
	'summary',
	'rendered',
	'parents',
	'repository',
	'participants',
	'links',
];
const BRANCH_KEYS = [
	'name',
	'type',
	'target',
	'merge_strategies',
	'sync_strategies',
	'default_merge_strategy',
	'links',
];
const TAG_KEYS = [
	'name',
	'type',
	'message',
	'date',
	'target',
	'tagger',
	'links',
];

function declaredKeys(entity: { shape: Record<string, unknown> }) {
	return Object.keys(entity.shape);
}

describe('Bitbucket schema', () => {
	it('declares a semver version', () => {
		expect(BitbucketSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors the entities this plugin caches', () => {
		expect(Object.keys(BitbucketSchema.entities).sort()).toEqual(
			[
				'branches',
				'commits',
				'issues',
				'pipelines',
				'projects',
				'pullRequests',
				'repositories',
				'snippets',
				'tags',
				'users',
				'workspaces',
			].sort(),
		);
	});

	describe('every official key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['workspace', BitbucketWorkspaceEntity, WORKSPACE_KEYS],
			['user', BitbucketUserEntity, USER_KEYS],
			['project', BitbucketProjectEntity, PROJECT_KEYS],
			['repository', BitbucketRepositoryEntity, REPOSITORY_KEYS],
			['pull request', BitbucketPullRequestEntity, PULL_REQUEST_KEYS],
			['issue', BitbucketIssueEntity, ISSUE_KEYS],
			['snippet', BitbucketSnippetEntity, SNIPPET_KEYS],
			['pipeline', BitbucketPipelineEntity, PIPELINE_KEYS],
			['commit', BitbucketCommitEntity, COMMIT_KEYS],
			['branch', BitbucketBranchEntity, BRANCH_KEYS],
			['tag', BitbucketTagEntity, TAG_KEYS],
		];
		for (const [label, entity, keys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = declaredKeys(entity);
				expect(keys.filter((k) => !declared.includes(k))).toEqual([]);
			});
		}
	});

	it('requires only the primary key', () => {
		expect(BitbucketWorkspaceEntity.safeParse({ uuid: '{w}' }).success).toBe(
			true,
		);
		expect(BitbucketUserEntity.safeParse({ uuid: '{u}' }).success).toBe(true);
		expect(BitbucketProjectEntity.safeParse({ uuid: '{p}' }).success).toBe(
			true,
		);
		expect(BitbucketRepositoryEntity.safeParse({ uuid: '{r}' }).success).toBe(
			true,
		);
		expect(BitbucketPullRequestEntity.safeParse({ id: 1 }).success).toBe(true);
		expect(BitbucketIssueEntity.safeParse({ id: 1 }).success).toBe(true);
		expect(BitbucketSnippetEntity.safeParse({ id: 1 }).success).toBe(true);
		expect(BitbucketPipelineEntity.safeParse({ uuid: '{pipe}' }).success).toBe(
			true,
		);
		expect(BitbucketCommitEntity.safeParse({ hash: 'abc' }).success).toBe(true);
		expect(BitbucketBranchEntity.safeParse({ name: 'main' }).success).toBe(
			true,
		);
		expect(BitbucketTagEntity.safeParse({ name: 'v1' }).success).toBe(true);
	});

	it('rejects a record with no primary key', () => {
		expect(BitbucketRepositoryEntity.safeParse({ name: 'repo' }).success).toBe(
			false,
		);
		expect(BitbucketPullRequestEntity.safeParse({ title: 'pr' }).success).toBe(
			false,
		);
	});

	it('strips undeclared keys from persisted entities', () => {
		const parsed = BitbucketRepositoryEntity.safeParse({
			uuid: '{r}',
			aKeyNobodyDeclared: 1,
		});
		expect(parsed.success).toBe(true);
		if (!parsed.success) return;
		expect(parsed.data).not.toHaveProperty('aKeyNobodyDeclared');
		expect(declaredKeys(BitbucketRepositoryEntity)).not.toContain(
			'aKeyNobodyDeclared',
		);
	});

	it('does not persist email, pipeline-variable, or author-raw values', () => {
		expect(declaredKeys(BitbucketUserEntity)).not.toContain('email');
		expect(declaredKeys(BitbucketAccount)).not.toContain('email');
		expect(declaredKeys(BitbucketPipelineEntity)).not.toContain('variables');

		const user = BitbucketUserEntity.safeParse({
			uuid: '{u}',
			email: 'hidden@example.com',
		});
		expect(user.success).toBe(true);
		if (user.success) expect(user.data).not.toHaveProperty('email');

		const pipeline = BitbucketPipelineEntity.safeParse({
			uuid: '{pipe}',
			variables: [{ key: 'TOKEN', value: 'secret' }],
		});
		expect(pipeline.success).toBe(true);
		if (pipeline.success) expect(pipeline.data).not.toHaveProperty('variables');

		const commit = BitbucketCommitEntity.safeParse({
			hash: 'abc',
			author: {
				type: 'author',
				raw: 'Ada <ada@example.com>',
				user: { uuid: '{u}', email: 'ada@example.com' },
			},
			committer: {
				raw: 'Ada <ada@example.com>',
			},
		});
		expect(commit.success).toBe(true);
		if (!commit.success) return;
		expect(commit.data.author).not.toHaveProperty('raw');
		expect(commit.data.committer).not.toHaveProperty('raw');
		expect(commit.data.author?.user).not.toHaveProperty('email');
	});
});
