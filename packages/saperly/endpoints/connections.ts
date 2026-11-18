import type { SaperlyEndpoints } from '../index';
import { callSaperly, idempotencyHeaders, omitUndefined } from './call';
import {
	ConnectionSchema,
	CreateConnectionInputSchema,
	DeleteConnectionInputSchema,
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
	StatusSchema,
	UpdateConnectionInputSchema,
} from './types';

function connectionBody(body: {
	name?: string | null;
	mode?: 'hosted' | 'manual' | null;
	backend?: 'network' | 'openai_realtime' | null;
	instructions?: string | null;
	llm?: { kind: 'managed'; model: string } | null;
	tts?: { provider?: string | null; voiceId: string } | null;
	backgroundAudio?: { type: 'off' } | { type: 'office'; volume: number } | null;
	language?: string | null;
	mcpServers?: Array<{
		url: string;
		auth?: { type: 'bearer' | 'none'; token?: string | null } | null;
		allowedTools?: string[] | null;
	}> | null;
	callControl?: {
		endCall?: boolean | null;
		sendDtmf?: boolean | null;
		transfer?: { targets: string[]; from?: string | null } | null;
	} | null;
	complianceEnabled?: boolean | null;
	smsAutoReply?: boolean | null;
	disclosure?: string | null;
	openaiRealtime?: { model: string; voice?: string | null } | null;
	manualWebhookUrl?: string | null;
}): Record<string, unknown> {
	return omitUndefined({
		name: body.name,
		mode: body.mode,
		backend: body.backend,
		instructions: body.instructions,
		llm: body.llm,
		tts: body.tts,
		backgroundAudio: body.backgroundAudio,
		language: body.language,
		mcpServers: body.mcpServers,
		callControl: body.callControl,
		complianceEnabled: body.complianceEnabled,
		smsAutoReply: body.smsAutoReply,
		disclosure: body.disclosure,
		openaiRealtime: body.openaiRealtime,
		manualWebhookUrl: body.manualWebhookUrl,
	});
}

export const list: SaperlyEndpoints['listConnections'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.connections.list',
		SaperlyEndpointInputSchemas.listConnections,
		SaperlyEndpointOutputSchemas.listConnections,
		input,
		() => ({ method: 'GET', url: '/connections' }),
		(_input, connections) => ({ count: connections.length }),
	);
};

export const create: SaperlyEndpoints['createConnection'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.connections.create',
		CreateConnectionInputSchema,
		ConnectionSchema,
		input,
		(body) => ({
			method: 'POST',
			url: '/connections',
			headers: idempotencyHeaders(body.idempotencyKey),
			body: connectionBody(body),
		}),
		(body, connection) => ({
			connectionId: connection.id,
			name: body.name,
		}),
	);
};

export const get: SaperlyEndpoints['getConnection'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.connections.get',
		SaperlyEndpointInputSchemas.getConnection,
		ConnectionSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/connections/{id}',
			path: { id: body.id },
		}),
		(body) => ({ connectionId: body.id }),
	);
};

export const update: SaperlyEndpoints['updateConnection'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.connections.update',
		UpdateConnectionInputSchema,
		ConnectionSchema,
		input,
		(body) => ({
			method: 'PATCH',
			url: '/connections/{id}',
			path: { id: body.id },
			headers: idempotencyHeaders(body.idempotencyKey),
			body: connectionBody(body),
		}),
		(body) => ({ connectionId: body.id }),
	);
};

export const remove: SaperlyEndpoints['deleteConnection'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.connections.delete',
		DeleteConnectionInputSchema,
		StatusSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: '/connections/{id}',
			path: { id: body.id },
		}),
		(body, result) => ({ connectionId: body.id, status: result.status }),
	);
};
