<script lang="ts">
	import { enhance } from '$app/forms';
	import { LogIn, LogOut, Plus, UserPlus } from 'lucide-svelte';

	let { data }: { data: { userEmail: string | null } } = $props();
</script>

<header>
	<nav class="bg-lmao-500 flex w-full items-center justify-between px-8 py-2">
		<div>
			<a href="/" class="text-4xl">Pulse</a>
		</div>
		<!--  -->
		{#if data?.userEmail == null}
			<div class="hidden items-center gap-4 md:flex">
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

			<div class="flex items-center gap-4 md:hidden">
				<a
					href="/login"
					class="border-text flex cursor-pointer items-center justify-center rounded-xl border-2 p-2 select-none"
					aria-label="Log in"
				>
					<LogIn class="h-6 w-6" />
				</a>
				<a
					href="/register"
					class="border-primary-500 bg-primary-500 text-background flex cursor-pointer items-center justify-center rounded-xl border-2 p-2 select-none"
					aria-label="Register"
				>
					<UserPlus class="h-6 w-6" />
				</a>
			</div>
		{:else}
			<div class="flex items-center gap-4">
				<a
					href="/new-event"
					class="text-text hidden cursor-pointer rounded-xl px-4 md:inline-block"
				>
					Create new event
				</a>
				<a
					href="/new-event"
					class="text-text flex cursor-pointer items-center justify-center rounded-xl p-2 md:hidden"
					aria-label="Create new event"
				>
					<Plus class="h-6 w-6" />
				</a>

				<form action="/logout" method="POST" use:enhance>
					<button
						type="submit"
						class="border-text hidden cursor-pointer rounded-xl border-2 px-6 py-2 select-none md:inline-block"
					>
						Log out
					</button>

					<button
						type="submit"
						class="border-text flex cursor-pointer items-center justify-center rounded-xl border-2 p-2 select-none md:hidden"
						aria-label="Log out"
					>
						<LogOut class="h-6 w-6" />
					</button>
				</form>
			</div>
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
