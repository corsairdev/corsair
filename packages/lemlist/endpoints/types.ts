import { z } from 'zod';

// Shared Lemlist API Schemas
// Passthrough is enabled because Lemlist API responses may include additional provider-specific metadata.

export const TeamUserSchema = z
	.object({
		userId: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		role: z.string().optional(),
	})
	// `passthrough` because Lemlist returns additional user attributes.
	.passthrough();

export const TeamHookSchema = z
	.object({
		_id: z.string().optional(),
		targetUrl: z.string().optional(),
		createdAt: z.string().optional(),
		type: z.string().optional(),
		campaignId: z.string().optional(),
		isFirst: z.boolean().optional(),
	})
	// `passthrough` because webhook objects carry provider-specific fields.
	.passthrough();

export const TeamSchema = z
	.object({
		_id: z.string(),
		name: z.string().optional(),
		userIds: z.array(z.string()).optional(),
		createdBy: z.string().optional(),
		createdAt: z.string().optional(),
		hooks: z.array(TeamHookSchema).optional(),
		users: z.array(TeamUserSchema).optional(),
		pictureId: z.string().nullable().optional(),
		customDomain: z.string().nullable().optional(),
	})
	// `passthrough` because team details can carry additional flags.
	.passthrough();

export const TeamSenderCampaignSchema = z
	.object({
		_id: z.string().optional(),
		name: z.string().optional(),
		status: z.string().optional(),
		sendingChannels: z.array(z.string()).optional(),
	})
	// `passthrough` because campaign sender links contain extra settings.
	.passthrough();

export const TeamSenderSchema = z
	.object({
		userId: z.string(),
		campaigns: z.array(TeamSenderCampaignSchema).optional(),
	})
	// `passthrough` because sender profiles vary by integration.
	.passthrough();

export const TeamCreditsDetailSchema = z
	.object({
		remaining: z
			.object({
				total: z.number().int().optional(),
				freemium: z.number().int().optional(),
				subscription: z.number().int().optional(),
				gifted: z.number().int().optional(),
				paid: z.number().int().optional(),
			})
			.passthrough()
			.optional(),
	})
	// `passthrough` because credit categories may expand.
	.passthrough();

export const TeamCreditsSchema = z
	.object({
		credits: z.number().int(),
		details: TeamCreditsDetailSchema.optional(),
	})
	// `passthrough` because credit payloads vary by plan.
	.passthrough();

export const TeamCrmUserSchema = z
	.object({
		userId: z.string(),
		crm: z.string(),
	})
	// `passthrough` because CRM connections may return extra identifiers.
	.passthrough();

export const CampaignSettingsSchema = z
	.object({
		campaignId: z.string(),
		timezone: z.string().nullable(),
		senderStrategy: z.string(),
		general: z
			.object({
				labels: z.array(
					z.object({ id: z.string(), name: z.string() }).passthrough(),
				),
				sequenceId: z.string(),
				sequenceSharing: z.boolean(),
				unsubscribeMode: z.enum(['variable', 'contact']),
				addUnsubscribeLink: z.boolean(),
				unsubscribeLinkText: z.string(),
			})
			.passthrough(),
		senders: z
			.object({
				espMatching: z.boolean(),
				espRouting: z
					.object({
						gmail: z.enum(['any', 'gmail', 'outlook', 'other']).optional(),
						outlook: z.enum(['any', 'gmail', 'outlook', 'other']).optional(),
						other: z.enum(['any', 'gmail', 'outlook', 'other']).optional(),
					})
					.nullable(),
			})
			.passthrough(),
		schedule: z
			.object({
				isTimezoneBasedSchedule: z.boolean(),
				timezoneBasedScheduleId: z.string().nullable(),
				scheduleIds: z.array(z.string()),
				holidayCountries: z.array(z.enum(['US', 'FR', 'GB'])),
				sendingPattern: z
					.object({ newLeadsPriorityRatio: z.number().min(0).max(1) })
					.optional(),
			})
			.passthrough(),
		tracking: z
			.object({
				trackOpens: z.boolean(),
				trackClicks: z.boolean(),
				trackReplies: z.boolean(),
			})
			.passthrough(),
		automation: z
			.object({
				autoReview: z.boolean(),
				autoReviewConditions: z.array(
					z.enum([
						'deliverable',
						'risky',
						'unknown',
						'undeliverable',
						'unverified',
					]),
				),
			})
			.passthrough(),
		onReplied: z
			.object({
				createNewTask: z.boolean(),
				campaignProgress: z.enum(['continue', 'pause', 'stop']),
				propagateProgressToCompany: z.boolean(),
				disableOutOfOffice: z.boolean(),
			})
			.passthrough(),
		onLinkClicked: z
			.object({
				createNewTask: z.boolean(),
				campaignProgress: z.enum(['continue', 'pause', 'stop']),
				propagateProgressToCompany: z.boolean(),
				specificLinks: z.array(z.string()).max(50),
			})
			.passthrough(),
		onMeetingBooked: z
			.object({
				campaignProgress: z.enum(['continue', 'pause', 'stop']),
				propagateProgressToCompany: z.boolean(),
			})
			.passthrough(),
		aiFeatures: z
			.object({
				scoreReplies: z.boolean(),
				onInterestedReply: z
					.object({
						enabled: z.boolean(),
						pauseAllCampaignsForLead: z.boolean(),
						pauseCampaignForCompany: z.boolean(),
						pauseAllCampaignsForCompany: z.boolean(),
					})
					.passthrough(),
				onNotInterestedReply: z
					.object({
						enabled: z.boolean(),
						pauseAllCampaignsForLead: z.boolean(),
						pauseCampaignForCompany: z.boolean(),
						pauseAllCampaignsForCompany: z.boolean(),
					})
					.passthrough(),
			})
			.passthrough(),
	})
	// `passthrough` because Lemlist may extend campaign settings with new sections.
	.passthrough();

export const CampaignSchema = z
	.object({
		_id: z.string(),
		name: z.string(),
		status: z.string().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		timezone: z.string().optional(),
		emoji: z.string().optional(),
		autoReview: z.boolean().optional(),
		sendUserIds: z.array(z.string()).optional(),
		settings: CampaignSettingsSchema.optional(),
	})
	// `passthrough` because campaigns include sequences and step configurations.
	.passthrough();

export const CampaignStatutesSchema = z
	.object({
		name: z.string(),
		status: z.string(),
		statutes: z.array(
			z.object({
				type: z.enum(['issue', 'information']),
				level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
				message: z.string(),
				category: z.string().optional(),
			}),
		),
	})
	// `passthrough` because Lemlist may add statute metadata over time.
	.passthrough();

export const CampaignActionSchema = z
	.object({
		_id: z.string(),
		state: z.string().optional(),
		archived: z.boolean().optional(),
	})
	.passthrough();

const CampaignPerChannelStatsSchema = z
	.object({
		email: z
			.object({
				sent: z.number().optional(),
				delivered: z.number().optional(),
				notDelivered: z.number().optional(),
				opened: z.number().optional(),
				clicked: z.number().optional(),
				replied: z.number().optional(),
				bounced: z.number().optional(),
				unsubscribed: z.number().optional(),
			})
			.passthrough()
			.optional(),
		linkedin: z
			.object({
				sent: z.number().optional(),
				delivered: z.number().optional(),
				notDelivered: z.number().optional(),
				opened: z.number().optional(),
				replied: z.number().optional(),
				invitationAccepted: z.number().optional(),
				breakdown: z
					.object({
						sent: z
							.object({
								messages: z.number(),
								inMails: z.number(),
								voiceNotes: z.number(),
							})
							.passthrough(),
						notDelivered: z
							.object({
								messages: z.number(),
								inMails: z.number(),
								voiceNotes: z.number(),
							})
							.passthrough(),
					})
					.passthrough()
					.optional(),
			})
			.passthrough()
			.optional(),
		sms: z
			.object({
				sent: z.number().optional(),
				delivered: z.number().optional(),
				notDelivered: z.number().optional(),
				replied: z.number().optional(),
			})
			.passthrough()
			.optional(),
		whatsapp: z
			.object({
				sent: z.number().optional(),
				delivered: z.number().optional(),
				notDelivered: z.number().optional(),
				opened: z.number().optional(),
				replied: z.number().optional(),
			})
			.passthrough()
			.optional(),
		others: z
			.object({
				unsubscribed: z.number().optional(),
				interested: z.number().optional(),
				notInterested: z.number().optional(),
			})
			.passthrough()
			.optional(),
	})
	// Lemlist adds channel counters as supported channels evolve.
	.passthrough();

export const CampaignStatsSchema = z
	.object({
		campaignId: z.string().optional(),
		nbLeads: z.number().optional(),
		nbLeadsLaunched: z.number().optional(),
		nbLeadsReached: z.number().optional(),
		nbLeadsOpened: z.number().optional(),
		nbLeadsInteracted: z.number().optional(),
		nbLeadsAnswered: z.number().optional(),
		nbLeadsInterested: z.number().optional(),
		nbLeadsNotInterested: z.number().optional(),
		nbLeadsUnsubscribed: z.number().optional(),
		nbLeadsInterrupted: z.number().optional(),
		messagesSent: z.number().optional(),
		messagesNotSent: z.number().optional(),
		messagesBounced: z.number().optional(),
		delivered: z.number().optional(),
		opened: z.number().optional(),
		clicked: z.number().optional(),
		replied: z.number().optional(),
		invitationAccepted: z.number().optional(),
		meetingBooked: z.number().optional(),
		perChannel: CampaignPerChannelStatsSchema.optional(),
		steps: z
			.array(
				z
					.object({
						index: z.number().optional(),
						sequenceId: z.string().optional(),
						sequenceStep: z.number().optional(),
						abTest: z.string().optional(),
						taskType: z
							.enum([
								'email',
								'linkedinVisit',
								'linkedinInvite',
								'linkedinSend',
								'phone',
								'manual',
								'conditional',
							])
							.optional(),
						conditionLabel: z.string().optional(),
						invited: z.number().optional(),
						invitationAccepted: z.number().optional(),
						sent: z.number().optional(),
						delivered: z.number().optional(),
						opened: z.number().optional(),
						clicked: z.number().optional(),
						replied: z.number().optional(),
						notDelivered: z.number().optional(),
						bounced: z.number().optional(),
						unsubscribed: z.number().optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	// `passthrough` because metrics may include additional rates.
	.passthrough();

export const BatchCampaignStatsSchema = z
	.object({
		results: z.array(CampaignStatsSchema),
		errors: z
			.array(
				z.object({ campaignId: z.string(), error: z.string() }).passthrough(),
			)
			.optional(),
	})
	// `passthrough` because the provider may add aggregate fields.
	.passthrough();

export const CampaignReportSchema = z
	.object({
		_id: z.string(),
		name: z.string().optional(),
		totalCount: z.number().optional(),
		reviewedCount: z.number().optional(),
		inSequenceLeadCount: z.number().optional(),
		state: z.string().optional(),
		status: z.string().optional(),
		emailsSent: z.number().optional(),
		emailsOpened: z.number().optional(),
		emailsClicked: z.number().optional(),
		emailsReplied: z.number().optional(),
	})
	// `passthrough` because reports carry custom KPI calculations.
	.passthrough();

export const CampaignExportStatusSchema = z
	.object({
		_id: z.string().optional(),
		id: z.string().optional(),
		teamId: z.string().optional(),
		campaignId: z.string().optional(),
		campaignName: z.string().optional(),
		status: z.enum(['pending', 'done', 'error']),
		startedAt: z.string().optional(),
		endedAt: z.string().optional(),
		progress: z.number().optional(),
		total: z.number().optional(),
		url: z.string().optional(),
		fileSize: z.number().optional(),
	})
	// `passthrough` because export jobs include task progress fields.
	.passthrough();

export const CampaignExportStatusResponseSchema = z
	.object({
		ok: z.boolean(),
		status: CampaignExportStatusSchema,
	})
	.passthrough();

export const LeadSchema = z
	.object({
		_id: z.string(),
		email: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		companyName: z.string().optional(),
		jobTitle: z.string().optional(),
		companyDomain: z.string().optional(),
		isPaused: z.boolean().optional(),
		campaignId: z.string().optional(),
		contactId: z.string().optional(),
		emailStatus: z.string().optional(),
		state: z.string().optional(),
		status: z.string().optional(),
		// `unknown` because LeadV2 variables are free-form (strings, numbers, nested enrichment values).
		variables: z.record(z.string(), z.unknown()).optional(),
	})
	// `passthrough` because leads carry arbitrary custom variables and enrichment fields.
	.passthrough();

export const LeadVariablesResponseSchema = z
	.object({
		ok: z.boolean(),
		warnings: z
			.array(
				z.object({
					code: z.string(),
					message: z.string(),
					params: z
						.record(z.string(), z.union([z.string(), z.array(z.string())]))
						.optional(),
				}),
			)
			.optional(),
	})
	.passthrough();

export const CrmFilterSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string(),
		type: z.string().optional(),
	})
	// `passthrough` because CRM list views vary by CRM provider.
	.passthrough();

export const ActivityTypeSchema = z.enum([
	'emailsSent',
	'emailsOpened',
	'emailsClicked',
	'emailsReplied',
	'emailsExternalSent',
	'emailsExternalReceived',
	'emailsDone',
	'emailsIgnored',
	'emailsBounced',
	'emailsFailed',
	'emailsUnsubscribed',
	'emailsInterested',
	'emailsNotInterested',
	'snoozed',
	'annotated',
	'aircallDone',
	'aircallIgnored',
	'aircallCreated',
	'aircallEnded',
	'aircallInterested',
	'aircallNotInterested',
	'apiDone',
	'apiIgnored',
	'apiInterested',
	'apiNotInterested',
	'apiFailed',
	'apiUnsubscribed',
	'enrichmentDone',
	'enrichmentFailed',
	'enrichmentSkipped',
	'linkedinVisitDone',
	'linkedinVisitFailed',
	'linkedinVisitSkipped',
	'linkedinCommentLastPostDone',
	'linkedinCommentLastPostFailed',
	'linkedinCommentLastPostSkipped',
	'linkedinFollowDone',
	'linkedinFollowFailed',
	'linkedinFollowSkipped',
	'linkedinLikeLastPostDone',
	'linkedinLikeLastPostNoPost',
	'linkedinLikeLastPostFailed',
	'linkedinLikeLastPostSkipped',
	'linkedinInviteDone',
	'linkedinEndorseDone',
	'linkedinEndorseFailed',
	'linkedinEndorseSkipped',
	'linkedinSent',
	'linkedinInMailSent',
	'linkedinOpened',
	'linkedinInviteAccepted',
	'linkedinInviteFailed',
	'linkedinSendFailed',
	'linkedinInMailFailed',
	'linkedinInMailSkipped',
	'linkedinVoiceNoteDone',
	'linkedinVoiceNoteFailed',
	'linkedinWithdrawInvitationDone',
	'linkedinWithdrawInvitationFailed',
	'linkedinVoiceNoteReplied',
	'whatsappMessageSent',
	'whatsappMessageDelivered',
	'whatsappMessageOpened',
	'whatsappReplied',
	'whatsappMessageFailed',
	'whatsappDone',
	'whatsappIgnored',
	'whatsappVoiceNoteSent',
	'whatsappVoiceNoteDelivered',
	'whatsappVoiceNoteOpened',
	'whatsappVoiceNoteReplied',
	'whatsappVoiceNoteFailed',
	'whatsappVoiceNoteIgnored',
	'smsSent',
	'smsDone',
	'smsDelivered',
	'smsReplied',
	'smsIgnored',
	'smsFailed',
	'aiVariableDone',
	'aiVariableFailed',
	'linkedinReplied',
	'linkedinInterested',
	'linkedinNotInterested',
	'linkedinDone',
	'linkedinIgnored',
	'manualDone',
	'manualIgnored',
	'manualInterested',
	'manualNotInterested',
	'manualUnsubscribed',
	'scheduleCancelled',
	'paused',
	'stopped',
	'resumed',
	'skipped',
	'meetingBooked',
	'conditionChosen',
	'conditionalFailed',
	'sendToAnotherCampaign',
	'manualEmailQueued',
	'manualLinkedinSendQueued',
	'manualLinkedinVoiceNoteQueued',
	'manualLinkedinInviteQueued',
	'manualLinkedinCommentLastPostQueued',
	'manualWhatsappMessageQueued',
	'manualWhatsappVoiceNoteQueued',
	'outOfOffice',
	'mailinblackDetected',
	'entityUnsubscribed',
	'variableUnsubscribed',
	'entitySubscribed',
	'variableSubscribed',
]);

export const ActivitySchema = z
	.object({
		_id: z.string(),
		type: ActivityTypeSchema,
		userId: z.string().optional(),
		userName: z.string().optional(),
		bot: z.boolean().optional(),
		createdAt: z.string().optional(),
		campaignId: z.string().optional(),
		campaignName: z.string().optional(),
		leadId: z.string().optional(),
		leadEmail: z.string().optional(),
		leadFirstName: z.string().optional(),
		leadLastName: z.string().optional(),
		leadCompanyName: z.string().optional(),
		contactId: z.string().optional(),
	})
	// `passthrough` because activities carry channel-specific metadata.
	.passthrough();

export const UnsubscribeVariableSchema = z
	.object({
		_id: z.string(),
		value: z.string(),
		variable: z.string().optional(),
		source: z.enum(['api', 'bounced', 'lead', 'user', 'abuse']).optional(),
		createdAt: z.string().optional(),
	})
	// `passthrough` because unsubscribed variables carry extra audit metadata.
	.passthrough();

export const UnsubscribeContactSchema = z
	.object({
		_id: z.string(),
		doNotContact: z.boolean(),
	})
	// `passthrough` because unsubscribed contacts carry extra status flags.
	.passthrough();

// ── Per-Operation Input and Response Schemas ────────────────────────────────

export const TeamGetInputSchema = z.strictObject({
	version: z.enum(['v2']).optional(),
});
export type TeamGetInput = z.infer<typeof TeamGetInputSchema>;

export const TeamGetResponseSchema = TeamSchema;
export type TeamGetResponse = z.infer<typeof TeamGetResponseSchema>;

export const TeamGetSendersInputSchema = z.strictObject({
	state: z
		.enum(['running', 'paused', 'draft', 'ended', 'archived', 'errors'])
		.optional(),
});
export type TeamGetSendersInput = z.infer<typeof TeamGetSendersInputSchema>;

export const TeamGetSendersResponseSchema = z.array(TeamSenderSchema);
export type TeamGetSendersResponse = z.infer<
	typeof TeamGetSendersResponseSchema
>;

export const TeamGetCreditsInputSchema = z.strictObject({});
export type TeamGetCreditsInput = z.infer<typeof TeamGetCreditsInputSchema>;

export const TeamGetCreditsResponseSchema = TeamCreditsSchema;
export type TeamGetCreditsResponse = z.infer<
	typeof TeamGetCreditsResponseSchema
>;

export const TeamGetCrmUsersInputSchema = z.strictObject({});
export type TeamGetCrmUsersInput = z.infer<typeof TeamGetCrmUsersInputSchema>;

export const TeamGetCrmUsersResponseSchema = z.array(TeamCrmUserSchema);
export type TeamGetCrmUsersResponse = z.infer<
	typeof TeamGetCrmUsersResponseSchema
>;

export const CampaignsListInputSchema = z.strictObject({
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(100).optional(),
	version: z.enum(['v2']).optional(),
	page: z.number().int().min(1).optional(),
	sortBy: z.enum(['createdAt']).optional(),
	sortOrder: z.enum(['asc', 'desc']).optional(),
	status: z
		.enum(['running', 'draft', 'archived', 'ended', 'paused', 'errors'])
		.optional(),
	createdBy: z.string().optional(),
});
export type CampaignsListInput = z.infer<typeof CampaignsListInputSchema>;

// With `version=v2` (always sent) Lemlist wraps the page: `{ campaigns, pagination }`.
// A bare array (legacy shape) is normalised to the same envelope by the endpoint.
export const CampaignsListResponseSchema = z
	.object({
		campaigns: z.array(CampaignSchema),
		pagination: z
			.object({
				totalRecords: z.number().optional(),
				currentPage: z.number().optional(),
				nextPage: z.number().optional(),
				totalPage: z.number().optional(),
			})
			// `passthrough` because Lemlist may add paging fields.
			.passthrough()
			.optional(),
	})
	.passthrough();
export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

export const CampaignsCreateInputSchema = z.strictObject({
	name: z.string().min(1),
	timezone: z.string().optional(),
	emoji: z
		.string()
		.trim()
		.min(1)
		.refine((value) => !/[<>]/.test(value))
		.optional(),
	autoReview: z.boolean().optional(),
	autoReviewConditions: z
		.array(z.enum(['deliverable', 'risky', 'undeliverable', 'unverified']))
		.optional(),
});
export type CampaignsCreateInput = z.infer<typeof CampaignsCreateInputSchema>;

export const CampaignsCreateResponseSchema = CampaignSchema;
export type CampaignsCreateResponse = z.infer<
	typeof CampaignsCreateResponseSchema
>;

export const CampaignsGetInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsGetInput = z.infer<typeof CampaignsGetInputSchema>;

export const CampaignsGetResponseSchema = CampaignSchema;
export type CampaignsGetResponse = z.infer<typeof CampaignsGetResponseSchema>;

export const CampaignsUpdateInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	name: z.string().min(1).optional(),
	emoji: z
		.string()
		.trim()
		.min(1)
		.refine((value) => !/[<>]/.test(value))
		.optional(),
	sendUserIds: z.array(z.string()).optional(),
	stopOnEmailReplied: z.boolean().optional(),
	stopOnMeetingBooked: z.boolean().optional(),
	stopOnLinkClicked: z.boolean().optional(),
	leadsPausedByInterest: z.boolean().optional(),
	opportunityReplied: z.boolean().optional(),
	opportunityClicked: z.boolean().optional(),
	autoLeadInterest: z.boolean().optional(),
	disableTrackOpen: z.boolean().optional(),
	disableTrackClick: z.boolean().optional(),
	disableTrackReply: z.boolean().optional(),
	disableOutOfOffice: z.boolean().optional(),
	sequenceSharing: z.boolean().optional(),
	stopOnLinkClickedFilter: z.string().optional(),
	autoReview: z.boolean().optional(),
	autoReviewConditions: z
		.array(z.enum(['deliverable', 'risky', 'undeliverable', 'unverified']))
		.optional(),
	aiFeatures: z
		.strictObject({
			scoreReplies: z.boolean().optional(),
			onInterestedReply: z
				.strictObject({
					enabled: z.boolean().optional(),
					pauseAllCampaignsForLead: z.boolean().optional(),
					pauseCampaignForCompany: z.boolean().optional(),
					pauseAllCampaignsForCompany: z.boolean().optional(),
				})
				.optional(),
			onNotInterestedReply: z
				.strictObject({
					enabled: z.boolean().optional(),
					pauseAllCampaignsForLead: z.boolean().optional(),
					pauseCampaignForCompany: z.boolean().optional(),
					pauseAllCampaignsForCompany: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
	tracking: z
		.strictObject({
			trackOpens: z.boolean().optional(),
			trackClicks: z.boolean().optional(),
			trackReplies: z.boolean().optional(),
		})
		.optional(),
	onReplied: z
		.strictObject({
			createNewTask: z.boolean().optional(),
			campaignProgress: z.enum(['continue', 'pause', 'stop']).optional(),
			propagateProgressToCompany: z.boolean().optional(),
			disableOutOfOffice: z.boolean().optional(),
		})
		.optional(),
	onLinkClicked: z
		.strictObject({
			createNewTask: z.boolean().optional(),
			campaignProgress: z.enum(['continue', 'pause', 'stop']).optional(),
			propagateProgressToCompany: z.boolean().optional(),
			specificLinks: z.array(z.string()).max(50).optional(),
		})
		.optional(),
	onMeetingBooked: z
		.strictObject({
			campaignProgress: z.enum(['continue', 'pause', 'stop']).optional(),
			propagateProgressToCompany: z.boolean().optional(),
		})
		.optional(),
});
export type CampaignsUpdateInput = z.infer<typeof CampaignsUpdateInputSchema>;

export const CampaignsUpdateResponseSchema = z
	.object({
		name: z.string().optional(),
		emoji: z.string().optional(),
		sendUsers: z
			.array(
				z
					.object({
						id: z.string(),
						mailboxes: z
							.array(
								z
									.object({ sendUserMailboxId: z.string(), email: z.string() })
									.passthrough(),
							)
							.optional(),
						phoneNumbers: z.array(z.string()).optional(),
						whatsappAccountIds: z.array(z.string()).optional(),
					})
					.passthrough(),
			)
			.optional(),
		stopOnEmailReplied: z.boolean().optional(),
		stopOnMeetingBooked: z.boolean().optional(),
		stopOnLinkClicked: z.boolean().optional(),
		leadsPausedByInterest: z.boolean().optional(),
		opportunityReplied: z.boolean().optional(),
		opportunityClicked: z.boolean().optional(),
		autoLeadInterest: z.boolean().optional(),
		disableTrackOpen: z.boolean().optional(),
		disableTrackClick: z.boolean().optional(),
		disableTrackReply: z.boolean().optional(),
		disableOutOfOffice: z.boolean().optional(),
		sequenceSharing: z.boolean().optional(),
		stopOnLinkClickedFilter: z.string().optional(),
		aiFeatures: CampaignSettingsSchema.shape.aiFeatures.optional(),
		tracking: CampaignSettingsSchema.shape.tracking.optional(),
		onReplied: CampaignSettingsSchema.shape.onReplied.optional(),
		onLinkClicked: CampaignSettingsSchema.shape.onLinkClicked.optional(),
		onMeetingBooked: CampaignSettingsSchema.shape.onMeetingBooked.optional(),
	})
	// Lemlist returns changed settings and sender details, not a full campaign object.
	.passthrough();
export type CampaignsUpdateResponse = z.infer<
	typeof CampaignsUpdateResponseSchema
>;

export const CampaignsGetSettingsInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsGetSettingsInput = z.infer<
	typeof CampaignsGetSettingsInputSchema
>;

export const CampaignsGetSettingsResponseSchema = CampaignSettingsSchema;
export type CampaignsGetSettingsResponse = z.infer<
	typeof CampaignsGetSettingsResponseSchema
>;

export const CampaignsUpdateSettingsInputSchema = z
	.strictObject({
		campaignId: z.string().min(1),
		senderStrategy: z
			.string()
			.regex(/^(random|contactOwner|leadImporter|customField:.+)$/)
			.optional(),
		general: z
			.strictObject({
				sequenceSharing: z.boolean().optional(),
				unsubscribeMode: z.enum(['variable', 'contact']).optional(),
				addUnsubscribeLink: z.boolean().optional(),
				unsubscribeLinkText: z.string().nullable().optional(),
			})
			.optional(),
		senders: z.strictObject({ espMatching: z.boolean().optional() }).optional(),
		automation: z
			.strictObject({
				autoReview: z.boolean().optional(),
				autoReviewConditions: z
					.array(
						z.enum([
							'deliverable',
							'risky',
							'unknown',
							'undeliverable',
							'unverified',
						]),
					)
					.optional(),
			})
			.optional(),
		tracking: z
			.strictObject({
				trackOpens: z.boolean().optional(),
				trackClicks: z.boolean().optional(),
				trackReplies: z.boolean().optional(),
			})
			.optional(),
		onReplied: z
			.strictObject({
				createNewTask: z.boolean().optional(),
				campaignProgress: z.enum(['continue', 'pause', 'stop']).optional(),
				propagateProgressToCompany: z.boolean().optional(),
				disableOutOfOffice: z.boolean().optional(),
			})
			.optional(),
		onLinkClicked: z
			.strictObject({
				createNewTask: z.boolean().optional(),
				campaignProgress: z.enum(['continue', 'pause', 'stop']).optional(),
				propagateProgressToCompany: z.boolean().optional(),
				specificLinks: z.array(z.string()).max(50).optional(),
			})
			.optional(),
		onMeetingBooked: z
			.strictObject({
				campaignProgress: z.enum(['continue', 'pause', 'stop']).optional(),
				propagateProgressToCompany: z.boolean().optional(),
			})
			.optional(),
		aiFeatures: z
			.strictObject({
				scoreReplies: z.boolean().optional(),
				onInterestedReply: z
					.strictObject({
						enabled: z.boolean().optional(),
						pauseAllCampaignsForLead: z.boolean().optional(),
						pauseCampaignForCompany: z.boolean().optional(),
						pauseAllCampaignsForCompany: z.boolean().optional(),
					})
					.optional(),
				onNotInterestedReply: z
					.strictObject({
						enabled: z.boolean().optional(),
						pauseAllCampaignsForLead: z.boolean().optional(),
						pauseCampaignForCompany: z.boolean().optional(),
						pauseAllCampaignsForCompany: z.boolean().optional(),
					})
					.optional(),
			})
			.optional(),
		schedule: z
			.strictObject({
				isTimezoneBasedSchedule: z.boolean().optional(),
				holidayCountries: z.array(z.enum(['US', 'FR', 'GB'])).optional(),
				sendingPattern: z
					.strictObject({
						newLeadsPriorityRatio: z.number().min(0).max(1).optional(),
					})
					.optional(),
			})
			.optional(),
	})
	.refine(
		(input) =>
			Object.entries(input).some(
				([key, value]) => key !== 'campaignId' && value !== undefined,
			),
		{
			message: 'At least one settings field is required',
		},
	);
export type CampaignsUpdateSettingsInput = z.infer<
	typeof CampaignsUpdateSettingsInputSchema
>;

export const CampaignsUpdateSettingsResponseSchema = CampaignSettingsSchema;
export type CampaignsUpdateSettingsResponse = z.infer<
	typeof CampaignsUpdateSettingsResponseSchema
>;

export const CampaignsPauseInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsPauseInput = z.infer<typeof CampaignsPauseInputSchema>;

export const CampaignsPauseResponseSchema = CampaignActionSchema;
export type CampaignsPauseResponse = z.infer<
	typeof CampaignsPauseResponseSchema
>;

export const CampaignsStartInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsStartInput = z.infer<typeof CampaignsStartInputSchema>;

export const CampaignsStartResponseSchema = CampaignActionSchema;
export type CampaignsStartResponse = z.infer<
	typeof CampaignsStartResponseSchema
>;

export const CampaignsArchiveInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsArchiveInput = z.infer<typeof CampaignsArchiveInputSchema>;

export const CampaignsArchiveResponseSchema = CampaignActionSchema;
export type CampaignsArchiveResponse = z.infer<
	typeof CampaignsArchiveResponseSchema
>;

export const CampaignsUnarchiveInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsUnarchiveInput = z.infer<
	typeof CampaignsUnarchiveInputSchema
>;

export const CampaignsUnarchiveResponseSchema = CampaignActionSchema;
export type CampaignsUnarchiveResponse = z.infer<
	typeof CampaignsUnarchiveResponseSchema
>;

export const CampaignsDuplicateInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	name: z.string().optional(),
});
export type CampaignsDuplicateInput = z.infer<
	typeof CampaignsDuplicateInputSchema
>;

export const CampaignsDuplicateResponseSchema = CampaignSchema;
export type CampaignsDuplicateResponse = z.infer<
	typeof CampaignsDuplicateResponseSchema
>;

export const CampaignsGetStatutesInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsGetStatutesInput = z.infer<
	typeof CampaignsGetStatutesInputSchema
>;

export const CampaignsGetStatutesResponseSchema = CampaignStatutesSchema;
export type CampaignsGetStatutesResponse = z.infer<
	typeof CampaignsGetStatutesResponseSchema
>;

const CampaignChannelsFilterSchema = z
	.string()
	.superRefine((value, context) => {
		try {
			// `unknown` because JSON.parse returns untrusted query data that needs runtime validation.
			const parsed: unknown = JSON.parse(value);
			if (
				!z.array(z.enum(['email', 'linkedin', 'others'])).safeParse(parsed)
					.success
			) {
				context.addIssue({
					code: 'custom',
					message: 'channels must be a JSON array of supported channels',
				});
			}
		} catch {
			context.addIssue({
				code: 'custom',
				message: 'channels must be a JSON array of supported channels',
			});
		}
	});

export const CampaignsGetStatsInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	// Lemlist takes ISO 8601 with Z or an offset (live 11-20: +02:00 answered 200).
	startDate: z.iso.datetime({ offset: true }),
	endDate: z.iso.datetime({ offset: true }),
	sendUser: z
		.string()
		.regex(/^usr_[^|]+\|[^@]+@[^@]+$/)
		.optional(),
	ABSelected: z.enum(['A', 'B']).optional(),
	channels: CampaignChannelsFilterSchema.optional(),
});
export type CampaignsGetStatsInput = z.infer<
	typeof CampaignsGetStatsInputSchema
>;

export const CampaignsGetStatsResponseSchema = CampaignStatsSchema;
export type CampaignsGetStatsResponse = z.infer<
	typeof CampaignsGetStatsResponseSchema
>;

export const CampaignsGetBatchStatsInputSchema = z.strictObject({
	campaignIds: z.array(z.string()).min(1).max(100),
	// Lemlist takes ISO 8601 with Z or an offset (live 11-20: +02:00 answered 200).
	startDate: z.iso.datetime({ offset: true }),
	endDate: z.iso.datetime({ offset: true }),
	sendUser: z
		.string()
		.regex(/^usr_[^|]+\|[^@]+@[^@]+$/)
		.optional(),
	ABSelected: z.enum(['A', 'B']).optional(),
	channels: z.array(z.enum(['email', 'linkedin', 'others'])).optional(),
});
export type CampaignsGetBatchStatsInput = z.infer<
	typeof CampaignsGetBatchStatsInputSchema
>;

export const CampaignsGetBatchStatsResponseSchema = BatchCampaignStatsSchema;
export type CampaignsGetBatchStatsResponse = z.infer<
	typeof CampaignsGetBatchStatsResponseSchema
>;

export const CampaignsGetReportsInputSchema = z.strictObject({
	campaignIds: z.string().min(1),
});
export type CampaignsGetReportsInput = z.infer<
	typeof CampaignsGetReportsInputSchema
>;

export const CampaignsGetReportsResponseSchema = z.array(CampaignReportSchema);
export type CampaignsGetReportsResponse = z.infer<
	typeof CampaignsGetReportsResponseSchema
>;

export const CampaignsStartExportInputSchema = z.strictObject({
	campaignId: z.string().min(1),
});
export type CampaignsStartExportInput = z.infer<
	typeof CampaignsStartExportInputSchema
>;

export const CampaignsStartExportResponseSchema = CampaignExportStatusSchema;
export type CampaignsStartExportResponse = z.infer<
	typeof CampaignsStartExportResponseSchema
>;

export const CampaignsGetExportStatusInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	exportId: z.string().min(1),
});
export type CampaignsGetExportStatusInput = z.infer<
	typeof CampaignsGetExportStatusInputSchema
>;

export const CampaignsGetExportStatusResponseSchema =
	CampaignExportStatusResponseSchema;
export type CampaignsGetExportStatusResponse = z.infer<
	typeof CampaignsGetExportStatusResponseSchema
>;

export const CampaignsSetExportEmailInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	exportId: z.string().min(1),
	email: z.string().email(),
});
export type CampaignsSetExportEmailInput = z.infer<
	typeof CampaignsSetExportEmailInputSchema
>;

export const CampaignsSetExportEmailResponseSchema =
	CampaignExportStatusResponseSchema;
export type CampaignsSetExportEmailResponse = z.infer<
	typeof CampaignsSetExportEmailResponseSchema
>;

export const CampaignsExportLeadsInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	state: z.string().optional(),
	format: z.enum(['json', 'csv']).optional(),
});
export type CampaignsExportLeadsInput = z.infer<
	typeof CampaignsExportLeadsInputSchema
>;

export const CampaignsExportLeadsResponseSchema = z.union([
	z.array(
		z.record(
			z.string(),
			z.union([z.string(), z.number(), z.boolean(), z.null()]),
		),
	),
	z.string(),
]);
export type CampaignsExportLeadsResponse = z.infer<
	typeof CampaignsExportLeadsResponseSchema
>;

export const CampaignsSkipStepForEveryoneInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	stepId: z.string().min(1),
});
export type CampaignsSkipStepForEveryoneInput = z.infer<
	typeof CampaignsSkipStepForEveryoneInputSchema
>;

export const CampaignsSkipStepForEveryoneResponseSchema = z
	.object({ skipped: z.boolean() })
	.passthrough();
export type CampaignsSkipStepForEveryoneResponse = z.infer<
	typeof CampaignsSkipStepForEveryoneResponseSchema
>;

export const CampaignsSkipStepForLeadsInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	stepId: z.string().min(1),
	leads: z.array(z.string()).min(1).max(100),
});
export type CampaignsSkipStepForLeadsInput = z.infer<
	typeof CampaignsSkipStepForLeadsInputSchema
>;

export const CampaignsSkipStepForLeadsResponseSchema = z
	.object({
		total: z.number().int(),
		skipped: z.number().int(),
		alreadySkipped: z.number().int(),
		notFound: z.array(z.string()),
		results: z.array(
			z.object({
				lead: z.string(),
				status: z.enum(['skipped', 'already_skipped', 'not_found']),
			}),
		),
	})
	.passthrough();
export type CampaignsSkipStepForLeadsResponse = z.infer<
	typeof CampaignsSkipStepForLeadsResponseSchema
>;

export const CampaignsAddAbmLeadsInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadIds: z.array(z.string()).min(1).max(199),
});
export type CampaignsAddAbmLeadsInput = z.infer<
	typeof CampaignsAddAbmLeadsInputSchema
>;

export const CampaignsAddAbmLeadsResponseSchema = z
	.object({
		data: z.object({
			addedCount: z.number().int(),
			alreadyInCampaignCount: z.number().int(),
			skipped: z.array(
				z.object({ leadId: z.string(), code: z.string() }).passthrough(),
			),
		}),
	})
	.passthrough();
export type CampaignsAddAbmLeadsResponse = z.infer<
	typeof CampaignsAddAbmLeadsResponseSchema
>;

export const LeadsGetInputSchema = z
	.strictObject({
		id: z.string().min(1).optional(),
		email: z.string().email().optional(),
		version: z.enum(['v2']).optional(),
	})
	.refine((input) => input.id !== undefined || input.email !== undefined, {
		message: 'Provide at least one of id or email',
	});
export type LeadsGetInput = z.infer<typeof LeadsGetInputSchema>;

export const LeadsGetResponseSchema = z.array(LeadSchema);
export type LeadsGetResponse = z.infer<typeof LeadsGetResponseSchema>;

export const LeadsGetByEmailInputSchema = z.strictObject({
	email: z.string().email(),
	version: z.enum(['v2']).optional(),
});
export type LeadsGetByEmailInput = z.infer<typeof LeadsGetByEmailInputSchema>;

export const LeadsGetByEmailResponseSchema = z.array(LeadSchema);
export type LeadsGetByEmailResponse = z.infer<
	typeof LeadsGetByEmailResponseSchema
>;

export const LeadsListInCampaignInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	state: z.string().optional(),
	limit: z.number().int().min(1).max(500).optional(),
	offset: z.number().int().min(0).optional(),
});
export type LeadsListInCampaignInput = z.infer<
	typeof LeadsListInCampaignInputSchema
>;

export const LeadsListInCampaignResponseSchema = z.array(LeadSchema);
export type LeadsListInCampaignResponse = z.infer<
	typeof LeadsListInCampaignResponseSchema
>;

const LEAD_CREATE_KNOWN_KEYS = new Set([
	'campaignId',
	'email',
	'firstName',
	'lastName',
	'companyName',
	'jobTitle',
	'linkedinUrl',
	'picture',
	'phone',
	'companyDomain',
	'contactOwner',
	'crmId',
	'icebreaker',
	'timezone',
	'deduplicate',
	'linkedinEnrichment',
	'findEmail',
	'verifyEmail',
	'findPhone',
	'updateStrategy',
]);

export const LeadsCreateInCampaignInputSchema = z
	.strictObject({
		campaignId: z.string().min(1),
		email: z.string().email().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		companyName: z.string().optional(),
		jobTitle: z.string().optional(),
		linkedinUrl: z.string().url().optional(),
		picture: z.string().url().optional(),
		phone: z.string().optional(),
		companyDomain: z.string().optional(),
		contactOwner: z.string().optional(),
		crmId: z.string().optional(),
		icebreaker: z.string().optional(),
		timezone: z.string().optional(),
		deduplicate: z.boolean().optional(),
		linkedinEnrichment: z.boolean().optional(),
		findEmail: z.boolean().optional(),
		verifyEmail: z.boolean().optional(),
		findPhone: z.boolean().optional(),
		updateStrategy: z
			.enum(['overwrite', 'overwriteIgnoreEmpty', 'fillEmptyOnly'])
			.optional(),
	})
	// Lemlist documents arbitrary string body fields as custom lead variables.
	.passthrough()
	.refine(
		(input) =>
			Object.entries(input).every(
				([key, value]) =>
					LEAD_CREATE_KNOWN_KEYS.has(key) || typeof value === 'string',
			),
		{ message: 'Custom lead variables must be strings' },
	)
	.refine(
		(input) => input.email !== undefined || input.linkedinUrl !== undefined,
		{
			message: 'Provide an email or LinkedIn URL',
		},
	);
export type LeadsCreateInCampaignInput = z.infer<
	typeof LeadsCreateInCampaignInputSchema
>;

export const LeadsCreateInCampaignResponseSchema = LeadSchema;
export type LeadsCreateInCampaignResponse = z.infer<
	typeof LeadsCreateInCampaignResponseSchema
>;

export const LeadsUpdateInCampaignInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadId: z.string().min(1),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	companyName: z.string().optional(),
	jobTitle: z.string().optional(),
	preferredContactMethod: z.enum(['email', 'linkedIn']).optional(),
	updateStrategy: z
		.enum(['overwrite', 'overwriteIgnoreEmpty', 'fillEmptyOnly'])
		.optional(),
});
export type LeadsUpdateInCampaignInput = z.infer<
	typeof LeadsUpdateInCampaignInputSchema
>;

export const LeadsUpdateInCampaignResponseSchema = LeadSchema;
export type LeadsUpdateInCampaignResponse = z.infer<
	typeof LeadsUpdateInCampaignResponseSchema
>;

export const LeadsDeleteFromCampaignInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadId: z.string().min(1),
	action: z.literal('remove'),
});
export type LeadsDeleteFromCampaignInput = z.infer<
	typeof LeadsDeleteFromCampaignInputSchema
>;

export const LeadsDeleteFromCampaignResponseSchema = LeadSchema;
export type LeadsDeleteFromCampaignResponse = z.infer<
	typeof LeadsDeleteFromCampaignResponseSchema
>;

export const LeadsUnsubscribeFromCampaignInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	email: z.string().min(1),
});
export type LeadsUnsubscribeFromCampaignInput = z.infer<
	typeof LeadsUnsubscribeFromCampaignInputSchema
>;

export const LeadsUnsubscribeFromCampaignResponseSchema = LeadSchema;
export type LeadsUnsubscribeFromCampaignResponse = z.infer<
	typeof LeadsUnsubscribeFromCampaignResponseSchema
>;

export const LeadsResumeInputSchema = z.strictObject({
	leadId: z.string().min(1),
	// Resumes the lead in this campaign only; omit to resume it in every campaign.
	campaignId: z.string().min(1).optional(),
});
export type LeadsResumeInput = z.infer<typeof LeadsResumeInputSchema>;

export const LeadsResumeResponseSchema = z.array(LeadSchema);
export type LeadsResumeResponse = z.infer<typeof LeadsResumeResponseSchema>;

export const LeadsPauseInputSchema = z.strictObject({
	leadId: z.string().min(1),
	// Pauses the lead in this campaign only; omit to pause it in every campaign.
	campaignId: z.string().min(1).optional(),
});
export type LeadsPauseInput = z.infer<typeof LeadsPauseInputSchema>;

export const LeadsPauseResponseSchema = z.array(LeadSchema);
export type LeadsPauseResponse = z.infer<typeof LeadsPauseResponseSchema>;

export const LeadsReviewInputSchema = z.strictObject({
	leadId: z.string().min(1),
});
export type LeadsReviewInput = z.infer<typeof LeadsReviewInputSchema>;

export const LeadsReviewResponseSchema = z
	.object({ ok: z.boolean(), launched: z.number().int() })
	.passthrough();
export type LeadsReviewResponse = z.infer<typeof LeadsReviewResponseSchema>;

export const LeadsMarkInterestedInputSchema = z.strictObject({
	leadIdOrEmail: z.string().min(1),
});
export type LeadsMarkInterestedInput = z.infer<
	typeof LeadsMarkInterestedInputSchema
>;

export const LeadsMarkInterestedResponseSchema = z.array(LeadSchema);
export type LeadsMarkInterestedResponse = z.infer<
	typeof LeadsMarkInterestedResponseSchema
>;

export const LeadsMarkNotInterestedInputSchema = z.strictObject({
	leadIdOrEmail: z.string().min(1),
});
export type LeadsMarkNotInterestedInput = z.infer<
	typeof LeadsMarkNotInterestedInputSchema
>;

export const LeadsMarkNotInterestedResponseSchema = z.array(LeadSchema);
export type LeadsMarkNotInterestedResponse = z.infer<
	typeof LeadsMarkNotInterestedResponseSchema
>;

export const LeadsMarkInterestedInCampaignInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadIdOrEmail: z.string().min(1),
});
export type LeadsMarkInterestedInCampaignInput = z.infer<
	typeof LeadsMarkInterestedInCampaignInputSchema
>;

export const LeadsMarkInterestedInCampaignResponseSchema = LeadSchema;
export type LeadsMarkInterestedInCampaignResponse = z.infer<
	typeof LeadsMarkInterestedInCampaignResponseSchema
>;

export const LeadsMarkNotInterestedInCampaignInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadIdOrEmail: z.string().min(1),
});
export type LeadsMarkNotInterestedInCampaignInput = z.infer<
	typeof LeadsMarkNotInterestedInCampaignInputSchema
>;

export const LeadsMarkNotInterestedInCampaignResponseSchema = LeadSchema;
export type LeadsMarkNotInterestedInCampaignResponse = z.infer<
	typeof LeadsMarkNotInterestedInCampaignResponseSchema
>;

export const LeadsSkipStepInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadIdOrEmail: z.string().min(1),
	stepId: z.string().min(1),
});
export type LeadsSkipStepInput = z.infer<typeof LeadsSkipStepInputSchema>;

export const LeadsSkipStepResponseSchema = z
	.object({ ok: z.boolean().optional() })
	.passthrough();
export type LeadsSkipStepResponse = z.infer<typeof LeadsSkipStepResponseSchema>;

export const LeadsPersonalizeStepInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadIdOrEmail: z.string().min(1),
	stepId: z.string().min(1),
	variant: z.enum(['A', 'B']).optional(),
	subject: z.string().optional(),
	message: z.string().min(1).optional(),
	cc: z.array(z.string()).optional(),
	plainText: z.boolean().optional(),
	altMessage: z.string().min(1).max(300).optional(),
	altMessagePremium: z.string().min(1).max(300).optional(),
});
export type LeadsPersonalizeStepInput = z.infer<
	typeof LeadsPersonalizeStepInputSchema
>;

export const LeadsPersonalizeStepResponseSchema = z
	.object({
		leadId: z.string(),
		stepId: z.string(),
		variant: z.enum(['A', 'B']),
		emailTemplateId: z.string(),
		content: z
			.object({
				subject: z.string().optional(),
				message: z.string().optional(),
				cc: z.array(z.string()).optional(),
				plainText: z.boolean().optional(),
				altMessage: z.string().optional(),
				altMessagePremium: z.string().optional(),
			})
			.passthrough(),
	})
	.passthrough();
export type LeadsPersonalizeStepResponse = z.infer<
	typeof LeadsPersonalizeStepResponseSchema
>;

export const LeadsResetStepPersonalizationInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	leadIdOrEmail: z.string().min(1),
	stepId: z.string().min(1),
});
export type LeadsResetStepPersonalizationInput = z.infer<
	typeof LeadsResetStepPersonalizationInputSchema
>;

export const LeadsResetStepPersonalizationResponseSchema = z
	.object({ reset: z.boolean() })
	.passthrough();
export type LeadsResetStepPersonalizationResponse = z.infer<
	typeof LeadsResetStepPersonalizationResponseSchema
>;

export const LeadsAddVariablesInputSchema = z.strictObject({
	leadId: z.string().min(1),
	variables: z.record(z.string(), z.string()),
});
export type LeadsAddVariablesInput = z.infer<
	typeof LeadsAddVariablesInputSchema
>;

export const LeadsAddVariablesResponseSchema = LeadVariablesResponseSchema;
export type LeadsAddVariablesResponse = z.infer<
	typeof LeadsAddVariablesResponseSchema
>;

export const LeadsUpdateVariablesInputSchema = z.strictObject({
	leadId: z.string().min(1),
	variables: z.record(z.string(), z.string()),
});
export type LeadsUpdateVariablesInput = z.infer<
	typeof LeadsUpdateVariablesInputSchema
>;

export const LeadsUpdateVariablesResponseSchema = LeadVariablesResponseSchema;
export type LeadsUpdateVariablesResponse = z.infer<
	typeof LeadsUpdateVariablesResponseSchema
>;

export const LeadsDeleteVariablesInputSchema = z.strictObject({
	leadId: z.string().min(1),
	variableNames: z.array(z.string()).min(1),
});
export type LeadsDeleteVariablesInput = z.infer<
	typeof LeadsDeleteVariablesInputSchema
>;

export const LeadsDeleteVariablesResponseSchema = LeadVariablesResponseSchema;
export type LeadsDeleteVariablesResponse = z.infer<
	typeof LeadsDeleteVariablesResponseSchema
>;

export const LeadsImportFromCrmInputSchema = z.strictObject({
	campaignId: z.string().min(1),
	filterId: z.union([z.string(), z.number()]),
	filterType: z.enum(['lead', 'contact', 'report']).optional(),
	userId: z.string().optional(),
	deduplicate: z
		.union([z.boolean(), z.enum(['off', 'all', 'activeOnly'])])
		.optional(),
	enrichFeature: z
		.union([
			z.array(
				z.enum(['find_email', 'find_phone', 'verify', 'linkedin_enrichment']),
			),
			z
				.string()
				.min(1)
				.refine(
					(value) =>
						value
							.split('|')
							.every((feature) =>
								[
									'find_email',
									'find_phone',
									'verify',
									'linkedin_enrichment',
								].includes(feature),
							),
					{ message: 'Unsupported enrichment feature' },
				),
		])
		.optional(),
});
export type LeadsImportFromCrmInput = z.infer<
	typeof LeadsImportFromCrmInputSchema
>;

export const LeadsImportFromCrmResponseSchema = z
	.object({
		ok: z.boolean(),
		importPending: z.literal(true).optional(),
		reason: z
			.enum([
				'campaign_paused',
				'campaign_archived',
				'campaign_crm_sync_paused',
			])
			.optional(),
	})
	.passthrough();
export type LeadsImportFromCrmResponse = z.infer<
	typeof LeadsImportFromCrmResponseSchema
>;

export const LeadsGetCrmFiltersInputSchema = z.strictObject({
	type: z.enum(['lead', 'contact', 'report']).optional(),
});
export type LeadsGetCrmFiltersInput = z.infer<
	typeof LeadsGetCrmFiltersInputSchema
>;

export const LeadsGetCrmFiltersResponseSchema = z.array(CrmFilterSchema);
export type LeadsGetCrmFiltersResponse = z.infer<
	typeof LeadsGetCrmFiltersResponseSchema
>;

export const ActivitiesListInputSchema = z
	.strictObject({
		version: z.enum(['v2']).optional(),
		type: ActivityTypeSchema.optional(),
		campaignId: z.string().optional(),
		isFirst: z.boolean().optional(),
		offset: z.number().int().min(0).optional(),
		limit: z.number().int().min(1).max(100).optional(),
		leadId: z.string().optional(),
		minDate: z.string().optional(),
		maxDate: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	})
	.refine(
		(input) => {
			const min = input.minDate ?? input.startDate;
			const max = input.maxDate ?? input.endDate;
			if (min === undefined || max === undefined) return true;
			const toMillis = (date: string): number =>
				/^\d{10}$/.test(date) ? Number(date) * 1000 : Date.parse(date);
			return toMillis(max) > toMillis(min);
		},
		{ message: 'maxDate must be later than minDate' },
	);
export type ActivitiesListInput = z.infer<typeof ActivitiesListInputSchema>;

export const ActivitiesListResponseSchema = z.array(ActivitySchema);
export type ActivitiesListResponse = z.infer<
	typeof ActivitiesListResponseSchema
>;

export const ActivitiesDeleteRecordingTranscriptInputSchema = z.strictObject({
	activityId: z.string().min(1),
});
export type ActivitiesDeleteRecordingTranscriptInput = z.infer<
	typeof ActivitiesDeleteRecordingTranscriptInputSchema
>;

export const ActivitiesDeleteRecordingTranscriptResponseSchema = z
	.object({ ok: z.boolean().optional() })
	.passthrough();
export type ActivitiesDeleteRecordingTranscriptResponse = z.infer<
	typeof ActivitiesDeleteRecordingTranscriptResponseSchema
>;

export const UnsubscribesListVariablesInputSchema = z.strictObject({
	offset: z.number().int().min(0).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});
export type UnsubscribesListVariablesInput = z.infer<
	typeof UnsubscribesListVariablesInputSchema
>;

export const UnsubscribesListVariablesResponseSchema = z.array(
	UnsubscribeVariableSchema,
);
export type UnsubscribesListVariablesResponse = z.infer<
	typeof UnsubscribesListVariablesResponseSchema
>;

export const UnsubscribesBulkUnsubscribeVariablesInputSchema = z.strictObject({
	values: z.array(z.string()).min(1).max(10000),
});
export type UnsubscribesBulkUnsubscribeVariablesInput = z.infer<
	typeof UnsubscribesBulkUnsubscribeVariablesInputSchema
>;

// Live 11-20: `{ message, count, values, skippedValues }`; the reference's example is a bare string.
export const UnsubscribesBulkUnsubscribeVariablesResponseSchema = z.union([
	z
		.object({
			message: z.string().optional(),
			count: z.number().optional(),
			values: z.array(z.string()).optional(),
			skippedValues: z.array(z.string()).optional(),
		})
		// `passthrough` because Lemlist may report more per-value detail.
		.passthrough(),
	z.string(),
]);
export type UnsubscribesBulkUnsubscribeVariablesResponse = z.infer<
	typeof UnsubscribesBulkUnsubscribeVariablesResponseSchema
>;

export const UnsubscribesGetVariableInputSchema = z.strictObject({
	value: z.string().min(1),
});
export type UnsubscribesGetVariableInput = z.infer<
	typeof UnsubscribesGetVariableInputSchema
>;

export const UnsubscribesGetVariableResponseSchema = UnsubscribeVariableSchema;
export type UnsubscribesGetVariableResponse = z.infer<
	typeof UnsubscribesGetVariableResponseSchema
>;

export const UnsubscribesUnsubscribeVariableInputSchema = z.strictObject({
	value: z.string().min(1),
});
export type UnsubscribesUnsubscribeVariableInput = z.infer<
	typeof UnsubscribesUnsubscribeVariableInputSchema
>;

export const UnsubscribesUnsubscribeVariableResponseSchema =
	UnsubscribeVariableSchema;
export type UnsubscribesUnsubscribeVariableResponse = z.infer<
	typeof UnsubscribesUnsubscribeVariableResponseSchema
>;

export const UnsubscribesResubscribeVariableInputSchema = z.strictObject({
	value: z.string().min(1),
});
export type UnsubscribesResubscribeVariableInput = z.infer<
	typeof UnsubscribesResubscribeVariableInputSchema
>;

export const UnsubscribesResubscribeVariableResponseSchema = z.string();
export type UnsubscribesResubscribeVariableResponse = z.infer<
	typeof UnsubscribesResubscribeVariableResponseSchema
>;

export const UnsubscribesGetContactStatusInputSchema = z.strictObject({
	contactId: z.string().min(1),
});
export type UnsubscribesGetContactStatusInput = z.infer<
	typeof UnsubscribesGetContactStatusInputSchema
>;

export const UnsubscribesGetContactStatusResponseSchema =
	UnsubscribeContactSchema;
export type UnsubscribesGetContactStatusResponse = z.infer<
	typeof UnsubscribesGetContactStatusResponseSchema
>;

export const UnsubscribesUnsubscribeContactInputSchema = z.strictObject({
	contactId: z.string().min(1),
});
export type UnsubscribesUnsubscribeContactInput = z.infer<
	typeof UnsubscribesUnsubscribeContactInputSchema
>;

export const UnsubscribesUnsubscribeContactResponseSchema = z.string();
export type UnsubscribesUnsubscribeContactResponse = z.infer<
	typeof UnsubscribesUnsubscribeContactResponseSchema
>;

export const UnsubscribesResubscribeContactInputSchema = z.strictObject({
	contactId: z.string().min(1),
});
export type UnsubscribesResubscribeContactInput = z.infer<
	typeof UnsubscribesResubscribeContactInputSchema
>;

export const UnsubscribesResubscribeContactResponseSchema = z.string();
export type UnsubscribesResubscribeContactResponse = z.infer<
	typeof UnsubscribesResubscribeContactResponseSchema
>;

export const UnsubscribesExportVariablesInputSchema = z.strictObject({
	format: z.enum(['csv', 'json']).optional(),
});
export type UnsubscribesExportVariablesInput = z.infer<
	typeof UnsubscribesExportVariablesInputSchema
>;

export const UnsubscribesExportVariablesResponseSchema = z.union([
	z.array(UnsubscribeVariableSchema),
	z.string(),
]);
export type UnsubscribesExportVariablesResponse = z.infer<
	typeof UnsubscribesExportVariablesResponseSchema
>;

export const UnsubscribesExportContactsInputSchema = z.strictObject({
	format: z.enum(['csv', 'json']).optional(),
});
export type UnsubscribesExportContactsInput = z.infer<
	typeof UnsubscribesExportContactsInputSchema
>;

export const UnsubscribesExportContactsResponseSchema = z.union([
	z.array(UnsubscribeContactSchema),
	z.string(),
]);
export type UnsubscribesExportContactsResponse = z.infer<
	typeof UnsubscribesExportContactsResponseSchema
>;

// ── Registries ─────────────────────────────────────────────────────────────

export const LemlistEndpointInputSchemas = {
	teamGet: TeamGetInputSchema,
	teamGetSenders: TeamGetSendersInputSchema,
	teamGetCredits: TeamGetCreditsInputSchema,
	teamGetCrmUsers: TeamGetCrmUsersInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsGet: CampaignsGetInputSchema,
	campaignsUpdate: CampaignsUpdateInputSchema,
	campaignsGetSettings: CampaignsGetSettingsInputSchema,
	campaignsUpdateSettings: CampaignsUpdateSettingsInputSchema,
	campaignsPause: CampaignsPauseInputSchema,
	campaignsStart: CampaignsStartInputSchema,
	campaignsArchive: CampaignsArchiveInputSchema,
	campaignsUnarchive: CampaignsUnarchiveInputSchema,
	campaignsDuplicate: CampaignsDuplicateInputSchema,
	campaignsGetStatutes: CampaignsGetStatutesInputSchema,
	campaignsGetStats: CampaignsGetStatsInputSchema,
	campaignsGetBatchStats: CampaignsGetBatchStatsInputSchema,
	campaignsGetReports: CampaignsGetReportsInputSchema,
	campaignsStartExport: CampaignsStartExportInputSchema,
	campaignsGetExportStatus: CampaignsGetExportStatusInputSchema,
	campaignsSetExportEmail: CampaignsSetExportEmailInputSchema,
	campaignsExportLeads: CampaignsExportLeadsInputSchema,
	campaignsSkipStepForEveryone: CampaignsSkipStepForEveryoneInputSchema,
	campaignsSkipStepForLeads: CampaignsSkipStepForLeadsInputSchema,
	campaignsAddAbmLeads: CampaignsAddAbmLeadsInputSchema,
	leadsGet: LeadsGetInputSchema,
	leadsGetByEmail: LeadsGetByEmailInputSchema,
	leadsListInCampaign: LeadsListInCampaignInputSchema,
	leadsCreateInCampaign: LeadsCreateInCampaignInputSchema,
	leadsUpdateInCampaign: LeadsUpdateInCampaignInputSchema,
	leadsDeleteFromCampaign: LeadsDeleteFromCampaignInputSchema,
	leadsUnsubscribeFromCampaign: LeadsUnsubscribeFromCampaignInputSchema,
	leadsResume: LeadsResumeInputSchema,
	leadsPause: LeadsPauseInputSchema,
	leadsReview: LeadsReviewInputSchema,
	leadsMarkInterested: LeadsMarkInterestedInputSchema,
	leadsMarkNotInterested: LeadsMarkNotInterestedInputSchema,
	leadsMarkInterestedInCampaign: LeadsMarkInterestedInCampaignInputSchema,
	leadsMarkNotInterestedInCampaign: LeadsMarkNotInterestedInCampaignInputSchema,
	leadsSkipStep: LeadsSkipStepInputSchema,
	leadsPersonalizeStep: LeadsPersonalizeStepInputSchema,
	leadsResetStepPersonalization: LeadsResetStepPersonalizationInputSchema,
	leadsAddVariables: LeadsAddVariablesInputSchema,
	leadsUpdateVariables: LeadsUpdateVariablesInputSchema,
	leadsDeleteVariables: LeadsDeleteVariablesInputSchema,
	leadsImportFromCrm: LeadsImportFromCrmInputSchema,
	leadsGetCrmFilters: LeadsGetCrmFiltersInputSchema,
	activitiesList: ActivitiesListInputSchema,
	activitiesDeleteRecordingTranscript:
		ActivitiesDeleteRecordingTranscriptInputSchema,
	unsubscribesListVariables: UnsubscribesListVariablesInputSchema,
	unsubscribesBulkUnsubscribeVariables:
		UnsubscribesBulkUnsubscribeVariablesInputSchema,
	unsubscribesGetVariable: UnsubscribesGetVariableInputSchema,
	unsubscribesUnsubscribeVariable: UnsubscribesUnsubscribeVariableInputSchema,
	unsubscribesResubscribeVariable: UnsubscribesResubscribeVariableInputSchema,
	unsubscribesGetContactStatus: UnsubscribesGetContactStatusInputSchema,
	unsubscribesUnsubscribeContact: UnsubscribesUnsubscribeContactInputSchema,
	unsubscribesResubscribeContact: UnsubscribesResubscribeContactInputSchema,
	unsubscribesExportVariables: UnsubscribesExportVariablesInputSchema,
	unsubscribesExportContacts: UnsubscribesExportContactsInputSchema,
} as const;

export const LemlistEndpointOutputSchemas = {
	teamGet: TeamGetResponseSchema,
	teamGetSenders: TeamGetSendersResponseSchema,
	teamGetCredits: TeamGetCreditsResponseSchema,
	teamGetCrmUsers: TeamGetCrmUsersResponseSchema,
	campaignsList: CampaignsListResponseSchema,
	campaignsCreate: CampaignsCreateResponseSchema,
	campaignsGet: CampaignsGetResponseSchema,
	campaignsUpdate: CampaignsUpdateResponseSchema,
	campaignsGetSettings: CampaignsGetSettingsResponseSchema,
	campaignsUpdateSettings: CampaignsUpdateSettingsResponseSchema,
	campaignsPause: CampaignsPauseResponseSchema,
	campaignsStart: CampaignsStartResponseSchema,
	campaignsArchive: CampaignsArchiveResponseSchema,
	campaignsUnarchive: CampaignsUnarchiveResponseSchema,
	campaignsDuplicate: CampaignsDuplicateResponseSchema,
	campaignsGetStatutes: CampaignsGetStatutesResponseSchema,
	campaignsGetStats: CampaignsGetStatsResponseSchema,
	campaignsGetBatchStats: CampaignsGetBatchStatsResponseSchema,
	campaignsGetReports: CampaignsGetReportsResponseSchema,
	campaignsStartExport: CampaignsStartExportResponseSchema,
	campaignsGetExportStatus: CampaignsGetExportStatusResponseSchema,
	campaignsSetExportEmail: CampaignsSetExportEmailResponseSchema,
	campaignsExportLeads: CampaignsExportLeadsResponseSchema,
	campaignsSkipStepForEveryone: CampaignsSkipStepForEveryoneResponseSchema,
	campaignsSkipStepForLeads: CampaignsSkipStepForLeadsResponseSchema,
	campaignsAddAbmLeads: CampaignsAddAbmLeadsResponseSchema,
	leadsGet: LeadsGetResponseSchema,
	leadsGetByEmail: LeadsGetByEmailResponseSchema,
	leadsListInCampaign: LeadsListInCampaignResponseSchema,
	leadsCreateInCampaign: LeadsCreateInCampaignResponseSchema,
	leadsUpdateInCampaign: LeadsUpdateInCampaignResponseSchema,
	leadsDeleteFromCampaign: LeadsDeleteFromCampaignResponseSchema,
	leadsUnsubscribeFromCampaign: LeadsUnsubscribeFromCampaignResponseSchema,
	leadsResume: LeadsResumeResponseSchema,
	leadsPause: LeadsPauseResponseSchema,
	leadsReview: LeadsReviewResponseSchema,
	leadsMarkInterested: LeadsMarkInterestedResponseSchema,
	leadsMarkNotInterested: LeadsMarkNotInterestedResponseSchema,
	leadsMarkInterestedInCampaign: LeadsMarkInterestedInCampaignResponseSchema,
	leadsMarkNotInterestedInCampaign:
		LeadsMarkNotInterestedInCampaignResponseSchema,
	leadsSkipStep: LeadsSkipStepResponseSchema,
	leadsPersonalizeStep: LeadsPersonalizeStepResponseSchema,
	leadsResetStepPersonalization: LeadsResetStepPersonalizationResponseSchema,
	leadsAddVariables: LeadsAddVariablesResponseSchema,
	leadsUpdateVariables: LeadsUpdateVariablesResponseSchema,
	leadsDeleteVariables: LeadsDeleteVariablesResponseSchema,
	leadsImportFromCrm: LeadsImportFromCrmResponseSchema,
	leadsGetCrmFilters: LeadsGetCrmFiltersResponseSchema,
	activitiesList: ActivitiesListResponseSchema,
	activitiesDeleteRecordingTranscript:
		ActivitiesDeleteRecordingTranscriptResponseSchema,
	unsubscribesListVariables: UnsubscribesListVariablesResponseSchema,
	unsubscribesBulkUnsubscribeVariables:
		UnsubscribesBulkUnsubscribeVariablesResponseSchema,
	unsubscribesGetVariable: UnsubscribesGetVariableResponseSchema,
	unsubscribesUnsubscribeVariable:
		UnsubscribesUnsubscribeVariableResponseSchema,
	unsubscribesResubscribeVariable:
		UnsubscribesResubscribeVariableResponseSchema,
	unsubscribesGetContactStatus: UnsubscribesGetContactStatusResponseSchema,
	unsubscribesUnsubscribeContact: UnsubscribesUnsubscribeContactResponseSchema,
	unsubscribesResubscribeContact: UnsubscribesResubscribeContactResponseSchema,
	unsubscribesExportVariables: UnsubscribesExportVariablesResponseSchema,
	unsubscribesExportContacts: UnsubscribesExportContactsResponseSchema,
} as const;

export type LemlistEndpointInputs = {
	teamGet: TeamGetInput;
	teamGetSenders: TeamGetSendersInput;
	teamGetCredits: TeamGetCreditsInput;
	teamGetCrmUsers: TeamGetCrmUsersInput;
	campaignsList: CampaignsListInput;
	campaignsCreate: CampaignsCreateInput;
	campaignsGet: CampaignsGetInput;
	campaignsUpdate: CampaignsUpdateInput;
	campaignsGetSettings: CampaignsGetSettingsInput;
	campaignsUpdateSettings: CampaignsUpdateSettingsInput;
	campaignsPause: CampaignsPauseInput;
	campaignsStart: CampaignsStartInput;
	campaignsArchive: CampaignsArchiveInput;
	campaignsUnarchive: CampaignsUnarchiveInput;
	campaignsDuplicate: CampaignsDuplicateInput;
	campaignsGetStatutes: CampaignsGetStatutesInput;
	campaignsGetStats: CampaignsGetStatsInput;
	campaignsGetBatchStats: CampaignsGetBatchStatsInput;
	campaignsGetReports: CampaignsGetReportsInput;
	campaignsStartExport: CampaignsStartExportInput;
	campaignsGetExportStatus: CampaignsGetExportStatusInput;
	campaignsSetExportEmail: CampaignsSetExportEmailInput;
	campaignsExportLeads: CampaignsExportLeadsInput;
	campaignsSkipStepForEveryone: CampaignsSkipStepForEveryoneInput;
	campaignsSkipStepForLeads: CampaignsSkipStepForLeadsInput;
	campaignsAddAbmLeads: CampaignsAddAbmLeadsInput;
	leadsGet: LeadsGetInput;
	leadsGetByEmail: LeadsGetByEmailInput;
	leadsListInCampaign: LeadsListInCampaignInput;
	leadsCreateInCampaign: LeadsCreateInCampaignInput;
	leadsUpdateInCampaign: LeadsUpdateInCampaignInput;
	leadsDeleteFromCampaign: LeadsDeleteFromCampaignInput;
	leadsUnsubscribeFromCampaign: LeadsUnsubscribeFromCampaignInput;
	leadsResume: LeadsResumeInput;
	leadsPause: LeadsPauseInput;
	leadsReview: LeadsReviewInput;
	leadsMarkInterested: LeadsMarkInterestedInput;
	leadsMarkNotInterested: LeadsMarkNotInterestedInput;
	leadsMarkInterestedInCampaign: LeadsMarkInterestedInCampaignInput;
	leadsMarkNotInterestedInCampaign: LeadsMarkNotInterestedInCampaignInput;
	leadsSkipStep: LeadsSkipStepInput;
	leadsPersonalizeStep: LeadsPersonalizeStepInput;
	leadsResetStepPersonalization: LeadsResetStepPersonalizationInput;
	leadsAddVariables: LeadsAddVariablesInput;
	leadsUpdateVariables: LeadsUpdateVariablesInput;
	leadsDeleteVariables: LeadsDeleteVariablesInput;
	leadsImportFromCrm: LeadsImportFromCrmInput;
	leadsGetCrmFilters: LeadsGetCrmFiltersInput;
	activitiesList: ActivitiesListInput;
	activitiesDeleteRecordingTranscript: ActivitiesDeleteRecordingTranscriptInput;
	unsubscribesListVariables: UnsubscribesListVariablesInput;
	unsubscribesBulkUnsubscribeVariables: UnsubscribesBulkUnsubscribeVariablesInput;
	unsubscribesGetVariable: UnsubscribesGetVariableInput;
	unsubscribesUnsubscribeVariable: UnsubscribesUnsubscribeVariableInput;
	unsubscribesResubscribeVariable: UnsubscribesResubscribeVariableInput;
	unsubscribesGetContactStatus: UnsubscribesGetContactStatusInput;
	unsubscribesUnsubscribeContact: UnsubscribesUnsubscribeContactInput;
	unsubscribesResubscribeContact: UnsubscribesResubscribeContactInput;
	unsubscribesExportVariables: UnsubscribesExportVariablesInput;
	unsubscribesExportContacts: UnsubscribesExportContactsInput;
};

export type LemlistEndpointOutputs = {
	teamGet: TeamGetResponse;
	teamGetSenders: TeamGetSendersResponse;
	teamGetCredits: TeamGetCreditsResponse;
	teamGetCrmUsers: TeamGetCrmUsersResponse;
	campaignsList: CampaignsListResponse;
	campaignsCreate: CampaignsCreateResponse;
	campaignsGet: CampaignsGetResponse;
	campaignsUpdate: CampaignsUpdateResponse;
	campaignsGetSettings: CampaignsGetSettingsResponse;
	campaignsUpdateSettings: CampaignsUpdateSettingsResponse;
	campaignsPause: CampaignsPauseResponse;
	campaignsStart: CampaignsStartResponse;
	campaignsArchive: CampaignsArchiveResponse;
	campaignsUnarchive: CampaignsUnarchiveResponse;
	campaignsDuplicate: CampaignsDuplicateResponse;
	campaignsGetStatutes: CampaignsGetStatutesResponse;
	campaignsGetStats: CampaignsGetStatsResponse;
	campaignsGetBatchStats: CampaignsGetBatchStatsResponse;
	campaignsGetReports: CampaignsGetReportsResponse;
	campaignsStartExport: CampaignsStartExportResponse;
	campaignsGetExportStatus: CampaignsGetExportStatusResponse;
	campaignsSetExportEmail: CampaignsSetExportEmailResponse;
	campaignsExportLeads: CampaignsExportLeadsResponse;
	campaignsSkipStepForEveryone: CampaignsSkipStepForEveryoneResponse;
	campaignsSkipStepForLeads: CampaignsSkipStepForLeadsResponse;
	campaignsAddAbmLeads: CampaignsAddAbmLeadsResponse;
	leadsGet: LeadsGetResponse;
	leadsGetByEmail: LeadsGetByEmailResponse;
	leadsListInCampaign: LeadsListInCampaignResponse;
	leadsCreateInCampaign: LeadsCreateInCampaignResponse;
	leadsUpdateInCampaign: LeadsUpdateInCampaignResponse;
	leadsDeleteFromCampaign: LeadsDeleteFromCampaignResponse;
	leadsUnsubscribeFromCampaign: LeadsUnsubscribeFromCampaignResponse;
	leadsResume: LeadsResumeResponse;
	leadsPause: LeadsPauseResponse;
	leadsReview: LeadsReviewResponse;
	leadsMarkInterested: LeadsMarkInterestedResponse;
	leadsMarkNotInterested: LeadsMarkNotInterestedResponse;
	leadsMarkInterestedInCampaign: LeadsMarkInterestedInCampaignResponse;
	leadsMarkNotInterestedInCampaign: LeadsMarkNotInterestedInCampaignResponse;
	leadsSkipStep: LeadsSkipStepResponse;
	leadsPersonalizeStep: LeadsPersonalizeStepResponse;
	leadsResetStepPersonalization: LeadsResetStepPersonalizationResponse;
	leadsAddVariables: LeadsAddVariablesResponse;
	leadsUpdateVariables: LeadsUpdateVariablesResponse;
	leadsDeleteVariables: LeadsDeleteVariablesResponse;
	leadsImportFromCrm: LeadsImportFromCrmResponse;
	leadsGetCrmFilters: LeadsGetCrmFiltersResponse;
	activitiesList: ActivitiesListResponse;
	activitiesDeleteRecordingTranscript: ActivitiesDeleteRecordingTranscriptResponse;
	unsubscribesListVariables: UnsubscribesListVariablesResponse;
	unsubscribesBulkUnsubscribeVariables: UnsubscribesBulkUnsubscribeVariablesResponse;
	unsubscribesGetVariable: UnsubscribesGetVariableResponse;
	unsubscribesUnsubscribeVariable: UnsubscribesUnsubscribeVariableResponse;
	unsubscribesResubscribeVariable: UnsubscribesResubscribeVariableResponse;
	unsubscribesGetContactStatus: UnsubscribesGetContactStatusResponse;
	unsubscribesUnsubscribeContact: UnsubscribesUnsubscribeContactResponse;
	unsubscribesResubscribeContact: UnsubscribesResubscribeContactResponse;
	unsubscribesExportVariables: UnsubscribesExportVariablesResponse;
	unsubscribesExportContacts: UnsubscribesExportContactsResponse;
};
