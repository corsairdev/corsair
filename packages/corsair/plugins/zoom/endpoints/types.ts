import { z } from 'zod';

const MeetingSettingsSchema = z
	.object({
		host_video: z.boolean().optional(),
		participant_video: z.boolean().optional(),
		cn_meeting: z.boolean().optional(),
		in_meeting: z.boolean().optional(),
		join_before_host: z.boolean().optional(),
		mute_upon_entry: z.boolean().optional(),
		watermark: z.boolean().optional(),
		use_pmi: z.boolean().optional(),
		approval_type: z.number().optional(),
		audio: z.string().optional(),
		auto_recording: z.string().optional(),
		waiting_room: z.boolean().optional(),
	})
	.passthrough();

const MeetingSchema = z
	.object({
		id: z.number().optional(),
		uuid: z.string().optional(),
		host_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		status: z.string().optional(),
		start_time: z.string().optional(),
		duration: z.number().optional(),
		timezone: z.string().optional(),
		agenda: z.string().optional(),
		created_at: z.string().optional(),
		join_url: z.string().optional(),
		password: z.string().optional(),
		settings: MeetingSettingsSchema.optional(),
	})
	.passthrough();

const RecordingFileSchema = z
	.object({
		id: z.string().optional(),
		meeting_id: z.string().optional(),
		recording_type: z.string().optional(),
		file_type: z.string().optional(),
		file_size: z.number().optional(),
		play_url: z.string().optional(),
		download_url: z.string().optional(),
		status: z.string().optional(),
		recording_start: z.string().optional(),
		recording_end: z.string().optional(),
	})
	.passthrough();

const WebinarSettingsSchema = z
	.object({
		host_video: z.boolean().optional(),
		panelists_video: z.boolean().optional(),
		practice_session: z.boolean().optional(),
		hd_video: z.boolean().optional(),
		approval_type: z.number().optional(),
		audio: z.string().optional(),
		auto_recording: z.string().optional(),
		enforce_login: z.boolean().optional(),
		registrants_restrict_number: z.number().optional(),
		meeting_authentication: z.boolean().optional(),
	})
	.passthrough();

const WebinarSchema = z
	.object({
		id: z.number().optional(),
		uuid: z.string().optional(),
		host_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		status: z.string().optional(),
		start_time: z.string().optional(),
		duration: z.number().optional(),
		timezone: z.string().optional(),
		agenda: z.string().optional(),
		created_at: z.string().optional(),
		join_url: z.string().optional(),
		password: z.string().optional(),
		settings: WebinarSettingsSchema.optional(),
	})
	.passthrough();

const RegistrantSchema = z
	.object({
		id: z.string().optional(),
		email: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		status: z.string().optional(),
		create_time: z.string().optional(),
		join_url: z.string().optional(),
	})
	.passthrough();

const ParticipantSchema = z
	.object({
		id: z.string().optional(),
		user_id: z.string().optional(),
		user_name: z.string().optional(),
		device: z.string().optional(),
		ip_address: z.string().optional(),
		location: z.string().optional(),
		network_type: z.string().optional(),
		microphone: z.string().optional(),
		speaker: z.string().optional(),
		camera: z.string().optional(),
		data_center: z.string().optional(),
		connection_type: z.string().optional(),
		join_time: z.string().optional(),
		leave_time: z.string().optional(),
		share_application: z.boolean().optional(),
		share_desktop: z.boolean().optional(),
		share_whiteboard: z.boolean().optional(),
		recording: z.boolean().optional(),
		status: z.string().optional(),
	})
	.passthrough();

const DeviceSchema = z
	.object({
		id: z.string().optional(),
		device_name: z.string().optional(),
		manufacturer: z.string().optional(),
		model: z.string().optional(),
		platform_os: z.string().optional(),
		device_status: z.number().optional(),
		mac_address: z.string().optional(),
		serial_number: z.string().optional(),
		last_online: z.string().optional(),
		tag: z.string().optional(),
		enrollment_token: z.string().optional(),
	})
	.passthrough();

const ArchiveMeetingSchema = z
	.object({
		id: z.string().optional(),
		meeting_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		start_time: z.string().optional(),
		file_count: z.number().optional(),
		file_size: z.number().optional(),
		status: z.string().optional(),
		// Archive file entries have variable structure depending on file type
		archive_files: z.array(z.record(z.unknown())).optional(),
	})
	.passthrough();

const DailyReportSchema = z
	.object({
		date: z.string().optional(),
		new_user: z.number().optional(),
		meetings: z.number().optional(),
		participants: z.number().optional(),
		meeting_minutes: z.number().optional(),
	})
	.passthrough();

const PaginationSchema = z
	.object({
		page_count: z.number().optional(),
		page_number: z.number().optional(),
		page_size: z.number().optional(),
		total_records: z.number().optional(),
		next_page_token: z.string().optional(),
	})
	.passthrough();

// ── Input Schemas ─────────────────────────────────────────────────────────────

const MeetingsCreateInputSchema = z.object({
	topic: z.string().optional(),
	type: z.number().optional(),
	start_time: z.string().optional(),
	duration: z.number().optional(),
	timezone: z.string().optional(),
	agenda: z.string().optional(),
	password: z.string().optional(),
	settings: MeetingSettingsSchema.optional(),
});

const MeetingsGetInputSchema = z.object({
	meetingId: z.string(),
});

const MeetingsListInputSchema = z.object({
	type: z.string().optional(),
	page_size: z.number().optional(),
	next_page_token: z.string().optional(),
	page_number: z.number().optional(),
});

const MeetingsUpdateInputSchema = z.object({
	meetingId: z.string(),
	topic: z.string().optional(),
	type: z.number().optional(),
	start_time: z.string().optional(),
	duration: z.number().optional(),
	timezone: z.string().optional(),
	agenda: z.string().optional(),
	password: z.string().optional(),
	settings: MeetingSettingsSchema.optional(),
});

const MeetingsAddRegistrantInputSchema = z.object({
	meetingId: z.string(),
	email: z.string(),
	first_name: z.string(),
	last_name: z.string().optional(),
	auto_approve: z.boolean().optional(),
});

const MeetingsGetSummaryInputSchema = z.object({
	meetingId: z.string(),
});

const RecordingsGetMeetingInputSchema = z.object({
	meetingId: z.string(),
});

const RecordingsDeleteMeetingInputSchema = z.object({
	meetingId: z.string(),
	action: z.string().optional(),
});

const RecordingsListAllInputSchema = z.object({
	from: z.string().optional(),
	to: z.string().optional(),
	page_size: z.number().optional(),
	next_page_token: z.string().optional(),
	mc: z.string().optional(),
	trash: z.boolean().optional(),
});

const WebinarsGetInputSchema = z.object({
	webinarId: z.string(),
});

const WebinarsListInputSchema = z.object({
	page_size: z.number().optional(),
	page_number: z.number().optional(),
});

const WebinarsAddRegistrantInputSchema = z.object({
	webinarId: z.string(),
	email: z.string(),
	first_name: z.string(),
	last_name: z.string().optional(),
	auto_approve: z.boolean().optional(),
});

const WebinarsListParticipantsInputSchema = z.object({
	webinarId: z.string(),
	page_size: z.number().optional(),
	next_page_token: z.string().optional(),
});

const ReportsDailyUsageInputSchema = z.object({
	year: z.number().optional(),
	month: z.number().optional(),
});

const ParticipantsGetPastMeetingInputSchema = z.object({
	meetingId: z.string(),
	page_size: z.number().optional(),
	next_page_token: z.string().optional(),
});

const DevicesListInputSchema = z.object({
	page_size: z.number().optional(),
	next_page_token: z.string().optional(),
	search_text: z.string().optional(),
	platform_os: z.string().optional(),
	device_vendor: z.string().optional(),
	device_model: z.string().optional(),
	device_status: z.number().optional(),
});

const ArchiveFilesListInputSchema = z.object({
	page_size: z.number().optional(),
	next_page_token: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	type: z.number().optional(),
	query_date_type: z.string().optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const MeetingsCreateResponseSchema = MeetingSchema;

const MeetingsGetResponseSchema = MeetingSchema;

const MeetingsListResponseSchema = PaginationSchema.extend({
	meetings: z.array(MeetingSchema).optional(),
}).passthrough();

const MeetingsUpdateResponseSchema = z.object({}).passthrough();

const MeetingsAddRegistrantResponseSchema = z
	.object({
		registrant_id: z.string().optional(),
		id: z.number().optional(),
		topic: z.string().optional(),
		start_time: z.string().optional(),
		join_url: z.string().optional(),
	})
	.passthrough();

const MeetingsGetSummaryResponseSchema = z
	.object({
		meeting_host_id: z.string().optional(),
		meeting_host_email: z.string().optional(),
		meeting_uuid: z.string().optional(),
		meeting_id: z.number().optional(),
		meeting_topic: z.string().optional(),
		meeting_start_time: z.string().optional(),
		meeting_end_time: z.string().optional(),
		summary_start_time: z.string().optional(),
		summary_end_time: z.string().optional(),
		summary_created_time: z.string().optional(),
		summary_last_modified_time: z.string().optional(),
		summary_title: z.string().optional(),
		summary_overview: z.string().optional(),
		// AI-generated summary detail items have an open-ended structure that Zoom may extend
		summary_details: z.array(z.record(z.unknown())).optional(),
		next_steps: z.array(z.string()).optional(),
		// Edited summary is a freeform object whose shape is not constrained by Zoom's API schema
		edited_summary: z.record(z.unknown()).optional(),
	})
	.passthrough();

const RecordingsGetMeetingResponseSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.number().optional(),
		account_id: z.string().optional(),
		host_id: z.string().optional(),
		topic: z.string().optional(),
		type: z.number().optional(),
		start_time: z.string().optional(),
		timezone: z.string().optional(),
		duration: z.number().optional(),
		total_size: z.number().optional(),
		recording_count: z.number().optional(),
		recording_files: z.array(RecordingFileSchema).optional(),
		password: z.string().optional(),
		share_url: z.string().optional(),
	})
	.passthrough();

const RecordingsDeleteMeetingResponseSchema = z.object({}).passthrough();

const RecordingsListAllResponseSchema = z
	.object({
		from: z.string().optional(),
		to: z.string().optional(),
		page_count: z.number().optional(),
		page_size: z.number().optional(),
		total_records: z.number().optional(),
		next_page_token: z.string().optional(),
		meetings: z
			.array(
				z
					.object({
						uuid: z.string().optional(),
						id: z.number().optional(),
						account_id: z.string().optional(),
						host_id: z.string().optional(),
						topic: z.string().optional(),
						type: z.number().optional(),
						start_time: z.string().optional(),
						timezone: z.string().optional(),
						duration: z.number().optional(),
						total_size: z.number().optional(),
						recording_count: z.number().optional(),
						recording_files: z.array(RecordingFileSchema).optional(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();

const WebinarsGetResponseSchema = WebinarSchema;

const WebinarsListResponseSchema = PaginationSchema.extend({
	webinars: z.array(WebinarSchema).optional(),
}).passthrough();

const WebinarsAddRegistrantResponseSchema = z
	.object({
		id: z.string().optional(),
		topic: z.string().optional(),
		start_time: z.string().optional(),
		join_url: z.string().optional(),
		registrant_id: z.string().optional(),
	})
	.passthrough();

const WebinarsListParticipantsResponseSchema = z
	.object({
		next_page_token: z.string().optional(),
		page_count: z.number().optional(),
		page_size: z.number().optional(),
		total_records: z.number().optional(),
		participants: z.array(ParticipantSchema).optional(),
	})
	.passthrough();

const ReportsDailyUsageResponseSchema = z
	.object({
		year: z.number().optional(),
		month: z.number().optional(),
		dates: z.array(DailyReportSchema).optional(),
	})
	.passthrough();

const ParticipantsGetPastMeetingResponseSchema = z
	.object({
		next_page_token: z.string().optional(),
		page_count: z.number().optional(),
		page_size: z.number().optional(),
		total_records: z.number().optional(),
		participants: z.array(ParticipantSchema).optional(),
	})
	.passthrough();

const DevicesListResponseSchema = z
	.object({
		next_page_token: z.string().optional(),
		page_size: z.number().optional(),
		total_records: z.number().optional(),
		devices: z.array(DeviceSchema).optional(),
	})
	.passthrough();

const ArchiveFilesListResponseSchema = z
	.object({
		next_page_token: z.string().optional(),
		page_size: z.number().optional(),
		total_records: z.number().optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		meetings: z.array(ArchiveMeetingSchema).optional(),
	})
	.passthrough();

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const ZoomEndpointInputSchemas = {
	meetingsCreate: MeetingsCreateInputSchema,
	meetingsGet: MeetingsGetInputSchema,
	meetingsList: MeetingsListInputSchema,
	meetingsUpdate: MeetingsUpdateInputSchema,
	meetingsAddRegistrant: MeetingsAddRegistrantInputSchema,
	meetingsGetSummary: MeetingsGetSummaryInputSchema,
	recordingsGetMeeting: RecordingsGetMeetingInputSchema,
	recordingsDeleteMeeting: RecordingsDeleteMeetingInputSchema,
	recordingsListAll: RecordingsListAllInputSchema,
	webinarsGet: WebinarsGetInputSchema,
	webinarsList: WebinarsListInputSchema,
	webinarsAddRegistrant: WebinarsAddRegistrantInputSchema,
	webinarsListParticipants: WebinarsListParticipantsInputSchema,
	reportsDailyUsage: ReportsDailyUsageInputSchema,
	participantsGetPastMeeting: ParticipantsGetPastMeetingInputSchema,
	devicesList: DevicesListInputSchema,
	archiveFilesList: ArchiveFilesListInputSchema,
} as const;

export type ZoomEndpointInputs = {
	[K in keyof typeof ZoomEndpointInputSchemas]: z.infer<
		(typeof ZoomEndpointInputSchemas)[K]
	>;
};

export const ZoomEndpointOutputSchemas = {
	meetingsCreate: MeetingsCreateResponseSchema,
	meetingsGet: MeetingsGetResponseSchema,
	meetingsList: MeetingsListResponseSchema,
	meetingsUpdate: MeetingsUpdateResponseSchema,
	meetingsAddRegistrant: MeetingsAddRegistrantResponseSchema,
	meetingsGetSummary: MeetingsGetSummaryResponseSchema,
	recordingsGetMeeting: RecordingsGetMeetingResponseSchema,
	recordingsDeleteMeeting: RecordingsDeleteMeetingResponseSchema,
	recordingsListAll: RecordingsListAllResponseSchema,
	webinarsGet: WebinarsGetResponseSchema,
	webinarsList: WebinarsListResponseSchema,
	webinarsAddRegistrant: WebinarsAddRegistrantResponseSchema,
	webinarsListParticipants: WebinarsListParticipantsResponseSchema,
	reportsDailyUsage: ReportsDailyUsageResponseSchema,
	participantsGetPastMeeting: ParticipantsGetPastMeetingResponseSchema,
	devicesList: DevicesListResponseSchema,
	archiveFilesList: ArchiveFilesListResponseSchema,
} as const;

export type ZoomEndpointOutputs = {
	[K in keyof typeof ZoomEndpointOutputSchemas]: z.infer<
		(typeof ZoomEndpointOutputSchemas)[K]
	>;
};

export type MeetingCreateResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.meetingsCreate
>;
export type MeetingGetResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.meetingsGet
>;
export type MeetingListResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.meetingsList
>;
export type MeetingUpdateResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.meetingsUpdate
>;
export type MeetingAddRegistrantResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.meetingsAddRegistrant
>;
export type MeetingGetSummaryResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.meetingsGetSummary
>;
export type RecordingGetMeetingResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.recordingsGetMeeting
>;
export type RecordingDeleteMeetingResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.recordingsDeleteMeeting
>;
export type RecordingListAllResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.recordingsListAll
>;
export type WebinarGetResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.webinarsGet
>;
export type WebinarListResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.webinarsList
>;
export type WebinarAddRegistrantResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.webinarsAddRegistrant
>;
export type WebinarListParticipantsResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.webinarsListParticipants
>;
export type ReportDailyUsageResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.reportsDailyUsage
>;
export type ParticipantGetPastMeetingResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.participantsGetPastMeeting
>;
export type DeviceListResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.devicesList
>;
export type ArchiveFileListResponse = z.infer<
	typeof ZoomEndpointOutputSchemas.archiveFilesList
>;
