import type { CustomjsEndpoints } from '..';
import { call } from './call';
import {
	CustomjsEndpointInputSchemas as Inputs,
	CustomjsEndpointOutputSchemas as Outputs,
} from './types';

/**
 * A missing `url` is also not an error here: the live API answers 200 with a
 * blank PNG. The input schema requires the field.
 *
 * Not replayable: `commands` can click and type, which submits forms and changes
 * the visited site, so a 5xx may arrive after that write landed.
 */
export const capture: CustomjsEndpoints['screenshotCapture'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'screenshot.capture',
			input: Inputs.screenshotCapture,
			output: Outputs.screenshotCapture,
			reader: 'binary',
			replayable: false,
		},
		input,
		({ url, commands, box }) => ({
			method: 'POST',
			path: '/screenshot',
			body: {
				input: {
					url,
					...(commands === undefined ? {} : { commands }),
					...(box === undefined ? {} : { box }),
				},
			},
		}),
		{
			log: (parsed, result) => ({
				host: new URL(parsed.url).host,
				commands: parsed.commands?.length ?? 0,
				cropped: parsed.box !== undefined,
				byteLength: result.byteLength,
			}),
		},
	);
