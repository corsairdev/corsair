import { imageCompleted } from './image-completed';
import { videoCompleted } from './video-completed';

export const ImageWebhooks = {
	imageCompleted,
};

export const VideoWebhooks = {
	videoCompleted,
};

export * from './tenant-matcher';
export * from './types';
