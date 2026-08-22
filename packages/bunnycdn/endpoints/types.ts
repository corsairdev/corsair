import { z } from 'zod';

const PullZoneListInputSchema = z.object({
    page: z.number().optional(),
    perPage: z.number().optional(),
});

const PullZoneGetInputSchema = z.object({
    id: z.number(),
});

export type PullZoneListInput = z.infer<typeof PullZoneListInputSchema>;
export type PullZoneGetInput = z.infer<typeof PullZoneGetInputSchema>;

const PullZoneSchema = z.object({
    Id: z.number(),
    Name: z.string(),
    OriginUrl: z.string().optional(),
    Enabled: z.boolean().optional(),
    Hostnames: z.array(z.object({
        Id: z.number().optional(),
        Value: z.string().optional(),
    })).optional(),
});

export type PullZone = z.infer<typeof PullZoneSchema>;

export type BunnycdnEndpointInputs = {
    pullZoneList: PullZoneListInput;
    pullZoneGet: PullZoneGetInput;
};

export type BunnycdnEndpointOutputs = {
    pullZoneList: PullZone[];
    pullZoneGet: PullZone;
};

export const BunnycdnEndpointInputSchemas = {
    pullZoneList: PullZoneListInputSchema,
    pullZoneGet: PullZoneGetInputSchema,
} as const;

export const BunnycdnEndpointOutputSchemas = {
    pullZoneList: z.array(PullZoneSchema),
    pullZoneGet: PullZoneGetInputSchema,
} as const;