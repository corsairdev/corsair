import * as Agents from './agents';
import * as Calls from './calls';
import * as Leads from './leads';
import * as Misc from './misc';
import * as Widgets from './widgets';

export const Agent = {
	list: Agents.list,
	listV2: Agents.listV2,
	get: Agents.get,
	create: Agents.create,
	update: Agents.update,
	delete: Agents.remove,
	updateSchedule: Agents.updateSchedule,
};

export const Call = {
	list: Calls.list,
	listV5: Calls.listV5,
	listWithTags: Calls.listWithTags,
	getDetails: Calls.getDetails,
	getLog: Calls.getLog,
	getEndWebhookPayload: Calls.getEndWebhookPayload,
	listPayloadData: Calls.listPayloadData,
	setS2lTag: Calls.setS2lTag,
	setRating: Calls.setRating,
	trigger: Calls.trigger,
};

export const Lead = {
	list: Leads.list,
	listByPost: Leads.listByPost,
	getOutcomeTags: Leads.getOutcomeTags,
};

export const Widget = {
	list: Widgets.list,
	create: Widgets.create,
	get: Widgets.get,
	update: Widgets.update,
	updateV2: Widgets.updateV2,
	delete: Widgets.remove,
	toggle: Widgets.toggle,
	getHtmlSiteCode: Widgets.getHtmlSiteCode,
	updateSettings: Widgets.updateSettings,
};

export const getCustomWidgetParams = Misc.getCustomWidgetParams;
export const getOpenApiDocument = Misc.getOpenApiDocument;

export * from './types';
