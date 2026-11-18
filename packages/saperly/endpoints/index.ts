import * as Account from './account';
import * as CallEndpoints from './calls';
import * as ConnectionEndpoints from './connections';
import * as MessageEndpoints from './messages';
import * as NumberEndpoints from './numbers';
import * as VoiceEndpoints from './voices';

export const Numbers = {
	list: NumberEndpoints.list,
	provision: NumberEndpoints.provision,
	get: NumberEndpoints.get,
	release: NumberEndpoints.release,
	assignConnection: NumberEndpoints.assignConnection,
	setWebhook: NumberEndpoints.setWebhook,
	setSmsSender: NumberEndpoints.setSmsSender,
	setCallerId: NumberEndpoints.setCallerId,
};

export const Connections = {
	list: ConnectionEndpoints.list,
	create: ConnectionEndpoints.create,
	get: ConnectionEndpoints.get,
	update: ConnectionEndpoints.update,
	remove: ConnectionEndpoints.remove,
};

export const Messages = {
	send: MessageEndpoints.send,
	list: MessageEndpoints.list,
};

export const Calls = {
	place: CallEndpoints.place,
	list: CallEndpoints.list,
	get: CallEndpoints.get,
	end: CallEndpoints.end,
	transfer: CallEndpoints.transfer,
	recording: CallEndpoints.recording,
	transcript: CallEndpoints.transcript,
};

export const Voices = {
	list: VoiceEndpoints.list,
	listCustom: VoiceEndpoints.listCustom,
	createCustom: VoiceEndpoints.createCustom,
	getCustom: VoiceEndpoints.getCustom,
	deleteCustom: VoiceEndpoints.deleteCustom,
};

export const Languages = { list: Account.listLanguages };
export const Usage = { summary: Account.getUsage };
export const Consent = {
	list: Account.listConsent,
	record: Account.recordConsent,
	revoke: Account.revokeConsent,
	check: Account.checkConsent,
};
export const Pricing = { quote: Account.quotePrice };
export const Keys = {
	list: Account.listKeys,
	mint: Account.mintKey,
	revoke: Account.revokeKey,
};
export const Health = { check: Account.checkHealth };
export const Assistant = { answer: Account.askAssistant };
