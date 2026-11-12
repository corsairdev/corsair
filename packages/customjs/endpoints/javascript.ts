import type { CustomjsEndpoints } from '..';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Inline execution. The code is sent every time; a saved script would be called
 * by ID instead, which this plugin does not wrap because the route could not be
 * verified from the docs.
 *
 * The route answers `text/plain` whatever the script returns, so `output` is a
 * string. A script returning an object gets JSON text; one with no `return` gets
 * an empty string.
 *
 * The code is arbitrary, so it can send a POST, charge a card, or send an email,
 * and a 5xx can arrive after that write succeeded. Neither call is replayed.
 */
export const run: CustomjsEndpoints['javascriptRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'javascript.run',
			input: Inputs.javascriptRun,
			output: Outputs.javascriptRun,
			reader: 'text',
			replayable: false,
		},
		input,
		({ code, input: scriptInput }) => ({
			method: 'POST',
			path: '/__js1-',
			body: {
				code,
				...(scriptInput === undefined ? {} : { input: scriptInput }),
			},
		}),
		{
			shape: (raw) => ({ output: raw }),
			// The code itself is withheld: it can hold a credential, and a long
			// script is of no use in a log line.
			log: (parsed, result) => ({
				codeLength: parsed.code.length,
				outputLength: result.output.length,
			}),
		},
	);

/**
 * The same route with `returnBinary`, for code that returns a Buffer. CustomJS
 * answers with the bytes and the type it thinks they are.
 *
 * Not replayable, for the same reason as `javascript.run`: the code decides what
 * it does, so a retry can repeat a write it already made.
 */
export const runBinary: CustomjsEndpoints['javascriptRunBinary'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'javascript.runBinary',
			input: Inputs.javascriptRunBinary,
			output: Outputs.javascriptRunBinary,
			reader: 'binary',
			replayable: false,
		},
		input,
		({ code, input: scriptInput }) => ({
			method: 'POST',
			path: '/__js1-',
			body: {
				code,
				returnBinary: 'true',
				...(scriptInput === undefined ? {} : { input: scriptInput }),
			},
		}),
		{
			log: (parsed, result) => ({
				codeLength: parsed.code.length,
				contentType: result.contentType,
				byteLength: result.byteLength,
			}),
		},
	);
