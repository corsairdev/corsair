import { makeSlackRequest } from '../client';
import type { SlackContext } from '../index';
import { search } from './messages';
import type { MessagesSearchInput } from './types';
import { buildSlackSearchQuery, slackSearchParams } from './types';

jest.mock('../client', () => ({
	...jest.requireActual('../client'),
	makeSlackRequest: jest.fn().mockResolvedValue({ ok: true }),
}));

describe('buildSlackSearchQuery', () => {
	it('returns an empty query for empty input', () => {
		expect(buildSlackSearchQuery({})).toBe('');
		expect(
			buildSlackSearchQuery({
				keywords: [],
				notIn: [],
				in: ' ',
				exactPhrase: ' ',
			}),
		).toBe('');
		expect(buildSlackSearchQuery({ hasPin: false, isThread: false })).toBe('');
	});

	it('passes query through unchanged when no structured field is set', () => {
		expect(buildSlackSearchQuery({ query: 'deploy in:#ops' })).toBe(
			'deploy in:#ops',
		);
	});

	it.each<[Partial<MessagesSearchInput>, string]>([
		[{ keywords: ['marketing', 'report'] }, 'marketing report'],
		[{ keywords: ['launch plan'] }, '"launch plan"'],
		[{ exactPhrase: 'marketing report' }, '"marketing report"'],
		[{ exclude: ['report', 'old news'] }, '-report -"old news"'],
		[{ in: 'team-marketing' }, 'in:#team-marketing'],
		[{ in: '#team-marketing' }, 'in:#team-marketing'],
		[{ notIn: ['random', '#watercooler'] }, '-in:#random -in:#watercooler'],
		[{ from: 'Sara' }, 'from:@Sara'],
		[{ from: '@Sara' }, 'from:@Sara'],
		[{ from: 'Sara Jones' }, 'from:@Sara-Jones'],
		[{ notFrom: ['Bot'] }, '-from:@Bot'],
		[{ with: 'Sarah' }, 'with:@Sarah'],
		[{ after: '2025-01-31' }, 'after:2025-01-31'],
		[{ before: '2025-02-28' }, 'before:2025-02-28'],
		[{ on: '2025-02-14' }, 'on:2025-02-14'],
		[{ during: 'august' }, 'during:august'],
		[{ hasPin: true }, 'has:pin'],
		[{ hasReaction: 'eyes' }, 'has::eyes:'],
		[{ hasReaction: ':eyes:' }, 'has::eyes:'],
		[{ isSaved: true }, 'is:saved'],
		[{ isThread: true }, 'is:thread'],
	])('%j -> %s', (input, expected) => {
		expect(buildSlackSearchQuery(input)).toBe(expected);
	});

	it('quotes values that look like modifiers or exclusions', () => {
		expect(buildSlackSearchQuery({ keywords: ['from:me', '-x'] })).toBe(
			'"from:me" "-x"',
		);
	});

	it('drops double quotes inside values', () => {
		expect(buildSlackSearchQuery({ exactPhrase: 'say "hi" now' })).toBe(
			'"say hi now"',
		);
	});

	it('combines fields in one space-separated (AND) query', () => {
		expect(
			buildSlackSearchQuery({
				keywords: ['deploy'],
				in: 'ops',
				from: 'Sara',
				after: '2025-01-01',
				before: '2025-02-01',
				isThread: true,
				exclude: ['staging'],
			}),
		).toBe(
			'deploy -staging in:#ops from:@Sara after:2025-01-01 before:2025-02-01 is:thread',
		);
	});

	it('ANDs a user query with the structured fields', () => {
		expect(buildSlackSearchQuery({ query: 'urgent', in: 'ops' })).toBe(
			'urgent in:#ops',
		);
	});
});

describe('messages.search', () => {
	it('sends the compiled query and paging, not the structured fields', async () => {
		const mocked = makeSlackRequest as jest.Mock;
		const ctx = {
			key: 'xoxb',
			keys: { get_user_token: async () => 'xoxp' },
			db: {},
			endpoints: {},
		} as unknown as SlackContext;
		expect(slackSearchParams({ in: 'ops', count: 5 })).toEqual({
			count: 5,
			query: 'in:#ops',
		});
		await search(ctx, { query: 'deploy', from: 'Sara', count: 5 });
		expect(mocked.mock.calls.at(-1)?.[2]).toEqual({
			method: 'GET',
			query: { count: 5, query: 'deploy from:@Sara' },
		});
	});
});
