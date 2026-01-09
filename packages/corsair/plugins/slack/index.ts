import type {
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
} from '../../core';
import { postMessage } from './endpoints/post-message';
import type { SlackCredentials } from './schema';
import { SlackSchema } from './schema';

export type SlackPluginOptions = {
	/**
	 * Example option. Not used in this barebones plugin yet.
	 */
	credentials: SlackCredentials;
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
		CorsairPluginContext<'slack', typeof SlackSchema>,
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
		schema: SlackSchema,
		endpoints: {
			postMessage,
		},
	} satisfies CorsairPlugin<'slack', SlackEndpoints, typeof SlackSchema>;
}
