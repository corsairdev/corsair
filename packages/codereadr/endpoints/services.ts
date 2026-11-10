import type { CodereadrEndpoints } from '..';
import { call, flag, idList } from './call';
import { readCreatedId, shapeServices } from './shape';
import {
	CodereadrEndpointInputSchemas as Inputs,
	CodereadrEndpointOutputSchemas as Outputs,
} from './types';

export const list: CodereadrEndpoints['servicesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'services.list',
			input: Inputs.servicesList,
			output: Outputs.servicesList,
		},
		input,
		(parsed) => ({
			section: 'services',
			action: 'retrieve',
			service_id: idList(parsed.service_id),
		}),
		{
			shape: (root) => shapeServices(root),
			log: (_, result) => ({ count: result.services.length }),
			replaySafe: true,
		},
	);

type ScanBehaviourInput = {
	device_duplicate_value?: 0 | 1;
	period_start_date?: string;
	period_start_time?: string;
	period_end_date?: string;
	period_end_time?: string;
	upload_email?: string;
	upload_email_format?: 'regular' | 'properties';
	view_other_scans?: boolean;
	direct_history_url?: string;
	direct_lookup_url?: string;
	enable_direct_scan?: boolean;
	postback_receiver_only?: boolean;
	postback_real_time_scans?: boolean;
	postback_uploaded_scans?: boolean;
	regex_response_pattern?: string;
	regex_response_replacement?: string;
	regex_scan_pattern?: string;
	regex_scan_replacement?: string;
	symbologies?: number[];
	auto_next_scan?: 0 | 1 | 2 | 3;
	auto_next_scan_delay?: number;
	enable_gps?: boolean;
	block_camera_scan?: boolean;
	block_manual_scan?: boolean;
	block_db_search?: boolean;
	auto_sync?: boolean;
	auto_sync_up_url?: string;
	auto_sync_up_delay?: number;
	auto_sync_down_url?: boolean;
	auto_sync_down_delay?: number;
	decoder_config?: string;
};

/**
 * The scan-behaviour variables CodeREADr spells in snake case on the wire are
 * mostly the same name, but a few differ (`viewOtherScans`, `enableGPS`), so
 * each is mapped by hand rather than derived from the field name.
 */
function scanBehaviourParams(
	parsed: ScanBehaviourInput,
): Record<string, string | number | boolean | undefined> {
	return {
		device_duplicate_value: parsed.device_duplicate_value,
		period_start_date: parsed.period_start_date,
		period_start_time: parsed.period_start_time,
		period_end_date: parsed.period_end_date,
		period_end_time: parsed.period_end_time,
		upload_email: parsed.upload_email,
		upload_email_format: parsed.upload_email_format,
		viewOtherScans: flag(parsed.view_other_scans),
		direct_history_url: parsed.direct_history_url,
		direct_lookup_url: parsed.direct_lookup_url,
		enable_direct_scan: flag(parsed.enable_direct_scan),
		postback_receiver_only: flag(parsed.postback_receiver_only),
		postback_real_time_scans: flag(parsed.postback_real_time_scans),
		postback_uploaded_scans: flag(parsed.postback_uploaded_scans),
		regex_response_pattern: parsed.regex_response_pattern,
		regex_response_replacement: parsed.regex_response_replacement,
		regex_scan_pattern: parsed.regex_scan_pattern,
		regex_scan_replacement: parsed.regex_scan_replacement,
		symbologies: parsed.symbologies?.join(','),
		auto_next_scan: parsed.auto_next_scan,
		auto_next_scan_delay: parsed.auto_next_scan_delay,
		enableGPS: flag(parsed.enable_gps),
		block_camera_scan: flag(parsed.block_camera_scan),
		block_manual_scan: flag(parsed.block_manual_scan),
		block_db_search: flag(parsed.block_db_search),
		auto_sync: flag(parsed.auto_sync),
		auto_sync_up_url: parsed.auto_sync_up_url,
		auto_sync_up_delay: parsed.auto_sync_up_delay,
		auto_sync_down_url: flag(parsed.auto_sync_down_url),
		auto_sync_down_delay: parsed.auto_sync_down_delay,
		decoder_config: parsed.decoder_config,
	};
}

export const create: CodereadrEndpoints['servicesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'services.create',
			input: Inputs.servicesCreate,
			output: Outputs.servicesCreate,
		},
		input,
		(parsed) => ({
			section: 'services',
			action: 'create',
			validation_method: parsed.validation_method,
			database_id: parsed.database_id,
			postback_url: parsed.postback_url,
			description: parsed.description,
			service_name: parsed.service_name,
			duplicate_value: parsed.duplicate_value,
			...scanBehaviourParams(parsed),
		}),
		{
			shape: (root) => ({
				success: true,
				service_id: readCreatedId(root),
			}),
			log: (_, result) => ({ serviceId: result.service_id }),
		},
	);

export const update: CodereadrEndpoints['servicesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'services.update',
			input: Inputs.servicesUpdate,
			output: Outputs.servicesUpdate,
		},
		input,
		(parsed) => ({
			section: 'services',
			action: 'update',
			service_id: parsed.service_id,
			service_name: parsed.service_name,
			description: parsed.description,
			database_id: parsed.database_id,
			postback_url: parsed.postback_url,
			duplicate_value: parsed.duplicate_value,
			...scanBehaviourParams(parsed),
		}),
		{
			shape: (_, parsed) => ({
				success: true,
				service_id: parsed.service_id,
			}),
			log: ({ service_id }) => ({ serviceId: service_id }),
		},
	);

export const remove: CodereadrEndpoints['servicesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'services.delete',
			input: Inputs.servicesDelete,
			output: Outputs.servicesDelete,
		},
		input,
		(parsed) => ({
			section: 'services',
			action: 'delete',
			service_id: idList(parsed.service_id),
		}),
		{
			shape: () => ({ success: true }),
			log: ({ service_id }) => ({
				count: service_id === 'all' ? 'all' : service_id.length,
			}),
		},
	);
