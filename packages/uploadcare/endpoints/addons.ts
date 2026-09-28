import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type {
	AddonExecuteInput,
	AddonExecuteResponse,
	AddonStatusResponse,
} from './types';

async function executeAddon(
	ctx: Parameters<UploadcareEndpoints['executeClamavScan']>[0],
	addon: string,
	input: AddonExecuteInput,
	event: string,
): Promise<AddonExecuteResponse> {
	const response = await makeUploadcareRequest<AddonExecuteResponse>(
		`/addons/${addon}/execute/`,
		ctx.key,
		{
			method: 'POST',
			body: { target: input.target, params: input.params },
		},
	);
	await logEventFromContext(ctx, event, input, 'completed');
	return response;
}

async function addonStatus(
	ctx: Parameters<UploadcareEndpoints['getClamavScanStatus']>[0],
	addon: string,
	input: { request_id: string },
	event: string,
): Promise<AddonStatusResponse> {
	const response = await makeUploadcareRequest<AddonStatusResponse>(
		`/addons/${addon}/execute/status/`,
		ctx.key,
		{ method: 'GET', query: { request_id: input.request_id } },
	);
	await logEventFromContext(ctx, event, input, 'completed');
	return response;
}

export const executeClamav: UploadcareEndpoints['executeClamavScan'] = (
	ctx,
	input,
) =>
	executeAddon(ctx, 'uc_clamav_virus_scan', input, 'uploadcare.addons.clamav');

export const clamavStatus: UploadcareEndpoints['getClamavScanStatus'] = (
	ctx,
	input,
) =>
	addonStatus(
		ctx,
		'uc_clamav_virus_scan',
		input,
		'uploadcare.addons.clamavStatus',
	);

export const rekognitionStatus: UploadcareEndpoints['getAwsRekognitionExecutionStatus'] =
	(ctx, input) =>
		addonStatus(
			ctx,
			'aws_rekognition_detect_labels',
			input,
			'uploadcare.addons.rekognitionStatus',
		);

export const rekognitionModerationStatus: UploadcareEndpoints['checkAwsRekognitionModerationStatus'] =
	(ctx, input) =>
		addonStatus(
			ctx,
			'aws_rekognition_detect_moderation_labels',
			input,
			'uploadcare.addons.rekognitionModerationStatus',
		);

export const removeBgStatus: UploadcareEndpoints['checkRemoveBgStatus'] = (
	ctx,
	input,
) => addonStatus(ctx, 'remove_bg', input, 'uploadcare.addons.removeBgStatus');
