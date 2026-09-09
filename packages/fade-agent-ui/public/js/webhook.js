const jobStatus = document.getElementById('job-status');
const pollInput = document.getElementById('poll-phantom-id');
const pollBtn = document.getElementById('btn-poll');
const pollStatus = document.getElementById('poll-status');

async function refreshJobs() {
	try {
		const r = await fetch('/api/jobs');
		const d = await r.json();
		if (jobStatus) {
			jobStatus.textContent = d.running
				? `⚡ Processing… (${d.queued} queued)`
				: d.queued > 0
					? `⏳ ${d.queued} job(s) waiting`
					: '✅ Idle';
			jobStatus.className =
				'job-status ' +
				(d.running ? 'running' : d.queued > 0 ? 'waiting' : 'idle');
		}
	} catch {
		/* offline */
	}
}

pollBtn?.addEventListener('click', async () => {
	const id = pollInput?.value.trim();
	if (!id) {
		if (pollStatus) pollStatus.textContent = '⚠ Enter a Phantom ID';
		return;
	}
	pollBtn.disabled = true;
	if (pollStatus) pollStatus.textContent = 'Pulling…';
	try {
		const r = await fetch('/api/poll', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phantomId: id }),
		});
		const d = await r.json();
		if (pollStatus) {
			pollStatus.textContent = d.ok
				? `✅ Queued ${d.queued} lead(s)`
				: `❌ ${d.error}`;
		}
	} catch (e) {
		if (pollStatus) pollStatus.textContent = `❌ ${e.message}`;
	} finally {
		pollBtn.disabled = false;
		refreshJobs();
	}
});

// Refresh job status every 4s
setInterval(refreshJobs, 4_000);
refreshJobs();
