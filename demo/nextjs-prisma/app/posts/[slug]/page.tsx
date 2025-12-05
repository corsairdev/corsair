import { Header } from "@/components/header";
import { PostDetail } from "@/components/post-detail";

interface PostPageProps {
	params: Promise<{
		slug: string;
	}>;
}

export default async function PostPage({ params }: PostPageProps) {
	const { slug } = await params;

	return (
		<div className="min-h-screen">
			<Header />
			<main className="container mx-auto px-4 py-12">
				<PostDetail slug={slug} />
			</main>
		</div>
	);
}
