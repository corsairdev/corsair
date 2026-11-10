import { defineEndpoint } from './factory';

// The `doctypes` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `doctypes` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const list = defineEndpoint('doctypes.list');
export const getMeta = defineEndpoint('doctypes.getMeta');

export const endpoints = { list, getMeta } as const;
