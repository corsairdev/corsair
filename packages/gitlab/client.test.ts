import { isManagedGitlabHost } from './client';

describe('isManagedGitlabHost', () => {
	it('accepts gitlab.com and equivalent origins', () => {
		for (const url of [
			'https://gitlab.com',
			'https://gitlab.com:443',
			'https://gitlab.com.',
			'https://GitLab.com',
			'https://gitlab.com/',
			'https://user@gitlab.com',
		]) {
			expect(isManagedGitlabHost(url)).toBe(true);
		}
	});

	it('rejects custom and malformed hosts', () => {
		for (const url of [
			'https://gitlab.example.com',
			'https://notgitlab.com',
			'https://gitlab.com.evil.com',
			'https://gitlab.com@evil.com',
			'gitlab.com',
			// Cyrillic 'а' lookalike — new URL() punycodes it, so it is not gitlab.com
			'https://gitlаb.com',
		]) {
			expect(isManagedGitlabHost(url)).toBe(false);
		}
	});

	it('rejects non-default ports and non-https schemes (managed token must not reach a noncanonical service)', () => {
		for (const url of [
			'https://gitlab.com:8443',
			'https://gitlab.com:80',
			'http://gitlab.com',
		]) {
			expect(isManagedGitlabHost(url)).toBe(false);
		}
	});
});
