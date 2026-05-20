'use client';

import type { ReactNode } from 'react';
import { FeatureScene, PreviewPanel } from './feature-scene';
import { MiniWindowChrome } from './mini-window-chrome';

const TS = {
	keyword: '#0000FF',
	property: '#001080',
	function: '#795E26',
	identifier: '#001080',
	boolean: '#0000FF',
	punctuation: '#1c1c1c',
} as const;

export function SelfHostVisual() {
	return (
		<FeatureScene align="center">
			<PreviewPanel align="center">
				<MiniWindowChrome
					title="corsair.ts"
					hoverTitle="localhost:3000"
					showTrafficLights={false}
					slice="center"
					className="h-full min-h-0"
				>
					<pre className="min-h-0 flex-1 overflow-x-auto px-4 py-3.5 font-[family-name:var(--landing-font-mono)] text-[11px] font-normal leading-[1.65] md:text-[12px]">
						<CodeLine>
							<TsKw>export</TsKw> <TsKw>const</TsKw> <TsId>corsair</TsId> ={' '}
							<TsFn>createCorsair</TsFn>
							<TsPunc>({'{'}</TsPunc>
						</CodeLine>
						<CodeLine indent={1}>
							<TsProp>multiTenancy</TsProp>
							<TsPunc>: </TsPunc>
							<TsBool>true</TsBool>
							<TsPunc>,</TsPunc>
						</CodeLine>
						<CodeLine indent={1}>
							<TsProp>database</TsProp>
							<TsPunc>: </TsPunc>
							<TsId>pool</TsId>
							<TsPunc>,</TsPunc>
						</CodeLine>
						<CodeLine indent={1}>
							<TsProp>kek</TsProp>
							<TsPunc>: </TsPunc>
							<TsId>process</TsId>
							<TsPunc>.</TsPunc>
							<TsProp>env</TsProp>
							<TsPunc>.</TsPunc>
							<TsId>CORSAIR_KEK</TsId>
							<TsPunc>!,</TsPunc>
						</CodeLine>
						<CodeLine indent={1}>
							<TsProp>plugins</TsProp>
							<TsPunc>: [</TsPunc>
						</CodeLine>
						<CodeLine indent={2}>
							<TsFn>notion</TsFn>
							<TsPunc>(),</TsPunc>
						</CodeLine>
						<CodeLine indent={2}>
							<TsFn>slack</TsFn>
							<TsPunc>(),</TsPunc>
						</CodeLine>
						<CodeLine indent={2}>
							<TsFn>gmail</TsFn>
							<TsPunc>(),</TsPunc>
						</CodeLine>
						<CodeLine indent={2}>
							<TsFn>googlecalendar</TsFn>
							<TsPunc>(),</TsPunc>
						</CodeLine>
						<CodeLine indent={1}>
							<TsPunc>],</TsPunc>
						</CodeLine>
						<CodeLine>
							<TsPunc>{'});'}</TsPunc>
						</CodeLine>
					</pre>
				</MiniWindowChrome>
			</PreviewPanel>
		</FeatureScene>
	);
}

function CodeLine({
	children,
	indent = 0,
}: {
	children: ReactNode;
	indent?: number;
}) {
	return (
		<code className="block whitespace-pre font-normal">
			{'\t'.repeat(indent)}
			{children}
		</code>
	);
}

function TsKw({ children }: { children: ReactNode }) {
	return <span style={{ color: TS.keyword }}>{children}</span>;
}

function TsProp({ children }: { children: ReactNode }) {
	return <span style={{ color: TS.property }}>{children}</span>;
}

function TsFn({ children }: { children: ReactNode }) {
	return <span style={{ color: TS.function }}>{children}</span>;
}

function TsId({ children }: { children: ReactNode }) {
	return <span style={{ color: TS.identifier }}>{children}</span>;
}

function TsBool({ children }: { children: ReactNode }) {
	return <span style={{ color: TS.boolean }}>{children}</span>;
}

function TsPunc({ children }: { children: ReactNode }) {
	return <span style={{ color: TS.punctuation }}>{children}</span>;
}
