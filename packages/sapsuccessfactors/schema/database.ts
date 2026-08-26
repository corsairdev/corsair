import { z } from 'zod';

export const SapsuccessfactorsUser = z.object({
	userId: z.string(),
	username: z.string().optional(),
	status: z.string().optional(),
	email: z.string().optional(),
});

export const SapsuccessfactorsCalibrationSession = z.object({
	sessionId: z.string(),
	sessionName: z.string().optional(),
	status: z.string().optional(),
});

export type SapsuccessfactorsUser = z.infer<typeof SapsuccessfactorsUser>;
export type SapsuccessfactorsCalibrationSession = z.infer<
	typeof SapsuccessfactorsCalibrationSession
>;
