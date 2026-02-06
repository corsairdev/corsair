import type {
	StarCreatedEvent,
	StarDeletedEvent,
} from 'corsair/plugins/github';
import type {
	CommentCreatedEvent,
	CommentUpdatedEvent,
	IssueCreatedEvent,
	IssueUpdatedEvent,
} from 'corsair/plugins/linear';
import type { EmailReceivedEvent } from 'corsair/plugins/resend';
import type { MessageEvent } from 'corsair/plugins/slack';
import { EventSchemas, Inngest } from 'inngest';

type Events = {
	'slack/event': {
		data: {
			tenantId: string;
			event: MessageEvent;
		};
	};
	'linear/issue-created': {
		data: {
			tenantId: string;
			event: IssueCreatedEvent;
		};
	};
	'linear/issue-updated': {
		data: {
			tenantId: string;
			event: IssueUpdatedEvent;
		};
	};
	'linear/comment-created': {
		data: {
			tenantId: string;
			event: CommentCreatedEvent;
		};
	};
	'linear/comment-updated': {
		data: {
			tenantId: string;
			event: CommentUpdatedEvent;
		};
	};
	'github/star': {
		data: {
			tenantId: string;
			event: StarCreatedEvent | StarDeletedEvent;
		};
	};
	'issue/reported': {
		data: {
			tenantId: string;
			title: string;
			description?: string;
		};
	};
	'resend/email': {
		data: {
			tenantId: string;
			event: EmailReceivedEvent;
		};
	};
};

export const inngest = new Inngest({
	id: 'corsair-demo',
	schemas: new EventSchemas().fromRecord<Events>(),
	eventKey: process.env.INNGEST_EVENT_KEY,
});
