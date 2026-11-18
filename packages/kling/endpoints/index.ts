import {
	imageGenerationCreate,
	imageGenerationGet,
	imageGenerationList,
} from './image-generation';
import {
	imageToVideoCreate,
	imageToVideoGet,
	imageToVideoList,
} from './image-to-video';
import {
	lipSyncCreate,
	lipSyncDetectFace,
	lipSyncGet,
	lipSyncList,
} from './lip-sync';
import {
	motionControlCreate,
	motionControlGet,
	motionControlList,
} from './motion-control';
import {
	multiImageToImageCreate,
	multiImageToImageGet,
	multiImageToImageList,
} from './multi-image-to-image';
import { omniImageCreate, omniImageGet, omniImageList } from './omni-image';
import { omniVideoCreate, omniVideoGet, omniVideoList } from './omni-video';
import {
	outpaintingCreate,
	outpaintingGet,
	outpaintingList,
} from './outpainting';
import {
	textToVideoCreate,
	textToVideoGet,
	textToVideoList,
} from './text-to-video';
import {
	videoEffectsCreate,
	videoEffectsGet,
	videoEffectsList,
} from './video-effects';
import {
	virtualTryOnCreate,
	virtualTryOnGet,
	virtualTryOnList,
} from './virtual-try-on';

export const TextToVideo = {
	create: textToVideoCreate,
	get: textToVideoGet,
	list: textToVideoList,
};

export const ImageToVideo = {
	create: imageToVideoCreate,
	get: imageToVideoGet,
	list: imageToVideoList,
};

export const OmniVideo = {
	create: omniVideoCreate,
	get: omniVideoGet,
	list: omniVideoList,
};

export const MotionControl = {
	create: motionControlCreate,
	get: motionControlGet,
	list: motionControlList,
};

export const ImageGeneration = {
	create: imageGenerationCreate,
	get: imageGenerationGet,
	list: imageGenerationList,
};

export const MultiImageToImage = {
	create: multiImageToImageCreate,
	get: multiImageToImageGet,
	list: multiImageToImageList,
};

export const OmniImage = {
	create: omniImageCreate,
	get: omniImageGet,
	list: omniImageList,
};

export const Outpainting = {
	create: outpaintingCreate,
	get: outpaintingGet,
	list: outpaintingList,
};

export const LipSync = {
	detectFace: lipSyncDetectFace,
	create: lipSyncCreate,
	get: lipSyncGet,
	list: lipSyncList,
};

export const VideoEffects = {
	create: videoEffectsCreate,
	get: videoEffectsGet,
	list: videoEffectsList,
};

export const VirtualTryOn = {
	create: virtualTryOnCreate,
	get: virtualTryOnGet,
	list: virtualTryOnList,
};

export * from './types';
