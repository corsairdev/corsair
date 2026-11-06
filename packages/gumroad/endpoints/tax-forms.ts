import { logEventFromContext } from 'corsair/core';
import type { GumroadEndpoints } from '..';
import { downloadGumroadFile } from '../client';
import { call } from './call';
import {
	GumroadEndpointInputSchemas,
	GumroadEndpointOutputSchemas,
} from './types';

export const list: GumroadEndpoints['taxFormsList'] = (ctx, input) =>
	call(ctx, 'taxFormsList', 'taxForms.list', '/tax_forms', input, {
		toQuery: (parsed) => ({ year: parsed.year }),
	});

// The docs define this response as "the raw PDF on success (Content-Type:
// application/pdf, Content-Disposition: attachment); a JSON error envelope on
// failure", so it takes the raw-fetch download path instead of the JSON
// client.
export const download: GumroadEndpoints['taxFormsDownload'] = async (
	ctx,
	input,
) => {
	const parsed = GumroadEndpointInputSchemas.taxFormsDownload.parse(
		input ?? {},
	);
	const path = `/tax_forms/${encodeURIComponent(parsed.year)}/${encodeURIComponent(parsed.tax_form_type)}/download`;
	const file = await downloadGumroadFile(path, ctx.key);
	const result = GumroadEndpointOutputSchemas.taxFormsDownload.parse(file);
	await logEventFromContext(
		ctx,
		'gumroad.taxForms.download',
		{ path },
		'completed',
	);
	return result;
};
