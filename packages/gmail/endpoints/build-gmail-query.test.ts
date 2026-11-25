import type { MessagesListInput } from './types';
import { buildGmailQuery, GmailEndpointInputSchemas } from './types';

const listInput = GmailEndpointInputSchemas.messagesList;

describe('messagesList input validation', () => {
	it('rejects impossible calendar dates and keeps leap days', () => {
		expect(listInput.safeParse({ after: '2025-02-30' }).success).toBe(false);
		expect(listInput.safeParse({ before: '2025-99-99' }).success).toBe(false);
		expect(listInput.safeParse({ after: '2025-02-29' }).success).toBe(false);
		expect(listInput.safeParse({ after: '2024-02-29' }).success).toBe(true);
	});

	it('rejects whitespace-only anyOf terms', () => {
		expect(listInput.safeParse({ anyOf: [' ', '\t'] }).success).toBe(false);
		expect(listInput.safeParse({ anyOf: ['a', 'b'] }).success).toBe(true);
	});
});

describe('buildGmailQuery', () => {
	it('quotes reserved words in a multiword subject', () => {
		expect(buildGmailQuery({ subject: 'budget OR forecast' })).toBe(
			'subject:(budget "OR" forecast)',
		);
	});

	it('returns an empty query for empty input', () => {
		expect(buildGmailQuery({})).toBe('');
		expect(buildGmailQuery({ keywords: [], from: [], anyOf: [] })).toBe('');
		expect(buildGmailQuery({ keywords: ['  '], exactPhrase: ' ' })).toBe('');
	});

	it('passes q through unchanged when no structured field is set', () => {
		expect(buildGmailQuery({ q: 'from:alice newer_than:7d' })).toBe(
			'from:alice newer_than:7d',
		);
	});

	it.each<[Partial<MessagesListInput>, string]>([
		[{ keywords: ['invoice', 'march'] }, 'invoice march'],
		[{ keywords: ['project plan'] }, '"project plan"'],
		[{ exactPhrase: 'quarterly report' }, '"quarterly report"'],
		[{ anyOf: ['dinner', 'lunch'] }, '{dinner lunch}'],
		[{ exclude: ['spam', 'ad copy'] }, '-spam -"ad copy"'],
		[{ subject: 'budget' }, 'subject:budget'],
		[{ subject: 'team offsite' }, 'subject:(team offsite)'],
		[{ from: ['alice@x.com'] }, 'from:alice@x.com'],
		[{ to: ['bob@x.com'] }, 'to:bob@x.com'],
		[{ cc: ['carol@x.com'] }, 'cc:carol@x.com'],
		[{ from: ['Alice Smith'] }, 'from:"Alice Smith"'],
		[{ after: '2025-01-31' }, 'after:2025/01/31'],
		[{ before: '2025-02-28' }, 'before:2025/02/28'],
		[{ hasAttachment: true }, 'has:attachment'],
		[{ hasAttachment: false }, ''],
		[{ filename: 'report.pdf' }, 'filename:report.pdf'],
		[{ label: 'work' }, 'label:work'],
		[{ label: 'My Clients' }, 'label:My-Clients'],
		[{ in: 'sent' }, 'in:sent'],
		[{ in: 'anywhere' }, 'in:anywhere'],
		[{ isUnread: true }, 'is:unread'],
		[{ isUnread: false }, '-is:unread'],
		[{ isStarred: true }, 'is:starred'],
		[{ isStarred: false }, '-is:starred'],
		[{ larger: '10M' }, 'larger:10M'],
		[{ smaller: 500000 }, 'smaller:500000'],
	])('%j -> %s', (input, expected) => {
		expect(buildGmailQuery(input)).toBe(expected);
	});

	it('groups several addresses as an OR group', () => {
		expect(buildGmailQuery({ from: ['a@x.com', 'b@x.com'] })).toBe(
			'{from:a@x.com from:b@x.com}',
		);
	});

	it('quotes reserved words and operator-like values', () => {
		expect(buildGmailQuery({ keywords: ['OR', 'from:me', '-x'] })).toBe(
			'"OR" "from:me" "-x"',
		);
	});

	it('drops double quotes inside values', () => {
		expect(buildGmailQuery({ exactPhrase: 'say "hi" now' })).toBe(
			'"say hi now"',
		);
		expect(buildGmailQuery({ keywords: ['a"b c'] })).toBe('"ab c"');
	});

	it('combines fields in one space-separated (AND) query', () => {
		expect(
			buildGmailQuery({
				keywords: ['invoice'],
				from: ['billing@x.com'],
				after: '2025-01-01',
				before: '2025-02-01',
				hasAttachment: true,
				isUnread: true,
				in: 'inbox',
			}),
		).toBe(
			'invoice from:billing@x.com after:2025/01/01 before:2025/02/01 has:attachment in:inbox is:unread',
		);
	});

	it('ANDs a user q with the structured fields', () => {
		expect(buildGmailQuery({ q: 'a OR b', from: ['x@y.com'] })).toBe(
			'(a OR b) from:x@y.com',
		);
		expect(buildGmailQuery({ q: 'urgent', isStarred: true })).toBe(
			'urgent is:starred',
		);
	});
});
