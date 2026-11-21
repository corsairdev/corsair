import { makeLangbaseRequest } from '../client';
import type { LangbasePluginContext } from '../index';
import type { RunAgentInput, RunAgentOutput } from './types';
import { LangbaseEndpointInputSchemas, RunAgentOutputSchema } from './types';

export const agent = {
	run: async (
		ctx: LangbasePluginContext,
		input: RunAgentInput,
	): Promise<RunAgentOutput> => {
		const parsedInput = LangbaseEndpointInputSchemas['agent.run'].parse(input);
		// `unknown` because the provider response is untrusted until parsed below.
		const raw = await makeLangbaseRequest<unknown>('/agent/run', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});
		return RunAgentOutputSchema.parse(raw);
	},
};
