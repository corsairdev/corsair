import { StitchProjectSchema, StitchScreenSchema, StitchDesignSystemSchema } from './database';

export const StitchSchema = {
  version: '1.0.0',
  entities: {
    projects: StitchProjectSchema,
    screens: StitchScreenSchema,
    designSystems: StitchDesignSystemSchema,
  },
} as const;

export * from './database';
