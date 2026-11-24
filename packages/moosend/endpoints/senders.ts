import { endpoint } from './call';

/** Lists the account's senders (from addresses) and their DNS checks. */
export const list = endpoint('sendersList', {
	event: 'senders.list',
	request: () => ({ method: 'GET', path: '/senders/find_all.json' }),
	shape: (context) => ({ senders: context }),
	log: (_, result) => ({ senders: result.senders.length }),
});

/** Reads one sender by its email address. */
export const get = endpoint('sendersGet', {
	event: 'senders.get',
	request: ({ email }) => ({
		method: 'GET',
		path: '/senders/find_one.json',
		query: { Email: email },
	}),
});
