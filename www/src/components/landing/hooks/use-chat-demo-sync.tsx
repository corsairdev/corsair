'use client';

import type { ReactNode } from 'react';
import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from 'react';
import type { IntegrationId } from '../data/companies-data';

type ChatDemoSyncContextValue = {
	activeIntegrationIds: IntegrationId[];
	pulseIntegration: (id: IntegrationId) => void;
	unpulseIntegration: (id: IntegrationId) => void;
	clearPulses: () => void;
};

const ChatDemoSyncContext = createContext<ChatDemoSyncContextValue | null>(
	null,
);

export function ChatDemoSyncProvider({ children }: { children: ReactNode }) {
	const [pulseCounts, setPulseCounts] = useState<
		Partial<Record<IntegrationId, number>>
	>({});

	const activeIntegrationIds = useMemo(
		() =>
			(Object.entries(pulseCounts) as [IntegrationId, number][])
				.filter(([, count]) => count > 0)
				.map(([id]) => id),
		[pulseCounts],
	);

	const pulseIntegration = useCallback((id: IntegrationId) => {
		setPulseCounts((prev) => ({
			...prev,
			[id]: (prev[id] ?? 0) + 1,
		}));
	}, []);

	const unpulseIntegration = useCallback((id: IntegrationId) => {
		setPulseCounts((prev) => {
			const next = { ...prev };
			const count = (next[id] ?? 1) - 1;
			if (count <= 0) {
				delete next[id];
			} else {
				next[id] = count;
			}
			return next;
		});
	}, []);

	const clearPulses = useCallback(() => {
		setPulseCounts({});
	}, []);

	const value = useMemo(
		() => ({
			activeIntegrationIds,
			pulseIntegration,
			unpulseIntegration,
			clearPulses,
		}),
		[activeIntegrationIds, pulseIntegration, unpulseIntegration, clearPulses],
	);

	return (
		<ChatDemoSyncContext.Provider value={value}>
			{children}
		</ChatDemoSyncContext.Provider>
	);
}

export function useChatDemoSync() {
	const ctx = useContext(ChatDemoSyncContext);
	if (!ctx) {
		throw new Error('useChatDemoSync must be used within ChatDemoSyncProvider');
	}
	return ctx;
}
