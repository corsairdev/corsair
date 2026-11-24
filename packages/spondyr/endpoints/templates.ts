import type { SpondyrEndpoints } from '..';
import { adminWrites } from './admin';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

/** Builds a template's `Recipients` array from the snake_case input. */
function templateRecipients(
	recipients:
		| readonly {
				name: string;
				delivery_method: string;
				email_from_address?: string;
				email_subject?: string;
				email_body?: string;
				mail_from_name?: string;
				mail_from_address1?: string;
				mail_from_address2?: string;
				mail_from_city?: string;
				mail_from_state?: string;
				mail_from_zip?: string;
				text_body?: string;
				destination_folder?: string;
				signers?: readonly { name: string; email: string; role: string }[];
		  }[]
		| undefined,
): Record<string, unknown>[] | undefined {
	// unknown: the PascalCase wire body.
	if (recipients === undefined) return undefined;
	return recipients.map((recipient) => {
		const body: Record<string, unknown> = {
			// unknown: the PascalCase wire body.
			Name: recipient.name,
			DeliveryMethod: recipient.delivery_method,
		};
		for (const [key, target] of [
			['email_from_address', 'EmailFromAddress'],
			['email_subject', 'EmailSubject'],
			['email_body', 'EmailBody'],
			['mail_from_name', 'MailFromName'],
			['mail_from_address1', 'MailFromAddress1'],
			['mail_from_address2', 'MailFromAddress2'],
			['mail_from_city', 'MailFromCity'],
			['mail_from_state', 'MailFromState'],
			['mail_from_zip', 'MailFromZip'],
			['text_body', 'TextBody'],
			['destination_folder', 'DestinationFolder'],
		] as const) {
			if (recipient[key] !== undefined) body[target] = recipient[key];
		}
		if (recipient.signers !== undefined) {
			body.Signers = recipient.signers.map((signer) => ({
				Name: signer.name,
				Email: signer.email,
				Role: signer.role,
			}));
		}
		return body;
	});
}

/** Builds a template's `Conditions` array from the snake_case input. */
function templateConditions(
	conditions:
		| readonly {
				name: string;
				logical_operator: string;
				compare_operator: string;
				compare_value: string;
		  }[]
		| undefined,
): Record<string, unknown>[] | undefined {
	// unknown: the PascalCase wire body.
	if (conditions === undefined) return undefined;
	return conditions.map((condition) => ({
		Name: condition.name,
		LogicalOperator: condition.logical_operator,
		CompareOperator: condition.compare_operator,
		CompareValue: condition.compare_value,
	}));
}

/** The body both template writes share, omitting unset fields. */
function templateBody(
	parsed: Record<string, unknown>,
): Record<string, unknown> {
	const body: Record<string, unknown> = {
		Name: parsed.name,
		EventType: parsed.event_type,
		ContentType: parsed.content_type,
		TemplateContentReferenceID: parsed.template_content_reference_id,
		Recipients: templateRecipients(
			parsed.recipients as Parameters<typeof templateRecipients>[0],
		),
	};
	if (parsed.conditions !== undefined) {
		body.Conditions = templateConditions(
			parsed.conditions as Parameters<typeof templateConditions>[0],
		);
	}
	if (parsed.searches !== undefined) body.Searches = parsed.searches;
	// The rename selector only exists on an update.
	if (parsed.template !== undefined) body.Template = parsed.template;
	return body;
}

export const list: SpondyrEndpoints['templatesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.list',
			input: SpondyrEndpointInputSchemas.listTemplates,
			output: SpondyrEndpointOutputSchemas.listTemplates,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Templates',
			query: { TransactionType: parsed.transaction_type },
		}),
		{
			log: (parsed, result) => ({
				transaction_type: parsed.transaction_type,
				templates: result.Data.length,
			}),
		},
	);

export const get: SpondyrEndpoints['templatesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'templates.get',
			input: SpondyrEndpointInputSchemas.getTemplate,
			output: SpondyrEndpointOutputSchemas.getTemplate,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Template',
			query: {
				TransactionType: parsed.transaction_type,
				Template: parsed.template,
			},
		}),
		{
			log: (parsed) => ({
				transaction_type: parsed.transaction_type,
				template: parsed.template,
			}),
		},
	);

const writes = adminWrites({
	resource: 'Template',
	event: 'templates',
	create: {
		input: SpondyrEndpointInputSchemas.createTemplate,
		output: SpondyrEndpointOutputSchemas.createTemplate,
	},
	update: {
		input: SpondyrEndpointInputSchemas.updateTemplate,
		output: SpondyrEndpointOutputSchemas.updateTemplate,
	},
	delete: {
		input: SpondyrEndpointInputSchemas.deleteTemplate,
		output: SpondyrEndpointOutputSchemas.deleteTemplate,
	},
	body: templateBody,
	name: (parsed) => String(parsed.template),
	filter: (parsed) => String(parsed.transaction_type),
	logCreate: (parsed) => ({
		transaction_type: parsed.transaction_type,
		template: parsed.name ?? parsed.template,
	}),
});

export const create: SpondyrEndpoints['templatesCreate'] = writes.create;
export const update: SpondyrEndpoints['templatesUpdate'] = writes.update;
export const remove: SpondyrEndpoints['templatesDelete'] = writes.remove;

/**
 * Uploads the template file and returns the ReferenceID the create and update
 * calls need. Uploaded content can be attached to a single template only.
 */
export const uploadContent: SpondyrEndpoints['templatesUploadContent'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'templates.uploadContent',
			input: SpondyrEndpointInputSchemas.uploadTemplateContent,
			output: SpondyrEndpointOutputSchemas.uploadTemplateContent,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'TemplateContent',
			body: { Content: parsed.content },
		}),
		{
			log: (_parsed, result) => ({
				reference_id: result.ReferenceID ?? undefined,
			}),
		},
	);
