import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
	input: ['../../packages/corsair/core/cloud/management-v1.openapi.yaml'],
});
