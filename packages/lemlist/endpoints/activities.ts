import { logEventFromContext } from 'corsair/core';
import type { LemlistQueryValue } from '../client';
import { makeLemlistRequest } from '../client';
import type { LemlistPluginContext } from '../index';
import type {
	ActivitiesDeleteRecordingTranscriptInput,
	ActivitiesDeleteRecordingTranscriptResponse,
	ActivitiesListInput,
	ActivitiesListResponse,
} from './types';
import {
	LemlistEndpointInputSchemas,
	LemlistEndpointOutputSchemas,
} from './types';

type LemlistCall = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	url: string;
	// `unknown` because request bodies vary per endpoint.
	body?: Record<string, unknown> | unknown[];
	query?: Record<string, LemlistQueryValue>;
};

export const Activities = {
	list: async (
		ctx: LemlistPluginContext,
		input: ActivitiesListInput,
	): Promise<ActivitiesListResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.activitiesList.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/activities',
			query: { ...input, version: 'v2' },
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.activitiesList.parse(response);
		const logFn: (
			_input: ActivitiesListInput,
			_res: ActivitiesListResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.activities.list',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	deleteRecordingTranscript: async (
		ctx: LemlistPluginContext,
		input: ActivitiesDeleteRecordingTranscriptInput,
	): Promise<ActivitiesDeleteRecordingTranscriptResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.activitiesDeleteRecordingTranscript.parse(
				input,
			);
		const req: LemlistCall = ((input) => ({
			method: 'DELETE',
			url: `/activities/${encodeURIComponent(input.activityId)}/recording-transcript`,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed =
			LemlistEndpointOutputSchemas.activitiesDeleteRecordingTranscript.parse(
				response,
			);
		const logFn: (
			_input: ActivitiesDeleteRecordingTranscriptInput,
			_res: ActivitiesDeleteRecordingTranscriptResponse,
		) => Record<string, string | number | boolean> = (input) => ({
			activityId: input.activityId,
		});
		await logEventFromContext(
			ctx,
			'lemlist.activities.deleteRecordingTranscript',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
};
