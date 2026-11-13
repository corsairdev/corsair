import fixtures from './fixtures.json';
import type { PostalyticsContext } from './index';
import { postalytics, postalyticsEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	AuthMissingError: class AuthMissingError extends Error {},
}));

const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;
// Endpoint handlers only read key and options; Corsair normally supplies the remaining context.
const context = { key: 'fixture-key', options: {} } as PostalyticsContext;

beforeAll(() => {
	globalThis.fetch = fetchMock as typeof fetch;
});
afterAll(() => {
	globalThis.fetch = originalFetch;
});
beforeEach(() => fetchMock.mockReset());

const endpoints = postalytics().endpoints!;
const operations = {
	'account.getIntegrations': (input: object) =>
		endpoints.account.getIntegrations(
			context,
			postalyticsEndpointSchemas['account.getIntegrations'].input.parse(input),
		),
	'account.getMyAccount': (input: object) =>
		endpoints.account.getMyAccount(
			context,
			postalyticsEndpointSchemas['account.getMyAccount'].input.parse(input),
		),
	'account.getAccount': (input: object) =>
		endpoints.account.getAccount(
			context,
			postalyticsEndpointSchemas['account.getAccount'].input.parse(input),
		),
	'account.createNewAccount': (input: object) =>
		endpoints.account.createNewAccount(
			context,
			postalyticsEndpointSchemas['account.createNewAccount'].input.parse(input),
		),
	'account.updateAccount': (input: object) =>
		endpoints.account.updateAccount(
			context,
			postalyticsEndpointSchemas['account.updateAccount'].input.parse(input),
		),
	'account.deleteAccount': (input: object) =>
		endpoints.account.deleteAccount(
			context,
			postalyticsEndpointSchemas['account.deleteAccount'].input.parse(input),
		),
	'campaigns.getAllCampaigns': (input: object) =>
		endpoints.campaigns.getAllCampaigns(
			context,
			postalyticsEndpointSchemas['campaigns.getAllCampaigns'].input.parse(
				input,
			),
		),
	'campaigns.getAllDripCampaigns': (input: object) =>
		endpoints.campaigns.getAllDripCampaigns(
			context,
			postalyticsEndpointSchemas['campaigns.getAllDripCampaigns'].input.parse(
				input,
			),
		),
	'campaigns.getCampaignStats': (input: object) =>
		endpoints.campaigns.getCampaignStats(
			context,
			postalyticsEndpointSchemas['campaigns.getCampaignStats'].input.parse(
				input,
			),
		),
	'campaigns.getCampaign': (input: object) =>
		endpoints.campaigns.getCampaign(
			context,
			postalyticsEndpointSchemas['campaigns.getCampaign'].input.parse(input),
		),
	'campaigns.getCampaignEvents': (input: object) =>
		endpoints.campaigns.getCampaignEvents(
			context,
			postalyticsEndpointSchemas['campaigns.getCampaignEvents'].input.parse(
				input,
			),
		),
	'campaigns.getContactEvent': (input: object) =>
		endpoints.campaigns.getContactEvent(
			context,
			postalyticsEndpointSchemas['campaigns.getContactEvent'].input.parse(
				input,
			),
		),
	'campaigns.createNewCampaign': (input: object) =>
		endpoints.campaigns.createNewCampaign(
			context,
			postalyticsEndpointSchemas['campaigns.createNewCampaign'].input.parse(
				input,
			),
		),
	'campaigns.updateCampaignStatus': (input: object) =>
		endpoints.campaigns.updateCampaignStatus(
			context,
			postalyticsEndpointSchemas['campaigns.updateCampaignStatus'].input.parse(
				input,
			),
		),
	'campaigns.deleteCampaign': (input: object) =>
		endpoints.campaigns.deleteCampaign(
			context,
			postalyticsEndpointSchemas['campaigns.deleteCampaign'].input.parse(input),
		),
	'contacts.getAllContactLists': (input: object) =>
		endpoints.contacts.getAllContactLists(
			context,
			postalyticsEndpointSchemas['contacts.getAllContactLists'].input.parse(
				input,
			),
		),
	'contacts.getContact': (input: object) =>
		endpoints.contacts.getContact(
			context,
			postalyticsEndpointSchemas['contacts.getContact'].input.parse(input),
		),
	'contacts.getContactsOnList': (input: object) =>
		endpoints.contacts.getContactsOnList(
			context,
			postalyticsEndpointSchemas['contacts.getContactsOnList'].input.parse(
				input,
			),
		),
	'contacts.createContactOnList': (input: object) =>
		endpoints.contacts.createContactOnList(
			context,
			postalyticsEndpointSchemas['contacts.createContactOnList'].input.parse(
				input,
			),
		),
	'contacts.updateContactOnList': (input: object) =>
		endpoints.contacts.updateContactOnList(
			context,
			postalyticsEndpointSchemas['contacts.updateContactOnList'].input.parse(
				input,
			),
		),
	'contacts.deleteContact': (input: object) =>
		endpoints.contacts.deleteContact(
			context,
			postalyticsEndpointSchemas['contacts.deleteContact'].input.parse(input),
		),
	'flows.getAllFlows': (input: object) =>
		endpoints.flows.getAllFlows(
			context,
			postalyticsEndpointSchemas['flows.getAllFlows'].input.parse(input),
		),
	'flows.getFlow': (input: object) =>
		endpoints.flows.getFlow(
			context,
			postalyticsEndpointSchemas['flows.getFlow'].input.parse(input),
		),
	'flows.enrollContactToFlow': (input: object) =>
		endpoints.flows.enrollContactToFlow(
			context,
			postalyticsEndpointSchemas['flows.enrollContactToFlow'].input.parse(
				input,
			),
		),
	'flows.unenrollContactFromFlow': (input: object) =>
		endpoints.flows.unenrollContactFromFlow(
			context,
			postalyticsEndpointSchemas['flows.unenrollContactFromFlow'].input.parse(
				input,
			),
		),
	'login.createLoginLink': (input: object) =>
		endpoints.login.createLoginLink(
			context,
			postalyticsEndpointSchemas['login.createLoginLink'].input.parse(input),
		),
	'mail.sendMail': (input: object) =>
		endpoints.mail.sendMail(
			context,
			postalyticsEndpointSchemas['mail.sendMail'].input.parse(input),
		),
	'suppressionLists.getSuppressionLists': (input: object) =>
		endpoints.suppressionLists.getSuppressionLists(
			context,
			postalyticsEndpointSchemas[
				'suppressionLists.getSuppressionLists'
			].input.parse(input),
		),
	'suppressionLists.getSuppressionList': (input: object) =>
		endpoints.suppressionLists.getSuppressionList(
			context,
			postalyticsEndpointSchemas[
				'suppressionLists.getSuppressionList'
			].input.parse(input),
		),
	'suppressionLists.createSuppressionList': (input: object) =>
		endpoints.suppressionLists.createSuppressionList(
			context,
			postalyticsEndpointSchemas[
				'suppressionLists.createSuppressionList'
			].input.parse(input),
		),
	'suppressionLists.deleteSuppressionList': (input: object) =>
		endpoints.suppressionLists.deleteSuppressionList(
			context,
			postalyticsEndpointSchemas[
				'suppressionLists.deleteSuppressionList'
			].input.parse(input),
		),
	'suppressionContacts.getSuppressionListContacts': (input: object) =>
		endpoints.suppressionContacts.getSuppressionListContacts(
			context,
			postalyticsEndpointSchemas[
				'suppressionContacts.getSuppressionListContacts'
			].input.parse(input),
		),
	'suppressionContacts.getSuppressionListContact': (input: object) =>
		endpoints.suppressionContacts.getSuppressionListContact(
			context,
			postalyticsEndpointSchemas[
				'suppressionContacts.getSuppressionListContact'
			].input.parse(input),
		),
	'suppressionContacts.createSuppressionListContact': (input: object) =>
		endpoints.suppressionContacts.createSuppressionListContact(
			context,
			postalyticsEndpointSchemas[
				'suppressionContacts.createSuppressionListContact'
			].input.parse(input),
		),
	'suppressionContacts.updateSuppressionListContact': (input: object) =>
		endpoints.suppressionContacts.updateSuppressionListContact(
			context,
			postalyticsEndpointSchemas[
				'suppressionContacts.updateSuppressionListContact'
			].input.parse(input),
		),
	'suppressionContacts.deleteSuppressionListContact': (input: object) =>
		endpoints.suppressionContacts.deleteSuppressionListContact(
			context,
			postalyticsEndpointSchemas[
				'suppressionContacts.deleteSuppressionListContact'
			].input.parse(input),
		),
	'templates.getAllTemplates': (input: object) =>
		endpoints.templates.getAllTemplates(
			context,
			postalyticsEndpointSchemas['templates.getAllTemplates'].input.parse(
				input,
			),
		),
	'templates.getTemplate': (input: object) =>
		endpoints.templates.getTemplate(
			context,
			postalyticsEndpointSchemas['templates.getTemplate'].input.parse(input),
		),
	'templates.createTemplate': (input: object) =>
		endpoints.templates.createTemplate(
			context,
			postalyticsEndpointSchemas['templates.createTemplate'].input.parse(input),
		),
	'templates.deleteTemplate': (input: object) =>
		endpoints.templates.deleteTemplate(
			context,
			postalyticsEndpointSchemas['templates.deleteTemplate'].input.parse(input),
		),
	'webhooks.getAllWebhooks': (input: object) =>
		endpoints.webhooks.getAllWebhooks(
			context,
			postalyticsEndpointSchemas['webhooks.getAllWebhooks'].input.parse(input),
		),
	'webhooks.getWebhook': (input: object) =>
		endpoints.webhooks.getWebhook(
			context,
			postalyticsEndpointSchemas['webhooks.getWebhook'].input.parse(input),
		),
	'webhooks.createWebhook': (input: object) =>
		endpoints.webhooks.createWebhook(
			context,
			postalyticsEndpointSchemas['webhooks.createWebhook'].input.parse(input),
		),
	'webhooks.updateWebhook': (input: object) =>
		endpoints.webhooks.updateWebhook(
			context,
			postalyticsEndpointSchemas['webhooks.updateWebhook'].input.parse(input),
		),
	'webhooks.deleteWebhook': (input: object) =>
		endpoints.webhooks.deleteWebhook(
			context,
			postalyticsEndpointSchemas['webhooks.deleteWebhook'].input.parse(input),
		),
} satisfies Record<
	keyof typeof postalyticsEndpointSchemas,
	(input: object) => Promise<object>
>;

describe('all documented Postalytics operations', () => {
	// Response fixtures use documented field examples; is_proofed has no provider
	// example, so the two template reads use a representative valid boolean.
	it('covers the complete 45-operation registry', () => {
		expect(fixtures).toHaveLength(45);
		expect(Object.keys(operations)).toHaveLength(45);
		expect(
			new Set(fixtures.map(({ group, name }) => `${group}.${name}`)).size,
		).toBe(45);
	});
	for (const fixture of fixtures) {
		it(`${fixture.method} ${fixture.path}`, async () => {
			fetchMock.mockResolvedValue(
				new Response(JSON.stringify(fixture.output), { status: 200 }),
			);
			const key = `${fixture.group}.${fixture.name}`;
			if (!Object.hasOwn(operations, key))
				throw new Error(`Missing endpoint ${key}`);
			// The runtime membership check narrows the JSON fixture key to the typed registry.
			const operation = operations[key as keyof typeof operations];
			expect(await operation(fixture.input)).toEqual(fixture.output);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`https://api.postalytics.com${fixture.path}`);
			expect(init.method).toBe(fixture.method);
			expect(new Headers(init.headers).get('Authorization')).toBe(
				`Basic ${Buffer.from('fixture-key:').toString('base64')}`,
			);
			if ('body' in fixture.input)
				expect(JSON.parse(String(init.body))).toEqual(fixture.input.body);
			else expect(init.body).toBeUndefined();
		});
	}
});
