import type { KlingEndpoints } from '..';
import { createTask, getTaskById, listTasksByCursor } from './tasks';
import { MotionControlCreateInputSchema } from './types';

// Motion control (transfer a motion reference video onto a subject). One
// endpoint per model:
// POST /motion-control/kling-2.6
// POST /motion-control/kling-3.0
// https://kling.ai/document-api/api/video/2-6/motion-control
// https://kling.ai/document-api/api/video/3-0-omni/motion-control
// Querying is shared via `/tasks`.

export const motionControlCreate: KlingEndpoints['motionControl']['create'] =
	async (ctx, input) => {
		const parsed = MotionControlCreateInputSchema.parse(input);

		const { model, ...body } = parsed;

		return createTask(
			ctx,
			'kling.motionControl.create',
			`/motion-control/${model}`,
			body,
			{ model },
		);
	};

export const motionControlGet: KlingEndpoints['motionControl']['get'] = (
	ctx,
	input,
) => getTaskById(ctx, 'kling.motionControl.get', '/tasks', input);

export const motionControlList: KlingEndpoints['motionControl']['list'] = (
	ctx,
	input,
) => listTasksByCursor(ctx, 'kling.motionControl.list', '/tasks', input);
