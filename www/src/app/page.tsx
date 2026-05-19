import { CopyInstallCommand } from '@/components/copy-install-command';
import { ScrollStorySection } from '@/components/scroll-story-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md">
				<div className="mx-auto flex h-14 max-w-5xl items-center px-6">
					<span className="text-lg font-semibold tracking-tight text-foreground">
						Corsair
					</span>
				</div>
			</header>
			<main className="mx-auto w-full max-w-5xl flex-1">
				<div className="flex min-h-[calc(100dvh-3.5rem)] flex-col items-center justify-center px-6 py-16 md:py-24">
					<h1 className="max-w-4xl text-center text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
						Any integration, anywhere
					</h1>
					<p className="mt-14 text-center text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground md:mt-20">
						Cloud and Local
					</p>
					<div className="mt-10 grid w-full max-w-2xl gap-6 sm:grid-cols-2 sm:gap-8 md:mt-12">
						<Card className="shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-base font-medium">Cloud</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<Button asChild className="w-full" size="lg">
									<a
										href="https://app.corsair.dev"
										target="_blank"
										rel="noopener noreferrer"
									>
										Open Corsair App
									</a>
								</Button>
							</CardContent>
						</Card>
						<Card className="shadow-sm">
							<CardHeader className="pb-2">
								<CardTitle className="text-base font-medium">Local</CardTitle>
							</CardHeader>
							<CardContent className="pt-2">
								<CopyInstallCommand />
							</CardContent>
						</Card>
					</div>
				</div>

				<ScrollStorySection index={0}>
					<h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
						Your customers bring their integrations inside your product
					</h2>
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
						Set up Corsair so your customers can access their integrations in
						your app, with their credentials. Use Corsair through an agent, plug
						it in with MCP, or build UI and workflows on top of deterministic
						operations—one surface for every integration.
					</p>
					<ul className="mt-10 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
						{['Agents', 'MCP', 'Deterministic operations'].map((tag) => (
							<li
								key={tag}
								className="border border-border/80 bg-card/60 px-3 py-1.5 ring-1 ring-foreground/10"
							>
								{tag}
							</li>
						))}
					</ul>
				</ScrollStorySection>

				<ScrollStorySection index={1} sectionClassName="bg-muted/15">
					<h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
						Stop rebuilding the boring ninety percent
					</h2>
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
						Token refresh, error handling, auth, and the rest of the integration
						plumbing—it's all handled through Corsair—so you can focus on your
						product instead of one-off fixes for every API.
					</p>
				</ScrollStorySection>

				<ScrollStorySection index={2}>
					<h2 className="text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
						Open source, all the way down
					</h2>
					<p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">
						All integrations and logic are completely open source. You can read
						how every operation works. If we’re missing an integration you need,
						open a pull request. Corsair is by the community, for the community.
					</p>
				</ScrollStorySection>
			</main>
		</div>
	);
}
