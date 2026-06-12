import type { ReactNode } from 'react';

// Applies the saved theme to this wrapper only (never <html>), before paint,
// so dark mode stays scoped to the routes that render <ThemeScope> and the
// landing page can never inherit it.
const themeInitScript = `(function(){try{var s=document.currentScript;if(s&&s.parentElement&&localStorage.getItem("corsair-theme")==="dark"){s.parentElement.classList.add("dark")}}catch(e){}})()`;

export function ThemeScope({ children }: { children: ReactNode }) {
	return (
		<div data-theme-scope suppressHydrationWarning>
			<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			{children}
		</div>
	);
}
