import { IntegrationLogo } from '@/components/integrations/integration-logo';
import type { GatewaySkill } from '@/lib/gateway-skills';
import { appName, skillWhen } from '@/lib/gateway-skills';

/** An app's mark from /plugin-icons, with its initial when the icon fails. */
export function SkillAppIcon({ id, size = 24 }: { id: string; size?: number }) {
	return <IntegrationLogo id={id} displayName={appName(id)} size={size} />;
}

/** One skill in the directory: its apps, what it does and when it runs. The whole card links to its page. */
export function SkillCard({ skill }: { skill: GatewaySkill }) {
	return (
		<a
			href={`/skills/${skill.slug}`}
			className="flex min-w-0 flex-col gap-2.5 border border-[#1c1c1c1a] bg-white p-5 no-underline transition-colors hover:border-[#4a38f5] md:p-6"
		>
			<span className="flex min-h-6 items-center gap-1.5" aria-hidden>
				{skill.required.map((id) => (
					<SkillAppIcon key={id} id={id} />
				))}
				{skill.optional.slice(0, 4).map((id) => (
					<span key={id} className="inline-flex opacity-45">
						<SkillAppIcon id={id} />
					</span>
				))}
			</span>
			<h3 className="mt-1.5 text-lg font-medium tracking-[-0.015em] text-[#1c1c1c]">
				{skill.name}
			</h3>
			<p className="flex-1 text-[15px] leading-[1.5] text-[#1c1c1c99]">
				{skill.summary}
			</p>
			<span className="mt-1.5 flex justify-between gap-3 text-xs text-[#1c1c1c99]">
				<span className="font-[family-name:var(--landing-font-mono)]">
					{skillWhen(skill)}
				</span>
				<span className="whitespace-nowrap text-[#4a38f5]">Set up →</span>
			</span>
		</a>
	);
}

export function SkillGrid({ skills }: { skills: readonly GatewaySkill[] }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{skills.map((s) => (
				<SkillCard key={s.slug} skill={s} />
			))}
		</div>
	);
}
