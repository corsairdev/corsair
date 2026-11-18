import { logEventFromContext } from 'corsair/core';
import { makeRecallaiContextRequest } from '../client';
import type { RecallaiEndpoints } from '../index';
import type {
	AudioOutputInput,
	BotActionInput,
	CreateBotInput,
	OutputMediaInput,
	PinParticipantInput,
	RecallaiEndpointOutputs,
	SendChatMessageInput,
	StartRecordingInput,
	StopOutputMediaInput,
	UpdateBotInput,
	VideoOutputInput,
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

type BotContext = Parameters<RecallaiEndpoints['listBots']>[0];
type BotResponse = RecallaiEndpointOutputs['retrieveBot'];

/** POSTs a bot action and returns the updated bot Recall answers with. */
const postBotAction = async (
	ctx: BotContext,
	botId: string,
	actionPath: string,
	operation: string,
	// Bodies are validated by each action's input schema before this point.
	body?: Record<string, unknown>,
): Promise<BotResponse> => {
	const response = await makeRecallaiContextRequest<BotResponse>(
		ctx,
		botActionPath(botId, actionPath),
		body === undefined ? { method: 'POST' } : { method: 'POST', body },
	);
	await logEventFromContext(ctx, operation, { id: botId }, 'completed');
	return response;
};

/** Stops one kind of bot output; Recall answers 204. */
const stopBotOutput = async (
	ctx: BotContext,
	botId: string,
	actionPath: string,
	operation: string,
	// Bodies are validated by the stop action's input schema before this point.
	body?: Record<string, unknown>,
): Promise<undefined> => {
	await makeRecallaiContextRequest<undefined>(
		ctx,
		botActionPath(botId, actionPath),
		body === undefined ? { method: 'DELETE' } : { method: 'DELETE', body },
	);
	await logEventFromContext(ctx, operation, { id: botId }, 'completed');
	return undefined;
};

const simpleAction =
	(
		actionPath: string,
		operation: string,
	): ((ctx: BotContext, input: BotActionInput) => Promise<BotResponse>) =>
	async (ctx, input) => {
		const { id } = RecallaiBotActionInputSchemas.deleteBotMedia.parse(input);
		return postBotAction(ctx, id, actionPath, operation);
	};

const stopAction =
	(
		actionPath: string,
		operation: string,
	): ((ctx: BotContext, input: BotActionInput) => Promise<undefined>) =>
	async (ctx, input) => {
		const { id } = RecallaiBotActionInputSchemas.stopOutput.parse(input);
		return stopBotOutput(ctx, id, actionPath, operation);
	};

export const deleteBotMedia = simpleAction(
	'delete_media',
	'recallai.bots.deleteMedia',
);
export const leaveBotCall = simpleAction(
	'leave_call',
	'recallai.bots.leaveCall',
);
export const outputAudio = async (ctx: BotContext, input: AudioOutputInput) => {
	const { id, ...body } =
		RecallaiBotActionInputSchemas.outputAudio.parse(input);
	return postBotAction(
		ctx,
		id,
		'output_audio',
		'recallai.bots.outputAudio',
		body,
	);
};
export const stopOutputAudio = stopAction(
	'output_audio',
	'recallai.bots.stopOutputAudio',
);
export const outputMedia = async (ctx: BotContext, input: OutputMediaInput) => {
	const { id, ...body } =
		RecallaiBotActionInputSchemas.outputMedia.parse(input);
	return postBotAction(
		ctx,
		id,
		'output_media',
		'recallai.bots.outputMedia',
		body,
	);
};
/** Recall needs to know which outputs to stop: camera, screenshare or both. */
export const stopOutputMedia = async (
	ctx: BotContext,
	input: StopOutputMediaInput,
) => {
	const { id, ...body } =
		RecallaiBotActionInputSchemas.stopOutputMedia.parse(input);
	return stopBotOutput(
		ctx,
		id,
		'output_media',
		'recallai.bots.stopOutputMedia',
		body,
	);
};
export const startScreenshare = async (
	ctx: BotContext,
	input: VideoOutputInput,
) => {
	const { id, ...body } =
		RecallaiBotActionInputSchemas.outputScreenshare.parse(input);
	return postBotAction(
		ctx,
		id,
		'output_screenshare',
		'recallai.bots.startScreenshare',
		body,
	);
};
export const stopScreenshare = stopAction(
	'output_screenshare',
	'recallai.bots.stopScreenshare',
);
export const outputVideo = async (ctx: BotContext, input: VideoOutputInput) => {
	const { id, ...body } =
		RecallaiBotActionInputSchemas.outputVideo.parse(input);
	return postBotAction(
		ctx,
		id,
		'output_video',
		'recallai.bots.outputVideo',
		body,
	);
};
export const stopOutputVideo = stopAction(
	'output_video',
	'recallai.bots.stopOutputVideo',
);
export const pauseRecording = simpleAction(
	'pause_recording',
	'recallai.bots.pauseRecording',
);
export const pinParticipant = async (
	ctx: BotContext,
	input: PinParticipantInput,
) => {
	const parsed = RecallaiBotActionInputSchemas.pinParticipant.parse(input);
	return postBotAction(
		ctx,
		parsed.bot_id,
		'pin_participant',
		'recallai.bots.pinParticipant',
		{ id: parsed.participant_id },
	);
};
export const resumeRecording = simpleAction(
	'resume_recording',
	'recallai.bots.resumeRecording',
);
export const sendChatMessage = async (
	ctx: BotContext,
	input: SendChatMessageInput,
) => {
	const { id, ...body } =
		RecallaiBotActionInputSchemas.sendChatMessage.parse(input);
	return postBotAction(
		ctx,
		id,
		'send_chat_message',
		'recallai.bots.sendChatMessage',
		body,
	);
};
/** Restarts the recording; `recording_config` replaces the bot's current one. */
export const startRecording = async (
	ctx: BotContext,
	input: StartRecordingInput,
) => {
	const { id, recording_config } =
		RecallaiBotActionInputSchemas.startRecording.parse(input);
	return postBotAction(
		ctx,
		id,
		'start_recording',
		'recallai.bots.startRecording',
		recording_config,
	);
};
export const stopRecording = simpleAction(
	'stop_recording',
	'recallai.bots.stopRecording',
);
