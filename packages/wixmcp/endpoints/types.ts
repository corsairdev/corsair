import { z } from 'zod';

const CallToolInputSchema = z.object({
  name: z.string(),
  arguments: z.record(z.string(), z.unknown()).optional(),
});

export type CallToolInput = z.infer<typeof CallToolInputSchema>;

const CallToolResponseSchema = z.unknown();

export type CallToolResponse = z.infer<typeof CallToolResponseSchema>;

export type WixMcpEndpointInputs = {
  callTool: CallToolInput;
};

export type WixMcpEndpointOutputs = {
  callTool: CallToolResponse;
};

export const WixMcpEndpointInputSchemas = {
  callTool: CallToolInputSchema,
} as const;

export const WixMcpEndpointOutputSchemas = {
  callTool: CallToolResponseSchema,
} as const;