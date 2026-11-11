import { logEventFromContext } from 'corsair/core';
import { makeMixmaxRequest } from '../client';
import type { MixmaxEndpoints } from '../index';
import { mixmaxPathParameter } from './path';
import type { MixmaxEndpointOutputs } from './types';

export const integrationsCommandsList: MixmaxEndpoints['integrationsCommandsList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsCommandsList']
		>(ctx, '/v1/integrations/commands', {
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.commands.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsCommandsCreate: MixmaxEndpoints['integrationsCommandsCreate'] =
	async (ctx, input) => {
		const {
			name,
			commands,
			parameterPlaceholder,
			commandParameterHintsUrl,
			commandResolverUrl,
		} = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsCommandsCreate']
		>(ctx, '/v1/integrations/commands', {
			method: 'POST',
			body: {
				name,
				commands,
				parameterPlaceholder,
				commandParameterHintsUrl,
				commandResolverUrl,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.commands.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsCommandsDelete: MixmaxEndpoints['integrationsCommandsDelete'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsCommandsDelete']
		>(
			ctx,
			mixmaxPathParameter('/v1/integrations/commands/{id}', 'id', input.id),
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'mixmax.integrations.commands.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsEnhancementsList: MixmaxEndpoints['integrationsEnhancementsList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsEnhancementsList']
		>(ctx, '/v1/integrations/enhancements', {
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.enhancements.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsEnhancementsCreate: MixmaxEndpoints['integrationsEnhancementsCreate'] =
	async (ctx, input) => {
		const {
			name,
			icon,
			iconTooltip,
			editorUrl,
			resolverUrl,
			activateUrl,
			editorHeight,
			editorWidth,
			commands,
			category,
			isEditable,
		} = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsEnhancementsCreate']
		>(ctx, '/v1/integrations/enhancements', {
			method: 'POST',
			body: {
				name,
				icon,
				iconTooltip,
				editorUrl,
				resolverUrl,
				activateUrl,
				editorHeight,
				editorWidth,
				commands,
				category,
				isEditable,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.enhancements.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsEnhancementsDelete: MixmaxEndpoints['integrationsEnhancementsDelete'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsEnhancementsDelete']
		>(
			ctx,
			mixmaxPathParameter('/v1/integrations/enhancements/{id}', 'id', input.id),
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'mixmax.integrations.enhancements.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsLinkResolversList: MixmaxEndpoints['integrationsLinkResolversList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsLinkResolversList']
		>(ctx, '/v1/integrations/linkresolvers', {
			method: 'GET',
			query: {
				limit: input.limit,
				next: input.next,
				previous: input.previous,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.linkResolvers.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsLinkResolversCreate: MixmaxEndpoints['integrationsLinkResolversCreate'] =
	async (ctx, input) => {
		const { description, regex, resolverUrl } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsLinkResolversCreate']
		>(ctx, '/v1/integrations/linkresolvers', {
			method: 'POST',
			body: {
				description,
				regex,
				resolverUrl,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.linkResolvers.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsLinkResolversDelete: MixmaxEndpoints['integrationsLinkResolversDelete'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsLinkResolversDelete']
		>(
			ctx,
			mixmaxPathParameter(
				'/v1/integrations/linkresolvers/{id}',
				'id',
				input.id,
			),
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'mixmax.integrations.linkResolvers.delete',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsSidebarsList: MixmaxEndpoints['integrationsSidebarsList'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsSidebarsList']
		>(ctx, '/v1/integrations/sidebars', { method: 'GET' });

		await logEventFromContext(
			ctx,
			'mixmax.integrations.sidebars.list',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsSidebarsCreate: MixmaxEndpoints['integrationsSidebarsCreate'] =
	async (ctx, input) => {
		const { name, url, iconImage, iconName, iconColor } = input;
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsSidebarsCreate']
		>(ctx, '/v1/integrations/sidebars', {
			method: 'POST',
			body: {
				name,
				url,
				iconImage,
				iconName,
				iconColor,
			},
		});

		await logEventFromContext(
			ctx,
			'mixmax.integrations.sidebars.create',
			{ ...input },
			'completed',
		);
		return result;
	};

export const integrationsSidebarsDelete: MixmaxEndpoints['integrationsSidebarsDelete'] =
	async (ctx, input) => {
		const result = await makeMixmaxRequest<
			MixmaxEndpointOutputs['integrationsSidebarsDelete']
		>(
			ctx,
			mixmaxPathParameter('/v1/integrations/sidebars/{id}', 'id', input.id),
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'mixmax.integrations.sidebars.delete',
			{ ...input },
			'completed',
		);
		return result;
	};
