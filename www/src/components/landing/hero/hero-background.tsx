export function HeroBackground() {
	return (
		<div
			className="pointer-events-none absolute inset-0 overflow-hidden"
			aria-hidden
		>
			<div
				className="absolute inset-[-40px] opacity-100 transition-opacity duration-[600ms]"
				style={{
					background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(245, 243, 240, 0.6) 0%, transparent 70%)`,
				}}
			/>
			<svg
				className="absolute inset-0 h-full w-full"
				viewBox="0 0 1200 800"
				preserveAspectRatio="xMidYMid slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<defs>
					<pattern
						id="halftone-dots"
						width="8"
						height="8"
						patternUnits="userSpaceOnUse"
					>
						<circle cx="1" cy="1" r="0.8" fill="#4a38f5" opacity="0.12" />
					</pattern>
				</defs>
				<path
					d="M-50 420 C 200 280, 400 520, 650 380 S 1100 300, 1250 450"
					fill="none"
					stroke="#4a38f5"
					strokeWidth="2"
					strokeDasharray="6 8"
					opacity="0.35"
				/>
				<path
					d="M-80 520 C 250 400, 500 600, 750 480 S 1150 380, 1280 560"
					fill="none"
					stroke="#4a38f5"
					strokeWidth="1.5"
					strokeDasharray="4 10"
					opacity="0.25"
				/>
				<path
					d="M100 650 C 350 500, 550 700, 800 580 S 1050 450, 1200 620"
					fill="none"
					stroke="#8174f8"
					strokeWidth="1"
					strokeDasharray="3 12"
					opacity="0.2"
				/>
				<rect width="100%" height="100%" fill="url(#halftone-dots)" />
			</svg>
		</div>
	);
}
