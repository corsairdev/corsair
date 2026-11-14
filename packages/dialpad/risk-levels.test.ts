import { dialpadEndpointMeta } from './index';

// Plugin rule R8: an operation that sends a message, spends money or credits, or
// can't be undone is destructive.
const DESTRUCTIVE = {
	// Send SMS, MMS, faxes or messages to people.
	sends: [
		'sms.send',
		'bulk_messages.send',
		'scheduled_messages.create',
		'scheduled_messages.send_now',
		'fax.send',
		'powerdialer.smsItem',
	],
	// Place a phone call to someone (also billed per minute).
	calls: [
		'call.initiate',
		'call.initiate_ivr_call',
		'users.initiate_call',
		'callback.enqueue',
		'call.participants.add',
		'call.transfer_call',
		'powerdialer.updateCampaign',
	],
	// Use a paid license or seat, or allocate a new number or billed office.
	spends: [
		'users.create',
		'users.create_batch',
		'users.move_office',
		'callcenters.operators.add',
		'offices.create',
		'numbers.auto_assign',
		'numbers.assign',
		'users.assign_number',
		'numbers.assign_call_router_number.post',
		'numbers.assign_office_number.post',
		'numbers.assign_room_number.post',
		'faxline.assign',
	],
	// The old number is released, or is released when the company has no
	// reserved pool.
	irreversible: [
		'numbers.swap',
		'numbers.office_unassign_number.post',
		'numbers.room_unassign_number.post',
		'users.unassign_number',
	],
} as const;

describe('Dialpad risk levels', () => {
	it.each(
		Object.entries(DESTRUCTIVE).flatMap(([kind, keys]) =>
			keys.map((key) => [key, kind] as const),
		),
	)('marks %s (%s) destructive', (key) => {
		expect(dialpadEndpointMeta[key].riskLevel).toBe('destructive');
	});
});
