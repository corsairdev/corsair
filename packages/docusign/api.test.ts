import { z } from 'zod';
import { DocusignClient } from './client';
import { getEnvelope, listOAuthUserInfo, listTemplates } from './endpoints';

const accessToken = process.env.DOCUSIGN_ACCESS_TOKEN;
const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
const baseUri = process.env.DOCUSIGN_BASE_URI;
const envelopeId = process.env.DOCUSIGN_TEST_ENVELOPE_ID;

const describeLive = accessToken && accountId ? describe : describe.skip;

const UserInfoSchema = z
	.object({
		sub: z.string(),
		accounts: z.array(
			z.object({
				account_id: z.string(),
				base_uri: z.string(),
			}),
		),
	})
	.passthrough();

describeLive('DocuSign live API', () => {
	const client = new DocusignClient({
		accessToken: accessToken ?? '',
		accountId: accountId ?? '',
		...(baseUri === undefined ? {} : { baseUri }),
	});

	it('validates the token and returns accounts via userinfo', async () => {
		const data = UserInfoSchema.parse(await listOAuthUserInfo(client, {}));
		expect(typeof data.sub).toBe('string');
		expect(data.accounts.length).toBeGreaterThan(0);
	});

	it('lists templates for the account', async () => {
		const data = await listTemplates({ client }, { count: 5 });
		const parsed = z
			.object({
				envelopeTemplates: z.array(z.record(z.string(), z.unknown())),
			})
			.passthrough()
			.safeParse(data);
		expect(parsed.success).toBe(true);
	});

	it('reads an envelope when DOCUSIGN_TEST_ENVELOPE_ID is set', async () => {
		if (!envelopeId) {
			return;
		}
		const data = await getEnvelope(client, { envelopeId });
		const parsed = z
			.object({ envelopeId: z.string(), status: z.string() })
			.passthrough()
			.safeParse(data);
		expect(parsed.success).toBe(true);
	});
});
