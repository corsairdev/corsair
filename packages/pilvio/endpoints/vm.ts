import type { PilvioEndpoints } from '..';
import { call } from './call';
import {
	PilvioEndpointInputSchemas as Inputs,
	PilvioEndpointOutputSchemas as Outputs,
} from './types';

const VM = '/v1/user-resource/vm';

export const list: PilvioEndpoints['vmList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.list',
			input: Inputs.vmList,
			output: Outputs.vmList,
		},
		input,
		() => ({ method: 'GET', path: `${VM}/list` }),
		{ log: (_, vms) => ({ count: vms.length }) },
	);

export const get: PilvioEndpoints['vmGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.get',
			input: Inputs.vmGet,
			output: Outputs.vmGet,
		},
		input,
		({ uuid }) => ({
			method: 'GET',
			path: VM,
			query: { uuid },
		}),
		{ log: (_, vm) => ({ vmUuid: vm.uuid ?? undefined }) },
	);

export const create: PilvioEndpoints['vmCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.create',
			input: Inputs.vmCreate,
			output: Outputs.vmCreate,
		},
		input,
		({
			name,
			osName,
			osVersion,
			disks,
			vcpu,
			ram,
			designatedPoolUuid,
			username,
			password,
			billingAccountId,
			networkUuid,
			reservePublicIp,
			cloudInit,
			sourceUuid,
			sourceReplica,
			diskUuid,
		}) => ({
			method: 'POST',
			path: VM,
			body: {
				name,
				os_name: osName,
				os_version: osVersion,
				disks,
				vcpu,
				ram,
				designated_pool_uuid: designatedPoolUuid,
				username,
				// The password rides through the request and is never logged.
				password,
				billing_account_id: billingAccountId,
				network_uuid: networkUuid,
				reserve_public_ip: reservePublicIp,
				cloud_init: cloudInit,
				source_uuid: sourceUuid,
				source_replica: sourceReplica,
				disk_uuid: diskUuid,
			},
		}),
		{ log: (_, vm) => ({ vmUuid: vm.uuid ?? undefined }) },
	);

export const start: PilvioEndpoints['vmStart'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.start',
			input: Inputs.vmStart,
			output: Outputs.vmStart,
		},
		input,
		({ uuid }) => ({ method: 'POST', path: `${VM}/start`, body: { uuid } }),
		{ log: ({ uuid }) => ({ vmUuid: uuid }) },
	);

export const stop: PilvioEndpoints['vmStop'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.stop',
			input: Inputs.vmStop,
			output: Outputs.vmStop,
		},
		input,
		({ uuid }) => ({ method: 'POST', path: `${VM}/stop`, body: { uuid } }),
		{ log: ({ uuid }) => ({ vmUuid: uuid }) },
	);

export const reinstall: PilvioEndpoints['vmReinstall'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.reinstall',
			input: Inputs.vmReinstall,
			output: Outputs.vmReinstall,
		},
		input,
		({ uuid, osName, osVersion }) => ({
			method: 'POST',
			path: `${VM}/reinstall`,
			body: { uuid, os_name: osName, os_version: osVersion },
		}),
		{ log: ({ uuid }) => ({ vmUuid: uuid }) },
	);

export const deleteVm: PilvioEndpoints['vmDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'vm.delete',
			input: Inputs.vmDelete,
			output: Outputs.vmDelete,
		},
		input,
		({ uuid }) => ({
			method: 'DELETE',
			path: VM,
			body: { uuid },
		}),
		{ log: ({ uuid }) => ({ vmUuid: uuid }) },
	);
