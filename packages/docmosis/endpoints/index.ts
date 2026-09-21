import {
	deleteImage,
	deleteTemplate,
	environmentReady,
	environmentSummary,
	getBatchUploadStatus,
	getImage,
	getRenderQueue,
	getRenderTags,
	getSampleData,
	getTemplate,
	getTemplateDetails,
	getTemplateStructure,
	listImages,
	listTemplates,
	ping,
	pingService,
	render,
} from './operations';

export const Admin = {
	environmentReady,
	environmentSummary,
	ping,
	pingService,
	getRenderQueue,
	getRenderTags,
	getBatchUploadStatus,
};

export const Images = {
	deleteImage,
	listImages,
	getImage,
};

export const Templates = {
	deleteTemplate,
	listTemplates,
	getTemplate,
	getTemplateDetails,
	getTemplateStructure,
	getSampleData,
	render,
};

export * from './operations';
export * from './types';
