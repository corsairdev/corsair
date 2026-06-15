type MagicLinkEmailContext = 'waitlist' | 'sign-in';

function getMagicLinkContext(url: string): MagicLinkEmailContext {
	try {
		const parsed = new URL(url);
		const callback =
			parsed.searchParams.get('callbackURL') ??
			parsed.searchParams.get('callbackUrl') ??
			'';

		if (callback.includes('waitlist')) {
			return 'waitlist';
		}
	} catch {
		// Fall back to the default sign-in copy.
	}

	return 'sign-in';
}

function escapeHtml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;');
}

export function buildMagicLinkEmail({
	url,
	context,
}: {
	url: string;
	context: MagicLinkEmailContext;
}) {
	const isWaitlist = context === 'waitlist';

	const subject = isWaitlist
		? 'Confirm your email — Corsair OSS Hackathon'
		: 'Confirm your email — Corsair OSS Hackathon';

	const headline = isWaitlist
		? 'Confirm your waitlist spot'
		: 'Confirm your email';

	const preview = isWaitlist
		? 'One click to confirm your email and finish joining the Corsair integrations hackathon waitlist.'
		: 'One click to confirm your email and join the Corsair integrations hackathon.';

	const body = isWaitlist
		? 'Thanks for signing up for the Corsair OSS Hackathon waitlist. Confirm your email address to save your spot — we will notify you when integrations open for claiming.'
		: 'Confirm your email address to join the Corsair OSS Hackathon. Once verified, you can claim integrations, ship plugins, and climb the leaderboard.';

	const cta = isWaitlist ? 'Confirm email address' : 'Confirm email address';
	const safeUrl = escapeHtml(url);

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1c1c;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border:1px solid rgba(28,28,28,0.1);">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 12px;font-size:11px;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;color:rgba(28,28,28,0.6);">
                Corsair OSS Hackathon
              </p>
              <h1 style="margin:0 0 12px;font-size:28px;font-weight:400;line-height:1.15;letter-spacing:-0.02em;color:#1c1c1c;">
                ${escapeHtml(headline)}
              </h1>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:rgba(28,28,28,0.6);">
                ${escapeHtml(body)}
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:rgba(28,28,28,0.6);">
                ${escapeHtml(preview)}
              </p>
              <a href="${safeUrl}" style="display:inline-block;background:#1c1c1c;color:#ffffff;text-decoration:none;font-size:14px;font-weight:500;line-height:1;padding:14px 20px;border-radius:8px;">
                ${escapeHtml(cta)}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:rgba(28,28,28,0.45);">
                This link expires soon. If the button does not work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0;font-size:12px;line-height:1.6;word-break:break-all;color:rgba(28,28,28,0.6);">
                <a href="${safeUrl}" style="color:#4a38f5;text-decoration:underline;">${safeUrl}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

	return { subject, html };
}

export function buildMagicLinkEmailFromUrl(url: string) {
	return buildMagicLinkEmail({
		url,
		context: getMagicLinkContext(url),
	});
}
