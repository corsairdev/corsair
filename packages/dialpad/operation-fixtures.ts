export const DialpadOperationFixtures = {
	'accesscontrolpolicies.assign': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'accesscontrolpolicies.delete': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			company_id: 1,
			id: 1,
			name: 'sample-value',
			owner_id: 1,
			permission_sets: [],
			state: 'active',
		},
	},
	'accesscontrolpolicies.update': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 1,
			name: 'sample-value',
			owner_id: 1,
			permission_sets: [],
			state: 'active',
		},
	},
	'agentgroup.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {
			created_at: 1,
			id: 'sample-value',
			name: 'sample-value',
			office_id: 'sample-value',
		},
	},
	'anonymization.requests.get': {
		input: {
			path: {
				request_id: 'sample-value',
			},
		},
		output: {
			completed_count: 1,
			date_created: '2024-01-02T03:04:05Z',
			failed_count: 1,
			request_id: 'sample-value',
			status: 'sample-value',
			total: 1,
		},
	},
	'accesscontrolpolicies.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'accesscontrolpolicies.unassign': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'accesscontrolpolicies.create': {
		input: {
			body: {
				name: 'sample-value',
				owner_id: 1,
				permission_sets: [],
			},
		},
		output: {
			company_id: 1,
			id: 1,
			name: 'sample-value',
			owner_id: 1,
			permission_sets: [],
			state: 'active',
		},
	},
	'accesscontrolpolicies.assignments': {
		input: {
			path: {
				id: 1,
			},
			query: {},
		},
		output: {},
	},
	'anonymization.contacts': {
		input: {
			body: {
				contact_keys: [],
			},
		},
		output: {
			completed_count: 1,
			date_created: '2024-01-02T03:04:05Z',
			failed_count: 1,
			request_id: 'sample-value',
			status: 'sample-value',
			total: 1,
		},
	},
	'accesscontrolpolicies.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			company_id: 1,
			id: 1,
			name: 'sample-value',
			owner_id: 1,
			permission_sets: [],
			state: 'active',
		},
	},
	'app_settings.get': {
		input: {
			query: {},
		},
		output: {
			enabled: true,
			is_preferred_service: false,
			settings: {
				call_logging_enabled: true,
				call_recording_logging_enabled: false,
				voicemail_logging_enabled: true,
				sms_logging_enabled: false,
				custom_company_setting: 'enabled',
			},
		},
	},
	'blockednumbers.get': {
		input: {
			path: {
				number: 'sample-value',
			},
		},
		output: {},
	},
	'available_numbers.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'blockednumbers.add': {
		input: {
			body: {},
		},
	},
	'blockednumbers.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'blockednumbers.remove': {
		input: {
			body: {},
		},
	},
	'call.assign': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'call.get_assigned_operators': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			call_id: 1,
		},
	},
	'anonymization.callcontent': {
		input: {
			body: {
				call_ids: [],
			},
		},
		output: {
			completed_count: 1,
			date_created: '2024-01-02T03:04:05Z',
			failed_count: 1,
			request_id: 'sample-value',
			status: 'sample-value',
			total: 1,
		},
	},
	'call.get_ai_recap': {
		input: {
			path: {
				id: 1,
			},
			query: {},
		},
		output: {},
	},
	'call.participants.add': {
		input: {
			path: {
				id: 1,
			},
			body: {
				participant: {
					number: 'sample-value',
				},
			},
		},
		output: {},
	},
	'call.list': {
		input: {
			query: {},
		},
		output: {
			cursor: 'next-page-cursor',
			items: [
				{
					call_id: 1002,
					contact: {
						id: '1001',
						name: 'Taylor Example',
						phone: '+14155557777',
						type: 'local',
					},
					date_connected: 1356998400000,
					direction: 'inbound',
					duration: 12000,
					is_transferred: false,
					recording_details: [
						{
							duration: 12000,
							id: 'recording-1002',
							recording_type: 'callrecording',
							start_time: 1356998400000,
							url: 'https://dialpad.com/r/recording-1002',
						},
					],
					target: {
						id: '2',
						name: 'Taylor Example',
						type: 'user',
					},
					was_recorded: true,
				},
			],
		},
	},
	'call.initiate_ivr_call': {
		input: {
			body: {
				phone_number: 'sample-value',
				target_id: 1,
				target_type: 'callcenter',
			},
		},
		output: {
			call_id: 1,
		},
	},
	'call.unassign_all_call_operators': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			call_id: 1,
		},
	},
	'call.transfer_call': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'call.get_call_info': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			call_id: 1002,
			contact: {
				email: '',
				id: '1001',
				name: 'Taylor Example',
				phone: '+14155557777',
				type: 'local',
			},
			custom_data: '{"source":"fixture"}',
			date_connected: 1356998400000,
			date_rang: 1356998400000,
			date_started: 1356998400000,
			direction: 'inbound',
			entry_point_call_id: 1000,
			entry_point_target: {
				id: '124',
				name: 'Example Office',
				phone: '+14155551000',
				type: 'office',
			},
			event_timestamp: 1356998400000,
			external_number: '+14155557777',
			group_id: 'Office:124',
			internal_number: '+14155551001',
			is_transferred: false,
			proxy_target: {},
			state: 'connected',
			target: {
				email: 'taylor@example.com',
				id: '2',
				name: 'Taylor Example',
				phone: '+14155551001',
				type: 'user',
			},
			was_recorded: true,
		},
	},
	'call.unassign_operator': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'call.unpark': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'call.initiate': {
		input: {
			body: {
				phone_number: 'sample-value',
				user_id: 1,
			},
		},
		output: {},
	},
	'call.add_labels': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'call.hangup': {
		input: {
			path: {
				id: 1,
			},
		},
	},
	'callbacks.list': {
		input: {
			query: {
				call_center_id: 1,
			},
		},
		output: {},
	},
	'callback.validate': {
		input: {
			body: {
				call_center_id: 1,
				phone_number: 'sample-value',
			},
		},
		output: {},
	},
	'callcenters.listall': {
		input: {
			query: {},
		},
		output: {},
	},
	'callcenters.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'callcenters.update': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'callcenters.create': {
		input: {
			body: {
				name: 'sample-value',
				office_id: 1,
			},
		},
		output: {},
	},
	'callback.enqueue': {
		input: {
			body: {
				call_center_id: 1,
				phone_number: 'sample-value',
			},
		},
		output: {},
	},
	'callcenters.delete': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'callcenters.get_status': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			availability: {
				status: 'sample-value',
			},
			capacity: 1,
			longest_call_wait_time: 1,
			on_duty_operators: 1,
			pending: 1,
		},
	},
	'callcenters.operators.update_duty_status': {
		input: {
			path: {
				id: 1,
			},
			body: {
				on_duty: false,
			},
		},
		output: {},
	},
	'callcenters.operators.get_skill_level': {
		input: {
			path: {
				call_center_id: 1,
				user_id: 1,
			},
		},
		output: {},
	},
	'callcenters.operators.get_duty_status': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'callcenters.operators.update_skill_level': {
		input: {
			path: {
				call_center_id: 1,
				user_id: 1,
			},
			body: {
				skill_level: 1,
			},
		},
		output: {},
	},
	'callcenters.operators.add': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'callcenters.queue.list': {
		input: {
			path: {
				id: 1,
			},
			query: {},
		},
		output: {},
	},
	'callcenters.operators.delete': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'call_labels.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'call_review_share_link.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'call_review_share_link.create': {
		input: {
			body: {},
		},
		output: {},
	},
	'call_review_share_link.delete': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'callrouters.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'callcenters.operators.list': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'callrouters.delete': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
	},
	'callrouters.create': {
		input: {
			body: {
				default_target_id: 1,
				default_target_type: 'callcenter',
				name: 'sample-value',
				office_id: 1,
				routing_url: 'sample-value',
			},
		},
		output: {},
	},
	'callrouters.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'call_review_share_link.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {
				privacy: 'company',
			},
		},
		output: {},
	},
	'callrouters.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'numbers.assign_call_router_number.post': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'channels.delete': {
		input: {
			path: {
				id: 1,
			},
		},
	},
	'channels.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			name: 'sample-value',
		},
	},
	'channels.members.list': {
		input: {
			path: {
				id: 1,
			},
			query: {},
		},
		output: {},
	},
	'channels.list': {
		input: {
			query: {},
		},
		output: {
			cursor: 'next-page-cursor',
			items: [
				{
					hashtag: '#support',
					id: 42,
					member_count: 7,
					name: 'Support',
					office_id: 1,
					privacy: 'public',
				},
			],
		},
	},
	'coaching_team.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'coaching_team.members.get': {
		input: {
			path: {
				id: 1,
			},
			query: {},
		},
		output: {},
	},
	'channels.create': {
		input: {
			body: {
				description: 'sample-value',
				name: 'sample-value',
				privacy_type: 'private',
			},
		},
		output: {
			name: 'sample-value',
		},
	},
	'channels.members.delete': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
	},
	'channels.members.add': {
		input: {
			path: {
				id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'coaching_team.listall': {
		input: {
			query: {},
		},
		output: {},
	},
	'company.get': {
		input: {},
		output: {},
	},
	'company.sms_opt_out': {
		input: {
			path: {
				id: 'sample-value',
			},
			query: {
				opt_out_state: 'opted_back_in',
			},
		},
		output: {},
	},
	'company.update_settings': {
		input: {
			query: {},
		},
		output: {},
	},
	'coaching_team.members.add': {
		input: {
			path: {
				id: 1,
			},
			body: {
				member_id: 'sample-value',
				role: 'coach',
			},
		},
		output: {
			id: 1,
			role: 'coach',
		},
	},
	'company.get_ai_settings': {
		input: {},
		output: {},
	},
	'company.update': {
		input: {
			body: {},
		},
		output: {},
	},
	'company.update_ai_settings': {
		input: {
			body: {},
		},
		output: {},
	},
	'contacts.delete': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'contacts.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'contacts.list': {
		input: {
			query: {},
		},
		output: {
			cursor: 'next-page-cursor',
			items: [
				{
					company_name: 'Example Co.',
					display_name: 'Taylor Example',
					emails: ['taylor@example.com'],
					first_name: 'Taylor',
					id: 'contact-1001',
					last_name: 'Example',
					owner_id: '2',
					phones: ['+14155557777'],
					primary_email: 'taylor@example.com',
					primary_phone: '+14155557777',
					type: 'local',
				},
			],
		},
	},
	'contacts.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'contacts.create': {
		input: {
			body: {
				first_name: 'sample-value',
				last_name: 'sample-value',
			},
		},
		output: {},
	},
	'contacts.create_with_uid': {
		input: {
			body: {
				first_name: 'sample-value',
				last_name: 'sample-value',
				uid: 'sample-value',
			},
		},
		output: {},
	},
	'ivr.delete': {
		input: {
			path: {
				target_type: 'callcenter',
				target_id: 1,
				ivr_type: 'ADMIN_AUTO_RECORDING',
			},
			body: {
				ivr_id: 1,
			},
		},
		output: {},
	},
	'contacts.search': {
		input: {
			query: {},
		},
		output: {},
	},
	'ivr.assign': {
		input: {
			path: {
				target_type: 'callcenter',
				target_id: 1,
				ivr_type: 'ADMIN_AUTO_RECORDING',
			},
			body: {
				ivr_id: 1,
			},
		},
		output: {},
	},
	'custom_ivrs.list': {
		input: {
			query: {
				target_type: 'callcenter',
				target_id: 1,
			},
		},
		output: {},
	},
	'ivr.update_details': {
		input: {
			path: {
				ivr_id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'departments.delete': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'ivr.create': {
		input: {
			body: {
				file: 'c2FtcGxl',
				ivr_type: 'ADMIN_AUTO_RECORDING',
				target_id: 1,
				target_type: 'callcenter',
			},
		},
		output: {},
	},
	'departments.update': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'departments.create': {
		input: {
			body: {
				name: 'sample-value',
				office_id: 1,
			},
		},
		output: {},
	},
	'departments.listall': {
		input: {
			query: {},
		},
		output: {},
	},
	'departments.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'departments.operators.delete': {
		input: {
			path: {
				id: 1,
			},
			body: {
				operator_id: 1,
				operator_type: 'room',
			},
		},
		output: {},
	},
	'dispositions.delete': {
		input: {
			path: {
				id: 1,
			},
		},
	},
	'digital.sessions.list': {
		input: {
			query: {
				end_date: 'sample-value',
				start_date: 'sample-value',
			},
		},
		output: {},
	},
	'dispositions.update': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'dispositions.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'departments.operators.list': {
		input: {
			path: {
				id: 1,
			},
			query: {},
		},
		output: {},
	},
	'dispositions.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'dispositions.create': {
		input: {
			body: {
				name: 'sample-value',
				office_id: 1,
			},
		},
		output: {},
	},
	'departments.operators.add': {
		input: {
			path: {
				id: 1,
			},
			body: {
				operator_id: 1,
				operator_type: 'room',
			},
		},
		output: {},
	},
	'faxline.assign': {
		input: {
			body: {
				line: {
					number: 'sample-value',
					type: 'reserved',
				},
				target: {
					target_id: 1,
					target_type: 'department',
				},
			},
		},
		output: {
			number: 'sample-value',
		},
	},
	'bulk_messages.get': {
		input: {
			path: {
				id: 'sample-value',
			},
			query: {},
		},
		output: {
			text: 'sample-value',
		},
	},
	'fax.send': {
		input: {
			body: {
				to_number: 'sample-value',
			},
		},
		output: {},
	},
	'bulk_messages.send': {
		input: {
			body: {
				from_number: 'sample-value',
				text: 'sample-value',
				to_numbers: [],
			},
		},
		output: {},
	},
	'scheduled_messages.create': {
		input: {
			body: {
				start_date: 1,
			},
		},
		output: {},
	},
	'scheduled_messages.delete': {
		input: {
			path: {
				id: 'sample-value',
			},
			query: {},
		},
		output: {},
	},
	'bulk_messages.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'bulk_messages.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'scheduled_messages.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'numbers.unassign': {
		input: {
			path: {
				number: 'sample-value',
			},
			query: {},
		},
		output: {},
	},
	'scheduled_messages.get': {
		input: {
			path: {
				id: 'sample-value',
			},
			query: {},
		},
		output: {},
	},
	'numbers.assign': {
		input: {
			path: {
				number: 'sample-value',
			},
			body: {
				target_id: 1,
				target_type: 'callcenter',
			},
		},
		output: {},
	},
	'scheduled_messages.send_now': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'numbers.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'numbers.auto_assign': {
		input: {
			body: {
				target_id: 1,
				target_type: 'callcenter',
			},
		},
		output: {},
	},
	'numbers.swap': {
		input: {
			body: {
				target: {
					target_id: 1,
					target_type: 'callcenter',
				},
			},
		},
		output: {},
	},
	'number_tags.update': {
		input: {
			body: {
				phone: 'sample-value',
			},
		},
		output: {},
	},
	'scheduled_messages.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'numbers.get': {
		input: {
			path: {
				number: 'sample-value',
			},
		},
		output: {},
	},
	'coaching_team.list': {
		input: {
			path: {
				office_id: 1,
			},
			query: {},
		},
		output: {},
	},
	'office_plan.get': {
		input: {
			path: {
				office_id: 1,
			},
		},
		output: {},
	},
	'phone_number.format': {
		input: {
			query: {},
		},
		output: {},
	},
	'departments.list': {
		input: {
			path: {
				office_id: 1,
			},
			query: {},
		},
		output: {},
	},
	'numbers.office_unassign_number.post': {
		input: {
			path: {
				id: 1,
			},
			body: {
				number: 'sample-value',
			},
		},
		output: {},
	},
	'callcenters.list': {
		input: {
			path: {
				office_id: 1,
			},
			query: {},
		},
		output: {},
	},
	'numbers.assign_office_number.post': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'available_licenses.list': {
		input: {
			path: {
				office_id: 1,
			},
		},
		output: {},
	},
	'offices.e911.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'offices.offdutystatuses.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'offices.e911.update': {
		input: {
			path: {
				id: 1,
			},
			body: {
				address: 'sample-value',
				city: 'sample-value',
				country: 'sample-value',
				state: 'sample-value',
				zip: 'sample-value',
			},
		},
		output: {},
	},
	'offices.update': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'offices.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'offices.primary.get': {
		input: {},
		output: {},
	},
	'offices.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'offices.operators.delete': {
		input: {
			path: {
				id: 1,
			},
			body: {
				operator_id: 1,
				operator_type: 'room',
			},
		},
		output: {},
	},
	'offices.create': {
		input: {
			body: {
				annual_commit_monthly_billing: false,
				billing_address: {
					address_line_1: 'sample-value',
					city: 'sample-value',
					country: 'sample-value',
					postal_code: 'sample-value',
					region: 'sample-value',
				},
				country: 'AE',
				currency: 'AUD',
				invoiced: false,
				name: 'sample-value',
				plan_period: 'monthly',
				unified_billing: false,
			},
		},
		output: {},
	},
	'offices.operators.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'offices.operators.post': {
		input: {
			path: {
				id: 1,
			},
			body: {
				operator_id: 1,
				operator_type: 'room',
			},
		},
		output: {},
	},
	'recording_share_link.create': {
		input: {
			body: {
				recording_id: 'sample-value',
				recording_type: 'admincallrecording',
			},
		},
		output: {},
	},
	'recording_share_link.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'numbers.assign_room_number.post': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'numbers.room_unassign_number.post': {
		input: {
			path: {
				id: 1,
			},
			body: {
				number: 'sample-value',
			},
		},
		output: {},
	},
	'rooms.delete': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'rooms.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'recording_share_link.delete': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'rooms.post': {
		input: {
			body: {
				name: 'sample-value',
				office_id: 1,
			},
		},
		output: {},
	},
	'recording_share_link.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {
				privacy: 'admin',
			},
		},
		output: {},
	},
	'deskphones.rooms.create_international_pin': {
		input: {
			body: {},
		},
		output: {},
	},
	'rooms.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'deskphones.rooms.get': {
		input: {
			path: {
				id: 'sample-value',
				parent_id: 1,
			},
		},
		output: {},
	},
	'rooms.patch': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'deskphones.rooms.list': {
		input: {
			path: {
				parent_id: 1,
			},
		},
		output: {},
	},
	'deskphones.rooms.delete': {
		input: {
			path: {
				id: 'sample-value',
				parent_id: 1,
			},
		},
	},
	'schedule_reports.update': {
		input: {
			path: {
				id: 1,
			},
			body: {
				at: 1,
				endpoint_id: 1,
				frequency: 'daily',
				name: 'sample-value',
				on_day: 1,
				report_type: 'call_logs',
			},
		},
		output: {
			report_type: 'call_logs',
		},
	},
	'schedule_reports.create': {
		input: {
			body: {
				at: 1,
				endpoint_id: 1,
				frequency: 'daily',
				name: 'sample-value',
				on_day: 1,
				report_type: 'call_logs',
			},
		},
		output: {
			report_type: 'call_logs',
		},
	},
	'schedule_reports.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			report_type: 'call_logs',
		},
	},
	'scorecards.export.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'scorecards.export.create': {
		input: {
			body: {
				scorecards_type: 'scorecard_export_agent_leaderboard',
			},
		},
		output: {},
	},
	'scorecards.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {
			id: 1,
			name: 'sample-value',
		},
	},
	'scorecards.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'schedule_reports.delete': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {
			report_type: 'call_logs',
		},
	},
	'schedule_reports.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'stats.export.create': {
		input: {
			body: {
				export_type: 'records',
				stat_type: 'calls',
			},
		},
		output: {},
	},
	'stats.export.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'sms.send': {
		input: {
			body: {},
		},
		output: {},
	},
	'users.initiate_call': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {},
	},
	'users.toggle_call_vi': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'userdevices.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'transcripts.get': {
		input: {
			path: {
				call_id: 1,
			},
		},
		output: {},
	},
	'userdevices.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'users.toggle_call_recording': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'transcripts.get_url': {
		input: {
			path: {
				call_id: 1,
			},
		},
		output: {},
	},
	'users.set_caller_id': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {
				caller_id: 'sample-value',
			},
		},
		output: {
			id: 1,
		},
	},
	'deskphones.users.delete': {
		input: {
			path: {
				id: 'sample-value',
				parent_id: 1,
			},
		},
	},
	'caller_id.users.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {
			id: 1,
		},
	},
	'deskphones.users.get': {
		input: {
			path: {
				id: 'sample-value',
				parent_id: 1,
			},
		},
		output: {},
	},
	'users.e911.update': {
		input: {
			path: {
				id: 1,
			},
			body: {
				address: 'sample-value',
				city: 'sample-value',
				country: 'sample-value',
				state: 'sample-value',
				zip: 'sample-value',
			},
		},
		output: {},
	},
	'users.toggle_dnd': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {
				do_not_disturb: false,
			},
		},
		output: {},
	},
	'users.unassign_number': {
		input: {
			path: {
				id: 1,
			},
			body: {
				number: 'sample-value',
			},
		},
		output: {},
	},
	'users.assign_number': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'users.list_personas': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'users.e911.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'deskphones.users.list': {
		input: {
			path: {
				parent_id: 1,
			},
		},
		output: {},
	},
	'screen_pop.initiate': {
		input: {
			path: {
				id: 1,
			},
			body: {
				screen_pop_uri: 'sample-value',
			},
		},
		output: {},
	},
	'users.delete': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {
			onboarding_completed: false,
			voicemail: {},
		},
	},
	'users.get': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {
			onboarding_completed: false,
			voicemail: {},
		},
	},
	'users.list': {
		input: {
			query: {},
		},
		output: {
			cursor: 'next-page-cursor',
			items: [
				{
					company_id: 1,
					display_name: 'Taylor Example',
					emails: ['taylor@example.com'],
					extension: '1001',
					first_name: 'Taylor',
					forwarding_numbers: [],
					group_details: [
						{ group_id: 12, group_type: 'department', role: 'operator' },
					],
					id: 2,
					is_available: true,
					is_company_admin: false,
					is_on_duty: true,
					last_name: 'Example',
					onboarding_completed: true,
					phone_numbers: ['+14155551001'],
					state: 'active',
					voicemail: {},
				},
			],
		},
	},
	'users.update': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {
			onboarding_completed: false,
			voicemail: {},
		},
	},
	'users.create': {
		input: {
			body: {
				email: 'sample-value',
				office_id: 1,
			},
		},
		output: {
			onboarding_completed: false,
			voicemail: {},
		},
	},
	'users.move_office': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {
			onboarding_completed: false,
			voicemail: {},
		},
	},
	'users.create_batch': {
		input: {
			body: {
				users: [],
			},
		},
		output: {},
	},
	'users.update_status': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'search.users': {
		input: {
			query: {
				query: 'sample-value',
			},
		},
		output: {},
	},
	'websockets.get': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'websockets.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'websockets.create': {
		input: {
			body: {},
		},
		output: {},
	},
	'meetings.conference-meetings.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'meetings.conference-rooms.list': {
		input: {
			query: {},
		},
		output: {},
	},
	'websockets.update': {
		input: {
			path: {
				id: 1,
			},
			body: {},
		},
		output: {},
	},
	'meetings.meetings.get': {
		input: {
			path: {
				scheduled_conference_id: 1,
			},
			query: {},
		},
		output: {},
	},
	'websockets.delete': {
		input: {
			path: {
				id: 1,
			},
		},
		output: {},
	},
	'meetings.meetings.update': {
		input: {
			path: {
				scheduled_conference_id: 1,
			},
			body: {
				user_id: 1,
			},
		},
		output: {},
	},
	'meetings.meetings.delete': {
		input: {
			path: {
				scheduled_conference_id: 1,
			},
			query: {},
		},
		output: {},
	},
	'meetings.meetings.create': {
		input: {
			body: {
				start_datetime: 1,
				title: 'sample-value',
				user_id: 1,
			},
		},
		output: {},
	},
	'meetings.meetings.room.create': {
		input: {
			query: {
				user_id: 1,
			},
		},
		output: {
			meeting_type: 'sample-value',
			url: 'sample-value',
			user_id: 'sample-value',
		},
	},
	'wfm.wfm-metrics-activity.get': {
		input: {
			query: {
				end: '2024-01-02T03:04:05Z',
				start: '2024-01-02T03:04:05Z',
			},
		},
		output: {
			items: [],
		},
	},
	'wfm.wfm-metrics-agent.get': {
		input: {
			query: {
				end: '2024-01-02T03:04:05Z',
				start: '2024-01-02T03:04:05Z',
			},
		},
		output: {
			items: [],
		},
	},
	'meetings.meetings.list': {
		input: {
			query: {
				user_id: 1,
				start_datetime: 1,
			},
		},
		output: {},
	},
	'powerdialer.getModelsByKeys': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getAblyToken': {
		input: {},
		output: {
			capability: 'sample-value',
			clientId: 'sample-value',
			expires: 1,
			issued: 1,
			keyName: 'sample-value',
			token: 'sample-value',
		},
	},
	'powerdialer.getContact': {
		input: {
			path: {
				contact_id: 'sample-value',
			},
		},
		output: {
			contact_id: 'sample-value',
			contact_type: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getModelsByKeysOfKind': {
		input: {
			path: {
				kind: 'sample-value',
			},
			query: {},
		},
		output: [],
	},
	'powerdialer.deleteModelsByKeysOfKind': {
		input: {
			path: {
				kind: 'sample-value',
			},
			query: {},
		},
	},
	'powerdialer.createCustomProperties': {
		input: {
			body: {
				properties: [],
			},
		},
		output: [],
	},
	'powerdialer.getCustomProperties': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getCustomProperty': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			name: 'sample-value',
		},
	},
	'powerdialer.updateCustomProperty': {
		input: {
			path: {
				id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			name: 'sample-value',
		},
	},
	'powerdialer.getDialpadOAuthService': {
		input: {
			path: {
				service: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			instance_url: 'sample-value',
			key: 'sample-value',
			service: 'salesforce',
		},
	},
	'powerdialer.updateGlobalSettings': {
		input: {
			path: {
				company_id: 1,
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteCustomProperty': {
		input: {
			path: {
				id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getGlobalSettings': {
		input: {
			path: {
				company_id: 1,
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getEventLogs': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getJobs': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getJob': {
		input: {
			path: {
				job_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			job_id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getApiKey': {
		input: {
			path: {
				key_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			type: 'base',
		},
	},
	'powerdialer.getApiKeys': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getOperator': {
		input: {
			query: {
				target_id: 'sample-value',
			},
		},
		output: [],
	},
	'powerdialer.getLogin': {
		input: {},
		output: {
			company: {
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
			},
			config: null,
			user: {
				id: 'sample-value',
				image_url: 'sample-value',
				key: 'sample-value',
				target_id: 'sample-value',
				target_type: 'user',
			},
		},
	},
	'powerdialer.deleteApiKey': {
		input: {
			path: {
				key_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.updateApiKey': {
		input: {
			path: {
				key_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			type: 'base',
		},
	},
	'powerdialer.postLogin': {
		input: {
			query: {},
		},
		output: {
			company: {
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
			},
			config: null,
			user: {
				id: 'sample-value',
				image_url: 'sample-value',
				key: 'sample-value',
				target_id: 'sample-value',
				target_type: 'user',
			},
		},
	},
	'powerdialer.createApiKey': {
		input: {
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			token_full: 'sample-value',
			type: 'base',
		},
	},
	'powerdialer.createServiceAccount': {
		input: {
			body: {
				name: 'sample-value',
			},
		},
		output: {
			id: 'sample-value',
			key: 'sample-value',
			name: 'sample-value',
		},
	},
	'powerdialer.getServiceAccount': {
		input: {
			path: {
				account_id: 'sample-value',
			},
		},
		output: {
			id: 'sample-value',
			key: 'sample-value',
			name: 'sample-value',
		},
	},
	'powerdialer.updateServiceAccount': {
		input: {
			path: {
				account_id: 'sample-value',
			},
			body: {},
		},
		output: {
			id: 'sample-value',
			key: 'sample-value',
			name: 'sample-value',
		},
	},
	'powerdialer.deleteServiceAccount': {
		input: {
			path: {
				account_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getSmsForTarget': {
		input: {
			query: {
				target_type: 'sample-value',
				target_id: 'sample-value',
			},
		},
		output: [],
	},
	'powerdialer.smsItem': {
		input: {
			body: {
				item_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			item_id: 'sample-value',
			key: 'sample-value',
			list_id: 'sample-value',
		},
	},
	'powerdialer.getServiceAccounts': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getCurrentUser': {
		input: {},
		output: {
			id: 'sample-value',
			image_url: 'sample-value',
			key: 'sample-value',
			target_id: 'sample-value',
			target_type: 'user',
		},
	},
	'powerdialer.getWorker': {
		input: {
			path: {
				worker_id: 'sample-value',
			},
		},
		output: {
			campaign_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			worker_id: 'sample-value',
		},
	},
	'powerdialer.updateWorker': {
		input: {
			path: {
				worker_id: 'sample-value',
			},
			body: {},
		},
		output: {
			campaign_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			worker_id: 'sample-value',
		},
	},
	'powerdialer.getWorkers': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.createAudience': {
		input: {
			body: {},
		},
		output: {
			audience_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getAudiences': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.updateAudience': {
		input: {
			path: {
				audience_id: 'sample-value',
			},
			body: {},
		},
		output: {
			audience_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getAudience': {
		input: {
			path: {
				audience_id: 'sample-value',
			},
		},
		output: {
			audience_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.createBot': {
		input: {
			body: {},
		},
		output: {
			bot_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.duplicateAudience': {
		input: {
			path: {
				audience_id: 'sample-value',
			},
		},
		output: {
			audience_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getBots': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.updateBot': {
		input: {
			path: {
				bot_id: 'sample-value',
			},
			body: {},
		},
		output: {
			bot_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteAudience': {
		input: {
			path: {
				audience_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.deleteBot': {
		input: {
			path: {
				bot_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getBot': {
		input: {
			path: {
				bot_id: 'sample-value',
			},
		},
		output: {
			bot_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getBotDialogs': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.createBotDialog': {
		input: {
			body: {
				bot_id: 'sample-value',
			},
		},
		output: {
			bot_dialog_id: 'sample-value',
			bot_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteBotDialog': {
		input: {
			path: {
				bot_dialog_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getBotMessages': {
		input: {
			query: {
				bot_dialog_id: 'sample-value',
			},
		},
		output: [],
	},
	'powerdialer.createBotMessage': {
		input: {
			body: {
				bot_dialog_id: 'sample-value',
			},
		},
		output: {
			bot_dialog_id: 'sample-value',
			bot_message_id: 'sample-value',
			company_id: 1,
			direction: 'in',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteBotMessage': {
		input: {
			path: {
				bot_message_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getBotMessage': {
		input: {
			path: {
				bot_message_id: 'sample-value',
			},
		},
		output: {
			bot_dialog_id: 'sample-value',
			bot_message_id: 'sample-value',
			company_id: 1,
			direction: 'in',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.updateBotDialog': {
		input: {
			path: {
				bot_dialog_id: 'sample-value',
			},
			body: {},
		},
		output: {
			bot_dialog_id: 'sample-value',
			bot_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getCampaigns': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.searchCampaigns': {
		input: {
			body: {},
		},
		output: [],
	},
	'powerdialer.deleteCampaign': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.createCampaign': {
		input: {
			body: {
				group_id: 1,
			},
		},
		output: {
			campaign_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getCampaign': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
		},
		output: {
			campaign_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.updateCampaign': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
			body: {},
		},
		output: {
			campaign_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.duplicateCampaign': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
		},
		output: {
			campaign_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getCampaignResultExportUrl': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
			query: {},
		},
		output: {
			url: 'sample-value',
		},
	},
	'powerdialer.createCampaignGroup': {
		input: {
			body: {
				group_id: 1,
			},
		},
		output: {
			campaign_group_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteCampaignGroup': {
		input: {
			path: {
				campaign_group_id: 'sample-value',
			},
		},
	},
	'powerdialer.getCampaignGroup': {
		input: {
			path: {
				campaign_group_id: 'sample-value',
			},
		},
		output: {
			campaign_group_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getCampaignGroups': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.startCampaignResultExport': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
			query: {},
		},
		output: {},
	},
	'powerdialer.getCampaignSettings': {
		input: {
			path: {
				campaign_settings_id: 'sample-value',
			},
		},
		output: {
			campaign_settings_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.updateCampaignGroup': {
		input: {
			path: {
				campaign_group_id: 'sample-value',
			},
			body: {},
		},
		output: {
			campaign_group_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.editCampaignSettings': {
		input: {
			path: {
				campaign_settings_id: 'sample-value',
			},
			body: {},
		},
		output: {
			campaign_settings_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteCsv': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getCsvPresignedUrl': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
		},
		output: {
			url: 'sample-value',
		},
	},
	'powerdialer.updateCsv': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			csv_id: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getVarsInfo': {
		input: {
			path: {
				campaign_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getCsv': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			csv_id: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getPhoneCsvs': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getCsvs': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getPhoneCsv': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			csv_id: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.updatePhoneCsv': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			csv_id: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deletePhoneCsv': {
		input: {
			path: {
				csv_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.createLeadList': {
		input: {
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			list_id: 'sample-value',
		},
	},
	'powerdialer.getBotDialog': {
		input: {
			path: {
				bot_dialog_id: 'sample-value',
			},
		},
		output: {
			bot_dialog_id: 'sample-value',
			bot_id: 'sample-value',
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getListItems': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.deleteLeadListItem': {
		input: {
			path: {
				item_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getListList': {
		input: {
			path: {
				list_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			list_id: 'sample-value',
		},
	},
	'powerdialer.getLeadListItem': {
		input: {
			path: {
				item_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			item_id: 'sample-value',
			key: 'sample-value',
			list_id: 'sample-value',
		},
	},
	'powerdialer.deleteLeadList': {
		input: {
			path: {
				list_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.duplicateLeadList': {
		input: {
			path: {
				list_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			list_id: 'sample-value',
		},
	},
	'powerdialer.getLeadLists': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.updateLeadList': {
		input: {
			path: {
				list_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			list_id: 'sample-value',
		},
	},
	'powerdialer.getListView': {
		input: {
			query: {
				types: 'sample-value',
			},
		},
		output: [],
	},
	'powerdialer.createStaticList': {
		input: {
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			static_list_id: 'sample-value',
		},
	},
	'powerdialer.getStaticLists': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getStaticList': {
		input: {
			path: {
				static_list_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			static_list_id: 'sample-value',
		},
	},
	'powerdialer.deleteStaticList': {
		input: {
			path: {
				static_list_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.duplicateStaticList': {
		input: {
			path: {
				static_list_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			static_list_id: 'sample-value',
		},
	},
	'powerdialer.createLeads': {
		input: {
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			lead_id: 'sample-value',
		},
	},
	'powerdialer.queryLeads': {
		input: {
			query: {},
			body: {
				field: 'sample-value',
				op: '=',
			},
		},
		output: [],
	},
	'powerdialer.getLead': {
		input: {
			path: {
				lead_id: 'sample-value',
			},
			query: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			lead_id: 'sample-value',
		},
	},
	'powerdialer.updateLead': {
		input: {
			path: {
				lead_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			lead_id: 'sample-value',
		},
	},
	'powerdialer.getLeadCompany': {
		input: {
			path: {
				lead_company_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			lead_company_id: 'sample-value',
		},
	},
	'powerdialer.getLeadCompanies': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.updateStaticList': {
		input: {
			path: {
				static_list_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			static_list_id: 'sample-value',
		},
	},
	'powerdialer.getLeads': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.startLeadExport': {
		input: {
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			lead_export_id: 'sample-value',
			request_user_id: 'sample-value',
		},
	},
	'powerdialer.getLeadListView': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.bulkUpdateLeadItems': {
		input: {
			body: {
				item_ids: [],
				state: 'cancelled',
			},
		},
		output: {
			skipped: [],
			successful_ids: [],
			summary: {
				successful_count: 1,
				total_processed: 1,
			},
		},
	},
	'powerdialer.getLeadItem': {
		input: {
			path: {
				item_id: 'sample-value',
			},
		},
		output: {
			item: {
				company_id: 1,
				id: 'sample-value',
				item_id: 'sample-value',
				key: 'sample-value',
				list_id: 'sample-value',
			},
			item_id: 'sample-value',
			last_call: {
				call_id: 1,
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
				state: 'preanswer',
			},
			lead: {
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
				lead_id: 'sample-value',
			},
		},
	},
	'powerdialer.getLeadItems': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.getLeadListViewById': {
		input: {
			path: {
				list_id: 'sample-value',
			},
			query: {},
		},
		output: {
			lead_list: {
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
				list_id: 'sample-value',
			},
		},
	},
	'powerdialer.getLeadExport': {
		input: {
			path: {
				export_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			lead_export_id: 'sample-value',
			request_user_id: 'sample-value',
		},
	},
	'powerdialer.createPhone': {
		input: {
			body: {},
		},
		output: {
			company_id: 1,
			e164: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getPhone': {
		input: {
			path: {
				e164: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			e164: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.updateLeadItem': {
		input: {
			path: {
				item_id: 'sample-value',
			},
			body: {},
		},
		output: {
			item: {
				company_id: 1,
				id: 'sample-value',
				item_id: 'sample-value',
				key: 'sample-value',
				list_id: 'sample-value',
			},
			item_id: 'sample-value',
			last_call: {
				call_id: 1,
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
				state: 'preanswer',
			},
			lead: {
				company_id: 1,
				id: 'sample-value',
				key: 'sample-value',
				lead_id: 'sample-value',
			},
		},
	},
	'powerdialer.deletePhone': {
		input: {
			path: {
				e164: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			e164: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getSalesforceObjectListViews': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.updatePhone': {
		input: {
			path: {
				e164: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			e164: 'sample-value',
			id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getSalesforceObjectFields': {
		input: {
			query: {
				sobject_type: 'sample-value',
			},
		},
		output: [],
	},
	'powerdialer.getSalesforceListViewById': {
		input: {
			path: {
				sfdc_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			listview_id: 'sample-value',
			name: 'sample-value',
			sobject_type: 'Lead',
		},
	},
	'powerdialer.createSalesforceListViewImport': {
		input: {
			query: {},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			import_id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getSalesforceListViewImports': {
		input: {
			query: {
				campaign_id: 'sample-value',
			},
		},
		output: [],
	},
	'powerdialer.getSalesforceObjectMappings': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.createSalesforceObjectMapping': {
		input: {
			query: {},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			object_mapping_id: 'sample-value',
		},
	},
	'powerdialer.updateSalesforceListViewImport': {
		input: {
			path: {
				import_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			import_id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.deleteSalesforceObjectMapping': {
		input: {
			path: {
				object_mapping_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.getSalesforceListViewImport': {
		input: {
			path: {
				import_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			import_id: 'sample-value',
			key: 'sample-value',
		},
	},
	'powerdialer.getSalesforceObjectMapping': {
		input: {
			path: {
				object_mapping_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			object_mapping_id: 'sample-value',
		},
	},
	'powerdialer.patchSalesforceListView': {
		input: {
			path: {
				sfdc_id: 'sample-value',
			},
			query: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			listview_id: 'sample-value',
			name: 'sample-value',
			sobject_type: 'Lead',
		},
	},
	'powerdialer.updateSalesforceObjectMapping': {
		input: {
			path: {
				object_mapping_id: 'sample-value',
			},
			body: {},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			object_mapping_id: 'sample-value',
		},
	},
	'powerdialer.getRules': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.createRule': {
		input: {
			body: {
				type: 'call',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			rule_id: 'sample-value',
			type: 'call',
		},
	},
	'powerdialer.getPhones': {
		input: {
			query: {},
		},
		output: [],
	},
	'powerdialer.deleteRule': {
		input: {
			path: {
				rule_id: 'sample-value',
			},
		},
		output: {},
	},
	'powerdialer.updateRule': {
		input: {
			path: {
				rule_id: 'sample-value',
			},
			body: {
				type: 'call',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			rule_id: 'sample-value',
			type: 'call',
		},
	},
	'powerdialer.getRule': {
		input: {
			path: {
				rule_id: 'sample-value',
			},
		},
		output: {
			company_id: 1,
			id: 'sample-value',
			key: 'sample-value',
			rule_id: 'sample-value',
			type: 'call',
		},
	},
	'reports.scheduledstats.download': {
		input: {
			query: {
				t: 'user_voiceline',
				d: '2024-06-01',
			},
		},
		output: {
			kind: 'binary',
			contentType: 'sample-value',
			base64: 'sample-value',
			sizeBytes: 1,
		},
	},
	'recordings.call.download': {
		input: { path: { recording_id: '6086754856781234' } },
		output: {
			kind: 'binary',
			contentType: 'audio/mpeg',
			base64: 'AQID',
			sizeBytes: 3,
		},
	},
	'recordings.voicemail.download': {
		input: { path: { recording_id: '6086754856787890' } },
		output: {
			kind: 'binary',
			contentType: 'audio/mpeg',
			base64: 'AQID',
			sizeBytes: 3,
		},
	},
	'recordings.admin_call.download': {
		input: { path: { share_link_id: 'share-link-123' } },
		output: {
			kind: 'binary',
			contentType: 'audio/mpeg',
			base64: 'AQID',
			sizeBytes: 3,
		},
	},
} as const;
export const DialpadOperationKeys = [
	'accesscontrolpolicies.assign',
	'accesscontrolpolicies.delete',
	'accesscontrolpolicies.update',
	'agentgroup.get',
	'anonymization.requests.get',
	'accesscontrolpolicies.list',
	'accesscontrolpolicies.unassign',
	'accesscontrolpolicies.create',
	'accesscontrolpolicies.assignments',
	'anonymization.contacts',
	'accesscontrolpolicies.get',
	'app_settings.get',
	'blockednumbers.get',
	'available_numbers.list',
	'blockednumbers.add',
	'blockednumbers.list',
	'blockednumbers.remove',
	'call.assign',
	'call.get_assigned_operators',
	'anonymization.callcontent',
	'call.get_ai_recap',
	'call.participants.add',
	'call.list',
	'call.initiate_ivr_call',
	'call.unassign_all_call_operators',
	'call.transfer_call',
	'call.get_call_info',
	'call.unassign_operator',
	'call.unpark',
	'call.initiate',
	'call.add_labels',
	'call.hangup',
	'callbacks.list',
	'callback.validate',
	'callcenters.listall',
	'callcenters.get',
	'callcenters.update',
	'callcenters.create',
	'callback.enqueue',
	'callcenters.delete',
	'callcenters.get_status',
	'callcenters.operators.update_duty_status',
	'callcenters.operators.get_skill_level',
	'callcenters.operators.get_duty_status',
	'callcenters.operators.update_skill_level',
	'callcenters.operators.add',
	'callcenters.queue.list',
	'callcenters.operators.delete',
	'call_labels.list',
	'call_review_share_link.get',
	'call_review_share_link.create',
	'call_review_share_link.delete',
	'callrouters.list',
	'callcenters.operators.list',
	'callrouters.delete',
	'callrouters.create',
	'callrouters.get',
	'call_review_share_link.update',
	'callrouters.update',
	'numbers.assign_call_router_number.post',
	'channels.delete',
	'channels.get',
	'channels.members.list',
	'channels.list',
	'coaching_team.get',
	'coaching_team.members.get',
	'channels.create',
	'channels.members.delete',
	'channels.members.add',
	'coaching_team.listall',
	'company.get',
	'company.sms_opt_out',
	'company.update_settings',
	'coaching_team.members.add',
	'company.get_ai_settings',
	'company.update',
	'company.update_ai_settings',
	'contacts.delete',
	'contacts.update',
	'contacts.list',
	'contacts.get',
	'contacts.create',
	'contacts.create_with_uid',
	'ivr.delete',
	'contacts.search',
	'ivr.assign',
	'custom_ivrs.list',
	'ivr.update_details',
	'departments.delete',
	'ivr.create',
	'departments.update',
	'departments.create',
	'departments.listall',
	'departments.get',
	'departments.operators.delete',
	'dispositions.delete',
	'digital.sessions.list',
	'dispositions.update',
	'dispositions.get',
	'departments.operators.list',
	'dispositions.list',
	'dispositions.create',
	'departments.operators.add',
	'faxline.assign',
	'bulk_messages.get',
	'fax.send',
	'bulk_messages.send',
	'scheduled_messages.create',
	'scheduled_messages.delete',
	'bulk_messages.update',
	'bulk_messages.list',
	'scheduled_messages.list',
	'numbers.unassign',
	'scheduled_messages.get',
	'numbers.assign',
	'scheduled_messages.send_now',
	'numbers.list',
	'numbers.auto_assign',
	'numbers.swap',
	'number_tags.update',
	'scheduled_messages.update',
	'numbers.get',
	'coaching_team.list',
	'office_plan.get',
	'phone_number.format',
	'departments.list',
	'numbers.office_unassign_number.post',
	'callcenters.list',
	'numbers.assign_office_number.post',
	'available_licenses.list',
	'offices.e911.get',
	'offices.offdutystatuses.get',
	'offices.e911.update',
	'offices.update',
	'offices.get',
	'offices.primary.get',
	'offices.list',
	'offices.operators.delete',
	'offices.create',
	'offices.operators.get',
	'offices.operators.post',
	'recording_share_link.create',
	'recording_share_link.get',
	'numbers.assign_room_number.post',
	'numbers.room_unassign_number.post',
	'rooms.delete',
	'rooms.get',
	'recording_share_link.delete',
	'rooms.post',
	'recording_share_link.update',
	'deskphones.rooms.create_international_pin',
	'rooms.list',
	'deskphones.rooms.get',
	'rooms.patch',
	'deskphones.rooms.list',
	'deskphones.rooms.delete',
	'schedule_reports.update',
	'schedule_reports.create',
	'schedule_reports.get',
	'scorecards.export.get',
	'scorecards.export.create',
	'scorecards.get',
	'scorecards.list',
	'schedule_reports.delete',
	'schedule_reports.list',
	'stats.export.create',
	'stats.export.get',
	'sms.send',
	'users.initiate_call',
	'users.toggle_call_vi',
	'userdevices.get',
	'transcripts.get',
	'userdevices.list',
	'users.toggle_call_recording',
	'transcripts.get_url',
	'users.set_caller_id',
	'deskphones.users.delete',
	'caller_id.users.get',
	'deskphones.users.get',
	'users.e911.update',
	'users.toggle_dnd',
	'users.unassign_number',
	'users.assign_number',
	'users.list_personas',
	'users.e911.get',
	'deskphones.users.list',
	'screen_pop.initiate',
	'users.delete',
	'users.get',
	'users.list',
	'users.update',
	'users.create',
	'users.move_office',
	'users.create_batch',
	'users.update_status',
	'search.users',
	'websockets.get',
	'websockets.list',
	'websockets.create',
	'meetings.conference-meetings.list',
	'meetings.conference-rooms.list',
	'websockets.update',
	'meetings.meetings.get',
	'websockets.delete',
	'meetings.meetings.update',
	'meetings.meetings.delete',
	'meetings.meetings.create',
	'meetings.meetings.room.create',
	'wfm.wfm-metrics-activity.get',
	'wfm.wfm-metrics-agent.get',
	'meetings.meetings.list',
	'powerdialer.getModelsByKeys',
	'powerdialer.getAblyToken',
	'powerdialer.getContact',
	'powerdialer.getModelsByKeysOfKind',
	'powerdialer.deleteModelsByKeysOfKind',
	'powerdialer.createCustomProperties',
	'powerdialer.getCustomProperties',
	'powerdialer.getCustomProperty',
	'powerdialer.updateCustomProperty',
	'powerdialer.getDialpadOAuthService',
	'powerdialer.updateGlobalSettings',
	'powerdialer.deleteCustomProperty',
	'powerdialer.getGlobalSettings',
	'powerdialer.getEventLogs',
	'powerdialer.getJobs',
	'powerdialer.getJob',
	'powerdialer.getApiKey',
	'powerdialer.getApiKeys',
	'powerdialer.getOperator',
	'powerdialer.getLogin',
	'powerdialer.deleteApiKey',
	'powerdialer.updateApiKey',
	'powerdialer.postLogin',
	'powerdialer.createApiKey',
	'powerdialer.createServiceAccount',
	'powerdialer.getServiceAccount',
	'powerdialer.updateServiceAccount',
	'powerdialer.deleteServiceAccount',
	'powerdialer.getSmsForTarget',
	'powerdialer.smsItem',
	'powerdialer.getServiceAccounts',
	'powerdialer.getCurrentUser',
	'powerdialer.getWorker',
	'powerdialer.updateWorker',
	'powerdialer.getWorkers',
	'powerdialer.createAudience',
	'powerdialer.getAudiences',
	'powerdialer.updateAudience',
	'powerdialer.getAudience',
	'powerdialer.createBot',
	'powerdialer.duplicateAudience',
	'powerdialer.getBots',
	'powerdialer.updateBot',
	'powerdialer.deleteAudience',
	'powerdialer.deleteBot',
	'powerdialer.getBot',
	'powerdialer.getBotDialogs',
	'powerdialer.createBotDialog',
	'powerdialer.deleteBotDialog',
	'powerdialer.getBotMessages',
	'powerdialer.createBotMessage',
	'powerdialer.deleteBotMessage',
	'powerdialer.getBotMessage',
	'powerdialer.updateBotDialog',
	'powerdialer.getCampaigns',
	'powerdialer.searchCampaigns',
	'powerdialer.deleteCampaign',
	'powerdialer.createCampaign',
	'powerdialer.getCampaign',
	'powerdialer.updateCampaign',
	'powerdialer.duplicateCampaign',
	'powerdialer.getCampaignResultExportUrl',
	'powerdialer.createCampaignGroup',
	'powerdialer.deleteCampaignGroup',
	'powerdialer.getCampaignGroup',
	'powerdialer.getCampaignGroups',
	'powerdialer.startCampaignResultExport',
	'powerdialer.getCampaignSettings',
	'powerdialer.updateCampaignGroup',
	'powerdialer.editCampaignSettings',
	'powerdialer.deleteCsv',
	'powerdialer.getCsvPresignedUrl',
	'powerdialer.updateCsv',
	'powerdialer.getVarsInfo',
	'powerdialer.getCsv',
	'powerdialer.getPhoneCsvs',
	'powerdialer.getCsvs',
	'powerdialer.getPhoneCsv',
	'powerdialer.updatePhoneCsv',
	'powerdialer.deletePhoneCsv',
	'powerdialer.createLeadList',
	'powerdialer.getBotDialog',
	'powerdialer.getListItems',
	'powerdialer.deleteLeadListItem',
	'powerdialer.getListList',
	'powerdialer.getLeadListItem',
	'powerdialer.deleteLeadList',
	'powerdialer.duplicateLeadList',
	'powerdialer.getLeadLists',
	'powerdialer.updateLeadList',
	'powerdialer.getListView',
	'powerdialer.createStaticList',
	'powerdialer.getStaticLists',
	'powerdialer.getStaticList',
	'powerdialer.deleteStaticList',
	'powerdialer.duplicateStaticList',
	'powerdialer.createLeads',
	'powerdialer.queryLeads',
	'powerdialer.getLead',
	'powerdialer.updateLead',
	'powerdialer.getLeadCompany',
	'powerdialer.getLeadCompanies',
	'powerdialer.updateStaticList',
	'powerdialer.getLeads',
	'powerdialer.startLeadExport',
	'powerdialer.getLeadListView',
	'powerdialer.bulkUpdateLeadItems',
	'powerdialer.getLeadItem',
	'powerdialer.getLeadItems',
	'powerdialer.getLeadListViewById',
	'powerdialer.getLeadExport',
	'powerdialer.createPhone',
	'powerdialer.getPhone',
	'powerdialer.updateLeadItem',
	'powerdialer.deletePhone',
	'powerdialer.getSalesforceObjectListViews',
	'powerdialer.updatePhone',
	'powerdialer.getSalesforceObjectFields',
	'powerdialer.getSalesforceListViewById',
	'powerdialer.createSalesforceListViewImport',
	'powerdialer.getSalesforceListViewImports',
	'powerdialer.getSalesforceObjectMappings',
	'powerdialer.createSalesforceObjectMapping',
	'powerdialer.updateSalesforceListViewImport',
	'powerdialer.deleteSalesforceObjectMapping',
	'powerdialer.getSalesforceListViewImport',
	'powerdialer.getSalesforceObjectMapping',
	'powerdialer.patchSalesforceListView',
	'powerdialer.updateSalesforceObjectMapping',
	'powerdialer.getRules',
	'powerdialer.createRule',
	'powerdialer.getPhones',
	'powerdialer.deleteRule',
	'powerdialer.updateRule',
	'powerdialer.getRule',
	'reports.scheduledstats.download',
	'recordings.call.download',
	'recordings.voicemail.download',
	'recordings.admin_call.download',
] as const;
