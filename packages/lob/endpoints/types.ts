import type { z } from 'zod';
import type {
	LobBaseEndpointInputs,
	LobBaseEndpointOutputs,
} from './types-base';
import { LobBaseInputSchemas, LobBaseOutputSchemas } from './types-base';
import { LobExtraInputSchemas, LobExtraOutputSchemas } from './types-extra';

// Every operation's input and output schema, keyed by the flat operation name
// (`postcardsSend`). The original 14 live in types.ts, the rest of Lob's API
// in types-extra.ts.

export const LobEndpointInputSchemas = {
	...LobBaseInputSchemas,
	...LobExtraInputSchemas,
} as const;

export const LobEndpointOutputSchemas = {
	...LobBaseOutputSchemas,
	...LobExtraOutputSchemas,
} as const;

type ExtraInputs = {
	[K in keyof typeof LobExtraInputSchemas]: z.input<
		(typeof LobExtraInputSchemas)[K]
	>;
};

type ExtraOutputs = {
	[K in keyof typeof LobExtraOutputSchemas]: z.output<
		(typeof LobExtraOutputSchemas)[K]
	>;
};

export type LobEndpointInputs = LobBaseEndpointInputs & ExtraInputs;
export type LobEndpointOutputs = LobBaseEndpointOutputs & ExtraOutputs;

export type LobOperation = keyof LobEndpointOutputs &
	keyof typeof LobEndpointInputSchemas;
