import { accountBalance, sendLetter, sendPostcard } from './send';

export const Account = {
	balance: accountBalance,
};

export const Send = {
	letter: sendLetter,
	postcard: sendPostcard,
};

export * from './types';
