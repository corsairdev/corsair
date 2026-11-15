import type { CorsairErrorHandler } from 'corsair/core';
import { ApiError } from 'corsair/http';

const retryableReadOperations = new Set([
	'businessUnits.find',
	'businessUnits.get',
	'businessUnits.search',
	'businessUnits.profileInfo',
	'businessUnits.webLinks',
	'businessUnits.logo',
	'businessUnits.promotionBoxImage',
	'businessUnits.headerImage',
	'businessUnits.listCategories',
	'businessUnits.publicAll',
	'businessUnits.customerGuarantee',
	'businessUnits.profilePromotion',
	'businessUnits.publicPromotionBox',
	'businessUnits.reviews',
	'businessUnits.allReviews',
	'businessUnits.privateReviews',
	'reviews.get',
	'reviews.getPrivate',
	'reviews.latest',
	'reviews.getTags',
	'reviews.webLinks',
	'reviews.likes',
	'consumers.reviews',
	'consumerProfiles.get',
	'consumerProfiles.getWithReviews',
	'consumerProfiles.webLinks',
	'consumerProfiles.bulk',
	'consumerProfiles.createDisplayName',
	'consumerProfiles.validateDisplayName',
	'productReviews.summary',
	'productReviews.list',
	'productReviews.privateList',
	'productReviews.privateGet',
	'productReviews.summaries',
	'productReviews.batchSummaries',
	'productReviews.getConversation',
	'productReviews.getComment',
	'productReviews.publicConversation',
	'productReviews.attributeSummaries',
	'productReviews.importedSummary',
	'productReviews.importedReviews',
	'invitations.templates',
	'dataSolutions.searchBusinessUnits',
	'dataSolutions.findBusinessUnits',
	'dataSolutions.businessUnitDetails',
	'dataSolutions.latestReviews',
	'dataSolutions.serviceReviews',
	'dataSolutions.categories',
]);

export const errorHandlers = {
	RATE_LIMIT_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 429) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('rate_limited') || msg.includes('429');
		},
		// The client extracts Retry-After but leaves retry ownership to this
		// handler, so each endpoint attempt causes one HTTP request.
		handler: async (error, context) => ({
			maxRetries: [...retryableReadOperations].some(
				(operation) =>
					context.operation === operation ||
					context.operation.endsWith(`.${operation}`),
			)
				? 2
				: 0,
			...(error instanceof ApiError && error.retryAfter !== undefined
				? { headersRetryAfterMs: error.retryAfter }
				: {}),
		}),
	},
	AUTH_ERROR: {
		match: (error: Error) => {
			if (error instanceof ApiError && error.status === 401) return true;
			const msg = error.message.toLowerCase();
			return msg.includes('unauthorized') || msg.includes('invalid_auth');
		},
		handler: async () => ({ maxRetries: 0 }),
	},
	DEFAULT: {
		match: () => true,
		handler: async () => ({ maxRetries: 0 }),
	},
} satisfies CorsairErrorHandler;
