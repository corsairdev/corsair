import { deployHQEndpointMeta } from './index';

// Plugin rule R8: an operation that sends a message (an email here) is destructive.
describe('DeployHQ risk levels', () => {
	it.each([
		'users.createUser',
		'users.resendInvitationUserResendInvitation',
		'signup.createSignup',
		'account.resetPasswordSubmitReset',
	] as const)('marks %s, which sends an email, destructive', (path) => {
		expect(deployHQEndpointMeta[path].riskLevel).toBe('destructive');
	});
});
