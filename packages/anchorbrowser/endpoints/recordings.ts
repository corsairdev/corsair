import type { AnchorBrowserEndpoint } from './factory';
import { executeAnchorBrowserOperation, getRoute } from './factory';

const listSessionRecordingsRoute = getRoute('listSessionRecordings');
export const listSessionRecordings: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, listSessionRecordingsRoute);
};

const pauseSessionRecordingRoute = getRoute('pauseSessionRecording');
export const pauseSessionRecording: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, pauseSessionRecordingRoute);
};

const resumeSessionRecordingRoute = getRoute('resumeSessionRecording');
export const resumeSessionRecording: AnchorBrowserEndpoint = async (
	ctx,
	input = {},
) => {
	return executeAnchorBrowserOperation(ctx, input, resumeSessionRecordingRoute);
};

export const RecordingsEndpoints = {
	listSessionRecordings,
	pauseSessionRecording,
	resumeSessionRecording,
} as const;
