/**
 * Benchmark Email integrations endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Integrations folders)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const assignProductToList: BenchmarkEmailEndpoints['integrationsAssignProductToList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsAssignProductToList']
		>(`Integration/ShopifyPurchaseProductList`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.assignProductToList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const configureShopifyPurchaseList: BenchmarkEmailEndpoints['integrationsConfigureShopifyPurchaseList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsConfigureShopifyPurchaseList']
		>(`Integration/ShopifyPurchaseList`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.configureShopifyPurchaseList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const connectService: BenchmarkEmailEndpoints['integrationsConnectService'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsConnectService']
		>(`Integration/AuthUrlExtra/${encodeURIComponent(input.site)}`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.connectService',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteProductAssociation: BenchmarkEmailEndpoints['integrationsDeleteProductAssociation'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDeleteProductAssociation']
		>(
			`Integration/ShopifyPurchaseProduct/${encodeURIComponent(input.productCode)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.deleteProductAssociation',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectEtsyIntegration: BenchmarkEmailEndpoints['integrationsDisconnectEtsyIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectEtsyIntegration']
		>(`Integration/Etsy`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectEtsyIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectEventbriteIntegration: BenchmarkEmailEndpoints['integrationsDisconnectEventbriteIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectEventbriteIntegration']
		>(`Integration/Eventbrite`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectEventbriteIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectFacebookEvents: BenchmarkEmailEndpoints['integrationsDisconnectFacebookEvents'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectFacebookEvents']
		>(`Integration/FacebookEvents`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectFacebookEvents',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectFacebookIntegration: BenchmarkEmailEndpoints['integrationsDisconnectFacebookIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectFacebookIntegration']
		>(`Integration/Facebook`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectFacebookIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectInstagramIntegration: BenchmarkEmailEndpoints['integrationsDisconnectInstagramIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectInstagramIntegration']
		>(`Integration/Instagram`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectInstagramIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectLinkedInIntegration: BenchmarkEmailEndpoints['integrationsDisconnectLinkedInIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectLinkedInIntegration']
		>(`Integration/LinkedIn`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectLinkedInIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectPinterestConnection: BenchmarkEmailEndpoints['integrationsDisconnectPinterestConnection'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectPinterestConnection']
		>(`Integration/Pinterest`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectPinterestConnection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectSalesforceIntegration: BenchmarkEmailEndpoints['integrationsDisconnectSalesforceIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectSalesforceIntegration']
		>(`Integration/SalesForce`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectSalesforceIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectShopify: BenchmarkEmailEndpoints['integrationsDisconnectShopify'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectShopify']
		>(`Integration/Shopify`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectShopify',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectTwitterIntegration: BenchmarkEmailEndpoints['integrationsDisconnectTwitterIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectTwitterIntegration']
		>(`Integration/Twitter`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectTwitterIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const disconnectEbayIntegration: BenchmarkEmailEndpoints['integrationsDisconnectEbayIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsDisconnectEbayIntegration']
		>(`Integration/Ebay`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.disconnectEbayIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const logOutTwitterTweets: BenchmarkEmailEndpoints['integrationsLogOutTwitterTweets'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsLogOutTwitterTweets']
		>(`Integration/TwitterTweets`, ctx.key, { method: 'DELETE' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.logOutTwitterTweets',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getContactListsForShopify: BenchmarkEmailEndpoints['integrationsGetContactListsForShopify'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetContactListsForShopify']
		>(`Integration/Shopify`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getContactListsForShopify',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getDigiohUsername: BenchmarkEmailEndpoints['integrationsGetDigiohUsername'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetDigiohUsername']
		>(`Integration/Digioh`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getDigiohUsername',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEtsyStoreName: BenchmarkEmailEndpoints['integrationsGetEtsyStoreName'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetEtsyStoreName']
		>(`Integration/Etsy`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getEtsyStoreName',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEventbriteUsername: BenchmarkEmailEndpoints['integrationsGetEventbriteUsername'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetEventbriteUsername']
		>(`Integration/Eventbrite`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getEventbriteUsername',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFacebookAccountHolder: BenchmarkEmailEndpoints['integrationsGetFacebookAccountHolder'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetFacebookAccountHolder']
		>(`Integration/Facebook`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getFacebookAccountHolder',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getFacebookAccountName: BenchmarkEmailEndpoints['integrationsGetFacebookAccountName'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetFacebookAccountName']
		>(`Integration/FacebookEvents`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getFacebookAccountName',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getIntegrationAuthURL: BenchmarkEmailEndpoints['integrationsGetIntegrationAuthURL'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetIntegrationAuthURL']
		>(`Integration/Authurl/${encodeURIComponent(input.site)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getIntegrationAuthURL',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getIntegrationConnectionList: BenchmarkEmailEndpoints['integrationsGetIntegrationConnectionList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetIntegrationConnectionList']
		>(`Client/Integrations`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getIntegrationConnectionList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getLinkedInToken: BenchmarkEmailEndpoints['integrationsGetLinkedInToken'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetLinkedInToken']
		>(`Integration/LinkedIn`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getLinkedInToken',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getShopifyProducts: BenchmarkEmailEndpoints['integrationsGetShopifyProducts'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetShopifyProducts']
		>(`Integration/ShopifyProductList`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getShopifyProducts',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getPaypalLists: BenchmarkEmailEndpoints['integrationsGetPaypalLists'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetPaypalLists']
		>(`Integration/Paypal`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getPaypalLists',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getPaypalLink: BenchmarkEmailEndpoints['integrationsGetPaypalLink'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetPaypalLink']
		>(
			`Integration/Paypal/URL/${encodeURIComponent(input.contactMasterID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getPaypalLink',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getPinterestUsername: BenchmarkEmailEndpoints['integrationsGetPinterestUsername'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetPinterestUsername']
		>(`Integration/Pinterest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getPinterestUsername',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getSalesforceStatus: BenchmarkEmailEndpoints['integrationsGetSalesforceStatus'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetSalesforceStatus']
		>(`Integration/SalesForce`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getSalesforceStatus',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getShopifyProductGrid: BenchmarkEmailEndpoints['integrationsGetShopifyProductGrid'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetShopifyProductGrid']
		>(`Integration/ShopifyProductGrid`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getShopifyProductGrid',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getTwitterLogin: BenchmarkEmailEndpoints['integrationsGetTwitterLogin'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetTwitterLogin']
		>(`Integration/Twitter`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getTwitterLogin',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUnbounceLink: BenchmarkEmailEndpoints['integrationsGetUnbounceLink'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetUnbounceLink']
		>(
			`Integration/Unbounce/URL/${encodeURIComponent(input.contactMasterID)}`,
			ctx.key,
			{ method: 'GET' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getUnbounceLink',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getUnbounceLists: BenchmarkEmailEndpoints['integrationsGetUnbounceLists'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetUnbounceLists']
		>(`Integration/Unbounce`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getUnbounceLists',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEbaySellerID: BenchmarkEmailEndpoints['integrationsGetEbaySellerID'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetEbaySellerID']
		>(`Integration/Ebay`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getEbaySellerID',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getEbaySiteList: BenchmarkEmailEndpoints['integrationsGetEbaySiteList'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsGetEbaySiteList']
		>(`Client/Integrations/EbaySite`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.getEbaySiteList',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testEtsyIntegration: BenchmarkEmailEndpoints['integrationsTestEtsyIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestEtsyIntegration']
		>(`Integration/EtsyTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testEtsyIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testEventbriteIntegration: BenchmarkEmailEndpoints['integrationsTestEventbriteIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestEventbriteIntegration']
		>(`Integration/EventbriteTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testEventbriteIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testFacebookEventsIntegration: BenchmarkEmailEndpoints['integrationsTestFacebookEventsIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestFacebookEventsIntegration']
		>(`Integration/FacebookEventsTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testFacebookEventsIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testFacebookIntegration: BenchmarkEmailEndpoints['integrationsTestFacebookIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestFacebookIntegration']
		>(`Integration/FacebookTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testFacebookIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testLinkedInConnection: BenchmarkEmailEndpoints['integrationsTestLinkedInConnection'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestLinkedInConnection']
		>(`Integration/LinkedInTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testLinkedInConnection',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testPinterestIntegration: BenchmarkEmailEndpoints['integrationsTestPinterestIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestPinterestIntegration']
		>(`Integration/PinterestTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testPinterestIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testSalesforceIntegration: BenchmarkEmailEndpoints['integrationsTestSalesforceIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestSalesforceIntegration']
		>(`Integration/SalesForceTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testSalesforceIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testTwitterIntegration: BenchmarkEmailEndpoints['integrationsTestTwitterIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestTwitterIntegration']
		>(`Integration/TwitterTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testTwitterIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testTwitterTweets: BenchmarkEmailEndpoints['integrationsTestTwitterTweets'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestTwitterTweets']
		>(`Integration/TwitterTweetsTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testTwitterTweets',
			{ ...input },
			'completed',
		);
		return response;
	};

export const testEbayIntegration: BenchmarkEmailEndpoints['integrationsTestEbayIntegration'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['integrationsTestEbayIntegration']
		>(`Integration/EbayTest`, ctx.key, { method: 'GET' });

		await logEventFromContext(
			ctx,
			'benchmarkemail.integrations.testEbayIntegration',
			{ ...input },
			'completed',
		);
		return response;
	};
