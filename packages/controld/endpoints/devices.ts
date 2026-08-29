import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';
import type { ControlDEndpointInputs, ControlDEndpointOutputs } from './types';

export async function listDevices(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['listDevices'],
): Promise<ControlDEndpointOutputs['listDevices']> {
	return makeControlDRequest('/devices', ctx.key, { method: 'GET' });
}

export async function getDevice(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['getDevice'],
): Promise<ControlDEndpointOutputs['getDevice']> {
	return makeControlDRequest(`/devices/${input.id}`, ctx.key, {
		method: 'GET',
	});
}

export async function createDevice(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['createDevice'],
): Promise<ControlDEndpointOutputs['createDevice']> {
	return makeControlDRequest(`/devices`, ctx.key, {
		method: 'POST',
		body: input,
	});
}

export async function updateDevice(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['updateDevice'],
): Promise<ControlDEndpointOutputs['updateDevice']> {
	const { id, ...body } = input;
	return makeControlDRequest(`/devices/${id}`, ctx.key, {
		method: 'PUT',
		body,
	});
}

export async function deleteDevice(
	ctx: ControlDContext,
	input: ControlDEndpointInputs['deleteDevice'],
): Promise<ControlDEndpointOutputs['deleteDevice']> {
	return makeControlDRequest(`/devices/${input.id}`, ctx.key, {
		method: 'DELETE',
	});
}
