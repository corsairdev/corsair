import type { CommCareEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

// The OTA restore answers a full OpenRosa XML payload (Content-Type XML, so
// core hands back the text). The docs authenticate it with the worker's
// Basic credentials; CommCare's API key scheme may or may not be accepted.
export const restore: CommCareEndpoints['otaRestore'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'ota.restore',
			input: Inputs.otaRestore,
			output: Outputs.otaRestore,
		},
		input,
		(domain) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/phone/restore/`,
			replaySafe: true,
		}),
		{
			// unknown: the body is an OpenRosa XML payload until narrowed.
			shape: (raw) => ({
				raw: typeof raw === 'string' ? raw : String(raw ?? ''),
			}),
			log: (_, result) => ({ bytes: result.raw.length }),
		},
	);

// The OpenRosa receiver answers 201 for both submit_success and
// submit_error; the response XML's `message` says which, so the endpoint
// surfaces it instead of the caller parsing XML.
export const submit: CommCareEndpoints['submissionsSubmit'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'submissions.submit',
			input: Inputs.submissionsSubmit,
			output: Outputs.submissionsSubmit,
		},
		input,
		(domain, { appId, xml }) => ({
			method: 'POST',
			path: `/a/${segment(domain)}/receiver/${segment(appId)}/`,
			formData: { xml_submission_file: xml },
		}),
		{
			// unknown: the body is an OpenRosa XML payload until narrowed.
			shape: (raw) => {
				const text = typeof raw === 'string' ? raw : String(raw ?? '');
				const message = /<message[^>]*>([\s\S]*?)<\/message>/.exec(text)?.[1];
				return { raw: text, message: message ?? undefined };
			},
			log: (parsed) => ({ appId: parsed.appId, bytes: parsed.xml.length }),
		},
	);
