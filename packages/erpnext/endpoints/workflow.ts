import { defineEndpoint } from './factory';

// The `workflow` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `workflow` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const apply = defineEndpoint('workflow.apply');
export const getTransitions = defineEndpoint('workflow.getTransitions');

export const endpoints = {
	apply,
	getTransitions,
} as const;
