import { z } from 'zod';

// `unknown` because OpenAPI marks some values as arbitrary JSON; they are narrowed by their containing endpoint schema.
const FreeformJsonSchema = z.unknown();

export const EnvelopeAttachmentFindInputSchema = z
	.object({
		envelopeId: z.string(),
		token: z.string().optional(),
	})
	.strict();
export const EnvelopeAttachmentFindOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					type: z.enum(['link']),
					label: z.string(),
					data: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeAttachmentCreateInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z
			.object({
				label: z.string().min(1),
				data: z.string(),
			})
			.strict(),
	})
	.strict();
export const EnvelopeAttachmentCreateOutputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const EnvelopeAttachmentUpdateInputSchema = z
	.object({
		id: z.string(),
		data: z
			.object({
				label: z.string().min(1),
				data: z.string(),
			})
			.strict(),
	})
	.strict();
export const EnvelopeAttachmentUpdateOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeAttachmentDeleteInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();
export const EnvelopeAttachmentDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeItemCreateManyInputSchema = z
	.object({
		payload: z
			.object({
				envelopeId: z.string(),
			})
			.strict(),
		files: z
			.array(
				z
					.object({
						filename: z.string().min(1),
						contentType: z.string().min(1),
						contentBase64: z
							.string()
							.min(4)
							.max(22369624)
							.regex(
								new RegExp(
									'^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
								),
							),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const EnvelopeItemCreateManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					title: z.string(),
					envelopeId: z.string(),
					order: z.number(),
					documentDataId: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeItemUpdateManyInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z
			.array(
				z
					.object({
						envelopeItemId: z.string(),
						order: z.number().int().min(1).optional(),
						title: z.string().min(1).max(255).optional(),
					})
					.strict(),
			)
			.min(1),
	})
	.strict();
export const EnvelopeItemUpdateManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					order: z.number(),
					title: z.string(),
					envelopeId: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeItemDeleteInputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
	})
	.strict();
export const EnvelopeItemDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeItemDownloadInputSchema = z
	.object({
		envelopeItemId: z.string(),
		version: z.enum(['original', 'signed', 'pending']).optional(),
	})
	.strict();
export const EnvelopeItemDownloadOutputSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.literal('application/pdf'),
		base64: z.base64(),
		size: z.number().int().min(0),
	})
	.strict();

export const EnvelopeRecipientGetInputSchema = z
	.object({
		recipientId: z.number(),
	})
	.strict();
export const EnvelopeRecipientGetOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeRecipientCreateManyInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z.array(
			z
				.object({
					email: z.union([
						z.enum(['']),
						z
							.string()
							.max(254)
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
					]),
					name: z.string().max(255),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					signingOrder: z.number().optional(),
					accessAuth: z
						.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
						.optional(),
					actionAuth: z
						.array(
							z.enum([
								'ACCOUNT',
								'PASSKEY',
								'TWO_FACTOR_AUTH',
								'PASSWORD',
								'EXPLICIT_NONE',
							]),
						)
						.optional(),
				})
				.strict(),
		),
	})
	.strict();
export const EnvelopeRecipientCreateManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeRecipientUpdateManyInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z.array(
			z
				.object({
					id: z.number(),
					email: z
						.union([
							z.enum(['']),
							z
								.string()
								.max(254)
								.regex(
									new RegExp(
										"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
										'u',
									),
								),
						])
						.optional(),
					name: z.string().max(255).optional(),
					role: z
						.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT'])
						.optional(),
					signingOrder: z.number().optional(),
					accessAuth: z
						.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
						.optional(),
					actionAuth: z
						.array(
							z.enum([
								'ACCOUNT',
								'PASSKEY',
								'TWO_FACTOR_AUTH',
								'PASSWORD',
								'EXPLICIT_NONE',
							]),
						)
						.optional(),
				})
				.strict(),
		),
	})
	.strict();
export const EnvelopeRecipientUpdateManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeRecipientDeleteInputSchema = z
	.object({
		recipientId: z.number(),
	})
	.strict();
export const EnvelopeRecipientDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeRecipientRejectOnBehalfOfInputSchema = z
	.object({
		recipientId: z.number(),
		envelopeId: z.string(),
		reason: z.string().min(1),
		actAsEmail: z
			.string()
			.regex(
				new RegExp(
					"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
					'u',
				),
			)
			.optional(),
	})
	.strict();
export const EnvelopeRecipientRejectOnBehalfOfOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeFieldGetInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export const EnvelopeFieldGetOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
	})
	.strict();

export const EnvelopeFieldCreateManyInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z.array(
			z.union([
				z.union([
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['SIGNATURE']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['signature']),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['FREE_SIGNATURE']),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['INITIALS']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['NAME']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['EMAIL']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['DATE']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['TEXT']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['NUMBER']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['RADIO']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['CHECKBOX']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							page: z.number().min(1),
							positionX: z.number().min(0).max(100),
							positionY: z.number().min(0).max(100),
							width: z.number().min(0).max(100),
							height: z.number().min(0).max(100),
							type: z.enum(['DROPDOWN']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				]),
				z.union([
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['SIGNATURE']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['signature']),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['FREE_SIGNATURE']),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['INITIALS']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['NAME']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['EMAIL']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['DATE']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['TEXT']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['NUMBER']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['RADIO']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['CHECKBOX']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']).optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							recipientId: z.number(),
							envelopeItemId: z.string().optional(),
							placeholder: z.string(),
							width: z.number().min(0).max(100).optional(),
							height: z.number().min(0).max(100).optional(),
							matchAll: z.boolean().optional(),
							type: z.enum(['DROPDOWN']),
							fieldMeta: z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict()
								.optional(),
						})
						.strict(),
				]),
			]),
		),
	})
	.strict();
export const EnvelopeFieldCreateManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeFieldUpdateManyInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z.array(
			z.union([
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['SIGNATURE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['signature']),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['FREE_SIGNATURE']),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['INITIALS']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['initials']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['NAME']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['name']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['EMAIL']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['email']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['DATE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['date']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['TEXT']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['text']),
								text: z.string().optional(),
								characterLimit: z.number().min(0).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['NUMBER']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['number']),
								numberFormat: z.union([z.string(), z.null()]).optional(),
								value: z.string().optional(),
								minValue: z.union([z.number(), z.null()]).optional(),
								maxValue: z.union([z.number(), z.null()]).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['RADIO']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['radio']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['CHECKBOX']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['checkbox']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								validationRule: z.string().optional(),
								validationLength: z.number().optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						envelopeItemId: z.string().optional(),
						page: z.number().min(1).optional(),
						positionX: z.number().min(0).max(100).optional(),
						positionY: z.number().min(0).max(100).optional(),
						width: z.number().min(0).max(100).optional(),
						height: z.number().min(0).max(100).optional(),
						type: z.enum(['DROPDOWN']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['dropdown']),
								values: z
									.array(
										z
											.object({
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								defaultValue: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			]),
		),
	})
	.strict();
export const EnvelopeFieldUpdateManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeFieldDeleteInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export const EnvelopeFieldDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeFindInputSchema = z
	.object({
		query: z.string().optional(),
		page: z.number().min(1).optional(),
		perPage: z.number().min(1).max(100).optional(),
		type: z.enum(['DOCUMENT', 'TEMPLATE']).optional(),
		templateId: z.number().optional(),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']).optional(),
		status: z
			.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED'])
			.optional(),
		hasExpiredRecipients: z.enum(['true', 'false']).optional(),
		folderId: z.string().optional(),
		orderByColumn: z.enum(['createdAt']).optional(),
		orderByDirection: z.enum(['asc', 'desc']).optional(),
	})
	.strict();
export const EnvelopeFindOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					internalVersion: z.number(),
					type: z.enum(['DOCUMENT', 'TEMPLATE']),
					status: z.enum([
						'DRAFT',
						'PENDING',
						'COMPLETED',
						'REJECTED',
						'CANCELLED',
					]),
					source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					templateType: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
					id: z.string(),
					secondaryId: z.string(),
					externalId: z.union([z.string(), z.null()]),
					createdAt: z.string(),
					updatedAt: z.string(),
					completedAt: z.union([z.string(), z.null()]),
					deletedAt: z.union([z.string(), z.null()]),
					title: z.string(),
					authOptions: z.union([
						z
							.object({
								globalAccessAuth: z.array(
									z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
								),
								globalActionAuth: z.array(
									z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
								),
							})
							.strict(),
						z.null(),
					]),
					formValues: z.union([
						z
							.object({})
							.catchall(z.union([z.string(), z.boolean(), z.number()])),
						z.null(),
					]),
					publicTitle: z.string(),
					publicDescription: z.string(),
					userId: z.number(),
					teamId: z.number(),
					folderId: z.union([z.string(), z.null()]),
					templateId: z.union([z.number(), z.null()]),
					user: z
						.object({
							id: z.number(),
							name: z.string(),
							email: z.string(),
						})
						.strict(),
					recipients: z.array(
						z
							.object({
								envelopeId: z.string(),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								readStatus: z.enum(['NOT_OPENED', 'OPENED']),
								signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
								sendStatus: z.enum(['NOT_SENT', 'SENT']),
								id: z.number(),
								email: z.string(),
								name: z.string(),
								token: z.string(),
								documentDeletedAt: z.union([z.string(), z.null()]),
								expired: z.union([z.string(), z.null()]),
								expiresAt: z.union([z.string(), z.null()]),
								expirationNotifiedAt: z.union([z.string(), z.null()]),
								signedAt: z.union([z.string(), z.null()]),
								authOptions: z.union([
									z
										.object({
											accessAuth: z.array(
												z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
											),
											actionAuth: z.array(
												z.enum([
													'ACCOUNT',
													'PASSKEY',
													'TWO_FACTOR_AUTH',
													'PASSWORD',
													'EXPLICIT_NONE',
												]),
											),
										})
										.strict(),
									z.null(),
								]),
								signingOrder: z.union([z.number(), z.null()]),
								rejectionReason: z.union([z.string(), z.null()]),
							})
							.strict(),
					),
					team: z.union([
						z
							.object({
								id: z.number(),
								url: z.string(),
							})
							.strict(),
						z.null(),
					]),
				})
				.strict(),
		),
		count: z.number(),
		currentPage: z.number(),
		perPage: z.number(),
		totalPages: z.number(),
	})
	.strict();

export const EnvelopeAuditLogFindInputSchema = z
	.object({
		envelopeId: z.string(),
		page: z.number().min(1).optional(),
		perPage: z.number().min(1).max(100).optional(),
		orderByColumn: z.enum(['createdAt']).optional(),
		orderByDirection: z.enum(['asc', 'desc']).optional(),
	})
	.strict();
export const EnvelopeAuditLogFindOutputSchema = z
	.object({
		data: z.array(
			z.union([
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['ENVELOPE_ITEM_CREATED']),
						data: z
							.object({
								envelopeItemId: z.string(),
								envelopeItemTitle: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['ENVELOPE_ITEM_DELETED']),
						data: z
							.object({
								envelopeItemId: z.string(),
								envelopeItemTitle: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['ENVELOPE_ITEM_UPDATED']),
						data: z
							.object({
								envelopeItemId: z.string(),
								changes: z.array(
									z
										.object({
											field: z.string(),
											from: z.string(),
											to: z.string(),
										})
										.strict(),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['ENVELOPE_ITEM_PDF_REPLACED']),
						data: z
							.object({
								envelopeItemId: z.string(),
								envelopeItemTitle: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['EMAIL_SENT']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								emailType: z.enum([
									'SIGNING_REQUEST',
									'VIEW_REQUEST',
									'APPROVE_REQUEST',
									'ASSISTING_REQUEST',
									'CC',
									'DOCUMENT_COMPLETED',
									'REMINDER',
								]),
								isResending: z.boolean(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_COMPLETED']),
						data: z
							.object({
								transactionId: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_CREATED']),
						data: z
							.object({
								title: z.string(),
								source: z
									.union([
										z
											.object({
												type: z.enum(['DOCUMENT']),
											})
											.strict(),
										z
											.object({
												type: z.enum(['TEMPLATE']),
												templateId: z.number(),
											})
											.strict(),
										z
											.object({
												type: z.enum(['TEMPLATE_DIRECT_LINK']),
												templateId: z.number(),
												directRecipientEmail: z
													.string()
													.regex(
														new RegExp(
															"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
															'u',
														),
													),
											})
											.strict(),
									])
									.optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_DELETED']),
						data: z
							.object({
								type: z.enum(['SOFT', 'HARD']),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_CANCELLED']),
						data: z
							.object({
								reason: z.string().optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_MOVED_TO_TEAM']),
						data: z
							.object({
								movedByUserId: z.number(),
								fromPersonalAccount: z.boolean(),
								toTeamId: z.number(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_DELEGATED_OWNER_CREATED']),
						data: z
							.object({
								delegatedOwnerName: z.union([z.string(), z.null()]),
								delegatedOwnerEmail: z.string(),
								teamName: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_FIELDS_AUTO_INSERTED']),
						data: z
							.object({
								fields: z.array(
									z
										.object({
											fieldId: z.number(),
											fieldType: z.enum([
												'SIGNATURE',
												'FREE_SIGNATURE',
												'INITIALS',
												'NAME',
												'EMAIL',
												'DATE',
												'TEXT',
												'NUMBER',
												'RADIO',
												'CHECKBOX',
												'DROPDOWN',
											]),
											recipientId: z.number(),
										})
										.strict(),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_FIELD_INSERTED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								fieldId: z.string(),
								field: z.union([
									z
										.object({
											type: z.enum(['INITIALS']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['EMAIL']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['DATE']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['NAME']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['TEXT']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.union([
												z.enum(['SIGNATURE']),
												z.enum(['FREE_SIGNATURE']),
											]),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['RADIO']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['CHECKBOX']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['DROPDOWN']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['NUMBER']),
											data: z.string(),
										})
										.strict(),
								]),
								fieldSecurity: z
									.object({
										type: z
											.enum([
												'ACCOUNT',
												'PASSKEY',
												'TWO_FACTOR_AUTH',
												'PASSWORD',
												'EXPLICIT_NONE',
											])
											.optional(),
									})
									.strict()
									.optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_FIELD_UNINSERTED']),
						data: z
							.object({
								field: z.enum([
									'SIGNATURE',
									'FREE_SIGNATURE',
									'INITIALS',
									'NAME',
									'EMAIL',
									'DATE',
									'TEXT',
									'NUMBER',
									'RADIO',
									'CHECKBOX',
									'DROPDOWN',
								]),
								fieldId: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_FIELD_PREFILLED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								fieldId: z.string(),
								field: z.union([
									z
										.object({
											type: z.enum(['INITIALS']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['EMAIL']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['DATE']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['NAME']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['TEXT']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.union([
												z.enum(['SIGNATURE']),
												z.enum(['FREE_SIGNATURE']),
											]),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['RADIO']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['CHECKBOX']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['DROPDOWN']),
											data: z.string(),
										})
										.strict(),
									z
										.object({
											type: z.enum(['NUMBER']),
											data: z.string(),
										})
										.strict(),
								]),
								fieldSecurity: z
									.object({
										type: z
											.enum([
												'ACCOUNT',
												'PASSKEY',
												'TWO_FACTOR_AUTH',
												'PASSWORD',
												'EXPLICIT_NONE',
											])
											.optional(),
									})
									.strict()
									.optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_VISIBILITY_UPDATED']),
						data: z
							.object({
								from: z.union([z.string(), z.array(z.string())]).nullable(),
								to: z.union([z.string(), z.array(z.string())]).nullable(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_GLOBAL_AUTH_ACCESS_UPDATED']),
						data: z
							.object({
								from: z.union([z.string(), z.array(z.string())]).nullable(),
								to: z.union([z.string(), z.array(z.string())]).nullable(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_GLOBAL_AUTH_ACTION_UPDATED']),
						data: z
							.object({
								from: z.union([z.string(), z.array(z.string())]).nullable(),
								to: z.union([z.string(), z.array(z.string())]).nullable(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_META_UPDATED']),
						data: z
							.object({
								changes: z.array(
									z.union([
										z
											.object({
												type: z.union([
													z.enum(['DATE_FORMAT']),
													z.enum(['MESSAGE']),
													z.enum(['REDIRECT_URL']),
													z.enum(['SUBJECT']),
													z.enum(['TIMEZONE']),
													z.enum(['EMAIL_ID']),
													z.enum(['EMAIL_REPLY_TO']),
													z.enum(['EMAIL_SETTINGS']),
												]),
												from: z.union([z.string(), z.null()]),
												to: z.union([z.string(), z.null()]),
											})
											.strict(),
										z
											.object({
												type: z.enum(['PASSWORD']),
											})
											.strict(),
									]),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_OPENED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_VIEWED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_COMPLETED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_REJECTED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								reason: z.string(),
								isExternal: z.boolean().optional(),
								onBehalfOfUserEmail: z.string().optional(),
								onBehalfOfUserName: z.union([z.string(), z.null()]).optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_ACCESS_AUTH_2FA_REQUESTED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_ACCESS_AUTH_2FA_VALIDATED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_ACCESS_AUTH_2FA_FAILED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_SENT']),
						data: z.object({}).strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_TITLE_UPDATED']),
						data: z
							.object({
								from: z.string(),
								to: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_EXTERNAL_ID_UPDATED']),
						data: z
							.object({
								from: z.union([z.string(), z.null()]).optional(),
								to: z.union([z.string(), z.null()]).optional(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['FIELD_CREATED']),
						data: z
							.object({
								fieldId: z.string(),
								fieldRecipientEmail: z.string(),
								fieldRecipientId: z.number(),
								fieldType: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['FIELD_DELETED']),
						data: z
							.object({
								fieldId: z.string(),
								fieldRecipientEmail: z.string(),
								fieldRecipientId: z.number(),
								fieldType: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['FIELD_UPDATED']),
						data: z
							.object({
								fieldId: z.string(),
								fieldRecipientEmail: z.string(),
								fieldRecipientId: z.number(),
								fieldType: z.string(),
								changes: z.array(
									z.union([
										z
											.object({
												type: z.enum(['DIMENSION']),
												from: z
													.object({
														width: z.number(),
														height: z.number(),
													})
													.strict(),
												to: z
													.object({
														width: z.number(),
														height: z.number(),
													})
													.strict(),
											})
											.strict(),
										z
											.object({
												type: z.enum(['POSITION']),
												from: z
													.object({
														page: z.number(),
														positionX: z.number(),
														positionY: z.number(),
													})
													.strict(),
												to: z
													.object({
														page: z.number(),
														positionX: z.number(),
														positionY: z.number(),
													})
													.strict(),
											})
											.strict(),
									]),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['RECIPIENT_CREATED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['RECIPIENT_UPDATED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								changes: z.array(
									z.union([
										z
											.object({
												from: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												to: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												type: z.enum(['ACTION_AUTH']),
											})
											.strict(),
										z
											.object({
												from: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												to: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												type: z.enum(['ACCESS_AUTH']),
											})
											.strict(),
										z
											.object({
												from: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												to: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												type: z.enum(['NAME']),
											})
											.strict(),
										z
											.object({
												from: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												to: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												type: z.enum(['ROLE']),
											})
											.strict(),
										z
											.object({
												from: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												to: z
													.union([z.string(), z.array(z.string())])
													.nullable(),
												type: z.enum(['EMAIL']),
											})
											.strict(),
									]),
								),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['RECIPIENT_DELETED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_EXPIRED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_CSC_AUTHENTICATED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								providerId: z.string(),
								credentialId: z.string(),
								signatureAlgorithm: z.string(),
								digestAlgorithm: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_CSC_AUTHENTICATION_FAILED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								providerId: z.string(),
								reason: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_CSC_SIGN_REQUESTED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								providerId: z.string(),
								credentialId: z.string(),
								sessionId: z.string(),
								numSignatures: z.number(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_CSC_AUTHORIZED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								providerId: z.string(),
								credentialId: z.string(),
								sessionId: z.string(),
								sadExpiresAt: z.string(),
							})
							.strict(),
					})
					.strict(),
				z
					.object({
						id: z.string(),
						createdAt: z.string(),
						envelopeId: z.string(),
						name: z.union([z.string(), z.null()]).optional(),
						email: z.union([z.string(), z.null()]).optional(),
						userId: z.union([z.number(), z.null()]).optional(),
						userAgent: z.union([z.string(), z.null()]).optional(),
						ipAddress: z.union([z.string(), z.null()]).optional(),
						type: z.enum(['DOCUMENT_RECIPIENT_CSC_SIGNED']),
						data: z
							.object({
								recipientEmail: z.string(),
								recipientName: z.string(),
								recipientId: z.number(),
								recipientRole: z.string(),
								providerId: z.string(),
								credentialId: z.string(),
								sessionId: z.string(),
								numItemsSigned: z.number(),
								signatureAlgorithm: z.string(),
								digestAlgorithm: z.string(),
							})
							.strict(),
					})
					.strict(),
			]),
		),
		count: z.number(),
		currentPage: z.number(),
		perPage: z.number(),
		totalPages: z.number(),
	})
	.strict();

export const EnvelopeAuditLogDownloadPdfInputSchema = z
	.object({
		envelopeId: z.string(),
	})
	.strict();
export const EnvelopeAuditLogDownloadPdfOutputSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.literal('application/pdf'),
		base64: z.base64(),
		size: z.number().int().min(0),
	})
	.strict();

export const EnvelopeCertificateDownloadPdfInputSchema = z
	.object({
		envelopeId: z.string(),
	})
	.strict();
export const EnvelopeCertificateDownloadPdfOutputSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.literal('application/pdf'),
		base64: z.base64(),
		size: z.number().int().min(0),
	})
	.strict();

export const EnvelopeGetInputSchema = z
	.object({
		envelopeId: z.string(),
	})
	.strict();
export const EnvelopeGetOutputSchema = z
	.object({
		internalVersion: z.number(),
		type: z.enum(['DOCUMENT', 'TEMPLATE']),
		status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		templateType: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
		id: z.string(),
		secondaryId: z.string(),
		externalId: z.union([z.string(), z.null()]),
		createdAt: z.string(),
		updatedAt: z.string(),
		completedAt: z.union([z.string(), z.null()]),
		deletedAt: z.union([z.string(), z.null()]),
		title: z.string(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		formValues: z.union([
			z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
			z.null(),
		]),
		publicTitle: z.string(),
		publicDescription: z.string(),
		userId: z.number(),
		teamId: z.number(),
		folderId: z.union([z.string(), z.null()]),
		templateId: z.union([z.number(), z.null()]),
		documentMeta: z
			.object({
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
				distributionMethod: z.enum(['EMAIL', 'NONE']),
				id: z.string(),
				subject: z.union([z.string(), z.null()]),
				message: z.union([z.string(), z.null()]),
				timezone: z.union([z.string(), z.null()]),
				dateFormat: z.union([z.string(), z.null()]),
				redirectUrl: z.union([z.string(), z.null()]),
				typedSignatureEnabled: z.boolean(),
				uploadSignatureEnabled: z.boolean(),
				drawSignatureEnabled: z.boolean(),
				allowDictateNextSigner: z.boolean(),
				language: z.string(),
				emailSettings: z.union([
					z
						.object({
							recipientSigningRequest: z.boolean(),
							recipientRemoved: z.boolean(),
							recipientSigned: z.boolean(),
							documentPending: z.boolean(),
							documentCompleted: z.boolean(),
							documentDeleted: z.boolean(),
							ownerDocumentCompleted: z.boolean(),
							ownerRecipientExpired: z.boolean(),
							ownerDocumentCreated: z.boolean(),
						})
						.strict(),
					z.null(),
				]),
				emailId: z.union([z.string(), z.null()]),
				emailReplyTo: z.union([z.string(), z.null()]),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable(),
			})
			.strict(),
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
				})
				.strict(),
		),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
				})
				.strict(),
		),
		envelopeItems: z.array(
			z
				.object({
					envelopeId: z.string(),
					documentDataId: z.string(),
					id: z.string(),
					title: z.string(),
					order: z.number(),
				})
				.strict(),
		),
		directLink: z.union([
			z
				.object({
					directTemplateRecipientId: z.number(),
					enabled: z.boolean(),
					id: z.string(),
					token: z.string(),
				})
				.strict(),
			z.null(),
		]),
		team: z
			.object({
				id: z.number(),
				url: z.string(),
			})
			.strict(),
		user: z
			.object({
				id: z.number(),
				name: z.string(),
				email: z.string(),
			})
			.strict(),
	})
	.strict();

export const EnvelopeGetManyInputSchema = z
	.object({
		ids: z.union([
			z
				.object({
					type: z.enum(['envelopeId']),
					ids: z.array(z.string()).min(1).max(20),
				})
				.strict(),
			z
				.object({
					type: z.enum(['documentId']),
					ids: z.array(z.number()).min(1).max(20),
				})
				.strict(),
			z
				.object({
					type: z.enum(['templateId']),
					ids: z.array(z.number()).min(1).max(20),
				})
				.strict(),
		]),
	})
	.strict();
export const EnvelopeGetManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					internalVersion: z.number(),
					type: z.enum(['DOCUMENT', 'TEMPLATE']),
					status: z.enum([
						'DRAFT',
						'PENDING',
						'COMPLETED',
						'REJECTED',
						'CANCELLED',
					]),
					source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					templateType: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
					id: z.string(),
					secondaryId: z.string(),
					externalId: z.union([z.string(), z.null()]),
					createdAt: z.string(),
					updatedAt: z.string(),
					completedAt: z.union([z.string(), z.null()]),
					deletedAt: z.union([z.string(), z.null()]),
					title: z.string(),
					authOptions: z.union([
						z
							.object({
								globalAccessAuth: z.array(
									z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
								),
								globalActionAuth: z.array(
									z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
								),
							})
							.strict(),
						z.null(),
					]),
					formValues: z.union([
						z
							.object({})
							.catchall(z.union([z.string(), z.boolean(), z.number()])),
						z.null(),
					]),
					publicTitle: z.string(),
					publicDescription: z.string(),
					userId: z.number(),
					teamId: z.number(),
					folderId: z.union([z.string(), z.null()]),
					templateId: z.union([z.number(), z.null()]),
					documentMeta: z
						.object({
							signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
							distributionMethod: z.enum(['EMAIL', 'NONE']),
							id: z.string(),
							subject: z.union([z.string(), z.null()]),
							message: z.union([z.string(), z.null()]),
							timezone: z.union([z.string(), z.null()]),
							dateFormat: z.union([z.string(), z.null()]),
							redirectUrl: z.union([z.string(), z.null()]),
							typedSignatureEnabled: z.boolean(),
							uploadSignatureEnabled: z.boolean(),
							drawSignatureEnabled: z.boolean(),
							allowDictateNextSigner: z.boolean(),
							language: z.string(),
							emailSettings: z.union([
								z
									.object({
										recipientSigningRequest: z.boolean(),
										recipientRemoved: z.boolean(),
										recipientSigned: z.boolean(),
										documentPending: z.boolean(),
										documentCompleted: z.boolean(),
										documentDeleted: z.boolean(),
										ownerDocumentCompleted: z.boolean(),
										ownerRecipientExpired: z.boolean(),
										ownerDocumentCreated: z.boolean(),
									})
									.strict(),
								z.null(),
							]),
							emailId: z.union([z.string(), z.null()]),
							emailReplyTo: z.union([z.string(), z.null()]),
							envelopeExpirationPeriod: z
								.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month', 'year']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								])
								.nullable(),
						})
						.strict(),
					recipients: z.array(
						z
							.object({
								envelopeId: z.string(),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								readStatus: z.enum(['NOT_OPENED', 'OPENED']),
								signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
								sendStatus: z.enum(['NOT_SENT', 'SENT']),
								id: z.number(),
								email: z.string(),
								name: z.string(),
								token: z.string(),
								documentDeletedAt: z.union([z.string(), z.null()]),
								expired: z.union([z.string(), z.null()]),
								expiresAt: z.union([z.string(), z.null()]),
								expirationNotifiedAt: z.union([z.string(), z.null()]),
								signedAt: z.union([z.string(), z.null()]),
								authOptions: z.union([
									z
										.object({
											accessAuth: z.array(
												z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
											),
											actionAuth: z.array(
												z.enum([
													'ACCOUNT',
													'PASSKEY',
													'TWO_FACTOR_AUTH',
													'PASSWORD',
													'EXPLICIT_NONE',
												]),
											),
										})
										.strict(),
									z.null(),
								]),
								signingOrder: z.union([z.number(), z.null()]),
								rejectionReason: z.union([z.string(), z.null()]),
							})
							.strict(),
					),
					fields: z.array(
						z
							.object({
								envelopeId: z.string(),
								envelopeItemId: z.string(),
								type: z.enum([
									'SIGNATURE',
									'FREE_SIGNATURE',
									'INITIALS',
									'NAME',
									'EMAIL',
									'DATE',
									'TEXT',
									'NUMBER',
									'RADIO',
									'CHECKBOX',
									'DROPDOWN',
								]),
								id: z.number(),
								secondaryId: z.string(),
								recipientId: z.number(),
								page: z.number(),
								positionX: FreeformJsonSchema,
								positionY: FreeformJsonSchema,
								width: FreeformJsonSchema,
								height: FreeformJsonSchema,
								customText: z.string(),
								inserted: z.boolean(),
								fieldMeta: z
									.union([
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['signature']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['initials']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['name']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['email']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['date']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['text']),
												text: z.string().optional(),
												characterLimit: z.number().min(0).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['number']),
												numberFormat: z
													.union([z.string(), z.null()])
													.optional(),
												value: z.string().optional(),
												minValue: z.union([z.number(), z.null()]).optional(),
												maxValue: z.union([z.number(), z.null()]).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['radio']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['checkbox']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												validationRule: z.string().optional(),
												validationLength: z.number().optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['dropdown']),
												values: z
													.array(
														z
															.object({
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												defaultValue: z.string().optional(),
											})
											.strict(),
									])
									.nullable(),
							})
							.strict(),
					),
					envelopeItems: z.array(
						z
							.object({
								envelopeId: z.string(),
								documentDataId: z.string(),
								id: z.string(),
								title: z.string(),
								order: z.number(),
							})
							.strict(),
					),
					directLink: z.union([
						z
							.object({
								directTemplateRecipientId: z.number(),
								enabled: z.boolean(),
								id: z.string(),
								token: z.string(),
							})
							.strict(),
						z.null(),
					]),
					team: z
						.object({
							id: z.number(),
							url: z.string(),
						})
						.strict(),
					user: z
						.object({
							id: z.number(),
							name: z.string(),
							email: z.string(),
						})
						.strict(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeCreateInputSchema = z
	.object({
		payload: z
			.object({
				title: z.string().min(1).max(255),
				type: z.enum(['DOCUMENT', 'TEMPLATE']),
				delegatedDocumentOwner: z
					.string()
					.regex(
						new RegExp(
							"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
							'u',
						),
					)
					.optional(),
				externalId: z.string().max(255).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				globalAccessAuth: z
					.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
					.optional(),
				globalActionAuth: z
					.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
					.optional(),
				formValues: z
					.object({})
					.catchall(z.union([z.string(), z.boolean(), z.number()]))
					.optional(),
				folderId: z.string().optional(),
				recipients: z
					.array(
						z
							.object({
								email: z.union([
									z.enum(['']),
									z
										.string()
										.max(254)
										.regex(
											new RegExp(
												"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
												'u',
											),
										),
								]),
								name: z.string().max(255),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								signingOrder: z.number().optional(),
								accessAuth: z
									.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
									.optional(),
								actionAuth: z
									.array(
										z.enum([
											'ACCOUNT',
											'PASSKEY',
											'TWO_FACTOR_AUTH',
											'PASSWORD',
											'EXPLICIT_NONE',
										]),
									)
									.optional(),
								fields: z
									.array(
										z.union([
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['SIGNATURE']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['signature']),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['FREE_SIGNATURE']),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['INITIALS']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['initials']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['NAME']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['name']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['EMAIL']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['email']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['DATE']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['date']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['TEXT']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['text']),
															text: z.string().optional(),
															characterLimit: z.number().min(0).optional(),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
															lineHeight: z
																.union([z.number().min(1).max(10), z.null()])
																.optional(),
															letterSpacing: z
																.union([z.number().min(0).max(100), z.null()])
																.optional(),
															verticalAlign: z
																.union([
																	z.literal('top'),
																	z.literal('middle'),
																	z.literal('bottom'),
																	z.literal(null),
																])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['NUMBER']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['number']),
															numberFormat: z
																.union([z.string(), z.null()])
																.optional(),
															value: z.string().optional(),
															minValue: z
																.union([z.number(), z.null()])
																.optional(),
															maxValue: z
																.union([z.number(), z.null()])
																.optional(),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
															lineHeight: z
																.union([z.number().min(1).max(10), z.null()])
																.optional(),
															letterSpacing: z
																.union([z.number().min(0).max(100), z.null()])
																.optional(),
															verticalAlign: z
																.union([
																	z.literal('top'),
																	z.literal('middle'),
																	z.literal('bottom'),
																	z.literal(null),
																])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['RADIO']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['radio']),
															values: z
																.array(
																	z
																		.object({
																			id: z.number(),
																			checked: z.boolean(),
																			value: z.string(),
																		})
																		.strict(),
																)
																.optional(),
															direction: z
																.enum(['vertical', 'horizontal'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['CHECKBOX']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['checkbox']),
															values: z
																.array(
																	z
																		.object({
																			id: z.number(),
																			checked: z.boolean(),
																			value: z.string(),
																		})
																		.strict(),
																)
																.optional(),
															validationRule: z.string().optional(),
															validationLength: z.number().optional(),
															direction: z
																.enum(['vertical', 'horizontal'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													identifier: z
														.union([z.string(), z.number()])
														.optional(),
													page: z.number().min(1),
													positionX: z.number().min(0).max(100),
													positionY: z.number().min(0).max(100),
													width: z.number().min(0).max(100),
													height: z.number().min(0).max(100),
													type: z.enum(['DROPDOWN']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['dropdown']),
															values: z
																.array(
																	z
																		.object({
																			value: z.string(),
																		})
																		.strict(),
																)
																.optional(),
															defaultValue: z.string().optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
										]),
									)
									.optional(),
							})
							.strict(),
					)
					.optional(),
				meta: z
					.object({
						subject: z.string().max(254).optional(),
						message: z.string().max(5000).optional(),
						timezone: z.string().optional(),
						dateFormat: z
							.enum([
								'yyyy-MM-dd hh:mm a',
								'yyyy-MM-dd',
								'dd/MM/yyyy',
								'dd-MM-yyyy',
								'MM/dd/yyyy',
								'yy-MM-dd',
								'MMMM dd, yyyy',
								'EEEE, MMMM dd, yyyy',
								'dd/MM/yyyy hh:mm a',
								'dd/MM/yyyy HH:mm',
								'dd-MM-yyyy hh:mm a',
								'dd-MM-yyyy HH:mm',
								'MM/dd/yyyy hh:mm a',
								'MM/dd/yyyy HH:mm',
								'dd.MM.yyyy',
								'dd.MM.yyyy HH:mm',
								'yyyy-MM-dd HH:mm',
								'yy-MM-dd hh:mm a',
								'yy-MM-dd HH:mm',
								'yyyy-MM-dd HH:mm:ss',
								'MMMM dd, yyyy hh:mm a',
								'MMMM dd, yyyy HH:mm',
								'EEEE, MMMM dd, yyyy hh:mm a',
								'EEEE, MMMM dd, yyyy HH:mm',
								"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
							])
							.optional(),
						distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
						signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
						allowDictateNextSigner: z.boolean().optional(),
						redirectUrl: z.string().optional(),
						language: z
							.enum([
								'de',
								'en',
								'fr',
								'es',
								'it',
								'nl',
								'pl',
								'pt-BR',
								'ja',
								'ko',
								'zh',
							])
							.optional(),
						typedSignatureEnabled: z.boolean().optional(),
						uploadSignatureEnabled: z.boolean().optional(),
						drawSignatureEnabled: z.boolean().optional(),
						emailId: z.union([z.string(), z.null()]).optional(),
						emailReplyTo: z
							.union([
								z
									.string()
									.regex(
										new RegExp(
											"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
											'u',
										),
									),
								z.null(),
							])
							.optional(),
						emailSettings: z
							.union([
								z
									.object({
										recipientSigningRequest: z.boolean().optional(),
										recipientRemoved: z.boolean().optional(),
										recipientSigned: z.boolean().optional(),
										documentPending: z.boolean().optional(),
										documentCompleted: z.boolean().optional(),
										documentDeleted: z.boolean().optional(),
										ownerDocumentCompleted: z.boolean().optional(),
										ownerRecipientExpired: z.boolean().optional(),
										ownerDocumentCreated: z.boolean().optional(),
									})
									.strict(),
								z.null(),
							])
							.optional(),
						envelopeExpirationPeriod: z
							.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month', 'year']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							])
							.nullable()
							.optional(),
						reminderSettings: z
							.union([
								z
									.object({
										sendAfter: z.union([
											z
												.object({
													unit: z.enum(['day', 'week', 'month']),
													amount: z.number().int().min(1),
												})
												.strict(),
											z
												.object({
													disabled: z.union([z.literal(true)]),
												})
												.strict(),
										]),
										repeatEvery: z.union([
											z
												.object({
													unit: z.enum(['day', 'week', 'month']),
													amount: z.number().int().min(1),
												})
												.strict(),
											z
												.object({
													disabled: z.union([z.literal(true)]),
												})
												.strict(),
										]),
									})
									.strict(),
								z.null(),
							])
							.optional(),
					})
					.strict()
					.optional(),
				attachments: z
					.array(
						z
							.object({
								label: z.string().min(1),
								data: z.string(),
								type: z.enum(['link']).optional(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict(),
		files: z
			.array(
				z
					.object({
						filename: z.string().min(1),
						contentType: z.string().min(1),
						contentBase64: z
							.string()
							.min(4)
							.max(22369624)
							.regex(
								new RegExp(
									'^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
								),
							),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const EnvelopeCreateOutputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const EnvelopeUseInputSchema = z
	.object({
		payload: z
			.object({
				envelopeId: z.string(),
				externalId: z.string().optional(),
				recipients: z
					.array(
						z
							.object({
								id: z.number(),
								email: z.union([
									z.enum(['']),
									z
										.string()
										.max(254)
										.regex(
											new RegExp(
												"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
												'u',
											),
										),
								]),
								name: z.string().max(255).optional(),
								signingOrder: z.number().optional(),
							})
							.strict(),
					)
					.optional(),
				distributeDocument: z.boolean().optional(),
				customDocumentData: z
					.array(
						z
							.object({
								identifier: z.union([z.string(), z.number()]),
								envelopeItemId: z.string(),
							})
							.strict(),
					)
					.optional(),
				folderId: z.string().optional(),
				prefillFields: z
					.array(
						z.union([
							z
								.object({
									id: z.number(),
									type: z.enum(['text']),
									label: z.string().optional(),
									placeholder: z.string().optional(),
									value: z.string().optional(),
								})
								.strict(),
							z
								.object({
									id: z.number(),
									type: z.enum(['number']),
									label: z.string().optional(),
									placeholder: z.string().optional(),
									value: z.string().optional(),
								})
								.strict(),
							z
								.object({
									id: z.number(),
									type: z.enum(['radio']),
									label: z.string().optional(),
									value: z.string().optional(),
								})
								.strict(),
							z
								.object({
									id: z.number(),
									type: z.enum(['checkbox']),
									label: z.string().optional(),
									value: z.array(z.string()).optional(),
								})
								.strict(),
							z
								.object({
									id: z.number(),
									type: z.enum(['dropdown']),
									label: z.string().optional(),
									value: z.string().optional(),
								})
								.strict(),
							z
								.object({
									id: z.number(),
									type: z.enum(['date']),
									value: z.string().optional(),
								})
								.strict(),
						]),
					)
					.optional(),
				override: z
					.object({
						title: z.string().min(1).max(255).optional(),
						subject: z.string().max(254).optional(),
						message: z.string().max(5000).optional(),
						timezone: z.string().optional(),
						dateFormat: z
							.enum([
								'yyyy-MM-dd hh:mm a',
								'yyyy-MM-dd',
								'dd/MM/yyyy',
								'dd-MM-yyyy',
								'MM/dd/yyyy',
								'yy-MM-dd',
								'MMMM dd, yyyy',
								'EEEE, MMMM dd, yyyy',
								'dd/MM/yyyy hh:mm a',
								'dd/MM/yyyy HH:mm',
								'dd-MM-yyyy hh:mm a',
								'dd-MM-yyyy HH:mm',
								'MM/dd/yyyy hh:mm a',
								'MM/dd/yyyy HH:mm',
								'dd.MM.yyyy',
								'dd.MM.yyyy HH:mm',
								'yyyy-MM-dd HH:mm',
								'yy-MM-dd hh:mm a',
								'yy-MM-dd HH:mm',
								'yyyy-MM-dd HH:mm:ss',
								'MMMM dd, yyyy hh:mm a',
								'MMMM dd, yyyy HH:mm',
								'EEEE, MMMM dd, yyyy hh:mm a',
								'EEEE, MMMM dd, yyyy HH:mm',
								"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
							])
							.optional(),
						redirectUrl: z.string().optional(),
						distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
						emailSettings: z
							.object({
								recipientSigningRequest: z.boolean().optional(),
								recipientRemoved: z.boolean().optional(),
								recipientSigned: z.boolean().optional(),
								documentPending: z.boolean().optional(),
								documentCompleted: z.boolean().optional(),
								documentDeleted: z.boolean().optional(),
								ownerDocumentCompleted: z.boolean().optional(),
								ownerRecipientExpired: z.boolean().optional(),
								ownerDocumentCreated: z.boolean().optional(),
							})
							.strict()
							.optional(),
						language: z
							.enum([
								'de',
								'en',
								'fr',
								'es',
								'it',
								'nl',
								'pl',
								'pt-BR',
								'ja',
								'ko',
								'zh',
							])
							.optional(),
						typedSignatureEnabled: z.boolean().optional(),
						uploadSignatureEnabled: z.boolean().optional(),
						drawSignatureEnabled: z.boolean().optional(),
						allowDictateNextSigner: z.boolean().optional(),
						envelopeExpirationPeriod: z
							.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month', 'year']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							])
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				attachments: z
					.array(
						z
							.object({
								label: z.string().min(1),
								data: z.string(),
								type: z.enum(['link']).optional(),
							})
							.strict(),
					)
					.optional(),
				formValues: z
					.object({})
					.catchall(z.union([z.string(), z.boolean(), z.number()]))
					.optional(),
			})
			.strict(),
		files: z
			.array(
				z
					.object({
						filename: z.string().min(1),
						contentType: z.string().min(1),
						contentBase64: z
							.string()
							.min(4)
							.max(22369624)
							.regex(
								new RegExp(
									'^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
								),
							),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const EnvelopeUseOutputSchema = z
	.object({
		id: z.string(),
		recipients: z.array(
			z
				.object({
					id: z.number(),
					name: z.string(),
					email: z.string(),
					token: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					signingOrder: z.union([z.number(), z.null()]),
					signingUrl: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeUpdateInputSchema = z
	.object({
		envelopeId: z.string(),
		data: z
			.object({
				title: z.string().min(1).max(255).optional(),
				externalId: z.union([z.string().max(255), z.null()]).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				globalAccessAuth: z
					.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
					.optional(),
				globalActionAuth: z
					.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
					.optional(),
				folderId: z.union([z.string(), z.null()]).optional(),
				templateType: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']).optional(),
			})
			.strict()
			.optional(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
				allowDictateNextSigner: z.boolean().optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				typedSignatureEnabled: z.boolean().optional(),
				uploadSignatureEnabled: z.boolean().optional(),
				drawSignatureEnabled: z.boolean().optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.union([
						z
							.object({
								recipientSigningRequest: z.boolean().optional(),
								recipientRemoved: z.boolean().optional(),
								recipientSigned: z.boolean().optional(),
								documentPending: z.boolean().optional(),
								documentCompleted: z.boolean().optional(),
								documentDeleted: z.boolean().optional(),
								ownerDocumentCompleted: z.boolean().optional(),
								ownerRecipientExpired: z.boolean().optional(),
								ownerDocumentCreated: z.boolean().optional(),
							})
							.strict(),
						z.null(),
					])
					.optional(),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable()
					.optional(),
				reminderSettings: z
					.union([
						z
							.object({
								sendAfter: z.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								]),
								repeatEvery: z.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								]),
							})
							.strict(),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const EnvelopeUpdateOutputSchema = z
	.object({
		internalVersion: z.number(),
		type: z.enum(['DOCUMENT', 'TEMPLATE']),
		status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		templateType: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
		id: z.string(),
		secondaryId: z.string(),
		externalId: z.union([z.string(), z.null()]),
		createdAt: z.string(),
		updatedAt: z.string(),
		completedAt: z.union([z.string(), z.null()]),
		deletedAt: z.union([z.string(), z.null()]),
		title: z.string(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		formValues: z.union([
			z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
			z.null(),
		]),
		publicTitle: z.string(),
		publicDescription: z.string(),
		userId: z.number(),
		teamId: z.number(),
		folderId: z.union([z.string(), z.null()]),
	})
	.strict();

export const EnvelopeDeleteInputSchema = z
	.object({
		envelopeId: z.string(),
	})
	.strict();
export const EnvelopeDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeCancelInputSchema = z
	.object({
		envelopeId: z.string(),
		reason: z.string().optional(),
	})
	.strict();
export const EnvelopeCancelOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const EnvelopeDuplicateInputSchema = z
	.object({
		envelopeId: z.string().min(1),
		includeRecipients: z.boolean().optional(),
		includeFields: z.boolean().optional(),
	})
	.strict();
export const EnvelopeDuplicateOutputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const EnvelopeDistributeInputSchema = z
	.object({
		envelopeId: z.string(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.union([
						z
							.object({
								recipientSigningRequest: z.boolean().optional(),
								recipientRemoved: z.boolean().optional(),
								recipientSigned: z.boolean().optional(),
								documentPending: z.boolean().optional(),
								documentCompleted: z.boolean().optional(),
								documentDeleted: z.boolean().optional(),
								ownerDocumentCompleted: z.boolean().optional(),
								ownerRecipientExpired: z.boolean().optional(),
								ownerDocumentCreated: z.boolean().optional(),
							})
							.strict(),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const EnvelopeDistributeOutputSchema = z
	.object({
		success: z.boolean(),
		id: z.string(),
		recipients: z.array(
			z
				.object({
					id: z.number(),
					name: z.string(),
					email: z.string(),
					token: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					signingOrder: z.union([z.number(), z.null()]),
					signingUrl: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const EnvelopeRedistributeInputSchema = z
	.object({
		envelopeId: z.string(),
		recipients: z.array(z.number()).min(1),
	})
	.strict();
export const EnvelopeRedistributeOutputSchema = z
	.object({
		success: z.boolean(),
		id: z.string(),
		recipients: z.array(
			z
				.object({
					id: z.number(),
					name: z.string(),
					email: z.string(),
					token: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					signingOrder: z.union([z.number(), z.null()]),
					signingUrl: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const DocumentGetInputSchema = z
	.object({
		documentId: z.number(),
	})
	.strict();
export const DocumentGetOutputSchema = z
	.object({
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		userId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		formValues: z.union([
			z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
			z.null(),
		]),
		title: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		completedAt: z.union([z.string(), z.null()]),
		deletedAt: z.union([z.string(), z.null()]),
		teamId: z.number(),
		folderId: z.union([z.string(), z.null()]),
		envelopeId: z.string(),
		internalVersion: z.number(),
		templateId: z.union([z.number(), z.null()]).optional(),
		documentDataId: z.string(),
		documentData: z
			.object({
				type: z.enum(['S3_PATH', 'BYTES', 'BYTES_64']),
				id: z.string(),
				data: z.string(),
				initialData: z.string(),
				envelopeItemId: z.string(),
			})
			.strict(),
		documentMeta: z
			.object({
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
				distributionMethod: z.enum(['EMAIL', 'NONE']),
				id: z.string(),
				subject: z.union([z.string(), z.null()]),
				message: z.union([z.string(), z.null()]),
				timezone: z.union([z.string(), z.null()]),
				dateFormat: z.union([z.string(), z.null()]),
				redirectUrl: z.union([z.string(), z.null()]),
				typedSignatureEnabled: z.boolean(),
				uploadSignatureEnabled: z.boolean(),
				drawSignatureEnabled: z.boolean(),
				allowDictateNextSigner: z.boolean(),
				language: z.string(),
				emailSettings: z.union([
					z
						.object({
							recipientSigningRequest: z.boolean(),
							recipientRemoved: z.boolean(),
							recipientSigned: z.boolean(),
							documentPending: z.boolean(),
							documentCompleted: z.boolean(),
							documentDeleted: z.boolean(),
							ownerDocumentCompleted: z.boolean(),
							ownerRecipientExpired: z.boolean(),
							ownerDocumentCreated: z.boolean(),
						})
						.strict(),
					z.null(),
				]),
				emailId: z.union([z.string(), z.null()]),
				emailReplyTo: z.union([z.string(), z.null()]),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable(),
				reminderSettings: z.union([
					z
						.object({
							sendAfter: z.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							]),
							repeatEvery: z.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							]),
						})
						.strict(),
					z.null(),
				]),
				password: z.union([z.string(), z.null()]),
				documentId: z.number().optional(),
			})
			.strict(),
		envelopeItems: z.array(
			z
				.object({
					id: z.string(),
					envelopeId: z.string(),
				})
				.strict(),
		),
		folder: z.union([
			z
				.object({
					id: z.string(),
					name: z.string(),
					type: z.enum(['DOCUMENT', 'TEMPLATE']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					userId: z.number(),
					teamId: z.number(),
					pinned: z.boolean(),
					parentId: z.union([z.string(), z.null()]),
					createdAt: z.string(),
					updatedAt: z.string(),
				})
				.strict(),
			z.null(),
		]),
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const DocumentGetManyInputSchema = z
	.object({
		documentIds: z.array(z.number()).min(1),
	})
	.strict();
export const DocumentGetManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					status: z.enum([
						'DRAFT',
						'PENDING',
						'COMPLETED',
						'REJECTED',
						'CANCELLED',
					]),
					source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
					id: z.number(),
					externalId: z.union([z.string(), z.null()]),
					userId: z.number(),
					authOptions: z.union([
						z
							.object({
								globalAccessAuth: z.array(
									z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
								),
								globalActionAuth: z.array(
									z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
								),
							})
							.strict(),
						z.null(),
					]),
					formValues: z.union([
						z
							.object({})
							.catchall(z.union([z.string(), z.boolean(), z.number()])),
						z.null(),
					]),
					title: z.string(),
					createdAt: z.string(),
					updatedAt: z.string(),
					completedAt: z.union([z.string(), z.null()]),
					deletedAt: z.union([z.string(), z.null()]),
					teamId: z.number(),
					folderId: z.union([z.string(), z.null()]),
					useLegacyFieldInsertion: z.boolean(),
					envelopeId: z.string(),
					internalVersion: z.number(),
					documentDataId: z.string(),
					templateId: z.union([z.number(), z.null()]).optional(),
					user: z
						.object({
							id: z.number(),
							name: z.union([z.string(), z.null()]),
							email: z.string(),
						})
						.strict(),
					recipients: z.array(
						z
							.object({
								envelopeId: z.string(),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								readStatus: z.enum(['NOT_OPENED', 'OPENED']),
								signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
								sendStatus: z.enum(['NOT_SENT', 'SENT']),
								id: z.number(),
								email: z.string(),
								name: z.string(),
								token: z.string(),
								documentDeletedAt: z.union([z.string(), z.null()]),
								expired: z.union([z.string(), z.null()]),
								expiresAt: z.union([z.string(), z.null()]),
								expirationNotifiedAt: z.union([z.string(), z.null()]),
								signedAt: z.union([z.string(), z.null()]),
								authOptions: z.union([
									z
										.object({
											accessAuth: z.array(
												z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
											),
											actionAuth: z.array(
												z.enum([
													'ACCOUNT',
													'PASSKEY',
													'TWO_FACTOR_AUTH',
													'PASSWORD',
													'EXPLICIT_NONE',
												]),
											),
										})
										.strict(),
									z.null(),
								]),
								signingOrder: z.union([z.number(), z.null()]),
								rejectionReason: z.union([z.string(), z.null()]),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					team: z.union([
						z
							.object({
								id: z.number(),
								url: z.string(),
							})
							.strict(),
						z.null(),
					]),
				})
				.strict(),
		),
	})
	.strict();

export const DocumentFindInputSchema = z
	.object({
		query: z.string().optional(),
		page: z.number().min(1).optional(),
		perPage: z.number().min(1).max(100).optional(),
		templateId: z.number().optional(),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']).optional(),
		status: z
			.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED'])
			.optional(),
		hasExpiredRecipients: z.enum(['true', 'false']).optional(),
		folderId: z.string().optional(),
		orderByColumn: z.enum(['createdAt']).optional(),
		orderByDirection: z.enum(['asc', 'desc']).optional(),
	})
	.strict();
export const DocumentFindOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					status: z.enum([
						'DRAFT',
						'PENDING',
						'COMPLETED',
						'REJECTED',
						'CANCELLED',
					]),
					source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
					id: z.number(),
					externalId: z.union([z.string(), z.null()]),
					userId: z.number(),
					authOptions: z.union([
						z
							.object({
								globalAccessAuth: z.array(
									z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
								),
								globalActionAuth: z.array(
									z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
								),
							})
							.strict(),
						z.null(),
					]),
					formValues: z.union([
						z
							.object({})
							.catchall(z.union([z.string(), z.boolean(), z.number()])),
						z.null(),
					]),
					title: z.string(),
					createdAt: z.string(),
					updatedAt: z.string(),
					completedAt: z.union([z.string(), z.null()]),
					deletedAt: z.union([z.string(), z.null()]),
					teamId: z.number(),
					folderId: z.union([z.string(), z.null()]),
					useLegacyFieldInsertion: z.boolean(),
					envelopeId: z.string(),
					internalVersion: z.number(),
					documentDataId: z.string(),
					templateId: z.union([z.number(), z.null()]).optional(),
					user: z
						.object({
							id: z.number(),
							name: z.union([z.string(), z.null()]),
							email: z.string(),
						})
						.strict(),
					recipients: z.array(
						z
							.object({
								envelopeId: z.string(),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								readStatus: z.enum(['NOT_OPENED', 'OPENED']),
								signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
								sendStatus: z.enum(['NOT_SENT', 'SENT']),
								id: z.number(),
								email: z.string(),
								name: z.string(),
								token: z.string(),
								documentDeletedAt: z.union([z.string(), z.null()]),
								expired: z.union([z.string(), z.null()]),
								expiresAt: z.union([z.string(), z.null()]),
								expirationNotifiedAt: z.union([z.string(), z.null()]),
								signedAt: z.union([z.string(), z.null()]),
								authOptions: z.union([
									z
										.object({
											accessAuth: z.array(
												z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
											),
											actionAuth: z.array(
												z.enum([
													'ACCOUNT',
													'PASSKEY',
													'TWO_FACTOR_AUTH',
													'PASSWORD',
													'EXPLICIT_NONE',
												]),
											),
										})
										.strict(),
									z.null(),
								]),
								signingOrder: z.union([z.number(), z.null()]),
								rejectionReason: z.union([z.string(), z.null()]),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					team: z.union([
						z
							.object({
								id: z.number(),
								url: z.string(),
							})
							.strict(),
						z.null(),
					]),
				})
				.strict(),
		),
		count: z.number(),
		currentPage: z.number(),
		perPage: z.number(),
		totalPages: z.number(),
	})
	.strict();

export const DocumentCreateInputSchema = z
	.object({
		payload: z
			.object({
				title: z.string().min(1).max(255),
				externalId: z.string().max(255).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				globalAccessAuth: z
					.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
					.optional(),
				globalActionAuth: z
					.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
					.optional(),
				formValues: z
					.object({})
					.catchall(z.union([z.string(), z.boolean(), z.number()]))
					.optional(),
				folderId: z.string().optional(),
				recipients: z
					.array(
						z
							.object({
								email: z
									.string()
									.min(1)
									.max(254)
									.regex(
										new RegExp(
											"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
											'u',
										),
									),
								name: z.string().max(255),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								signingOrder: z.number().optional(),
								accessAuth: z
									.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
									.optional(),
								actionAuth: z
									.array(
										z.enum([
											'ACCOUNT',
											'PASSKEY',
											'TWO_FACTOR_AUTH',
											'PASSWORD',
											'EXPLICIT_NONE',
										]),
									)
									.optional(),
								fields: z
									.array(
										z.union([
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['SIGNATURE']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['signature']),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['FREE_SIGNATURE']),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['INITIALS']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['initials']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['NAME']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['name']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['EMAIL']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['email']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['DATE']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['date']),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['TEXT']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['text']),
															text: z.string().optional(),
															characterLimit: z.number().min(0).optional(),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
															lineHeight: z
																.union([z.number().min(1).max(10), z.null()])
																.optional(),
															letterSpacing: z
																.union([z.number().min(0).max(100), z.null()])
																.optional(),
															verticalAlign: z
																.union([
																	z.literal('top'),
																	z.literal('middle'),
																	z.literal('bottom'),
																	z.literal(null),
																])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['NUMBER']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['number']),
															numberFormat: z
																.union([z.string(), z.null()])
																.optional(),
															value: z.string().optional(),
															minValue: z
																.union([z.number(), z.null()])
																.optional(),
															maxValue: z
																.union([z.number(), z.null()])
																.optional(),
															textAlign: z
																.enum(['left', 'center', 'right'])
																.optional(),
															lineHeight: z
																.union([z.number().min(1).max(10), z.null()])
																.optional(),
															letterSpacing: z
																.union([z.number().min(0).max(100), z.null()])
																.optional(),
															verticalAlign: z
																.union([
																	z.literal('top'),
																	z.literal('middle'),
																	z.literal('bottom'),
																	z.literal(null),
																])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['RADIO']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['radio']),
															values: z
																.array(
																	z
																		.object({
																			id: z.number(),
																			checked: z.boolean(),
																			value: z.string(),
																		})
																		.strict(),
																)
																.optional(),
															direction: z
																.enum(['vertical', 'horizontal'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['CHECKBOX']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['checkbox']),
															values: z
																.array(
																	z
																		.object({
																			id: z.number(),
																			checked: z.boolean(),
																			value: z.string(),
																		})
																		.strict(),
																)
																.optional(),
															validationRule: z.string().optional(),
															validationLength: z.number().optional(),
															direction: z
																.enum(['vertical', 'horizontal'])
																.optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
											z
												.object({
													pageNumber: z.number().min(1),
													pageX: z.number().min(0),
													pageY: z.number().min(0),
													width: z.number().min(1),
													height: z.number().min(1),
													type: z.enum(['DROPDOWN']),
													fieldMeta: z
														.object({
															label: z.string().optional(),
															placeholder: z.string().optional(),
															required: z.boolean().optional(),
															readOnly: z.boolean().optional(),
															fontSize: z.number().min(8).max(96).optional(),
															overflow: z
																.enum([
																	'auto',
																	'horizontal',
																	'vertical',
																	'crop',
																])
																.optional(),
															type: z.enum(['dropdown']),
															values: z
																.array(
																	z
																		.object({
																			value: z.string(),
																		})
																		.strict(),
																)
																.optional(),
															defaultValue: z.string().optional(),
														})
														.strict()
														.optional(),
												})
												.strict(),
										]),
									)
									.optional(),
							})
							.strict(),
					)
					.optional(),
				attachments: z
					.array(
						z
							.object({
								label: z.string().min(1),
								data: z.string(),
								type: z.enum(['link']).optional(),
							})
							.strict(),
					)
					.optional(),
				meta: z
					.object({
						subject: z.string().max(254).optional(),
						message: z.string().max(5000).optional(),
						timezone: z.string().optional(),
						dateFormat: z
							.enum([
								'yyyy-MM-dd hh:mm a',
								'yyyy-MM-dd',
								'dd/MM/yyyy',
								'dd-MM-yyyy',
								'MM/dd/yyyy',
								'yy-MM-dd',
								'MMMM dd, yyyy',
								'EEEE, MMMM dd, yyyy',
								'dd/MM/yyyy hh:mm a',
								'dd/MM/yyyy HH:mm',
								'dd-MM-yyyy hh:mm a',
								'dd-MM-yyyy HH:mm',
								'MM/dd/yyyy hh:mm a',
								'MM/dd/yyyy HH:mm',
								'dd.MM.yyyy',
								'dd.MM.yyyy HH:mm',
								'yyyy-MM-dd HH:mm',
								'yy-MM-dd hh:mm a',
								'yy-MM-dd HH:mm',
								'yyyy-MM-dd HH:mm:ss',
								'MMMM dd, yyyy hh:mm a',
								'MMMM dd, yyyy HH:mm',
								'EEEE, MMMM dd, yyyy hh:mm a',
								'EEEE, MMMM dd, yyyy HH:mm',
								"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
							])
							.optional(),
						distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
						signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
						allowDictateNextSigner: z.boolean().optional(),
						redirectUrl: z.string().optional(),
						language: z
							.enum([
								'de',
								'en',
								'fr',
								'es',
								'it',
								'nl',
								'pl',
								'pt-BR',
								'ja',
								'ko',
								'zh',
							])
							.optional(),
						typedSignatureEnabled: z.boolean().optional(),
						uploadSignatureEnabled: z.boolean().optional(),
						drawSignatureEnabled: z.boolean().optional(),
						emailId: z.union([z.string(), z.null()]).optional(),
						emailReplyTo: z
							.union([
								z
									.string()
									.regex(
										new RegExp(
											"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
											'u',
										),
									),
								z.null(),
							])
							.optional(),
						emailSettings: z
							.union([
								z
									.object({
										recipientSigningRequest: z.boolean().optional(),
										recipientRemoved: z.boolean().optional(),
										recipientSigned: z.boolean().optional(),
										documentPending: z.boolean().optional(),
										documentCompleted: z.boolean().optional(),
										documentDeleted: z.boolean().optional(),
										ownerDocumentCompleted: z.boolean().optional(),
										ownerRecipientExpired: z.boolean().optional(),
										ownerDocumentCreated: z.boolean().optional(),
									})
									.strict(),
								z.null(),
							])
							.optional(),
						envelopeExpirationPeriod: z
							.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month', 'year']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							])
							.nullable()
							.optional(),
						reminderSettings: z
							.union([
								z
									.object({
										sendAfter: z.union([
											z
												.object({
													unit: z.enum(['day', 'week', 'month']),
													amount: z.number().int().min(1),
												})
												.strict(),
											z
												.object({
													disabled: z.union([z.literal(true)]),
												})
												.strict(),
										]),
										repeatEvery: z.union([
											z
												.object({
													unit: z.enum(['day', 'week', 'month']),
													amount: z.number().int().min(1),
												})
												.strict(),
											z
												.object({
													disabled: z.union([z.literal(true)]),
												})
												.strict(),
										]),
									})
									.strict(),
								z.null(),
							])
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict(),
		file: z
			.object({
				filename: z.string().min(1),
				contentType: z.string().min(1),
				contentBase64: z
					.string()
					.min(4)
					.max(22369624)
					.regex(
						new RegExp(
							'^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
						),
					),
			})
			.strict(),
	})
	.strict();
export const DocumentCreateOutputSchema = z
	.object({
		envelopeId: z.string(),
		id: z.number(),
	})
	.strict();

export const DocumentUpdateInputSchema = z
	.object({
		documentId: z.number(),
		data: z
			.object({
				title: z.string().min(1).max(255).optional(),
				externalId: z.union([z.string().max(255), z.null()]).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				globalAccessAuth: z
					.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
					.optional(),
				globalActionAuth: z
					.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
					.optional(),
				useLegacyFieldInsertion: z.boolean().optional(),
				folderId: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
				allowDictateNextSigner: z.boolean().optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				typedSignatureEnabled: z.boolean().optional(),
				uploadSignatureEnabled: z.boolean().optional(),
				drawSignatureEnabled: z.boolean().optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.union([
						z
							.object({
								recipientSigningRequest: z.boolean().optional(),
								recipientRemoved: z.boolean().optional(),
								recipientSigned: z.boolean().optional(),
								documentPending: z.boolean().optional(),
								documentCompleted: z.boolean().optional(),
								documentDeleted: z.boolean().optional(),
								ownerDocumentCompleted: z.boolean().optional(),
								ownerRecipientExpired: z.boolean().optional(),
								ownerDocumentCreated: z.boolean().optional(),
							})
							.strict(),
						z.null(),
					])
					.optional(),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable()
					.optional(),
				reminderSettings: z
					.union([
						z
							.object({
								sendAfter: z.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								]),
								repeatEvery: z.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								]),
							})
							.strict(),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const DocumentUpdateOutputSchema = z
	.object({
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		userId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		formValues: z.union([
			z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
			z.null(),
		]),
		title: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		completedAt: z.union([z.string(), z.null()]),
		deletedAt: z.union([z.string(), z.null()]),
		teamId: z.number(),
		folderId: z.union([z.string(), z.null()]),
		useLegacyFieldInsertion: z.boolean(),
		envelopeId: z.string(),
		internalVersion: z.number(),
		documentDataId: z.string(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const DocumentDeleteInputSchema = z
	.object({
		documentId: z.number(),
	})
	.strict();
export const DocumentDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const DocumentDuplicateInputSchema = z
	.object({
		documentId: z.number(),
	})
	.strict();
export const DocumentDuplicateOutputSchema = z
	.object({
		id: z.string(),
		documentId: z.number(),
	})
	.strict();

export const DocumentDistributeInputSchema = z
	.object({
		documentId: z.number(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.object({
						recipientSigningRequest: z.boolean().optional(),
						recipientRemoved: z.boolean().optional(),
						recipientSigned: z.boolean().optional(),
						documentPending: z.boolean().optional(),
						documentCompleted: z.boolean().optional(),
						documentDeleted: z.boolean().optional(),
						ownerDocumentCompleted: z.boolean().optional(),
						ownerRecipientExpired: z.boolean().optional(),
						ownerDocumentCreated: z.boolean().optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const DocumentDistributeOutputSchema = z
	.object({
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		userId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		formValues: z.union([
			z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
			z.null(),
		]),
		title: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		completedAt: z.union([z.string(), z.null()]),
		deletedAt: z.union([z.string(), z.null()]),
		teamId: z.number(),
		folderId: z.union([z.string(), z.null()]),
		useLegacyFieldInsertion: z.boolean(),
		envelopeId: z.string(),
		internalVersion: z.number(),
		documentDataId: z.string(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const DocumentRedistributeInputSchema = z
	.object({
		documentId: z.number(),
		recipients: z.array(z.number()).min(1),
	})
	.strict();
export const DocumentRedistributeOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const DocumentDownloadInputSchema = z
	.object({
		documentId: z.number(),
		version: z.enum(['original', 'signed']).optional(),
	})
	.strict();
export const DocumentDownloadOutputSchema = z
	.object({
		kind: z.literal('binary'),
		contentType: z.literal('application/pdf'),
		base64: z.base64(),
		size: z.number().int().min(0),
	})
	.strict();

export const DocumentDownloadBetaInputSchema = z
	.object({
		documentId: z.number(),
		version: z.enum(['original', 'signed']).optional(),
	})
	.strict();
export const DocumentDownloadBetaOutputSchema = z
	.object({
		downloadUrl: z.string(),
		filename: z.string(),
		contentType: z.string(),
	})
	.strict();

export const DocumentCreateDocumentTemporaryInputSchema = z
	.object({
		title: z.string().min(1).max(255),
		externalId: z.string().max(255).optional(),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']).optional(),
		globalAccessAuth: z
			.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
			.optional(),
		globalActionAuth: z
			.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
			.optional(),
		formValues: z
			.object({})
			.catchall(z.union([z.string(), z.boolean(), z.number()]))
			.optional(),
		folderId: z.string().optional(),
		recipients: z
			.array(
				z
					.object({
						email: z
							.string()
							.min(1)
							.max(254)
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						name: z.string().max(255),
						role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
						signingOrder: z.number().optional(),
						accessAuth: z
							.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
							.optional(),
						actionAuth: z
							.array(
								z.enum([
									'ACCOUNT',
									'PASSKEY',
									'TWO_FACTOR_AUTH',
									'PASSWORD',
									'EXPLICIT_NONE',
								]),
							)
							.optional(),
						fields: z
							.array(
								z.union([
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['SIGNATURE']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['signature']),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['FREE_SIGNATURE']),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['INITIALS']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['initials']),
													textAlign: z
														.enum(['left', 'center', 'right'])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['NAME']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['name']),
													textAlign: z
														.enum(['left', 'center', 'right'])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['EMAIL']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['email']),
													textAlign: z
														.enum(['left', 'center', 'right'])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['DATE']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['date']),
													textAlign: z
														.enum(['left', 'center', 'right'])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['TEXT']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['text']),
													text: z.string().optional(),
													characterLimit: z.number().min(0).optional(),
													textAlign: z
														.enum(['left', 'center', 'right'])
														.optional(),
													lineHeight: z
														.union([z.number().min(1).max(10), z.null()])
														.optional(),
													letterSpacing: z
														.union([z.number().min(0).max(100), z.null()])
														.optional(),
													verticalAlign: z
														.union([
															z.literal('top'),
															z.literal('middle'),
															z.literal('bottom'),
															z.literal(null),
														])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['NUMBER']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['number']),
													numberFormat: z
														.union([z.string(), z.null()])
														.optional(),
													value: z.string().optional(),
													minValue: z.union([z.number(), z.null()]).optional(),
													maxValue: z.union([z.number(), z.null()]).optional(),
													textAlign: z
														.enum(['left', 'center', 'right'])
														.optional(),
													lineHeight: z
														.union([z.number().min(1).max(10), z.null()])
														.optional(),
													letterSpacing: z
														.union([z.number().min(0).max(100), z.null()])
														.optional(),
													verticalAlign: z
														.union([
															z.literal('top'),
															z.literal('middle'),
															z.literal('bottom'),
															z.literal(null),
														])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['RADIO']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['radio']),
													values: z
														.array(
															z
																.object({
																	id: z.number(),
																	checked: z.boolean(),
																	value: z.string(),
																})
																.strict(),
														)
														.optional(),
													direction: z
														.enum(['vertical', 'horizontal'])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['CHECKBOX']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['checkbox']),
													values: z
														.array(
															z
																.object({
																	id: z.number(),
																	checked: z.boolean(),
																	value: z.string(),
																})
																.strict(),
														)
														.optional(),
													validationRule: z.string().optional(),
													validationLength: z.number().optional(),
													direction: z
														.enum(['vertical', 'horizontal'])
														.optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
									z
										.object({
											pageNumber: z.number().min(1),
											pageX: z.number().min(0),
											pageY: z.number().min(0),
											width: z.number().min(1),
											height: z.number().min(1),
											type: z.enum(['DROPDOWN']),
											fieldMeta: z
												.object({
													label: z.string().optional(),
													placeholder: z.string().optional(),
													required: z.boolean().optional(),
													readOnly: z.boolean().optional(),
													fontSize: z.number().min(8).max(96).optional(),
													overflow: z
														.enum(['auto', 'horizontal', 'vertical', 'crop'])
														.optional(),
													type: z.enum(['dropdown']),
													values: z
														.array(
															z
																.object({
																	value: z.string(),
																})
																.strict(),
														)
														.optional(),
													defaultValue: z.string().optional(),
												})
												.strict()
												.optional(),
										})
										.strict(),
								]),
							)
							.optional(),
					})
					.strict(),
			)
			.optional(),
		attachments: z
			.array(
				z
					.object({
						label: z.string().min(1),
						data: z.string(),
						type: z.enum(['link']).optional(),
					})
					.strict(),
			)
			.optional(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
				allowDictateNextSigner: z.boolean().optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				typedSignatureEnabled: z.boolean().optional(),
				uploadSignatureEnabled: z.boolean().optional(),
				drawSignatureEnabled: z.boolean().optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.union([
						z
							.object({
								recipientSigningRequest: z.boolean().optional(),
								recipientRemoved: z.boolean().optional(),
								recipientSigned: z.boolean().optional(),
								documentPending: z.boolean().optional(),
								documentCompleted: z.boolean().optional(),
								documentDeleted: z.boolean().optional(),
								ownerDocumentCompleted: z.boolean().optional(),
								ownerRecipientExpired: z.boolean().optional(),
								ownerDocumentCreated: z.boolean().optional(),
							})
							.strict(),
						z.null(),
					])
					.optional(),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable()
					.optional(),
				reminderSettings: z
					.union([
						z
							.object({
								sendAfter: z.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								]),
								repeatEvery: z.union([
									z
										.object({
											unit: z.enum(['day', 'week', 'month']),
											amount: z.number().int().min(1),
										})
										.strict(),
									z
										.object({
											disabled: z.union([z.literal(true)]),
										})
										.strict(),
								]),
							})
							.strict(),
						z.null(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const DocumentCreateDocumentTemporaryOutputSchema = z
	.object({
		document: z
			.object({
				visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
				status: z.enum([
					'DRAFT',
					'PENDING',
					'COMPLETED',
					'REJECTED',
					'CANCELLED',
				]),
				source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
				id: z.number(),
				externalId: z.union([z.string(), z.null()]),
				userId: z.number(),
				authOptions: z.union([
					z
						.object({
							globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
							globalActionAuth: z.array(
								z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
							),
						})
						.strict(),
					z.null(),
				]),
				formValues: z.union([
					z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
					z.null(),
				]),
				title: z.string(),
				createdAt: z.string(),
				updatedAt: z.string(),
				completedAt: z.union([z.string(), z.null()]),
				deletedAt: z.union([z.string(), z.null()]),
				teamId: z.number(),
				folderId: z.union([z.string(), z.null()]),
				envelopeId: z.string(),
				internalVersion: z.number(),
				templateId: z.union([z.number(), z.null()]).optional(),
				documentDataId: z.string(),
				documentData: z
					.object({
						type: z.enum(['S3_PATH', 'BYTES', 'BYTES_64']),
						id: z.string(),
						data: z.string(),
						initialData: z.string(),
						envelopeItemId: z.string(),
					})
					.strict(),
				documentMeta: z
					.object({
						signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
						distributionMethod: z.enum(['EMAIL', 'NONE']),
						id: z.string(),
						subject: z.union([z.string(), z.null()]),
						message: z.union([z.string(), z.null()]),
						timezone: z.union([z.string(), z.null()]),
						dateFormat: z.union([z.string(), z.null()]),
						redirectUrl: z.union([z.string(), z.null()]),
						typedSignatureEnabled: z.boolean(),
						uploadSignatureEnabled: z.boolean(),
						drawSignatureEnabled: z.boolean(),
						allowDictateNextSigner: z.boolean(),
						language: z.string(),
						emailSettings: z.union([
							z
								.object({
									recipientSigningRequest: z.boolean(),
									recipientRemoved: z.boolean(),
									recipientSigned: z.boolean(),
									documentPending: z.boolean(),
									documentCompleted: z.boolean(),
									documentDeleted: z.boolean(),
									ownerDocumentCompleted: z.boolean(),
									ownerRecipientExpired: z.boolean(),
									ownerDocumentCreated: z.boolean(),
								})
								.strict(),
							z.null(),
						]),
						emailId: z.union([z.string(), z.null()]),
						emailReplyTo: z.union([z.string(), z.null()]),
						envelopeExpirationPeriod: z
							.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month', 'year']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							])
							.nullable(),
						reminderSettings: z.union([
							z
								.object({
									sendAfter: z.union([
										z
											.object({
												unit: z.enum(['day', 'week', 'month']),
												amount: z.number().int().min(1),
											})
											.strict(),
										z
											.object({
												disabled: z.union([z.literal(true)]),
											})
											.strict(),
									]),
									repeatEvery: z.union([
										z
											.object({
												unit: z.enum(['day', 'week', 'month']),
												amount: z.number().int().min(1),
											})
											.strict(),
										z
											.object({
												disabled: z.union([z.literal(true)]),
											})
											.strict(),
									]),
								})
								.strict(),
							z.null(),
						]),
						password: z.union([z.string(), z.null()]),
						documentId: z.number().optional(),
					})
					.strict(),
				envelopeItems: z.array(
					z
						.object({
							id: z.string(),
							envelopeId: z.string(),
						})
						.strict(),
				),
				folder: z.union([
					z
						.object({
							id: z.string(),
							name: z.string(),
							type: z.enum(['DOCUMENT', 'TEMPLATE']),
							visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
							userId: z.number(),
							teamId: z.number(),
							pinned: z.boolean(),
							parentId: z.union([z.string(), z.null()]),
							createdAt: z.string(),
							updatedAt: z.string(),
						})
						.strict(),
					z.null(),
				]),
				recipients: z.array(
					z
						.object({
							envelopeId: z.string(),
							role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
							readStatus: z.enum(['NOT_OPENED', 'OPENED']),
							signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
							sendStatus: z.enum(['NOT_SENT', 'SENT']),
							id: z.number(),
							email: z.string(),
							name: z.string(),
							token: z.string(),
							documentDeletedAt: z.union([z.string(), z.null()]),
							expired: z.union([z.string(), z.null()]),
							expiresAt: z.union([z.string(), z.null()]),
							expirationNotifiedAt: z.union([z.string(), z.null()]),
							signedAt: z.union([z.string(), z.null()]),
							authOptions: z.union([
								z
									.object({
										accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
										actionAuth: z.array(
											z.enum([
												'ACCOUNT',
												'PASSKEY',
												'TWO_FACTOR_AUTH',
												'PASSWORD',
												'EXPLICIT_NONE',
											]),
										),
									})
									.strict(),
								z.null(),
							]),
							signingOrder: z.union([z.number(), z.null()]),
							rejectionReason: z.union([z.string(), z.null()]),
							documentId: z.union([z.number(), z.null()]).optional(),
							templateId: z.union([z.number(), z.null()]).optional(),
						})
						.strict(),
				),
				fields: z.array(
					z
						.object({
							envelopeId: z.string(),
							envelopeItemId: z.string(),
							type: z.enum([
								'SIGNATURE',
								'FREE_SIGNATURE',
								'INITIALS',
								'NAME',
								'EMAIL',
								'DATE',
								'TEXT',
								'NUMBER',
								'RADIO',
								'CHECKBOX',
								'DROPDOWN',
							]),
							id: z.number(),
							secondaryId: z.string(),
							recipientId: z.number(),
							page: z.number(),
							positionX: FreeformJsonSchema,
							positionY: FreeformJsonSchema,
							width: FreeformJsonSchema,
							height: FreeformJsonSchema,
							customText: z.string(),
							inserted: z.boolean(),
							fieldMeta: z
								.union([
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z.enum([
												'auto',
												'horizontal',
												'vertical',
												'crop',
											]),
											type: z.enum(['signature']),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['initials']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['name']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z.enum([
												'auto',
												'horizontal',
												'vertical',
												'crop',
											]),
											type: z.enum(['email']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z.enum([
												'auto',
												'horizontal',
												'vertical',
												'crop',
											]),
											type: z.enum(['date']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['text']),
											text: z.string().optional(),
											characterLimit: z.number().min(0).optional(),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
											lineHeight: z
												.union([z.number().min(1).max(10), z.null()])
												.optional(),
											letterSpacing: z
												.union([z.number().min(0).max(100), z.null()])
												.optional(),
											verticalAlign: z
												.union([
													z.literal('top'),
													z.literal('middle'),
													z.literal('bottom'),
													z.literal(null),
												])
												.optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['number']),
											numberFormat: z.union([z.string(), z.null()]).optional(),
											value: z.string().optional(),
											minValue: z.union([z.number(), z.null()]).optional(),
											maxValue: z.union([z.number(), z.null()]).optional(),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
											lineHeight: z
												.union([z.number().min(1).max(10), z.null()])
												.optional(),
											letterSpacing: z
												.union([z.number().min(0).max(100), z.null()])
												.optional(),
											verticalAlign: z
												.union([
													z.literal('top'),
													z.literal('middle'),
													z.literal('bottom'),
													z.literal(null),
												])
												.optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['radio']),
											values: z
												.array(
													z
														.object({
															id: z.number(),
															checked: z.boolean(),
															value: z.string(),
														})
														.strict(),
												)
												.optional(),
											direction: z.enum(['vertical', 'horizontal']),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['checkbox']),
											values: z
												.array(
													z
														.object({
															id: z.number(),
															checked: z.boolean(),
															value: z.string(),
														})
														.strict(),
												)
												.optional(),
											validationRule: z.string().optional(),
											validationLength: z.number().optional(),
											direction: z.enum(['vertical', 'horizontal']),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['dropdown']),
											values: z
												.array(
													z
														.object({
															value: z.string(),
														})
														.strict(),
												)
												.optional(),
											defaultValue: z.string().optional(),
										})
										.strict(),
								])
								.nullable(),
							documentId: z.union([z.number(), z.null()]).optional(),
							templateId: z.union([z.number(), z.null()]).optional(),
						})
						.strict(),
				),
			})
			.strict(),
		uploadUrl: z.string(),
	})
	.strict();

export const DocumentAttachmentCreateInputSchema = z
	.object({
		documentId: z.number(),
		data: z
			.object({
				label: z.string().min(1),
				data: z.string(),
			})
			.strict(),
	})
	.strict();
export const DocumentAttachmentCreateOutputSchema = z
	.object({
		id: z.string(),
	})
	.strict();

export const DocumentAttachmentUpdateInputSchema = z
	.object({
		id: z.string(),
		data: z
			.object({
				label: z.string().min(1),
				data: z.string(),
			})
			.strict(),
	})
	.strict();
export const DocumentAttachmentUpdateOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const DocumentAttachmentDeleteInputSchema = z
	.object({
		id: z.string(),
	})
	.strict();
export const DocumentAttachmentDeleteOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const DocumentAttachmentFindInputSchema = z
	.object({
		documentId: z.number(),
	})
	.strict();
export const DocumentAttachmentFindOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					type: z.enum(['link']),
					label: z.string(),
					data: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const FieldGetDocumentFieldInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export const FieldGetDocumentFieldOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const FieldCreateDocumentFieldInputSchema = z
	.object({
		documentId: z.number(),
		field: z.union([
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['SIGNATURE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['signature']),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['FREE_SIGNATURE']),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['INITIALS']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['initials']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['NAME']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['name']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['EMAIL']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['email']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['DATE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['date']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['TEXT']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['text']),
							text: z.string().optional(),
							characterLimit: z.number().min(0).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['NUMBER']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['number']),
							numberFormat: z.union([z.string(), z.null()]).optional(),
							value: z.string().optional(),
							minValue: z.union([z.number(), z.null()]).optional(),
							maxValue: z.union([z.number(), z.null()]).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['RADIO']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['radio']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['CHECKBOX']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['checkbox']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							validationRule: z.string().optional(),
							validationLength: z.number().optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['DROPDOWN']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['dropdown']),
							values: z
								.array(
									z
										.object({
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							defaultValue: z.string().optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
		]),
	})
	.strict();
export const FieldCreateDocumentFieldOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const FieldCreateDocumentFieldsInputSchema = z
	.object({
		documentId: z.number(),
		fields: z.array(
			z.union([
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['SIGNATURE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['signature']),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['FREE_SIGNATURE']),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['INITIALS']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['initials']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['NAME']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['name']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['EMAIL']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['email']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['DATE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['date']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['TEXT']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['text']),
								text: z.string().optional(),
								characterLimit: z.number().min(0).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['NUMBER']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['number']),
								numberFormat: z.union([z.string(), z.null()]).optional(),
								value: z.string().optional(),
								minValue: z.union([z.number(), z.null()]).optional(),
								maxValue: z.union([z.number(), z.null()]).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['RADIO']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['radio']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['CHECKBOX']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['checkbox']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								validationRule: z.string().optional(),
								validationLength: z.number().optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['DROPDOWN']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['dropdown']),
								values: z
									.array(
										z
											.object({
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								defaultValue: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			]),
		),
	})
	.strict();
export const FieldCreateDocumentFieldsOutputSchema = z
	.object({
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const FieldUpdateDocumentFieldInputSchema = z
	.object({
		documentId: z.number(),
		field: z.union([
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['SIGNATURE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['signature']),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['FREE_SIGNATURE']),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['INITIALS']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['initials']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['NAME']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['name']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['EMAIL']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['email']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['DATE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['date']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['TEXT']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['text']),
							text: z.string().optional(),
							characterLimit: z.number().min(0).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['NUMBER']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['number']),
							numberFormat: z.union([z.string(), z.null()]).optional(),
							value: z.string().optional(),
							minValue: z.union([z.number(), z.null()]).optional(),
							maxValue: z.union([z.number(), z.null()]).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['RADIO']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['radio']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['CHECKBOX']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['checkbox']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							validationRule: z.string().optional(),
							validationLength: z.number().optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['DROPDOWN']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['dropdown']),
							values: z
								.array(
									z
										.object({
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							defaultValue: z.string().optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
		]),
	})
	.strict();
export const FieldUpdateDocumentFieldOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const FieldUpdateDocumentFieldsInputSchema = z
	.object({
		documentId: z.number(),
		fields: z.array(
			z.union([
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['SIGNATURE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['signature']),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['FREE_SIGNATURE']),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['INITIALS']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['initials']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['NAME']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['name']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['EMAIL']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['email']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['DATE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['date']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['TEXT']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['text']),
								text: z.string().optional(),
								characterLimit: z.number().min(0).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['NUMBER']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['number']),
								numberFormat: z.union([z.string(), z.null()]).optional(),
								value: z.string().optional(),
								minValue: z.union([z.number(), z.null()]).optional(),
								maxValue: z.union([z.number(), z.null()]).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['RADIO']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['radio']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['CHECKBOX']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['checkbox']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								validationRule: z.string().optional(),
								validationLength: z.number().optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['DROPDOWN']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['dropdown']),
								values: z
									.array(
										z
											.object({
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								defaultValue: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			]),
		),
	})
	.strict();
export const FieldUpdateDocumentFieldsOutputSchema = z
	.object({
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const FieldDeleteDocumentFieldInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export const FieldDeleteDocumentFieldOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const FieldCreateTemplateFieldInputSchema = z
	.object({
		templateId: z.number(),
		field: z.union([
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['SIGNATURE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['signature']),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['FREE_SIGNATURE']),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['INITIALS']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['initials']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['NAME']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['name']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['EMAIL']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['email']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['DATE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['date']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['TEXT']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['text']),
							text: z.string().optional(),
							characterLimit: z.number().min(0).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['NUMBER']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['number']),
							numberFormat: z.union([z.string(), z.null()]).optional(),
							value: z.string().optional(),
							minValue: z.union([z.number(), z.null()]).optional(),
							maxValue: z.union([z.number(), z.null()]).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['RADIO']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['radio']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['CHECKBOX']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['checkbox']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							validationRule: z.string().optional(),
							validationLength: z.number().optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					recipientId: z.number(),
					pageNumber: z.number().min(1),
					pageX: z.number().min(0),
					pageY: z.number().min(0),
					width: z.number().min(1),
					height: z.number().min(1),
					type: z.enum(['DROPDOWN']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['dropdown']),
							values: z
								.array(
									z
										.object({
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							defaultValue: z.string().optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
		]),
	})
	.strict();
export const FieldCreateTemplateFieldOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const FieldGetTemplateFieldInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export const FieldGetTemplateFieldOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const FieldCreateTemplateFieldsInputSchema = z
	.object({
		templateId: z.number(),
		fields: z.array(
			z.union([
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['SIGNATURE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['signature']),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['FREE_SIGNATURE']),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['INITIALS']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['initials']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['NAME']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['name']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['EMAIL']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['email']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['DATE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['date']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['TEXT']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['text']),
								text: z.string().optional(),
								characterLimit: z.number().min(0).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['NUMBER']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['number']),
								numberFormat: z.union([z.string(), z.null()]).optional(),
								value: z.string().optional(),
								minValue: z.union([z.number(), z.null()]).optional(),
								maxValue: z.union([z.number(), z.null()]).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['RADIO']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['radio']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['CHECKBOX']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['checkbox']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								validationRule: z.string().optional(),
								validationLength: z.number().optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						recipientId: z.number(),
						pageNumber: z.number().min(1),
						pageX: z.number().min(0),
						pageY: z.number().min(0),
						width: z.number().min(1),
						height: z.number().min(1),
						type: z.enum(['DROPDOWN']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['dropdown']),
								values: z
									.array(
										z
											.object({
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								defaultValue: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			]),
		),
	})
	.strict();
export const FieldCreateTemplateFieldsOutputSchema = z
	.object({
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const FieldUpdateTemplateFieldInputSchema = z
	.object({
		templateId: z.number(),
		field: z.union([
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['SIGNATURE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['signature']),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['FREE_SIGNATURE']),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['INITIALS']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['initials']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['NAME']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['name']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['EMAIL']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['email']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['DATE']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['date']),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['TEXT']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['text']),
							text: z.string().optional(),
							characterLimit: z.number().min(0).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['NUMBER']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['number']),
							numberFormat: z.union([z.string(), z.null()]).optional(),
							value: z.string().optional(),
							minValue: z.union([z.number(), z.null()]).optional(),
							maxValue: z.union([z.number(), z.null()]).optional(),
							textAlign: z.enum(['left', 'center', 'right']).optional(),
							lineHeight: z
								.union([z.number().min(1).max(10), z.null()])
								.optional(),
							letterSpacing: z
								.union([z.number().min(0).max(100), z.null()])
								.optional(),
							verticalAlign: z
								.union([
									z.literal('top'),
									z.literal('middle'),
									z.literal('bottom'),
									z.literal(null),
								])
								.optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['RADIO']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['radio']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['CHECKBOX']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['checkbox']),
							values: z
								.array(
									z
										.object({
											id: z.number(),
											checked: z.boolean(),
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							validationRule: z.string().optional(),
							validationLength: z.number().optional(),
							direction: z.enum(['vertical', 'horizontal']).optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
			z
				.object({
					id: z.number(),
					pageNumber: z.number().min(1).optional(),
					pageX: z.number().min(0).optional(),
					pageY: z.number().min(0).optional(),
					width: z.number().min(1).optional(),
					height: z.number().min(1).optional(),
					type: z.enum(['DROPDOWN']),
					fieldMeta: z
						.object({
							label: z.string().optional(),
							placeholder: z.string().optional(),
							required: z.boolean().optional(),
							readOnly: z.boolean().optional(),
							fontSize: z.number().min(8).max(96).optional(),
							overflow: z
								.enum(['auto', 'horizontal', 'vertical', 'crop'])
								.optional(),
							type: z.enum(['dropdown']),
							values: z
								.array(
									z
										.object({
											value: z.string(),
										})
										.strict(),
								)
								.optional(),
							defaultValue: z.string().optional(),
						})
						.strict()
						.optional(),
				})
				.strict(),
		]),
	})
	.strict();
export const FieldUpdateTemplateFieldOutputSchema = z
	.object({
		envelopeId: z.string(),
		envelopeItemId: z.string(),
		type: z.enum([
			'SIGNATURE',
			'FREE_SIGNATURE',
			'INITIALS',
			'NAME',
			'EMAIL',
			'DATE',
			'TEXT',
			'NUMBER',
			'RADIO',
			'CHECKBOX',
			'DROPDOWN',
		]),
		id: z.number(),
		secondaryId: z.string(),
		recipientId: z.number(),
		page: z.number(),
		positionX: FreeformJsonSchema,
		positionY: FreeformJsonSchema,
		width: FreeformJsonSchema,
		height: FreeformJsonSchema,
		customText: z.string(),
		inserted: z.boolean(),
		fieldMeta: z
			.union([
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['signature']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['initials']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['name']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['email']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
						type: z.enum(['date']),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['text']),
						text: z.string().optional(),
						characterLimit: z.number().min(0).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['number']),
						numberFormat: z.union([z.string(), z.null()]).optional(),
						value: z.string().optional(),
						minValue: z.union([z.number(), z.null()]).optional(),
						maxValue: z.union([z.number(), z.null()]).optional(),
						textAlign: z.enum(['left', 'center', 'right']).optional(),
						lineHeight: z
							.union([z.number().min(1).max(10), z.null()])
							.optional(),
						letterSpacing: z
							.union([z.number().min(0).max(100), z.null()])
							.optional(),
						verticalAlign: z
							.union([
								z.literal('top'),
								z.literal('middle'),
								z.literal('bottom'),
								z.literal(null),
							])
							.optional(),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['radio']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['checkbox']),
						values: z
							.array(
								z
									.object({
										id: z.number(),
										checked: z.boolean(),
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						validationRule: z.string().optional(),
						validationLength: z.number().optional(),
						direction: z.enum(['vertical', 'horizontal']),
					})
					.strict(),
				z
					.object({
						label: z.string().optional(),
						placeholder: z.string().optional(),
						required: z.boolean().optional(),
						readOnly: z.boolean().optional(),
						fontSize: z.number().min(8).max(96).optional(),
						overflow: z
							.enum(['auto', 'horizontal', 'vertical', 'crop'])
							.optional(),
						type: z.enum(['dropdown']),
						values: z
							.array(
								z
									.object({
										value: z.string(),
									})
									.strict(),
							)
							.optional(),
						defaultValue: z.string().optional(),
					})
					.strict(),
			])
			.nullable(),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const FieldUpdateTemplateFieldsInputSchema = z
	.object({
		templateId: z.number(),
		fields: z.array(
			z.union([
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['SIGNATURE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['signature']),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['FREE_SIGNATURE']),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['INITIALS']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['initials']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['NAME']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['name']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['EMAIL']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['email']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['DATE']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['date']),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['TEXT']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['text']),
								text: z.string().optional(),
								characterLimit: z.number().min(0).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['NUMBER']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['number']),
								numberFormat: z.union([z.string(), z.null()]).optional(),
								value: z.string().optional(),
								minValue: z.union([z.number(), z.null()]).optional(),
								maxValue: z.union([z.number(), z.null()]).optional(),
								textAlign: z.enum(['left', 'center', 'right']).optional(),
								lineHeight: z
									.union([z.number().min(1).max(10), z.null()])
									.optional(),
								letterSpacing: z
									.union([z.number().min(0).max(100), z.null()])
									.optional(),
								verticalAlign: z
									.union([
										z.literal('top'),
										z.literal('middle'),
										z.literal('bottom'),
										z.literal(null),
									])
									.optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['RADIO']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['radio']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['CHECKBOX']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['checkbox']),
								values: z
									.array(
										z
											.object({
												id: z.number(),
												checked: z.boolean(),
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								validationRule: z.string().optional(),
								validationLength: z.number().optional(),
								direction: z.enum(['vertical', 'horizontal']).optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
				z
					.object({
						id: z.number(),
						pageNumber: z.number().min(1).optional(),
						pageX: z.number().min(0).optional(),
						pageY: z.number().min(0).optional(),
						width: z.number().min(1).optional(),
						height: z.number().min(1).optional(),
						type: z.enum(['DROPDOWN']),
						fieldMeta: z
							.object({
								label: z.string().optional(),
								placeholder: z.string().optional(),
								required: z.boolean().optional(),
								readOnly: z.boolean().optional(),
								fontSize: z.number().min(8).max(96).optional(),
								overflow: z
									.enum(['auto', 'horizontal', 'vertical', 'crop'])
									.optional(),
								type: z.enum(['dropdown']),
								values: z
									.array(
										z
											.object({
												value: z.string(),
											})
											.strict(),
									)
									.optional(),
								defaultValue: z.string().optional(),
							})
							.strict()
							.optional(),
					})
					.strict(),
			]),
		),
	})
	.strict();
export const FieldUpdateTemplateFieldsOutputSchema = z
	.object({
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const FieldDeleteTemplateFieldInputSchema = z
	.object({
		fieldId: z.number(),
	})
	.strict();
export const FieldDeleteTemplateFieldOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const FolderFindFoldersInputSchema = z
	.object({
		query: z.string().optional(),
		page: z.number().min(1).optional(),
		perPage: z.number().min(1).max(100).optional(),
		parentId: z.string().optional(),
		type: z.enum(['DOCUMENT', 'TEMPLATE']).optional(),
	})
	.strict();
export const FolderFindFoldersOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					id: z.string(),
					name: z.string(),
					userId: z.number(),
					teamId: z.number(),
					parentId: z.union([z.string(), z.null()]),
					pinned: z.boolean(),
					createdAt: z.string(),
					updatedAt: z.string(),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					type: z.enum(['DOCUMENT', 'TEMPLATE']),
				})
				.strict(),
		),
		count: z.number(),
		currentPage: z.number(),
		perPage: z.number(),
		totalPages: z.number(),
	})
	.strict();

export const FolderCreateFolderInputSchema = z
	.object({
		name: z.string().min(2).max(100),
		parentId: z.string().optional(),
		type: z.enum(['DOCUMENT', 'TEMPLATE']).optional(),
	})
	.strict();
export const FolderCreateFolderOutputSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		userId: z.number(),
		teamId: z.number(),
		parentId: z.union([z.string(), z.null()]),
		pinned: z.boolean(),
		createdAt: z.string(),
		updatedAt: z.string(),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		type: z.enum(['DOCUMENT', 'TEMPLATE']),
	})
	.strict();

export const FolderUpdateFolderInputSchema = z
	.object({
		folderId: z.string(),
		data: z
			.object({
				name: z.string().min(2).max(100).optional(),
				parentId: z.union([z.string(), z.null()]).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				pinned: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();
export const FolderUpdateFolderOutputSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		userId: z.number(),
		teamId: z.number(),
		parentId: z.union([z.string(), z.null()]),
		pinned: z.boolean(),
		createdAt: z.string(),
		updatedAt: z.string(),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		type: z.enum(['DOCUMENT', 'TEMPLATE']),
	})
	.strict();

export const FolderDeleteFolderInputSchema = z
	.object({
		folderId: z.string(),
	})
	.strict();
export const FolderDeleteFolderOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const RecipientGetDocumentRecipientInputSchema = z
	.object({
		recipientId: z.number(),
	})
	.strict();
export const RecipientGetDocumentRecipientOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const RecipientCreateDocumentRecipientInputSchema = z
	.object({
		documentId: z.number(),
		recipient: z
			.object({
				email: z
					.string()
					.min(1)
					.max(254)
					.regex(
						new RegExp(
							"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
							'u',
						),
					),
				name: z.string().max(255),
				role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
				signingOrder: z.number().optional(),
				accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])).optional(),
				actionAuth: z
					.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();
export const RecipientCreateDocumentRecipientOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const RecipientCreateDocumentRecipientsInputSchema = z
	.object({
		documentId: z.number(),
		recipients: z.array(
			z
				.object({
					email: z
						.string()
						.min(1)
						.max(254)
						.regex(
							new RegExp(
								"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
								'u',
							),
						),
					name: z.string().max(255),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					signingOrder: z.number().optional(),
					accessAuth: z
						.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
						.optional(),
					actionAuth: z
						.array(
							z.enum([
								'ACCOUNT',
								'PASSKEY',
								'TWO_FACTOR_AUTH',
								'PASSWORD',
								'EXPLICIT_NONE',
							]),
						)
						.optional(),
				})
				.strict(),
		),
	})
	.strict();
export const RecipientCreateDocumentRecipientsOutputSchema = z
	.object({
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const RecipientUpdateDocumentRecipientInputSchema = z
	.object({
		documentId: z.number(),
		recipient: z
			.object({
				id: z.number(),
				email: z
					.string()
					.min(1)
					.max(254)
					.regex(
						new RegExp(
							"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
							'u',
						),
					)
					.optional(),
				name: z.string().max(255).optional(),
				role: z
					.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT'])
					.optional(),
				signingOrder: z.number().optional(),
				accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])).optional(),
				actionAuth: z
					.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();
export const RecipientUpdateDocumentRecipientOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const RecipientUpdateDocumentRecipientsInputSchema = z
	.object({
		documentId: z.number(),
		recipients: z.array(
			z
				.object({
					id: z.number(),
					email: z
						.string()
						.min(1)
						.max(254)
						.regex(
							new RegExp(
								"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
								'u',
							),
						)
						.optional(),
					name: z.string().max(255).optional(),
					role: z
						.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT'])
						.optional(),
					signingOrder: z.number().optional(),
					accessAuth: z
						.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
						.optional(),
					actionAuth: z
						.array(
							z.enum([
								'ACCOUNT',
								'PASSKEY',
								'TWO_FACTOR_AUTH',
								'PASSWORD',
								'EXPLICIT_NONE',
							]),
						)
						.optional(),
				})
				.strict(),
		),
	})
	.strict();
export const RecipientUpdateDocumentRecipientsOutputSchema = z
	.object({
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					fields: z.array(
						z
							.object({
								envelopeId: z.string(),
								envelopeItemId: z.string(),
								type: z.enum([
									'SIGNATURE',
									'FREE_SIGNATURE',
									'INITIALS',
									'NAME',
									'EMAIL',
									'DATE',
									'TEXT',
									'NUMBER',
									'RADIO',
									'CHECKBOX',
									'DROPDOWN',
								]),
								id: z.number(),
								secondaryId: z.string(),
								recipientId: z.number(),
								page: z.number(),
								positionX: FreeformJsonSchema,
								positionY: FreeformJsonSchema,
								width: FreeformJsonSchema,
								height: FreeformJsonSchema,
								customText: z.string(),
								inserted: z.boolean(),
								fieldMeta: z
									.union([
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['signature']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['initials']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['name']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['email']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['date']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['text']),
												text: z.string().optional(),
												characterLimit: z.number().min(0).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['number']),
												numberFormat: z
													.union([z.string(), z.null()])
													.optional(),
												value: z.string().optional(),
												minValue: z.union([z.number(), z.null()]).optional(),
												maxValue: z.union([z.number(), z.null()]).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['radio']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['checkbox']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												validationRule: z.string().optional(),
												validationLength: z.number().optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['dropdown']),
												values: z
													.array(
														z
															.object({
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												defaultValue: z.string().optional(),
											})
											.strict(),
									])
									.nullable(),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const RecipientDeleteDocumentRecipientInputSchema = z
	.object({
		recipientId: z.number(),
	})
	.strict();
export const RecipientDeleteDocumentRecipientOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const RecipientGetTemplateRecipientInputSchema = z
	.object({
		recipientId: z.number(),
	})
	.strict();
export const RecipientGetTemplateRecipientOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const RecipientCreateTemplateRecipientInputSchema = z
	.object({
		templateId: z.number(),
		recipient: z
			.object({
				email: z
					.string()
					.min(1)
					.max(254)
					.regex(
						new RegExp(
							"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
							'u',
						),
					),
				name: z.string().max(255),
				role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
				signingOrder: z.number().optional(),
				accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])).optional(),
				actionAuth: z
					.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();
export const RecipientCreateTemplateRecipientOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const RecipientCreateTemplateRecipientsInputSchema = z
	.object({
		templateId: z.number(),
		recipients: z.array(
			z
				.object({
					email: z
						.string()
						.min(1)
						.max(254)
						.regex(
							new RegExp(
								"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
								'u',
							),
						),
					name: z.string().max(255),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					signingOrder: z.number().optional(),
					accessAuth: z
						.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
						.optional(),
					actionAuth: z
						.array(
							z.enum([
								'ACCOUNT',
								'PASSKEY',
								'TWO_FACTOR_AUTH',
								'PASSWORD',
								'EXPLICIT_NONE',
							]),
						)
						.optional(),
				})
				.strict(),
		),
	})
	.strict();
export const RecipientCreateTemplateRecipientsOutputSchema = z
	.object({
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const RecipientUpdateTemplateRecipientInputSchema = z
	.object({
		templateId: z.number(),
		recipient: z
			.object({
				id: z.number(),
				email: z
					.string()
					.min(1)
					.max(254)
					.regex(
						new RegExp(
							"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
							'u',
						),
					)
					.optional(),
				name: z.string().max(255).optional(),
				role: z
					.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT'])
					.optional(),
				signingOrder: z.number().optional(),
				accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])).optional(),
				actionAuth: z
					.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					)
					.optional(),
			})
			.strict(),
	})
	.strict();
export const RecipientUpdateTemplateRecipientOutputSchema = z
	.object({
		envelopeId: z.string(),
		role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
		readStatus: z.enum(['NOT_OPENED', 'OPENED']),
		signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
		sendStatus: z.enum(['NOT_SENT', 'SENT']),
		id: z.number(),
		email: z.string(),
		name: z.string(),
		token: z.string(),
		documentDeletedAt: z.union([z.string(), z.null()]),
		expired: z.union([z.string(), z.null()]),
		expiresAt: z.union([z.string(), z.null()]),
		expirationNotifiedAt: z.union([z.string(), z.null()]),
		signedAt: z.union([z.string(), z.null()]),
		authOptions: z.union([
			z
				.object({
					accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					actionAuth: z.array(
						z.enum([
							'ACCOUNT',
							'PASSKEY',
							'TWO_FACTOR_AUTH',
							'PASSWORD',
							'EXPLICIT_NONE',
						]),
					),
				})
				.strict(),
			z.null(),
		]),
		signingOrder: z.union([z.number(), z.null()]),
		rejectionReason: z.union([z.string(), z.null()]),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		documentId: z.union([z.number(), z.null()]).optional(),
		templateId: z.union([z.number(), z.null()]).optional(),
	})
	.strict();

export const RecipientUpdateTemplateRecipientsInputSchema = z
	.object({
		templateId: z.number(),
		recipients: z.array(
			z
				.object({
					id: z.number(),
					email: z
						.string()
						.min(1)
						.max(254)
						.regex(
							new RegExp(
								"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
								'u',
							),
						)
						.optional(),
					name: z.string().max(255).optional(),
					role: z
						.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT'])
						.optional(),
					signingOrder: z.number().optional(),
					accessAuth: z
						.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
						.optional(),
					actionAuth: z
						.array(
							z.enum([
								'ACCOUNT',
								'PASSKEY',
								'TWO_FACTOR_AUTH',
								'PASSWORD',
								'EXPLICIT_NONE',
							]),
						)
						.optional(),
				})
				.strict(),
		),
	})
	.strict();
export const RecipientUpdateTemplateRecipientsOutputSchema = z
	.object({
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					fields: z.array(
						z
							.object({
								envelopeId: z.string(),
								envelopeItemId: z.string(),
								type: z.enum([
									'SIGNATURE',
									'FREE_SIGNATURE',
									'INITIALS',
									'NAME',
									'EMAIL',
									'DATE',
									'TEXT',
									'NUMBER',
									'RADIO',
									'CHECKBOX',
									'DROPDOWN',
								]),
								id: z.number(),
								secondaryId: z.string(),
								recipientId: z.number(),
								page: z.number(),
								positionX: FreeformJsonSchema,
								positionY: FreeformJsonSchema,
								width: FreeformJsonSchema,
								height: FreeformJsonSchema,
								customText: z.string(),
								inserted: z.boolean(),
								fieldMeta: z
									.union([
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['signature']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['initials']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['name']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['email']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['date']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['text']),
												text: z.string().optional(),
												characterLimit: z.number().min(0).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['number']),
												numberFormat: z
													.union([z.string(), z.null()])
													.optional(),
												value: z.string().optional(),
												minValue: z.union([z.number(), z.null()]).optional(),
												maxValue: z.union([z.number(), z.null()]).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['radio']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['checkbox']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												validationRule: z.string().optional(),
												validationLength: z.number().optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['dropdown']),
												values: z
													.array(
														z
															.object({
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												defaultValue: z.string().optional(),
											})
											.strict(),
									])
									.nullable(),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const RecipientDeleteTemplateRecipientInputSchema = z
	.object({
		recipientId: z.number(),
	})
	.strict();
export const RecipientDeleteTemplateRecipientOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const TemplateFindTemplatesInputSchema = z
	.object({
		query: z.string().optional(),
		page: z.number().min(1).optional(),
		perPage: z.number().min(1).max(100).optional(),
		type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']).optional(),
		folderId: z.string().optional(),
	})
	.strict();
export const TemplateFindTemplatesOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					id: z.number(),
					externalId: z.union([z.string(), z.null()]),
					title: z.string(),
					userId: z.number(),
					teamId: z.number(),
					authOptions: z.union([
						z
							.object({
								globalAccessAuth: z.array(
									z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
								),
								globalActionAuth: z.array(
									z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
								),
							})
							.strict(),
						z.null(),
					]),
					createdAt: z.string(),
					updatedAt: z.string(),
					publicTitle: z.string(),
					publicDescription: z.string(),
					folderId: z.union([z.string(), z.null()]),
					useLegacyFieldInsertion: z.boolean(),
					envelopeId: z.string(),
					team: z.union([
						z
							.object({
								id: z.number(),
								url: z.string(),
								name: z.string(),
							})
							.strict(),
						z.null(),
					]),
					fields: z.array(
						z
							.object({
								envelopeId: z.string(),
								envelopeItemId: z.string(),
								type: z.enum([
									'SIGNATURE',
									'FREE_SIGNATURE',
									'INITIALS',
									'NAME',
									'EMAIL',
									'DATE',
									'TEXT',
									'NUMBER',
									'RADIO',
									'CHECKBOX',
									'DROPDOWN',
								]),
								id: z.number(),
								secondaryId: z.string(),
								recipientId: z.number(),
								page: z.number(),
								positionX: FreeformJsonSchema,
								positionY: FreeformJsonSchema,
								width: FreeformJsonSchema,
								height: FreeformJsonSchema,
								customText: z.string(),
								inserted: z.boolean(),
								fieldMeta: z
									.union([
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['signature']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['initials']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['name']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['email']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['date']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['text']),
												text: z.string().optional(),
												characterLimit: z.number().min(0).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['number']),
												numberFormat: z
													.union([z.string(), z.null()])
													.optional(),
												value: z.string().optional(),
												minValue: z.union([z.number(), z.null()]).optional(),
												maxValue: z.union([z.number(), z.null()]).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['radio']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['checkbox']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												validationRule: z.string().optional(),
												validationLength: z.number().optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['dropdown']),
												values: z
													.array(
														z
															.object({
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												defaultValue: z.string().optional(),
											})
											.strict(),
									])
									.nullable(),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					recipients: z.array(
						z
							.object({
								envelopeId: z.string(),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								readStatus: z.enum(['NOT_OPENED', 'OPENED']),
								signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
								sendStatus: z.enum(['NOT_SENT', 'SENT']),
								id: z.number(),
								email: z.string(),
								name: z.string(),
								token: z.string(),
								documentDeletedAt: z.union([z.string(), z.null()]),
								expired: z.union([z.string(), z.null()]),
								expiresAt: z.union([z.string(), z.null()]),
								expirationNotifiedAt: z.union([z.string(), z.null()]),
								signedAt: z.union([z.string(), z.null()]),
								authOptions: z.union([
									z
										.object({
											accessAuth: z.array(
												z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
											),
											actionAuth: z.array(
												z.enum([
													'ACCOUNT',
													'PASSKEY',
													'TWO_FACTOR_AUTH',
													'PASSWORD',
													'EXPLICIT_NONE',
												]),
											),
										})
										.strict(),
									z.null(),
								]),
								signingOrder: z.union([z.number(), z.null()]),
								rejectionReason: z.union([z.string(), z.null()]),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					templateMeta: z.union([
						z
							.object({
								signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
								distributionMethod: z.enum(['EMAIL', 'NONE']),
							})
							.strict(),
						z.null(),
					]),
					directLink: z.union([
						z
							.object({
								token: z.string(),
								enabled: z.boolean(),
							})
							.strict(),
						z.null(),
					]),
					templateDocumentDataId: z.string(),
				})
				.strict(),
		),
		count: z.number(),
		currentPage: z.number(),
		perPage: z.number(),
		totalPages: z.number(),
	})
	.strict();

export const TemplateGetTemplateByIdInputSchema = z
	.object({
		templateId: z.number(),
	})
	.strict();
export const TemplateGetTemplateByIdOutputSchema = z
	.object({
		type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		title: z.string(),
		userId: z.number(),
		teamId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		createdAt: z.string(),
		updatedAt: z.string(),
		publicTitle: z.string(),
		publicDescription: z.string(),
		folderId: z.union([z.string(), z.null()]),
		envelopeId: z.string(),
		templateDocumentDataId: z.string(),
		templateDocumentData: z
			.object({
				type: z.enum(['S3_PATH', 'BYTES', 'BYTES_64']),
				id: z.string(),
				data: z.string(),
				initialData: z.string(),
				envelopeItemId: z.string(),
			})
			.strict(),
		templateMeta: z
			.object({
				id: z.string(),
				subject: z.union([z.string(), z.null()]),
				message: z.union([z.string(), z.null()]),
				timezone: z.union([z.string(), z.null()]),
				dateFormat: z.union([z.string(), z.null()]),
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
				typedSignatureEnabled: z.boolean(),
				uploadSignatureEnabled: z.boolean(),
				drawSignatureEnabled: z.boolean(),
				allowDictateNextSigner: z.boolean(),
				distributionMethod: z.enum(['EMAIL', 'NONE']),
				redirectUrl: z.union([z.string(), z.null()]),
				language: z.string(),
				emailSettings: z.union([
					z
						.object({
							recipientSigningRequest: z.boolean(),
							recipientRemoved: z.boolean(),
							recipientSigned: z.boolean(),
							documentPending: z.boolean(),
							documentCompleted: z.boolean(),
							documentDeleted: z.boolean(),
							ownerDocumentCompleted: z.boolean(),
							ownerRecipientExpired: z.boolean(),
							ownerDocumentCreated: z.boolean(),
						})
						.strict(),
					z.null(),
				]),
				emailId: z.union([z.string(), z.null()]),
				emailReplyTo: z.union([z.string(), z.null()]),
				templateId: z.union([z.number(), z.null()]),
			})
			.strict(),
		directLink: z.union([
			z
				.object({
					id: z.string(),
					envelopeId: z.string(),
					token: z.string(),
					createdAt: z.string(),
					enabled: z.boolean(),
					directTemplateRecipientId: z.number(),
					templateId: z.number(),
				})
				.strict(),
			z.null(),
		]),
		user: z
			.object({
				id: z.number(),
				name: z.union([z.string(), z.null()]),
				email: z.string(),
			})
			.strict(),
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		folder: z.union([
			z
				.object({
					id: z.string(),
					name: z.string(),
					type: z.enum(['DOCUMENT', 'TEMPLATE']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					userId: z.number(),
					teamId: z.number(),
					pinned: z.boolean(),
					parentId: z.union([z.string(), z.null()]),
					createdAt: z.string(),
					updatedAt: z.string(),
				})
				.strict(),
			z.null(),
		]),
		envelopeItems: z.array(
			z
				.object({
					id: z.string(),
					envelopeId: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const TemplateGetManyInputSchema = z
	.object({
		templateIds: z.array(z.number()).min(1),
	})
	.strict();
export const TemplateGetManyOutputSchema = z
	.object({
		data: z.array(
			z
				.object({
					type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					id: z.number(),
					externalId: z.union([z.string(), z.null()]),
					title: z.string(),
					userId: z.number(),
					teamId: z.number(),
					authOptions: z.union([
						z
							.object({
								globalAccessAuth: z.array(
									z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
								),
								globalActionAuth: z.array(
									z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
								),
							})
							.strict(),
						z.null(),
					]),
					createdAt: z.string(),
					updatedAt: z.string(),
					publicTitle: z.string(),
					publicDescription: z.string(),
					folderId: z.union([z.string(), z.null()]),
					useLegacyFieldInsertion: z.boolean(),
					envelopeId: z.string(),
					team: z.union([
						z
							.object({
								id: z.number(),
								url: z.string(),
								name: z.string(),
							})
							.strict(),
						z.null(),
					]),
					fields: z.array(
						z
							.object({
								envelopeId: z.string(),
								envelopeItemId: z.string(),
								type: z.enum([
									'SIGNATURE',
									'FREE_SIGNATURE',
									'INITIALS',
									'NAME',
									'EMAIL',
									'DATE',
									'TEXT',
									'NUMBER',
									'RADIO',
									'CHECKBOX',
									'DROPDOWN',
								]),
								id: z.number(),
								secondaryId: z.string(),
								recipientId: z.number(),
								page: z.number(),
								positionX: FreeformJsonSchema,
								positionY: FreeformJsonSchema,
								width: FreeformJsonSchema,
								height: FreeformJsonSchema,
								customText: z.string(),
								inserted: z.boolean(),
								fieldMeta: z
									.union([
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['signature']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['initials']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['name']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['email']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z.enum([
													'auto',
													'horizontal',
													'vertical',
													'crop',
												]),
												type: z.enum(['date']),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['text']),
												text: z.string().optional(),
												characterLimit: z.number().min(0).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['number']),
												numberFormat: z
													.union([z.string(), z.null()])
													.optional(),
												value: z.string().optional(),
												minValue: z.union([z.number(), z.null()]).optional(),
												maxValue: z.union([z.number(), z.null()]).optional(),
												textAlign: z
													.enum(['left', 'center', 'right'])
													.optional(),
												lineHeight: z
													.union([z.number().min(1).max(10), z.null()])
													.optional(),
												letterSpacing: z
													.union([z.number().min(0).max(100), z.null()])
													.optional(),
												verticalAlign: z
													.union([
														z.literal('top'),
														z.literal('middle'),
														z.literal('bottom'),
														z.literal(null),
													])
													.optional(),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['radio']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['checkbox']),
												values: z
													.array(
														z
															.object({
																id: z.number(),
																checked: z.boolean(),
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												validationRule: z.string().optional(),
												validationLength: z.number().optional(),
												direction: z.enum(['vertical', 'horizontal']),
											})
											.strict(),
										z
											.object({
												label: z.string().optional(),
												placeholder: z.string().optional(),
												required: z.boolean().optional(),
												readOnly: z.boolean().optional(),
												fontSize: z.number().min(8).max(96).optional(),
												overflow: z
													.enum(['auto', 'horizontal', 'vertical', 'crop'])
													.optional(),
												type: z.enum(['dropdown']),
												values: z
													.array(
														z
															.object({
																value: z.string(),
															})
															.strict(),
													)
													.optional(),
												defaultValue: z.string().optional(),
											})
											.strict(),
									])
									.nullable(),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					recipients: z.array(
						z
							.object({
								envelopeId: z.string(),
								role: z.enum([
									'CC',
									'SIGNER',
									'VIEWER',
									'APPROVER',
									'ASSISTANT',
								]),
								readStatus: z.enum(['NOT_OPENED', 'OPENED']),
								signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
								sendStatus: z.enum(['NOT_SENT', 'SENT']),
								id: z.number(),
								email: z.string(),
								name: z.string(),
								token: z.string(),
								documentDeletedAt: z.union([z.string(), z.null()]),
								expired: z.union([z.string(), z.null()]),
								expiresAt: z.union([z.string(), z.null()]),
								expirationNotifiedAt: z.union([z.string(), z.null()]),
								signedAt: z.union([z.string(), z.null()]),
								authOptions: z.union([
									z
										.object({
											accessAuth: z.array(
												z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']),
											),
											actionAuth: z.array(
												z.enum([
													'ACCOUNT',
													'PASSKEY',
													'TWO_FACTOR_AUTH',
													'PASSWORD',
													'EXPLICIT_NONE',
												]),
											),
										})
										.strict(),
									z.null(),
								]),
								signingOrder: z.union([z.number(), z.null()]),
								rejectionReason: z.union([z.string(), z.null()]),
								documentId: z.union([z.number(), z.null()]).optional(),
								templateId: z.union([z.number(), z.null()]).optional(),
							})
							.strict(),
					),
					templateMeta: z.union([
						z
							.object({
								signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
								distributionMethod: z.enum(['EMAIL', 'NONE']),
							})
							.strict(),
						z.null(),
					]),
					directLink: z.union([
						z
							.object({
								token: z.string(),
								enabled: z.boolean(),
							})
							.strict(),
						z.null(),
					]),
					templateDocumentDataId: z.string(),
				})
				.strict(),
		),
	})
	.strict();

export const TemplateCreateTemplateInputSchema = z
	.object({
		payload: z
			.object({
				title: z.string().min(1).max(255),
				folderId: z.string().optional(),
				externalId: z.union([z.string(), z.null()]).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				globalAccessAuth: z
					.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
					.optional(),
				globalActionAuth: z
					.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
					.optional(),
				publicTitle: z.string().min(1).max(50).optional(),
				publicDescription: z.string().min(1).max(256).optional(),
				type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']).optional(),
				meta: z
					.object({
						subject: z.string().max(254).optional(),
						message: z.string().max(5000).optional(),
						timezone: z.string().optional(),
						dateFormat: z
							.enum([
								'yyyy-MM-dd hh:mm a',
								'yyyy-MM-dd',
								'dd/MM/yyyy',
								'dd-MM-yyyy',
								'MM/dd/yyyy',
								'yy-MM-dd',
								'MMMM dd, yyyy',
								'EEEE, MMMM dd, yyyy',
								'dd/MM/yyyy hh:mm a',
								'dd/MM/yyyy HH:mm',
								'dd-MM-yyyy hh:mm a',
								'dd-MM-yyyy HH:mm',
								'MM/dd/yyyy hh:mm a',
								'MM/dd/yyyy HH:mm',
								'dd.MM.yyyy',
								'dd.MM.yyyy HH:mm',
								'yyyy-MM-dd HH:mm',
								'yy-MM-dd hh:mm a',
								'yy-MM-dd HH:mm',
								'yyyy-MM-dd HH:mm:ss',
								'MMMM dd, yyyy hh:mm a',
								'MMMM dd, yyyy HH:mm',
								'EEEE, MMMM dd, yyyy hh:mm a',
								'EEEE, MMMM dd, yyyy HH:mm',
								"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
							])
							.optional(),
						distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
						emailId: z.union([z.string(), z.null()]).optional(),
						emailReplyTo: z
							.union([
								z
									.string()
									.regex(
										new RegExp(
											"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
											'u',
										),
									),
								z.null(),
							])
							.optional(),
						emailSettings: z
							.object({
								recipientSigningRequest: z.boolean().optional(),
								recipientRemoved: z.boolean().optional(),
								recipientSigned: z.boolean().optional(),
								documentPending: z.boolean().optional(),
								documentCompleted: z.boolean().optional(),
								documentDeleted: z.boolean().optional(),
								ownerDocumentCompleted: z.boolean().optional(),
								ownerRecipientExpired: z.boolean().optional(),
								ownerDocumentCreated: z.boolean().optional(),
							})
							.strict()
							.optional(),
						redirectUrl: z.string().optional(),
						language: z
							.enum([
								'de',
								'en',
								'fr',
								'es',
								'it',
								'nl',
								'pl',
								'pt-BR',
								'ja',
								'ko',
								'zh',
							])
							.optional(),
						typedSignatureEnabled: z.boolean().optional(),
						uploadSignatureEnabled: z.boolean().optional(),
						drawSignatureEnabled: z.boolean().optional(),
						signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
						allowDictateNextSigner: z.boolean().optional(),
					})
					.strict()
					.optional(),
				attachments: z
					.array(
						z
							.object({
								label: z.string().min(1),
								data: z.string(),
								type: z.enum(['link']).optional(),
							})
							.strict(),
					)
					.optional(),
			})
			.strict(),
		file: z
			.object({
				filename: z.string().min(1),
				contentType: z.string().min(1),
				contentBase64: z
					.string()
					.min(4)
					.max(22369624)
					.regex(
						new RegExp(
							'^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
						),
					),
			})
			.strict(),
	})
	.strict();
export const TemplateCreateTemplateOutputSchema = z
	.object({
		envelopeId: z.string(),
		id: z.number(),
	})
	.strict();

export const TemplateCreateTemplateTemporaryInputSchema = z
	.object({
		title: z.string().min(1).max(255),
		folderId: z.string().optional(),
		externalId: z.union([z.string(), z.null()]).optional(),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']).optional(),
		globalAccessAuth: z
			.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
			.optional(),
		globalActionAuth: z
			.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
			.optional(),
		publicTitle: z.string().min(1).max(50).optional(),
		publicDescription: z.string().min(1).max(256).optional(),
		type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']).optional(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.object({
						recipientSigningRequest: z.boolean().optional(),
						recipientRemoved: z.boolean().optional(),
						recipientSigned: z.boolean().optional(),
						documentPending: z.boolean().optional(),
						documentCompleted: z.boolean().optional(),
						documentDeleted: z.boolean().optional(),
						ownerDocumentCompleted: z.boolean().optional(),
						ownerRecipientExpired: z.boolean().optional(),
						ownerDocumentCreated: z.boolean().optional(),
					})
					.strict()
					.optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				typedSignatureEnabled: z.boolean().optional(),
				uploadSignatureEnabled: z.boolean().optional(),
				drawSignatureEnabled: z.boolean().optional(),
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
				allowDictateNextSigner: z.boolean().optional(),
			})
			.strict()
			.optional(),
		attachments: z
			.array(
				z
					.object({
						label: z.string().min(1),
						data: z.string(),
						type: z.enum(['link']).optional(),
					})
					.strict(),
			)
			.optional(),
	})
	.strict();
export const TemplateCreateTemplateTemporaryOutputSchema = z
	.object({
		template: z
			.object({
				type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
				visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
				id: z.number(),
				externalId: z.union([z.string(), z.null()]),
				title: z.string(),
				userId: z.number(),
				teamId: z.number(),
				authOptions: z.union([
					z
						.object({
							globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
							globalActionAuth: z.array(
								z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
							),
						})
						.strict(),
					z.null(),
				]),
				createdAt: z.string(),
				updatedAt: z.string(),
				publicTitle: z.string(),
				publicDescription: z.string(),
				folderId: z.union([z.string(), z.null()]),
				envelopeId: z.string(),
				templateDocumentDataId: z.string(),
				templateDocumentData: z
					.object({
						type: z.enum(['S3_PATH', 'BYTES', 'BYTES_64']),
						id: z.string(),
						data: z.string(),
						initialData: z.string(),
						envelopeItemId: z.string(),
					})
					.strict(),
				templateMeta: z
					.object({
						id: z.string(),
						subject: z.union([z.string(), z.null()]),
						message: z.union([z.string(), z.null()]),
						timezone: z.union([z.string(), z.null()]),
						dateFormat: z.union([z.string(), z.null()]),
						signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
						typedSignatureEnabled: z.boolean(),
						uploadSignatureEnabled: z.boolean(),
						drawSignatureEnabled: z.boolean(),
						allowDictateNextSigner: z.boolean(),
						distributionMethod: z.enum(['EMAIL', 'NONE']),
						redirectUrl: z.union([z.string(), z.null()]),
						language: z.string(),
						emailSettings: z.union([
							z
								.object({
									recipientSigningRequest: z.boolean(),
									recipientRemoved: z.boolean(),
									recipientSigned: z.boolean(),
									documentPending: z.boolean(),
									documentCompleted: z.boolean(),
									documentDeleted: z.boolean(),
									ownerDocumentCompleted: z.boolean(),
									ownerRecipientExpired: z.boolean(),
									ownerDocumentCreated: z.boolean(),
								})
								.strict(),
							z.null(),
						]),
						emailId: z.union([z.string(), z.null()]),
						emailReplyTo: z.union([z.string(), z.null()]),
						templateId: z.union([z.number(), z.null()]),
					})
					.strict(),
				directLink: z.union([
					z
						.object({
							id: z.string(),
							envelopeId: z.string(),
							token: z.string(),
							createdAt: z.string(),
							enabled: z.boolean(),
							directTemplateRecipientId: z.number(),
							templateId: z.number(),
						})
						.strict(),
					z.null(),
				]),
				user: z
					.object({
						id: z.number(),
						name: z.union([z.string(), z.null()]),
						email: z.string(),
					})
					.strict(),
				recipients: z.array(
					z
						.object({
							envelopeId: z.string(),
							role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
							readStatus: z.enum(['NOT_OPENED', 'OPENED']),
							signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
							sendStatus: z.enum(['NOT_SENT', 'SENT']),
							id: z.number(),
							email: z.string(),
							name: z.string(),
							token: z.string(),
							documentDeletedAt: z.union([z.string(), z.null()]),
							expired: z.union([z.string(), z.null()]),
							expiresAt: z.union([z.string(), z.null()]),
							expirationNotifiedAt: z.union([z.string(), z.null()]),
							signedAt: z.union([z.string(), z.null()]),
							authOptions: z.union([
								z
									.object({
										accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
										actionAuth: z.array(
											z.enum([
												'ACCOUNT',
												'PASSKEY',
												'TWO_FACTOR_AUTH',
												'PASSWORD',
												'EXPLICIT_NONE',
											]),
										),
									})
									.strict(),
								z.null(),
							]),
							signingOrder: z.union([z.number(), z.null()]),
							rejectionReason: z.union([z.string(), z.null()]),
							documentId: z.union([z.number(), z.null()]).optional(),
							templateId: z.union([z.number(), z.null()]).optional(),
						})
						.strict(),
				),
				fields: z.array(
					z
						.object({
							envelopeId: z.string(),
							envelopeItemId: z.string(),
							type: z.enum([
								'SIGNATURE',
								'FREE_SIGNATURE',
								'INITIALS',
								'NAME',
								'EMAIL',
								'DATE',
								'TEXT',
								'NUMBER',
								'RADIO',
								'CHECKBOX',
								'DROPDOWN',
							]),
							id: z.number(),
							secondaryId: z.string(),
							recipientId: z.number(),
							page: z.number(),
							positionX: FreeformJsonSchema,
							positionY: FreeformJsonSchema,
							width: FreeformJsonSchema,
							height: FreeformJsonSchema,
							customText: z.string(),
							inserted: z.boolean(),
							fieldMeta: z
								.union([
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z.enum([
												'auto',
												'horizontal',
												'vertical',
												'crop',
											]),
											type: z.enum(['signature']),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['initials']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['name']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z.enum([
												'auto',
												'horizontal',
												'vertical',
												'crop',
											]),
											type: z.enum(['email']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z.enum([
												'auto',
												'horizontal',
												'vertical',
												'crop',
											]),
											type: z.enum(['date']),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['text']),
											text: z.string().optional(),
											characterLimit: z.number().min(0).optional(),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
											lineHeight: z
												.union([z.number().min(1).max(10), z.null()])
												.optional(),
											letterSpacing: z
												.union([z.number().min(0).max(100), z.null()])
												.optional(),
											verticalAlign: z
												.union([
													z.literal('top'),
													z.literal('middle'),
													z.literal('bottom'),
													z.literal(null),
												])
												.optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['number']),
											numberFormat: z.union([z.string(), z.null()]).optional(),
											value: z.string().optional(),
											minValue: z.union([z.number(), z.null()]).optional(),
											maxValue: z.union([z.number(), z.null()]).optional(),
											textAlign: z.enum(['left', 'center', 'right']).optional(),
											lineHeight: z
												.union([z.number().min(1).max(10), z.null()])
												.optional(),
											letterSpacing: z
												.union([z.number().min(0).max(100), z.null()])
												.optional(),
											verticalAlign: z
												.union([
													z.literal('top'),
													z.literal('middle'),
													z.literal('bottom'),
													z.literal(null),
												])
												.optional(),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['radio']),
											values: z
												.array(
													z
														.object({
															id: z.number(),
															checked: z.boolean(),
															value: z.string(),
														})
														.strict(),
												)
												.optional(),
											direction: z.enum(['vertical', 'horizontal']),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['checkbox']),
											values: z
												.array(
													z
														.object({
															id: z.number(),
															checked: z.boolean(),
															value: z.string(),
														})
														.strict(),
												)
												.optional(),
											validationRule: z.string().optional(),
											validationLength: z.number().optional(),
											direction: z.enum(['vertical', 'horizontal']),
										})
										.strict(),
									z
										.object({
											label: z.string().optional(),
											placeholder: z.string().optional(),
											required: z.boolean().optional(),
											readOnly: z.boolean().optional(),
											fontSize: z.number().min(8).max(96).optional(),
											overflow: z
												.enum(['auto', 'horizontal', 'vertical', 'crop'])
												.optional(),
											type: z.enum(['dropdown']),
											values: z
												.array(
													z
														.object({
															value: z.string(),
														})
														.strict(),
												)
												.optional(),
											defaultValue: z.string().optional(),
										})
										.strict(),
								])
								.nullable(),
							documentId: z.union([z.number(), z.null()]).optional(),
							templateId: z.union([z.number(), z.null()]).optional(),
						})
						.strict(),
				),
				folder: z.union([
					z
						.object({
							id: z.string(),
							name: z.string(),
							type: z.enum(['DOCUMENT', 'TEMPLATE']),
							visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
							userId: z.number(),
							teamId: z.number(),
							pinned: z.boolean(),
							parentId: z.union([z.string(), z.null()]),
							createdAt: z.string(),
							updatedAt: z.string(),
						})
						.strict(),
					z.null(),
				]),
				envelopeItems: z.array(
					z
						.object({
							id: z.string(),
							envelopeId: z.string(),
						})
						.strict(),
				),
			})
			.strict(),
		uploadUrl: z.string().min(1),
	})
	.strict();

export const TemplateUpdateTemplateInputSchema = z
	.object({
		templateId: z.number(),
		data: z
			.object({
				title: z.string().min(1).max(255).optional(),
				externalId: z.union([z.string(), z.null()]).optional(),
				visibility: z
					.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN'])
					.optional(),
				globalAccessAuth: z
					.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH']))
					.optional(),
				globalActionAuth: z
					.array(z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']))
					.optional(),
				publicTitle: z.string().min(1).max(50).optional(),
				publicDescription: z.string().min(1).max(256).optional(),
				type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']).optional(),
				useLegacyFieldInsertion: z.boolean().optional(),
				folderId: z.union([z.string(), z.null()]).optional(),
			})
			.strict()
			.optional(),
		meta: z
			.object({
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				emailId: z.union([z.string(), z.null()]).optional(),
				emailReplyTo: z
					.union([
						z
							.string()
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
						z.null(),
					])
					.optional(),
				emailSettings: z
					.object({
						recipientSigningRequest: z.boolean().optional(),
						recipientRemoved: z.boolean().optional(),
						recipientSigned: z.boolean().optional(),
						documentPending: z.boolean().optional(),
						documentCompleted: z.boolean().optional(),
						documentDeleted: z.boolean().optional(),
						ownerDocumentCompleted: z.boolean().optional(),
						ownerRecipientExpired: z.boolean().optional(),
						ownerDocumentCreated: z.boolean().optional(),
					})
					.strict()
					.optional(),
				redirectUrl: z.string().optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				typedSignatureEnabled: z.boolean().optional(),
				uploadSignatureEnabled: z.boolean().optional(),
				drawSignatureEnabled: z.boolean().optional(),
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']).optional(),
				allowDictateNextSigner: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();
export const TemplateUpdateTemplateOutputSchema = z
	.object({
		type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		title: z.string(),
		userId: z.number(),
		teamId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		createdAt: z.string(),
		updatedAt: z.string(),
		publicTitle: z.string(),
		publicDescription: z.string(),
		folderId: z.union([z.string(), z.null()]),
		useLegacyFieldInsertion: z.boolean(),
		envelopeId: z.string(),
		templateDocumentDataId: z.string(),
	})
	.strict();

export const TemplateDuplicateTemplateInputSchema = z
	.object({
		templateId: z.number(),
	})
	.strict();
export const TemplateDuplicateTemplateOutputSchema = z
	.object({
		type: z.enum(['PUBLIC', 'PRIVATE', 'ORGANISATION']),
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		title: z.string(),
		userId: z.number(),
		teamId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		createdAt: z.string(),
		updatedAt: z.string(),
		publicTitle: z.string(),
		publicDescription: z.string(),
		folderId: z.union([z.string(), z.null()]),
		useLegacyFieldInsertion: z.boolean(),
		envelopeId: z.string(),
		templateDocumentDataId: z.string(),
	})
	.strict();

export const TemplateDeleteTemplateInputSchema = z
	.object({
		templateId: z.number(),
	})
	.strict();
export const TemplateDeleteTemplateOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const TemplateCreateDocumentFromTemplateInputSchema = z
	.object({
		templateId: z.number(),
		externalId: z.string().max(255).optional(),
		recipients: z.array(
			z
				.object({
					id: z.number(),
					email: z.union([
						z.enum(['']),
						z
							.string()
							.max(254)
							.regex(
								new RegExp(
									"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~\\u{0080}-\\u{FFFF}-]+@[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?(?:\\.[a-zA-Z0-9\\u{0080}-\\u{FFFF}](?:[a-zA-Z0-9\\u{0080}-\\u{FFFF}-]{0,61}[a-zA-Z0-9\\u{0080}-\\u{FFFF}])?)*$",
									'u',
								),
							),
					]),
					name: z.string().max(255).optional(),
				})
				.strict(),
		),
		distributeDocument: z.boolean().optional(),
		customDocumentDataId: z.string().optional(),
		customDocumentData: z
			.array(
				z
					.object({
						documentDataId: z.string(),
						envelopeItemId: z.string(),
					})
					.strict(),
			)
			.optional(),
		folderId: z.string().optional(),
		prefillFields: z
			.array(
				z.union([
					z
						.object({
							id: z.number(),
							type: z.enum(['text']),
							label: z.string().optional(),
							placeholder: z.string().optional(),
							value: z.string().optional(),
						})
						.strict(),
					z
						.object({
							id: z.number(),
							type: z.enum(['number']),
							label: z.string().optional(),
							placeholder: z.string().optional(),
							value: z.string().optional(),
						})
						.strict(),
					z
						.object({
							id: z.number(),
							type: z.enum(['radio']),
							label: z.string().optional(),
							value: z.string().optional(),
						})
						.strict(),
					z
						.object({
							id: z.number(),
							type: z.enum(['checkbox']),
							label: z.string().optional(),
							value: z.array(z.string()).optional(),
						})
						.strict(),
					z
						.object({
							id: z.number(),
							type: z.enum(['dropdown']),
							label: z.string().optional(),
							value: z.string().optional(),
						})
						.strict(),
					z
						.object({
							id: z.number(),
							type: z.enum(['date']),
							value: z.string().optional(),
						})
						.strict(),
				]),
			)
			.optional(),
		override: z
			.object({
				title: z.string().min(1).max(255).optional(),
				subject: z.string().max(254).optional(),
				message: z.string().max(5000).optional(),
				timezone: z.string().optional(),
				dateFormat: z
					.enum([
						'yyyy-MM-dd hh:mm a',
						'yyyy-MM-dd',
						'dd/MM/yyyy',
						'dd-MM-yyyy',
						'MM/dd/yyyy',
						'yy-MM-dd',
						'MMMM dd, yyyy',
						'EEEE, MMMM dd, yyyy',
						'dd/MM/yyyy hh:mm a',
						'dd/MM/yyyy HH:mm',
						'dd-MM-yyyy hh:mm a',
						'dd-MM-yyyy HH:mm',
						'MM/dd/yyyy hh:mm a',
						'MM/dd/yyyy HH:mm',
						'dd.MM.yyyy',
						'dd.MM.yyyy HH:mm',
						'yyyy-MM-dd HH:mm',
						'yy-MM-dd hh:mm a',
						'yy-MM-dd HH:mm',
						'yyyy-MM-dd HH:mm:ss',
						'MMMM dd, yyyy hh:mm a',
						'MMMM dd, yyyy HH:mm',
						'EEEE, MMMM dd, yyyy hh:mm a',
						'EEEE, MMMM dd, yyyy HH:mm',
						"yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
					])
					.optional(),
				redirectUrl: z.string().optional(),
				distributionMethod: z.enum(['EMAIL', 'NONE']).optional(),
				emailSettings: z
					.object({
						recipientSigningRequest: z.boolean().optional(),
						recipientRemoved: z.boolean().optional(),
						recipientSigned: z.boolean().optional(),
						documentPending: z.boolean().optional(),
						documentCompleted: z.boolean().optional(),
						documentDeleted: z.boolean().optional(),
						ownerDocumentCompleted: z.boolean().optional(),
						ownerRecipientExpired: z.boolean().optional(),
						ownerDocumentCreated: z.boolean().optional(),
					})
					.strict()
					.optional(),
				language: z
					.enum([
						'de',
						'en',
						'fr',
						'es',
						'it',
						'nl',
						'pl',
						'pt-BR',
						'ja',
						'ko',
						'zh',
					])
					.optional(),
				typedSignatureEnabled: z.boolean().optional(),
				uploadSignatureEnabled: z.boolean().optional(),
				drawSignatureEnabled: z.boolean().optional(),
				allowDictateNextSigner: z.boolean().optional(),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
		attachments: z
			.array(
				z
					.object({
						label: z.string().min(1),
						data: z.string(),
						type: z.enum(['link']).optional(),
					})
					.strict(),
			)
			.optional(),
		formValues: z
			.object({})
			.catchall(z.union([z.string(), z.boolean(), z.number()]))
			.optional(),
	})
	.strict();
export const TemplateCreateDocumentFromTemplateOutputSchema = z
	.object({
		visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
		status: z.enum(['DRAFT', 'PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED']),
		source: z.enum(['DOCUMENT', 'TEMPLATE', 'TEMPLATE_DIRECT_LINK']),
		id: z.number(),
		externalId: z.union([z.string(), z.null()]),
		userId: z.number(),
		authOptions: z.union([
			z
				.object({
					globalAccessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
					globalActionAuth: z.array(
						z.enum(['ACCOUNT', 'PASSKEY', 'TWO_FACTOR_AUTH', 'PASSWORD']),
					),
				})
				.strict(),
			z.null(),
		]),
		formValues: z.union([
			z.object({}).catchall(z.union([z.string(), z.boolean(), z.number()])),
			z.null(),
		]),
		title: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		completedAt: z.union([z.string(), z.null()]),
		deletedAt: z.union([z.string(), z.null()]),
		teamId: z.number(),
		folderId: z.union([z.string(), z.null()]),
		envelopeId: z.string(),
		internalVersion: z.number(),
		templateId: z.union([z.number(), z.null()]).optional(),
		documentDataId: z.string(),
		documentData: z
			.object({
				type: z.enum(['S3_PATH', 'BYTES', 'BYTES_64']),
				id: z.string(),
				data: z.string(),
				initialData: z.string(),
				envelopeItemId: z.string(),
			})
			.strict(),
		documentMeta: z
			.object({
				signingOrder: z.enum(['PARALLEL', 'SEQUENTIAL']),
				distributionMethod: z.enum(['EMAIL', 'NONE']),
				id: z.string(),
				subject: z.union([z.string(), z.null()]),
				message: z.union([z.string(), z.null()]),
				timezone: z.union([z.string(), z.null()]),
				dateFormat: z.union([z.string(), z.null()]),
				redirectUrl: z.union([z.string(), z.null()]),
				typedSignatureEnabled: z.boolean(),
				uploadSignatureEnabled: z.boolean(),
				drawSignatureEnabled: z.boolean(),
				allowDictateNextSigner: z.boolean(),
				language: z.string(),
				emailSettings: z.union([
					z
						.object({
							recipientSigningRequest: z.boolean(),
							recipientRemoved: z.boolean(),
							recipientSigned: z.boolean(),
							documentPending: z.boolean(),
							documentCompleted: z.boolean(),
							documentDeleted: z.boolean(),
							ownerDocumentCompleted: z.boolean(),
							ownerRecipientExpired: z.boolean(),
							ownerDocumentCreated: z.boolean(),
						})
						.strict(),
					z.null(),
				]),
				emailId: z.union([z.string(), z.null()]),
				emailReplyTo: z.union([z.string(), z.null()]),
				envelopeExpirationPeriod: z
					.union([
						z
							.object({
								unit: z.enum(['day', 'week', 'month', 'year']),
								amount: z.number().int().min(1),
							})
							.strict(),
						z
							.object({
								disabled: z.union([z.literal(true)]),
							})
							.strict(),
					])
					.nullable(),
				reminderSettings: z.union([
					z
						.object({
							sendAfter: z.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							]),
							repeatEvery: z.union([
								z
									.object({
										unit: z.enum(['day', 'week', 'month']),
										amount: z.number().int().min(1),
									})
									.strict(),
								z
									.object({
										disabled: z.union([z.literal(true)]),
									})
									.strict(),
							]),
						})
						.strict(),
					z.null(),
				]),
				password: z.union([z.string(), z.null()]),
				documentId: z.number().optional(),
			})
			.strict(),
		envelopeItems: z.array(
			z
				.object({
					id: z.string(),
					envelopeId: z.string(),
				})
				.strict(),
		),
		folder: z.union([
			z
				.object({
					id: z.string(),
					name: z.string(),
					type: z.enum(['DOCUMENT', 'TEMPLATE']),
					visibility: z.enum(['EVERYONE', 'MANAGER_AND_ABOVE', 'ADMIN']),
					userId: z.number(),
					teamId: z.number(),
					pinned: z.boolean(),
					parentId: z.union([z.string(), z.null()]),
					createdAt: z.string(),
					updatedAt: z.string(),
				})
				.strict(),
			z.null(),
		]),
		recipients: z.array(
			z
				.object({
					envelopeId: z.string(),
					role: z.enum(['CC', 'SIGNER', 'VIEWER', 'APPROVER', 'ASSISTANT']),
					readStatus: z.enum(['NOT_OPENED', 'OPENED']),
					signingStatus: z.enum(['NOT_SIGNED', 'SIGNED', 'REJECTED']),
					sendStatus: z.enum(['NOT_SENT', 'SENT']),
					id: z.number(),
					email: z.string(),
					name: z.string(),
					token: z.string(),
					documentDeletedAt: z.union([z.string(), z.null()]),
					expired: z.union([z.string(), z.null()]),
					expiresAt: z.union([z.string(), z.null()]),
					expirationNotifiedAt: z.union([z.string(), z.null()]),
					signedAt: z.union([z.string(), z.null()]),
					authOptions: z.union([
						z
							.object({
								accessAuth: z.array(z.enum(['ACCOUNT', 'TWO_FACTOR_AUTH'])),
								actionAuth: z.array(
									z.enum([
										'ACCOUNT',
										'PASSKEY',
										'TWO_FACTOR_AUTH',
										'PASSWORD',
										'EXPLICIT_NONE',
									]),
								),
							})
							.strict(),
						z.null(),
					]),
					signingOrder: z.union([z.number(), z.null()]),
					rejectionReason: z.union([z.string(), z.null()]),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
		fields: z.array(
			z
				.object({
					envelopeId: z.string(),
					envelopeItemId: z.string(),
					type: z.enum([
						'SIGNATURE',
						'FREE_SIGNATURE',
						'INITIALS',
						'NAME',
						'EMAIL',
						'DATE',
						'TEXT',
						'NUMBER',
						'RADIO',
						'CHECKBOX',
						'DROPDOWN',
					]),
					id: z.number(),
					secondaryId: z.string(),
					recipientId: z.number(),
					page: z.number(),
					positionX: FreeformJsonSchema,
					positionY: FreeformJsonSchema,
					width: FreeformJsonSchema,
					height: FreeformJsonSchema,
					customText: z.string(),
					inserted: z.boolean(),
					fieldMeta: z
						.union([
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['signature']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['initials']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['name']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['email']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z.enum(['auto', 'horizontal', 'vertical', 'crop']),
									type: z.enum(['date']),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['text']),
									text: z.string().optional(),
									characterLimit: z.number().min(0).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['number']),
									numberFormat: z.union([z.string(), z.null()]).optional(),
									value: z.string().optional(),
									minValue: z.union([z.number(), z.null()]).optional(),
									maxValue: z.union([z.number(), z.null()]).optional(),
									textAlign: z.enum(['left', 'center', 'right']).optional(),
									lineHeight: z
										.union([z.number().min(1).max(10), z.null()])
										.optional(),
									letterSpacing: z
										.union([z.number().min(0).max(100), z.null()])
										.optional(),
									verticalAlign: z
										.union([
											z.literal('top'),
											z.literal('middle'),
											z.literal('bottom'),
											z.literal(null),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['radio']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['checkbox']),
									values: z
										.array(
											z
												.object({
													id: z.number(),
													checked: z.boolean(),
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									validationRule: z.string().optional(),
									validationLength: z.number().optional(),
									direction: z.enum(['vertical', 'horizontal']),
								})
								.strict(),
							z
								.object({
									label: z.string().optional(),
									placeholder: z.string().optional(),
									required: z.boolean().optional(),
									readOnly: z.boolean().optional(),
									fontSize: z.number().min(8).max(96).optional(),
									overflow: z
										.enum(['auto', 'horizontal', 'vertical', 'crop'])
										.optional(),
									type: z.enum(['dropdown']),
									values: z
										.array(
											z
												.object({
													value: z.string(),
												})
												.strict(),
										)
										.optional(),
									defaultValue: z.string().optional(),
								})
								.strict(),
						])
						.nullable(),
					documentId: z.union([z.number(), z.null()]).optional(),
					templateId: z.union([z.number(), z.null()]).optional(),
				})
				.strict(),
		),
	})
	.strict();

export const TemplateCreateTemplateDirectLinkInputSchema = z
	.object({
		templateId: z.number(),
		directRecipientId: z.number().optional(),
	})
	.strict();
export const TemplateCreateTemplateDirectLinkOutputSchema = z
	.object({
		id: z.string(),
		token: z.string(),
		createdAt: z.string(),
		enabled: z.boolean(),
		directTemplateRecipientId: z.number(),
		envelopeId: z.string(),
		templateId: z.number(),
	})
	.strict();

export const TemplateDeleteTemplateDirectLinkInputSchema = z
	.object({
		templateId: z.number(),
	})
	.strict();
export const TemplateDeleteTemplateDirectLinkOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const TemplateToggleTemplateDirectLinkInputSchema = z
	.object({
		templateId: z.number(),
		enabled: z.boolean(),
	})
	.strict();
export const TemplateToggleTemplateDirectLinkOutputSchema = z
	.object({
		id: z.string(),
		token: z.string(),
		createdAt: z.string(),
		enabled: z.boolean(),
		directTemplateRecipientId: z.number(),
		envelopeId: z.string(),
		templateId: z.number(),
	})
	.strict();

export const EmbeddingPresignCreateEmbeddingPresignTokenInputSchema = z
	.object({
		expiresIn: z.number().min(0).max(10080).optional(),
		scope: z.string().optional(),
	})
	.strict();
export const EmbeddingPresignCreateEmbeddingPresignTokenOutputSchema = z
	.object({
		token: z.string(),
		expiresAt: z.string(),
		expiresIn: z.number(),
	})
	.strict();

export const EmbeddingPresignVerifyEmbeddingPresignTokenInputSchema = z
	.object({
		token: z.string().min(1),
		scope: z.string().optional(),
	})
	.strict();
export const EmbeddingPresignVerifyEmbeddingPresignTokenOutputSchema = z
	.object({
		success: z.boolean(),
	})
	.strict();

export const DocumensoEndpointInputSchemas = {
	envelopeAttachmentFind: EnvelopeAttachmentFindInputSchema,
	envelopeAttachmentCreate: EnvelopeAttachmentCreateInputSchema,
	envelopeAttachmentUpdate: EnvelopeAttachmentUpdateInputSchema,
	envelopeAttachmentDelete: EnvelopeAttachmentDeleteInputSchema,
	envelopeItemCreateMany: EnvelopeItemCreateManyInputSchema,
	envelopeItemUpdateMany: EnvelopeItemUpdateManyInputSchema,
	envelopeItemDelete: EnvelopeItemDeleteInputSchema,
	envelopeItemDownload: EnvelopeItemDownloadInputSchema,
	envelopeRecipientGet: EnvelopeRecipientGetInputSchema,
	envelopeRecipientCreateMany: EnvelopeRecipientCreateManyInputSchema,
	envelopeRecipientUpdateMany: EnvelopeRecipientUpdateManyInputSchema,
	envelopeRecipientDelete: EnvelopeRecipientDeleteInputSchema,
	envelopeRecipientRejectOnBehalfOf:
		EnvelopeRecipientRejectOnBehalfOfInputSchema,
	envelopeFieldGet: EnvelopeFieldGetInputSchema,
	envelopeFieldCreateMany: EnvelopeFieldCreateManyInputSchema,
	envelopeFieldUpdateMany: EnvelopeFieldUpdateManyInputSchema,
	envelopeFieldDelete: EnvelopeFieldDeleteInputSchema,
	envelopeFind: EnvelopeFindInputSchema,
	envelopeAuditLogFind: EnvelopeAuditLogFindInputSchema,
	envelopeAuditLogDownloadPdf: EnvelopeAuditLogDownloadPdfInputSchema,
	envelopeCertificateDownloadPdf: EnvelopeCertificateDownloadPdfInputSchema,
	envelopeGet: EnvelopeGetInputSchema,
	envelopeGetMany: EnvelopeGetManyInputSchema,
	envelopeCreate: EnvelopeCreateInputSchema,
	envelopeUse: EnvelopeUseInputSchema,
	envelopeUpdate: EnvelopeUpdateInputSchema,
	envelopeDelete: EnvelopeDeleteInputSchema,
	envelopeCancel: EnvelopeCancelInputSchema,
	envelopeDuplicate: EnvelopeDuplicateInputSchema,
	envelopeDistribute: EnvelopeDistributeInputSchema,
	envelopeRedistribute: EnvelopeRedistributeInputSchema,
	documentGet: DocumentGetInputSchema,
	documentGetMany: DocumentGetManyInputSchema,
	documentFind: DocumentFindInputSchema,
	documentCreate: DocumentCreateInputSchema,
	documentUpdate: DocumentUpdateInputSchema,
	documentDelete: DocumentDeleteInputSchema,
	documentDuplicate: DocumentDuplicateInputSchema,
	documentDistribute: DocumentDistributeInputSchema,
	documentRedistribute: DocumentRedistributeInputSchema,
	documentDownload: DocumentDownloadInputSchema,
	documentDownloadBeta: DocumentDownloadBetaInputSchema,
	documentCreateDocumentTemporary: DocumentCreateDocumentTemporaryInputSchema,
	documentAttachmentCreate: DocumentAttachmentCreateInputSchema,
	documentAttachmentUpdate: DocumentAttachmentUpdateInputSchema,
	documentAttachmentDelete: DocumentAttachmentDeleteInputSchema,
	documentAttachmentFind: DocumentAttachmentFindInputSchema,
	fieldGetDocumentField: FieldGetDocumentFieldInputSchema,
	fieldCreateDocumentField: FieldCreateDocumentFieldInputSchema,
	fieldCreateDocumentFields: FieldCreateDocumentFieldsInputSchema,
	fieldUpdateDocumentField: FieldUpdateDocumentFieldInputSchema,
	fieldUpdateDocumentFields: FieldUpdateDocumentFieldsInputSchema,
	fieldDeleteDocumentField: FieldDeleteDocumentFieldInputSchema,
	fieldCreateTemplateField: FieldCreateTemplateFieldInputSchema,
	fieldGetTemplateField: FieldGetTemplateFieldInputSchema,
	fieldCreateTemplateFields: FieldCreateTemplateFieldsInputSchema,
	fieldUpdateTemplateField: FieldUpdateTemplateFieldInputSchema,
	fieldUpdateTemplateFields: FieldUpdateTemplateFieldsInputSchema,
	fieldDeleteTemplateField: FieldDeleteTemplateFieldInputSchema,
	folderFindFolders: FolderFindFoldersInputSchema,
	folderCreateFolder: FolderCreateFolderInputSchema,
	folderUpdateFolder: FolderUpdateFolderInputSchema,
	folderDeleteFolder: FolderDeleteFolderInputSchema,
	recipientGetDocumentRecipient: RecipientGetDocumentRecipientInputSchema,
	recipientCreateDocumentRecipient: RecipientCreateDocumentRecipientInputSchema,
	recipientCreateDocumentRecipients:
		RecipientCreateDocumentRecipientsInputSchema,
	recipientUpdateDocumentRecipient: RecipientUpdateDocumentRecipientInputSchema,
	recipientUpdateDocumentRecipients:
		RecipientUpdateDocumentRecipientsInputSchema,
	recipientDeleteDocumentRecipient: RecipientDeleteDocumentRecipientInputSchema,
	recipientGetTemplateRecipient: RecipientGetTemplateRecipientInputSchema,
	recipientCreateTemplateRecipient: RecipientCreateTemplateRecipientInputSchema,
	recipientCreateTemplateRecipients:
		RecipientCreateTemplateRecipientsInputSchema,
	recipientUpdateTemplateRecipient: RecipientUpdateTemplateRecipientInputSchema,
	recipientUpdateTemplateRecipients:
		RecipientUpdateTemplateRecipientsInputSchema,
	recipientDeleteTemplateRecipient: RecipientDeleteTemplateRecipientInputSchema,
	templateFindTemplates: TemplateFindTemplatesInputSchema,
	templateGetTemplateById: TemplateGetTemplateByIdInputSchema,
	templateGetMany: TemplateGetManyInputSchema,
	templateCreateTemplate: TemplateCreateTemplateInputSchema,
	templateCreateTemplateTemporary: TemplateCreateTemplateTemporaryInputSchema,
	templateUpdateTemplate: TemplateUpdateTemplateInputSchema,
	templateDuplicateTemplate: TemplateDuplicateTemplateInputSchema,
	templateDeleteTemplate: TemplateDeleteTemplateInputSchema,
	templateCreateDocumentFromTemplate:
		TemplateCreateDocumentFromTemplateInputSchema,
	templateCreateTemplateDirectLink: TemplateCreateTemplateDirectLinkInputSchema,
	templateDeleteTemplateDirectLink: TemplateDeleteTemplateDirectLinkInputSchema,
	templateToggleTemplateDirectLink: TemplateToggleTemplateDirectLinkInputSchema,
	embeddingPresignCreateEmbeddingPresignToken:
		EmbeddingPresignCreateEmbeddingPresignTokenInputSchema,
	embeddingPresignVerifyEmbeddingPresignToken:
		EmbeddingPresignVerifyEmbeddingPresignTokenInputSchema,
} as const;

export const DocumensoEndpointOutputSchemas = {
	envelopeAttachmentFind: EnvelopeAttachmentFindOutputSchema,
	envelopeAttachmentCreate: EnvelopeAttachmentCreateOutputSchema,
	envelopeAttachmentUpdate: EnvelopeAttachmentUpdateOutputSchema,
	envelopeAttachmentDelete: EnvelopeAttachmentDeleteOutputSchema,
	envelopeItemCreateMany: EnvelopeItemCreateManyOutputSchema,
	envelopeItemUpdateMany: EnvelopeItemUpdateManyOutputSchema,
	envelopeItemDelete: EnvelopeItemDeleteOutputSchema,
	envelopeItemDownload: EnvelopeItemDownloadOutputSchema,
	envelopeRecipientGet: EnvelopeRecipientGetOutputSchema,
	envelopeRecipientCreateMany: EnvelopeRecipientCreateManyOutputSchema,
	envelopeRecipientUpdateMany: EnvelopeRecipientUpdateManyOutputSchema,
	envelopeRecipientDelete: EnvelopeRecipientDeleteOutputSchema,
	envelopeRecipientRejectOnBehalfOf:
		EnvelopeRecipientRejectOnBehalfOfOutputSchema,
	envelopeFieldGet: EnvelopeFieldGetOutputSchema,
	envelopeFieldCreateMany: EnvelopeFieldCreateManyOutputSchema,
	envelopeFieldUpdateMany: EnvelopeFieldUpdateManyOutputSchema,
	envelopeFieldDelete: EnvelopeFieldDeleteOutputSchema,
	envelopeFind: EnvelopeFindOutputSchema,
	envelopeAuditLogFind: EnvelopeAuditLogFindOutputSchema,
	envelopeAuditLogDownloadPdf: EnvelopeAuditLogDownloadPdfOutputSchema,
	envelopeCertificateDownloadPdf: EnvelopeCertificateDownloadPdfOutputSchema,
	envelopeGet: EnvelopeGetOutputSchema,
	envelopeGetMany: EnvelopeGetManyOutputSchema,
	envelopeCreate: EnvelopeCreateOutputSchema,
	envelopeUse: EnvelopeUseOutputSchema,
	envelopeUpdate: EnvelopeUpdateOutputSchema,
	envelopeDelete: EnvelopeDeleteOutputSchema,
	envelopeCancel: EnvelopeCancelOutputSchema,
	envelopeDuplicate: EnvelopeDuplicateOutputSchema,
	envelopeDistribute: EnvelopeDistributeOutputSchema,
	envelopeRedistribute: EnvelopeRedistributeOutputSchema,
	documentGet: DocumentGetOutputSchema,
	documentGetMany: DocumentGetManyOutputSchema,
	documentFind: DocumentFindOutputSchema,
	documentCreate: DocumentCreateOutputSchema,
	documentUpdate: DocumentUpdateOutputSchema,
	documentDelete: DocumentDeleteOutputSchema,
	documentDuplicate: DocumentDuplicateOutputSchema,
	documentDistribute: DocumentDistributeOutputSchema,
	documentRedistribute: DocumentRedistributeOutputSchema,
	documentDownload: DocumentDownloadOutputSchema,
	documentDownloadBeta: DocumentDownloadBetaOutputSchema,
	documentCreateDocumentTemporary: DocumentCreateDocumentTemporaryOutputSchema,
	documentAttachmentCreate: DocumentAttachmentCreateOutputSchema,
	documentAttachmentUpdate: DocumentAttachmentUpdateOutputSchema,
	documentAttachmentDelete: DocumentAttachmentDeleteOutputSchema,
	documentAttachmentFind: DocumentAttachmentFindOutputSchema,
	fieldGetDocumentField: FieldGetDocumentFieldOutputSchema,
	fieldCreateDocumentField: FieldCreateDocumentFieldOutputSchema,
	fieldCreateDocumentFields: FieldCreateDocumentFieldsOutputSchema,
	fieldUpdateDocumentField: FieldUpdateDocumentFieldOutputSchema,
	fieldUpdateDocumentFields: FieldUpdateDocumentFieldsOutputSchema,
	fieldDeleteDocumentField: FieldDeleteDocumentFieldOutputSchema,
	fieldCreateTemplateField: FieldCreateTemplateFieldOutputSchema,
	fieldGetTemplateField: FieldGetTemplateFieldOutputSchema,
	fieldCreateTemplateFields: FieldCreateTemplateFieldsOutputSchema,
	fieldUpdateTemplateField: FieldUpdateTemplateFieldOutputSchema,
	fieldUpdateTemplateFields: FieldUpdateTemplateFieldsOutputSchema,
	fieldDeleteTemplateField: FieldDeleteTemplateFieldOutputSchema,
	folderFindFolders: FolderFindFoldersOutputSchema,
	folderCreateFolder: FolderCreateFolderOutputSchema,
	folderUpdateFolder: FolderUpdateFolderOutputSchema,
	folderDeleteFolder: FolderDeleteFolderOutputSchema,
	recipientGetDocumentRecipient: RecipientGetDocumentRecipientOutputSchema,
	recipientCreateDocumentRecipient:
		RecipientCreateDocumentRecipientOutputSchema,
	recipientCreateDocumentRecipients:
		RecipientCreateDocumentRecipientsOutputSchema,
	recipientUpdateDocumentRecipient:
		RecipientUpdateDocumentRecipientOutputSchema,
	recipientUpdateDocumentRecipients:
		RecipientUpdateDocumentRecipientsOutputSchema,
	recipientDeleteDocumentRecipient:
		RecipientDeleteDocumentRecipientOutputSchema,
	recipientGetTemplateRecipient: RecipientGetTemplateRecipientOutputSchema,
	recipientCreateTemplateRecipient:
		RecipientCreateTemplateRecipientOutputSchema,
	recipientCreateTemplateRecipients:
		RecipientCreateTemplateRecipientsOutputSchema,
	recipientUpdateTemplateRecipient:
		RecipientUpdateTemplateRecipientOutputSchema,
	recipientUpdateTemplateRecipients:
		RecipientUpdateTemplateRecipientsOutputSchema,
	recipientDeleteTemplateRecipient:
		RecipientDeleteTemplateRecipientOutputSchema,
	templateFindTemplates: TemplateFindTemplatesOutputSchema,
	templateGetTemplateById: TemplateGetTemplateByIdOutputSchema,
	templateGetMany: TemplateGetManyOutputSchema,
	templateCreateTemplate: TemplateCreateTemplateOutputSchema,
	templateCreateTemplateTemporary: TemplateCreateTemplateTemporaryOutputSchema,
	templateUpdateTemplate: TemplateUpdateTemplateOutputSchema,
	templateDuplicateTemplate: TemplateDuplicateTemplateOutputSchema,
	templateDeleteTemplate: TemplateDeleteTemplateOutputSchema,
	templateCreateDocumentFromTemplate:
		TemplateCreateDocumentFromTemplateOutputSchema,
	templateCreateTemplateDirectLink:
		TemplateCreateTemplateDirectLinkOutputSchema,
	templateDeleteTemplateDirectLink:
		TemplateDeleteTemplateDirectLinkOutputSchema,
	templateToggleTemplateDirectLink:
		TemplateToggleTemplateDirectLinkOutputSchema,
	embeddingPresignCreateEmbeddingPresignToken:
		EmbeddingPresignCreateEmbeddingPresignTokenOutputSchema,
	embeddingPresignVerifyEmbeddingPresignToken:
		EmbeddingPresignVerifyEmbeddingPresignTokenOutputSchema,
} as const;

export type DocumensoEndpointInputs = {
	[K in keyof typeof DocumensoEndpointInputSchemas]: z.infer<
		(typeof DocumensoEndpointInputSchemas)[K]
	>;
};
export type DocumensoEndpointOutputs = {
	[K in keyof typeof DocumensoEndpointOutputSchemas]: z.infer<
		(typeof DocumensoEndpointOutputSchemas)[K]
	>;
};
