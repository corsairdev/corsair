import type { AshbyEndpoints } from '../index';
import { ashbyCall } from './shared';
import type {
	OfferCreateResponse,
	OfferInfoResponse,
	OfferListResponse,
	OfferUpdateResponse,
} from './types';

export const info: AshbyEndpoints['offer.info'] = async (ctx, input) => {
	return await ashbyCall<OfferInfoResponse>(ctx, 'offer.info', {
		offerId: input.offerId,
	});
};

export const list: AshbyEndpoints['offer.list'] = async (ctx, input) => {
	return await ashbyCall<OfferListResponse>(ctx, 'offer.list', {
		limit: input.limit,
		cursor: input.cursor,
		syncToken: input.syncToken,
		applicationId: input.applicationId,
		status: input.status,
	});
};

export const create: AshbyEndpoints['offer.create'] = async (ctx, input) => {
	return await ashbyCall<OfferCreateResponse>(ctx, 'offer.create', {
		applicationId: input.applicationId,
		salary: input.salary,
		currency: input.currency,
		startDate: input.startDate,
		customFields: input.customFields,
	});
};

export const update: AshbyEndpoints['offer.update'] = async (ctx, input) => {
	return await ashbyCall<OfferUpdateResponse>(ctx, 'offer.update', {
		offerId: input.offerId,
		salary: input.salary,
		currency: input.currency,
		startDate: input.startDate,
		status: input.status,
		customFields: input.customFields,
	});
};
