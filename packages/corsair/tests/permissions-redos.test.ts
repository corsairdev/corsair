import { buildManualApprovalUrl } from '../core/permissions/approval-message';
import { parseDurationMs } from '../core/permissions/index';

jest.mock('../hub/permission', () => ({}));

describe('buildManualApprovalUrl trailing slashes', () => {
	it.each([
		['https://app/approve/', 'https://app/approve/tok'],
		['https://app/approve', 'https://app/approve/tok'],
		['https://app/approve///', 'https://app/approve/tok'],
		['', '/tok'],
	])('%s', (base, want) => {
		expect(buildManualApprovalUrl(base, 'tok')).toBe(want);
	});

	it('is linear on a long run of slashes', () => {
		const t0 = Date.now();
		buildManualApprovalUrl(`https://app${'/'.repeat(50_000)}x`, 'tok');
		expect(Date.now() - t0).toBeLessThan(100);
	});
});

describe('parseDurationMs', () => {
	it.each([
		['30s', 30_000],
		['10m', 600_000],
		['1h', 3_600_000],
		['2h30m', 9_000_000],
		['1d', 86_400_000],
		['12x3s', 3_000],
		['12', 600_000],
		['', 600_000],
		['0s', 600_000],
	])('%s', (input, want) => {
		expect(parseDurationMs(input)).toBe(want);
	});

	it('is linear on a long run of digits with no unit', () => {
		const t0 = Date.now();
		parseDurationMs('0'.repeat(50_000));
		expect(Date.now() - t0).toBeLessThan(100);
	});
});
