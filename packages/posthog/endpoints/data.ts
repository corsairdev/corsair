import { defineApiEndpoint, PROJECT, pathId } from './api';

export const actionsList = defineApiEndpoint<'actionsList'>(
	'posthog.actions.list',
	(input) => ({ path: `${PROJECT}/actions/`, query: input, log: input }),
);

export const actionsGet = defineApiEndpoint<'actionsGet'>(
	'posthog.actions.get',
	(input) => ({
		path: `${PROJECT}/actions/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);

export const actionsCreate = defineApiEndpoint<'actionsCreate'>(
	'posthog.actions.create',
	(input) => ({
		path: `${PROJECT}/actions/`,
		method: 'POST',
		body: input,
		log: { name: input.name, steps: input.steps.length },
	}),
);

export const annotationsList = defineApiEndpoint<'annotationsList'>(
	'posthog.annotations.list',
	(input) => ({ path: `${PROJECT}/annotations/`, query: input, log: input }),
);

export const annotationsCreate = defineApiEndpoint<'annotationsCreate'>(
	'posthog.annotations.create',
	(input) => ({
		path: `${PROJECT}/annotations/`,
		method: 'POST',
		body: {
			content: input.content,
			date_marker: input.date_marker ?? new Date().toISOString(),
			scope: input.scope ?? 'project',
			dashboard_item: input.dashboard_item,
		},
		log: { scope: input.scope ?? 'project', date_marker: input.date_marker },
	}),
);

export const annotationsUpdate = defineApiEndpoint<'annotationsUpdate'>(
	'posthog.annotations.update',
	({ id, ...changes }) => ({
		path: `${PROJECT}/annotations/${pathId(id)}/`,
		method: 'PATCH',
		body: changes,
		log: { id, fields: Object.keys(changes) },
	}),
);

export const annotationsDelete = defineApiEndpoint<'annotationsDelete'>(
	'posthog.annotations.delete',
	({ id }) => ({
		path: `${PROJECT}/annotations/${pathId(id)}/`,
		method: 'PATCH',
		body: { deleted: true },
		log: { id },
	}),
);

export const eventDefinitionsList = defineApiEndpoint<'eventDefinitionsList'>(
	'posthog.eventDefinitions.list',
	(input) => ({
		path: `${PROJECT}/event_definitions/`,
		query: input,
		log: input,
	}),
);

export const propertyDefinitionsList =
	defineApiEndpoint<'propertyDefinitionsList'>(
		'posthog.propertyDefinitions.list',
		({ event_names, ...rest }) => ({
			path: `${PROJECT}/property_definitions/`,
			query: {
				...rest,
				...(event_names?.length
					? {
							event_names: JSON.stringify(event_names),
							filter_by_event_names: true,
						}
					: {}),
			},
			log: { ...rest, event_names },
		}),
	);

export const notebooksList = defineApiEndpoint<'notebooksList'>(
	'posthog.notebooks.list',
	(input) => ({ path: `${PROJECT}/notebooks/`, query: input, log: input }),
);

export const notebooksGet = defineApiEndpoint<'notebooksGet'>(
	'posthog.notebooks.get',
	(input) => ({
		path: `${PROJECT}/notebooks/${pathId(input.short_id)}/`,
		log: { short_id: input.short_id },
	}),
);

/** A notebook document: the title as a heading, then one paragraph per block of text. */
export function notebookDocument(title: string, text?: string) {
	const paragraphs = (text ?? '')
		.split(/\n\s*\n/)
		.map((block) => block.trim())
		.filter(Boolean)
		.map((block) => ({
			type: 'paragraph',
			content: [{ type: 'text', text: block }],
		}));
	return {
		type: 'doc',
		content: [
			{
				type: 'heading',
				attrs: { level: 1 },
				content: [{ type: 'text', text: title }],
			},
			...paragraphs,
		],
	};
}

export const notebooksCreate = defineApiEndpoint<'notebooksCreate'>(
	'posthog.notebooks.create',
	(input) => ({
		path: `${PROJECT}/notebooks/`,
		method: 'POST',
		body: {
			title: input.title,
			content: input.content ?? notebookDocument(input.title, input.text),
			text_content: input.content
				? undefined
				: [input.title, input.text].filter(Boolean).join('\n\n'),
		},
		log: { title: input.title },
	}),
);

export const alertsList = defineApiEndpoint<'alertsList'>(
	'posthog.alerts.list',
	(input) => ({ path: `${PROJECT}/alerts/`, query: input, log: input }),
);

export const alertsGet = defineApiEndpoint<'alertsGet'>(
	'posthog.alerts.get',
	(input) => ({
		path: `${PROJECT}/alerts/${pathId(input.id)}/`,
		log: { id: input.id },
	}),
);
