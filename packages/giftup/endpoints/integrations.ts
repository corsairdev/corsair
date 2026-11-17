import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	IntegrationsGetStripeInput,
	IntegrationsUpdateStripeInput,
	IntegrationsUpdateStripeResponse,
	StripeConnection,
} from './types';
import {
	IntegrationsGetStripeInputSchema,
	IntegrationsUpdateStripeInputSchema,
	IntegrationsUpdateStripeResponseSchema,
	StripeConnectionSchema,
} from './types';

export const Integrations = {
	getStripeConnection: async (
		ctx: GiftUpContext,
		input: IntegrationsGetStripeInput,
	): Promise<StripeConnection> => {
		IntegrationsGetStripeInputSchema.parse(input);
		const response = await makeGiftUpRequest<StripeConnection>(
			'/integrations/stripe/connection',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return StripeConnectionSchema.parse(response);
	},
	updateStripeConnection: async (
		ctx: GiftUpContext,
		input: IntegrationsUpdateStripeInput,
	): Promise<IntegrationsUpdateStripeResponse> => {
		const parsed = IntegrationsUpdateStripeInputSchema.parse(input);
		const response = await makeGiftUpRequest<IntegrationsUpdateStripeResponse>(
			'/integrations/stripe/connection',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return IntegrationsUpdateStripeResponseSchema.parse(response);
	},
};
