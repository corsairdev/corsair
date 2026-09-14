import { parseSseBuffer } from './client';

describe('parseSseBuffer', () => {
	it('returns complete frames and keeps the partial tail', () => {
		const { events, rest } = parseSseBuffer(
			'data: {"a":1}\n\ndata: {"b":2}\n\ndata: {"c"',
		);
		expect(events).toEqual([{ data: '{"a":1}' }, { data: '{"b":2}' }]);
		expect(rest).toBe('data: {"c"');
	});

	it('captures a named event', () => {
		const { events } = parseSseBuffer('event: insert\ndata: {"a":1}\n\n');
		expect(events).toEqual([{ event: 'insert', data: '{"a":1}' }]);
	});

	it('joins multi-line data fields', () => {
		const { events } = parseSseBuffer('data: line1\ndata: line2\n\n');
		expect(events[0]!.data).toBe('line1\nline2');
	});

	it('normalizes CRLF frame separators', () => {
		const { events } = parseSseBuffer('data: {"a":1}\r\n\r\n');
		expect(events).toEqual([{ data: '{"a":1}' }]);
	});

	it('ignores comment-only and empty frames', () => {
		const { events } = parseSseBuffer(': keep-alive\n\n');
		expect(events).toEqual([]);
	});

	it('returns nothing for a buffer with no complete frame', () => {
		const { events, rest } = parseSseBuffer('data: partial');
		expect(events).toEqual([]);
		expect(rest).toBe('data: partial');
	});
});
