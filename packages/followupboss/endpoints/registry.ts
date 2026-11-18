import type { z } from 'zod';
import { AdminInputSchemas, AdminOutputSchemas } from './admin-types';
import {
	AutomationsInputSchemas,
	AutomationsOutputSchemas,
} from './automations-types';
import {
	CustomFieldsInputSchemas,
	CustomFieldsOutputSchemas,
} from './custom-fields-types';
import { DealInputSchemas, DealOutputSchemas } from './deal-types';
import { InboxInputSchemas, InboxOutputSchemas } from './inbox-types';
import {
	MarketingInputSchemas,
	MarketingOutputSchemas,
} from './marketing-types';
import {
	FollowUpBossEndpointInputSchemas as Part1Inputs,
	FollowUpBossEndpointOutputSchemas as Part1Outputs,
} from './types';
import { WebhooksInputSchemas, WebhooksOutputSchemas } from './webhooks-types';

// Aggregated schema registry for every registered operation. Part 1 lives in
// './types'; the later parts ship per-family schema files aggregated here, so
// the plugin's endpointSchemas map stays complete without one giant module.
export const FollowUpBossEndpointInputSchemas = {
	...Part1Inputs,
	...DealInputSchemas,
	...CustomFieldsInputSchemas,
	...MarketingInputSchemas,
	...AdminInputSchemas,
	...AutomationsInputSchemas,
	...WebhooksInputSchemas,
	...InboxInputSchemas,
} as const;

export const FollowUpBossEndpointOutputSchemas = {
	...Part1Outputs,
	...DealOutputSchemas,
	...CustomFieldsOutputSchemas,
	...MarketingOutputSchemas,
	...AdminOutputSchemas,
	...AutomationsOutputSchemas,
	...WebhooksOutputSchemas,
	...InboxOutputSchemas,
} as const;

export type FollowUpBossEndpointInputs = {
	[K in keyof typeof FollowUpBossEndpointInputSchemas]: z.infer<
		(typeof FollowUpBossEndpointInputSchemas)[K]
	>;
};

export type FollowUpBossEndpointOutputs = {
	[K in keyof typeof FollowUpBossEndpointOutputSchemas]: z.infer<
		(typeof FollowUpBossEndpointOutputSchemas)[K]
	>;
};
