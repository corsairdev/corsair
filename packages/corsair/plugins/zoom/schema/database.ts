import z from 'zod';

export const ZoomMeeting = z.object({
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
	settings: z
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
		.optional(),
});

export const ZoomRecording = z.object({
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
});

export const ZoomWebinar = z.object({
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
	settings: z
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
		.optional(),
});

export const ZoomParticipant = z.object({
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
});

export type ZoomMeeting = z.infer<typeof ZoomMeeting>;
export type ZoomRecording = z.infer<typeof ZoomRecording>;
export type ZoomWebinar = z.infer<typeof ZoomWebinar>;
export type ZoomParticipant = z.infer<typeof ZoomParticipant>;
