import { logEventFromContext } from 'corsair/core';
import { makeDialpadRequest } from '../client';
import type { DialpadContext } from '../index';
import { DialpadOperationDefinitions } from './definitions';
import type { DialpadEndpointInputs, DialpadEndpointKey } from './types';
import {
	DialpadEndpointInputSchemas,
	DialpadEndpointOutputSchemas,
} from './types';

export const DialpadOperationFunctions = {
	'accesscontrolpolicies.assign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.assign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.assign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.assign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.assign'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.assign',
			{ operation: 'accesscontrolpolicies.assign' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.delete'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.delete',
			{ operation: 'accesscontrolpolicies.delete' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.update'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.update',
			{ operation: 'accesscontrolpolicies.update' },
			'completed',
		);
		return output;
	},
	'agentgroup.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['agentgroup.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['agentgroup.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['agentgroup.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['agentgroup.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.agentgroup.get',
			{ operation: 'agentgroup.get' },
			'completed',
		);
		return output;
	},
	'anonymization.requests.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['anonymization.requests.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['anonymization.requests.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['anonymization.requests.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['anonymization.requests.get'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.anonymization.requests.get',
			{ operation: 'anonymization.requests.get' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.list'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.list',
			{ operation: 'accesscontrolpolicies.list' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.unassign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.unassign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.unassign'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.unassign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.unassign'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.unassign',
			{ operation: 'accesscontrolpolicies.unassign' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.create'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.create',
			{ operation: 'accesscontrolpolicies.create' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.assignments': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.assignments'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.assignments'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.assignments'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.assignments'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.assignments',
			{ operation: 'accesscontrolpolicies.assignments' },
			'completed',
		);
		return output;
	},
	'anonymization.contacts': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['anonymization.contacts'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['anonymization.contacts'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['anonymization.contacts'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['anonymization.contacts'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.anonymization.contacts',
			{ operation: 'anonymization.contacts' },
			'completed',
		);
		return output;
	},
	'accesscontrolpolicies.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['accesscontrolpolicies.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['accesscontrolpolicies.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['accesscontrolpolicies.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.accesscontrolpolicies.get',
			{ operation: 'accesscontrolpolicies.get' },
			'completed',
		);
		return output;
	},
	'app_settings.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['app_settings.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['app_settings.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['app_settings.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['app_settings.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.app_settings.get',
			{ operation: 'app_settings.get' },
			'completed',
		);
		return output;
	},
	'blockednumbers.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['blockednumbers.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['blockednumbers.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['blockednumbers.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.blockednumbers.get',
			{ operation: 'blockednumbers.get' },
			'completed',
		);
		return output;
	},
	'available_numbers.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['available_numbers.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['available_numbers.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['available_numbers.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['available_numbers.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.available_numbers.list',
			{ operation: 'available_numbers.list' },
			'completed',
		);
		return output;
	},
	'blockednumbers.add': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['blockednumbers.add'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.add'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['blockednumbers.add'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['blockednumbers.add'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.blockednumbers.add',
			{ operation: 'blockednumbers.add' },
			'completed',
		);
		return output;
	},
	'blockednumbers.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['blockednumbers.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['blockednumbers.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['blockednumbers.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.blockednumbers.list',
			{ operation: 'blockednumbers.list' },
			'completed',
		);
		return output;
	},
	'blockednumbers.remove': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['blockednumbers.remove'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.remove'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['blockednumbers.remove'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['blockednumbers.remove'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.blockednumbers.remove',
			{ operation: 'blockednumbers.remove' },
			'completed',
		);
		return output;
	},
	'call.assign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.assign'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['call.assign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.assign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['call.assign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.assign',
			{ operation: 'call.assign' },
			'completed',
		);
		return output;
	},
	'call.get_assigned_operators': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.get_assigned_operators'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.get_assigned_operators'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.get_assigned_operators'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.get_assigned_operators'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.call.get_assigned_operators',
			{ operation: 'call.get_assigned_operators' },
			'completed',
		);
		return output;
	},
	'anonymization.callcontent': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['anonymization.callcontent'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['anonymization.callcontent'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['anonymization.callcontent'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['anonymization.callcontent'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.anonymization.callcontent',
			{ operation: 'anonymization.callcontent' },
			'completed',
		);
		return output;
	},
	'call.get_ai_recap': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.get_ai_recap'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.get_ai_recap'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.get_ai_recap'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.get_ai_recap'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.get_ai_recap',
			{ operation: 'call.get_ai_recap' },
			'completed',
		);
		return output;
	},
	'call.participants.add': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.participants.add'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.participants.add'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.participants.add'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.participants.add'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.participants.add',
			{ operation: 'call.participants.add' },
			'completed',
		);
		return output;
	},
	'call.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.list'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['call.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['call.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.list',
			{ operation: 'call.list' },
			'completed',
		);
		return output;
	},
	'call.initiate_ivr_call': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.initiate_ivr_call'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.initiate_ivr_call'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.initiate_ivr_call'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.initiate_ivr_call'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.initiate_ivr_call',
			{ operation: 'call.initiate_ivr_call' },
			'completed',
		);
		return output;
	},
	'call.unassign_all_call_operators': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.unassign_all_call_operators'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.unassign_all_call_operators'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.unassign_all_call_operators'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.unassign_all_call_operators'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.call.unassign_all_call_operators',
			{ operation: 'call.unassign_all_call_operators' },
			'completed',
		);
		return output;
	},
	'call.transfer_call': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.transfer_call'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.transfer_call'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.transfer_call'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.transfer_call'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.transfer_call',
			{ operation: 'call.transfer_call' },
			'completed',
		);
		return output;
	},
	'call.get_call_info': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.get_call_info'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.get_call_info'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.get_call_info'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.get_call_info'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.get_call_info',
			{ operation: 'call.get_call_info' },
			'completed',
		);
		return output;
	},
	'call.unassign_operator': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.unassign_operator'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.unassign_operator'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.unassign_operator'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.unassign_operator'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.unassign_operator',
			{ operation: 'call.unassign_operator' },
			'completed',
		);
		return output;
	},
	'call.unpark': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.unpark'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['call.unpark'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.unpark'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['call.unpark'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.unpark',
			{ operation: 'call.unpark' },
			'completed',
		);
		return output;
	},
	'call.initiate': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.initiate'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.initiate'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.initiate'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.initiate'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.initiate',
			{ operation: 'call.initiate' },
			'completed',
		);
		return output;
	},
	'call.add_labels': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.add_labels'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.add_labels'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.add_labels'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call.add_labels'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.add_labels',
			{ operation: 'call.add_labels' },
			'completed',
		);
		return output;
	},
	'call.hangup': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call.hangup'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['call.hangup'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call.hangup'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['call.hangup'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call.hangup',
			{ operation: 'call.hangup' },
			'completed',
		);
		return output;
	},
	'callbacks.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callbacks.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callbacks.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callbacks.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callbacks.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callbacks.list',
			{ operation: 'callbacks.list' },
			'completed',
		);
		return output;
	},
	'callback.validate': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callback.validate'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callback.validate'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callback.validate'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callback.validate'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callback.validate',
			{ operation: 'callback.validate' },
			'completed',
		);
		return output;
	},
	'callcenters.listall': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.listall'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.listall'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.listall'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.listall'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.listall',
			{ operation: 'callcenters.listall' },
			'completed',
		);
		return output;
	},
	'callcenters.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.get',
			{ operation: 'callcenters.get' },
			'completed',
		);
		return output;
	},
	'callcenters.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.update',
			{ operation: 'callcenters.update' },
			'completed',
		);
		return output;
	},
	'callcenters.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.create',
			{ operation: 'callcenters.create' },
			'completed',
		);
		return output;
	},
	'callback.enqueue': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callback.enqueue'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callback.enqueue'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callback.enqueue'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callback.enqueue'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callback.enqueue',
			{ operation: 'callback.enqueue' },
			'completed',
		);
		return output;
	},
	'callcenters.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.delete',
			{ operation: 'callcenters.delete' },
			'completed',
		);
		return output;
	},
	'callcenters.get_status': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.get_status'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.get_status'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.get_status'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.get_status'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.get_status',
			{ operation: 'callcenters.get_status' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.update_duty_status': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.update_duty_status'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.update_duty_status'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.update_duty_status'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'callcenters.operators.update_duty_status'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.update_duty_status',
			{ operation: 'callcenters.operators.update_duty_status' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.get_skill_level': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.get_skill_level'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.get_skill_level'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.get_skill_level'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'callcenters.operators.get_skill_level'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.get_skill_level',
			{ operation: 'callcenters.operators.get_skill_level' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.get_duty_status': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.get_duty_status'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.get_duty_status'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.get_duty_status'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'callcenters.operators.get_duty_status'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.get_duty_status',
			{ operation: 'callcenters.operators.get_duty_status' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.update_skill_level': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.update_skill_level'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.update_skill_level'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.update_skill_level'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'callcenters.operators.update_skill_level'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.update_skill_level',
			{ operation: 'callcenters.operators.update_skill_level' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.add': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.add'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.operators.add'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.add'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.operators.add'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.add',
			{ operation: 'callcenters.operators.add' },
			'completed',
		);
		return output;
	},
	'callcenters.queue.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.queue.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.queue.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.queue.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.queue.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.queue.list',
			{ operation: 'callcenters.queue.list' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.operators.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.operators.delete'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.delete',
			{ operation: 'callcenters.operators.delete' },
			'completed',
		);
		return output;
	},
	'call_labels.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call_labels.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_labels.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call_labels.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call_labels.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.call_labels.list',
			{ operation: 'call_labels.list' },
			'completed',
		);
		return output;
	},
	'call_review_share_link.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call_review_share_link.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call_review_share_link.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call_review_share_link.get'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.call_review_share_link.get',
			{ operation: 'call_review_share_link.get' },
			'completed',
		);
		return output;
	},
	'call_review_share_link.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call_review_share_link.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call_review_share_link.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call_review_share_link.create'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.call_review_share_link.create',
			{ operation: 'call_review_share_link.create' },
			'completed',
		);
		return output;
	},
	'call_review_share_link.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call_review_share_link.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call_review_share_link.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call_review_share_link.delete'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.call_review_share_link.delete',
			{ operation: 'call_review_share_link.delete' },
			'completed',
		);
		return output;
	},
	'callrouters.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callrouters.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callrouters.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callrouters.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callrouters.list',
			{ operation: 'callrouters.list' },
			'completed',
		);
		return output;
	},
	'callcenters.operators.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.operators.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.operators.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.operators.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.operators.list'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.operators.list',
			{ operation: 'callcenters.operators.list' },
			'completed',
		);
		return output;
	},
	'callrouters.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callrouters.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callrouters.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callrouters.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callrouters.delete',
			{ operation: 'callrouters.delete' },
			'completed',
		);
		return output;
	},
	'callrouters.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callrouters.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callrouters.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callrouters.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callrouters.create',
			{ operation: 'callrouters.create' },
			'completed',
		);
		return output;
	},
	'callrouters.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callrouters.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callrouters.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callrouters.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callrouters.get',
			{ operation: 'callrouters.get' },
			'completed',
		);
		return output;
	},
	'call_review_share_link.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['call_review_share_link.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['call_review_share_link.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['call_review_share_link.update'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.call_review_share_link.update',
			{ operation: 'call_review_share_link.update' },
			'completed',
		);
		return output;
	},
	'callrouters.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callrouters.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callrouters.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callrouters.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callrouters.update',
			{ operation: 'callrouters.update' },
			'completed',
		);
		return output;
	},
	'numbers.assign_call_router_number.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.assign_call_router_number.post'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'numbers.assign_call_router_number.post'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.assign_call_router_number.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'numbers.assign_call_router_number.post'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.assign_call_router_number.post',
			{ operation: 'numbers.assign_call_router_number.post' },
			'completed',
		);
		return output;
	},
	'channels.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['channels.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.delete',
			{ operation: 'channels.delete' },
			'completed',
		);
		return output;
	},
	'channels.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['channels.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.get',
			{ operation: 'channels.get' },
			'completed',
		);
		return output;
	},
	'channels.members.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.members.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.members.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.members.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['channels.members.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.members.list',
			{ operation: 'channels.members.list' },
			'completed',
		);
		return output;
	},
	'channels.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['channels.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.list',
			{ operation: 'channels.list' },
			'completed',
		);
		return output;
	},
	'coaching_team.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['coaching_team.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['coaching_team.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['coaching_team.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.coaching_team.get',
			{ operation: 'coaching_team.get' },
			'completed',
		);
		return output;
	},
	'coaching_team.members.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['coaching_team.members.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.members.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['coaching_team.members.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['coaching_team.members.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.coaching_team.members.get',
			{ operation: 'coaching_team.members.get' },
			'completed',
		);
		return output;
	},
	'channels.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['channels.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.create',
			{ operation: 'channels.create' },
			'completed',
		);
		return output;
	},
	'channels.members.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.members.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.members.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.members.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['channels.members.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.members.delete',
			{ operation: 'channels.members.delete' },
			'completed',
		);
		return output;
	},
	'channels.members.add': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['channels.members.add'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.members.add'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['channels.members.add'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['channels.members.add'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.channels.members.add',
			{ operation: 'channels.members.add' },
			'completed',
		);
		return output;
	},
	'coaching_team.listall': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['coaching_team.listall'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.listall'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['coaching_team.listall'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['coaching_team.listall'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.coaching_team.listall',
			{ operation: 'coaching_team.listall' },
			'completed',
		);
		return output;
	},
	'company.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['company.get'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['company.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['company.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['company.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.company.get',
			{ operation: 'company.get' },
			'completed',
		);
		return output;
	},
	'company.sms_opt_out': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['company.sms_opt_out'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.sms_opt_out'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['company.sms_opt_out'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['company.sms_opt_out'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.company.sms_opt_out',
			{ operation: 'company.sms_opt_out' },
			'completed',
		);
		return output;
	},
	'company.update_settings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['company.update_settings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.update_settings'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['company.update_settings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['company.update_settings'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.company.update_settings',
			{ operation: 'company.update_settings' },
			'completed',
		);
		return output;
	},
	'coaching_team.members.add': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['coaching_team.members.add'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.members.add'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['coaching_team.members.add'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['coaching_team.members.add'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.coaching_team.members.add',
			{ operation: 'coaching_team.members.add' },
			'completed',
		);
		return output;
	},
	'company.get_ai_settings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['company.get_ai_settings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.get_ai_settings'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['company.get_ai_settings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['company.get_ai_settings'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.company.get_ai_settings',
			{ operation: 'company.get_ai_settings' },
			'completed',
		);
		return output;
	},
	'company.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['company.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['company.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['company.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.company.update',
			{ operation: 'company.update' },
			'completed',
		);
		return output;
	},
	'company.update_ai_settings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['company.update_ai_settings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.update_ai_settings'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['company.update_ai_settings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['company.update_ai_settings'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.company.update_ai_settings',
			{ operation: 'company.update_ai_settings' },
			'completed',
		);
		return output;
	},
	'contacts.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['contacts.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.delete',
			{ operation: 'contacts.delete' },
			'completed',
		);
		return output;
	},
	'contacts.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['contacts.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.update',
			{ operation: 'contacts.update' },
			'completed',
		);
		return output;
	},
	'contacts.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['contacts.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.list',
			{ operation: 'contacts.list' },
			'completed',
		);
		return output;
	},
	'contacts.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['contacts.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.get',
			{ operation: 'contacts.get' },
			'completed',
		);
		return output;
	},
	'contacts.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['contacts.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.create',
			{ operation: 'contacts.create' },
			'completed',
		);
		return output;
	},
	'contacts.create_with_uid': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.create_with_uid'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.create_with_uid'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.create_with_uid'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['contacts.create_with_uid'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.create_with_uid',
			{ operation: 'contacts.create_with_uid' },
			'completed',
		);
		return output;
	},
	'ivr.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['ivr.delete'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['ivr.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['ivr.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['ivr.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.ivr.delete',
			{ operation: 'ivr.delete' },
			'completed',
		);
		return output;
	},
	'contacts.search': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['contacts.search'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.search'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['contacts.search'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['contacts.search'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.contacts.search',
			{ operation: 'contacts.search' },
			'completed',
		);
		return output;
	},
	'ivr.assign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['ivr.assign'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['ivr.assign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['ivr.assign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['ivr.assign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.ivr.assign',
			{ operation: 'ivr.assign' },
			'completed',
		);
		return output;
	},
	'custom_ivrs.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['custom_ivrs.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['custom_ivrs.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['custom_ivrs.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['custom_ivrs.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.custom_ivrs.list',
			{ operation: 'custom_ivrs.list' },
			'completed',
		);
		return output;
	},
	'ivr.update_details': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['ivr.update_details'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['ivr.update_details'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['ivr.update_details'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['ivr.update_details'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.ivr.update_details',
			{ operation: 'ivr.update_details' },
			'completed',
		);
		return output;
	},
	'departments.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.delete',
			{ operation: 'departments.delete' },
			'completed',
		);
		return output;
	},
	'ivr.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['ivr.create'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['ivr.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['ivr.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['ivr.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.ivr.create',
			{ operation: 'ivr.create' },
			'completed',
		);
		return output;
	},
	'departments.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.update',
			{ operation: 'departments.update' },
			'completed',
		);
		return output;
	},
	'departments.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.create',
			{ operation: 'departments.create' },
			'completed',
		);
		return output;
	},
	'departments.listall': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.listall'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.listall'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.listall'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.listall'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.listall',
			{ operation: 'departments.listall' },
			'completed',
		);
		return output;
	},
	'departments.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.get',
			{ operation: 'departments.get' },
			'completed',
		);
		return output;
	},
	'departments.operators.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.operators.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.operators.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.operators.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.operators.delete'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.departments.operators.delete',
			{ operation: 'departments.operators.delete' },
			'completed',
		);
		return output;
	},
	'dispositions.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['dispositions.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['dispositions.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['dispositions.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.dispositions.delete',
			{ operation: 'dispositions.delete' },
			'completed',
		);
		return output;
	},
	'digital.sessions.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['digital.sessions.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['digital.sessions.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['digital.sessions.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['digital.sessions.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.digital.sessions.list',
			{ operation: 'digital.sessions.list' },
			'completed',
		);
		return output;
	},
	'dispositions.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['dispositions.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['dispositions.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['dispositions.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.dispositions.update',
			{ operation: 'dispositions.update' },
			'completed',
		);
		return output;
	},
	'dispositions.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['dispositions.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['dispositions.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['dispositions.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.dispositions.get',
			{ operation: 'dispositions.get' },
			'completed',
		);
		return output;
	},
	'departments.operators.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.operators.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.operators.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.operators.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.operators.list'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.departments.operators.list',
			{ operation: 'departments.operators.list' },
			'completed',
		);
		return output;
	},
	'dispositions.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['dispositions.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['dispositions.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['dispositions.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.dispositions.list',
			{ operation: 'dispositions.list' },
			'completed',
		);
		return output;
	},
	'dispositions.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['dispositions.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['dispositions.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['dispositions.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.dispositions.create',
			{ operation: 'dispositions.create' },
			'completed',
		);
		return output;
	},
	'departments.operators.add': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.operators.add'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.operators.add'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.operators.add'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.operators.add'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.operators.add',
			{ operation: 'departments.operators.add' },
			'completed',
		);
		return output;
	},
	'faxline.assign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['faxline.assign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['faxline.assign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['faxline.assign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['faxline.assign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.faxline.assign',
			{ operation: 'faxline.assign' },
			'completed',
		);
		return output;
	},
	'bulk_messages.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['bulk_messages.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['bulk_messages.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['bulk_messages.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.bulk_messages.get',
			{ operation: 'bulk_messages.get' },
			'completed',
		);
		return output;
	},
	'fax.send': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['fax.send'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['fax.send'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['fax.send'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['fax.send'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.fax.send',
			{ operation: 'fax.send' },
			'completed',
		);
		return output;
	},
	'bulk_messages.send': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['bulk_messages.send'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.send'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['bulk_messages.send'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['bulk_messages.send'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.bulk_messages.send',
			{ operation: 'bulk_messages.send' },
			'completed',
		);
		return output;
	},
	'scheduled_messages.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scheduled_messages.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scheduled_messages.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scheduled_messages.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scheduled_messages.create',
			{ operation: 'scheduled_messages.create' },
			'completed',
		);
		return output;
	},
	'scheduled_messages.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scheduled_messages.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scheduled_messages.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scheduled_messages.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scheduled_messages.delete',
			{ operation: 'scheduled_messages.delete' },
			'completed',
		);
		return output;
	},
	'bulk_messages.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['bulk_messages.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['bulk_messages.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['bulk_messages.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.bulk_messages.update',
			{ operation: 'bulk_messages.update' },
			'completed',
		);
		return output;
	},
	'bulk_messages.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['bulk_messages.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['bulk_messages.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['bulk_messages.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.bulk_messages.list',
			{ operation: 'bulk_messages.list' },
			'completed',
		);
		return output;
	},
	'scheduled_messages.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scheduled_messages.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scheduled_messages.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scheduled_messages.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scheduled_messages.list',
			{ operation: 'scheduled_messages.list' },
			'completed',
		);
		return output;
	},
	'numbers.unassign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.unassign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.unassign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.unassign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.unassign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.unassign',
			{ operation: 'numbers.unassign' },
			'completed',
		);
		return output;
	},
	'scheduled_messages.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scheduled_messages.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scheduled_messages.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scheduled_messages.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scheduled_messages.get',
			{ operation: 'scheduled_messages.get' },
			'completed',
		);
		return output;
	},
	'numbers.assign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.assign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.assign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.assign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.assign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.assign',
			{ operation: 'numbers.assign' },
			'completed',
		);
		return output;
	},
	'scheduled_messages.send_now': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scheduled_messages.send_now'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.send_now'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scheduled_messages.send_now'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scheduled_messages.send_now'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.scheduled_messages.send_now',
			{ operation: 'scheduled_messages.send_now' },
			'completed',
		);
		return output;
	},
	'numbers.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['numbers.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.list',
			{ operation: 'numbers.list' },
			'completed',
		);
		return output;
	},
	'numbers.auto_assign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.auto_assign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.auto_assign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.auto_assign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.auto_assign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.auto_assign',
			{ operation: 'numbers.auto_assign' },
			'completed',
		);
		return output;
	},
	'numbers.swap': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.swap'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.swap'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.swap'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['numbers.swap'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.swap',
			{ operation: 'numbers.swap' },
			'completed',
		);
		return output;
	},
	'number_tags.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['number_tags.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['number_tags.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['number_tags.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['number_tags.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.number_tags.update',
			{ operation: 'number_tags.update' },
			'completed',
		);
		return output;
	},
	'scheduled_messages.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scheduled_messages.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scheduled_messages.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scheduled_messages.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scheduled_messages.update',
			{ operation: 'scheduled_messages.update' },
			'completed',
		);
		return output;
	},
	'numbers.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.get'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['numbers.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['numbers.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.get',
			{ operation: 'numbers.get' },
			'completed',
		);
		return output;
	},
	'coaching_team.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['coaching_team.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['coaching_team.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['coaching_team.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.coaching_team.list',
			{ operation: 'coaching_team.list' },
			'completed',
		);
		return output;
	},
	'office_plan.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['office_plan.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['office_plan.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['office_plan.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['office_plan.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.office_plan.get',
			{ operation: 'office_plan.get' },
			'completed',
		);
		return output;
	},
	'phone_number.format': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['phone_number.format'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['phone_number.format'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['phone_number.format'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['phone_number.format'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.phone_number.format',
			{ operation: 'phone_number.format' },
			'completed',
		);
		return output;
	},
	'departments.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['departments.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['departments.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['departments.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.departments.list',
			{ operation: 'departments.list' },
			'completed',
		);
		return output;
	},
	'numbers.office_unassign_number.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.office_unassign_number.post'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.office_unassign_number.post'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.office_unassign_number.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.office_unassign_number.post'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.office_unassign_number.post',
			{ operation: 'numbers.office_unassign_number.post' },
			'completed',
		);
		return output;
	},
	'callcenters.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['callcenters.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['callcenters.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['callcenters.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.callcenters.list',
			{ operation: 'callcenters.list' },
			'completed',
		);
		return output;
	},
	'numbers.assign_office_number.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.assign_office_number.post'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.assign_office_number.post'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.assign_office_number.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.assign_office_number.post'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.assign_office_number.post',
			{ operation: 'numbers.assign_office_number.post' },
			'completed',
		);
		return output;
	},
	'available_licenses.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['available_licenses.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['available_licenses.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['available_licenses.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['available_licenses.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.available_licenses.list',
			{ operation: 'available_licenses.list' },
			'completed',
		);
		return output;
	},
	'offices.e911.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.e911.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.e911.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.e911.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.e911.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.e911.get',
			{ operation: 'offices.e911.get' },
			'completed',
		);
		return output;
	},
	'offices.offdutystatuses.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.offdutystatuses.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.offdutystatuses.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.offdutystatuses.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.offdutystatuses.get'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.offices.offdutystatuses.get',
			{ operation: 'offices.offdutystatuses.get' },
			'completed',
		);
		return output;
	},
	'offices.e911.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.e911.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.e911.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.e911.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.e911.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.e911.update',
			{ operation: 'offices.e911.update' },
			'completed',
		);
		return output;
	},
	'offices.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.update',
			{ operation: 'offices.update' },
			'completed',
		);
		return output;
	},
	'offices.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.get'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['offices.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['offices.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.get',
			{ operation: 'offices.get' },
			'completed',
		);
		return output;
	},
	'offices.primary.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.primary.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.primary.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.primary.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.primary.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.primary.get',
			{ operation: 'offices.primary.get' },
			'completed',
		);
		return output;
	},
	'offices.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['offices.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.list',
			{ operation: 'offices.list' },
			'completed',
		);
		return output;
	},
	'offices.operators.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.operators.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.operators.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.operators.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.operators.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.operators.delete',
			{ operation: 'offices.operators.delete' },
			'completed',
		);
		return output;
	},
	'offices.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.create',
			{ operation: 'offices.create' },
			'completed',
		);
		return output;
	},
	'offices.operators.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.operators.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.operators.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.operators.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.operators.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.operators.get',
			{ operation: 'offices.operators.get' },
			'completed',
		);
		return output;
	},
	'offices.operators.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['offices.operators.post'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.operators.post'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['offices.operators.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['offices.operators.post'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.offices.operators.post',
			{ operation: 'offices.operators.post' },
			'completed',
		);
		return output;
	},
	'recording_share_link.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recording_share_link.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recording_share_link.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recording_share_link.create'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.recording_share_link.create',
			{ operation: 'recording_share_link.create' },
			'completed',
		);
		return output;
	},
	'recording_share_link.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recording_share_link.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recording_share_link.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recording_share_link.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.recording_share_link.get',
			{ operation: 'recording_share_link.get' },
			'completed',
		);
		return output;
	},
	'numbers.assign_room_number.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.assign_room_number.post'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.assign_room_number.post'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.assign_room_number.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.assign_room_number.post'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.assign_room_number.post',
			{ operation: 'numbers.assign_room_number.post' },
			'completed',
		);
		return output;
	},
	'numbers.room_unassign_number.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['numbers.room_unassign_number.post'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.room_unassign_number.post'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['numbers.room_unassign_number.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['numbers.room_unassign_number.post'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.numbers.room_unassign_number.post',
			{ operation: 'numbers.room_unassign_number.post' },
			'completed',
		);
		return output;
	},
	'rooms.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['rooms.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['rooms.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['rooms.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['rooms.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.rooms.delete',
			{ operation: 'rooms.delete' },
			'completed',
		);
		return output;
	},
	'rooms.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['rooms.get'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['rooms.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['rooms.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.rooms.get',
			{ operation: 'rooms.get' },
			'completed',
		);
		return output;
	},
	'recording_share_link.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recording_share_link.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recording_share_link.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recording_share_link.delete'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.recording_share_link.delete',
			{ operation: 'recording_share_link.delete' },
			'completed',
		);
		return output;
	},
	'rooms.post': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['rooms.post'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.post'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['rooms.post'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['rooms.post'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.rooms.post',
			{ operation: 'rooms.post' },
			'completed',
		);
		return output;
	},
	'recording_share_link.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recording_share_link.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recording_share_link.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recording_share_link.update'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.recording_share_link.update',
			{ operation: 'recording_share_link.update' },
			'completed',
		);
		return output;
	},
	'deskphones.rooms.create_international_pin': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.rooms.create_international_pin'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'deskphones.rooms.create_international_pin'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.rooms.create_international_pin'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'deskphones.rooms.create_international_pin'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.rooms.create_international_pin',
			{ operation: 'deskphones.rooms.create_international_pin' },
			'completed',
		);
		return output;
	},
	'rooms.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['rooms.list'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['rooms.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['rooms.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.rooms.list',
			{ operation: 'rooms.list' },
			'completed',
		);
		return output;
	},
	'deskphones.rooms.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.rooms.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.rooms.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.rooms.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['deskphones.rooms.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.rooms.get',
			{ operation: 'deskphones.rooms.get' },
			'completed',
		);
		return output;
	},
	'rooms.patch': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['rooms.patch'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.patch'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['rooms.patch'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['rooms.patch'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.rooms.patch',
			{ operation: 'rooms.patch' },
			'completed',
		);
		return output;
	},
	'deskphones.rooms.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.rooms.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.rooms.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.rooms.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['deskphones.rooms.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.rooms.list',
			{ operation: 'deskphones.rooms.list' },
			'completed',
		);
		return output;
	},
	'deskphones.rooms.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.rooms.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.rooms.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.rooms.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['deskphones.rooms.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.rooms.delete',
			{ operation: 'deskphones.rooms.delete' },
			'completed',
		);
		return output;
	},
	'schedule_reports.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['schedule_reports.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['schedule_reports.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['schedule_reports.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.schedule_reports.update',
			{ operation: 'schedule_reports.update' },
			'completed',
		);
		return output;
	},
	'schedule_reports.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['schedule_reports.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['schedule_reports.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['schedule_reports.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.schedule_reports.create',
			{ operation: 'schedule_reports.create' },
			'completed',
		);
		return output;
	},
	'schedule_reports.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['schedule_reports.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['schedule_reports.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['schedule_reports.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.schedule_reports.get',
			{ operation: 'schedule_reports.get' },
			'completed',
		);
		return output;
	},
	'scorecards.export.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scorecards.export.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.export.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scorecards.export.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scorecards.export.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scorecards.export.get',
			{ operation: 'scorecards.export.get' },
			'completed',
		);
		return output;
	},
	'scorecards.export.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scorecards.export.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.export.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scorecards.export.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scorecards.export.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scorecards.export.create',
			{ operation: 'scorecards.export.create' },
			'completed',
		);
		return output;
	},
	'scorecards.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scorecards.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scorecards.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scorecards.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scorecards.get',
			{ operation: 'scorecards.get' },
			'completed',
		);
		return output;
	},
	'scorecards.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['scorecards.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['scorecards.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['scorecards.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.scorecards.list',
			{ operation: 'scorecards.list' },
			'completed',
		);
		return output;
	},
	'schedule_reports.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['schedule_reports.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['schedule_reports.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['schedule_reports.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.schedule_reports.delete',
			{ operation: 'schedule_reports.delete' },
			'completed',
		);
		return output;
	},
	'schedule_reports.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['schedule_reports.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['schedule_reports.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['schedule_reports.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.schedule_reports.list',
			{ operation: 'schedule_reports.list' },
			'completed',
		);
		return output;
	},
	'stats.export.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['stats.export.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['stats.export.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['stats.export.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['stats.export.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.stats.export.create',
			{ operation: 'stats.export.create' },
			'completed',
		);
		return output;
	},
	'stats.export.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['stats.export.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['stats.export.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['stats.export.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['stats.export.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.stats.export.get',
			{ operation: 'stats.export.get' },
			'completed',
		);
		return output;
	},
	'sms.send': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['sms.send'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['sms.send'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['sms.send'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['sms.send'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.sms.send',
			{ operation: 'sms.send' },
			'completed',
		);
		return output;
	},
	'users.initiate_call': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.initiate_call'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.initiate_call'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.initiate_call'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.initiate_call'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.initiate_call',
			{ operation: 'users.initiate_call' },
			'completed',
		);
		return output;
	},
	'users.toggle_call_vi': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.toggle_call_vi'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.toggle_call_vi'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.toggle_call_vi'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.toggle_call_vi'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.toggle_call_vi',
			{ operation: 'users.toggle_call_vi' },
			'completed',
		);
		return output;
	},
	'userdevices.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['userdevices.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['userdevices.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['userdevices.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['userdevices.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.userdevices.get',
			{ operation: 'userdevices.get' },
			'completed',
		);
		return output;
	},
	'transcripts.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['transcripts.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['transcripts.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['transcripts.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['transcripts.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.transcripts.get',
			{ operation: 'transcripts.get' },
			'completed',
		);
		return output;
	},
	'userdevices.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['userdevices.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['userdevices.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['userdevices.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['userdevices.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.userdevices.list',
			{ operation: 'userdevices.list' },
			'completed',
		);
		return output;
	},
	'users.toggle_call_recording': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.toggle_call_recording'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.toggle_call_recording'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.toggle_call_recording'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.toggle_call_recording'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.users.toggle_call_recording',
			{ operation: 'users.toggle_call_recording' },
			'completed',
		);
		return output;
	},
	'transcripts.get_url': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['transcripts.get_url'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['transcripts.get_url'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['transcripts.get_url'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['transcripts.get_url'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.transcripts.get_url',
			{ operation: 'transcripts.get_url' },
			'completed',
		);
		return output;
	},
	'users.set_caller_id': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.set_caller_id'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.set_caller_id'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.set_caller_id'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.set_caller_id'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.set_caller_id',
			{ operation: 'users.set_caller_id' },
			'completed',
		);
		return output;
	},
	'deskphones.users.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.users.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.users.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.users.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['deskphones.users.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.users.delete',
			{ operation: 'deskphones.users.delete' },
			'completed',
		);
		return output;
	},
	'caller_id.users.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['caller_id.users.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['caller_id.users.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['caller_id.users.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['caller_id.users.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.caller_id.users.get',
			{ operation: 'caller_id.users.get' },
			'completed',
		);
		return output;
	},
	'deskphones.users.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.users.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.users.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.users.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['deskphones.users.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.users.get',
			{ operation: 'deskphones.users.get' },
			'completed',
		);
		return output;
	},
	'users.e911.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.e911.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.e911.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.e911.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.e911.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.e911.update',
			{ operation: 'users.e911.update' },
			'completed',
		);
		return output;
	},
	'users.toggle_dnd': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.toggle_dnd'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.toggle_dnd'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.toggle_dnd'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.toggle_dnd'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.toggle_dnd',
			{ operation: 'users.toggle_dnd' },
			'completed',
		);
		return output;
	},
	'users.unassign_number': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.unassign_number'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.unassign_number'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.unassign_number'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.unassign_number'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.unassign_number',
			{ operation: 'users.unassign_number' },
			'completed',
		);
		return output;
	},
	'users.assign_number': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.assign_number'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.assign_number'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.assign_number'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.assign_number'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.assign_number',
			{ operation: 'users.assign_number' },
			'completed',
		);
		return output;
	},
	'users.list_personas': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.list_personas'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.list_personas'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.list_personas'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.list_personas'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.list_personas',
			{ operation: 'users.list_personas' },
			'completed',
		);
		return output;
	},
	'users.e911.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.e911.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.e911.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.e911.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.e911.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.e911.get',
			{ operation: 'users.e911.get' },
			'completed',
		);
		return output;
	},
	'deskphones.users.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['deskphones.users.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.users.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['deskphones.users.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['deskphones.users.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.deskphones.users.list',
			{ operation: 'deskphones.users.list' },
			'completed',
		);
		return output;
	},
	'screen_pop.initiate': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['screen_pop.initiate'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['screen_pop.initiate'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['screen_pop.initiate'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['screen_pop.initiate'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.screen_pop.initiate',
			{ operation: 'screen_pop.initiate' },
			'completed',
		);
		return output;
	},
	'users.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['users.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.delete',
			{ operation: 'users.delete' },
			'completed',
		);
		return output;
	},
	'users.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.get'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['users.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['users.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.get',
			{ operation: 'users.get' },
			'completed',
		);
		return output;
	},
	'users.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.list'],
	) => {
		const parsedInput = DialpadEndpointInputSchemas['users.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['users.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.list',
			{ operation: 'users.list' },
			'completed',
		);
		return output;
	},
	'users.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['users.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.update',
			{ operation: 'users.update' },
			'completed',
		);
		return output;
	},
	'users.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['users.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.create',
			{ operation: 'users.create' },
			'completed',
		);
		return output;
	},
	'users.move_office': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.move_office'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.move_office'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.move_office'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.move_office'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.move_office',
			{ operation: 'users.move_office' },
			'completed',
		);
		return output;
	},
	'users.create_batch': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.create_batch'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.create_batch'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.create_batch'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.create_batch'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.create_batch',
			{ operation: 'users.create_batch' },
			'completed',
		);
		return output;
	},
	'users.update_status': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['users.update_status'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.update_status'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['users.update_status'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['users.update_status'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.users.update_status',
			{ operation: 'users.update_status' },
			'completed',
		);
		return output;
	},
	'search.users': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['search.users'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['search.users'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['search.users'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output = DialpadEndpointOutputSchemas['search.users'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.search.users',
			{ operation: 'search.users' },
			'completed',
		);
		return output;
	},
	'websockets.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['websockets.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['websockets.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['websockets.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.websockets.get',
			{ operation: 'websockets.get' },
			'completed',
		);
		return output;
	},
	'websockets.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['websockets.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['websockets.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['websockets.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.websockets.list',
			{ operation: 'websockets.list' },
			'completed',
		);
		return output;
	},
	'websockets.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['websockets.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['websockets.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['websockets.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.websockets.create',
			{ operation: 'websockets.create' },
			'completed',
		);
		return output;
	},
	'meetings.conference-meetings.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.conference-meetings.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.conference-meetings.list'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.conference-meetings.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.conference-meetings.list'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.conference-meetings.list',
			{ operation: 'meetings.conference-meetings.list' },
			'completed',
		);
		return output;
	},
	'meetings.conference-rooms.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.conference-rooms.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.conference-rooms.list'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.conference-rooms.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.conference-rooms.list'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.conference-rooms.list',
			{ operation: 'meetings.conference-rooms.list' },
			'completed',
		);
		return output;
	},
	'websockets.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['websockets.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['websockets.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['websockets.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.websockets.update',
			{ operation: 'websockets.update' },
			'completed',
		);
		return output;
	},
	'meetings.meetings.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.meetings.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.meetings.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.meetings.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.meetings.get',
			{ operation: 'meetings.meetings.get' },
			'completed',
		);
		return output;
	},
	'websockets.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['websockets.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['websockets.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['websockets.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.websockets.delete',
			{ operation: 'websockets.delete' },
			'completed',
		);
		return output;
	},
	'meetings.meetings.update': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.meetings.update'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.update'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.meetings.update'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.meetings.update'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.meetings.update',
			{ operation: 'meetings.meetings.update' },
			'completed',
		);
		return output;
	},
	'meetings.meetings.delete': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.meetings.delete'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.delete'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.meetings.delete'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.meetings.delete'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.meetings.delete',
			{ operation: 'meetings.meetings.delete' },
			'completed',
		);
		return output;
	},
	'meetings.meetings.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.meetings.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.meetings.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.meetings.create'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.meetings.create',
			{ operation: 'meetings.meetings.create' },
			'completed',
		);
		return output;
	},
	'meetings.meetings.room.create': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.meetings.room.create'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.room.create'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.meetings.room.create'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.meetings.room.create'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.meetings.room.create',
			{ operation: 'meetings.meetings.room.create' },
			'completed',
		);
		return output;
	},
	'wfm.wfm-metrics-activity.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['wfm.wfm-metrics-activity.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['wfm.wfm-metrics-activity.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['wfm.wfm-metrics-activity.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['wfm.wfm-metrics-activity.get'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.wfm.wfm-metrics-activity.get',
			{ operation: 'wfm.wfm-metrics-activity.get' },
			'completed',
		);
		return output;
	},
	'wfm.wfm-metrics-agent.get': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['wfm.wfm-metrics-agent.get'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['wfm.wfm-metrics-agent.get'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['wfm.wfm-metrics-agent.get'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['wfm.wfm-metrics-agent.get'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.wfm.wfm-metrics-agent.get',
			{ operation: 'wfm.wfm-metrics-agent.get' },
			'completed',
		);
		return output;
	},
	'meetings.meetings.list': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['meetings.meetings.list'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.list'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['meetings.meetings.list'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['meetings.meetings.list'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.meetings.meetings.list',
			{ operation: 'meetings.meetings.list' },
			'completed',
		);
		return output;
	},
	'powerdialer.getModelsByKeys': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getModelsByKeys'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getModelsByKeys'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getModelsByKeys'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getModelsByKeys'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getModelsByKeys',
			{ operation: 'powerdialer.getModelsByKeys' },
			'completed',
		);
		return output;
	},
	'powerdialer.getAblyToken': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getAblyToken'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getAblyToken'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getAblyToken'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getAblyToken'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getAblyToken',
			{ operation: 'powerdialer.getAblyToken' },
			'completed',
		);
		return output;
	},
	'powerdialer.getContact': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getContact'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getContact'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getContact'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getContact'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getContact',
			{ operation: 'powerdialer.getContact' },
			'completed',
		);
		return output;
	},
	'powerdialer.getModelsByKeysOfKind': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getModelsByKeysOfKind'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getModelsByKeysOfKind'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getModelsByKeysOfKind'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getModelsByKeysOfKind'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getModelsByKeysOfKind',
			{ operation: 'powerdialer.getModelsByKeysOfKind' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteModelsByKeysOfKind': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteModelsByKeysOfKind'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteModelsByKeysOfKind'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteModelsByKeysOfKind'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.deleteModelsByKeysOfKind'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteModelsByKeysOfKind',
			{ operation: 'powerdialer.deleteModelsByKeysOfKind' },
			'completed',
		);
		return output;
	},
	'powerdialer.createCustomProperties': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createCustomProperties'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createCustomProperties'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createCustomProperties'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createCustomProperties'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createCustomProperties',
			{ operation: 'powerdialer.createCustomProperties' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCustomProperties': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCustomProperties'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCustomProperties'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCustomProperties'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCustomProperties'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCustomProperties',
			{ operation: 'powerdialer.getCustomProperties' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCustomProperty': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCustomProperty'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCustomProperty'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCustomProperty'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCustomProperty'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCustomProperty',
			{ operation: 'powerdialer.getCustomProperty' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateCustomProperty': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateCustomProperty'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCustomProperty'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateCustomProperty'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateCustomProperty'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateCustomProperty',
			{ operation: 'powerdialer.updateCustomProperty' },
			'completed',
		);
		return output;
	},
	'powerdialer.getDialpadOAuthService': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getDialpadOAuthService'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getDialpadOAuthService'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getDialpadOAuthService'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getDialpadOAuthService'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getDialpadOAuthService',
			{ operation: 'powerdialer.getDialpadOAuthService' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateGlobalSettings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateGlobalSettings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateGlobalSettings'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateGlobalSettings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateGlobalSettings'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateGlobalSettings',
			{ operation: 'powerdialer.updateGlobalSettings' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteCustomProperty': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteCustomProperty'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCustomProperty'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteCustomProperty'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteCustomProperty'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteCustomProperty',
			{ operation: 'powerdialer.deleteCustomProperty' },
			'completed',
		);
		return output;
	},
	'powerdialer.getGlobalSettings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getGlobalSettings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getGlobalSettings'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getGlobalSettings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getGlobalSettings'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getGlobalSettings',
			{ operation: 'powerdialer.getGlobalSettings' },
			'completed',
		);
		return output;
	},
	'powerdialer.getEventLogs': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getEventLogs'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getEventLogs'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getEventLogs'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getEventLogs'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getEventLogs',
			{ operation: 'powerdialer.getEventLogs' },
			'completed',
		);
		return output;
	},
	'powerdialer.getJobs': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getJobs'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getJobs'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getJobs'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getJobs'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getJobs',
			{ operation: 'powerdialer.getJobs' },
			'completed',
		);
		return output;
	},
	'powerdialer.getJob': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getJob'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getJob'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getJob'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getJob'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getJob',
			{ operation: 'powerdialer.getJob' },
			'completed',
		);
		return output;
	},
	'powerdialer.getApiKey': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getApiKey'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getApiKey'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getApiKey'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getApiKey'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getApiKey',
			{ operation: 'powerdialer.getApiKey' },
			'completed',
		);
		return output;
	},
	'powerdialer.getApiKeys': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getApiKeys'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getApiKeys'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getApiKeys'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getApiKeys'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getApiKeys',
			{ operation: 'powerdialer.getApiKeys' },
			'completed',
		);
		return output;
	},
	'powerdialer.getOperator': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getOperator'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getOperator'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getOperator'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getOperator'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getOperator',
			{ operation: 'powerdialer.getOperator' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLogin': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLogin'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLogin'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLogin'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLogin'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLogin',
			{ operation: 'powerdialer.getLogin' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteApiKey': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteApiKey'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteApiKey'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteApiKey'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteApiKey'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteApiKey',
			{ operation: 'powerdialer.deleteApiKey' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateApiKey': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateApiKey'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateApiKey'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateApiKey'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateApiKey'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateApiKey',
			{ operation: 'powerdialer.updateApiKey' },
			'completed',
		);
		return output;
	},
	'powerdialer.postLogin': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.postLogin'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.postLogin'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.postLogin'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.postLogin'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.postLogin',
			{ operation: 'powerdialer.postLogin' },
			'completed',
		);
		return output;
	},
	'powerdialer.createApiKey': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createApiKey'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createApiKey'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createApiKey'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createApiKey'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createApiKey',
			{ operation: 'powerdialer.createApiKey' },
			'completed',
		);
		return output;
	},
	'powerdialer.createServiceAccount': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createServiceAccount'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createServiceAccount'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createServiceAccount'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createServiceAccount'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createServiceAccount',
			{ operation: 'powerdialer.createServiceAccount' },
			'completed',
		);
		return output;
	},
	'powerdialer.getServiceAccount': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getServiceAccount'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getServiceAccount'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getServiceAccount'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getServiceAccount'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getServiceAccount',
			{ operation: 'powerdialer.getServiceAccount' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateServiceAccount': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateServiceAccount'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateServiceAccount'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateServiceAccount'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateServiceAccount'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateServiceAccount',
			{ operation: 'powerdialer.updateServiceAccount' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteServiceAccount': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteServiceAccount'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteServiceAccount'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteServiceAccount'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteServiceAccount'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteServiceAccount',
			{ operation: 'powerdialer.deleteServiceAccount' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSmsForTarget': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSmsForTarget'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getSmsForTarget'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSmsForTarget'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getSmsForTarget'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSmsForTarget',
			{ operation: 'powerdialer.getSmsForTarget' },
			'completed',
		);
		return output;
	},
	'powerdialer.smsItem': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.smsItem'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.smsItem'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.smsItem'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.smsItem'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.smsItem',
			{ operation: 'powerdialer.smsItem' },
			'completed',
		);
		return output;
	},
	'powerdialer.getServiceAccounts': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getServiceAccounts'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getServiceAccounts'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getServiceAccounts'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getServiceAccounts'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getServiceAccounts',
			{ operation: 'powerdialer.getServiceAccounts' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCurrentUser': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCurrentUser'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCurrentUser'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCurrentUser'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCurrentUser'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCurrentUser',
			{ operation: 'powerdialer.getCurrentUser' },
			'completed',
		);
		return output;
	},
	'powerdialer.getWorker': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getWorker'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getWorker'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getWorker'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getWorker'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getWorker',
			{ operation: 'powerdialer.getWorker' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateWorker': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateWorker'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateWorker'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateWorker'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateWorker'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateWorker',
			{ operation: 'powerdialer.updateWorker' },
			'completed',
		);
		return output;
	},
	'powerdialer.getWorkers': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getWorkers'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getWorkers'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getWorkers'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getWorkers'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getWorkers',
			{ operation: 'powerdialer.getWorkers' },
			'completed',
		);
		return output;
	},
	'powerdialer.createAudience': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createAudience'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createAudience'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createAudience'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createAudience'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createAudience',
			{ operation: 'powerdialer.createAudience' },
			'completed',
		);
		return output;
	},
	'powerdialer.getAudiences': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getAudiences'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getAudiences'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getAudiences'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getAudiences'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getAudiences',
			{ operation: 'powerdialer.getAudiences' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateAudience': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateAudience'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateAudience'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateAudience'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateAudience'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateAudience',
			{ operation: 'powerdialer.updateAudience' },
			'completed',
		);
		return output;
	},
	'powerdialer.getAudience': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getAudience'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getAudience'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getAudience'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getAudience'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getAudience',
			{ operation: 'powerdialer.getAudience' },
			'completed',
		);
		return output;
	},
	'powerdialer.createBot': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createBot'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createBot'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createBot'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createBot'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createBot',
			{ operation: 'powerdialer.createBot' },
			'completed',
		);
		return output;
	},
	'powerdialer.duplicateAudience': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.duplicateAudience'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateAudience'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.duplicateAudience'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.duplicateAudience'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.duplicateAudience',
			{ operation: 'powerdialer.duplicateAudience' },
			'completed',
		);
		return output;
	},
	'powerdialer.getBots': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getBots'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBots'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getBots'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getBots'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getBots',
			{ operation: 'powerdialer.getBots' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateBot': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateBot'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateBot'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateBot'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateBot'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateBot',
			{ operation: 'powerdialer.updateBot' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteAudience': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteAudience'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteAudience'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteAudience'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteAudience'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteAudience',
			{ operation: 'powerdialer.deleteAudience' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteBot': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteBot'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteBot'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteBot'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteBot'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteBot',
			{ operation: 'powerdialer.deleteBot' },
			'completed',
		);
		return output;
	},
	'powerdialer.getBot': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getBot'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBot'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getBot'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getBot'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getBot',
			{ operation: 'powerdialer.getBot' },
			'completed',
		);
		return output;
	},
	'powerdialer.getBotDialogs': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getBotDialogs'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotDialogs'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getBotDialogs'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getBotDialogs'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getBotDialogs',
			{ operation: 'powerdialer.getBotDialogs' },
			'completed',
		);
		return output;
	},
	'powerdialer.createBotDialog': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createBotDialog'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createBotDialog'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createBotDialog'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createBotDialog'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createBotDialog',
			{ operation: 'powerdialer.createBotDialog' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteBotDialog': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteBotDialog'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteBotDialog'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteBotDialog'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteBotDialog'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteBotDialog',
			{ operation: 'powerdialer.deleteBotDialog' },
			'completed',
		);
		return output;
	},
	'powerdialer.getBotMessages': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getBotMessages'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotMessages'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getBotMessages'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getBotMessages'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getBotMessages',
			{ operation: 'powerdialer.getBotMessages' },
			'completed',
		);
		return output;
	},
	'powerdialer.createBotMessage': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createBotMessage'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createBotMessage'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createBotMessage'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createBotMessage'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createBotMessage',
			{ operation: 'powerdialer.createBotMessage' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteBotMessage': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteBotMessage'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteBotMessage'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteBotMessage'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteBotMessage'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteBotMessage',
			{ operation: 'powerdialer.deleteBotMessage' },
			'completed',
		);
		return output;
	},
	'powerdialer.getBotMessage': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getBotMessage'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotMessage'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getBotMessage'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getBotMessage'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getBotMessage',
			{ operation: 'powerdialer.getBotMessage' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateBotDialog': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateBotDialog'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateBotDialog'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateBotDialog'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateBotDialog'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateBotDialog',
			{ operation: 'powerdialer.updateBotDialog' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCampaigns': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCampaigns'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaigns'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCampaigns'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCampaigns'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCampaigns',
			{ operation: 'powerdialer.getCampaigns' },
			'completed',
		);
		return output;
	},
	'powerdialer.searchCampaigns': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.searchCampaigns'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.searchCampaigns'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.searchCampaigns'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.searchCampaigns'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.searchCampaigns',
			{ operation: 'powerdialer.searchCampaigns' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteCampaign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteCampaign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCampaign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteCampaign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteCampaign'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteCampaign',
			{ operation: 'powerdialer.deleteCampaign' },
			'completed',
		);
		return output;
	},
	'powerdialer.createCampaign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createCampaign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createCampaign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createCampaign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createCampaign'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createCampaign',
			{ operation: 'powerdialer.createCampaign' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCampaign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCampaign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCampaign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCampaign'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCampaign',
			{ operation: 'powerdialer.getCampaign' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateCampaign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateCampaign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCampaign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateCampaign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateCampaign'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateCampaign',
			{ operation: 'powerdialer.updateCampaign' },
			'completed',
		);
		return output;
	},
	'powerdialer.duplicateCampaign': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.duplicateCampaign'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateCampaign'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.duplicateCampaign'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.duplicateCampaign'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.duplicateCampaign',
			{ operation: 'powerdialer.duplicateCampaign' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCampaignResultExportUrl': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCampaignResultExportUrl'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getCampaignResultExportUrl'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCampaignResultExportUrl'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getCampaignResultExportUrl'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCampaignResultExportUrl',
			{ operation: 'powerdialer.getCampaignResultExportUrl' },
			'completed',
		);
		return output;
	},
	'powerdialer.createCampaignGroup': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createCampaignGroup'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createCampaignGroup'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createCampaignGroup'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createCampaignGroup'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createCampaignGroup',
			{ operation: 'powerdialer.createCampaignGroup' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteCampaignGroup': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteCampaignGroup'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCampaignGroup'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteCampaignGroup'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteCampaignGroup'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteCampaignGroup',
			{ operation: 'powerdialer.deleteCampaignGroup' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCampaignGroup': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCampaignGroup'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaignGroup'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCampaignGroup'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCampaignGroup'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCampaignGroup',
			{ operation: 'powerdialer.getCampaignGroup' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCampaignGroups': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCampaignGroups'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaignGroups'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCampaignGroups'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCampaignGroups'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCampaignGroups',
			{ operation: 'powerdialer.getCampaignGroups' },
			'completed',
		);
		return output;
	},
	'powerdialer.startCampaignResultExport': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.startCampaignResultExport'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.startCampaignResultExport'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.startCampaignResultExport'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.startCampaignResultExport'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.startCampaignResultExport',
			{ operation: 'powerdialer.startCampaignResultExport' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCampaignSettings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCampaignSettings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaignSettings'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCampaignSettings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCampaignSettings'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCampaignSettings',
			{ operation: 'powerdialer.getCampaignSettings' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateCampaignGroup': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateCampaignGroup'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCampaignGroup'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateCampaignGroup'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateCampaignGroup'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateCampaignGroup',
			{ operation: 'powerdialer.updateCampaignGroup' },
			'completed',
		);
		return output;
	},
	'powerdialer.editCampaignSettings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.editCampaignSettings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.editCampaignSettings'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.editCampaignSettings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.editCampaignSettings'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.editCampaignSettings',
			{ operation: 'powerdialer.editCampaignSettings' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteCsv': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteCsv'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCsv'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteCsv'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteCsv'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteCsv',
			{ operation: 'powerdialer.deleteCsv' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCsvPresignedUrl': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCsvPresignedUrl'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCsvPresignedUrl'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCsvPresignedUrl'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCsvPresignedUrl'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCsvPresignedUrl',
			{ operation: 'powerdialer.getCsvPresignedUrl' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateCsv': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateCsv'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCsv'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateCsv'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateCsv'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateCsv',
			{ operation: 'powerdialer.updateCsv' },
			'completed',
		);
		return output;
	},
	'powerdialer.getVarsInfo': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getVarsInfo'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getVarsInfo'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getVarsInfo'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getVarsInfo'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getVarsInfo',
			{ operation: 'powerdialer.getVarsInfo' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCsv': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCsv'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCsv'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCsv'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCsv'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCsv',
			{ operation: 'powerdialer.getCsv' },
			'completed',
		);
		return output;
	},
	'powerdialer.getPhoneCsvs': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getPhoneCsvs'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhoneCsvs'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getPhoneCsvs'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getPhoneCsvs'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getPhoneCsvs',
			{ operation: 'powerdialer.getPhoneCsvs' },
			'completed',
		);
		return output;
	},
	'powerdialer.getCsvs': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getCsvs'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCsvs'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getCsvs'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getCsvs'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getCsvs',
			{ operation: 'powerdialer.getCsvs' },
			'completed',
		);
		return output;
	},
	'powerdialer.getPhoneCsv': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getPhoneCsv'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhoneCsv'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getPhoneCsv'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getPhoneCsv'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getPhoneCsv',
			{ operation: 'powerdialer.getPhoneCsv' },
			'completed',
		);
		return output;
	},
	'powerdialer.updatePhoneCsv': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updatePhoneCsv'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updatePhoneCsv'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updatePhoneCsv'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updatePhoneCsv'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updatePhoneCsv',
			{ operation: 'powerdialer.updatePhoneCsv' },
			'completed',
		);
		return output;
	},
	'powerdialer.deletePhoneCsv': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deletePhoneCsv'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deletePhoneCsv'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deletePhoneCsv'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deletePhoneCsv'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deletePhoneCsv',
			{ operation: 'powerdialer.deletePhoneCsv' },
			'completed',
		);
		return output;
	},
	'powerdialer.createLeadList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createLeadList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createLeadList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createLeadList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createLeadList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createLeadList',
			{ operation: 'powerdialer.createLeadList' },
			'completed',
		);
		return output;
	},
	'powerdialer.getBotDialog': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getBotDialog'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotDialog'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getBotDialog'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getBotDialog'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getBotDialog',
			{ operation: 'powerdialer.getBotDialog' },
			'completed',
		);
		return output;
	},
	'powerdialer.getListItems': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getListItems'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getListItems'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getListItems'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getListItems'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getListItems',
			{ operation: 'powerdialer.getListItems' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteLeadListItem': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteLeadListItem'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteLeadListItem'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteLeadListItem'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteLeadListItem'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteLeadListItem',
			{ operation: 'powerdialer.deleteLeadListItem' },
			'completed',
		);
		return output;
	},
	'powerdialer.getListList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getListList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getListList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getListList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getListList'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getListList',
			{ operation: 'powerdialer.getListList' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadListItem': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadListItem'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadListItem'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadListItem'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadListItem'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadListItem',
			{ operation: 'powerdialer.getLeadListItem' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteLeadList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteLeadList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteLeadList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteLeadList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteLeadList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteLeadList',
			{ operation: 'powerdialer.deleteLeadList' },
			'completed',
		);
		return output;
	},
	'powerdialer.duplicateLeadList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.duplicateLeadList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateLeadList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.duplicateLeadList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.duplicateLeadList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.duplicateLeadList',
			{ operation: 'powerdialer.duplicateLeadList' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadLists': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadLists'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadLists'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadLists'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadLists'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadLists',
			{ operation: 'powerdialer.getLeadLists' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateLeadList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateLeadList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateLeadList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateLeadList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateLeadList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateLeadList',
			{ operation: 'powerdialer.updateLeadList' },
			'completed',
		);
		return output;
	},
	'powerdialer.getListView': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getListView'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getListView'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getListView'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getListView'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getListView',
			{ operation: 'powerdialer.getListView' },
			'completed',
		);
		return output;
	},
	'powerdialer.createStaticList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createStaticList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createStaticList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createStaticList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createStaticList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createStaticList',
			{ operation: 'powerdialer.createStaticList' },
			'completed',
		);
		return output;
	},
	'powerdialer.getStaticLists': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getStaticLists'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getStaticLists'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getStaticLists'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getStaticLists'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getStaticLists',
			{ operation: 'powerdialer.getStaticLists' },
			'completed',
		);
		return output;
	},
	'powerdialer.getStaticList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getStaticList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getStaticList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getStaticList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getStaticList'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getStaticList',
			{ operation: 'powerdialer.getStaticList' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteStaticList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteStaticList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteStaticList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteStaticList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteStaticList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteStaticList',
			{ operation: 'powerdialer.deleteStaticList' },
			'completed',
		);
		return output;
	},
	'powerdialer.duplicateStaticList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.duplicateStaticList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateStaticList'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.duplicateStaticList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.duplicateStaticList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.duplicateStaticList',
			{ operation: 'powerdialer.duplicateStaticList' },
			'completed',
		);
		return output;
	},
	'powerdialer.createLeads': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createLeads'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createLeads'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createLeads'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createLeads'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createLeads',
			{ operation: 'powerdialer.createLeads' },
			'completed',
		);
		return output;
	},
	'powerdialer.queryLeads': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.queryLeads'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.queryLeads'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.queryLeads'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.queryLeads'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.queryLeads',
			{ operation: 'powerdialer.queryLeads' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLead': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLead'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLead'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLead'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLead'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLead',
			{ operation: 'powerdialer.getLead' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateLead': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateLead'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateLead'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateLead'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateLead'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateLead',
			{ operation: 'powerdialer.updateLead' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadCompany': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadCompany'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadCompany'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadCompany'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadCompany'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadCompany',
			{ operation: 'powerdialer.getLeadCompany' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadCompanies': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadCompanies'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadCompanies'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadCompanies'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadCompanies'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadCompanies',
			{ operation: 'powerdialer.getLeadCompanies' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateStaticList': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateStaticList'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateStaticList'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateStaticList'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateStaticList'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateStaticList',
			{ operation: 'powerdialer.updateStaticList' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeads': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeads'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeads'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeads'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeads'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeads',
			{ operation: 'powerdialer.getLeads' },
			'completed',
		);
		return output;
	},
	'powerdialer.startLeadExport': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.startLeadExport'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.startLeadExport'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.startLeadExport'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.startLeadExport'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.startLeadExport',
			{ operation: 'powerdialer.startLeadExport' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadListView': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadListView'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadListView'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadListView'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadListView'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadListView',
			{ operation: 'powerdialer.getLeadListView' },
			'completed',
		);
		return output;
	},
	'powerdialer.bulkUpdateLeadItems': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.bulkUpdateLeadItems'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.bulkUpdateLeadItems'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.bulkUpdateLeadItems'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.bulkUpdateLeadItems'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.bulkUpdateLeadItems',
			{ operation: 'powerdialer.bulkUpdateLeadItems' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadItem': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadItem'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadItem'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadItem'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadItem'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadItem',
			{ operation: 'powerdialer.getLeadItem' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadItems': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadItems'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadItems'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadItems'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadItems'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadItems',
			{ operation: 'powerdialer.getLeadItems' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadListViewById': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadListViewById'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadListViewById'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadListViewById'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadListViewById'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadListViewById',
			{ operation: 'powerdialer.getLeadListViewById' },
			'completed',
		);
		return output;
	},
	'powerdialer.getLeadExport': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getLeadExport'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadExport'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getLeadExport'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getLeadExport'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getLeadExport',
			{ operation: 'powerdialer.getLeadExport' },
			'completed',
		);
		return output;
	},
	'powerdialer.createPhone': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createPhone'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createPhone'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createPhone'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createPhone'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createPhone',
			{ operation: 'powerdialer.createPhone' },
			'completed',
		);
		return output;
	},
	'powerdialer.getPhone': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getPhone'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhone'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getPhone'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getPhone'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getPhone',
			{ operation: 'powerdialer.getPhone' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateLeadItem': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateLeadItem'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateLeadItem'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateLeadItem'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateLeadItem'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateLeadItem',
			{ operation: 'powerdialer.updateLeadItem' },
			'completed',
		);
		return output;
	},
	'powerdialer.deletePhone': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deletePhone'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deletePhone'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deletePhone'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deletePhone'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deletePhone',
			{ operation: 'powerdialer.deletePhone' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceObjectListViews': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceObjectListViews'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectListViews'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceObjectListViews'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceObjectListViews'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceObjectListViews',
			{ operation: 'powerdialer.getSalesforceObjectListViews' },
			'completed',
		);
		return output;
	},
	'powerdialer.updatePhone': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updatePhone'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updatePhone'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updatePhone'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updatePhone'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updatePhone',
			{ operation: 'powerdialer.updatePhone' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceObjectFields': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceObjectFields'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectFields'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceObjectFields'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceObjectFields'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceObjectFields',
			{ operation: 'powerdialer.getSalesforceObjectFields' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceListViewById': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceListViewById'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceListViewById'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceListViewById'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceListViewById'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceListViewById',
			{ operation: 'powerdialer.getSalesforceListViewById' },
			'completed',
		);
		return output;
	},
	'powerdialer.createSalesforceListViewImport': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createSalesforceListViewImport'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.createSalesforceListViewImport'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createSalesforceListViewImport'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.createSalesforceListViewImport'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createSalesforceListViewImport',
			{ operation: 'powerdialer.createSalesforceListViewImport' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceListViewImports': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceListViewImports'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceListViewImports'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceListViewImports'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceListViewImports'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceListViewImports',
			{ operation: 'powerdialer.getSalesforceListViewImports' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceObjectMappings': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceObjectMappings'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectMappings'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceObjectMappings'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceObjectMappings'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceObjectMappings',
			{ operation: 'powerdialer.getSalesforceObjectMappings' },
			'completed',
		);
		return output;
	},
	'powerdialer.createSalesforceObjectMapping': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createSalesforceObjectMapping'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.createSalesforceObjectMapping'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createSalesforceObjectMapping'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.createSalesforceObjectMapping'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createSalesforceObjectMapping',
			{ operation: 'powerdialer.createSalesforceObjectMapping' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateSalesforceListViewImport': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateSalesforceListViewImport'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.updateSalesforceListViewImport'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateSalesforceListViewImport'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.updateSalesforceListViewImport'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateSalesforceListViewImport',
			{ operation: 'powerdialer.updateSalesforceListViewImport' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteSalesforceObjectMapping': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteSalesforceObjectMapping'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.deleteSalesforceObjectMapping'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteSalesforceObjectMapping'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.deleteSalesforceObjectMapping'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteSalesforceObjectMapping',
			{ operation: 'powerdialer.deleteSalesforceObjectMapping' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceListViewImport': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceListViewImport'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceListViewImport'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceListViewImport'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceListViewImport'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceListViewImport',
			{ operation: 'powerdialer.getSalesforceListViewImport' },
			'completed',
		);
		return output;
	},
	'powerdialer.getSalesforceObjectMapping': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getSalesforceObjectMapping'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectMapping'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getSalesforceObjectMapping'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.getSalesforceObjectMapping'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getSalesforceObjectMapping',
			{ operation: 'powerdialer.getSalesforceObjectMapping' },
			'completed',
		);
		return output;
	},
	'powerdialer.patchSalesforceListView': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.patchSalesforceListView'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.patchSalesforceListView'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.patchSalesforceListView'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.patchSalesforceListView'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.patchSalesforceListView',
			{ operation: 'powerdialer.patchSalesforceListView' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateSalesforceObjectMapping': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateSalesforceObjectMapping'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.updateSalesforceObjectMapping'
			].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateSalesforceObjectMapping'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas[
				'powerdialer.updateSalesforceObjectMapping'
			].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateSalesforceObjectMapping',
			{ operation: 'powerdialer.updateSalesforceObjectMapping' },
			'completed',
		);
		return output;
	},
	'powerdialer.getRules': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getRules'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getRules'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getRules'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getRules'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getRules',
			{ operation: 'powerdialer.getRules' },
			'completed',
		);
		return output;
	},
	'powerdialer.createRule': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.createRule'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createRule'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.createRule'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.createRule'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.createRule',
			{ operation: 'powerdialer.createRule' },
			'completed',
		);
		return output;
	},
	'powerdialer.getPhones': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getPhones'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhones'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getPhones'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getPhones'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getPhones',
			{ operation: 'powerdialer.getPhones' },
			'completed',
		);
		return output;
	},
	'powerdialer.deleteRule': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.deleteRule'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteRule'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.deleteRule'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.deleteRule'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.deleteRule',
			{ operation: 'powerdialer.deleteRule' },
			'completed',
		);
		return output;
	},
	'powerdialer.updateRule': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.updateRule'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateRule'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.updateRule'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.updateRule'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.updateRule',
			{ operation: 'powerdialer.updateRule' },
			'completed',
		);
		return output;
	},
	'powerdialer.getRule': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['powerdialer.getRule'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getRule'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['powerdialer.getRule'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['powerdialer.getRule'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.powerdialer.getRule',
			{ operation: 'powerdialer.getRule' },
			'completed',
		);
		return output;
	},
	'reports.scheduledstats.download': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['reports.scheduledstats.download'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['reports.scheduledstats.download'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['reports.scheduledstats.download'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['reports.scheduledstats.download'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.reports.scheduledstats.download',
			{ operation: 'reports.scheduledstats.download' },
			'completed',
		);
		return output;
	},
	'recordings.call.download': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recordings.call.download'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recordings.call.download'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recordings.call.download'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recordings.call.download'].parse(response);
		await logEventFromContext(
			ctx,
			'dialpad.recordings.call.download',
			{ operation: 'recordings.call.download' },
			'completed',
		);
		return output;
	},
	'recordings.voicemail.download': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recordings.voicemail.download'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recordings.voicemail.download'].parse(input);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recordings.voicemail.download'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recordings.voicemail.download'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.recordings.voicemail.download',
			{ operation: 'recordings.voicemail.download' },
			'completed',
		);
		return output;
	},
	'recordings.admin_call.download': async (
		ctx: DialpadContext,
		input: DialpadEndpointInputs['recordings.admin_call.download'],
	) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recordings.admin_call.download'].parse(
				input,
			);
		const response = await makeDialpadRequest(
			DialpadOperationDefinitions['recordings.admin_call.download'],
			parsedInput,
			{ apiKey: ctx.key, environment: ctx.options.environment },
		);
		const output =
			DialpadEndpointOutputSchemas['recordings.admin_call.download'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'dialpad.recordings.admin_call.download',
			{ operation: 'recordings.admin_call.download' },
			'completed',
		);
		return output;
	},
} as const;

//
//
// Unknown input is required so runtime values are validated before network access.
type UntrustedDialpadInput = unknown;
// Unknown output is used because the dispatcher covers differently typed operation results.
type ParsedDialpadOutput = unknown;

export const DialpadOperationCallers: {
	[K in DialpadEndpointKey]: (
		ctx: DialpadContext,
		input: UntrustedDialpadInput,
	) => Promise<ParsedDialpadOutput>;
} = {
	'accesscontrolpolicies.assign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.assign'].parse(input);
		return DialpadOperationFunctions['accesscontrolpolicies.assign'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.delete'].parse(input);
		return DialpadOperationFunctions['accesscontrolpolicies.delete'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.update'].parse(input);
		return DialpadOperationFunctions['accesscontrolpolicies.update'](
			ctx,
			parsedInput,
		);
	},
	'agentgroup.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['agentgroup.get'].parse(input);
		return DialpadOperationFunctions['agentgroup.get'](ctx, parsedInput);
	},
	'anonymization.requests.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['anonymization.requests.get'].parse(input);
		return DialpadOperationFunctions['anonymization.requests.get'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.list'].parse(input);
		return DialpadOperationFunctions['accesscontrolpolicies.list'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.unassign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.unassign'].parse(
				input,
			);
		return DialpadOperationFunctions['accesscontrolpolicies.unassign'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.create'].parse(input);
		return DialpadOperationFunctions['accesscontrolpolicies.create'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.assignments': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.assignments'].parse(
				input,
			);
		return DialpadOperationFunctions['accesscontrolpolicies.assignments'](
			ctx,
			parsedInput,
		);
	},
	'anonymization.contacts': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['anonymization.contacts'].parse(input);
		return DialpadOperationFunctions['anonymization.contacts'](
			ctx,
			parsedInput,
		);
	},
	'accesscontrolpolicies.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['accesscontrolpolicies.get'].parse(input);
		return DialpadOperationFunctions['accesscontrolpolicies.get'](
			ctx,
			parsedInput,
		);
	},
	'app_settings.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['app_settings.get'].parse(input);
		return DialpadOperationFunctions['app_settings.get'](ctx, parsedInput);
	},
	'blockednumbers.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.get'].parse(input);
		return DialpadOperationFunctions['blockednumbers.get'](ctx, parsedInput);
	},
	'available_numbers.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['available_numbers.list'].parse(input);
		return DialpadOperationFunctions['available_numbers.list'](
			ctx,
			parsedInput,
		);
	},
	'blockednumbers.add': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.add'].parse(input);
		return DialpadOperationFunctions['blockednumbers.add'](ctx, parsedInput);
	},
	'blockednumbers.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.list'].parse(input);
		return DialpadOperationFunctions['blockednumbers.list'](ctx, parsedInput);
	},
	'blockednumbers.remove': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['blockednumbers.remove'].parse(input);
		return DialpadOperationFunctions['blockednumbers.remove'](ctx, parsedInput);
	},
	'call.assign': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['call.assign'].parse(input);
		return DialpadOperationFunctions['call.assign'](ctx, parsedInput);
	},
	'call.get_assigned_operators': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.get_assigned_operators'].parse(input);
		return DialpadOperationFunctions['call.get_assigned_operators'](
			ctx,
			parsedInput,
		);
	},
	'anonymization.callcontent': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['anonymization.callcontent'].parse(input);
		return DialpadOperationFunctions['anonymization.callcontent'](
			ctx,
			parsedInput,
		);
	},
	'call.get_ai_recap': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.get_ai_recap'].parse(input);
		return DialpadOperationFunctions['call.get_ai_recap'](ctx, parsedInput);
	},
	'call.participants.add': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.participants.add'].parse(input);
		return DialpadOperationFunctions['call.participants.add'](ctx, parsedInput);
	},
	'call.list': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['call.list'].parse(input);
		return DialpadOperationFunctions['call.list'](ctx, parsedInput);
	},
	'call.initiate_ivr_call': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.initiate_ivr_call'].parse(input);
		return DialpadOperationFunctions['call.initiate_ivr_call'](
			ctx,
			parsedInput,
		);
	},
	'call.unassign_all_call_operators': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.unassign_all_call_operators'].parse(
				input,
			);
		return DialpadOperationFunctions['call.unassign_all_call_operators'](
			ctx,
			parsedInput,
		);
	},
	'call.transfer_call': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.transfer_call'].parse(input);
		return DialpadOperationFunctions['call.transfer_call'](ctx, parsedInput);
	},
	'call.get_call_info': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.get_call_info'].parse(input);
		return DialpadOperationFunctions['call.get_call_info'](ctx, parsedInput);
	},
	'call.unassign_operator': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.unassign_operator'].parse(input);
		return DialpadOperationFunctions['call.unassign_operator'](
			ctx,
			parsedInput,
		);
	},
	'call.unpark': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['call.unpark'].parse(input);
		return DialpadOperationFunctions['call.unpark'](ctx, parsedInput);
	},
	'call.initiate': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.initiate'].parse(input);
		return DialpadOperationFunctions['call.initiate'](ctx, parsedInput);
	},
	'call.add_labels': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call.add_labels'].parse(input);
		return DialpadOperationFunctions['call.add_labels'](ctx, parsedInput);
	},
	'call.hangup': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['call.hangup'].parse(input);
		return DialpadOperationFunctions['call.hangup'](ctx, parsedInput);
	},
	'callbacks.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callbacks.list'].parse(input);
		return DialpadOperationFunctions['callbacks.list'](ctx, parsedInput);
	},
	'callback.validate': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callback.validate'].parse(input);
		return DialpadOperationFunctions['callback.validate'](ctx, parsedInput);
	},
	'callcenters.listall': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.listall'].parse(input);
		return DialpadOperationFunctions['callcenters.listall'](ctx, parsedInput);
	},
	'callcenters.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.get'].parse(input);
		return DialpadOperationFunctions['callcenters.get'](ctx, parsedInput);
	},
	'callcenters.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.update'].parse(input);
		return DialpadOperationFunctions['callcenters.update'](ctx, parsedInput);
	},
	'callcenters.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.create'].parse(input);
		return DialpadOperationFunctions['callcenters.create'](ctx, parsedInput);
	},
	'callback.enqueue': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callback.enqueue'].parse(input);
		return DialpadOperationFunctions['callback.enqueue'](ctx, parsedInput);
	},
	'callcenters.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.delete'].parse(input);
		return DialpadOperationFunctions['callcenters.delete'](ctx, parsedInput);
	},
	'callcenters.get_status': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.get_status'].parse(input);
		return DialpadOperationFunctions['callcenters.get_status'](
			ctx,
			parsedInput,
		);
	},
	'callcenters.operators.update_duty_status': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.update_duty_status'
			].parse(input);
		return DialpadOperationFunctions[
			'callcenters.operators.update_duty_status'
		](ctx, parsedInput);
	},
	'callcenters.operators.get_skill_level': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.get_skill_level'
			].parse(input);
		return DialpadOperationFunctions['callcenters.operators.get_skill_level'](
			ctx,
			parsedInput,
		);
	},
	'callcenters.operators.get_duty_status': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.get_duty_status'
			].parse(input);
		return DialpadOperationFunctions['callcenters.operators.get_duty_status'](
			ctx,
			parsedInput,
		);
	},
	'callcenters.operators.update_skill_level': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'callcenters.operators.update_skill_level'
			].parse(input);
		return DialpadOperationFunctions[
			'callcenters.operators.update_skill_level'
		](ctx, parsedInput);
	},
	'callcenters.operators.add': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.operators.add'].parse(input);
		return DialpadOperationFunctions['callcenters.operators.add'](
			ctx,
			parsedInput,
		);
	},
	'callcenters.queue.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.queue.list'].parse(input);
		return DialpadOperationFunctions['callcenters.queue.list'](
			ctx,
			parsedInput,
		);
	},
	'callcenters.operators.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.operators.delete'].parse(input);
		return DialpadOperationFunctions['callcenters.operators.delete'](
			ctx,
			parsedInput,
		);
	},
	'call_labels.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_labels.list'].parse(input);
		return DialpadOperationFunctions['call_labels.list'](ctx, parsedInput);
	},
	'call_review_share_link.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.get'].parse(input);
		return DialpadOperationFunctions['call_review_share_link.get'](
			ctx,
			parsedInput,
		);
	},
	'call_review_share_link.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.create'].parse(input);
		return DialpadOperationFunctions['call_review_share_link.create'](
			ctx,
			parsedInput,
		);
	},
	'call_review_share_link.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.delete'].parse(input);
		return DialpadOperationFunctions['call_review_share_link.delete'](
			ctx,
			parsedInput,
		);
	},
	'callrouters.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.list'].parse(input);
		return DialpadOperationFunctions['callrouters.list'](ctx, parsedInput);
	},
	'callcenters.operators.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.operators.list'].parse(input);
		return DialpadOperationFunctions['callcenters.operators.list'](
			ctx,
			parsedInput,
		);
	},
	'callrouters.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.delete'].parse(input);
		return DialpadOperationFunctions['callrouters.delete'](ctx, parsedInput);
	},
	'callrouters.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.create'].parse(input);
		return DialpadOperationFunctions['callrouters.create'](ctx, parsedInput);
	},
	'callrouters.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.get'].parse(input);
		return DialpadOperationFunctions['callrouters.get'](ctx, parsedInput);
	},
	'call_review_share_link.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['call_review_share_link.update'].parse(input);
		return DialpadOperationFunctions['call_review_share_link.update'](
			ctx,
			parsedInput,
		);
	},
	'callrouters.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callrouters.update'].parse(input);
		return DialpadOperationFunctions['callrouters.update'](ctx, parsedInput);
	},
	'numbers.assign_call_router_number.post': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'numbers.assign_call_router_number.post'
			].parse(input);
		return DialpadOperationFunctions['numbers.assign_call_router_number.post'](
			ctx,
			parsedInput,
		);
	},
	'channels.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.delete'].parse(input);
		return DialpadOperationFunctions['channels.delete'](ctx, parsedInput);
	},
	'channels.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.get'].parse(input);
		return DialpadOperationFunctions['channels.get'](ctx, parsedInput);
	},
	'channels.members.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.members.list'].parse(input);
		return DialpadOperationFunctions['channels.members.list'](ctx, parsedInput);
	},
	'channels.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.list'].parse(input);
		return DialpadOperationFunctions['channels.list'](ctx, parsedInput);
	},
	'coaching_team.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.get'].parse(input);
		return DialpadOperationFunctions['coaching_team.get'](ctx, parsedInput);
	},
	'coaching_team.members.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.members.get'].parse(input);
		return DialpadOperationFunctions['coaching_team.members.get'](
			ctx,
			parsedInput,
		);
	},
	'channels.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.create'].parse(input);
		return DialpadOperationFunctions['channels.create'](ctx, parsedInput);
	},
	'channels.members.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.members.delete'].parse(input);
		return DialpadOperationFunctions['channels.members.delete'](
			ctx,
			parsedInput,
		);
	},
	'channels.members.add': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['channels.members.add'].parse(input);
		return DialpadOperationFunctions['channels.members.add'](ctx, parsedInput);
	},
	'coaching_team.listall': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.listall'].parse(input);
		return DialpadOperationFunctions['coaching_team.listall'](ctx, parsedInput);
	},
	'company.get': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['company.get'].parse(input);
		return DialpadOperationFunctions['company.get'](ctx, parsedInput);
	},
	'company.sms_opt_out': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.sms_opt_out'].parse(input);
		return DialpadOperationFunctions['company.sms_opt_out'](ctx, parsedInput);
	},
	'company.update_settings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.update_settings'].parse(input);
		return DialpadOperationFunctions['company.update_settings'](
			ctx,
			parsedInput,
		);
	},
	'coaching_team.members.add': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.members.add'].parse(input);
		return DialpadOperationFunctions['coaching_team.members.add'](
			ctx,
			parsedInput,
		);
	},
	'company.get_ai_settings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.get_ai_settings'].parse(input);
		return DialpadOperationFunctions['company.get_ai_settings'](
			ctx,
			parsedInput,
		);
	},
	'company.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.update'].parse(input);
		return DialpadOperationFunctions['company.update'](ctx, parsedInput);
	},
	'company.update_ai_settings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['company.update_ai_settings'].parse(input);
		return DialpadOperationFunctions['company.update_ai_settings'](
			ctx,
			parsedInput,
		);
	},
	'contacts.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.delete'].parse(input);
		return DialpadOperationFunctions['contacts.delete'](ctx, parsedInput);
	},
	'contacts.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.update'].parse(input);
		return DialpadOperationFunctions['contacts.update'](ctx, parsedInput);
	},
	'contacts.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.list'].parse(input);
		return DialpadOperationFunctions['contacts.list'](ctx, parsedInput);
	},
	'contacts.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.get'].parse(input);
		return DialpadOperationFunctions['contacts.get'](ctx, parsedInput);
	},
	'contacts.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.create'].parse(input);
		return DialpadOperationFunctions['contacts.create'](ctx, parsedInput);
	},
	'contacts.create_with_uid': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.create_with_uid'].parse(input);
		return DialpadOperationFunctions['contacts.create_with_uid'](
			ctx,
			parsedInput,
		);
	},
	'ivr.delete': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['ivr.delete'].parse(input);
		return DialpadOperationFunctions['ivr.delete'](ctx, parsedInput);
	},
	'contacts.search': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['contacts.search'].parse(input);
		return DialpadOperationFunctions['contacts.search'](ctx, parsedInput);
	},
	'ivr.assign': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['ivr.assign'].parse(input);
		return DialpadOperationFunctions['ivr.assign'](ctx, parsedInput);
	},
	'custom_ivrs.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['custom_ivrs.list'].parse(input);
		return DialpadOperationFunctions['custom_ivrs.list'](ctx, parsedInput);
	},
	'ivr.update_details': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['ivr.update_details'].parse(input);
		return DialpadOperationFunctions['ivr.update_details'](ctx, parsedInput);
	},
	'departments.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.delete'].parse(input);
		return DialpadOperationFunctions['departments.delete'](ctx, parsedInput);
	},
	'ivr.create': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['ivr.create'].parse(input);
		return DialpadOperationFunctions['ivr.create'](ctx, parsedInput);
	},
	'departments.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.update'].parse(input);
		return DialpadOperationFunctions['departments.update'](ctx, parsedInput);
	},
	'departments.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.create'].parse(input);
		return DialpadOperationFunctions['departments.create'](ctx, parsedInput);
	},
	'departments.listall': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.listall'].parse(input);
		return DialpadOperationFunctions['departments.listall'](ctx, parsedInput);
	},
	'departments.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.get'].parse(input);
		return DialpadOperationFunctions['departments.get'](ctx, parsedInput);
	},
	'departments.operators.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.operators.delete'].parse(input);
		return DialpadOperationFunctions['departments.operators.delete'](
			ctx,
			parsedInput,
		);
	},
	'dispositions.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.delete'].parse(input);
		return DialpadOperationFunctions['dispositions.delete'](ctx, parsedInput);
	},
	'digital.sessions.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['digital.sessions.list'].parse(input);
		return DialpadOperationFunctions['digital.sessions.list'](ctx, parsedInput);
	},
	'dispositions.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.update'].parse(input);
		return DialpadOperationFunctions['dispositions.update'](ctx, parsedInput);
	},
	'dispositions.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.get'].parse(input);
		return DialpadOperationFunctions['dispositions.get'](ctx, parsedInput);
	},
	'departments.operators.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.operators.list'].parse(input);
		return DialpadOperationFunctions['departments.operators.list'](
			ctx,
			parsedInput,
		);
	},
	'dispositions.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.list'].parse(input);
		return DialpadOperationFunctions['dispositions.list'](ctx, parsedInput);
	},
	'dispositions.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['dispositions.create'].parse(input);
		return DialpadOperationFunctions['dispositions.create'](ctx, parsedInput);
	},
	'departments.operators.add': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.operators.add'].parse(input);
		return DialpadOperationFunctions['departments.operators.add'](
			ctx,
			parsedInput,
		);
	},
	'faxline.assign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['faxline.assign'].parse(input);
		return DialpadOperationFunctions['faxline.assign'](ctx, parsedInput);
	},
	'bulk_messages.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.get'].parse(input);
		return DialpadOperationFunctions['bulk_messages.get'](ctx, parsedInput);
	},
	'fax.send': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['fax.send'].parse(input);
		return DialpadOperationFunctions['fax.send'](ctx, parsedInput);
	},
	'bulk_messages.send': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.send'].parse(input);
		return DialpadOperationFunctions['bulk_messages.send'](ctx, parsedInput);
	},
	'scheduled_messages.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.create'].parse(input);
		return DialpadOperationFunctions['scheduled_messages.create'](
			ctx,
			parsedInput,
		);
	},
	'scheduled_messages.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.delete'].parse(input);
		return DialpadOperationFunctions['scheduled_messages.delete'](
			ctx,
			parsedInput,
		);
	},
	'bulk_messages.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.update'].parse(input);
		return DialpadOperationFunctions['bulk_messages.update'](ctx, parsedInput);
	},
	'bulk_messages.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['bulk_messages.list'].parse(input);
		return DialpadOperationFunctions['bulk_messages.list'](ctx, parsedInput);
	},
	'scheduled_messages.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.list'].parse(input);
		return DialpadOperationFunctions['scheduled_messages.list'](
			ctx,
			parsedInput,
		);
	},
	'numbers.unassign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.unassign'].parse(input);
		return DialpadOperationFunctions['numbers.unassign'](ctx, parsedInput);
	},
	'scheduled_messages.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.get'].parse(input);
		return DialpadOperationFunctions['scheduled_messages.get'](
			ctx,
			parsedInput,
		);
	},
	'numbers.assign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.assign'].parse(input);
		return DialpadOperationFunctions['numbers.assign'](ctx, parsedInput);
	},
	'scheduled_messages.send_now': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.send_now'].parse(input);
		return DialpadOperationFunctions['scheduled_messages.send_now'](
			ctx,
			parsedInput,
		);
	},
	'numbers.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.list'].parse(input);
		return DialpadOperationFunctions['numbers.list'](ctx, parsedInput);
	},
	'numbers.auto_assign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.auto_assign'].parse(input);
		return DialpadOperationFunctions['numbers.auto_assign'](ctx, parsedInput);
	},
	'numbers.swap': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.swap'].parse(input);
		return DialpadOperationFunctions['numbers.swap'](ctx, parsedInput);
	},
	'number_tags.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['number_tags.update'].parse(input);
		return DialpadOperationFunctions['number_tags.update'](ctx, parsedInput);
	},
	'scheduled_messages.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scheduled_messages.update'].parse(input);
		return DialpadOperationFunctions['scheduled_messages.update'](
			ctx,
			parsedInput,
		);
	},
	'numbers.get': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['numbers.get'].parse(input);
		return DialpadOperationFunctions['numbers.get'](ctx, parsedInput);
	},
	'coaching_team.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['coaching_team.list'].parse(input);
		return DialpadOperationFunctions['coaching_team.list'](ctx, parsedInput);
	},
	'office_plan.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['office_plan.get'].parse(input);
		return DialpadOperationFunctions['office_plan.get'](ctx, parsedInput);
	},
	'phone_number.format': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['phone_number.format'].parse(input);
		return DialpadOperationFunctions['phone_number.format'](ctx, parsedInput);
	},
	'departments.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['departments.list'].parse(input);
		return DialpadOperationFunctions['departments.list'](ctx, parsedInput);
	},
	'numbers.office_unassign_number.post': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.office_unassign_number.post'].parse(
				input,
			);
		return DialpadOperationFunctions['numbers.office_unassign_number.post'](
			ctx,
			parsedInput,
		);
	},
	'callcenters.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['callcenters.list'].parse(input);
		return DialpadOperationFunctions['callcenters.list'](ctx, parsedInput);
	},
	'numbers.assign_office_number.post': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.assign_office_number.post'].parse(
				input,
			);
		return DialpadOperationFunctions['numbers.assign_office_number.post'](
			ctx,
			parsedInput,
		);
	},
	'available_licenses.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['available_licenses.list'].parse(input);
		return DialpadOperationFunctions['available_licenses.list'](
			ctx,
			parsedInput,
		);
	},
	'offices.e911.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.e911.get'].parse(input);
		return DialpadOperationFunctions['offices.e911.get'](ctx, parsedInput);
	},
	'offices.offdutystatuses.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.offdutystatuses.get'].parse(input);
		return DialpadOperationFunctions['offices.offdutystatuses.get'](
			ctx,
			parsedInput,
		);
	},
	'offices.e911.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.e911.update'].parse(input);
		return DialpadOperationFunctions['offices.e911.update'](ctx, parsedInput);
	},
	'offices.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.update'].parse(input);
		return DialpadOperationFunctions['offices.update'](ctx, parsedInput);
	},
	'offices.get': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['offices.get'].parse(input);
		return DialpadOperationFunctions['offices.get'](ctx, parsedInput);
	},
	'offices.primary.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.primary.get'].parse(input);
		return DialpadOperationFunctions['offices.primary.get'](ctx, parsedInput);
	},
	'offices.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.list'].parse(input);
		return DialpadOperationFunctions['offices.list'](ctx, parsedInput);
	},
	'offices.operators.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.operators.delete'].parse(input);
		return DialpadOperationFunctions['offices.operators.delete'](
			ctx,
			parsedInput,
		);
	},
	'offices.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.create'].parse(input);
		return DialpadOperationFunctions['offices.create'](ctx, parsedInput);
	},
	'offices.operators.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.operators.get'].parse(input);
		return DialpadOperationFunctions['offices.operators.get'](ctx, parsedInput);
	},
	'offices.operators.post': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['offices.operators.post'].parse(input);
		return DialpadOperationFunctions['offices.operators.post'](
			ctx,
			parsedInput,
		);
	},
	'recording_share_link.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.create'].parse(input);
		return DialpadOperationFunctions['recording_share_link.create'](
			ctx,
			parsedInput,
		);
	},
	'recording_share_link.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.get'].parse(input);
		return DialpadOperationFunctions['recording_share_link.get'](
			ctx,
			parsedInput,
		);
	},
	'numbers.assign_room_number.post': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.assign_room_number.post'].parse(
				input,
			);
		return DialpadOperationFunctions['numbers.assign_room_number.post'](
			ctx,
			parsedInput,
		);
	},
	'numbers.room_unassign_number.post': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['numbers.room_unassign_number.post'].parse(
				input,
			);
		return DialpadOperationFunctions['numbers.room_unassign_number.post'](
			ctx,
			parsedInput,
		);
	},
	'rooms.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['rooms.delete'].parse(input);
		return DialpadOperationFunctions['rooms.delete'](ctx, parsedInput);
	},
	'rooms.get': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.get'].parse(input);
		return DialpadOperationFunctions['rooms.get'](ctx, parsedInput);
	},
	'recording_share_link.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.delete'].parse(input);
		return DialpadOperationFunctions['recording_share_link.delete'](
			ctx,
			parsedInput,
		);
	},
	'rooms.post': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.post'].parse(input);
		return DialpadOperationFunctions['rooms.post'](ctx, parsedInput);
	},
	'recording_share_link.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recording_share_link.update'].parse(input);
		return DialpadOperationFunctions['recording_share_link.update'](
			ctx,
			parsedInput,
		);
	},
	'deskphones.rooms.create_international_pin': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'deskphones.rooms.create_international_pin'
			].parse(input);
		return DialpadOperationFunctions[
			'deskphones.rooms.create_international_pin'
		](ctx, parsedInput);
	},
	'rooms.list': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.list'].parse(input);
		return DialpadOperationFunctions['rooms.list'](ctx, parsedInput);
	},
	'deskphones.rooms.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.rooms.get'].parse(input);
		return DialpadOperationFunctions['deskphones.rooms.get'](ctx, parsedInput);
	},
	'rooms.patch': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['rooms.patch'].parse(input);
		return DialpadOperationFunctions['rooms.patch'](ctx, parsedInput);
	},
	'deskphones.rooms.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.rooms.list'].parse(input);
		return DialpadOperationFunctions['deskphones.rooms.list'](ctx, parsedInput);
	},
	'deskphones.rooms.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.rooms.delete'].parse(input);
		return DialpadOperationFunctions['deskphones.rooms.delete'](
			ctx,
			parsedInput,
		);
	},
	'schedule_reports.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.update'].parse(input);
		return DialpadOperationFunctions['schedule_reports.update'](
			ctx,
			parsedInput,
		);
	},
	'schedule_reports.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.create'].parse(input);
		return DialpadOperationFunctions['schedule_reports.create'](
			ctx,
			parsedInput,
		);
	},
	'schedule_reports.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.get'].parse(input);
		return DialpadOperationFunctions['schedule_reports.get'](ctx, parsedInput);
	},
	'scorecards.export.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.export.get'].parse(input);
		return DialpadOperationFunctions['scorecards.export.get'](ctx, parsedInput);
	},
	'scorecards.export.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.export.create'].parse(input);
		return DialpadOperationFunctions['scorecards.export.create'](
			ctx,
			parsedInput,
		);
	},
	'scorecards.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.get'].parse(input);
		return DialpadOperationFunctions['scorecards.get'](ctx, parsedInput);
	},
	'scorecards.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['scorecards.list'].parse(input);
		return DialpadOperationFunctions['scorecards.list'](ctx, parsedInput);
	},
	'schedule_reports.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.delete'].parse(input);
		return DialpadOperationFunctions['schedule_reports.delete'](
			ctx,
			parsedInput,
		);
	},
	'schedule_reports.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['schedule_reports.list'].parse(input);
		return DialpadOperationFunctions['schedule_reports.list'](ctx, parsedInput);
	},
	'stats.export.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['stats.export.create'].parse(input);
		return DialpadOperationFunctions['stats.export.create'](ctx, parsedInput);
	},
	'stats.export.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['stats.export.get'].parse(input);
		return DialpadOperationFunctions['stats.export.get'](ctx, parsedInput);
	},
	'sms.send': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['sms.send'].parse(input);
		return DialpadOperationFunctions['sms.send'](ctx, parsedInput);
	},
	'users.initiate_call': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.initiate_call'].parse(input);
		return DialpadOperationFunctions['users.initiate_call'](ctx, parsedInput);
	},
	'users.toggle_call_vi': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.toggle_call_vi'].parse(input);
		return DialpadOperationFunctions['users.toggle_call_vi'](ctx, parsedInput);
	},
	'userdevices.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['userdevices.get'].parse(input);
		return DialpadOperationFunctions['userdevices.get'](ctx, parsedInput);
	},
	'transcripts.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['transcripts.get'].parse(input);
		return DialpadOperationFunctions['transcripts.get'](ctx, parsedInput);
	},
	'userdevices.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['userdevices.list'].parse(input);
		return DialpadOperationFunctions['userdevices.list'](ctx, parsedInput);
	},
	'users.toggle_call_recording': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.toggle_call_recording'].parse(input);
		return DialpadOperationFunctions['users.toggle_call_recording'](
			ctx,
			parsedInput,
		);
	},
	'transcripts.get_url': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['transcripts.get_url'].parse(input);
		return DialpadOperationFunctions['transcripts.get_url'](ctx, parsedInput);
	},
	'users.set_caller_id': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.set_caller_id'].parse(input);
		return DialpadOperationFunctions['users.set_caller_id'](ctx, parsedInput);
	},
	'deskphones.users.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.users.delete'].parse(input);
		return DialpadOperationFunctions['deskphones.users.delete'](
			ctx,
			parsedInput,
		);
	},
	'caller_id.users.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['caller_id.users.get'].parse(input);
		return DialpadOperationFunctions['caller_id.users.get'](ctx, parsedInput);
	},
	'deskphones.users.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.users.get'].parse(input);
		return DialpadOperationFunctions['deskphones.users.get'](ctx, parsedInput);
	},
	'users.e911.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.e911.update'].parse(input);
		return DialpadOperationFunctions['users.e911.update'](ctx, parsedInput);
	},
	'users.toggle_dnd': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.toggle_dnd'].parse(input);
		return DialpadOperationFunctions['users.toggle_dnd'](ctx, parsedInput);
	},
	'users.unassign_number': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.unassign_number'].parse(input);
		return DialpadOperationFunctions['users.unassign_number'](ctx, parsedInput);
	},
	'users.assign_number': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.assign_number'].parse(input);
		return DialpadOperationFunctions['users.assign_number'](ctx, parsedInput);
	},
	'users.list_personas': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.list_personas'].parse(input);
		return DialpadOperationFunctions['users.list_personas'](ctx, parsedInput);
	},
	'users.e911.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.e911.get'].parse(input);
		return DialpadOperationFunctions['users.e911.get'](ctx, parsedInput);
	},
	'deskphones.users.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['deskphones.users.list'].parse(input);
		return DialpadOperationFunctions['deskphones.users.list'](ctx, parsedInput);
	},
	'screen_pop.initiate': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['screen_pop.initiate'].parse(input);
		return DialpadOperationFunctions['screen_pop.initiate'](ctx, parsedInput);
	},
	'users.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.delete'].parse(input);
		return DialpadOperationFunctions['users.delete'](ctx, parsedInput);
	},
	'users.get': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['users.get'].parse(input);
		return DialpadOperationFunctions['users.get'](ctx, parsedInput);
	},
	'users.list': async (ctx, input) => {
		const parsedInput = DialpadEndpointInputSchemas['users.list'].parse(input);
		return DialpadOperationFunctions['users.list'](ctx, parsedInput);
	},
	'users.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.update'].parse(input);
		return DialpadOperationFunctions['users.update'](ctx, parsedInput);
	},
	'users.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.create'].parse(input);
		return DialpadOperationFunctions['users.create'](ctx, parsedInput);
	},
	'users.move_office': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.move_office'].parse(input);
		return DialpadOperationFunctions['users.move_office'](ctx, parsedInput);
	},
	'users.create_batch': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.create_batch'].parse(input);
		return DialpadOperationFunctions['users.create_batch'](ctx, parsedInput);
	},
	'users.update_status': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['users.update_status'].parse(input);
		return DialpadOperationFunctions['users.update_status'](ctx, parsedInput);
	},
	'search.users': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['search.users'].parse(input);
		return DialpadOperationFunctions['search.users'](ctx, parsedInput);
	},
	'websockets.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.get'].parse(input);
		return DialpadOperationFunctions['websockets.get'](ctx, parsedInput);
	},
	'websockets.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.list'].parse(input);
		return DialpadOperationFunctions['websockets.list'](ctx, parsedInput);
	},
	'websockets.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.create'].parse(input);
		return DialpadOperationFunctions['websockets.create'](ctx, parsedInput);
	},
	'meetings.conference-meetings.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.conference-meetings.list'].parse(
				input,
			);
		return DialpadOperationFunctions['meetings.conference-meetings.list'](
			ctx,
			parsedInput,
		);
	},
	'meetings.conference-rooms.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.conference-rooms.list'].parse(
				input,
			);
		return DialpadOperationFunctions['meetings.conference-rooms.list'](
			ctx,
			parsedInput,
		);
	},
	'websockets.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.update'].parse(input);
		return DialpadOperationFunctions['websockets.update'](ctx, parsedInput);
	},
	'meetings.meetings.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.get'].parse(input);
		return DialpadOperationFunctions['meetings.meetings.get'](ctx, parsedInput);
	},
	'websockets.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['websockets.delete'].parse(input);
		return DialpadOperationFunctions['websockets.delete'](ctx, parsedInput);
	},
	'meetings.meetings.update': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.update'].parse(input);
		return DialpadOperationFunctions['meetings.meetings.update'](
			ctx,
			parsedInput,
		);
	},
	'meetings.meetings.delete': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.delete'].parse(input);
		return DialpadOperationFunctions['meetings.meetings.delete'](
			ctx,
			parsedInput,
		);
	},
	'meetings.meetings.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.create'].parse(input);
		return DialpadOperationFunctions['meetings.meetings.create'](
			ctx,
			parsedInput,
		);
	},
	'meetings.meetings.room.create': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.room.create'].parse(input);
		return DialpadOperationFunctions['meetings.meetings.room.create'](
			ctx,
			parsedInput,
		);
	},
	'wfm.wfm-metrics-activity.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['wfm.wfm-metrics-activity.get'].parse(input);
		return DialpadOperationFunctions['wfm.wfm-metrics-activity.get'](
			ctx,
			parsedInput,
		);
	},
	'wfm.wfm-metrics-agent.get': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['wfm.wfm-metrics-agent.get'].parse(input);
		return DialpadOperationFunctions['wfm.wfm-metrics-agent.get'](
			ctx,
			parsedInput,
		);
	},
	'meetings.meetings.list': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['meetings.meetings.list'].parse(input);
		return DialpadOperationFunctions['meetings.meetings.list'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getModelsByKeys': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getModelsByKeys'].parse(input);
		return DialpadOperationFunctions['powerdialer.getModelsByKeys'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getAblyToken': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getAblyToken'].parse(input);
		return DialpadOperationFunctions['powerdialer.getAblyToken'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getContact': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getContact'].parse(input);
		return DialpadOperationFunctions['powerdialer.getContact'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getModelsByKeysOfKind': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getModelsByKeysOfKind'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getModelsByKeysOfKind'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteModelsByKeysOfKind': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteModelsByKeysOfKind'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.deleteModelsByKeysOfKind'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createCustomProperties': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createCustomProperties'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.createCustomProperties'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCustomProperties': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCustomProperties'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getCustomProperties'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCustomProperty': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCustomProperty'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCustomProperty'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateCustomProperty': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCustomProperty'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.updateCustomProperty'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getDialpadOAuthService': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getDialpadOAuthService'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getDialpadOAuthService'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateGlobalSettings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateGlobalSettings'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.updateGlobalSettings'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteCustomProperty': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCustomProperty'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.deleteCustomProperty'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getGlobalSettings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getGlobalSettings'].parse(input);
		return DialpadOperationFunctions['powerdialer.getGlobalSettings'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getEventLogs': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getEventLogs'].parse(input);
		return DialpadOperationFunctions['powerdialer.getEventLogs'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getJobs': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getJobs'].parse(input);
		return DialpadOperationFunctions['powerdialer.getJobs'](ctx, parsedInput);
	},
	'powerdialer.getJob': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getJob'].parse(input);
		return DialpadOperationFunctions['powerdialer.getJob'](ctx, parsedInput);
	},
	'powerdialer.getApiKey': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getApiKey'].parse(input);
		return DialpadOperationFunctions['powerdialer.getApiKey'](ctx, parsedInput);
	},
	'powerdialer.getApiKeys': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getApiKeys'].parse(input);
		return DialpadOperationFunctions['powerdialer.getApiKeys'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getOperator': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getOperator'].parse(input);
		return DialpadOperationFunctions['powerdialer.getOperator'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLogin': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLogin'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLogin'](ctx, parsedInput);
	},
	'powerdialer.deleteApiKey': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteApiKey'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteApiKey'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateApiKey': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateApiKey'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateApiKey'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.postLogin': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.postLogin'].parse(input);
		return DialpadOperationFunctions['powerdialer.postLogin'](ctx, parsedInput);
	},
	'powerdialer.createApiKey': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createApiKey'].parse(input);
		return DialpadOperationFunctions['powerdialer.createApiKey'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createServiceAccount': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createServiceAccount'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.createServiceAccount'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getServiceAccount': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getServiceAccount'].parse(input);
		return DialpadOperationFunctions['powerdialer.getServiceAccount'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateServiceAccount': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateServiceAccount'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.updateServiceAccount'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteServiceAccount': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteServiceAccount'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.deleteServiceAccount'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getSmsForTarget': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getSmsForTarget'].parse(input);
		return DialpadOperationFunctions['powerdialer.getSmsForTarget'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.smsItem': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.smsItem'].parse(input);
		return DialpadOperationFunctions['powerdialer.smsItem'](ctx, parsedInput);
	},
	'powerdialer.getServiceAccounts': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getServiceAccounts'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getServiceAccounts'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCurrentUser': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCurrentUser'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCurrentUser'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getWorker': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getWorker'].parse(input);
		return DialpadOperationFunctions['powerdialer.getWorker'](ctx, parsedInput);
	},
	'powerdialer.updateWorker': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateWorker'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateWorker'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getWorkers': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getWorkers'].parse(input);
		return DialpadOperationFunctions['powerdialer.getWorkers'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createAudience': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createAudience'].parse(input);
		return DialpadOperationFunctions['powerdialer.createAudience'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getAudiences': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getAudiences'].parse(input);
		return DialpadOperationFunctions['powerdialer.getAudiences'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateAudience': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateAudience'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateAudience'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getAudience': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getAudience'].parse(input);
		return DialpadOperationFunctions['powerdialer.getAudience'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createBot': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createBot'].parse(input);
		return DialpadOperationFunctions['powerdialer.createBot'](ctx, parsedInput);
	},
	'powerdialer.duplicateAudience': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateAudience'].parse(input);
		return DialpadOperationFunctions['powerdialer.duplicateAudience'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getBots': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBots'].parse(input);
		return DialpadOperationFunctions['powerdialer.getBots'](ctx, parsedInput);
	},
	'powerdialer.updateBot': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateBot'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateBot'](ctx, parsedInput);
	},
	'powerdialer.deleteAudience': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteAudience'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteAudience'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteBot': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteBot'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteBot'](ctx, parsedInput);
	},
	'powerdialer.getBot': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBot'].parse(input);
		return DialpadOperationFunctions['powerdialer.getBot'](ctx, parsedInput);
	},
	'powerdialer.getBotDialogs': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotDialogs'].parse(input);
		return DialpadOperationFunctions['powerdialer.getBotDialogs'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createBotDialog': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createBotDialog'].parse(input);
		return DialpadOperationFunctions['powerdialer.createBotDialog'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteBotDialog': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteBotDialog'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteBotDialog'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getBotMessages': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotMessages'].parse(input);
		return DialpadOperationFunctions['powerdialer.getBotMessages'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createBotMessage': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createBotMessage'].parse(input);
		return DialpadOperationFunctions['powerdialer.createBotMessage'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteBotMessage': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteBotMessage'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteBotMessage'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getBotMessage': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotMessage'].parse(input);
		return DialpadOperationFunctions['powerdialer.getBotMessage'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateBotDialog': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateBotDialog'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateBotDialog'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCampaigns': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaigns'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCampaigns'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.searchCampaigns': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.searchCampaigns'].parse(input);
		return DialpadOperationFunctions['powerdialer.searchCampaigns'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteCampaign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCampaign'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteCampaign'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createCampaign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createCampaign'].parse(input);
		return DialpadOperationFunctions['powerdialer.createCampaign'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCampaign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaign'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCampaign'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateCampaign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCampaign'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateCampaign'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.duplicateCampaign': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateCampaign'].parse(input);
		return DialpadOperationFunctions['powerdialer.duplicateCampaign'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCampaignResultExportUrl': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getCampaignResultExportUrl'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.getCampaignResultExportUrl'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createCampaignGroup': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createCampaignGroup'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.createCampaignGroup'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteCampaignGroup': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCampaignGroup'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.deleteCampaignGroup'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCampaignGroup': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaignGroup'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCampaignGroup'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCampaignGroups': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaignGroups'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCampaignGroups'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.startCampaignResultExport': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.startCampaignResultExport'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.startCampaignResultExport'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCampaignSettings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCampaignSettings'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getCampaignSettings'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateCampaignGroup': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCampaignGroup'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.updateCampaignGroup'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.editCampaignSettings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.editCampaignSettings'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.editCampaignSettings'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteCsv': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteCsv'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteCsv'](ctx, parsedInput);
	},
	'powerdialer.getCsvPresignedUrl': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCsvPresignedUrl'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getCsvPresignedUrl'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateCsv': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateCsv'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateCsv'](ctx, parsedInput);
	},
	'powerdialer.getVarsInfo': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getVarsInfo'].parse(input);
		return DialpadOperationFunctions['powerdialer.getVarsInfo'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCsv': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCsv'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCsv'](ctx, parsedInput);
	},
	'powerdialer.getPhoneCsvs': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhoneCsvs'].parse(input);
		return DialpadOperationFunctions['powerdialer.getPhoneCsvs'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getCsvs': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getCsvs'].parse(input);
		return DialpadOperationFunctions['powerdialer.getCsvs'](ctx, parsedInput);
	},
	'powerdialer.getPhoneCsv': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhoneCsv'].parse(input);
		return DialpadOperationFunctions['powerdialer.getPhoneCsv'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updatePhoneCsv': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updatePhoneCsv'].parse(input);
		return DialpadOperationFunctions['powerdialer.updatePhoneCsv'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deletePhoneCsv': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deletePhoneCsv'].parse(input);
		return DialpadOperationFunctions['powerdialer.deletePhoneCsv'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createLeadList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createLeadList'].parse(input);
		return DialpadOperationFunctions['powerdialer.createLeadList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getBotDialog': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getBotDialog'].parse(input);
		return DialpadOperationFunctions['powerdialer.getBotDialog'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getListItems': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getListItems'].parse(input);
		return DialpadOperationFunctions['powerdialer.getListItems'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteLeadListItem': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteLeadListItem'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.deleteLeadListItem'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getListList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getListList'].parse(input);
		return DialpadOperationFunctions['powerdialer.getListList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadListItem': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadListItem'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadListItem'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteLeadList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteLeadList'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteLeadList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.duplicateLeadList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateLeadList'].parse(input);
		return DialpadOperationFunctions['powerdialer.duplicateLeadList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadLists': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadLists'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadLists'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateLeadList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateLeadList'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateLeadList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getListView': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getListView'].parse(input);
		return DialpadOperationFunctions['powerdialer.getListView'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createStaticList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createStaticList'].parse(input);
		return DialpadOperationFunctions['powerdialer.createStaticList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getStaticLists': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getStaticLists'].parse(input);
		return DialpadOperationFunctions['powerdialer.getStaticLists'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getStaticList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getStaticList'].parse(input);
		return DialpadOperationFunctions['powerdialer.getStaticList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deleteStaticList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteStaticList'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteStaticList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.duplicateStaticList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.duplicateStaticList'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.duplicateStaticList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createLeads': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createLeads'].parse(input);
		return DialpadOperationFunctions['powerdialer.createLeads'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.queryLeads': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.queryLeads'].parse(input);
		return DialpadOperationFunctions['powerdialer.queryLeads'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLead': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLead'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLead'](ctx, parsedInput);
	},
	'powerdialer.updateLead': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateLead'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateLead'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadCompany': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadCompany'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadCompany'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadCompanies': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadCompanies'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadCompanies'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateStaticList': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateStaticList'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateStaticList'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeads': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeads'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeads'](ctx, parsedInput);
	},
	'powerdialer.startLeadExport': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.startLeadExport'].parse(input);
		return DialpadOperationFunctions['powerdialer.startLeadExport'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadListView': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadListView'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadListView'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.bulkUpdateLeadItems': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.bulkUpdateLeadItems'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.bulkUpdateLeadItems'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadItem': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadItem'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadItem'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadItems': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadItems'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadItems'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadListViewById': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadListViewById'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.getLeadListViewById'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getLeadExport': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getLeadExport'].parse(input);
		return DialpadOperationFunctions['powerdialer.getLeadExport'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createPhone': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createPhone'].parse(input);
		return DialpadOperationFunctions['powerdialer.createPhone'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getPhone': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhone'].parse(input);
		return DialpadOperationFunctions['powerdialer.getPhone'](ctx, parsedInput);
	},
	'powerdialer.updateLeadItem': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateLeadItem'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateLeadItem'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.deletePhone': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deletePhone'].parse(input);
		return DialpadOperationFunctions['powerdialer.deletePhone'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getSalesforceObjectListViews': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectListViews'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.getSalesforceObjectListViews'
		](ctx, parsedInput);
	},
	'powerdialer.updatePhone': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updatePhone'].parse(input);
		return DialpadOperationFunctions['powerdialer.updatePhone'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getSalesforceObjectFields': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectFields'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.getSalesforceObjectFields'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getSalesforceListViewById': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceListViewById'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.getSalesforceListViewById'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createSalesforceListViewImport': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.createSalesforceListViewImport'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.createSalesforceListViewImport'
		](ctx, parsedInput);
	},
	'powerdialer.getSalesforceListViewImports': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceListViewImports'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.getSalesforceListViewImports'
		](ctx, parsedInput);
	},
	'powerdialer.getSalesforceObjectMappings': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectMappings'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.getSalesforceObjectMappings'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.createSalesforceObjectMapping': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.createSalesforceObjectMapping'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.createSalesforceObjectMapping'
		](ctx, parsedInput);
	},
	'powerdialer.updateSalesforceListViewImport': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.updateSalesforceListViewImport'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.updateSalesforceListViewImport'
		](ctx, parsedInput);
	},
	'powerdialer.deleteSalesforceObjectMapping': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.deleteSalesforceObjectMapping'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.deleteSalesforceObjectMapping'
		](ctx, parsedInput);
	},
	'powerdialer.getSalesforceListViewImport': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceListViewImport'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.getSalesforceListViewImport'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getSalesforceObjectMapping': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.getSalesforceObjectMapping'
			].parse(input);
		return DialpadOperationFunctions['powerdialer.getSalesforceObjectMapping'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.patchSalesforceListView': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.patchSalesforceListView'].parse(
				input,
			);
		return DialpadOperationFunctions['powerdialer.patchSalesforceListView'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateSalesforceObjectMapping': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas[
				'powerdialer.updateSalesforceObjectMapping'
			].parse(input);
		return DialpadOperationFunctions[
			'powerdialer.updateSalesforceObjectMapping'
		](ctx, parsedInput);
	},
	'powerdialer.getRules': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getRules'].parse(input);
		return DialpadOperationFunctions['powerdialer.getRules'](ctx, parsedInput);
	},
	'powerdialer.createRule': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.createRule'].parse(input);
		return DialpadOperationFunctions['powerdialer.createRule'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getPhones': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getPhones'].parse(input);
		return DialpadOperationFunctions['powerdialer.getPhones'](ctx, parsedInput);
	},
	'powerdialer.deleteRule': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.deleteRule'].parse(input);
		return DialpadOperationFunctions['powerdialer.deleteRule'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.updateRule': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.updateRule'].parse(input);
		return DialpadOperationFunctions['powerdialer.updateRule'](
			ctx,
			parsedInput,
		);
	},
	'powerdialer.getRule': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['powerdialer.getRule'].parse(input);
		return DialpadOperationFunctions['powerdialer.getRule'](ctx, parsedInput);
	},
	'reports.scheduledstats.download': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['reports.scheduledstats.download'].parse(
				input,
			);
		return DialpadOperationFunctions['reports.scheduledstats.download'](
			ctx,
			parsedInput,
		);
	},
	'recordings.call.download': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recordings.call.download'].parse(input);
		return DialpadOperationFunctions['recordings.call.download'](
			ctx,
			parsedInput,
		);
	},
	'recordings.voicemail.download': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recordings.voicemail.download'].parse(input);
		return DialpadOperationFunctions['recordings.voicemail.download'](
			ctx,
			parsedInput,
		);
	},
	'recordings.admin_call.download': async (ctx, input) => {
		const parsedInput =
			DialpadEndpointInputSchemas['recordings.admin_call.download'].parse(
				input,
			);
		return DialpadOperationFunctions['recordings.admin_call.download'](
			ctx,
			parsedInput,
		);
	},
};
