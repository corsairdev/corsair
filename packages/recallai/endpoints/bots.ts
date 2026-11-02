import { logEventFromContext } from 'corsair/core';
import type { RecallaiEndpoints } from '..';
import { makeRecallaiRequest } from '../client';
import type { RecallaiEndpointOutputs, CreateBotInput, UpdateBotInput, BotActionInput, AudioOutputInput, OutputMediaInput, PinParticipantInput, SendChatMessageInput } from './types';
import { RecallaiBotActionInputSchemas } from './types';

const botPath = (id: string) => `/api/v1/bot/${encodeURIComponent(id)}/`;

export const listBots: RecallaiEndpoints['listBots'] = async (ctx, input) => {
	const response = await makeRecallaiRequest<RecallaiEndpointOutputs['listBots']>('/api/v1/bot/', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(ctx, 'recallai.bots.list', {}, 'completed');
	return response;
};

export const createBot: RecallaiEndpoints['createBot'] = async (ctx, input) => {
	const response = await makeRecallaiRequest<RecallaiEndpointOutputs['createBot']>('/api/v1/bot/', ctx.key, { method: 'POST', body: input as CreateBotInput });
	await logEventFromContext(ctx, 'recallai.bots.create', {}, 'completed');
	return response;
};

export const retrieveBot: RecallaiEndpoints['retrieveBot'] = async (ctx, input) => {
	const response = await makeRecallaiRequest<RecallaiEndpointOutputs['retrieveBot']>(botPath(input.id), ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'recallai.bots.retrieve', { id: input.id }, 'completed');
	return response;
};

export const updateBot: RecallaiEndpoints['updateBot'] = async (ctx, input) => {
	const { id, ...body } = input as UpdateBotInput;
	const response = await makeRecallaiRequest<RecallaiEndpointOutputs['updateBot']>(botPath(id), ctx.key, { method: 'PATCH', body });
	await logEventFromContext(ctx, 'recallai.bots.update', { id }, 'completed');
	return response;
};

export const deleteBot: RecallaiEndpoints['deleteBot'] = async (ctx, input) => {
	await makeRecallaiRequest<undefined>(botPath(input.id), ctx.key, { method: 'DELETE' });
	await logEventFromContext(ctx, 'recallai.bots.delete', { id: input.id }, 'completed');
};

const botActionPath = (id: string, action: string) => `${botPath(id)}${action}/`;
const action = (actionName: Exclude<keyof typeof RecallaiBotActionInputSchemas, 'pinParticipant'>, method: 'POST' | 'DELETE' = 'POST') => async (ctx: { key: string }, input: BotActionInput) => {
	const parsed = RecallaiBotActionInputSchemas[actionName].parse(input);
	await makeRecallaiRequest<undefined>(botActionPath(parsed.id, actionNameToPath[actionName]), ctx.key, { method });
};

const actionNameToPath = {
	deleteBotMedia: 'delete_media', leaveBotCall: 'leave_call', outputAudio: 'output_audio', outputMedia: 'output_media',
	outputScreenshare: 'output_screenshare', outputVideo: 'output_video', pauseRecording: 'pause_recording',
	pinParticipant: 'pin_participant', resumeRecording: 'resume_recording', sendChatMessage: 'send_chat_message',
	startRecording: 'start_recording', stopRecording: 'stop_recording',
} as const;

export const deleteBotMedia = action('deleteBotMedia');
export const leaveBotCall = action('leaveBotCall');
export const outputAudio = async (ctx: { key: string }, input: AudioOutputInput) => {
	const parsed = RecallaiBotActionInputSchemas.outputAudio.parse(input);
	return makeRecallaiRequest(botActionPath(parsed.id, 'output_audio'), ctx.key, { method: 'POST', body: { kind: parsed.kind, b64_data: parsed.b64_data } });
};
export const stopOutputAudio = action('outputAudio', 'DELETE');
export const outputMedia = async (ctx: { key: string }, input: OutputMediaInput) => {
	const parsed = RecallaiBotActionInputSchemas.outputMedia.parse(input);
	return makeRecallaiRequest(botActionPath(parsed.id, 'output_media'), ctx.key, { method: 'POST', body: { camera: parsed.camera, screenshare: parsed.screenshare } });
};
export const stopOutputMedia = action('outputMedia', 'DELETE');
export const startScreenshare = async (ctx: { key: string }, input: AudioOutputInput) => {
	const parsed = RecallaiBotActionInputSchemas.outputScreenshare.parse(input);
	return makeRecallaiRequest(botActionPath(parsed.id, 'output_screenshare'), ctx.key, { method: 'POST', body: { kind: parsed.kind, b64_data: parsed.b64_data } });
};
export const stopScreenshare = action('outputScreenshare', 'DELETE');
export const outputVideo = async (ctx: { key: string }, input: AudioOutputInput) => {
	const parsed = RecallaiBotActionInputSchemas.outputVideo.parse(input);
	return makeRecallaiRequest(botActionPath(parsed.id, 'output_video'), ctx.key, { method: 'POST', body: { kind: parsed.kind, b64_data: parsed.b64_data } });
};
export const stopOutputVideo = action('outputVideo', 'DELETE');
export const pauseRecording = action('pauseRecording');
export const pinParticipant = async (ctx: { key: string }, input: PinParticipantInput) => {
	const parsed = RecallaiBotActionInputSchemas.pinParticipant.parse(input);
	return makeRecallaiRequest(botActionPath(parsed.bot_id, 'pin_participant'), ctx.key, { method: 'POST', body: { id: parsed.participant_id } });
};
export const resumeRecording = action('resumeRecording');
export const sendChatMessage = async (ctx: { key: string }, input: SendChatMessageInput) => {
	const parsed = RecallaiBotActionInputSchemas.sendChatMessage.parse(input);
	return makeRecallaiRequest(botActionPath(parsed.id, 'send_chat_message'), ctx.key, { method: 'POST', body: { to: parsed.to, message: parsed.message, pin: parsed.pin } });
};
export const startRecording = action('startRecording');
export const stopRecording = action('stopRecording');
