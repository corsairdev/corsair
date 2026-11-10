import { defineEndpoint } from './factory';

// The `webhooks` family: one declaration per catalog entry
// (../operations.ts). The dotted operation ids are the `webhooks` prefix
// plus these object keys, so renaming a key changes the public operation id.
export const list = defineEndpoint('webhooks.list');
export const create = defineEndpoint('webhooks.create');

export const endpoints = { list, create } as const;
