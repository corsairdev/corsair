import { assertModeAllows, runWithMode } from '../core/permissions';
import { PermissionRequiredError } from '../core/permissions/errors/permission-required';

// The entity store records no approval state, so anything short of allow is
// refused rather than held.
describe('assertModeAllows', () => {
	const path = 'slack.db.channels.deleteById';

	it('allows everything with no scope open', () => {
		expect(() => assertModeAllows(path, 'destructive')).not.toThrow();
	});

	it('refuses a destructive call under strict', () => {
		runWithMode('strict', () => {
			expect(() => assertModeAllows(path, 'destructive')).toThrow(
				PermissionRequiredError,
			);
		});
	});

	it('refuses a destructive call under cautious, which would need approval', () => {
		runWithMode('cautious', () => {
			expect(() => assertModeAllows(path, 'destructive')).toThrow(
				PermissionRequiredError,
			);
		});
	});

	it('allows a write under cautious', () => {
		runWithMode('cautious', () => {
			expect(() => assertModeAllows(path, 'write')).not.toThrow();
		});
	});

	it('refuses a write under readonly and allows a read', () => {
		runWithMode('readonly', () => {
			expect(() => assertModeAllows(path, 'write')).toThrow();
			expect(() => assertModeAllows(path, 'read')).not.toThrow();
		});
	});

	it('allows everything under open', () => {
		runWithMode('open', () => {
			expect(() => assertModeAllows(path, 'destructive')).not.toThrow();
		});
	});

	it('names the mode that refused it', () => {
		runWithMode('strict', () => {
			expect(() => assertModeAllows(path, 'destructive')).toThrow(/strict/);
		});
	});
});
