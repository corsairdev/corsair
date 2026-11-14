import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { DIALPAD_API_BASES, redactSensitiveValues } from './client';
import { DialpadOperations } from './endpoints';
import type {
	DialpadEndpointInputs,
	DialpadEndpointKey,
	DialpadEndpointOutputs,
} from './endpoints/types';
import {
	DialpadEndpointInputSchemas,
	DialpadEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DialpadSchema } from './schema';

const dialpadEndpointsNested = DialpadOperations;

export type DialpadPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	/** API key or OAuth access-token override for scripts and tests. */
	key?: string;
	/** Choose Dialpad's official production or sandbox host. */
	environment?: 'production' | 'sandbox';
	hooks?: InternalDialpadPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof dialpadEndpointsNested>;
};

export type DialpadContext = CorsairPluginContext<
	typeof DialpadSchema,
	DialpadPluginOptions
>;
export type DialpadKeyBuilderContext = KeyBuilderContext<DialpadPluginOptions>;
export type DialpadBoundEndpoints = BindEndpoints<
	typeof dialpadEndpointsNested
>;
export type DialpadEndpoints = {
	[K in DialpadEndpointKey]: CorsairEndpoint<
		DialpadContext,
		DialpadEndpointInputs[K],
		DialpadEndpointOutputs[K]
	>;
};

export const dialpadEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof dialpadEndpointsNested
> = {
	'accesscontrolpolicies.assign': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.assign'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.assign'],
	},
	'accesscontrolpolicies.delete': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.delete'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.delete'],
	},
	'accesscontrolpolicies.update': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.update'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.update'],
	},
	'agentgroup.get': {
		input: DialpadEndpointInputSchemas['agentgroup.get'],
		output: DialpadEndpointOutputSchemas['agentgroup.get'],
	},
	'anonymization.requests.get': {
		input: DialpadEndpointInputSchemas['anonymization.requests.get'],
		output: DialpadEndpointOutputSchemas['anonymization.requests.get'],
	},
	'accesscontrolpolicies.list': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.list'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.list'],
	},
	'accesscontrolpolicies.unassign': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.unassign'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.unassign'],
	},
	'accesscontrolpolicies.create': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.create'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.create'],
	},
	'accesscontrolpolicies.assignments': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.assignments'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.assignments'],
	},
	'anonymization.contacts': {
		input: DialpadEndpointInputSchemas['anonymization.contacts'],
		output: DialpadEndpointOutputSchemas['anonymization.contacts'],
	},
	'accesscontrolpolicies.get': {
		input: DialpadEndpointInputSchemas['accesscontrolpolicies.get'],
		output: DialpadEndpointOutputSchemas['accesscontrolpolicies.get'],
	},
	'app_settings.get': {
		input: DialpadEndpointInputSchemas['app_settings.get'],
		output: DialpadEndpointOutputSchemas['app_settings.get'],
	},
	'blockednumbers.get': {
		input: DialpadEndpointInputSchemas['blockednumbers.get'],
		output: DialpadEndpointOutputSchemas['blockednumbers.get'],
	},
	'available_numbers.list': {
		input: DialpadEndpointInputSchemas['available_numbers.list'],
		output: DialpadEndpointOutputSchemas['available_numbers.list'],
	},
	'blockednumbers.add': {
		input: DialpadEndpointInputSchemas['blockednumbers.add'],
		output: DialpadEndpointOutputSchemas['blockednumbers.add'],
	},
	'blockednumbers.list': {
		input: DialpadEndpointInputSchemas['blockednumbers.list'],
		output: DialpadEndpointOutputSchemas['blockednumbers.list'],
	},
	'blockednumbers.remove': {
		input: DialpadEndpointInputSchemas['blockednumbers.remove'],
		output: DialpadEndpointOutputSchemas['blockednumbers.remove'],
	},
	'call.assign': {
		input: DialpadEndpointInputSchemas['call.assign'],
		output: DialpadEndpointOutputSchemas['call.assign'],
	},
	'call.get_assigned_operators': {
		input: DialpadEndpointInputSchemas['call.get_assigned_operators'],
		output: DialpadEndpointOutputSchemas['call.get_assigned_operators'],
	},
	'anonymization.callcontent': {
		input: DialpadEndpointInputSchemas['anonymization.callcontent'],
		output: DialpadEndpointOutputSchemas['anonymization.callcontent'],
	},
	'call.get_ai_recap': {
		input: DialpadEndpointInputSchemas['call.get_ai_recap'],
		output: DialpadEndpointOutputSchemas['call.get_ai_recap'],
	},
	'call.participants.add': {
		input: DialpadEndpointInputSchemas['call.participants.add'],
		output: DialpadEndpointOutputSchemas['call.participants.add'],
	},
	'call.list': {
		input: DialpadEndpointInputSchemas['call.list'],
		output: DialpadEndpointOutputSchemas['call.list'],
	},
	'call.initiate_ivr_call': {
		input: DialpadEndpointInputSchemas['call.initiate_ivr_call'],
		output: DialpadEndpointOutputSchemas['call.initiate_ivr_call'],
	},
	'call.unassign_all_call_operators': {
		input: DialpadEndpointInputSchemas['call.unassign_all_call_operators'],
		output: DialpadEndpointOutputSchemas['call.unassign_all_call_operators'],
	},
	'call.transfer_call': {
		input: DialpadEndpointInputSchemas['call.transfer_call'],
		output: DialpadEndpointOutputSchemas['call.transfer_call'],
	},
	'call.get_call_info': {
		input: DialpadEndpointInputSchemas['call.get_call_info'],
		output: DialpadEndpointOutputSchemas['call.get_call_info'],
	},
	'call.unassign_operator': {
		input: DialpadEndpointInputSchemas['call.unassign_operator'],
		output: DialpadEndpointOutputSchemas['call.unassign_operator'],
	},
	'call.unpark': {
		input: DialpadEndpointInputSchemas['call.unpark'],
		output: DialpadEndpointOutputSchemas['call.unpark'],
	},
	'call.initiate': {
		input: DialpadEndpointInputSchemas['call.initiate'],
		output: DialpadEndpointOutputSchemas['call.initiate'],
	},
	'call.add_labels': {
		input: DialpadEndpointInputSchemas['call.add_labels'],
		output: DialpadEndpointOutputSchemas['call.add_labels'],
	},
	'call.hangup': {
		input: DialpadEndpointInputSchemas['call.hangup'],
		output: DialpadEndpointOutputSchemas['call.hangup'],
	},
	'callbacks.list': {
		input: DialpadEndpointInputSchemas['callbacks.list'],
		output: DialpadEndpointOutputSchemas['callbacks.list'],
	},
	'callback.validate': {
		input: DialpadEndpointInputSchemas['callback.validate'],
		output: DialpadEndpointOutputSchemas['callback.validate'],
	},
	'callcenters.listall': {
		input: DialpadEndpointInputSchemas['callcenters.listall'],
		output: DialpadEndpointOutputSchemas['callcenters.listall'],
	},
	'callcenters.get': {
		input: DialpadEndpointInputSchemas['callcenters.get'],
		output: DialpadEndpointOutputSchemas['callcenters.get'],
	},
	'callcenters.update': {
		input: DialpadEndpointInputSchemas['callcenters.update'],
		output: DialpadEndpointOutputSchemas['callcenters.update'],
	},
	'callcenters.create': {
		input: DialpadEndpointInputSchemas['callcenters.create'],
		output: DialpadEndpointOutputSchemas['callcenters.create'],
	},
	'callback.enqueue': {
		input: DialpadEndpointInputSchemas['callback.enqueue'],
		output: DialpadEndpointOutputSchemas['callback.enqueue'],
	},
	'callcenters.delete': {
		input: DialpadEndpointInputSchemas['callcenters.delete'],
		output: DialpadEndpointOutputSchemas['callcenters.delete'],
	},
	'callcenters.get_status': {
		input: DialpadEndpointInputSchemas['callcenters.get_status'],
		output: DialpadEndpointOutputSchemas['callcenters.get_status'],
	},
	'callcenters.operators.update_duty_status': {
		input:
			DialpadEndpointInputSchemas['callcenters.operators.update_duty_status'],
		output:
			DialpadEndpointOutputSchemas['callcenters.operators.update_duty_status'],
	},
	'callcenters.operators.get_skill_level': {
		input: DialpadEndpointInputSchemas['callcenters.operators.get_skill_level'],
		output:
			DialpadEndpointOutputSchemas['callcenters.operators.get_skill_level'],
	},
	'callcenters.operators.get_duty_status': {
		input: DialpadEndpointInputSchemas['callcenters.operators.get_duty_status'],
		output:
			DialpadEndpointOutputSchemas['callcenters.operators.get_duty_status'],
	},
	'callcenters.operators.update_skill_level': {
		input:
			DialpadEndpointInputSchemas['callcenters.operators.update_skill_level'],
		output:
			DialpadEndpointOutputSchemas['callcenters.operators.update_skill_level'],
	},
	'callcenters.operators.add': {
		input: DialpadEndpointInputSchemas['callcenters.operators.add'],
		output: DialpadEndpointOutputSchemas['callcenters.operators.add'],
	},
	'callcenters.queue.list': {
		input: DialpadEndpointInputSchemas['callcenters.queue.list'],
		output: DialpadEndpointOutputSchemas['callcenters.queue.list'],
	},
	'callcenters.operators.delete': {
		input: DialpadEndpointInputSchemas['callcenters.operators.delete'],
		output: DialpadEndpointOutputSchemas['callcenters.operators.delete'],
	},
	'call_labels.list': {
		input: DialpadEndpointInputSchemas['call_labels.list'],
		output: DialpadEndpointOutputSchemas['call_labels.list'],
	},
	'call_review_share_link.get': {
		input: DialpadEndpointInputSchemas['call_review_share_link.get'],
		output: DialpadEndpointOutputSchemas['call_review_share_link.get'],
	},
	'call_review_share_link.create': {
		input: DialpadEndpointInputSchemas['call_review_share_link.create'],
		output: DialpadEndpointOutputSchemas['call_review_share_link.create'],
	},
	'call_review_share_link.delete': {
		input: DialpadEndpointInputSchemas['call_review_share_link.delete'],
		output: DialpadEndpointOutputSchemas['call_review_share_link.delete'],
	},
	'callrouters.list': {
		input: DialpadEndpointInputSchemas['callrouters.list'],
		output: DialpadEndpointOutputSchemas['callrouters.list'],
	},
	'callcenters.operators.list': {
		input: DialpadEndpointInputSchemas['callcenters.operators.list'],
		output: DialpadEndpointOutputSchemas['callcenters.operators.list'],
	},
	'callrouters.delete': {
		input: DialpadEndpointInputSchemas['callrouters.delete'],
		output: DialpadEndpointOutputSchemas['callrouters.delete'],
	},
	'callrouters.create': {
		input: DialpadEndpointInputSchemas['callrouters.create'],
		output: DialpadEndpointOutputSchemas['callrouters.create'],
	},
	'callrouters.get': {
		input: DialpadEndpointInputSchemas['callrouters.get'],
		output: DialpadEndpointOutputSchemas['callrouters.get'],
	},
	'call_review_share_link.update': {
		input: DialpadEndpointInputSchemas['call_review_share_link.update'],
		output: DialpadEndpointOutputSchemas['call_review_share_link.update'],
	},
	'callrouters.update': {
		input: DialpadEndpointInputSchemas['callrouters.update'],
		output: DialpadEndpointOutputSchemas['callrouters.update'],
	},
	'numbers.assign_call_router_number.post': {
		input:
			DialpadEndpointInputSchemas['numbers.assign_call_router_number.post'],
		output:
			DialpadEndpointOutputSchemas['numbers.assign_call_router_number.post'],
	},
	'channels.delete': {
		input: DialpadEndpointInputSchemas['channels.delete'],
		output: DialpadEndpointOutputSchemas['channels.delete'],
	},
	'channels.get': {
		input: DialpadEndpointInputSchemas['channels.get'],
		output: DialpadEndpointOutputSchemas['channels.get'],
	},
	'channels.members.list': {
		input: DialpadEndpointInputSchemas['channels.members.list'],
		output: DialpadEndpointOutputSchemas['channels.members.list'],
	},
	'channels.list': {
		input: DialpadEndpointInputSchemas['channels.list'],
		output: DialpadEndpointOutputSchemas['channels.list'],
	},
	'coaching_team.get': {
		input: DialpadEndpointInputSchemas['coaching_team.get'],
		output: DialpadEndpointOutputSchemas['coaching_team.get'],
	},
	'coaching_team.members.get': {
		input: DialpadEndpointInputSchemas['coaching_team.members.get'],
		output: DialpadEndpointOutputSchemas['coaching_team.members.get'],
	},
	'channels.create': {
		input: DialpadEndpointInputSchemas['channels.create'],
		output: DialpadEndpointOutputSchemas['channels.create'],
	},
	'channels.members.delete': {
		input: DialpadEndpointInputSchemas['channels.members.delete'],
		output: DialpadEndpointOutputSchemas['channels.members.delete'],
	},
	'channels.members.add': {
		input: DialpadEndpointInputSchemas['channels.members.add'],
		output: DialpadEndpointOutputSchemas['channels.members.add'],
	},
	'coaching_team.listall': {
		input: DialpadEndpointInputSchemas['coaching_team.listall'],
		output: DialpadEndpointOutputSchemas['coaching_team.listall'],
	},
	'company.get': {
		input: DialpadEndpointInputSchemas['company.get'],
		output: DialpadEndpointOutputSchemas['company.get'],
	},
	'company.sms_opt_out': {
		input: DialpadEndpointInputSchemas['company.sms_opt_out'],
		output: DialpadEndpointOutputSchemas['company.sms_opt_out'],
	},
	'company.update_settings': {
		input: DialpadEndpointInputSchemas['company.update_settings'],
		output: DialpadEndpointOutputSchemas['company.update_settings'],
	},
	'coaching_team.members.add': {
		input: DialpadEndpointInputSchemas['coaching_team.members.add'],
		output: DialpadEndpointOutputSchemas['coaching_team.members.add'],
	},
	'company.get_ai_settings': {
		input: DialpadEndpointInputSchemas['company.get_ai_settings'],
		output: DialpadEndpointOutputSchemas['company.get_ai_settings'],
	},
	'company.update': {
		input: DialpadEndpointInputSchemas['company.update'],
		output: DialpadEndpointOutputSchemas['company.update'],
	},
	'company.update_ai_settings': {
		input: DialpadEndpointInputSchemas['company.update_ai_settings'],
		output: DialpadEndpointOutputSchemas['company.update_ai_settings'],
	},
	'contacts.delete': {
		input: DialpadEndpointInputSchemas['contacts.delete'],
		output: DialpadEndpointOutputSchemas['contacts.delete'],
	},
	'contacts.update': {
		input: DialpadEndpointInputSchemas['contacts.update'],
		output: DialpadEndpointOutputSchemas['contacts.update'],
	},
	'contacts.list': {
		input: DialpadEndpointInputSchemas['contacts.list'],
		output: DialpadEndpointOutputSchemas['contacts.list'],
	},
	'contacts.get': {
		input: DialpadEndpointInputSchemas['contacts.get'],
		output: DialpadEndpointOutputSchemas['contacts.get'],
	},
	'contacts.create': {
		input: DialpadEndpointInputSchemas['contacts.create'],
		output: DialpadEndpointOutputSchemas['contacts.create'],
	},
	'contacts.create_with_uid': {
		input: DialpadEndpointInputSchemas['contacts.create_with_uid'],
		output: DialpadEndpointOutputSchemas['contacts.create_with_uid'],
	},
	'ivr.delete': {
		input: DialpadEndpointInputSchemas['ivr.delete'],
		output: DialpadEndpointOutputSchemas['ivr.delete'],
	},
	'contacts.search': {
		input: DialpadEndpointInputSchemas['contacts.search'],
		output: DialpadEndpointOutputSchemas['contacts.search'],
	},
	'ivr.assign': {
		input: DialpadEndpointInputSchemas['ivr.assign'],
		output: DialpadEndpointOutputSchemas['ivr.assign'],
	},
	'custom_ivrs.list': {
		input: DialpadEndpointInputSchemas['custom_ivrs.list'],
		output: DialpadEndpointOutputSchemas['custom_ivrs.list'],
	},
	'ivr.update_details': {
		input: DialpadEndpointInputSchemas['ivr.update_details'],
		output: DialpadEndpointOutputSchemas['ivr.update_details'],
	},
	'departments.delete': {
		input: DialpadEndpointInputSchemas['departments.delete'],
		output: DialpadEndpointOutputSchemas['departments.delete'],
	},
	'ivr.create': {
		input: DialpadEndpointInputSchemas['ivr.create'],
		output: DialpadEndpointOutputSchemas['ivr.create'],
	},
	'departments.update': {
		input: DialpadEndpointInputSchemas['departments.update'],
		output: DialpadEndpointOutputSchemas['departments.update'],
	},
	'departments.create': {
		input: DialpadEndpointInputSchemas['departments.create'],
		output: DialpadEndpointOutputSchemas['departments.create'],
	},
	'departments.listall': {
		input: DialpadEndpointInputSchemas['departments.listall'],
		output: DialpadEndpointOutputSchemas['departments.listall'],
	},
	'departments.get': {
		input: DialpadEndpointInputSchemas['departments.get'],
		output: DialpadEndpointOutputSchemas['departments.get'],
	},
	'departments.operators.delete': {
		input: DialpadEndpointInputSchemas['departments.operators.delete'],
		output: DialpadEndpointOutputSchemas['departments.operators.delete'],
	},
	'dispositions.delete': {
		input: DialpadEndpointInputSchemas['dispositions.delete'],
		output: DialpadEndpointOutputSchemas['dispositions.delete'],
	},
	'digital.sessions.list': {
		input: DialpadEndpointInputSchemas['digital.sessions.list'],
		output: DialpadEndpointOutputSchemas['digital.sessions.list'],
	},
	'dispositions.update': {
		input: DialpadEndpointInputSchemas['dispositions.update'],
		output: DialpadEndpointOutputSchemas['dispositions.update'],
	},
	'dispositions.get': {
		input: DialpadEndpointInputSchemas['dispositions.get'],
		output: DialpadEndpointOutputSchemas['dispositions.get'],
	},
	'departments.operators.list': {
		input: DialpadEndpointInputSchemas['departments.operators.list'],
		output: DialpadEndpointOutputSchemas['departments.operators.list'],
	},
	'dispositions.list': {
		input: DialpadEndpointInputSchemas['dispositions.list'],
		output: DialpadEndpointOutputSchemas['dispositions.list'],
	},
	'dispositions.create': {
		input: DialpadEndpointInputSchemas['dispositions.create'],
		output: DialpadEndpointOutputSchemas['dispositions.create'],
	},
	'departments.operators.add': {
		input: DialpadEndpointInputSchemas['departments.operators.add'],
		output: DialpadEndpointOutputSchemas['departments.operators.add'],
	},
	'faxline.assign': {
		input: DialpadEndpointInputSchemas['faxline.assign'],
		output: DialpadEndpointOutputSchemas['faxline.assign'],
	},
	'bulk_messages.get': {
		input: DialpadEndpointInputSchemas['bulk_messages.get'],
		output: DialpadEndpointOutputSchemas['bulk_messages.get'],
	},
	'fax.send': {
		input: DialpadEndpointInputSchemas['fax.send'],
		output: DialpadEndpointOutputSchemas['fax.send'],
	},
	'bulk_messages.send': {
		input: DialpadEndpointInputSchemas['bulk_messages.send'],
		output: DialpadEndpointOutputSchemas['bulk_messages.send'],
	},
	'scheduled_messages.create': {
		input: DialpadEndpointInputSchemas['scheduled_messages.create'],
		output: DialpadEndpointOutputSchemas['scheduled_messages.create'],
	},
	'scheduled_messages.delete': {
		input: DialpadEndpointInputSchemas['scheduled_messages.delete'],
		output: DialpadEndpointOutputSchemas['scheduled_messages.delete'],
	},
	'bulk_messages.update': {
		input: DialpadEndpointInputSchemas['bulk_messages.update'],
		output: DialpadEndpointOutputSchemas['bulk_messages.update'],
	},
	'bulk_messages.list': {
		input: DialpadEndpointInputSchemas['bulk_messages.list'],
		output: DialpadEndpointOutputSchemas['bulk_messages.list'],
	},
	'scheduled_messages.list': {
		input: DialpadEndpointInputSchemas['scheduled_messages.list'],
		output: DialpadEndpointOutputSchemas['scheduled_messages.list'],
	},
	'numbers.unassign': {
		input: DialpadEndpointInputSchemas['numbers.unassign'],
		output: DialpadEndpointOutputSchemas['numbers.unassign'],
	},
	'scheduled_messages.get': {
		input: DialpadEndpointInputSchemas['scheduled_messages.get'],
		output: DialpadEndpointOutputSchemas['scheduled_messages.get'],
	},
	'numbers.assign': {
		input: DialpadEndpointInputSchemas['numbers.assign'],
		output: DialpadEndpointOutputSchemas['numbers.assign'],
	},
	'scheduled_messages.send_now': {
		input: DialpadEndpointInputSchemas['scheduled_messages.send_now'],
		output: DialpadEndpointOutputSchemas['scheduled_messages.send_now'],
	},
	'numbers.list': {
		input: DialpadEndpointInputSchemas['numbers.list'],
		output: DialpadEndpointOutputSchemas['numbers.list'],
	},
	'numbers.auto_assign': {
		input: DialpadEndpointInputSchemas['numbers.auto_assign'],
		output: DialpadEndpointOutputSchemas['numbers.auto_assign'],
	},
	'numbers.swap': {
		input: DialpadEndpointInputSchemas['numbers.swap'],
		output: DialpadEndpointOutputSchemas['numbers.swap'],
	},
	'number_tags.update': {
		input: DialpadEndpointInputSchemas['number_tags.update'],
		output: DialpadEndpointOutputSchemas['number_tags.update'],
	},
	'scheduled_messages.update': {
		input: DialpadEndpointInputSchemas['scheduled_messages.update'],
		output: DialpadEndpointOutputSchemas['scheduled_messages.update'],
	},
	'numbers.get': {
		input: DialpadEndpointInputSchemas['numbers.get'],
		output: DialpadEndpointOutputSchemas['numbers.get'],
	},
	'coaching_team.list': {
		input: DialpadEndpointInputSchemas['coaching_team.list'],
		output: DialpadEndpointOutputSchemas['coaching_team.list'],
	},
	'office_plan.get': {
		input: DialpadEndpointInputSchemas['office_plan.get'],
		output: DialpadEndpointOutputSchemas['office_plan.get'],
	},
	'phone_number.format': {
		input: DialpadEndpointInputSchemas['phone_number.format'],
		output: DialpadEndpointOutputSchemas['phone_number.format'],
	},
	'departments.list': {
		input: DialpadEndpointInputSchemas['departments.list'],
		output: DialpadEndpointOutputSchemas['departments.list'],
	},
	'numbers.office_unassign_number.post': {
		input: DialpadEndpointInputSchemas['numbers.office_unassign_number.post'],
		output: DialpadEndpointOutputSchemas['numbers.office_unassign_number.post'],
	},
	'callcenters.list': {
		input: DialpadEndpointInputSchemas['callcenters.list'],
		output: DialpadEndpointOutputSchemas['callcenters.list'],
	},
	'numbers.assign_office_number.post': {
		input: DialpadEndpointInputSchemas['numbers.assign_office_number.post'],
		output: DialpadEndpointOutputSchemas['numbers.assign_office_number.post'],
	},
	'available_licenses.list': {
		input: DialpadEndpointInputSchemas['available_licenses.list'],
		output: DialpadEndpointOutputSchemas['available_licenses.list'],
	},
	'offices.e911.get': {
		input: DialpadEndpointInputSchemas['offices.e911.get'],
		output: DialpadEndpointOutputSchemas['offices.e911.get'],
	},
	'offices.offdutystatuses.get': {
		input: DialpadEndpointInputSchemas['offices.offdutystatuses.get'],
		output: DialpadEndpointOutputSchemas['offices.offdutystatuses.get'],
	},
	'offices.e911.update': {
		input: DialpadEndpointInputSchemas['offices.e911.update'],
		output: DialpadEndpointOutputSchemas['offices.e911.update'],
	},
	'offices.update': {
		input: DialpadEndpointInputSchemas['offices.update'],
		output: DialpadEndpointOutputSchemas['offices.update'],
	},
	'offices.get': {
		input: DialpadEndpointInputSchemas['offices.get'],
		output: DialpadEndpointOutputSchemas['offices.get'],
	},
	'offices.primary.get': {
		input: DialpadEndpointInputSchemas['offices.primary.get'],
		output: DialpadEndpointOutputSchemas['offices.primary.get'],
	},
	'offices.list': {
		input: DialpadEndpointInputSchemas['offices.list'],
		output: DialpadEndpointOutputSchemas['offices.list'],
	},
	'offices.operators.delete': {
		input: DialpadEndpointInputSchemas['offices.operators.delete'],
		output: DialpadEndpointOutputSchemas['offices.operators.delete'],
	},
	'offices.create': {
		input: DialpadEndpointInputSchemas['offices.create'],
		output: DialpadEndpointOutputSchemas['offices.create'],
	},
	'offices.operators.get': {
		input: DialpadEndpointInputSchemas['offices.operators.get'],
		output: DialpadEndpointOutputSchemas['offices.operators.get'],
	},
	'offices.operators.post': {
		input: DialpadEndpointInputSchemas['offices.operators.post'],
		output: DialpadEndpointOutputSchemas['offices.operators.post'],
	},
	'recording_share_link.create': {
		input: DialpadEndpointInputSchemas['recording_share_link.create'],
		output: DialpadEndpointOutputSchemas['recording_share_link.create'],
	},
	'recording_share_link.get': {
		input: DialpadEndpointInputSchemas['recording_share_link.get'],
		output: DialpadEndpointOutputSchemas['recording_share_link.get'],
	},
	'numbers.assign_room_number.post': {
		input: DialpadEndpointInputSchemas['numbers.assign_room_number.post'],
		output: DialpadEndpointOutputSchemas['numbers.assign_room_number.post'],
	},
	'numbers.room_unassign_number.post': {
		input: DialpadEndpointInputSchemas['numbers.room_unassign_number.post'],
		output: DialpadEndpointOutputSchemas['numbers.room_unassign_number.post'],
	},
	'rooms.delete': {
		input: DialpadEndpointInputSchemas['rooms.delete'],
		output: DialpadEndpointOutputSchemas['rooms.delete'],
	},
	'rooms.get': {
		input: DialpadEndpointInputSchemas['rooms.get'],
		output: DialpadEndpointOutputSchemas['rooms.get'],
	},
	'recording_share_link.delete': {
		input: DialpadEndpointInputSchemas['recording_share_link.delete'],
		output: DialpadEndpointOutputSchemas['recording_share_link.delete'],
	},
	'rooms.post': {
		input: DialpadEndpointInputSchemas['rooms.post'],
		output: DialpadEndpointOutputSchemas['rooms.post'],
	},
	'recording_share_link.update': {
		input: DialpadEndpointInputSchemas['recording_share_link.update'],
		output: DialpadEndpointOutputSchemas['recording_share_link.update'],
	},
	'deskphones.rooms.create_international_pin': {
		input:
			DialpadEndpointInputSchemas['deskphones.rooms.create_international_pin'],
		output:
			DialpadEndpointOutputSchemas['deskphones.rooms.create_international_pin'],
	},
	'rooms.list': {
		input: DialpadEndpointInputSchemas['rooms.list'],
		output: DialpadEndpointOutputSchemas['rooms.list'],
	},
	'deskphones.rooms.get': {
		input: DialpadEndpointInputSchemas['deskphones.rooms.get'],
		output: DialpadEndpointOutputSchemas['deskphones.rooms.get'],
	},
	'rooms.patch': {
		input: DialpadEndpointInputSchemas['rooms.patch'],
		output: DialpadEndpointOutputSchemas['rooms.patch'],
	},
	'deskphones.rooms.list': {
		input: DialpadEndpointInputSchemas['deskphones.rooms.list'],
		output: DialpadEndpointOutputSchemas['deskphones.rooms.list'],
	},
	'deskphones.rooms.delete': {
		input: DialpadEndpointInputSchemas['deskphones.rooms.delete'],
		output: DialpadEndpointOutputSchemas['deskphones.rooms.delete'],
	},
	'schedule_reports.update': {
		input: DialpadEndpointInputSchemas['schedule_reports.update'],
		output: DialpadEndpointOutputSchemas['schedule_reports.update'],
	},
	'schedule_reports.create': {
		input: DialpadEndpointInputSchemas['schedule_reports.create'],
		output: DialpadEndpointOutputSchemas['schedule_reports.create'],
	},
	'schedule_reports.get': {
		input: DialpadEndpointInputSchemas['schedule_reports.get'],
		output: DialpadEndpointOutputSchemas['schedule_reports.get'],
	},
	'scorecards.export.get': {
		input: DialpadEndpointInputSchemas['scorecards.export.get'],
		output: DialpadEndpointOutputSchemas['scorecards.export.get'],
	},
	'scorecards.export.create': {
		input: DialpadEndpointInputSchemas['scorecards.export.create'],
		output: DialpadEndpointOutputSchemas['scorecards.export.create'],
	},
	'scorecards.get': {
		input: DialpadEndpointInputSchemas['scorecards.get'],
		output: DialpadEndpointOutputSchemas['scorecards.get'],
	},
	'scorecards.list': {
		input: DialpadEndpointInputSchemas['scorecards.list'],
		output: DialpadEndpointOutputSchemas['scorecards.list'],
	},
	'schedule_reports.delete': {
		input: DialpadEndpointInputSchemas['schedule_reports.delete'],
		output: DialpadEndpointOutputSchemas['schedule_reports.delete'],
	},
	'schedule_reports.list': {
		input: DialpadEndpointInputSchemas['schedule_reports.list'],
		output: DialpadEndpointOutputSchemas['schedule_reports.list'],
	},
	'stats.export.create': {
		input: DialpadEndpointInputSchemas['stats.export.create'],
		output: DialpadEndpointOutputSchemas['stats.export.create'],
	},
	'stats.export.get': {
		input: DialpadEndpointInputSchemas['stats.export.get'],
		output: DialpadEndpointOutputSchemas['stats.export.get'],
	},
	'sms.send': {
		input: DialpadEndpointInputSchemas['sms.send'],
		output: DialpadEndpointOutputSchemas['sms.send'],
	},
	'users.initiate_call': {
		input: DialpadEndpointInputSchemas['users.initiate_call'],
		output: DialpadEndpointOutputSchemas['users.initiate_call'],
	},
	'users.toggle_call_vi': {
		input: DialpadEndpointInputSchemas['users.toggle_call_vi'],
		output: DialpadEndpointOutputSchemas['users.toggle_call_vi'],
	},
	'userdevices.get': {
		input: DialpadEndpointInputSchemas['userdevices.get'],
		output: DialpadEndpointOutputSchemas['userdevices.get'],
	},
	'transcripts.get': {
		input: DialpadEndpointInputSchemas['transcripts.get'],
		output: DialpadEndpointOutputSchemas['transcripts.get'],
	},
	'userdevices.list': {
		input: DialpadEndpointInputSchemas['userdevices.list'],
		output: DialpadEndpointOutputSchemas['userdevices.list'],
	},
	'users.toggle_call_recording': {
		input: DialpadEndpointInputSchemas['users.toggle_call_recording'],
		output: DialpadEndpointOutputSchemas['users.toggle_call_recording'],
	},
	'transcripts.get_url': {
		input: DialpadEndpointInputSchemas['transcripts.get_url'],
		output: DialpadEndpointOutputSchemas['transcripts.get_url'],
	},
	'users.set_caller_id': {
		input: DialpadEndpointInputSchemas['users.set_caller_id'],
		output: DialpadEndpointOutputSchemas['users.set_caller_id'],
	},
	'deskphones.users.delete': {
		input: DialpadEndpointInputSchemas['deskphones.users.delete'],
		output: DialpadEndpointOutputSchemas['deskphones.users.delete'],
	},
	'caller_id.users.get': {
		input: DialpadEndpointInputSchemas['caller_id.users.get'],
		output: DialpadEndpointOutputSchemas['caller_id.users.get'],
	},
	'deskphones.users.get': {
		input: DialpadEndpointInputSchemas['deskphones.users.get'],
		output: DialpadEndpointOutputSchemas['deskphones.users.get'],
	},
	'users.e911.update': {
		input: DialpadEndpointInputSchemas['users.e911.update'],
		output: DialpadEndpointOutputSchemas['users.e911.update'],
	},
	'users.toggle_dnd': {
		input: DialpadEndpointInputSchemas['users.toggle_dnd'],
		output: DialpadEndpointOutputSchemas['users.toggle_dnd'],
	},
	'users.unassign_number': {
		input: DialpadEndpointInputSchemas['users.unassign_number'],
		output: DialpadEndpointOutputSchemas['users.unassign_number'],
	},
	'users.assign_number': {
		input: DialpadEndpointInputSchemas['users.assign_number'],
		output: DialpadEndpointOutputSchemas['users.assign_number'],
	},
	'users.list_personas': {
		input: DialpadEndpointInputSchemas['users.list_personas'],
		output: DialpadEndpointOutputSchemas['users.list_personas'],
	},
	'users.e911.get': {
		input: DialpadEndpointInputSchemas['users.e911.get'],
		output: DialpadEndpointOutputSchemas['users.e911.get'],
	},
	'deskphones.users.list': {
		input: DialpadEndpointInputSchemas['deskphones.users.list'],
		output: DialpadEndpointOutputSchemas['deskphones.users.list'],
	},
	'screen_pop.initiate': {
		input: DialpadEndpointInputSchemas['screen_pop.initiate'],
		output: DialpadEndpointOutputSchemas['screen_pop.initiate'],
	},
	'users.delete': {
		input: DialpadEndpointInputSchemas['users.delete'],
		output: DialpadEndpointOutputSchemas['users.delete'],
	},
	'users.get': {
		input: DialpadEndpointInputSchemas['users.get'],
		output: DialpadEndpointOutputSchemas['users.get'],
	},
	'users.list': {
		input: DialpadEndpointInputSchemas['users.list'],
		output: DialpadEndpointOutputSchemas['users.list'],
	},
	'users.update': {
		input: DialpadEndpointInputSchemas['users.update'],
		output: DialpadEndpointOutputSchemas['users.update'],
	},
	'users.create': {
		input: DialpadEndpointInputSchemas['users.create'],
		output: DialpadEndpointOutputSchemas['users.create'],
	},
	'users.move_office': {
		input: DialpadEndpointInputSchemas['users.move_office'],
		output: DialpadEndpointOutputSchemas['users.move_office'],
	},
	'users.create_batch': {
		input: DialpadEndpointInputSchemas['users.create_batch'],
		output: DialpadEndpointOutputSchemas['users.create_batch'],
	},
	'users.update_status': {
		input: DialpadEndpointInputSchemas['users.update_status'],
		output: DialpadEndpointOutputSchemas['users.update_status'],
	},
	'search.users': {
		input: DialpadEndpointInputSchemas['search.users'],
		output: DialpadEndpointOutputSchemas['search.users'],
	},
	'websockets.get': {
		input: DialpadEndpointInputSchemas['websockets.get'],
		output: DialpadEndpointOutputSchemas['websockets.get'],
	},
	'websockets.list': {
		input: DialpadEndpointInputSchemas['websockets.list'],
		output: DialpadEndpointOutputSchemas['websockets.list'],
	},
	'websockets.create': {
		input: DialpadEndpointInputSchemas['websockets.create'],
		output: DialpadEndpointOutputSchemas['websockets.create'],
	},
	'meetings.conference-meetings.list': {
		input: DialpadEndpointInputSchemas['meetings.conference-meetings.list'],
		output: DialpadEndpointOutputSchemas['meetings.conference-meetings.list'],
	},
	'meetings.conference-rooms.list': {
		input: DialpadEndpointInputSchemas['meetings.conference-rooms.list'],
		output: DialpadEndpointOutputSchemas['meetings.conference-rooms.list'],
	},
	'websockets.update': {
		input: DialpadEndpointInputSchemas['websockets.update'],
		output: DialpadEndpointOutputSchemas['websockets.update'],
	},
	'meetings.meetings.get': {
		input: DialpadEndpointInputSchemas['meetings.meetings.get'],
		output: DialpadEndpointOutputSchemas['meetings.meetings.get'],
	},
	'websockets.delete': {
		input: DialpadEndpointInputSchemas['websockets.delete'],
		output: DialpadEndpointOutputSchemas['websockets.delete'],
	},
	'meetings.meetings.update': {
		input: DialpadEndpointInputSchemas['meetings.meetings.update'],
		output: DialpadEndpointOutputSchemas['meetings.meetings.update'],
	},
	'meetings.meetings.delete': {
		input: DialpadEndpointInputSchemas['meetings.meetings.delete'],
		output: DialpadEndpointOutputSchemas['meetings.meetings.delete'],
	},
	'meetings.meetings.create': {
		input: DialpadEndpointInputSchemas['meetings.meetings.create'],
		output: DialpadEndpointOutputSchemas['meetings.meetings.create'],
	},
	'meetings.meetings.room.create': {
		input: DialpadEndpointInputSchemas['meetings.meetings.room.create'],
		output: DialpadEndpointOutputSchemas['meetings.meetings.room.create'],
	},
	'wfm.wfm-metrics-activity.get': {
		input: DialpadEndpointInputSchemas['wfm.wfm-metrics-activity.get'],
		output: DialpadEndpointOutputSchemas['wfm.wfm-metrics-activity.get'],
	},
	'wfm.wfm-metrics-agent.get': {
		input: DialpadEndpointInputSchemas['wfm.wfm-metrics-agent.get'],
		output: DialpadEndpointOutputSchemas['wfm.wfm-metrics-agent.get'],
	},
	'meetings.meetings.list': {
		input: DialpadEndpointInputSchemas['meetings.meetings.list'],
		output: DialpadEndpointOutputSchemas['meetings.meetings.list'],
	},
	'powerdialer.getModelsByKeys': {
		input: DialpadEndpointInputSchemas['powerdialer.getModelsByKeys'],
		output: DialpadEndpointOutputSchemas['powerdialer.getModelsByKeys'],
	},
	'powerdialer.getAblyToken': {
		input: DialpadEndpointInputSchemas['powerdialer.getAblyToken'],
		output: DialpadEndpointOutputSchemas['powerdialer.getAblyToken'],
	},
	'powerdialer.getContact': {
		input: DialpadEndpointInputSchemas['powerdialer.getContact'],
		output: DialpadEndpointOutputSchemas['powerdialer.getContact'],
	},
	'powerdialer.getModelsByKeysOfKind': {
		input: DialpadEndpointInputSchemas['powerdialer.getModelsByKeysOfKind'],
		output: DialpadEndpointOutputSchemas['powerdialer.getModelsByKeysOfKind'],
	},
	'powerdialer.deleteModelsByKeysOfKind': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteModelsByKeysOfKind'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.deleteModelsByKeysOfKind'],
	},
	'powerdialer.createCustomProperties': {
		input: DialpadEndpointInputSchemas['powerdialer.createCustomProperties'],
		output: DialpadEndpointOutputSchemas['powerdialer.createCustomProperties'],
	},
	'powerdialer.getCustomProperties': {
		input: DialpadEndpointInputSchemas['powerdialer.getCustomProperties'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCustomProperties'],
	},
	'powerdialer.getCustomProperty': {
		input: DialpadEndpointInputSchemas['powerdialer.getCustomProperty'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCustomProperty'],
	},
	'powerdialer.updateCustomProperty': {
		input: DialpadEndpointInputSchemas['powerdialer.updateCustomProperty'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateCustomProperty'],
	},
	'powerdialer.getDialpadOAuthService': {
		input: DialpadEndpointInputSchemas['powerdialer.getDialpadOAuthService'],
		output: DialpadEndpointOutputSchemas['powerdialer.getDialpadOAuthService'],
	},
	'powerdialer.updateGlobalSettings': {
		input: DialpadEndpointInputSchemas['powerdialer.updateGlobalSettings'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateGlobalSettings'],
	},
	'powerdialer.deleteCustomProperty': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteCustomProperty'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteCustomProperty'],
	},
	'powerdialer.getGlobalSettings': {
		input: DialpadEndpointInputSchemas['powerdialer.getGlobalSettings'],
		output: DialpadEndpointOutputSchemas['powerdialer.getGlobalSettings'],
	},
	'powerdialer.getEventLogs': {
		input: DialpadEndpointInputSchemas['powerdialer.getEventLogs'],
		output: DialpadEndpointOutputSchemas['powerdialer.getEventLogs'],
	},
	'powerdialer.getJobs': {
		input: DialpadEndpointInputSchemas['powerdialer.getJobs'],
		output: DialpadEndpointOutputSchemas['powerdialer.getJobs'],
	},
	'powerdialer.getJob': {
		input: DialpadEndpointInputSchemas['powerdialer.getJob'],
		output: DialpadEndpointOutputSchemas['powerdialer.getJob'],
	},
	'powerdialer.getApiKey': {
		input: DialpadEndpointInputSchemas['powerdialer.getApiKey'],
		output: DialpadEndpointOutputSchemas['powerdialer.getApiKey'],
	},
	'powerdialer.getApiKeys': {
		input: DialpadEndpointInputSchemas['powerdialer.getApiKeys'],
		output: DialpadEndpointOutputSchemas['powerdialer.getApiKeys'],
	},
	'powerdialer.getOperator': {
		input: DialpadEndpointInputSchemas['powerdialer.getOperator'],
		output: DialpadEndpointOutputSchemas['powerdialer.getOperator'],
	},
	'powerdialer.getLogin': {
		input: DialpadEndpointInputSchemas['powerdialer.getLogin'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLogin'],
	},
	'powerdialer.deleteApiKey': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteApiKey'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteApiKey'],
	},
	'powerdialer.updateApiKey': {
		input: DialpadEndpointInputSchemas['powerdialer.updateApiKey'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateApiKey'],
	},
	'powerdialer.postLogin': {
		input: DialpadEndpointInputSchemas['powerdialer.postLogin'],
		output: DialpadEndpointOutputSchemas['powerdialer.postLogin'],
	},
	'powerdialer.createApiKey': {
		input: DialpadEndpointInputSchemas['powerdialer.createApiKey'],
		output: DialpadEndpointOutputSchemas['powerdialer.createApiKey'],
	},
	'powerdialer.createServiceAccount': {
		input: DialpadEndpointInputSchemas['powerdialer.createServiceAccount'],
		output: DialpadEndpointOutputSchemas['powerdialer.createServiceAccount'],
	},
	'powerdialer.getServiceAccount': {
		input: DialpadEndpointInputSchemas['powerdialer.getServiceAccount'],
		output: DialpadEndpointOutputSchemas['powerdialer.getServiceAccount'],
	},
	'powerdialer.updateServiceAccount': {
		input: DialpadEndpointInputSchemas['powerdialer.updateServiceAccount'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateServiceAccount'],
	},
	'powerdialer.deleteServiceAccount': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteServiceAccount'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteServiceAccount'],
	},
	'powerdialer.getSmsForTarget': {
		input: DialpadEndpointInputSchemas['powerdialer.getSmsForTarget'],
		output: DialpadEndpointOutputSchemas['powerdialer.getSmsForTarget'],
	},
	'powerdialer.smsItem': {
		input: DialpadEndpointInputSchemas['powerdialer.smsItem'],
		output: DialpadEndpointOutputSchemas['powerdialer.smsItem'],
	},
	'powerdialer.getServiceAccounts': {
		input: DialpadEndpointInputSchemas['powerdialer.getServiceAccounts'],
		output: DialpadEndpointOutputSchemas['powerdialer.getServiceAccounts'],
	},
	'powerdialer.getCurrentUser': {
		input: DialpadEndpointInputSchemas['powerdialer.getCurrentUser'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCurrentUser'],
	},
	'powerdialer.getWorker': {
		input: DialpadEndpointInputSchemas['powerdialer.getWorker'],
		output: DialpadEndpointOutputSchemas['powerdialer.getWorker'],
	},
	'powerdialer.updateWorker': {
		input: DialpadEndpointInputSchemas['powerdialer.updateWorker'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateWorker'],
	},
	'powerdialer.getWorkers': {
		input: DialpadEndpointInputSchemas['powerdialer.getWorkers'],
		output: DialpadEndpointOutputSchemas['powerdialer.getWorkers'],
	},
	'powerdialer.createAudience': {
		input: DialpadEndpointInputSchemas['powerdialer.createAudience'],
		output: DialpadEndpointOutputSchemas['powerdialer.createAudience'],
	},
	'powerdialer.getAudiences': {
		input: DialpadEndpointInputSchemas['powerdialer.getAudiences'],
		output: DialpadEndpointOutputSchemas['powerdialer.getAudiences'],
	},
	'powerdialer.updateAudience': {
		input: DialpadEndpointInputSchemas['powerdialer.updateAudience'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateAudience'],
	},
	'powerdialer.getAudience': {
		input: DialpadEndpointInputSchemas['powerdialer.getAudience'],
		output: DialpadEndpointOutputSchemas['powerdialer.getAudience'],
	},
	'powerdialer.createBot': {
		input: DialpadEndpointInputSchemas['powerdialer.createBot'],
		output: DialpadEndpointOutputSchemas['powerdialer.createBot'],
	},
	'powerdialer.duplicateAudience': {
		input: DialpadEndpointInputSchemas['powerdialer.duplicateAudience'],
		output: DialpadEndpointOutputSchemas['powerdialer.duplicateAudience'],
	},
	'powerdialer.getBots': {
		input: DialpadEndpointInputSchemas['powerdialer.getBots'],
		output: DialpadEndpointOutputSchemas['powerdialer.getBots'],
	},
	'powerdialer.updateBot': {
		input: DialpadEndpointInputSchemas['powerdialer.updateBot'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateBot'],
	},
	'powerdialer.deleteAudience': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteAudience'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteAudience'],
	},
	'powerdialer.deleteBot': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteBot'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteBot'],
	},
	'powerdialer.getBot': {
		input: DialpadEndpointInputSchemas['powerdialer.getBot'],
		output: DialpadEndpointOutputSchemas['powerdialer.getBot'],
	},
	'powerdialer.getBotDialogs': {
		input: DialpadEndpointInputSchemas['powerdialer.getBotDialogs'],
		output: DialpadEndpointOutputSchemas['powerdialer.getBotDialogs'],
	},
	'powerdialer.createBotDialog': {
		input: DialpadEndpointInputSchemas['powerdialer.createBotDialog'],
		output: DialpadEndpointOutputSchemas['powerdialer.createBotDialog'],
	},
	'powerdialer.deleteBotDialog': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteBotDialog'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteBotDialog'],
	},
	'powerdialer.getBotMessages': {
		input: DialpadEndpointInputSchemas['powerdialer.getBotMessages'],
		output: DialpadEndpointOutputSchemas['powerdialer.getBotMessages'],
	},
	'powerdialer.createBotMessage': {
		input: DialpadEndpointInputSchemas['powerdialer.createBotMessage'],
		output: DialpadEndpointOutputSchemas['powerdialer.createBotMessage'],
	},
	'powerdialer.deleteBotMessage': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteBotMessage'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteBotMessage'],
	},
	'powerdialer.getBotMessage': {
		input: DialpadEndpointInputSchemas['powerdialer.getBotMessage'],
		output: DialpadEndpointOutputSchemas['powerdialer.getBotMessage'],
	},
	'powerdialer.updateBotDialog': {
		input: DialpadEndpointInputSchemas['powerdialer.updateBotDialog'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateBotDialog'],
	},
	'powerdialer.getCampaigns': {
		input: DialpadEndpointInputSchemas['powerdialer.getCampaigns'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCampaigns'],
	},
	'powerdialer.searchCampaigns': {
		input: DialpadEndpointInputSchemas['powerdialer.searchCampaigns'],
		output: DialpadEndpointOutputSchemas['powerdialer.searchCampaigns'],
	},
	'powerdialer.deleteCampaign': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteCampaign'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteCampaign'],
	},
	'powerdialer.createCampaign': {
		input: DialpadEndpointInputSchemas['powerdialer.createCampaign'],
		output: DialpadEndpointOutputSchemas['powerdialer.createCampaign'],
	},
	'powerdialer.getCampaign': {
		input: DialpadEndpointInputSchemas['powerdialer.getCampaign'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCampaign'],
	},
	'powerdialer.updateCampaign': {
		input: DialpadEndpointInputSchemas['powerdialer.updateCampaign'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateCampaign'],
	},
	'powerdialer.duplicateCampaign': {
		input: DialpadEndpointInputSchemas['powerdialer.duplicateCampaign'],
		output: DialpadEndpointOutputSchemas['powerdialer.duplicateCampaign'],
	},
	'powerdialer.getCampaignResultExportUrl': {
		input:
			DialpadEndpointInputSchemas['powerdialer.getCampaignResultExportUrl'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getCampaignResultExportUrl'],
	},
	'powerdialer.createCampaignGroup': {
		input: DialpadEndpointInputSchemas['powerdialer.createCampaignGroup'],
		output: DialpadEndpointOutputSchemas['powerdialer.createCampaignGroup'],
	},
	'powerdialer.deleteCampaignGroup': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteCampaignGroup'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteCampaignGroup'],
	},
	'powerdialer.getCampaignGroup': {
		input: DialpadEndpointInputSchemas['powerdialer.getCampaignGroup'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCampaignGroup'],
	},
	'powerdialer.getCampaignGroups': {
		input: DialpadEndpointInputSchemas['powerdialer.getCampaignGroups'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCampaignGroups'],
	},
	'powerdialer.startCampaignResultExport': {
		input: DialpadEndpointInputSchemas['powerdialer.startCampaignResultExport'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.startCampaignResultExport'],
	},
	'powerdialer.getCampaignSettings': {
		input: DialpadEndpointInputSchemas['powerdialer.getCampaignSettings'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCampaignSettings'],
	},
	'powerdialer.updateCampaignGroup': {
		input: DialpadEndpointInputSchemas['powerdialer.updateCampaignGroup'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateCampaignGroup'],
	},
	'powerdialer.editCampaignSettings': {
		input: DialpadEndpointInputSchemas['powerdialer.editCampaignSettings'],
		output: DialpadEndpointOutputSchemas['powerdialer.editCampaignSettings'],
	},
	'powerdialer.deleteCsv': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteCsv'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteCsv'],
	},
	'powerdialer.getCsvPresignedUrl': {
		input: DialpadEndpointInputSchemas['powerdialer.getCsvPresignedUrl'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCsvPresignedUrl'],
	},
	'powerdialer.updateCsv': {
		input: DialpadEndpointInputSchemas['powerdialer.updateCsv'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateCsv'],
	},
	'powerdialer.getVarsInfo': {
		input: DialpadEndpointInputSchemas['powerdialer.getVarsInfo'],
		output: DialpadEndpointOutputSchemas['powerdialer.getVarsInfo'],
	},
	'powerdialer.getCsv': {
		input: DialpadEndpointInputSchemas['powerdialer.getCsv'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCsv'],
	},
	'powerdialer.getPhoneCsvs': {
		input: DialpadEndpointInputSchemas['powerdialer.getPhoneCsvs'],
		output: DialpadEndpointOutputSchemas['powerdialer.getPhoneCsvs'],
	},
	'powerdialer.getCsvs': {
		input: DialpadEndpointInputSchemas['powerdialer.getCsvs'],
		output: DialpadEndpointOutputSchemas['powerdialer.getCsvs'],
	},
	'powerdialer.getPhoneCsv': {
		input: DialpadEndpointInputSchemas['powerdialer.getPhoneCsv'],
		output: DialpadEndpointOutputSchemas['powerdialer.getPhoneCsv'],
	},
	'powerdialer.updatePhoneCsv': {
		input: DialpadEndpointInputSchemas['powerdialer.updatePhoneCsv'],
		output: DialpadEndpointOutputSchemas['powerdialer.updatePhoneCsv'],
	},
	'powerdialer.deletePhoneCsv': {
		input: DialpadEndpointInputSchemas['powerdialer.deletePhoneCsv'],
		output: DialpadEndpointOutputSchemas['powerdialer.deletePhoneCsv'],
	},
	'powerdialer.createLeadList': {
		input: DialpadEndpointInputSchemas['powerdialer.createLeadList'],
		output: DialpadEndpointOutputSchemas['powerdialer.createLeadList'],
	},
	'powerdialer.getBotDialog': {
		input: DialpadEndpointInputSchemas['powerdialer.getBotDialog'],
		output: DialpadEndpointOutputSchemas['powerdialer.getBotDialog'],
	},
	'powerdialer.getListItems': {
		input: DialpadEndpointInputSchemas['powerdialer.getListItems'],
		output: DialpadEndpointOutputSchemas['powerdialer.getListItems'],
	},
	'powerdialer.deleteLeadListItem': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteLeadListItem'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteLeadListItem'],
	},
	'powerdialer.getListList': {
		input: DialpadEndpointInputSchemas['powerdialer.getListList'],
		output: DialpadEndpointOutputSchemas['powerdialer.getListList'],
	},
	'powerdialer.getLeadListItem': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadListItem'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadListItem'],
	},
	'powerdialer.deleteLeadList': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteLeadList'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteLeadList'],
	},
	'powerdialer.duplicateLeadList': {
		input: DialpadEndpointInputSchemas['powerdialer.duplicateLeadList'],
		output: DialpadEndpointOutputSchemas['powerdialer.duplicateLeadList'],
	},
	'powerdialer.getLeadLists': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadLists'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadLists'],
	},
	'powerdialer.updateLeadList': {
		input: DialpadEndpointInputSchemas['powerdialer.updateLeadList'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateLeadList'],
	},
	'powerdialer.getListView': {
		input: DialpadEndpointInputSchemas['powerdialer.getListView'],
		output: DialpadEndpointOutputSchemas['powerdialer.getListView'],
	},
	'powerdialer.createStaticList': {
		input: DialpadEndpointInputSchemas['powerdialer.createStaticList'],
		output: DialpadEndpointOutputSchemas['powerdialer.createStaticList'],
	},
	'powerdialer.getStaticLists': {
		input: DialpadEndpointInputSchemas['powerdialer.getStaticLists'],
		output: DialpadEndpointOutputSchemas['powerdialer.getStaticLists'],
	},
	'powerdialer.getStaticList': {
		input: DialpadEndpointInputSchemas['powerdialer.getStaticList'],
		output: DialpadEndpointOutputSchemas['powerdialer.getStaticList'],
	},
	'powerdialer.deleteStaticList': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteStaticList'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteStaticList'],
	},
	'powerdialer.duplicateStaticList': {
		input: DialpadEndpointInputSchemas['powerdialer.duplicateStaticList'],
		output: DialpadEndpointOutputSchemas['powerdialer.duplicateStaticList'],
	},
	'powerdialer.createLeads': {
		input: DialpadEndpointInputSchemas['powerdialer.createLeads'],
		output: DialpadEndpointOutputSchemas['powerdialer.createLeads'],
	},
	'powerdialer.queryLeads': {
		input: DialpadEndpointInputSchemas['powerdialer.queryLeads'],
		output: DialpadEndpointOutputSchemas['powerdialer.queryLeads'],
	},
	'powerdialer.getLead': {
		input: DialpadEndpointInputSchemas['powerdialer.getLead'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLead'],
	},
	'powerdialer.updateLead': {
		input: DialpadEndpointInputSchemas['powerdialer.updateLead'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateLead'],
	},
	'powerdialer.getLeadCompany': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadCompany'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadCompany'],
	},
	'powerdialer.getLeadCompanies': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadCompanies'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadCompanies'],
	},
	'powerdialer.updateStaticList': {
		input: DialpadEndpointInputSchemas['powerdialer.updateStaticList'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateStaticList'],
	},
	'powerdialer.getLeads': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeads'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeads'],
	},
	'powerdialer.startLeadExport': {
		input: DialpadEndpointInputSchemas['powerdialer.startLeadExport'],
		output: DialpadEndpointOutputSchemas['powerdialer.startLeadExport'],
	},
	'powerdialer.getLeadListView': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadListView'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadListView'],
	},
	'powerdialer.bulkUpdateLeadItems': {
		input: DialpadEndpointInputSchemas['powerdialer.bulkUpdateLeadItems'],
		output: DialpadEndpointOutputSchemas['powerdialer.bulkUpdateLeadItems'],
	},
	'powerdialer.getLeadItem': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadItem'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadItem'],
	},
	'powerdialer.getLeadItems': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadItems'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadItems'],
	},
	'powerdialer.getLeadListViewById': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadListViewById'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadListViewById'],
	},
	'powerdialer.getLeadExport': {
		input: DialpadEndpointInputSchemas['powerdialer.getLeadExport'],
		output: DialpadEndpointOutputSchemas['powerdialer.getLeadExport'],
	},
	'powerdialer.createPhone': {
		input: DialpadEndpointInputSchemas['powerdialer.createPhone'],
		output: DialpadEndpointOutputSchemas['powerdialer.createPhone'],
	},
	'powerdialer.getPhone': {
		input: DialpadEndpointInputSchemas['powerdialer.getPhone'],
		output: DialpadEndpointOutputSchemas['powerdialer.getPhone'],
	},
	'powerdialer.updateLeadItem': {
		input: DialpadEndpointInputSchemas['powerdialer.updateLeadItem'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateLeadItem'],
	},
	'powerdialer.deletePhone': {
		input: DialpadEndpointInputSchemas['powerdialer.deletePhone'],
		output: DialpadEndpointOutputSchemas['powerdialer.deletePhone'],
	},
	'powerdialer.getSalesforceObjectListViews': {
		input:
			DialpadEndpointInputSchemas['powerdialer.getSalesforceObjectListViews'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceObjectListViews'],
	},
	'powerdialer.updatePhone': {
		input: DialpadEndpointInputSchemas['powerdialer.updatePhone'],
		output: DialpadEndpointOutputSchemas['powerdialer.updatePhone'],
	},
	'powerdialer.getSalesforceObjectFields': {
		input: DialpadEndpointInputSchemas['powerdialer.getSalesforceObjectFields'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceObjectFields'],
	},
	'powerdialer.getSalesforceListViewById': {
		input: DialpadEndpointInputSchemas['powerdialer.getSalesforceListViewById'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceListViewById'],
	},
	'powerdialer.createSalesforceListViewImport': {
		input:
			DialpadEndpointInputSchemas['powerdialer.createSalesforceListViewImport'],
		output:
			DialpadEndpointOutputSchemas[
				'powerdialer.createSalesforceListViewImport'
			],
	},
	'powerdialer.getSalesforceListViewImports': {
		input:
			DialpadEndpointInputSchemas['powerdialer.getSalesforceListViewImports'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceListViewImports'],
	},
	'powerdialer.getSalesforceObjectMappings': {
		input:
			DialpadEndpointInputSchemas['powerdialer.getSalesforceObjectMappings'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceObjectMappings'],
	},
	'powerdialer.createSalesforceObjectMapping': {
		input:
			DialpadEndpointInputSchemas['powerdialer.createSalesforceObjectMapping'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.createSalesforceObjectMapping'],
	},
	'powerdialer.updateSalesforceListViewImport': {
		input:
			DialpadEndpointInputSchemas['powerdialer.updateSalesforceListViewImport'],
		output:
			DialpadEndpointOutputSchemas[
				'powerdialer.updateSalesforceListViewImport'
			],
	},
	'powerdialer.deleteSalesforceObjectMapping': {
		input:
			DialpadEndpointInputSchemas['powerdialer.deleteSalesforceObjectMapping'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.deleteSalesforceObjectMapping'],
	},
	'powerdialer.getSalesforceListViewImport': {
		input:
			DialpadEndpointInputSchemas['powerdialer.getSalesforceListViewImport'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceListViewImport'],
	},
	'powerdialer.getSalesforceObjectMapping': {
		input:
			DialpadEndpointInputSchemas['powerdialer.getSalesforceObjectMapping'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.getSalesforceObjectMapping'],
	},
	'powerdialer.patchSalesforceListView': {
		input: DialpadEndpointInputSchemas['powerdialer.patchSalesforceListView'],
		output: DialpadEndpointOutputSchemas['powerdialer.patchSalesforceListView'],
	},
	'powerdialer.updateSalesforceObjectMapping': {
		input:
			DialpadEndpointInputSchemas['powerdialer.updateSalesforceObjectMapping'],
		output:
			DialpadEndpointOutputSchemas['powerdialer.updateSalesforceObjectMapping'],
	},
	'powerdialer.getRules': {
		input: DialpadEndpointInputSchemas['powerdialer.getRules'],
		output: DialpadEndpointOutputSchemas['powerdialer.getRules'],
	},
	'powerdialer.createRule': {
		input: DialpadEndpointInputSchemas['powerdialer.createRule'],
		output: DialpadEndpointOutputSchemas['powerdialer.createRule'],
	},
	'powerdialer.getPhones': {
		input: DialpadEndpointInputSchemas['powerdialer.getPhones'],
		output: DialpadEndpointOutputSchemas['powerdialer.getPhones'],
	},
	'powerdialer.deleteRule': {
		input: DialpadEndpointInputSchemas['powerdialer.deleteRule'],
		output: DialpadEndpointOutputSchemas['powerdialer.deleteRule'],
	},
	'powerdialer.updateRule': {
		input: DialpadEndpointInputSchemas['powerdialer.updateRule'],
		output: DialpadEndpointOutputSchemas['powerdialer.updateRule'],
	},
	'powerdialer.getRule': {
		input: DialpadEndpointInputSchemas['powerdialer.getRule'],
		output: DialpadEndpointOutputSchemas['powerdialer.getRule'],
	},
	'reports.scheduledstats.download': {
		input: DialpadEndpointInputSchemas['reports.scheduledstats.download'],
		output: DialpadEndpointOutputSchemas['reports.scheduledstats.download'],
	},
	'recordings.call.download': {
		input: DialpadEndpointInputSchemas['recordings.call.download'],
		output: DialpadEndpointOutputSchemas['recordings.call.download'],
	},
	'recordings.voicemail.download': {
		input: DialpadEndpointInputSchemas['recordings.voicemail.download'],
		output: DialpadEndpointOutputSchemas['recordings.voicemail.download'],
	},
	'recordings.admin_call.download': {
		input: DialpadEndpointInputSchemas['recordings.admin_call.download'],
		output: DialpadEndpointOutputSchemas['recordings.admin_call.download'],
	},
};

const dialpadEndpointMetaValue = {
	'accesscontrolpolicies.assign': {
		riskLevel: 'write',
		description:
			'Access Control Policies -- Assign. Assigns a user to an access control policy. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'accesscontrolpolicies.delete': {
		riskLevel: 'destructive',
		description:
			'Access Control Policies -- Delete. Deletes a policy by marking the state as deleted, and removing all associated users. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'accesscontrolpolicies.update': {
		riskLevel: 'write',
		description:
			'Access Control Policies -- Update. Updates the provided fields for an existing access control policy. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'agentgroup.get': {
		riskLevel: 'read',
		description:
			'Agent Group -- Get. Requires scope: ``agent_groups:read`` Rate limit: 1200 per minute.',
	},
	'anonymization.requests.get': {
		riskLevel: 'read',
		description:
			'Anonymization Request -- Get. Returns the current status of an anonymization request. Rate limit: 1200 per minute.',
	},
	'accesscontrolpolicies.list': {
		riskLevel: 'read',
		description:
			'Access Control Policies -- List Policies. Gets all access control policies belonging to the company. Rate limit: 1200 per minute.',
	},
	'accesscontrolpolicies.unassign': {
		riskLevel: 'write',
		description:
			'Access Control Policies -- Unassign. Unassigns one or all target groups associated with the user for an access control policy. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'accesscontrolpolicies.create': {
		riskLevel: 'write',
		description:
			'Access Control Policies -- Create. Creates a new custom access control policy. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'accesscontrolpolicies.assignments': {
		riskLevel: 'read',
		description:
			'Access Control Policies -- List Assignments. Lists all users assigned to this access control policy. Rate limit: 1200 per minute.',
	},
	'anonymization.contacts': {
		riskLevel: 'destructive',
		description:
			'Anonymize -- Contacts (Bulk). Anonymizes the specified contacts by removing all PII (name, phone, email, etc). Call recordings and AI data associated with these contacts are also removed. This operation is asynchronous — queues one task per contact and returns a request_id for status polling. Rate limit: 10 per minute.',
	},
	'accesscontrolpolicies.get': {
		riskLevel: 'read',
		description:
			"Access Control Policies -- Get. Get a specific access control policy's details. Rate limit: 1200 per minute.",
	},
	'app_settings.get': {
		riskLevel: 'read',
		description:
			'App Settings -- Get. Gets the app settings of the OAuth app that is associated with the API key for the target, if target_type and target_id are provided. Otherwise, will return the app settings for the company. Rate limit: 1200 per minute.',
	},
	'blockednumbers.get': {
		riskLevel: 'read',
		description:
			'Blocked Number -- Get. Checks whether a single phone number is blocked company-wide. Returns the number if it is blocked, and 404s if it is not blocked or was blocked outside the API. Rate limit: 1200 per minute.',
	},
	'available_numbers.list': {
		riskLevel: 'read',
		description:
			"Dialpad Number -- List Available. Searches the phone numbers that are available to assign, in the country of the user's office. Search by area code, city or the first digits of a number, and page through the results with the cursor. The search has these fallbacks: - A toll-free search with no matches returns any available toll-free numbers instead. - For a US search that has run out of results, the response lists overlaying_area_codes: other area codes that serve the same region, to search next. - When nothing matches an international search, set country_fallback to get numbers from the whole country instead; the response then has search_extended_to_country set. Requires a user API key. Rate limit: 1200 per minute.",
	},
	'blockednumbers.add': {
		riskLevel: 'write',
		description:
			'Blocked Number -- Add. Blocks the given phone numbers company-wide, so that inbound calls and texts from them are rejected for every user in the company. Returns no content on success. Blocking is reversible via the remove endpoint. Rate limit: 1200 per minute.',
	},
	'blockednumbers.list': {
		riskLevel: 'read',
		description:
			'Blocked Numbers -- List. Lists the phone numbers blocked company-wide through the API. Numbers blocked by other means are not included. Rate limit: 1200 per minute.',
	},
	'blockednumbers.remove': {
		riskLevel: 'write',
		description:
			'Blocked Number -- Remove. Unblocks the given phone numbers company-wide, restoring inbound calls and texts from them. Returns no content on success. Rate limit: 1200 per minute.',
	},
	'call.assign': {
		riskLevel: 'write',
		description:
			'Call -- Assign Operator. Assigns an operator to a call queued in a contact center. Only contact center calls are eligible for this operation. Currently supports assigning one operator per request. Rate limit: 12 per minute.',
	},
	'call.get_assigned_operators': {
		riskLevel: 'read',
		description:
			'Call -- Assigned Operators. Get all assigned operators from a call queued in a contact center. Only contact center calls are eligible for this operation. Rate limit: 250 per minute.',
	},
	'anonymization.callcontent': {
		riskLevel: 'destructive',
		description:
			'Call Content -- Delete (Bulk). Removes call recordings, screen recordings, transcripts, and AI data from the specified calls. The call records themselves are preserved. This operation is asynchronous — queues a task and returns a request_id for status polling. Rate limit: 10 per minute.',
	},
	'call.get_ai_recap': {
		riskLevel: 'read',
		description:
			'Call -- Get Ai Recap. Gets the Ai Recap for a call. Requires scope: ``ai_recap`` Rate limit: 12 per minute.',
	},
	'call.participants.add': {
		riskLevel: 'destructive',
		description:
			'Call -- Add Participant. Adds another participant to a call. Valid methods to add are by phone or by target. Targets require to have a primary phone Rate limit: 1200 per minute.',
	},
	'call.list': {
		riskLevel: 'read',
		description:
			"Call -- List. Provides a paginated list of calls matching the specified filter parameters in reverse-chronological order by call start time (i.e. recent calls first) Note: This API will only include calls that have already concluded. When no target is specified, company-level API keys and company admins list all of the company's calls, and other user-level API keys list the authenticated user's own calls. Requires scope: ``calls:list`` Rate limit: 1200 per minute.",
	},
	'call.initiate_ivr_call': {
		riskLevel: 'destructive',
		description:
			'Call -- Initiate IVR Call. Initiates an outbound call to ring an IVR Workflow. Rate limit: 10 per minute per IVR. Rate limit: 1200 per minute.',
	},
	'call.unassign_all_call_operators': {
		riskLevel: 'write',
		description:
			'Call -- Unassign All Call Operators. Unassigns all assigned operators from a call queued in a contact center. Only contact center calls are eligible for this operation. Rate limit: 12 per minute.',
	},
	'call.transfer_call': {
		riskLevel: 'destructive',
		description:
			'Call -- Transfer. Transfers call to another recipient. Rate limit: 1200 per minute.',
	},
	'call.get_call_info': {
		riskLevel: 'read',
		description:
			'Call -- Get. Get call status and detailed information for a concluded call, including direction, duration, recording URLs, CSAT scores, voicemail metadata, and transcription text. Also returns routing_breadcrumbs, which is only populated for calls routed through a customer-configured API Call Router and is empty for every other call. Rate limit: 10 per minute.',
	},
	'call.unassign_operator': {
		riskLevel: 'write',
		description:
			'Call -- Unassign Call Operator. Unassigns an operator from a call queued in a contact center. Only contact center calls are eligible for this operation. Currently supports unassigning one specific operator per request. Rate limit: 12 per minute.',
	},
	'call.unpark': {
		riskLevel: 'write',
		description:
			'Call -- Unpark. Unparks a call previously parked on an Office mainline, routing it to the specified user. Rate limit: 1200 per minute.',
	},
	'call.initiate': {
		riskLevel: 'destructive',
		description:
			'Call -- Initiate via Ring. Initiates an outbound call to ring all devices (or a single specified device). Note that the user must have at least one active device (a web, desktop or mobile Dialpad app; a CTI application; or a physical deskphone). Rate limit: 5 per minute.',
	},
	'call.add_labels': {
		riskLevel: 'write',
		description:
			'Label -- Add. Adds labels to a determined call id, keeping any labels already on the call. A label already present is not duplicated. Labels cannot be removed through this endpoint. Rate limit: 250 per minute.',
	},
	'call.hangup': {
		riskLevel: 'destructive',
		description:
			'Call Actions -- Hang up. Hangs up the call. Rate limit: 1200 per minute.',
	},
	'callbacks.list': {
		riskLevel: 'read',
		description:
			'Call Back -- List. Lists the callback requests waiting in a call center\'s queue, oldest first, so the first result has been waiting longest. Each callback reports the number to call back, when it was queued, and a status that is either "queued" while the request is still waiting for an operator or "timed_out" once it waited longer than the call center\'s max_hold_seconds. Queued callbacks carry their position in the queue; timed-out ones do not. The API key must have admin rights on the specified call center; this is a per-call-center check rather than a company-wide admin requirement. Rate limit: 1200 per minute.',
	},
	'callback.validate': {
		riskLevel: 'write',
		description:
			'Call Back -- Validate. Performs a dry run of a callback request without adding it to the call center queue and without placing any call. Runs the same validation as enqueuing would, so it reports the same failures (unreachable number, international destination, duplicate request, call center closed) up front. Returns whether the request would succeed. Rate limit: 1200 per minute.',
	},
	'callcenters.listall': {
		riskLevel: 'read',
		description:
			'Call Centers -- List. Gets all the call centers for the company. Rate limit: 1200 per minute.',
	},
	'callcenters.get': {
		riskLevel: 'read',
		description:
			'Call Centers -- Get. Gets a call center by id. Rate limit: 1200 per minute.',
	},
	'callcenters.update': {
		riskLevel: 'write',
		description:
			'Call Centers -- Update. Updates a call center by id. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'callcenters.create': {
		riskLevel: 'write',
		description:
			'Call Centers -- Create. Create a new call center in the specified office. Requires name and office_id. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'callback.enqueue': {
		riskLevel: 'destructive',
		description:
			"Call Back -- Enqueue. Requests a call back to a given number by an operator in a given call center, and returns the request's position in the queue. The call back joins the call center queue like a regular call and dials out when the next operator becomes available, respecting the call center's business and holiday hours and queue settings. International call backs are not supported, and a duplicate call back for the same number and call center is rejected. Rate limit: 1200 per minute.",
	},
	'callcenters.delete': {
		riskLevel: 'destructive',
		description:
			'Call Centers -- Delete. Deletes a call center by id. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'callcenters.get_status': {
		riskLevel: 'read',
		description:
			'Call Centers -- Status. Get live operational metrics for a call center: availability status, available operator count, queued calls, longest wait time, and on-duty operator count. Rate limit: 1200 per minute.',
	},
	'callcenters.operators.update_duty_status': {
		riskLevel: 'write',
		description:
			"Operator -- Update Duty Status. Updates the operator's duty status for all call centers which user belongs to. Rate limit: 1200 per minute.",
	},
	'callcenters.operators.get_skill_level': {
		riskLevel: 'read',
		description:
			'Operator -- Get Skill Level. Gets the skill level of an operator within a call center. Rate limit: 1200 per minute.',
	},
	'callcenters.operators.get_duty_status': {
		riskLevel: 'read',
		description:
			"Operator -- Get Duty Status. Gets the operator's on duty status and reason. Rate limit: 1200 per minute.",
	},
	'callcenters.operators.update_skill_level': {
		riskLevel: 'write',
		description:
			'Operator -- Update Skill Level. Updates the skill level of an operator within a call center. Rate limit: 1200 per minute.',
	},
	'callcenters.operators.add': {
		riskLevel: 'destructive',
		description:
			'Operator -- Add. Adds an operator to a call center. > Warning > > This API may result in the usage of call center licenses if required and available. If the licenses are required and not available the operation will fail. Licenses are required when adding an operator that does not have a call center license. Rate limit: 1200 per minute.',
	},
	'callcenters.queue.list': {
		riskLevel: 'read',
		description:
			"Call Centers -- Queue. List the calls and callbacks currently waiting in a call center's queue, ordered oldest-queued first. Includes calls that are ringing an operator but not yet answered. Rate limit: 30 per minute.",
	},
	'callcenters.operators.delete': {
		riskLevel: 'destructive',
		description:
			'Operator -- Remove. Removes an operator from a call center. Note: This API will not change or release any licenses. Rate limit: 1200 per minute.',
	},
	'call_labels.list': {
		riskLevel: 'read',
		description:
			'Label -- List. Gets all labels for a determined company. Rate limit: 1200 per minute.',
	},
	'call_review_share_link.get': {
		riskLevel: 'read',
		description:
			'Call Review Sharelink -- Get. Gets a call review share link by call id. Rate limit: 1200 per minute.',
	},
	'call_review_share_link.create': {
		riskLevel: 'write',
		description:
			'Call Review Sharelink -- Create. Create a call review share link by call id. Rate limit: 250 per minute.',
	},
	'call_review_share_link.delete': {
		riskLevel: 'destructive',
		description:
			'Call Review Sharelink -- Delete. Delete a call review share link by id. Rate limit: 1200 per minute.',
	},
	'callrouters.list': {
		riskLevel: 'read',
		description:
			'Call Router -- List. Lists all of the API call routers for a given company or office. Rate limit: 1200 per minute.',
	},
	'callcenters.operators.list': {
		riskLevel: 'read',
		description:
			'Operators -- List. List all operators (users and rooms) assigned to a call center. Returns operator names, roles, and on-duty status. Rate limit: 1200 per minute.',
	},
	'callrouters.delete': {
		riskLevel: 'destructive',
		description:
			'Call Router -- Delete. Deletes the API call router with the given ID. Rate limit: 1200 per minute.',
	},
	'callrouters.create': {
		riskLevel: 'write',
		description:
			'Call Router -- Create. Creates a new API-based call router. Rate limit: 1200 per minute.',
	},
	'callrouters.get': {
		riskLevel: 'read',
		description:
			'Call Router -- Get. Gets the API call router with the given ID. Rate limit: 1200 per minute.',
	},
	'call_review_share_link.update': {
		riskLevel: 'write',
		description:
			'Call Review Sharelink -- Update. Update a call review share link by id. Rate limit: 250 per minute.',
	},
	'callrouters.update': {
		riskLevel: 'write',
		description:
			'Call Router -- Update. Updates the API call router with the given ID. Rate limit: 1200 per minute.',
	},
	'numbers.assign_call_router_number.post': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Assign. Assigns a number to a callrouter. The number will automatically be taken from the company's reserved pool if there are reserved numbers, otherwise a number will be auto-assigned from the provided area code. Rate limit: 1200 per minute.",
	},
	'channels.delete': {
		riskLevel: 'destructive',
		description:
			'Channel -- Delete. Deletes a channel by id. Rate limit: 1200 per minute.',
	},
	'channels.get': {
		riskLevel: 'read',
		description:
			'Channel -- Get. Get channel by id Rate limit: 1200 per minute.',
	},
	'channels.members.list': {
		riskLevel: 'read',
		description:
			'Members -- List. List all the members from a channel Rate limit: 1200 per minute.',
	},
	'channels.list': {
		riskLevel: 'read',
		description:
			'Channel -- List. Lists all channels in the company. Rate limit: 1200 per minute.',
	},
	'coaching_team.get': {
		riskLevel: 'read',
		description:
			'Coaching Team -- Get. Get details of a specified coaching team. Rate limit: 1200 per minute.',
	},
	'coaching_team.members.get': {
		riskLevel: 'read',
		description:
			'Coaching Team -- List Members. List all members of a coaching team with their roles (coach or trainee), contact info, and availability status. Rate limit: 1200 per minute.',
	},
	'channels.create': {
		riskLevel: 'write',
		description:
			'Channel -- Create. Creates a new channel. Rate limit: 1200 per minute.',
	},
	'channels.members.delete': {
		riskLevel: 'destructive',
		description:
			'Member -- Remove. Removes a member from a channel. Rate limit: 1200 per minute.',
	},
	'channels.members.add': {
		riskLevel: 'write',
		description:
			'Member -- Add. Adds a user to a channel. Rate limit: 1200 per minute.',
	},
	'coaching_team.listall': {
		riskLevel: 'read',
		description:
			'Coaching Team -- List. Get a list of all coaching teams in the company. Rate limit: 1200 per minute.',
	},
	'company.get': {
		riskLevel: 'read',
		description:
			'Company -- Get. Gets company information: name, primary office, admin contact, plan state and billing address. Rate limit: 1200 per minute.',
	},
	'company.sms_opt_out': {
		riskLevel: 'read',
		description:
			'Company -- Get SMS Opt-out List. Lists the external phone numbers that have opted out of (or back in to) SMS from this company, filtered by opt-out state and optionally by A2P campaign. Use this before sending SMS to confirm a recipient has not opted out. Requires a company admin API key. Rate limit: 250 per minute.',
	},
	'company.update_settings': {
		riskLevel: 'write',
		description:
			'Company -- Update Settings. Updates company settings. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'coaching_team.members.add': {
		riskLevel: 'write',
		description:
			'Coaching Team -- Add Member. Add a user to the specified coaching team as trainee or coach. Rate limit: 1200 per minute.',
	},
	'company.get_ai_settings': {
		riskLevel: 'read',
		description:
			'Company -- Get AI Settings. Gets the company-level AI settings: whether Call AI is enabled and whether the company allows its data to be used for AI training. Rate limit: 1200 per minute.',
	},
	'company.update': {
		riskLevel: 'write',
		description:
			"Company -- Update. Updates the company's name. For a company with a single office, the office is renamed too. Only an admin of the company acting as a user can call this: a missing user credential gets a 401, and a user who is not an admin of this company gets a 403. Rate limit: 1200 per minute.",
	},
	'company.update_ai_settings': {
		riskLevel: 'write',
		description:
			'Company -- Update AI Settings. Updates the company-level AI settings, and syncs the change to the enterprise the same way the admin portal does. Settings that are omitted are left unchanged, and a setting cannot be cleared, so an explicit null is rejected with a 400, as is a request that sets nothing. A company-level API key can call this without a user credential. Any other caller must be a company admin, the admin of a single-office company, or have write access to AI settings: a missing user credential gets a 401, and any other caller gets a 403. Rate limit: 1200 per minute.',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description:
			'Contact -- Delete. Deletes a contact by id. Rate limit: 1200 per minute.',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Contact -- Update. Updates the provided fields for an existing contact. Rate limit: 1200 per minute.',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			"Contact -- List. Gets company shared contacts, or user's local contacts if owner_id is provided. NOTE: The `limit` parameter has been soft-deprecated. Please omit the `limit` parameter, or reduce it to `100` or less. - Limit values of greater than `100` will only produce a page size of `100`, and a `400 Bad Request` response will be produced 20% of the time in an effort to raise visibility of side-effects that might otherwise go un-noticed by solutions that had assumed a larger page size. - The `cursor` value is provided in the response, and can be passed as a parameter to retrieve subsequent pages of results. Rate limit: 1200 per minute.",
	},
	'contacts.get': {
		riskLevel: 'read',
		description:
			'Contact -- Get. Gets a contact by id. Currently, only contacts of type shared and local can be retrieved by this API. Rate limit: 1200 per minute.',
	},
	'contacts.create': {
		riskLevel: 'write',
		description:
			'Contact -- Create. Creates a new contact. Rate limit: 100 per minute.',
	},
	'contacts.create_with_uid': {
		riskLevel: 'write',
		description:
			'Contact -- Create or Update. Creates a new shared contact with uid. Rate limit: 100 per minute.',
	},
	'ivr.delete': {
		riskLevel: 'destructive',
		description:
			'Custom IVR -- Delete. Un-assigns an IVR recording from a target for a given IVR type and deletes the recording. The target falls back to its default behaviour for that IVR type. Rate limit: 1200 per minute.',
	},
	'contacts.search': {
		riskLevel: 'read',
		description:
			'Contact -- Search. Searches local, shared, and lead contacts the API key may read within its company. All filters must match (AND). Contacts sharing an identifier are returned separately. Results may lag behind updates. A short or empty page may still include a next-page cursor. Empty items and external_ids are omitted. The cursor is omitted when the search is complete. Rate limit: 1200 per minute.',
	},
	'ivr.assign': {
		riskLevel: 'write',
		description:
			"Custom IVR -- Assign. Assigns an already-created IVR recording to a target for a given IVR type, replacing whatever was previously assigned. This selects which existing recording plays; it does not change the recording's own name or description. Rate limit: 1200 per minute.",
	},
	'custom_ivrs.list': {
		riskLevel: 'read',
		description:
			'Custom IVR -- List. Lists the custom IVR recordings configured on a target, such as greetings, hold music and menu prompts. A target can have many IVRs of different types, so pass ivr_type to narrow the results to one kind. Rate limit: 1200 per minute.',
	},
	'ivr.update_details': {
		riskLevel: 'write',
		description:
			"Custom IVR -- Update. Renames an existing IVR recording or changes its description. This edits the recording's own metadata only; it does not change which target the recording is assigned to and does not replace the audio. Rate limit: 1200 per minute.",
	},
	'departments.delete': {
		riskLevel: 'destructive',
		description:
			'Departments -- Delete. Permanently delete a department. This removes the department and all its configuration. Cannot be undone. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'ivr.create': {
		riskLevel: 'write',
		description:
			'Custom IVR -- Create. Creates a new custom IVR recording for a target. The audio is supplied in the "file" field as a Base64-encoded MP3. Returns the created IVR, including the id needed to assign it to a target. Rate limit: 1200 per minute.',
	},
	'departments.update': {
		riskLevel: 'write',
		description:
			'Departments -- Update. Updates an existing department. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'departments.create': {
		riskLevel: 'write',
		description:
			'Departments -- Create. Create a new department in the specified office. Requires name and office_id. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'departments.listall': {
		riskLevel: 'read',
		description:
			'Department -- List. Gets all the departments in the company. Rate limit: 1200 per minute.',
	},
	'departments.get': {
		riskLevel: 'read',
		description:
			'Department -- Get. Gets a department by id. Rate limit: 1200 per minute.',
	},
	'departments.operators.delete': {
		riskLevel: 'destructive',
		description:
			'Operator -- Remove. Remove an operator (user or room) from a department. Specify operator_id and operator_type. Rate limit: 1200 per minute.',
	},
	'dispositions.delete': {
		riskLevel: 'destructive',
		description:
			'Dispositions -- Delete. Deletes the disposition by id. Rate limit: 1200 per minute.',
	},
	'digital.sessions.list': {
		riskLevel: 'read',
		description:
			'Digital -- Sessions -- List. Gets list of digital sessions which are started/ended in the requested period. Requested period must be less than 7 days. Requires scope: ``digital_sessions`` Rate limit: 100 per minute.',
	},
	'dispositions.update': {
		riskLevel: 'write',
		description:
			'Dispositions -- Update. Updates the disposition by id. Bulk updates for the targets assigned to a disposition is not supported. Rate limit: 1200 per minute.',
	},
	'dispositions.get': {
		riskLevel: 'read',
		description:
			'Dispositions -- Get. Gets a disposition by id. Rate limit: 1200 per minute.',
	},
	'departments.operators.list': {
		riskLevel: 'read',
		description:
			'Operator -- List. List all operators (users and rooms) assigned to a department. Returns operator names, roles, and on-duty status. Rate limit: 1200 per minute.',
	},
	'dispositions.list': {
		riskLevel: 'read',
		description:
			'Dispositions -- List. Gets a list of dispositions by a target. Rate limit: 1200 per minute.',
	},
	'dispositions.create': {
		riskLevel: 'write',
		description:
			'Dispositions -- Create. Creates a disposition for an office. Rate limit: 1200 per minute.',
	},
	'departments.operators.add': {
		riskLevel: 'write',
		description:
			'Operator -- Add. Add a user or room as an operator to a department. Specify operator_type (user or room) and optional role (operator or admin). Rate limit: 1200 per minute.',
	},
	'faxline.assign': {
		riskLevel: 'destructive',
		description:
			"Fax Line -- Assign. Assigns a fax line to a target. Target includes user and department. Depending on the chosen line type, the number will be taken from the company's reserved pool if there are available reserved numbers, otherwise numbers can be auto-assigned using a provided area code. Requires a company admin API key. Rate limit: 1200 per minute.",
	},
	'bulk_messages.get': {
		riskLevel: 'read',
		description:
			'Bulk Message -- Get. Gets a single bulk message by ID. Rate limit: 1200 per minute.',
	},
	'fax.send': {
		riskLevel: 'destructive',
		description:
			'Fax -- Send. Sends a fax to a phone number. Rate limit: 250 per minute.',
	},
	'bulk_messages.send': {
		riskLevel: 'destructive',
		description:
			'Bulk Message -- Send. Sends a bulk message to multiple recipients (up to 50). This endpoint allows you to send the same message to multiple phone numbers. All existing logic (including spam checks, delivery behavior, and visibility in the Bulk Messages UI tab) will remain the same for API-triggered sends. **Important**: Message sending is asynchronous. This endpoint creates the bulk message batch and returns immediately with success=True, indicating the batch was created successfully. Individual messages are sent in the background. To check the delivery status of individual recipients, use the GET /message/bulk/{id} endpoint to retrieve the batch with delivery status information (attempted_send, error_message, delivery_status fields per recipient). Rate limit: 1200 per minute.',
	},
	'scheduled_messages.create': {
		riskLevel: 'destructive',
		description:
			'Schedule -- Create. Creates a new scheduled message that will be sent at the specified time. Messages can be sent to multiple phone numbers OR to a Dialpad channel. Supports both SMS (text only) and MMS (text with media attachments). Rate limit: 1200 per minute.',
	},
	'scheduled_messages.delete': {
		riskLevel: 'destructive',
		description:
			'Schedule -- Delete. Deletes (cancels) a scheduled message. The message will not be sent. Rate limit: 1200 per minute.',
	},
	'bulk_messages.update': {
		riskLevel: 'write',
		description:
			'Bulk Message -- Update. Updates a bulk message text and/or media. Supports partial updates. Only the fields provided in the request will be updated. Fields not provided will retain their existing values. This follows PATCH semantics. Rate limit: 1200 per minute.',
	},
	'bulk_messages.list': {
		riskLevel: 'read',
		description:
			'Bulk Message -- List. Lists all bulk messages for the authenticated user. Results can be paginated using the cursor parameter. Rate limit: 1200 per minute.',
	},
	'scheduled_messages.list': {
		riskLevel: 'read',
		description:
			'Schedule -- List. Lists all active scheduled messages for the authenticated user. Only active (pending) schedules are returned. Deleted or sent schedules are not included. Results can be paginated using the cursor parameter. Rate limit: 1200 per minute.',
	},
	'numbers.unassign': {
		riskLevel: 'destructive',
		description:
			'Dialpad Number -- Unassign. Un-assigns a phone number from its target. This does not delete the number: it returns to the company\'s reserved pool if one exists, and can be reassigned later. Pass "release" to give the number up entirely instead, which cannot be undone. Rate limit: 1200 per minute.',
	},
	'scheduled_messages.get': {
		riskLevel: 'read',
		description:
			'Schedule -- Get. Gets a single scheduled message by ID. Rate limit: 1200 per minute.',
	},
	'numbers.assign': {
		riskLevel: 'destructive',
		description:
			'Dialpad Number -- Assign. Assigns a specific phone number to a target. Use this when the number to assign is already known; use the auto-assign endpoint to let Dialpad pick one. Valid targets are a user or department, an office, room, callcenter, callrouter, staffgroup, channel or coachinggroup. Rate limit: 1200 per minute.',
	},
	'scheduled_messages.send_now': {
		riskLevel: 'destructive',
		description:
			'Schedule -- Send Now. Immediately sends a scheduled message and deletes the schedule. This is useful for testing or when you want to send a scheduled message before its scheduled time. Rate limit: 1200 per minute.',
	},
	'numbers.list': {
		riskLevel: 'read',
		description:
			'Dialpad Number -- List. Lists the phone numbers in your company, each with its type, area code, status and the target it is assigned to. Filter by status to find numbers in a particular state, or by area code to find numbers in a particular region. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'numbers.auto_assign': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Auto-Assign. Assigns an automatically selected phone number to a target and returns the number that was chosen. The number is taken from the company's reserved pool if one exists, otherwise a new number is allocated from the provided area code. Use the assign endpoint instead when a specific number is required. Target includes user, department, office, room, callcenter and callrouter, plus staffgroup, channel and coachinggroup. Rate limit: 1200 per minute.",
	},
	'numbers.swap': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Swap. Replaces a target's primary phone number with a different one and returns the new number. The old number is released. How the replacement is chosen depends on swap_details: give a specific number to swap to that number (it must already be in the company's reserved pool, and the company must have the reserved_pool experiment enabled), give an area code to take an available number from that area code, or omit swap_details to have one chosen automatically from the reserved pool, falling back to the target's office area code. Rate limit: 1200 per minute.",
	},
	'number_tags.update': {
		riskLevel: 'write',
		description:
			'Number Tags -- Update tags for a phone number.. Sets the contact preferences for a phone number company-wide. "do_not_call" blocks outbound calls to the number and "do_not_text" blocks outbound texts. Returns the resulting preferences. Either preference can be turned back off by sending the opposite value. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'scheduled_messages.update': {
		riskLevel: 'write',
		description:
			'Schedule -- Update. Updates an existing scheduled message. Supports partial updates. Only the fields provided in the request will be updated. Fields not provided will retain their existing values. This follows PATCH semantics. Rate limit: 1200 per minute.',
	},
	'numbers.get': {
		riskLevel: 'read',
		description:
			'Dialpad Number -- Get. Gets the details of a single phone number: its type, area code, status, and the target it is assigned to. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'coaching_team.list': {
		riskLevel: 'read',
		description:
			'Coaching Team -- List. Get a list of coaching teams of a office. Rate limit: 1200 per minute.',
	},
	'office_plan.get': {
		riskLevel: 'read',
		description:
			"Billing Plan -- Get. Gets an office's billing plan: how many licenses of each line type the office has purchased, its remaining calling-credit balance, and the start of the next billing cycle. This reports licenses that are paid for, not how many are free to assign. Rate limit: 1200 per minute.",
	},
	'phone_number.format': {
		riskLevel: 'write',
		description:
			'Phone String -- Reformat. Converts a phone number between local and E.164 format. Returns the E.164 number, the formatted local number, the area code, and the ISO country code. Rate limit: 1200 per minute.',
	},
	'departments.list': {
		riskLevel: 'read',
		description:
			'Department -- List. Gets all the departments for an office. Rate limit: 1200 per minute.',
	},
	'numbers.office_unassign_number.post': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Unassign. Un-assigns a phone number from a office mainline. The number will be returned to the company's reserved pool if there is one. Otherwise the number will be released. Rate limit: 1200 per minute.",
	},
	'callcenters.list': {
		riskLevel: 'read',
		description:
			'Call Centers -- List. Gets all the call centers for an office. Rate limit: 1200 per minute.',
	},
	'numbers.assign_office_number.post': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Assign. Assigns a number to a office. The number will automatically be taken from the company's reserved pool if there are reserved numbers, otherwise a number will be auto-assigned from the provided area code. Rate limit: 1200 per minute.",
	},
	'available_licenses.list': {
		riskLevel: 'read',
		description:
			'Licenses -- List Available. Gets how many licenses of each line type an office has purchased but not yet assigned, so a count of zero for a line type means a new user or room of that type cannot be added without buying more. Rate limit: 1200 per minute.',
	},
	'offices.e911.get': {
		riskLevel: 'read',
		description:
			'E911 Address -- Get. Gets E911 address of the office by office id. Rate limit: 1200 per minute.',
	},
	'offices.offdutystatuses.get': {
		riskLevel: 'read',
		description:
			'Off-Duty Status -- List. Lists Off-Duty status values. Rate limit: 1200 per minute.',
	},
	'offices.e911.update': {
		riskLevel: 'write',
		description:
			'E911 Address -- Update. Update E911 address of the given office. Rate limit: 1200 per minute.',
	},
	'offices.update': {
		riskLevel: 'write',
		description:
			"Office -- Update. Updates an office's business hours. Only the hours-of-operation fields listed below can be changed here -- name, billing and routing settings are not editable through this endpoint. Rate limit: 1200 per minute.",
	},
	'offices.get': {
		riskLevel: 'read',
		description:
			'Office -- Get. Gets an office by id. Rate limit: 1200 per minute.',
	},
	'offices.primary.get': {
		riskLevel: 'read',
		description:
			'Office -- Get Primary. Gets the primary office for the company. Rate limit: 1200 per minute.',
	},
	'offices.list': {
		riskLevel: 'read',
		description:
			'Office -- List. Gets the offices in the company. The result set depends on the caller: company admins get every office, while a user-level key gets only the offices that user belongs to. Rate limit: 1200 per minute.',
	},
	'offices.operators.delete': {
		riskLevel: 'destructive',
		description:
			"Operator -- Remove. Removes an operator from office's mainline. Rate limit: 1200 per minute.",
	},
	'offices.create': {
		riskLevel: 'destructive',
		description:
			"Office -- Create. Creates a secondary office. This provisions a billed entity: currency, plan period and a billing address are all required, and the new office counts against the company's office limit. There is no corresponding delete endpoint, so an office created here can only be removed by support. Rate limit: 1200 per minute.",
	},
	'offices.operators.get': {
		riskLevel: 'read',
		description:
			'Operator -- List. Gets mainline operators for an office. Rate limit: 1200 per minute.',
	},
	'offices.operators.post': {
		riskLevel: 'write',
		description:
			"Operator -- Add. Adds an operator into office's mainline. Rate limit: 1200 per minute.",
	},
	'recording_share_link.create': {
		riskLevel: 'write',
		description:
			'Recording Sharelink -- Create. Creates a recording share link. Rate limit: 100 per minute.',
	},
	'recording_share_link.get': {
		riskLevel: 'read',
		description:
			'Recording Sharelink -- Get. Gets a recording share link by id. Rate limit: 1200 per minute.',
	},
	'numbers.assign_room_number.post': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Assign. Assigns a number to a room. The number will automatically be taken from the company's reserved block if there are reserved numbers, otherwise a number will be auto-assigned from the provided area code. Rate limit: 1200 per minute.",
	},
	'numbers.room_unassign_number.post': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Unassign. Un-assigns a phone number from a room. The number will be returned to the company's reserved pool if there is one. Otherwise the number will be released. Rate limit: 1200 per minute.",
	},
	'rooms.delete': {
		riskLevel: 'destructive',
		description:
			'Room -- Delete. Deletes a room by id. Rate limit: 1200 per minute.',
	},
	'rooms.get': {
		riskLevel: 'read',
		description: 'Room -- Get. Gets a room by id. Rate limit: 1200 per minute.',
	},
	'recording_share_link.delete': {
		riskLevel: 'destructive',
		description:
			'Recording Sharelink -- Delete. Deletes a recording share link by id. Rate limit: 1200 per minute.',
	},
	'rooms.post': {
		riskLevel: 'write',
		description:
			'Room -- Create. Creates a new room. Rate limit: 1200 per minute.',
	},
	'recording_share_link.update': {
		riskLevel: 'write',
		description:
			'Recording Sharelink -- Update. Updates a recording share link by id. Rate limit: 100 per minute.',
	},
	'deskphones.rooms.create_international_pin': {
		riskLevel: 'write',
		description:
			'Room Phone -- Assign PIN. Assigns a PIN for making international calls from rooms When PIN protected international calls are enabled for the company, a PIN is required to make international calls from room phones. Requires a company admin API key. Rate limit: 1200 per minute.',
	},
	'rooms.list': {
		riskLevel: 'read',
		description:
			'Room -- List. Gets all rooms in your company, optionally filtering by office. Rate limit: 1200 per minute.',
	},
	'deskphones.rooms.get': {
		riskLevel: 'read',
		description:
			'Room Phone -- Get. Gets a room desk phone by id. Rate limit: 1200 per minute.',
	},
	'rooms.patch': {
		riskLevel: 'write',
		description:
			'Room -- Update. Updates room details by id. Rate limit: 1200 per minute.',
	},
	'deskphones.rooms.list': {
		riskLevel: 'read',
		description:
			'Room Phone -- List. Gets all desk phones under a room. Rate limit: 1200 per minute.',
	},
	'deskphones.rooms.delete': {
		riskLevel: 'destructive',
		description:
			'Room Phone -- Delete. Deletes a room desk phone by id. Rate limit: 1200 per minute.',
	},
	'schedule_reports.update': {
		riskLevel: 'write',
		description:
			'Schedule reports -- Update. Updates a schedule report subscription by id. A schedule report is a mechanism to schedule daily, weekly or monthly record and statistics reports. Rate limit: 1200 per minute.',
	},
	'schedule_reports.create': {
		riskLevel: 'write',
		description:
			'schedule reports -- Create. Creates a schedule reports subscription for your company. An endpoint_id is required in order to receive the event payload and can be obtained via websockets or webhooks. A schedule reports is a mechanism to schedule daily, weekly or monthly record and statistics reports. Rate limit: 1200 per minute.',
	},
	'schedule_reports.get': {
		riskLevel: 'read',
		description:
			'Schedule reports -- Get. Gets a schedule report subscription by id. A schedule report is a mechanism to schedule daily, weekly or monthly record and statistics reports. Rate limit: 1200 per minute.',
	},
	'scorecards.export.get': {
		riskLevel: 'read',
		description:
			'Scorecards export -- Get Result. Gets the progress and result of a scorecards report request. Rate limit: 1200 per minute.',
	},
	'scorecards.export.create': {
		riskLevel: 'write',
		description:
			'Scorecards export -- Initiate Processing. Begins processing a scorecards export asynchronously, returning a request id to get the status and retrieve the results by calling GET /scorecards/export/{request_id}. Scorecards for the whole company will be processed by default. A target_id and target_type can be provided to limit the export to a single target. Rate limit: 250 per minute.',
	},
	'scorecards.get': {
		riskLevel: 'read',
		description:
			'Scorecards -- Get. Gets a scorecard by id. Rate limit: 1200 per minute.',
	},
	'scorecards.list': {
		riskLevel: 'read',
		description:
			'Scorecards -- List. Gets a list of scorecards of a target. Rate limit: 1200 per minute.',
	},
	'schedule_reports.delete': {
		riskLevel: 'destructive',
		description:
			'Schedule reports -- Delete. Deletes a schedule report subscription by id. A schedule report is a mechanism to schedule daily, weekly or monthly record and statistics reports. Rate limit: 1200 per minute.',
	},
	'schedule_reports.list': {
		riskLevel: 'read',
		description:
			'Schedule reports -- List. Lists all schedule reports subscription for a company. A schedule report is a mechanism to schedule daily, weekly or monthly record and statistics reports. Rate limit: 1200 per minute.',
	},
	'stats.export.create': {
		riskLevel: 'write',
		description:
			'Stats -- Initiate Processing. Begins processing statistics asynchronously, returning a request id to get the status and retrieve the results by calling GET /stats/{request_id}. Stats for the whole company will be processed by default. An office_id can be provided to limit stats to a single office. A target_id and target_type can be provided to limit stats to a single target. Rate limit: 200 per hour.',
	},
	'stats.export.get': {
		riskLevel: 'read',
		description:
			'Stats -- Get Result. Gets the progress and result of a statistics request. Rate limit: 1200 per minute.',
	},
	'sms.send': {
		riskLevel: 'destructive',
		description:
			"SMS -- Send. Sends an SMS message to a phone number or to a Dialpad channel on behalf of a user. Provide either to_numbers or channel_hashtag as the recipient, and either text or media as the content. A channel's hashtag is available from the channel endpoints. Tier 0 Rate limit: 100 per minute. Tier 1 Rate limit: 800 per minute.",
	},
	'users.initiate_call': {
		riskLevel: 'destructive',
		description:
			"Call -- Initiate. Causes a user's Dialpad application to initiate an outbound call. Note that the user must have at least one active autocallable device (the web or desktop Dialpad app, or a CTI application). The Dialpad mobile apps and physical deskphones do not support this API call. Rate limit: 5 per minute.",
	},
	'users.toggle_call_vi': {
		riskLevel: 'write',
		description:
			"Call VI -- Toggle. Turns Voice Intelligence (live transcription and real-time assist) on or off for the user's currently active call, optionally setting the transcription locale. Fails if the user has no active call. Reversible by calling again. Rate limit: 1200 per minute.",
	},
	'userdevices.get': {
		riskLevel: 'read',
		description:
			'User Device -- Get. Get details of a specific device including its type, display name, phone number, and registration dates. Rate limit: 1200 per minute.',
	},
	'transcripts.get': {
		riskLevel: 'read',
		description:
			'Call Transcript -- Get. Gets the Dialpad AI transcript of a call, including moments. Rate limit: 1200 per minute.',
	},
	'userdevices.list': {
		riskLevel: 'read',
		description:
			'User Device -- List. List registered devices for a user, including desk phones, softphones, and mobile apps. Returns device type, display name, phone number, and registration dates. Rate limit: 1200 per minute.',
	},
	'users.toggle_call_recording': {
		riskLevel: 'write',
		description:
			"Call Recording -- Toggle. Turns call recording on or off for a user's active call. Rate limit: 1200 per minute.",
	},
	'transcripts.get_url': {
		riskLevel: 'read',
		description:
			'Call Transcript -- Get URL. Gets the transcript url of a call. Rate limit: 1200 per minute.',
	},
	'users.set_caller_id': {
		riskLevel: 'write',
		description:
			'Caller ID -- Set. Set Caller ID for a given user ID. Rate limit: 1200 per minute.',
	},
	'deskphones.users.delete': {
		riskLevel: 'destructive',
		description:
			'Desk Phone -- Delete. Deletes a user desk phone by id. Rate limit: 1200 per minute.',
	},
	'caller_id.users.get': {
		riskLevel: 'read',
		description:
			'Caller ID -- Get. List all available Caller IDs and the active Caller ID for a given user ID Rate limit: 1200 per minute.',
	},
	'deskphones.users.get': {
		riskLevel: 'read',
		description:
			'Desk Phone -- Get. Gets a user desk phone by id. Rate limit: 1200 per minute.',
	},
	'users.e911.update': {
		riskLevel: 'write',
		description:
			'E911 Address -- Update. Update E911 address of the given user. Rate limit: 1200 per minute.',
	},
	'users.toggle_dnd': {
		riskLevel: 'write',
		description:
			'Do Not Disturb -- Toggle. Toggle DND status on or off for the given user. Rate limit: 1200 per minute.',
	},
	'users.unassign_number': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Unassign. Un-assigns a phone number from a user. The number will be returned to the company's reserved block if there is one. Otherwise the number will be released. Rate limit: 1200 per minute.",
	},
	'users.assign_number': {
		riskLevel: 'destructive',
		description:
			"Dialpad Number -- Assign. Assigns a number to a user. The number will automatically be taken from the company's reserved block if there are reserved numbers, otherwise a number will be auto-assigned from the provided area code. Rate limit: 1200 per minute.",
	},
	'users.list_personas': {
		riskLevel: 'read',
		description:
			'Persona -- List. Provides a list of personas for a user. A persona is a target that a user can make calls from. The receiver of the call will see the details of the persona rather than the user. Rate limit: 1200 per minute.',
	},
	'users.e911.get': {
		riskLevel: 'read',
		description:
			'E911 Address -- Get. Gets E911 address of the user by user id. Rate limit: 1200 per minute.',
	},
	'deskphones.users.list': {
		riskLevel: 'read',
		description:
			'Desk Phone -- List. Gets all desk phones under a user. Rate limit: 1200 per minute.',
	},
	'screen_pop.initiate': {
		riskLevel: 'write',
		description:
			"Screen-pop -- Trigger. Opens the given URI on the user's active Dialpad device, so an agent sees the relevant record (CRM contact, ticket, order) without searching for it. Returns the device the pop was delivered to. Requires the `screen_pop` OAuth scope. Requires scope: ``screen_pop`` Rate limit: 5 per minute.",
	},
	'users.delete': {
		riskLevel: 'destructive',
		description:
			'User -- Delete. Deletes a user by id. Rate limit: 1200 per minute.',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'User -- Get. Get a user by id. Returns identity (name, email, job_title), contact details (phone_numbers, extension), status (state, do_not_disturb, is_on_duty, on_duty_status), license type, office membership (office_id, group_details), and voicemail settings. Rate limit: 1200 per minute.',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'User -- List. Gets company users, optionally filtering by email. NOTE: The `limit` parameter has been soft-deprecated. Please omit the `limit` parameter, or reduce it to `100` or less. - Limit values of greater than `100` will only produce a page size of `100`, and a `400 Bad Request` response will be produced 20% of the time in an effort to raise visibility of side-effects that might otherwise go un-noticed by solutions that had assumed a larger page size. - The `cursor` value is provided in the response, and can be passed as a parameter to retrieve subsequent pages of results. Rate limit: 1200 per minute.',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'User -- Update. Updates the provided fields for an existing user. Rate limit: 1200 per minute.',
	},
	'users.create': {
		riskLevel: 'destructive',
		description:
			'User -- Create. Creates a new user. Rate limit: 1200 per minute.',
	},
	'users.move_office': {
		riskLevel: 'destructive',
		description:
			"User -- Switch Office. Moves the user to a different office. For international offices only, all of the user's numbers will be unassigned and a new number will be assigned except when the user only has internal numbers starting with 803 -- then the numbers will remain unchanged. Admin can also assign numbers via the user assign number API after. Only supported on paid accounts and there must be enough licenses to transfer the user to the destination office. Rate limit: 1200 per minute.",
	},
	'users.create_batch': {
		riskLevel: 'destructive',
		description:
			'User -- Create Batch. Creates up to 25 users in one call, for example to invite a team. Each user is created independently with the same rules as creating a single user, so a failure does not undo the users that were created before it. The response has one result per requested user, in the order sent, with either the created user or the reason it was not created. The reason code no_seats_available means the office has no free license of the type the user would consume. An unexpected server error ends the whole call with a 503 and no per-user results, and the users created before it stay created. Rate limit: 1200 per minute.',
	},
	'users.update_status': {
		riskLevel: 'write',
		description:
			"User Status -- Update. Update user's status. Returns the user's status if the user exists. Rate limit: 1200 per minute.",
	},
	'search.users': {
		riskLevel: 'read',
		description:
			'User -- Search. Searches for users matching a specific criteria. It matches phone numbers, emails, or name. Optionally, it accepts filters to reduce the amount of final results. - The `cursor` value is provided in the response, and can be passed as a parameter to retrieve subsequent pages of results. Rate limit: 1200 per minute.',
	},
	'websockets.get': {
		riskLevel: 'read',
		description:
			'Websocket -- Get. Gets a websocket by id. Rate limit: 1200 per minute.',
	},
	'websockets.list': {
		riskLevel: 'read',
		description:
			'Websocket -- List. Gets a list of all the websockets that are associated with the company. Rate limit: 1200 per minute.',
	},
	'websockets.create': {
		riskLevel: 'write',
		description:
			'Websocket -- Create. Creates a new websocket for your company. A unique websocket ID will be generated when successfully creating a websocket. A websocket ID is to be required when creating event subscriptions. One websocket ID can be shared between multiple event subscriptions. When triggered, events will be accessed through provided websocket_url under websocket. The url will be expired after 1 hour. Please use the GET websocket API to regenerate url rather than creating new ones. If a secret is provided, the websocket events will be encoded and signed in the JWT format using the shared secret with the HS256 algorithm. The JWT payload should be decoded and the signature verified to ensure that the event came from Dialpad. If no secret is provided, unencoded events will be sent in the JSON format. It is recom',
	},
	'meetings.conference-meetings.list': {
		riskLevel: 'read',
		description:
			'Meeting Summary -- List. Lists summaries of meetings that have occurred in the specified meeting room. Requires scope: ``conference:read`` Rate limit: 1200 per minute.',
	},
	'meetings.conference-rooms.list': {
		riskLevel: 'read',
		description:
			'Meeting Room -- List. Lists all conference rooms. Requires scope: ``conference:read`` Rate limit: 1200 per minute.',
	},
	'websockets.update': {
		riskLevel: 'write',
		description:
			'Websocket -- Update. Updates a websocket by id. Rate limit: 1200 per minute.',
	},
	'meetings.meetings.get': {
		riskLevel: 'read',
		description:
			'Dialpad Meeting -- Get. Gets a Dialpad meeting. Requires scope: ``conference:all`` Rate limit: 1200 per minute.',
	},
	'websockets.delete': {
		riskLevel: 'destructive',
		description:
			'Websocket -- Delete. Deletes a websocket by id. Rate limit: 1200 per minute.',
	},
	'meetings.meetings.update': {
		riskLevel: 'write',
		description:
			'Dialpad Meeting -- Update. Updates a Dialpad meeting. Requires scope: ``conference:all`` Rate limit: 1200 per minute.',
	},
	'meetings.meetings.delete': {
		riskLevel: 'destructive',
		description:
			'Dialpad Meeting -- Delete. Deletes a Dialpad meeting. Requires scope: ``conference:all`` Rate limit: 1200 per minute.',
	},
	'meetings.meetings.create': {
		riskLevel: 'write',
		description:
			'Dialpad Meeting -- Create. Creates a Dialpad meeting. Requires scope: ``conference:all`` Rate limit: 1200 per minute.',
	},
	'meetings.meetings.room.create': {
		riskLevel: 'write',
		description:
			'Meeting Room -- Create. Creates a meeting room (personal or unique meeting). Requires scope: ``conference:all`` Rate limit: 1200 per minute.',
	},
	'wfm.wfm-metrics-activity.get': {
		riskLevel: 'read',
		description:
			'Activity Metrics. Returns paginated, activity-level metrics for specified agents. Rate limit: 1200 per minute.',
	},
	'wfm.wfm-metrics-agent.get': {
		riskLevel: 'read',
		description:
			'Agent Metrics. Returns paginated, detailed agent-level performance metrics. Rate limit: 1200 per minute.',
	},
	'meetings.meetings.list': {
		riskLevel: 'read',
		description:
			'Dialpad Meeting -- List. Lists all Dialpad meetings for a specified user. Requires scope: ``conference:all`` Rate limit: 1200 per minute.',
	},
	'powerdialer.getModelsByKeys': {
		riskLevel: 'read',
		description:
			'Bulk fetch entities by short keys. Bulk fetch entity short keys by comma-delimited url params',
	},
	'powerdialer.getAblyToken': {
		riskLevel: 'read',
		description: 'Ably Auth Endpoint. Auth endpoint for ably js client',
	},
	'powerdialer.getContact': {
		riskLevel: 'read',
		description: 'Get a Contact. Get a Contact',
	},
	'powerdialer.getModelsByKeysOfKind': {
		riskLevel: 'read',
		description:
			'Bulk fetch entities of a single kind by short keys. Bulk fetch entities of a single kind by a list of ids or short keys',
	},
	'powerdialer.deleteModelsByKeysOfKind': {
		riskLevel: 'destructive',
		description:
			'Bulk delete entities of a single kind by short keys. Bulk delete entities of a single kind by a list of ids or short keys',
	},
	'powerdialer.createCustomProperties': {
		riskLevel: 'write',
		description:
			'Create or Update Custom Properties. Create or update custom properties in bulk. Uses upsert semantics: if a property with the same name already exists, it will be updated with the new values. Otherwise, a new property will be created. Property names must contain only alphanumeric characters and underscores.',
	},
	'powerdialer.getCustomProperties': {
		riskLevel: 'read',
		description:
			'List Custom Properties. Get a list of custom properties for the company',
	},
	'powerdialer.getCustomProperty': {
		riskLevel: 'read',
		description: 'Get Custom Property. Get a single custom property by id',
	},
	'powerdialer.updateCustomProperty': {
		riskLevel: 'write',
		description: 'Update Custom Property. Update a custom property',
	},
	'powerdialer.getDialpadOAuthService': {
		riskLevel: 'read',
		description:
			'Get Dialpad OAuth Service. Get a Dialpad OAuth Service record by service name',
	},
	'powerdialer.updateGlobalSettings': {
		riskLevel: 'write',
		description:
			'Update Company GlobalSettings. Update company GlobalSettings entity',
	},
	'powerdialer.deleteCustomProperty': {
		riskLevel: 'destructive',
		description: 'Delete Custom Property. Delete a custom property',
	},
	'powerdialer.getGlobalSettings': {
		riskLevel: 'read',
		description:
			'Get Company GlobalSettings. Get company GlobalSettings with only modified fields',
	},
	'powerdialer.getEventLogs': {
		riskLevel: 'read',
		description: "Get EventLogs. Get a list of EventLog's for a Campaign",
	},
	'powerdialer.getJobs': {
		riskLevel: 'read',
		description:
			'List Jobs. Get all background Jobs for the company, newest first',
	},
	'powerdialer.getJob': {
		riskLevel: 'read',
		description:
			'Get Job. Get a single Job by ID, including its reduced results',
	},
	'powerdialer.getApiKey': {
		riskLevel: 'read',
		description:
			"Get API Key. Get a key by its id (the token's hash). The token itself is not returned",
	},
	'powerdialer.getApiKeys': {
		riskLevel: 'read',
		description:
			"List API Keys. List the keys issued for the company. Tokens are never returned - each key is identified by `id` (the token's hash) and `token` is its tail. Admins see every key, everyone else only keys acting as themselves",
	},
	'powerdialer.getOperator': {
		riskLevel: 'read',
		description: 'Get Operator. Get a list of Operators',
	},
	'powerdialer.getLogin': {
		riskLevel: 'read',
		description:
			'Initial endpoint to hit after oauth. Returns all initial values for user, company, config, etc',
	},
	'powerdialer.deleteApiKey': {
		riskLevel: 'destructive',
		description: 'Delete API Key. Revoke a key',
	},
	'powerdialer.updateApiKey': {
		riskLevel: 'write',
		description: 'Update API Key. Rename a key',
	},
	'powerdialer.postLogin': {
		riskLevel: 'write',
		description:
			"Login with a Dialpad access token. Establishes a browser session from a Dialpad access token bearer: sets the session cookie and returns the login json (Dialpad's raw payload with raw=1)",
	},
	'powerdialer.createApiKey': {
		riskLevel: 'write',
		description:
			'Create API Key. Issue a key acting as the caller, or as a service account (admins only). This is the only response that ever includes the secret, as `token_full` - store it',
	},
	'powerdialer.createServiceAccount': {
		riskLevel: 'write',
		description:
			"Create Service Account. Create a service account with a role ('admin' or 'read_only'). Company admins only",
	},
	'powerdialer.getServiceAccount': {
		riskLevel: 'read',
		description: 'Get Service Account. Get a single service account by id',
	},
	'powerdialer.updateServiceAccount': {
		riskLevel: 'write',
		description:
			'Update Service Account. Rename a service account or change its role. Company admins only',
	},
	'powerdialer.deleteServiceAccount': {
		riskLevel: 'destructive',
		description:
			"Delete Service Account. Delete a service account and revoke every key issued for it. The company's default account cannot be deleted. Company admins only",
	},
	'powerdialer.getSmsForTarget': {
		riskLevel: 'read',
		description:
			'Get Sms List for a Target. DEBUG: Get a list of recent sms given a Target',
	},
	'powerdialer.smsItem': {
		riskLevel: 'destructive',
		description:
			'Send SMS. DEBUG: Send a text message through dialpad for a given LeadListItem',
	},
	'powerdialer.getServiceAccounts': {
		riskLevel: 'read',
		description:
			"List Service Accounts. Get the company's service accounts - non-human principals that api keys can be issued for and that author the entities they create",
	},
	'powerdialer.getCurrentUser': {
		riskLevel: 'read',
		description: 'The Current User. JSON representation of the logged in user',
	},
	'powerdialer.getWorker': {
		riskLevel: 'read',
		description: 'Get a Worker. Get a Worker',
	},
	'powerdialer.updateWorker': {
		riskLevel: 'write',
		description: 'Update Worker. Update a Worker',
	},
	'powerdialer.getWorkers': {
		riskLevel: 'read',
		description: 'Get Workers. Get a list of Workers for a Campaign',
	},
	'powerdialer.createAudience': {
		riskLevel: 'write',
		description: 'Create an Audience. Create an Audience',
	},
	'powerdialer.getAudiences': {
		riskLevel: 'read',
		description: 'Get Audiences. Get a list of Audiences',
	},
	'powerdialer.updateAudience': {
		riskLevel: 'write',
		description: 'Update an Audience. Update an Audience name and/or query',
	},
	'powerdialer.getAudience': {
		riskLevel: 'read',
		description: 'Get Audience. Get a single Audience by id',
	},
	'powerdialer.createBot': {
		riskLevel: 'write',
		description: 'Create Bot. Create a new Bot representing a kare widget',
	},
	'powerdialer.duplicateAudience': {
		riskLevel: 'write',
		description:
			'Duplicate an Audience. Create a new audience from an existing one',
	},
	'powerdialer.getBots': {
		riskLevel: 'read',
		description: 'List Bots. Get all Bots (kare widgets) for the company',
	},
	'powerdialer.updateBot': {
		riskLevel: 'write',
		description: "Update Bot. Update a Bot's name or kare ids",
	},
	'powerdialer.deleteAudience': {
		riskLevel: 'destructive',
		description: 'Delete an Audience. Delete a Audience',
	},
	'powerdialer.deleteBot': {
		riskLevel: 'destructive',
		description: 'Delete Bot. Delete a Bot',
	},
	'powerdialer.getBot': {
		riskLevel: 'read',
		description: 'Get Bot. Get a single Bot by ID',
	},
	'powerdialer.getBotDialogs': {
		riskLevel: 'read',
		description:
			'List Bot Dialogs. Get all BotDialogs for the company, optionally filtered by bot_id',
	},
	'powerdialer.createBotDialog': {
		riskLevel: 'write',
		description:
			'Create Bot Dialog. Create a pending BotDialog and start the dialog job: init a kare converse conversation, connect its websocket, and send `text` as the first message',
	},
	'powerdialer.deleteBotDialog': {
		riskLevel: 'destructive',
		description:
			'Delete Bot Dialog. Delete a BotDialog and all of its messages',
	},
	'powerdialer.getBotMessages': {
		riskLevel: 'read',
		description:
			'List Bot Messages. Get the transcript of a BotDialog, oldest message first',
	},
	'powerdialer.createBotMessage': {
		riskLevel: 'write',
		description:
			'Create Bot Message. Queue a new user message on an open BotDialog. The dialog job sends pending messages into the socket and marks them sent.',
	},
	'powerdialer.deleteBotMessage': {
		riskLevel: 'destructive',
		description: 'Delete Bot Message. Delete a BotMessage',
	},
	'powerdialer.getBotMessage': {
		riskLevel: 'read',
		description: 'Get Bot Message. Get a single BotMessage by ID',
	},
	'powerdialer.updateBotDialog': {
		riskLevel: 'write',
		description:
			'Update Bot Dialog. Perform an action on a BotDialog, e.g. end it without deleting',
	},
	'powerdialer.getCampaigns': {
		riskLevel: 'read',
		description:
			'List of Campaigns. Fetch a list of Campaign entities assoicated with the company',
	},
	'powerdialer.searchCampaigns': {
		riskLevel: 'write',
		description:
			'Search Campaigns with POST. POST version of /api/campaign - supports large lists and date range filtering',
	},
	'powerdialer.deleteCampaign': {
		riskLevel: 'destructive',
		description: 'Delete Campaign. Delete a campaign entity',
	},
	'powerdialer.createCampaign': {
		riskLevel: 'write',
		description:
			'Create Campaign. Create a new Campaign associated with a Dialpad Target',
	},
	'powerdialer.getCampaign': {
		riskLevel: 'read',
		description: 'Get Campaign. Get an individual Campaign',
	},
	'powerdialer.updateCampaign': {
		riskLevel: 'destructive',
		description:
			'Update Campaign. Update a Campaign like starting, resetting, etc',
	},
	'powerdialer.duplicateCampaign': {
		riskLevel: 'write',
		description:
			'Duplicate a Campaign. Create a new campaign from an existing one',
	},
	'powerdialer.getCampaignResultExportUrl': {
		riskLevel: 'read',
		description:
			'Get campaign result export url. Get a presigned url to download campaign result export',
	},
	'powerdialer.createCampaignGroup': {
		riskLevel: 'write',
		description: 'Create Campaign Group. Create Campaign Group',
	},
	'powerdialer.deleteCampaignGroup': {
		riskLevel: 'destructive',
		description:
			'Delete Campaign Group, unlink member campaigns. Delete Campaign Group, unlink member campaigns',
	},
	'powerdialer.getCampaignGroup': {
		riskLevel: 'read',
		description: 'Get A Campaign Group. Get A Campaign Group',
	},
	'powerdialer.getCampaignGroups': {
		riskLevel: 'read',
		description: 'List Campaign Groups. List Campaign Groups',
	},
	'powerdialer.startCampaignResultExport': {
		riskLevel: 'write',
		description:
			'Start a campaign result export job. Start a campaign result export job',
	},
	'powerdialer.getCampaignSettings': {
		riskLevel: 'read',
		description: 'Get a Campaign Settings object. Settings for a Campaign',
	},
	'powerdialer.updateCampaignGroup': {
		riskLevel: 'write',
		description: 'Update Campaign Group. Update Campaign Group',
	},
	'powerdialer.editCampaignSettings': {
		riskLevel: 'write',
		description:
			'Edit Settings for a Campaign. Edit a Campaign Settings object',
	},
	'powerdialer.deleteCsv': {
		riskLevel: 'destructive',
		description: 'Delete CSV. Delete a Csv Entity',
	},
	'powerdialer.getCsvPresignedUrl': {
		riskLevel: 'read',
		description:
			'Generate a presigned url to download a CSV file with TTL=30s. Generate a presigned url to download a CSV file with TTL=30s',
	},
	'powerdialer.updateCsv': {
		riskLevel: 'write',
		description: 'Update CSV. Update a CSV with a mapping, labels, name, etc',
	},
	'powerdialer.getVarsInfo': {
		riskLevel: 'read',
		description:
			'Get auto-complete variable info. Auto-complete variable info belonging to a campaign with campaign id',
	},
	'powerdialer.getCsv': {
		riskLevel: 'read',
		description: 'Get CSV. Get an individual CSV entity',
	},
	'powerdialer.getPhoneCsvs': {
		riskLevel: 'read',
		description: 'Get List of Phone CSVs. Get a list of PhoneCsv entities',
	},
	'powerdialer.getCsvs': {
		riskLevel: 'read',
		description: 'Get List of CSVs. Get a list of Csv entities',
	},
	'powerdialer.getPhoneCsv': {
		riskLevel: 'read',
		description: 'Get Phone CSV. Get an individual Phone CSV entity',
	},
	'powerdialer.updatePhoneCsv': {
		riskLevel: 'write',
		description:
			'Update Phone CSV. Update a Phone CSV with a mapping, labels, name, etc',
	},
	'powerdialer.deletePhoneCsv': {
		riskLevel: 'destructive',
		description: 'Delete Phone CSV. Delete a Phone Csv Entity',
	},
	'powerdialer.createLeadList': {
		riskLevel: 'write',
		description: 'Create a shared LeadList. Create a new shared LeadList',
	},
	'powerdialer.getBotDialog': {
		riskLevel: 'read',
		description: 'Get Bot Dialog. Get a single BotDialog by ID',
	},
	'powerdialer.getListItems': {
		riskLevel: 'read',
		description:
			'List of LeadListItem. List of LeadListItem belonging to a Campaign',
	},
	'powerdialer.deleteLeadListItem': {
		riskLevel: 'destructive',
		description: 'Delete a LeadListItem. Delete a LeadListItem',
	},
	'powerdialer.getListList': {
		riskLevel: 'read',
		description: 'Get a LeadList. Get a LeadList',
	},
	'powerdialer.getLeadListItem': {
		riskLevel: 'read',
		description: 'Get a LeadListItem. Get a single LeadListItem by id',
	},
	'powerdialer.deleteLeadList': {
		riskLevel: 'destructive',
		description:
			'Delete a LeadList. Delete a shared LeadList and its associated Audiences and StaticLists',
	},
	'powerdialer.duplicateLeadList': {
		riskLevel: 'write',
		description:
			'Duplicate a LeadList. Create a new shared LeadList from an existing one, including duplicating its Audiences and StaticLists',
	},
	'powerdialer.getLeadLists': {
		riskLevel: 'read',
		description: 'List of LeadList. Get a list of LeadLists',
	},
	'powerdialer.updateLeadList': {
		riskLevel: 'write',
		description:
			'Update LeadList. Update a LeadList with csv_ids, audience_ids, etc. Supports actions: set_audience, remove_audience, create_static_list, add_leads, remove_leads, add_snapshot, refresh_snapshot, clear_snapshot, clear_manual, refresh_audience',
	},
	'powerdialer.getListView': {
		riskLevel: 'read',
		description:
			'Get Combined List View. Get a combined list of Csv, Audience, and StaticList entities',
	},
	'powerdialer.createStaticList': {
		riskLevel: 'write',
		description: 'Create a Static List. Create a Static List',
	},
	'powerdialer.getStaticLists': {
		riskLevel: 'read',
		description: 'Get Static Lists. Get a list of Static Lists',
	},
	'powerdialer.getStaticList': {
		riskLevel: 'read',
		description: 'Get Static List. Get a single Static List by id',
	},
	'powerdialer.deleteStaticList': {
		riskLevel: 'destructive',
		description: 'Delete a Static List. Delete a Static List',
	},
	'powerdialer.duplicateStaticList': {
		riskLevel: 'write',
		description:
			'Duplicate a Static List. Create a new static list from an existing one',
	},
	'powerdialer.createLeads': {
		riskLevel: 'write',
		description:
			'Create Lead. Create a Lead, and optionally add it to a campaign',
	},
	'powerdialer.queryLeads': {
		riskLevel: 'write',
		description:
			'List of Leads by Query. Get a list of Leads based on complex Queries',
	},
	'powerdialer.getLead': {
		riskLevel: 'read',
		description: 'Get Lead. Get an individual lead',
	},
	'powerdialer.updateLead': {
		riskLevel: 'write',
		description: 'Update Lead. Update a Lead',
	},
	'powerdialer.getLeadCompany': {
		riskLevel: 'read',
		description: 'Get LeadCompany. Get an individual LeadCompany',
	},
	'powerdialer.getLeadCompanies': {
		riskLevel: 'read',
		description:
			'List of LeadCompanies. Get a list of LeadCompany entities, with optional search and ordering',
	},
	'powerdialer.updateStaticList': {
		riskLevel: 'write',
		description: 'Update Static List. Update a Static List with leads',
	},
	'powerdialer.getLeads': {
		riskLevel: 'read',
		description:
			'List of Leads. Get a list of Leads, including searching for leads by filter, sql, and ai',
	},
	'powerdialer.startLeadExport': {
		riskLevel: 'write',
		description:
			"Start a Lead CSV export. Start a CSV export of this company's Leads and return the export record. The export runs in the background: a BigQuery query job plus an extract job routinely takes longer than a request can wait. Poll GET /api/lead_export/<id> until it returns a 'url'. Rows are read from the BigQuery mirror of Spanner, which lags writes, so a Lead created moments ago may not be included — narrow with 'since' and treat freshness as best-effort. Columns are the standard Lead fields plus every property registered via /api/custom_property.",
	},
	'powerdialer.getLeadListView': {
		riskLevel: 'read',
		description:
			'Search shared LeadLists. Search shared LeadLists with optional campaign counts',
	},
	'powerdialer.bulkUpdateLeadItems': {
		riskLevel: 'write',
		description:
			"Bulk update LeadListItems. Update multiple LeadListItems in a single operation. Only updates items in 'pending' state.",
	},
	'powerdialer.getLeadItem': {
		riskLevel: 'read',
		description: 'Get LeadItem. Get a LeadItem',
	},
	'powerdialer.getLeadItems': {
		riskLevel: 'read',
		description:
			'List of LeadListItem + Lead. A mashup api to return a sortable, searchable list for campaign details',
	},
	'powerdialer.getLeadListViewById': {
		riskLevel: 'read',
		description:
			'Get a LeadList view. Get a single LeadList with optional campaign counts',
	},
	'powerdialer.getLeadExport': {
		riskLevel: 'read',
		description:
			"Get a Lead CSV export. Poll an export started with POST /api/lead_export. While it is still running there is no 'url'; on success 'url' is a short-lived signed download link; on failure 'error' says why.",
	},
	'powerdialer.createPhone': {
		riskLevel: 'write',
		description:
			'Create a Phone. Create a Phone entry to the company DNC/DNT table',
	},
	'powerdialer.getPhone': {
		riskLevel: 'read',
		description: 'Get Phone. Get an individual Phone entity',
	},
	'powerdialer.updateLeadItem': {
		riskLevel: 'write',
		description: 'Update LeadItem. Update a LeadItem',
	},
	'powerdialer.deletePhone': {
		riskLevel: 'destructive',
		description: 'Soft Delete Phone. Soft Delete a Phone Entity',
	},
	'powerdialer.getSalesforceObjectListViews': {
		riskLevel: 'read',
		description:
			'Get List Views from Salesforce. Fetch list views from Salesforce',
	},
	'powerdialer.updatePhone': {
		riskLevel: 'write',
		description: 'Update Phone. Update a Phone DNC/DNT statuses',
	},
	'powerdialer.getSalesforceObjectFields': {
		riskLevel: 'read',
		description:
			'Get Object Fields from Salesforce. Fetch field metadata for a Salesforce object via sObject Describe API',
	},
	'powerdialer.getSalesforceListViewById': {
		riskLevel: 'read',
		description:
			'Get Salesforce List View by ID. Retrieve a specific list view from Dialbunny database',
	},
	'powerdialer.createSalesforceListViewImport': {
		riskLevel: 'write',
		description:
			'Import Salesforce ListView records into Leads. Import a Salesforce list view into Dialbunny database',
	},
	'powerdialer.getSalesforceListViewImports': {
		riskLevel: 'read',
		description:
			'List Salesforce ListView Imports. Get all Salesforce ListView Import records for a campaign',
	},
	'powerdialer.getSalesforceObjectMappings': {
		riskLevel: 'read',
		description:
			'List Salesforce Object Mappings. Get all Salesforce object mappings for the company, optionally filtered by campaign or sobject type',
	},
	'powerdialer.createSalesforceObjectMapping': {
		riskLevel: 'write',
		description:
			'Create Salesforce Object Mapping. Create a new Salesforce object mapping for the company or a specific campaign',
	},
	'powerdialer.updateSalesforceListViewImport': {
		riskLevel: 'write',
		description:
			'Update Salesforce ListView Import. Update a Salesforce ListView Import, e.g., start the import job',
	},
	'powerdialer.deleteSalesforceObjectMapping': {
		riskLevel: 'destructive',
		description:
			'Delete Salesforce Object Mapping. Delete a Salesforce object mapping',
	},
	'powerdialer.getSalesforceListViewImport': {
		riskLevel: 'read',
		description:
			'Get Salesforce ListView Import. Get a Salesforce ListView Import record by ID',
	},
	'powerdialer.getSalesforceObjectMapping': {
		riskLevel: 'read',
		description:
			'Get Salesforce Object Mapping. Get a specific Salesforce object mapping by ID',
	},
	'powerdialer.patchSalesforceListView': {
		riskLevel: 'write',
		description:
			'Update Salesforce List View. Perform actions on a Salesforce list view (e.g. refresh_count)',
	},
	'powerdialer.updateSalesforceObjectMapping': {
		riskLevel: 'write',
		description:
			'Update Salesforce Object Mapping. Update an existing Salesforce object mapping',
	},
	'powerdialer.getRules': {
		riskLevel: 'read',
		description:
			'List of rules for a campaign. List of rules belonging to a campaign with campaign id',
	},
	'powerdialer.createRule': {
		riskLevel: 'write',
		description: 'Create rule for a campaign. Create a rule for a campaign',
	},
	'powerdialer.getPhones': {
		riskLevel: 'read',
		description:
			'List of Phones. Get a list of phone table for company DNC/DNT',
	},
	'powerdialer.deleteRule': {
		riskLevel: 'destructive',
		description:
			'Delete a rule. Delete a rule belonging to a campaign with campaign_id',
	},
	'powerdialer.updateRule': {
		riskLevel: 'write',
		description: 'Update a rule for a campaign. Update a rule for a campaign',
	},
	'powerdialer.getRule': {
		riskLevel: 'read',
		description: 'Get Rule. Get a Rule',
	},
	'reports.scheduledstats.download': {
		riskLevel: 'read',
		description:
			'Report Download API -- Download scheduled stats. Downloads the requested scheduled report when available. The official page documents the report type user_voiceline and a YYYY-MM-DD date, but does not publish a success content type or response schema; the plugin returns the report bytes in a validated base64 envelope.',
	},
	'recordings.call.download': {
		riskLevel: 'read',
		description:
			'Call Recording -- Download. Downloads completed call audio as a bounded base64 result; requires recordings_export scope.',
	},
	'recordings.voicemail.download': {
		riskLevel: 'read',
		description:
			'Voicemail Recording -- Download. Downloads voicemail audio as a bounded base64 result; requires recordings_export scope.',
	},
	'recordings.admin_call.download': {
		riskLevel: 'read',
		description:
			'Admin Call Recording -- Download. Downloads an admin recording through its share-link ID as a bounded base64 result.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof dialpadEndpointsNested>;

export const dialpadEndpointMeta: RequiredPluginEndpointMeta<
	typeof dialpadEndpointsNested
> = dialpadEndpointMetaValue;

export const dialpadAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BaseDialpadPlugin<T extends DialpadPluginOptions> = CorsairPlugin<
	'dialpad',
	typeof DialpadSchema,
	typeof dialpadEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalDialpadPlugin = BaseDialpadPlugin<DialpadPluginOptions>;
export type ExternalDialpadPlugin<T extends DialpadPluginOptions> =
	BaseDialpadPlugin<T>;

export function dialpad<const T extends DialpadPluginOptions>(
	incomingOptions: DialpadPluginOptions & T = {} as DialpadPluginOptions & T,
): ExternalDialpadPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	const orderedErrorHandlers = {
		...callerHandlers,
		...builtInHandlers,
		...callerHandlers,
		DEFAULT: callerDefault ?? builtInDefault,
	};
	return {
		id: 'dialpad',
		authConfig: dialpadAuthConfig,
		schema: DialpadSchema,
		options,
		hooks: options.hooks,
		endpoints: dialpadEndpointsNested,
		webhooks: {},
		endpointMeta: dialpadEndpointMeta,
		endpointSchemas: dialpadEndpointSchemas,
		errorHandlers: orderedErrorHandlers,
		keyBuilder: async (ctx: DialpadKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			const authType = ctx.authType;
			if (options.key !== undefined) {
				if (options.key.length === 0)
					throw new AuthMissingError('dialpad', authType);
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('dialpad', authType);
			if (authType === 'oauth_2') {
				const [accessToken, refreshToken, credentials] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_refresh_token(),
					ctx.keys.get_integration_credentials(),
				]);
				const secrets = [
					accessToken,
					refreshToken,
					credentials.client_secret,
				].filter((secret): secret is string => Boolean(secret));
				try {
					return await getOAuthAccessToken(ctx, {
						plugin: 'dialpad',
						tokenUrl: `${DIALPAD_API_BASES[options.environment ?? 'production']}/oauth2/token`,
						tokenAuthMethod: 'body',
						bodyFormat: 'form',
					});
				} catch (error: unknown) {
					// `unknown` because the shared OAuth refresh helper may reject with any value.
					if (error instanceof Error) {
						error.message = redactSensitiveValues(error.message, secrets);
						if (error.stack) {
							error.stack = redactSensitiveValues(error.stack, secrets);
						}
						throw error;
					}
					throw new Error('Dialpad OAuth token refresh failed');
				}
			}
			const credential = await ctx.keys.get_api_key();
			if (!credential) throw new AuthMissingError('dialpad', authType);
			return credential;
		},
	} satisfies InternalDialpadPlugin;
}

export {
	DialpadOperationDefinitions,
	DialpadOperationKeys,
} from './endpoints/definitions';
export type {
	DialpadEndpointInputs,
	DialpadEndpointKey,
	DialpadEndpointOutputs,
} from './endpoints/types';
