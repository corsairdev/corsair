import { z } from 'zod';
import {
	CloseActivityNote,
	CloseContact,
	CloseLead,
	CloseOpportunity,
	CloseTask,
} from '../schema/database';

export const CloseWebhookBaseEventSchema = z
	.object({
		event_type: z.string(),
		organization_id: z.string().optional(),
		object_type: z.string().optional(),
		action: z.string().optional(),
	})
	.loose();

export const CloseLeadCreatedEventSchema = CloseWebhookBaseEventSchema.extend({
	event_type: z.literal('lead.created'),
	data: CloseLead,
});
export type CloseLeadCreatedEvent = z.infer<typeof CloseLeadCreatedEventSchema>;

export const CloseLeadUpdatedEventSchema = CloseWebhookBaseEventSchema.extend({
	event_type: z.literal('lead.updated'),
	data: CloseLead,
});
export type CloseLeadUpdatedEvent = z.infer<typeof CloseLeadUpdatedEventSchema>;

export const CloseContactCreatedEventSchema =
	CloseWebhookBaseEventSchema.extend({
		event_type: z.literal('contact.created'),
		data: CloseContact,
	});
export type CloseContactCreatedEvent = z.infer<
	typeof CloseContactCreatedEventSchema
>;

export const CloseOpportunityCreatedEventSchema =
	CloseWebhookBaseEventSchema.extend({
		event_type: z.literal('opportunity.created'),
		data: CloseOpportunity,
	});
export type CloseOpportunityCreatedEvent = z.infer<
	typeof CloseOpportunityCreatedEventSchema
>;

export const CloseTaskCreatedEventSchema = CloseWebhookBaseEventSchema.extend({
	event_type: z.literal('task.created'),
	data: CloseTask,
});
export type CloseTaskCreatedEvent = z.infer<typeof CloseTaskCreatedEventSchema>;

export const CloseActivityNoteCreatedEventSchema =
	CloseWebhookBaseEventSchema.extend({
		event_type: z.literal('activity.note.created'),
		data: CloseActivityNote,
	});
export type CloseActivityNoteCreatedEvent = z.infer<
	typeof CloseActivityNoteCreatedEventSchema
>;

export type CloseWebhookOutputs = {
	leadCreated: CloseLeadCreatedEvent;
	leadUpdated: CloseLeadUpdatedEvent;
	contactCreated: CloseContactCreatedEvent;
	opportunityCreated: CloseOpportunityCreatedEvent;
	taskCreated: CloseTaskCreatedEvent;
	activityNoteCreated: CloseActivityNoteCreatedEvent;
};
