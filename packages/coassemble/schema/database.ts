import type { z } from 'zod';
import {
	ClientSchema,
	CourseSchema,
	TrackingSchema,
	UserSchema,
} from '../endpoints/types';

export const CoassembleClient = ClientSchema;
export type CoassembleClient = z.infer<typeof CoassembleClient>;

export const CoassembleUser = UserSchema;
export type CoassembleUser = z.infer<typeof CoassembleUser>;

export const CoassembleCourse = CourseSchema;
export type CoassembleCourse = z.infer<typeof CoassembleCourse>;

export const CoassembleTracking = TrackingSchema;
export type CoassembleTracking = z.infer<typeof CoassembleTracking>;
