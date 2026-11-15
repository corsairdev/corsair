import { makeFidelRequest } from './client';
import {
	activateOfferOnCard,
	createBrand,
	createBrandWebhook,
	createLocation,
	createMidRequest,
	createMissingTransactionRequest,
	createOffer,
	createOfferFromMarketplaceOffer,
	createProgram,
	createProgramWebhook,
	createTransactionTest,
	deleteBrand,
	deleteCard,
	deleteLocation,
	deleteOffer,
	deleteWebhook,
	linkAllBrandLocationsToOffer,
	linkLocationToOffer,
	listBrands,
	listCards,
	listCardsFromMetadataId,
	listCardsWithActiveOffer,
	listLocations,
	listLocationsByBrand,
	listLocationsByOffer,
	listMarketplaceOffers,
	listMidInsights,
	listMidRequests,
	listMids,
	listMissingTransactionRequests,
	listOffers,
	listPrograms,
	listTransactions,
	listTransactionsByCard,
	listWebhooks,
	retrieveActiveOfferOnCard,
	retrieveBrand,
	retrieveCard,
	retrieveLocation,
	retrieveMidRequest,
	retrieveMissingTransactionRequest,
	retrieveOffer,
	retrieveProgram,
	retrieveTransaction,
	retrieveWebhook,
	sendOfferToBrand,
	unlinkCardFromOffer,
	unlinkLocationToOffer,
	updateBrand,
	updateCardMetadata,
	updateLocation,
	updateOffer,
	updateProgram,
	updateWebhook,
} from './endpoints';

jest.mock('./client', () => ({
	makeFidelRequest: jest.fn(),
}));
jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

const request = jest.mocked(makeFidelRequest);

describe('Fidel endpoint request seams', () => {
	beforeEach(() => {
		request.mockClear();
		request.mockResolvedValue({ items: [] });
	});

	it('covers every registered operation route', async () => {
		const ctx = {
			key: 'secret',
			options: {},
			$getAccountId: jest.fn().mockResolvedValue('account-1'),
		} as never;
		await createBrand(ctx, {
			name: 'name-1',
			websiteURL: 'websiteURL-1',
			logoURL: 'logoURL-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/brands', {
			method: 'POST',
			body: {
				name: 'name-1',
				websiteURL: 'websiteURL-1',
				logoURL: 'logoURL-1',
			},
		});
		await retrieveBrand(ctx, { brandId: 'brandId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/brands/brandId-1', {
			method: 'GET',
		});
		await listBrands(ctx, {
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
			name: 'name-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/brands', {
			method: 'GET',
			query: {
				limit: 'limit-1',
				start: 'start-1',
				order: 'order-1',
				name: 'name-1',
			},
		});
		await updateBrand(ctx, {
			brandId: 'brandId-1',
			websiteURL: 'websiteURL-1',
			logoURL: 'logoURL-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/brands/brandId-1', {
			method: 'PATCH',
			body: { websiteURL: 'websiteURL-1', logoURL: 'logoURL-1' },
		});
		await deleteBrand(ctx, { brandId: 'brandId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/brands/brandId-1', {
			method: 'DELETE',
		});
		await listPrograms(ctx, {
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/programs', {
			method: 'GET',
			query: { limit: 'limit-1', start: 'start-1', order: 'order-1' },
		});
		await createProgram(ctx, {
			name: 'name-1',
			icon: 'icon-1',
			iconBackground: 'iconBackground-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/programs', {
			method: 'POST',
			body: {
				name: 'name-1',
				icon: 'icon-1',
				iconBackground: 'iconBackground-1',
			},
		});
		await updateProgram(ctx, {
			programId: 'programId-1',
			name: 'name-1',
			icon: 'icon-1',
			iconBackground: 'iconBackground-1',
			status: 'status-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/programs/programId-1', {
			method: 'PATCH',
			body: {
				name: 'name-1',
				icon: 'icon-1',
				iconBackground: 'iconBackground-1',
				status: 'status-1',
			},
		});
		await retrieveProgram(ctx, { programId: 'programId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/programs/programId-1', {
			method: 'GET',
		});
		await createLocation(ctx, {
			programId: 'programId-1',
			address: 'address-1',
			brandId: 'brandId-1',
			city: 'city-1',
			countryCode: 'CAN',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/locations',
			{
				method: 'POST',
				body: {
					address: 'address-1',
					brandId: 'brandId-1',
					city: 'city-1',
					countryCode: 'CAN',
				},
			},
		);
		await retrieveLocation(ctx, { locationId: 'locationId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/locations/locationId-1', {
			method: 'GET',
		});
		await updateLocation(ctx, {
			locationId: 'locationId-1',
			address: 'address-1',
			city: 'city-1',
			countryCode: 'countryCode-1',
			postcode: 'postcode-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/locations/locationId-1', {
			method: 'PATCH',
			body: {
				address: 'address-1',
				city: 'city-1',
				countryCode: 'countryCode-1',
				postcode: 'postcode-1',
			},
		});
		await listLocations(ctx, {
			programId: 'programId-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
			postcode: 'postcode-1',
			status: 'status-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/locations',
			{
				method: 'GET',
				query: {
					limit: 'limit-1',
					start: 'start-1',
					order: 'order-1',
					postcode: 'postcode-1',
					status: 'status-1',
				},
			},
		);
		await listLocationsByBrand(ctx, {
			brandId: 'brandId-1',
			programId: 'programId-1',
			postcode: 'postcode-1',
			status: 'status-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/brands/brandId-1/programs/programId-1/locations',
			{
				method: 'GET',
				query: {
					postcode: 'postcode-1',
					status: 'status-1',
					limit: 'limit-1',
					start: 'start-1',
					order: 'order-1',
				},
			},
		);
		await listLocationsByOffer(ctx, {
			offerId: 'offerId-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/locations',
			{
				method: 'GET',
				query: { limit: 'limit-1', start: 'start-1', order: 'order-1' },
			},
		);
		await deleteLocation(ctx, { locationId: 'locationId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/locations/locationId-1', {
			method: 'DELETE',
		});
		await retrieveCard(ctx, { cardId: 'cardId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/cards/cardId-1', {
			method: 'GET',
		});
		await listCards(ctx, {
			programId: 'programId-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/cards',
			{
				method: 'GET',
				query: { limit: 'limit-1', start: 'start-1', order: 'order-1' },
			},
		);
		await listCardsFromMetadataId(ctx, {
			metadataId: 'metadataId-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/cards/metadata/metadataId-1',
			{
				method: 'GET',
				query: { limit: 'limit-1', start: 'start-1', order: 'order-1' },
			},
		);
		await deleteCard(ctx, { cardId: 'cardId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/cards/cardId-1', {
			method: 'DELETE',
		});
		await updateCardMetadata(ctx, {
			cardId: 'cardId-1',
			metadata: { customKey: 'customValue' },
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/cards/cardId-1/metadata', {
			method: 'PUT',
			body: { customKey: 'customValue' },
		});
		await createBrandWebhook(ctx, {
			event: 'brand.consent',
			url: 'url-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/hooks', {
			method: 'POST',
			body: { event: 'brand.consent', url: 'url-1' },
		});
		await createProgramWebhook(ctx, {
			programId: 'programId-1',
			event: 'card.linked',
			url: 'url-1',
			offerId: 'offerId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/hooks',
			{
				method: 'POST',
				body: { event: 'card.linked', url: 'url-1', offerId: 'offerId-1' },
			},
		);
		await retrieveWebhook(ctx, { hookId: 'hookId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/hooks/hookId-1', {
			method: 'GET',
		});
		await updateWebhook(ctx, {
			hookId: 'hookId-1',
			event: 'event-1',
			url: 'url-1',
			programId: 'programId-1',
			offerId: 'offerId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/hooks/hookId-1', {
			method: 'PATCH',
			body: {
				event: 'event-1',
				url: 'url-1',
				programId: 'programId-1',
				offerId: 'offerId-1',
			},
		});
		await listWebhooks(ctx, {
			programId: 'programId-1',
			limit: 'limit-1',
			event: 'event-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/hooks',
			{ method: 'GET', query: { limit: 'limit-1', event: 'event-1' } },
		);
		await deleteWebhook(ctx, { hookId: 'hookId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/hooks/hookId-1', {
			method: 'DELETE',
		});
		await createOffer(ctx, {
			brandId: 'brandId-1',
			countryCode: 'countryCode-1',
			name: 'name-1',
			startDate: 'startDate-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers', {
			method: 'POST',
			body: {
				brandId: 'brandId-1',
				countryCode: 'countryCode-1',
				name: 'name-1',
				startDate: 'startDate-1',
			},
		});
		await updateOffer(ctx, {
			offerId: 'offerId-1',
			name: 'name-1',
			startDate: 'startDate-1',
			endDate: 'endDate-1',
			minTransactionAmount: 1,
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers/offerId-1', {
			method: 'PATCH',
			body: {
				name: 'name-1',
				startDate: 'startDate-1',
				endDate: 'endDate-1',
				minTransactionAmount: 1,
			},
		});
		await retrieveOffer(ctx, { offerId: 'offerId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers/offerId-1', {
			method: 'GET',
		});
		await listOffers(ctx, {
			limit: 'limit-1',
			start: 'start-1',
			sort: 'sort-1',
			order: 'order-1',
			status: 'status-1',
			activation: 'activation-1',
			approval: 'approval-1',
			brandId: 'brandId-1',
			contentProviderId: 'contentProviderId-1',
			programId: 'programId-1',
			countryCode: 'countryCode-1',
			customerRecency: 'customerRecency-1',
			network: 'network-1',
			returnPeriod: 'returnPeriod-1',
			channel: 'channel-1',
			endDate: 'endDate-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers', {
			method: 'GET',
			query: {
				limit: 'limit-1',
				start: 'start-1',
				sort: 'sort-1',
				order: 'order-1',
				status: 'status-1',
				activation: 'activation-1',
				approval: 'approval-1',
				brandId: 'brandId-1',
				contentProviderId: 'contentProviderId-1',
				programId: 'programId-1',
				countryCode: 'countryCode-1',
				customerRecency: 'customerRecency-1',
				network: 'network-1',
				returnPeriod: 'returnPeriod-1',
				channel: 'channel-1',
				endDate: 'endDate-1',
			},
		});
		await deleteOffer(ctx, { offerId: 'offerId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers/offerId-1', {
			method: 'DELETE',
		});
		await linkLocationToOffer(ctx, {
			offerId: 'offerId-1',
			locationId: 'locationId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/locations/locationId-1',
			{ method: 'POST', body: {} },
		);
		await linkAllBrandLocationsToOffer(ctx, {
			offerId: 'offerId-1',
			programId: 'programId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/programs/programId-1/locations',
			{ method: 'POST', body: {} },
		);
		await unlinkLocationToOffer(ctx, {
			offerId: 'offerId-1',
			locationId: 'locationId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/locations/locationId-1',
			{ method: 'DELETE' },
		);
		await sendOfferToBrand(ctx, { offerId: 'offerId-1' } as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers/offerId-1/notify', {
			method: 'POST',
			body: {},
		});
		await activateOfferOnCard(ctx, {
			offerId: 'offerId-1',
			cardId: 'cardId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/cards/cardId-1',
			{ method: 'POST', body: {} },
		);
		await unlinkCardFromOffer(ctx, {
			offerId: 'offerId-1',
			cardId: 'cardId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/cards/cardId-1',
			{ method: 'DELETE' },
		);
		await retrieveActiveOfferOnCard(ctx, {
			offerId: 'offerId-1',
			cardId: 'cardId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/offers/offerId-1/cards/cardId-1',
			{ method: 'GET' },
		);
		await listCardsWithActiveOffer(ctx, {
			offerId: 'offerId-1',
			limit: 'limit-1',
			order: 'order-1',
			start: 'start-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/offers/offerId-1/cards', {
			method: 'GET',
			query: { limit: 'limit-1', order: 'order-1', start: 'start-1' },
		});
		await createTransactionTest(ctx, {
			amount: 1,
			cardId: 'cardId-1',
			locationId: 'locationId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/transactions/test', {
			method: 'POST',
			body: { amount: 1, cardId: 'cardId-1', locationId: 'locationId-1' },
		});
		await retrieveTransaction(ctx, {
			transactionId: 'transactionId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/transactions/transactionId-1',
			{ method: 'GET' },
		);
		await listTransactions(ctx, {
			programId: 'programId-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
			from: 'from-1',
			to: 'to-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/transactions',
			{
				method: 'GET',
				query: {
					limit: 'limit-1',
					start: 'start-1',
					order: 'order-1',
					from: 'from-1',
					to: 'to-1',
				},
			},
		);
		await listTransactionsByCard(ctx, {
			cardId: 'cardId-1',
			limit: 'limit-1',
			start: 'start-1',
			order: 'order-1',
			from: 'from-1',
			to: 'to-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/cards/cardId-1/transactions',
			{
				method: 'GET',
				query: {
					limit: 'limit-1',
					start: 'start-1',
					order: 'order-1',
					from: 'from-1',
					to: 'to-1',
				},
			},
		);
		await listMids(ctx, {
			programId: 'programId-1',
			locationId: 'locationId-1',
			brandId: 'brandId-1',
			scheme: 'scheme-1',
			seNumber: 'seNumber-1',
			mcAcquiringMid: 'mcAcquiringMid-1',
			visaAcquiringMid: 'visaAcquiringMid-1',
			vmid: 'vmid-1',
			limit: 'limit-1',
			start: 'start-1',
			sort: 'sort-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/programs/programId-1/mids', {
			method: 'GET',
			query: {
				locationId: 'locationId-1',
				brandId: 'brandId-1',
				scheme: 'scheme-1',
				seNumber: 'seNumber-1',
				mcAcquiringMid: 'mcAcquiringMid-1',
				visaAcquiringMid: 'visaAcquiringMid-1',
				vmid: 'vmid-1',
				limit: 'limit-1',
				start: 'start-1',
				sort: 'sort-1',
				order: 'order-1',
			},
		});
		await retrieveMidRequest(ctx, {
			programId: 'programId-1',
			midRequestId: 'midRequestId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/mid-requests/midRequestId-1',
			{ method: 'GET' },
		);
		await listMidRequests(ctx, {
			programId: 'programId-1',
			locationId: 'locationId-1',
			brandId: 'brandId-1',
			midId: 'midId-1',
			status: 'status-1',
			scheme: 'scheme-1',
			seNumber: 'seNumber-1',
			mcAcquiringMid: 'mcAcquiringMid-1',
			vmid: 'vmid-1',
			limit: 'limit-1',
			start: 'start-1',
			sort: 'sort-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/mid-requests',
			{
				method: 'GET',
				query: {
					locationId: 'locationId-1',
					brandId: 'brandId-1',
					midId: 'midId-1',
					status: 'status-1',
					scheme: 'scheme-1',
					seNumber: 'seNumber-1',
					mcAcquiringMid: 'mcAcquiringMid-1',
					vmid: 'vmid-1',
					limit: 'limit-1',
					start: 'start-1',
					sort: 'sort-1',
					order: 'order-1',
				},
			},
		);
		await createMidRequest(ctx, {
			programId: 'programId-1',
			action: 'onboard',
			scheme: 'amex',
			locationId: 'locationId-1',
			midId: 'midId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/mid-requests',
			{
				method: 'POST',
				body: {
					action: 'onboard',
					scheme: 'amex',
					locationId: 'locationId-1',
					midId: 'midId-1',
				},
			},
		);
		await listMarketplaceOffers(ctx, {
			limit: 'limit-1',
			start: 'start-1',
			select: 'select-1',
			order: 'order-1',
			sort: 'sort-1',
			status: 'status-1',
			activation: 'activation-1',
			approval: 'approval-1',
			brandId: ['brandId-1'],
			channel: 'channel-1',
			supplierId: 'supplierId-1',
			countryCode: 'countryCode-1',
			network: 'network-1',
			returnPeriod: 'returnPeriod-1',
		} as never);
		expect(request).toHaveBeenCalledWith(ctx, '/v1/marketplace-offers', {
			method: 'GET',
			query: {
				limit: 'limit-1',
				start: 'start-1',
				select: 'select-1',
				order: 'order-1',
				sort: 'sort-1',
				status: 'status-1',
				activation: 'activation-1',
				approval: 'approval-1',
				brandId: ['brandId-1'],
				channel: 'channel-1',
				supplierId: 'supplierId-1',
				countryCode: 'countryCode-1',
				network: 'network-1',
				returnPeriod: 'returnPeriod-1',
			},
		});
		await createOfferFromMarketplaceOffer(ctx, {
			marketplaceOfferId: 'marketplaceOfferId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/marketplace-offers/marketplaceOfferId-1/offers',
			{ method: 'POST', body: {} },
		);
		await createMissingTransactionRequest(ctx, {
			cardId: 'cardId-1',
			locationId: 'locationId-1',
			amount: 1,
			transactionDate: 'transactionDate-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/cards/cardId-1/missing-transaction-requests',
			{
				method: 'POST',
				body: {
					locationId: 'locationId-1',
					amount: 1,
					transactionDate: 'transactionDate-1',
				},
			},
		);
		await retrieveMissingTransactionRequest(ctx, {
			missingTransactionRequestId: 'missingTransactionRequestId-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/missing-transaction-requests/missingTransactionRequestId-1',
			{ method: 'GET' },
		);
		await listMissingTransactionRequests(ctx, {
			programId: 'programId-1',
			brandId: 'brandId-1',
			locationId: 'locationId-1',
			cardId: 'cardId-1',
			amount: 'amount-1',
			transactionDate: 'transactionDate-1',
			scheme: 'scheme-1',
			status: 'status-1',
			limit: 'limit-1',
			start: 'start-1',
			sort: 'sort-1',
			order: 'order-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/missing-transaction-requests',
			{
				method: 'GET',
				query: {
					brandId: 'brandId-1',
					locationId: 'locationId-1',
					cardId: 'cardId-1',
					amount: 'amount-1',
					transactionDate: 'transactionDate-1',
					scheme: 'scheme-1',
					status: 'status-1',
					limit: 'limit-1',
					start: 'start-1',
					sort: 'sort-1',
					order: 'order-1',
				},
			},
		);
		await listMidInsights(ctx, {
			programId: 'programId-1',
			origin: ['origin-1'],
			id: ['id-1'],
			status: 'status-1',
			brandId: 'brandId-1',
			locationId: 'locationId-1',
			midId: 'midId-1',
			scheme: 'scheme-1',
			seNumber: 'seNumber-1',
			mcAcquiringMid: 'mcAcquiringMid-1',
			mcLocationId: 'mcLocationId-1',
			visaAcquiringMid: 'visaAcquiringMid-1',
			visaBin: 'visaBin-1',
			vmid: 'vmid-1',
			vsid: 'vsid-1',
			lastSeenTransactionDateFrom: 'lastSeenTransactionDateFrom-1',
			lastSeenTransactionDateTo: 'lastSeenTransactionDateTo-1',
			sort: 'sort-1',
			order: 'order-1',
			limit: 1,
			start: 'start-1',
			select: 'select-1',
		} as never);
		expect(request).toHaveBeenCalledWith(
			ctx,
			'/v1/programs/programId-1/mid-insights',
			{
				method: 'GET',
				query: {
					origin: ['origin-1'],
					id: ['id-1'],
					status: 'status-1',
					brandId: 'brandId-1',
					locationId: 'locationId-1',
					midId: 'midId-1',
					scheme: 'scheme-1',
					seNumber: 'seNumber-1',
					mcAcquiringMid: 'mcAcquiringMid-1',
					mcLocationId: 'mcLocationId-1',
					visaAcquiringMid: 'visaAcquiringMid-1',
					visaBin: 'visaBin-1',
					vmid: 'vmid-1',
					vsid: 'vsid-1',
					lastSeenTransactionDateFrom: 'lastSeenTransactionDateFrom-1',
					lastSeenTransactionDateTo: 'lastSeenTransactionDateTo-1',
					sort: 'sort-1',
					order: 'order-1',
					limit: 1,
					start: 'start-1',
					select: 'select-1',
				},
			},
		);
	});
});
