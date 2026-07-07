import type { CloudinaryEndpoint } from './factory';
import { createCloudinaryEndpoint } from './factory';
import { cloudinaryOperations } from '../operations';

function op(name: string) {
	const operation = cloudinaryOperations.find((candidate) => candidate.key === name);
	if (!operation) throw new Error(`[cloudinary] missing operation: ${name}`);
	return operation;
}

export const createStreamingProfile: CloudinaryEndpoint = createCloudinaryEndpoint(op('createStreamingProfile'));

export const deleteStreamingProfile: CloudinaryEndpoint = createCloudinaryEndpoint(op('deleteStreamingProfile'));

export const getStreamingProfileDetails: CloudinaryEndpoint = createCloudinaryEndpoint(op('getStreamingProfileDetails'));

export const updateStreamingProfile: CloudinaryEndpoint = createCloudinaryEndpoint(op('updateStreamingProfile'));
