import { makeDeeplineRequest, segment } from '../client';
import { defineEndpoint } from './common';
import {
	NotificationIdInputSchema,
	NotificationsChannelsInputSchema,
	NotificationsChannelsOutputSchema,
	NotificationsConfigurationChangeInputSchema,
	NotificationsConfigurationChangeOutputSchema,
	NotificationsConfigurationGetInputSchema,
	NotificationsConfigurationGetOutputSchema,
	NotificationsCreateInputSchema,
	NotificationsDeleteOutputSchema,
	NotificationsDlqGetInputSchema,
	NotificationsDlqGetOutputSchema,
	NotificationsDlqListInputSchema,
	NotificationsDlqListOutputSchema,
	NotificationsDlqUpdateInputSchema,
	NotificationsDlqUpdateOutputSchema,
	NotificationsListInputSchema,
	NotificationsListOutputSchema,
	NotificationsTestOutputSchema,
	NotificationsUpdateInputSchema,
	NotificationsWriteOutputSchema,
} from './types-monitors';

const NOTIFICATIONS = '/api/v2/notifications';
const DLQ = '/api/v2/settings/notifications/dlq';

export const list = defineEndpoint({
	event: 'deepline.notifications.list',
	input: NotificationsListInputSchema,
	output: NotificationsListOutputSchema,
	run: (ctx) => makeDeeplineRequest(NOTIFICATIONS, ctx.key, { method: 'GET' }),
});

const configurationGet = defineEndpoint({
	event: 'deepline.notifications.configuration.get',
	input: NotificationsConfigurationGetInputSchema,
	output: NotificationsConfigurationGetOutputSchema,
	run: (ctx) =>
		makeDeeplineRequest(`${NOTIFICATIONS}/configuration`, ctx.key, {
			method: 'GET',
		}),
});
const configurationChange = defineEndpoint({
	event: 'deepline.notifications.configuration.change',
	input: NotificationsConfigurationChangeInputSchema,
	output: NotificationsConfigurationChangeOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${NOTIFICATIONS}/configuration`, ctx.key, {
			method: 'PUT',
			body: {
				expectedWorkspaceVersion: input.expectedWorkspaceVersion,
				change: input.change,
			},
		}),
});
export const configuration = {
	get: configurationGet,
	change: configurationChange,
};

export const create = defineEndpoint({
	event: 'deepline.notifications.create',
	input: NotificationsCreateInputSchema,
	output: NotificationsWriteOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(NOTIFICATIONS, ctx.key, {
			method: 'POST',
			body: input,
		}),
});

export const update = defineEndpoint({
	event: 'deepline.notifications.update',
	input: NotificationsUpdateInputSchema,
	output: NotificationsWriteOutputSchema,
	run: (ctx, { notificationId, ...body }) =>
		makeDeeplineRequest(
			`${NOTIFICATIONS}/${segment(notificationId)}`,
			ctx.key,
			{
				method: 'PATCH',
				body,
			},
		),
});

const removeNotification = defineEndpoint({
	event: 'deepline.notifications.delete',
	input: NotificationIdInputSchema,
	output: NotificationsDeleteOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`${NOTIFICATIONS}/${segment(input.notificationId)}`,
			ctx.key,
			{ method: 'DELETE' },
		),
});
export { removeNotification as delete };

export const test = defineEndpoint({
	event: 'deepline.notifications.test',
	input: NotificationIdInputSchema,
	output: NotificationsTestOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(
			`${NOTIFICATIONS}/${segment(input.notificationId)}/test`,
			ctx.key,
			{ method: 'POST', body: {} },
		),
});

export const channels = defineEndpoint({
	event: 'deepline.notifications.channels',
	input: NotificationsChannelsInputSchema,
	output: NotificationsChannelsOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${NOTIFICATIONS}/slack/channels`, ctx.key, {
			method: 'GET',
			query: { search: input.search },
		}),
});

const dlqList = defineEndpoint({
	event: 'deepline.notifications.dlq.list',
	input: NotificationsDlqListInputSchema,
	output: NotificationsDlqListOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(DLQ, ctx.key, {
			method: 'GET',
			query: { limit: input.limit },
		}),
});
const dlqGet = defineEndpoint({
	event: 'deepline.notifications.dlq.get',
	input: NotificationsDlqGetInputSchema,
	output: NotificationsDlqGetOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${DLQ}/${segment(input.deliveryId)}`, ctx.key, {
			method: 'GET',
		}),
});
const dlqUpdate = defineEndpoint({
	event: 'deepline.notifications.dlq.update',
	input: NotificationsDlqUpdateInputSchema,
	output: NotificationsDlqUpdateOutputSchema,
	run: (ctx, input) =>
		makeDeeplineRequest(`${DLQ}/${segment(input.deliveryId)}`, ctx.key, {
			method: 'POST',
			body: { action: input.action },
		}),
});
export const dlq = { list: dlqList, get: dlqGet, update: dlqUpdate };
