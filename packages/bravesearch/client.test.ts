import { assembleAnswerStream } from './client';

describe('assembleAnswerStream', () => {
	it('joins text deltas and ignores keep-alive and DONE lines', () => {
		const raw = [
			': keep-alive',
			'data: {"id":"a","model":"brave","choices":[{"delta":{"role":"assistant","content":"Hello "}}]}',
			'data: {"id":"a","choices":[{"delta":{"content":"world"},"finish_reason":"stop"}]}',
			'data: [DONE]',
		].join('\n');
		const answer = assembleAnswerStream(raw);
		expect(answer.id).toBe('a');
		expect(answer.model).toBe('brave');
		expect(answer.choices).toEqual([
			{
				index: 0,
				message: { role: 'assistant', content: 'Hello world' },
				finish_reason: 'stop',
			},
		]);
		expect(answer.citations).toEqual([]);
		expect(answer.tags).toEqual([]);
	});

	it('keeps text that only looks like a tag in the answer', () => {
		const raw =
			'data: {"choices":[{"delta":{"content":"use <b>bold</b> here"}}]}\ndata: [DONE]\n';
		expect(assembleAnswerStream(raw).choices[0]?.message.content).toBe(
			'use <b>bold</b> here',
		);
	});

	it('keeps a tag whose body is not JSON as text in tags', () => {
		const raw =
			'data: {"choices":[{"delta":{"content":"<entity>K2</entity>"}}]}\ndata: [DONE]\n';
		expect(assembleAnswerStream(raw).tags).toEqual([
			{ tag: 'entity', value: 'K2' },
		]);
	});

	it('refuses a stream that stops before its finish chunk or [DONE]', () => {
		const raw = 'data: {"choices":[{"delta":{"content":"K2 is"}}]}\n';
		expect(() => assembleAnswerStream(raw)).toThrow(/ended before it finished/);
	});

	it('accepts a stream with [DONE] even without a finish_reason', () => {
		const raw =
			'data: {"choices":[{"delta":{"content":"K2"}}]}\ndata: [DONE]\n';
		expect(assembleAnswerStream(raw).choices[0]?.message.content).toBe('K2');
	});

	it('throws when the body has no stream chunks', () => {
		expect(() => assembleAnswerStream('<html>gateway timeout</html>')).toThrow(
			/no stream chunks/,
		);
	});
});
