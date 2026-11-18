import type { CodereadrEndpoints } from '..';
import type { CodereadrParams } from '../client';
import { call, flag, idList } from './call';
import { shapeScans } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
	SCANS_DEFAULT_LIMIT,
} from './types';

export const list: CodereadrEndpoints['scansList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scans.list',
			input: Inputs.scansList,
			output: Outputs.scansList,
		},
		input,
		(parsed) => {
			const params: CodereadrParams = {
				section: 'scans',
				action: 'retrieve',
				keyword: parsed.keyword,
				service_id: idList(parsed.service_id),
				device_id: idList(parsed.device_id),
				user_id: idList(parsed.user_id),
				scan_id: idList(parsed.scan_id),
				status: parsed.status?.join(','),
				start_date: parsed.start_date,
				start_time: parsed.start_time,
				end_date: parsed.end_date,
				end_time: parsed.end_time,
				upload_id: idList(parsed.upload_id),
				// The API only applies `offset` when `limit` is sent with it. A caller
				// following `next_offset` from a default page sends no limit, so the
				// documented default goes out explicitly; without it every "next" page
				// would be the first page again.
				limit:
					parsed.limit ??
					(parsed.offset !== undefined ? SCANS_DEFAULT_LIMIT : undefined),
				offset: parsed.offset,
				showProperties: flag(parsed.show_properties),
				includeProperty: parsed.include_property?.join(','),
				excludeProperty: parsed.exclude_property?.join(','),
				value: parsed.value,
				valuelike: parsed.valuelike,
				response: parsed.response,
				responselike: parsed.responselike,
				timestamp_received: flag(parsed.timestamp_received),
				timestamp_modified: flag(parsed.timestamp_modified),
				modified_diff: parsed.modified_diff,
				timezone: parsed.timezone,
				order_by: parsed.order_by,
				only_recent: flag(parsed.only_recent),
			};
			// `with_property[mode]=auto`: one form field per entry.
			for (const [key, value] of Object.entries(parsed.with_property ?? {})) {
				params[`with_property[${key}]`] = value;
			}
			for (const [key, value] of Object.entries(
				parsed.without_property ?? {},
			)) {
				params[`without_property[${key}]`] = value;
			}
			return params;
		},
		{
			shape: (root, parsed) => {
				const shaped = shapeScans(root);
				// Omitting `limit` does not mean unlimited: the API caps the page at
				// its documented default of 10,000, so a full default page can still
				// have more behind it.
				const pageSize = parsed.limit ?? SCANS_DEFAULT_LIMIT;
				const offset = parsed.offset ?? 0;
				// The rows returned decide, not `<count>`: the docs do not say
				// whether count is this page or every match, and a total would keep
				// offering a next page after the last one.
				return {
					...shaped,
					next_offset:
						shaped.scans.length >= pageSize ? offset + pageSize : undefined,
				};
			},
			log: (_, result) => ({ count: result.scans.length }),
			replaySafe: true,
		},
	);

export const remove: CodereadrEndpoints['scansDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scans.delete',
			input: Inputs.scansDelete,
			output: Outputs.scansDelete,
		},
		input,
		(parsed) => ({
			section: 'scans',
			action: 'delete',
			scan_id: parsed.scan_id.join(','),
		}),
		{
			shape: (_, parsed) => ({
				success: true,
				scan_ids: parsed.scan_id,
			}),
			log: (_, result) => ({ count: result.scan_ids.length }),
		},
	);
