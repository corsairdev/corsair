import { add as contactsAdd } from './contacts';
import { list as listsList } from './lists';

export const Contacts = { add: contactsAdd };
export const Lists = { list: listsList };

export * from './types';
