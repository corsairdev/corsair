import type { ProabonoEndpoints } from '..';
import { asList, call } from './call';
import {
	ProabonoEndpointInputSchemas as Inputs,
	ProabonoEndpointOutputSchemas as Outputs,
} from './types';

export const list: ProabonoEndpoints['offersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.list',
			input: Inputs.offersList,
			output: Outputs.offersList,
			emptyValue: () => ({ offers: [] }),
		},
		input,
		({
			ReferenceSegment,
			ReferenceCustomer,
			IsVisible,
			IgnoreFeatures,
			Language,
			Html,
			Links,
			Page,
			SizePage,
		}) => ({
			method: 'GET',
			path: '/v1/Offers',
			query: {
				ReferenceSegment,
				ReferenceCustomer,
				IsVisible,
				IgnoreFeatures,
				Language,
				Html,
				Links,
				Page,
				SizePage,
			},
		}),
		{
			shape: asList('offers'),
			log: (_, result) => ({ count: result.offers.length }),
		},
	);

export const get: ProabonoEndpoints['offersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'offers.get',
			input: Inputs.offersGet,
			output: Outputs.offersGet,
			emptyValue: () => ({}),
		},
		input,
		({
			ReferenceOffer,
			ReferenceSegment,
			ReferenceCustomer,
			Upgrade,
			IdSubscription,
			IgnoreFeatures,
			Language,
			Html,
			Links,
		}) => ({
			method: 'GET',
			path: '/v1/Offer',
			query: {
				ReferenceOffer,
				ReferenceSegment,
				ReferenceCustomer,
				Upgrade,
				IdSubscription,
				IgnoreFeatures,
				Language,
				Html,
				Links,
			},
		}),
		{ log: (_, result) => ({ offerId: result.Id ?? undefined }) },
	);

export const features: ProabonoEndpoints['featuresList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'features.list',
			input: Inputs.featuresList,
			output: Outputs.featuresList,
			emptyValue: () => ({ features: [] }),
		},
		input,
		({
			ReferenceSegment,
			ReferenceCustomer,
			Language,
			IsVisible,
			Page,
			SizePage,
		}) => ({
			method: 'GET',
			path: '/v1/Features',
			query: {
				ReferenceSegment,
				ReferenceCustomer,
				Language,
				IsVisible,
				Page,
				SizePage,
			},
		}),
		{
			shape: asList('features'),
			log: (_, result) => ({ count: result.features.length }),
		},
	);

export const feature: ProabonoEndpoints['featuresGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'features.get',
			input: Inputs.featuresGet,
			output: Outputs.featuresGet,
			emptyValue: () => ({}),
		},
		input,
		({ ReferenceFeature, ReferenceSegment, ReferenceCustomer, Language }) => ({
			method: 'GET',
			path: '/v1/Feature',
			query: {
				ReferenceFeature,
				ReferenceSegment,
				ReferenceCustomer,
				Language,
			},
		}),
		{ log: (_, result) => ({ featureId: result.Id ?? undefined }) },
	);
