import { makeGithubRequest } from '../client';
import type { GithubContext } from '../index';
import { issues } from './search';
import type { SearchIssuesInput } from './types';
import { buildGithubIssueQuery, githubSearchIssuesParams } from './types';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeGithubRequest: jest.fn().mockResolvedValue({ items: [] }),
}));

describe('buildGithubIssueQuery', () => {
	it('returns an empty query for empty input', () => {
		expect(buildGithubIssueQuery({})).toBe('');
		expect(
			buildGithubIssueQuery({ keywords: [], label: [], in: [], author: ' ' }),
		).toBe('');
		expect(buildGithubIssueQuery({ keywords: ['  '], exactPhrase: ' ' })).toBe(
			'',
		);
	});

	it('passes q through unchanged when no structured field is set', () => {
		expect(buildGithubIssueQuery({ q: 'is:pr author:octocat' })).toBe(
			'is:pr author:octocat',
		);
	});

	it.each<[Partial<SearchIssuesInput>, string]>([
		[{ keywords: ['broken', 'login'] }, 'broken login'],
		[{ keywords: ['race condition'] }, '"race condition"'],
		[{ exactPhrase: 'null pointer' }, '"null pointer"'],
		[{ exclude: ['wip', 'do not merge'] }, '-wip -"do not merge"'],
		[{ in: ['title'] }, 'in:title'],
		[{ in: ['title', 'body'] }, 'in:title,body'],
		[{ in: ['title', 'title'] }, 'in:title'],
		[{ type: 'issue' }, 'is:issue'],
		[{ type: 'pr' }, 'is:pr'],
		[{ state: 'open' }, 'is:open'],
		[{ state: 'closed' }, 'is:closed'],
		[{ state: 'merged' }, 'is:merged'],
		[{ state: 'unmerged' }, 'is:unmerged'],
		[{ author: 'octocat' }, 'author:octocat'],
		[{ author: '@me' }, 'author:@me'],
		[{ assignee: 'hubot' }, 'assignee:hubot'],
		[{ mentions: 'hubot' }, 'mentions:hubot'],
		[{ involves: 'hubot' }, 'involves:hubot'],
		[{ reviewRequested: 'hubot' }, 'review-requested:hubot'],
		[{ label: ['bug'] }, 'label:bug'],
		[{ label: ['help wanted', 'bug'] }, 'label:"help wanted" label:bug'],
		[{ label: ['a,b'] }, 'label:"a,b"'],
		[
			{ excludeLabels: ['wontfix', 'good first issue'] },
			'-label:wontfix -label:"good first issue"',
		],
		[{ repo: 'owner/name' }, 'repo:owner/name'],
		[{ org: 'corsairdev' }, 'org:corsairdev'],
		[{ created: '>=2025-01-31' }, 'created:>=2025-01-31'],
		[{ updated: '2025-01-01..2025-01-31' }, 'updated:2025-01-01..2025-01-31'],
		[{ closed: '<2025-02-01' }, 'closed:<2025-02-01'],
	])('%j -> %s', (input, expected) => {
		expect(buildGithubIssueQuery(input)).toBe(expected);
	});

	it('quotes operator-like keywords and drops double quotes', () => {
		expect(buildGithubIssueQuery({ keywords: ['is:open', '-x'] })).toBe(
			'"is:open" "-x"',
		);
		expect(buildGithubIssueQuery({ exactPhrase: 'say "hi"' })).toBe('"say hi"');
	});

	it('combines fields in one space-separated (AND) query', () => {
		expect(
			buildGithubIssueQuery({
				keywords: ['crash'],
				in: ['title', 'body'],
				type: 'pr',
				state: 'open',
				author: 'octocat',
				label: ['bug'],
				repo: 'owner/name',
				updated: '>=2025-01-31',
			}),
		).toBe(
			'crash in:title,body is:pr is:open author:octocat label:bug repo:owner/name updated:>=2025-01-31',
		);
	});

	it('ANDs a user q with the structured fields', () => {
		expect(buildGithubIssueQuery({ q: 'is:issue', author: 'octocat' })).toBe(
			'is:issue author:octocat',
		);
	});
});

describe('search.issues', () => {
	it('sends the compiled q and paging, not the structured fields', async () => {
		const input = {
			q: 'is:issue',
			author: 'octocat',
			label: ['bug'],
			perPage: 5,
		};
		expect(githubSearchIssuesParams(input)).toEqual({
			q: 'is:issue author:octocat label:bug',
			perPage: 5,
		});
		const ctx = { key: 'tok', db: {} } as unknown as GithubContext;
		await issues(ctx, input);
		const call = (makeGithubRequest as jest.Mock).mock.calls.at(-1);
		expect(call?.[0]).toBe('/search/issues');
		expect(call?.[2]).toEqual({
			query: { q: 'is:issue author:octocat label:bug', per_page: 5 },
		});
	});
});
