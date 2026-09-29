import { deleteFile } from './deleteFile';
import { downloadFile } from './downloadFile';
import { executeCode } from './executeCode';
import { listFiles } from './listFiles';
import { uploadFile } from './uploadFile';

export const Code = {
	execute: executeCode,
};

export const File = {
	upload: uploadFile,
	list: listFiles,
	download: downloadFile,
	delete: deleteFile,
};

export * from './types';
