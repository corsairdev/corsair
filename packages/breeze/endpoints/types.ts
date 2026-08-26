import { z } from 'zod';

const ProjectSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable().optional(),
    budget_amount: z.string().optional(),
    budget_hours: z.number().nullable().optional(),
    hourly_rate: z.number().optional(),
    currency_symbol: z.string().optional(),
    total_planned: z.number().optional(),
    total_tracked: z.number().optional(),
    star: z.boolean().optional(),
    workspace_id: z.number().nullable().optional(),
    created_at: z.string().optional(),
});

const GetProjectsResponseSchema = z.array(ProjectSchema);

export type Project = z.infer<typeof ProjectSchema>;
export type GetProjectsResponse = z.infer<typeof GetProjectsResponseSchema>;

export type BreezeEndpointInputs = {
    getProjects: Record<string, never>;
};

export type BreezeEndpointOutputs = {
    getProjects: GetProjectsResponse;
};

export const BreezeEndpointInputSchemas = {
    getProjects: z.object({}),
} as const;

export const BreezeEndpointOutputSchemas = {
    getProjects: GetProjectsResponseSchema,
} as const;