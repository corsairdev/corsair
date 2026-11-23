import { makeMailcoachRequest } from './client';
import type { MailcoachEndpointOutputs } from './endpoints/types';
import { MailcoachEndpointOutputSchemas } from './endpoints/types';

const apiKey = process.env.MAILCOACH_API_KEY;
const apiUrl = process.env.MAILCOACH_API_URL;
const canRunLiveSmoke = Boolean(apiKey && apiUrl);

if (!canRunLiveSmoke) {
	console.warn(
		'Skipping Mailcoach live smoke test; set MAILCOACH_API_URL and MAILCOACH_API_KEY to enable it.',
	);
}

describe('Mailcoach live API smoke', () => {
	(canRunLiveSmoke ? it : it.skip)(
		'reads the authenticated token owner without exposing credentials',
		async () => {
			const response = await makeMailcoachRequest<
				MailcoachEndpointOutputs['user.get']
			>('/user', apiKey ?? '', { apiUrl });
			const parsed = MailcoachEndpointOutputSchemas['user.get'].parse(response);
			expect(parsed.data.id).toBeGreaterThan(0);
			expect(parsed.data.email).toContain('@');
		},
	);
});
