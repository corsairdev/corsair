import {
	UpdownIOCheck,
	UpdownIOCheckDomain,
	UpdownIOCheckSsl,
	UpdownIONode,
} from './database';

export const UpdownIOSchema = {
	version: '1.0.0',
	entities: {
		checks: UpdownIOCheck,
		checkSsl: UpdownIOCheckSsl,
		checkDomain: UpdownIOCheckDomain,
		nodes: UpdownIONode,
	},
} as const;

export {
	UpdownIOCheck,
	UpdownIOCheckDomain,
	UpdownIOCheckSsl,
	UpdownIONode,
} from './database';
