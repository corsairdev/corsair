import { logEventFromContext } from 'corsair/core';
import type { RecallaiEndpoints } from '..';
import { makeRecallaiContextRequest } from '../client';
import type {
	AudioOutputInput,
	BotActionInput,
	CreateBotInput,
	OutputMediaInput,
	PinParticipantInput,
	RecallaiEndpointOutputs,
	SendChatMessageInput,
	UpdateBotInput,
} from './types';
import { RecallaiBotActionInputSchemas } from './types';

const botPath = (id: string) => `/api/v1/bot/${encodeURIComponent(id)}/`;

export const listBots: RecallaiEndpoints['listBots'] = async (ctx, input) => {
	const response = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['listBots']
	>(ctx, '/api/v1/bot/', { method: 'GET', query: input });
	await logEventFromContext(ctx, 'recallai.bots.list', {}, 'completed');
	return response;
};

export const createBot: RecallaiEndpoints['createBot'] = async (ctx, input) => {
	const response = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['createBot']
	>(ctx, '/api/v1/bot/', { method: 'POST', body: input as CreateBotInput });
	await logEventFromContext(ctx, 'recallai.bots.create', {}, 'completed');
	return response;
};

export const retrieveBot: RecallaiEndpoints['retrieveBot'] = async (
	ctx,
	input,
) => {
	const response = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['retrieveBot']
	>(ctx, botPath(input.id), { method: 'GET' });
	await logEventFromContext(
		ctx,
		'recallai.bots.retrieve',
		{ id: input.id },
		'completed',
	);
	return response;
};

export const updateBot: RecallaiEndpoints['updateBot'] = async (ctx, input) => {
	const { id, ...body } = input as UpdateBotInput;
	const response = await makeRecallaiContextRequest<
		RecallaiEndpointOutputs['updateBot']
	>(ctx, botPath(id), { method: 'PATCH', body });
	await logEventFromContext(ctx, 'recallai.bots.update', { id }, 'completed');
	return response;
};

export const deleteBot: RecallaiEndpoints['deleteBot'] = async (ctx, input) => {
	await makeRecallaiContextRequest<undefined>(ctx, botPath(input.id), {
		method: 'DELETE',
	});
	await logEventFromContext(
		ctx,
		'recallai.bots.delete',
		{ id: input.id },
		'completed',
	);
};

const botActionPath = (id: string, action: string) =>
	`${botPath(id)}${action}/`;
const action =
	(
		actionName: Exclude<
			keyof typeof RecallaiBotActionInputSchemas,
			'pinParticipant'
		>,
		method: 'POST' | 'DELETE' = 'POST',
		schemaName: keyof typeof RecallaiBotActionInputSchemas = actionName,
	) =>
	async (
		ctx: Parameters<RecallaiEndpoints['listBots']>[0],
		input: BotActionInput,
	) => {
		const parsed = RecallaiBotActionInputSchemas[schemaName].parse(input);
		const botId = 'id' in parsed ? parsed.id : parsed.bot_id;
		await makeRecallaiContextRequest<undefined>(
			ctx,
			botActionPath(botId, actionNameToPath[actionName]),
			{ method },
		);
	};

const actionNameToPath = {
	deleteBotMedia: 'delete_media',
	leaveBotCall: 'leave_call',
	outputAudio: 'output_audio',
	outputMedia: 'output_media',
	outputScreenshare: 'output_screenshare',
	outputVideo: 'output_video',
	pauseRecording: 'pause_recording',
	pinParticipant: 'pin_participant',
	resumeRecording: 'resume_recording',
	sendChatMessage: 'send_chat_message',
	startRecording: 'start_recording',
	stopRecording: 'stop_recording',
} as const;

export const deleteBotMedia = action('deleteBotMedia');
export const leaveBotCall = action('leaveBotCall');
export const outputAudio = async (
	ctx: Parameters<RecallaiEndpoints['listBots']>[0],
	input: AudioOutputInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.outputAudio.parse(input);
	return makeRecallaiContextRequest(
		ctx,
		botActionPath(parsed.id, 'output_audio'),
		{ method: 'POST', body: { kind: parsed.kind, b64_data: parsed.b64_data } },
	);
};
export const stopOutputAudio = action(
	'outputAudio',
	'DELETE',
	'deleteBotMedia',
);
export const outputMedia = async (
	ctx: Parameters<RecallaiEndpoints['listBots']>[0],
	input: OutputMediaInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.outputMedia.parse(input);
	return makeRecallaiContextRequest(
		ctx,
		botActionPath(parsed.id, 'output_media'),
		{
			method: 'POST',
			body: { camera: parsed.camera, screenshare: parsed.screenshare },
		},
	);
};
export const stopOutputMedia = action(
	'outputMedia',
	'DELETE',
	'deleteBotMedia',
);
export const startScreenshare = async (
	ctx: Parameters<RecallaiEndpoints['listBots']>[0],
	input: AudioOutputInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.outputScreenshare.parse(input);
	return makeRecallaiContextRequest(
		ctx,
		botActionPath(parsed.id, 'output_screenshare'),
		{ method: 'POST', body: { kind: parsed.kind, b64_data: parsed.b64_data } },
	);
};
export const stopScreenshare = action(
	'outputScreenshare',
	'DELETE',
	'deleteBotMedia',
);
export const outputVideo = async (
	ctx: Parameters<RecallaiEndpoints['listBots']>[0],
	input: AudioOutputInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.outputVideo.parse(input);
	return makeRecallaiContextRequest(
		ctx,
		botActionPath(parsed.id, 'output_video'),
		{ method: 'POST', body: { kind: parsed.kind, b64_data: parsed.b64_data } },
	);
};
export const stopOutputVideo = action(
	'outputVideo',
	'DELETE',
	'deleteBotMedia',
);
export const pauseRecording = action('pauseRecording');
export const pinParticipant = async (
	ctx: Parameters<RecallaiEndpoints['listBots']>[0],
	input: PinParticipantInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.pinParticipant.parse(input);
	return makeRecallaiContextRequest(
		ctx,
		botActionPath(parsed.bot_id, 'pin_participant'),
		{ method: 'POST', body: { id: parsed.participant_id } },
	);
};
export const resumeRecording = action('resumeRecording');
export const sendChatMessage = async (
	ctx: Parameters<RecallaiEndpoints['listBots']>[0],
	input: SendChatMessageInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.sendChatMessage.parse(input);
	return makeRecallaiContextRequest(
		ctx,
		botActionPath(parsed.id, 'send_chat_message'),
		{
			method: 'POST',
			body: { to: parsed.to, message: parsed.message, pin: parsed.pin },
		},
	);
};
export const startRecording = action('startRecording');
export const stopRecording = action('stopRecording');
