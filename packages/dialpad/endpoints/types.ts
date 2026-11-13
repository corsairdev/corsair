import { z } from 'zod';

// Dialpad's JSON encodes 64-bit integers (ids, millisecond timestamps, many counts) as decimal
// strings, so integer fields accept a number or a decimal string, in requests and responses alike.
function dialpadInteger(schema: z.ZodNumber) {
	return z.union([schema, z.string().regex(/^-?\d+$/)]);
}

const Input0 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum(['callcenter', 'company', 'department', 'office'])
					.nullable()
					.optional(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output0 = z
	.object({
		policy_targets: z
			.array(
				z
					.object({
						target_id: dialpadInteger(z.number().int()),
						target_type: z
							.enum(['callcenter', 'company', 'department', 'office'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		user: z
			.object({
				admin_office_ids: z
					.array(dialpadInteger(z.number().int()))
					.nullable()
					.optional(),
				company_id: dialpadInteger(z.number().int()).nullable().optional(),
				country: z.string().nullable().optional(),
				date_active: z.string().nullable().optional(),
				date_added: z.string().nullable().optional(),
				date_first_login: z.string().nullable().optional(),
				date_last_login: z.string().optional(),
				display_name: z.string().nullable().optional(),
				do_not_disturb: z.boolean().nullable().optional(),
				duty_status_reason: z.string().nullable().optional(),
				duty_status_started: z.string().nullable().optional(),
				emails: z.array(z.string()).nullable().optional(),
				extension: z.string().nullable().optional(),
				first_name: z.string().nullable().optional(),
				forwarding_numbers: z.array(z.string()).nullable().optional(),
				group_details: z
					.array(
						z
							.object({
								do_not_disturb: z.boolean().nullable().optional(),
								group_id: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								group_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'coachingteam',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.or(z.string())
									.nullable()
									.optional(),
								role: z
									.enum(['admin', 'operator', 'supervisor'])
									.or(z.string())
									.nullable()
									.optional(),
							})
							.loose(),
					)
					.nullable()
					.optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				image_url: z.string().nullable().optional(),
				international_dialing_enabled: z.boolean().nullable().optional(),
				is_admin: z.boolean().nullable().optional(),
				is_available: z.boolean().nullable().optional(),
				is_company_admin: z.boolean().nullable().optional(),
				is_on_duty: z.boolean().nullable().optional(),
				is_online: z.boolean().nullable().optional(),
				is_super_admin: z.boolean().nullable().optional(),
				job_title: z.string().nullable().optional(),
				language: z.string().nullable().optional(),
				last_name: z.string().nullable().optional(),
				license: z
					.enum([
						'admins',
						'agents',
						'dpde_all',
						'dpde_one',
						'lite_lines',
						'lite_support_agents',
						'magenta_lines',
						'talk',
						'user',
					])
					.or(z.string())
					.nullable()
					.optional(),
				location: z.string().nullable().optional(),
				muted: z.boolean().nullable().optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				on_duty_started: z.string().nullable().optional(),
				on_duty_status: z
					.enum([
						'available',
						'busy',
						'occupied',
						'occupied-end',
						'unavailable',
						'wrapup',
						'wrapup-end',
					])
					.or(z.string())
					.nullable()
					.optional(),
				onboarding_completed: z.boolean(),
				phone_numbers: z.array(z.string()).nullable().optional(),
				remote_service: z.string().nullable().optional(),
				session_type: z
					.enum(['call', 'digital'])
					.or(z.string())
					.nullable()
					.optional(),
				state: z
					.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
					.or(z.string())
					.nullable()
					.optional(),
				status_message: z.string().nullable().optional(),
				timezone: z.string().nullable().optional(),
				voicemail: z
					.object({
						is_default_voicemail: z.boolean().optional(),
						name: z.string().nullable().optional(),
						voicemail_notifications_enabled: z.boolean().optional(),
					})
					.loose(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input1 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output1 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: z.string().nullable().optional(),
		date_updated: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()),
		name: z.string(),
		owner_id: dialpadInteger(z.number().int()),
		permission_sets: z
			.array(
				z
					.enum([
						'agent_settings_read',
						'agent_settings_write',
						'agents_admins_manage_agents_settings_read',
						'agents_admins_manage_agents_settings_write',
						'agents_admins_skill_level_read',
						'agents_admins_skill_level_write',
						'auto_call_recording_and_transcription_settings_read',
						'auto_call_recording_and_transcription_settings_write',
						'business_hours_read',
						'business_hours_write',
						'call_blocking_spam_prevention_settings_read',
						'call_blocking_spam_prevention_settings_write',
						'call_dispositions_settings_read',
						'call_dispositions_settings_write',
						'call_routing_hours_settings_read',
						'call_routing_hours_settings_write',
						'cc_call_settings_read',
						'cc_call_settings_write',
						'chrome_extension_compliance_settings_read',
						'chrome_extension_compliance_settings_write',
						'csat_surveys_read',
						'csat_surveys_write',
						'dashboard_and_alerts_read',
						'dashboard_and_alerts_write',
						'dialpad_ai_settings_read',
						'dialpad_ai_settings_write',
						'holiday_hours_settings_read',
						'holiday_hours_settings_write',
						'integrations_settings_read',
						'integrations_settings_write',
						'name_language_description_settings_read',
						'name_language_description_settings_write',
						'number_settings_read',
						'number_settings_write',
						'supervisor_settings_read',
						'supervisor_settings_write',
					])
					.or(z.string()),
			)
			.nullable(),
		state: z.enum(['active', 'deleted']).or(z.string()),
		target_type: z
			.enum(['callcenter', 'company', 'department', 'office'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input2 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				description: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				permission_sets: z
					.array(
						z.enum([
							'agent_settings_write',
							'agents_admins_manage_agents_settings_write',
							'agents_admins_skill_level_write',
							'auto_call_recording_and_transcription_settings_write',
							'business_hours_write',
							'call_blocking_spam_prevention_settings_write',
							'call_dispositions_settings_write',
							'call_routing_hours_settings_write',
							'cc_call_settings_write',
							'chrome_extension_compliance_settings_write',
							'csat_surveys_write',
							'dashboard_and_alerts_write',
							'dialpad_ai_settings_write',
							'holiday_hours_settings_write',
							'integrations_settings_write',
							'name_language_description_settings_write',
							'number_settings_write',
							'supervisor_settings_write',
						]),
					)
					.nullable()
					.optional(),
				state: z.enum(['active']).nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output2 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: z.string().nullable().optional(),
		date_updated: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()),
		name: z.string(),
		owner_id: dialpadInteger(z.number().int()),
		permission_sets: z
			.array(
				z
					.enum([
						'agent_settings_read',
						'agent_settings_write',
						'agents_admins_manage_agents_settings_read',
						'agents_admins_manage_agents_settings_write',
						'agents_admins_skill_level_read',
						'agents_admins_skill_level_write',
						'auto_call_recording_and_transcription_settings_read',
						'auto_call_recording_and_transcription_settings_write',
						'business_hours_read',
						'business_hours_write',
						'call_blocking_spam_prevention_settings_read',
						'call_blocking_spam_prevention_settings_write',
						'call_dispositions_settings_read',
						'call_dispositions_settings_write',
						'call_routing_hours_settings_read',
						'call_routing_hours_settings_write',
						'cc_call_settings_read',
						'cc_call_settings_write',
						'chrome_extension_compliance_settings_read',
						'chrome_extension_compliance_settings_write',
						'csat_surveys_read',
						'csat_surveys_write',
						'dashboard_and_alerts_read',
						'dashboard_and_alerts_write',
						'dialpad_ai_settings_read',
						'dialpad_ai_settings_write',
						'holiday_hours_settings_read',
						'holiday_hours_settings_write',
						'integrations_settings_read',
						'integrations_settings_write',
						'name_language_description_settings_read',
						'name_language_description_settings_write',
						'number_settings_read',
						'number_settings_write',
						'supervisor_settings_read',
						'supervisor_settings_write',
					])
					.or(z.string()),
			)
			.nullable(),
		state: z.enum(['active', 'deleted']).or(z.string()),
		target_type: z
			.enum(['callcenter', 'company', 'department', 'office'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input3 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output3 = z
	.object({
		created_at: dialpadInteger(z.number().int()),
		group_description: z.string().optional(),
		id: z.string(),
		name: z.string(),
		office_id: z.string(),
		updated_at: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input4 = z
	.object({
		path: z
			.object({
				request_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output4 = z
	.object({
		completed_count: dialpadInteger(z.number().int()),
		date_completed: z.string().nullable().optional(),
		date_created: z.string(),
		failed_count: dialpadInteger(z.number().int()),
		request_id: z.string(),
		status: z.string(),
		total: dialpadInteger(z.number().int()),
	})
	.loose();

const Input5 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output5 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						company_id: dialpadInteger(z.number().int()),
						date_created: z.string().nullable().optional(),
						date_updated: z.string().nullable().optional(),
						description: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()),
						name: z.string(),
						owner_id: dialpadInteger(z.number().int()),
						permission_sets: z
							.array(
								z
									.enum([
										'agent_settings_read',
										'agent_settings_write',
										'agents_admins_manage_agents_settings_read',
										'agents_admins_manage_agents_settings_write',
										'agents_admins_skill_level_read',
										'agents_admins_skill_level_write',
										'auto_call_recording_and_transcription_settings_read',
										'auto_call_recording_and_transcription_settings_write',
										'business_hours_read',
										'business_hours_write',
										'call_blocking_spam_prevention_settings_read',
										'call_blocking_spam_prevention_settings_write',
										'call_dispositions_settings_read',
										'call_dispositions_settings_write',
										'call_routing_hours_settings_read',
										'call_routing_hours_settings_write',
										'cc_call_settings_read',
										'cc_call_settings_write',
										'chrome_extension_compliance_settings_read',
										'chrome_extension_compliance_settings_write',
										'csat_surveys_read',
										'csat_surveys_write',
										'dashboard_and_alerts_read',
										'dashboard_and_alerts_write',
										'dialpad_ai_settings_read',
										'dialpad_ai_settings_write',
										'holiday_hours_settings_read',
										'holiday_hours_settings_write',
										'integrations_settings_read',
										'integrations_settings_write',
										'name_language_description_settings_read',
										'name_language_description_settings_write',
										'number_settings_read',
										'number_settings_write',
										'supervisor_settings_read',
										'supervisor_settings_write',
									])
									.or(z.string()),
							)
							.nullable(),
						state: z.enum(['active', 'deleted']).or(z.string()),
						target_type: z
							.enum(['callcenter', 'company', 'department', 'office'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input6 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum(['callcenter', 'company', 'department', 'office'])
					.nullable()
					.optional(),
				unassign_all: z.boolean().nullable().optional(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output6 = z
	.object({
		policy_targets: z
			.array(
				z
					.object({
						target_id: dialpadInteger(z.number().int()),
						target_type: z
							.enum(['callcenter', 'company', 'department', 'office'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		user: z
			.object({
				admin_office_ids: z
					.array(dialpadInteger(z.number().int()))
					.nullable()
					.optional(),
				company_id: dialpadInteger(z.number().int()).nullable().optional(),
				country: z.string().nullable().optional(),
				date_active: z.string().nullable().optional(),
				date_added: z.string().nullable().optional(),
				date_first_login: z.string().nullable().optional(),
				date_last_login: z.string().optional(),
				display_name: z.string().nullable().optional(),
				do_not_disturb: z.boolean().nullable().optional(),
				duty_status_reason: z.string().nullable().optional(),
				duty_status_started: z.string().nullable().optional(),
				emails: z.array(z.string()).nullable().optional(),
				extension: z.string().nullable().optional(),
				first_name: z.string().nullable().optional(),
				forwarding_numbers: z.array(z.string()).nullable().optional(),
				group_details: z
					.array(
						z
							.object({
								do_not_disturb: z.boolean().nullable().optional(),
								group_id: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								group_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'coachingteam',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.or(z.string())
									.nullable()
									.optional(),
								role: z
									.enum(['admin', 'operator', 'supervisor'])
									.or(z.string())
									.nullable()
									.optional(),
							})
							.loose(),
					)
					.nullable()
					.optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				image_url: z.string().nullable().optional(),
				international_dialing_enabled: z.boolean().nullable().optional(),
				is_admin: z.boolean().nullable().optional(),
				is_available: z.boolean().nullable().optional(),
				is_company_admin: z.boolean().nullable().optional(),
				is_on_duty: z.boolean().nullable().optional(),
				is_online: z.boolean().nullable().optional(),
				is_super_admin: z.boolean().nullable().optional(),
				job_title: z.string().nullable().optional(),
				language: z.string().nullable().optional(),
				last_name: z.string().nullable().optional(),
				license: z
					.enum([
						'admins',
						'agents',
						'dpde_all',
						'dpde_one',
						'lite_lines',
						'lite_support_agents',
						'magenta_lines',
						'talk',
						'user',
					])
					.or(z.string())
					.nullable()
					.optional(),
				location: z.string().nullable().optional(),
				muted: z.boolean().nullable().optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				on_duty_started: z.string().nullable().optional(),
				on_duty_status: z
					.enum([
						'available',
						'busy',
						'occupied',
						'occupied-end',
						'unavailable',
						'wrapup',
						'wrapup-end',
					])
					.or(z.string())
					.nullable()
					.optional(),
				onboarding_completed: z.boolean(),
				phone_numbers: z.array(z.string()).nullable().optional(),
				remote_service: z.string().nullable().optional(),
				session_type: z
					.enum(['call', 'digital'])
					.or(z.string())
					.nullable()
					.optional(),
				state: z
					.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
					.or(z.string())
					.nullable()
					.optional(),
				status_message: z.string().nullable().optional(),
				timezone: z.string().nullable().optional(),
				voicemail: z
					.object({
						is_default_voicemail: z.boolean().optional(),
						name: z.string().nullable().optional(),
						voicemail_notifications_enabled: z.boolean().optional(),
					})
					.loose(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input7 = z
	.object({
		body: z
			.object({
				description: z.string().nullable().optional(),
				name: z.string(),
				owner_id: dialpadInteger(z.number().int()),
				permission_sets: z
					.array(
						z.enum([
							'agent_settings_write',
							'agents_admins_manage_agents_settings_write',
							'agents_admins_skill_level_write',
							'auto_call_recording_and_transcription_settings_write',
							'business_hours_write',
							'call_blocking_spam_prevention_settings_write',
							'call_dispositions_settings_write',
							'call_routing_hours_settings_write',
							'cc_call_settings_write',
							'chrome_extension_compliance_settings_write',
							'csat_surveys_write',
							'dashboard_and_alerts_write',
							'dialpad_ai_settings_write',
							'holiday_hours_settings_write',
							'integrations_settings_write',
							'name_language_description_settings_write',
							'number_settings_write',
							'supervisor_settings_write',
						]),
					)
					.nullable(),
				target_type: z
					.enum(['callcenter', 'company', 'department', 'office'])
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output7 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: z.string().nullable().optional(),
		date_updated: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()),
		name: z.string(),
		owner_id: dialpadInteger(z.number().int()),
		permission_sets: z
			.array(
				z
					.enum([
						'agent_settings_read',
						'agent_settings_write',
						'agents_admins_manage_agents_settings_read',
						'agents_admins_manage_agents_settings_write',
						'agents_admins_skill_level_read',
						'agents_admins_skill_level_write',
						'auto_call_recording_and_transcription_settings_read',
						'auto_call_recording_and_transcription_settings_write',
						'business_hours_read',
						'business_hours_write',
						'call_blocking_spam_prevention_settings_read',
						'call_blocking_spam_prevention_settings_write',
						'call_dispositions_settings_read',
						'call_dispositions_settings_write',
						'call_routing_hours_settings_read',
						'call_routing_hours_settings_write',
						'cc_call_settings_read',
						'cc_call_settings_write',
						'chrome_extension_compliance_settings_read',
						'chrome_extension_compliance_settings_write',
						'csat_surveys_read',
						'csat_surveys_write',
						'dashboard_and_alerts_read',
						'dashboard_and_alerts_write',
						'dialpad_ai_settings_read',
						'dialpad_ai_settings_write',
						'holiday_hours_settings_read',
						'holiday_hours_settings_write',
						'integrations_settings_read',
						'integrations_settings_write',
						'name_language_description_settings_read',
						'name_language_description_settings_write',
						'number_settings_read',
						'number_settings_write',
						'supervisor_settings_read',
						'supervisor_settings_write',
					])
					.or(z.string()),
			)
			.nullable(),
		state: z.enum(['active', 'deleted']).or(z.string()),
		target_type: z
			.enum(['callcenter', 'company', 'department', 'office'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input8 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output8 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						policy_targets: z
							.array(
								z
									.object({
										target_id: dialpadInteger(z.number().int()),
										target_type: z
											.enum(['callcenter', 'company', 'department', 'office'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						user: z
							.object({
								admin_office_ids: z
									.array(dialpadInteger(z.number().int()))
									.nullable()
									.optional(),
								company_id: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								country: z.string().nullable().optional(),
								date_active: z.string().nullable().optional(),
								date_added: z.string().nullable().optional(),
								date_first_login: z.string().nullable().optional(),
								date_last_login: z.string().optional(),
								display_name: z.string().nullable().optional(),
								do_not_disturb: z.boolean().nullable().optional(),
								duty_status_reason: z.string().nullable().optional(),
								duty_status_started: z.string().nullable().optional(),
								emails: z.array(z.string()).nullable().optional(),
								extension: z.string().nullable().optional(),
								first_name: z.string().nullable().optional(),
								forwarding_numbers: z.array(z.string()).nullable().optional(),
								group_details: z
									.array(
										z
											.object({
												do_not_disturb: z.boolean().nullable().optional(),
												group_id: dialpadInteger(z.number().int())
													.nullable()
													.optional(),
												group_type: z
													.enum([
														'callcenter',
														'callrouter',
														'channel',
														'coachinggroup',
														'coachingteam',
														'department',
														'office',
														'room',
														'staffgroup',
														'unknown',
														'user',
													])
													.or(z.string())
													.nullable()
													.optional(),
												role: z
													.enum(['admin', 'operator', 'supervisor'])
													.or(z.string())
													.nullable()
													.optional(),
											})
											.loose(),
									)
									.nullable()
									.optional(),
								id: dialpadInteger(z.number().int()).nullable().optional(),
								image_url: z.string().nullable().optional(),
								international_dialing_enabled: z
									.boolean()
									.nullable()
									.optional(),
								is_admin: z.boolean().nullable().optional(),
								is_available: z.boolean().nullable().optional(),
								is_company_admin: z.boolean().nullable().optional(),
								is_on_duty: z.boolean().nullable().optional(),
								is_online: z.boolean().nullable().optional(),
								is_super_admin: z.boolean().nullable().optional(),
								job_title: z.string().nullable().optional(),
								language: z.string().nullable().optional(),
								last_name: z.string().nullable().optional(),
								license: z
									.enum([
										'admins',
										'agents',
										'dpde_all',
										'dpde_one',
										'lite_lines',
										'lite_support_agents',
										'magenta_lines',
										'talk',
										'user',
									])
									.or(z.string())
									.nullable()
									.optional(),
								location: z.string().nullable().optional(),
								muted: z.boolean().nullable().optional(),
								office_id: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								on_duty_started: z.string().nullable().optional(),
								on_duty_status: z
									.enum([
										'available',
										'busy',
										'occupied',
										'occupied-end',
										'unavailable',
										'wrapup',
										'wrapup-end',
									])
									.or(z.string())
									.nullable()
									.optional(),
								onboarding_completed: z.boolean(),
								phone_numbers: z.array(z.string()).nullable().optional(),
								remote_service: z.string().nullable().optional(),
								session_type: z
									.enum(['call', 'digital'])
									.or(z.string())
									.nullable()
									.optional(),
								state: z
									.enum([
										'active',
										'cancelled',
										'deleted',
										'pending',
										'suspended',
									])
									.or(z.string())
									.nullable()
									.optional(),
								status_message: z.string().nullable().optional(),
								timezone: z.string().nullable().optional(),
								voicemail: z
									.object({
										is_default_voicemail: z.boolean().optional(),
										name: z.string().nullable().optional(),
										voicemail_notifications_enabled: z.boolean().optional(),
									})
									.loose(),
							})
							.loose()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input9 = z
	.object({
		body: z
			.object({
				contact_keys: z.array(z.string()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output9 = z
	.object({
		completed_count: dialpadInteger(z.number().int()),
		date_completed: z.string().nullable().optional(),
		date_created: z.string(),
		failed_count: dialpadInteger(z.number().int()),
		request_id: z.string(),
		status: z.string(),
		total: dialpadInteger(z.number().int()),
	})
	.loose();

const Input10 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output10 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: z.string().nullable().optional(),
		date_updated: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()),
		name: z.string(),
		owner_id: dialpadInteger(z.number().int()),
		permission_sets: z
			.array(
				z
					.enum([
						'agent_settings_read',
						'agent_settings_write',
						'agents_admins_manage_agents_settings_read',
						'agents_admins_manage_agents_settings_write',
						'agents_admins_skill_level_read',
						'agents_admins_skill_level_write',
						'auto_call_recording_and_transcription_settings_read',
						'auto_call_recording_and_transcription_settings_write',
						'business_hours_read',
						'business_hours_write',
						'call_blocking_spam_prevention_settings_read',
						'call_blocking_spam_prevention_settings_write',
						'call_dispositions_settings_read',
						'call_dispositions_settings_write',
						'call_routing_hours_settings_read',
						'call_routing_hours_settings_write',
						'cc_call_settings_read',
						'cc_call_settings_write',
						'chrome_extension_compliance_settings_read',
						'chrome_extension_compliance_settings_write',
						'csat_surveys_read',
						'csat_surveys_write',
						'dashboard_and_alerts_read',
						'dashboard_and_alerts_write',
						'dialpad_ai_settings_read',
						'dialpad_ai_settings_write',
						'holiday_hours_settings_read',
						'holiday_hours_settings_write',
						'integrations_settings_read',
						'integrations_settings_write',
						'name_language_description_settings_read',
						'name_language_description_settings_write',
						'number_settings_read',
						'number_settings_write',
						'supervisor_settings_read',
						'supervisor_settings_write',
					])
					.or(z.string()),
			)
			.nullable(),
		state: z.enum(['active', 'deleted']).or(z.string()),
		target_type: z
			.enum(['callcenter', 'company', 'department', 'office'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input11 = z
	.object({
		query: z
			.object({
				target_id: dialpadInteger(z.number().int()).optional(),
				target_type: z
					.enum([
						'callcenter',
						'callrouter',
						'channel',
						'coachinggroup',
						'coachingteam',
						'department',
						'office',
						'room',
						'staffgroup',
						'unknown',
						'user',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output11 = z
	.object({
		enabled: z.boolean().nullable().optional(),
		is_preferred_service: z.boolean().nullable().optional(),
		// unknown values are required because Dialpad documents this settings map as provider-defined.
		settings: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();

const Input12 = z
	.object({
		path: z
			.object({
				number: z.string(),
			})
			.strict(),
	})
	.strict();

const Output12 = z
	.object({
		number: z.string().nullable().optional(),
	})
	.loose();

const Input13 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				query: z.string().optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				type: z.enum(['local', 'tollfree']).optional(),
				country_fallback: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output13 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						display_number: z.string().nullable().optional(),
						number: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		overlaying_area_codes: z.array(z.string()).nullable().optional(),
		search_extended_to_country: z.boolean().nullable().optional(),
	})
	.loose();

const Input14 = z
	.object({
		body: z
			.object({
				numbers: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output14 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input15 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output15 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						number: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input16 = z
	.object({
		body: z
			.object({
				numbers: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output16 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input17 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				operator_ids: z.array(dialpadInteger(z.number().int())).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output17 = z
	.object({
		assigned_operators: z
			.object({
				count: dialpadInteger(z.number().int()).nullable().optional(),
				operator_ids: z
					.array(dialpadInteger(z.number().int()))
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		operators: z
			.array(
				z
					.object({
						code: dialpadInteger(z.number().int()).nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						message: z.string().nullable().optional(),
						status: z
							.enum(['error', 'success'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		status: z.enum(['error', 'success']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input18 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output18 = z
	.object({
		call_id: dialpadInteger(z.number().int()),
		count: dialpadInteger(z.number().int()).nullable().optional(),
		operator_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
	})
	.loose();

const Input19 = z
	.object({
		body: z
			.object({
				call_ids: z.array(dialpadInteger(z.number().int())),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output19 = z
	.object({
		completed_count: dialpadInteger(z.number().int()),
		date_completed: z.string().nullable().optional(),
		date_created: z.string(),
		failed_count: dialpadInteger(z.number().int()),
		request_id: z.string(),
		status: z.string(),
		total: dialpadInteger(z.number().int()),
	})
	.loose();

const Input20 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				summary_format: z
					.enum(['bullet', 'long', 'medium', 'short'])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output20 = z
	.object({
		action_items: z
			.array(
				z
					.object({
						content: z.string().nullable().optional(),
						edited: z.boolean().nullable().optional(),
						format: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						target_short_key: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		call_id: z.string().nullable().optional(),
		date_created: dialpadInteger(z.number().int()).nullable().optional(),
		date_modified: dialpadInteger(z.number().int()).nullable().optional(),
		disposition: z
			.object({
				content: z.string().nullable().optional(),
				edited: z.boolean().nullable().optional(),
				format: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				target_short_key: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		is_internal_call: z.boolean().nullable().optional(),
		purposes: z
			.array(
				z
					.object({
						category: z.string().nullable().optional(),
						content: z.string().nullable().optional(),
						edited: z.boolean().nullable().optional(),
						format: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						target_short_key: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		source: z.string().nullable().optional(),
		summary: z
			.object({
				content: z.string().nullable().optional(),
				date_text_last_edited: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				edited: z.boolean().nullable().optional(),
				format: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				null_summary: z.boolean().nullable().optional(),
				target_short_key: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input21 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				participant: z.union([
					z
						.object({
							number: z.string(),
						})
						.strict(),
					z
						.object({
							target_id: dialpadInteger(z.number().int()),
							target_type: z.enum([
								'callcenter',
								'department',
								'office',
								'user',
							]),
						})
						.strict(),
				]),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output21 = z
	.object({
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input22 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				include_anonymized: z.boolean().optional(),
				started_after: dialpadInteger(z.number().int()).optional(),
				started_before: dialpadInteger(z.number().int()).optional(),
				target_id: dialpadInteger(z.number().int()).optional(),
				target_type: z
					.enum([
						'callcenter',
						'callrouter',
						'channel',
						'coachinggroup',
						'coachingteam',
						'department',
						'office',
						'room',
						'staffgroup',
						'unknown',
						'user',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output22 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						admin_call_recording_share_links: z
							.array(z.string())
							.nullable()
							.optional(),
						call_id: dialpadInteger(z.number().int()).nullable().optional(),
						call_recording_share_links: z
							.array(z.string())
							.nullable()
							.optional(),
						contact: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						csat_recording_urls: z.array(z.string()).nullable().optional(),
						csat_score: z.string().nullable().optional(),
						csat_transcriptions: z.array(z.string()).nullable().optional(),
						custom_data: z.string().nullable().optional(),
						date_connected: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						date_ended: dialpadInteger(z.number().int()).nullable().optional(),
						date_rang: dialpadInteger(z.number().int()).nullable().optional(),
						date_started: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						direction: z.string().nullable().optional(),
						duration: z.number().nullable().optional(),
						entry_point_call_id: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						entry_point_target: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						event_timestamp: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						external_number: z.string().nullable().optional(),
						group_id: z.string().nullable().optional(),
						internal_number: z.string().nullable().optional(),
						is_transferred: z.boolean().nullable().optional(),
						labels: z.array(z.string()).nullable().optional(),
						master_call_id: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						mos_score: z.number().nullable().optional(),
						operator_call_id: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						proxy_target: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						recording_details: z
							.array(
								z
									.object({
										duration: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										id: z.string().nullable().optional(),
										recording_type: z
											.enum([
												'admincallrecording',
												'callrecording',
												'voicemail',
											])
											.or(z.string())
											.nullable()
											.optional(),
										start_time: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										url: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						routing_breadcrumbs: z
							.array(
								z
									.object({
										breadcrumb_type: z
											.enum(['callrouter', 'external_api'])
											.or(z.string())
											.nullable()
											.optional(),
										date: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										request: z.object({}).loose().nullable().optional(),
										response: z.object({}).loose().nullable().optional(),
										target_id: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										target_type: z.string().nullable().optional(),
										url: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						screen_recording_urls: z.array(z.string()).nullable().optional(),
						state: z.string().nullable().optional(),
						target: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						total_duration: z.number().nullable().optional(),
						transcription_text: z.string().nullable().optional(),
						voicemail_link: z.string().nullable().optional(),
						voicemail_recording_id: z.string().nullable().optional(),
						voicemail_share_link: z.string().nullable().optional(),
						was_recorded: z.boolean().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input23 = z
	.object({
		body: z
			.object({
				custom_data: z.string().nullable().optional(),
				outbound_caller_id: z.string().nullable().optional(),
				phone_number: z.string(),
				target_id: dialpadInteger(z.number().int()),
				target_type: z.enum(['callcenter', 'department', 'office']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output23 = z
	.object({
		call_id: dialpadInteger(z.number().int()),
	})
	.loose();

const Input24 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output24 = z
	.object({
		call_id: dialpadInteger(z.number().int()),
		count: dialpadInteger(z.number().int()).nullable().optional(),
		operator_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
	})
	.loose();

const Input25 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				custom_data: z.string().nullable().optional(),
				to: z
					.union([
						z
							.object({
								operator_id: dialpadInteger(z.number().int()),
								target_id: dialpadInteger(z.number().int()),
							})
							.strict(),
						z
							.object({
								call_id: dialpadInteger(z.number().int()),
							})
							.strict(),
						z
							.object({
								number: z.string(),
							})
							.strict(),
						z
							.object({
								target_id: dialpadInteger(z.number().int()),
								target_type: z.enum([
									'callcenter',
									'department',
									'office',
									'user',
								]),
							})
							.strict(),
					])
					.optional(),
				transfer_state: z
					.enum(['hold', 'parked', 'preanswer', 'voicemail'])
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output25 = z
	.object({
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		transferred_to_number: z.string().nullable().optional(),
		transferred_to_state: z
			.enum(['hold', 'parked', 'preanswer', 'voicemail'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input26 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output26 = z
	.object({
		admin_call_recording_share_links: z.array(z.string()).nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		call_recording_share_links: z.array(z.string()).nullable().optional(),
		contact: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		csat_recording_urls: z.array(z.string()).nullable().optional(),
		csat_score: z.string().nullable().optional(),
		csat_transcriptions: z.array(z.string()).nullable().optional(),
		custom_data: z.string().nullable().optional(),
		date_connected: dialpadInteger(z.number().int()).nullable().optional(),
		date_ended: dialpadInteger(z.number().int()).nullable().optional(),
		date_rang: dialpadInteger(z.number().int()).nullable().optional(),
		date_started: dialpadInteger(z.number().int()).nullable().optional(),
		direction: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		entry_point_call_id: dialpadInteger(z.number().int()).nullable().optional(),
		entry_point_target: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		event_timestamp: dialpadInteger(z.number().int()).nullable().optional(),
		external_number: z.string().nullable().optional(),
		group_id: z.string().nullable().optional(),
		internal_number: z.string().nullable().optional(),
		is_transferred: z.boolean().nullable().optional(),
		labels: z.array(z.string()).nullable().optional(),
		master_call_id: dialpadInteger(z.number().int()).nullable().optional(),
		mos_score: z.number().nullable().optional(),
		operator_call_id: dialpadInteger(z.number().int()).nullable().optional(),
		proxy_target: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		recording_details: z
			.array(
				z
					.object({
						duration: dialpadInteger(z.number().int()).nullable().optional(),
						id: z.string().nullable().optional(),
						recording_type: z
							.enum(['admincallrecording', 'callrecording', 'voicemail'])
							.or(z.string())
							.nullable()
							.optional(),
						start_time: dialpadInteger(z.number().int()).nullable().optional(),
						url: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		routing_breadcrumbs: z
			.array(
				z
					.object({
						breadcrumb_type: z
							.enum(['callrouter', 'external_api'])
							.or(z.string())
							.nullable()
							.optional(),
						date: dialpadInteger(z.number().int()).nullable().optional(),
						request: z.object({}).loose().nullable().optional(),
						response: z.object({}).loose().nullable().optional(),
						target_id: dialpadInteger(z.number().int()).nullable().optional(),
						target_type: z.string().nullable().optional(),
						url: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		screen_recording_urls: z.array(z.string()).nullable().optional(),
		state: z.string().nullable().optional(),
		target: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		total_duration: z.number().nullable().optional(),
		transcription_text: z.string().nullable().optional(),
		voicemail_link: z.string().nullable().optional(),
		voicemail_recording_id: z.string().nullable().optional(),
		voicemail_share_link: z.string().nullable().optional(),
		was_recorded: z.boolean().nullable().optional(),
	})
	.loose();

const Input27 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				operator_ids: z.array(dialpadInteger(z.number().int())).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output27 = z
	.object({
		assigned_operators: z
			.object({
				count: dialpadInteger(z.number().int()).nullable().optional(),
				operator_ids: z
					.array(dialpadInteger(z.number().int()))
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		operators: z
			.array(
				z
					.object({
						code: dialpadInteger(z.number().int()).nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						message: z.string().nullable().optional(),
						status: z
							.enum(['error', 'success'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		status: z.enum(['error', 'success']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input28 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output28 = z
	.object({
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input29 = z
	.object({
		body: z
			.object({
				custom_data: z.string().nullable().optional(),
				device_id: z.string().nullable().optional(),
				group_id: dialpadInteger(z.number().int()).nullable().optional(),
				group_type: z
					.enum(['callcenter', 'department', 'office'])
					.nullable()
					.optional(),
				is_consult: z.boolean().optional(),
				outbound_caller_id: z.string().nullable().optional(),
				phone_number: z.string(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output29 = z
	.object({
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input30 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				labels: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output30 = z
	.object({
		admin_call_recording_share_links: z.array(z.string()).nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		call_recording_share_links: z.array(z.string()).nullable().optional(),
		contact: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		csat_recording_urls: z.array(z.string()).nullable().optional(),
		csat_score: z.string().nullable().optional(),
		csat_transcriptions: z.array(z.string()).nullable().optional(),
		custom_data: z.string().nullable().optional(),
		date_connected: dialpadInteger(z.number().int()).nullable().optional(),
		date_ended: dialpadInteger(z.number().int()).nullable().optional(),
		date_rang: dialpadInteger(z.number().int()).nullable().optional(),
		date_started: dialpadInteger(z.number().int()).nullable().optional(),
		direction: z.string().nullable().optional(),
		duration: z.number().nullable().optional(),
		entry_point_call_id: dialpadInteger(z.number().int()).nullable().optional(),
		entry_point_target: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		event_timestamp: dialpadInteger(z.number().int()).nullable().optional(),
		external_number: z.string().nullable().optional(),
		group_id: z.string().nullable().optional(),
		internal_number: z.string().nullable().optional(),
		is_transferred: z.boolean().nullable().optional(),
		labels: z.array(z.string()).nullable().optional(),
		master_call_id: dialpadInteger(z.number().int()).nullable().optional(),
		mos_score: z.number().nullable().optional(),
		operator_call_id: dialpadInteger(z.number().int()).nullable().optional(),
		proxy_target: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		recording_details: z
			.array(
				z
					.object({
						duration: dialpadInteger(z.number().int()).nullable().optional(),
						id: z.string().nullable().optional(),
						recording_type: z
							.enum(['admincallrecording', 'callrecording', 'voicemail'])
							.or(z.string())
							.nullable()
							.optional(),
						start_time: dialpadInteger(z.number().int()).nullable().optional(),
						url: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		routing_breadcrumbs: z
			.array(
				z
					.object({
						breadcrumb_type: z
							.enum(['callrouter', 'external_api'])
							.or(z.string())
							.nullable()
							.optional(),
						date: dialpadInteger(z.number().int()).nullable().optional(),
						request: z.object({}).loose().nullable().optional(),
						response: z.object({}).loose().nullable().optional(),
						target_id: dialpadInteger(z.number().int()).nullable().optional(),
						target_type: z.string().nullable().optional(),
						url: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		screen_recording_urls: z.array(z.string()).nullable().optional(),
		state: z.string().nullable().optional(),
		target: z
			.object({
				email: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
				phone: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		total_duration: z.number().nullable().optional(),
		transcription_text: z.string().nullable().optional(),
		voicemail_link: z.string().nullable().optional(),
		voicemail_recording_id: z.string().nullable().optional(),
		voicemail_share_link: z.string().nullable().optional(),
		was_recorded: z.boolean().nullable().optional(),
	})
	.loose();

const Input31 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output31 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input32 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				call_center_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output32 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						call_center_id: z.string(),
						call_center_name: z.string().nullable().optional(),
						date_queued: z.string().nullable().optional(),
						id: z.string(),
						phone_number: z.string().nullable().optional(),
						queue_position: z.string().nullable().optional(),
						status: z.string(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const Input33 = z
	.object({
		body: z
			.object({
				call_center_id: dialpadInteger(z.number().int()),
				phone_number: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output33 = z
	.object({
		success: z.boolean().nullable().optional(),
	})
	.loose();

const Input34 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				include_alerts: z.boolean().optional(),
				office_id: dialpadInteger(z.number().int()).optional(),
				name_search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output34 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						advanced_settings: z
							.object({
								auto_call_recording: z
									.object({
										allow_pause_recording: z.boolean().nullable().optional(),
										call_recording_inbound: z.boolean().nullable().optional(),
										call_recording_outbound: z.boolean().nullable().optional(),
									})
									.loose()
									.optional(),
								max_wrap_up_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
							})
							.loose()
							.optional(),
						alerts: z
							.object({
								cc_service_level: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								cc_service_level_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
							})
							.loose()
							.optional(),
						availability_status: z
							.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
							.or(z.string())
							.nullable()
							.optional(),
						country: z.string().nullable().optional(),
						first_action: z
							.enum(['menu', 'operators'])
							.or(z.string())
							.nullable()
							.optional(),
						friday_hours: z.array(z.string()).nullable().optional(),
						group_description: z.string().nullable().optional(),
						hold_queue: z
							.object({
								allow_queue_callback: z.boolean().nullable().optional(),
								announce_estimated_wait_time: z.boolean().nullable().optional(),
								announce_position: z.boolean().nullable().optional(),
								announcement_interval_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								estimated_wait_time_max: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								max_hold_count: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								max_hold_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								queue_callback_dtmf: z.string().nullable().optional(),
								queue_callback_threshold: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								queue_escape_dtmf: z.string().nullable().optional(),
								stay_in_queue_after_closing: z.boolean().nullable().optional(),
								unattended_queue: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						hours_on: z.boolean().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						is_digital: z.boolean().nullable().optional(),
						monday_hours: z.array(z.string()).nullable().optional(),
						name: z.string().nullable().optional(),
						no_operators_action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string())
							.nullable()
							.optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						routing_options: z
							.object({
								closed: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
								open: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
							})
							.loose()
							.optional(),
						saturday_hours: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						sunday_hours: z.array(z.string()).nullable().optional(),
						thursday_hours: z.array(z.string()).nullable().optional(),
						timezone: z.string().nullable().optional(),
						tuesday_hours: z.array(z.string()).nullable().optional(),
						voice_intelligence: z
							.object({
								allow_pause: z.boolean().nullable().optional(),
								auto_start: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						voicemail_notification_emails: z
							.array(z.string())
							.nullable()
							.optional(),
						wednesday_hours: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input35 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output35 = z
	.object({
		advanced_settings: z
			.object({
				auto_call_recording: z
					.object({
						allow_pause_recording: z.boolean().nullable().optional(),
						call_recording_inbound: z.boolean().nullable().optional(),
						call_recording_outbound: z.boolean().nullable().optional(),
					})
					.loose()
					.optional(),
				max_wrap_up_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		alerts: z
			.object({
				cc_service_level: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				cc_service_level_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queue_callback: z.boolean().nullable().optional(),
				announce_estimated_wait_time: z.boolean().nullable().optional(),
				announce_position: z.boolean().nullable().optional(),
				announcement_interval_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				estimated_wait_time_max: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_callback_dtmf: z.string().nullable().optional(),
				queue_callback_threshold: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_escape_dtmf: z.string().nullable().optional(),
				stay_in_queue_after_closing: z.boolean().nullable().optional(),
				unattended_queue: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_digital: z.boolean().nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input36 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				advanced_settings: z
					.object({
						auto_call_recording: z
							.object({
								allow_pause_recording: z.boolean().nullable().optional(),
								call_recording_inbound: z.boolean().nullable().optional(),
								call_recording_outbound: z.boolean().nullable().optional(),
							})
							.strict()
							.optional(),
						max_wrap_up_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				alerts: z
					.object({
						cc_service_level: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						cc_service_level_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				group_description: z.string().nullable().optional(),
				hold_queue: z
					.object({
						allow_queue_callback: z.boolean().nullable().optional(),
						announce_estimated_wait_time: z.boolean().nullable().optional(),
						announce_position: z.boolean().nullable().optional(),
						announcement_interval_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						estimated_wait_time_max: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						max_hold_count: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						max_hold_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						queue_callback_dtmf: z.string().nullable().optional(),
						queue_callback_threshold: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						queue_escape_dtmf: z.string().nullable().optional(),
						stay_in_queue_after_closing: z.boolean().nullable().optional(),
						unattended_queue: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				hours_on: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string().nullable().optional(),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
						open: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
					})
					.strict()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				voice_intelligence: z
					.object({
						allow_pause: z.boolean().nullable().optional(),
						auto_start: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output36 = z
	.object({
		advanced_settings: z
			.object({
				auto_call_recording: z
					.object({
						allow_pause_recording: z.boolean().nullable().optional(),
						call_recording_inbound: z.boolean().nullable().optional(),
						call_recording_outbound: z.boolean().nullable().optional(),
					})
					.loose()
					.optional(),
				max_wrap_up_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		alerts: z
			.object({
				cc_service_level: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				cc_service_level_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queue_callback: z.boolean().nullable().optional(),
				announce_estimated_wait_time: z.boolean().nullable().optional(),
				announce_position: z.boolean().nullable().optional(),
				announcement_interval_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				estimated_wait_time_max: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_callback_dtmf: z.string().nullable().optional(),
				queue_callback_threshold: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_escape_dtmf: z.string().nullable().optional(),
				stay_in_queue_after_closing: z.boolean().nullable().optional(),
				unattended_queue: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_digital: z.boolean().nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input37 = z
	.object({
		body: z
			.object({
				advanced_settings: z
					.object({
						auto_call_recording: z
							.object({
								allow_pause_recording: z.boolean().nullable().optional(),
								call_recording_inbound: z.boolean().nullable().optional(),
								call_recording_outbound: z.boolean().nullable().optional(),
							})
							.strict()
							.optional(),
						max_wrap_up_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				alerts: z
					.object({
						cc_service_level: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						cc_service_level_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				group_description: z.string().nullable().optional(),
				hold_queue: z
					.object({
						allow_queue_callback: z.boolean().nullable().optional(),
						announce_estimated_wait_time: z.boolean().nullable().optional(),
						announce_position: z.boolean().nullable().optional(),
						announcement_interval_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						estimated_wait_time_max: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						max_hold_count: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						max_hold_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						queue_callback_dtmf: z.string().nullable().optional(),
						queue_callback_threshold: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						queue_escape_dtmf: z.string().nullable().optional(),
						stay_in_queue_after_closing: z.boolean().nullable().optional(),
						unattended_queue: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				hours_on: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string(),
				office_id: dialpadInteger(z.number().int()),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
						open: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
					})
					.strict()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				voice_intelligence: z
					.object({
						allow_pause: z.boolean().nullable().optional(),
						auto_start: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output37 = z
	.object({
		advanced_settings: z
			.object({
				auto_call_recording: z
					.object({
						allow_pause_recording: z.boolean().nullable().optional(),
						call_recording_inbound: z.boolean().nullable().optional(),
						call_recording_outbound: z.boolean().nullable().optional(),
					})
					.loose()
					.optional(),
				max_wrap_up_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		alerts: z
			.object({
				cc_service_level: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				cc_service_level_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queue_callback: z.boolean().nullable().optional(),
				announce_estimated_wait_time: z.boolean().nullable().optional(),
				announce_position: z.boolean().nullable().optional(),
				announcement_interval_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				estimated_wait_time_max: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_callback_dtmf: z.string().nullable().optional(),
				queue_callback_threshold: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_escape_dtmf: z.string().nullable().optional(),
				stay_in_queue_after_closing: z.boolean().nullable().optional(),
				unattended_queue: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_digital: z.boolean().nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input38 = z
	.object({
		body: z
			.object({
				call_center_id: dialpadInteger(z.number().int()),
				phone_number: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output38 = z
	.object({
		position: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input39 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output39 = z
	.object({
		advanced_settings: z
			.object({
				auto_call_recording: z
					.object({
						allow_pause_recording: z.boolean().nullable().optional(),
						call_recording_inbound: z.boolean().nullable().optional(),
						call_recording_outbound: z.boolean().nullable().optional(),
					})
					.loose()
					.optional(),
				max_wrap_up_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		alerts: z
			.object({
				cc_service_level: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				cc_service_level_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queue_callback: z.boolean().nullable().optional(),
				announce_estimated_wait_time: z.boolean().nullable().optional(),
				announce_position: z.boolean().nullable().optional(),
				announcement_interval_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				estimated_wait_time_max: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_callback_dtmf: z.string().nullable().optional(),
				queue_callback_threshold: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				queue_escape_dtmf: z.string().nullable().optional(),
				stay_in_queue_after_closing: z.boolean().nullable().optional(),
				unattended_queue: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_digital: z.boolean().nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input40 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output40 = z
	.object({
		availability: z
			.object({
				name: z.string().nullable().optional(),
				status: z.string(),
			})
			.loose(),
		capacity: dialpadInteger(z.number().int()),
		longest_call_wait_time: dialpadInteger(z.number().int()),
		on_duty_operators: dialpadInteger(z.number().int()),
		pending: dialpadInteger(z.number().int()),
	})
	.loose();

const Input41 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				duty_status_reason: z.string().nullable().optional(),
				on_duty: z.boolean(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output41 = z
	.object({
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty: z.boolean().nullable().optional(),
		on_duty_started: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input42 = z
	.object({
		path: z
			.object({
				call_center_id: dialpadInteger(z.number().int()),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output42 = z
	.object({
		call_center_id: dialpadInteger(z.number().int()).nullable().optional(),
		skill_level: dialpadInteger(z.number().int()).nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input43 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output43 = z
	.object({
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty: z.boolean().nullable().optional(),
		on_duty_started: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input44 = z
	.object({
		path: z
			.object({
				call_center_id: dialpadInteger(z.number().int()),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				skill_level: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output44 = z
	.object({
		call_center_id: dialpadInteger(z.number().int()).nullable().optional(),
		skill_level: dialpadInteger(z.number().int()).nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input45 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				keep_paid_numbers: z.boolean().nullable().optional(),
				license_type: z
					.enum(['agents', 'lite_support_agents'])
					.nullable()
					.optional(),
				role: z.enum(['admin', 'operator', 'supervisor']).nullable().optional(),
				skill_level: dialpadInteger(z.number().int()).nullable().optional(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output45 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input46 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				cursor: z.string().optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				compact: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output46 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						date_created: z.string().nullable().optional(),
						date_parked: z.string().nullable().optional(),
						date_queued: z.string().nullable().optional(),
						group_type: z.string().nullable().optional(),
						has_assigned_operators: z.boolean().nullable().optional(),
						id: z.string(),
						parent_type: z.string(),
						state: z.string().nullable().optional(),
						target_id: z.string().nullable().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const Input47 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output47 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input48 = z
	.object({
		query: z
			.object({
				limit: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output48 = z
	.object({
		labels: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input49 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output49 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		id: z.string().nullable().optional(),
		privacy: z.enum(['company', 'public']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input50 = z
	.object({
		body: z
			.object({
				call_id: dialpadInteger(z.number().int()).nullable().optional(),
				privacy: z.enum(['company', 'public']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output50 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		id: z.string().nullable().optional(),
		privacy: z.enum(['company', 'public']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input51 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output51 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		id: z.string().nullable().optional(),
		privacy: z.enum(['company', 'public']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input52 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				office_id: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output52 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						default_target_id: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						default_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						enabled: z.boolean().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						routing_url: z.string().nullable().optional(),
						signature: z
							.object({
								algo: z.string().nullable().optional(),
								secret: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input53 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output53 = z
	.object({
		rooms: z
			.array(
				z
					.object({
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						is_free: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		users: z
			.array(
				z
					.object({
						admin_office_ids: z
							.array(dialpadInteger(z.number().int()))
							.nullable()
							.optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						date_active: z.string().nullable().optional(),
						date_added: z.string().nullable().optional(),
						date_first_login: z.string().nullable().optional(),
						date_last_login: z.string().optional(),
						display_name: z.string().nullable().optional(),
						do_not_disturb: z.boolean().nullable().optional(),
						duty_status_reason: z.string().nullable().optional(),
						duty_status_started: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						forwarding_numbers: z.array(z.string()).nullable().optional(),
						group_details: z
							.array(
								z
									.object({
										do_not_disturb: z.boolean().nullable().optional(),
										group_id: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										group_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'coachingteam',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.nullable()
											.optional(),
										role: z
											.enum(['admin', 'operator', 'supervisor'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						international_dialing_enabled: z.boolean().nullable().optional(),
						is_admin: z.boolean().nullable().optional(),
						is_available: z.boolean().nullable().optional(),
						is_company_admin: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						is_online: z.boolean().nullable().optional(),
						is_super_admin: z.boolean().nullable().optional(),
						job_title: z.string().nullable().optional(),
						language: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						license: z
							.enum([
								'admins',
								'agents',
								'dpde_all',
								'dpde_one',
								'lite_lines',
								'lite_support_agents',
								'magenta_lines',
								'talk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						location: z.string().nullable().optional(),
						muted: z.boolean().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						on_duty_started: z.string().nullable().optional(),
						on_duty_status: z
							.enum([
								'available',
								'busy',
								'occupied',
								'occupied-end',
								'unavailable',
								'wrapup',
								'wrapup-end',
							])
							.or(z.string())
							.nullable()
							.optional(),
						onboarding_completed: z.boolean(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						remote_service: z.string().nullable().optional(),
						session_type: z
							.enum(['call', 'digital'])
							.or(z.string())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						status_message: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						voicemail: z
							.object({
								is_default_voicemail: z.boolean().optional(),
								name: z.string().nullable().optional(),
								voicemail_notifications_enabled: z.boolean().optional(),
							})
							.loose(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input54 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output54 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input55 = z
	.object({
		body: z
			.object({
				default_target_id: dialpadInteger(z.number().int()),
				default_target_type: z.enum([
					'callcenter',
					'callrouter',
					'channel',
					'coachinggroup',
					'coachingteam',
					'department',
					'office',
					'room',
					'staffgroup',
					'unknown',
					'user',
				]),
				enabled: z.boolean().nullable().optional(),
				name: z.string(),
				office_id: dialpadInteger(z.number().int()),
				routing_url: z.string(),
				secret: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output55 = z
	.object({
		default_target_id: dialpadInteger(z.number().int()).nullable().optional(),
		default_target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		enabled: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		routing_url: z.string().nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input56 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output56 = z
	.object({
		default_target_id: dialpadInteger(z.number().int()).nullable().optional(),
		default_target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		enabled: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		routing_url: z.string().nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input57 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				privacy: z.enum(['company', 'public']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output57 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		id: z.string().nullable().optional(),
		privacy: z.enum(['company', 'public']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input58 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				default_target_id: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				default_target_type: z
					.enum([
						'callcenter',
						'callrouter',
						'channel',
						'coachinggroup',
						'coachingteam',
						'department',
						'office',
						'room',
						'staffgroup',
						'unknown',
						'user',
					])
					.nullable()
					.optional(),
				enabled: z.boolean().nullable().optional(),
				name: z.string().nullable().optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				reset_error_count: z.boolean().nullable().optional(),
				routing_url: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output58 = z
	.object({
		default_target_id: dialpadInteger(z.number().int()).nullable().optional(),
		default_target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		enabled: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		routing_url: z.string().nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input59 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				area_code: z.string().nullable().optional(),
				number: z.string().nullable().optional(),
				primary: z.boolean().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output59 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input60 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output60 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input61 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output61 = z
	.object({
		hashtag: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		member_count: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		privacy: z.enum(['private', 'public']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input62 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output62 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input63 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				state: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output63 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						hashtag: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						member_count: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						name: z.string(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						privacy: z
							.enum(['private', 'public'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input64 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output64 = z
	.object({
		allow_trainee_eavesdrop: z.boolean().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		team_description: z.string().nullable().optional(),
	})
	.loose();

const Input65 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				available: z.boolean().optional(),
				role: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output65 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						accept_powerdialer_calls: z.boolean().nullable().optional(),
						admin_office_ids: z
							.array(dialpadInteger(z.number().int()))
							.nullable()
							.optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						date_active: z.string().nullable().optional(),
						date_added: z.string().nullable().optional(),
						date_first_login: z.string().nullable().optional(),
						do_not_disturb: z.boolean().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						forwarding_numbers: z.array(z.string()).nullable().optional(),
						id: dialpadInteger(z.number().int()),
						image_url: z.string().nullable().optional(),
						is_admin: z.boolean().nullable().optional(),
						is_available: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						is_online: z.boolean().nullable().optional(),
						is_super_admin: z.boolean().nullable().optional(),
						job_title: z.string().nullable().optional(),
						language: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						license: z
							.enum([
								'admins',
								'agents',
								'dpde_all',
								'dpde_one',
								'lite_lines',
								'lite_support_agents',
								'magenta_lines',
								'talk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						location: z.string().nullable().optional(),
						muted: z.boolean().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						role: z.enum(['coach', 'trainee']).or(z.string()),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						status_message: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input66 = z
	.object({
		body: z
			.object({
				description: z.string(),
				name: z.string(),
				privacy_type: z.enum(['private', 'public']),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output66 = z
	.object({
		hashtag: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		member_count: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		privacy: z.enum(['private', 'public']).or(z.string()).nullable().optional(),
	})
	.loose();

const Input67 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output67 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input68 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output68 = z
	.object({
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.loose();

const Input69 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				office_id: dialpadInteger(z.number().int()).optional(),
				name_search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output69 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						allow_trainee_eavesdrop: z.boolean().nullable().optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						team_description: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input70 = z.object({}).strict();

const Output70 = z
	.object({
		account_type: z
			.enum(['enterprise', 'free', 'pro', 'standard'])
			.or(z.string())
			.nullable()
			.optional(),
		admin_email: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_count: dialpadInteger(z.number().int()).nullable().optional(),
		settings: z
			.object({
				allow_ai_training: z.boolean().nullable().optional(),
				has_callai: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input71 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		query: z
			.object({
				a2p_campaign_id: dialpadInteger(z.number().int()).optional(),
				cursor: z.string().optional(),
				opt_out_state: z.enum(['opted_back_in', 'opted_out']),
			})
			.strict(),
	})
	.strict();

const Output71 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						date: dialpadInteger(z.number().int()).nullable().optional(),
						external_endpoint: z.string(),
						opt_out_scope_info: z
							.object({
								opt_out_scope_level: z
									.enum(['a2p_campaign', 'company'])
									.or(z.string()),
								scope_id: dialpadInteger(z.number().int()),
							})
							.loose()
							.optional(),
						opt_out_state: z
							.enum(['opted_back_in', 'opted_out'])
							.or(z.string()),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input72 = z
	.object({
		query: z
			.object({
				has_callai: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output72 = z
	.object({
		account_type: z
			.enum(['enterprise', 'free', 'pro', 'standard'])
			.or(z.string())
			.nullable()
			.optional(),
		admin_email: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_count: dialpadInteger(z.number().int()).nullable().optional(),
		settings: z
			.object({
				allow_ai_training: z.boolean().nullable().optional(),
				has_callai: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input73 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				member_id: z.string(),
				role: z.enum(['coach', 'trainee']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output73 = z
	.object({
		accept_powerdialer_calls: z.boolean().nullable().optional(),
		admin_office_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		date_active: z.string().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_first_login: z.string().nullable().optional(),
		do_not_disturb: z.boolean().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		id: dialpadInteger(z.number().int()),
		image_url: z.string().nullable().optional(),
		is_admin: z.boolean().nullable().optional(),
		is_available: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		is_online: z.boolean().nullable().optional(),
		is_super_admin: z.boolean().nullable().optional(),
		job_title: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		license: z
			.enum([
				'admins',
				'agents',
				'dpde_all',
				'dpde_one',
				'lite_lines',
				'lite_support_agents',
				'magenta_lines',
				'talk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		location: z.string().nullable().optional(),
		muted: z.boolean().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		role: z.enum(['coach', 'trainee']).or(z.string()),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		status_message: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
	})
	.loose();

const Input74 = z.object({}).strict();

const Output74 = z
	.object({
		allow_ai_training: z.boolean().nullable().optional(),
		enable_ai: z.boolean().nullable().optional(),
	})
	.loose();

const Input75 = z
	.object({
		body: z
			.object({
				name: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output75 = z
	.object({
		account_type: z
			.enum(['enterprise', 'free', 'pro', 'standard'])
			.or(z.string())
			.nullable()
			.optional(),
		admin_email: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_count: dialpadInteger(z.number().int()).nullable().optional(),
		settings: z
			.object({
				allow_ai_training: z.boolean().nullable().optional(),
				has_callai: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input76 = z
	.object({
		body: z
			.object({
				allow_ai_training: z.boolean().nullable().optional(),
				enable_ai: z.boolean().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output76 = z
	.object({
		allow_ai_training: z.boolean().nullable().optional(),
		enable_ai: z.boolean().nullable().optional(),
	})
	.loose();

const Input77 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output77 = z
	.object({
		company_name: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		owner_id: z.string().nullable().optional(),
		phones: z.array(z.string()).nullable().optional(),
		primary_email: z.string().nullable().optional(),
		primary_phone: z.string().nullable().optional(),
		trunk_group: z.string().nullable().optional(),
		type: z
			.enum(['lead', 'local', 'shared'])
			.or(z.string())
			.nullable()
			.optional(),
		urls: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input78 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				company_name: z.string().nullable().optional(),
				emails: z.array(z.string()).nullable().optional(),
				extension: z.string().nullable().optional(),
				first_name: z.string().nullable().optional(),
				job_title: z.string().nullable().optional(),
				last_name: z.string().nullable().optional(),
				phones: z.array(z.string()).nullable().optional(),
				trunk_group: z.string().nullable().optional(),
				urls: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output78 = z
	.object({
		company_name: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		owner_id: z.string().nullable().optional(),
		phones: z.array(z.string()).nullable().optional(),
		primary_email: z.string().nullable().optional(),
		primary_phone: z.string().nullable().optional(),
		trunk_group: z.string().nullable().optional(),
		type: z
			.enum(['lead', 'local', 'shared'])
			.or(z.string())
			.nullable()
			.optional(),
		urls: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input79 = z
	.object({
		query: z
			.object({
				name: z.string().optional(),
				cursor: z.string().optional(),
				include_local: z.boolean().optional(),
				owner_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output79 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						company_name: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						job_title: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						owner_id: z.string().nullable().optional(),
						phones: z.array(z.string()).nullable().optional(),
						primary_email: z.string().nullable().optional(),
						primary_phone: z.string().nullable().optional(),
						trunk_group: z.string().nullable().optional(),
						type: z
							.enum(['lead', 'local', 'shared'])
							.or(z.string())
							.nullable()
							.optional(),
						urls: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input80 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output80 = z
	.object({
		company_name: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		owner_id: z.string().nullable().optional(),
		phones: z.array(z.string()).nullable().optional(),
		primary_email: z.string().nullable().optional(),
		primary_phone: z.string().nullable().optional(),
		trunk_group: z.string().nullable().optional(),
		type: z
			.enum(['lead', 'local', 'shared'])
			.or(z.string())
			.nullable()
			.optional(),
		urls: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input81 = z
	.object({
		body: z
			.object({
				company_name: z.string().nullable().optional(),
				emails: z.array(z.string()).nullable().optional(),
				extension: z.string().nullable().optional(),
				first_name: z.string(),
				job_title: z.string().nullable().optional(),
				last_name: z.string(),
				owner_id: z.string().nullable().optional(),
				phones: z.array(z.string()).nullable().optional(),
				trunk_group: z.string().nullable().optional(),
				urls: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output81 = z
	.object({
		company_name: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		owner_id: z.string().nullable().optional(),
		phones: z.array(z.string()).nullable().optional(),
		primary_email: z.string().nullable().optional(),
		primary_phone: z.string().nullable().optional(),
		trunk_group: z.string().nullable().optional(),
		type: z
			.enum(['lead', 'local', 'shared'])
			.or(z.string())
			.nullable()
			.optional(),
		urls: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input82 = z
	.object({
		body: z
			.object({
				company_name: z.string().nullable().optional(),
				emails: z.array(z.string()).nullable().optional(),
				extension: z.string().nullable().optional(),
				first_name: z.string(),
				job_title: z.string().nullable().optional(),
				last_name: z.string(),
				phones: z.array(z.string()).nullable().optional(),
				trunk_group: z.string().nullable().optional(),
				uid: z.string(),
				urls: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output82 = z
	.object({
		company_name: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		job_title: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		owner_id: z.string().nullable().optional(),
		phones: z.array(z.string()).nullable().optional(),
		primary_email: z.string().nullable().optional(),
		primary_phone: z.string().nullable().optional(),
		trunk_group: z.string().nullable().optional(),
		type: z
			.enum(['lead', 'local', 'shared'])
			.or(z.string())
			.nullable()
			.optional(),
		urls: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input83 = z
	.object({
		path: z
			.object({
				target_type: z.enum([
					'callcenter',
					'callrouter',
					'channel',
					'coachinggroup',
					'coachingteam',
					'department',
					'office',
					'room',
					'staffgroup',
					'unknown',
					'user',
				]),
				target_id: dialpadInteger(z.number().int()),
				ivr_type: z.enum([
					'ADMIN_AUTO_RECORDING',
					'ASK_FIRST_OPERATOR_NOT_AVAILABLE',
					'AUTO_RECORDING',
					'CALLAI_AUTO_RECORDING',
					'CALLAI_AUTO_RECORDING_INBOUND',
					'CALLAI_AUTO_RECORDING_OUTBOUND',
					'CALLAI_TOGGLE_DISABLED',
					'CALLAI_TOGGLE_ENABLED',
					'CG_AUTO_RECORDING',
					'CLOSED',
					'CLOSED_DEPARTMENT_INTRO',
					'CLOSED_MENU',
					'CLOSED_MENU_OPTION',
					'CSAT_INTRO',
					'CSAT_OUTRO',
					'CSAT_PREAMBLE',
					'CSAT_QUESTION',
					'DEPARTMENT_INTRO',
					'GREETING',
					'HOLD_AGENT_READY',
					'HOLD_APPREC',
					'HOLD_CALLBACK_ACCEPT',
					'HOLD_CALLBACK_ACCEPTED',
					'HOLD_CALLBACK_CONFIRM',
					'HOLD_CALLBACK_CONFIRM_NUMBER',
					'HOLD_CALLBACK_DIFFERENT_NUMBER',
					'HOLD_CALLBACK_DIRECT',
					'HOLD_CALLBACK_FULFILLED',
					'HOLD_CALLBACK_INVALID_NUMBER',
					'HOLD_CALLBACK_KEYPAD',
					'HOLD_CALLBACK_REJECT',
					'HOLD_CALLBACK_REJECTED',
					'HOLD_CALLBACK_REQUEST',
					'HOLD_CALLBACK_REQUESTED',
					'HOLD_CALLBACK_SAME_NUMBER',
					'HOLD_CALLBACK_TRY_AGAIN',
					'HOLD_CALLBACK_UNDIALABLE',
					'HOLD_ESCAPE_VM_EIGHT',
					'HOLD_ESCAPE_VM_FIVE',
					'HOLD_ESCAPE_VM_FOUR',
					'HOLD_ESCAPE_VM_NINE',
					'HOLD_ESCAPE_VM_ONE',
					'HOLD_ESCAPE_VM_POUND',
					'HOLD_ESCAPE_VM_SEVEN',
					'HOLD_ESCAPE_VM_SIX',
					'HOLD_ESCAPE_VM_STAR',
					'HOLD_ESCAPE_VM_TEN',
					'HOLD_ESCAPE_VM_THREE',
					'HOLD_ESCAPE_VM_TWO',
					'HOLD_ESCAPE_VM_ZERO',
					'HOLD_ESTIMATED_WAIT_TIME',
					'HOLD_INTERRUPT',
					'HOLD_INTRO',
					'HOLD_MUSIC',
					'HOLD_POSITION_EIGHT',
					'HOLD_POSITION_FIVE',
					'HOLD_POSITION_FOUR',
					'HOLD_POSITION_MORE',
					'HOLD_POSITION_NINE',
					'HOLD_POSITION_ONE',
					'HOLD_POSITION_SEVEN',
					'HOLD_POSITION_SIX',
					'HOLD_POSITION_TEN',
					'HOLD_POSITION_THREE',
					'HOLD_POSITION_TWO',
					'HOLD_POSITION_ZERO',
					'HOLD_WAIT',
					'INCOMING_CALL_FROM_GROUP',
					'MENU',
					'MENU_OPTION',
					'NEXT_TARGET',
					'POWER_DIALER_CALL_GREETING',
					'POWER_DIALER_VM_DROP',
					'PREFERRED_OPERATOR_PROMPT',
					'VM_DROP_MESSAGE',
					'VM_UNAVAILABLE',
					'VM_UNAVAILABLE_CLOSED',
				]),
			})
			.strict(),
		body: z
			.object({
				ivr_id: dialpadInteger(z.number().int()),
				select_option: z.enum(['inbound', 'outbound']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output83 = z
	.object({
		date_added: dialpadInteger(z.number().int()).nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		selected: z.boolean().nullable().optional(),
		text: z.string().nullable().optional(),
	})
	.loose();

const Input84 = z
	.object({
		query: z
			.object({
				phone: z.string().optional(),
				email: z.string().optional(),
				name: z.string().optional(),
				group_key: z.string().optional(),
				external_id: z.string().optional(),
				external_service: z.string().optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				cursor: z.string().optional(),
				external_scope: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output84 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						company_name: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						external_ids: z
							.array(
								z
									.object({
										id: z.string(),
										scope: z.string(),
										service: z.string(),
									})
									.loose(),
							)
							.optional(),
						first_name: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						job_title: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						owner_id: z.string().nullable().optional(),
						phones: z.array(z.string()).nullable().optional(),
						primary_email: z.string().nullable().optional(),
						primary_phone: z.string().nullable().optional(),
						trunk_group: z.string().nullable().optional(),
						type: z
							.enum(['lead', 'local', 'shared'])
							.or(z.string())
							.nullable()
							.optional(),
						urls: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const Input85 = z
	.object({
		path: z
			.object({
				target_type: z.enum([
					'callcenter',
					'callrouter',
					'channel',
					'coachinggroup',
					'coachingteam',
					'department',
					'office',
					'room',
					'staffgroup',
					'unknown',
					'user',
				]),
				target_id: dialpadInteger(z.number().int()),
				ivr_type: z.enum([
					'ADMIN_AUTO_RECORDING',
					'ASK_FIRST_OPERATOR_NOT_AVAILABLE',
					'AUTO_RECORDING',
					'CALLAI_AUTO_RECORDING',
					'CALLAI_AUTO_RECORDING_INBOUND',
					'CALLAI_AUTO_RECORDING_OUTBOUND',
					'CALLAI_TOGGLE_DISABLED',
					'CALLAI_TOGGLE_ENABLED',
					'CG_AUTO_RECORDING',
					'CLOSED',
					'CLOSED_DEPARTMENT_INTRO',
					'CLOSED_MENU',
					'CLOSED_MENU_OPTION',
					'CSAT_INTRO',
					'CSAT_OUTRO',
					'CSAT_PREAMBLE',
					'CSAT_QUESTION',
					'DEPARTMENT_INTRO',
					'GREETING',
					'HOLD_AGENT_READY',
					'HOLD_APPREC',
					'HOLD_CALLBACK_ACCEPT',
					'HOLD_CALLBACK_ACCEPTED',
					'HOLD_CALLBACK_CONFIRM',
					'HOLD_CALLBACK_CONFIRM_NUMBER',
					'HOLD_CALLBACK_DIFFERENT_NUMBER',
					'HOLD_CALLBACK_DIRECT',
					'HOLD_CALLBACK_FULFILLED',
					'HOLD_CALLBACK_INVALID_NUMBER',
					'HOLD_CALLBACK_KEYPAD',
					'HOLD_CALLBACK_REJECT',
					'HOLD_CALLBACK_REJECTED',
					'HOLD_CALLBACK_REQUEST',
					'HOLD_CALLBACK_REQUESTED',
					'HOLD_CALLBACK_SAME_NUMBER',
					'HOLD_CALLBACK_TRY_AGAIN',
					'HOLD_CALLBACK_UNDIALABLE',
					'HOLD_ESCAPE_VM_EIGHT',
					'HOLD_ESCAPE_VM_FIVE',
					'HOLD_ESCAPE_VM_FOUR',
					'HOLD_ESCAPE_VM_NINE',
					'HOLD_ESCAPE_VM_ONE',
					'HOLD_ESCAPE_VM_POUND',
					'HOLD_ESCAPE_VM_SEVEN',
					'HOLD_ESCAPE_VM_SIX',
					'HOLD_ESCAPE_VM_STAR',
					'HOLD_ESCAPE_VM_TEN',
					'HOLD_ESCAPE_VM_THREE',
					'HOLD_ESCAPE_VM_TWO',
					'HOLD_ESCAPE_VM_ZERO',
					'HOLD_ESTIMATED_WAIT_TIME',
					'HOLD_INTERRUPT',
					'HOLD_INTRO',
					'HOLD_MUSIC',
					'HOLD_POSITION_EIGHT',
					'HOLD_POSITION_FIVE',
					'HOLD_POSITION_FOUR',
					'HOLD_POSITION_MORE',
					'HOLD_POSITION_NINE',
					'HOLD_POSITION_ONE',
					'HOLD_POSITION_SEVEN',
					'HOLD_POSITION_SIX',
					'HOLD_POSITION_TEN',
					'HOLD_POSITION_THREE',
					'HOLD_POSITION_TWO',
					'HOLD_POSITION_ZERO',
					'HOLD_WAIT',
					'INCOMING_CALL_FROM_GROUP',
					'MENU',
					'MENU_OPTION',
					'NEXT_TARGET',
					'POWER_DIALER_CALL_GREETING',
					'POWER_DIALER_VM_DROP',
					'PREFERRED_OPERATOR_PROMPT',
					'VM_DROP_MESSAGE',
					'VM_UNAVAILABLE',
					'VM_UNAVAILABLE_CLOSED',
				]),
			})
			.strict(),
		body: z
			.object({
				ivr_id: dialpadInteger(z.number().int()),
				select_option: z.enum(['inbound', 'outbound']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output85 = z
	.object({
		ivr_type: z
			.enum([
				'ADMIN_AUTO_RECORDING',
				'ASK_FIRST_OPERATOR_NOT_AVAILABLE',
				'AUTO_RECORDING',
				'CALLAI_AUTO_RECORDING',
				'CALLAI_AUTO_RECORDING_INBOUND',
				'CALLAI_AUTO_RECORDING_OUTBOUND',
				'CALLAI_TOGGLE_DISABLED',
				'CALLAI_TOGGLE_ENABLED',
				'CG_AUTO_RECORDING',
				'CLOSED',
				'CLOSED_DEPARTMENT_INTRO',
				'CLOSED_MENU',
				'CLOSED_MENU_OPTION',
				'CSAT_INTRO',
				'CSAT_OUTRO',
				'CSAT_PREAMBLE',
				'CSAT_QUESTION',
				'DEPARTMENT_INTRO',
				'GREETING',
				'HOLD_AGENT_READY',
				'HOLD_APPREC',
				'HOLD_CALLBACK_ACCEPT',
				'HOLD_CALLBACK_ACCEPTED',
				'HOLD_CALLBACK_CONFIRM',
				'HOLD_CALLBACK_CONFIRM_NUMBER',
				'HOLD_CALLBACK_DIFFERENT_NUMBER',
				'HOLD_CALLBACK_DIRECT',
				'HOLD_CALLBACK_FULFILLED',
				'HOLD_CALLBACK_INVALID_NUMBER',
				'HOLD_CALLBACK_KEYPAD',
				'HOLD_CALLBACK_REJECT',
				'HOLD_CALLBACK_REJECTED',
				'HOLD_CALLBACK_REQUEST',
				'HOLD_CALLBACK_REQUESTED',
				'HOLD_CALLBACK_SAME_NUMBER',
				'HOLD_CALLBACK_TRY_AGAIN',
				'HOLD_CALLBACK_UNDIALABLE',
				'HOLD_ESCAPE_VM_EIGHT',
				'HOLD_ESCAPE_VM_FIVE',
				'HOLD_ESCAPE_VM_FOUR',
				'HOLD_ESCAPE_VM_NINE',
				'HOLD_ESCAPE_VM_ONE',
				'HOLD_ESCAPE_VM_POUND',
				'HOLD_ESCAPE_VM_SEVEN',
				'HOLD_ESCAPE_VM_SIX',
				'HOLD_ESCAPE_VM_STAR',
				'HOLD_ESCAPE_VM_TEN',
				'HOLD_ESCAPE_VM_THREE',
				'HOLD_ESCAPE_VM_TWO',
				'HOLD_ESCAPE_VM_ZERO',
				'HOLD_ESTIMATED_WAIT_TIME',
				'HOLD_INTERRUPT',
				'HOLD_INTRO',
				'HOLD_MUSIC',
				'HOLD_POSITION_EIGHT',
				'HOLD_POSITION_FIVE',
				'HOLD_POSITION_FOUR',
				'HOLD_POSITION_MORE',
				'HOLD_POSITION_NINE',
				'HOLD_POSITION_ONE',
				'HOLD_POSITION_SEVEN',
				'HOLD_POSITION_SIX',
				'HOLD_POSITION_TEN',
				'HOLD_POSITION_THREE',
				'HOLD_POSITION_TWO',
				'HOLD_POSITION_ZERO',
				'HOLD_WAIT',
				'INCOMING_CALL_FROM_GROUP',
				'MENU',
				'MENU_OPTION',
				'NEXT_TARGET',
				'POWER_DIALER_CALL_GREETING',
				'POWER_DIALER_VM_DROP',
				'PREFERRED_OPERATOR_PROMPT',
				'VM_DROP_MESSAGE',
				'VM_UNAVAILABLE',
				'VM_UNAVAILABLE_CLOSED',
			])
			.or(z.string())
			.nullable()
			.optional(),
		ivrs: z
			.array(
				z
					.object({
						date_added: dialpadInteger(z.number().int()).nullable().optional(),
						description: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
						selected: z.boolean().nullable().optional(),
						text: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input86 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				ivr_type: z
					.enum([
						'ADMIN_AUTO_RECORDING',
						'ASK_FIRST_OPERATOR_NOT_AVAILABLE',
						'AUTO_RECORDING',
						'CALLAI_AUTO_RECORDING',
						'CALLAI_AUTO_RECORDING_INBOUND',
						'CALLAI_AUTO_RECORDING_OUTBOUND',
						'CALLAI_TOGGLE_DISABLED',
						'CALLAI_TOGGLE_ENABLED',
						'CG_AUTO_RECORDING',
						'CLOSED',
						'CLOSED_DEPARTMENT_INTRO',
						'CLOSED_MENU',
						'CLOSED_MENU_OPTION',
						'CSAT_INTRO',
						'CSAT_OUTRO',
						'CSAT_PREAMBLE',
						'CSAT_QUESTION',
						'DEPARTMENT_INTRO',
						'GREETING',
						'HOLD_AGENT_READY',
						'HOLD_APPREC',
						'HOLD_CALLBACK_ACCEPT',
						'HOLD_CALLBACK_ACCEPTED',
						'HOLD_CALLBACK_CONFIRM',
						'HOLD_CALLBACK_CONFIRM_NUMBER',
						'HOLD_CALLBACK_DIFFERENT_NUMBER',
						'HOLD_CALLBACK_DIRECT',
						'HOLD_CALLBACK_FULFILLED',
						'HOLD_CALLBACK_INVALID_NUMBER',
						'HOLD_CALLBACK_KEYPAD',
						'HOLD_CALLBACK_REJECT',
						'HOLD_CALLBACK_REJECTED',
						'HOLD_CALLBACK_REQUEST',
						'HOLD_CALLBACK_REQUESTED',
						'HOLD_CALLBACK_SAME_NUMBER',
						'HOLD_CALLBACK_TRY_AGAIN',
						'HOLD_CALLBACK_UNDIALABLE',
						'HOLD_ESCAPE_VM_EIGHT',
						'HOLD_ESCAPE_VM_FIVE',
						'HOLD_ESCAPE_VM_FOUR',
						'HOLD_ESCAPE_VM_NINE',
						'HOLD_ESCAPE_VM_ONE',
						'HOLD_ESCAPE_VM_POUND',
						'HOLD_ESCAPE_VM_SEVEN',
						'HOLD_ESCAPE_VM_SIX',
						'HOLD_ESCAPE_VM_STAR',
						'HOLD_ESCAPE_VM_TEN',
						'HOLD_ESCAPE_VM_THREE',
						'HOLD_ESCAPE_VM_TWO',
						'HOLD_ESCAPE_VM_ZERO',
						'HOLD_ESTIMATED_WAIT_TIME',
						'HOLD_INTERRUPT',
						'HOLD_INTRO',
						'HOLD_MUSIC',
						'HOLD_POSITION_EIGHT',
						'HOLD_POSITION_FIVE',
						'HOLD_POSITION_FOUR',
						'HOLD_POSITION_MORE',
						'HOLD_POSITION_NINE',
						'HOLD_POSITION_ONE',
						'HOLD_POSITION_SEVEN',
						'HOLD_POSITION_SIX',
						'HOLD_POSITION_TEN',
						'HOLD_POSITION_THREE',
						'HOLD_POSITION_TWO',
						'HOLD_POSITION_ZERO',
						'HOLD_WAIT',
						'INCOMING_CALL_FROM_GROUP',
						'MENU',
						'MENU_OPTION',
						'NEXT_TARGET',
						'POWER_DIALER_CALL_GREETING',
						'POWER_DIALER_VM_DROP',
						'PREFERRED_OPERATOR_PROMPT',
						'VM_DROP_MESSAGE',
						'VM_UNAVAILABLE',
						'VM_UNAVAILABLE_CLOSED',
					])
					.optional(),
				target_type: z.enum([
					'callcenter',
					'callrouter',
					'channel',
					'coachinggroup',
					'coachingteam',
					'department',
					'office',
					'room',
					'staffgroup',
					'unknown',
					'user',
				]),
				target_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output86 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						ivr_type: z
							.enum([
								'ADMIN_AUTO_RECORDING',
								'ASK_FIRST_OPERATOR_NOT_AVAILABLE',
								'AUTO_RECORDING',
								'CALLAI_AUTO_RECORDING',
								'CALLAI_AUTO_RECORDING_INBOUND',
								'CALLAI_AUTO_RECORDING_OUTBOUND',
								'CALLAI_TOGGLE_DISABLED',
								'CALLAI_TOGGLE_ENABLED',
								'CG_AUTO_RECORDING',
								'CLOSED',
								'CLOSED_DEPARTMENT_INTRO',
								'CLOSED_MENU',
								'CLOSED_MENU_OPTION',
								'CSAT_INTRO',
								'CSAT_OUTRO',
								'CSAT_PREAMBLE',
								'CSAT_QUESTION',
								'DEPARTMENT_INTRO',
								'GREETING',
								'HOLD_AGENT_READY',
								'HOLD_APPREC',
								'HOLD_CALLBACK_ACCEPT',
								'HOLD_CALLBACK_ACCEPTED',
								'HOLD_CALLBACK_CONFIRM',
								'HOLD_CALLBACK_CONFIRM_NUMBER',
								'HOLD_CALLBACK_DIFFERENT_NUMBER',
								'HOLD_CALLBACK_DIRECT',
								'HOLD_CALLBACK_FULFILLED',
								'HOLD_CALLBACK_INVALID_NUMBER',
								'HOLD_CALLBACK_KEYPAD',
								'HOLD_CALLBACK_REJECT',
								'HOLD_CALLBACK_REJECTED',
								'HOLD_CALLBACK_REQUEST',
								'HOLD_CALLBACK_REQUESTED',
								'HOLD_CALLBACK_SAME_NUMBER',
								'HOLD_CALLBACK_TRY_AGAIN',
								'HOLD_CALLBACK_UNDIALABLE',
								'HOLD_ESCAPE_VM_EIGHT',
								'HOLD_ESCAPE_VM_FIVE',
								'HOLD_ESCAPE_VM_FOUR',
								'HOLD_ESCAPE_VM_NINE',
								'HOLD_ESCAPE_VM_ONE',
								'HOLD_ESCAPE_VM_POUND',
								'HOLD_ESCAPE_VM_SEVEN',
								'HOLD_ESCAPE_VM_SIX',
								'HOLD_ESCAPE_VM_STAR',
								'HOLD_ESCAPE_VM_TEN',
								'HOLD_ESCAPE_VM_THREE',
								'HOLD_ESCAPE_VM_TWO',
								'HOLD_ESCAPE_VM_ZERO',
								'HOLD_ESTIMATED_WAIT_TIME',
								'HOLD_INTERRUPT',
								'HOLD_INTRO',
								'HOLD_MUSIC',
								'HOLD_POSITION_EIGHT',
								'HOLD_POSITION_FIVE',
								'HOLD_POSITION_FOUR',
								'HOLD_POSITION_MORE',
								'HOLD_POSITION_NINE',
								'HOLD_POSITION_ONE',
								'HOLD_POSITION_SEVEN',
								'HOLD_POSITION_SIX',
								'HOLD_POSITION_TEN',
								'HOLD_POSITION_THREE',
								'HOLD_POSITION_TWO',
								'HOLD_POSITION_ZERO',
								'HOLD_WAIT',
								'INCOMING_CALL_FROM_GROUP',
								'MENU',
								'MENU_OPTION',
								'NEXT_TARGET',
								'POWER_DIALER_CALL_GREETING',
								'POWER_DIALER_VM_DROP',
								'PREFERRED_OPERATOR_PROMPT',
								'VM_DROP_MESSAGE',
								'VM_UNAVAILABLE',
								'VM_UNAVAILABLE_CLOSED',
							])
							.or(z.string())
							.nullable()
							.optional(),
						ivrs: z
							.array(
								z
									.object({
										date_added: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										description: z.string().nullable().optional(),
										id: dialpadInteger(z.number().int()).nullable().optional(),
										name: z.string().nullable().optional(),
										selected: z.boolean().nullable().optional(),
										text: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input87 = z
	.object({
		path: z
			.object({
				ivr_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				description: z.string().nullable().optional(),
				name: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output87 = z
	.object({
		date_added: dialpadInteger(z.number().int()).nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		selected: z.boolean().nullable().optional(),
		text: z.string().nullable().optional(),
	})
	.loose();

const Input88 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output88 = z
	.object({
		auto_call_recording: z.boolean().nullable().optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queuing: z.boolean().nullable().optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input89 = z
	.object({
		body: z
			.object({
				description: z.string().nullable().optional(),
				file: z.string(),
				ivr_type: z.enum([
					'ADMIN_AUTO_RECORDING',
					'ASK_FIRST_OPERATOR_NOT_AVAILABLE',
					'AUTO_RECORDING',
					'CALLAI_AUTO_RECORDING',
					'CALLAI_AUTO_RECORDING_INBOUND',
					'CALLAI_AUTO_RECORDING_OUTBOUND',
					'CALLAI_TOGGLE_DISABLED',
					'CALLAI_TOGGLE_ENABLED',
					'CG_AUTO_RECORDING',
					'CLOSED',
					'CLOSED_DEPARTMENT_INTRO',
					'CLOSED_MENU',
					'CLOSED_MENU_OPTION',
					'CSAT_INTRO',
					'CSAT_OUTRO',
					'CSAT_PREAMBLE',
					'CSAT_QUESTION',
					'DEPARTMENT_INTRO',
					'GREETING',
					'HOLD_AGENT_READY',
					'HOLD_APPREC',
					'HOLD_CALLBACK_ACCEPT',
					'HOLD_CALLBACK_ACCEPTED',
					'HOLD_CALLBACK_CONFIRM',
					'HOLD_CALLBACK_CONFIRM_NUMBER',
					'HOLD_CALLBACK_DIFFERENT_NUMBER',
					'HOLD_CALLBACK_DIRECT',
					'HOLD_CALLBACK_FULFILLED',
					'HOLD_CALLBACK_INVALID_NUMBER',
					'HOLD_CALLBACK_KEYPAD',
					'HOLD_CALLBACK_REJECT',
					'HOLD_CALLBACK_REJECTED',
					'HOLD_CALLBACK_REQUEST',
					'HOLD_CALLBACK_REQUESTED',
					'HOLD_CALLBACK_SAME_NUMBER',
					'HOLD_CALLBACK_TRY_AGAIN',
					'HOLD_CALLBACK_UNDIALABLE',
					'HOLD_ESCAPE_VM_EIGHT',
					'HOLD_ESCAPE_VM_FIVE',
					'HOLD_ESCAPE_VM_FOUR',
					'HOLD_ESCAPE_VM_NINE',
					'HOLD_ESCAPE_VM_ONE',
					'HOLD_ESCAPE_VM_POUND',
					'HOLD_ESCAPE_VM_SEVEN',
					'HOLD_ESCAPE_VM_SIX',
					'HOLD_ESCAPE_VM_STAR',
					'HOLD_ESCAPE_VM_TEN',
					'HOLD_ESCAPE_VM_THREE',
					'HOLD_ESCAPE_VM_TWO',
					'HOLD_ESCAPE_VM_ZERO',
					'HOLD_ESTIMATED_WAIT_TIME',
					'HOLD_INTERRUPT',
					'HOLD_INTRO',
					'HOLD_MUSIC',
					'HOLD_POSITION_EIGHT',
					'HOLD_POSITION_FIVE',
					'HOLD_POSITION_FOUR',
					'HOLD_POSITION_MORE',
					'HOLD_POSITION_NINE',
					'HOLD_POSITION_ONE',
					'HOLD_POSITION_SEVEN',
					'HOLD_POSITION_SIX',
					'HOLD_POSITION_TEN',
					'HOLD_POSITION_THREE',
					'HOLD_POSITION_TWO',
					'HOLD_POSITION_ZERO',
					'HOLD_WAIT',
					'INCOMING_CALL_FROM_GROUP',
					'MENU',
					'MENU_OPTION',
					'NEXT_TARGET',
					'POWER_DIALER_CALL_GREETING',
					'POWER_DIALER_VM_DROP',
					'PREFERRED_OPERATOR_PROMPT',
					'VM_DROP_MESSAGE',
					'VM_UNAVAILABLE',
					'VM_UNAVAILABLE_CLOSED',
				]),
				name: z.string().nullable().optional(),
				target_id: dialpadInteger(z.number().int()),
				target_type: z.enum([
					'callcenter',
					'coachingteam',
					'department',
					'office',
					'user',
				]),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output89 = z
	.object({
		date_added: dialpadInteger(z.number().int()).nullable().optional(),
		description: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		selected: z.boolean().nullable().optional(),
		text: z.string().nullable().optional(),
	})
	.loose();

const Input90 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				auto_call_recording: z.boolean().nullable().optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				group_description: z.string().nullable().optional(),
				hold_queue: z
					.object({
						allow_queuing: z.boolean().nullable().optional(),
						max_hold_count: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						max_hold_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				hours_on: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string().nullable().optional(),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
						open: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
					})
					.strict()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				voice_intelligence: z
					.object({
						allow_pause: z.boolean().nullable().optional(),
						auto_start: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output90 = z
	.object({
		auto_call_recording: z.boolean().nullable().optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queuing: z.boolean().nullable().optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input91 = z
	.object({
		body: z
			.object({
				auto_call_recording: z.boolean().nullable().optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				group_description: z.string().nullable().optional(),
				hold_queue: z
					.object({
						allow_queuing: z.boolean().nullable().optional(),
						max_hold_count: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						max_hold_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
					})
					.strict()
					.optional(),
				hours_on: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string(),
				office_id: dialpadInteger(z.number().int()),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
						open: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
					})
					.strict()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				voice_intelligence: z
					.object({
						allow_pause: z.boolean().nullable().optional(),
						auto_start: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output91 = z
	.object({
		auto_call_recording: z.boolean().nullable().optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queuing: z.boolean().nullable().optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input92 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				office_id: dialpadInteger(z.number().int()).optional(),
				name_search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output92 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						auto_call_recording: z.boolean().nullable().optional(),
						availability_status: z
							.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
							.or(z.string())
							.nullable()
							.optional(),
						country: z.string().nullable().optional(),
						first_action: z
							.enum(['menu', 'operators'])
							.or(z.string())
							.nullable()
							.optional(),
						friday_hours: z.array(z.string()).nullable().optional(),
						group_description: z.string().nullable().optional(),
						hold_queue: z
							.object({
								allow_queuing: z.boolean().nullable().optional(),
								max_hold_count: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								max_hold_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
							})
							.loose()
							.optional(),
						hours_on: z.boolean().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						monday_hours: z.array(z.string()).nullable().optional(),
						name: z.string().nullable().optional(),
						no_operators_action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string())
							.nullable()
							.optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						routing_options: z
							.object({
								closed: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
								open: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
							})
							.loose()
							.optional(),
						saturday_hours: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						sunday_hours: z.array(z.string()).nullable().optional(),
						thursday_hours: z.array(z.string()).nullable().optional(),
						timezone: z.string().nullable().optional(),
						tuesday_hours: z.array(z.string()).nullable().optional(),
						voice_intelligence: z
							.object({
								allow_pause: z.boolean().nullable().optional(),
								auto_start: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						voicemail_notification_emails: z
							.array(z.string())
							.nullable()
							.optional(),
						wednesday_hours: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input93 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output93 = z
	.object({
		auto_call_recording: z.boolean().nullable().optional(),
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		group_description: z.string().nullable().optional(),
		hold_queue: z
			.object({
				allow_queuing: z.boolean().nullable().optional(),
				max_hold_count: dialpadInteger(z.number().int()).nullable().optional(),
				max_hold_seconds: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
		hours_on: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voice_intelligence: z
			.object({
				allow_pause: z.boolean().nullable().optional(),
				auto_start: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input94 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				operator_id: dialpadInteger(z.number().int()),
				operator_type: z.enum(['room', 'user']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output94 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input95 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output95 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input96 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				end_date: z.string(),
				target_id: dialpadInteger(z.number().int()).optional(),
				target_type: z.enum(['callcenter', 'department', 'office']).optional(),
				start_date: z.string(),
			})
			.strict(),
	})
	.strict();

const Output96 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						agent_group_id: z.array(z.string()).nullable().optional(),
						agent_group_name: z.array(z.string()).nullable().optional(),
						agent_handled: z.boolean().nullable().optional(),
						agent_message_count: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						agent_transfer: z.boolean().nullable().optional(),
						aicsat_score: z.number().nullable().optional(),
						bot_time: z.string().nullable().optional(),
						cause: z.string().nullable().optional(),
						chat_type: z.string().nullable().optional(),
						created_at: z.string().nullable().optional(),
						customer: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						customer_channel_info: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						customer_csat_score: z.number().nullable().optional(),
						customer_session_id: z.string(),
						direction: z.string().nullable().optional(),
						disposition: z.array(z.string()).nullable().optional(),
						duration: z.number().nullable().optional(),
						email_subject: z.string().nullable().optional(),
						ended_at: z.string().nullable().optional(),
						office: z
							.object({
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						queue_time: z.string().nullable().optional(),
						queued_status: z.string().nullable().optional(),
						session_account: z
							.object({
								email: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								phone: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						session_channel: z.string().nullable().optional(),
						session_id: z.string(),
						skill: z.string().nullable().optional(),
						survey_status: z.string().nullable().optional(),
						target: z
							.object({
								id: z.string().nullable().optional(),
								name: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						user: z
							.object({
								display_name: z.string().nullable().optional(),
								id: z.string().nullable().optional(),
								primary_email: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						wrap_up_time: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input97 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['add_target', 'remove_target']).nullable().optional(),
				dispositions: z.object({}).strict().nullable().optional(),
				name: z.string().nullable().optional(),
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum(['callcenter', 'coachinggroup', 'coachingteam', 'unknown'])
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output97 = z
	.object({
		date_modified: z.string().nullable().optional(),
		dispositions: z.object({}).loose().nullable().optional(),
		formatted_dispositions: z
			.array(
				z
					.object({
						dispositions: z
							.array(
								z
									.object({
										name: z.string().nullable().optional(),
										usage: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						name: z.string().nullable().optional(),
						usage: z
							.enum(['everything', 'inbound', 'outbound'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		targets: z.array(z.object({}).loose()).nullable().optional(),
	})
	.loose();

const Input98 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output98 = z
	.object({
		date_modified: z.string().nullable().optional(),
		dispositions: z.object({}).loose().nullable().optional(),
		formatted_dispositions: z
			.array(
				z
					.object({
						dispositions: z
							.array(
								z
									.object({
										name: z.string().nullable().optional(),
										usage: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						name: z.string().nullable().optional(),
						usage: z
							.enum(['everything', 'inbound', 'outbound'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		targets: z.array(z.object({}).loose()).nullable().optional(),
	})
	.loose();

const Input99 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				on_duty: z.boolean().optional(),
				role: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output99 = z
	.object({
		rooms: z
			.array(
				z
					.object({
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						is_free: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		users: z
			.array(
				z
					.object({
						admin_office_ids: z
							.array(dialpadInteger(z.number().int()))
							.nullable()
							.optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						date_active: z.string().nullable().optional(),
						date_added: z.string().nullable().optional(),
						date_first_login: z.string().nullable().optional(),
						date_last_login: z.string().optional(),
						display_name: z.string().nullable().optional(),
						do_not_disturb: z.boolean().nullable().optional(),
						duty_status_reason: z.string().nullable().optional(),
						duty_status_started: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						forwarding_numbers: z.array(z.string()).nullable().optional(),
						group_details: z
							.array(
								z
									.object({
										do_not_disturb: z.boolean().nullable().optional(),
										group_id: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										group_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'coachingteam',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.nullable()
											.optional(),
										role: z
											.enum(['admin', 'operator', 'supervisor'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						international_dialing_enabled: z.boolean().nullable().optional(),
						is_admin: z.boolean().nullable().optional(),
						is_available: z.boolean().nullable().optional(),
						is_company_admin: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						is_online: z.boolean().nullable().optional(),
						is_super_admin: z.boolean().nullable().optional(),
						job_title: z.string().nullable().optional(),
						language: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						license: z
							.enum([
								'admins',
								'agents',
								'dpde_all',
								'dpde_one',
								'lite_lines',
								'lite_support_agents',
								'magenta_lines',
								'talk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						location: z.string().nullable().optional(),
						muted: z.boolean().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						on_duty_started: z.string().nullable().optional(),
						on_duty_status: z
							.enum([
								'available',
								'busy',
								'occupied',
								'occupied-end',
								'unavailable',
								'wrapup',
								'wrapup-end',
							])
							.or(z.string())
							.nullable()
							.optional(),
						onboarding_completed: z.boolean(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						remote_service: z.string().nullable().optional(),
						session_type: z
							.enum(['call', 'digital'])
							.or(z.string())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						status_message: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						voicemail: z
							.object({
								is_default_voicemail: z.boolean().optional(),
								name: z.string().nullable().optional(),
								voicemail_notifications_enabled: z.boolean().optional(),
							})
							.loose(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input100 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				target_id: dialpadInteger(z.number().int()).optional(),
				target_type: z
					.enum([
						'callcenter',
						'coachinggroup',
						'coachingteam',
						'office',
						'unknown',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output100 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						date_modified: z.string().nullable().optional(),
						dispositions: z.object({}).loose().nullable().optional(),
						formatted_dispositions: z
							.array(
								z
									.object({
										dispositions: z
											.array(
												z
													.object({
														name: /* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
															.unknown()
															.optional(),
														usage:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.loose(),
											)
											.nullable()
											.optional(),
										name: z.string().nullable().optional(),
										usage: z
											.enum(['everything', 'inbound', 'outbound'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						targets: z.array(z.object({}).loose()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input101 = z
	.object({
		body: z
			.object({
				dispositions: z.object({}).strict().nullable().optional(),
				name: z.string(),
				office_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output101 = z
	.object({
		date_modified: z.string().nullable().optional(),
		dispositions: z.object({}).loose().nullable().optional(),
		formatted_dispositions: z
			.array(
				z
					.object({
						dispositions: z
							.array(
								z
									.object({
										name: z.string().nullable().optional(),
										usage: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						name: z.string().nullable().optional(),
						usage: z
							.enum(['everything', 'inbound', 'outbound'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		targets: z.array(z.object({}).loose()).nullable().optional(),
	})
	.loose();

const Input102 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				operator_id: dialpadInteger(z.number().int()),
				operator_type: z.enum(['room', 'user']),
				role: z.enum(['admin', 'operator']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output102 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input103 = z
	.object({
		body: z
			.object({
				line: z.union([
					z
						.object({
							number: z.string(),
							type: z.enum(['reserved']),
						})
						.strict(),
					z
						.object({
							area_code: z.string(),
							type: z.enum(['search']),
						})
						.strict(),
					z
						.object({
							type: z.enum(['tollfree']),
						})
						.strict(),
				]),
				target: z
					.object({
						target_id: dialpadInteger(z.number().int()),
						target_type: z.enum(['department', 'user']),
					})
					.strict(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output103 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		number: z.string(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input104 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		query: z
			.object({
				user_id: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output104 = z
	.object({
		bulk_message_id: z.string().nullable().optional(),
		classified_spam: z.boolean().nullable().optional(),
		created_date: dialpadInteger(z.number().int()).nullable().optional(),
		from_number: z.string().nullable().optional(),
		media: z.string().nullable().optional(),
		num_recipients: dialpadInteger(z.number().int()).nullable().optional(),
		recipients: z
			.array(
				z
					.object({
						attempted_send: z.boolean().nullable().optional(),
						delivery_error_code: z.string().nullable().optional(),
						delivery_error_details: z.string().nullable().optional(),
						delivery_method: z.string().nullable().optional(),
						delivery_status: z.string().nullable().optional(),
						delivery_status_timestamp: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						display_name: z.string().nullable().optional(),
						error_message: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		sms_has_errors: z.boolean().nullable().optional(),
		status: z
			.enum(['complete', 'pending'])
			.or(z.string())
			.nullable()
			.optional(),
		text: z.string(),
		title: z.string().nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input105 = z
	.object({
		body: z
			.object({
				from_number: z.string().nullable().optional(),
				infer_country_code: z.boolean().nullable().optional(),
				to_number: z.string(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output105 = z
	.object({
		contact_id: dialpadInteger(z.number().int()).nullable().optional(),
		created_date: z.string().nullable().optional(),
		direction: z
			.enum(['inbound', 'outbound'])
			.or(z.string())
			.nullable()
			.optional(),
		fax_status: z
			.enum(['error', 'pending', 'success', 'suspended', 'transmitting'])
			.or(z.string())
			.nullable()
			.optional(),
		fax_transaction: z
			.object({
				is_billed: z.boolean().nullable().optional(),
				num_pages: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.loose()
			.optional(),
		fax_url: z.string().nullable().optional(),
		from_number: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		sender_id: dialpadInteger(z.number().int()).nullable().optional(),
		to_number: z.string().nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input106 = z
	.object({
		body: z
			.object({
				from_number: z.string(),
				media: z.string().nullable().optional(),
				text: z.string(),
				title: z.string().nullable().optional(),
				to_numbers: z.array(z.string()),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output106 = z
	.object({
		bulk_message: z
			.object({
				bulk_message_id: z.string().nullable().optional(),
				classified_spam: z.boolean().nullable().optional(),
				created_date: dialpadInteger(z.number().int()).nullable().optional(),
				from_number: z.string().nullable().optional(),
				media: z.string().nullable().optional(),
				num_recipients: dialpadInteger(z.number().int()).nullable().optional(),
				recipients: z
					.array(
						z
							.object({
								attempted_send: z.boolean().nullable().optional(),
								delivery_error_code: z.string().nullable().optional(),
								delivery_error_details: z.string().nullable().optional(),
								delivery_method: z.string().nullable().optional(),
								delivery_status: z.string().nullable().optional(),
								delivery_status_timestamp: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								display_name: z.string().nullable().optional(),
								error_message: z.string().nullable().optional(),
								phone_number: z.string().nullable().optional(),
							})
							.loose(),
					)
					.nullable()
					.optional(),
				sms_has_errors: z.boolean().nullable().optional(),
				status: z
					.enum(['complete', 'pending'])
					.or(z.string())
					.nullable()
					.optional(),
				text: z.string(),
				title: z.string().nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.loose()
			.optional(),
		message: z.string().nullable().optional(),
		success: z.boolean().nullable().optional(),
	})
	.loose();

const Input107 = z
	.object({
		body: z
			.object({
				channel_hashtag: z.string().nullable().optional(),
				from_number: z.string().nullable().optional(),
				is_bulk: z.boolean().nullable().optional(),
				media: z.string().nullable().optional(),
				start_date: dialpadInteger(z.number().int()),
				text: z.string().nullable().optional(),
				timezone: z.string().nullable().optional(),
				to_numbers: z.array(z.string()).nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output107 = z
	.object({
		channel_hashtag: z.string().nullable().optional(),
		created_date: dialpadInteger(z.number().int()).nullable().optional(),
		from_number: z.string().nullable().optional(),
		media: z.string().nullable().optional(),
		schedule_id: z.string().nullable().optional(),
		scheduled_time: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum(['active', 'deleted', 'sent'])
			.or(z.string())
			.nullable()
			.optional(),
		text: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		to_numbers: z.array(z.string()).nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input108 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		query: z
			.object({
				user_id: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output108 = z
	.object({
		message: z.string().nullable().optional(),
		schedule_id: z.string().nullable().optional(),
		success: z.boolean().nullable().optional(),
	})
	.loose();

const Input109 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				media: z.string().nullable().optional(),
				text: z.string().nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output109 = z
	.object({
		bulk_message: z
			.object({
				bulk_message_id: z.string().nullable().optional(),
				classified_spam: z.boolean().nullable().optional(),
				created_date: dialpadInteger(z.number().int()).nullable().optional(),
				from_number: z.string().nullable().optional(),
				media: z.string().nullable().optional(),
				num_recipients: dialpadInteger(z.number().int()).nullable().optional(),
				recipients: z
					.array(
						z
							.object({
								attempted_send: z.boolean().nullable().optional(),
								delivery_error_code: z.string().nullable().optional(),
								delivery_error_details: z.string().nullable().optional(),
								delivery_method: z.string().nullable().optional(),
								delivery_status: z.string().nullable().optional(),
								delivery_status_timestamp: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								display_name: z.string().nullable().optional(),
								error_message: z.string().nullable().optional(),
								phone_number: z.string().nullable().optional(),
							})
							.loose(),
					)
					.nullable()
					.optional(),
				sms_has_errors: z.boolean().nullable().optional(),
				status: z
					.enum(['complete', 'pending'])
					.or(z.string())
					.nullable()
					.optional(),
				text: z.string(),
				title: z.string().nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.loose()
			.optional(),
		message: z.string().nullable().optional(),
		success: z.boolean().nullable().optional(),
	})
	.loose();

const Input110 = z
	.object({
		query: z
			.object({
				limit: dialpadInteger(z.number().int()).optional(),
				user_id: dialpadInteger(z.number().int()).optional(),
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output110 = z
	.object({
		bulk_messages: z
			.array(
				z
					.object({
						bulk_message_id: z.string().nullable().optional(),
						classified_spam: z.boolean().nullable().optional(),
						created_date: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						from_number: z.string().nullable().optional(),
						media: z.string().nullable().optional(),
						num_recipients: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						recipients: z
							.array(
								z
									.object({
										attempted_send: z.boolean().nullable().optional(),
										delivery_error_code: z.string().nullable().optional(),
										delivery_error_details: z.string().nullable().optional(),
										delivery_method: z.string().nullable().optional(),
										delivery_status: z.string().nullable().optional(),
										delivery_status_timestamp: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										display_name: z.string().nullable().optional(),
										error_message: z.string().nullable().optional(),
										phone_number: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						sms_has_errors: z.boolean().nullable().optional(),
						status: z
							.enum(['complete', 'pending'])
							.or(z.string())
							.nullable()
							.optional(),
						text: z.string(),
						title: z.string().nullable().optional(),
						user_id: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		cursor: z.string().nullable().optional(),
		has_more: z.boolean().nullable().optional(),
	})
	.loose();

const Input111 = z
	.object({
		query: z
			.object({
				limit: dialpadInteger(z.number().int()).optional(),
				user_id: dialpadInteger(z.number().int()).optional(),
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output111 = z
	.object({
		cursor: z.string().nullable().optional(),
		has_more: z.boolean().nullable().optional(),
		schedules: z
			.array(
				z
					.object({
						channel_hashtag: z.string().nullable().optional(),
						created_date: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						from_number: z.string().nullable().optional(),
						media: z.string().nullable().optional(),
						schedule_id: z.string().nullable().optional(),
						scheduled_time: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						status: z
							.enum(['active', 'deleted', 'sent'])
							.or(z.string())
							.nullable()
							.optional(),
						text: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						to_numbers: z.array(z.string()).nullable().optional(),
						user_id: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input112 = z
	.object({
		path: z
			.object({
				number: z.string(),
			})
			.strict(),
		query: z
			.object({
				release: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output112 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input113 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		query: z
			.object({
				user_id: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output113 = z
	.object({
		channel_hashtag: z.string().nullable().optional(),
		created_date: dialpadInteger(z.number().int()).nullable().optional(),
		from_number: z.string().nullable().optional(),
		media: z.string().nullable().optional(),
		schedule_id: z.string().nullable().optional(),
		scheduled_time: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum(['active', 'deleted', 'sent'])
			.or(z.string())
			.nullable()
			.optional(),
		text: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		to_numbers: z.array(z.string()).nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input114 = z
	.object({
		path: z
			.object({
				number: z.string(),
			})
			.strict(),
		body: z
			.object({
				primary: z.boolean().nullable().optional(),
				target_id: dialpadInteger(z.number().int()),
				target_type: z.enum([
					'callcenter',
					'callrouter',
					'channel',
					'coachinggroup',
					'coachingteam',
					'department',
					'office',
					'room',
					'staffgroup',
					'unknown',
					'user',
				]),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output114 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input115 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output115 = z
	.object({
		message: z.string().nullable().optional(),
		schedule_id: z.string().nullable().optional(),
		success: z.boolean().nullable().optional(),
	})
	.loose();

const Input116 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				area_code: z.string().optional(),
				status: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output116 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						area_code: z.string().nullable().optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						deleted: z.boolean().nullable().optional(),
						number: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						status: z
							.enum([
								'available',
								'call_center',
								'call_router',
								'call_service',
								'department',
								'dynamic_caller',
								'office',
								'pending',
								'porting',
								'room',
								'shared_line',
								'sip_trunk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						target_id: dialpadInteger(z.number().int()).nullable().optional(),
						target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						type: z
							.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input117 = z
	.object({
		body: z
			.object({
				area_code: z.string().nullable().optional(),
				number: z.string().nullable().optional(),
				primary: z.boolean().nullable().optional(),
				target_id: dialpadInteger(z.number().int()),
				target_type: z.enum([
					'callcenter',
					'callrouter',
					'channel',
					'coachinggroup',
					'coachingteam',
					'department',
					'office',
					'room',
					'staffgroup',
					'unknown',
					'user',
				]),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output117 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input118 = z
	.object({
		body: z
			.object({
				swap_details: z
					.union([
						z
							.object({
								area_code: z.string().nullable().optional(),
								type: z.enum(['area_code']),
							})
							.strict(),
						z
							.object({
								type: z.enum(['auto']),
							})
							.strict(),
						z
							.object({
								number: z.string().nullable().optional(),
								type: z.enum(['provided_number']),
							})
							.strict(),
					])
					.optional(),
				target: z
					.object({
						target_id: dialpadInteger(z.number().int()),
						target_type: z.enum([
							'callcenter',
							'callrouter',
							'channel',
							'coachinggroup',
							'coachingteam',
							'department',
							'office',
							'room',
							'staffgroup',
							'unknown',
							'user',
						]),
					})
					.strict(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output118 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input119 = z
	.object({
		body: z
			.object({
				do_not_call: z.boolean().nullable().optional(),
				do_not_text: z.boolean().nullable().optional(),
				phone: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output119 = z
	.object({
		do_not_call: z.boolean().nullable().optional(),
		do_not_text: z.boolean().nullable().optional(),
		phone: z.string().nullable().optional(),
	})
	.loose();

const Input120 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				channel_hashtag: z.string().nullable().optional(),
				from_number: z.string().nullable().optional(),
				media: z.string().nullable().optional(),
				start_date: dialpadInteger(z.number().int()).nullable().optional(),
				text: z.string().nullable().optional(),
				timezone: z.string().nullable().optional(),
				to_numbers: z.array(z.string()).nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output120 = z
	.object({
		channel_hashtag: z.string().nullable().optional(),
		created_date: dialpadInteger(z.number().int()).nullable().optional(),
		from_number: z.string().nullable().optional(),
		media: z.string().nullable().optional(),
		schedule_id: z.string().nullable().optional(),
		scheduled_time: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum(['active', 'deleted', 'sent'])
			.or(z.string())
			.nullable()
			.optional(),
		text: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		to_numbers: z.array(z.string()).nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input121 = z
	.object({
		path: z
			.object({
				number: z.string(),
			})
			.strict(),
	})
	.strict();

const Output121 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input122 = z
	.object({
		path: z
			.object({
				office_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output122 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						allow_trainee_eavesdrop: z.boolean().nullable().optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						team_description: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input123 = z
	.object({
		path: z
			.object({
				office_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output123 = z
	.object({
		additional_number_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		balance: z.string().nullable().optional(),
		contact_center_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		fax_lines: dialpadInteger(z.number().int()).nullable().optional(),
		next_billing_date: dialpadInteger(z.number().int()).nullable().optional(),
		ppu_address: z
			.object({
				address_line_1: z.string().nullable().optional(),
				address_line_2: z.string().nullable().optional(),
				city: z.string().nullable().optional(),
				country: z.string().nullable().optional(),
				postal_code: z.string().nullable().optional(),
				region: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		room_lines: dialpadInteger(z.number().int()).nullable().optional(),
		sell_lines: dialpadInteger(z.number().int()).nullable().optional(),
		state: z
			.enum(['archived', 'disputed', 'free', 'hold', 'paid', 'trial'])
			.or(z.string())
			.nullable()
			.optional(),
		talk_lines: dialpadInteger(z.number().int()).nullable().optional(),
		tollfree_additional_number_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		tollfree_room_lines: dialpadInteger(z.number().int()).nullable().optional(),
		tollfree_uberconference_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		uberconference_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
	})
	.loose();

const Input124 = z
	.object({
		query: z
			.object({
				country_code: z.string().optional(),
				number: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output124 = z
	.object({
		area_code: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		e164_number: z.string().nullable().optional(),
		local_number: z.string().nullable().optional(),
	})
	.loose();

const Input125 = z
	.object({
		path: z
			.object({
				office_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output125 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						auto_call_recording: z.boolean().nullable().optional(),
						availability_status: z
							.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
							.or(z.string())
							.nullable()
							.optional(),
						country: z.string().nullable().optional(),
						first_action: z
							.enum(['menu', 'operators'])
							.or(z.string())
							.nullable()
							.optional(),
						friday_hours: z.array(z.string()).nullable().optional(),
						group_description: z.string().nullable().optional(),
						hold_queue: z
							.object({
								allow_queuing: z.boolean().nullable().optional(),
								max_hold_count: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								max_hold_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
							})
							.loose()
							.optional(),
						hours_on: z.boolean().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						monday_hours: z.array(z.string()).nullable().optional(),
						name: z.string().nullable().optional(),
						no_operators_action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string())
							.nullable()
							.optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						routing_options: z
							.object({
								closed: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
								open: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
							})
							.loose()
							.optional(),
						saturday_hours: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						sunday_hours: z.array(z.string()).nullable().optional(),
						thursday_hours: z.array(z.string()).nullable().optional(),
						timezone: z.string().nullable().optional(),
						tuesday_hours: z.array(z.string()).nullable().optional(),
						voice_intelligence: z
							.object({
								allow_pause: z.boolean().nullable().optional(),
								auto_start: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						voicemail_notification_emails: z
							.array(z.string())
							.nullable()
							.optional(),
						wednesday_hours: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input126 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				number: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output126 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input127 = z
	.object({
		path: z
			.object({
				office_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output127 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						advanced_settings: z
							.object({
								auto_call_recording: z
									.object({
										allow_pause_recording: z.boolean().nullable().optional(),
										call_recording_inbound: z.boolean().nullable().optional(),
										call_recording_outbound: z.boolean().nullable().optional(),
									})
									.loose()
									.optional(),
								max_wrap_up_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
							})
							.loose()
							.optional(),
						alerts: z
							.object({
								cc_service_level: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								cc_service_level_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
							})
							.loose()
							.optional(),
						availability_status: z
							.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
							.or(z.string())
							.nullable()
							.optional(),
						country: z.string().nullable().optional(),
						first_action: z
							.enum(['menu', 'operators'])
							.or(z.string())
							.nullable()
							.optional(),
						friday_hours: z.array(z.string()).nullable().optional(),
						group_description: z.string().nullable().optional(),
						hold_queue: z
							.object({
								allow_queue_callback: z.boolean().nullable().optional(),
								announce_estimated_wait_time: z.boolean().nullable().optional(),
								announce_position: z.boolean().nullable().optional(),
								announcement_interval_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								estimated_wait_time_max: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								max_hold_count: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								max_hold_seconds: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								queue_callback_dtmf: z.string().nullable().optional(),
								queue_callback_threshold: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								queue_escape_dtmf: z.string().nullable().optional(),
								stay_in_queue_after_closing: z.boolean().nullable().optional(),
								unattended_queue: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						hours_on: z.boolean().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						is_digital: z.boolean().nullable().optional(),
						monday_hours: z.array(z.string()).nullable().optional(),
						name: z.string().nullable().optional(),
						no_operators_action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string())
							.nullable()
							.optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						routing_options: z
							.object({
								closed: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
								open: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
							})
							.loose()
							.optional(),
						saturday_hours: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						sunday_hours: z.array(z.string()).nullable().optional(),
						thursday_hours: z.array(z.string()).nullable().optional(),
						timezone: z.string().nullable().optional(),
						tuesday_hours: z.array(z.string()).nullable().optional(),
						voice_intelligence: z
							.object({
								allow_pause: z.boolean().nullable().optional(),
								auto_start: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						voicemail_notification_emails: z
							.array(z.string())
							.nullable()
							.optional(),
						wednesday_hours: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input128 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				area_code: z.string().nullable().optional(),
				number: z.string().nullable().optional(),
				primary: z.boolean().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output128 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input129 = z
	.object({
		path: z
			.object({
				office_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output129 = z
	.object({
		additional_number_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		admin_lines: dialpadInteger(z.number().int()).nullable().optional(),
		base_user_lines: dialpadInteger(z.number().int()).nullable().optional(),
		contact_center_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		dpde_all_lines: dialpadInteger(z.number().int()).nullable().optional(),
		dpde_one_lines: dialpadInteger(z.number().int()).nullable().optional(),
		fax_lines: dialpadInteger(z.number().int()).nullable().optional(),
		lite_lines: dialpadInteger(z.number().int()).nullable().optional(),
		room_lines: dialpadInteger(z.number().int()).nullable().optional(),
		sell_lines: dialpadInteger(z.number().int()).nullable().optional(),
		talk_lines: dialpadInteger(z.number().int()).nullable().optional(),
		tollfree_additional_number_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		tollfree_room_lines: dialpadInteger(z.number().int()).nullable().optional(),
		tollfree_uberconference_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
		uberconference_lines: dialpadInteger(z.number().int())
			.nullable()
			.optional(),
	})
	.loose();

const Input130 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output130 = z
	.object({
		address: z.string().nullable().optional(),
		address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
	})
	.loose();

const Input131 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output131 = z
	.object({
		id: dialpadInteger(z.number().int()).nullable().optional(),
		off_duty_statuses: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input132 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				address: z.string(),
				address2: z.string().nullable().optional(),
				city: z.string(),
				country: z.string(),
				state: z.string(),
				update_all: z.boolean().nullable().optional(),
				use_validated_option: z.boolean().nullable().optional(),
				zip: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output132 = z
	.object({
		address: z.string().nullable().optional(),
		address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
	})
	.loose();

const Input133 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				friday_hours: z.array(z.string()).nullable().optional(),
				hours_on: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output133 = z
	.object({
		office: z
			.object({
				availability_status: z
					.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
					.or(z.string())
					.nullable()
					.optional(),
				country: z.string().nullable().optional(),
				e911_address: z
					.object({
						address: z.string().nullable().optional(),
						address2: z.string().nullable().optional(),
						city: z.string().nullable().optional(),
						country: z.string().nullable().optional(),
						state: z.string().nullable().optional(),
						zip: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				first_action: z
					.enum(['menu', 'operators'])
					.or(z.string())
					.nullable()
					.optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				is_primary_office: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string().nullable().optional(),
				no_operators_action: z
					.enum([
						'ai_agent',
						'bridge_target',
						'call_service_target',
						'company_directory',
						'department',
						'directory',
						'disabled',
						'extension',
						'google_dialogflow',
						'last_name_company_directory',
						'last_name_directory',
						'menu',
						'message',
						'operator',
						'person',
						'recursive_transfer',
						'scripted_ivr',
						'voicemail',
					])
					.or(z.string())
					.nullable()
					.optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				office_settings: z
					.object({
						allow_device_guest_login: z.boolean().nullable().optional(),
						block_caller_id_disabled: z.boolean().nullable().optional(),
						bridged_target_recording_allowed: z.boolean().nullable().optional(),
						disable_desk_phone_self_provision: z
							.boolean()
							.nullable()
							.optional(),
						disable_ivr_voicemail: z.boolean().nullable().optional(),
						no_recording_message_on_user_calls: z
							.boolean()
							.nullable()
							.optional(),
						set_caller_id_disabled: z.boolean().nullable().optional(),
					})
					.loose()
					.optional(),
				phone_numbers: z.array(z.string()).nullable().optional(),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z
									.enum([
										'ai_agent',
										'bridge_target',
										'call_service_target',
										'company_directory',
										'department',
										'directory',
										'disabled',
										'extension',
										'google_dialogflow',
										'last_name_company_directory',
										'last_name_directory',
										'menu',
										'message',
										'operator',
										'person',
										'recursive_transfer',
										'scripted_ivr',
										'voicemail',
									])
									.or(z.string()),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.or(z.string())
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												options:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.or(z.string())
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.loose(),
						open: z
							.object({
								action: z
									.enum([
										'ai_agent',
										'bridge_target',
										'call_service_target',
										'company_directory',
										'department',
										'directory',
										'disabled',
										'extension',
										'google_dialogflow',
										'last_name_company_directory',
										'last_name_directory',
										'menu',
										'message',
										'operator',
										'person',
										'recursive_transfer',
										'scripted_ivr',
										'voicemail',
									])
									.or(z.string()),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.or(z.string())
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												options:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.or(z.string())
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.loose(),
					})
					.loose()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				state: z
					.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
					.or(z.string())
					.nullable()
					.optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				timezone: z.string().nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				voicemail_notification_emails: z
					.array(z.string())
					.nullable()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.loose()
			.optional(),
		plan: z
			.object({
				additional_number_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				balance: z.string().nullable().optional(),
				contact_center_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				fax_lines: dialpadInteger(z.number().int()).nullable().optional(),
				next_billing_date: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				ppu_address: z
					.object({
						address_line_1: z.string().nullable().optional(),
						address_line_2: z.string().nullable().optional(),
						city: z.string().nullable().optional(),
						country: z.string().nullable().optional(),
						postal_code: z.string().nullable().optional(),
						region: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				room_lines: dialpadInteger(z.number().int()).nullable().optional(),
				sell_lines: dialpadInteger(z.number().int()).nullable().optional(),
				state: z
					.enum(['archived', 'disputed', 'free', 'hold', 'paid', 'trial'])
					.or(z.string())
					.nullable()
					.optional(),
				talk_lines: dialpadInteger(z.number().int()).nullable().optional(),
				tollfree_additional_number_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				tollfree_room_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				tollfree_uberconference_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				uberconference_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input134 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output134 = z
	.object({
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		e911_address: z
			.object({
				address: z.string().nullable().optional(),
				address2: z.string().nullable().optional(),
				city: z.string().nullable().optional(),
				country: z.string().nullable().optional(),
				state: z.string().nullable().optional(),
				zip: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_primary_office: z.boolean().nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		office_settings: z
			.object({
				allow_device_guest_login: z.boolean().nullable().optional(),
				block_caller_id_disabled: z.boolean().nullable().optional(),
				bridged_target_recording_allowed: z.boolean().nullable().optional(),
				disable_desk_phone_self_provision: z.boolean().nullable().optional(),
				disable_ivr_voicemail: z.boolean().nullable().optional(),
				no_recording_message_on_user_calls: z.boolean().nullable().optional(),
				set_caller_id_disabled: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input135 = z.object({}).strict();

const Output135 = z
	.object({
		availability_status: z
			.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
			.or(z.string())
			.nullable()
			.optional(),
		country: z.string().nullable().optional(),
		e911_address: z
			.object({
				address: z.string().nullable().optional(),
				address2: z.string().nullable().optional(),
				city: z.string().nullable().optional(),
				country: z.string().nullable().optional(),
				state: z.string().nullable().optional(),
				zip: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		first_action: z
			.enum(['menu', 'operators'])
			.or(z.string())
			.nullable()
			.optional(),
		friday_hours: z.array(z.string()).nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_primary_office: z.boolean().nullable().optional(),
		monday_hours: z.array(z.string()).nullable().optional(),
		name: z.string().nullable().optional(),
		no_operators_action: z
			.enum([
				'ai_agent',
				'bridge_target',
				'call_service_target',
				'company_directory',
				'department',
				'directory',
				'disabled',
				'extension',
				'google_dialogflow',
				'last_name_company_directory',
				'last_name_directory',
				'menu',
				'message',
				'operator',
				'person',
				'recursive_transfer',
				'scripted_ivr',
				'voicemail',
			])
			.or(z.string())
			.nullable()
			.optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		office_settings: z
			.object({
				allow_device_guest_login: z.boolean().nullable().optional(),
				block_caller_id_disabled: z.boolean().nullable().optional(),
				bridged_target_recording_allowed: z.boolean().nullable().optional(),
				disable_desk_phone_self_provision: z.boolean().nullable().optional(),
				disable_ivr_voicemail: z.boolean().nullable().optional(),
				no_recording_message_on_user_calls: z.boolean().nullable().optional(),
				set_caller_id_disabled: z.boolean().nullable().optional(),
			})
			.loose()
			.optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
		routing_options: z
			.object({
				closed: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
				open: z
					.object({
						action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string()),
						action_target_id: dialpadInteger(z.number().int()).optional(),
						action_target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'contact',
								'contactgroup',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.optional(),
						dtmf: z
							.array(
								z
									.object({
										input: z.string().nullable().optional(),
										options: z
											.object({
												action:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_id:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												action_target_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose()
											.optional(),
									})
									.loose(),
							)
							.optional(),
						operator_routing: z
							.enum([
								'autopark',
								'fixedorder',
								'longestidle',
								'mostskilled',
								'pinned_leg',
								'plivo_address',
								'random',
								'roundrobin',
								'simultaneous',
								'skills_based',
							])
							.or(z.string())
							.optional(),
						try_dial_operators: z.boolean(),
					})
					.loose(),
			})
			.loose()
			.optional(),
		saturday_hours: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		sunday_hours: z.array(z.string()).nullable().optional(),
		thursday_hours: z.array(z.string()).nullable().optional(),
		timezone: z.string().nullable().optional(),
		tuesday_hours: z.array(z.string()).nullable().optional(),
		voicemail_notification_emails: z.array(z.string()).nullable().optional(),
		wednesday_hours: z.array(z.string()).nullable().optional(),
	})
	.loose();

const Input136 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				name_search: z.string().optional(),
				active_only: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output136 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						availability_status: z
							.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
							.or(z.string())
							.nullable()
							.optional(),
						country: z.string().nullable().optional(),
						e911_address: z
							.object({
								address: z.string().nullable().optional(),
								address2: z.string().nullable().optional(),
								city: z.string().nullable().optional(),
								country: z.string().nullable().optional(),
								state: z.string().nullable().optional(),
								zip: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						first_action: z
							.enum(['menu', 'operators'])
							.or(z.string())
							.nullable()
							.optional(),
						friday_hours: z.array(z.string()).nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						is_primary_office: z.boolean().nullable().optional(),
						monday_hours: z.array(z.string()).nullable().optional(),
						name: z.string().nullable().optional(),
						no_operators_action: z
							.enum([
								'ai_agent',
								'bridge_target',
								'call_service_target',
								'company_directory',
								'department',
								'directory',
								'disabled',
								'extension',
								'google_dialogflow',
								'last_name_company_directory',
								'last_name_directory',
								'menu',
								'message',
								'operator',
								'person',
								'recursive_transfer',
								'scripted_ivr',
								'voicemail',
							])
							.or(z.string())
							.nullable()
							.optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						office_settings: z
							.object({
								allow_device_guest_login: z.boolean().nullable().optional(),
								block_caller_id_disabled: z.boolean().nullable().optional(),
								bridged_target_recording_allowed: z
									.boolean()
									.nullable()
									.optional(),
								disable_desk_phone_self_provision: z
									.boolean()
									.nullable()
									.optional(),
								disable_ivr_voicemail: z.boolean().nullable().optional(),
								no_recording_message_on_user_calls: z
									.boolean()
									.nullable()
									.optional(),
								set_caller_id_disabled: z.boolean().nullable().optional(),
							})
							.loose()
							.optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						ring_seconds: dialpadInteger(z.number().int())
							.nullable()
							.optional(),
						routing_options: z
							.object({
								closed: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
								open: z
									.object({
										action: z
											.enum([
												'ai_agent',
												'bridge_target',
												'call_service_target',
												'company_directory',
												'department',
												'directory',
												'disabled',
												'extension',
												'google_dialogflow',
												'last_name_company_directory',
												'last_name_directory',
												'menu',
												'message',
												'operator',
												'person',
												'recursive_transfer',
												'scripted_ivr',
												'voicemail',
											])
											.or(z.string()),
										action_target_id: dialpadInteger(
											z.number().int(),
										).optional(),
										action_target_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'contact',
												'contactgroup',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.optional(),
										dtmf: z
											.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
										operator_routing: z
											.enum([
												'autopark',
												'fixedorder',
												'longestidle',
												'mostskilled',
												'pinned_leg',
												'plivo_address',
												'random',
												'roundrobin',
												'simultaneous',
												'skills_based',
											])
											.or(z.string())
											.optional(),
										try_dial_operators: z.boolean(),
									})
									.loose(),
							})
							.loose()
							.optional(),
						saturday_hours: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						sunday_hours: z.array(z.string()).nullable().optional(),
						thursday_hours: z.array(z.string()).nullable().optional(),
						timezone: z.string().nullable().optional(),
						tuesday_hours: z.array(z.string()).nullable().optional(),
						voicemail_notification_emails: z
							.array(z.string())
							.nullable()
							.optional(),
						wednesday_hours: z.array(z.string()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input137 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				operator_id: dialpadInteger(z.number().int()),
				operator_type: z.enum(['room', 'user']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output137 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input138 = z
	.object({
		body: z
			.object({
				annual_commit_monthly_billing: z.boolean(),
				auto_call_recording: z.boolean().nullable().optional(),
				billing_address: z
					.object({
						address_line_1: z.string(),
						address_line_2: z.string().nullable().optional(),
						city: z.string(),
						country: z.string(),
						postal_code: z.string(),
						region: z.string(),
					})
					.strict(),
				billing_contact: z
					.object({
						email: z.string(),
						name: z.string(),
						phone: z.string().nullable().optional(),
					})
					.strict()
					.optional(),
				country: z.enum([
					'AE',
					'AM',
					'AR',
					'AT',
					'AU',
					'BD',
					'BE',
					'BG',
					'BH',
					'BO',
					'BR',
					'CA',
					'CH',
					'CI',
					'CL',
					'CN',
					'CO',
					'CR',
					'CY',
					'CZ',
					'DE',
					'DK',
					'DO',
					'DP',
					'EC',
					'EE',
					'EG',
					'ES',
					'FI',
					'FR',
					'GB',
					'GH',
					'GR',
					'GT',
					'HK',
					'HR',
					'HU',
					'ID',
					'IE',
					'IL',
					'IN',
					'IS',
					'IT',
					'JP',
					'KE',
					'KH',
					'KR',
					'KZ',
					'LI',
					'LK',
					'LT',
					'LU',
					'LV',
					'MA',
					'MD',
					'MM',
					'MT',
					'MX',
					'MY',
					'NG',
					'NL',
					'NO',
					'NZ',
					'PA',
					'PE',
					'PH',
					'PK',
					'PL',
					'PR',
					'PT',
					'PY',
					'RO',
					'RS',
					'RU',
					'SA',
					'SE',
					'SG',
					'SI',
					'SK',
					'SV',
					'TH',
					'TR',
					'TW',
					'UA',
					'US',
					'UY',
					'VE',
					'VI',
					'VN',
					'ZA',
				]),
				currency: z.enum(['AUD', 'CAD', 'EUR', 'GBP', 'JPY', 'NZD', 'USD']),
				e911_address: z
					.object({
						address: z.string(),
						address2: z.string().nullable().optional(),
						city: z.string(),
						country: z.string(),
						state: z.string(),
						zip: z.string(),
					})
					.strict()
					.optional(),
				first_action: z.enum(['menu', 'operators']).nullable().optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				group_description: z.string().nullable().optional(),
				hours_on: z.boolean().nullable().optional(),
				international_enabled: z.boolean().nullable().optional(),
				invoiced: z.boolean(),
				mainline_number: z.string().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string(),
				no_operators_action: z
					.enum([
						'ai_agent',
						'bridge_target',
						'call_service_target',
						'company_directory',
						'department',
						'directory',
						'disabled',
						'extension',
						'google_dialogflow',
						'last_name_company_directory',
						'last_name_directory',
						'menu',
						'message',
						'operator',
						'person',
						'recursive_transfer',
						'scripted_ivr',
						'voicemail',
					])
					.nullable()
					.optional(),
				plan_period: z.enum(['monthly', 'yearly']),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
						open: z
							.object({
								action: z.enum([
									'ai_agent',
									'bridge_target',
									'call_service_target',
									'company_directory',
									'department',
									'directory',
									'disabled',
									'extension',
									'google_dialogflow',
									'last_name_company_directory',
									'last_name_directory',
									'menu',
									'message',
									'operator',
									'person',
									'recursive_transfer',
									'scripted_ivr',
									'voicemail',
								]),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input: z.string().nullable().optional(),
												options: z
													.object({
														action:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_id:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
														action_target_type:
															/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
																.unknown()
																.optional(),
													})
													.strict()
													.optional(),
											})
											.strict(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.strict(),
					})
					.strict()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				timezone: z.string().nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				unified_billing: z.boolean(),
				use_same_address: z.boolean().nullable().optional(),
				voice_intelligence: z
					.object({
						allow_pause: z.boolean().nullable().optional(),
						auto_start: z.boolean().nullable().optional(),
					})
					.strict()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output138 = z
	.object({
		office: z
			.object({
				availability_status: z
					.enum(['closed', 'holiday_closed', 'holiday_open', 'open'])
					.or(z.string())
					.nullable()
					.optional(),
				country: z.string().nullable().optional(),
				e911_address: z
					.object({
						address: z.string().nullable().optional(),
						address2: z.string().nullable().optional(),
						city: z.string().nullable().optional(),
						country: z.string().nullable().optional(),
						state: z.string().nullable().optional(),
						zip: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				first_action: z
					.enum(['menu', 'operators'])
					.or(z.string())
					.nullable()
					.optional(),
				friday_hours: z.array(z.string()).nullable().optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				is_primary_office: z.boolean().nullable().optional(),
				monday_hours: z.array(z.string()).nullable().optional(),
				name: z.string().nullable().optional(),
				no_operators_action: z
					.enum([
						'ai_agent',
						'bridge_target',
						'call_service_target',
						'company_directory',
						'department',
						'directory',
						'disabled',
						'extension',
						'google_dialogflow',
						'last_name_company_directory',
						'last_name_directory',
						'menu',
						'message',
						'operator',
						'person',
						'recursive_transfer',
						'scripted_ivr',
						'voicemail',
					])
					.or(z.string())
					.nullable()
					.optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				office_settings: z
					.object({
						allow_device_guest_login: z.boolean().nullable().optional(),
						block_caller_id_disabled: z.boolean().nullable().optional(),
						bridged_target_recording_allowed: z.boolean().nullable().optional(),
						disable_desk_phone_self_provision: z
							.boolean()
							.nullable()
							.optional(),
						disable_ivr_voicemail: z.boolean().nullable().optional(),
						no_recording_message_on_user_calls: z
							.boolean()
							.nullable()
							.optional(),
						set_caller_id_disabled: z.boolean().nullable().optional(),
					})
					.loose()
					.optional(),
				phone_numbers: z.array(z.string()).nullable().optional(),
				ring_seconds: dialpadInteger(z.number().int()).nullable().optional(),
				routing_options: z
					.object({
						closed: z
							.object({
								action: z
									.enum([
										'ai_agent',
										'bridge_target',
										'call_service_target',
										'company_directory',
										'department',
										'directory',
										'disabled',
										'extension',
										'google_dialogflow',
										'last_name_company_directory',
										'last_name_directory',
										'menu',
										'message',
										'operator',
										'person',
										'recursive_transfer',
										'scripted_ivr',
										'voicemail',
									])
									.or(z.string()),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.or(z.string())
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												options:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.or(z.string())
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.loose(),
						open: z
							.object({
								action: z
									.enum([
										'ai_agent',
										'bridge_target',
										'call_service_target',
										'company_directory',
										'department',
										'directory',
										'disabled',
										'extension',
										'google_dialogflow',
										'last_name_company_directory',
										'last_name_directory',
										'menu',
										'message',
										'operator',
										'person',
										'recursive_transfer',
										'scripted_ivr',
										'voicemail',
									])
									.or(z.string()),
								action_target_id: dialpadInteger(z.number().int()).optional(),
								action_target_type: z
									.enum([
										'callcenter',
										'callrouter',
										'channel',
										'coachinggroup',
										'contact',
										'contactgroup',
										'department',
										'office',
										'room',
										'staffgroup',
										'unknown',
										'user',
									])
									.or(z.string())
									.optional(),
								dtmf: z
									.array(
										z
											.object({
												input:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												options:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose(),
									)
									.optional(),
								operator_routing: z
									.enum([
										'autopark',
										'fixedorder',
										'longestidle',
										'mostskilled',
										'pinned_leg',
										'plivo_address',
										'random',
										'roundrobin',
										'simultaneous',
										'skills_based',
									])
									.or(z.string())
									.optional(),
								try_dial_operators: z.boolean(),
							})
							.loose(),
					})
					.loose()
					.optional(),
				saturday_hours: z.array(z.string()).nullable().optional(),
				state: z
					.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
					.or(z.string())
					.nullable()
					.optional(),
				sunday_hours: z.array(z.string()).nullable().optional(),
				thursday_hours: z.array(z.string()).nullable().optional(),
				timezone: z.string().nullable().optional(),
				tuesday_hours: z.array(z.string()).nullable().optional(),
				voicemail_notification_emails: z
					.array(z.string())
					.nullable()
					.optional(),
				wednesday_hours: z.array(z.string()).nullable().optional(),
			})
			.loose()
			.optional(),
		plan: z
			.object({
				additional_number_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				balance: z.string().nullable().optional(),
				contact_center_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				fax_lines: dialpadInteger(z.number().int()).nullable().optional(),
				next_billing_date: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				ppu_address: z
					.object({
						address_line_1: z.string().nullable().optional(),
						address_line_2: z.string().nullable().optional(),
						city: z.string().nullable().optional(),
						country: z.string().nullable().optional(),
						postal_code: z.string().nullable().optional(),
						region: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				room_lines: dialpadInteger(z.number().int()).nullable().optional(),
				sell_lines: dialpadInteger(z.number().int()).nullable().optional(),
				state: z
					.enum(['archived', 'disputed', 'free', 'hold', 'paid', 'trial'])
					.or(z.string())
					.nullable()
					.optional(),
				talk_lines: dialpadInteger(z.number().int()).nullable().optional(),
				tollfree_additional_number_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				tollfree_room_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				tollfree_uberconference_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				uberconference_lines: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input139 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output139 = z
	.object({
		rooms: z
			.array(
				z
					.object({
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						is_free: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		users: z
			.array(
				z
					.object({
						admin_office_ids: z
							.array(dialpadInteger(z.number().int()))
							.nullable()
							.optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						date_active: z.string().nullable().optional(),
						date_added: z.string().nullable().optional(),
						date_first_login: z.string().nullable().optional(),
						date_last_login: z.string().optional(),
						display_name: z.string().nullable().optional(),
						do_not_disturb: z.boolean().nullable().optional(),
						duty_status_reason: z.string().nullable().optional(),
						duty_status_started: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						forwarding_numbers: z.array(z.string()).nullable().optional(),
						group_details: z
							.array(
								z
									.object({
										do_not_disturb: z.boolean().nullable().optional(),
										group_id: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										group_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'coachingteam',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.nullable()
											.optional(),
										role: z
											.enum(['admin', 'operator', 'supervisor'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						international_dialing_enabled: z.boolean().nullable().optional(),
						is_admin: z.boolean().nullable().optional(),
						is_available: z.boolean().nullable().optional(),
						is_company_admin: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						is_online: z.boolean().nullable().optional(),
						is_super_admin: z.boolean().nullable().optional(),
						job_title: z.string().nullable().optional(),
						language: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						license: z
							.enum([
								'admins',
								'agents',
								'dpde_all',
								'dpde_one',
								'lite_lines',
								'lite_support_agents',
								'magenta_lines',
								'talk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						location: z.string().nullable().optional(),
						muted: z.boolean().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						on_duty_started: z.string().nullable().optional(),
						on_duty_status: z
							.enum([
								'available',
								'busy',
								'occupied',
								'occupied-end',
								'unavailable',
								'wrapup',
								'wrapup-end',
							])
							.or(z.string())
							.nullable()
							.optional(),
						onboarding_completed: z.boolean(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						remote_service: z.string().nullable().optional(),
						session_type: z
							.enum(['call', 'digital'])
							.or(z.string())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						status_message: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						voicemail: z
							.object({
								is_default_voicemail: z.boolean().optional(),
								name: z.string().nullable().optional(),
								voicemail_notifications_enabled: z.boolean().optional(),
							})
							.loose(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input140 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				operator_id: dialpadInteger(z.number().int()),
				operator_type: z.enum(['room', 'user']),
				role: z.enum(['admin', 'operator']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output140 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input141 = z
	.object({
		body: z
			.object({
				privacy: z
					.enum(['admin', 'company', 'owner', 'public'])
					.nullable()
					.optional(),
				recording_id: z.string(),
				recording_type: z.enum([
					'admincallrecording',
					'callrecording',
					'voicemail',
				]),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output141 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		created_by_id: dialpadInteger(z.number().int()).nullable().optional(),
		date_added: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		item_id: z.string().nullable().optional(),
		privacy: z
			.enum(['admin', 'company', 'owner', 'public'])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['admincallrecording', 'callrecording', 'voicemail'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input142 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output142 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		created_by_id: dialpadInteger(z.number().int()).nullable().optional(),
		date_added: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		item_id: z.string().nullable().optional(),
		privacy: z
			.enum(['admin', 'company', 'owner', 'public'])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['admincallrecording', 'callrecording', 'voicemail'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input143 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				area_code: z.string().nullable().optional(),
				number: z.string().nullable().optional(),
				primary: z.boolean().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output143 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input144 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				number: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output144 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input145 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output145 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_free: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input146 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output146 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_free: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input147 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output147 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		created_by_id: dialpadInteger(z.number().int()).nullable().optional(),
		date_added: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		item_id: z.string().nullable().optional(),
		privacy: z
			.enum(['admin', 'company', 'owner', 'public'])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['admincallrecording', 'callrecording', 'voicemail'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input148 = z
	.object({
		body: z
			.object({
				name: z.string(),
				office_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output148 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_free: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input149 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				privacy: z.enum(['admin', 'company', 'owner', 'public']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output149 = z
	.object({
		access_link: z.string().nullable().optional(),
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		created_by_id: dialpadInteger(z.number().int()).nullable().optional(),
		date_added: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		item_id: z.string().nullable().optional(),
		privacy: z
			.enum(['admin', 'company', 'owner', 'public'])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['admincallrecording', 'callrecording', 'voicemail'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input150 = z
	.object({
		body: z
			.object({
				customer_ref: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output150 = z
	.object({
		customer_ref: z.string().nullable().optional(),
		expires_on: z.string().nullable().optional(),
		pin: z.string().nullable().optional(),
	})
	.loose();

const Input151 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				office_id: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output151 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						is_free: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input152 = z
	.object({
		path: z
			.object({
				id: z.string(),
				parent_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output152 = z
	.object({
		byod: z.boolean().nullable().optional(),
		device_model: z.string().nullable().optional(),
		firmware_version: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		mac_address: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		owner_id: dialpadInteger(z.number().int()).nullable().optional(),
		owner_type: z.enum(['room', 'user']).or(z.string()).nullable().optional(),
		password: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		port: dialpadInteger(z.number().int()).nullable().optional(),
		realm: z.string().nullable().optional(),
		ring_notification: z.boolean().nullable().optional(),
		sip_transport_type: z.enum(['tls']).or(z.string()).nullable().optional(),
		type: z
			.enum([
				'ata',
				'audiocodes',
				'c2t',
				'ciscompp',
				'dect',
				'dpmroom',
				'grandstream',
				'mini',
				'mitel',
				'obi',
				'polyandroid',
				'polycom',
				'polyedgee',
				'sip',
				'tickiot',
				'yealink',
			])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input153 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				name: z.string().nullable().optional(),
				phone_numbers: z.array(z.string()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output153 = z
	.object({
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		is_free: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input154 = z
	.object({
		path: z
			.object({
				parent_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output154 = z
	.object({
		items: z
			.array(
				z
					.object({
						byod: z.boolean().nullable().optional(),
						device_model: z.string().nullable().optional(),
						firmware_version: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						mac_address: z.string().nullable().optional(),
						name: z.string().nullable().optional(),
						owner_id: dialpadInteger(z.number().int()).nullable().optional(),
						owner_type: z
							.enum(['room', 'user'])
							.or(z.string())
							.nullable()
							.optional(),
						password: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						port: dialpadInteger(z.number().int()).nullable().optional(),
						realm: z.string().nullable().optional(),
						ring_notification: z.boolean().nullable().optional(),
						sip_transport_type: z
							.enum(['tls'])
							.or(z.string())
							.nullable()
							.optional(),
						type: z
							.enum([
								'ata',
								'audiocodes',
								'c2t',
								'ciscompp',
								'dect',
								'dpmroom',
								'grandstream',
								'mini',
								'mitel',
								'obi',
								'polyandroid',
								'polycom',
								'polyedgee',
								'sip',
								'tickiot',
								'yealink',
							])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input155 = z
	.object({
		path: z
			.object({
				id: z.string(),
				parent_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output155 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input156 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				at: dialpadInteger(z.number().int()),
				coaching_group: z.boolean().nullable().optional(),
				enabled: z.boolean().nullable().optional(),
				endpoint_id: dialpadInteger(z.number().int()),
				frequency: z.enum(['daily', 'monthly', 'weekly']),
				name: z.string(),
				on_day: dialpadInteger(z.number().int()),
				report_type: z.enum([
					'call_logs',
					'daily_statistics',
					'recordings',
					'user_statistics',
					'voicemails',
				]),
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum([
						'callcenter',
						'callrouter',
						'channel',
						'coachinggroup',
						'coachingteam',
						'department',
						'office',
						'room',
						'staffgroup',
						'unknown',
						'user',
					])
					.nullable()
					.optional(),
				timezone: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output156 = z
	.object({
		at: dialpadInteger(z.number().int()).nullable().optional(),
		coaching_group: z.boolean().nullable().optional(),
		enabled: z.boolean().nullable().optional(),
		frequency: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		on_day: dialpadInteger(z.number().int()).nullable().optional(),
		report_type: z
			.enum([
				'call_logs',
				'daily_statistics',
				'recordings',
				'user_statistics',
				'voicemails',
			])
			.or(z.string()),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'company',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		timezone: z.string().nullable().optional(),
		webhook: z
			.object({
				hook_url: z.string().nullable().optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		websocket: z
			.object({
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				websocket_url: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input157 = z
	.object({
		body: z
			.object({
				at: dialpadInteger(z.number().int()),
				coaching_group: z.boolean().nullable().optional(),
				enabled: z.boolean().nullable().optional(),
				endpoint_id: dialpadInteger(z.number().int()),
				frequency: z.enum(['daily', 'monthly', 'weekly']),
				name: z.string(),
				on_day: dialpadInteger(z.number().int()),
				report_type: z.enum([
					'call_logs',
					'daily_statistics',
					'recordings',
					'user_statistics',
					'voicemails',
				]),
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum([
						'callcenter',
						'callrouter',
						'channel',
						'coachinggroup',
						'coachingteam',
						'department',
						'office',
						'room',
						'staffgroup',
						'unknown',
						'user',
					])
					.nullable()
					.optional(),
				timezone: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output157 = z
	.object({
		at: dialpadInteger(z.number().int()).nullable().optional(),
		coaching_group: z.boolean().nullable().optional(),
		enabled: z.boolean().nullable().optional(),
		frequency: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		on_day: dialpadInteger(z.number().int()).nullable().optional(),
		report_type: z
			.enum([
				'call_logs',
				'daily_statistics',
				'recordings',
				'user_statistics',
				'voicemails',
			])
			.or(z.string()),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'company',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		timezone: z.string().nullable().optional(),
		webhook: z
			.object({
				hook_url: z.string().nullable().optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		websocket: z
			.object({
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				websocket_url: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input158 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output158 = z
	.object({
		at: dialpadInteger(z.number().int()).nullable().optional(),
		coaching_group: z.boolean().nullable().optional(),
		enabled: z.boolean().nullable().optional(),
		frequency: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		on_day: dialpadInteger(z.number().int()).nullable().optional(),
		report_type: z
			.enum([
				'call_logs',
				'daily_statistics',
				'recordings',
				'user_statistics',
				'voicemails',
			])
			.or(z.string()),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'company',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		timezone: z.string().nullable().optional(),
		webhook: z
			.object({
				hook_url: z.string().nullable().optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		websocket: z
			.object({
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				websocket_url: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input159 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output159 = z
	.object({
		download_url: z.string().nullable().optional(),
		file_type: z.string().nullable().optional(),
		reason: z.string().nullable().optional(),
		status: z
			.enum(['complete', 'failed', 'processing'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input160 = z
	.object({
		body: z
			.object({
				days_ago_end: dialpadInteger(z.number().int()).nullable().optional(),
				days_ago_start: dialpadInteger(z.number().int()).nullable().optional(),
				graded_days_ago_end: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				graded_days_ago_start: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				scorecard_grader_id: dialpadInteger(z.number().int())
					.nullable()
					.optional(),
				scorecard_ids: z
					.array(dialpadInteger(z.number().int()))
					.nullable()
					.optional(),
				scorecards_type: z.enum([
					'scorecard_export_agent_leaderboard',
					'scorecard_export_calls',
					'scorecard_export_calls_questions',
					'scorecard_export_leaderboard',
					'scorecard_export_teamgroup_leaderboard',
				]),
				send_to: z.string().nullable().optional(),
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum(['callcenter', 'coachingteam', 'office', 'unknown', 'user'])
					.nullable()
					.optional(),
				timezone: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output160 = z
	.object({
		request_id: z.string().nullable().optional(),
		status: z
			.enum(['complete', 'failed', 'processing'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input161 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output161 = z
	.object({
		category: z.array(z.string()).nullable().optional(),
		date_created: z.string().nullable().optional(),
		date_modified: z.string().nullable().optional(),
		has_ai_question: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()),
		name: z.string(),
		questions: z
			.array(
				z
					.object({
						id: dialpadInteger(z.number().int()),
						options: z.object({}).loose().nullable().optional(),
						text: z.string(),
						type: z
							.enum([
								'likertAgreement',
								'likertFrequency',
								'likertImportance',
								'likertLikelihood',
								'likertQuality',
								'multipleChoice',
								'yesNo',
							])
							.or(z.string()),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		state: z
			.enum(['active', 'archived', 'draft'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input162 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				state: z.enum(['active', 'archived', 'draft']).optional(),
				target_id: dialpadInteger(z.number().int()).optional(),
				target_type: z
					.enum(['callcenter', 'coachingteam', 'office', 'unknown'])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output162 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						category: z.array(z.string()).nullable().optional(),
						date_created: z.string().nullable().optional(),
						date_modified: z.string().nullable().optional(),
						has_ai_question: z.boolean().nullable().optional(),
						id: dialpadInteger(z.number().int()),
						name: z.string(),
						questions: z
							.array(
								z
									.object({
										id: dialpadInteger(z.number().int()),
										options: z.object({}).loose().nullable().optional(),
										text: z.string(),
										type: z
											.enum([
												'likertAgreement',
												'likertFrequency',
												'likertImportance',
												'likertLikelihood',
												'likertQuality',
												'multipleChoice',
												'yesNo',
											])
											.or(z.string()),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'archived', 'draft'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input163 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output163 = z
	.object({
		at: dialpadInteger(z.number().int()).nullable().optional(),
		coaching_group: z.boolean().nullable().optional(),
		enabled: z.boolean().nullable().optional(),
		frequency: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		name: z.string().nullable().optional(),
		on_day: dialpadInteger(z.number().int()).nullable().optional(),
		report_type: z
			.enum([
				'call_logs',
				'daily_statistics',
				'recordings',
				'user_statistics',
				'voicemails',
			])
			.or(z.string()),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'company',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		timezone: z.string().nullable().optional(),
		webhook: z
			.object({
				hook_url: z.string().nullable().optional(),
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		websocket: z
			.object({
				id: dialpadInteger(z.number().int()).nullable().optional(),
				signature: z
					.object({
						algo: z.string().nullable().optional(),
						secret: z.string().nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose()
					.optional(),
				websocket_url: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input164 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output164 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						at: dialpadInteger(z.number().int()).nullable().optional(),
						coaching_group: z.boolean().nullable().optional(),
						enabled: z.boolean().nullable().optional(),
						frequency: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						name: z.string().nullable().optional(),
						on_day: dialpadInteger(z.number().int()).nullable().optional(),
						report_type: z
							.enum([
								'call_logs',
								'daily_statistics',
								'recordings',
								'user_statistics',
								'voicemails',
							])
							.or(z.string()),
						target_id: dialpadInteger(z.number().int()).nullable().optional(),
						target_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'company',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						timezone: z.string().nullable().optional(),
						webhook: z
							.object({
								hook_url: z.string().nullable().optional(),
								id: dialpadInteger(z.number().int()).nullable().optional(),
								signature: z
									.object({
										algo: z.string().nullable().optional(),
										secret: z.string().nullable().optional(),
										type: z.string().nullable().optional(),
									})
									.loose()
									.optional(),
							})
							.loose()
							.optional(),
						websocket: z
							.object({
								id: dialpadInteger(z.number().int()).nullable().optional(),
								signature: z
									.object({
										algo: z.string().nullable().optional(),
										secret: z.string().nullable().optional(),
										type: z.string().nullable().optional(),
									})
									.loose()
									.optional(),
								websocket_url: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input165 = z
	.object({
		body: z
			.object({
				coaching_group: z.boolean().nullable().optional(),
				coaching_team: z.boolean().nullable().optional(),
				days_ago_end: dialpadInteger(z.number().int()).nullable().optional(),
				days_ago_start: dialpadInteger(z.number().int()).nullable().optional(),
				export_type: z.enum(['records', 'stats']),
				group_by: z.enum(['date', 'group', 'user']).nullable().optional(),
				is_today: z.boolean().nullable().optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				stat_type: z.enum([
					'calls',
					'csat',
					'dispositions',
					'onduty',
					'recordings',
					'screenshare',
					'texts',
					'voicemails',
				]),
				target_id: dialpadInteger(z.number().int()).nullable().optional(),
				target_type: z
					.enum([
						'callcenter',
						'coachinggroup',
						'coachingteam',
						'department',
						'office',
						'room',
						'staffgroup',
						'unknown',
						'user',
					])
					.nullable()
					.optional(),
				timezone: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output165 = z
	.object({
		already_started: z.boolean().nullable().optional(),
		request_id: z.string().nullable().optional(),
	})
	.loose();

const Input166 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output166 = z
	.object({
		download_url: z.string().nullable().optional(),
		file_type: z.string().nullable().optional(),
		reason: z.string().nullable().optional(),
		status: z
			.enum(['complete', 'failed', 'processing'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input167 = z
	.object({
		body: z
			.object({
				channel_hashtag: z.string().nullable().optional(),
				from_number: z.string().nullable().optional(),
				infer_country_code: z.boolean().nullable().optional(),
				media: z.string().nullable().optional(),
				sender_group_id: dialpadInteger(z.number().int()).nullable().optional(),
				sender_group_type: z
					.enum(['callcenter', 'department', 'office'])
					.nullable()
					.optional(),
				text: z.string().nullable().optional(),
				to_numbers: z.array(z.string()).nullable().optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output167 = z
	.object({
		contact_id: z.string().nullable().optional(),
		created_date: z.string().nullable().optional(),
		device_type: z
			.enum([
				'android',
				'ata',
				'audiocodes',
				'c2t',
				'ciscompp',
				'dect',
				'dpmroom',
				'grandstream',
				'harness',
				'iframe_cti_extension',
				'iframe_cti_v2',
				'iframe_front',
				'iframe_hubspot',
				'iframe_ms_teams',
				'iframe_open_cti',
				'iframe_salesforce',
				'iframe_service_titan',
				'iframe_zendesk',
				'iframe_zoho',
				'ipad',
				'iphone',
				'mini',
				'mitel',
				'msteams',
				'native',
				'obi',
				'packaged_app',
				'polyandroid',
				'polycom',
				'polyedgee',
				'proxy',
				'public_api',
				'salesforce',
				'sip',
				'tickiot',
				'web',
				'yealink',
			])
			.or(z.string())
			.nullable()
			.optional(),
		direction: z
			.enum(['inbound', 'outbound'])
			.or(z.string())
			.nullable()
			.optional(),
		from_number: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		message_delivery_result: z
			.enum([
				'accepted',
				'internal_error',
				'invalid_destination',
				'invalid_source',
				'no_route',
				'not_supported',
				'rejected',
				'rejected_spam',
				'rejected_spam_internal',
				'time_out',
			])
			.or(z.string())
			.nullable()
			.optional(),
		message_status: z
			.enum(['failed', 'pending', 'success'])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		text: z.string().nullable().optional(),
		to_numbers: z.array(z.string()).nullable().optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input168 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				custom_data: z.string().nullable().optional(),
				group_id: dialpadInteger(z.number().int()).nullable().optional(),
				group_type: z
					.enum(['callcenter', 'department', 'office'])
					.nullable()
					.optional(),
				outbound_caller_id: z.string().nullable().optional(),
				phone_number: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output168 = z
	.object({
		device: z
			.object({
				app_version: z.string().nullable().optional(),
				date_created: z.string().nullable().optional(),
				date_registered: z.string().nullable().optional(),
				date_updated: z.string().nullable().optional(),
				display_name: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				phone_number: z.string().nullable().optional(),
				type: z
					.enum([
						'android',
						'ata',
						'audiocodes',
						'c2t',
						'ciscompp',
						'dect',
						'dpmroom',
						'grandstream',
						'harness',
						'iframe_cti_extension',
						'iframe_cti_v2',
						'iframe_front',
						'iframe_hubspot',
						'iframe_ms_teams',
						'iframe_open_cti',
						'iframe_salesforce',
						'iframe_service_titan',
						'iframe_zendesk',
						'iframe_zoho',
						'ipad',
						'iphone',
						'mini',
						'mitel',
						'msteams',
						'native',
						'obi',
						'packaged_app',
						'polyandroid',
						'polycom',
						'polyedgee',
						'proxy',
						'public_api',
						'salesforce',
						'sip',
						'tickiot',
						'web',
						'yealink',
					])
					.or(z.string())
					.nullable()
					.optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input169 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				announce_vi: z.boolean().nullable().optional(),
				enable_vi: z.boolean().nullable().optional(),
				vi_locale: z
					.enum([
						'de-de',
						'en-au',
						'en-ca',
						'en-gb',
						'en-mx',
						'en-nz',
						'en-us',
						'es-es',
						'es-mx',
						'es-us',
						'fr-ca',
						'fr-fr',
						'id-id',
						'it-it',
						'ja-jp',
						'ko-kr',
						'nl-nl',
						'pt-br',
						'sv-se',
						'vi-vn',
						'zh-cn',
					])
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output169 = z
	.object({
		call_state: z.string().nullable().optional(),
		enable_vi: z.boolean().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		vi_locale: z.string().nullable().optional(),
	})
	.loose();

const Input170 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output170 = z
	.object({
		app_version: z.string().nullable().optional(),
		date_created: z.string().nullable().optional(),
		date_registered: z.string().nullable().optional(),
		date_updated: z.string().nullable().optional(),
		display_name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		type: z
			.enum([
				'android',
				'ata',
				'audiocodes',
				'c2t',
				'ciscompp',
				'dect',
				'dpmroom',
				'grandstream',
				'harness',
				'iframe_cti_extension',
				'iframe_cti_v2',
				'iframe_front',
				'iframe_hubspot',
				'iframe_ms_teams',
				'iframe_open_cti',
				'iframe_salesforce',
				'iframe_service_titan',
				'iframe_zendesk',
				'iframe_zoho',
				'ipad',
				'iphone',
				'mini',
				'mitel',
				'msteams',
				'native',
				'obi',
				'packaged_app',
				'polyandroid',
				'polycom',
				'polyedgee',
				'proxy',
				'public_api',
				'salesforce',
				'sip',
				'tickiot',
				'web',
				'yealink',
			])
			.or(z.string())
			.nullable()
			.optional(),
		user_id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input171 = z
	.object({
		path: z
			.object({
				call_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output171 = z
	.object({
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		lines: z
			.array(
				z
					.object({
						contact_id: z.string().nullable().optional(),
						content: z.string().nullable().optional(),
						name: z.string().nullable().optional(),
						time: z.string().nullable().optional(),
						type: z
							.enum([
								'ai_question',
								'custom_moment',
								'moment',
								'real_time_moment',
								'transcript',
							])
							.or(z.string())
							.nullable()
							.optional(),
						user_id: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input172 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				user_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output172 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						app_version: z.string().nullable().optional(),
						date_created: z.string().nullable().optional(),
						date_registered: z.string().nullable().optional(),
						date_updated: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						type: z
							.enum([
								'android',
								'ata',
								'audiocodes',
								'c2t',
								'ciscompp',
								'dect',
								'dpmroom',
								'grandstream',
								'harness',
								'iframe_cti_extension',
								'iframe_cti_v2',
								'iframe_front',
								'iframe_hubspot',
								'iframe_ms_teams',
								'iframe_open_cti',
								'iframe_salesforce',
								'iframe_service_titan',
								'iframe_zendesk',
								'iframe_zoho',
								'ipad',
								'iphone',
								'mini',
								'mitel',
								'msteams',
								'native',
								'obi',
								'packaged_app',
								'polyandroid',
								'polycom',
								'polyedgee',
								'proxy',
								'public_api',
								'salesforce',
								'sip',
								'tickiot',
								'web',
								'yealink',
							])
							.or(z.string())
							.nullable()
							.optional(),
						user_id: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input173 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				is_recording: z.boolean().nullable().optional(),
				play_message: z.boolean().nullable().optional(),
				recording_type: z.enum(['all', 'group', 'user']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output173 = z
	.object({
		call_state: z.string().nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		is_recording: z.boolean().nullable().optional(),
	})
	.loose();

const Input174 = z
	.object({
		path: z
			.object({
				call_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output174 = z
	.object({
		call_id: dialpadInteger(z.number().int()).nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();

const Input175 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				caller_id: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output175 = z
	.object({
		caller_id: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		groups: z
			.array(
				z
					.object({
						caller_id: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()),
		office_main_line: z.string().nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		primary_phone: z.string().nullable().optional(),
	})
	.loose();

const Input176 = z
	.object({
		path: z
			.object({
				id: z.string(),
				parent_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output176 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input177 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output177 = z
	.object({
		caller_id: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		groups: z
			.array(
				z
					.object({
						caller_id: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()),
		office_main_line: z.string().nullable().optional(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		primary_phone: z.string().nullable().optional(),
	})
	.loose();

const Input178 = z
	.object({
		path: z
			.object({
				id: z.string(),
				parent_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output178 = z
	.object({
		byod: z.boolean().nullable().optional(),
		device_model: z.string().nullable().optional(),
		firmware_version: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		mac_address: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		owner_id: dialpadInteger(z.number().int()).nullable().optional(),
		owner_type: z.enum(['room', 'user']).or(z.string()).nullable().optional(),
		password: z.string().nullable().optional(),
		phone_number: z.string().nullable().optional(),
		port: dialpadInteger(z.number().int()).nullable().optional(),
		realm: z.string().nullable().optional(),
		ring_notification: z.boolean().nullable().optional(),
		sip_transport_type: z.enum(['tls']).or(z.string()).nullable().optional(),
		type: z
			.enum([
				'ata',
				'audiocodes',
				'c2t',
				'ciscompp',
				'dect',
				'dpmroom',
				'grandstream',
				'mini',
				'mitel',
				'obi',
				'polyandroid',
				'polycom',
				'polyedgee',
				'sip',
				'tickiot',
				'yealink',
			])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input179 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				address: z.string(),
				address2: z.string().nullable().optional(),
				city: z.string(),
				country: z.string(),
				state: z.string(),
				use_validated_option: z.boolean().nullable().optional(),
				zip: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output179 = z
	.object({
		address: z.string().nullable().optional(),
		address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
	})
	.loose();

const Input180 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				do_not_disturb: z.boolean(),
				group_id: dialpadInteger(z.number().int()).nullable().optional(),
				group_type: z
					.enum(['callcenter', 'department', 'office'])
					.nullable()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output180 = z
	.object({
		do_not_disturb: z.boolean().nullable().optional(),
		group_id: dialpadInteger(z.number().int()).nullable().optional(),
		group_type: z
			.enum(['callcenter', 'department', 'office'])
			.or(z.string())
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
	})
	.loose();

const Input181 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				number: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output181 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input182 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				area_code: z.string().nullable().optional(),
				number: z.string().nullable().optional(),
				primary: z.boolean().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output182 = z
	.object({
		area_code: z.string().nullable().optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		deleted: z.boolean().nullable().optional(),
		number: z.string().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		status: z
			.enum([
				'available',
				'call_center',
				'call_router',
				'call_service',
				'department',
				'dynamic_caller',
				'office',
				'pending',
				'porting',
				'room',
				'shared_line',
				'sip_trunk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		target_id: dialpadInteger(z.number().int()).nullable().optional(),
		target_type: z
			.enum([
				'callcenter',
				'callrouter',
				'channel',
				'coachinggroup',
				'coachingteam',
				'department',
				'office',
				'room',
				'staffgroup',
				'unknown',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		type: z
			.enum(['free', 'local', 'mobile', 'softbank', 'tollfree'])
			.or(z.string())
			.nullable()
			.optional(),
	})
	.loose();

const Input183 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output183 = z
	.object({
		items: z
			.array(
				z
					.object({
						caller_id: z.string().nullable().optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						name: z.string().nullable().optional(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						type: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input184 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output184 = z
	.object({
		address: z.string().nullable().optional(),
		address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
	})
	.loose();

const Input185 = z
	.object({
		path: z
			.object({
				parent_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output185 = z
	.object({
		items: z
			.array(
				z
					.object({
						byod: z.boolean().nullable().optional(),
						device_model: z.string().nullable().optional(),
						firmware_version: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						mac_address: z.string().nullable().optional(),
						name: z.string().nullable().optional(),
						owner_id: dialpadInteger(z.number().int()).nullable().optional(),
						owner_type: z
							.enum(['room', 'user'])
							.or(z.string())
							.nullable()
							.optional(),
						password: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						port: dialpadInteger(z.number().int()).nullable().optional(),
						realm: z.string().nullable().optional(),
						ring_notification: z.boolean().nullable().optional(),
						sip_transport_type: z
							.enum(['tls'])
							.or(z.string())
							.nullable()
							.optional(),
						type: z
							.enum([
								'ata',
								'audiocodes',
								'c2t',
								'ciscompp',
								'dect',
								'dpmroom',
								'grandstream',
								'mini',
								'mitel',
								'obi',
								'polyandroid',
								'polycom',
								'polyedgee',
								'sip',
								'tickiot',
								'yealink',
							])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input186 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				screen_pop_uri: z.string(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output186 = z
	.object({
		device: z
			.object({
				app_version: z.string().nullable().optional(),
				date_created: z.string().nullable().optional(),
				date_registered: z.string().nullable().optional(),
				date_updated: z.string().nullable().optional(),
				display_name: z.string().nullable().optional(),
				id: z.string().nullable().optional(),
				phone_number: z.string().nullable().optional(),
				type: z
					.enum([
						'android',
						'ata',
						'audiocodes',
						'c2t',
						'ciscompp',
						'dect',
						'dpmroom',
						'grandstream',
						'harness',
						'iframe_cti_extension',
						'iframe_cti_v2',
						'iframe_front',
						'iframe_hubspot',
						'iframe_ms_teams',
						'iframe_open_cti',
						'iframe_salesforce',
						'iframe_service_titan',
						'iframe_zendesk',
						'iframe_zoho',
						'ipad',
						'iphone',
						'mini',
						'mitel',
						'msteams',
						'native',
						'obi',
						'packaged_app',
						'polyandroid',
						'polycom',
						'polyedgee',
						'proxy',
						'public_api',
						'salesforce',
						'sip',
						'tickiot',
						'web',
						'yealink',
					])
					.or(z.string())
					.nullable()
					.optional(),
				user_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input187 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output187 = z
	.object({
		admin_office_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		date_active: z.string().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_first_login: z.string().nullable().optional(),
		date_last_login: z.string().optional(),
		display_name: z.string().nullable().optional(),
		do_not_disturb: z.boolean().nullable().optional(),
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		group_details: z
			.array(
				z
					.object({
						do_not_disturb: z.boolean().nullable().optional(),
						group_id: dialpadInteger(z.number().int()).nullable().optional(),
						group_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						role: z
							.enum(['admin', 'operator', 'supervisor'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		international_dialing_enabled: z.boolean().nullable().optional(),
		is_admin: z.boolean().nullable().optional(),
		is_available: z.boolean().nullable().optional(),
		is_company_admin: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		is_online: z.boolean().nullable().optional(),
		is_super_admin: z.boolean().nullable().optional(),
		job_title: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		license: z
			.enum([
				'admins',
				'agents',
				'dpde_all',
				'dpde_one',
				'lite_lines',
				'lite_support_agents',
				'magenta_lines',
				'talk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		location: z.string().nullable().optional(),
		muted: z.boolean().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_started: z.string().nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		onboarding_completed: z.boolean(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		remote_service: z.string().nullable().optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		status_message: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		voicemail: z
			.object({
				is_default_voicemail: z.boolean().optional(),
				name: z.string().nullable().optional(),
				voicemail_notifications_enabled: z.boolean().optional(),
			})
			.loose(),
	})
	.loose();

const Input188 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output188 = z
	.object({
		admin_office_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		date_active: z.string().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_first_login: z.string().nullable().optional(),
		date_last_login: z.string().optional(),
		display_name: z.string().nullable().optional(),
		do_not_disturb: z.boolean().nullable().optional(),
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		group_details: z
			.array(
				z
					.object({
						do_not_disturb: z.boolean().nullable().optional(),
						group_id: dialpadInteger(z.number().int()).nullable().optional(),
						group_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						role: z
							.enum(['admin', 'operator', 'supervisor'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		international_dialing_enabled: z.boolean().nullable().optional(),
		is_admin: z.boolean().nullable().optional(),
		is_available: z.boolean().nullable().optional(),
		is_company_admin: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		is_online: z.boolean().nullable().optional(),
		is_super_admin: z.boolean().nullable().optional(),
		job_title: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		license: z
			.enum([
				'admins',
				'agents',
				'dpde_all',
				'dpde_one',
				'lite_lines',
				'lite_support_agents',
				'magenta_lines',
				'talk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		location: z.string().nullable().optional(),
		muted: z.boolean().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_started: z.string().nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		onboarding_completed: z.boolean(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		remote_service: z.string().nullable().optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		status_message: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		voicemail: z
			.object({
				is_default_voicemail: z.boolean().optional(),
				name: z.string().nullable().optional(),
				voicemail_notifications_enabled: z.boolean().optional(),
			})
			.loose(),
	})
	.loose();

const Input189 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				state: z
					.enum([
						'active',
						'all',
						'cancelled',
						'deleted',
						'pending',
						'suspended',
					])
					.optional(),
				company_admin: z.boolean().optional(),
				email: z.string().optional(),
				number: z.string().optional(),
				forwarding_number: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output189 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						admin_office_ids: z
							.array(dialpadInteger(z.number().int()))
							.nullable()
							.optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						date_active: z.string().nullable().optional(),
						date_added: z.string().nullable().optional(),
						date_first_login: z.string().nullable().optional(),
						date_last_login: z.string().optional(),
						display_name: z.string().nullable().optional(),
						do_not_disturb: z.boolean().nullable().optional(),
						duty_status_reason: z.string().nullable().optional(),
						duty_status_started: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						forwarding_numbers: z.array(z.string()).nullable().optional(),
						group_details: z
							.array(
								z
									.object({
										do_not_disturb: z.boolean().nullable().optional(),
										group_id: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										group_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'coachingteam',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.nullable()
											.optional(),
										role: z
											.enum(['admin', 'operator', 'supervisor'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						international_dialing_enabled: z.boolean().nullable().optional(),
						is_admin: z.boolean().nullable().optional(),
						is_available: z.boolean().nullable().optional(),
						is_company_admin: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						is_online: z.boolean().nullable().optional(),
						is_super_admin: z.boolean().nullable().optional(),
						job_title: z.string().nullable().optional(),
						language: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						license: z
							.enum([
								'admins',
								'agents',
								'dpde_all',
								'dpde_one',
								'lite_lines',
								'lite_support_agents',
								'magenta_lines',
								'talk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						location: z.string().nullable().optional(),
						muted: z.boolean().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						on_duty_started: z.string().nullable().optional(),
						on_duty_status: z
							.enum([
								'available',
								'busy',
								'occupied',
								'occupied-end',
								'unavailable',
								'wrapup',
								'wrapup-end',
							])
							.or(z.string())
							.nullable()
							.optional(),
						onboarding_completed: z.boolean(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						remote_service: z.string().nullable().optional(),
						session_type: z
							.enum(['call', 'digital'])
							.or(z.string())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						status_message: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						voicemail: z
							.object({
								is_default_voicemail: z.boolean().optional(),
								name: z.string().nullable().optional(),
								voicemail_notifications_enabled: z.boolean().optional(),
							})
							.loose(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input190 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				admin_office_ids: z
					.array(dialpadInteger(z.number().int()))
					.nullable()
					.optional(),
				emails: z.array(z.string()).nullable().optional(),
				extension: z.string().nullable().optional(),
				first_name: z.string().nullable().optional(),
				forwarding_numbers: z.array(z.string()).nullable().optional(),
				international_dialing_enabled: z.boolean().nullable().optional(),
				is_super_admin: z.boolean().nullable().optional(),
				job_title: z.string().nullable().optional(),
				keep_paid_numbers: z.boolean().nullable().optional(),
				last_name: z.string().nullable().optional(),
				license: z
					.enum([
						'admins',
						'agents',
						'dpde_all',
						'dpde_one',
						'lite_lines',
						'lite_support_agents',
						'magenta_lines',
						'talk',
						'user',
					])
					.nullable()
					.optional(),
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
				phone_numbers: z.array(z.string()).nullable().optional(),
				presence_status: z
					.object({
						message: z.string().nullable().optional(),
						provider: z.string().nullable().optional(),
						type: z.enum(['conference', 'default']).nullable().optional(),
					})
					.strict()
					.optional(),
				release_numbers_on_suspend: z.boolean().nullable().optional(),
				state: z.enum(['active', 'suspended']).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output190 = z
	.object({
		admin_office_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		date_active: z.string().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_first_login: z.string().nullable().optional(),
		date_last_login: z.string().optional(),
		display_name: z.string().nullable().optional(),
		do_not_disturb: z.boolean().nullable().optional(),
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		group_details: z
			.array(
				z
					.object({
						do_not_disturb: z.boolean().nullable().optional(),
						group_id: dialpadInteger(z.number().int()).nullable().optional(),
						group_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						role: z
							.enum(['admin', 'operator', 'supervisor'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		international_dialing_enabled: z.boolean().nullable().optional(),
		is_admin: z.boolean().nullable().optional(),
		is_available: z.boolean().nullable().optional(),
		is_company_admin: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		is_online: z.boolean().nullable().optional(),
		is_super_admin: z.boolean().nullable().optional(),
		job_title: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		license: z
			.enum([
				'admins',
				'agents',
				'dpde_all',
				'dpde_one',
				'lite_lines',
				'lite_support_agents',
				'magenta_lines',
				'talk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		location: z.string().nullable().optional(),
		muted: z.boolean().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_started: z.string().nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		onboarding_completed: z.boolean(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		remote_service: z.string().nullable().optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		status_message: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		voicemail: z
			.object({
				is_default_voicemail: z.boolean().optional(),
				name: z.string().nullable().optional(),
				voicemail_notifications_enabled: z.boolean().optional(),
			})
			.loose(),
	})
	.loose();

const Input191 = z
	.object({
		body: z
			.object({
				auto_assign: z.boolean().nullable().optional(),
				email: z.string(),
				first_name: z.string().nullable().optional(),
				last_name: z.string().nullable().optional(),
				license: z
					.enum([
						'admins',
						'agents',
						'dpde_all',
						'dpde_one',
						'lite_lines',
						'lite_support_agents',
						'magenta_lines',
						'talk',
						'user',
					])
					.nullable()
					.optional(),
				office_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output191 = z
	.object({
		admin_office_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		date_active: z.string().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_first_login: z.string().nullable().optional(),
		date_last_login: z.string().optional(),
		display_name: z.string().nullable().optional(),
		do_not_disturb: z.boolean().nullable().optional(),
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		group_details: z
			.array(
				z
					.object({
						do_not_disturb: z.boolean().nullable().optional(),
						group_id: dialpadInteger(z.number().int()).nullable().optional(),
						group_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						role: z
							.enum(['admin', 'operator', 'supervisor'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		international_dialing_enabled: z.boolean().nullable().optional(),
		is_admin: z.boolean().nullable().optional(),
		is_available: z.boolean().nullable().optional(),
		is_company_admin: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		is_online: z.boolean().nullable().optional(),
		is_super_admin: z.boolean().nullable().optional(),
		job_title: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		license: z
			.enum([
				'admins',
				'agents',
				'dpde_all',
				'dpde_one',
				'lite_lines',
				'lite_support_agents',
				'magenta_lines',
				'talk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		location: z.string().nullable().optional(),
		muted: z.boolean().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_started: z.string().nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		onboarding_completed: z.boolean(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		remote_service: z.string().nullable().optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		status_message: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		voicemail: z
			.object({
				is_default_voicemail: z.boolean().optional(),
				name: z.string().nullable().optional(),
				voicemail_notifications_enabled: z.boolean().optional(),
			})
			.loose(),
	})
	.loose();

const Input192 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				office_id: dialpadInteger(z.number().int()).nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output192 = z
	.object({
		admin_office_ids: z
			.array(dialpadInteger(z.number().int()))
			.nullable()
			.optional(),
		company_id: dialpadInteger(z.number().int()).nullable().optional(),
		country: z.string().nullable().optional(),
		date_active: z.string().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_first_login: z.string().nullable().optional(),
		date_last_login: z.string().optional(),
		display_name: z.string().nullable().optional(),
		do_not_disturb: z.boolean().nullable().optional(),
		duty_status_reason: z.string().nullable().optional(),
		duty_status_started: z.string().nullable().optional(),
		emails: z.array(z.string()).nullable().optional(),
		extension: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		forwarding_numbers: z.array(z.string()).nullable().optional(),
		group_details: z
			.array(
				z
					.object({
						do_not_disturb: z.boolean().nullable().optional(),
						group_id: dialpadInteger(z.number().int()).nullable().optional(),
						group_type: z
							.enum([
								'callcenter',
								'callrouter',
								'channel',
								'coachinggroup',
								'coachingteam',
								'department',
								'office',
								'room',
								'staffgroup',
								'unknown',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						role: z
							.enum(['admin', 'operator', 'supervisor'])
							.or(z.string())
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		image_url: z.string().nullable().optional(),
		international_dialing_enabled: z.boolean().nullable().optional(),
		is_admin: z.boolean().nullable().optional(),
		is_available: z.boolean().nullable().optional(),
		is_company_admin: z.boolean().nullable().optional(),
		is_on_duty: z.boolean().nullable().optional(),
		is_online: z.boolean().nullable().optional(),
		is_super_admin: z.boolean().nullable().optional(),
		job_title: z.string().nullable().optional(),
		language: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		license: z
			.enum([
				'admins',
				'agents',
				'dpde_all',
				'dpde_one',
				'lite_lines',
				'lite_support_agents',
				'magenta_lines',
				'talk',
				'user',
			])
			.or(z.string())
			.nullable()
			.optional(),
		location: z.string().nullable().optional(),
		muted: z.boolean().nullable().optional(),
		office_id: dialpadInteger(z.number().int()).nullable().optional(),
		on_duty_started: z.string().nullable().optional(),
		on_duty_status: z
			.enum([
				'available',
				'busy',
				'occupied',
				'occupied-end',
				'unavailable',
				'wrapup',
				'wrapup-end',
			])
			.or(z.string())
			.nullable()
			.optional(),
		onboarding_completed: z.boolean(),
		phone_numbers: z.array(z.string()).nullable().optional(),
		remote_service: z.string().nullable().optional(),
		session_type: z
			.enum(['call', 'digital'])
			.or(z.string())
			.nullable()
			.optional(),
		state: z
			.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
			.or(z.string())
			.nullable()
			.optional(),
		status_message: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		voicemail: z
			.object({
				is_default_voicemail: z.boolean().optional(),
				name: z.string().nullable().optional(),
				voicemail_notifications_enabled: z.boolean().optional(),
			})
			.loose(),
	})
	.loose();

const Input193 = z
	.object({
		body: z
			.object({
				users: z.array(
					z
						.object({
							auto_assign: z.boolean().nullable().optional(),
							email: z.string(),
							first_name: z.string().nullable().optional(),
							last_name: z.string().nullable().optional(),
							license: z
								.enum([
									'admins',
									'agents',
									'dpde_all',
									'dpde_one',
									'lite_lines',
									'lite_support_agents',
									'magenta_lines',
									'talk',
									'user',
								])
								.nullable()
								.optional(),
							office_id: dialpadInteger(z.number().int()),
						})
						.strict(),
				),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output193 = z
	.object({
		items: z
			.array(
				z
					.object({
						email: z.string().nullable().optional(),
						error: z
							.object({
								code: z
									.enum([
										'billing_issue',
										'domain_mismatch',
										'invalid_email',
										'invalid_request',
										'no_seats_available',
										'office_not_active',
										'user_exists',
									])
									.or(z.string())
									.nullable()
									.optional(),
								message: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						user: z
							.object({
								admin_office_ids: z
									.array(dialpadInteger(z.number().int()))
									.nullable()
									.optional(),
								company_id: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								country: z.string().nullable().optional(),
								date_active: z.string().nullable().optional(),
								date_added: z.string().nullable().optional(),
								date_first_login: z.string().nullable().optional(),
								date_last_login: z.string().optional(),
								display_name: z.string().nullable().optional(),
								do_not_disturb: z.boolean().nullable().optional(),
								duty_status_reason: z.string().nullable().optional(),
								duty_status_started: z.string().nullable().optional(),
								emails: z.array(z.string()).nullable().optional(),
								extension: z.string().nullable().optional(),
								first_name: z.string().nullable().optional(),
								forwarding_numbers: z.array(z.string()).nullable().optional(),
								group_details: z
									.array(
										z
											.object({
												do_not_disturb: z.boolean().nullable().optional(),
												group_id: dialpadInteger(z.number().int())
													.nullable()
													.optional(),
												group_type: z
													.enum([
														'callcenter',
														'callrouter',
														'channel',
														'coachinggroup',
														'coachingteam',
														'department',
														'office',
														'room',
														'staffgroup',
														'unknown',
														'user',
													])
													.or(z.string())
													.nullable()
													.optional(),
												role: z
													.enum(['admin', 'operator', 'supervisor'])
													.or(z.string())
													.nullable()
													.optional(),
											})
											.loose(),
									)
									.nullable()
									.optional(),
								id: dialpadInteger(z.number().int()).nullable().optional(),
								image_url: z.string().nullable().optional(),
								international_dialing_enabled: z
									.boolean()
									.nullable()
									.optional(),
								is_admin: z.boolean().nullable().optional(),
								is_available: z.boolean().nullable().optional(),
								is_company_admin: z.boolean().nullable().optional(),
								is_on_duty: z.boolean().nullable().optional(),
								is_online: z.boolean().nullable().optional(),
								is_super_admin: z.boolean().nullable().optional(),
								job_title: z.string().nullable().optional(),
								language: z.string().nullable().optional(),
								last_name: z.string().nullable().optional(),
								license: z
									.enum([
										'admins',
										'agents',
										'dpde_all',
										'dpde_one',
										'lite_lines',
										'lite_support_agents',
										'magenta_lines',
										'talk',
										'user',
									])
									.or(z.string())
									.nullable()
									.optional(),
								location: z.string().nullable().optional(),
								muted: z.boolean().nullable().optional(),
								office_id: dialpadInteger(z.number().int())
									.nullable()
									.optional(),
								on_duty_started: z.string().nullable().optional(),
								on_duty_status: z
									.enum([
										'available',
										'busy',
										'occupied',
										'occupied-end',
										'unavailable',
										'wrapup',
										'wrapup-end',
									])
									.or(z.string())
									.nullable()
									.optional(),
								onboarding_completed: z.boolean(),
								phone_numbers: z.array(z.string()).nullable().optional(),
								remote_service: z.string().nullable().optional(),
								session_type: z
									.enum(['call', 'digital'])
									.or(z.string())
									.nullable()
									.optional(),
								state: z
									.enum([
										'active',
										'cancelled',
										'deleted',
										'pending',
										'suspended',
									])
									.or(z.string())
									.nullable()
									.optional(),
								status_message: z.string().nullable().optional(),
								timezone: z.string().nullable().optional(),
								voicemail: z
									.object({
										is_default_voicemail: z.boolean().optional(),
										name: z.string().nullable().optional(),
										voicemail_notifications_enabled: z.boolean().optional(),
									})
									.loose(),
							})
							.loose()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input194 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				expiration: dialpadInteger(z.number().int()).nullable().optional(),
				status_message: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output194 = z
	.object({
		expiration: dialpadInteger(z.number().int()).nullable().optional(),
		id: dialpadInteger(z.number().int()).nullable().optional(),
		status_message: z.string().nullable().optional(),
	})
	.loose();

const Input195 = z
	.object({
		query: z
			.object({
				query: z.string(),
				cursor: z.string().optional(),
				filter: z.string().optional(),
			})
			.strict(),
	})
	.strict();

const Output195 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						admin_office_ids: z
							.array(dialpadInteger(z.number().int()))
							.nullable()
							.optional(),
						company_id: dialpadInteger(z.number().int()).nullable().optional(),
						country: z.string().nullable().optional(),
						date_active: z.string().nullable().optional(),
						date_added: z.string().nullable().optional(),
						date_first_login: z.string().nullable().optional(),
						date_last_login: z.string().optional(),
						display_name: z.string().nullable().optional(),
						do_not_disturb: z.boolean().nullable().optional(),
						duty_status_reason: z.string().nullable().optional(),
						duty_status_started: z.string().nullable().optional(),
						emails: z.array(z.string()).nullable().optional(),
						extension: z.string().nullable().optional(),
						first_name: z.string().nullable().optional(),
						forwarding_numbers: z.array(z.string()).nullable().optional(),
						group_details: z
							.array(
								z
									.object({
										do_not_disturb: z.boolean().nullable().optional(),
										group_id: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
										group_type: z
											.enum([
												'callcenter',
												'callrouter',
												'channel',
												'coachinggroup',
												'coachingteam',
												'department',
												'office',
												'room',
												'staffgroup',
												'unknown',
												'user',
											])
											.or(z.string())
											.nullable()
											.optional(),
										role: z
											.enum(['admin', 'operator', 'supervisor'])
											.or(z.string())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						id: dialpadInteger(z.number().int()).nullable().optional(),
						image_url: z.string().nullable().optional(),
						international_dialing_enabled: z.boolean().nullable().optional(),
						is_admin: z.boolean().nullable().optional(),
						is_available: z.boolean().nullable().optional(),
						is_company_admin: z.boolean().nullable().optional(),
						is_on_duty: z.boolean().nullable().optional(),
						is_online: z.boolean().nullable().optional(),
						is_super_admin: z.boolean().nullable().optional(),
						job_title: z.string().nullable().optional(),
						language: z.string().nullable().optional(),
						last_name: z.string().nullable().optional(),
						license: z
							.enum([
								'admins',
								'agents',
								'dpde_all',
								'dpde_one',
								'lite_lines',
								'lite_support_agents',
								'magenta_lines',
								'talk',
								'user',
							])
							.or(z.string())
							.nullable()
							.optional(),
						location: z.string().nullable().optional(),
						muted: z.boolean().nullable().optional(),
						office_id: dialpadInteger(z.number().int()).nullable().optional(),
						on_duty_started: z.string().nullable().optional(),
						on_duty_status: z
							.enum([
								'available',
								'busy',
								'occupied',
								'occupied-end',
								'unavailable',
								'wrapup',
								'wrapup-end',
							])
							.or(z.string())
							.nullable()
							.optional(),
						onboarding_completed: z.boolean(),
						phone_numbers: z.array(z.string()).nullable().optional(),
						remote_service: z.string().nullable().optional(),
						session_type: z
							.enum(['call', 'digital'])
							.or(z.string())
							.nullable()
							.optional(),
						state: z
							.enum(['active', 'cancelled', 'deleted', 'pending', 'suspended'])
							.or(z.string())
							.nullable()
							.optional(),
						status_message: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						voicemail: z
							.object({
								is_default_voicemail: z.boolean().optional(),
								name: z.string().nullable().optional(),
								voicemail_notifications_enabled: z.boolean().optional(),
							})
							.loose(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input196 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output196 = z
	.object({
		id: dialpadInteger(z.number().int()).nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		websocket_url: z.string().nullable().optional(),
	})
	.loose();

const Input197 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output197 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						id: dialpadInteger(z.number().int()).nullable().optional(),
						signature: z
							.object({
								algo: z.string().nullable().optional(),
								secret: z.string().nullable().optional(),
								type: z.string().nullable().optional(),
							})
							.loose()
							.optional(),
						websocket_url: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input198 = z
	.object({
		body: z
			.object({
				secret: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output198 = z
	.object({
		id: dialpadInteger(z.number().int()).nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		websocket_url: z.string().nullable().optional(),
	})
	.loose();

const Input199 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				start_date: dialpadInteger(z.number().int()).optional(),
				end_date: dialpadInteger(z.number().int()).optional(),
				room_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output199 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						duration_ms: dialpadInteger(z.number().int()).nullable().optional(),
						end_time: z.string().nullable().optional(),
						host_name: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						participants: z
							.array(
								z
									.object({
										call_in_method: z.string().nullable().optional(),
										contact_id: z.string().nullable().optional(),
										display_name: z.string().nullable().optional(),
										email: z.string().nullable().optional(),
										is_organizer: z.boolean().nullable().optional(),
										name: z.string().nullable().optional(),
										phone: z.string().nullable().optional(),
										phone_number: z.string().nullable().optional(),
										talk_time: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						recordings: z
							.array(
								z
									.object({
										size: z.string().nullable().optional(),
										url: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						room_id: z.string().nullable().optional(),
						start_time: z.string().nullable().optional(),
						title: z.string().nullable().optional(),
						transcript_url: z.string().nullable().optional(),
						video_recordings: z
							.array(
								z
									.object({
										url: z.string().nullable().optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input200 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output200 = z
	.object({
		cursor: z.string().nullable().optional(),
		items: z
			.array(
				z
					.object({
						company_name: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						email: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						number: z.string().nullable().optional(),
						path: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input201 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				secret: z.string().nullable().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output201 = z
	.object({
		id: dialpadInteger(z.number().int()).nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		websocket_url: z.string().nullable().optional(),
	})
	.loose();

const Input202 = z
	.object({
		path: z
			.object({
				scheduled_conference_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				user_id: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output202 = z
	.object({
		call_out: z.boolean().nullable().optional(),
		dial_in_number: z.string().nullable().optional(),
		duration: dialpadInteger(z.number().int()).nullable().optional(),
		end_datetime: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		instance_id: z.string().nullable().optional(),
		is_moderated: z.boolean().nullable().optional(),
		meeting_type: z
			.enum([
				'CUSTOM_UNIQUE_MEETING',
				'LARGE_MEETING',
				'PERSONAL',
				'UNIQUE_MEETING',
			])
			.or(z.string())
			.nullable()
			.optional(),
		meeting_url: z.string().nullable().optional(),
		organizer_pin: z.string().nullable().optional(),
		participant_pin: z.string().nullable().optional(),
		participants_info: z
			.array(
				z
					.object({
						call_in_method: z.string().nullable().optional(),
						contact_id: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						email: z.string().nullable().optional(),
						is_organizer: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						phone: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						talk_time: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		recurrence: z.string().nullable().optional(),
		recurrence_end_date: z.string().nullable().optional(),
		start_datetime: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
	})
	.loose();

const Input203 = z
	.object({
		path: z
			.object({
				id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output203 = z
	.object({
		id: dialpadInteger(z.number().int()).nullable().optional(),
		signature: z
			.object({
				algo: z.string().nullable().optional(),
				secret: z.string().nullable().optional(),
				type: z.string().nullable().optional(),
			})
			.loose()
			.optional(),
		websocket_url: z.string().nullable().optional(),
	})
	.loose();

const Input204 = z
	.object({
		path: z
			.object({
				scheduled_conference_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				call_out: z.boolean().nullable().optional(),
				contact_ids: z.array(z.string()).nullable().optional(),
				duration: dialpadInteger(z.number().int()).nullable().optional(),
				end_datetime: dialpadInteger(z.number().int()).nullable().optional(),
				instance_id: z.string().nullable().optional(),
				recurrence: z.string().nullable().optional(),
				start_datetime: dialpadInteger(z.number().int()).nullable().optional(),
				title: z.string().nullable().optional(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output204 = z
	.object({
		call_out: z.boolean().nullable().optional(),
		dial_in_number: z.string().nullable().optional(),
		duration: dialpadInteger(z.number().int()).nullable().optional(),
		end_datetime: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		instance_id: z.string().nullable().optional(),
		is_moderated: z.boolean().nullable().optional(),
		meeting_type: z
			.enum([
				'CUSTOM_UNIQUE_MEETING',
				'LARGE_MEETING',
				'PERSONAL',
				'UNIQUE_MEETING',
			])
			.or(z.string())
			.nullable()
			.optional(),
		meeting_url: z.string().nullable().optional(),
		organizer_pin: z.string().nullable().optional(),
		participant_pin: z.string().nullable().optional(),
		participants_info: z
			.array(
				z
					.object({
						call_in_method: z.string().nullable().optional(),
						contact_id: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						email: z.string().nullable().optional(),
						is_organizer: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						phone: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						talk_time: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		recurrence: z.string().nullable().optional(),
		recurrence_end_date: z.string().nullable().optional(),
		start_datetime: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
	})
	.loose();

const Input205 = z
	.object({
		path: z
			.object({
				scheduled_conference_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		query: z
			.object({
				user_id: dialpadInteger(z.number().int()).optional(),
				timestamp: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output205 = z
	.object({
		call_out: z.boolean().nullable().optional(),
		dial_in_number: z.string().nullable().optional(),
		duration: dialpadInteger(z.number().int()).nullable().optional(),
		end_datetime: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		instance_id: z.string().nullable().optional(),
		is_moderated: z.boolean().nullable().optional(),
		meeting_type: z
			.enum([
				'CUSTOM_UNIQUE_MEETING',
				'LARGE_MEETING',
				'PERSONAL',
				'UNIQUE_MEETING',
			])
			.or(z.string())
			.nullable()
			.optional(),
		meeting_url: z.string().nullable().optional(),
		organizer_pin: z.string().nullable().optional(),
		participant_pin: z.string().nullable().optional(),
		participants_info: z
			.array(
				z
					.object({
						call_in_method: z.string().nullable().optional(),
						contact_id: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						email: z.string().nullable().optional(),
						is_organizer: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						phone: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						talk_time: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		recurrence: z.string().nullable().optional(),
		recurrence_end_date: z.string().nullable().optional(),
		start_datetime: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
	})
	.loose();

const Input206 = z
	.object({
		body: z
			.object({
				call_out: z.boolean().nullable().optional(),
				contact_ids: z.array(z.string()).nullable().optional(),
				duration: dialpadInteger(z.number().int()).nullable().optional(),
				end_datetime: dialpadInteger(z.number().int()).nullable().optional(),
				meeting_id: z.string().nullable().optional(),
				meeting_type: z
					.enum([
						'CUSTOM_UNIQUE_MEETING',
						'LARGE_MEETING',
						'PERSONAL',
						'UNIQUE_MEETING',
					])
					.nullable()
					.optional(),
				recurrence: z.string().nullable().optional(),
				start_datetime: dialpadInteger(z.number().int()),
				title: z.string(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output206 = z
	.object({
		call_out: z.boolean().nullable().optional(),
		dial_in_number: z.string().nullable().optional(),
		duration: dialpadInteger(z.number().int()).nullable().optional(),
		end_datetime: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		instance_id: z.string().nullable().optional(),
		is_moderated: z.boolean().nullable().optional(),
		meeting_type: z
			.enum([
				'CUSTOM_UNIQUE_MEETING',
				'LARGE_MEETING',
				'PERSONAL',
				'UNIQUE_MEETING',
			])
			.or(z.string())
			.nullable()
			.optional(),
		meeting_url: z.string().nullable().optional(),
		organizer_pin: z.string().nullable().optional(),
		participant_pin: z.string().nullable().optional(),
		participants_info: z
			.array(
				z
					.object({
						call_in_method: z.string().nullable().optional(),
						contact_id: z.string().nullable().optional(),
						display_name: z.string().nullable().optional(),
						email: z.string().nullable().optional(),
						is_organizer: z.boolean().nullable().optional(),
						name: z.string().nullable().optional(),
						phone: z.string().nullable().optional(),
						phone_number: z.string().nullable().optional(),
						talk_time: dialpadInteger(z.number().int()).nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
		recurrence: z.string().nullable().optional(),
		recurrence_end_date: z.string().nullable().optional(),
		start_datetime: z.string().nullable().optional(),
		timezone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
	})
	.loose();

const Input207 = z
	.object({
		query: z
			.object({
				meeting_id: z.string().optional(),
				meeting_type: z.string().optional(),
				user_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output207 = z
	.object({
		display_number: z.string().nullable().optional(),
		meeting_type: z.string(),
		organizer_pin: z.string().nullable().optional(),
		participant_pin: z.string().nullable().optional(),
		unique_meeting_id: z.string().nullable().optional(),
		url: z.string(),
		user_id: z.string(),
	})
	.loose();

const Input208 = z
	.object({
		query: z
			.object({
				ids: z.string().optional(),
				emails: z.string().optional(),
				cursor: z.string().optional(),
				end: z.string(),
				start: z.string(),
			})
			.strict(),
	})
	.strict();

const Output208 = z
	.object({
		cursor: z.string().optional(),
		items: z.array(
			z
				.object({
					activity: z
						.object({
							name: z.string().optional(),
							type: z.string().optional(),
						})
						.loose()
						.optional(),
					adherence_score: z.number().optional(),
					average_conversation_time: z.number().optional(),
					average_interaction_time: z.number().optional(),
					conversations_closed: dialpadInteger(z.number().int()).optional(),
					conversations_closed_per_hour: z.number().optional(),
					conversations_commented_on: dialpadInteger(
						z.number().int(),
					).optional(),
					conversations_on_hold: dialpadInteger(z.number().int()).optional(),
					conversations_opened: dialpadInteger(z.number().int()).optional(),
					interval: z
						.object({
							end: z.string().optional(),
							start: z.string().optional(),
						})
						.loose()
						.optional(),
					scheduled_hours: z.number().optional(),
					time_in_adherence: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					time_in_exception: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					time_on_task: z.number().optional(),
					time_out_of_adherence: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					wrong_task_snapshots: dialpadInteger(z.number().int()).optional(),
				})
				.loose(),
		),
	})
	.loose();

const Input209 = z
	.object({
		query: z
			.object({
				ids: z.string().optional(),
				emails: z.string().optional(),
				cursor: z.string().optional(),
				end: z.string(),
				start: z.string(),
			})
			.strict(),
	})
	.strict();

const Output209 = z
	.object({
		cursor: z.string().optional(),
		items: z.array(
			z
				.object({
					actual_occupancy: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds_lost: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					adherence_score: z.number().optional(),
					agent: z
						.object({
							email: z.string().optional(),
							name: z.string().optional(),
						})
						.loose()
						.optional(),
					conversations_closed_per_hour: z.number().optional(),
					conversations_closed_per_service_hour: z.number().optional(),
					dialpad_availability: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds_lost: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					dialpad_time_in_status: z
						.object({
							available: z
								.object({
									percentage: z.number().nullable().optional(),
									seconds: dialpadInteger(z.number().int()).optional(),
								})
								.loose()
								.optional(),
							busy: z
								.object({
									percentage: z.number().nullable().optional(),
									seconds: dialpadInteger(z.number().int()).optional(),
								})
								.loose()
								.optional(),
							occupied: z
								.object({
									percentage: z.number().nullable().optional(),
									seconds: dialpadInteger(z.number().int()).optional(),
								})
								.loose()
								.optional(),
							unavailable: z
								.object({
									percentage: z.number().nullable().optional(),
									seconds: dialpadInteger(z.number().int()).optional(),
								})
								.loose()
								.optional(),
							wrapup: z
								.object({
									percentage: z.number().nullable().optional(),
									seconds: dialpadInteger(z.number().int()).optional(),
								})
								.loose()
								.optional(),
						})
						.loose()
						.optional(),
					interval: z
						.object({
							end: z.string().optional(),
							start: z.string().optional(),
						})
						.loose()
						.optional(),
					occupancy: z.number().optional(),
					planned_occupancy: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds_lost: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					scheduled_hours: z.number().optional(),
					time_in_adherence: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					time_in_exception: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					time_on_task: z.number().optional(),
					time_out_of_adherence: z
						.object({
							percentage: z.number().nullable().optional(),
							seconds: dialpadInteger(z.number().int()).optional(),
						})
						.loose()
						.optional(),
					total_conversations_closed: dialpadInteger(
						z.number().int(),
					).optional(),
					utilisation: z.number().optional(),
				})
				.loose(),
		),
	})
	.loose();

const Input210 = z
	.object({
		query: z
			.object({
				cursor: z.string().optional(),
				user_id: dialpadInteger(z.number().int()),
				end_datetime: dialpadInteger(z.number().int()).optional(),
				start_datetime: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output210 = z
	.object({
		cursor: z.string().nullable().optional(),
		data: z
			.array(
				z
					.object({
						call_out: z.boolean().nullable().optional(),
						dial_in_number: z.string().nullable().optional(),
						duration: dialpadInteger(z.number().int()).nullable().optional(),
						end_datetime: z.string().nullable().optional(),
						id: z.string().nullable().optional(),
						instance_id: z.string().nullable().optional(),
						is_moderated: z.boolean().nullable().optional(),
						meeting_type: z
							.enum([
								'CUSTOM_UNIQUE_MEETING',
								'LARGE_MEETING',
								'PERSONAL',
								'UNIQUE_MEETING',
							])
							.or(z.string())
							.nullable()
							.optional(),
						meeting_url: z.string().nullable().optional(),
						organizer_pin: z.string().nullable().optional(),
						participant_pin: z.string().nullable().optional(),
						participants_info: z
							.array(
								z
									.object({
										call_in_method: z.string().nullable().optional(),
										contact_id: z.string().nullable().optional(),
										display_name: z.string().nullable().optional(),
										email: z.string().nullable().optional(),
										is_organizer: z.boolean().nullable().optional(),
										name: z.string().nullable().optional(),
										phone: z.string().nullable().optional(),
										phone_number: z.string().nullable().optional(),
										talk_time: dialpadInteger(z.number().int())
											.nullable()
											.optional(),
									})
									.loose(),
							)
							.nullable()
							.optional(),
						recurrence: z.string().nullable().optional(),
						recurrence_end_date: z.string().nullable().optional(),
						start_datetime: z.string().nullable().optional(),
						timezone: z.string().nullable().optional(),
						title: z.string().nullable().optional(),
					})
					.loose(),
			)
			.nullable()
			.optional(),
	})
	.loose();

const Input211 = z
	.object({
		query: z
			.object({
				silent: z.boolean().optional(),
				keys: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output211 = z.array(z.object({}).loose());

const Input212 = z.object({}).strict();

const Output212 = z
	.object({
		capability: z.string(),
		clientId: z.string(),
		expires: dialpadInteger(z.number().int()),
		issued: dialpadInteger(z.number().int()),
		keyName: z.string(),
		token: z.string(),
	})
	.loose();

const Input213 = z
	.object({
		path: z
			.object({
				contact_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output213 = z
	.object({
		company_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		contact_id: z.string().max(1500),
		contact_type: z.string().max(1500),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		email: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		emails: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		first_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		job_title: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		key: z.string(),
		last_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phone_number: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phones: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input214 = z
	.object({
		path: z
			.object({
				kind: z.string(),
			})
			.strict(),
		query: z
			.object({
				ids: z.string().optional(),
				keys: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output214 = z.array(z.object({}).loose());

const Input215 = z
	.object({
		path: z
			.object({
				kind: z.string(),
			})
			.strict(),
		query: z
			.object({
				ids: z.string().optional(),
				keys: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output215 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input216 = z
	.object({
		body: z
			.object({
				properties: z.array(
					z
						.object({
							display_name: z
								.union([
									z.string().max(100),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							name: z.string().max(50).regex(new RegExp('^[a-zA-Z0-9_]+$')),
						})
						.strict(),
				),
			})
			.strict(),
	})
	.strict();

const Output216 = z.array(
	z
		.object({
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			display_name: z
				.union([
					z.string().max(100),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			key: z.string(),
			name: z.string().max(50),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input217 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				name: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output217 = z.array(
	z
		.object({
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			display_name: z
				.union([
					z.string().max(100),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			key: z.string(),
			name: z.string().max(50),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input218 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output218 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		display_name: z
			.union([
				z.string().max(100),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(50),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input219 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
		body: z
			.object({
				display_name: z
					.union([
						z.string().max(100),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output219 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		display_name: z
			.union([
				z.string().max(100),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(50),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input220 = z
	.object({
		path: z
			.object({
				service: z.string(),
			})
			.strict(),
	})
	.strict();

const Output220 = z
	.object({
		access_expiration: dialpadInteger(z.number().int()).optional(),
		access_expiration_iso: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		instance_url: z.string().max(1500),
		key: z.string(),
		organization_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		service: z.enum(['salesforce']).or(z.string()),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
	})
	.loose();

const Input221 = z
	.object({
		path: z
			.object({
				company_id: dialpadInteger(z.number().int()),
			})
			.strict(),
		body: z
			.object({
				action: z
					.union([
						z.enum(['reset_call_attempt_limits']),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				company_attempt_limits: z
					.object({
						all_campaigns: z
							.object({
								daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
								enabled: z.boolean().optional(),
								rolling_in_days: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								rolling_limit: dialpadInteger(
									z.number().int().min(1),
								).optional(),
							})
							.strict()
							.optional(),
						per_campaign: z
							.object({
								daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
								enabled: z.boolean().optional(),
								rolling_in_days: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								rolling_limit: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								total_limit: dialpadInteger(z.number().int().min(1)).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				contact_attempt_limits: z
					.object({
						all_campaigns: z
							.object({
								daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
								enabled: z.boolean().optional(),
								rolling_in_days: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								rolling_limit: dialpadInteger(
									z.number().int().min(1),
								).optional(),
							})
							.strict()
							.optional(),
						per_campaign: z
							.object({
								daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
								enabled: z.boolean().optional(),
								rolling_in_days: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								rolling_limit: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								total_limit: dialpadInteger(z.number().int().min(1)).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				fdcpa_settings: z
					.object({
						attempted_call_rolling_days: dialpadInteger(
							z.number().int().gt(0),
						).optional(),
						connected_call_rolling_days: dialpadInteger(
							z.number().int().gt(0),
						).optional(),
						enabled: z.boolean().optional(),
						max_attempted_calls: dialpadInteger(
							z.number().int().gt(0),
						).optional(),
						max_connected_calls: dialpadInteger(
							z.number().int().gt(0),
						).optional(),
					})
					.strict()
					.optional(),
				idle_boost_threshold_seconds: dialpadInteger(
					z.number().int(),
				).optional(),
				phone_attempt_limits: z
					.object({
						all_campaigns: z
							.object({
								daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
								enabled: z.boolean().optional(),
								rolling_in_days: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								rolling_limit: dialpadInteger(
									z.number().int().min(1),
								).optional(),
							})
							.strict()
							.optional(),
						per_campaign: z
							.object({
								daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
								enabled: z.boolean().optional(),
								rolling_in_days: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								rolling_limit: dialpadInteger(
									z.number().int().min(1),
								).optional(),
								total_limit: dialpadInteger(z.number().int().min(1)).optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
				salesforce: z
					.object({
						sfdc_contact: z
							.object({
								custom_mapping:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								lead_mapping:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.strict()
							.optional(),
						sfdc_lead: z
							.object({
								custom_mapping:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								lead_mapping:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.strict()
							.optional(),
						sfdc_opportunity: z
							.object({
								custom_mapping:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								lead_mapping:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.strict()
							.optional(),
					})
					.strict()
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output221 = z
	.object({
		company_attempt_limits: z
			.object({
				all_campaigns: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
				per_campaign: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
						total_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_attempt_limits: z
			.object({
				all_campaigns: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
				per_campaign: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
						total_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		fdcpa_settings: z
			.object({
				attempted_call_rolling_days: dialpadInteger(
					z.number().int().gt(0),
				).optional(),
				connected_call_rolling_days: dialpadInteger(
					z.number().int().gt(0),
				).optional(),
				enabled: z.boolean().optional(),
				max_attempted_calls: dialpadInteger(z.number().int().gt(0)).optional(),
				max_connected_calls: dialpadInteger(z.number().int().gt(0)).optional(),
			})
			.loose()
			.optional(),
		id: z.string(),
		idle_boost_threshold_seconds: dialpadInteger(z.number().int()).optional(),
		key: z.string(),
		phone_attempt_limits: z
			.object({
				all_campaigns: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
				per_campaign: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
						total_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		salesforce: z
			.object({
				sfdc_contact: z
					.object({
						custom_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
						lead_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
					})
					.loose()
					.optional(),
				sfdc_lead: z
					.object({
						custom_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
						lead_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
					})
					.loose()
					.optional(),
				sfdc_opportunity: z
					.object({
						custom_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
						lead_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input222 = z
	.object({
		path: z
			.object({
				id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output222 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input223 = z
	.object({
		path: z
			.object({
				company_id: dialpadInteger(z.number().int()),
			})
			.strict(),
	})
	.strict();

const Output223 = z
	.object({
		company_attempt_limits: z
			.object({
				all_campaigns: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
				per_campaign: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
						total_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_attempt_limits: z
			.object({
				all_campaigns: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
				per_campaign: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
						total_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		fdcpa_settings: z
			.object({
				attempted_call_rolling_days: dialpadInteger(
					z.number().int().gt(0),
				).optional(),
				connected_call_rolling_days: dialpadInteger(
					z.number().int().gt(0),
				).optional(),
				enabled: z.boolean().optional(),
				max_attempted_calls: dialpadInteger(z.number().int().gt(0)).optional(),
				max_connected_calls: dialpadInteger(z.number().int().gt(0)).optional(),
			})
			.loose()
			.optional(),
		id: z.string(),
		idle_boost_threshold_seconds: dialpadInteger(z.number().int()).optional(),
		key: z.string(),
		phone_attempt_limits: z
			.object({
				all_campaigns: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
				per_campaign: z
					.object({
						daily_limit: dialpadInteger(z.number().int().min(1)).optional(),
						enabled: z.boolean().optional(),
						rolling_in_days: dialpadInteger(z.number().int().min(1)).optional(),
						rolling_limit: dialpadInteger(z.number().int().min(1)).optional(),
						total_limit: dialpadInteger(z.number().int().min(1)).optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
		salesforce: z
			.object({
				sfdc_contact: z
					.object({
						custom_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
						lead_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
					})
					.loose()
					.optional(),
				sfdc_lead: z
					.object({
						custom_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
						lead_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
					})
					.loose()
					.optional(),
				sfdc_opportunity: z
					.object({
						custom_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
						lead_mapping:
							/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
								.unknown()
								.optional(),
					})
					.loose()
					.optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input224 = z
	.object({
		query: z
			.object({
				order: z.string().optional(),
				subject_id: z.string().optional(),
				campaign_id: z.string().optional(),
				tags: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output224 = z.array(
	z
		.object({
			campaign_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			details: z.object({}).loose().optional(),
			event_id: z.string().max(64),
			id: z.string(),
			key: z.string(),
			message: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			severity: z.enum(['info', 'warn', 'error']).or(z.string()).optional(),
			subject: z
				.union([
					z
						.object({
							addresses: z
								.array(
									z
										.object({
											city: /* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
											country:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											line1:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											line2:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											name: /* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
											postal_code:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											region:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
										})
										.loose(),
								)
								.max(20)
								.optional(),
							company_id: dialpadInteger(z.number().int()),
							contact_id: z
								.union([
									z.string().max(1024),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							contact_type: z
								.union([
									z.string().max(16),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							csv_id: z
								.union([
									z.string().max(64),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							csv_line: z
								.union([
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							custom: z.object({}).loose().optional(),
							date_created: dialpadInteger(z.number().int()).optional(),
							date_created_iso: z.string().optional(),
							date_first_contacted: dialpadInteger(z.number().int()).optional(),
							date_first_contacted_iso: z.string().optional(),
							date_last_contacted: dialpadInteger(z.number().int()).optional(),
							date_last_contacted_iso: z.string().optional(),
							date_modified: dialpadInteger(z.number().int()).optional(),
							date_modified_iso: z.string().optional(),
							department: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							emails: z
								.array(
									z
										.object({
											domain:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											email:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											label:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
										})
										.loose(),
								)
								.max(50)
								.optional(),
							engagement_score: z
								.union([
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							external_id: z
								.union([
									z.string().max(1024),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							first_name: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							home_phone: z
								.union([
									z.string().max(20),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							id: z.string(),
							image_url: z.string().optional(),
							industry: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							job_title: z
								.union([
									z.string().max(1500),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							key: z.string(),
							lang: z
								.union([
									z.string().max(2),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_medium: z
								.union([
									z.string().max(16),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_name: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							lead_company_id: z
								.union([
									z.string().max(64),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							lead_id: z.string().max(64),
							lead_score: z
								.union([
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							lead_source: z
								.enum([
									'hubspot',
									'csv',
									'callback',
									'api',
									'salesforce',
									'receptionist',
								])
								.or(z.string())
								.optional(),
							mobile_phone: z
								.union([
									z.string().max(20),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							name: z.string().optional(),
							owner_id: z
								.union([
									z.string().max(64),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							owner_type: z
								.union([
									z.string().max(16),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							phones: z
								.array(
									z
										.object({
											country:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											display:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											label:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
													.unknown()
													.optional(),
											number:
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										})
										.loose(),
								)
								.max(20)
								.optional(),
							preferred_medium: z
								.union([
									z.string().max(16),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							primary_address: z
								.union([
									z.object({}).loose(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							primary_email: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							primary_phone: z
								.union([
									z.string().max(20),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							remote_id: z
								.union([
									z.string().max(1024),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							role: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							secondary_email: z
								.union([
									z.string().max(50),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							secondary_phone: z
								.union([
									z.string().max(20),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							state: z
								.enum(['pending', 'active', 'deleted'])
								.or(z.string())
								.optional(),
							tags: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							timezone: z
								.union([
									z.string().max(36),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							company_id: dialpadInteger(z.number().int()),
							consent: z
								.enum(['implied', 'consent', 'written_consent', 'revoked'])
								.or(z.string())
								.optional(),
							date_created: dialpadInteger(z.number().int()).optional(),
							date_created_iso: z.string().optional(),
							date_dnc_expires: dialpadInteger(z.number().int()).optional(),
							date_dnc_expires_iso: z.string().optional(),
							date_dnc_opt_out: dialpadInteger(z.number().int()).optional(),
							date_dnc_opt_out_iso: z.string().optional(),
							date_dnt_expires: dialpadInteger(z.number().int()).optional(),
							date_dnt_expires_iso: z.string().optional(),
							date_dnt_opt_out: dialpadInteger(z.number().int()).optional(),
							date_dnt_opt_out_iso: z.string().optional(),
							date_modified: dialpadInteger(z.number().int()).optional(),
							date_modified_iso: z.string().optional(),
							dnc: z
								.union([
									z.boolean(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							dnc_scope: z
								.enum(['powerdialer', 'ever'])
								.or(z.string())
								.optional(),
							dnt: z
								.union([
									z.boolean(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							dnt_scope: z
								.enum(['powerdialer', 'ever'])
								.or(z.string())
								.optional(),
							e164: z.string().max(20),
							formatted_phone: z
								.union([
									z.string().max(20),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							id: z.string(),
							is_dnc_expired: z.boolean().optional(),
							is_dnt_expired: z.boolean().optional(),
							key: z.string(),
							label: z
								.enum(['mobile', 'work', 'home', 'other'])
								.or(z.string())
								.optional(),
							last_author_dp_key: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_author_id: z
								.union([
									z.string().max(64),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_csv_id: z
								.union([
									z.string().max(64),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_source: z
								.enum(['api', 'csv', 'dp_contact'])
								.or(z.string())
								.optional(),
							state: z.enum(['active', 'deleted']).or(z.string()).optional(),
							tags: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							timezone: z
								.union([
									z.string().max(36),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							validity: z
								.enum([
									'good',
									'unverified',
									'disconnected',
									'fax',
									'spam',
									'wrong_number',
								])
								.or(z.string())
								.optional(),
						})
						.loose(),
					z
						.object({
							call_id: z.string().optional(),
							call_key: z.string().optional(),
							campaign_id: z
								.union([
									z.string().max(1500),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							company_id: dialpadInteger(z.number().int()),
							contact_id: z.string().optional(),
							contact_key: z.string().optional(),
							csv: z.object({}).loose().optional(),
							current_rule_id: z.string().optional(),
							current_rule_key: z.string().optional(),
							date_created: dialpadInteger(z.number().int()).optional(),
							date_created_iso: z.string().optional(),
							date_estimate: dialpadInteger(z.number().int()).optional(),
							date_estimate_iso: z.string().optional(),
							date_modified: dialpadInteger(z.number().int()).optional(),
							date_modified_iso: z.string().optional(),
							history: z
								.object({
									call_attempts: dialpadInteger(
										z.number().int().min(0),
									).optional(),
									last_call_id: z
										.union([
											dialpadInteger(z.number().int()),
											/* unknown because the official OpenAPI schema is not documented for this value. */ z
												.unknown()
												.nullable(),
										])
										.optional(),
									last_categories: z
										.union([
											z.array(
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											),
											/* unknown because the official OpenAPI schema is not documented for this value. */ z
												.unknown()
												.nullable(),
										])
										.optional(),
									last_error_id: z
										.union([
											z.string(),
											/* unknown because the official OpenAPI schema is not documented for this value. */ z
												.unknown()
												.nullable(),
										])
										.optional(),
									rules:
										/* OpenAPI documents arbitrary fields on this response object. */ z
											.record(
												z.string(),
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
								})
								.loose()
								.optional(),
							id: z.string(),
							index: z.number().optional(),
							item_id: z.string().max(1500),
							key: z.string(),
							lead_id: z.string().optional(),
							lead_key: z.string().optional(),
							list_id: z.string().max(1500),
							result_code: z
								.enum([
									'call:powerdialer_no_available_agent',
									'call:human_agent',
									'call:ai_agent',
									'call:outbound_connected',
									'call:powerdialer_vm_drop',
									'call:machine_detected',
									'call:powerdialer_call',
									'call:active',
									'call:outbound',
									'call:cancelled',
									'call:inbound',
									'call:missed',
									'call:abandoned',
									'call:user_initiated',
									'call:max_attempts_item',
									'call:max_attempts_delay_not_met',
									'call:max_attempts_criteria_not_met',
									'call:max_attempts_campaign_phone_total',
									'call:max_attempts_campaign_phone_daily',
									'call:max_attempts_campaign_phone_rolling',
									'call:max_attempts_campaign_contact_total',
									'call:max_attempts_campaign_contact_daily',
									'call:max_attempts_campaign_contact_rolling',
									'call:max_attempts_campaign_company_total',
									'call:max_attempts_campaign_company_daily',
									'call:max_attempts_campaign_company_rolling',
									'call:max_attempts_global_phone_daily',
									'call:max_attempts_global_phone_rolling',
									'call:max_attempts_global_contact_daily',
									'call:max_attempts_global_contact_rolling',
									'call:max_attempts_global_company_daily',
									'call:max_attempts_global_company_rolling',
									'call:dnc',
									'call:timegate_failed',
									'call:fdcpa_max_attempted',
									'call:fdcpa_max_connected',
									'call:no_consent',
									'call:skipped',
									'sms:dnt',
									'sms:timegate_failed',
									'sms:no_consent',
									'sms:skipped',
									'sms:accepted',
									'sms:invalid_destination',
									'sms:invalid_source',
									'sms:no_route',
									'sms:rejected_spam',
									'sms:internal_error',
									'sms:rejected',
									'sms:not_supported',
									'sms:time_out',
									'sms:error',
									'sms:unknown',
									'sms:forbidden',
									'sms:owner_no_international_messaging',
									'sms:unregistered_a2p_not_allowed',
									'sms:owner_not_enough_sms_credits',
									'sms:owner_not_enough_credits',
									'sms:messaging_disabled',
									'sms:owner_free_user',
									'sms:contact_missing_number',
									'sms:contact_is_room',
									'sms:contact_is_shared_line',
									'sms:staff_contact',
									'sms:company_affinity',
									'sms:not_in_free_company',
									'sms:invalid_number',
								])
								.or(z.string())
								.optional(),
							sms_id: z.string().optional(),
							sms_key: z.string().optional(),
							state: z
								.enum([
									'pending',
									'launching',
									'scheduled',
									'active',
									'paused',
									'complete',
									'error',
									'deleted',
									'cancelled',
									'incomplete',
								])
								.or(z.string())
								.optional(),
							status: z
								.enum([
									'Upcoming',
									'In Progress',
									'Rescheduled',
									'Complete',
									'Error',
									'Excluded',
									'Incomplete',
								])
								.or(z.string())
								.optional(),
							tags: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
						})
						.loose(),
					z
						.object({
							audience_ids: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							audience_keys: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							author_dp_key: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							author_id: z.string().optional(),
							author_key: z.string().optional(),
							company_id: dialpadInteger(z.number().int()),
							csv_columns: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							csv_ids: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							csv_keys: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							date_created: dialpadInteger(z.number().int()).optional(),
							date_created_iso: z.string().optional(),
							date_modified: dialpadInteger(z.number().int()).optional(),
							date_modified_iso: z.string().optional(),
							date_user_modified: dialpadInteger(z.number().int()).optional(),
							date_user_modified_iso: z.string().optional(),
							id: z.string(),
							is_shared: z.boolean().optional(),
							key: z.string(),
							last_author_dp_key: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_author_id_id: z.string().optional(),
							last_author_id_key: z.string().optional(),
							lead_order: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							list_id: z.string().max(1500),
							name: z.string().max(1500).optional(),
							num_csv_rows: dialpadInteger(z.number().int()).optional(),
							num_manual_rows: dialpadInteger(z.number().int()).optional(),
							num_query_rows: dialpadInteger(z.number().int()).optional(),
							num_rows: dialpadInteger(z.number().int()).optional(),
							num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
							office_id: z
								.union([
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							salesforce_listview_id: z
								.union([
									z.string().max(1500),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							sort_name: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							static_list_ids: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							static_list_keys: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
							tags: z
								.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								)
								.optional(),
						})
						.loose(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			subject_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			subject_type: z
				.enum(['Lead', 'Phone', 'LeadListItem', 'LeadList'])
				.or(z.string())
				.nullable()
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input225 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				tag: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output225 = z.array(
	z
		.object({
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			job_id: z.string().max(1500),
			key: z.string(),
			labels: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			name: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			results: z
				.union([
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			runner: z
				.union([
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z
				.enum([
					'pending',
					'mapping',
					'batching',
					'reducing',
					'complete',
					'error',
				])
				.or(z.string())
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input226 = z
	.object({
		path: z
			.object({
				job_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output226 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		job_id: z.string().max(1500),
		key: z.string(),
		labels: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		results: z
			.union([
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		runner: z
			.union([
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum(['pending', 'mapping', 'batching', 'reducing', 'complete', 'error'])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input227 = z
	.object({
		path: z
			.object({
				key_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output227 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		service_account_id: z.string().optional(),
		service_account_key: z.string().optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		token: z.string().optional(),
		token_hash: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		token_tail: z.string().optional(),
		type: z.enum(['base', 'public', 'dialer']).or(z.string()),
		user_id: z.string().optional(),
		user_key: z.string().optional(),
	})
	.loose();

const Input228 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				mine: z.boolean().optional(),
				service_account_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output228 = z.array(
	z
		.object({
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			name: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			service_account_id: z.string().optional(),
			service_account_key: z.string().optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			token: z.string().optional(),
			token_hash: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			token_tail: z.string().optional(),
			type: z.enum(['base', 'public', 'dialer']).or(z.string()),
			user_id: z.string().optional(),
			user_key: z.string().optional(),
		})
		.loose(),
);

const Input229 = z
	.object({
		query: z
			.object({
				target_id: z.string(),
				cached: z.boolean().optional(),
			})
			.strict(),
	})
	.strict();

const Output229 = z.array(
	z
		.object({
			company_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			duty_status_reason: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			emails: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			group_details: z.object({}).loose().optional(),
			group_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			id: z.string(),
			image_url: z.string(),
			key: z.string(),
			max_wrap_up_seconds: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			name: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			on_duty_group_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			on_duty_status: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			phones: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			ring_seconds: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			role: z
				.union([
					z.string().max(16),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z
				.union([
					z.string().max(16),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			target_id: z.string().max(1500),
			target_type: z
				.enum([
					'user',
					'room',
					'callcenter',
					'department',
					'office',
					'company',
					'service_account',
				])
				.or(z.string()),
			timezone: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input230 = z.object({}).strict();

const Output230 = z
	.object({
		company: z
			.object({
				account_type: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				call_center_sku: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				company_id: dialpadInteger(z.number().int()),
				country: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				display_name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				id: z.string(),
				key: z.string(),
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose(),
		config:
			/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
		user: z
			.object({
				company_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				duty_status_reason: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				emails: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				group_details: z.object({}).loose().optional(),
				group_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				id: z.string(),
				image_url: z.string(),
				key: z.string(),
				max_wrap_up_seconds: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				on_duty_group_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				on_duty_status: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				phones: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				ring_seconds: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				state: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				target_id: z.string().max(1500),
				target_type: z
					.enum([
						'user',
						'room',
						'callcenter',
						'department',
						'office',
						'company',
						'service_account',
					])
					.or(z.string()),
				timezone: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose(),
	})
	.loose();

const Input231 = z
	.object({
		path: z
			.object({
				key_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output231 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input232 = z
	.object({
		path: z
			.object({
				key_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				name: z
					.union([
						z.string().max(100),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output232 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		service_account_id: z.string().optional(),
		service_account_key: z.string().optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		token: z.string().optional(),
		token_hash: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		token_tail: z.string().optional(),
		type: z.enum(['base', 'public', 'dialer']).or(z.string()),
		user_id: z.string().optional(),
		user_key: z.string().optional(),
	})
	.loose();

const Input233 = z
	.object({
		query: z
			.object({
				raw: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output233 = z
	.object({
		company: z
			.object({
				account_type: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				call_center_sku: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				company_id: dialpadInteger(z.number().int()),
				country: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				display_name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				id: z.string(),
				key: z.string(),
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose(),
		config:
			/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
		user: z
			.object({
				company_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				duty_status_reason: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				emails: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				group_details: z.object({}).loose().optional(),
				group_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				id: z.string(),
				image_url: z.string(),
				key: z.string(),
				max_wrap_up_seconds: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				on_duty_group_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				on_duty_status: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				phones: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				ring_seconds: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				state: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				target_id: z.string().max(1500),
				target_type: z
					.enum([
						'user',
						'room',
						'callcenter',
						'department',
						'office',
						'company',
						'service_account',
					])
					.or(z.string()),
				timezone: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose(),
	})
	.loose();

const Input234 = z
	.object({
		body: z
			.object({
				name: z
					.union([
						z.string().max(100),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				service_account_id: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output234 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		service_account_id: z.string().optional(),
		service_account_key: z.string().optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		token: z.string().optional(),
		token_full: z.string(),
		token_hash: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		token_tail: z.string().optional(),
		type: z.enum(['base', 'public', 'dialer']).or(z.string()),
		user_id: z.string().optional(),
		user_key: z.string().optional(),
	})
	.loose();

const Input235 = z
	.object({
		body: z
			.object({
				name: z.string().max(100),
				role: z.enum(['admin', 'read_only']).optional(),
			})
			.strict(),
	})
	.strict();

const Output235 = z
	.object({
		company_id: z.string().optional(),
		company_key: z.string().optional(),
		csr_permissions: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csr_roles: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dialpad_user_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		experiments: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		is_company_admin: z.boolean().optional(),
		is_default: z.boolean().optional(),
		key: z.string(),
		name: z.string().max(100),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z.enum(['admin', 'read_only']).or(z.string()).optional(),
		roles: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_key: z.string().optional(),
		user_id: z.string().optional(),
		user_key: z.string().optional(),
	})
	.loose();

const Input236 = z
	.object({
		path: z
			.object({
				account_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output236 = z
	.object({
		company_id: z.string().optional(),
		company_key: z.string().optional(),
		csr_permissions: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csr_roles: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dialpad_user_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		experiments: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		is_company_admin: z.boolean().optional(),
		is_default: z.boolean().optional(),
		key: z.string(),
		name: z.string().max(100),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z.enum(['admin', 'read_only']).or(z.string()).optional(),
		roles: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_key: z.string().optional(),
		user_id: z.string().optional(),
		user_key: z.string().optional(),
	})
	.loose();

const Input237 = z
	.object({
		path: z
			.object({
				account_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				name: z
					.union([
						z.string().max(100),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.enum(['admin', 'read_only']),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output237 = z
	.object({
		company_id: z.string().optional(),
		company_key: z.string().optional(),
		csr_permissions: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csr_roles: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dialpad_user_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		experiments: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		is_company_admin: z.boolean().optional(),
		is_default: z.boolean().optional(),
		key: z.string(),
		name: z.string().max(100),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z.enum(['admin', 'read_only']).or(z.string()).optional(),
		roles: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_key: z.string().optional(),
		user_id: z.string().optional(),
		user_key: z.string().optional(),
	})
	.loose();

const Input238 = z
	.object({
		path: z
			.object({
				account_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output238 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input239 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				target_type: z.string(),
				target_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output239 = z.array(
	z
		.object({
			contact_id: z.string().optional(),
			contact_key: z.string().optional(),
			date_created: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			delivery_status: z
				.enum([
					'accepted',
					'invalid_destination',
					'invalid_source',
					'no_route',
					'rejected_spam',
					'rejected',
					'internal_error',
					'not_supported',
					'unknown',
				])
				.or(z.string())
				.optional(),
			direction: z.enum(['inbound', 'outbound']).or(z.string()),
			from_number: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			key: z.string(),
			mms: z
				.union([
					z.boolean(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sender_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sms_id: dialpadInteger(z.number().int()),
			target_id: z.string().optional(),
			target_key: z.string().optional(),
			text: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			to_number: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input240 = z
	.object({
		body: z
			.object({
				fake: /* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.optional(),
				item_id: z.string(),
				text: z.string().optional(),
			})
			.strict(),
	})
	.strict();

const Output240 = z
	.object({
		call_id: z.string().optional(),
		call_key: z.string().optional(),
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_id: z.string().optional(),
		contact_key: z.string().optional(),
		csv: z.object({}).loose().optional(),
		current_rule_id: z.string().optional(),
		current_rule_key: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_estimate: dialpadInteger(z.number().int()).optional(),
		date_estimate_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		history: z
			.object({
				call_attempts: dialpadInteger(z.number().int().min(0)).optional(),
				last_call_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_categories: z
					.union([
						z.array(
							z.union([
								z
									.enum([
										'call:powerdialer_no_available_agent',
										'call:human_agent',
										'call:ai_agent',
										'call:outbound_connected',
										'call:powerdialer_vm_drop',
										'call:machine_detected',
										'call:powerdialer_call',
										'call:active',
										'call:outbound',
										'call:cancelled',
										'call:inbound',
										'call:missed',
										'call:abandoned',
										'call:user_initiated',
									])
									.or(z.string()),
								z
									.enum([
										'sms:accepted',
										'sms:invalid_destination',
										'sms:invalid_source',
										'sms:no_route',
										'sms:rejected_spam',
										'sms:internal_error',
										'sms:rejected',
										'sms:not_supported',
										'sms:time_out',
										'sms:error',
										'sms:unknown',
										'sms:forbidden',
										'sms:owner_no_international_messaging',
										'sms:unregistered_a2p_not_allowed',
										'sms:owner_not_enough_sms_credits',
										'sms:owner_not_enough_credits',
										'sms:messaging_disabled',
										'sms:owner_free_user',
										'sms:contact_missing_number',
										'sms:contact_is_room',
										'sms:contact_is_shared_line',
										'sms:staff_contact',
										'sms:company_affinity',
										'sms:not_in_free_company',
										'sms:invalid_number',
									])
									.or(z.string()),
								z
									.enum([
										'call:max_attempts_item',
										'call:max_attempts_delay_not_met',
										'call:max_attempts_criteria_not_met',
										'call:max_attempts_campaign_phone_total',
										'call:max_attempts_campaign_phone_daily',
										'call:max_attempts_campaign_phone_rolling',
										'call:max_attempts_campaign_contact_total',
										'call:max_attempts_campaign_contact_daily',
										'call:max_attempts_campaign_contact_rolling',
										'call:max_attempts_campaign_company_total',
										'call:max_attempts_campaign_company_daily',
										'call:max_attempts_campaign_company_rolling',
										'call:max_attempts_global_phone_daily',
										'call:max_attempts_global_phone_rolling',
										'call:max_attempts_global_contact_daily',
										'call:max_attempts_global_contact_rolling',
										'call:max_attempts_global_company_daily',
										'call:max_attempts_global_company_rolling',
									])
									.or(z.string()),
								z.string(),
							]),
						),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_error_id: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				rules:
					/* OpenAPI documents arbitrary fields on this response object. */ z
						.record(
							z.string(),
							z
								.object({
									attempts:
										/* OpenAPI documents arbitrary fields on this response object. */ z
											.record(
												z.string(),
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
									rule_type: z.string().optional(),
								})
								.loose(),
						)
						.optional(),
			})
			.loose()
			.optional(),
		id: z.string(),
		index: z.number().optional(),
		item_id: z.string().max(1500),
		key: z.string(),
		lead_id: z.string().optional(),
		lead_key: z.string().optional(),
		list_id: z.string().max(1500),
		result_code: z
			.enum([
				'call:powerdialer_no_available_agent',
				'call:human_agent',
				'call:ai_agent',
				'call:outbound_connected',
				'call:powerdialer_vm_drop',
				'call:machine_detected',
				'call:powerdialer_call',
				'call:active',
				'call:outbound',
				'call:cancelled',
				'call:inbound',
				'call:missed',
				'call:abandoned',
				'call:user_initiated',
				'call:max_attempts_item',
				'call:max_attempts_delay_not_met',
				'call:max_attempts_criteria_not_met',
				'call:max_attempts_campaign_phone_total',
				'call:max_attempts_campaign_phone_daily',
				'call:max_attempts_campaign_phone_rolling',
				'call:max_attempts_campaign_contact_total',
				'call:max_attempts_campaign_contact_daily',
				'call:max_attempts_campaign_contact_rolling',
				'call:max_attempts_campaign_company_total',
				'call:max_attempts_campaign_company_daily',
				'call:max_attempts_campaign_company_rolling',
				'call:max_attempts_global_phone_daily',
				'call:max_attempts_global_phone_rolling',
				'call:max_attempts_global_contact_daily',
				'call:max_attempts_global_contact_rolling',
				'call:max_attempts_global_company_daily',
				'call:max_attempts_global_company_rolling',
				'call:dnc',
				'call:timegate_failed',
				'call:fdcpa_max_attempted',
				'call:fdcpa_max_connected',
				'call:no_consent',
				'call:skipped',
				'sms:dnt',
				'sms:timegate_failed',
				'sms:no_consent',
				'sms:skipped',
				'sms:accepted',
				'sms:invalid_destination',
				'sms:invalid_source',
				'sms:no_route',
				'sms:rejected_spam',
				'sms:internal_error',
				'sms:rejected',
				'sms:not_supported',
				'sms:time_out',
				'sms:error',
				'sms:unknown',
				'sms:forbidden',
				'sms:owner_no_international_messaging',
				'sms:unregistered_a2p_not_allowed',
				'sms:owner_not_enough_sms_credits',
				'sms:owner_not_enough_credits',
				'sms:messaging_disabled',
				'sms:owner_free_user',
				'sms:contact_missing_number',
				'sms:contact_is_room',
				'sms:contact_is_shared_line',
				'sms:staff_contact',
				'sms:company_affinity',
				'sms:not_in_free_company',
				'sms:invalid_number',
			])
			.or(z.string())
			.optional(),
		sms_id: z.string().optional(),
		sms_key: z.string().optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
				'incomplete',
			])
			.or(z.string())
			.optional(),
		status: z
			.enum([
				'Upcoming',
				'In Progress',
				'Rescheduled',
				'Complete',
				'Error',
				'Excluded',
				'Incomplete',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input241 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output241 = z.array(
	z
		.object({
			company_id: z.string().optional(),
			company_key: z.string().optional(),
			csr_permissions: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			csr_roles: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			dialpad_user_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			experiments: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			id: z.string(),
			is_company_admin: z.boolean().optional(),
			is_default: z.boolean().optional(),
			key: z.string(),
			name: z.string().max(100),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			role: z.enum(['admin', 'read_only']).or(z.string()).optional(),
			roles: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			target_key: z.string().optional(),
			user_id: z.string().optional(),
			user_key: z.string().optional(),
		})
		.loose(),
);

const Input242 = z.object({}).strict();

const Output242 = z
	.object({
		company_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		duty_status_reason: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		emails: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		group_details: z.object({}).loose().optional(),
		group_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		image_url: z.string(),
		key: z.string(),
		max_wrap_up_seconds: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		on_duty_group_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		on_duty_status: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phones: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		ring_seconds: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		target_id: z.string().max(1500),
		target_type: z
			.enum([
				'user',
				'room',
				'callcenter',
				'department',
				'office',
				'company',
				'service_account',
			])
			.or(z.string()),
		timezone: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input243 = z
	.object({
		path: z
			.object({
				worker_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output243 = z
	.object({
		campaign_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_expiration: dialpadInteger(z.number().int()).optional(),
		date_expiration_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		is_temporary: z.boolean().optional(),
		item_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		item_key: z.string().optional(),
		key: z.string(),
		state: z.string().max(1500).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		worker_id: z.string().max(1500),
	})
	.loose();

const Input244 = z
	.object({
		path: z
			.object({
				worker_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['heal']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output244 = z
	.object({
		campaign_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_expiration: dialpadInteger(z.number().int()).optional(),
		date_expiration_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		is_temporary: z.boolean().optional(),
		item_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		item_key: z.string().optional(),
		key: z.string(),
		state: z.string().max(1500).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		worker_id: z.string().max(1500),
	})
	.loose();

const Input245 = z
	.object({
		query: z
			.object({
				campaign_id: z.string().optional(),
				tags: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output245 = z.array(
	z
		.object({
			campaign_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_expiration: dialpadInteger(z.number().int()).optional(),
			date_expiration_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			is_temporary: z.boolean().optional(),
			item_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			item_key: z.string().optional(),
			key: z.string(),
			state: z.string().max(1500).optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			worker_id: z.string().max(1500),
		})
		.loose(),
);

const Input246 = z
	.object({
		body: z
			.object({
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				query: z
					.union([
						z
							.object({
								field: z.string(),
								op: z.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								]),
								value: z
									.union([
										z.string(),
										dialpadInteger(z.number().int()),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
						z
							.object({
								combiner: z.enum(['AND', 'OR']),
								conditions: z.array(
									z.union([
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									]),
								),
							})
							.strict(),
					])
					.optional(),
				state: z.enum(['pending', 'active', 'deleted']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output246 = z
	.object({
		audience_id: z.string().max(1500),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input247 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				target_ids: z.string().optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
					])
					.optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output247 = z.array(
	z
		.object({
			audience_id: z.string().max(1500),
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			name: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			num_rows: dialpadInteger(z.number().int()).optional(),
			query: z
				.union([
					z
						.object({
							field: z.string(),
							op: z
								.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								])
								.or(z.string()),
							value: z
								.union([
									z.string(),
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']).or(z.string()),
							conditions: z.array(
								z.union([
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								]),
							),
						})
						.loose(),
				])
				.optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input248 = z
	.object({
		path: z
			.object({
				audience_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				query: z
					.union([
						z
							.object({
								field: z.string(),
								op: z.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								]),
								value: z
									.union([
										z.string(),
										dialpadInteger(z.number().int()),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
						z
							.object({
								combiner: z.enum(['AND', 'OR']),
								conditions: z.array(
									z.union([
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									]),
								),
							})
							.strict(),
					])
					.optional(),
				state: z.enum(['pending', 'active', 'deleted']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output248 = z
	.object({
		audience_id: z.string().max(1500),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input249 = z
	.object({
		path: z
			.object({
				audience_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output249 = z
	.object({
		audience_id: z.string().max(1500),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input250 = z
	.object({
		body: z
			.object({
				app_id: z.string().max(1500).optional(),
				name: z.string().max(1500).optional(),
				template: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output250 = z
	.object({
		app_id: z.string().max(1500).optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		bot_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(1500).optional(),
		org_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		template: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input251 = z
	.object({
		path: z
			.object({
				audience_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output251 = z
	.object({
		audience_id: z.string().max(1500),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input252 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output252 = z.array(
	z
		.object({
			app_id: z.string().max(1500).optional(),
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			bot_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			name: z.string().max(1500).optional(),
			org_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			template: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input253 = z
	.object({
		path: z
			.object({
				bot_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				app_id: z.string().max(1500).optional(),
				name: z.string().max(1500).optional(),
				template: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output253 = z
	.object({
		app_id: z.string().max(1500).optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		bot_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(1500).optional(),
		org_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		template: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input254 = z
	.object({
		path: z
			.object({
				audience_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output254 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input255 = z
	.object({
		path: z
			.object({
				bot_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output255 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input256 = z
	.object({
		path: z
			.object({
				bot_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output256 = z
	.object({
		app_id: z.string().max(1500).optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		bot_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(1500).optional(),
		org_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		template: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input257 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				bot_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output257 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			bot_dialog_id: z.string().max(1500),
			bot_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			conv_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_last_message: dialpadInteger(z.number().int()).optional(),
			date_last_message_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			state: z
				.enum(['pending', 'active', 'ended', 'error'])
				.or(z.string())
				.optional(),
			template_data: z.object({}).loose().optional(),
		})
		.loose(),
);

const Input258 = z
	.object({
		body: z
			.object({
				bot_id: z.string(),
				template_data: z.object({}).strict().optional(),
				text: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output258 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		bot_dialog_id: z.string().max(1500),
		bot_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		conv_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_last_message: dialpadInteger(z.number().int()).optional(),
		date_last_message_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		state: z
			.enum(['pending', 'active', 'ended', 'error'])
			.or(z.string())
			.optional(),
		template_data: z.object({}).loose().optional(),
	})
	.loose();

const Input259 = z
	.object({
		path: z
			.object({
				bot_dialog_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output259 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input260 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				state: z.string().optional(),
				bot_dialog_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output260 = z.array(
	z
		.object({
			bot_dialog_id: z.string().max(1500),
			bot_message_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			direction: z.enum(['in', 'out']).or(z.string()),
			id: z.string(),
			key: z.string(),
			state: z
				.enum(['pending', 'sent', 'received', 'error'])
				.or(z.string())
				.optional(),
			text: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input261 = z
	.object({
		body: z
			.object({
				bot_dialog_id: z.string().max(1500),
				text: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output261 = z
	.object({
		bot_dialog_id: z.string().max(1500),
		bot_message_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		direction: z.enum(['in', 'out']).or(z.string()),
		id: z.string(),
		key: z.string(),
		state: z
			.enum(['pending', 'sent', 'received', 'error'])
			.or(z.string())
			.optional(),
		text: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input262 = z
	.object({
		path: z
			.object({
				bot_message_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output262 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input263 = z
	.object({
		path: z
			.object({
				bot_message_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output263 = z
	.object({
		bot_dialog_id: z.string().max(1500),
		bot_message_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		direction: z.enum(['in', 'out']).or(z.string()),
		id: z.string(),
		key: z.string(),
		state: z
			.enum(['pending', 'sent', 'received', 'error'])
			.or(z.string())
			.optional(),
		text: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input264 = z
	.object({
		path: z
			.object({
				bot_dialog_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['end']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output264 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		bot_dialog_id: z.string().max(1500),
		bot_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		conv_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_last_message: dialpadInteger(z.number().int()).optional(),
		date_last_message_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		state: z
			.enum(['pending', 'active', 'ended', 'error'])
			.or(z.string())
			.optional(),
		template_data: z.object({}).loose().optional(),
	})
	.loose();

const Input265 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				date_modified_to: z.string().optional(),
				date_modified_from: z.string().optional(),
				date_created_to: z.string().optional(),
				date_created_from: z.string().optional(),
				audience_ids: z.string().optional(),
				static_list_ids: z.string().optional(),
				csv_ids: z.string().optional(),
				list_ids: z.string().optional(),
				states: z.string().optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
						'all',
						'visible',
						'archived',
					])
					.optional(),
				target_ids: z.string().optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output265 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			caller_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			campaign_group_id: z.string().optional(),
			campaign_group_key: z.string().optional(),
			campaign_group_order: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			campaign_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			date_archived: dialpadInteger(z.number().int()).optional(),
			date_archived_iso: z.string().optional(),
			date_audience_computed: dialpadInteger(z.number().int()).optional(),
			date_audience_computed_iso: z.string().optional(),
			date_computed: dialpadInteger(z.number().int()).optional(),
			date_computed_iso: z.string().optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_ended: dialpadInteger(z.number().int()).optional(),
			date_ended_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			date_paused: dialpadInteger(z.number().int()).optional(),
			date_paused_iso: z.string().optional(),
			date_scheduled_end: dialpadInteger(z.number().int()).optional(),
			date_scheduled_end_iso: z.string().optional(),
			date_scheduled_start: dialpadInteger(z.number().int()).optional(),
			date_scheduled_start_iso: z.string().optional(),
			date_started: dialpadInteger(z.number().int()).optional(),
			date_started_iso: z.string().optional(),
			description: z.string().max(300).optional(),
			event_logs_gcs_filename: z.string().max(1500).optional(),
			flow_id: z.string().optional(),
			flow_key: z.string().optional(),
			gcs_filename: z.string().max(1500).optional(),
			group_id: dialpadInteger(z.number().int()).optional(),
			id: z.string(),
			is_dynamic: z.boolean().optional(),
			key: z.string(),
			lead_list_id: z.string().optional(),
			lead_list_key: z.string().optional(),
			name: z.string().max(1500).optional(),
			num_items: dialpadInteger(z.number().int()).optional(),
			num_pending: dialpadInteger(z.number().int()).optional(),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			priority: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			progress: z
				.union([
					z.number(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			queries: z
				.array(
					z.union([
						z
							.object({
								field: z.string(),
								op: z
									.enum([
										'=',
										'~=',
										'!=',
										'>',
										'<',
										'>=',
										'<=',
										'^=',
										'$=',
										'!!',
										'~~',
									])
									.or(z.string()),
								value: z
									.union([
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									])
									.optional(),
							})
							.loose(),
						z
							.object({
								combiner: z.enum(['AND', 'OR']).or(z.string()),
								conditions: z.array(
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								),
							})
							.loose(),
					]),
				)
				.max(20)
				.optional(),
			settings_id: z.string().optional(),
			settings_key: z.string().optional(),
			shared_list_id: z.string().optional(),
			shared_list_key: z.string().optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			source_list_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			state: z
				.enum([
					'pending',
					'launching',
					'scheduled',
					'active',
					'paused',
					'complete',
					'error',
					'deleted',
					'cancelled',
				])
				.or(z.string())
				.optional(),
			strategy: z
				.enum([
					'progressive',
					'predictive',
					'preview',
					'ai_progressive',
					'ai_predictive',
				])
				.or(z.string())
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			target_id: z.string().optional(),
			target_key: z.string().optional(),
		})
		.loose(),
);

const Input266 = z
	.object({
		body: z
			.object({
				audience_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				csv_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_created_from: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_created_to: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_modified_from: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_modified_to: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				list_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				order: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				search: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				state: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				states: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				static_list_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				target_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output266 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			caller_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			campaign_group_id: z.string().optional(),
			campaign_group_key: z.string().optional(),
			campaign_group_order: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			campaign_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			date_archived: dialpadInteger(z.number().int()).optional(),
			date_archived_iso: z.string().optional(),
			date_audience_computed: dialpadInteger(z.number().int()).optional(),
			date_audience_computed_iso: z.string().optional(),
			date_computed: dialpadInteger(z.number().int()).optional(),
			date_computed_iso: z.string().optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_ended: dialpadInteger(z.number().int()).optional(),
			date_ended_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			date_paused: dialpadInteger(z.number().int()).optional(),
			date_paused_iso: z.string().optional(),
			date_scheduled_end: dialpadInteger(z.number().int()).optional(),
			date_scheduled_end_iso: z.string().optional(),
			date_scheduled_start: dialpadInteger(z.number().int()).optional(),
			date_scheduled_start_iso: z.string().optional(),
			date_started: dialpadInteger(z.number().int()).optional(),
			date_started_iso: z.string().optional(),
			description: z.string().max(300).optional(),
			event_logs_gcs_filename: z.string().max(1500).optional(),
			flow_id: z.string().optional(),
			flow_key: z.string().optional(),
			gcs_filename: z.string().max(1500).optional(),
			group_id: dialpadInteger(z.number().int()).optional(),
			id: z.string(),
			is_dynamic: z.boolean().optional(),
			key: z.string(),
			lead_list_id: z.string().optional(),
			lead_list_key: z.string().optional(),
			name: z.string().max(1500).optional(),
			num_items: dialpadInteger(z.number().int()).optional(),
			num_pending: dialpadInteger(z.number().int()).optional(),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			priority: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			progress: z
				.union([
					z.number(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			queries: z
				.array(
					z.union([
						z
							.object({
								field: z.string(),
								op: z
									.enum([
										'=',
										'~=',
										'!=',
										'>',
										'<',
										'>=',
										'<=',
										'^=',
										'$=',
										'!!',
										'~~',
									])
									.or(z.string()),
								value: z
									.union([
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									])
									.optional(),
							})
							.loose(),
						z
							.object({
								combiner: z.enum(['AND', 'OR']).or(z.string()),
								conditions: z.array(
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								),
							})
							.loose(),
					]),
				)
				.max(20)
				.optional(),
			settings_id: z.string().optional(),
			settings_key: z.string().optional(),
			shared_list_id: z.string().optional(),
			shared_list_key: z.string().optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			source_list_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			state: z
				.enum([
					'pending',
					'launching',
					'scheduled',
					'active',
					'paused',
					'complete',
					'error',
					'deleted',
					'cancelled',
				])
				.or(z.string())
				.optional(),
			strategy: z
				.enum([
					'progressive',
					'predictive',
					'preview',
					'ai_progressive',
					'ai_predictive',
				])
				.or(z.string())
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			target_id: z.string().optional(),
			target_key: z.string().optional(),
		})
		.loose(),
);

const Input267 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output267 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input268 = z
	.object({
		body: z
			.object({
				ai_agent_settings: z
					.union([
						z
							.object({
								agent_id: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								provider_name: z
									.union([
										z.enum(['kare']),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				auto_create: z.boolean().optional(),
				caller_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_scheduled_end: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_scheduled_start: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				description: z.string().max(300).optional(),
				group_id: dialpadInteger(z.number().int()),
				is_dynamic: z.boolean().optional(),
				name: z.string().max(1500).optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				post_bot_id: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				queries: z
					.array(
						z.union([
							z
								.object({
									field: z.string(),
									op: z.enum([
										'=',
										'~=',
										'!=',
										'>',
										'<',
										'>=',
										'<=',
										'^=',
										'$=',
										'!!',
										'~~',
									]),
									value: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									combiner: z.enum(['AND', 'OR']),
									conditions: z.array(
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									),
								})
								.strict(),
						]),
					)
					.max(20)
					.optional(),
				set_timegate: z.boolean().optional(),
				settings: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				shared_list: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				strategy: z
					.enum([
						'progressive',
						'predictive',
						'preview',
						'ai_progressive',
						'ai_predictive',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output268 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		caller_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_group_id: z.string().optional(),
		campaign_group_key: z.string().optional(),
		campaign_group_order: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_archived: dialpadInteger(z.number().int()).optional(),
		date_archived_iso: z.string().optional(),
		date_audience_computed: dialpadInteger(z.number().int()).optional(),
		date_audience_computed_iso: z.string().optional(),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_ended: dialpadInteger(z.number().int()).optional(),
		date_ended_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_paused: dialpadInteger(z.number().int()).optional(),
		date_paused_iso: z.string().optional(),
		date_scheduled_end: dialpadInteger(z.number().int()).optional(),
		date_scheduled_end_iso: z.string().optional(),
		date_scheduled_start: dialpadInteger(z.number().int()).optional(),
		date_scheduled_start_iso: z.string().optional(),
		date_started: dialpadInteger(z.number().int()).optional(),
		date_started_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		event_logs_gcs_filename: z.string().max(1500).optional(),
		flow_id: z.string().optional(),
		flow_key: z.string().optional(),
		gcs_filename: z.string().max(1500).optional(),
		group_id: dialpadInteger(z.number().int()).optional(),
		id: z.string(),
		is_dynamic: z.boolean().optional(),
		key: z.string(),
		lead_list_id: z.string().optional(),
		lead_list_key: z.string().optional(),
		name: z.string().max(1500).optional(),
		num_items: dialpadInteger(z.number().int()).optional(),
		num_pending: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		priority: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		progress: z
			.union([
				z.number(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		queries: z
			.array(
				z.union([
					z
						.object({
							field: z.string(),
							op: z
								.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								])
								.or(z.string()),
							value: z
								.union([
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']).or(z.string()),
							conditions: z.array(
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							),
						})
						.loose(),
				]),
			)
			.max(20)
			.optional(),
		settings_id: z.string().optional(),
		settings_key: z.string().optional(),
		shared_list_id: z.string().optional(),
		shared_list_key: z.string().optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		source_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		strategy: z
			.enum([
				'progressive',
				'predictive',
				'preview',
				'ai_progressive',
				'ai_predictive',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
	})
	.loose();

const Input269 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output269 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		caller_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_group_id: z.string().optional(),
		campaign_group_key: z.string().optional(),
		campaign_group_order: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_archived: dialpadInteger(z.number().int()).optional(),
		date_archived_iso: z.string().optional(),
		date_audience_computed: dialpadInteger(z.number().int()).optional(),
		date_audience_computed_iso: z.string().optional(),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_ended: dialpadInteger(z.number().int()).optional(),
		date_ended_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_paused: dialpadInteger(z.number().int()).optional(),
		date_paused_iso: z.string().optional(),
		date_scheduled_end: dialpadInteger(z.number().int()).optional(),
		date_scheduled_end_iso: z.string().optional(),
		date_scheduled_start: dialpadInteger(z.number().int()).optional(),
		date_scheduled_start_iso: z.string().optional(),
		date_started: dialpadInteger(z.number().int()).optional(),
		date_started_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		event_logs_gcs_filename: z.string().max(1500).optional(),
		flow_id: z.string().optional(),
		flow_key: z.string().optional(),
		gcs_filename: z.string().max(1500).optional(),
		group_id: dialpadInteger(z.number().int()).optional(),
		id: z.string(),
		is_dynamic: z.boolean().optional(),
		key: z.string(),
		lead_list_id: z.string().optional(),
		lead_list_key: z.string().optional(),
		name: z.string().max(1500).optional(),
		num_items: dialpadInteger(z.number().int()).optional(),
		num_pending: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		priority: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		progress: z
			.union([
				z.number(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		queries: z
			.array(
				z.union([
					z
						.object({
							field: z.string(),
							op: z
								.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								])
								.or(z.string()),
							value: z
								.union([
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']).or(z.string()),
							conditions: z.array(
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							),
						})
						.loose(),
				]),
			)
			.max(20)
			.optional(),
		settings_id: z.string().optional(),
		settings_key: z.string().optional(),
		shared_list_id: z.string().optional(),
		shared_list_key: z.string().optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		source_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		strategy: z
			.enum([
				'progressive',
				'predictive',
				'preview',
				'ai_progressive',
				'ai_predictive',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
	})
	.loose();

const Input270 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z
					.enum([
						'launch',
						'ping',
						'toggle',
						'start',
						'stop',
						'reset',
						'pause',
						'archive',
						'unarchive',
					])
					.optional(),
				caller_id: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_scheduled_end: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_scheduled_start: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				description: z.string().max(300).optional(),
				group_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				is_dynamic: z.boolean().optional(),
				name: z.string().max(1500).optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				queries: z
					.array(
						z.union([
							z
								.object({
									field: z.string(),
									op: z.enum([
										'=',
										'~=',
										'!=',
										'>',
										'<',
										'>=',
										'<=',
										'^=',
										'$=',
										'!!',
										'~~',
									]),
									value: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
								})
								.strict(),
							z
								.object({
									combiner: z.enum(['AND', 'OR']),
									conditions: z.array(
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									),
								})
								.strict(),
						]),
					)
					.max(20)
					.optional(),
				settings: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				shared_list: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				strategy: z
					.enum([
						'progressive',
						'predictive',
						'preview',
						'ai_progressive',
						'ai_predictive',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output270 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		caller_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_group_id: z.string().optional(),
		campaign_group_key: z.string().optional(),
		campaign_group_order: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_archived: dialpadInteger(z.number().int()).optional(),
		date_archived_iso: z.string().optional(),
		date_audience_computed: dialpadInteger(z.number().int()).optional(),
		date_audience_computed_iso: z.string().optional(),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_ended: dialpadInteger(z.number().int()).optional(),
		date_ended_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_paused: dialpadInteger(z.number().int()).optional(),
		date_paused_iso: z.string().optional(),
		date_scheduled_end: dialpadInteger(z.number().int()).optional(),
		date_scheduled_end_iso: z.string().optional(),
		date_scheduled_start: dialpadInteger(z.number().int()).optional(),
		date_scheduled_start_iso: z.string().optional(),
		date_started: dialpadInteger(z.number().int()).optional(),
		date_started_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		event_logs_gcs_filename: z.string().max(1500).optional(),
		flow_id: z.string().optional(),
		flow_key: z.string().optional(),
		gcs_filename: z.string().max(1500).optional(),
		group_id: dialpadInteger(z.number().int()).optional(),
		id: z.string(),
		is_dynamic: z.boolean().optional(),
		key: z.string(),
		lead_list_id: z.string().optional(),
		lead_list_key: z.string().optional(),
		name: z.string().max(1500).optional(),
		num_items: dialpadInteger(z.number().int()).optional(),
		num_pending: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		priority: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		progress: z
			.union([
				z.number(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		queries: z
			.array(
				z.union([
					z
						.object({
							field: z.string(),
							op: z
								.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								])
								.or(z.string()),
							value: z
								.union([
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']).or(z.string()),
							conditions: z.array(
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							),
						})
						.loose(),
				]),
			)
			.max(20)
			.optional(),
		settings_id: z.string().optional(),
		settings_key: z.string().optional(),
		shared_list_id: z.string().optional(),
		shared_list_key: z.string().optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		source_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		strategy: z
			.enum([
				'progressive',
				'predictive',
				'preview',
				'ai_progressive',
				'ai_predictive',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
	})
	.loose();

const Input271 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output271 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		caller_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_group_id: z.string().optional(),
		campaign_group_key: z.string().optional(),
		campaign_group_order: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		campaign_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_archived: dialpadInteger(z.number().int()).optional(),
		date_archived_iso: z.string().optional(),
		date_audience_computed: dialpadInteger(z.number().int()).optional(),
		date_audience_computed_iso: z.string().optional(),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_ended: dialpadInteger(z.number().int()).optional(),
		date_ended_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_paused: dialpadInteger(z.number().int()).optional(),
		date_paused_iso: z.string().optional(),
		date_scheduled_end: dialpadInteger(z.number().int()).optional(),
		date_scheduled_end_iso: z.string().optional(),
		date_scheduled_start: dialpadInteger(z.number().int()).optional(),
		date_scheduled_start_iso: z.string().optional(),
		date_started: dialpadInteger(z.number().int()).optional(),
		date_started_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		event_logs_gcs_filename: z.string().max(1500).optional(),
		flow_id: z.string().optional(),
		flow_key: z.string().optional(),
		gcs_filename: z.string().max(1500).optional(),
		group_id: dialpadInteger(z.number().int()).optional(),
		id: z.string(),
		is_dynamic: z.boolean().optional(),
		key: z.string(),
		lead_list_id: z.string().optional(),
		lead_list_key: z.string().optional(),
		name: z.string().max(1500).optional(),
		num_items: dialpadInteger(z.number().int()).optional(),
		num_pending: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		priority: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		progress: z
			.union([
				z.number(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		queries: z
			.array(
				z.union([
					z
						.object({
							field: z.string(),
							op: z
								.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								])
								.or(z.string()),
							value: z
								.union([
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']).or(z.string()),
							conditions: z.array(
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							),
						})
						.loose(),
				]),
			)
			.max(20)
			.optional(),
		settings_id: z.string().optional(),
		settings_key: z.string().optional(),
		shared_list_id: z.string().optional(),
		shared_list_key: z.string().optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		source_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		strategy: z
			.enum([
				'progressive',
				'predictive',
				'preview',
				'ai_progressive',
				'ai_predictive',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
	})
	.loose();

const Input272 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
		query: z
			.object({
				event_type: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output272 = z
	.object({
		url: z.string(),
	})
	.loose();

const Input273 = z
	.object({
		body: z
			.object({
				description: z.string().max(300).optional(),
				group_id: dialpadInteger(z.number().int()),
				name: z.string().max(1500).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output273 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		campaign_group_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(1500).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
		wrr_credits: z.object({}).loose().optional(),
	})
	.loose();

const Input274 = z
	.object({
		path: z
			.object({
				campaign_group_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output274 =
	// Dialpad documents no response body here; core passes through whatever arrives (nothing, '' or {}).
	z.unknown();

const Input275 = z
	.object({
		path: z
			.object({
				campaign_group_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output275 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		campaign_group_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(1500).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
		wrr_credits: z.object({}).loose().optional(),
	})
	.loose();

const Input276 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
						'all',
						'visible',
						'archived',
					])
					.optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output276 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			campaign_group_id: z.string().max(1500),
			company_id: dialpadInteger(z.number().int()),
			date_computed: dialpadInteger(z.number().int()).optional(),
			date_computed_iso: z.string().optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			description: z.string().max(300).optional(),
			id: z.string(),
			key: z.string(),
			name: z.string().max(1500).optional(),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z
				.enum([
					'pending',
					'launching',
					'scheduled',
					'active',
					'paused',
					'complete',
					'error',
					'deleted',
					'cancelled',
				])
				.or(z.string())
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			target_id: z.string().optional(),
			target_key: z.string().optional(),
			wrr_credits: z.object({}).loose().optional(),
		})
		.loose(),
);

const Input277 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
		query: z
			.object({
				event_type: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output277 = z.object({}).loose();

const Input278 = z
	.object({
		path: z
			.object({
				campaign_settings_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output278 = z
	.object({
		agent_multiplier: dialpadInteger(z.number().int()).optional(),
		campaign_settings_id: z.string().max(1500),
		classification: z
			.enum(['marketing', 'informational'])
			.or(z.string())
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		current_dial_rate: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		custom_ivr_details_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dial_rate: dialpadInteger(z.number().int()).optional(),
		enable_internal_dnc: z.boolean().optional(),
		enable_national_dnc: z.boolean().optional(),
		enable_screen_pop: z.boolean().optional(),
		id: z.string(),
		key: z.string(),
		max_call_attempt_settings: z
			.object({
				delay_in_seconds: dialpadInteger(z.number().int().min(0)).optional(),
				enabled: z.boolean().optional(),
				last_result_criteria: z
					.array(
						z
							.enum([
								'call:powerdialer_no_available_agent',
								'call:powerdialer_vm_drop',
								'call:machine_detected',
								'call:cancelled',
								'call:missed',
								'call:abandoned',
								'sms:invalid_destination',
								'sms:invalid_source',
								'sms:no_route',
								'sms:rejected_spam',
								'sms:internal_error',
								'sms:rejected',
								'sms:not_supported',
								'sms:time_out',
								'sms:error',
								'sms:unknown',
							])
							.or(z.string()),
					)
					.optional(),
				max_attempts: dialpadInteger(z.number().int().gt(0)).optional(),
			})
			.loose()
			.optional(),
		max_call_attempts: dialpadInteger(z.number().int()).optional(),
		max_sms_attempt_settings: z
			.object({
				delay_in_seconds: dialpadInteger(z.number().int().min(0)).optional(),
				enabled: z.boolean().optional(),
				last_result_criteria: z
					.array(
						z
							.enum([
								'call:powerdialer_no_available_agent',
								'call:powerdialer_vm_drop',
								'call:machine_detected',
								'call:cancelled',
								'call:missed',
								'call:abandoned',
								'sms:invalid_destination',
								'sms:invalid_source',
								'sms:no_route',
								'sms:rejected_spam',
								'sms:internal_error',
								'sms:rejected',
								'sms:not_supported',
								'sms:time_out',
								'sms:error',
								'sms:unknown',
							])
							.or(z.string()),
					)
					.optional(),
				max_attempts: dialpadInteger(z.number().int().gt(0)).optional(),
			})
			.loose()
			.optional(),
		playbook_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		post_bot_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		screen_pop_fields: z
			.array(
				z
					.object({
						display_name: z.string().optional(),
						display_order: dialpadInteger(z.number().int().min(0)).optional(),
						name: z.string().min(1),
					})
					.loose(),
			)
			.max(10)
			.optional(),
		timegate_settings: z
			.object({
				hours:
					/* OpenAPI documents arbitrary fields on this response object. */ z
						.record(
							z.string(),
							z.array(
								z.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								),
							),
						)
						.optional(),
				timezone: z.string().optional(),
				timezone_mode: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input279 = z
	.object({
		path: z
			.object({
				campaign_group_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['launch', 'pause']).optional(),
				description: z.string().max(300).optional(),
				name: z.string().max(1500).optional(),
				priorities: z.object({}).strict().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output279 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		campaign_group_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		date_computed: dialpadInteger(z.number().int()).optional(),
		date_computed_iso: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		description: z.string().max(300).optional(),
		id: z.string(),
		key: z.string(),
		name: z.string().max(1500).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		target_id: z.string().optional(),
		target_key: z.string().optional(),
		wrr_credits: z.object({}).loose().optional(),
	})
	.loose();

const Input280 = z
	.object({
		path: z
			.object({
				campaign_settings_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				agent_multiplier: dialpadInteger(z.number().int()).optional(),
				classification: z.enum(['marketing', 'informational']).optional(),
				current_dial_rate: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				custom_ivr_details_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dial_rate: dialpadInteger(z.number().int().max(1000)).optional(),
				enable_internal_dnc: z.boolean().optional(),
				enable_national_dnc: z.boolean().optional(),
				enable_screen_pop: z.boolean().optional(),
				hours: z.object({}).strict().optional(),
				max_call_attempt_settings: z
					.object({
						delay_in_seconds: dialpadInteger(
							z.number().int().min(0),
						).optional(),
						enabled: z.boolean().optional(),
						last_result_criteria: z
							.array(
								z.enum([
									'call:powerdialer_no_available_agent',
									'call:powerdialer_vm_drop',
									'call:machine_detected',
									'call:cancelled',
									'call:missed',
									'call:abandoned',
									'sms:invalid_destination',
									'sms:invalid_source',
									'sms:no_route',
									'sms:rejected_spam',
									'sms:internal_error',
									'sms:rejected',
									'sms:not_supported',
									'sms:time_out',
									'sms:error',
									'sms:unknown',
								]),
							)
							.optional(),
						max_attempts: dialpadInteger(z.number().int().gt(0)).optional(),
					})
					.strict()
					.optional(),
				max_call_attempts: dialpadInteger(z.number().int()).optional(),
				max_sms_attempt_settings: z
					.object({
						delay_in_seconds: dialpadInteger(
							z.number().int().min(0),
						).optional(),
						enabled: z.boolean().optional(),
						last_result_criteria: z
							.array(
								z.enum([
									'call:powerdialer_no_available_agent',
									'call:powerdialer_vm_drop',
									'call:machine_detected',
									'call:cancelled',
									'call:missed',
									'call:abandoned',
									'sms:invalid_destination',
									'sms:invalid_source',
									'sms:no_route',
									'sms:rejected_spam',
									'sms:internal_error',
									'sms:rejected',
									'sms:not_supported',
									'sms:time_out',
									'sms:error',
									'sms:unknown',
								]),
							)
							.optional(),
						max_attempts: dialpadInteger(z.number().int().gt(0)).optional(),
					})
					.strict()
					.optional(),
				playbook_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				post_bot_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				screen_pop_fields: z
					.array(
						z
							.object({
								display_name: z.string().optional(),
								display_order: dialpadInteger(
									z.number().int().min(0),
								).optional(),
								name: z.string().min(1),
							})
							.strict(),
					)
					.max(10)
					.optional(),
				timegate_settings: z
					.object({
						hours: z.object({}).strict().optional(),
						timezone: z.string().optional(),
						timezone_mode: z.string().optional(),
					})
					.strict()
					.optional(),
				timezone_mode: z
					.enum(['phone', 'lead', 'address', 'address_and_phone'])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output280 = z
	.object({
		agent_multiplier: dialpadInteger(z.number().int()).optional(),
		campaign_settings_id: z.string().max(1500),
		classification: z
			.enum(['marketing', 'informational'])
			.or(z.string())
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		current_dial_rate: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		custom_ivr_details_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dial_rate: dialpadInteger(z.number().int()).optional(),
		enable_internal_dnc: z.boolean().optional(),
		enable_national_dnc: z.boolean().optional(),
		enable_screen_pop: z.boolean().optional(),
		id: z.string(),
		key: z.string(),
		max_call_attempt_settings: z
			.object({
				delay_in_seconds: dialpadInteger(z.number().int().min(0)).optional(),
				enabled: z.boolean().optional(),
				last_result_criteria: z
					.array(
						z
							.enum([
								'call:powerdialer_no_available_agent',
								'call:powerdialer_vm_drop',
								'call:machine_detected',
								'call:cancelled',
								'call:missed',
								'call:abandoned',
								'sms:invalid_destination',
								'sms:invalid_source',
								'sms:no_route',
								'sms:rejected_spam',
								'sms:internal_error',
								'sms:rejected',
								'sms:not_supported',
								'sms:time_out',
								'sms:error',
								'sms:unknown',
							])
							.or(z.string()),
					)
					.optional(),
				max_attempts: dialpadInteger(z.number().int().gt(0)).optional(),
			})
			.loose()
			.optional(),
		max_call_attempts: dialpadInteger(z.number().int()).optional(),
		max_sms_attempt_settings: z
			.object({
				delay_in_seconds: dialpadInteger(z.number().int().min(0)).optional(),
				enabled: z.boolean().optional(),
				last_result_criteria: z
					.array(
						z
							.enum([
								'call:powerdialer_no_available_agent',
								'call:powerdialer_vm_drop',
								'call:machine_detected',
								'call:cancelled',
								'call:missed',
								'call:abandoned',
								'sms:invalid_destination',
								'sms:invalid_source',
								'sms:no_route',
								'sms:rejected_spam',
								'sms:internal_error',
								'sms:rejected',
								'sms:not_supported',
								'sms:time_out',
								'sms:error',
								'sms:unknown',
							])
							.or(z.string()),
					)
					.optional(),
				max_attempts: dialpadInteger(z.number().int().gt(0)).optional(),
			})
			.loose()
			.optional(),
		playbook_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		post_bot_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		screen_pop_fields: z
			.array(
				z
					.object({
						display_name: z.string().optional(),
						display_order: dialpadInteger(z.number().int().min(0)).optional(),
						name: z.string().min(1),
					})
					.loose(),
			)
			.max(10)
			.optional(),
		timegate_settings: z
			.object({
				hours:
					/* OpenAPI documents arbitrary fields on this response object. */ z
						.record(
							z.string(),
							z.array(
								z.array(
									/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
								),
							),
						)
						.optional(),
				timezone: z.string().optional(),
				timezone_mode: z.string().optional(),
			})
			.loose()
			.optional(),
	})
	.loose();

const Input281 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output281 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input282 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output282 = z
	.object({
		url: z.string(),
	})
	.loose();

const Input283 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['import']).optional(),
				custom_mapping: z.object({}).strict().optional(),
				import_results: z
					.object({
						collisions: dialpadInteger(z.number().int().min(0)).optional(),
						created: dialpadInteger(z.number().int().min(0)).optional(),
						duplicates: dialpadInteger(z.number().int().min(0)).optional(),
						failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
						skipped: dialpadInteger(z.number().int().min(0)).optional(),
						total: dialpadInteger(z.number().int().min(0)).optional(),
						updated: dialpadInteger(z.number().int().min(0)).optional(),
					})
					.strict()
					.optional(),
				labels: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				lead_mapping: z.object({}).strict().optional(),
				name: z.string().max(1500).optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				strategy: z.enum(['skip', 'merge']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output283 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_id: z.string().max(1500),
		custom_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(z.string(), z.string())
				.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		download_url: z.string().optional(),
		file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
		filename: z.string().max(1500).optional(),
		gcs_filename: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		labels: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		lead_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(
					z.string(),
					z
						.enum([
							'do_not_import',
							'first_name',
							'last_name',
							'job_title',
							'industry',
							'role',
							'department',
							'external_id',
							'timezone',
							'lang',
							'primary_phone',
							'secondary_phone',
							'primary_email',
							'secondary_email',
							'address_name',
							'address_line1',
							'address_line2',
							'city',
							'region',
							'postal_code',
							'country',
							'company_name',
							'company_phone',
							'company_address_line1',
							'company_address_line2',
							'company_city',
							'company_region',
							'company_postal_code',
							'company_country',
							'company_sic_code',
							'company_naics_code',
							'company_blacklisted',
							'company_annual_revenue',
							'company_currency',
							'company_num_employees',
							'primary_phone_fallback',
						])
						.or(z.string()),
				)
				.optional(),
		name: z.string().max(1500).optional(),
		num_rows: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input284 = z
	.object({
		path: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output284 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input285 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output285 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_id: z.string().max(1500),
		custom_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(z.string(), z.string())
				.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		download_url: z.string().optional(),
		file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
		filename: z.string().max(1500).optional(),
		gcs_filename: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		labels: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		lead_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(
					z.string(),
					z
						.enum([
							'do_not_import',
							'first_name',
							'last_name',
							'job_title',
							'industry',
							'role',
							'department',
							'external_id',
							'timezone',
							'lang',
							'primary_phone',
							'secondary_phone',
							'primary_email',
							'secondary_email',
							'address_name',
							'address_line1',
							'address_line2',
							'city',
							'region',
							'postal_code',
							'country',
							'company_name',
							'company_phone',
							'company_address_line1',
							'company_address_line2',
							'company_city',
							'company_region',
							'company_postal_code',
							'company_country',
							'company_sic_code',
							'company_naics_code',
							'company_blacklisted',
							'company_annual_revenue',
							'company_currency',
							'company_num_employees',
							'primary_phone_fallback',
						])
						.or(z.string()),
				)
				.optional(),
		name: z.string().max(1500).optional(),
		num_rows: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input286 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				target_ids: z.string().optional(),
				tag: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
						'all',
						'visible',
						'archived',
					])
					.optional(),
				states: z.string().optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
					])
					.optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output286 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			columns: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			csv_id: z.string().max(1500),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			download_url: z.string().optional(),
			file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
			filename: z.string().max(1500).optional(),
			gcs_filename: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			import_results: z
				.object({
					collisions: dialpadInteger(z.number().int().min(0)).optional(),
					created: dialpadInteger(z.number().int().min(0)).optional(),
					duplicates: dialpadInteger(z.number().int().min(0)).optional(),
					failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
					skipped: dialpadInteger(z.number().int().min(0)).optional(),
					total: dialpadInteger(z.number().int().min(0)).optional(),
					updated: dialpadInteger(z.number().int().min(0)).optional(),
				})
				.loose()
				.optional(),
			key: z.string(),
			labels: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			mapping:
				/* OpenAPI documents arbitrary fields on this response object. */ z
					.record(
						z.string(),
						z
							.enum([
								'e164',
								'dnc',
								'dnc_scope',
								'dnc_expiration',
								'dnt',
								'dnt_scope',
								'dnt_expiration',
								'consent',
								'validity',
								'date_dnc_opt_out',
								'date_dnt_opt_out',
								'do_not_import',
							])
							.or(z.string()),
					)
					.optional(),
			name: z.string().max(1500).optional(),
			num_rows: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z
				.enum([
					'pending',
					'launching',
					'scheduled',
					'active',
					'paused',
					'complete',
					'error',
					'deleted',
					'cancelled',
				])
				.or(z.string())
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input287 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				target_ids: z.string().optional(),
				tag: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
						'all',
						'visible',
						'archived',
					])
					.optional(),
				states: z.string().optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
					])
					.optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output287 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			columns: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			csv_id: z.string().max(1500),
			custom_mapping:
				/* OpenAPI documents arbitrary fields on this response object. */ z
					.record(z.string(), z.string())
					.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			download_url: z.string().optional(),
			file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
			filename: z.string().max(1500).optional(),
			gcs_filename: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			import_results: z
				.object({
					collisions: dialpadInteger(z.number().int().min(0)).optional(),
					created: dialpadInteger(z.number().int().min(0)).optional(),
					duplicates: dialpadInteger(z.number().int().min(0)).optional(),
					failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
					skipped: dialpadInteger(z.number().int().min(0)).optional(),
					total: dialpadInteger(z.number().int().min(0)).optional(),
					updated: dialpadInteger(z.number().int().min(0)).optional(),
				})
				.loose()
				.optional(),
			key: z.string(),
			labels: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			lead_mapping:
				/* OpenAPI documents arbitrary fields on this response object. */ z
					.record(
						z.string(),
						z
							.enum([
								'do_not_import',
								'first_name',
								'last_name',
								'job_title',
								'industry',
								'role',
								'department',
								'external_id',
								'timezone',
								'lang',
								'primary_phone',
								'secondary_phone',
								'primary_email',
								'secondary_email',
								'address_name',
								'address_line1',
								'address_line2',
								'city',
								'region',
								'postal_code',
								'country',
								'company_name',
								'company_phone',
								'company_address_line1',
								'company_address_line2',
								'company_city',
								'company_region',
								'company_postal_code',
								'company_country',
								'company_sic_code',
								'company_naics_code',
								'company_blacklisted',
								'company_annual_revenue',
								'company_currency',
								'company_num_employees',
								'primary_phone_fallback',
							])
							.or(z.string()),
					)
					.optional(),
			name: z.string().max(1500).optional(),
			num_rows: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z
				.enum([
					'pending',
					'launching',
					'scheduled',
					'active',
					'paused',
					'complete',
					'error',
					'deleted',
					'cancelled',
				])
				.or(z.string())
				.optional(),
			strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input288 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output288 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_id: z.string().max(1500),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		download_url: z.string().optional(),
		file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
		filename: z.string().max(1500).optional(),
		gcs_filename: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		labels: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		mapping: /* OpenAPI documents arbitrary fields on this response object. */ z
			.record(
				z.string(),
				z
					.enum([
						'e164',
						'dnc',
						'dnc_scope',
						'dnc_expiration',
						'dnt',
						'dnt_scope',
						'dnt_expiration',
						'consent',
						'validity',
						'date_dnc_opt_out',
						'date_dnt_opt_out',
						'do_not_import',
					])
					.or(z.string()),
			)
			.optional(),
		name: z.string().max(1500).optional(),
		num_rows: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input289 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['import']).optional(),
				import_results: z
					.object({
						collisions: dialpadInteger(z.number().int().min(0)).optional(),
						created: dialpadInteger(z.number().int().min(0)).optional(),
						duplicates: dialpadInteger(z.number().int().min(0)).optional(),
						failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
						skipped: dialpadInteger(z.number().int().min(0)).optional(),
						total: dialpadInteger(z.number().int().min(0)).optional(),
						updated: dialpadInteger(z.number().int().min(0)).optional(),
					})
					.strict()
					.optional(),
				labels: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				mapping: z.object({}).strict().optional(),
				name: z.string().max(1500).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output289 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_id: z.string().max(1500),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		download_url: z.string().optional(),
		file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
		filename: z.string().max(1500).optional(),
		gcs_filename: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		labels: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		mapping: /* OpenAPI documents arbitrary fields on this response object. */ z
			.record(
				z.string(),
				z
					.enum([
						'e164',
						'dnc',
						'dnc_scope',
						'dnc_expiration',
						'dnt',
						'dnt_scope',
						'dnt_expiration',
						'consent',
						'validity',
						'date_dnc_opt_out',
						'date_dnt_opt_out',
						'do_not_import',
					])
					.or(z.string()),
			)
			.optional(),
		name: z.string().max(1500).optional(),
		num_rows: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input290 = z
	.object({
		path: z
			.object({
				csv_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output290 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input291 = z
	.object({
		body: z
			.object({
				audience_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				csv_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				is_shared: z.boolean().optional(),
				lead_order: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				name: z.string().max(1500).optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				salesforce_listview_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				static_list_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output291 = z
	.object({
		audience_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		audience_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_user_modified: dialpadInteger(z.number().int()).optional(),
		date_user_modified_iso: z.string().optional(),
		id: z.string(),
		is_shared: z.boolean().optional(),
		key: z.string(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id_id: z.string().optional(),
		last_author_id_key: z.string().optional(),
		lead_order: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		list_id: z.string().max(1500),
		name: z.string().max(1500).optional(),
		num_csv_rows: dialpadInteger(z.number().int()).optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_query_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		salesforce_listview_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		static_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		static_list_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input292 = z
	.object({
		path: z
			.object({
				bot_dialog_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output292 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		bot_dialog_id: z.string().max(1500),
		bot_id: z.string().max(1500),
		company_id: dialpadInteger(z.number().int()),
		conv_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_last_message: dialpadInteger(z.number().int()).optional(),
		date_last_message_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		state: z
			.enum(['pending', 'active', 'ended', 'error'])
			.or(z.string())
			.optional(),
		template_data: z.object({}).loose().optional(),
	})
	.loose();

const Input293 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				tag: z.string().optional(),
				list_id: z.string().optional(),
				campaign_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output293 = z.array(
	z
		.object({
			call_id: z.string().optional(),
			call_key: z.string().optional(),
			campaign_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			contact_id: z.string().optional(),
			contact_key: z.string().optional(),
			csv: z.object({}).loose().optional(),
			current_rule_id: z.string().optional(),
			current_rule_key: z.string().optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_estimate: dialpadInteger(z.number().int()).optional(),
			date_estimate_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			history: z
				.object({
					call_attempts: dialpadInteger(z.number().int().min(0)).optional(),
					last_call_id: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_categories: z
						.union([
							z.array(
								z.union([
									z
										.enum([
											'call:powerdialer_no_available_agent',
											'call:human_agent',
											'call:ai_agent',
											'call:outbound_connected',
											'call:powerdialer_vm_drop',
											'call:machine_detected',
											'call:powerdialer_call',
											'call:active',
											'call:outbound',
											'call:cancelled',
											'call:inbound',
											'call:missed',
											'call:abandoned',
											'call:user_initiated',
										])
										.or(z.string()),
									z
										.enum([
											'sms:accepted',
											'sms:invalid_destination',
											'sms:invalid_source',
											'sms:no_route',
											'sms:rejected_spam',
											'sms:internal_error',
											'sms:rejected',
											'sms:not_supported',
											'sms:time_out',
											'sms:error',
											'sms:unknown',
											'sms:forbidden',
											'sms:owner_no_international_messaging',
											'sms:unregistered_a2p_not_allowed',
											'sms:owner_not_enough_sms_credits',
											'sms:owner_not_enough_credits',
											'sms:messaging_disabled',
											'sms:owner_free_user',
											'sms:contact_missing_number',
											'sms:contact_is_room',
											'sms:contact_is_shared_line',
											'sms:staff_contact',
											'sms:company_affinity',
											'sms:not_in_free_company',
											'sms:invalid_number',
										])
										.or(z.string()),
									z
										.enum([
											'call:max_attempts_item',
											'call:max_attempts_delay_not_met',
											'call:max_attempts_criteria_not_met',
											'call:max_attempts_campaign_phone_total',
											'call:max_attempts_campaign_phone_daily',
											'call:max_attempts_campaign_phone_rolling',
											'call:max_attempts_campaign_contact_total',
											'call:max_attempts_campaign_contact_daily',
											'call:max_attempts_campaign_contact_rolling',
											'call:max_attempts_campaign_company_total',
											'call:max_attempts_campaign_company_daily',
											'call:max_attempts_campaign_company_rolling',
											'call:max_attempts_global_phone_daily',
											'call:max_attempts_global_phone_rolling',
											'call:max_attempts_global_contact_daily',
											'call:max_attempts_global_contact_rolling',
											'call:max_attempts_global_company_daily',
											'call:max_attempts_global_company_rolling',
										])
										.or(z.string()),
									z.string(),
								]),
							),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_error_id: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					rules:
						/* OpenAPI documents arbitrary fields on this response object. */ z
							.record(
								z.string(),
								z
									.object({
										attempts:
											/* OpenAPI documents arbitrary fields on this response object. */ z
												.record(
													z.string(),
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
												)
												.optional(),
										rule_type: z.string().optional(),
									})
									.loose(),
							)
							.optional(),
				})
				.loose()
				.optional(),
			id: z.string(),
			index: z.number().optional(),
			item_id: z.string().max(1500),
			key: z.string(),
			lead_id: z.string().optional(),
			lead_key: z.string().optional(),
			list_id: z.string().max(1500),
			result_code: z
				.enum([
					'call:powerdialer_no_available_agent',
					'call:human_agent',
					'call:ai_agent',
					'call:outbound_connected',
					'call:powerdialer_vm_drop',
					'call:machine_detected',
					'call:powerdialer_call',
					'call:active',
					'call:outbound',
					'call:cancelled',
					'call:inbound',
					'call:missed',
					'call:abandoned',
					'call:user_initiated',
					'call:max_attempts_item',
					'call:max_attempts_delay_not_met',
					'call:max_attempts_criteria_not_met',
					'call:max_attempts_campaign_phone_total',
					'call:max_attempts_campaign_phone_daily',
					'call:max_attempts_campaign_phone_rolling',
					'call:max_attempts_campaign_contact_total',
					'call:max_attempts_campaign_contact_daily',
					'call:max_attempts_campaign_contact_rolling',
					'call:max_attempts_campaign_company_total',
					'call:max_attempts_campaign_company_daily',
					'call:max_attempts_campaign_company_rolling',
					'call:max_attempts_global_phone_daily',
					'call:max_attempts_global_phone_rolling',
					'call:max_attempts_global_contact_daily',
					'call:max_attempts_global_contact_rolling',
					'call:max_attempts_global_company_daily',
					'call:max_attempts_global_company_rolling',
					'call:dnc',
					'call:timegate_failed',
					'call:fdcpa_max_attempted',
					'call:fdcpa_max_connected',
					'call:no_consent',
					'call:skipped',
					'sms:dnt',
					'sms:timegate_failed',
					'sms:no_consent',
					'sms:skipped',
					'sms:accepted',
					'sms:invalid_destination',
					'sms:invalid_source',
					'sms:no_route',
					'sms:rejected_spam',
					'sms:internal_error',
					'sms:rejected',
					'sms:not_supported',
					'sms:time_out',
					'sms:error',
					'sms:unknown',
					'sms:forbidden',
					'sms:owner_no_international_messaging',
					'sms:unregistered_a2p_not_allowed',
					'sms:owner_not_enough_sms_credits',
					'sms:owner_not_enough_credits',
					'sms:messaging_disabled',
					'sms:owner_free_user',
					'sms:contact_missing_number',
					'sms:contact_is_room',
					'sms:contact_is_shared_line',
					'sms:staff_contact',
					'sms:company_affinity',
					'sms:not_in_free_company',
					'sms:invalid_number',
				])
				.or(z.string())
				.optional(),
			sms_id: z.string().optional(),
			sms_key: z.string().optional(),
			state: z
				.enum([
					'pending',
					'launching',
					'scheduled',
					'active',
					'paused',
					'complete',
					'error',
					'deleted',
					'cancelled',
					'incomplete',
				])
				.or(z.string())
				.optional(),
			status: z
				.enum([
					'Upcoming',
					'In Progress',
					'Rescheduled',
					'Complete',
					'Error',
					'Excluded',
					'Incomplete',
				])
				.or(z.string())
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input294 = z
	.object({
		path: z
			.object({
				item_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output294 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input295 = z
	.object({
		path: z
			.object({
				list_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output295 = z
	.object({
		audience_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		audience_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_user_modified: dialpadInteger(z.number().int()).optional(),
		date_user_modified_iso: z.string().optional(),
		id: z.string(),
		is_shared: z.boolean().optional(),
		key: z.string(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id_id: z.string().optional(),
		last_author_id_key: z.string().optional(),
		lead_order: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		list_id: z.string().max(1500),
		name: z.string().max(1500).optional(),
		num_csv_rows: dialpadInteger(z.number().int()).optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_query_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		salesforce_listview_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		static_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		static_list_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input296 = z
	.object({
		path: z
			.object({
				item_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output296 = z
	.object({
		call_id: z.string().optional(),
		call_key: z.string().optional(),
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_id: z.string().optional(),
		contact_key: z.string().optional(),
		csv: z.object({}).loose().optional(),
		current_rule_id: z.string().optional(),
		current_rule_key: z.string().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_estimate: dialpadInteger(z.number().int()).optional(),
		date_estimate_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		history: z
			.object({
				call_attempts: dialpadInteger(z.number().int().min(0)).optional(),
				last_call_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_categories: z
					.union([
						z.array(
							z.union([
								z
									.enum([
										'call:powerdialer_no_available_agent',
										'call:human_agent',
										'call:ai_agent',
										'call:outbound_connected',
										'call:powerdialer_vm_drop',
										'call:machine_detected',
										'call:powerdialer_call',
										'call:active',
										'call:outbound',
										'call:cancelled',
										'call:inbound',
										'call:missed',
										'call:abandoned',
										'call:user_initiated',
									])
									.or(z.string()),
								z
									.enum([
										'sms:accepted',
										'sms:invalid_destination',
										'sms:invalid_source',
										'sms:no_route',
										'sms:rejected_spam',
										'sms:internal_error',
										'sms:rejected',
										'sms:not_supported',
										'sms:time_out',
										'sms:error',
										'sms:unknown',
										'sms:forbidden',
										'sms:owner_no_international_messaging',
										'sms:unregistered_a2p_not_allowed',
										'sms:owner_not_enough_sms_credits',
										'sms:owner_not_enough_credits',
										'sms:messaging_disabled',
										'sms:owner_free_user',
										'sms:contact_missing_number',
										'sms:contact_is_room',
										'sms:contact_is_shared_line',
										'sms:staff_contact',
										'sms:company_affinity',
										'sms:not_in_free_company',
										'sms:invalid_number',
									])
									.or(z.string()),
								z
									.enum([
										'call:max_attempts_item',
										'call:max_attempts_delay_not_met',
										'call:max_attempts_criteria_not_met',
										'call:max_attempts_campaign_phone_total',
										'call:max_attempts_campaign_phone_daily',
										'call:max_attempts_campaign_phone_rolling',
										'call:max_attempts_campaign_contact_total',
										'call:max_attempts_campaign_contact_daily',
										'call:max_attempts_campaign_contact_rolling',
										'call:max_attempts_campaign_company_total',
										'call:max_attempts_campaign_company_daily',
										'call:max_attempts_campaign_company_rolling',
										'call:max_attempts_global_phone_daily',
										'call:max_attempts_global_phone_rolling',
										'call:max_attempts_global_contact_daily',
										'call:max_attempts_global_contact_rolling',
										'call:max_attempts_global_company_daily',
										'call:max_attempts_global_company_rolling',
									])
									.or(z.string()),
								z.string(),
							]),
						),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_error_id: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				rules:
					/* OpenAPI documents arbitrary fields on this response object. */ z
						.record(
							z.string(),
							z
								.object({
									attempts:
										/* OpenAPI documents arbitrary fields on this response object. */ z
											.record(
												z.string(),
												/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											)
											.optional(),
									rule_type: z.string().optional(),
								})
								.loose(),
						)
						.optional(),
			})
			.loose()
			.optional(),
		id: z.string(),
		index: z.number().optional(),
		item_id: z.string().max(1500),
		key: z.string(),
		lead_id: z.string().optional(),
		lead_key: z.string().optional(),
		list_id: z.string().max(1500),
		result_code: z
			.enum([
				'call:powerdialer_no_available_agent',
				'call:human_agent',
				'call:ai_agent',
				'call:outbound_connected',
				'call:powerdialer_vm_drop',
				'call:machine_detected',
				'call:powerdialer_call',
				'call:active',
				'call:outbound',
				'call:cancelled',
				'call:inbound',
				'call:missed',
				'call:abandoned',
				'call:user_initiated',
				'call:max_attempts_item',
				'call:max_attempts_delay_not_met',
				'call:max_attempts_criteria_not_met',
				'call:max_attempts_campaign_phone_total',
				'call:max_attempts_campaign_phone_daily',
				'call:max_attempts_campaign_phone_rolling',
				'call:max_attempts_campaign_contact_total',
				'call:max_attempts_campaign_contact_daily',
				'call:max_attempts_campaign_contact_rolling',
				'call:max_attempts_campaign_company_total',
				'call:max_attempts_campaign_company_daily',
				'call:max_attempts_campaign_company_rolling',
				'call:max_attempts_global_phone_daily',
				'call:max_attempts_global_phone_rolling',
				'call:max_attempts_global_contact_daily',
				'call:max_attempts_global_contact_rolling',
				'call:max_attempts_global_company_daily',
				'call:max_attempts_global_company_rolling',
				'call:dnc',
				'call:timegate_failed',
				'call:fdcpa_max_attempted',
				'call:fdcpa_max_connected',
				'call:no_consent',
				'call:skipped',
				'sms:dnt',
				'sms:timegate_failed',
				'sms:no_consent',
				'sms:skipped',
				'sms:accepted',
				'sms:invalid_destination',
				'sms:invalid_source',
				'sms:no_route',
				'sms:rejected_spam',
				'sms:internal_error',
				'sms:rejected',
				'sms:not_supported',
				'sms:time_out',
				'sms:error',
				'sms:unknown',
				'sms:forbidden',
				'sms:owner_no_international_messaging',
				'sms:unregistered_a2p_not_allowed',
				'sms:owner_not_enough_sms_credits',
				'sms:owner_not_enough_credits',
				'sms:messaging_disabled',
				'sms:owner_free_user',
				'sms:contact_missing_number',
				'sms:contact_is_room',
				'sms:contact_is_shared_line',
				'sms:staff_contact',
				'sms:company_affinity',
				'sms:not_in_free_company',
				'sms:invalid_number',
			])
			.or(z.string())
			.optional(),
		sms_id: z.string().optional(),
		sms_key: z.string().optional(),
		state: z
			.enum([
				'pending',
				'launching',
				'scheduled',
				'active',
				'paused',
				'complete',
				'error',
				'deleted',
				'cancelled',
				'incomplete',
			])
			.or(z.string())
			.optional(),
		status: z
			.enum([
				'Upcoming',
				'In Progress',
				'Rescheduled',
				'Complete',
				'Error',
				'Excluded',
				'Incomplete',
			])
			.or(z.string())
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input297 = z
	.object({
		path: z
			.object({
				list_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output297 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input298 = z
	.object({
		path: z
			.object({
				list_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output298 = z
	.object({
		audience_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		audience_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_user_modified: dialpadInteger(z.number().int()).optional(),
		date_user_modified_iso: z.string().optional(),
		id: z.string(),
		is_shared: z.boolean().optional(),
		key: z.string(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id_id: z.string().optional(),
		last_author_id_key: z.string().optional(),
		lead_order: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		list_id: z.string().max(1500),
		name: z.string().max(1500).optional(),
		num_csv_rows: dialpadInteger(z.number().int()).optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_query_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		salesforce_listview_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		static_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		static_list_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input299 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output299 = z.array(
	z
		.object({
			audience_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			audience_keys: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			company_id: dialpadInteger(z.number().int()),
			csv_columns: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			csv_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			csv_keys: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			date_user_modified: dialpadInteger(z.number().int()).optional(),
			date_user_modified_iso: z.string().optional(),
			id: z.string(),
			is_shared: z.boolean().optional(),
			key: z.string(),
			last_author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			last_author_id_id: z.string().optional(),
			last_author_id_key: z.string().optional(),
			lead_order: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			list_id: z.string().max(1500),
			name: z.string().max(1500).optional(),
			num_csv_rows: dialpadInteger(z.number().int()).optional(),
			num_manual_rows: dialpadInteger(z.number().int()).optional(),
			num_query_rows: dialpadInteger(z.number().int()).optional(),
			num_rows: dialpadInteger(z.number().int()).optional(),
			num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
			office_id: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			salesforce_listview_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			static_list_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			static_list_keys: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input300 = z
	.object({
		path: z
			.object({
				list_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z
					.union([
						z.enum([
							'set_audience',
							'remove_audience',
							'create_static_list',
							'add_leads',
							'remove_leads',
							'add_snapshot',
							'refresh_snapshot',
							'clear_snapshot',
							'clear_manual',
							'refresh_audience',
						]),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				audience_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				csv_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				is_shared: z.boolean().optional(),
				lead_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_order: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				name: z.string().max(1500).optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				query: z
					.union([
						z.object({}).strict(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				salesforce_listview_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				static_list_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output300 = z
	.object({
		audience_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		audience_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		csv_columns: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		csv_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_user_modified: dialpadInteger(z.number().int()).optional(),
		date_user_modified_iso: z.string().optional(),
		id: z.string(),
		is_shared: z.boolean().optional(),
		key: z.string(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id_id: z.string().optional(),
		last_author_id_key: z.string().optional(),
		lead_order: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		list_id: z.string().max(1500),
		name: z.string().max(1500).optional(),
		num_csv_rows: dialpadInteger(z.number().int()).optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_query_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: dialpadInteger(z.number().int()).optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		office_id: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		salesforce_listview_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		static_list_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		static_list_keys: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input301 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				list_ids: z.string().optional(),
				campaign_counts: z.boolean().optional(),
				target_ids: z.string().optional(),
				tags: z.string().optional(),
				search: z.string().optional(),
				order: z.string().optional(),
				types: z.string(),
			})
			.strict(),
	})
	.strict();

const Output301 = z.array(
	z
		.object({
			active_campaigns: z.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			all_campaigns: z.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			audience: z.union([
				z
					.object({
						audience_id: z.string().max(1500),
						author_dp_key: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						author_id: z.string().optional(),
						author_key: z.string().optional(),
						company_id: dialpadInteger(z.number().int()),
						date_created: dialpadInteger(z.number().int()).optional(),
						date_created_iso: z.string().optional(),
						date_modified: dialpadInteger(z.number().int()).optional(),
						date_modified_iso: z.string().optional(),
						id: z.string(),
						key: z.string(),
						name: z
							.union([
								z.string().max(1500),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						num_rows: dialpadInteger(z.number().int()).optional(),
						query: z
							.union([
								z
									.object({
										field:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										op: /* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										value:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
									})
									.loose(),
								z
									.object({
										combiner:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										conditions:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									})
									.loose(),
							])
							.optional(),
						sort_name: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						state: z
							.enum(['pending', 'active', 'deleted'])
							.or(z.string())
							.optional(),
						tags: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			csv: z.union([
				z
					.object({
						author_dp_key: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						author_id: z.string().optional(),
						author_key: z.string().optional(),
						columns: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
						company_id: dialpadInteger(z.number().int()),
						csv_id: z.string().max(1500),
						custom_mapping:
							/* OpenAPI documents arbitrary fields on this response object. */ z
								.record(z.string(), z.string())
								.optional(),
						date_created: dialpadInteger(z.number().int()).optional(),
						date_created_iso: z.string().optional(),
						date_modified: dialpadInteger(z.number().int()).optional(),
						date_modified_iso: z.string().optional(),
						download_url: z.string().optional(),
						file_type: z.enum(['CSV', 'XLSX']).or(z.string()).optional(),
						filename: z.string().max(1500).optional(),
						gcs_filename: z
							.union([
								z.string().max(1500),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						id: z.string(),
						import_results: z
							.object({
								collisions: dialpadInteger(z.number().int().min(0)).optional(),
								created: dialpadInteger(z.number().int().min(0)).optional(),
								duplicates: dialpadInteger(z.number().int().min(0)).optional(),
								failed_batches: dialpadInteger(
									z.number().int().min(0),
								).optional(),
								skipped: dialpadInteger(z.number().int().min(0)).optional(),
								total: dialpadInteger(z.number().int().min(0)).optional(),
								updated: dialpadInteger(z.number().int().min(0)).optional(),
							})
							.loose()
							.optional(),
						key: z.string(),
						labels: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
						lead_mapping:
							/* OpenAPI documents arbitrary fields on this response object. */ z
								.record(
									z.string(),
									z
										.enum([
											'do_not_import',
											'first_name',
											'last_name',
											'job_title',
											'industry',
											'role',
											'department',
											'external_id',
											'timezone',
											'lang',
											'primary_phone',
											'secondary_phone',
											'primary_email',
											'secondary_email',
											'address_name',
											'address_line1',
											'address_line2',
											'city',
											'region',
											'postal_code',
											'country',
											'company_name',
											'company_phone',
											'company_address_line1',
											'company_address_line2',
											'company_city',
											'company_region',
											'company_postal_code',
											'company_country',
											'company_sic_code',
											'company_naics_code',
											'company_blacklisted',
											'company_annual_revenue',
											'company_currency',
											'company_num_employees',
											'primary_phone_fallback',
										])
										.or(z.string()),
								)
								.optional(),
						name: z.string().max(1500).optional(),
						num_rows: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						office_id: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						sort_name: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						state: z
							.enum([
								'pending',
								'launching',
								'scheduled',
								'active',
								'paused',
								'complete',
								'error',
								'deleted',
								'cancelled',
							])
							.or(z.string())
							.optional(),
						strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
						tags: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			key: z.string(),
			paused_campaigns: z.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			static_list: z.union([
				z
					.object({
						author_dp_key: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						author_id: z.string().optional(),
						author_key: z.string().optional(),
						company_id: dialpadInteger(z.number().int()),
						date_created: dialpadInteger(z.number().int()).optional(),
						date_created_iso: z.string().optional(),
						date_modified: dialpadInteger(z.number().int()).optional(),
						date_modified_iso: z.string().optional(),
						date_query: dialpadInteger(z.number().int()).optional(),
						date_query_iso: z.string().optional(),
						id: z.string(),
						key: z.string(),
						last_query: z
							.union([
								z
									.object({
										field:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										op: /* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										value:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
									})
									.loose(),
								z
									.object({
										combiner:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										conditions:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									})
									.loose(),
							])
							.optional(),
						name: z
							.union([
								z.string().max(1500),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						num_manual_rows: dialpadInteger(z.number().int()).optional(),
						num_rows: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
						sort_name: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						state: z
							.enum(['active', 'importing', 'clearing', 'error'])
							.or(z.string())
							.optional(),
						static_list_id: z.string().max(1500),
						tags: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
		})
		.loose(),
);

const Input302 = z
	.object({
		body: z
			.object({
				name: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				state: z.enum(['active', 'importing', 'clearing', 'error']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output302 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_query: dialpadInteger(z.number().int()).optional(),
		date_query_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		last_query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum(['active', 'importing', 'clearing', 'error'])
			.or(z.string())
			.optional(),
		static_list_id: z.string().max(1500),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input303 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				target_ids: z.string().optional(),
				state: z.enum(['pending', 'active', 'deleted']).optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output303 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			date_query: dialpadInteger(z.number().int()).optional(),
			date_query_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			last_query: z
				.union([
					z
						.object({
							field: z.string(),
							op: z
								.enum([
									'=',
									'~=',
									'!=',
									'>',
									'<',
									'>=',
									'<=',
									'^=',
									'$=',
									'!!',
									'~~',
								])
								.or(z.string()),
							value: z
								.union([
									z.string(),
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
						})
						.loose(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']).or(z.string()),
							conditions: z.array(
								z.union([
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								]),
							),
						})
						.loose(),
				])
				.optional(),
			name: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			num_manual_rows: dialpadInteger(z.number().int()).optional(),
			num_rows: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
			sort_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z
				.enum(['active', 'importing', 'clearing', 'error'])
				.or(z.string())
				.optional(),
			static_list_id: z.string().max(1500),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input304 = z
	.object({
		path: z
			.object({
				static_list_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output304 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_query: dialpadInteger(z.number().int()).optional(),
		date_query_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		last_query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum(['active', 'importing', 'clearing', 'error'])
			.or(z.string())
			.optional(),
		static_list_id: z.string().max(1500),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input305 = z
	.object({
		path: z
			.object({
				static_list_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output305 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input306 = z
	.object({
		path: z
			.object({
				static_list_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output306 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_query: dialpadInteger(z.number().int()).optional(),
		date_query_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		last_query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum(['active', 'importing', 'clearing', 'error'])
			.or(z.string())
			.optional(),
		static_list_id: z.string().max(1500),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input307 = z
	.object({
		body: z
			.object({
				addresses: z
					.array(
						z
							.object({
								city: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line1: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line2: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								name: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								postal_code: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								region: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
					)
					.max(20)
					.optional(),
				campaign_id: z.string().optional(),
				custom: z.object({}).strict().optional(),
				department: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				emails: z
					.array(
						z
							.object({
								domain: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								email: z.string(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
					)
					.max(50)
					.optional(),
				engagement_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				external_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				first_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				industry: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				job_title: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lang: z
					.union([
						z.string().max(2),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_company_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_source: z
					.union([
						z.enum(['api', 'receptionist']),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				phone_number: z.string().optional(),
				phones: z
					.array(
						z
							.object({
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								display: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								number: z.string(),
							})
							.strict(),
					)
					.max(20)
					.optional(),
				preferred_medium: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				timezone: z
					.union([
						z.string().max(36),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output307 = z
	.object({
		addresses: z
			.array(
				z
					.object({
						city: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						country: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						line1: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						line2: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						name: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						postal_code: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						region: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
			)
			.max(20)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		contact_type: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		csv_line: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		custom: z.object({}).loose().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_first_contacted: dialpadInteger(z.number().int()).optional(),
		date_first_contacted_iso: z.string().optional(),
		date_last_contacted: dialpadInteger(z.number().int()).optional(),
		date_last_contacted_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		department: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		emails: z
			.array(
				z
					.object({
						domain: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						email: z.string(),
						label: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
			)
			.max(50)
			.optional(),
		engagement_score: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		external_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		first_name: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		home_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		image_url: z.string().optional(),
		industry: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		job_title: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		key: z.string(),
		lang: z
			.union([
				z.string().max(2),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_medium: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_name: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_company_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_id: z.string().max(64),
		lead_score: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_source: z
			.enum(['hubspot', 'csv', 'callback', 'api', 'salesforce', 'receptionist'])
			.or(z.string())
			.optional(),
		mobile_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		name: z.string().optional(),
		owner_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		owner_type: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phones: z
			.array(
				z
					.object({
						country: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						display: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						label: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						number: z.string(),
					})
					.loose(),
			)
			.max(20)
			.optional(),
		preferred_medium: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_address: z
			.union([
				z.object({}).loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_email: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		remote_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		secondary_email: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		secondary_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input308 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				source: z.string().optional(),
				include_deleted: z.boolean().optional(),
				order: z.string().optional(),
				list_id: z.string().optional(),
				static_list_id: z.string().optional(),
				audience_id: z.string().optional(),
				csv_id: z.string().optional(),
				filters: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
		body: z
			.union([
				z.union([
					z
						.object({
							field: z.string(),
							op: z.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							]),
							value: z
								.union([
									z.string(),
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
						})
						.strict(),
					z
						.object({
							combiner: z.enum(['AND', 'OR']),
							conditions: z.array(
								z.union([
									z
										.object({
											field: z.string(),
											op: z.enum([
												'=',
												'~=',
												'!=',
												'>',
												'<',
												'>=',
												'<=',
												'^=',
												'$=',
												'!!',
												'~~',
											]),
											value: z
												.union([
													z.string(),
													dialpadInteger(z.number().int()),
													/* unknown because the official OpenAPI schema is not documented for this value. */ z
														.unknown()
														.nullable(),
												])
												.optional(),
										})
										.strict(),
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								]),
							),
						})
						.strict(),
				]),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.strict();

const Output308 = z.array(
	z
		.object({
			lead: z
				.object({
					addresses: z
						.array(
							z
								.object({
									city: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									country: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									line1: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									line2: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									name: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									postal_code: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									region: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
								})
								.loose(),
						)
						.max(20)
						.optional(),
					company_id: dialpadInteger(z.number().int()),
					contact_id: z
						.union([
							z.string().max(1024),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					contact_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					csv_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					csv_line: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					custom: z.object({}).loose().optional(),
					date_created: dialpadInteger(z.number().int()).optional(),
					date_created_iso: z.string().optional(),
					date_first_contacted: dialpadInteger(z.number().int()).optional(),
					date_first_contacted_iso: z.string().optional(),
					date_last_contacted: dialpadInteger(z.number().int()).optional(),
					date_last_contacted_iso: z.string().optional(),
					date_modified: dialpadInteger(z.number().int()).optional(),
					date_modified_iso: z.string().optional(),
					department: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					emails: z
						.array(
							z
								.object({
									domain: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									email: z.string(),
									label: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
								})
								.loose(),
						)
						.max(50)
						.optional(),
					engagement_score: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					external_id: z
						.union([
							z.string().max(1024),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					first_name: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					home_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					id: z.string(),
					image_url: z.string().optional(),
					industry: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					job_title: z
						.union([
							z.string().max(1500),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					key: z.string(),
					lang: z
						.union([
							z.string().max(2),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_medium: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_name: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					lead_company_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					lead_id: z.string().max(64),
					lead_score: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					lead_source: z
						.enum([
							'hubspot',
							'csv',
							'callback',
							'api',
							'salesforce',
							'receptionist',
						])
						.or(z.string())
						.optional(),
					mobile_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					name: z.string().optional(),
					owner_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					owner_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					phones: z
						.array(
							z
								.object({
									country: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									display: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									label: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									number: z.string(),
								})
								.loose(),
						)
						.max(20)
						.optional(),
					preferred_medium: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					primary_address: z
						.union([
							z.object({}).loose(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					primary_email: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					primary_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					remote_id: z
						.union([
							z.string().max(1024),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					role: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					secondary_email: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					secondary_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					state: z
						.enum(['pending', 'active', 'deleted'])
						.or(z.string())
						.optional(),
					tags: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					timezone: z
						.union([
							z.string().max(36),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
				})
				.loose(),
			lead_company: z.union([
				z
					.object({
						address: z
							.object({
								city: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line1: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line2: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								name: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								postal_code: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								region: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.loose()
							.optional(),
						annual_revenue: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						blacklisted: z
							.union([
								z.boolean(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						company_id: dialpadInteger(z.number().int()),
						currency: z
							.union([
								z.string().max(3),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						date_created: dialpadInteger(z.number().int()).optional(),
						date_created_iso: z.string().optional(),
						date_modified: dialpadInteger(z.number().int()).optional(),
						date_modified_iso: z.string().optional(),
						id: z.string(),
						key: z.string(),
						lead_company_id: z.string().max(64),
						naics_code: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						name: z
							.union([
								z.string().max(100),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						num_employees: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						phone: z
							.union([
								z.string().max(20),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						sanitized_name: z
							.union([
								z.string().max(100),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						sic_code: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			lead_id: z.string(),
			source: z.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			static_list: z.union([
				z
					.object({
						company_id: dialpadInteger(z.number().int()),
						date_created: dialpadInteger(z.number().int()).optional(),
						date_created_iso: z.string().optional(),
						date_modified: dialpadInteger(z.number().int()).optional(),
						date_modified_iso: z.string().optional(),
						id: z.string(),
						key: z.string(),
						lead_id: z.string().max(64),
						source: z.enum(['manual', 'snapshot']).or(z.string()).optional(),
						static_list_id: z.string().max(64),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			static_list_id: z.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
		})
		.loose(),
);

const Input309 = z
	.object({
		path: z
			.object({
				lead_id: z.string(),
			})
			.strict(),
		query: z
			.object({
				include_deleted: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output309 = z
	.object({
		addresses: z
			.array(
				z
					.object({
						city: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						country: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						line1: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						line2: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						name: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						postal_code: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						region: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
			)
			.max(20)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		contact_type: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		csv_line: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		custom: z.object({}).loose().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_first_contacted: dialpadInteger(z.number().int()).optional(),
		date_first_contacted_iso: z.string().optional(),
		date_last_contacted: dialpadInteger(z.number().int()).optional(),
		date_last_contacted_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		department: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		emails: z
			.array(
				z
					.object({
						domain: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						email: z.string(),
						label: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
			)
			.max(50)
			.optional(),
		engagement_score: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		external_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		first_name: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		home_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		image_url: z.string().optional(),
		industry: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		job_title: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		key: z.string(),
		lang: z
			.union([
				z.string().max(2),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_medium: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_name: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_company_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_id: z.string().max(64),
		lead_score: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_source: z
			.enum(['hubspot', 'csv', 'callback', 'api', 'salesforce', 'receptionist'])
			.or(z.string())
			.optional(),
		mobile_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		name: z.string().optional(),
		owner_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		owner_type: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phones: z
			.array(
				z
					.object({
						country: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						display: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						label: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						number: z.string(),
					})
					.loose(),
			)
			.max(20)
			.optional(),
		preferred_medium: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_address: z
			.union([
				z.object({}).loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_email: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		remote_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		secondary_email: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		secondary_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input310 = z
	.object({
		path: z
			.object({
				lead_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				addresses: z
					.array(
						z
							.object({
								city: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line1: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line2: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								name: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								postal_code: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								region: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
					)
					.max(20)
					.optional(),
				custom: z.object({}).strict().optional(),
				department: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				emails: z
					.array(
						z
							.object({
								domain: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								email: z.string(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.strict(),
					)
					.max(50)
					.optional(),
				engagement_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				external_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				first_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				industry: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				job_title: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lang: z
					.union([
						z.string().max(2),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_company_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				phones: z
					.array(
						z
							.object({
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								display: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								number: z.string(),
							})
							.strict(),
					)
					.max(20)
					.optional(),
				preferred_medium: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				timezone: z
					.union([
						z.string().max(36),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output310 = z
	.object({
		addresses: z
			.array(
				z
					.object({
						city: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						country: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						line1: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						line2: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						name: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						postal_code: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						region: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
			)
			.max(20)
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		contact_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		contact_type: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		csv_line: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		custom: z.object({}).loose().optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_first_contacted: dialpadInteger(z.number().int()).optional(),
		date_first_contacted_iso: z.string().optional(),
		date_last_contacted: dialpadInteger(z.number().int()).optional(),
		date_last_contacted_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		department: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		emails: z
			.array(
				z
					.object({
						domain: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						email: z.string(),
						label: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
			)
			.max(50)
			.optional(),
		engagement_score: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		external_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		first_name: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		home_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		image_url: z.string().optional(),
		industry: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		job_title: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		key: z.string(),
		lang: z
			.union([
				z.string().max(2),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_medium: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_name: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_company_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_id: z.string().max(64),
		lead_score: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_source: z
			.enum(['hubspot', 'csv', 'callback', 'api', 'salesforce', 'receptionist'])
			.or(z.string())
			.optional(),
		mobile_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		name: z.string().optional(),
		owner_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		owner_type: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phones: z
			.array(
				z
					.object({
						country: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						display: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						label: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						number: z.string(),
					})
					.loose(),
			)
			.max(20)
			.optional(),
		preferred_medium: z
			.union([
				z.string().max(16),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_address: z
			.union([
				z.object({}).loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_email: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		primary_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		remote_id: z
			.union([
				z.string().max(1024),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		role: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		secondary_email: z
			.union([
				z.string().max(50),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		secondary_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input311 = z
	.object({
		path: z
			.object({
				lead_company_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output311 = z
	.object({
		address: z
			.object({
				city: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				country: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				line1: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				line2: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				name: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				postal_code: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				region: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose()
			.optional(),
		annual_revenue: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		blacklisted: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		currency: z
			.union([
				z.string().max(3),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		lead_company_id: z.string().max(64),
		naics_code: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(100),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_employees: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sanitized_name: z
			.union([
				z.string().max(100),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sic_code: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input312 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				order: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output312 = z.array(
	z
		.object({
			address: z
				.object({
					city: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					country: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					line1: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					line2: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					name: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					postal_code: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					region: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
				})
				.loose()
				.optional(),
			annual_revenue: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			blacklisted: z
				.union([
					z.boolean(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			currency: z
				.union([
					z.string().max(3),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			lead_company_id: z.string().max(64),
			naics_code: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			name: z
				.union([
					z.string().max(100),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			num_employees: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			phone: z
				.union([
					z.string().max(20),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sanitized_name: z
				.union([
					z.string().max(100),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sic_code: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input313 = z
	.object({
		path: z
			.object({
				static_list_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z
					.union([
						z.enum(['add', 'delete']),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_ids: z
					.union([
						z.array(z.string()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				name: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				query: z
					.union([
						z.object({}).strict(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output313 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_query: dialpadInteger(z.number().int()).optional(),
		date_query_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		last_query: z
			.union([
				z
					.object({
						field: z.string(),
						op: z
							.enum([
								'=',
								'~=',
								'!=',
								'>',
								'<',
								'>=',
								'<=',
								'^=',
								'$=',
								'!!',
								'~~',
							])
							.or(z.string()),
						value: z
							.union([
								z.string(),
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				z
					.object({
						combiner: z.enum(['AND', 'OR']).or(z.string()),
						conditions: z.array(
							z.union([
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
								/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
							]),
						),
					})
					.loose(),
			])
			.optional(),
		name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_manual_rows: dialpadInteger(z.number().int()).optional(),
		num_rows: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
		sort_name: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		state: z
			.enum(['active', 'importing', 'clearing', 'error'])
			.or(z.string())
			.optional(),
		static_list_id: z.string().max(1500),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input314 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				include_deleted: z.boolean().optional(),
				order: z.string().optional(),
				static_list_id: z.string().optional(),
				audience_id: z.string().optional(),
				csv_id: z.string().optional(),
				filters: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output314 = z.array(
	z
		.object({
			addresses: z
				.array(
					z
						.object({
							city: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							country: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							line1: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							line2: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							name: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							postal_code: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							region: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
						})
						.loose(),
				)
				.max(20)
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			contact_id: z
				.union([
					z.string().max(1024),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			contact_type: z
				.union([
					z.string().max(16),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			csv_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			csv_line: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			custom: z.object({}).loose().optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_first_contacted: dialpadInteger(z.number().int()).optional(),
			date_first_contacted_iso: z.string().optional(),
			date_last_contacted: dialpadInteger(z.number().int()).optional(),
			date_last_contacted_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			department: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			emails: z
				.array(
					z
						.object({
							domain: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							email: z.string(),
							label: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
						})
						.loose(),
				)
				.max(50)
				.optional(),
			engagement_score: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			external_id: z
				.union([
					z.string().max(1024),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			first_name: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			home_phone: z
				.union([
					z.string().max(20),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			image_url: z.string().optional(),
			industry: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			job_title: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			key: z.string(),
			lang: z
				.union([
					z.string().max(2),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			last_medium: z
				.union([
					z.string().max(16),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			last_name: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			lead_company_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			lead_id: z.string().max(64),
			lead_score: z
				.union([
					dialpadInteger(z.number().int()),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			lead_source: z
				.enum([
					'hubspot',
					'csv',
					'callback',
					'api',
					'salesforce',
					'receptionist',
				])
				.or(z.string())
				.optional(),
			mobile_phone: z
				.union([
					z.string().max(20),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			name: z.string().optional(),
			owner_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			owner_type: z
				.union([
					z.string().max(16),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			phones: z
				.array(
					z
						.object({
							country: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							display: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							label: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							number: z.string(),
						})
						.loose(),
				)
				.max(20)
				.optional(),
			preferred_medium: z
				.union([
					z.string().max(16),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			primary_address: z
				.union([
					z.object({}).loose(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			primary_email: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			primary_phone: z
				.union([
					z.string().max(20),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			remote_id: z
				.union([
					z.string().max(1024),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			role: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			secondary_email: z
				.union([
					z.string().max(50),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			secondary_phone: z
				.union([
					z.string().max(20),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			state: z.enum(['pending', 'active', 'deleted']).or(z.string()).optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			timezone: z
				.union([
					z.string().max(36),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
		})
		.loose(),
);

const Input315 = z
	.object({
		body: z
			.object({
				custom: z
					.union([
						z.object({}).strict(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_source: z
					.union([
						z.enum([
							'hubspot',
							'csv',
							'callback',
							'api',
							'salesforce',
							'receptionist',
						]),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				limit: z
					.union([
						dialpadInteger(z.number().int().min(1)),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				since: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output315 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		error: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		gcs_filename: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		key: z.string(),
		lead_export_id: z.string().max(1500),
		lead_source: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		request_user_id: z.string().max(1500),
		url: z.string().optional(),
	})
	.loose();

const Input316 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				shared_only: z.boolean().optional(),
				campaign_counts: z.boolean().optional(),
				tags: z.string().optional(),
				target_ids: z.string().optional(),
				order: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output316 = z.array(
	z
		.object({
			campaign_counts: z
				.union([
					z
						.object({
							active_campaigns: dialpadInteger(z.number().int()).optional(),
							all_campaigns: dialpadInteger(z.number().int()).optional(),
							paused_campaigns: dialpadInteger(z.number().int()).optional(),
						})
						.loose(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			lead_list: z
				.object({
					audience_ids: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					audience_keys: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					author_dp_key: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					author_id: z.string().optional(),
					author_key: z.string().optional(),
					company_id: dialpadInteger(z.number().int()),
					csv_columns: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					csv_ids: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					csv_keys: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					date_created: dialpadInteger(z.number().int()).optional(),
					date_created_iso: z.string().optional(),
					date_modified: dialpadInteger(z.number().int()).optional(),
					date_modified_iso: z.string().optional(),
					date_user_modified: dialpadInteger(z.number().int()).optional(),
					date_user_modified_iso: z.string().optional(),
					id: z.string(),
					is_shared: z.boolean().optional(),
					key: z.string(),
					last_author_dp_key: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_author_id_id: z.string().optional(),
					last_author_id_key: z.string().optional(),
					lead_order: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					list_id: z.string().max(1500),
					name: z.string().max(1500).optional(),
					num_csv_rows: dialpadInteger(z.number().int()).optional(),
					num_manual_rows: dialpadInteger(z.number().int()).optional(),
					num_query_rows: dialpadInteger(z.number().int()).optional(),
					num_rows: dialpadInteger(z.number().int()).optional(),
					num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
					office_id: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					salesforce_listview_id: z
						.union([
							z.string().max(1500),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					sort_name: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					static_list_ids: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					static_list_keys: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					tags: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
				})
				.loose(),
		})
		.loose(),
);

const Input317 = z
	.object({
		body: z
			.object({
				item_ids: z.array(z.string()),
				state: z.enum(['cancelled']),
			})
			.strict(),
	})
	.strict();

const Output317 = z
	.object({
		skipped: z.array(
			z
				.object({
					actual_state: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					expected_state: z
						.union([
							z.string(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					id: z.string(),
					reason: z.string(),
				})
				.loose(),
		),
		successful_ids: z.array(z.string()),
		summary: z
			.object({
				successful_count: dialpadInteger(z.number().int()),
				total_processed: dialpadInteger(z.number().int()),
			})
			.loose(),
	})
	.loose();

const Input318 = z
	.object({
		path: z
			.object({
				item_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output318 = z
	.object({
		item: z
			.object({
				call_id: z.string().optional(),
				call_key: z.string().optional(),
				campaign_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				company_id: dialpadInteger(z.number().int()),
				contact_id: z.string().optional(),
				contact_key: z.string().optional(),
				csv: z.object({}).loose().optional(),
				current_rule_id: z.string().optional(),
				current_rule_key: z.string().optional(),
				date_created: dialpadInteger(z.number().int()).optional(),
				date_created_iso: z.string().optional(),
				date_estimate: dialpadInteger(z.number().int()).optional(),
				date_estimate_iso: z.string().optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				history: z
					.object({
						call_attempts: dialpadInteger(z.number().int().min(0)).optional(),
						last_call_id: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						last_categories: z
							.union([
								z.array(
									z.union([
										z
											.enum([
												'call:powerdialer_no_available_agent',
												'call:human_agent',
												'call:ai_agent',
												'call:outbound_connected',
												'call:powerdialer_vm_drop',
												'call:machine_detected',
												'call:powerdialer_call',
												'call:active',
												'call:outbound',
												'call:cancelled',
												'call:inbound',
												'call:missed',
												'call:abandoned',
												'call:user_initiated',
											])
											.or(z.string()),
										z
											.enum([
												'sms:accepted',
												'sms:invalid_destination',
												'sms:invalid_source',
												'sms:no_route',
												'sms:rejected_spam',
												'sms:internal_error',
												'sms:rejected',
												'sms:not_supported',
												'sms:time_out',
												'sms:error',
												'sms:unknown',
												'sms:forbidden',
												'sms:owner_no_international_messaging',
												'sms:unregistered_a2p_not_allowed',
												'sms:owner_not_enough_sms_credits',
												'sms:owner_not_enough_credits',
												'sms:messaging_disabled',
												'sms:owner_free_user',
												'sms:contact_missing_number',
												'sms:contact_is_room',
												'sms:contact_is_shared_line',
												'sms:staff_contact',
												'sms:company_affinity',
												'sms:not_in_free_company',
												'sms:invalid_number',
											])
											.or(z.string()),
										z
											.enum([
												'call:max_attempts_item',
												'call:max_attempts_delay_not_met',
												'call:max_attempts_criteria_not_met',
												'call:max_attempts_campaign_phone_total',
												'call:max_attempts_campaign_phone_daily',
												'call:max_attempts_campaign_phone_rolling',
												'call:max_attempts_campaign_contact_total',
												'call:max_attempts_campaign_contact_daily',
												'call:max_attempts_campaign_contact_rolling',
												'call:max_attempts_campaign_company_total',
												'call:max_attempts_campaign_company_daily',
												'call:max_attempts_campaign_company_rolling',
												'call:max_attempts_global_phone_daily',
												'call:max_attempts_global_phone_rolling',
												'call:max_attempts_global_contact_daily',
												'call:max_attempts_global_contact_rolling',
												'call:max_attempts_global_company_daily',
												'call:max_attempts_global_company_rolling',
											])
											.or(z.string()),
										z.string(),
									]),
								),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						last_error_id: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						rules:
							/* OpenAPI documents arbitrary fields on this response object. */ z
								.record(
									z.string(),
									z
										.object({
											attempts:
												/* OpenAPI documents arbitrary fields on this response object. */ z
													.record(
														z.string(),
														/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
													)
													.optional(),
											rule_type: z.string().optional(),
										})
										.loose(),
								)
								.optional(),
					})
					.loose()
					.optional(),
				id: z.string(),
				index: z.number().optional(),
				item_id: z.string().max(1500),
				key: z.string(),
				lead_id: z.string().optional(),
				lead_key: z.string().optional(),
				list_id: z.string().max(1500),
				result_code: z
					.enum([
						'call:powerdialer_no_available_agent',
						'call:human_agent',
						'call:ai_agent',
						'call:outbound_connected',
						'call:powerdialer_vm_drop',
						'call:machine_detected',
						'call:powerdialer_call',
						'call:active',
						'call:outbound',
						'call:cancelled',
						'call:inbound',
						'call:missed',
						'call:abandoned',
						'call:user_initiated',
						'call:max_attempts_item',
						'call:max_attempts_delay_not_met',
						'call:max_attempts_criteria_not_met',
						'call:max_attempts_campaign_phone_total',
						'call:max_attempts_campaign_phone_daily',
						'call:max_attempts_campaign_phone_rolling',
						'call:max_attempts_campaign_contact_total',
						'call:max_attempts_campaign_contact_daily',
						'call:max_attempts_campaign_contact_rolling',
						'call:max_attempts_campaign_company_total',
						'call:max_attempts_campaign_company_daily',
						'call:max_attempts_campaign_company_rolling',
						'call:max_attempts_global_phone_daily',
						'call:max_attempts_global_phone_rolling',
						'call:max_attempts_global_contact_daily',
						'call:max_attempts_global_contact_rolling',
						'call:max_attempts_global_company_daily',
						'call:max_attempts_global_company_rolling',
						'call:dnc',
						'call:timegate_failed',
						'call:fdcpa_max_attempted',
						'call:fdcpa_max_connected',
						'call:no_consent',
						'call:skipped',
						'sms:dnt',
						'sms:timegate_failed',
						'sms:no_consent',
						'sms:skipped',
						'sms:accepted',
						'sms:invalid_destination',
						'sms:invalid_source',
						'sms:no_route',
						'sms:rejected_spam',
						'sms:internal_error',
						'sms:rejected',
						'sms:not_supported',
						'sms:time_out',
						'sms:error',
						'sms:unknown',
						'sms:forbidden',
						'sms:owner_no_international_messaging',
						'sms:unregistered_a2p_not_allowed',
						'sms:owner_not_enough_sms_credits',
						'sms:owner_not_enough_credits',
						'sms:messaging_disabled',
						'sms:owner_free_user',
						'sms:contact_missing_number',
						'sms:contact_is_room',
						'sms:contact_is_shared_line',
						'sms:staff_contact',
						'sms:company_affinity',
						'sms:not_in_free_company',
						'sms:invalid_number',
					])
					.or(z.string())
					.optional(),
				sms_id: z.string().optional(),
				sms_key: z.string().optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
						'incomplete',
					])
					.or(z.string())
					.optional(),
				status: z
					.enum([
						'Upcoming',
						'In Progress',
						'Rescheduled',
						'Complete',
						'Error',
						'Excluded',
						'Incomplete',
					])
					.or(z.string())
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
			})
			.loose(),
		item_id: z.string(),
		last_call: z.union([
			z
				.object({
					analytics_categories: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					call_id: dialpadInteger(z.number().int()),
					call_result: z
						.enum(['connected', 'missed', 'voicemail', 'called'])
						.or(z.string())
						.optional(),
					campaign_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					company_id: dialpadInteger(z.number().int()),
					contact_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					contact_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					date_connected: dialpadInteger(z.number().int()).optional(),
					date_connected_iso: z.string().optional(),
					date_created: dialpadInteger(z.number().int()).optional(),
					date_created_iso: z.string().optional(),
					date_ended: dialpadInteger(z.number().int()).optional(),
					date_ended_iso: z.string().optional(),
					date_modified: dialpadInteger(z.number().int()).optional(),
					date_modified_iso: z.string().optional(),
					device_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					direction: z.enum(['inbound', 'outbound']).or(z.string()).optional(),
					dispositions: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					external_endpoint: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					external_leg_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					id: z.string(),
					internal_leg_ids: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					is_recording: z
						.union([
							z.boolean(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					key: z.string(),
					lead_company_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					machine_detection_confidence: z
						.union([
							z.number(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					machine_detection_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					operator_call_id: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					operator_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					operator_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					powerdial_info: z.object({}).loose().optional(),
					state: z
						.enum([
							'preanswer',
							'calling',
							'ringing',
							'connected',
							'merged',
							'hold',
							'queued',
							'voicemail',
							'eavesdrop',
							'monitor',
							'barge',
							'hangup',
							'blocked',
							'admin',
							'parked',
							'takeover',
							'postcall',
							'transcription',
							'recording',
							'csat',
							'dispositions',
							'missed',
							'voicemail_uploaded',
							'admin_recording',
						])
						.or(z.string()),
					target_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					target_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
				})
				.loose(),
			/* unknown because the official OpenAPI schema is not documented for this value. */ z
				.unknown()
				.nullable(),
		]),
		lead: z
			.object({
				addresses: z
					.array(
						z
							.object({
								city: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line1: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line2: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								name: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								postal_code: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								region: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.loose(),
					)
					.max(20)
					.optional(),
				company_id: dialpadInteger(z.number().int()),
				contact_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				contact_type: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				csv_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				csv_line: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				custom: z.object({}).loose().optional(),
				date_created: dialpadInteger(z.number().int()).optional(),
				date_created_iso: z.string().optional(),
				date_first_contacted: dialpadInteger(z.number().int()).optional(),
				date_first_contacted_iso: z.string().optional(),
				date_last_contacted: dialpadInteger(z.number().int()).optional(),
				date_last_contacted_iso: z.string().optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				department: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				emails: z
					.array(
						z
							.object({
								domain: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								email: z.string(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.loose(),
					)
					.max(50)
					.optional(),
				engagement_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				external_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				first_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				home_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				id: z.string(),
				image_url: z.string().optional(),
				industry: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				job_title: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				key: z.string(),
				lang: z
					.union([
						z.string().max(2),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_medium: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_company_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_id: z.string().max(64),
				lead_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_source: z
					.enum([
						'hubspot',
						'csv',
						'callback',
						'api',
						'salesforce',
						'receptionist',
					])
					.or(z.string())
					.optional(),
				mobile_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				name: z.string().optional(),
				owner_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				owner_type: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				phones: z
					.array(
						z
							.object({
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								display: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								number: z.string(),
							})
							.loose(),
					)
					.max(20)
					.optional(),
				preferred_medium: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				primary_address: z
					.union([
						z.object({}).loose(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				primary_email: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				primary_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				remote_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				secondary_email: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				secondary_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				state: z
					.enum(['pending', 'active', 'deleted'])
					.or(z.string())
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				timezone: z
					.union([
						z.string().max(36),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose(),
	})
	.loose();

const Input319 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				search: z.string().optional(),
				order: z.string().optional(),
				list_id: z.string().optional(),
				campaign_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output319 = z.array(
	z
		.object({
			item: z
				.object({
					call_id: z.string().optional(),
					call_key: z.string().optional(),
					campaign_id: z
						.union([
							z.string().max(1500),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					company_id: dialpadInteger(z.number().int()),
					contact_id: z.string().optional(),
					contact_key: z.string().optional(),
					csv: z.object({}).loose().optional(),
					current_rule_id: z.string().optional(),
					current_rule_key: z.string().optional(),
					date_created: dialpadInteger(z.number().int()).optional(),
					date_created_iso: z.string().optional(),
					date_estimate: dialpadInteger(z.number().int()).optional(),
					date_estimate_iso: z.string().optional(),
					date_modified: dialpadInteger(z.number().int()).optional(),
					date_modified_iso: z.string().optional(),
					history: z
						.object({
							call_attempts: dialpadInteger(z.number().int().min(0)).optional(),
							last_call_id: z
								.union([
									dialpadInteger(z.number().int()),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_categories: z
								.union([
									z.array(
										z.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										]),
									),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							last_error_id: z
								.union([
									z.string(),
									/* unknown because the official OpenAPI schema is not documented for this value. */ z
										.unknown()
										.nullable(),
								])
								.optional(),
							rules:
								/* OpenAPI documents arbitrary fields on this response object. */ z
									.record(
										z.string(),
										z
											.object({
												attempts:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
												rule_type:
													/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
														.unknown()
														.optional(),
											})
											.loose(),
									)
									.optional(),
						})
						.loose()
						.optional(),
					id: z.string(),
					index: z.number().optional(),
					item_id: z.string().max(1500),
					key: z.string(),
					lead_id: z.string().optional(),
					lead_key: z.string().optional(),
					list_id: z.string().max(1500),
					result_code: z
						.enum([
							'call:powerdialer_no_available_agent',
							'call:human_agent',
							'call:ai_agent',
							'call:outbound_connected',
							'call:powerdialer_vm_drop',
							'call:machine_detected',
							'call:powerdialer_call',
							'call:active',
							'call:outbound',
							'call:cancelled',
							'call:inbound',
							'call:missed',
							'call:abandoned',
							'call:user_initiated',
							'call:max_attempts_item',
							'call:max_attempts_delay_not_met',
							'call:max_attempts_criteria_not_met',
							'call:max_attempts_campaign_phone_total',
							'call:max_attempts_campaign_phone_daily',
							'call:max_attempts_campaign_phone_rolling',
							'call:max_attempts_campaign_contact_total',
							'call:max_attempts_campaign_contact_daily',
							'call:max_attempts_campaign_contact_rolling',
							'call:max_attempts_campaign_company_total',
							'call:max_attempts_campaign_company_daily',
							'call:max_attempts_campaign_company_rolling',
							'call:max_attempts_global_phone_daily',
							'call:max_attempts_global_phone_rolling',
							'call:max_attempts_global_contact_daily',
							'call:max_attempts_global_contact_rolling',
							'call:max_attempts_global_company_daily',
							'call:max_attempts_global_company_rolling',
							'call:dnc',
							'call:timegate_failed',
							'call:fdcpa_max_attempted',
							'call:fdcpa_max_connected',
							'call:no_consent',
							'call:skipped',
							'sms:dnt',
							'sms:timegate_failed',
							'sms:no_consent',
							'sms:skipped',
							'sms:accepted',
							'sms:invalid_destination',
							'sms:invalid_source',
							'sms:no_route',
							'sms:rejected_spam',
							'sms:internal_error',
							'sms:rejected',
							'sms:not_supported',
							'sms:time_out',
							'sms:error',
							'sms:unknown',
							'sms:forbidden',
							'sms:owner_no_international_messaging',
							'sms:unregistered_a2p_not_allowed',
							'sms:owner_not_enough_sms_credits',
							'sms:owner_not_enough_credits',
							'sms:messaging_disabled',
							'sms:owner_free_user',
							'sms:contact_missing_number',
							'sms:contact_is_room',
							'sms:contact_is_shared_line',
							'sms:staff_contact',
							'sms:company_affinity',
							'sms:not_in_free_company',
							'sms:invalid_number',
						])
						.or(z.string())
						.optional(),
					sms_id: z.string().optional(),
					sms_key: z.string().optional(),
					state: z
						.enum([
							'pending',
							'launching',
							'scheduled',
							'active',
							'paused',
							'complete',
							'error',
							'deleted',
							'cancelled',
							'incomplete',
						])
						.or(z.string())
						.optional(),
					status: z
						.enum([
							'Upcoming',
							'In Progress',
							'Rescheduled',
							'Complete',
							'Error',
							'Excluded',
							'Incomplete',
						])
						.or(z.string())
						.optional(),
					tags: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
				})
				.loose(),
			item_id: z.string(),
			last_call: z.union([
				z
					.object({
						analytics_categories: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
						call_id: dialpadInteger(z.number().int()),
						call_result: z
							.enum(['connected', 'missed', 'voicemail', 'called'])
							.or(z.string())
							.optional(),
						campaign_id: z
							.union([
								z.string().max(64),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						company_id: dialpadInteger(z.number().int()),
						contact_id: z
							.union([
								z.string().max(64),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						contact_type: z
							.union([
								z.string().max(16),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						date_connected: dialpadInteger(z.number().int()).optional(),
						date_connected_iso: z.string().optional(),
						date_created: dialpadInteger(z.number().int()).optional(),
						date_created_iso: z.string().optional(),
						date_ended: dialpadInteger(z.number().int()).optional(),
						date_ended_iso: z.string().optional(),
						date_modified: dialpadInteger(z.number().int()).optional(),
						date_modified_iso: z.string().optional(),
						device_type: z
							.union([
								z.string().max(16),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						direction: z
							.enum(['inbound', 'outbound'])
							.or(z.string())
							.optional(),
						dispositions: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
						external_endpoint: z
							.union([
								z.string().max(20),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						external_leg_id: z
							.union([
								z.string().max(64),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						id: z.string(),
						internal_leg_ids: z
							.array(
								/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
							)
							.optional(),
						is_recording: z
							.union([
								z.boolean(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						key: z.string(),
						lead_company_id: z
							.union([
								z.string().max(64),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						machine_detection_confidence: z
							.union([
								z.number(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						machine_detection_type: z
							.union([
								z.string().max(16),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						operator_call_id: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						operator_id: z
							.union([
								z.string().max(64),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						operator_type: z
							.union([
								z.string().max(16),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						powerdial_info: z.object({}).loose().optional(),
						state: z
							.enum([
								'preanswer',
								'calling',
								'ringing',
								'connected',
								'merged',
								'hold',
								'queued',
								'voicemail',
								'eavesdrop',
								'monitor',
								'barge',
								'hangup',
								'blocked',
								'admin',
								'parked',
								'takeover',
								'postcall',
								'transcription',
								'recording',
								'csat',
								'dispositions',
								'missed',
								'voicemail_uploaded',
								'admin_recording',
							])
							.or(z.string()),
						target_id: z
							.union([
								z.string().max(64),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						target_type: z
							.union([
								z.string().max(16),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			]),
			lead: z
				.object({
					addresses: z
						.array(
							z
								.object({
									city: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									country: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									line1: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									line2: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									name: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									postal_code: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									region: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
								})
								.loose(),
						)
						.max(20)
						.optional(),
					company_id: dialpadInteger(z.number().int()),
					contact_id: z
						.union([
							z.string().max(1024),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					contact_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					csv_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					csv_line: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					custom: z.object({}).loose().optional(),
					date_created: dialpadInteger(z.number().int()).optional(),
					date_created_iso: z.string().optional(),
					date_first_contacted: dialpadInteger(z.number().int()).optional(),
					date_first_contacted_iso: z.string().optional(),
					date_last_contacted: dialpadInteger(z.number().int()).optional(),
					date_last_contacted_iso: z.string().optional(),
					date_modified: dialpadInteger(z.number().int()).optional(),
					date_modified_iso: z.string().optional(),
					department: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					emails: z
						.array(
							z
								.object({
									domain: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									email: z.string(),
									label: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
								})
								.loose(),
						)
						.max(50)
						.optional(),
					engagement_score: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					external_id: z
						.union([
							z.string().max(1024),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					first_name: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					home_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					id: z.string(),
					image_url: z.string().optional(),
					industry: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					job_title: z
						.union([
							z.string().max(1500),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					key: z.string(),
					lang: z
						.union([
							z.string().max(2),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_medium: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					last_name: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					lead_company_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					lead_id: z.string().max(64),
					lead_score: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					lead_source: z
						.enum([
							'hubspot',
							'csv',
							'callback',
							'api',
							'salesforce',
							'receptionist',
						])
						.or(z.string())
						.optional(),
					mobile_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					name: z.string().optional(),
					owner_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					owner_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					phones: z
						.array(
							z
								.object({
									country: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									display: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									label: z
										.union([
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
										])
										.optional(),
									number: z.string(),
								})
								.loose(),
						)
						.max(20)
						.optional(),
					preferred_medium: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					primary_address: z
						.union([
							z.object({}).loose(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					primary_email: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					primary_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					remote_id: z
						.union([
							z.string().max(1024),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					role: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					secondary_email: z
						.union([
							z.string().max(50),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					secondary_phone: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					state: z
						.enum(['pending', 'active', 'deleted'])
						.or(z.string())
						.optional(),
					tags: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					timezone: z
						.union([
							z.string().max(36),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
				})
				.loose(),
		})
		.loose(),
);

const Input320 = z
	.object({
		path: z
			.object({
				list_id: z.string(),
			})
			.strict(),
		query: z
			.object({
				campaign_counts: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output320 = z
	.object({
		campaign_counts: z
			.union([
				z
					.object({
						active_campaigns: dialpadInteger(z.number().int()).optional(),
						all_campaigns: dialpadInteger(z.number().int()).optional(),
						paused_campaigns: dialpadInteger(z.number().int()).optional(),
					})
					.loose(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		lead_list: z
			.object({
				audience_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				audience_keys: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				author_dp_key: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				author_id: z.string().optional(),
				author_key: z.string().optional(),
				company_id: dialpadInteger(z.number().int()),
				csv_columns: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				csv_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				csv_keys: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				date_created: dialpadInteger(z.number().int()).optional(),
				date_created_iso: z.string().optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				date_user_modified: dialpadInteger(z.number().int()).optional(),
				date_user_modified_iso: z.string().optional(),
				id: z.string(),
				is_shared: z.boolean().optional(),
				key: z.string(),
				last_author_dp_key: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_author_id_id: z.string().optional(),
				last_author_id_key: z.string().optional(),
				lead_order: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				list_id: z.string().max(1500),
				name: z.string().max(1500).optional(),
				num_csv_rows: dialpadInteger(z.number().int()).optional(),
				num_manual_rows: dialpadInteger(z.number().int()).optional(),
				num_query_rows: dialpadInteger(z.number().int()).optional(),
				num_rows: dialpadInteger(z.number().int()).optional(),
				num_snapshot_rows: dialpadInteger(z.number().int()).optional(),
				office_id: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				salesforce_listview_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				sort_name: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				static_list_ids: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				static_list_keys: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
			})
			.loose(),
	})
	.loose();

const Input321 = z
	.object({
		path: z
			.object({
				export_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output321 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		error: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		gcs_filename: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		key: z.string(),
		lead_export_id: z.string().max(1500),
		lead_source: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		request_user_id: z.string().max(1500),
		url: z.string().optional(),
	})
	.loose();

const Input322 = z
	.object({
		body: z
			.object({
				consent: z
					.enum(['implied', 'consent', 'written_consent', 'revoked'])
					.optional(),
				date_dnc_expires: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_dnc_opt_out: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_dnt_expires: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_dnt_opt_out: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dnc: z
					.union([
						z.boolean(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dnc_scope: z.enum(['powerdialer', 'ever']).optional(),
				dnt: z
					.union([
						z.boolean(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dnt_scope: z.enum(['powerdialer', 'ever']).optional(),
				e164: z.string().optional(),
				label: z.enum(['mobile', 'work', 'home', 'other']).optional(),
				state: z.enum(['active', 'deleted']).optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				validity: z
					.enum([
						'good',
						'unverified',
						'disconnected',
						'fax',
						'spam',
						'wrong_number',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output322 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		consent: z
			.enum(['implied', 'consent', 'written_consent', 'revoked'])
			.or(z.string())
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_dnc_expires: dialpadInteger(z.number().int()).optional(),
		date_dnc_expires_iso: z.string().optional(),
		date_dnc_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnc_opt_out_iso: z.string().optional(),
		date_dnt_expires: dialpadInteger(z.number().int()).optional(),
		date_dnt_expires_iso: z.string().optional(),
		date_dnt_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnt_opt_out_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dnc: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnc_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		dnt: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnt_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		e164: z.string().max(20),
		formatted_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		is_dnc_expired: z.boolean().optional(),
		is_dnt_expired: z.boolean().optional(),
		key: z.string(),
		label: z
			.enum(['mobile', 'work', 'home', 'other'])
			.or(z.string())
			.optional(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_source: z.enum(['api', 'csv', 'dp_contact']).or(z.string()).optional(),
		state: z.enum(['active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		validity: z
			.enum([
				'good',
				'unverified',
				'disconnected',
				'fax',
				'spam',
				'wrong_number',
			])
			.or(z.string())
			.optional(),
	})
	.loose();

const Input323 = z
	.object({
		path: z
			.object({
				e164: z.string(),
			})
			.strict(),
	})
	.strict();

const Output323 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		consent: z
			.enum(['implied', 'consent', 'written_consent', 'revoked'])
			.or(z.string())
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_dnc_expires: dialpadInteger(z.number().int()).optional(),
		date_dnc_expires_iso: z.string().optional(),
		date_dnc_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnc_opt_out_iso: z.string().optional(),
		date_dnt_expires: dialpadInteger(z.number().int()).optional(),
		date_dnt_expires_iso: z.string().optional(),
		date_dnt_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnt_opt_out_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dnc: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnc_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		dnt: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnt_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		e164: z.string().max(20),
		formatted_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		is_dnc_expired: z.boolean().optional(),
		is_dnt_expired: z.boolean().optional(),
		key: z.string(),
		label: z
			.enum(['mobile', 'work', 'home', 'other'])
			.or(z.string())
			.optional(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_source: z.enum(['api', 'csv', 'dp_contact']).or(z.string()).optional(),
		state: z.enum(['active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		validity: z
			.enum([
				'good',
				'unverified',
				'disconnected',
				'fax',
				'spam',
				'wrong_number',
			])
			.or(z.string())
			.optional(),
	})
	.loose();

const Input324 = z
	.object({
		path: z
			.object({
				item_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				state: z
					.union([
						z.enum(['cancelled']),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output324 = z
	.object({
		item: z
			.object({
				call_id: z.string().optional(),
				call_key: z.string().optional(),
				campaign_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				company_id: dialpadInteger(z.number().int()),
				contact_id: z.string().optional(),
				contact_key: z.string().optional(),
				csv: z.object({}).loose().optional(),
				current_rule_id: z.string().optional(),
				current_rule_key: z.string().optional(),
				date_created: dialpadInteger(z.number().int()).optional(),
				date_created_iso: z.string().optional(),
				date_estimate: dialpadInteger(z.number().int()).optional(),
				date_estimate_iso: z.string().optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				history: z
					.object({
						call_attempts: dialpadInteger(z.number().int().min(0)).optional(),
						last_call_id: z
							.union([
								dialpadInteger(z.number().int()),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						last_categories: z
							.union([
								z.array(
									z.union([
										z
											.enum([
												'call:powerdialer_no_available_agent',
												'call:human_agent',
												'call:ai_agent',
												'call:outbound_connected',
												'call:powerdialer_vm_drop',
												'call:machine_detected',
												'call:powerdialer_call',
												'call:active',
												'call:outbound',
												'call:cancelled',
												'call:inbound',
												'call:missed',
												'call:abandoned',
												'call:user_initiated',
											])
											.or(z.string()),
										z
											.enum([
												'sms:accepted',
												'sms:invalid_destination',
												'sms:invalid_source',
												'sms:no_route',
												'sms:rejected_spam',
												'sms:internal_error',
												'sms:rejected',
												'sms:not_supported',
												'sms:time_out',
												'sms:error',
												'sms:unknown',
												'sms:forbidden',
												'sms:owner_no_international_messaging',
												'sms:unregistered_a2p_not_allowed',
												'sms:owner_not_enough_sms_credits',
												'sms:owner_not_enough_credits',
												'sms:messaging_disabled',
												'sms:owner_free_user',
												'sms:contact_missing_number',
												'sms:contact_is_room',
												'sms:contact_is_shared_line',
												'sms:staff_contact',
												'sms:company_affinity',
												'sms:not_in_free_company',
												'sms:invalid_number',
											])
											.or(z.string()),
										z
											.enum([
												'call:max_attempts_item',
												'call:max_attempts_delay_not_met',
												'call:max_attempts_criteria_not_met',
												'call:max_attempts_campaign_phone_total',
												'call:max_attempts_campaign_phone_daily',
												'call:max_attempts_campaign_phone_rolling',
												'call:max_attempts_campaign_contact_total',
												'call:max_attempts_campaign_contact_daily',
												'call:max_attempts_campaign_contact_rolling',
												'call:max_attempts_campaign_company_total',
												'call:max_attempts_campaign_company_daily',
												'call:max_attempts_campaign_company_rolling',
												'call:max_attempts_global_phone_daily',
												'call:max_attempts_global_phone_rolling',
												'call:max_attempts_global_contact_daily',
												'call:max_attempts_global_contact_rolling',
												'call:max_attempts_global_company_daily',
												'call:max_attempts_global_company_rolling',
											])
											.or(z.string()),
										z.string(),
									]),
								),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						last_error_id: z
							.union([
								z.string(),
								/* unknown because the official OpenAPI schema is not documented for this value. */ z
									.unknown()
									.nullable(),
							])
							.optional(),
						rules:
							/* OpenAPI documents arbitrary fields on this response object. */ z
								.record(
									z.string(),
									z
										.object({
											attempts:
												/* OpenAPI documents arbitrary fields on this response object. */ z
													.record(
														z.string(),
														/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z.unknown(),
													)
													.optional(),
											rule_type: z.string().optional(),
										})
										.loose(),
								)
								.optional(),
					})
					.loose()
					.optional(),
				id: z.string(),
				index: z.number().optional(),
				item_id: z.string().max(1500),
				key: z.string(),
				lead_id: z.string().optional(),
				lead_key: z.string().optional(),
				list_id: z.string().max(1500),
				result_code: z
					.enum([
						'call:powerdialer_no_available_agent',
						'call:human_agent',
						'call:ai_agent',
						'call:outbound_connected',
						'call:powerdialer_vm_drop',
						'call:machine_detected',
						'call:powerdialer_call',
						'call:active',
						'call:outbound',
						'call:cancelled',
						'call:inbound',
						'call:missed',
						'call:abandoned',
						'call:user_initiated',
						'call:max_attempts_item',
						'call:max_attempts_delay_not_met',
						'call:max_attempts_criteria_not_met',
						'call:max_attempts_campaign_phone_total',
						'call:max_attempts_campaign_phone_daily',
						'call:max_attempts_campaign_phone_rolling',
						'call:max_attempts_campaign_contact_total',
						'call:max_attempts_campaign_contact_daily',
						'call:max_attempts_campaign_contact_rolling',
						'call:max_attempts_campaign_company_total',
						'call:max_attempts_campaign_company_daily',
						'call:max_attempts_campaign_company_rolling',
						'call:max_attempts_global_phone_daily',
						'call:max_attempts_global_phone_rolling',
						'call:max_attempts_global_contact_daily',
						'call:max_attempts_global_contact_rolling',
						'call:max_attempts_global_company_daily',
						'call:max_attempts_global_company_rolling',
						'call:dnc',
						'call:timegate_failed',
						'call:fdcpa_max_attempted',
						'call:fdcpa_max_connected',
						'call:no_consent',
						'call:skipped',
						'sms:dnt',
						'sms:timegate_failed',
						'sms:no_consent',
						'sms:skipped',
						'sms:accepted',
						'sms:invalid_destination',
						'sms:invalid_source',
						'sms:no_route',
						'sms:rejected_spam',
						'sms:internal_error',
						'sms:rejected',
						'sms:not_supported',
						'sms:time_out',
						'sms:error',
						'sms:unknown',
						'sms:forbidden',
						'sms:owner_no_international_messaging',
						'sms:unregistered_a2p_not_allowed',
						'sms:owner_not_enough_sms_credits',
						'sms:owner_not_enough_credits',
						'sms:messaging_disabled',
						'sms:owner_free_user',
						'sms:contact_missing_number',
						'sms:contact_is_room',
						'sms:contact_is_shared_line',
						'sms:staff_contact',
						'sms:company_affinity',
						'sms:not_in_free_company',
						'sms:invalid_number',
					])
					.or(z.string())
					.optional(),
				sms_id: z.string().optional(),
				sms_key: z.string().optional(),
				state: z
					.enum([
						'pending',
						'launching',
						'scheduled',
						'active',
						'paused',
						'complete',
						'error',
						'deleted',
						'cancelled',
						'incomplete',
					])
					.or(z.string())
					.optional(),
				status: z
					.enum([
						'Upcoming',
						'In Progress',
						'Rescheduled',
						'Complete',
						'Error',
						'Excluded',
						'Incomplete',
					])
					.or(z.string())
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
			})
			.loose(),
		item_id: z.string(),
		last_call: z.union([
			z
				.object({
					analytics_categories: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					call_id: dialpadInteger(z.number().int()),
					call_result: z
						.enum(['connected', 'missed', 'voicemail', 'called'])
						.or(z.string())
						.optional(),
					campaign_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					company_id: dialpadInteger(z.number().int()),
					contact_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					contact_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					date_connected: dialpadInteger(z.number().int()).optional(),
					date_connected_iso: z.string().optional(),
					date_created: dialpadInteger(z.number().int()).optional(),
					date_created_iso: z.string().optional(),
					date_ended: dialpadInteger(z.number().int()).optional(),
					date_ended_iso: z.string().optional(),
					date_modified: dialpadInteger(z.number().int()).optional(),
					date_modified_iso: z.string().optional(),
					device_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					direction: z.enum(['inbound', 'outbound']).or(z.string()).optional(),
					dispositions: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					external_endpoint: z
						.union([
							z.string().max(20),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					external_leg_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					id: z.string(),
					internal_leg_ids: z
						.array(
							/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
						)
						.optional(),
					is_recording: z
						.union([
							z.boolean(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					key: z.string(),
					lead_company_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					machine_detection_confidence: z
						.union([
							z.number(),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					machine_detection_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					operator_call_id: z
						.union([
							dialpadInteger(z.number().int()),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					operator_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					operator_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					powerdial_info: z.object({}).loose().optional(),
					state: z
						.enum([
							'preanswer',
							'calling',
							'ringing',
							'connected',
							'merged',
							'hold',
							'queued',
							'voicemail',
							'eavesdrop',
							'monitor',
							'barge',
							'hangup',
							'blocked',
							'admin',
							'parked',
							'takeover',
							'postcall',
							'transcription',
							'recording',
							'csat',
							'dispositions',
							'missed',
							'voicemail_uploaded',
							'admin_recording',
						])
						.or(z.string()),
					target_id: z
						.union([
							z.string().max(64),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
					target_type: z
						.union([
							z.string().max(16),
							/* unknown because the official OpenAPI schema is not documented for this value. */ z
								.unknown()
								.nullable(),
						])
						.optional(),
				})
				.loose(),
			/* unknown because the official OpenAPI schema is not documented for this value. */ z
				.unknown()
				.nullable(),
		]),
		lead: z
			.object({
				addresses: z
					.array(
						z
							.object({
								city: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line1: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								line2: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								name: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								postal_code: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								region: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.loose(),
					)
					.max(20)
					.optional(),
				company_id: dialpadInteger(z.number().int()),
				contact_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				contact_type: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				csv_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				csv_line: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				custom: z.object({}).loose().optional(),
				date_created: dialpadInteger(z.number().int()).optional(),
				date_created_iso: z.string().optional(),
				date_first_contacted: dialpadInteger(z.number().int()).optional(),
				date_first_contacted_iso: z.string().optional(),
				date_last_contacted: dialpadInteger(z.number().int()).optional(),
				date_last_contacted_iso: z.string().optional(),
				date_modified: dialpadInteger(z.number().int()).optional(),
				date_modified_iso: z.string().optional(),
				department: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				emails: z
					.array(
						z
							.object({
								domain: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								email: z.string(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
							})
							.loose(),
					)
					.max(50)
					.optional(),
				engagement_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				external_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				first_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				home_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				id: z.string(),
				image_url: z.string().optional(),
				industry: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				job_title: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				key: z.string(),
				lang: z
					.union([
						z.string().max(2),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_medium: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				last_name: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_company_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_id: z.string().max(64),
				lead_score: z
					.union([
						dialpadInteger(z.number().int()),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				lead_source: z
					.enum([
						'hubspot',
						'csv',
						'callback',
						'api',
						'salesforce',
						'receptionist',
					])
					.or(z.string())
					.optional(),
				mobile_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				name: z.string().optional(),
				owner_id: z
					.union([
						z.string().max(64),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				owner_type: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				phones: z
					.array(
						z
							.object({
								country: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								display: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								label: z
									.union([
										z.string(),
										/* unknown because the official OpenAPI schema is not documented for this value. */ z
											.unknown()
											.nullable(),
									])
									.optional(),
								number: z.string(),
							})
							.loose(),
					)
					.max(20)
					.optional(),
				preferred_medium: z
					.union([
						z.string().max(16),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				primary_address: z
					.union([
						z.object({}).loose(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				primary_email: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				primary_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				remote_id: z
					.union([
						z.string().max(1024),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				role: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				secondary_email: z
					.union([
						z.string().max(50),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				secondary_phone: z
					.union([
						z.string().max(20),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				state: z
					.enum(['pending', 'active', 'deleted'])
					.or(z.string())
					.optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				timezone: z
					.union([
						z.string().max(36),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.loose(),
	})
	.loose();

const Input325 = z
	.object({
		path: z
			.object({
				e164: z.string(),
			})
			.strict(),
	})
	.strict();

const Output325 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		consent: z
			.enum(['implied', 'consent', 'written_consent', 'revoked'])
			.or(z.string())
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_dnc_expires: dialpadInteger(z.number().int()).optional(),
		date_dnc_expires_iso: z.string().optional(),
		date_dnc_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnc_opt_out_iso: z.string().optional(),
		date_dnt_expires: dialpadInteger(z.number().int()).optional(),
		date_dnt_expires_iso: z.string().optional(),
		date_dnt_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnt_opt_out_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dnc: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnc_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		dnt: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnt_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		e164: z.string().max(20),
		formatted_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		is_dnc_expired: z.boolean().optional(),
		is_dnt_expired: z.boolean().optional(),
		key: z.string(),
		label: z
			.enum(['mobile', 'work', 'home', 'other'])
			.or(z.string())
			.optional(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_source: z.enum(['api', 'csv', 'dp_contact']).or(z.string()).optional(),
		state: z.enum(['active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		validity: z
			.enum([
				'good',
				'unverified',
				'disconnected',
				'fax',
				'spam',
				'wrong_number',
			])
			.or(z.string())
			.optional(),
	})
	.loose();

const Input326 = z
	.object({
		query: z
			.object({
				limit: dialpadInteger(z.number().int()).optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				sobject_types: z.string().optional(),
				search: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output326 = z.array(
	z
		.object({
			creator_name: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			date_created: z.string(),
			date_modified: z.string(),
			developer_name: z.string(),
			name: z.string(),
			sfdc_id: z.string(),
			sobject_type: z.string(),
		})
		.loose(),
);

const Input327 = z
	.object({
		path: z
			.object({
				e164: z.string(),
			})
			.strict(),
		body: z
			.object({
				consent: z
					.enum(['implied', 'consent', 'written_consent', 'revoked'])
					.optional(),
				date_dnc_expires: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_dnc_opt_out: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_dnt_expires: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				date_dnt_opt_out: z
					.union([
						z.string(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dnc: z
					.union([
						z.boolean(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dnc_scope: z.enum(['powerdialer', 'ever']).optional(),
				dnt: z
					.union([
						z.boolean(),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				dnt_scope: z.enum(['powerdialer', 'ever']).optional(),
				e164: z.string().optional(),
				label: z.enum(['mobile', 'work', 'home', 'other']).optional(),
				state: z.enum(['active', 'deleted']).optional(),
				tags: z
					.array(
						/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
					)
					.optional(),
				validity: z
					.enum([
						'good',
						'unverified',
						'disconnected',
						'fax',
						'spam',
						'wrong_number',
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output327 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		consent: z
			.enum(['implied', 'consent', 'written_consent', 'revoked'])
			.or(z.string())
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_dnc_expires: dialpadInteger(z.number().int()).optional(),
		date_dnc_expires_iso: z.string().optional(),
		date_dnc_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnc_opt_out_iso: z.string().optional(),
		date_dnt_expires: dialpadInteger(z.number().int()).optional(),
		date_dnt_expires_iso: z.string().optional(),
		date_dnt_opt_out: dialpadInteger(z.number().int()).optional(),
		date_dnt_opt_out_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		dnc: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnc_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		dnt: z
			.union([
				z.boolean(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		dnt_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
		e164: z.string().max(20),
		formatted_phone: z
			.union([
				z.string().max(20),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		is_dnc_expired: z.boolean().optional(),
		is_dnt_expired: z.boolean().optional(),
		key: z.string(),
		label: z
			.enum(['mobile', 'work', 'home', 'other'])
			.or(z.string())
			.optional(),
		last_author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_author_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_csv_id: z
			.union([
				z.string().max(64),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		last_source: z.enum(['api', 'csv', 'dp_contact']).or(z.string()).optional(),
		state: z.enum(['active', 'deleted']).or(z.string()).optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		timezone: z
			.union([
				z.string().max(36),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		validity: z
			.enum([
				'good',
				'unverified',
				'disconnected',
				'fax',
				'spam',
				'wrong_number',
			])
			.or(z.string())
			.optional(),
	})
	.loose();

const Input328 = z
	.object({
		query: z
			.object({
				sobject_type: z.string(),
			})
			.strict(),
	})
	.strict();

const Output328 = z.array(
	z
		.object({
			label: z.string(),
			name: z.string(),
			type: z.string(),
		})
		.loose(),
);

const Input329 = z
	.object({
		path: z
			.object({
				sfdc_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output329 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		count: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		creator_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_updated_count: dialpadInteger(z.number().int()).optional(),
		date_updated_count_iso: z.string().optional(),
		developer_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		key: z.string(),
		listview_id: z.string().max(18),
		name: z.string().max(1500),
		order_by: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		query: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sobject_type: z
			.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
			.or(z.string()),
		where_clause: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input330 = z
	.object({
		query: z
			.object({
				object_mapping_id: z.string().optional(),
				use_default_mapping: z.boolean().optional(),
			})
			.strict()
			.optional(),
		body: z
			.object({
				campaign_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				listview_id: z
					.union([
						z.string().max(18),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				object_mapping_id: z.string().optional(),
				sobject_type: z
					.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
					.optional(),
				strategy: z.enum(['skip', 'merge']).optional(),
				use_default_mapping: z.boolean().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output330 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		import_id: z.string().max(1500),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		listview_id: z
			.union([
				z.string().max(18),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		object_mapping_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sobject_type: z
			.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
			.or(z.string())
			.optional(),
		state: z
			.enum(['pending', 'active', 'complete', 'error'])
			.or(z.string())
			.optional(),
		strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
	})
	.loose();

const Input331 = z
	.object({
		query: z
			.object({
				campaign_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output331 = z.array(
	z
		.object({
			author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			author_id: z.string().optional(),
			author_key: z.string().optional(),
			campaign_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			import_id: z.string().max(1500),
			import_results: z
				.object({
					collisions: dialpadInteger(z.number().int().min(0)).optional(),
					created: dialpadInteger(z.number().int().min(0)).optional(),
					duplicates: dialpadInteger(z.number().int().min(0)).optional(),
					failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
					skipped: dialpadInteger(z.number().int().min(0)).optional(),
					total: dialpadInteger(z.number().int().min(0)).optional(),
					updated: dialpadInteger(z.number().int().min(0)).optional(),
				})
				.loose()
				.optional(),
			key: z.string(),
			listview_id: z
				.union([
					z.string().max(18),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			object_mapping_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			sobject_type: z
				.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
				.or(z.string())
				.optional(),
			state: z
				.enum(['pending', 'active', 'complete', 'error'])
				.or(z.string())
				.optional(),
			strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
		})
		.loose(),
);

const Input332 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				campaign_id: z.string().optional(),
				scope: z.string().optional(),
				sobject_type: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output332 = z.array(
	z
		.object({
			campaign_id: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			company_id: dialpadInteger(z.number().int()),
			custom_mapping:
				/* OpenAPI documents arbitrary fields on this response object. */ z
					.record(z.string(), z.string())
					.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			id: z.string(),
			key: z.string(),
			lead_mapping:
				/* OpenAPI documents arbitrary fields on this response object. */ z
					.record(
						z.string(),
						z
							.enum([
								'do_not_import',
								'first_name',
								'last_name',
								'job_title',
								'industry',
								'role',
								'department',
								'external_id',
								'timezone',
								'lang',
								'primary_phone',
								'secondary_phone',
								'primary_email',
								'secondary_email',
								'address_name',
								'address_line1',
								'address_line2',
								'city',
								'region',
								'postal_code',
								'country',
								'company_name',
								'company_phone',
								'company_address_line1',
								'company_address_line2',
								'company_city',
								'company_region',
								'company_postal_code',
								'company_country',
								'company_sic_code',
								'company_naics_code',
								'company_blacklisted',
								'company_annual_revenue',
								'company_currency',
								'company_num_employees',
								'primary_phone_fallback',
							])
							.or(z.string()),
					)
					.optional(),
			object_mapping_id: z.string().max(1500),
			sobject_type: z
				.union([
					z.string().max(1500),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
		})
		.loose(),
);

const Input333 = z
	.object({
		query: z
			.object({
				campaign_id: z.string().optional(),
			})
			.strict()
			.optional(),
		body: z
			.object({
				campaign_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				custom_mapping: z.object({}).strict().optional(),
				lead_mapping: z.object({}).strict().optional(),
				sobject_type: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output333 = z
	.object({
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		custom_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(z.string(), z.string())
				.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		lead_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(
					z.string(),
					z
						.enum([
							'do_not_import',
							'first_name',
							'last_name',
							'job_title',
							'industry',
							'role',
							'department',
							'external_id',
							'timezone',
							'lang',
							'primary_phone',
							'secondary_phone',
							'primary_email',
							'secondary_email',
							'address_name',
							'address_line1',
							'address_line2',
							'city',
							'region',
							'postal_code',
							'country',
							'company_name',
							'company_phone',
							'company_address_line1',
							'company_address_line2',
							'company_city',
							'company_region',
							'company_postal_code',
							'company_country',
							'company_sic_code',
							'company_naics_code',
							'company_blacklisted',
							'company_annual_revenue',
							'company_currency',
							'company_num_employees',
							'primary_phone_fallback',
						])
						.or(z.string()),
				)
				.optional(),
		object_mapping_id: z.string().max(1500),
		sobject_type: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input334 = z
	.object({
		path: z
			.object({
				import_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				action: z.enum(['start']).optional(),
				campaign_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				listview_id: z
					.union([
						z.string().max(18),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				object_mapping_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				sobject_type: z
					.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
					.optional(),
				strategy: z.enum(['skip', 'merge']).optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output334 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		import_id: z.string().max(1500),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		listview_id: z
			.union([
				z.string().max(18),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		object_mapping_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sobject_type: z
			.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
			.or(z.string())
			.optional(),
		state: z
			.enum(['pending', 'active', 'complete', 'error'])
			.or(z.string())
			.optional(),
		strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
	})
	.loose();

const Input335 = z
	.object({
		path: z
			.object({
				object_mapping_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output335 = z.object({}).loose();

const Input336 = z
	.object({
		path: z
			.object({
				import_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output336 = z
	.object({
		author_dp_key: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		author_id: z.string().optional(),
		author_key: z.string().optional(),
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		import_id: z.string().max(1500),
		import_results: z
			.object({
				collisions: dialpadInteger(z.number().int().min(0)).optional(),
				created: dialpadInteger(z.number().int().min(0)).optional(),
				duplicates: dialpadInteger(z.number().int().min(0)).optional(),
				failed_batches: dialpadInteger(z.number().int().min(0)).optional(),
				skipped: dialpadInteger(z.number().int().min(0)).optional(),
				total: dialpadInteger(z.number().int().min(0)).optional(),
				updated: dialpadInteger(z.number().int().min(0)).optional(),
			})
			.loose()
			.optional(),
		key: z.string(),
		listview_id: z
			.union([
				z.string().max(18),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		object_mapping_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sobject_type: z
			.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
			.or(z.string())
			.optional(),
		state: z
			.enum(['pending', 'active', 'complete', 'error'])
			.or(z.string())
			.optional(),
		strategy: z.enum(['skip', 'merge']).or(z.string()).optional(),
	})
	.loose();

const Input337 = z
	.object({
		path: z
			.object({
				object_mapping_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output337 = z
	.object({
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		custom_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(z.string(), z.string())
				.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		lead_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(
					z.string(),
					z
						.enum([
							'do_not_import',
							'first_name',
							'last_name',
							'job_title',
							'industry',
							'role',
							'department',
							'external_id',
							'timezone',
							'lang',
							'primary_phone',
							'secondary_phone',
							'primary_email',
							'secondary_email',
							'address_name',
							'address_line1',
							'address_line2',
							'city',
							'region',
							'postal_code',
							'country',
							'company_name',
							'company_phone',
							'company_address_line1',
							'company_address_line2',
							'company_city',
							'company_region',
							'company_postal_code',
							'company_country',
							'company_sic_code',
							'company_naics_code',
							'company_blacklisted',
							'company_annual_revenue',
							'company_currency',
							'company_num_employees',
							'primary_phone_fallback',
						])
						.or(z.string()),
				)
				.optional(),
		object_mapping_id: z.string().max(1500),
		sobject_type: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input338 = z
	.object({
		path: z
			.object({
				sfdc_id: z.string(),
			})
			.strict(),
		query: z
			.object({
				action: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output338 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		count: z
			.union([
				dialpadInteger(z.number().int()),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		creator_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		date_updated_count: dialpadInteger(z.number().int()).optional(),
		date_updated_count_iso: z.string().optional(),
		developer_name: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		id: z.string(),
		key: z.string(),
		listview_id: z.string().max(18),
		name: z.string().max(1500),
		order_by: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		query: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		sobject_type: z
			.enum(['Lead', 'Contact', 'Opportunity', 'Account'])
			.or(z.string()),
		where_clause: z
			.union([
				z.string(),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
	})
	.loose();

const Input339 = z
	.object({
		path: z
			.object({
				object_mapping_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				campaign_id: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
				custom_mapping: z.object({}).strict().optional(),
				lead_mapping: z.object({}).strict().optional(),
				sobject_type: z
					.union([
						z.string().max(1500),
						/* unknown because the official OpenAPI schema is not documented for this value. */ z
							.unknown()
							.nullable(),
					])
					.optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output339 = z
	.object({
		campaign_id: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		company_id: dialpadInteger(z.number().int()),
		custom_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(z.string(), z.string())
				.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		id: z.string(),
		key: z.string(),
		lead_mapping:
			/* OpenAPI documents arbitrary fields on this response object. */ z
				.record(
					z.string(),
					z
						.enum([
							'do_not_import',
							'first_name',
							'last_name',
							'job_title',
							'industry',
							'role',
							'department',
							'external_id',
							'timezone',
							'lang',
							'primary_phone',
							'secondary_phone',
							'primary_email',
							'secondary_email',
							'address_name',
							'address_line1',
							'address_line2',
							'city',
							'region',
							'postal_code',
							'country',
							'company_name',
							'company_phone',
							'company_address_line1',
							'company_address_line2',
							'company_city',
							'company_region',
							'company_postal_code',
							'company_country',
							'company_sic_code',
							'company_naics_code',
							'company_blacklisted',
							'company_annual_revenue',
							'company_currency',
							'company_num_employees',
							'primary_phone_fallback',
						])
						.or(z.string()),
				)
				.optional(),
		object_mapping_id: z.string().max(1500),
		sobject_type: z
			.union([
				z.string().max(1500),
				/* unknown because the official OpenAPI schema is not documented for this value. */ z
					.unknown()
					.nullable(),
			])
			.optional(),
		tags: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
	})
	.loose();

const Input340 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				flow_id: z.string().optional(),
				campaign_id: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output340 = z.array(
	z
		.object({
			company_id: dialpadInteger(z.number().int()),
			conditions: z
				.array(
					z
						.object({
							action: z
								.enum(['complete', 'next', 'retry', 'flow', 'drop_vm'])
								.or(z.string()),
							config: z
								.object({
									custom_ivr_details_id:
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
											.unknown()
											.optional(),
									delay:
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
											.unknown()
											.optional(),
									flow_id:
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
											.unknown()
											.optional(),
									max_attempts:
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
											.unknown()
											.optional(),
								})
								.loose()
								.optional(),
							states: z
								.array(
									z.union([
										z
											.enum([
												'call:powerdialer_no_available_agent',
												'call:human_agent',
												'call:ai_agent',
												'call:outbound_connected',
												'call:powerdialer_vm_drop',
												'call:machine_detected',
												'call:powerdialer_call',
												'call:active',
												'call:outbound',
												'call:cancelled',
												'call:inbound',
												'call:missed',
												'call:abandoned',
												'call:user_initiated',
											])
											.or(z.string()),
										z
											.enum([
												'sms:accepted',
												'sms:invalid_destination',
												'sms:invalid_source',
												'sms:no_route',
												'sms:rejected_spam',
												'sms:internal_error',
												'sms:rejected',
												'sms:not_supported',
												'sms:time_out',
												'sms:error',
												'sms:unknown',
												'sms:forbidden',
												'sms:owner_no_international_messaging',
												'sms:unregistered_a2p_not_allowed',
												'sms:owner_not_enough_sms_credits',
												'sms:owner_not_enough_credits',
												'sms:messaging_disabled',
												'sms:owner_free_user',
												'sms:contact_missing_number',
												'sms:contact_is_room',
												'sms:contact_is_shared_line',
												'sms:staff_contact',
												'sms:company_affinity',
												'sms:not_in_free_company',
												'sms:invalid_number',
											])
											.or(z.string()),
									]),
								)
								.optional(),
						})
						.loose(),
				)
				.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			flow_ids: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			id: z.string(),
			key: z.string(),
			parent_id: z.string().optional(),
			parent_key: z.string().optional(),
			rule_id: z.string().max(1500),
			settings: z
				.union([
					z
						.object({
							phone_field: z.string().optional(),
							text: z.string(),
						})
						.loose(),
					z
						.object({
							ai_agent_settings: z
								.object({
									agent_id:
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
											.unknown()
											.optional(),
									provider_name:
										/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
											.unknown()
											.optional(),
								})
								.loose()
								.optional(),
							phone_field: z.string().optional(),
						})
						.loose(),
				])
				.optional(),
			type: z.enum(['call', 'sms']).or(z.string()),
		})
		.loose(),
);

const Input341 = z
	.object({
		body: z
			.object({
				campaign_id: z.string().optional(),
				conditions: z
					.array(
						z
							.object({
								action: z.enum([
									'complete',
									'next',
									'retry',
									'flow',
									'drop_vm',
								]),
								config: z
									.object({
										custom_ivr_details_id:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										delay:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										flow_id:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										max_attempts:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
									})
									.strict()
									.optional(),
								states: z
									.array(
										z.union([
											z.enum([
												'call:powerdialer_no_available_agent',
												'call:human_agent',
												'call:ai_agent',
												'call:outbound_connected',
												'call:powerdialer_vm_drop',
												'call:machine_detected',
												'call:powerdialer_call',
												'call:active',
												'call:outbound',
												'call:cancelled',
												'call:inbound',
												'call:missed',
												'call:abandoned',
												'call:user_initiated',
											]),
											z.enum([
												'sms:accepted',
												'sms:invalid_destination',
												'sms:invalid_source',
												'sms:no_route',
												'sms:rejected_spam',
												'sms:internal_error',
												'sms:rejected',
												'sms:not_supported',
												'sms:time_out',
												'sms:error',
												'sms:unknown',
												'sms:forbidden',
												'sms:owner_no_international_messaging',
												'sms:unregistered_a2p_not_allowed',
												'sms:owner_not_enough_sms_credits',
												'sms:owner_not_enough_credits',
												'sms:messaging_disabled',
												'sms:owner_free_user',
												'sms:contact_missing_number',
												'sms:contact_is_room',
												'sms:contact_is_shared_line',
												'sms:staff_contact',
												'sms:company_affinity',
												'sms:not_in_free_company',
												'sms:invalid_number',
											]),
										]),
									)
									.optional(),
							})
							.strict(),
					)
					.optional(),
				settings: z
					.union([
						z
							.object({
								phone_field: z.string().optional(),
								text: z.string(),
							})
							.strict(),
						z
							.object({
								ai_agent_settings: z
									.object({
										agent_id:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										provider_name:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
									})
									.strict()
									.optional(),
								phone_field: z.string().optional(),
							})
							.strict(),
					])
					.optional(),
				type: z.enum(['call', 'sms']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output341 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		conditions: z
			.array(
				z
					.object({
						action: z
							.enum(['complete', 'next', 'retry', 'flow', 'drop_vm'])
							.or(z.string()),
						config: z
							.object({
								custom_ivr_details_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								delay:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								flow_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								max_attempts:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.loose()
							.optional(),
						states: z
							.array(
								z.union([
									z
										.enum([
											'call:powerdialer_no_available_agent',
											'call:human_agent',
											'call:ai_agent',
											'call:outbound_connected',
											'call:powerdialer_vm_drop',
											'call:machine_detected',
											'call:powerdialer_call',
											'call:active',
											'call:outbound',
											'call:cancelled',
											'call:inbound',
											'call:missed',
											'call:abandoned',
											'call:user_initiated',
										])
										.or(z.string()),
									z
										.enum([
											'sms:accepted',
											'sms:invalid_destination',
											'sms:invalid_source',
											'sms:no_route',
											'sms:rejected_spam',
											'sms:internal_error',
											'sms:rejected',
											'sms:not_supported',
											'sms:time_out',
											'sms:error',
											'sms:unknown',
											'sms:forbidden',
											'sms:owner_no_international_messaging',
											'sms:unregistered_a2p_not_allowed',
											'sms:owner_not_enough_sms_credits',
											'sms:owner_not_enough_credits',
											'sms:messaging_disabled',
											'sms:owner_free_user',
											'sms:contact_missing_number',
											'sms:contact_is_room',
											'sms:contact_is_shared_line',
											'sms:staff_contact',
											'sms:company_affinity',
											'sms:not_in_free_company',
											'sms:invalid_number',
										])
										.or(z.string()),
								]),
							)
							.optional(),
					})
					.loose(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		flow_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		key: z.string(),
		parent_id: z.string().optional(),
		parent_key: z.string().optional(),
		rule_id: z.string().max(1500),
		settings: z
			.union([
				z
					.object({
						phone_field: z.string().optional(),
						text: z.string(),
					})
					.loose(),
				z
					.object({
						ai_agent_settings: z
							.object({
								agent_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								provider_name:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.loose()
							.optional(),
						phone_field: z.string().optional(),
					})
					.loose(),
			])
			.optional(),
		type: z.enum(['call', 'sms']).or(z.string()),
	})
	.loose();

const Input342 = z
	.object({
		query: z
			.object({
				count: z.boolean().optional(),
				keys_only: z.boolean().optional(),
				total: z.boolean().optional(),
				cursor: z.string().optional(),
				offset: dialpadInteger(z.number().int()).optional(),
				limit: dialpadInteger(z.number().int()).optional(),
				filters: z.string().optional(),
				search: z.string().optional(),
				order: z.string().optional(),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output342 = z.array(
	z
		.object({
			company_id: dialpadInteger(z.number().int()),
			consent: z
				.enum(['implied', 'consent', 'written_consent', 'revoked'])
				.or(z.string())
				.optional(),
			date_created: dialpadInteger(z.number().int()).optional(),
			date_created_iso: z.string().optional(),
			date_dnc_expires: dialpadInteger(z.number().int()).optional(),
			date_dnc_expires_iso: z.string().optional(),
			date_dnc_opt_out: dialpadInteger(z.number().int()).optional(),
			date_dnc_opt_out_iso: z.string().optional(),
			date_dnt_expires: dialpadInteger(z.number().int()).optional(),
			date_dnt_expires_iso: z.string().optional(),
			date_dnt_opt_out: dialpadInteger(z.number().int()).optional(),
			date_dnt_opt_out_iso: z.string().optional(),
			date_modified: dialpadInteger(z.number().int()).optional(),
			date_modified_iso: z.string().optional(),
			dnc: z
				.union([
					z.boolean(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			dnc_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
			dnt: z
				.union([
					z.boolean(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			dnt_scope: z.enum(['powerdialer', 'ever']).or(z.string()).optional(),
			e164: z.string().max(20),
			formatted_phone: z
				.union([
					z.string().max(20),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			id: z.string(),
			is_dnc_expired: z.boolean().optional(),
			is_dnt_expired: z.boolean().optional(),
			key: z.string(),
			label: z
				.enum(['mobile', 'work', 'home', 'other'])
				.or(z.string())
				.optional(),
			last_author_dp_key: z
				.union([
					z.string(),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			last_author_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			last_csv_id: z
				.union([
					z.string().max(64),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			last_source: z
				.enum(['api', 'csv', 'dp_contact'])
				.or(z.string())
				.optional(),
			state: z.enum(['active', 'deleted']).or(z.string()).optional(),
			tags: z
				.array(
					/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
				)
				.optional(),
			timezone: z
				.union([
					z.string().max(36),
					/* unknown because the official OpenAPI schema is not documented for this value. */ z
						.unknown()
						.nullable(),
				])
				.optional(),
			validity: z
				.enum([
					'good',
					'unverified',
					'disconnected',
					'fax',
					'spam',
					'wrong_number',
				])
				.or(z.string())
				.optional(),
		})
		.loose(),
);

const Input343 = z
	.object({
		path: z
			.object({
				rule_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output343 =
	/* unknown because this operation has no documented response schema. */ z.unknown();

const Input344 = z
	.object({
		path: z
			.object({
				rule_id: z.string(),
			})
			.strict(),
		body: z
			.object({
				conditions: z
					.array(
						z
							.object({
								action: z.enum([
									'complete',
									'next',
									'retry',
									'flow',
									'drop_vm',
								]),
								config: z
									.object({
										custom_ivr_details_id:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										delay:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										flow_id:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										max_attempts:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
									})
									.strict()
									.optional(),
								states: z
									.array(
										z.union([
											z.enum([
												'call:powerdialer_no_available_agent',
												'call:human_agent',
												'call:ai_agent',
												'call:outbound_connected',
												'call:powerdialer_vm_drop',
												'call:machine_detected',
												'call:powerdialer_call',
												'call:active',
												'call:outbound',
												'call:cancelled',
												'call:inbound',
												'call:missed',
												'call:abandoned',
												'call:user_initiated',
											]),
											z.enum([
												'sms:accepted',
												'sms:invalid_destination',
												'sms:invalid_source',
												'sms:no_route',
												'sms:rejected_spam',
												'sms:internal_error',
												'sms:rejected',
												'sms:not_supported',
												'sms:time_out',
												'sms:error',
												'sms:unknown',
												'sms:forbidden',
												'sms:owner_no_international_messaging',
												'sms:unregistered_a2p_not_allowed',
												'sms:owner_not_enough_sms_credits',
												'sms:owner_not_enough_credits',
												'sms:messaging_disabled',
												'sms:owner_free_user',
												'sms:contact_missing_number',
												'sms:contact_is_room',
												'sms:contact_is_shared_line',
												'sms:staff_contact',
												'sms:company_affinity',
												'sms:not_in_free_company',
												'sms:invalid_number',
											]),
										]),
									)
									.optional(),
							})
							.strict(),
					)
					.optional(),
				settings: z
					.union([
						z
							.object({
								phone_field: z.string().optional(),
								text: z.string(),
							})
							.strict(),
						z
							.object({
								ai_agent_settings: z
									.object({
										agent_id:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
										provider_name:
											/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
												.unknown()
												.optional(),
									})
									.strict()
									.optional(),
								phone_field: z.string().optional(),
							})
							.strict(),
					])
					.optional(),
				type: z.enum(['call', 'sms']),
			})
			.strict()
			.optional(),
	})
	.strict();

const Output344 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		conditions: z
			.array(
				z
					.object({
						action: z
							.enum(['complete', 'next', 'retry', 'flow', 'drop_vm'])
							.or(z.string()),
						config: z
							.object({
								custom_ivr_details_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								delay:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								flow_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								max_attempts:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.loose()
							.optional(),
						states: z
							.array(
								z.union([
									z
										.enum([
											'call:powerdialer_no_available_agent',
											'call:human_agent',
											'call:ai_agent',
											'call:outbound_connected',
											'call:powerdialer_vm_drop',
											'call:machine_detected',
											'call:powerdialer_call',
											'call:active',
											'call:outbound',
											'call:cancelled',
											'call:inbound',
											'call:missed',
											'call:abandoned',
											'call:user_initiated',
										])
										.or(z.string()),
									z
										.enum([
											'sms:accepted',
											'sms:invalid_destination',
											'sms:invalid_source',
											'sms:no_route',
											'sms:rejected_spam',
											'sms:internal_error',
											'sms:rejected',
											'sms:not_supported',
											'sms:time_out',
											'sms:error',
											'sms:unknown',
											'sms:forbidden',
											'sms:owner_no_international_messaging',
											'sms:unregistered_a2p_not_allowed',
											'sms:owner_not_enough_sms_credits',
											'sms:owner_not_enough_credits',
											'sms:messaging_disabled',
											'sms:owner_free_user',
											'sms:contact_missing_number',
											'sms:contact_is_room',
											'sms:contact_is_shared_line',
											'sms:staff_contact',
											'sms:company_affinity',
											'sms:not_in_free_company',
											'sms:invalid_number',
										])
										.or(z.string()),
								]),
							)
							.optional(),
					})
					.loose(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		flow_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		key: z.string(),
		parent_id: z.string().optional(),
		parent_key: z.string().optional(),
		rule_id: z.string().max(1500),
		settings: z
			.union([
				z
					.object({
						phone_field: z.string().optional(),
						text: z.string(),
					})
					.loose(),
				z
					.object({
						ai_agent_settings: z
							.object({
								agent_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								provider_name:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.loose()
							.optional(),
						phone_field: z.string().optional(),
					})
					.loose(),
			])
			.optional(),
		type: z.enum(['call', 'sms']).or(z.string()),
	})
	.loose();

const Input345 = z
	.object({
		path: z
			.object({
				rule_id: z.string(),
			})
			.strict(),
	})
	.strict();

const Output345 = z
	.object({
		company_id: dialpadInteger(z.number().int()),
		conditions: z
			.array(
				z
					.object({
						action: z
							.enum(['complete', 'next', 'retry', 'flow', 'drop_vm'])
							.or(z.string()),
						config: z
							.object({
								custom_ivr_details_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								delay:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								flow_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								max_attempts:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.loose()
							.optional(),
						states: z
							.array(
								z.union([
									z
										.enum([
											'call:powerdialer_no_available_agent',
											'call:human_agent',
											'call:ai_agent',
											'call:outbound_connected',
											'call:powerdialer_vm_drop',
											'call:machine_detected',
											'call:powerdialer_call',
											'call:active',
											'call:outbound',
											'call:cancelled',
											'call:inbound',
											'call:missed',
											'call:abandoned',
											'call:user_initiated',
										])
										.or(z.string()),
									z
										.enum([
											'sms:accepted',
											'sms:invalid_destination',
											'sms:invalid_source',
											'sms:no_route',
											'sms:rejected_spam',
											'sms:internal_error',
											'sms:rejected',
											'sms:not_supported',
											'sms:time_out',
											'sms:error',
											'sms:unknown',
											'sms:forbidden',
											'sms:owner_no_international_messaging',
											'sms:unregistered_a2p_not_allowed',
											'sms:owner_not_enough_sms_credits',
											'sms:owner_not_enough_credits',
											'sms:messaging_disabled',
											'sms:owner_free_user',
											'sms:contact_missing_number',
											'sms:contact_is_room',
											'sms:contact_is_shared_line',
											'sms:staff_contact',
											'sms:company_affinity',
											'sms:not_in_free_company',
											'sms:invalid_number',
										])
										.or(z.string()),
								]),
							)
							.optional(),
					})
					.loose(),
			)
			.optional(),
		date_created: dialpadInteger(z.number().int()).optional(),
		date_created_iso: z.string().optional(),
		date_modified: dialpadInteger(z.number().int()).optional(),
		date_modified_iso: z.string().optional(),
		flow_ids: z
			.array(
				/* unknown because the official OpenAPI schema is not documented for this value. */ z.unknown(),
			)
			.optional(),
		id: z.string(),
		key: z.string(),
		parent_id: z.string().optional(),
		parent_key: z.string().optional(),
		rule_id: z.string().max(1500),
		settings: z
			.union([
				z
					.object({
						phone_field: z.string().optional(),
						text: z.string(),
					})
					.loose(),
				z
					.object({
						ai_agent_settings: z
							.object({
								agent_id:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
								provider_name:
									/* unknown because a recursive OpenAPI schema cannot be expanded safely. */ z
										.unknown()
										.optional(),
							})
							.loose()
							.optional(),
						phone_field: z.string().optional(),
					})
					.loose(),
			])
			.optional(),
		type: z.enum(['call', 'sms']).or(z.string()),
	})
	.loose();

const Input346 = z
	.object({
		query: z
			.object({
				t: z.enum(['user_voiceline']),
				d: z.string().regex(new RegExp('^\\d{4}-\\d{2}-\\d{2}$')),
			})
			.strict(),
	})
	.strict();

const Output346 = z
	.object({
		kind: z.enum(['binary']),
		contentType: z.string(),
		base64: z.string(),
		sizeBytes: z.number().int(),
	})
	.strict();

const RecordingDownloadInput347 = z
	.object({ path: z.object({ recording_id: z.string().min(1) }).strict() })
	.strict();
const RecordingDownloadInput348 = z
	.object({ path: z.object({ recording_id: z.string().min(1) }).strict() })
	.strict();
const RecordingDownloadInput349 = z
	.object({ path: z.object({ share_link_id: z.string().min(1) }).strict() })
	.strict();
const RecordingDownloadOutput = z
	.object({
		kind: z.literal('binary'),
		contentType: z.string().min(1),
		base64: z.string(),
		sizeBytes: z.number().int().min(0),
	})
	.strict();

export const DialpadEndpointInputSchemas = {
	'accesscontrolpolicies.assign': Input0,
	'accesscontrolpolicies.delete': Input1,
	'accesscontrolpolicies.update': Input2,
	'agentgroup.get': Input3,
	'anonymization.requests.get': Input4,
	'accesscontrolpolicies.list': Input5,
	'accesscontrolpolicies.unassign': Input6,
	'accesscontrolpolicies.create': Input7,
	'accesscontrolpolicies.assignments': Input8,
	'anonymization.contacts': Input9,
	'accesscontrolpolicies.get': Input10,
	'app_settings.get': Input11,
	'blockednumbers.get': Input12,
	'available_numbers.list': Input13,
	'blockednumbers.add': Input14,
	'blockednumbers.list': Input15,
	'blockednumbers.remove': Input16,
	'call.assign': Input17,
	'call.get_assigned_operators': Input18,
	'anonymization.callcontent': Input19,
	'call.get_ai_recap': Input20,
	'call.participants.add': Input21,
	'call.list': Input22,
	'call.initiate_ivr_call': Input23,
	'call.unassign_all_call_operators': Input24,
	'call.transfer_call': Input25,
	'call.get_call_info': Input26,
	'call.unassign_operator': Input27,
	'call.unpark': Input28,
	'call.initiate': Input29,
	'call.add_labels': Input30,
	'call.hangup': Input31,
	'callbacks.list': Input32,
	'callback.validate': Input33,
	'callcenters.listall': Input34,
	'callcenters.get': Input35,
	'callcenters.update': Input36,
	'callcenters.create': Input37,
	'callback.enqueue': Input38,
	'callcenters.delete': Input39,
	'callcenters.get_status': Input40,
	'callcenters.operators.update_duty_status': Input41,
	'callcenters.operators.get_skill_level': Input42,
	'callcenters.operators.get_duty_status': Input43,
	'callcenters.operators.update_skill_level': Input44,
	'callcenters.operators.add': Input45,
	'callcenters.queue.list': Input46,
	'callcenters.operators.delete': Input47,
	'call_labels.list': Input48,
	'call_review_share_link.get': Input49,
	'call_review_share_link.create': Input50,
	'call_review_share_link.delete': Input51,
	'callrouters.list': Input52,
	'callcenters.operators.list': Input53,
	'callrouters.delete': Input54,
	'callrouters.create': Input55,
	'callrouters.get': Input56,
	'call_review_share_link.update': Input57,
	'callrouters.update': Input58,
	'numbers.assign_call_router_number.post': Input59,
	'channels.delete': Input60,
	'channels.get': Input61,
	'channels.members.list': Input62,
	'channels.list': Input63,
	'coaching_team.get': Input64,
	'coaching_team.members.get': Input65,
	'channels.create': Input66,
	'channels.members.delete': Input67,
	'channels.members.add': Input68,
	'coaching_team.listall': Input69,
	'company.get': Input70,
	'company.sms_opt_out': Input71,
	'company.update_settings': Input72,
	'coaching_team.members.add': Input73,
	'company.get_ai_settings': Input74,
	'company.update': Input75,
	'company.update_ai_settings': Input76,
	'contacts.delete': Input77,
	'contacts.update': Input78,
	'contacts.list': Input79,
	'contacts.get': Input80,
	'contacts.create': Input81,
	'contacts.create_with_uid': Input82,
	'ivr.delete': Input83,
	'contacts.search': Input84,
	'ivr.assign': Input85,
	'custom_ivrs.list': Input86,
	'ivr.update_details': Input87,
	'departments.delete': Input88,
	'ivr.create': Input89,
	'departments.update': Input90,
	'departments.create': Input91,
	'departments.listall': Input92,
	'departments.get': Input93,
	'departments.operators.delete': Input94,
	'dispositions.delete': Input95,
	'digital.sessions.list': Input96,
	'dispositions.update': Input97,
	'dispositions.get': Input98,
	'departments.operators.list': Input99,
	'dispositions.list': Input100,
	'dispositions.create': Input101,
	'departments.operators.add': Input102,
	'faxline.assign': Input103,
	'bulk_messages.get': Input104,
	'fax.send': Input105,
	'bulk_messages.send': Input106,
	'scheduled_messages.create': Input107,
	'scheduled_messages.delete': Input108,
	'bulk_messages.update': Input109,
	'bulk_messages.list': Input110,
	'scheduled_messages.list': Input111,
	'numbers.unassign': Input112,
	'scheduled_messages.get': Input113,
	'numbers.assign': Input114,
	'scheduled_messages.send_now': Input115,
	'numbers.list': Input116,
	'numbers.auto_assign': Input117,
	'numbers.swap': Input118,
	'number_tags.update': Input119,
	'scheduled_messages.update': Input120,
	'numbers.get': Input121,
	'coaching_team.list': Input122,
	'office_plan.get': Input123,
	'phone_number.format': Input124,
	'departments.list': Input125,
	'numbers.office_unassign_number.post': Input126,
	'callcenters.list': Input127,
	'numbers.assign_office_number.post': Input128,
	'available_licenses.list': Input129,
	'offices.e911.get': Input130,
	'offices.offdutystatuses.get': Input131,
	'offices.e911.update': Input132,
	'offices.update': Input133,
	'offices.get': Input134,
	'offices.primary.get': Input135,
	'offices.list': Input136,
	'offices.operators.delete': Input137,
	'offices.create': Input138,
	'offices.operators.get': Input139,
	'offices.operators.post': Input140,
	'recording_share_link.create': Input141,
	'recording_share_link.get': Input142,
	'numbers.assign_room_number.post': Input143,
	'numbers.room_unassign_number.post': Input144,
	'rooms.delete': Input145,
	'rooms.get': Input146,
	'recording_share_link.delete': Input147,
	'rooms.post': Input148,
	'recording_share_link.update': Input149,
	'deskphones.rooms.create_international_pin': Input150,
	'rooms.list': Input151,
	'deskphones.rooms.get': Input152,
	'rooms.patch': Input153,
	'deskphones.rooms.list': Input154,
	'deskphones.rooms.delete': Input155,
	'schedule_reports.update': Input156,
	'schedule_reports.create': Input157,
	'schedule_reports.get': Input158,
	'scorecards.export.get': Input159,
	'scorecards.export.create': Input160,
	'scorecards.get': Input161,
	'scorecards.list': Input162,
	'schedule_reports.delete': Input163,
	'schedule_reports.list': Input164,
	'stats.export.create': Input165,
	'stats.export.get': Input166,
	'sms.send': Input167,
	'users.initiate_call': Input168,
	'users.toggle_call_vi': Input169,
	'userdevices.get': Input170,
	'transcripts.get': Input171,
	'userdevices.list': Input172,
	'users.toggle_call_recording': Input173,
	'transcripts.get_url': Input174,
	'users.set_caller_id': Input175,
	'deskphones.users.delete': Input176,
	'caller_id.users.get': Input177,
	'deskphones.users.get': Input178,
	'users.e911.update': Input179,
	'users.toggle_dnd': Input180,
	'users.unassign_number': Input181,
	'users.assign_number': Input182,
	'users.list_personas': Input183,
	'users.e911.get': Input184,
	'deskphones.users.list': Input185,
	'screen_pop.initiate': Input186,
	'users.delete': Input187,
	'users.get': Input188,
	'users.list': Input189,
	'users.update': Input190,
	'users.create': Input191,
	'users.move_office': Input192,
	'users.create_batch': Input193,
	'users.update_status': Input194,
	'search.users': Input195,
	'websockets.get': Input196,
	'websockets.list': Input197,
	'websockets.create': Input198,
	'meetings.conference-meetings.list': Input199,
	'meetings.conference-rooms.list': Input200,
	'websockets.update': Input201,
	'meetings.meetings.get': Input202,
	'websockets.delete': Input203,
	'meetings.meetings.update': Input204,
	'meetings.meetings.delete': Input205,
	'meetings.meetings.create': Input206,
	'meetings.meetings.room.create': Input207,
	'wfm.wfm-metrics-activity.get': Input208,
	'wfm.wfm-metrics-agent.get': Input209,
	'meetings.meetings.list': Input210,
	'powerdialer.getModelsByKeys': Input211,
	'powerdialer.getAblyToken': Input212,
	'powerdialer.getContact': Input213,
	'powerdialer.getModelsByKeysOfKind': Input214,
	'powerdialer.deleteModelsByKeysOfKind': Input215,
	'powerdialer.createCustomProperties': Input216,
	'powerdialer.getCustomProperties': Input217,
	'powerdialer.getCustomProperty': Input218,
	'powerdialer.updateCustomProperty': Input219,
	'powerdialer.getDialpadOAuthService': Input220,
	'powerdialer.updateGlobalSettings': Input221,
	'powerdialer.deleteCustomProperty': Input222,
	'powerdialer.getGlobalSettings': Input223,
	'powerdialer.getEventLogs': Input224,
	'powerdialer.getJobs': Input225,
	'powerdialer.getJob': Input226,
	'powerdialer.getApiKey': Input227,
	'powerdialer.getApiKeys': Input228,
	'powerdialer.getOperator': Input229,
	'powerdialer.getLogin': Input230,
	'powerdialer.deleteApiKey': Input231,
	'powerdialer.updateApiKey': Input232,
	'powerdialer.postLogin': Input233,
	'powerdialer.createApiKey': Input234,
	'powerdialer.createServiceAccount': Input235,
	'powerdialer.getServiceAccount': Input236,
	'powerdialer.updateServiceAccount': Input237,
	'powerdialer.deleteServiceAccount': Input238,
	'powerdialer.getSmsForTarget': Input239,
	'powerdialer.smsItem': Input240,
	'powerdialer.getServiceAccounts': Input241,
	'powerdialer.getCurrentUser': Input242,
	'powerdialer.getWorker': Input243,
	'powerdialer.updateWorker': Input244,
	'powerdialer.getWorkers': Input245,
	'powerdialer.createAudience': Input246,
	'powerdialer.getAudiences': Input247,
	'powerdialer.updateAudience': Input248,
	'powerdialer.getAudience': Input249,
	'powerdialer.createBot': Input250,
	'powerdialer.duplicateAudience': Input251,
	'powerdialer.getBots': Input252,
	'powerdialer.updateBot': Input253,
	'powerdialer.deleteAudience': Input254,
	'powerdialer.deleteBot': Input255,
	'powerdialer.getBot': Input256,
	'powerdialer.getBotDialogs': Input257,
	'powerdialer.createBotDialog': Input258,
	'powerdialer.deleteBotDialog': Input259,
	'powerdialer.getBotMessages': Input260,
	'powerdialer.createBotMessage': Input261,
	'powerdialer.deleteBotMessage': Input262,
	'powerdialer.getBotMessage': Input263,
	'powerdialer.updateBotDialog': Input264,
	'powerdialer.getCampaigns': Input265,
	'powerdialer.searchCampaigns': Input266,
	'powerdialer.deleteCampaign': Input267,
	'powerdialer.createCampaign': Input268,
	'powerdialer.getCampaign': Input269,
	'powerdialer.updateCampaign': Input270,
	'powerdialer.duplicateCampaign': Input271,
	'powerdialer.getCampaignResultExportUrl': Input272,
	'powerdialer.createCampaignGroup': Input273,
	'powerdialer.deleteCampaignGroup': Input274,
	'powerdialer.getCampaignGroup': Input275,
	'powerdialer.getCampaignGroups': Input276,
	'powerdialer.startCampaignResultExport': Input277,
	'powerdialer.getCampaignSettings': Input278,
	'powerdialer.updateCampaignGroup': Input279,
	'powerdialer.editCampaignSettings': Input280,
	'powerdialer.deleteCsv': Input281,
	'powerdialer.getCsvPresignedUrl': Input282,
	'powerdialer.updateCsv': Input283,
	'powerdialer.getVarsInfo': Input284,
	'powerdialer.getCsv': Input285,
	'powerdialer.getPhoneCsvs': Input286,
	'powerdialer.getCsvs': Input287,
	'powerdialer.getPhoneCsv': Input288,
	'powerdialer.updatePhoneCsv': Input289,
	'powerdialer.deletePhoneCsv': Input290,
	'powerdialer.createLeadList': Input291,
	'powerdialer.getBotDialog': Input292,
	'powerdialer.getListItems': Input293,
	'powerdialer.deleteLeadListItem': Input294,
	'powerdialer.getListList': Input295,
	'powerdialer.getLeadListItem': Input296,
	'powerdialer.deleteLeadList': Input297,
	'powerdialer.duplicateLeadList': Input298,
	'powerdialer.getLeadLists': Input299,
	'powerdialer.updateLeadList': Input300,
	'powerdialer.getListView': Input301,
	'powerdialer.createStaticList': Input302,
	'powerdialer.getStaticLists': Input303,
	'powerdialer.getStaticList': Input304,
	'powerdialer.deleteStaticList': Input305,
	'powerdialer.duplicateStaticList': Input306,
	'powerdialer.createLeads': Input307,
	'powerdialer.queryLeads': Input308,
	'powerdialer.getLead': Input309,
	'powerdialer.updateLead': Input310,
	'powerdialer.getLeadCompany': Input311,
	'powerdialer.getLeadCompanies': Input312,
	'powerdialer.updateStaticList': Input313,
	'powerdialer.getLeads': Input314,
	'powerdialer.startLeadExport': Input315,
	'powerdialer.getLeadListView': Input316,
	'powerdialer.bulkUpdateLeadItems': Input317,
	'powerdialer.getLeadItem': Input318,
	'powerdialer.getLeadItems': Input319,
	'powerdialer.getLeadListViewById': Input320,
	'powerdialer.getLeadExport': Input321,
	'powerdialer.createPhone': Input322,
	'powerdialer.getPhone': Input323,
	'powerdialer.updateLeadItem': Input324,
	'powerdialer.deletePhone': Input325,
	'powerdialer.getSalesforceObjectListViews': Input326,
	'powerdialer.updatePhone': Input327,
	'powerdialer.getSalesforceObjectFields': Input328,
	'powerdialer.getSalesforceListViewById': Input329,
	'powerdialer.createSalesforceListViewImport': Input330,
	'powerdialer.getSalesforceListViewImports': Input331,
	'powerdialer.getSalesforceObjectMappings': Input332,
	'powerdialer.createSalesforceObjectMapping': Input333,
	'powerdialer.updateSalesforceListViewImport': Input334,
	'powerdialer.deleteSalesforceObjectMapping': Input335,
	'powerdialer.getSalesforceListViewImport': Input336,
	'powerdialer.getSalesforceObjectMapping': Input337,
	'powerdialer.patchSalesforceListView': Input338,
	'powerdialer.updateSalesforceObjectMapping': Input339,
	'powerdialer.getRules': Input340,
	'powerdialer.createRule': Input341,
	'powerdialer.getPhones': Input342,
	'powerdialer.deleteRule': Input343,
	'powerdialer.updateRule': Input344,
	'powerdialer.getRule': Input345,
	'reports.scheduledstats.download': Input346,
	'recordings.call.download': RecordingDownloadInput347,
	'recordings.voicemail.download': RecordingDownloadInput348,
	'recordings.admin_call.download': RecordingDownloadInput349,
} as const;
export const DialpadEndpointOutputSchemas = {
	'accesscontrolpolicies.assign': Output0,
	'accesscontrolpolicies.delete': Output1,
	'accesscontrolpolicies.update': Output2,
	'agentgroup.get': Output3,
	'anonymization.requests.get': Output4,
	'accesscontrolpolicies.list': Output5,
	'accesscontrolpolicies.unassign': Output6,
	'accesscontrolpolicies.create': Output7,
	'accesscontrolpolicies.assignments': Output8,
	'anonymization.contacts': Output9,
	'accesscontrolpolicies.get': Output10,
	'app_settings.get': Output11,
	'blockednumbers.get': Output12,
	'available_numbers.list': Output13,
	'blockednumbers.add': Output14,
	'blockednumbers.list': Output15,
	'blockednumbers.remove': Output16,
	'call.assign': Output17,
	'call.get_assigned_operators': Output18,
	'anonymization.callcontent': Output19,
	'call.get_ai_recap': Output20,
	'call.participants.add': Output21,
	'call.list': Output22,
	'call.initiate_ivr_call': Output23,
	'call.unassign_all_call_operators': Output24,
	'call.transfer_call': Output25,
	'call.get_call_info': Output26,
	'call.unassign_operator': Output27,
	'call.unpark': Output28,
	'call.initiate': Output29,
	'call.add_labels': Output30,
	'call.hangup': Output31,
	'callbacks.list': Output32,
	'callback.validate': Output33,
	'callcenters.listall': Output34,
	'callcenters.get': Output35,
	'callcenters.update': Output36,
	'callcenters.create': Output37,
	'callback.enqueue': Output38,
	'callcenters.delete': Output39,
	'callcenters.get_status': Output40,
	'callcenters.operators.update_duty_status': Output41,
	'callcenters.operators.get_skill_level': Output42,
	'callcenters.operators.get_duty_status': Output43,
	'callcenters.operators.update_skill_level': Output44,
	'callcenters.operators.add': Output45,
	'callcenters.queue.list': Output46,
	'callcenters.operators.delete': Output47,
	'call_labels.list': Output48,
	'call_review_share_link.get': Output49,
	'call_review_share_link.create': Output50,
	'call_review_share_link.delete': Output51,
	'callrouters.list': Output52,
	'callcenters.operators.list': Output53,
	'callrouters.delete': Output54,
	'callrouters.create': Output55,
	'callrouters.get': Output56,
	'call_review_share_link.update': Output57,
	'callrouters.update': Output58,
	'numbers.assign_call_router_number.post': Output59,
	'channels.delete': Output60,
	'channels.get': Output61,
	'channels.members.list': Output62,
	'channels.list': Output63,
	'coaching_team.get': Output64,
	'coaching_team.members.get': Output65,
	'channels.create': Output66,
	'channels.members.delete': Output67,
	'channels.members.add': Output68,
	'coaching_team.listall': Output69,
	'company.get': Output70,
	'company.sms_opt_out': Output71,
	'company.update_settings': Output72,
	'coaching_team.members.add': Output73,
	'company.get_ai_settings': Output74,
	'company.update': Output75,
	'company.update_ai_settings': Output76,
	'contacts.delete': Output77,
	'contacts.update': Output78,
	'contacts.list': Output79,
	'contacts.get': Output80,
	'contacts.create': Output81,
	'contacts.create_with_uid': Output82,
	'ivr.delete': Output83,
	'contacts.search': Output84,
	'ivr.assign': Output85,
	'custom_ivrs.list': Output86,
	'ivr.update_details': Output87,
	'departments.delete': Output88,
	'ivr.create': Output89,
	'departments.update': Output90,
	'departments.create': Output91,
	'departments.listall': Output92,
	'departments.get': Output93,
	'departments.operators.delete': Output94,
	'dispositions.delete': Output95,
	'digital.sessions.list': Output96,
	'dispositions.update': Output97,
	'dispositions.get': Output98,
	'departments.operators.list': Output99,
	'dispositions.list': Output100,
	'dispositions.create': Output101,
	'departments.operators.add': Output102,
	'faxline.assign': Output103,
	'bulk_messages.get': Output104,
	'fax.send': Output105,
	'bulk_messages.send': Output106,
	'scheduled_messages.create': Output107,
	'scheduled_messages.delete': Output108,
	'bulk_messages.update': Output109,
	'bulk_messages.list': Output110,
	'scheduled_messages.list': Output111,
	'numbers.unassign': Output112,
	'scheduled_messages.get': Output113,
	'numbers.assign': Output114,
	'scheduled_messages.send_now': Output115,
	'numbers.list': Output116,
	'numbers.auto_assign': Output117,
	'numbers.swap': Output118,
	'number_tags.update': Output119,
	'scheduled_messages.update': Output120,
	'numbers.get': Output121,
	'coaching_team.list': Output122,
	'office_plan.get': Output123,
	'phone_number.format': Output124,
	'departments.list': Output125,
	'numbers.office_unassign_number.post': Output126,
	'callcenters.list': Output127,
	'numbers.assign_office_number.post': Output128,
	'available_licenses.list': Output129,
	'offices.e911.get': Output130,
	'offices.offdutystatuses.get': Output131,
	'offices.e911.update': Output132,
	'offices.update': Output133,
	'offices.get': Output134,
	'offices.primary.get': Output135,
	'offices.list': Output136,
	'offices.operators.delete': Output137,
	'offices.create': Output138,
	'offices.operators.get': Output139,
	'offices.operators.post': Output140,
	'recording_share_link.create': Output141,
	'recording_share_link.get': Output142,
	'numbers.assign_room_number.post': Output143,
	'numbers.room_unassign_number.post': Output144,
	'rooms.delete': Output145,
	'rooms.get': Output146,
	'recording_share_link.delete': Output147,
	'rooms.post': Output148,
	'recording_share_link.update': Output149,
	'deskphones.rooms.create_international_pin': Output150,
	'rooms.list': Output151,
	'deskphones.rooms.get': Output152,
	'rooms.patch': Output153,
	'deskphones.rooms.list': Output154,
	'deskphones.rooms.delete': Output155,
	'schedule_reports.update': Output156,
	'schedule_reports.create': Output157,
	'schedule_reports.get': Output158,
	'scorecards.export.get': Output159,
	'scorecards.export.create': Output160,
	'scorecards.get': Output161,
	'scorecards.list': Output162,
	'schedule_reports.delete': Output163,
	'schedule_reports.list': Output164,
	'stats.export.create': Output165,
	'stats.export.get': Output166,
	'sms.send': Output167,
	'users.initiate_call': Output168,
	'users.toggle_call_vi': Output169,
	'userdevices.get': Output170,
	'transcripts.get': Output171,
	'userdevices.list': Output172,
	'users.toggle_call_recording': Output173,
	'transcripts.get_url': Output174,
	'users.set_caller_id': Output175,
	'deskphones.users.delete': Output176,
	'caller_id.users.get': Output177,
	'deskphones.users.get': Output178,
	'users.e911.update': Output179,
	'users.toggle_dnd': Output180,
	'users.unassign_number': Output181,
	'users.assign_number': Output182,
	'users.list_personas': Output183,
	'users.e911.get': Output184,
	'deskphones.users.list': Output185,
	'screen_pop.initiate': Output186,
	'users.delete': Output187,
	'users.get': Output188,
	'users.list': Output189,
	'users.update': Output190,
	'users.create': Output191,
	'users.move_office': Output192,
	'users.create_batch': Output193,
	'users.update_status': Output194,
	'search.users': Output195,
	'websockets.get': Output196,
	'websockets.list': Output197,
	'websockets.create': Output198,
	'meetings.conference-meetings.list': Output199,
	'meetings.conference-rooms.list': Output200,
	'websockets.update': Output201,
	'meetings.meetings.get': Output202,
	'websockets.delete': Output203,
	'meetings.meetings.update': Output204,
	'meetings.meetings.delete': Output205,
	'meetings.meetings.create': Output206,
	'meetings.meetings.room.create': Output207,
	'wfm.wfm-metrics-activity.get': Output208,
	'wfm.wfm-metrics-agent.get': Output209,
	'meetings.meetings.list': Output210,
	'powerdialer.getModelsByKeys': Output211,
	'powerdialer.getAblyToken': Output212,
	'powerdialer.getContact': Output213,
	'powerdialer.getModelsByKeysOfKind': Output214,
	'powerdialer.deleteModelsByKeysOfKind': Output215,
	'powerdialer.createCustomProperties': Output216,
	'powerdialer.getCustomProperties': Output217,
	'powerdialer.getCustomProperty': Output218,
	'powerdialer.updateCustomProperty': Output219,
	'powerdialer.getDialpadOAuthService': Output220,
	'powerdialer.updateGlobalSettings': Output221,
	'powerdialer.deleteCustomProperty': Output222,
	'powerdialer.getGlobalSettings': Output223,
	'powerdialer.getEventLogs': Output224,
	'powerdialer.getJobs': Output225,
	'powerdialer.getJob': Output226,
	'powerdialer.getApiKey': Output227,
	'powerdialer.getApiKeys': Output228,
	'powerdialer.getOperator': Output229,
	'powerdialer.getLogin': Output230,
	'powerdialer.deleteApiKey': Output231,
	'powerdialer.updateApiKey': Output232,
	'powerdialer.postLogin': Output233,
	'powerdialer.createApiKey': Output234,
	'powerdialer.createServiceAccount': Output235,
	'powerdialer.getServiceAccount': Output236,
	'powerdialer.updateServiceAccount': Output237,
	'powerdialer.deleteServiceAccount': Output238,
	'powerdialer.getSmsForTarget': Output239,
	'powerdialer.smsItem': Output240,
	'powerdialer.getServiceAccounts': Output241,
	'powerdialer.getCurrentUser': Output242,
	'powerdialer.getWorker': Output243,
	'powerdialer.updateWorker': Output244,
	'powerdialer.getWorkers': Output245,
	'powerdialer.createAudience': Output246,
	'powerdialer.getAudiences': Output247,
	'powerdialer.updateAudience': Output248,
	'powerdialer.getAudience': Output249,
	'powerdialer.createBot': Output250,
	'powerdialer.duplicateAudience': Output251,
	'powerdialer.getBots': Output252,
	'powerdialer.updateBot': Output253,
	'powerdialer.deleteAudience': Output254,
	'powerdialer.deleteBot': Output255,
	'powerdialer.getBot': Output256,
	'powerdialer.getBotDialogs': Output257,
	'powerdialer.createBotDialog': Output258,
	'powerdialer.deleteBotDialog': Output259,
	'powerdialer.getBotMessages': Output260,
	'powerdialer.createBotMessage': Output261,
	'powerdialer.deleteBotMessage': Output262,
	'powerdialer.getBotMessage': Output263,
	'powerdialer.updateBotDialog': Output264,
	'powerdialer.getCampaigns': Output265,
	'powerdialer.searchCampaigns': Output266,
	'powerdialer.deleteCampaign': Output267,
	'powerdialer.createCampaign': Output268,
	'powerdialer.getCampaign': Output269,
	'powerdialer.updateCampaign': Output270,
	'powerdialer.duplicateCampaign': Output271,
	'powerdialer.getCampaignResultExportUrl': Output272,
	'powerdialer.createCampaignGroup': Output273,
	'powerdialer.deleteCampaignGroup': Output274,
	'powerdialer.getCampaignGroup': Output275,
	'powerdialer.getCampaignGroups': Output276,
	'powerdialer.startCampaignResultExport': Output277,
	'powerdialer.getCampaignSettings': Output278,
	'powerdialer.updateCampaignGroup': Output279,
	'powerdialer.editCampaignSettings': Output280,
	'powerdialer.deleteCsv': Output281,
	'powerdialer.getCsvPresignedUrl': Output282,
	'powerdialer.updateCsv': Output283,
	'powerdialer.getVarsInfo': Output284,
	'powerdialer.getCsv': Output285,
	'powerdialer.getPhoneCsvs': Output286,
	'powerdialer.getCsvs': Output287,
	'powerdialer.getPhoneCsv': Output288,
	'powerdialer.updatePhoneCsv': Output289,
	'powerdialer.deletePhoneCsv': Output290,
	'powerdialer.createLeadList': Output291,
	'powerdialer.getBotDialog': Output292,
	'powerdialer.getListItems': Output293,
	'powerdialer.deleteLeadListItem': Output294,
	'powerdialer.getListList': Output295,
	'powerdialer.getLeadListItem': Output296,
	'powerdialer.deleteLeadList': Output297,
	'powerdialer.duplicateLeadList': Output298,
	'powerdialer.getLeadLists': Output299,
	'powerdialer.updateLeadList': Output300,
	'powerdialer.getListView': Output301,
	'powerdialer.createStaticList': Output302,
	'powerdialer.getStaticLists': Output303,
	'powerdialer.getStaticList': Output304,
	'powerdialer.deleteStaticList': Output305,
	'powerdialer.duplicateStaticList': Output306,
	'powerdialer.createLeads': Output307,
	'powerdialer.queryLeads': Output308,
	'powerdialer.getLead': Output309,
	'powerdialer.updateLead': Output310,
	'powerdialer.getLeadCompany': Output311,
	'powerdialer.getLeadCompanies': Output312,
	'powerdialer.updateStaticList': Output313,
	'powerdialer.getLeads': Output314,
	'powerdialer.startLeadExport': Output315,
	'powerdialer.getLeadListView': Output316,
	'powerdialer.bulkUpdateLeadItems': Output317,
	'powerdialer.getLeadItem': Output318,
	'powerdialer.getLeadItems': Output319,
	'powerdialer.getLeadListViewById': Output320,
	'powerdialer.getLeadExport': Output321,
	'powerdialer.createPhone': Output322,
	'powerdialer.getPhone': Output323,
	'powerdialer.updateLeadItem': Output324,
	'powerdialer.deletePhone': Output325,
	'powerdialer.getSalesforceObjectListViews': Output326,
	'powerdialer.updatePhone': Output327,
	'powerdialer.getSalesforceObjectFields': Output328,
	'powerdialer.getSalesforceListViewById': Output329,
	'powerdialer.createSalesforceListViewImport': Output330,
	'powerdialer.getSalesforceListViewImports': Output331,
	'powerdialer.getSalesforceObjectMappings': Output332,
	'powerdialer.createSalesforceObjectMapping': Output333,
	'powerdialer.updateSalesforceListViewImport': Output334,
	'powerdialer.deleteSalesforceObjectMapping': Output335,
	'powerdialer.getSalesforceListViewImport': Output336,
	'powerdialer.getSalesforceObjectMapping': Output337,
	'powerdialer.patchSalesforceListView': Output338,
	'powerdialer.updateSalesforceObjectMapping': Output339,
	'powerdialer.getRules': Output340,
	'powerdialer.createRule': Output341,
	'powerdialer.getPhones': Output342,
	'powerdialer.deleteRule': Output343,
	'powerdialer.updateRule': Output344,
	'powerdialer.getRule': Output345,
	'reports.scheduledstats.download': Output346,
	'recordings.call.download': RecordingDownloadOutput,
	'recordings.voicemail.download': RecordingDownloadOutput,
	'recordings.admin_call.download': RecordingDownloadOutput,
} as const;
export type DialpadEndpointKey = keyof typeof DialpadEndpointInputSchemas;
export type DialpadEndpointInputs = {
	[K in DialpadEndpointKey]: z.infer<(typeof DialpadEndpointInputSchemas)[K]>;
};
export type DialpadEndpointOutputs = {
	[K in DialpadEndpointKey]: z.infer<(typeof DialpadEndpointOutputSchemas)[K]>;
};
