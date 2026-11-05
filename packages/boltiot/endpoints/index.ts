import { analogRead, checkStatus, digitalRead, digitalWrite } from './device';
import {
	read as serialRead,
	write as serialWrite,
	writeRead as serialWriteRead,
} from './serial';

export const Device = {
	checkStatus,
	analogRead,
	digitalWrite,
	digitalRead,
};

export const Serial = {
	read: serialRead,
	write: serialWrite,
	writeRead: serialWriteRead,
};

export * from './types';
