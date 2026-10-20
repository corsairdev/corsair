import type { OrbitContext } from '../index';
import { callOrbit } from './call';
import type { OrbitEndpointInputs } from './types';
import {
	DetectFacesInput,
	FaceDetection,
	FaceIndexInput,
	FaceIndexSearch,
} from './types';

export const Faces = {
	detect: (ctx: OrbitContext, input: OrbitEndpointInputs['detectFaces']) =>
		callOrbit(
			ctx,
			'faces.detect',
			DetectFacesInput,
			FaceDetection,
			input,
			(validated) => {
				const bytes = Buffer.from(validated.imageBase64, 'base64');
				const type = validated.contentType ?? 'image/jpeg';
				return {
					method: 'POST',
					url: '/v3/faces/detect',
					formData: {
						image: new Blob([bytes], { type }),
					},
				};
			},
			() => ({ upload: 'image' }),
		),
	index: (ctx: OrbitContext, input: OrbitEndpointInputs['searchFaceIndex']) =>
		callOrbit(
			ctx,
			'faces.index',
			FaceIndexInput,
			FaceIndexSearch,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/faces/index-search',
				body: validated,
			}),
			(validated) => ({ imageUrl: validated.image_url }),
		),
};
