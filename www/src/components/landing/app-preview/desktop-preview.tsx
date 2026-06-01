'use client';

import { ChatDemoSyncProvider } from '../hooks/use-chat-demo-sync';
import { WindowOrderProvider } from '../hooks/use-window-order';
import { AppWindow } from './app-window';
import { CrmShell } from './crm-shell';
import { PreviewLayoutProvider } from './preview-layout-context';
import { TerminalWindow } from './terminal-window';

export function DesktopPreview() {
	return (
		<div className="relative mx-auto mt-2 w-full max-w-[1280px] text-left md:mt-4">
			<div
				className="relative mx-auto w-full max-md:min-h-[420px] max-md:h-[min(72vh,640px)] md:max-h-[740px] md:[aspect-ratio:1280/832]"
			>
				<PreviewLayoutProvider>
					<WindowOrderProvider>
						<ChatDemoSyncProvider>
							<AppWindow>
								<CrmShell />
							</AppWindow>
							<TerminalWindow />
						</ChatDemoSyncProvider>
					</WindowOrderProvider>
				</PreviewLayoutProvider>
			</div>
		</div>
	);
}
