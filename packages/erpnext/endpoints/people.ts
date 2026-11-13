import { defineEndpoint } from './factory';

// The `people` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `people` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const listEmployees = defineEndpoint('people.listEmployees');
export const listProjects = defineEndpoint('people.listProjects');

export const endpoints = { listEmployees, listProjects } as const;
