import { z } from 'zod';
import {
	VestaboardCharacters,
	VestaboardMessage,
	VestaboardSubscription,
} from '../schema';

export const SubscriptionsListInputSchema = z.object({});
export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;

export const SubscriptionsListOutputSchema = z.object({
	subscriptions: z.array(VestaboardSubscription),
});
export type SubscriptionsListOutput = z.infer<
	typeof SubscriptionsListOutputSchema
>;

export const SubscriptionsPostMessageInputSchema = z
	.object({
		subscriptionId: z.string().min(1),
		text: z.string().min(1).optional(),
		characters: VestaboardCharacters.optional(),
	})
	.refine(
		(value) => (value.text !== undefined) !== (value.characters !== undefined),
		{ message: 'Provide exactly one of text or characters' },
	);
export type SubscriptionsPostMessageInput = z.infer<
	typeof SubscriptionsPostMessageInputSchema
>;

export const SubscriptionsPostMessageOutputSchema = VestaboardMessage;
export type SubscriptionsPostMessageOutput = z.infer<
	typeof SubscriptionsPostMessageOutputSchema
>;

export const VestaboardEndpointInputSchemas = {
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsPostMessage: SubscriptionsPostMessageInputSchema,
} as const;

export const VestaboardEndpointOutputSchemas = {
	subscriptionsList: SubscriptionsListOutputSchema,
	subscriptionsPostMessage: SubscriptionsPostMessageOutputSchema,
} as const;

export type VestaboardEndpointInputs = {
	[K in keyof typeof VestaboardEndpointInputSchemas]: z.infer<
		(typeof VestaboardEndpointInputSchemas)[K]
	>;
};

export type VestaboardEndpointOutputs = {
	[K in keyof typeof VestaboardEndpointOutputSchemas]: z.infer<
		(typeof VestaboardEndpointOutputSchemas)[K]
	>;
};
