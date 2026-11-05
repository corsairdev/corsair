import { formatHubApiErrorMessage } from '../hub/contracts/connect-api';

describe('formatHubApiErrorMessage', () => {
	it('includes hint, fix steps, and received diagnostics', () => {
		const text = formatHubApiErrorMessage(
			{
				error: 'Managed pricing could not mint credentials.',
				code: 'METERED_OPERATION_REQUIRED',
				hint: 'Not an API key issue.',
				fix: ['Redeploy cloud-runtime', 'Set Hub prices'],
				received: { corsairSdkVersion: '0.1.144' },
			},
			400,
		);

		expect(text).toContain('Managed pricing could not mint credentials.');
		expect(text).toContain('METERED_OPERATION_REQUIRED');
		expect(text).toContain('Not an API key issue.');
		expect(text).toContain('- Redeploy cloud-runtime');
		expect(text).toContain('0.1.144');
	});
});
