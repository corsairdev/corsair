import { logEventFromContext } from 'corsair/core';
import type { BuiltWithEndpoints } from '..';

function dedupeDomains(domains: string[]): string[] {
	return [...new Set(domains.map((domain) => domain.trim()).filter(Boolean))];
}

function crc32(data: Buffer): number {
	let crc = 0xffffffff;
	for (const byte of data) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit++) {
			crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
		}
	}
	return (crc ^ 0xffffffff) >>> 0;
}

function createZipBase64(fileName: string, content: string): string {
	const name = Buffer.from(fileName, 'utf8');
	const data = Buffer.from(content, 'utf8');
	const checksum = crc32(data);

	const localHeader = Buffer.alloc(30 + name.length);
	localHeader.writeUInt32LE(0x04034b50, 0);
	localHeader.writeUInt16LE(20, 4);
	localHeader.writeUInt16LE(0, 6);
	localHeader.writeUInt16LE(0, 8);
	localHeader.writeUInt32LE(checksum, 14);
	localHeader.writeUInt32LE(data.length, 18);
	localHeader.writeUInt32LE(data.length, 22);
	localHeader.writeUInt16LE(name.length, 26);
	localHeader.writeUInt16LE(0, 28);
	name.copy(localHeader, 30);

	const centralDirectory = Buffer.alloc(46 + name.length);
	centralDirectory.writeUInt32LE(0x02014b50, 0);
	centralDirectory.writeUInt16LE(20, 4);
	centralDirectory.writeUInt16LE(20, 6);
	centralDirectory.writeUInt16LE(0, 8);
	centralDirectory.writeUInt16LE(0, 10);
	centralDirectory.writeUInt32LE(checksum, 16);
	centralDirectory.writeUInt32LE(data.length, 20);
	centralDirectory.writeUInt32LE(data.length, 24);
	centralDirectory.writeUInt16LE(name.length, 28);
	centralDirectory.writeUInt16LE(0, 30);
	centralDirectory.writeUInt16LE(0, 32);
	centralDirectory.writeUInt16LE(0, 34);
	centralDirectory.writeUInt16LE(0, 36);
	centralDirectory.writeUInt32LE(0, 38);
	centralDirectory.writeUInt32LE(0, 42);
	name.copy(centralDirectory, 46);

	const endRecord = Buffer.alloc(22);
	endRecord.writeUInt32LE(0x06054b50, 0);
	endRecord.writeUInt16LE(0, 4);
	endRecord.writeUInt16LE(0, 6);
	endRecord.writeUInt16LE(1, 8);
	endRecord.writeUInt16LE(1, 10);
	endRecord.writeUInt32LE(centralDirectory.length, 12);
	endRecord.writeUInt32LE(localHeader.length + data.length, 16);
	endRecord.writeUInt16LE(0, 20);

	return Buffer.concat([
		localHeader,
		data,
		centralDirectory,
		endRecord,
	]).toString('base64');
}

export const createDomainListFile: BuiltWithEndpoints['createDomainListFile'] =
	async (ctx, input) => {
		const domains = dedupeDomains(input.domains);
		const format = input.format ?? 'txt';
		const fileName =
			input.fileName ?? (format === 'zip' ? 'domains.zip' : 'domains.txt');
		const textContent = domains.join('\n');

		const content =
			format === 'zip'
				? createZipBase64(
						fileName.endsWith('.txt') ? fileName : 'domains.txt',
						textContent,
					)
				: textContent;

		const result = {
			fileName,
			format,
			content,
			encoding: format === 'zip' ? 'base64' : 'utf8',
			domainCount: domains.length,
			domains,
		};

		await logEventFromContext(
			ctx,
			'builtwith.create.domain.list.file',
			{ ...input },
			'completed',
		);

		return result;
	};
