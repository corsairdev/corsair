import {
	BusinessUnits,
	ConsumerProfiles,
	Consumers,
	DataSolutions,
	Invitations,
	ProductReviews,
	Reviews,
} from './endpoints';

const apiKey = 'trustpilot-endpoint-test-key';
const oauthToken = 'trustpilot-endpoint-test-token';
const context = { key: apiKey };

// `unknown` because the operation return type varies across the documented endpoint schemas.
type EndpointCase = {
	name: string;
	url: string;
	method: string;
	credential: string;
	response: string;
	run: () => Promise<unknown>;
	query?: Record<string, string[]>;
	body?: string;
};

const unitResponse = JSON.stringify({
	id: 'unit-1',
	displayName: 'Example Shop',
	country: 'GB',
	status: 'active',
	numberOfReviews: { total: 1 },
	score: { trustScore: 4.5, stars: 4.5 },
});
const emptyReviews = '{"reviews":[]}';
const endpointCases: EndpointCase[] = [
	{
		name: 'businessUnits.find',
		url: 'https://api.trustpilot.com/v1/business-units/find',
		method: 'GET',
		credential: apiKey,
		response: unitResponse,
		run: () => BusinessUnits.find(context, { name: 'shop.example' }),
		query: { name: ['shop.example'] },
	},
	{
		name: 'businessUnits.get',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1',
		method: 'GET',
		credential: apiKey,
		response: unitResponse,
		run: () => BusinessUnits.get(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.search',
		url: 'https://api.trustpilot.com/v1/business-units/search',
		method: 'GET',
		credential: apiKey,
		response: '{"businessUnits":[]}',
		run: () =>
			BusinessUnits.search(context, {
				query: 'shop',
				country: 'GB',
				page: 1,
				perpage: 10,
			}),
		query: { query: ['shop'], country: ['GB'], page: ['1'], perpage: ['10'] },
	},
	{
		name: 'businessUnits.profileInfo',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/profileinfo',
		method: 'GET',
		credential: apiKey,
		response: '{}',
		run: () => BusinessUnits.profileInfo(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.webLinks',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/web-links',
		method: 'GET',
		credential: apiKey,
		response:
			'{"locale":"en-GB","profileUrl":"https://trustpilot.com/review/shop.example","evaluateUrl":"https://trustpilot.com/evaluate/shop.example","evaluateEmbedUrl":"https://trustpilot.com/evaluate/embed/shop.example"}',
		run: () =>
			BusinessUnits.webLinks(context, {
				businessUnitId: 'unit-1',
				locale: 'en-GB',
			}),
		query: { locale: ['en-GB'] },
	},
	{
		name: 'businessUnits.logo',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/images/logo',
		method: 'GET',
		credential: apiKey,
		response: '{"logoUrl":null}',
		run: () =>
			BusinessUnits.logo(context, {
				businessUnitId: 'unit-1',
				locationId: 'loc-1',
			}),
		query: { locationId: ['loc-1'] },
	},
	{
		name: 'businessUnits.promotionBoxImage',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/images/promotion-box',
		method: 'GET',
		credential: apiKey,
		response: '{"promotionBoxUrl":null}',
		run: () =>
			BusinessUnits.promotionBoxImage(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.headerImage',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/images/header',
		method: 'GET',
		credential: apiKey,
		response: '{"headerUrl":null}',
		run: () => BusinessUnits.headerImage(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.listCategories',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/categories',
		method: 'GET',
		credential: apiKey,
		response: '{"categories":[]}',
		run: () =>
			BusinessUnits.listCategories(context, {
				businessUnitId: 'unit-1',
				country: 'GB',
				locale: 'en-GB',
			}),
		query: { country: ['GB'], locale: ['en-GB'] },
	},
	{
		name: 'businessUnits.publicAll',
		url: 'https://api.trustpilot.com/v1/business-units/all',
		method: 'GET',
		credential: apiKey,
		response: '{"businessUnits":[],"cursor":null}',
		run: () =>
			BusinessUnits.publicAll(context, { perPage: 25, cursor: 'next-cursor' }),
		query: { perPage: ['25'], cursor: ['next-cursor'] },
	},
	{
		name: 'businessUnits.customerGuarantee',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/customerguarantee',
		method: 'GET',
		credential: apiKey,
		response:
			'{"header":"Guarantee","teaser":"Promise","body":"We help.","display":true,"image":{"image184x0":{"url":"https://shop.example/guarantee.png","width":"184"}}}',
		run: () =>
			BusinessUnits.customerGuarantee(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.profilePromotion',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/profilepromotion',
		method: 'GET',
		credential: apiKey,
		response:
			'{"title":"Shop","contactInfoTitle":"Contact","description":{"header":"About","text":"Description"},"sellingPoints":[],"image":{"url":"https://shop.example/brand.png","width":"184"}}',
		run: () =>
			BusinessUnits.profilePromotion(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.publicPromotionBox',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/promotion-box',
		method: 'GET',
		credential: apiKey,
		response:
			'{"header":"Offer","message":"Details","textColor":"#000","backgroundColor":"#fff","buttonText":"Shop","buttonColor":"#000","buttonTextColor":"#fff","buttonLink":"https://shop.example","imageUrl":"https://shop.example/promo.png","isPublished":true}',
		run: () =>
			BusinessUnits.publicPromotionBox(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'businessUnits.reviews',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/reviews',
		method: 'GET',
		credential: apiKey,
		response: emptyReviews,
		run: () =>
			BusinessUnits.reviews(context, {
				businessUnitId: 'unit-1',
				page: 1,
				perPage: 10,
				stars: [5],
			}),
		query: { page: ['1'], perPage: ['10'], stars: ['5'] },
	},
	{
		name: 'businessUnits.allReviews',
		url: 'https://api.trustpilot.com/v1/business-units/unit-1/all-reviews',
		method: 'GET',
		credential: apiKey,
		response: emptyReviews,
		run: () =>
			BusinessUnits.allReviews(context, {
				businessUnitId: 'unit-1',
				pageToken: 'next-page',
			}),
		query: { pageToken: ['next-page'] },
	},
	{
		name: 'businessUnits.privateReviews',
		url: 'https://api.trustpilot.com/v1/private/business-units/unit-1/reviews',
		method: 'GET',
		credential: oauthToken,
		response: emptyReviews,
		run: () =>
			BusinessUnits.privateReviews(
				{ key: oauthToken },
				{
					businessUnitId: 'unit-1',
					page: 1,
					perPage: 2,
					referralEmail: 'private@example.invalid',
				},
			),
		query: {
			page: ['1'],
			perPage: ['2'],
			referralEmail: ['private@example.invalid'],
		},
	},
	{
		name: 'reviews.get',
		url: 'https://api.trustpilot.com/v1/reviews/review-1',
		method: 'GET',
		credential: apiKey,
		response: '{}',
		run: () => Reviews.get(context, { reviewId: 'review-1' }),
	},
	{
		name: 'reviews.getPrivate',
		url: 'https://api.trustpilot.com/v1/private/reviews/review-1',
		method: 'GET',
		credential: oauthToken,
		response: '{}',
		run: () =>
			Reviews.getPrivate({ key: oauthToken }, { reviewId: 'review-1' }),
	},
	{
		name: 'reviews.latest',
		url: 'https://api.trustpilot.com/v1/reviews/latest',
		method: 'GET',
		credential: apiKey,
		response: emptyReviews,
		run: () =>
			Reviews.latest(context, { count: 2, language: ['en'], locale: 'en-GB' }),
		query: { count: ['2'], language: ['en'], locale: ['en-GB'] },
	},
	{
		name: 'reviews.getTags',
		url: 'https://api.trustpilot.com/v1/private/reviews/review-1/tags',
		method: 'GET',
		credential: oauthToken,
		response: '{"tags":[]}',
		run: () => Reviews.getTags({ key: oauthToken }, { reviewId: 'review-1' }),
	},
	{
		name: 'reviews.webLinks',
		url: 'https://api.trustpilot.com/v1/reviews/review-1/web-links',
		method: 'GET',
		credential: apiKey,
		response: '{"locale":"en-GB","reviewUrl":null}',
		run: () =>
			Reviews.webLinks(context, { reviewId: 'review-1', locale: 'en-GB' }),
		query: { locale: ['en-GB'] },
	},
	{
		name: 'reviews.likes',
		url: 'https://api.trustpilot.com/v1/reviews/review-1/likes',
		method: 'GET',
		credential: apiKey,
		response: '{"likes":[]}',
		run: () => Reviews.likes(context, { reviewId: 'review-1' }),
	},
	{
		name: 'consumers.reviews',
		url: 'https://api.trustpilot.com/v1/consumers/consumer-1/reviews',
		method: 'GET',
		credential: apiKey,
		response: emptyReviews,
		run: () =>
			Consumers.reviews(context, {
				consumerId: 'consumer-1',
				businessUnitId: 'unit-1',
				page: 2,
				perPage: 3,
			}),
		query: { businessUnitId: ['unit-1'], page: ['2'], perPage: ['3'] },
	},
	{
		name: 'consumerProfiles.get',
		url: 'https://api.trustpilot.com/v1/consumers/consumer-1/profile',
		method: 'GET',
		credential: apiKey,
		response: '{}',
		run: () => ConsumerProfiles.get(context, { consumerId: 'consumer-1' }),
	},
	{
		name: 'consumerProfiles.getWithReviews',
		url: 'https://api.trustpilot.com/v1/consumers/consumer-1',
		method: 'GET',
		credential: apiKey,
		response: '{}',
		run: () =>
			ConsumerProfiles.getWithReviews(context, { consumerId: 'consumer-1' }),
	},
	{
		name: 'consumerProfiles.webLinks',
		url: 'https://api.trustpilot.com/v1/consumers/consumer-1/web-links',
		method: 'GET',
		credential: apiKey,
		response: '{}',
		run: () =>
			ConsumerProfiles.webLinks(context, {
				consumerId: 'consumer-1',
				locale: 'en-GB',
			}),
		query: { locale: ['en-GB'] },
	},
	{
		name: 'consumerProfiles.bulk',
		url: 'https://api.trustpilot.com/v1/consumers/profile/bulk',
		method: 'POST',
		credential: apiKey,
		response: '{"consumers":{},"notFoundConsumerIds":[]}',
		run: () => ConsumerProfiles.bulk(context, { consumerIds: ['consumer-1'] }),
		body: '{"consumerIds":["consumer-1"]}',
	},
	{
		name: 'consumerProfiles.createDisplayName',
		url: 'https://api.trustpilot.com/v1/consumers/profile/displayname/create',
		method: 'POST',
		credential: apiKey,
		response: 'null',
		run: () =>
			ConsumerProfiles.createDisplayName(context, {
				displayName: 'Example Reviewer',
			}),
		body: '{"displayName":"Example Reviewer"}',
	},
	{
		name: 'consumerProfiles.validateDisplayName',
		url: 'https://api.trustpilot.com/v1/consumers/profile/displayname/validate',
		method: 'POST',
		credential: apiKey,
		response: 'null',
		run: () =>
			ConsumerProfiles.validateDisplayName(context, {
				displayName: 'Example Reviewer',
			}),
		body: '{"displayName":"Example Reviewer"}',
	},
	{
		name: 'productReviews.summary',
		url: 'https://api.trustpilot.com/v1/product-reviews/business-units/unit-1',
		method: 'GET',
		credential: apiKey,
		response: '{}',
		run: () =>
			ProductReviews.summary(context, {
				businessUnitId: 'unit-1',
				sku: ['SKU-123'],
			}),
		query: { sku: ['SKU-123'] },
	},
	{
		name: 'productReviews.list',
		url: 'https://api.trustpilot.com/v1/product-reviews/business-units/unit-1/reviews',
		method: 'GET',
		credential: apiKey,
		response: '{"productReviews":[]}',
		run: () =>
			ProductReviews.list(context, {
				businessUnitId: 'unit-1',
				sku: ['SKU-123'],
				page: 1,
			}),
		query: { sku: ['SKU-123'], page: ['1'] },
	},
	{
		name: 'productReviews.privateList',
		url: 'https://api.trustpilot.com/v1/private/product-reviews/business-units/unit-1/reviews',
		method: 'GET',
		credential: oauthToken,
		response: '{"productReviews":[]}',
		run: () =>
			ProductReviews.privateList(
				{ key: oauthToken },
				{ businessUnitId: 'unit-1', page: 1, state: ['published'] },
			),
		query: { page: ['1'], state: ['published'] },
	},
	{
		name: 'productReviews.privateGet',
		url: 'https://api.trustpilot.com/v1/private/product-reviews/review-1',
		method: 'GET',
		credential: oauthToken,
		response: '{}',
		run: () =>
			ProductReviews.privateGet({ key: oauthToken }, { reviewId: 'review-1' }),
	},
	{
		name: 'productReviews.summaries',
		url: 'https://api.trustpilot.com/v1/private/product-reviews/business-units/unit-1/summaries',
		method: 'GET',
		credential: oauthToken,
		response: '{"summaries":[]}',
		run: () =>
			ProductReviews.summaries(
				{ key: oauthToken },
				{ businessUnitId: 'unit-1', page: 1 },
			),
		query: { page: ['1'] },
	},
	{
		name: 'productReviews.batchSummaries',
		url: 'https://api.trustpilot.com/v1/product-reviews/business-units/unit-1/batch-summaries',
		method: 'POST',
		credential: apiKey,
		response: '{"summaries":[]}',
		run: () =>
			ProductReviews.batchSummaries(context, {
				businessUnitId: 'unit-1',
				skus: ['SKU-123'],
			}),
		body: '{"skus":["SKU-123"]}',
	},
	{
		name: 'productReviews.invitationLink',
		url: 'https://api.trustpilot.com/v1/private/product-reviews/business-units/unit-1/invitation-links',
		method: 'POST',
		credential: oauthToken,
		response:
			'{"reviewLinkId":"link-1","reviewUrl":"https://products.trustpilot.com/evaluate/link-1"}',
		run: () =>
			ProductReviews.invitationLink(
				{ key: oauthToken },
				{
					businessUnitId: 'unit-1',
					consumer: {
						email: 'person@example.invalid',
						name: 'Example Reviewer',
					},
					products: [{ productUrl: 'https://shop.example/item', name: 'Item' }],
				},
			),
		body: '{"consumer":{"email":"person@example.invalid","name":"Example Reviewer"},"products":[{"productUrl":"https://shop.example/item","name":"Item"}]}',
	},
	{
		name: 'productReviews.createComment',
		url: 'https://api.trustpilot.com/v1/private/conversations/conversation-1/comments',
		method: 'POST',
		credential: oauthToken,
		response:
			'{"commentId":"comment-1","createdAt":"2026-01-01T00:00:00Z","author":{"id":"user-1","type":"businessUser"},"content":"Thanks"}',
		run: () =>
			ProductReviews.createComment(
				{ key: oauthToken },
				{
					conversationId: 'conversation-1',
					content: 'Thanks',
					integrationId: 'integration-1',
				},
			),
		body: '{"content":"Thanks","integrationId":"integration-1"}',
	},
	{
		name: 'productReviews.getConversation',
		url: 'https://api.trustpilot.com/v1/private/conversations/conversation-1',
		method: 'GET',
		credential: oauthToken,
		response:
			'{"id":"conversation-1","businessUnitId":"unit-1","consumerId":"consumer-1","source":"Product reviews","sourceId":"review-1","state":"public","comments":[]}',
		run: () =>
			ProductReviews.getConversation(
				{ key: oauthToken },
				{ conversationId: 'conversation-1' },
			),
	},
	{
		name: 'productReviews.getComment',
		url: 'https://api.trustpilot.com/v1/private/conversations/conversation-1/comments/comment-1',
		method: 'GET',
		credential: oauthToken,
		response:
			'{"commentId":"comment-1","createdAt":"2026-01-01T00:00:00Z","author":{"id":"user-1","type":"businessUser"},"content":"Thanks"}',
		run: () =>
			ProductReviews.getComment(
				{ key: oauthToken },
				{ conversationId: 'conversation-1', commentId: 'comment-1' },
			),
	},
	{
		name: 'productReviews.updateComment',
		url: 'https://api.trustpilot.com/v1/private/conversations/conversation-1/comments/comment-1',
		method: 'PUT',
		credential: oauthToken,
		response:
			'{"commentId":"comment-1","createdAt":"2026-01-01T00:00:00Z","author":{"id":"user-1","type":"businessUser"},"content":"Updated"}',
		run: () =>
			ProductReviews.updateComment(
				{ key: oauthToken },
				{
					conversationId: 'conversation-1',
					commentId: 'comment-1',
					content: 'Updated',
					integrationId: 'integration-1',
				},
			),
		body: '{"content":"Updated","integrationId":"integration-1"}',
	},
	{
		name: 'productReviews.publicConversation',
		url: 'https://api.trustpilot.com/v1/conversations/conversation-1',
		method: 'GET',
		credential: apiKey,
		response:
			'{"id":"conversation-1","businessUnitId":"unit-1","consumerId":"consumer-1","comments":[]}',
		run: () =>
			ProductReviews.publicConversation(context, {
				conversationId: 'conversation-1',
			}),
	},
	{
		name: 'productReviews.createConversation',
		url: 'https://api.trustpilot.com/v1/private/product-reviews/review-1/create-conversation',
		method: 'POST',
		credential: oauthToken,
		response: '{"conversationId":"conversation-1"}',
		run: () =>
			ProductReviews.createConversation(
				{ key: oauthToken },
				{ reviewId: 'review-1' },
			),
	},
	{
		name: 'productReviews.attributeSummaries',
		url: 'https://api.trustpilot.com/v1/product-reviews/business-units/unit-1/attribute-summaries',
		method: 'POST',
		credential: apiKey,
		response: '{"summaries":[]}',
		run: () =>
			ProductReviews.attributeSummaries(context, {
				businessUnitId: 'unit-1',
				skus: ['SKU-123'],
				locale: 'en-GB',
			}),
		body: '{"skus":["SKU-123"],"locale":"en-GB"}',
	},
	{
		name: 'productReviews.importedSummary',
		url: 'https://api.trustpilot.com/v1/product-reviews/business-units/unit-1/imported-reviews-summaries',
		method: 'GET',
		credential: apiKey,
		response: '{"numberOfReviews":{"total":0},"starsAverage":0}',
		run: () =>
			ProductReviews.importedSummary(context, {
				businessUnitId: 'unit-1',
				sku: ['SKU-123', 'SKU-456'],
			}),
		query: { sku: ['SKU-123,SKU-456'] },
	},
	{
		name: 'productReviews.importedReviews',
		url: 'https://api.trustpilot.com/v1/product-reviews/business-units/unit-1/imported-reviews',
		method: 'GET',
		credential: apiKey,
		response: '{"productReviews":[],"links":[]}',
		run: () =>
			ProductReviews.importedReviews(context, {
				businessUnitId: 'unit-1',
				sku: ['SKU-123'],
				page: 1,
				perPage: 10,
			}),
		query: { sku: ['SKU-123'], page: ['1'], perPage: ['10'] },
	},
	{
		name: 'invitations.templates',
		url: 'https://invitations-api.trustpilot.com/v1/private/business-units/unit-1/templates',
		method: 'GET',
		credential: oauthToken,
		response: '{"templates":[]}',
		run: () =>
			Invitations.templates({ key: oauthToken }, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'invitations.link',
		url: 'https://invitations-api.trustpilot.com/v1/private/business-units/unit-1/invitation-links',
		method: 'POST',
		credential: oauthToken,
		response:
			'{"id":"link-1","url":"https://www.trustpilot.com/evaluate-link/link-1"}',
		run: () =>
			Invitations.link(
				{ key: oauthToken },
				{
					businessUnitId: 'unit-1',
					email: 'person@example.invalid',
					name: 'Example Reviewer',
					locale: 'en-US',
				},
			),
		body: '{"email":"person@example.invalid","name":"Example Reviewer","locale":"en-US"}',
	},
	{
		name: 'dataSolutions.searchBusinessUnits',
		url: 'https://datasolutions.trustpilot.com/v1/business-units/search',
		method: 'GET',
		credential: apiKey,
		response: '{"businessUnits":[]}',
		run: () =>
			DataSolutions.searchBusinessUnits(context, {
				query: 'shop.example',
				perPage: 20,
			}),
		query: { query: ['shop.example'], perPage: ['20'] },
	},
	{
		name: 'dataSolutions.findBusinessUnits',
		url: 'https://datasolutions.trustpilot.com/v1/business-units',
		method: 'GET',
		credential: apiKey,
		response: '{"businessUnits":[]}',
		run: () =>
			DataSolutions.findBusinessUnits(context, {
				domain: 'shop.example',
				nextToken: 'next',
			}),
		query: { domain: ['shop.example'], nextToken: ['next'] },
	},
	{
		name: 'dataSolutions.businessUnitDetails',
		url: 'https://datasolutions.trustpilot.com/v1/business-units/unit-1',
		method: 'GET',
		credential: apiKey,
		response:
			'{"id":"unit-1","name":{"display":"Shop","identifying":"shop.example"}}',
		run: () =>
			DataSolutions.businessUnitDetails(context, { businessUnitId: 'unit-1' }),
	},
	{
		name: 'dataSolutions.latestReviews',
		url: 'https://datasolutions.trustpilot.com/v1/business-units/unit-1/reviews/latest',
		method: 'GET',
		credential: apiKey,
		response: emptyReviews,
		run: () =>
			DataSolutions.latestReviews(context, {
				businessUnitId: 'unit-1',
				limit: 5,
			}),
		query: { limit: ['5'] },
	},
	{
		name: 'dataSolutions.serviceReviews',
		url: 'https://datasolutions.trustpilot.com/v1/business-units/unit-1/reviews',
		method: 'GET',
		credential: apiKey,
		response: emptyReviews,
		run: () =>
			DataSolutions.serviceReviews(context, {
				businessUnitId: 'unit-1',
				startDate: '2025-01-01',
				nextToken: 'next',
			}),
		query: { startDate: ['2025-01-01'], nextToken: ['next'] },
	},
	{
		name: 'dataSolutions.categories',
		url: 'https://datasolutions.trustpilot.com/v1/categories',
		method: 'GET',
		credential: apiKey,
		response: '{"totalNumberOfCategories":0,"categories":[]}',
		run: () =>
			DataSolutions.categories(context, {
				countryCode: 'GB',
				parentId: 'retail',
			}),
		query: { countryCode: ['GB'], parentId: ['retail'] },
	},
];

describe('Trustpilot endpoint request contracts', () => {
	afterEach(() => jest.restoreAllMocks());

	for (const endpoint of endpointCases) {
		it(`routes ${endpoint.name} exactly and validates its response`, async () => {
			let callUrl = '';
			let callInit: RequestInit | undefined;
			jest.spyOn(global, 'fetch').mockImplementation(async (input, init) => {
				callUrl = String(input);
				callInit = init;
				return new Response(endpoint.response, {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				});
			});
			await endpoint.run();
			expect(new URL(callUrl).origin + new URL(callUrl).pathname).toBe(
				endpoint.url,
			);
			expect(callInit?.method).toBe(endpoint.method);
			expect(
				new Headers(callInit?.headers).get('apikey') ??
					new Headers(callInit?.headers)
						.get('authorization')
						?.replace('Bearer ', ''),
			).toBe(endpoint.credential);
			if (endpoint.body !== undefined)
				expect(callInit?.body).toBe(endpoint.body);
			if (endpoint.query) {
				const actualQuery = new URL(callUrl).searchParams;
				for (const [name, values] of Object.entries(endpoint.query))
					expect(actualQuery.getAll(name)).toEqual(values);
			}
		});
	}

	it('rejects undocumented request properties before network I/O', async () => {
		const fetchMock = jest.spyOn(global, 'fetch');
		const invalidRequest = {
			name: 'shop.example',
			callbackUrl: 'https://untrusted.example/callback',
		};
		await expect(BusinessUnits.find(context, invalidRequest)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sanitizes input and output validation errors that may contain personal data', async () => {
		const invalidInput = {
			name: 'shop.example',
			consumerEmail: 'person@example.invalid',
		};
		const inputError = await BusinessUnits.find(context, invalidInput).catch(
			(caught: unknown) => caught,
		); // `unknown` because a rejected promise may carry any value.
		expect(inputError).toBeInstanceOf(Error);
		if (inputError instanceof Error) {
			expect(inputError.message).toBe('Trustpilot input validation failed');
			expect(inputError.message).not.toContain('person@example.invalid');
		}

		jest.spyOn(global, 'fetch').mockResolvedValue(
			new Response('{"id":42,"email":"person@example.invalid"}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
		const outputError = await BusinessUnits.get(context, {
			businessUnitId: 'unit-1',
		}).catch((caught: unknown) => caught); // `unknown` because a rejected promise may carry any value.
		expect(outputError).toBeInstanceOf(Error);
		if (outputError instanceof Error) {
			expect(outputError.message).toBe('Trustpilot response validation failed');
			expect(outputError.message).not.toContain('person@example.invalid');
		}
	});
});
