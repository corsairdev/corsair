import { z } from 'zod';
import { defineOperation, OkSchema, sandboxIdField } from './shared';

const FileInfoSchema = z.object({
	name: z.string(),
	path: z.string(),
	type: z.string().describe('"file", "directory" or "symlink".'),
	size: z.number(),
	mode: z.number(),
	permissions: z.string(),
	owner: z.string(),
	group: z.string(),
	modifiedTime: z.number().describe('Unix epoch seconds.'),
	symlinkTarget: z.string().nullable().optional(),
});

type FileInfoLike = z.input<typeof FileInfoSchema>;

function fileInfoToJson(info: FileInfoLike) {
	return {
		name: info.name,
		path: info.path,
		type: info.type,
		size: info.size,
		mode: info.mode,
		permissions: info.permissions,
		owner: info.owner,
		group: info.group,
		modifiedTime: info.modifiedTime,
		symlinkTarget: info.symlinkTarget ?? null,
	};
}

const pathField = z
	.string()
	.min(1)
	.describe('Absolute path inside the sandbox.');
const encodingField = z
	.enum(['utf8', 'base64'])
	.default('utf8')
	.describe('"utf8" for text, "base64" for binary content.');

const FileInput = z.object({ sandboxId: sandboxIdField, path: pathField });

export const readFile = defineOperation({
	group: 'files',
	name: 'read',
	description:
		'Read a file from a running sandbox, as UTF-8 text or base64 for binary files.',
	riskLevel: 'read',
	input: FileInput.extend({
		encoding: encodingField,
		maxBytes: z
			.number()
			.int()
			.positive()
			.max(20_000_000)
			.default(5_000_000)
			.describe('Fail instead of returning a file larger than this.'),
	}),
	output: z.object({
		path: z.string(),
		encoding: z.enum(['utf8', 'base64']),
		content: z.string(),
		size: z.number(),
	}),
	run: async (runtime, input) => {
		const sandbox = await runtime.client.sandboxes.fromId(input.sandboxId);
		const info = await sandbox.filesystem.stat(input.path);
		if (info.size > input.maxBytes) {
			throw new Error(
				`[modal] ${input.path} is ${info.size} bytes, more than maxBytes (${input.maxBytes})`,
			);
		}
		const bytes = await sandbox.filesystem.readBytes(input.path);
		const buffer = Buffer.from(bytes);
		return {
			path: input.path,
			encoding: input.encoding,
			content:
				input.encoding === 'base64'
					? buffer.toString('base64')
					: buffer.toString('utf8'),
			size: buffer.length,
		};
	},
});

export const writeFile = defineOperation({
	group: 'files',
	name: 'write',
	description:
		'Write a file in a running sandbox, replacing it if it exists. Parent directories must exist (see files.makeDirectory).',
	riskLevel: 'write',
	input: FileInput.extend({
		content: z.string().describe('File content, in the given encoding.'),
		encoding: encodingField,
	}),
	output: z.object({ path: z.string(), bytesWritten: z.number() }),
	run: async (runtime, input) => {
		const sandbox = await runtime.client.sandboxes.fromId(input.sandboxId);
		const bytes =
			input.encoding === 'base64'
				? Buffer.from(input.content, 'base64')
				: Buffer.from(input.content, 'utf8');
		await sandbox.filesystem.writeBytes(new Uint8Array(bytes), input.path);
		return { path: input.path, bytesWritten: bytes.length };
	},
});

export const listFiles = defineOperation({
	group: 'files',
	name: 'list',
	description: 'List the entries of a directory in a running sandbox.',
	riskLevel: 'read',
	input: FileInput,
	output: z.object({ entries: z.array(FileInfoSchema) }),
	run: async (runtime, input) => {
		const sandbox = await runtime.client.sandboxes.fromId(input.sandboxId);
		const entries = await sandbox.filesystem.listFiles(input.path);
		return { entries: entries.map(fileInfoToJson) };
	},
});

export const statFile = defineOperation({
	group: 'files',
	name: 'stat',
	description:
		'Type, size, owner, permissions and modified time of a path in a running sandbox.',
	riskLevel: 'read',
	input: FileInput,
	output: FileInfoSchema,
	run: async (runtime, input) => {
		const sandbox = await runtime.client.sandboxes.fromId(input.sandboxId);
		return fileInfoToJson(await sandbox.filesystem.stat(input.path));
	},
});

export const makeDirectory = defineOperation({
	group: 'files',
	name: 'makeDirectory',
	description: 'Create a directory in a running sandbox.',
	riskLevel: 'write',
	input: FileInput.extend({
		createParents: z
			.boolean()
			.optional()
			.describe('Also create missing parent directories (like mkdir -p).'),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await runtime.client.sandboxes.fromId(input.sandboxId);
		await sandbox.filesystem.makeDirectory(input.path, {
			createParents: input.createParents,
		});
		return { ok: true as const };
	},
});

export const removeFile = defineOperation({
	group: 'files',
	name: 'remove',
	description:
		'Delete a file or directory in a running sandbox (recursive for non-empty directories).',
	riskLevel: 'destructive',
	irreversible: true,
	input: FileInput.extend({ recursive: z.boolean().optional() }),
	output: OkSchema,
	run: async (runtime, input) => {
		const sandbox = await runtime.client.sandboxes.fromId(input.sandboxId);
		await sandbox.filesystem.remove(input.path, {
			recursive: input.recursive,
		});
		return { ok: true as const };
	},
});

export const filesOperations = [
	readFile,
	writeFile,
	listFiles,
	statFile,
	makeDirectory,
	removeFile,
] as const;
