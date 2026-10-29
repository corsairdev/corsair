import { makeEnginemailerRequest } from './client';
import {
	campaignEndpoints,
	n8nEndpoints,
	subscriberEndpoints,
} from './endpoints';
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
const ctx = { key: 'test-api-key' };
type RouteCase = [
	string,
	(context: never, input: never) => Promise<unknown>,
	unknown,
	string,
	string,
];

beforeEach(() => {
	request.mockResolvedValue({ Result: {} });
	n8nRequest.mockResolvedValue({});
});
afterEach(() => jest.clearAllMocks());

describe('Enginemailer endpoint routes', () => {
	it.each([
		[
			'subscribers.get',
			subscriberEndpoints.get,
			{ email: 'person@example.com' },
			'GET',
			'/restapi/subscriber/emsubscriber/getSubscriber',
		],
		[
			'subscribers.activate',
			subscriberEndpoints.activate,
			{ email: 'person@example.com' },
			'POST',
			'/restapi/subscriber/emsubscriber/activateSubscriber',
		],
		[
			'subscribers.insert',
			subscriberEndpoints.insert,
			{ email: 'person@example.com' },
			'POST',
			'/restapi/subscriber/emsubscriber/insertSubscriber',
		],
		[
			'subscribers.update',
			subscriberEndpoints.update,
			{ email: 'person@example.com' },
			'POST',
			'/restapi/subscriber/emsubscriber/updateSubscriber',
		],
		[
			'subscribers.unsubscribe',
			subscriberEndpoints.unsubscribe,
			{ email: 'person@example.com' },
			'GET',
			'/restapi/subscriber/emsubscriber/unSubSubscriber',
		],
		[
			'subscribers.getSubcategories',
			subscriberEndpoints.getSubcategories,
			{},
			'GET',
			'/restapi/subscriber/emsubscriber/getSubCategory',
		],
		[
			'subscribers.updateCategory',
			subscriberEndpoints.updateCategory,
			{ categoryID: 1, categoryName: 'Customers' },
			'POST',
			'/restapi/subscriber/emsubscriber/updateCategory',
		],
		[
			'subscribers.getCustomFields',
			subscriberEndpoints.getCustomFields,
			{},
			'GET',
			'/restapi/subscriber/emsubscriber/getCustomField',
		],
		[
			'subscribers.batchUpdateSubscribers',
			subscriberEndpoints.batchUpdateSubscribers,
			{ subscribers: [{ email: 'person@example.com' }] },
			'POST',
			'/restapi/subscriber/emsubscriber/batchUpdateSubscribers',
		],
		[
			'subscribers.batchUpdateStatus',
			subscriberEndpoints.batchUpdateStatus,
			{ ID: 1 },
			'POST',
			'/restapi/subscriber/emsubscriber/batchUpdateStatus',
		],
		[
			'subscribers.deleteSubscriber',
			subscriberEndpoints.deleteSubscriber,
			{ email: 'person@example.com' },
			'POST',
			'/restapi/subscriber/emsubscriber/deleteSubscriber',
		],
		[
			'campaigns.listCampaigns',
			campaignEndpoints.listCampaigns,
			{},
			'GET',
			'/restapi/campaign/emcampaign/ListCampaign',
		],
		[
			'campaigns.createCampaign',
			campaignEndpoints.createCampaign,
			{
				CampaignName: 'Test',
				SenderName: 'Sender',
				SenderEmail: 'sender@example.com',
				Subject: 'Subject',
				Content: '<p>Hi</p>',
			},
			'POST',
			'/restapi/Campaign/EMCampaign/CreateCampaign',
		],
		[
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
			'POST',
			'/restapi/Campaign/EMCampaign/UpdateCampaign',
		],
		[
			'campaigns.deleteCampaign',
			campaignEndpoints.deleteCampaign,
			{ campaignid: 1 },
			'GET',
			'/restapi/campaign/emcampaign/deletecampaign',
		],
		[
			'campaigns.assignRecipientList',
			campaignEndpoints.assignRecipientList,
			{ campaignid: 1 },
			'POST',
			'/restapi/campaign/emcampaign/AssignRecipientList',
		],
		[
			'campaigns.deleteRecipientList',
			campaignEndpoints.deleteRecipientList,
			{ campaignid: 1 },
			'GET',
			'/restapi/campaign/emcampaign/deleteRecipientList',
		],
		[
			'campaigns.pauseCampaign',
			campaignEndpoints.pauseCampaign,
			{ campaignid: 1 },
			'GET',
			'/restapi/campaign/emcampaign/PauseCampaign',
		],
		[
			'campaigns.sendCampaign',
			campaignEndpoints.sendCampaign,
			{ campaignid: 1 },
			'GET',
			'/restapi/campaign/emcampaign/SendCampaign',
		],
		[
			'n8n.addOrUpdateSubscriber',
			n8nEndpoints.addOrUpdateSubscriber,
			{ email: 'person@example.com' },
			'POST',
			'/addupdatesubscriber',
		],
		[
			'n8n.deactivateSubscriber',
			n8nEndpoints.deactivateSubscriber,
			{ email: 'person@example.com' },
			'POST',
			'/unsubscribe',
		],
		[
			'n8n.deleteN8nSubscriber',
			n8nEndpoints.deleteN8nSubscriber,
			{ email: 'person@example.com' },
			'POST',
			'/deletesubscriber',
		],
		[
			'n8n.findSubscriber',
			n8nEndpoints.findSubscriber,
			{ email: 'person@example.com' },
			'POST',
			'/findsubscriber',
		],
		[
			'n8n.sendEmail',
			n8nEndpoints.sendEmail,
			{ email: 'person@example.com', type: 'html' },
			'POST',
			'/sendemail',
		],
		[
			'n8n.tagSubscriber',
			n8nEndpoints.tagSubscriber,
			{ email: 'person@example.com', subcategories: [1] },
			'POST',
			'/tagtosubcategory',
		],
		[
			'n8n.untagSubscriber',
			n8nEndpoints.untagSubscriber,
			{ email: 'person@example.com', subcategories: [1] },
			'POST',
			'/untagtosubcategory',
		],
		...(
			[
				['newSubscribers', '/newsubscribers'],
				['unsubscribedSubscribers', '/unsubscribe'],
				['taggedSubscribers', '/subscriberstagged'],
				['deletedSubscribers', '/subscribersdeleted'],
				['untaggedSubscribers', '/subscribersuntagged'],
				['modifiedSubscribers', '/subscribersmodified'],
				['autoresponderTriggered', '/subscriberautorespondertriggered'],
				['autoresponderCompleted', '/subscriberautorespondercompleted'],
				['connect', '/connect'],
				['listForms', '/listforms'],
				['listPages', '/listpages'],
				['listPopups', '/listpopups'],
			] as const
		).map(([name, path]) => [
			`n8n.${name}`,
			n8nEndpoints[name],
			{},
			'GET',
			path,
		]),
	] as unknown as RouteCase[])(
		'%s uses the documented route',
		async (name, endpoint, input, method, path) => {
			await endpoint(ctx as never, input as never);
			expect(
				name.startsWith('n8n.') ? n8nRequest : request,
			).toHaveBeenCalledWith(
				path,
				'test-api-key',
				expect.objectContaining({ method }),
			);
		},
	);

	it('passes GET inputs as query and POST inputs as JSON body', async () => {
		await subscriberEndpoints.get(ctx as never, {
			email: 'person@example.com',
		});
		expect(request).toHaveBeenLastCalledWith(
			'/restapi/subscriber/emsubscriber/getSubscriber',
			'test-api-key',
			expect.objectContaining({ query: { email: 'person@example.com' } }),
		);
		await subscriberEndpoints.insert(ctx as never, {
			email: 'person@example.com',
		});
		expect(request).toHaveBeenLastCalledWith(
			'/restapi/subscriber/emsubscriber/insertSubscriber',
			'test-api-key',
			expect.objectContaining({ body: { email: 'person@example.com' } }),
		);
	});
});
