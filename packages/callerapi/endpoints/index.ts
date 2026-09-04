import { lookup } from './lookup';
import { onlinePresence } from './online-presence';
import { ported } from './ported';
import { portingHistory } from './porting-history';

export const Callerapi = {
	lookup,
	ported,
	portingHistory,
	onlinePresence,
};

export * from './types';
