import { BookOpen, Shield, Zap } from 'lucide-react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
	return (
		<div className="min-h-screen">
			<Header />
			<main className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto space-y-8">
					<div className="text-center space-y-4">
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
							About This Blog
						</h1>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							A modern, type-safe blog platform built with cutting-edge
							technologies
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						<Card>
							<CardHeader>
								<BookOpen className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Next.js 15</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Built with the latest version of Next.js for optimal
									performance and developer experience
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Zap className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Corsair</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									AI-powered query generation with full type safety and
									automatic type inference
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<Shield className="h-8 w-8 mb-2 text-primary" />
								<CardTitle>Drizzle ORM</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									Type-safe database queries with excellent PostgreSQL
									integration
								</p>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>Features</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-semibold mb-2">
									Type-Safe Database Queries
								</h3>
								<p className="text-sm text-muted-foreground">
									All database queries are generated using Corsair&apos;s
									AI-powered CLI, ensuring full type safety from database to UI
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Modern UI Components</h3>
								<p className="text-sm text-muted-foreground">
									Built with Radix UI primitives and Tailwind CSS for a
									beautiful, accessible user interface
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Real-Time Updates</h3>
								<p className="text-sm text-muted-foreground">
									Comments and interactions update instantly with React Query
									integration
								</p>
							</div>
							<div>
								<h3 className="font-semibold mb-2">Responsive Design</h3>
								<p className="text-sm text-muted-foreground">
									Fully responsive layout that works seamlessly across all
									device sizes
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Tech Stack</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="space-y-2 text-sm">
								<li className="flex items-center gap-2">
									<span className="font-semibold">Frontend:</span>
									<span className="text-muted-foreground">
										Next.js 15, React 19, TypeScript
									</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="font-semibold">Styling:</span>
									<span className="text-muted-foreground">
										Tailwind CSS, Radix UI
									</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="font-semibold">Database:</span>
									<span className="text-muted-foreground">
										PostgreSQL, Drizzle ORM
									</span>
								</li>
								<li className="flex items-center gap-2">
									<span className="font-semibold">Data Layer:</span>
									<span className="text-muted-foreground">
										Corsair, React Query
									</span>
								</li>
							</ul>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
