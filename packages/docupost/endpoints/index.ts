import { accountBalance, sendLetter, sendPostcard } from './send';

export const Send = {
	accountBalance,
	letter: sendLetter,
	postcard: sendPostcard,
};

export * from './types';
