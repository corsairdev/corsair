import { asRecord } from 'corsair/core';
import type { KlaviyoEndpoints } from '..';
import {
	additionalFieldsQuery,
	attributesOf,
	call,
	deleted,
	fieldsQuery,
	includeQuery,
	pageQuery,
	relationshipBody,
} from './call';
import {
	KlaviyoEndpointInputSchemas as Inputs,
	KlaviyoEndpointOutputSchemas as Outputs,
} from './types';

/** A Klaviyo path segment, percent-encoded. */
function segment(value: string): string {
	return encodeURIComponent(value);
}

const profilePath = (id: string) => `/api/profiles/${segment(id)}`;
const listPath = (id: string) => `/api/lists/${segment(id)}`;
const segmentPath = (id: string) => `/api/segments/${segment(id)}`;
const tagPath = (id: string) => `/api/tags/${segment(id)}`;

// ── profiles ────────────────────────────────────────────────────────────────

export const profilesList: KlaviyoEndpoints['profilesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.list',
			input: Inputs.profilesList,
			output: Outputs.profilesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/profiles',
			query: {
				filter: parsed.filter,
				sort: parsed.sort,
				'fields[profile]': fieldsQuery(parsed.fields),
				'additional-fields[profile]': additionalFieldsQuery(
					parsed.additionalFields,
				),
				include: includeQuery(parsed.include),
				...pageQuery(parsed),
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({
				count: result.data.length,
				nextCursor: result.nextCursor ?? undefined,
			}),
		},
	);

export const profilesGet: KlaviyoEndpoints['profilesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'profiles.get',
			input: Inputs.profilesGet,
			output: Outputs.profilesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: profilePath(parsed.id),
			query: { include: includeQuery(parsed.include) },
		}),
		{ log: (_, result) => ({ profileId: result.data.id }) },
	);

export const profilesCreate: KlaviyoEndpoints['profilesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'profiles.create',
			input: Inputs.profilesCreate,
			output: Outputs.profilesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/profiles',
			body: attributesOf('profile', {
				email: parsed.email,
				phone_number: parsed.phone_number,
				external_id: parsed.external_id,
				first_name: parsed.first_name,
				last_name: parsed.last_name,
				organization: parsed.organization,
				locale: parsed.locale,
				title: parsed.title,
				image: parsed.image,
				location: parsed.location,
				properties: parsed.properties,
			}),
		}),
		{ log: (_, result) => ({ profileId: result.data.id }) },
	);

export const profilesUpdate: KlaviyoEndpoints['profilesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'profiles.update',
			input: Inputs.profilesUpdate,
			output: Outputs.profilesUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: profilePath(parsed.id),
			body: attributesOf(
				'profile',
				{
					email: parsed.email,
					phone_number: parsed.phone_number,
					external_id: parsed.external_id,
					first_name: parsed.first_name,
					last_name: parsed.last_name,
					organization: parsed.organization,
					locale: parsed.locale,
					title: parsed.title,
					image: parsed.image,
					location: parsed.location,
					properties: parsed.properties,
				},
				{ id: parsed.id },
			),
		}),
		{ log: (parsed) => ({ profileId: parsed.id }) },
	);

/**
 * Subscription is a bulk job even for one profile. Klaviyo queues it and answers
 * 202 with no body, so there is no job id or profile to return.
 */
export const profilesSubscribe: KlaviyoEndpoints['profilesSubscribe'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'profiles.subscribe',
			input: Inputs.profilesSubscribe,
			output: Outputs.profilesSubscribe,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/profile-subscription-bulk-create-jobs',
			body: {
				data: {
					type: 'profile-subscription-bulk-create-job',
					attributes: {
						profiles: {
							data: [
								{
									type: 'profile',
									attributes: {
										...(parsed.email ? { email: parsed.email } : {}),
										...(parsed.phone_number
											? { phone_number: parsed.phone_number }
											: {}),
										subscriptions: {
											email: (parsed.channels ?? ['email']).includes('email')
												? { marketing: { consent: 'SUBSCRIBED' } }
												: undefined,
											sms: (parsed.channels ?? ['email']).includes('sms')
												? { marketing: { consent: 'SUBSCRIBED' } }
												: undefined,
										},
									},
								},
							],
						},
					},
					relationships: {
						list: { data: { type: 'list', id: parsed.listId } },
					},
				},
			},
		}),
		{
			// The route answers 202 with an empty body.
			shape: () => deleted,
			log: (parsed) => ({ listId: parsed.listId }),
		},
	);

// ── lists ───────────────────────────────────────────────────────────────────

export const listsList: KlaviyoEndpoints['listsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.list',
			input: Inputs.listsList,
			output: Outputs.listsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/lists',
			query: {
				filter: parsed.filter,
				sort: parsed.sort,
				'fields[list]': fieldsQuery(parsed.fields),
				...pageQuery(parsed),
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const listsGet: KlaviyoEndpoints['listsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.get',
			input: Inputs.listsGet,
			output: Outputs.listsGet,
		},
		input,
		(parsed) => ({ method: 'GET', path: listPath(parsed.id) }),
		{ log: (_, result) => ({ listId: result.data.id }) },
	);

export const listsCreate: KlaviyoEndpoints['listsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.create',
			input: Inputs.listsCreate,
			output: Outputs.listsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/lists',
			body: attributesOf('list', { name: parsed.name }),
		}),
		{ log: (_, result) => ({ listId: result.data.id }) },
	);

export const listsUpdate: KlaviyoEndpoints['listsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.update',
			input: Inputs.listsUpdate,
			output: Outputs.listsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: listPath(parsed.id),
			body: attributesOf('list', { name: parsed.name }, { id: parsed.id }),
		}),
		{ log: (parsed) => ({ listId: parsed.id }) },
	);

export const listsRemove: KlaviyoEndpoints['listsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.remove',
			input: Inputs.listsRemove,
			output: Outputs.listsRemove,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: listPath(parsed.id) }),
		{ shape: () => deleted, log: (parsed) => ({ listId: parsed.id }) },
	);

export const listsProfiles: KlaviyoEndpoints['listsProfiles'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.profiles',
			input: Inputs.listsProfiles,
			output: Outputs.listsProfiles,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${listPath(parsed.id)}/profiles`,
			query: { filter: parsed.filter, ...pageQuery(parsed) },
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (parsed, result) => ({
				listId: parsed.id,
				count: result.data.length,
			}),
		},
	);

export const listsAddProfiles: KlaviyoEndpoints['listsAddProfiles'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lists.addProfiles',
			input: Inputs.listsAddProfiles,
			output: Outputs.listsAddProfiles,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `${listPath(parsed.id)}/relationships/profiles`,
			body: relationshipBody('profile', parsed.profileIds),
		}),
		{
			shape: () => deleted,
			log: (parsed) => ({
				listId: parsed.id,
				profiles: parsed.profileIds.length,
			}),
		},
	);

export const listsRemoveProfiles: KlaviyoEndpoints['listsRemoveProfiles'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lists.removeProfiles',
			input: Inputs.listsRemoveProfiles,
			output: Outputs.listsRemoveProfiles,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `${listPath(parsed.id)}/relationships/profiles`,
			body: relationshipBody('profile', parsed.profileIds),
		}),
		{
			shape: () => deleted,
			log: (parsed) => ({
				listId: parsed.id,
				profiles: parsed.profileIds.length,
			}),
		},
	);

// ── segments ────────────────────────────────────────────────────────────────

export const segmentsList: KlaviyoEndpoints['segmentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.list',
			input: Inputs.segmentsList,
			output: Outputs.segmentsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/segments',
			query: {
				filter: parsed.filter,
				sort: parsed.sort,
				'fields[segment]': fieldsQuery(parsed.fields),
				...pageQuery(parsed),
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const segmentsGet: KlaviyoEndpoints['segmentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'segments.get',
			input: Inputs.segmentsGet,
			output: Outputs.segmentsGet,
		},
		input,
		(parsed) => ({ method: 'GET', path: segmentPath(parsed.id) }),
		{ log: (_, result) => ({ segmentId: result.data.id }) },
	);

export const segmentsCreate: KlaviyoEndpoints['segmentsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'segments.create',
			input: Inputs.segmentsCreate,
			output: Outputs.segmentsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/segments',
			body: attributesOf('segment', {
				name: parsed.name,
				definition: parsed.definition,
			}),
		}),
		{ log: (_, result) => ({ segmentId: result.data.id }) },
	);

export const segmentsUpdate: KlaviyoEndpoints['segmentsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'segments.update',
			input: Inputs.segmentsUpdate,
			output: Outputs.segmentsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: segmentPath(parsed.id),
			body: attributesOf(
				'segment',
				{ name: parsed.name, definition: parsed.definition },
				{ id: parsed.id },
			),
		}),
		{ log: (parsed) => ({ segmentId: parsed.id }) },
	);

export const segmentsRemove: KlaviyoEndpoints['segmentsRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'segments.remove',
			input: Inputs.segmentsRemove,
			output: Outputs.segmentsRemove,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: segmentPath(parsed.id) }),
		{ shape: () => deleted, log: (parsed) => ({ segmentId: parsed.id }) },
	);

export const segmentsProfiles: KlaviyoEndpoints['segmentsProfiles'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'segments.profiles',
			input: Inputs.segmentsProfiles,
			output: Outputs.segmentsProfiles,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `${segmentPath(parsed.id)}/profiles`,
			query: { filter: parsed.filter, ...pageQuery(parsed) },
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (parsed, result) => ({
				segmentId: parsed.id,
				count: result.data.length,
			}),
		},
	);

// ── events ──────────────────────────────────────────────────────────────────

export const eventsList: KlaviyoEndpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/events',
			query: {
				filter: parsed.filter,
				sort: parsed.sort,
				'fields[event]': fieldsQuery(parsed.fields),
				include: includeQuery(parsed.include),
				...pageQuery(parsed),
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const eventsGet: KlaviyoEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.get',
			input: Inputs.eventsGet,
			output: Outputs.eventsGet,
		},
		input,
		(parsed) => ({ method: 'GET', path: `/api/events/${segment(parsed.id)}` }),
		{ log: (_, result) => ({ eventId: result.data.id }) },
	);

export const eventsCreate: KlaviyoEndpoints['eventsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
		},
		input,
		(parsed) => {
			// The metric and profile are wrapped resource objects inside attributes.
			// A profile given by id puts it beside `type`, as the spec's
			// EventProfileCreateQueryResourceObject states; a profile given by email
			// puts the address in `attributes`.
			const profileAttributes: Record<string, unknown> = {};
			if (parsed.email !== undefined) profileAttributes.email = parsed.email;

			return {
				method: 'POST',
				path: '/api/events',
				body: {
					data: {
						type: 'event',
						attributes: {
							metric: {
								data: { type: 'metric', attributes: { name: parsed.metric } },
							},
							profile: {
								data: {
									type: 'profile',
									...(parsed.profileId !== undefined
										? { id: parsed.profileId }
										: {}),
									attributes: profileAttributes,
								},
							},
							properties: parsed.properties,
							...(parsed.time !== undefined ? { time: parsed.time } : {}),
							...(parsed.value !== undefined ? { value: parsed.value } : {}),
							...(parsed.valueCurrency !== undefined
								? { value_currency: parsed.valueCurrency }
								: {}),
							...(parsed.uniqueId !== undefined
								? { unique_id: parsed.uniqueId }
								: {}),
							...(parsed.backfill !== undefined
								? { backfill: parsed.backfill }
								: {}),
						},
					},
				},
			};
		},
		{
			// The route answers 202 with an empty body.
			shape: () => deleted,
			log: (parsed) => ({ metric: parsed.metric }),
		},
	);

// ── metrics ─────────────────────────────────────────────────────────────────

export const metricsList: KlaviyoEndpoints['metricsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.list',
			input: Inputs.metricsList,
			output: Outputs.metricsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/metrics',
			query: {
				filter: parsed.filter,
				'fields[metric]': fieldsQuery(parsed.fields),
				// No page[size]: the metrics route rejects it.
				'page[cursor]': parsed.cursor,
			},
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const metricsGet: KlaviyoEndpoints['metricsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'metrics.get',
			input: Inputs.metricsGet,
			output: Outputs.metricsGet,
		},
		input,
		(parsed) => ({ method: 'GET', path: `/api/metrics/${segment(parsed.id)}` }),
		{ log: (_, result) => ({ metricId: result.data.id }) },
	);

export const metricsAggregate: KlaviyoEndpoints['metricsAggregate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'metrics.aggregate',
			input: Inputs.metricsAggregate,
			output: Outputs.metricsAggregate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/metric-aggregates',
			body: {
				data: {
					type: 'metric-aggregate',
					attributes: {
						metric_id: parsed.metricId,
						measurements: parsed.measurements,
						interval: parsed.interval,
						// The report pages by its own cursor, which was being dropped.
						...(parsed.pageCursor !== undefined
							? { page_cursor: parsed.pageCursor }
							: {}),
						filter: parsed.filter,
						...(parsed.by !== undefined ? { by: parsed.by } : {}),
						...(parsed.timezone !== undefined
							? { timezone: parsed.timezone }
							: {}),
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				metricId: parsed.metricId,
				buckets: result.data?.attributes?.dates?.length,
			}),
		},
	);

// ── webhooks ────────────────────────────────────────────────────────────────

export const webhooksList: KlaviyoEndpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/webhooks',
			// No page[size]: the spec gives this route none.
			query: { 'page[cursor]': parsed.cursor },
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const webhooksGet: KlaviyoEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/api/webhooks/${segment(parsed.id)}`,
		}),
		{ log: (_, result) => ({ webhookId: result.data.id }) },
	);

export const webhooksCreate: KlaviyoEndpoints['webhooksCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/webhooks',
			body: {
				data: {
					type: 'webhook',
					attributes: {
						name: parsed.name,
						endpoint_url: parsed.endpointUrl,
						secret_key: parsed.secretKey,
						...(parsed.description !== undefined
							? { description: parsed.description }
							: {}),
					},
					// The topics are a relationship, required by the spec.
					relationships: {
						'webhook-topics': {
							data: parsed.topicIds.map((id) => ({
								type: 'webhook-topic',
								id,
							})),
						},
					},
				},
			},
		}),
		{
			log: (parsed, result) => ({
				webhookId: result.data.id,
				topics: parsed.topicIds.length,
			}),
		},
	);

export const webhooksUpdate: KlaviyoEndpoints['webhooksUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/api/webhooks/${segment(parsed.id)}`,
			body: attributesOf(
				'webhook',
				{
					name: parsed.name,
					description: parsed.description,
					endpoint_url: parsed.endpointUrl,
					enabled: parsed.enabled,
				},
				{ id: parsed.id },
			),
		}),
		{ log: (parsed) => ({ webhookId: parsed.id }) },
	);

export const webhooksRemove: KlaviyoEndpoints['webhooksRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.remove',
			input: Inputs.webhooksRemove,
			output: Outputs.webhooksRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/webhooks/${segment(parsed.id)}`,
		}),
		{ shape: () => deleted, log: (parsed) => ({ webhookId: parsed.id }) },
	);

export const webhookTopicsList: KlaviyoEndpoints['webhookTopicsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookTopics.list',
			input: Inputs.webhookTopicsList,
			output: Outputs.webhookTopicsList,
		},
		input,
		() => ({ method: 'GET', path: '/api/webhook-topics' }),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

// ── tags ────────────────────────────────────────────────────────────────────

export const tagsList: KlaviyoEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/tags',
			query: { filter: parsed.filter, ...pageQuery(parsed) },
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const tagsGet: KlaviyoEndpoints['tagsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.get',
			input: Inputs.tagsGet,
			output: Outputs.tagsGet,
		},
		input,
		(parsed) => ({ method: 'GET', path: tagPath(parsed.id) }),
		{ log: (_, result) => ({ tagId: result.data.id }) },
	);

export const tagsCreate: KlaviyoEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/tags',
			body: attributesOf('tag', { name: parsed.name }),
		}),
		{ log: (_, result) => ({ tagId: result.data.id }) },
	);

export const tagsUpdate: KlaviyoEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: tagPath(parsed.id),
			body: attributesOf('tag', { name: parsed.name }, { id: parsed.id }),
		}),
		// Unlike the other updates, this route answers 204 with no body.
		{ shape: () => deleted, log: (parsed) => ({ tagId: parsed.id }) },
	);

export const tagsRemove: KlaviyoEndpoints['tagsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.remove',
			input: Inputs.tagsRemove,
			output: Outputs.tagsRemove,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: tagPath(parsed.id) }),
		{ shape: () => deleted, log: (parsed) => ({ tagId: parsed.id }) },
	);

// ── tag groups ──────────────────────────────────────────────────────────────

export const tagGroupsList: KlaviyoEndpoints['tagGroupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tagGroups.list',
			input: Inputs.tagGroupsList,
			output: Outputs.tagGroupsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/api/tag-groups',
			query: pageQuery(parsed),
		}),
		{
			shape: (raw) => withCursor(raw),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const tagGroupsCreate: KlaviyoEndpoints['tagGroupsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tagGroups.create',
			input: Inputs.tagGroupsCreate,
			output: Outputs.tagGroupsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/api/tag-groups',
			body: attributesOf('tag-group', {
				name: parsed.name,
				exclusive: parsed.exclusive,
			}),
		}),
		{ log: (_, result) => ({ tagGroupId: result.data.id }) },
	);

export const tagGroupsRemove: KlaviyoEndpoints['tagGroupsRemove'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tagGroups.remove',
			input: Inputs.tagGroupsRemove,
			output: Outputs.tagGroupsRemove,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/api/tag-groups/${segment(parsed.id)}`,
		}),
		{ shape: () => deleted, log: (parsed) => ({ tagGroupId: parsed.id }) },
	);

/**
 * The response with `nextCursor` added, from `links.next`.
 *
 * The envelope is passed through unchanged, so `data` and `links` stay exactly
 * as Klaviyo sent them.
 */
// unknown: `raw` is the response body, validated by the output schema.
function withCursor(raw: unknown): unknown {
	return { ...(asRecord(raw) ?? {}), nextCursor: nextCursor(raw) };
}

/**
 * The next-page cursor, read out of `links.next`.
 *
 * Klaviyo puts the whole URL there, so the cursor has to be parsed out of its
 * `page[cursor]` query parameter rather than returned as a bare value.
 */
// unknown: `raw` is the response body; the URL lives under `links.next`.
export function nextCursor(raw: unknown): string | undefined {
	const next = asRecord(asRecord(raw)?.links)?.next;
	if (typeof next !== 'string' || next.length === 0) return undefined;
	try {
		return new URL(next).searchParams.get('page[cursor]') ?? undefined;
	} catch {
		return undefined;
	}
}
