import { compact, endpoint } from './call';

const person = (value: { email: string; name?: string } | undefined) =>
	value ? compact({ Email: value.email, Name: value.name }) : undefined;

/**
 * Sends a transactional email (receipts, password resets) to each
 * personalization's recipients, from a template or inline content.
 */
export const send = endpoint('transactionalSend', {
	event: 'transactional.send',
	request: (input) => ({
		method: 'POST',
		path: '/campaigns/transactional/send.json',
		body: compact({
			TemplateId: input.templateId,
			TemplateName: input.templateName,
			From: person(input.from),
			ReplyTo: person(input.replyTo),
			Subject: input.subject,
			Cc: input.cc,
			Bcc: input.bcc,
			Content: input.content?.map((item) =>
				compact({
					Type: item.type,
					Value: item.value,
					WebLocation: item.webLocation,
				}),
			),
			Personalizations: input.personalizations.map((p) =>
				compact({
					To: p.to.map(person),
					Cc: p.cc,
					Bcc: p.bcc,
					Substitutions: p.substitutions,
					CustomArguments: p.customArguments,
				}),
			),
			MailSettings: input.mailSettings
				? compact({
						BypassUnsubscribeManagement:
							input.mailSettings.bypassUnsubscribeManagement === undefined
								? undefined
								: {
										Enable: input.mailSettings.bypassUnsubscribeManagement,
									},
						UnsubscribeLinkManagement:
							input.mailSettings.includeUnsubscribeLink === undefined
								? undefined
								: {
										IncludeUnsubscribeLink:
											input.mailSettings.includeUnsubscribeLink,
									},
						ScheduledForDatetime: input.mailSettings.scheduledForDatetime,
						ScheduledForTimezone: input.mailSettings.scheduledForTimezone,
					})
				: undefined,
			Attachments: input.attachments?.map((a) =>
				compact({
					Content: a.content,
					Type: a.type,
					FileName: a.fileName,
					Disposition: a.disposition,
					ContentId: a.contentId,
				}),
			),
		}),
	}),
	shape: (context) => ({ result: context }),
	log: (parsed) => ({ personalizations: parsed.personalizations.length }),
});
