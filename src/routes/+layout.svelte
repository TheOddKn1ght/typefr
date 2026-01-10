
<script>

	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
	
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		@media (prefers-color-scheme: light) {
			:root {
				--bg: #ffffff;
				--fg: #0a0a0a;
				--link: #2563eb;
				--code_fg: #111827;
				--code_bg: #f1f5f9;
				--border: #e2e8f0;
				--blue: #3b82f6;
				--blue-shadow: rgba(59, 130, 246, 0.15);
				--lightblue: #0ea5e9;
				--cyan: #06b6d4;
				--yellow: #f59e0b;
				--magenta: #a855f7;
				--red: #ef4444;
				--green: #10b981;
				--orange: #f97316;
				--gray: #374151;
			}
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--bg: #252525;
				--fg: #eceff4;
				--link: #81a1c1;
				--code_fg: #a7a7a7;
				--code_bg: #3c3c3c;
				--border: #4a5568;
				--blue: #4f7193;
				--blue-shadow: rgba(79, 113, 147, 0.2);
				--lightblue: #609bac;
				--cyan: #60a09c;
				--yellow: #ebcb8b;
				--magenta: #b48ead;
				--red: #bf616a;
				--green: #83a763;
				--orange: #d08770;
				--gray: #7c8188;
			}
		}
	</style>
</svelte:head>

{@render children?.()}
