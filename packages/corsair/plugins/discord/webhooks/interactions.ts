import { logEventFromContext } from '../../utils/events';
import type { DiscordWebhooks } from '..';
import {
	createDiscordInteractionMatch,
	DiscordInteractionType,
	verifyDiscordWebhookSignature,
} from './types';

export const ping: DiscordWebhooks['ping'] = {
	match: createDiscordInteractionMatch(DiscordInteractionType.PING),

	handler: async (ctx, request) => {
		// Discord sends a PING to verify the endpoint URL.
		// We must respond with { "type": 1 } (PONG).
		// Signature verification is still required for PING.
		const verification = verifyDiscordWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		return {
			success: true,
			data: { type: 1 as const },
		};
	},
};

export const applicationCommand: DiscordWebhooks['applicationCommand'] = {
	match: createDiscordInteractionMatch(
		DiscordInteractionType.APPLICATION_COMMAND,
	),

	handler: async (ctx, request) => {
		const verification = verifyDiscordWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const interaction = request.payload;

		if (interaction.type !== DiscordInteractionType.APPLICATION_COMMAND) {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'discord.webhook.applicationCommand',
			{
				id: interaction.id,
				commandName: interaction.data.name,
				commandId: interaction.data.id,
				guildId: interaction.guild_id,
				userId: interaction.member?.user?.id ?? interaction.user?.id,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId: interaction.id,
			data: interaction,
		};
	},
};

export const messageComponent: DiscordWebhooks['messageComponent'] = {
	match: createDiscordInteractionMatch(
		DiscordInteractionType.MESSAGE_COMPONENT,
	),

	handler: async (ctx, request) => {
		const verification = verifyDiscordWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const interaction = request.payload;

		if (interaction.type !== DiscordInteractionType.MESSAGE_COMPONENT) {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'discord.webhook.messageComponent',
			{
				id: interaction.id,
				customId: interaction.data.custom_id,
				componentType: interaction.data.component_type,
				guildId: interaction.guild_id,
				userId: interaction.member?.user?.id ?? interaction.user?.id,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId: interaction.id,
			data: interaction,
		};
	},
};

export const modalSubmit: DiscordWebhooks['modalSubmit'] = {
	match: createDiscordInteractionMatch(DiscordInteractionType.MODAL_SUBMIT),

	handler: async (ctx, request) => {
		const verification = verifyDiscordWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const interaction = request.payload;

		if (interaction.type !== DiscordInteractionType.MODAL_SUBMIT) {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'discord.webhook.modalSubmit',
			{
				id: interaction.id,
				customId: interaction.data.custom_id,
				guildId: interaction.guild_id,
				userId: interaction.member?.user?.id ?? interaction.user?.id,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId: interaction.id,
			data: interaction,
		};
	},
};
