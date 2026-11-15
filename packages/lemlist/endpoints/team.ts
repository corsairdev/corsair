import { logEventFromContext } from 'corsair/core';
import type { LemlistQueryValue } from '../client';
import { makeLemlistRequest } from '../client';
import type { LemlistPluginContext } from '../index';
import type {
	TeamGetCreditsInput,
	TeamGetCreditsResponse,
	TeamGetCrmUsersInput,
	TeamGetCrmUsersResponse,
	TeamGetInput,
	TeamGetResponse,
	TeamGetSendersInput,
	TeamGetSendersResponse,
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

export const Team = {
	get: async (
		ctx: LemlistPluginContext,
		input: TeamGetInput,
	): Promise<TeamGetResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.teamGet.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/team',
			query: input.version ? { version: input.version } : undefined,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.teamGet.parse(response);
		const logFn: (
			_input: TeamGetInput,
			_res: TeamGetResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			teamId: res._id,
		});
		await logEventFromContext(
			ctx,
			'lemlist.team.get',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getSenders: async (
		ctx: LemlistPluginContext,
		input: TeamGetSendersInput,
	): Promise<TeamGetSendersResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.teamGetSenders.parse(input);
		const req: LemlistCall = ((input) => ({
			method: 'GET',
			url: '/team/senders',
			query: input.state ? { state: input.state } : undefined,
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.teamGetSenders.parse(response);
		const logFn: (
			_input: TeamGetSendersInput,
			_res: TeamGetSendersResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.team.getSenders',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getCredits: async (
		ctx: LemlistPluginContext,
		input: TeamGetCreditsInput,
	): Promise<TeamGetCreditsResponse> => {
		const parsedInput = LemlistEndpointInputSchemas.teamGetCredits.parse(input);
		const req: LemlistCall = ((_input) => ({
			method: 'GET',
			url: '/team/credits',
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.teamGetCredits.parse(response);
		const logFn: (
			_input: TeamGetCreditsInput,
			_res: TeamGetCreditsResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			credits: res.credits,
		});
		await logEventFromContext(
			ctx,
			'lemlist.team.getCredits',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
	getCrmUsers: async (
		ctx: LemlistPluginContext,
		input: TeamGetCrmUsersInput,
	): Promise<TeamGetCrmUsersResponse> => {
		const parsedInput =
			LemlistEndpointInputSchemas.teamGetCrmUsers.parse(input);
		const req: LemlistCall = ((_input) => ({
			method: 'GET',
			url: '/team/crmUsers',
		}))(parsedInput);
		// `unknown` because response.json() returns untrusted external data; the Zod schema narrows it.
		const response = await makeLemlistRequest<unknown>(req.url, ctx.key, {
			method: req.method,
			body: req.body,
			query: req.query,
			timeout: ctx.options.timeout,
		});
		const parsed = LemlistEndpointOutputSchemas.teamGetCrmUsers.parse(response);
		const logFn: (
			_input: TeamGetCrmUsersInput,
			_res: TeamGetCrmUsersResponse,
		) => Record<string, string | number | boolean> = (input, res) => ({
			count: res.length,
		});
		await logEventFromContext(
			ctx,
			'lemlist.team.getCrmUsers',
			logFn(parsedInput, parsed),
			'completed',
		);
		return parsed;
	},
};
