import { buildManualApprovalUrl } from '../core/permissions/approval-message';

jest.mock('../hub/permission', () => ({}));

describe('buildManualApprovalUrl', () => {
	it.each([
		['https://app/approve/', 'https://app/approve/tok'],
		['https://app/approve', 'https://app/approve/tok'],
		['https://app/approve///', 'https://app/approve/tok'],
		['https://app//approve/', 'https://app//approve/tok'],
		['', '/tok'],
		['/', '/tok'],
	])('%s', (base, want) => {
		expect(buildManualApprovalUrl(base, 'tok')).toBe(want);
	});

	it('stays fast on a long run of slashes that is not at the end', () => {
		const t0 = performance.now();
		buildManualApprovalUrl(`https://app${'/'.repeat(50_000)}x`, 'tok');
		expect(performance.now() - t0).toBeLessThan(100);
	});
});
