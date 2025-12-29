import type { CorsairPlugin } from '../../core/plugin';
import type { InferOptionSchema } from '../../core/schema/merge-schema';
import { mergeSchema } from '../../core/schema/merge-schema';
import { slackAdapter } from '../../adapters/slack';
import type { SlackAdapterOptions, SlackClient } from '../../adapters/slack';
import type { SlackSchema } from './schema';
import { getSlackSchema } from './schema';

export type SlackPluginOptions = SlackAdapterOptions & {
	schema?: InferOptionSchema<SlackSchema> | undefined;
};

export const slack = (options: SlackPluginOptions) => {
	const client = slackAdapter(options);

	return {
		id: 'slack',
		setup() {
			return {
				slack: client,
			};
		},
		schema: mergeSchema(getSlackSchema(), options.schema),
		$Infer: {
			Client: {} as { slack: SlackClient },
			Schema: {} as SlackSchema,
		},
	} satisfies CorsairPlugin;
};
