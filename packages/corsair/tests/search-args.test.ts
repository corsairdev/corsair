import type { EndpointSearch } from '../core/plugins';
import { searchArgs } from '../core/plugins/search-args';

const mail: EndpointSearch = {
	kinds: ['messages'],
	rows: 'messages',
	id: 'id',
	limit: { arg: 'maxResults', default: 10, max: 50 },
	fixed: { userId: 'me' },
	hints: {
		topic: { arg: 'q', text: '{v}' },
		people: {
			arg: 'q',
			text: ['from:{v}', 'to:{v}'],
			join: 'or',
		},
		after: { arg: 'q', text: 'after:{v}', format: 'epoch' },
		before: { arg: 'q', text: 'before:{v}', format: 'epoch' },
		kinds: { map: { messages: { arg: 'q', text: 'in:anywhere' } } },
		states: {
			map: {
				unread: { arg: 'q', text: 'is:unread' },
				sent: { arg: 'q', text: 'in:sent' },
			},
		},
	},
};

const tracker: EndpointSearch = {
	kinds: ['issues'],
	rows: 'nodes',
	id: 'id',
	limit: { arg: 'first', default: 25 },
	fixed: { orderBy: 'updatedAt' },
	hints: {
		topic: {
			arg: 'filter.or',
			list: [
				{ title: { containsIgnoreCase: '{v}' } },
				{ description: { containsIgnoreCase: '{v}' } },
			],
		},
		people: { arg: 'filter.assignee.email.in', list: ['{v}'] },
		after: { arg: 'filter.updatedAt.gte', set: '{v}', format: 'iso' },
		before: { arg: 'filter.updatedAt.lt', set: '{v}', format: 'iso' },
		states: {
			max: 1,
			map: {
				open: { arg: 'filter.state.type.nin', set: ['completed', 'canceled'] },
				started: { arg: 'filter.state.type.eq', set: 'started' },
			},
		},
	},
};

const days: EndpointSearch = {
	kinds: ['messages'],
	rows: 'matches',
	id: 'ts',
	limit: { arg: 'count', default: 15 },
	hints: {
		after: {
			arg: 'query',
			text: 'after:{v}',
			format: 'YYYY-MM-DD',
			shiftDays: -1,
		},
		before: { arg: 'query', text: 'before:{v}', format: 'YYYY-MM-DD' },
	},
};

const range: EndpointSearch = {
	kinds: ['issues'],
	rows: 'items',
	id: 'id',
	limit: { arg: 'perPage', default: 20, max: 100 },
	hints: {
		topic: { arg: 'q', text: '{v}', cap: 12 },
		people: { arg: 'q', text: 'involves:{v}' },
		places: { arg: 'q', text: 'repo:{v}' },
		ids: { arg: 'q', text: 'in:number {v}' },
		after: { arg: 'q', text: 'updated:>={v}', format: 'iso' },
		before: { arg: 'q', text: 'updated:<{v}', format: 'iso' },
		window: { arg: 'q', text: 'updated:{after}..{before}', format: 'iso' },
		kinds: {
			max: 1,
			map: {
				pullRequests: { arg: 'q', text: 'is:pr' },
				issues: { arg: 'q', text: 'is:issue' },
			},
		},
	},
};

describe('searchArgs', () => {
	it('returns null when the hints hold nothing but topic words', () => {
		expect(searchArgs(mail, {})).toBeNull();
		expect(searchArgs(mail, { topic: ['budget'] })).toBeNull();
		expect(searchArgs(mail, { topic: [], people: [], kinds: [] })).toBeNull();
	});

	it('compiles topic words alone when the caller asks for a broad read', () => {
		expect(searchArgs(mail, { topic: ['budget'] }, { broad: true })).toEqual({
			userId: 'me',
			maxResults: 10,
			q: 'budget',
		});
		expect(searchArgs(mail, {}, { broad: true })).toBeNull();
		expect(searchArgs(mail, { topic: ['  '] }, { broad: true })).toBeNull();
		expect(searchArgs(days, { topic: ['budget'] }, { broad: true })).toBeNull();
		expect(
			searchArgs(mail, { topic: ['budget'] }, { broad: false }),
		).toBeNull();
	});

	it('returns null when every other hint is one the app does not map', () => {
		expect(
			searchArgs(mail, { states: ['merged'], kinds: ['events'] }),
		).toBeNull();
		expect(searchArgs(days, { people: ['ann'] })).toBeNull();
	});

	it('sends the topic along with the first usable hint', () => {
		expect(searchArgs(mail, { topic: ['budget'], states: ['unread'] })).toEqual(
			{
				userId: 'me',
				maxResults: 10,
				q: 'budget is:unread',
			},
		);
	});

	it('treats people as any of them, each by every template', () => {
		expect(searchArgs(mail, { people: ['ann@example.test'] })).toEqual({
			userId: 'me',
			maxResults: 10,
			q: '(from:ann@example.test OR to:ann@example.test)',
		});
		expect(
			searchArgs(mail, { people: ['ann@example.test', 'bo@example.test'] })?.q,
		).toBe(
			'(from:ann@example.test OR to:ann@example.test OR from:bo@example.test OR to:bo@example.test)',
		);
	});

	it('repeats the term for people when the join is a space', () => {
		expect(searchArgs(range, { people: ['ann', 'bo'] })?.q).toBe(
			'involves:ann involves:bo',
		);
	});

	it('quotes a value with spaces, colons, brackets or a leading dash', () => {
		const q = (topic: string[]) =>
			searchArgs(mail, { topic, states: ['unread'] })?.q;
		expect(q(['quarterly plan'])).toBe('"quarterly plan" is:unread');
		expect(q(['re:budget'])).toBe('"re:budget" is:unread');
		expect(q(['-secret'])).toBe('"-secret" is:unread');
		expect(q(['(x)'])).toBe('"(x)" is:unread');
		expect(q(['OR'])).toBe('"OR" is:unread');
		expect(q(['plain'])).toBe('plain is:unread');
	});

	it('removes double quotes inside a value rather than escaping them', () => {
		expect(
			searchArgs(mail, { topic: ['say "hi" now'], states: ['unread'] })?.q,
		).toBe('"say hi now" is:unread');
	});

	it('drops blank and repeated values', () => {
		expect(
			searchArgs(mail, {
				topic: ['  ', 'plan', 'plan', ''],
				states: ['unread'],
			})?.q,
		).toBe('plan is:unread');
	});

	it('stops adding values once they pass the declared cap', () => {
		expect(
			searchArgs(range, {
				topic: ['alpha', 'beta', 'gamma'],
				kinds: ['issues'],
			})?.q,
		).toBe('alpha beta is:issue');
	});

	it('ignores kinds the app does not map and keeps the ones it does', () => {
		expect(searchArgs(range, { kinds: ['events', 'pullRequests'] })?.q).toBe(
			'is:pr',
		);
	});

	it('leaves out a kinds hint that names more kinds than the app can take', () => {
		expect(
			searchArgs(range, { kinds: ['issues', 'pullRequests'], people: ['ann'] })
				?.q,
		).toBe('involves:ann');
		expect(searchArgs(range, { kinds: ['issues', 'pullRequests'] })).toBeNull();
	});

	it('matches state and kind values without regard to case', () => {
		expect(searchArgs(mail, { states: ['Unread'] })?.q).toBe('is:unread');
		expect(searchArgs(range, { kinds: ['PULLREQUESTS'] })?.q).toBe('is:pr');
	});

	it('formats bounds as epoch seconds', () => {
		expect(
			searchArgs(mail, {
				after: '2026-11-14T08:00:00.000Z',
				before: '2026-11-15T08:00:00.000Z',
			})?.q,
		).toBe('after:1794643200 before:1794729600');
	});

	it('formats bounds as ISO instants in UTC', () => {
		expect(
			searchArgs(tracker, {
				after: '2026-11-14T00:00:00-08:00',
				before: '2026-11-15T00:00:00-08:00',
			})?.filter,
		).toEqual({
			updatedAt: {
				gte: '2026-11-14T08:00:00.000Z',
				lt: '2026-11-15T08:00:00.000Z',
			},
		});
	});

	it('floors an after day and ceils a before day, in the caller zone', () => {
		const tz = 'America/Los_Angeles';
		expect(
			searchArgs(days, {
				after: '2026-11-14T08:00:00Z',
				before: '2026-11-15T08:00:00Z',
				tz,
			})?.query,
		).toBe('after:2026-11-13 before:2026-11-15');
		expect(
			searchArgs(days, {
				after: '2026-11-14T20:00:00Z',
				before: '2026-11-14T20:00:00Z',
				tz,
			})?.query,
		).toBe('after:2026-11-13 before:2026-11-15');
	});

	it('uses UTC days when no zone is given, and shifts by the declared days', () => {
		expect(searchArgs(days, { after: '2026-03-01T00:00:00Z' })?.query).toBe(
			'after:2026-02-28',
		);
		expect(searchArgs(days, { before: '2026-12-31T00:00:00Z' })?.query).toBe(
			'before:2026-12-31',
		);
	});

	it('writes a slash date format', () => {
		const slash: EndpointSearch = {
			...days,
			hints: {
				after: { arg: 'q', text: 'after:{v}', format: 'YYYY/MM/DD' },
			},
		};
		expect(searchArgs(slash, { after: '2026-11-14T00:00:00Z' })?.q).toBe(
			'after:2026/11/14',
		);
	});

	it('ignores a bound that is not a date', () => {
		expect(searchArgs(mail, { after: 'last week' })).toBeNull();
		expect(
			searchArgs(mail, { after: 'yesterday', states: ['unread'] })?.q,
		).toBe('is:unread');
	});

	it('uses the window template when both bounds are given', () => {
		expect(
			searchArgs(range, {
				after: '2026-11-14T00:00:00Z',
				before: '2026-11-15T00:00:00Z',
			})?.q,
		).toBe('updated:2026-11-14T00:00:00.000Z..2026-11-15T00:00:00.000Z');
		expect(searchArgs(range, { after: '2026-11-14T00:00:00Z' })?.q).toBe(
			'updated:>=2026-11-14T00:00:00.000Z',
		);
		expect(searchArgs(range, { before: '2026-11-15T00:00:00Z' })?.q).toBe(
			'updated:<2026-11-15T00:00:00.000Z',
		);
	});

	it('builds nested args and expands list templates per value', () => {
		expect(
			searchArgs(tracker, {
				topic: ['billing', 'sync'],
				people: ['ann@example.test', 'bo@example.test'],
			}),
		).toEqual({
			orderBy: 'updatedAt',
			first: 25,
			filter: {
				or: [
					{ title: { containsIgnoreCase: 'billing' } },
					{ description: { containsIgnoreCase: 'billing' } },
					{ title: { containsIgnoreCase: 'sync' } },
					{ description: { containsIgnoreCase: 'sync' } },
				],
				assignee: { email: { in: ['ann@example.test', 'bo@example.test'] } },
			},
		});
	});

	it('does not quote values placed in structured args', () => {
		expect(
			searchArgs(tracker, { people: ['Ann Lee <ann@example.test>'] })?.filter,
		).toEqual({
			assignee: { email: { in: ['Ann Lee <ann@example.test>'] } },
		});
	});

	it('sets a constant for a mapped state', () => {
		expect(searchArgs(tracker, { states: ['open'] })?.filter).toEqual({
			state: { type: { nin: ['completed', 'canceled'] } },
		});
	});

	it('leaves out a states hint past its max', () => {
		expect(searchArgs(tracker, { states: ['open', 'started'] })).toBeNull();
	});

	it('narrows to the places a question names, each kept', () => {
		expect(
			searchArgs(range, { places: ['acme/api', 'acme/web'], topic: ['plan'] })
				?.q,
		).toBe('plan repo:acme/api repo:acme/web');
		expect(searchArgs(mail, { places: ['acme/api'] })).toBeNull();
	});

	it('looks ids up with the declared template', () => {
		expect(searchArgs(range, { ids: ['42'] })?.q).toBe('in:number 42');
		expect(searchArgs(mail, { ids: ['42'] })).toBeNull();
	});

	it('uses the declared default limit and clamps a given one', () => {
		expect(searchArgs(mail, { states: ['sent'] })?.maxResults).toBe(10);
		expect(searchArgs(mail, { states: ['sent'], limit: 5 })?.maxResults).toBe(
			5,
		);
		expect(searchArgs(mail, { states: ['sent'], limit: 900 })?.maxResults).toBe(
			50,
		);
		expect(searchArgs(mail, { states: ['sent'], limit: 0 })?.maxResults).toBe(
			10,
		);
		expect(searchArgs(tracker, { states: ['open'], limit: 900 })?.first).toBe(
			900,
		);
		expect(searchArgs(mail, { states: ['sent'], limit: 2.7 })?.maxResults).toBe(
			2,
		);
	});

	it('is deterministic and does not touch its inputs', () => {
		const hints = { topic: ['plan'], people: ['ann'], states: ['unread'] };
		const before = JSON.stringify([mail, hints]);
		const a = searchArgs(mail, hints);
		const b = searchArgs(mail, hints);
		expect(a).toEqual(b);
		expect(JSON.stringify([mail, hints])).toBe(before);
		if (a) a.q = 'changed';
		expect(searchArgs(mail, hints)?.q).not.toBe('changed');
	});
});
