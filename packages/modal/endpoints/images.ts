import { z } from 'zod';
import { lookupApp } from './apps';
import { DEFAULT_SANDBOX_APP } from './sandboxes';
import {
	appNameField,
	defineOperation,
	environmentField,
	ImageSpecSchema,
	OkSchema,
	resolveImage,
} from './shared';

const ImageRefSchema = z.object({ imageId: z.string() });
const imageIdField = z.string().min(1).describe('Image id (im-...).');

export const buildImage = defineOperation({
	group: 'images',
	name: 'build',
	description:
		'Build an image (registry base plus optional Dockerfile commands) on Modal and return its id. The build runs on Modal compute; later sandboxes reuse the cached image.',
	riskLevel: 'destructive',
	input: z.object({
		environment: environmentField,
		appName: appNameField
			.default(DEFAULT_SANDBOX_APP)
			.describe(
				`App to build in; created if missing (default "${DEFAULT_SANDBOX_APP}").`,
			),
		image: ImageSpecSchema,
	}),
	output: ImageRefSchema,
	run: async (runtime, input) => {
		const app = await lookupApp(runtime, input.appName, true);
		const image = await resolveImage(runtime, input.image);
		const built = await image.build(app);
		return { imageId: built.imageId };
	},
});

export const getImage = defineOperation({
	group: 'images',
	name: 'get',
	description: 'Check that an image id exists and return it.',
	riskLevel: 'read',
	input: z.object({ imageId: imageIdField }),
	output: ImageRefSchema,
	run: async (runtime, input) => {
		const image = await runtime.client.images.fromId(input.imageId);
		return { imageId: image.imageId };
	},
});

export const getImageByName = defineOperation({
	group: 'images',
	name: 'getByName',
	description: 'Look up an image published with images.publish by its name.',
	riskLevel: 'read',
	input: z.object({ environment: environmentField, name: z.string().min(1) }),
	output: ImageRefSchema,
	run: async (runtime, input) => {
		const image = await runtime.client.images.fromName(input.name);
		return { imageId: image.imageId };
	},
});

export const publishImage = defineOperation({
	group: 'images',
	name: 'publish',
	description:
		'Give a built image a name in the environment, so images.getByName and sandboxes.create (publishedName) can use it.',
	riskLevel: 'write',
	input: z.object({
		environment: environmentField,
		imageId: imageIdField,
		name: z.string().min(1),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const image = await runtime.client.images.fromId(input.imageId);
		await image.publish(input.name);
		return { ok: true as const };
	},
});

export const deleteImage = defineOperation({
	group: 'images',
	name: 'delete',
	description:
		'Delete an image. Sandboxes and functions using it keep running, but it cannot be used again.',
	riskLevel: 'destructive',
	irreversible: true,
	input: z.object({ imageId: imageIdField }),
	output: OkSchema,
	run: async (runtime, input) => {
		await runtime.client.images.delete(input.imageId);
		return { ok: true as const };
	},
});

export const imagesOperations = [
	buildImage,
	getImage,
	getImageByName,
	publishImage,
	deleteImage,
] as const;
