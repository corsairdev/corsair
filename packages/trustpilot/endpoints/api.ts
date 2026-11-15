import type { z } from 'zod';
import type { TrustpilotContext } from '..';
import type { TrustpilotCredential, TrustpilotHost } from '../client';
import { makeTrustpilotRequest } from '../client';
import {
	TrustpilotEndpointInputSchemas,
	TrustpilotEndpointOutputSchemas,
} from './types';

type Query = Record<
	string,
	string | number | boolean | Array<string | number> | undefined
>;
type Spec<I> = {
	host: TrustpilotHost;
	credential: TrustpilotCredential;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: (input: I) => string;
	query?: (input: I) => Query;
	// `unknown` allows nested endpoint-specific request bodies without weakening the input schemas above.
	body?: (input: I) => Record<string, unknown>;
};

function parseValidated<T extends z.ZodType>(
	schema: T,
	// `unknown` is the input boundary for both caller JSON and untrusted provider JSON.
	value: unknown,
	message: string,
): z.output<T> {
	try {
		return schema.parse(value);
	} catch {
		// Zod issues may include the rejected value, which can contain consumer PII.
		throw new Error(message);
	}
}

function createEndpoint<I extends z.ZodType, O extends z.ZodType>(
	inputSchema: I,
	outputSchema: O,
	spec: Spec<z.output<I>>,
) {
	return async (
		ctx: Pick<TrustpilotContext, 'key'>,
		rawInput: z.input<I>,
	): Promise<z.output<O>> => {
		const input = parseValidated(
			inputSchema,
			rawInput,
			'Trustpilot input validation failed',
		);
		// `unknown` because provider JSON is untrusted until the operation's output Zod schema parses it.
		const response = await makeTrustpilotRequest<unknown>(
			spec.path(input),
			ctx.key,
			spec.host,
			spec.credential,
			{
				method: spec.method,
				query: spec.query?.(input),
				body: spec.body?.(input),
			},
		);
		const output = parseValidated(
			outputSchema,
			response,
			'Trustpilot response validation failed',
		);
		return output;
	};
}

const business = 'business';
const invitations = 'invitations';
const dataSolutions = 'dataSolutions';
const apiKey = 'api_key';
const oauth = 'oauth_2';
const encoded = (value: string) => encodeURIComponent(value);
const commaSeparated = (values?: Array<string | number>) => values?.join(',');

export const BusinessUnits = {
	find: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.find'],
		TrustpilotEndpointOutputSchemas['businessUnits.find'],
		{
			host: business,
			credential: apiKey,
			path: () => '/v1/business-units/find',
			query: (input) => ({ name: input.name }),
		},
	),
	get: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.get'],
		TrustpilotEndpointOutputSchemas['businessUnits.get'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/business-units/${encoded(input.businessUnitId)}`,
		},
	),
	search: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.search'],
		TrustpilotEndpointOutputSchemas['businessUnits.search'],
		{
			host: business,
			credential: apiKey,
			path: () => '/v1/business-units/search',
			query: (input) => ({
				query: input.query,
				country: input.country,
				page: input.page,
				perpage: input.perpage,
			}),
		},
	),
	profileInfo: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.profileInfo'],
		TrustpilotEndpointOutputSchemas['businessUnits.profileInfo'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/profileinfo`,
		},
	),
	webLinks: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.webLinks'],
		TrustpilotEndpointOutputSchemas['businessUnits.webLinks'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/web-links`,
			query: (input) => ({ locale: input.locale }),
		},
	),
	logo: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.logo'],
		TrustpilotEndpointOutputSchemas['businessUnits.logo'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/images/logo`,
			query: (input) => ({ locationId: input.locationId }),
		},
	),
	promotionBoxImage: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.promotionBoxImage'],
		TrustpilotEndpointOutputSchemas['businessUnits.promotionBoxImage'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/images/promotion-box`,
		},
	),
	headerImage: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.headerImage'],
		TrustpilotEndpointOutputSchemas['businessUnits.headerImage'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/images/header`,
		},
	),
	listCategories: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.listCategories'],
		TrustpilotEndpointOutputSchemas['businessUnits.listCategories'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/categories`,
			query: (input) => ({ country: input.country, locale: input.locale }),
		},
	),
	publicAll: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.publicAll'],
		TrustpilotEndpointOutputSchemas['businessUnits.publicAll'],
		{
			host: business,
			credential: apiKey,
			path: () => '/v1/business-units/all',
			query: (input) => ({
				country: input.country,
				perPage: input.perPage,
				cursor: input.cursor,
			}),
		},
	),
	customerGuarantee: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.customerGuarantee'],
		TrustpilotEndpointOutputSchemas['businessUnits.customerGuarantee'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/customerguarantee`,
		},
	),
	profilePromotion: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.profilePromotion'],
		TrustpilotEndpointOutputSchemas['businessUnits.profilePromotion'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/profilepromotion`,
		},
	),
	publicPromotionBox: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.publicPromotionBox'],
		TrustpilotEndpointOutputSchemas['businessUnits.publicPromotionBox'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/promotion-box`,
		},
	),
	reviews: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.reviews'],
		TrustpilotEndpointOutputSchemas['businessUnits.reviews'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/reviews`,
			query: (input) => ({
				page: input.page,
				perPage: input.perPage,
				stars: input.stars,
				language: input.language,
				internalLocationId: input.internalLocationId,
				orderBy: input.orderBy,
				tagGroup: input.tagGroup,
				tagValue: input.tagValue,
				responded: input.responded,
				includeReportedReviews: input.includeReportedReviews,
			}),
		},
	),
	allReviews: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.allReviews'],
		TrustpilotEndpointOutputSchemas['businessUnits.allReviews'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/all-reviews`,
			query: (input) => ({ pageToken: input.pageToken }),
		},
	),
	privateReviews: createEndpoint(
		TrustpilotEndpointInputSchemas['businessUnits.privateReviews'],
		TrustpilotEndpointOutputSchemas['businessUnits.privateReviews'],
		{
			host: business,
			credential: oauth,
			path: (input) =>
				`/v1/private/business-units/${encoded(input.businessUnitId)}/reviews`,
			query: (input) => ({
				stars: input.stars,
				language: input.language,
				page: input.page,
				internalLocationId: input.internalLocationId,
				externalLocationIds: input.externalLocationIds,
				noLocation: input.noLocation,
				perPage: input.perPage,
				orderBy: input.orderBy,
				tagGroup: input.tagGroup,
				tagValue: input.tagValue,
				ignoreTagValueCase: input.ignoreTagValueCase,
				responded: input.responded,
				referenceId: input.referenceId,
				referralEmail: input.referralEmail,
				reported: input.reported,
				startDateTime: input.startDateTime,
				endDateTime: input.endDateTime,
				source: input.source,
				username: input.username,
				findReviewer: input.findReviewer,
			}),
		},
	),
};

export const Reviews = {
	get: createEndpoint(
		TrustpilotEndpointInputSchemas['reviews.get'],
		TrustpilotEndpointOutputSchemas['reviews.get'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/reviews/${encoded(input.reviewId)}`,
		},
	),
	getPrivate: createEndpoint(
		TrustpilotEndpointInputSchemas['reviews.getPrivate'],
		TrustpilotEndpointOutputSchemas['reviews.getPrivate'],
		{
			host: business,
			credential: oauth,
			path: (input) => `/v1/private/reviews/${encoded(input.reviewId)}`,
		},
	),
	latest: createEndpoint(
		TrustpilotEndpointInputSchemas['reviews.latest'],
		TrustpilotEndpointOutputSchemas['reviews.latest'],
		{
			host: business,
			credential: apiKey,
			path: () => '/v1/reviews/latest',
			query: (input) => ({
				count: input.count,
				language: input.language,
				filterUsersWithoutImages: input.filterUsersWithoutImages,
				locale: input.locale,
			}),
		},
	),
	getTags: createEndpoint(
		TrustpilotEndpointInputSchemas['reviews.getTags'],
		TrustpilotEndpointOutputSchemas['reviews.getTags'],
		{
			host: business,
			credential: oauth,
			path: (input) => `/v1/private/reviews/${encoded(input.reviewId)}/tags`,
		},
	),
	webLinks: createEndpoint(
		TrustpilotEndpointInputSchemas['reviews.webLinks'],
		TrustpilotEndpointOutputSchemas['reviews.webLinks'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/reviews/${encoded(input.reviewId)}/web-links`,
			query: (input) => ({ locale: input.locale }),
		},
	),
	likes: createEndpoint(
		TrustpilotEndpointInputSchemas['reviews.likes'],
		TrustpilotEndpointOutputSchemas['reviews.likes'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/reviews/${encoded(input.reviewId)}/likes`,
		},
	),
};

export const Consumers = {
	reviews: createEndpoint(
		TrustpilotEndpointInputSchemas['consumers.reviews'],
		TrustpilotEndpointOutputSchemas['consumers.reviews'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/consumers/${encoded(input.consumerId)}/reviews`,
			query: (input) => ({
				stars: input.stars,
				language: input.language,
				internalLocationId: input.internalLocationId,
				businessUnitId: input.businessUnitId,
				page: input.page,
				perPage: input.perPage,
				orderBy: input.orderBy,
				includeReportedReviews: input.includeReportedReviews,
			}),
		},
	),
};

export const ConsumerProfiles = {
	get: createEndpoint(
		TrustpilotEndpointInputSchemas['consumerProfiles.get'],
		TrustpilotEndpointOutputSchemas['consumerProfiles.get'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/consumers/${encoded(input.consumerId)}/profile`,
		},
	),
	getWithReviews: createEndpoint(
		TrustpilotEndpointInputSchemas['consumerProfiles.getWithReviews'],
		TrustpilotEndpointOutputSchemas['consumerProfiles.getWithReviews'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/consumers/${encoded(input.consumerId)}`,
		},
	),
	webLinks: createEndpoint(
		TrustpilotEndpointInputSchemas['consumerProfiles.webLinks'],
		TrustpilotEndpointOutputSchemas['consumerProfiles.webLinks'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/consumers/${encoded(input.consumerId)}/web-links`,
			query: (input) => ({ locale: input.locale }),
		},
	),
	bulk: createEndpoint(
		TrustpilotEndpointInputSchemas['consumerProfiles.bulk'],
		TrustpilotEndpointOutputSchemas['consumerProfiles.bulk'],
		{
			host: business,
			credential: apiKey,
			method: 'POST',
			path: () => '/v1/consumers/profile/bulk',
			body: (input) => ({ consumerIds: input.consumerIds }),
		},
	),
	createDisplayName: createEndpoint(
		TrustpilotEndpointInputSchemas['consumerProfiles.createDisplayName'],
		TrustpilotEndpointOutputSchemas['consumerProfiles.createDisplayName'],
		{
			host: business,
			credential: apiKey,
			method: 'POST',
			path: () => '/v1/consumers/profile/displayname/create',
			body: (input) => ({ displayName: input.displayName }),
		},
	),
	validateDisplayName: createEndpoint(
		TrustpilotEndpointInputSchemas['consumerProfiles.validateDisplayName'],
		TrustpilotEndpointOutputSchemas['consumerProfiles.validateDisplayName'],
		{
			host: business,
			credential: apiKey,
			method: 'POST',
			path: () => '/v1/consumers/profile/displayname/validate',
			body: (input) => ({ displayName: input.displayName }),
		},
	),
};

export const ProductReviews = {
	summary: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.summary'],
		TrustpilotEndpointOutputSchemas['productReviews.summary'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/product-reviews/business-units/${encoded(input.businessUnitId)}`,
			query: (input) => ({
				sku: commaSeparated(input.sku),
				customerProductId: input.customerProductId,
			}),
		},
	),
	list: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.list'],
		TrustpilotEndpointOutputSchemas['productReviews.list'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/product-reviews/business-units/${encoded(input.businessUnitId)}/reviews`,
			query: (input) => ({
				page: input.page,
				perPage: input.perPage,
				productUrl: commaSeparated(input.productUrl),
				sku: commaSeparated(input.sku),
				customerProductId: input.customerProductId,
				language: input.language,
				stars: commaSeparated(input.stars),
				locale: input.locale,
				attributeIds: commaSeparated(input.attributeIds),
			}),
		},
	),
	privateList: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.privateList'],
		TrustpilotEndpointOutputSchemas['productReviews.privateList'],
		{
			host: business,
			credential: oauth,
			path: (input) =>
				`/v1/private/product-reviews/business-units/${encoded(input.businessUnitId)}/reviews`,
			query: (input) => ({
				page: input.page,
				perPage: input.perPage,
				sku: commaSeparated(input.sku),
				customerProductId: input.customerProductId,
				language: input.language,
				state: commaSeparated(input.state),
				locale: input.locale,
			}),
		},
	),
	privateGet: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.privateGet'],
		TrustpilotEndpointOutputSchemas['productReviews.privateGet'],
		{
			host: business,
			credential: oauth,
			path: (input) => `/v1/private/product-reviews/${encoded(input.reviewId)}`,
			query: (input) => ({ locale: input.locale }),
		},
	),
	summaries: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.summaries'],
		TrustpilotEndpointOutputSchemas['productReviews.summaries'],
		{
			host: business,
			credential: oauth,
			path: (input) =>
				`/v1/private/product-reviews/business-units/${encoded(input.businessUnitId)}/summaries`,
			query: (input) => ({ page: input.page, perPage: input.perPage }),
		},
	),
	batchSummaries: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.batchSummaries'],
		TrustpilotEndpointOutputSchemas['productReviews.batchSummaries'],
		{
			host: business,
			credential: apiKey,
			method: 'POST',
			path: (input) =>
				`/v1/product-reviews/business-units/${encoded(input.businessUnitId)}/batch-summaries`,
			body: (input) => ({ skus: input.skus }),
		},
	),
	invitationLink: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.invitationLink'],
		TrustpilotEndpointOutputSchemas['productReviews.invitationLink'],
		{
			host: business,
			credential: oauth,
			method: 'POST',
			path: (input) =>
				`/v1/private/product-reviews/business-units/${encoded(input.businessUnitId)}/invitation-links`,
			body: (input) => ({
				consumer: input.consumer,
				referenceId: input.referenceId,
				locale: input.locale,
				redirectUri: input.redirectUri,
				products: input.products,
				productIds: input.productIds,
			}),
		},
	),
	createComment: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.createComment'],
		TrustpilotEndpointOutputSchemas['productReviews.createComment'],
		{
			host: business,
			credential: oauth,
			method: 'POST',
			path: (input) =>
				`/v1/private/conversations/${encoded(input.conversationId)}/comments`,
			body: (input) => ({
				content: input.content,
				integrationId: input.integrationId,
			}),
		},
	),
	getConversation: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.getConversation'],
		TrustpilotEndpointOutputSchemas['productReviews.getConversation'],
		{
			host: business,
			credential: oauth,
			path: (input) =>
				`/v1/private/conversations/${encoded(input.conversationId)}`,
		},
	),
	getComment: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.getComment'],
		TrustpilotEndpointOutputSchemas['productReviews.getComment'],
		{
			host: business,
			credential: oauth,
			path: (input) =>
				`/v1/private/conversations/${encoded(input.conversationId)}/comments/${encoded(input.commentId)}`,
		},
	),
	updateComment: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.updateComment'],
		TrustpilotEndpointOutputSchemas['productReviews.updateComment'],
		{
			host: business,
			credential: oauth,
			method: 'PUT',
			path: (input) =>
				`/v1/private/conversations/${encoded(input.conversationId)}/comments/${encoded(input.commentId)}`,
			body: (input) => ({
				content: input.content,
				integrationId: input.integrationId,
			}),
		},
	),
	publicConversation: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.publicConversation'],
		TrustpilotEndpointOutputSchemas['productReviews.publicConversation'],
		{
			host: business,
			credential: apiKey,
			path: (input) => `/v1/conversations/${encoded(input.conversationId)}`,
		},
	),
	createConversation: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.createConversation'],
		TrustpilotEndpointOutputSchemas['productReviews.createConversation'],
		{
			host: business,
			credential: oauth,
			method: 'POST',
			path: (input) =>
				`/v1/private/product-reviews/${encoded(input.reviewId)}/create-conversation`,
		},
	),
	attributeSummaries: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.attributeSummaries'],
		TrustpilotEndpointOutputSchemas['productReviews.attributeSummaries'],
		{
			host: business,
			credential: apiKey,
			method: 'POST',
			path: (input) =>
				`/v1/product-reviews/business-units/${encoded(input.businessUnitId)}/attribute-summaries`,
			body: (input) => ({ skus: input.skus, locale: input.locale }),
		},
	),
	importedSummary: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.importedSummary'],
		TrustpilotEndpointOutputSchemas['productReviews.importedSummary'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/product-reviews/business-units/${encoded(input.businessUnitId)}/imported-reviews-summaries`,
			query: (input) => ({ sku: commaSeparated(input.sku) }),
		},
	),
	importedReviews: createEndpoint(
		TrustpilotEndpointInputSchemas['productReviews.importedReviews'],
		TrustpilotEndpointOutputSchemas['productReviews.importedReviews'],
		{
			host: business,
			credential: apiKey,
			path: (input) =>
				`/v1/product-reviews/business-units/${encoded(input.businessUnitId)}/imported-reviews`,
			query: (input) => ({
				page: input.page,
				perPage: input.perPage,
				sku: commaSeparated(input.sku),
				stars: commaSeparated(input.stars),
				language: input.language,
			}),
		},
	),
};

export const Invitations = {
	templates: createEndpoint(
		TrustpilotEndpointInputSchemas['invitations.templates'],
		TrustpilotEndpointOutputSchemas['invitations.templates'],
		{
			host: invitations,
			credential: oauth,
			path: (input) =>
				`/v1/private/business-units/${encoded(input.businessUnitId)}/templates`,
		},
	),
	link: createEndpoint(
		TrustpilotEndpointInputSchemas['invitations.link'],
		TrustpilotEndpointOutputSchemas['invitations.link'],
		{
			host: invitations,
			credential: oauth,
			method: 'POST',
			path: (input) =>
				`/v1/private/business-units/${encoded(input.businessUnitId)}/invitation-links`,
			body: (input) => ({
				locationId: input.locationId,
				referenceId: input.referenceId,
				email: input.email,
				name: input.name,
				locale: input.locale,
				tags: input.tags,
				redirectUri: input.redirectUri,
			}),
		},
	),
};

export const DataSolutions = {
	searchBusinessUnits: createEndpoint(
		TrustpilotEndpointInputSchemas['dataSolutions.searchBusinessUnits'],
		TrustpilotEndpointOutputSchemas['dataSolutions.searchBusinessUnits'],
		{
			host: dataSolutions,
			credential: apiKey,
			path: () => '/v1/business-units/search',
			query: (input) => ({
				query: input.query,
				countryCode: input.countryCode,
				perPage: input.perPage,
				nextToken: input.nextToken,
			}),
		},
	),
	findBusinessUnits: createEndpoint(
		TrustpilotEndpointInputSchemas['dataSolutions.findBusinessUnits'],
		TrustpilotEndpointOutputSchemas['dataSolutions.findBusinessUnits'],
		{
			host: dataSolutions,
			credential: apiKey,
			path: () => '/v1/business-units',
			query: (input) => ({
				domain: input.domain,
				category: input.category,
				countryCode: input.countryCode,
				perPage: input.perPage,
				nextToken: input.nextToken,
			}),
		},
	),
	businessUnitDetails: createEndpoint(
		TrustpilotEndpointInputSchemas['dataSolutions.businessUnitDetails'],
		TrustpilotEndpointOutputSchemas['dataSolutions.businessUnitDetails'],
		{
			host: dataSolutions,
			credential: apiKey,
			path: (input) => `/v1/business-units/${encoded(input.businessUnitId)}`,
		},
	),
	latestReviews: createEndpoint(
		TrustpilotEndpointInputSchemas['dataSolutions.latestReviews'],
		TrustpilotEndpointOutputSchemas['dataSolutions.latestReviews'],
		{
			host: dataSolutions,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/reviews/latest`,
			query: (input) => ({ limit: input.limit }),
		},
	),
	serviceReviews: createEndpoint(
		TrustpilotEndpointInputSchemas['dataSolutions.serviceReviews'],
		TrustpilotEndpointOutputSchemas['dataSolutions.serviceReviews'],
		{
			host: dataSolutions,
			credential: apiKey,
			path: (input) =>
				`/v1/business-units/${encoded(input.businessUnitId)}/reviews`,
			query: (input) => ({
				startDate: input.startDate,
				endDate: input.endDate,
				nextToken: input.nextToken,
			}),
		},
	),
	categories: createEndpoint(
		TrustpilotEndpointInputSchemas['dataSolutions.categories'],
		TrustpilotEndpointOutputSchemas['dataSolutions.categories'],
		{
			host: dataSolutions,
			credential: apiKey,
			path: () => '/v1/categories',
			query: (input) => ({
				countryCode: input.countryCode,
				parentId: input.parentId,
			}),
		},
	),
};
