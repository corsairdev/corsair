export const CLIENT_BRIDGE_MESSAGE_TYPE = 'corsair:client-bridge';

export function buildClientBridgePostMessageHtml(input: {
	hubOrigin: string;
	requestId: string;
	ok: boolean;
	body?: unknown;
	error?: string;
}): string {
	const message = JSON.stringify({
		type: CLIENT_BRIDGE_MESSAGE_TYPE,
		requestId: input.requestId,
		ok: input.ok,
		body: input.body ?? null,
		error: input.error ?? null,
	});
	const targetOrigin = JSON.stringify(input.hubOrigin);

	return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
(function () {
  var message = ${message};
  var targetOrigin = ${targetOrigin};
  if (window.parent && window.parent !== window) {
    window.parent.postMessage(message, targetOrigin);
  }
})();
</script></body></html>`;
}
