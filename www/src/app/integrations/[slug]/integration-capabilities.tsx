'use client';

import { KeyIcon, LightningIcon, PlugsIcon } from '@phosphor-icons/react';

import { ExpandableSection } from './expandable-section';
import { IntegrationAuthSchemeList } from './integration-auth-scheme-list';
import { IntegrationCapabilityList } from './integration-capability-list';

type Operation = {
	id: string;
	name: string;
	slug: string;
	description: string;
	isDeprecated: boolean;
};

type Trigger = {
	id: string;
	name: string;
	slug: string;
	description: string;
	type: string;
};

type AuthScheme = {
	id: string;
	mode: string;
	name: string;
};

export function IntegrationCapabilities({
	operations,
	triggers,
	authSchemes,
	operationCount,
	triggerCount,
	authSchemeCount,
}: {
	operations: Operation[];
	triggers: Trigger[];
	authSchemes: AuthScheme[];
	operationCount: number;
	triggerCount: number;
	authSchemeCount: number;
}) {
	return (
		<>
			<ExpandableSection
				title="Operations"
				count={operationCount}
				icon={<PlugsIcon size={16} aria-hidden />}
				defaultOpen={operationCount > 0 && operationCount <= 8}
			>
				<IntegrationCapabilityList
					items={operations.map((operation) => ({
						id: operation.id,
						name: operation.name,
						slug: operation.slug,
						description: operation.description,
						badge: operation.isDeprecated ? 'deprecated' : undefined,
					}))}
					emptyMessage="No operations."
				/>
			</ExpandableSection>

			<ExpandableSection
				title="Webhooks"
				count={triggerCount}
				icon={<LightningIcon size={16} aria-hidden />}
				defaultOpen={triggerCount > 0 && triggerCount <= 8}
			>
				<IntegrationCapabilityList
					items={triggers.map((trigger) => ({
						id: trigger.id,
						name: trigger.name,
						slug: trigger.slug,
						description: trigger.description,
						badge: trigger.type,
					}))}
					emptyMessage="No webhooks."
				/>
			</ExpandableSection>

			<ExpandableSection
				title="Auth types"
				count={authSchemeCount}
				icon={<KeyIcon size={16} aria-hidden />}
				defaultOpen={authSchemeCount > 0 && authSchemeCount <= 8}
			>
				<IntegrationAuthSchemeList
					items={authSchemes}
					emptyMessage="No auth types."
				/>
			</ExpandableSection>
		</>
	);
}
