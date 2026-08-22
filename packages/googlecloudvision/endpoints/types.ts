import { z } from 'zod';

// --- Shared Schemas ---
const EmptyResponseSchema = z.object({});
const OperationSchema = z.object({
	name: z.string(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	done: z.boolean().optional(),
	error: z.object({ code: z.number(), message: z.string() }).optional(),
	response: z.record(z.string(), z.unknown()).optional(),
});

// --- 1. Images & Files ---

const FeatureSchema = z.object({
	type: z.string(),
	maxResults: z.number().optional(),
	model: z.string().optional(),
});

const ImageSchema = z.object({
	content: z.string().optional(),
	source: z
		.object({
			gcsImageUri: z.string().optional(),
			imageUri: z.string().optional(),
		})
		.optional(),
});

const AnnotateImageRequestSchema = z.object({
	image: ImageSchema,
	features: z.array(FeatureSchema),
	imageContext: z.record(z.string(), z.unknown()).optional(),
});

export const ImagesAnnotateInputSchema = z.object({
	requests: z.array(AnnotateImageRequestSchema),
});
export const ImagesAnnotateOutputSchema = z.object({
	responses: z.array(z.record(z.string(), z.unknown())),
});

export const ImagesAsyncBatchAnnotateInputSchema = z.object({
	requests: z.array(AnnotateImageRequestSchema),
	outputConfig: z.object({
		gcsDestination: z.object({ uri: z.string() }),
		batchSize: z.number().optional(),
	}),
});
export const ImagesAsyncBatchAnnotateOutputSchema = OperationSchema;

export const ImagesLocationAnnotateInputSchema = z.object({
	parent: z.string(),
	requests: z.array(AnnotateImageRequestSchema),
});
export const ImagesLocationAnnotateOutputSchema = ImagesAnnotateOutputSchema;

const AnnotateFileRequestSchema = z.object({
	inputConfig: z.object({
		gcsSource: z.object({ uri: z.string() }).optional(),
		content: z.string().optional(),
		mimeType: z.string(),
	}),
	features: z.array(FeatureSchema),
	imageContext: z.record(z.string(), z.unknown()).optional(),
	pages: z.array(z.number()).optional(),
});

export const FilesAnnotateInputSchema = z.object({
	requests: z.array(AnnotateFileRequestSchema),
});
export const FilesAnnotateOutputSchema = z.object({
	responses: z.array(z.record(z.string(), z.unknown())),
});

export const FilesAsyncBatchAnnotateInputSchema = z.object({
	requests: z.array(
		z.object({
			inputConfig: AnnotateFileRequestSchema.shape.inputConfig,
			features: z.array(FeatureSchema),
			imageContext: z.record(z.string(), z.unknown()).optional(),
			outputConfig: z.object({
				gcsDestination: z.object({ uri: z.string() }),
				batchSize: z.number().optional(),
			}),
		}),
	),
});
export const FilesAsyncBatchAnnotateOutputSchema = OperationSchema;

// --- 2. Product Sets ---

export const ProductSetSchema = z.object({
	name: z.string().optional(),
	displayName: z.string(),
	indexTime: z.string().optional(),
	indexError: z.record(z.string(), z.unknown()).optional(),
});

export const ProductSetsCreateInputSchema = z.object({
	parent: z.string(),
	productSetId: z.string().optional(),
	productSet: ProductSetSchema,
});
export const ProductSetsCreateOutputSchema = ProductSetSchema;

export const ProductSetsGetInputSchema = z.object({
	name: z.string(),
});
export const ProductSetsGetOutputSchema = ProductSetSchema;

export const ProductSetsUpdateInputSchema = z.object({
	name: z.string(),
	productSet: ProductSetSchema,
	updateMask: z.string().optional(),
});
export const ProductSetsUpdateOutputSchema = ProductSetSchema;

export const ProductSetsDeleteInputSchema = z.object({
	name: z.string(),
});
export const ProductSetsDeleteOutputSchema = EmptyResponseSchema;

export const ProductSetsImportInputSchema = z.object({
	parent: z.string(),
	inputConfig: z.object({
		gcsSource: z.object({ csvFileUri: z.string() }),
	}),
});
export const ProductSetsImportOutputSchema = OperationSchema;

export const ProductSetsAddProductInputSchema = z.object({
	name: z.string(),
	product: z.string(),
});
export const ProductSetsAddProductOutputSchema = EmptyResponseSchema;

export const ProductSetsRemoveProductInputSchema = z.object({
	name: z.string(),
	product: z.string(),
});
export const ProductSetsRemoveProductOutputSchema = EmptyResponseSchema;

export const ProductSetsListProductsInputSchema = z.object({
	name: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export const ProductSetsListProductsOutputSchema = z.object({
	products: z.array(z.record(z.string(), z.unknown())).optional(),
	nextPageToken: z.string().optional(),
});

// --- 3. Products ---

export const ProductSchema = z.object({
	name: z.string().optional(),
	displayName: z.string(),
	description: z.string().optional(),
	productCategory: z.string(),
	productLabels: z
		.array(z.object({ key: z.string(), value: z.string() }))
		.optional(),
});

export const ProductsCreateInputSchema = z.object({
	parent: z.string(),
	productId: z.string().optional(),
	product: ProductSchema,
});
export const ProductsCreateOutputSchema = ProductSchema;

export const ProductsGetInputSchema = z.object({
	name: z.string(),
});
export const ProductsGetOutputSchema = ProductSchema;

export const ProductsUpdateInputSchema = z.object({
	name: z.string(),
	product: ProductSchema,
	updateMask: z.string().optional(),
});
export const ProductsUpdateOutputSchema = ProductSchema;

export const ProductsDeleteInputSchema = z.object({
	name: z.string(),
});
export const ProductsDeleteOutputSchema = EmptyResponseSchema;

export const ProductsPurgeInputSchema = z.object({
	parent: z.string(),
	productSetPurgeConfig: z.object({ productSetId: z.string() }).optional(),
	deleteOrphanProducts: z.boolean().optional(),
	force: z.boolean().optional(),
});
export const ProductsPurgeOutputSchema = OperationSchema;

// --- 4. Reference Images ---

export const ReferenceImageSchema = z.object({
	name: z.string().optional(),
	uri: z.string(),
	boundingPolys: z.array(z.record(z.string(), z.unknown())).optional(),
});

export const ReferenceImagesCreateInputSchema = z.object({
	parent: z.string(),
	referenceImageId: z.string().optional(),
	referenceImage: ReferenceImageSchema,
});
export const ReferenceImagesCreateOutputSchema = ReferenceImageSchema;

export const ReferenceImagesGetInputSchema = z.object({
	name: z.string(),
});
export const ReferenceImagesGetOutputSchema = ReferenceImageSchema;

export const ReferenceImagesDeleteInputSchema = z.object({
	name: z.string(),
});
export const ReferenceImagesDeleteOutputSchema = EmptyResponseSchema;

export const ReferenceImagesListInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export const ReferenceImagesListOutputSchema = z.object({
	referenceImages: z.array(ReferenceImageSchema).optional(),
	nextPageToken: z.string().optional(),
	pageSize: z.number().optional(),
});

// --- 5. Operations ---

export const OperationsGetInputSchema = z.object({
	name: z.string(),
});
export const OperationsGetOutputSchema = OperationSchema;

export const OperationsListInputSchema = z.object({
	name: z.string(), // The parent like "projects/x/locations/y"
	filter: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export const OperationsListOutputSchema = z.object({
	operations: z.array(OperationSchema).optional(),
	nextPageToken: z.string().optional(),
});

export const OperationsCancelInputSchema = z.object({
	name: z.string(),
});
export const OperationsCancelOutputSchema = EmptyResponseSchema;

export const OperationsDeleteInputSchema = z.object({
	name: z.string(),
});
export const OperationsDeleteOutputSchema = EmptyResponseSchema;

// --- 6. Discovery ---

export const LocationsListInputSchema = z.object({
	name: z.string(),
	filter: z.string().optional(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
});
export const LocationsListOutputSchema = z.object({
	locations: z
		.array(
			z.object({
				name: z.string(),
				locationId: z.string(),
				displayName: z.string().optional(),
				labels: z.record(z.string(), z.string()).optional(),
			}),
		)
		.optional(),
	nextPageToken: z.string().optional(),
});

export const ProjectsListInputSchema = z.object({
	parent: z.string().optional(),
	pageToken: z.string().optional(),
	pageSize: z.number().optional(),
	showDeleted: z.boolean().optional(),
});
export const ProjectsListOutputSchema = z.object({
	projects: z
		.array(
			z.object({
				name: z.string(),
				projectId: z.string(),
				state: z.string().optional(),
				displayName: z.string().optional(),
			}),
		)
		.optional(),
	nextPageToken: z.string().optional(),
});

export const IndexEndpointsListInputSchema = z.object({
	parent: z.string(),
	pageSize: z.number().optional(),
	pageToken: z.string().optional(),
	filter: z.string().optional(),
});
export const IndexEndpointsListOutputSchema = z.object({
	indexEndpoints: z.array(z.record(z.string(), z.unknown())).optional(),
	nextPageToken: z.string().optional(),
});

// --- Exports ---
export type GoogleCloudVisionEndpointInputs = {
	imagesAnnotate: z.infer<typeof ImagesAnnotateInputSchema>;
	imagesAsyncBatchAnnotate: z.infer<typeof ImagesAsyncBatchAnnotateInputSchema>;
	imagesLocationAnnotate: z.infer<typeof ImagesLocationAnnotateInputSchema>;
	filesAnnotate: z.infer<typeof FilesAnnotateInputSchema>;
	filesAsyncBatchAnnotate: z.infer<typeof FilesAsyncBatchAnnotateInputSchema>;
	productSetsCreate: z.infer<typeof ProductSetsCreateInputSchema>;
	productSetsGet: z.infer<typeof ProductSetsGetInputSchema>;
	productSetsUpdate: z.infer<typeof ProductSetsUpdateInputSchema>;
	productSetsDelete: z.infer<typeof ProductSetsDeleteInputSchema>;
	productSetsImport: z.infer<typeof ProductSetsImportInputSchema>;
	productSetsAddProduct: z.infer<typeof ProductSetsAddProductInputSchema>;
	productSetsRemoveProduct: z.infer<typeof ProductSetsRemoveProductInputSchema>;
	productSetsListProducts: z.infer<typeof ProductSetsListProductsInputSchema>;
	productsCreate: z.infer<typeof ProductsCreateInputSchema>;
	productsGet: z.infer<typeof ProductsGetInputSchema>;
	productsUpdate: z.infer<typeof ProductsUpdateInputSchema>;
	productsDelete: z.infer<typeof ProductsDeleteInputSchema>;
	productsPurge: z.infer<typeof ProductsPurgeInputSchema>;
	referenceImagesCreate: z.infer<typeof ReferenceImagesCreateInputSchema>;
	referenceImagesGet: z.infer<typeof ReferenceImagesGetInputSchema>;
	referenceImagesDelete: z.infer<typeof ReferenceImagesDeleteInputSchema>;
	referenceImagesList: z.infer<typeof ReferenceImagesListInputSchema>;
	operationsGet: z.infer<typeof OperationsGetInputSchema>;
	operationsList: z.infer<typeof OperationsListInputSchema>;
	operationsCancel: z.infer<typeof OperationsCancelInputSchema>;
	operationsDelete: z.infer<typeof OperationsDeleteInputSchema>;
	locationsList: z.infer<typeof LocationsListInputSchema>;
	projectsList: z.infer<typeof ProjectsListInputSchema>;
	indexEndpointsList: z.infer<typeof IndexEndpointsListInputSchema>;
};

export type GoogleCloudVisionEndpointOutputs = {
	imagesAnnotate: z.infer<typeof ImagesAnnotateOutputSchema>;
	imagesAsyncBatchAnnotate: z.infer<
		typeof ImagesAsyncBatchAnnotateOutputSchema
	>;
	imagesLocationAnnotate: z.infer<typeof ImagesLocationAnnotateOutputSchema>;
	filesAnnotate: z.infer<typeof FilesAnnotateOutputSchema>;
	filesAsyncBatchAnnotate: z.infer<typeof FilesAsyncBatchAnnotateOutputSchema>;
	productSetsCreate: z.infer<typeof ProductSetsCreateOutputSchema>;
	productSetsGet: z.infer<typeof ProductSetsGetOutputSchema>;
	productSetsUpdate: z.infer<typeof ProductSetsUpdateOutputSchema>;
	productSetsDelete: z.infer<typeof ProductSetsDeleteOutputSchema>;
	productSetsImport: z.infer<typeof ProductSetsImportOutputSchema>;
	productSetsAddProduct: z.infer<typeof ProductSetsAddProductOutputSchema>;
	productSetsRemoveProduct: z.infer<
		typeof ProductSetsRemoveProductOutputSchema
	>;
	productSetsListProducts: z.infer<typeof ProductSetsListProductsOutputSchema>;
	productsCreate: z.infer<typeof ProductsCreateOutputSchema>;
	productsGet: z.infer<typeof ProductsGetOutputSchema>;
	productsUpdate: z.infer<typeof ProductsUpdateOutputSchema>;
	productsDelete: z.infer<typeof ProductsDeleteOutputSchema>;
	productsPurge: z.infer<typeof ProductsPurgeOutputSchema>;
	referenceImagesCreate: z.infer<typeof ReferenceImagesCreateOutputSchema>;
	referenceImagesGet: z.infer<typeof ReferenceImagesGetOutputSchema>;
	referenceImagesDelete: z.infer<typeof ReferenceImagesDeleteOutputSchema>;
	referenceImagesList: z.infer<typeof ReferenceImagesListOutputSchema>;
	operationsGet: z.infer<typeof OperationsGetOutputSchema>;
	operationsList: z.infer<typeof OperationsListOutputSchema>;
	operationsCancel: z.infer<typeof OperationsCancelOutputSchema>;
	operationsDelete: z.infer<typeof OperationsDeleteOutputSchema>;
	locationsList: z.infer<typeof LocationsListOutputSchema>;
	projectsList: z.infer<typeof ProjectsListOutputSchema>;
	indexEndpointsList: z.infer<typeof IndexEndpointsListOutputSchema>;
};

export const GoogleCloudVisionEndpointInputSchemas = {
	imagesAnnotate: ImagesAnnotateInputSchema,
	imagesAsyncBatchAnnotate: ImagesAsyncBatchAnnotateInputSchema,
	imagesLocationAnnotate: ImagesLocationAnnotateInputSchema,
	filesAnnotate: FilesAnnotateInputSchema,
	filesAsyncBatchAnnotate: FilesAsyncBatchAnnotateInputSchema,
	productSetsCreate: ProductSetsCreateInputSchema,
	productSetsGet: ProductSetsGetInputSchema,
	productSetsUpdate: ProductSetsUpdateInputSchema,
	productSetsDelete: ProductSetsDeleteInputSchema,
	productSetsImport: ProductSetsImportInputSchema,
	productSetsAddProduct: ProductSetsAddProductInputSchema,
	productSetsRemoveProduct: ProductSetsRemoveProductInputSchema,
	productSetsListProducts: ProductSetsListProductsInputSchema,
	productsCreate: ProductsCreateInputSchema,
	productsGet: ProductsGetInputSchema,
	productsUpdate: ProductsUpdateInputSchema,
	productsDelete: ProductsDeleteInputSchema,
	productsPurge: ProductsPurgeInputSchema,
	referenceImagesCreate: ReferenceImagesCreateInputSchema,
	referenceImagesGet: ReferenceImagesGetInputSchema,
	referenceImagesDelete: ReferenceImagesDeleteInputSchema,
	referenceImagesList: ReferenceImagesListInputSchema,
	operationsGet: OperationsGetInputSchema,
	operationsList: OperationsListInputSchema,
	operationsCancel: OperationsCancelInputSchema,
	operationsDelete: OperationsDeleteInputSchema,
	locationsList: LocationsListInputSchema,
	projectsList: ProjectsListInputSchema,
	indexEndpointsList: IndexEndpointsListInputSchema,
} as const;

export const GoogleCloudVisionEndpointOutputSchemas = {
	imagesAnnotate: ImagesAnnotateOutputSchema,
	imagesAsyncBatchAnnotate: ImagesAsyncBatchAnnotateOutputSchema,
	imagesLocationAnnotate: ImagesLocationAnnotateOutputSchema,
	filesAnnotate: FilesAnnotateOutputSchema,
	filesAsyncBatchAnnotate: FilesAsyncBatchAnnotateOutputSchema,
	productSetsCreate: ProductSetsCreateOutputSchema,
	productSetsGet: ProductSetsGetOutputSchema,
	productSetsUpdate: ProductSetsUpdateOutputSchema,
	productSetsDelete: ProductSetsDeleteOutputSchema,
	productSetsImport: ProductSetsImportOutputSchema,
	productSetsAddProduct: ProductSetsAddProductOutputSchema,
	productSetsRemoveProduct: ProductSetsRemoveProductOutputSchema,
	productSetsListProducts: ProductSetsListProductsOutputSchema,
	productsCreate: ProductsCreateOutputSchema,
	productsGet: ProductsGetOutputSchema,
	productsUpdate: ProductsUpdateOutputSchema,
	productsDelete: ProductsDeleteOutputSchema,
	productsPurge: ProductsPurgeOutputSchema,
	referenceImagesCreate: ReferenceImagesCreateOutputSchema,
	referenceImagesGet: ReferenceImagesGetOutputSchema,
	referenceImagesDelete: ReferenceImagesDeleteOutputSchema,
	referenceImagesList: ReferenceImagesListOutputSchema,
	operationsGet: OperationsGetOutputSchema,
	operationsList: OperationsListOutputSchema,
	operationsCancel: OperationsCancelOutputSchema,
	operationsDelete: OperationsDeleteOutputSchema,
	locationsList: LocationsListOutputSchema,
	projectsList: ProjectsListOutputSchema,
	indexEndpointsList: IndexEndpointsListOutputSchema,
} as const;
