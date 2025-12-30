import type { CorsairDBAdapter } from './core/db/adapter';
import type { CorsairOptions } from './core/options';
import type { CorsairPlugin } from './core/plugin';
import { getSchema } from './core/schema/get-schema';
import type { PrettifyDeep, UnionToIntersection } from './core/types';

export { drizzleAdapter } from './adapters/db/drizzle';
export type * from './adapters/slack';
export { slackAdapter } from './adapters/slack';
export type { CorsairDBAdapter } from './core/db/adapter';
export type { CorsairOptions } from './core/options';
export type { CorsairPlugin } from './core/plugin';

export * from './plugins';
// Re-export zod as z for convenience
export { z } from 'zod';
// Re-export utilities from core package
export { dualKeyOperationsMap } from '@corsair-ai/core';

export type InferPluginTypes<O extends CorsairOptions> =
	O['plugins'] extends readonly (infer P)[]
		? UnionToIntersection<
				P extends CorsairPlugin
					? P['$Infer'] extends Record<string, any>
						? P['$Infer']
						: {}
					: {}
			>
		: {};

export type InferPluginClient<O extends CorsairOptions> =
	InferPluginTypes<O> extends { Client: infer C } ? C : {};

export type InferPluginSchema<O extends CorsairOptions> =
	InferPluginTypes<O> extends { Schema: infer S } ? S : {};

export type CorsairInstance<Options extends CorsairOptions = CorsairOptions> =
	PrettifyDeep<
		{
			options: Options;
			db: Options['db'] extends CorsairDBAdapter ? Options['db'] : undefined;
			schema: ReturnType<typeof getSchema>;
			$Infer: PrettifyDeep<InferPluginTypes<Options>>;
		} & InferPluginClient<Options>
	>;

export const corsair = <Options extends CorsairOptions>(
	options: Options & Record<never, never>,
): CorsairInstance<Options> => {
	const schema = getSchema(options);

	const instance: any = {
		options,
		db: options.db,
		schema,
		$Infer: {},
	};

	for (const plugin of options.plugins ?? []) {
		if (plugin.setup) {
			Object.assign(instance, plugin.setup({ options }));
		}
	}

	return instance as CorsairInstance<Options>;
};
