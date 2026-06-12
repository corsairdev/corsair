import { z } from 'zod';

const PhoneNumberIdSchema = z.string().min(1).optional();
const RecipientSchema = z.string().min(1);

const MediaSourceSchema = z
	.object({
		id: z.string().min(1).optional(),
		link: z.url().optional(),
		caption: z.string().optional(),
		filename: z.string().optional(),
	})
	.superRefine((media, ctx) => {
		if ((media.id ? 1 : 0) + (media.link ? 1 : 0) !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Exactly one of media.id or media.link is required',
			});
		}
	});

const BaseMessageSchema = z.object({
	phoneNumberId: PhoneNumberIdSchema,
	messaging_product: z.literal('whatsapp').default('whatsapp'),
	recipient_type: z.literal('individual').default('individual').optional(),
	to: RecipientSchema,
	context: z
		.object({
			message_id: z.string().min(1),
		})
		.optional(),
});

const TextMessageSchema = BaseMessageSchema.extend({
	type: z.literal('text'),
	text: z.object({
		preview_url: z.boolean().optional(),
		body: z.string().min(1).max(4096),
	}),
});

const ImageMessageSchema = BaseMessageSchema.extend({
	type: z.literal('image'),
	image: MediaSourceSchema,
});

const AudioMessageSchema = BaseMessageSchema.extend({
	type: z.literal('audio'),
	audio: MediaSourceSchema.omit({ caption: true, filename: true }),
});

const DocumentMessageSchema = BaseMessageSchema.extend({
	type: z.literal('document'),
	document: MediaSourceSchema,
});

const VideoMessageSchema = BaseMessageSchema.extend({
	type: z.literal('video'),
	video: MediaSourceSchema.omit({ filename: true }),
});

const TemplateMessageSchema = BaseMessageSchema.extend({
	type: z.literal('template'),
	template: z.object({
		name: z.string().min(1),
		language: z.object({
			code: z.string().min(1),
			policy: z.literal('deterministic').optional(),
		}),
		components: z.array(z.record(z.string(), z.unknown())).optional(),
	}),
});

const InteractiveMessageSchema = BaseMessageSchema.extend({
	type: z.literal('interactive'),
	interactive: z
		.object({
			type: z.enum(['button', 'list', 'product', 'product_list', 'flow']),
		})
		.loose(),
});

const LocationMessageSchema = BaseMessageSchema.extend({
	type: z.literal('location'),
	location: z.object({
		longitude: z.number(),
		latitude: z.number(),
		name: z.string().optional(),
		address: z.string().optional(),
	}),
});

const ContactsMessageSchema = BaseMessageSchema.extend({
	type: z.literal('contacts'),
	contacts: z.array(z.object({
		name: z.object({
			formatted_name: z.string(),
			first_name: z.string().optional(),
		}),
		phones: z.array(z.object({
			phone: z.string().optional(),
			type: z.string().optional(),
			wa_id: z.string().optional(),
		})).optional(),
	})).min(1),
});

export const MessagesSendInputSchema = z.discriminatedUnion('type', [
	TextMessageSchema,
	ImageMessageSchema,
	AudioMessageSchema,
	DocumentMessageSchema,
	VideoMessageSchema,
	TemplateMessageSchema,
	InteractiveMessageSchema,
	LocationMessageSchema,
	ContactsMessageSchema,
]);

export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

export const MessagesSendResponseSchema = z.object({
	messaging_product: z.literal('whatsapp'),
	contacts: z.array(
		z.object({
			input: z.string(),
			wa_id: z.string(),
		}),
	),
	messages: z.array(
		z.object({
			id: z.string(),
			message_status: z.string().optional(),
		}),
	),
});

export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

export const MessagesMarkReadInputSchema = z.object({
	phoneNumberId: PhoneNumberIdSchema,
	messageId: z.string().min(1),
});

export const MessagesMarkReadResponseSchema = z.object({
	success: z.boolean(),
});

export const PhoneNumbersGetInputSchema = z.object({
	phoneNumberId: PhoneNumberIdSchema,
});

export const PhoneNumbersGetResponseSchema = z
	.object({
		id: z.string(),
		display_phone_number: z.string().optional(),
		verified_name: z.string().optional(),
		quality_rating: z.string().optional(),
		code_verification_status: z.string().optional(),
		platform_type: z.string().optional(),
		throughput: z
			.object({
				level: z.string().optional(),
			})
			.optional(),
	})
	.loose();

export const BusinessProfilesGetInputSchema = z.object({
	phoneNumberId: PhoneNumberIdSchema,
});

export const BusinessProfileSchema = z
	.object({
		about: z.string().optional(),
		address: z.string().optional(),
		description: z.string().optional(),
		email: z.string().optional(),
		profile_picture_url: z.string().optional(),
		websites: z.array(z.string()).optional(),
		vertical: z.string().optional(),
	})
	.loose();

export const BusinessProfilesGetResponseSchema = z.object({
	data: z.array(BusinessProfileSchema),
});

export const MediaUploadInputSchema = z.object({
	phoneNumberId: PhoneNumberIdSchema,
	file: z.string(), // Base64 string or URL
	type: z.string(), // MIME type
});

export const MediaUploadResponseSchema = z.object({
	id: z.string(),
});

export const MediaGetInfoInputSchema = z.object({
	mediaId: z.string().min(1),
});

export const MediaGetInfoResponseSchema = z.object({
	messaging_product: z.literal('whatsapp'),
	url: z.string(),
	mime_type: z.string(),
	sha256: z.string(),
	file_size: z.number().optional(),
	id: z.string(),
});

export const MessageTemplatesCreateInputSchema = z.object({
	businessAccountId: z.string().optional(),
	name: z.string(),
	language: z.string(),
	category: z.string(),
	components: z.array(z.record(z.string(), z.unknown())),
});

export const MessageTemplatesCreateResponseSchema = z.object({
	id: z.string(),
	status: z.string().optional(),
	category: z.string().optional(),
});

export const MessageTemplatesDeleteInputSchema = z.object({
	businessAccountId: z.string().optional(),
	name: z.string(),
});

export const MessageTemplatesDeleteResponseSchema = z.object({
	success: z.boolean(),
});

export const MessageTemplatesListInputSchema = z.object({
	businessAccountId: z.string().optional(),
});

export const MessageTemplatesListResponseSchema = z.object({
	data: z.array(z.record(z.string(), z.unknown())),
});

export const MessageTemplatesGetStatusInputSchema = z.object({
	businessAccountId: z.string().optional(),
	name: z.string(),
});

export const MessageTemplatesGetStatusResponseSchema = z.object({
	data: z.array(z.record(z.string(), z.unknown())),
});

export const PhoneNumbersListInputSchema = z.object({
	businessAccountId: z.string().optional(),
});

export const PhoneNumbersListResponseSchema = z.object({
	data: z.array(z.object({
		id: z.string(),
		display_phone_number: z.string().optional(),
		verified_name: z.string().optional(),
		quality_rating: z.string().optional(),
		code_verification_status: z.string().optional(),
		platform_type: z.string().optional(),
		throughput: z.record(z.string(), z.unknown()).optional(),
	}).loose()),
});

export type WhatsappEndpointInputs = {
	messagesSend: MessagesSendInput;
	messagesMarkRead: z.infer<typeof MessagesMarkReadInputSchema>;
	phoneNumbersGet: z.infer<typeof PhoneNumbersGetInputSchema>;
	businessProfilesGet: z.infer<typeof BusinessProfilesGetInputSchema>;
	mediaUpload: z.infer<typeof MediaUploadInputSchema>;
	mediaGetInfo: z.infer<typeof MediaGetInfoInputSchema>;
	messageTemplatesCreate: z.infer<typeof MessageTemplatesCreateInputSchema>;
	messageTemplatesDelete: z.infer<typeof MessageTemplatesDeleteInputSchema>;
	messageTemplatesList: z.infer<typeof MessageTemplatesListInputSchema>;
	messageTemplatesGetStatus: z.infer<typeof MessageTemplatesGetStatusInputSchema>;
	phoneNumbersList: z.infer<typeof PhoneNumbersListInputSchema>;
};

export type WhatsappEndpointOutputs = {
	messagesSend: MessagesSendResponse;
	messagesMarkRead: z.infer<typeof MessagesMarkReadResponseSchema>;
	phoneNumbersGet: z.infer<typeof PhoneNumbersGetResponseSchema>;
	businessProfilesGet: z.infer<typeof BusinessProfilesGetResponseSchema>;
	mediaUpload: z.infer<typeof MediaUploadResponseSchema>;
	mediaGetInfo: z.infer<typeof MediaGetInfoResponseSchema>;
	messageTemplatesCreate: z.infer<typeof MessageTemplatesCreateResponseSchema>;
	messageTemplatesDelete: z.infer<typeof MessageTemplatesDeleteResponseSchema>;
	messageTemplatesList: z.infer<typeof MessageTemplatesListResponseSchema>;
	messageTemplatesGetStatus: z.infer<typeof MessageTemplatesGetStatusResponseSchema>;
	phoneNumbersList: z.infer<typeof PhoneNumbersListResponseSchema>;
};

export const WhatsappEndpointInputSchemas = {
	messagesSend: MessagesSendInputSchema,
	messagesMarkRead: MessagesMarkReadInputSchema,
	phoneNumbersGet: PhoneNumbersGetInputSchema,
	businessProfilesGet: BusinessProfilesGetInputSchema,
	mediaUpload: MediaUploadInputSchema,
	mediaGetInfo: MediaGetInfoInputSchema,
	messageTemplatesCreate: MessageTemplatesCreateInputSchema,
	messageTemplatesDelete: MessageTemplatesDeleteInputSchema,
	messageTemplatesList: MessageTemplatesListInputSchema,
	messageTemplatesGetStatus: MessageTemplatesGetStatusInputSchema,
	phoneNumbersList: PhoneNumbersListInputSchema,
} as const;

export const WhatsappEndpointOutputSchemas = {
	messagesSend: MessagesSendResponseSchema,
	messagesMarkRead: MessagesMarkReadResponseSchema,
	phoneNumbersGet: PhoneNumbersGetResponseSchema,
	businessProfilesGet: BusinessProfilesGetResponseSchema,
	mediaUpload: MediaUploadResponseSchema,
	mediaGetInfo: MediaGetInfoResponseSchema,
	messageTemplatesCreate: MessageTemplatesCreateResponseSchema,
	messageTemplatesDelete: MessageTemplatesDeleteResponseSchema,
	messageTemplatesList: MessageTemplatesListResponseSchema,
	messageTemplatesGetStatus: MessageTemplatesGetStatusResponseSchema,
	phoneNumbersList: PhoneNumbersListResponseSchema,
} as const;
