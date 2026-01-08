import type {
	CorsairContext,
	CorsairEndpoint,
	CorsairPlugin,
} from '../../core';
import { slackSchema } from './schema';
import type { SlackAuthenticationSchema } from './schema';
import { postMessage } from './endpoints/post-message';

export type SlackPluginOptions = {
	/**
	 * Example option. Not used in this barebones plugin yet.
	 */
	credentials: SlackAuthenticationSchema;
	/**
	 * Optional per-endpoint hooks for this plugin instance.
	 *
	 * Example:
	 * hooks: {
	 *   postMessage: { before: async (ctx, input) => {}, after: async (ctx, res) => {} }
	 * }
	 */
	hooks?: CorsairPlugin<'slack', SlackEndpoints>['hooks'] | undefined;
};

export type SlackEndpoints = {
	postMessage: CorsairEndpoint<
		CorsairContext,
		[
			input: {
				channel: string;
				text: string;
			},
		],
		Promise<{
			ok: true;
			channel: string;
			ts: string;
		}>
	>;
};

export function slack(_options: SlackPluginOptions) {
	return {
		id: 'slack',
		schema: slackSchema,
		endpoints: {
			postMessage,
		},
	} satisfies CorsairPlugin<'slack', SlackEndpoints, typeof slackSchema>;
}
