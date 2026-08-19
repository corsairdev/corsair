import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const inputsGetByAgentIdRoute = getRoute('inputsGetByAgentId');
export const inputsGetByAgentId: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, inputsGetByAgentIdRoute);
};

const inputsUpdateByAgentIdRoute = getRoute('inputsUpdateByAgentId');
export const inputsUpdateByAgentId: AgentyEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAgentyOperation(ctx, input, inputsUpdateByAgentIdRoute);
};

export const InputsEndpoints = {
	inputsGetByAgentId,
	inputsUpdateByAgentId,
} as const;
