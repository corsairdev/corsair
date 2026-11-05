import * as GenerationEndpoints from './generations';
import * as JobEndpoints from './jobs';
import * as ModelEndpoints from './models';
import * as UploadEndpoints from './uploads';

export const Generations = {
	textTo3d: GenerationEndpoints.textTo3d,
	photoTo3d: GenerationEndpoints.photoTo3d,
};

export const Uploads = { create: UploadEndpoints.create };
export const Jobs = { get: JobEndpoints.get, cancel: JobEndpoints.cancel };
export const Models = { download: ModelEndpoints.download };
