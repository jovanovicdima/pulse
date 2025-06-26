<script lang="ts">
	import { enhance } from '$app/forms';

	let { data }: { data: { userEmail: string | null } } = $props();
</script>

<header>
	<nav class="bg-lmao-500 flex w-full items-center justify-between px-8 py-2">
		<div>
			<h1>Pulse</h1>
		</div>
		{#if data?.userEmail == null}
			<div class="flex items-center gap-4">
				<a
					href="/login"
					class="border-text cursor-pointer rounded-xl border-2 px-6 py-2 select-none"
				>
					Log in
				</a>
				<a
					href="/register"
					class="border-primary-500 bg-primary-500 text-background cursor-pointer rounded-xl border-2 px-4 py-2 select-none"
				>
					Register
				</a>
			</div>
		{:else}
			<form action="/logout" method="POST" use:enhance>
				<button
					type="submit"
					class="border-text cursor-pointer rounded-xl border-2 px-6 py-2 select-none"
				>
					Log out
				</button>
			</form>
		{/if}
	</nav>
</header>

<!-- <ul>
	<li class="w-24 flex justify-center" aria-current={page.url.pathname === '/' ? 'page' : undefined}>
		<a href="/">Home</a>
	</li>
	<li class="w-24 flex justify-center" aria-current={page.url.pathname === '/about' ? 'page' : undefined}>
		<a href="/about">About</a>
	</li>
	<li class="w-24 flex justify-center" aria-current={page.url.pathname.startsWith('/sverdle') ? 'page' : undefined}>
		<a href="/sverdle">Sverdle</a>
	</li>
</ul> -->

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	/* li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	} */
</style>
