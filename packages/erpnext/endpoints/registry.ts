import type { z } from 'zod';
import { DeskInputSchemas, DeskOutputSchemas } from './desk-types';
import { DoctypesInputSchemas, DoctypesOutputSchemas } from './doctypes-types';
import {
	DocumentsInputSchemas,
	DocumentsOutputSchemas,
} from './documents-types';
import { ErpInputSchemas, ErpOutputSchemas } from './erp-types';
import { FilesInputSchemas, FilesOutputSchemas } from './files-types';
import { PeopleInputSchemas, PeopleOutputSchemas } from './people-types';
import { SystemInputSchemas, SystemOutputSchemas } from './system-types';
import {
	TimesheetsInputSchemas,
	TimesheetsOutputSchemas,
} from './timesheets-types';
import { WebhooksInputSchemas, WebhooksOutputSchemas } from './webhooks-types';
import { WorkflowInputSchemas, WorkflowOutputSchemas } from './workflow-types';

// Part 1 aggregate: each family owns its schemas in <family>-types.ts and
// this registry is the single source the public types, the schema registry,
// and the runtime wrapper read. Re-export the maps from here, never from a
// family file, so later parts extend without moving the public types.
export const ErpnextEndpointInputSchemas = {
	...DocumentsInputSchemas,
	...DoctypesInputSchemas,
	...SystemInputSchemas,
	...WorkflowInputSchemas,
	...DeskInputSchemas,
	...WebhooksInputSchemas,
	...PeopleInputSchemas,
	...TimesheetsInputSchemas,
	...ErpInputSchemas,
	...FilesInputSchemas,
} as const;

export const ErpnextEndpointOutputSchemas = {
	...DocumentsOutputSchemas,
	...DoctypesOutputSchemas,
	...SystemOutputSchemas,
	...WorkflowOutputSchemas,
	...DeskOutputSchemas,
	...WebhooksOutputSchemas,
	...PeopleOutputSchemas,
	...TimesheetsOutputSchemas,
	...ErpOutputSchemas,
	...FilesOutputSchemas,
} as const;

export type ErpnextEndpointInputs = {
	[K in keyof typeof ErpnextEndpointInputSchemas]: z.infer<
		(typeof ErpnextEndpointInputSchemas)[K]
	>;
};

export type ErpnextEndpointOutputs = {
	[K in keyof typeof ErpnextEndpointOutputSchemas]: z.infer<
		(typeof ErpnextEndpointOutputSchemas)[K]
	>;
};
