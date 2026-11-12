import type { CraftmypdfEndpoints } from '..';
import { call } from './call';
import {
	CraftmypdfEndpointInputSchemas as Inputs,
	CraftmypdfEndpointOutputSchemas as Outputs,
} from './types';

/**
 * The session URL carries a signed token that lets its bearer edit the
 * template, so creating a session is a write: a read-only caller must not be
 * able to mint one.
 */
export const createSession: CraftmypdfEndpoints['editorCreateSession'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'editor.createSession',
			input: Inputs.editorCreateSession,
			output: Outputs.editorCreateSession,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/create-editor-session',
			body: parsed,
		}),
		{
			log: (parsed, result) => ({
				templateId: parsed.template_id,
				tokenUuid: result.token_uuid ?? undefined,
			}),
		},
	);

export const deactivateSession: CraftmypdfEndpoints['editorDeactivateSession'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'editor.deactivateSession',
				input: Inputs.editorDeactivateSession,
				output: Outputs.editorDeactivateSession,
			},
			input,
			(parsed) => ({
				method: 'POST',
				path: '/deactivate-editor-session',
				body: parsed,
			}),
			{ log: (parsed) => ({ tokenUuid: parsed.token_uuid }) },
		);
