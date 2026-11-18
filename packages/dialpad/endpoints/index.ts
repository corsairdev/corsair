import { DialpadOperationFunctions } from './handlers';

export const DialpadOperations = {
	accesscontrolpolicies: {
		assign: DialpadOperationFunctions['accesscontrolpolicies.assign'],
		delete: DialpadOperationFunctions['accesscontrolpolicies.delete'],
		update: DialpadOperationFunctions['accesscontrolpolicies.update'],
		list: DialpadOperationFunctions['accesscontrolpolicies.list'],
		unassign: DialpadOperationFunctions['accesscontrolpolicies.unassign'],
		create: DialpadOperationFunctions['accesscontrolpolicies.create'],
		assignments: DialpadOperationFunctions['accesscontrolpolicies.assignments'],
		get: DialpadOperationFunctions['accesscontrolpolicies.get'],
	},
	agentgroup: {
		get: DialpadOperationFunctions['agentgroup.get'],
	},
	anonymization: {
		requests: {
			get: DialpadOperationFunctions['anonymization.requests.get'],
		},
		contacts: DialpadOperationFunctions['anonymization.contacts'],
		callcontent: DialpadOperationFunctions['anonymization.callcontent'],
	},
	app_settings: {
		get: DialpadOperationFunctions['app_settings.get'],
	},
	blockednumbers: {
		get: DialpadOperationFunctions['blockednumbers.get'],
		add: DialpadOperationFunctions['blockednumbers.add'],
		list: DialpadOperationFunctions['blockednumbers.list'],
		remove: DialpadOperationFunctions['blockednumbers.remove'],
	},
	available_numbers: {
		list: DialpadOperationFunctions['available_numbers.list'],
	},
	call: {
		assign: DialpadOperationFunctions['call.assign'],
		get_assigned_operators:
			DialpadOperationFunctions['call.get_assigned_operators'],
		get_ai_recap: DialpadOperationFunctions['call.get_ai_recap'],
		participants: {
			add: DialpadOperationFunctions['call.participants.add'],
		},
		list: DialpadOperationFunctions['call.list'],
		initiate_ivr_call: DialpadOperationFunctions['call.initiate_ivr_call'],
		unassign_all_call_operators:
			DialpadOperationFunctions['call.unassign_all_call_operators'],
		transfer_call: DialpadOperationFunctions['call.transfer_call'],
		get_call_info: DialpadOperationFunctions['call.get_call_info'],
		unassign_operator: DialpadOperationFunctions['call.unassign_operator'],
		unpark: DialpadOperationFunctions['call.unpark'],
		initiate: DialpadOperationFunctions['call.initiate'],
		add_labels: DialpadOperationFunctions['call.add_labels'],
		hangup: DialpadOperationFunctions['call.hangup'],
	},
	callbacks: {
		list: DialpadOperationFunctions['callbacks.list'],
	},
	callback: {
		validate: DialpadOperationFunctions['callback.validate'],
		enqueue: DialpadOperationFunctions['callback.enqueue'],
	},
	callcenters: {
		listall: DialpadOperationFunctions['callcenters.listall'],
		get: DialpadOperationFunctions['callcenters.get'],
		update: DialpadOperationFunctions['callcenters.update'],
		create: DialpadOperationFunctions['callcenters.create'],
		delete: DialpadOperationFunctions['callcenters.delete'],
		get_status: DialpadOperationFunctions['callcenters.get_status'],
		operators: {
			update_duty_status:
				DialpadOperationFunctions['callcenters.operators.update_duty_status'],
			get_skill_level:
				DialpadOperationFunctions['callcenters.operators.get_skill_level'],
			get_duty_status:
				DialpadOperationFunctions['callcenters.operators.get_duty_status'],
			update_skill_level:
				DialpadOperationFunctions['callcenters.operators.update_skill_level'],
			add: DialpadOperationFunctions['callcenters.operators.add'],
			delete: DialpadOperationFunctions['callcenters.operators.delete'],
			list: DialpadOperationFunctions['callcenters.operators.list'],
		},
		queue: {
			list: DialpadOperationFunctions['callcenters.queue.list'],
		},
		list: DialpadOperationFunctions['callcenters.list'],
	},
	call_labels: {
		list: DialpadOperationFunctions['call_labels.list'],
	},
	call_review_share_link: {
		get: DialpadOperationFunctions['call_review_share_link.get'],
		create: DialpadOperationFunctions['call_review_share_link.create'],
		delete: DialpadOperationFunctions['call_review_share_link.delete'],
		update: DialpadOperationFunctions['call_review_share_link.update'],
	},
	callrouters: {
		list: DialpadOperationFunctions['callrouters.list'],
		delete: DialpadOperationFunctions['callrouters.delete'],
		create: DialpadOperationFunctions['callrouters.create'],
		get: DialpadOperationFunctions['callrouters.get'],
		update: DialpadOperationFunctions['callrouters.update'],
	},
	numbers: {
		assign_call_router_number: {
			post: DialpadOperationFunctions['numbers.assign_call_router_number.post'],
		},
		unassign: DialpadOperationFunctions['numbers.unassign'],
		assign: DialpadOperationFunctions['numbers.assign'],
		list: DialpadOperationFunctions['numbers.list'],
		auto_assign: DialpadOperationFunctions['numbers.auto_assign'],
		swap: DialpadOperationFunctions['numbers.swap'],
		get: DialpadOperationFunctions['numbers.get'],
		office_unassign_number: {
			post: DialpadOperationFunctions['numbers.office_unassign_number.post'],
		},
		assign_office_number: {
			post: DialpadOperationFunctions['numbers.assign_office_number.post'],
		},
		assign_room_number: {
			post: DialpadOperationFunctions['numbers.assign_room_number.post'],
		},
		room_unassign_number: {
			post: DialpadOperationFunctions['numbers.room_unassign_number.post'],
		},
	},
	channels: {
		delete: DialpadOperationFunctions['channels.delete'],
		get: DialpadOperationFunctions['channels.get'],
		members: {
			list: DialpadOperationFunctions['channels.members.list'],
			delete: DialpadOperationFunctions['channels.members.delete'],
			add: DialpadOperationFunctions['channels.members.add'],
		},
		list: DialpadOperationFunctions['channels.list'],
		create: DialpadOperationFunctions['channels.create'],
	},
	coaching_team: {
		get: DialpadOperationFunctions['coaching_team.get'],
		members: {
			get: DialpadOperationFunctions['coaching_team.members.get'],
			add: DialpadOperationFunctions['coaching_team.members.add'],
		},
		listall: DialpadOperationFunctions['coaching_team.listall'],
		list: DialpadOperationFunctions['coaching_team.list'],
	},
	company: {
		get: DialpadOperationFunctions['company.get'],
		sms_opt_out: DialpadOperationFunctions['company.sms_opt_out'],
		update_settings: DialpadOperationFunctions['company.update_settings'],
		get_ai_settings: DialpadOperationFunctions['company.get_ai_settings'],
		update: DialpadOperationFunctions['company.update'],
		update_ai_settings: DialpadOperationFunctions['company.update_ai_settings'],
	},
	contacts: {
		delete: DialpadOperationFunctions['contacts.delete'],
		update: DialpadOperationFunctions['contacts.update'],
		list: DialpadOperationFunctions['contacts.list'],
		get: DialpadOperationFunctions['contacts.get'],
		create: DialpadOperationFunctions['contacts.create'],
		create_with_uid: DialpadOperationFunctions['contacts.create_with_uid'],
		search: DialpadOperationFunctions['contacts.search'],
	},
	ivr: {
		delete: DialpadOperationFunctions['ivr.delete'],
		assign: DialpadOperationFunctions['ivr.assign'],
		update_details: DialpadOperationFunctions['ivr.update_details'],
		create: DialpadOperationFunctions['ivr.create'],
	},
	custom_ivrs: {
		list: DialpadOperationFunctions['custom_ivrs.list'],
	},
	departments: {
		delete: DialpadOperationFunctions['departments.delete'],
		update: DialpadOperationFunctions['departments.update'],
		create: DialpadOperationFunctions['departments.create'],
		listall: DialpadOperationFunctions['departments.listall'],
		get: DialpadOperationFunctions['departments.get'],
		operators: {
			delete: DialpadOperationFunctions['departments.operators.delete'],
			list: DialpadOperationFunctions['departments.operators.list'],
			add: DialpadOperationFunctions['departments.operators.add'],
		},
		list: DialpadOperationFunctions['departments.list'],
	},
	dispositions: {
		delete: DialpadOperationFunctions['dispositions.delete'],
		update: DialpadOperationFunctions['dispositions.update'],
		get: DialpadOperationFunctions['dispositions.get'],
		list: DialpadOperationFunctions['dispositions.list'],
		create: DialpadOperationFunctions['dispositions.create'],
	},
	digital: {
		sessions: {
			list: DialpadOperationFunctions['digital.sessions.list'],
		},
	},
	faxline: {
		assign: DialpadOperationFunctions['faxline.assign'],
	},
	bulk_messages: {
		get: DialpadOperationFunctions['bulk_messages.get'],
		send: DialpadOperationFunctions['bulk_messages.send'],
		update: DialpadOperationFunctions['bulk_messages.update'],
		list: DialpadOperationFunctions['bulk_messages.list'],
	},
	fax: {
		send: DialpadOperationFunctions['fax.send'],
	},
	scheduled_messages: {
		create: DialpadOperationFunctions['scheduled_messages.create'],
		delete: DialpadOperationFunctions['scheduled_messages.delete'],
		list: DialpadOperationFunctions['scheduled_messages.list'],
		get: DialpadOperationFunctions['scheduled_messages.get'],
		send_now: DialpadOperationFunctions['scheduled_messages.send_now'],
		update: DialpadOperationFunctions['scheduled_messages.update'],
	},
	number_tags: {
		update: DialpadOperationFunctions['number_tags.update'],
	},
	office_plan: {
		get: DialpadOperationFunctions['office_plan.get'],
	},
	phone_number: {
		format: DialpadOperationFunctions['phone_number.format'],
	},
	available_licenses: {
		list: DialpadOperationFunctions['available_licenses.list'],
	},
	offices: {
		e911: {
			get: DialpadOperationFunctions['offices.e911.get'],
			update: DialpadOperationFunctions['offices.e911.update'],
		},
		offdutystatuses: {
			get: DialpadOperationFunctions['offices.offdutystatuses.get'],
		},
		update: DialpadOperationFunctions['offices.update'],
		get: DialpadOperationFunctions['offices.get'],
		primary: {
			get: DialpadOperationFunctions['offices.primary.get'],
		},
		list: DialpadOperationFunctions['offices.list'],
		operators: {
			delete: DialpadOperationFunctions['offices.operators.delete'],
			get: DialpadOperationFunctions['offices.operators.get'],
			post: DialpadOperationFunctions['offices.operators.post'],
		},
		create: DialpadOperationFunctions['offices.create'],
	},
	recording_share_link: {
		create: DialpadOperationFunctions['recording_share_link.create'],
		get: DialpadOperationFunctions['recording_share_link.get'],
		delete: DialpadOperationFunctions['recording_share_link.delete'],
		update: DialpadOperationFunctions['recording_share_link.update'],
	},
	rooms: {
		delete: DialpadOperationFunctions['rooms.delete'],
		get: DialpadOperationFunctions['rooms.get'],
		post: DialpadOperationFunctions['rooms.post'],
		list: DialpadOperationFunctions['rooms.list'],
		patch: DialpadOperationFunctions['rooms.patch'],
	},
	deskphones: {
		rooms: {
			create_international_pin:
				DialpadOperationFunctions['deskphones.rooms.create_international_pin'],
			get: DialpadOperationFunctions['deskphones.rooms.get'],
			list: DialpadOperationFunctions['deskphones.rooms.list'],
			delete: DialpadOperationFunctions['deskphones.rooms.delete'],
		},
		users: {
			delete: DialpadOperationFunctions['deskphones.users.delete'],
			get: DialpadOperationFunctions['deskphones.users.get'],
			list: DialpadOperationFunctions['deskphones.users.list'],
		},
	},
	schedule_reports: {
		update: DialpadOperationFunctions['schedule_reports.update'],
		create: DialpadOperationFunctions['schedule_reports.create'],
		get: DialpadOperationFunctions['schedule_reports.get'],
		delete: DialpadOperationFunctions['schedule_reports.delete'],
		list: DialpadOperationFunctions['schedule_reports.list'],
	},
	scorecards: {
		export: {
			get: DialpadOperationFunctions['scorecards.export.get'],
			create: DialpadOperationFunctions['scorecards.export.create'],
		},
		get: DialpadOperationFunctions['scorecards.get'],
		list: DialpadOperationFunctions['scorecards.list'],
	},
	stats: {
		export: {
			create: DialpadOperationFunctions['stats.export.create'],
			get: DialpadOperationFunctions['stats.export.get'],
		},
	},
	sms: {
		send: DialpadOperationFunctions['sms.send'],
	},
	users: {
		initiate_call: DialpadOperationFunctions['users.initiate_call'],
		toggle_call_vi: DialpadOperationFunctions['users.toggle_call_vi'],
		toggle_call_recording:
			DialpadOperationFunctions['users.toggle_call_recording'],
		set_caller_id: DialpadOperationFunctions['users.set_caller_id'],
		e911: {
			update: DialpadOperationFunctions['users.e911.update'],
			get: DialpadOperationFunctions['users.e911.get'],
		},
		toggle_dnd: DialpadOperationFunctions['users.toggle_dnd'],
		unassign_number: DialpadOperationFunctions['users.unassign_number'],
		assign_number: DialpadOperationFunctions['users.assign_number'],
		list_personas: DialpadOperationFunctions['users.list_personas'],
		delete: DialpadOperationFunctions['users.delete'],
		get: DialpadOperationFunctions['users.get'],
		list: DialpadOperationFunctions['users.list'],
		update: DialpadOperationFunctions['users.update'],
		create: DialpadOperationFunctions['users.create'],
		move_office: DialpadOperationFunctions['users.move_office'],
		create_batch: DialpadOperationFunctions['users.create_batch'],
		update_status: DialpadOperationFunctions['users.update_status'],
	},
	userdevices: {
		get: DialpadOperationFunctions['userdevices.get'],
		list: DialpadOperationFunctions['userdevices.list'],
	},
	transcripts: {
		get: DialpadOperationFunctions['transcripts.get'],
		get_url: DialpadOperationFunctions['transcripts.get_url'],
	},
	caller_id: {
		users: {
			get: DialpadOperationFunctions['caller_id.users.get'],
		},
	},
	screen_pop: {
		initiate: DialpadOperationFunctions['screen_pop.initiate'],
	},
	search: {
		users: DialpadOperationFunctions['search.users'],
	},
	websockets: {
		get: DialpadOperationFunctions['websockets.get'],
		list: DialpadOperationFunctions['websockets.list'],
		create: DialpadOperationFunctions['websockets.create'],
		update: DialpadOperationFunctions['websockets.update'],
		delete: DialpadOperationFunctions['websockets.delete'],
	},
	meetings: {
		'conference-meetings': {
			list: DialpadOperationFunctions['meetings.conference-meetings.list'],
		},
		'conference-rooms': {
			list: DialpadOperationFunctions['meetings.conference-rooms.list'],
		},
		meetings: {
			get: DialpadOperationFunctions['meetings.meetings.get'],
			update: DialpadOperationFunctions['meetings.meetings.update'],
			delete: DialpadOperationFunctions['meetings.meetings.delete'],
			create: DialpadOperationFunctions['meetings.meetings.create'],
			room: {
				create: DialpadOperationFunctions['meetings.meetings.room.create'],
			},
			list: DialpadOperationFunctions['meetings.meetings.list'],
		},
	},
	wfm: {
		'wfm-metrics-activity': {
			get: DialpadOperationFunctions['wfm.wfm-metrics-activity.get'],
		},
		'wfm-metrics-agent': {
			get: DialpadOperationFunctions['wfm.wfm-metrics-agent.get'],
		},
	},
	powerdialer: {
		getModelsByKeys: DialpadOperationFunctions['powerdialer.getModelsByKeys'],
		getAblyToken: DialpadOperationFunctions['powerdialer.getAblyToken'],
		getContact: DialpadOperationFunctions['powerdialer.getContact'],
		getModelsByKeysOfKind:
			DialpadOperationFunctions['powerdialer.getModelsByKeysOfKind'],
		deleteModelsByKeysOfKind:
			DialpadOperationFunctions['powerdialer.deleteModelsByKeysOfKind'],
		createCustomProperties:
			DialpadOperationFunctions['powerdialer.createCustomProperties'],
		getCustomProperties:
			DialpadOperationFunctions['powerdialer.getCustomProperties'],
		getCustomProperty:
			DialpadOperationFunctions['powerdialer.getCustomProperty'],
		updateCustomProperty:
			DialpadOperationFunctions['powerdialer.updateCustomProperty'],
		getDialpadOAuthService:
			DialpadOperationFunctions['powerdialer.getDialpadOAuthService'],
		updateGlobalSettings:
			DialpadOperationFunctions['powerdialer.updateGlobalSettings'],
		deleteCustomProperty:
			DialpadOperationFunctions['powerdialer.deleteCustomProperty'],
		getGlobalSettings:
			DialpadOperationFunctions['powerdialer.getGlobalSettings'],
		getEventLogs: DialpadOperationFunctions['powerdialer.getEventLogs'],
		getJobs: DialpadOperationFunctions['powerdialer.getJobs'],
		getJob: DialpadOperationFunctions['powerdialer.getJob'],
		getApiKey: DialpadOperationFunctions['powerdialer.getApiKey'],
		getApiKeys: DialpadOperationFunctions['powerdialer.getApiKeys'],
		getOperator: DialpadOperationFunctions['powerdialer.getOperator'],
		getLogin: DialpadOperationFunctions['powerdialer.getLogin'],
		deleteApiKey: DialpadOperationFunctions['powerdialer.deleteApiKey'],
		updateApiKey: DialpadOperationFunctions['powerdialer.updateApiKey'],
		postLogin: DialpadOperationFunctions['powerdialer.postLogin'],
		createApiKey: DialpadOperationFunctions['powerdialer.createApiKey'],
		createServiceAccount:
			DialpadOperationFunctions['powerdialer.createServiceAccount'],
		getServiceAccount:
			DialpadOperationFunctions['powerdialer.getServiceAccount'],
		updateServiceAccount:
			DialpadOperationFunctions['powerdialer.updateServiceAccount'],
		deleteServiceAccount:
			DialpadOperationFunctions['powerdialer.deleteServiceAccount'],
		getSmsForTarget: DialpadOperationFunctions['powerdialer.getSmsForTarget'],
		smsItem: DialpadOperationFunctions['powerdialer.smsItem'],
		getServiceAccounts:
			DialpadOperationFunctions['powerdialer.getServiceAccounts'],
		getCurrentUser: DialpadOperationFunctions['powerdialer.getCurrentUser'],
		getWorker: DialpadOperationFunctions['powerdialer.getWorker'],
		updateWorker: DialpadOperationFunctions['powerdialer.updateWorker'],
		getWorkers: DialpadOperationFunctions['powerdialer.getWorkers'],
		createAudience: DialpadOperationFunctions['powerdialer.createAudience'],
		getAudiences: DialpadOperationFunctions['powerdialer.getAudiences'],
		updateAudience: DialpadOperationFunctions['powerdialer.updateAudience'],
		getAudience: DialpadOperationFunctions['powerdialer.getAudience'],
		createBot: DialpadOperationFunctions['powerdialer.createBot'],
		duplicateAudience:
			DialpadOperationFunctions['powerdialer.duplicateAudience'],
		getBots: DialpadOperationFunctions['powerdialer.getBots'],
		updateBot: DialpadOperationFunctions['powerdialer.updateBot'],
		deleteAudience: DialpadOperationFunctions['powerdialer.deleteAudience'],
		deleteBot: DialpadOperationFunctions['powerdialer.deleteBot'],
		getBot: DialpadOperationFunctions['powerdialer.getBot'],
		getBotDialogs: DialpadOperationFunctions['powerdialer.getBotDialogs'],
		createBotDialog: DialpadOperationFunctions['powerdialer.createBotDialog'],
		deleteBotDialog: DialpadOperationFunctions['powerdialer.deleteBotDialog'],
		getBotMessages: DialpadOperationFunctions['powerdialer.getBotMessages'],
		createBotMessage: DialpadOperationFunctions['powerdialer.createBotMessage'],
		deleteBotMessage: DialpadOperationFunctions['powerdialer.deleteBotMessage'],
		getBotMessage: DialpadOperationFunctions['powerdialer.getBotMessage'],
		updateBotDialog: DialpadOperationFunctions['powerdialer.updateBotDialog'],
		getCampaigns: DialpadOperationFunctions['powerdialer.getCampaigns'],
		searchCampaigns: DialpadOperationFunctions['powerdialer.searchCampaigns'],
		deleteCampaign: DialpadOperationFunctions['powerdialer.deleteCampaign'],
		createCampaign: DialpadOperationFunctions['powerdialer.createCampaign'],
		getCampaign: DialpadOperationFunctions['powerdialer.getCampaign'],
		updateCampaign: DialpadOperationFunctions['powerdialer.updateCampaign'],
		duplicateCampaign:
			DialpadOperationFunctions['powerdialer.duplicateCampaign'],
		getCampaignResultExportUrl:
			DialpadOperationFunctions['powerdialer.getCampaignResultExportUrl'],
		createCampaignGroup:
			DialpadOperationFunctions['powerdialer.createCampaignGroup'],
		deleteCampaignGroup:
			DialpadOperationFunctions['powerdialer.deleteCampaignGroup'],
		getCampaignGroup: DialpadOperationFunctions['powerdialer.getCampaignGroup'],
		getCampaignGroups:
			DialpadOperationFunctions['powerdialer.getCampaignGroups'],
		startCampaignResultExport:
			DialpadOperationFunctions['powerdialer.startCampaignResultExport'],
		getCampaignSettings:
			DialpadOperationFunctions['powerdialer.getCampaignSettings'],
		updateCampaignGroup:
			DialpadOperationFunctions['powerdialer.updateCampaignGroup'],
		editCampaignSettings:
			DialpadOperationFunctions['powerdialer.editCampaignSettings'],
		deleteCsv: DialpadOperationFunctions['powerdialer.deleteCsv'],
		getCsvPresignedUrl:
			DialpadOperationFunctions['powerdialer.getCsvPresignedUrl'],
		updateCsv: DialpadOperationFunctions['powerdialer.updateCsv'],
		getVarsInfo: DialpadOperationFunctions['powerdialer.getVarsInfo'],
		getCsv: DialpadOperationFunctions['powerdialer.getCsv'],
		getPhoneCsvs: DialpadOperationFunctions['powerdialer.getPhoneCsvs'],
		getCsvs: DialpadOperationFunctions['powerdialer.getCsvs'],
		getPhoneCsv: DialpadOperationFunctions['powerdialer.getPhoneCsv'],
		updatePhoneCsv: DialpadOperationFunctions['powerdialer.updatePhoneCsv'],
		deletePhoneCsv: DialpadOperationFunctions['powerdialer.deletePhoneCsv'],
		createLeadList: DialpadOperationFunctions['powerdialer.createLeadList'],
		getBotDialog: DialpadOperationFunctions['powerdialer.getBotDialog'],
		getListItems: DialpadOperationFunctions['powerdialer.getListItems'],
		deleteLeadListItem:
			DialpadOperationFunctions['powerdialer.deleteLeadListItem'],
		getListList: DialpadOperationFunctions['powerdialer.getListList'],
		getLeadListItem: DialpadOperationFunctions['powerdialer.getLeadListItem'],
		deleteLeadList: DialpadOperationFunctions['powerdialer.deleteLeadList'],
		duplicateLeadList:
			DialpadOperationFunctions['powerdialer.duplicateLeadList'],
		getLeadLists: DialpadOperationFunctions['powerdialer.getLeadLists'],
		updateLeadList: DialpadOperationFunctions['powerdialer.updateLeadList'],
		getListView: DialpadOperationFunctions['powerdialer.getListView'],
		createStaticList: DialpadOperationFunctions['powerdialer.createStaticList'],
		getStaticLists: DialpadOperationFunctions['powerdialer.getStaticLists'],
		getStaticList: DialpadOperationFunctions['powerdialer.getStaticList'],
		deleteStaticList: DialpadOperationFunctions['powerdialer.deleteStaticList'],
		duplicateStaticList:
			DialpadOperationFunctions['powerdialer.duplicateStaticList'],
		createLeads: DialpadOperationFunctions['powerdialer.createLeads'],
		queryLeads: DialpadOperationFunctions['powerdialer.queryLeads'],
		getLead: DialpadOperationFunctions['powerdialer.getLead'],
		updateLead: DialpadOperationFunctions['powerdialer.updateLead'],
		getLeadCompany: DialpadOperationFunctions['powerdialer.getLeadCompany'],
		getLeadCompanies: DialpadOperationFunctions['powerdialer.getLeadCompanies'],
		updateStaticList: DialpadOperationFunctions['powerdialer.updateStaticList'],
		getLeads: DialpadOperationFunctions['powerdialer.getLeads'],
		startLeadExport: DialpadOperationFunctions['powerdialer.startLeadExport'],
		getLeadListView: DialpadOperationFunctions['powerdialer.getLeadListView'],
		bulkUpdateLeadItems:
			DialpadOperationFunctions['powerdialer.bulkUpdateLeadItems'],
		getLeadItem: DialpadOperationFunctions['powerdialer.getLeadItem'],
		getLeadItems: DialpadOperationFunctions['powerdialer.getLeadItems'],
		getLeadListViewById:
			DialpadOperationFunctions['powerdialer.getLeadListViewById'],
		getLeadExport: DialpadOperationFunctions['powerdialer.getLeadExport'],
		createPhone: DialpadOperationFunctions['powerdialer.createPhone'],
		getPhone: DialpadOperationFunctions['powerdialer.getPhone'],
		updateLeadItem: DialpadOperationFunctions['powerdialer.updateLeadItem'],
		deletePhone: DialpadOperationFunctions['powerdialer.deletePhone'],
		getSalesforceObjectListViews:
			DialpadOperationFunctions['powerdialer.getSalesforceObjectListViews'],
		updatePhone: DialpadOperationFunctions['powerdialer.updatePhone'],
		getSalesforceObjectFields:
			DialpadOperationFunctions['powerdialer.getSalesforceObjectFields'],
		getSalesforceListViewById:
			DialpadOperationFunctions['powerdialer.getSalesforceListViewById'],
		createSalesforceListViewImport:
			DialpadOperationFunctions['powerdialer.createSalesforceListViewImport'],
		getSalesforceListViewImports:
			DialpadOperationFunctions['powerdialer.getSalesforceListViewImports'],
		getSalesforceObjectMappings:
			DialpadOperationFunctions['powerdialer.getSalesforceObjectMappings'],
		createSalesforceObjectMapping:
			DialpadOperationFunctions['powerdialer.createSalesforceObjectMapping'],
		updateSalesforceListViewImport:
			DialpadOperationFunctions['powerdialer.updateSalesforceListViewImport'],
		deleteSalesforceObjectMapping:
			DialpadOperationFunctions['powerdialer.deleteSalesforceObjectMapping'],
		getSalesforceListViewImport:
			DialpadOperationFunctions['powerdialer.getSalesforceListViewImport'],
		getSalesforceObjectMapping:
			DialpadOperationFunctions['powerdialer.getSalesforceObjectMapping'],
		patchSalesforceListView:
			DialpadOperationFunctions['powerdialer.patchSalesforceListView'],
		updateSalesforceObjectMapping:
			DialpadOperationFunctions['powerdialer.updateSalesforceObjectMapping'],
		getRules: DialpadOperationFunctions['powerdialer.getRules'],
		createRule: DialpadOperationFunctions['powerdialer.createRule'],
		getPhones: DialpadOperationFunctions['powerdialer.getPhones'],
		deleteRule: DialpadOperationFunctions['powerdialer.deleteRule'],
		updateRule: DialpadOperationFunctions['powerdialer.updateRule'],
		getRule: DialpadOperationFunctions['powerdialer.getRule'],
	},
	reports: {
		scheduledstats: {
			download: DialpadOperationFunctions['reports.scheduledstats.download'],
		},
	},
	recordings: {
		call: {
			download: DialpadOperationFunctions['recordings.call.download'],
		},
		voicemail: {
			download: DialpadOperationFunctions['recordings.voicemail.download'],
		},
		admin_call: {
			download: DialpadOperationFunctions['recordings.admin_call.download'],
		},
	},
} as const;
export * from './definitions';
export * from './types';
