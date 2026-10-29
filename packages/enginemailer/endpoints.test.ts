import { makeEnginemailerRequest } from './client';
import {
	campaignEndpoints,
	n8nEndpoints,
	subscriberEndpoints,
} from './endpoints';
import type { EnginemailerContext } from './index';
import { makeEnginemailerN8nRequest } from './n8n-client';

jest.mock('./client', () => ({
	makeEnginemailerRequest: jest.fn(),
}));
jest.mock('./n8n-client', () => ({
	makeEnginemailerN8nRequest: jest.fn(),
}));

const request = makeEnginemailerRequest as jest.MockedFunction<
	typeof makeEnginemailerRequest
>;
const n8nRequest = makeEnginemailerN8nRequest as jest.MockedFunction<
	typeof makeEnginemailerN8nRequest
>;
const ctx = { key: 'test-api-key' } as EnginemailerContext;
type RouteCase = {
	name: string;
	run: () => Promise<unknown>;
	transport: 'rest' | 'n8n';
	method: string;
	path: string;
};

const routeCase = <Input>(
	name: string,
	endpoint: (context: EnginemailerContext, input: Input) => Promise<unknown>,
	input: Input,
	transport: RouteCase['transport'],
	method: string,
	path: string,
): RouteCase => ({
	name,
	run: () => endpoint(ctx, input),
	transport,
	method,
	path,
});

beforeEach(() => {
	request.mockResolvedValue({ Result: {} });
	n8nRequest.mockResolvedValue({});
});
afterEach(() => jest.clearAllMocks());

describe('Enginemailer endpoint routes', () => {
	it.each<RouteCase>([
		routeCase(
			'subscribers.get',
			subscriberEndpoints.get,
			{ email: 'person@example.com' },
			'rest',
			'GET',
			'/restapi/subscriber/emsubscriber/getSubscriber',
		),
		routeCase(
			'subscribers.activate',
			subscriberEndpoints.activate,
			{ email: 'person@example.com' },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/activateSubscriber',
		),
		routeCase(
			'subscribers.insert',
			subscriberEndpoints.insert,
			{ email: 'person@example.com' },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/insertSubscriber',
		),
		routeCase(
			'subscribers.update',
			subscriberEndpoints.update,
			{ email: 'person@example.com' },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/updateSubscriber',
		),
		routeCase(
			'subscribers.unsubscribe',
			subscriberEndpoints.unsubscribe,
			{ email: 'person@example.com' },
			'rest',
			'GET',
			'/restapi/subscriber/emsubscriber/unSubSubscriber',
		),
		routeCase(
			'subscribers.getSubcategories',
			subscriberEndpoints.getSubcategories,
			{},
			'rest',
			'GET',
			'/restapi/subscriber/emsubscriber/getSubCategory',
		),
		routeCase(
			'subscribers.updateCategory',
			subscriberEndpoints.updateCategory,
			{ categoryID: 1, categoryName: 'Customers' },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/updateCategory',
		),
		routeCase(
			'subscribers.getCustomFields',
			subscriberEndpoints.getCustomFields,
			{},
			'rest',
			'GET',
			'/restapi/subscriber/emsubscriber/getCustomField',
		),
		routeCase(
			'subscribers.batchUpdateSubscribers',
			subscriberEndpoints.batchUpdateSubscribers,
			{ subscribers: [{ email: 'person@example.com' }] },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/batchUpdateSubscribers',
		),
		routeCase(
			'subscribers.batchUpdateStatus',
			subscriberEndpoints.batchUpdateStatus,
			{ ID: 1 },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/batchUpdateStatus',
		),
		routeCase(
			'subscribers.deleteSubscriber',
			subscriberEndpoints.deleteSubscriber,
			{ email: 'person@example.com' },
			'rest',
			'POST',
			'/restapi/subscriber/emsubscriber/deleteSubscriber',
		),
		routeCase(
			'campaigns.listCampaigns',
			campaignEndpoints.listCampaigns,
			{},
			'rest',
			'GET',
			'/restapi/campaign/emcampaign/ListCampaign',
		),
		routeCase(
			'campaigns.createCampaign',
			campaignEndpoints.createCampaign,
			{
				CampaignName: 'Test',
				SenderName: 'Sender',
				SenderEmail: 'sender@example.com',
				Subject: 'Subject',
				Content: '<p>Hi</p>',
			},
			'rest',
			'POST',
			'/restapi/Campaign/EMCampaign/CreateCampaign',
		),
		routeCase(
			'campaigns.updateCampaign',
			campaignEndpoints.updateCampaign,
			{
				CampaignID: 1,
				CampaignName: 'Test',
				SenderName: 'Sender',
				SenderEmail: 'sender@example.com',
				Subject: 'Subject',
				Content: '<p>Hi</p>',
			},
			'rest',
			'POST',
			'/restapi/Campaign/EMCampaign/UpdateCampaign',
		),
		routeCase(
			'campaigns.deleteCampaign',
			campaignEndpoints.deleteCampaign,
			{ campaignid: 1 },
			'rest',
			'GET',
			'/restapi/campaign/emcampaign/deletecampaign',
		),
		routeCase(
			'campaigns.assignRecipientList',
			campaignEndpoints.assignRecipientList,
			{ campaignid: 1 },
			'rest',
			'POST',
			'/restapi/campaign/emcampaign/AssignRecipientList',
		),
		routeCase(
			'campaigns.deleteRecipientList',
			campaignEndpoints.deleteRecipientList,
			{ campaignid: 1 },
			'rest',
			'GET',
			'/restapi/campaign/emcampaign/deleteRecipientList',
		),
		routeCase(
			'campaigns.pauseCampaign',
			campaignEndpoints.pauseCampaign,
			{ campaignid: 1 },
			'rest',
			'GET',
			'/restapi/campaign/emcampaign/PauseCampaign',
		),
		routeCase(
			'campaigns.sendCampaign',
			campaignEndpoints.sendCampaign,
			{ campaignid: 1 },
			'rest',
			'GET',
			'/restapi/campaign/emcampaign/SendCampaign',
		),
		routeCase(
			'n8n.addOrUpdateSubscriber',
			n8nEndpoints.addOrUpdateSubscriber,
			{ email: 'person@example.com' },
			'n8n',
			'POST',
			'/addupdatesubscriber',
		),
		routeCase(
			'n8n.deactivateSubscriber',
			n8nEndpoints.deactivateSubscriber,
			{ email: 'person@example.com' },
			'n8n',
			'POST',
			'/unsubscribe',
		),
		routeCase(
			'n8n.deleteN8nSubscriber',
			n8nEndpoints.deleteN8nSubscriber,
			{ email: 'person@example.com' },
			'n8n',
			'POST',
			'/deletesubscriber',
		),
		routeCase(
			'n8n.findSubscriber',
			n8nEndpoints.findSubscriber,
			{ email: 'person@example.com' },
			'n8n',
			'POST',
			'/findsubscriber',
		),
		routeCase(
			'n8n.sendEmail',
			n8nEndpoints.sendEmail,
			{ email: 'person@example.com', type: 'html' },
			'n8n',
			'POST',
			'/sendemail',
		),
		routeCase(
			'n8n.tagSubscriber',
			n8nEndpoints.tagSubscriber,
			{ email: 'person@example.com', subcategories: [1] },
			'n8n',
			'POST',
			'/tagtosubcategory',
		),
		routeCase(
			'n8n.untagSubscriber',
			n8nEndpoints.untagSubscriber,
			{ email: 'person@example.com', subcategories: [1] },
			'n8n',
			'POST',
			'/untagtosubcategory',
		),
		routeCase(
			'n8n.newSubscribers',
			n8nEndpoints.newSubscribers,
			{},
			'n8n',
			'GET',
			'/newsubscribers',
		),
		routeCase(
			'n8n.unsubscribedSubscribers',
			n8nEndpoints.unsubscribedSubscribers,
			{},
			'n8n',
			'GET',
			'/unsubscribe',
		),
		routeCase(
			'n8n.taggedSubscribers',
			n8nEndpoints.taggedSubscribers,
			{},
			'n8n',
			'GET',
			'/subscriberstagged',
		),
		routeCase(
			'n8n.deletedSubscribers',
			n8nEndpoints.deletedSubscribers,
			{},
			'n8n',
			'GET',
			'/subscribersdeleted',
		),
		routeCase(
			'n8n.untaggedSubscribers',
			n8nEndpoints.untaggedSubscribers,
			{},
			'n8n',
			'GET',
			'/subscribersuntagged',
		),
		routeCase(
			'n8n.modifiedSubscribers',
			n8nEndpoints.modifiedSubscribers,
			{},
			'n8n',
			'GET',
			'/subscribersmodified',
		),
		routeCase(
			'n8n.autoresponderTriggered',
			n8nEndpoints.autoresponderTriggered,
			{},
			'n8n',
			'GET',
			'/subscriberautorespondertriggered',
		),
		routeCase(
			'n8n.autoresponderCompleted',
			n8nEndpoints.autoresponderCompleted,
			{},
			'n8n',
			'GET',
			'/subscriberautorespondercompleted',
		),
		routeCase(
			'n8n.connect',
			n8nEndpoints.connect,
			{},
			'n8n',
			'GET',
			'/connect',
		),
		routeCase(
			'n8n.listForms',
			n8nEndpoints.listForms,
			{},
			'n8n',
			'GET',
			'/listforms',
		),
		routeCase(
			'n8n.listPages',
			n8nEndpoints.listPages,
			{},
			'n8n',
			'GET',
			'/listpages',
		),
		routeCase(
			'n8n.listPopups',
			n8nEndpoints.listPopups,
			{},
			'n8n',
			'GET',
			'/listpopups',
		),
	])(
		'$name uses the documented route',
		async ({ name, run, transport, method, path }) => {
			await run();
			expect(transport === 'n8n' ? n8nRequest : request).toHaveBeenCalledWith(
				path,
				'test-api-key',
				expect.objectContaining({ method }),
			);
		},
	);

	it('passes GET inputs as query and POST inputs as JSON body', async () => {
		await subscriberEndpoints.get(ctx, {
			email: 'person@example.com',
		});
		expect(request).toHaveBeenLastCalledWith(
			'/restapi/subscriber/emsubscriber/getSubscriber',
			'test-api-key',
			expect.objectContaining({ query: { email: 'person@example.com' } }),
		);
		await subscriberEndpoints.insert(ctx, {
			email: 'person@example.com',
		});
		expect(request).toHaveBeenLastCalledWith(
			'/restapi/subscriber/emsubscriber/insertSubscriber',
			'test-api-key',
			expect.objectContaining({ body: { email: 'person@example.com' } }),
		);
	});

	it('omits the N8N All filter while preserving numeric filters', async () => {
		await n8nEndpoints.newSubscribers(ctx, {
			filter_form: 'All',
			filter_page: 12,
			filter_popups: 'All',
		});

		expect(n8nRequest).toHaveBeenCalledWith(
			'/newsubscribers',
			'test-api-key',
			expect.objectContaining({ query: { filter_page: 12 } }),
		);
	});
});
