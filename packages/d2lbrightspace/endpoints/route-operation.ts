import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { D2lBrightspaceContext } from '..';
import type { D2lRequestAuth } from '../client';
import {
	D2lBrightspaceConfigurationError,
	makeD2lBrightspaceRequest,
} from '../client';
import type { D2lRouteDefinition } from '../route-definitions';
import type { D2lRouteInput, D2lRouteOutput } from './types';
import { createD2lRouteInputSchema, D2lRouteOutputSchema } from './types';

function isPublicVersionRoute(route: D2lRouteDefinition): boolean {
	return (
		route.group === 'API properties' &&
		route.path.startsWith('/d2l/api/') &&
		route.path.includes('/versions')
	);
}

export function createD2lRouteEndpoint(
	route: D2lRouteDefinition,
): CorsairEndpoint<D2lBrightspaceContext, D2lRouteInput, D2lRouteOutput> {
	return async (ctx, input) => {
		createD2lRouteInputSchema(route).parse(input);
		let baseUrl = ctx.options.baseUrl;
		if (!baseUrl && ctx.keys) {
			baseUrl = (await ctx.keys.get_brightspace_url()) ?? undefined;
		}
		if (!baseUrl) {
			throw new D2lBrightspaceConfigurationError(
				'Configure a Brightspace origin in the account credentials or the plugin baseUrl option.',
			);
		}

		let auth: D2lRequestAuth;
		if (isPublicVersionRoute(route)) {
			auth = { kind: 'public' };
		} else if (ctx.options.authType === 'oauth_2') {
			if (!ctx.key) throw new AuthMissingError('d2lbrightspace', 'oauth_2');
			auth = { kind: 'oauth_2', accessToken: ctx.key };
		} else {
			const [applicationId, userId, userKey] = await Promise.all([
				ctx.keys.get_application_id(),
				ctx.keys.get_user_id(),
				ctx.keys.get_user_key(),
			]);
			if (!ctx.key || !applicationId || !userId || !userKey) {
				throw new AuthMissingError('d2lbrightspace', 'api_key');
			}
			auth = {
				kind: 'api_key',
				applicationId,
				applicationKey: ctx.key,
				userId,
				userKey,
			};
		}

		const output = await makeD2lBrightspaceRequest(
			route,
			input,
			baseUrl,
			auth,
			ctx.options.timeoutMs,
		);
		const parsed = D2lRouteOutputSchema.parse(output);
		await logEventFromContext(
			ctx,
			'd2lbrightspace.route.completed',
			{ operationId: route.routeId },
			'completed',
		);
		return parsed;
	};
}
