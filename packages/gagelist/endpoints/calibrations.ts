import type { GagelistEndpoints } from '..';
import type { GagelistDocument } from '../client';
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
			// A read, even though it is a POST.
			replayable: true,
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

// The certificate is a rendered PDF. Its bytes come back base64-encoded; if
// GageList answers JSON instead, that JSON is kept as a string.
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
			binary: true,
		}),
		{
			// unknown: the raw value is the GagelistDocument the client built.
			shape: (raw: unknown) => {
				const doc = raw as GagelistDocument;
				if (doc.base64 !== undefined) {
					return {
						certificate: doc.base64,
						encoding: 'base64',
						contentType: doc.contentType,
						byteLength: doc.byteLength,
					};
				}
				return {
					certificate:
						typeof doc.json === 'string' ? doc.json : JSON.stringify(doc.json),
					encoding: 'text',
					contentType: doc.contentType,
				};
			},
			log: (_, result) => ({
				bytes: result.byteLength ?? result.certificate.length,
			}),
		},
	);
