import 'dotenv/config';
import { MailboxLayerAPIError, makeMailboxLayerRequest } from './client';
import type { CheckResponse } from './endpoints/types';
import { MailboxLayerEndpointOutputSchemas } from './endpoints/types';

const ACCESS_KEY = process.env.MAILBOXLAYER_API_KEY;

const describeIfKey = ACCESS_KEY ? describe : describe.skip;

describeIfKey('MailboxLayer API Type Tests', () => {
	describe('email check', () => {
		it('check returns correct type for a deliverable address', async () => {
			const response = await makeMailboxLayerRequest<CheckResponse>(
				'check',
				ACCESS_KEY!,
				{ query: { email: 'support@apilayer.net', smtp: 1, format: 1 } },
			);

			MailboxLayerEndpointOutputSchemas.check.parse(response);
			expect(response.email).toBe('support@apilayer.net');
			expect(typeof response.format_valid).toBe('boolean');
			expect(typeof response.score).toBe('number');
		});

		it('rejects a malformed address with apiCode 211 (invalid_email_address)', async () => {
			await expect(
				makeMailboxLayerRequest<CheckResponse>('check', ACCESS_KEY!, {
					query: { email: 'not-a-valid-email', smtp: 1, format: 1 },
				}),
			).rejects.toMatchObject({
				constructor: MailboxLayerAPIError,
				apiCode: 211,
			});
		});

		it('check returns format_valid:true but mx_found:false for a well-formed address on a non-existent domain', async () => {
			const response = await makeMailboxLayerRequest<CheckResponse>(
				'check',
				ACCESS_KEY!,
				{
					query: {
						email: 'someone@this-domain-does-not-exist-corsair-test.invalid',
						smtp: 1,
						format: 1,
					},
				},
			);

			const parsed = MailboxLayerEndpointOutputSchemas.check.parse(response);
			expect(parsed.format_valid).toBe(true);
			expect(parsed.mx_found).toBe(false);
		});

		it('check skips the SMTP probe when smtp=0', async () => {
			const response = await makeMailboxLayerRequest<CheckResponse>(
				'check',
				ACCESS_KEY!,
				{ query: { email: 'someone@gmail.com', smtp: 0, format: 1 } },
			);

			MailboxLayerEndpointOutputSchemas.check.parse(response);
			expect(response.email).toBe('someone@gmail.com');
		});
	});
});
