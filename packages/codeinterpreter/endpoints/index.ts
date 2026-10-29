import { deleteFile } from './delete-file';
import { downloadFile } from './download-file';
import { executeCode } from './execute-code';
import { listFiles } from './list-files';
import { uploadFile } from './upload-file';

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
