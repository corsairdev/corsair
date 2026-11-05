import {
	activeMode,
	assertReadonlyAllowed,
	isReadonlyScopeActive,
	ReadonlyForbiddenError,
	runReadonly,
	runWithMode,
} from '../core/permissions';

describe('permission mode scope', () => {
	it('is absent outside any scope', () => {
		expect(activeMode()).toBeUndefined();
		expect(isReadonlyScopeActive()).toBe(false);
	});

	it('carries the mode to a nested async continuation', async () => {
		const seen = await runWithMode('cautious', async () => {
			await new Promise((resolve) => setTimeout(resolve, 5));
			return activeMode();
		});
		expect(seen).toBe('cautious');
		expect(activeMode()).toBeUndefined();
	});

	it('reads readonly as the readonly scope, so the existing guard still fires', () => {
		runWithMode('readonly', () => {
			expect(isReadonlyScopeActive()).toBe(true);
			expect(() => assertReadonlyAllowed('slack.chat.post', 'write')).toThrow(
				ReadonlyForbiddenError,
			);
			expect(() =>
				assertReadonlyAllowed('slack.chat.list', 'read'),
			).not.toThrow();
		});
	});

	it('leaves writes to the matrix under a mode that permits them', () => {
		runWithMode('cautious', () => {
			expect(isReadonlyScopeActive()).toBe(false);
			expect(() =>
				assertReadonlyAllowed('slack.chat.post', 'write'),
			).not.toThrow();
		});
	});

	it('keeps runReadonly as the readonly mode', () => {
		const seen = runReadonly(() => activeMode());
		expect(seen).toBe('readonly');
	});

	describe('nesting', () => {
		it('takes the stricter of the two when the inner one is tighter', () => {
			const seen = runWithMode('open', () =>
				runWithMode('strict', () => activeMode()),
			);
			expect(seen).toBe('strict');
		});

		it('ignores an inner scope that would widen', () => {
			const seen = runWithMode('readonly', () =>
				runWithMode('open', () => activeMode()),
			);
			expect(seen).toBe('readonly');
		});

		it('orders readonly as stricter than strict', () => {
			const seen = runWithMode('strict', () =>
				runWithMode('readonly', () => activeMode()),
			);
			expect(seen).toBe('readonly');
		});
	});
});
