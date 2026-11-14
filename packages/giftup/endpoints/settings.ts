import { encodeGiftUpPathId, makeGiftUpRequest } from '../client';
import type { GiftUpContext } from '../index';
import type {
	Artwork,
	CheckoutSettings,
	EmailSettings,
	GiftCardSettings,
	SettingsDeleteArtworkInput,
	SettingsGetCheckoutInput,
	SettingsGetEmailInput,
	SettingsGetGiftCardInput,
	SettingsGetShippingInput,
	SettingsListArtworkInput,
	SettingsListArtworkResponse,
	SettingsUpdateCheckoutInput,
	SettingsUpdateEmailInput,
	SettingsUpdateGiftCardInput,
	SettingsUploadArtworkInput,
	ShippingSettings,
	SuccessResponse,
} from './types';
import {
	ArtworkSchema,
	CheckoutSettingsSchema,
	EmailSettingsSchema,
	GiftCardSettingsSchema,
	SettingsDeleteArtworkInputSchema,
	SettingsGetCheckoutInputSchema,
	SettingsGetEmailInputSchema,
	SettingsGetGiftCardInputSchema,
	SettingsGetShippingInputSchema,
	SettingsListArtworkInputSchema,
	SettingsListArtworkResponseSchema,
	SettingsUpdateCheckoutInputSchema,
	SettingsUpdateEmailInputSchema,
	SettingsUpdateGiftCardInputSchema,
	SettingsUploadArtworkInputSchema,
	ShippingSettingsSchema,
	SuccessResponseSchema,
} from './types';

export const Settings = {
	getCheckout: async (
		ctx: GiftUpContext,
		input: SettingsGetCheckoutInput,
	): Promise<CheckoutSettings> => {
		SettingsGetCheckoutInputSchema.parse(input);
		const response = await makeGiftUpRequest<CheckoutSettings>(
			'/settings/checkout',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return CheckoutSettingsSchema.parse(response);
	},
	updateCheckout: async (
		ctx: GiftUpContext,
		input: SettingsUpdateCheckoutInput,
	): Promise<CheckoutSettings> => {
		const parsed = SettingsUpdateCheckoutInputSchema.parse(input);
		const response = await makeGiftUpRequest<CheckoutSettings>(
			'/settings/checkout',
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return CheckoutSettingsSchema.parse(response);
	},
	getEmail: async (
		ctx: GiftUpContext,
		input: SettingsGetEmailInput,
	): Promise<EmailSettings> => {
		SettingsGetEmailInputSchema.parse(input);
		const response = await makeGiftUpRequest<EmailSettings>(
			'/settings/email',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return EmailSettingsSchema.parse(response);
	},
	updateEmail: async (
		ctx: GiftUpContext,
		input: SettingsUpdateEmailInput,
	): Promise<EmailSettings> => {
		const parsed = SettingsUpdateEmailInputSchema.parse(input);
		const response = await makeGiftUpRequest<EmailSettings>(
			'/settings/email',
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return EmailSettingsSchema.parse(response);
	},
	getGiftCard: async (
		ctx: GiftUpContext,
		input: SettingsGetGiftCardInput,
	): Promise<GiftCardSettings> => {
		SettingsGetGiftCardInputSchema.parse(input);
		const response = await makeGiftUpRequest<GiftCardSettings>(
			'/settings/gift-card',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardSettingsSchema.parse(response);
	},
	updateGiftCard: async (
		ctx: GiftUpContext,
		input: SettingsUpdateGiftCardInput,
	): Promise<GiftCardSettings> => {
		const parsed = SettingsUpdateGiftCardInputSchema.parse(input);
		const response = await makeGiftUpRequest<GiftCardSettings>(
			'/settings/gift-card',
			ctx.key,
			{
				method: 'PATCH',
				body: parsed.patch,
				testMode: ctx.options?.testMode,
			},
		);
		return GiftCardSettingsSchema.parse(response);
	},
	listArtwork: async (
		ctx: GiftUpContext,
		input: SettingsListArtworkInput,
	): Promise<SettingsListArtworkResponse> => {
		SettingsListArtworkInputSchema.parse(input);
		const response = await makeGiftUpRequest<SettingsListArtworkResponse>(
			'/settings/gift-card/artwork',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return SettingsListArtworkResponseSchema.parse(response);
	},
	uploadArtwork: async (
		ctx: GiftUpContext,
		input: SettingsUploadArtworkInput,
	): Promise<Artwork> => {
		const parsed = SettingsUploadArtworkInputSchema.parse(input);
		const response = await makeGiftUpRequest<Artwork>(
			'/settings/gift-card/artwork',
			ctx.key,
			{
				method: 'POST',
				body: parsed,
				testMode: ctx.options?.testMode,
			},
		);
		return ArtworkSchema.parse(response);
	},
	deleteArtwork: async (
		ctx: GiftUpContext,
		input: SettingsDeleteArtworkInput,
	): Promise<SuccessResponse> => {
		const parsed = SettingsDeleteArtworkInputSchema.parse(input);
		const response = await makeGiftUpRequest<SuccessResponse>(
			`/settings/gift-card/artwork/${encodeGiftUpPathId(parsed.id)}`,
			ctx.key,
			{
				method: 'DELETE',
				testMode: ctx.options?.testMode,
			},
		);
		return SuccessResponseSchema.parse(response);
	},
	getShipping: async (
		ctx: GiftUpContext,
		input: SettingsGetShippingInput,
	): Promise<ShippingSettings> => {
		SettingsGetShippingInputSchema.parse(input);
		const response = await makeGiftUpRequest<ShippingSettings>(
			'/settings/shipping',
			ctx.key,
			{
				method: 'GET',
				testMode: ctx.options?.testMode,
			},
		);
		return ShippingSettingsSchema.parse(response);
	},
};
