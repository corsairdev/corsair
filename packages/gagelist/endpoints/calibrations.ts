import type { GagelistEndpoints } from '..';
import { segment } from '../client';
import { call, listShape } from './call';
import {
	GagelistEndpointInputSchemas as Inputs,
	GagelistEndpointOutputSchemas as Outputs,
} from './types';

const DEFAULT_PAGE = 50;

export const list: GagelistEndpoints['calibrationsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calibrations.list',
			input: Inputs.calibrationsList,
			output: Outputs.calibrationsList,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Calibration/List',
			body: {
				start: parsed.start ?? 0,
				record_number: parsed.record_number ?? DEFAULT_PAGE,
			},
		}),
		{
			shape: (raw, parsed) => listShape(raw, parsed, DEFAULT_PAGE),
			log: (_, result) => ({
				count: result.data.length,
				total: result.total ?? undefined,
			}),
		},
	);

export const get: GagelistEndpoints['calibrationsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calibrations.get',
			input: Inputs.calibrationsGet,
			output: Outputs.calibrationsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/GageList/api/Calibration/Detail/${segment(id)}`,
		}),
		{ log: (_, result) => ({ calibrationId: result.data.Id }) },
	);

export const create: GagelistEndpoints['calibrationsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calibrations.create',
			input: Inputs.calibrationsCreate,
			output: Outputs.calibrationsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Calibration/Create',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: (_, result) => ({ calibrationId: result.data }) },
	);

export const update: GagelistEndpoints['calibrationsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calibrations.update',
			input: Inputs.calibrationsUpdate,
			output: Outputs.calibrationsUpdate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/GageList/api/Calibration/Update',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{ log: ({ Id }) => ({ calibrationId: Id }) },
	);

export const remove: GagelistEndpoints['calibrationsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calibrations.delete',
			input: Inputs.calibrationsRemove,
			output: Outputs.calibrationsRemove,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/GageList/api/Calibration/Delete/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ calibrationId: id }) },
	);

// The certificate comes back as a rendered document rather than JSON, so the
// result carries it as a string instead of failing a parse.
export const certificate: GagelistEndpoints['calibrationCertificate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'calibrations.certificate',
			input: Inputs.calibrationCertificate,
			output: Outputs.calibrationCertificate,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/GageList/api/Calibration/GetCertificate/${segment(id)}`,
		}),
		{
			// unknown: the body is whatever the renderer sent, a JSON string when
			// it answers JSON and a document otherwise, so it is stringified
			// rather than parsed.
			shape: (raw: unknown) => ({
				certificate: typeof raw === 'string' ? raw : JSON.stringify(raw),
			}),
			log: (_, result) => ({ bytes: result.certificate.length }),
		},
	);
