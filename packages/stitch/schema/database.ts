/**
 * This file defines the database schemas for Stitch entities using Zod.
 * It ensures that data persisted to or retrieved from the database follows the expected structure.
 *
 * Note on Type Safety:
 * Some fields use `z.unknown()` (previously `z.any()`) for complex, highly dynamic objects like design tokens
 * where the structure is not strictly defined by the API or can vary significantly between projects.
 */

import { z } from 'zod';

export const StitchProjectSchema = z.object({
  id: z.string().describe('The project ID'),
  title: z.string().optional().describe('The title of the project'),
  createdAt: z.string().optional().describe('Creation timestamp'),
  updatedAt: z.string().optional().describe('Last update timestamp'),
});

export type StitchProject = z.infer<typeof StitchProjectSchema>;

export const StitchScreenSchema = z.object({
  id: z.string().describe('The screen ID'),
  projectId: z.string().describe('The parent project ID'),
  name: z.string().describe('Unique name of the screen'),
  deviceType: z.enum(['MOBILE', 'DESKTOP', 'TABLET', 'AGNOSTIC']).optional(),
  imageUrl: z.string().optional().describe('URL to the rendered screenshot'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type StitchScreen = z.infer<typeof StitchScreenSchema>;

export const StitchDesignSystemSchema = z.object({
  id: z.string().describe('Asset ID of the design system'),
  projectId: z.string().optional().describe('Associated project ID, if any'),
  config: z.record(z.unknown()).describe('The design tokens and configuration'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type StitchDesignSystem = z.infer<typeof StitchDesignSystemSchema>;
