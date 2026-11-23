export const MEETING = {
	title: 'Quarterly Business Review',
	meeting_title: 'QBR 2025 Q1',
	meeting_type: 'Quarterly Business Review',
	recording_id: 123456789,
	url: 'https://fathom.video/xyz123',
	meeting_url: 'https://us02web.zoom.us/j/123456789',
	share_url: 'https://fathom.video/share/xyz123',
	created_at: '2025-03-01T17:01:30Z',
	scheduled_start_time: '2025-03-01T16:00:00Z',
	scheduled_end_time: '2025-03-01T17:00:00Z',
	recording_start_time: '2025-03-01T16:01:12Z',
	recording_end_time: '2025-03-01T17:00:55Z',
	calendar_invitees_domains_type: 'one_or_more_external',
	shared_with: 'single_team',
	transcript_language: 'en',
	transcript: [
		{
			speaker: {
				display_name: 'Jane Doe',
				matched_calendar_invitee_email: 'jane.doe@acme.com',
			},
			text: "Let's revisit the budget allocations.",
			timestamp: '00:05:32',
		},
	],
	default_summary: {
		template_name: 'general',
		markdown_formatted: '## Summary\nWe reviewed Q1 OKRs.\n',
	},
	action_items: [
		{
			description: 'Email revised proposal to client',
			user_generated: false,
			completed: false,
			recording_timestamp: '00:10:45',
			recording_playback_url: 'https://fathom.video/calls/xyz123?timestamp=645',
			assignee: {
				name: 'Jane Doe',
				email: 'jane.doe@acme.com',
				team: 'Marketing',
			},
		},
	],
	calendar_invitees: [
		{
			name: 'John Smith',
			matched_speaker_display_name: null,
			email: 'john.smith@client.com',
			is_external: true,
			email_domain: 'client.com',
		},
	],
	recorded_by: {
		name: 'Alice Johnson',
		email: 'alice.johnson@acme.com',
		team: 'Customer Success',
		email_domain: 'acme.com',
	},
	crm_matches: {
		companies: [
			{
				name: 'Acme Corp',
				record_url: 'https://app.hubspot.com/companies/456',
			},
		],
		error: null,
	},
} as const;
