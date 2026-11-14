import { makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	IntegrationsGetStripeInput,
	IntegrationsUpdateStripeInput,
	StripeConnection,
} from './types';
import {
	IntegrationsGetStripeInputSchema,
	IntegrationsUpdateStripeInputSchema,
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
	): Promise<StripeConnection> => {
		const parsed = IntegrationsUpdateStripeInputSchema.parse(input);
		const response = await makeGiftUpRequest<StripeConnection>(
			'/integrations/stripe/connection',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return StripeConnectionSchema.parse(response);
	},
};
