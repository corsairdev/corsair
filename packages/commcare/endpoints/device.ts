import type { CommCareEndpoints } from '..';
import { CommCareAPIError, segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

// The OTA restore answers a full OpenRosa XML payload (Content-Type XML, so
// core hands back the text). The docs show the worker's Basic credentials,
// but HQ accepts the ApiKey header too (checked live) and restores the
// account that owns the key.
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

// HQ answers 201 for both submit_success and submit_error (and older
// clients get processing_failure the same way); the `nature` attribute on
// the response's `message` says which. A form HQ received but did not
// process is an error for the caller, so those natures reject with HQ's
// message instead of resolving like a success.
const UNPROCESSED_NATURES = new Set(['submit_error', 'processing_failure']);

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
			// The receiver rejects xml_submission_file sent as a plain text
			// field, and rejects a file whose name has no `.xml` extension (a
			// bare Blob goes out named `blob`), so the XForm goes as a File.
			formData: {
				xml_submission_file: new File([xml], 'submission.xml', {
					type: 'text/xml',
				}),
			},
		}),
		{
			// unknown: the body is an OpenRosa XML payload until narrowed.
			shape: (raw) => {
				const text = typeof raw === 'string' ? raw : String(raw ?? '');
				const match = /<message([^>]*)>([\s\S]*?)<\/message>/.exec(text);
				const nature = /\bnature="([^"]*)"/.exec(match?.[1] ?? '')?.[1];
				const message = match?.[2];
				if (nature !== undefined && UNPROCESSED_NATURES.has(nature)) {
					throw new CommCareAPIError(
						`CommCare received the form but did not process it (${nature}): ${message?.trim() || 'no message'}`,
						{ status: 201, body: text },
					);
				}
				return { raw: text, message: message ?? undefined, nature };
			},
			log: (parsed) => ({ appId: parsed.appId, bytes: parsed.xml.length }),
		},
	);
