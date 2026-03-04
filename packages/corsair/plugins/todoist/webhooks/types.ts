export interface TodoistWebhookPayload {
	type: string;
	created_at: string;
	data: {
		// data can contain arbitrary fields from the Todoist webhook payload
		[key: string]: any;
	};
}

export interface ExampleEvent extends TodoistWebhookPayload {
	type: 'example';
	data: {
		id: string;
		// data can contain additional arbitrary fields from the Todoist webhook payload
		[key: string]: any;
	};
}

export type TodoistWebhookOutputs = {
	example: ExampleEvent;
};

export function createTodoistMatch(eventType: string) {
	return (payload: TodoistWebhookPayload) => {
		return payload.type === eventType;
	};
}

export function verifyTodoistWebhookSignature(
	request: { payload: TodoistWebhookPayload; headers: Record<string, string> },
	secret: string,
): { valid: boolean; error?: string } {
	return { valid: true };
}
