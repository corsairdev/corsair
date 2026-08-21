import { cacheEntity } from '../endpoints/persist';
import type { SalesforceWebhooks } from '../index';
import {
	SalesforceAccountEntity,
	SalesforceContactEntity,
	SalesforceLeadEntity,
	SalesforceOpportunityEntity,
	SalesforceTaskEntity,
} from '../schema/database';
import {
	createSalesforceChangeMatch,
	recordIdFromPayload,
	verifySalesforceWebhookSignature,
} from './types';

function verified(
	ctx: { key: string },
	request: Parameters<
		SalesforceWebhooks['accountCreatedOrUpdated']['handler']
	>[1],
) {
	return verifySalesforceWebhookSignature(request, ctx.key);
}

export const accountCreatedOrUpdated: SalesforceWebhooks['accountCreatedOrUpdated'] =
	{
		match: createSalesforceChangeMatch({
			entityName: 'Account',
			changeTypes: ['CREATE', 'UPDATE', 'CREATED', 'UPDATED'],
		}),
		handler: async (ctx, request) => {
			const verification = verified(ctx, request);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const id = recordIdFromPayload(request.payload);
			if (id) {
				await cacheEntity(
					ctx.db?.account,
					SalesforceAccountEntity,
					{ Id: id, ...request.payload },
					{ label: 'account' },
				);
			}
			return { success: true, data: { success: true } };
		},
	};

export const contactUpdated: SalesforceWebhooks['contactUpdated'] = {
	match: createSalesforceChangeMatch({
		entityName: 'Contact',
		changeTypes: ['UPDATE', 'UPDATED'],
	}),
	handler: async (ctx, request) => {
		const verification = verified(ctx, request);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const id = recordIdFromPayload(request.payload);
		if (id) {
			await cacheEntity(
				ctx.db?.contact,
				SalesforceContactEntity,
				{ Id: id, ...request.payload },
				{ label: 'contact' },
			);
		}
		return { success: true, data: { success: true } };
	},
};

export const newContact: SalesforceWebhooks['newContact'] = {
	match: createSalesforceChangeMatch({
		entityName: 'Contact',
		changeTypes: ['CREATE', 'CREATED'],
	}),
	handler: async (ctx, request) => {
		const verification = verified(ctx, request);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const id = recordIdFromPayload(request.payload);
		if (id) {
			await cacheEntity(
				ctx.db?.contact,
				SalesforceContactEntity,
				{ Id: id, ...request.payload },
				{ label: 'contact' },
			);
		}
		return { success: true, data: { success: true } };
	},
};

export const newLead: SalesforceWebhooks['newLead'] = {
	match: createSalesforceChangeMatch({
		entityName: 'Lead',
		changeTypes: ['CREATE', 'CREATED'],
	}),
	handler: async (ctx, request) => {
		const verification = verified(ctx, request);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}
		const id = recordIdFromPayload(request.payload);
		if (id) {
			await cacheEntity(
				ctx.db?.lead,
				SalesforceLeadEntity,
				{ Id: id, ...request.payload },
				{ label: 'lead' },
			);
		}
		return { success: true, data: { success: true } };
	},
};

export const newOrUpdatedOpportunity: SalesforceWebhooks['newOrUpdatedOpportunity'] =
	{
		match: createSalesforceChangeMatch({
			entityName: 'Opportunity',
			changeTypes: ['CREATE', 'UPDATE', 'CREATED', 'UPDATED'],
		}),
		handler: async (ctx, request) => {
			const verification = verified(ctx, request);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const id = recordIdFromPayload(request.payload);
			if (id) {
				await cacheEntity(
					ctx.db?.opportunity,
					SalesforceOpportunityEntity,
					{ Id: id, ...request.payload },
					{ label: 'opportunity' },
				);
			}
			return { success: true, data: { success: true } };
		},
	};

export const genericSObjectRecordUpdated: SalesforceWebhooks['genericSObjectRecordUpdated'] =
	{
		match: createSalesforceChangeMatch({
			changeTypes: ['UPDATE', 'UPDATED'],
		}),
		handler: async (ctx, request) => {
			const verification = verified(ctx, request);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			return { success: true, data: { success: true } };
		},
	};

export const taskCreatedOrCompleted: SalesforceWebhooks['taskCreatedOrCompleted'] =
	{
		match: (request) => {
			const created = createSalesforceChangeMatch({
				entityName: 'Task',
				changeTypes: ['CREATE', 'CREATED'],
			})(request);
			const completed = createSalesforceChangeMatch({
				entityName: 'Task',
				changeTypes: ['UPDATE', 'UPDATED'],
				status: 'Completed',
			})(request);
			return created || completed;
		},
		handler: async (ctx, request) => {
			const verification = verified(ctx, request);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error || 'Signature verification failed',
				};
			}
			const id = recordIdFromPayload(request.payload);
			if (id) {
				await cacheEntity(
					ctx.db?.task,
					SalesforceTaskEntity,
					{ Id: id, ...request.payload },
					{ label: 'task' },
				);
			}
			return { success: true, data: { success: true } };
		},
	};
