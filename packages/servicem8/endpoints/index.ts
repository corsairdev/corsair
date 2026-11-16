import type { CorsairEndpoint } from 'corsair/core';
import type { z } from 'zod';
import type { ServiceM8Context } from '..';
import { ServiceM8Error, serviceM8Request } from '../client';
import {
	CreateResultSchema,
	EndpointInputSchemas,
	EndpointOutputSchemas,
	JobCreateInput,
	JobPaymentCreateInput,
	ListInput,
	NoteCreateInput,
	ResultSchema,
	RetrieveInput,
} from './types';

function operation<I extends z.ZodType, O extends z.ZodType>(
	input: I,
	output: O,
	// HTTP responses are untrusted and differ per operation; the output schema
	// validates them before a narrower public result type is returned.
	request: (ctx: ServiceM8Context, args: z.output<I>) => Promise<unknown>,
): CorsairEndpoint<ServiceM8Context, z.input<I>, z.output<O>> {
	return async (ctx, raw) => {
		const args = input.parse(raw);
		const result = await request(ctx, args);
		const parsed = output.safeParse(result);
		if (!parsed.success)
			throw new ServiceM8Error('ServiceM8 returned an invalid response');
		return parsed.data;
	};
}

const auth = (ctx: ServiceM8Context) => ctx.options.authType ?? 'api_key';
function list<T extends z.ZodType>(path: string, output: T) {
	return {
		input: ListInput,
		output,
		handler: operation(ListInput, output, async (ctx, args) => {
			const response = await serviceM8Request(
				ctx.key,
				auth(ctx),
				'GET',
				`/api_1.0/${path}.json`,
				args,
			);
			return { data: response.body, nextCursor: response.nextCursor };
		}),
	};
}
function retrieve<T extends z.ZodType>(path: string, output: T) {
	return {
		input: RetrieveInput,
		output,
		handler: operation(
			RetrieveInput,
			output,
			async (ctx, args) =>
				(
					await serviceM8Request(
						ctx.key,
						auth(ctx),
						'GET',
						`/api_1.0/${path}/${encodeURIComponent(args.uuid)}.json`,
					)
				).body,
		),
	};
}
function create<T extends z.ZodType>(path: string, input: T) {
	return {
		input,
		output: CreateResultSchema,
		handler: operation(input, CreateResultSchema, async (ctx, args) => {
			const response = await serviceM8Request(
				ctx.key,
				auth(ctx),
				'POST',
				`/api_1.0/${path}.json`,
				{},
				args,
			);
			return { result: response.body, recordUuid: response.recordUuid };
		}),
	};
}
function update<T extends z.ZodObject>(path: string, input: T) {
	return {
		input,
		output: ResultSchema,
		handler: operation(
			input,
			ResultSchema,
			async (ctx, args) =>
				(
					await serviceM8Request(
						ctx.key,
						auth(ctx),
						'POST',
						`/api_1.0/${path}/${encodeURIComponent((args as { uuid: string }).uuid)}.json`,
						{},
						// Generic Zod object inference cannot retain the body's concrete
						// resource type here; it was validated by the input schema.
						(args as { body: unknown }).body,
					)
				).body,
		),
	};
}
function remove(path: string) {
	return {
		input: RetrieveInput,
		output: ResultSchema,
		handler: operation(
			RetrieveInput,
			ResultSchema,
			async (ctx, args) =>
				(
					await serviceM8Request(
						ctx.key,
						auth(ctx),
						'DELETE',
						`/api_1.0/${path}/${encodeURIComponent(args.uuid)}.json`,
					)
				).body,
		),
	};
}

const deleteCustomInput = EndpointInputSchemas['customFields.delete'];
const deleteCustom = {
	input: deleteCustomInput,
	output: ResultSchema,
	handler: operation(deleteCustomInput, ResultSchema, async (ctx, args) => {
		if (auth(ctx) !== 'oauth_2')
			throw new ServiceM8Error('Custom fields require OAuth authentication');
		return (
			await serviceM8Request(
				ctx.key,
				'oauth_2',
				'DELETE',
				'/custom_fields_1.0',
				{},
				args,
				true,
			)
		).body;
	}),
};

export const operations = {
	jobs: {
		list: list('job', EndpointOutputSchemas['jobs.list']),
		retrieve: retrieve('job', EndpointOutputSchemas['jobs.retrieve']),
		create: create('job', JobCreateInput),
	},
	clients: {
		list: list('company', EndpointOutputSchemas['clients.list']),
		retrieve: retrieve('company', EndpointOutputSchemas['clients.retrieve']),
	},
	assets: { list: list('asset', EndpointOutputSchemas['assets.list']) },
	documentTemplates: {
		list: list(
			'documenttemplate',
			EndpointOutputSchemas['documentTemplates.list'],
		),
	},
	forms: {
		list: list('form', EndpointOutputSchemas['forms.list']),
		retrieve: retrieve('form', EndpointOutputSchemas['forms.retrieve']),
	},
	notes: {
		list: list('note', EndpointOutputSchemas['notes.list']),
		retrieve: retrieve('dbonote', EndpointOutputSchemas['notes.retrieve']),
		create: create('note', NoteCreateInput),
		update: update('dbonote', EndpointInputSchemas['notes.update']),
		delete: remove('dbonote'),
	},
	queues: {
		list: list('queue', EndpointOutputSchemas['queues.list']),
		retrieve: retrieve('queue', EndpointOutputSchemas['queues.retrieve']),
	},
	locations: {
		list: list('location', EndpointOutputSchemas['locations.list']),
		retrieve: retrieve('location', EndpointOutputSchemas['locations.retrieve']),
	},
	materials: {
		list: list('material', EndpointOutputSchemas['materials.list']),
		retrieve: retrieve('material', EndpointOutputSchemas['materials.retrieve']),
	},
	tasks: { list: list('task', EndpointOutputSchemas['tasks.list']) },
	jobActivities: {
		retrieve: retrieve(
			'jobactivity',
			EndpointOutputSchemas['jobActivities.retrieve'],
		),
	},
	jobPayments: {
		retrieve: retrieve(
			'jobpayment',
			EndpointOutputSchemas['jobPayments.retrieve'],
		),
		create: create('jobpayment', JobPaymentCreateInput),
		update: update('jobpayment', EndpointInputSchemas['jobPayments.update']),
		delete: remove('jobpayment'),
	},
	staff: {
		retrieve: retrieve('staff', EndpointOutputSchemas['staff.retrieve']),
	},
	customFields: { delete: deleteCustom },
} as const;

export const endpoints = {
	jobs: {
		list: operations.jobs.list.handler,
		retrieve: operations.jobs.retrieve.handler,
		create: operations.jobs.create.handler,
	},
	clients: {
		list: operations.clients.list.handler,
		retrieve: operations.clients.retrieve.handler,
	},
	assets: { list: operations.assets.list.handler },
	documentTemplates: { list: operations.documentTemplates.list.handler },
	forms: {
		list: operations.forms.list.handler,
		retrieve: operations.forms.retrieve.handler,
	},
	notes: {
		list: operations.notes.list.handler,
		retrieve: operations.notes.retrieve.handler,
		create: operations.notes.create.handler,
		update: operations.notes.update.handler,
		delete: operations.notes.delete.handler,
	},
	queues: {
		list: operations.queues.list.handler,
		retrieve: operations.queues.retrieve.handler,
	},
	locations: {
		list: operations.locations.list.handler,
		retrieve: operations.locations.retrieve.handler,
	},
	materials: {
		list: operations.materials.list.handler,
		retrieve: operations.materials.retrieve.handler,
	},
	tasks: { list: operations.tasks.list.handler },
	jobActivities: { retrieve: operations.jobActivities.retrieve.handler },
	jobPayments: {
		retrieve: operations.jobPayments.retrieve.handler,
		create: operations.jobPayments.create.handler,
		update: operations.jobPayments.update.handler,
		delete: operations.jobPayments.delete.handler,
	},
	staff: { retrieve: operations.staff.retrieve.handler },
	customFields: { delete: operations.customFields.delete.handler },
} as const;
