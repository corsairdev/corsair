import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const activateLiveStream: CloudinaryEndpoint = createCloudinaryEndpoint(op('activateLiveStream'));

export const createLiveStream: CloudinaryEndpoint = createCloudinaryEndpoint(op('createLiveStream'));

export const createLiveStreamOutput: CloudinaryEndpoint = createCloudinaryEndpoint(op('createLiveStreamOutput'));

export const deleteLiveStream: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteLiveStream'));

export const deleteLiveStreamOutput: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteLiveStreamOutput'));

export const getLiveStream: CloudinaryEndpoint = createCloudinaryEndpoint(op('getLiveStream'));

export const getLiveStreamOutput: CloudinaryEndpoint = createCloudinaryEndpoint(op('getLiveStreamOutput'));

export const getLiveStreamOutputs: CloudinaryEndpoint = createCloudinaryEndpoint(op('getLiveStreamOutputs'));

export const getLiveStreams: CloudinaryEndpoint = createCloudinaryEndpoint(op('getLiveStreams'));

export const idleLiveStream: CloudinaryEndpoint = createCloudinaryEndpoint(op('idleLiveStream'));

export const updateLiveStream: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateLiveStream'));

export const updateLiveStreamOutput: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateLiveStreamOutput'));
