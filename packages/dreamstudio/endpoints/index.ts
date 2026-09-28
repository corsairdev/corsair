import { generateImageFromImage } from './generation';
import { listEngines, userAccount, userBalance } from './user';

export const User = {
	balance: userBalance,
	account: userAccount,
};

export const Engines = {
	list: listEngines,
};

export const Generation = {
	imageFromImage: generateImageFromImage,
};

export * from './types';
