import {
	commentRecordFromApi,
	commentRecordFromWebhook,
	issueRecordFromWebhook,
	pullRequestRecordFromWebhook,
} from './persistence';
import type { Comment, Issue, PullRequest } from './webhooks/types';

describe('github persistence', () => {
	it('commentRecordFromApi keeps user login', () => {
		const record = commentRecordFromApi({
			id: 1,
			body: 'hello',
			user: {
				id: 42,
				login: 'octocat',
				avatar_url: 'https://example.com/a.png',
			},
		});

		expect(record.user).toEqual({
			id: 42,
			login: 'octocat',
			avatarUrl: 'https://example.com/a.png',
		});
	});

	it('commentRecordFromWebhook keeps user login', () => {
		const record = commentRecordFromWebhook({
			id: 1,
			node_id: 'IC_1',
			url: 'https://api.github.com/comments/1',
			html_url: 'https://github.com/o/r/issues/2#issuecomment-1',
			issue_url: 'https://api.github.com/repos/o/r/issues/2',
			body: 'hello',
			author_association: 'MEMBER',
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-01T00:00:00Z',
			user: {
				login: 'octocat',
				id: 42,
				node_id: 'U_1',
				avatar_url: 'https://example.com/a.png',
				gravatar_id: '',
				url: 'https://api.github.com/users/octocat',
				html_url: 'https://github.com/octocat',
				followers_url: '',
				following_url: '',
				gists_url: '',
				starred_url: '',
				subscriptions_url: '',
				organizations_url: '',
				repos_url: '',
				events_url: '',
				received_events_url: '',
				type: 'User',
				site_admin: false,
			},
		} satisfies Comment);

		expect(record.user).toMatchObject({
			id: 42,
			login: 'octocat',
			avatarUrl: 'https://example.com/a.png',
		});
	});

	it('issueRecordFromWebhook keeps user and labels', () => {
		const record = issueRecordFromWebhook({
			id: 10,
			node_id: 'I_10',
			url: 'https://api.github.com/repos/o/r/issues/10',
			repository_url: 'https://api.github.com/repos/o/r',
			html_url: 'https://github.com/o/r/issues/10',
			number: 10,
			title: 'Bug',
			body: 'details',
			state: 'open',
			locked: false,
			comments: 0,
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-01T00:00:00Z',
			closed_at: null,
			user: {
				login: 'dev',
				id: 7,
				node_id: 'U_7',
				avatar_url: 'https://example.com/dev.png',
				gravatar_id: '',
				url: 'https://api.github.com/users/dev',
				html_url: 'https://github.com/dev',
				followers_url: '',
				following_url: '',
				gists_url: '',
				starred_url: '',
				subscriptions_url: '',
				organizations_url: '',
				repos_url: '',
				events_url: '',
				received_events_url: '',
				type: 'User',
				site_admin: false,
			},
			labels: [
				{
					id: 1,
					node_id: 'L_1',
					url: 'https://api.github.com/repos/o/r/labels/bug',
					name: 'bug',
					color: 'd73a4a',
					default: false,
					description: 'Bug',
				},
			],
			assignee: null,
			assignees: [],
			milestone: null,
		} satisfies Issue);

		expect(record.user).toMatchObject({ login: 'dev' });
		expect(record.labels).toEqual([
			expect.objectContaining({ name: 'bug', color: 'd73a4a' }),
		]);
	});

	it('pullRequestRecordFromWebhook keeps user login', () => {
		const record = pullRequestRecordFromWebhook({
			id: 99,
			node_id: 'PR_99',
			url: 'https://api.github.com/repos/o/r/pulls/99',
			html_url: 'https://github.com/o/r/pull/99',
			diff_url: 'https://github.com/o/r/pull/99.diff',
			patch_url: 'https://github.com/o/r/pull/99.patch',
			issue_url: 'https://api.github.com/repos/o/r/issues/99',
			number: 99,
			state: 'open',
			locked: false,
			title: 'feat',
			body: 'body',
			created_at: '2024-01-01T00:00:00Z',
			updated_at: '2024-01-02T00:00:00Z',
			closed_at: null,
			merged_at: null,
			merge_commit_sha: null,
			assignee: null,
			assignees: [],
			draft: false,
			merged: false,
			mergeable: true,
			comments: 1,
			review_comments: 0,
			commits: 1,
			additions: 1,
			deletions: 0,
			changed_files: 1,
			user: {
				login: 'dev',
				id: 7,
				node_id: 'U_7',
				avatar_url: 'https://example.com/dev.png',
				gravatar_id: '',
				url: 'https://api.github.com/users/dev',
				html_url: 'https://github.com/dev',
				followers_url: '',
				following_url: '',
				gists_url: '',
				starred_url: '',
				subscriptions_url: '',
				organizations_url: '',
				repos_url: '',
				events_url: '',
				received_events_url: '',
				type: 'User',
				site_admin: false,
			},
		} satisfies PullRequest);

		expect(record.user).toMatchObject({ login: 'dev' });
	});
});
