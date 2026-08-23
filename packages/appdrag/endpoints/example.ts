import { z } from 'zod';

export const dragUploadEndpoint = {
	method: 'POST' as const,
	path: '/appdrag/upload',
	input: z.object({
		fileName: z.string(),
		fileSize: z.number(),
		fileType: z.string(),
		draggedAt: z.number().optional(),
	}),
	handler: async ({ input }: { input: any }) => {
		// This is called when user drags a file into Corsair
		console.log('File dragged:', input.fileName);

		return {
			success: true,
			message: `File ${input.fileName} received via drag`,
			received: input,
		};
	},
};
