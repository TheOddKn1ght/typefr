
<script>

	import favicon from '$lib/assets/favicon.ico';

	let { children } = $props();
	
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		@media (prefers-color-scheme: light) {
			:root {
				--bg: #eceff4;
				--fg: #252525;
				--link: #4f7193;
				--code_fg: #3c3c3c;
				--code_bg: #e6e9ed;
				--blue: #81a1c1;
				--lightblue: #609bac;
				--cyan: #60a09c;
				--yellow: #ebcb8b;
				--magenta: #b48ead;
				--red: #bf616a;
				--green: #83a763;
				--orange: #d08770;
				--gray: #535353;
			}
		}

		@media (prefers-color-scheme: dark) {
			:root {
				--bg: #252525;
				--fg: #eceff4;
				--link: #81a1c1;
				--code_fg: #a7a7a7;
				--code_bg: #3c3c3c;
				--blue: #4f7193;
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
