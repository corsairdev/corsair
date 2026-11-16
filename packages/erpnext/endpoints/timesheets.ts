import { defineEndpoint } from './factory';

// The `timesheets` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `timesheets` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const list = defineEndpoint('timesheets.list');
export const create = defineEndpoint('timesheets.create');

export const endpoints = { list, create } as const;
