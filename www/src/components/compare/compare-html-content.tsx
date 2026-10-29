export function CompareHtmlContent({ html }: { html: string }) {
	return (
		<div
			className="[&_a]:text-[#4a38f5] [&_a]:underline [&_a]:decoration-[#4a38f533] [&_a]:underline-offset-2 hover:[&_a]:decoration-[#4a38f5] [&_p+p]:mt-4"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
