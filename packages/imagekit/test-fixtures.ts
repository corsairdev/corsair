// Response bodies copied from the examples in the ImageKit API reference and
// its published OpenAPI spec (imagekit-developer/sdk-generation), with made-up
// asset names. They were not captured from the live API.

export const file = {
	fileId: '598821f949c0a938d57563bd',
	type: 'file',
	name: 'product-photo.jpg',
	filePath: '/products/product-photo.jpg',
	url: 'https://ik.imagekit.io/your_imagekit_id/products/product-photo.jpg',
	thumbnail:
		'https://ik.imagekit.io/your_imagekit_id/products/product-photo.jpg?tr=h-200',
	fileType: 'image',
	size: 66490,
	width: 1200,
	height: 800,
	tags: ['summer', 'sale'],
	AITags: [{ name: 'product', source: 'grayscale', confidence: 99 }],
	versionInfo: { id: '598821f949c0a938d57563bd', name: 'Version 1' },
	isPrivateFile: false,
	isPublished: true,
	customCoordinates: null,
	customMetadata: { campaign: 'summer-drop' },
	embeddedMetadata: { Exif: {} },
	extensionStatus: {},
	createdAt: '2025-04-15T13:14:34.468Z',
	updatedAt: '2025-04-16T09:20:11.102Z',
};

export const folder = {
	type: 'folder',
	folderId: '648921f949c0a938d57563ce',
	name: 'spring',
	folderPath: '/products/spring/',
	customMetadata: {},
	createdAt: '2025-03-01T10:00:00.000Z',
	updatedAt: '2025-03-01T10:00:00.000Z',
};

export const upload = {
	fileId: '598821f949c0a938d57563bd',
	name: 'product-photo.jpg',
	filePath: '/products/product-photo.jpg',
	url: 'https://ik.imagekit.io/your_imagekit_id/products/product-photo.jpg',
	thumbnailUrl:
		'https://ik.imagekit.io/your_imagekit_id/products/product-photo.jpg?tr=h-200',
	fileType: 'image',
	size: 66490,
	width: 1200,
	height: 800,
	tags: ['summer'],
	AITags: null,
	versionInfo: { id: '598821f949c0a938d57563bd', name: 'Version 1' },
	isPrivateFile: false,
	isPublished: true,
	customCoordinates: null,
	customMetadata: { campaign: 'summer-drop' },
};

export const metadata = {
	height: 800,
	width: 1200,
	size: 66490,
	format: 'jpeg',
	hasColorProfile: true,
	quality: 80,
	density: 72,
	hasTransparency: false,
	pHash: 'f3f6e240d4a92241',
	exif: { image: { Make: 'Canon' } },
};

export const bulkUpdated = {
	successfullyUpdatedFileIds: ['598821f949c0a938d57563bd'],
};

export const bulkPartiallyUpdated = {
	successfullyUpdatedFileIds: ['598821f949c0a938d57563bd'],
	errors: [{ fileId: '598821f949c0a938d57563be', error: 'No file found.' }],
};

export const bulkDeleted = {
	successfullyDeletedFileIds: [
		'598821f949c0a938d57563bd',
		'598821f949c0a938d57563be',
	],
};

export const bulkJob = { jobId: '5d5b1a9b4c8c4c0001f3e4a2' };

export const bulkJobCompleted = {
	jobId: '5d5b1a9b4c8c4c0001f3e4a2',
	type: 'COPY_FOLDER',
	status: 'Completed',
};

export const purgeAccepted = { requestId: '5d5b1a9b4c8c4c0001f3e4a3' };

export const purgeCompleted = { status: 'Completed' };

export const renamedWithPurge = { purgeRequestId: '5d5b1a9b4c8c4c0001f3e4a3' };

export const renamedPurgeFailed = {
	reason: 'PURGE_FAILED',
	message: 'File renamed successfully, but the cache purge failed.',
	purgeRequestId: '5d5b1a9b4c8c4c0001f3e4a3',
};

export const fileNotFound = {
	message: 'The requested file does not exist.',
	help: 'For support kindly contact us at support@imagekit.io.',
};

export const sourceFileMissing = {
	reason: 'SOURCE_FILE_MISSING',
	message: 'No file found at the requested path.',
};

export const rateLimited = {
	message: 'Too many requests. Please wait before retrying.',
};

export const serverError = { message: 'Something went wrong.' };
