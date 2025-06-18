<script lang="ts">
	import { page } from '$app/state';
</script>

<header>
	<nav class="flex w-full justify-between items-center px-8 py-2 bg-lmao-500">
		<div>
			<h1>Pulse</h1>
		</div>
		<div class="flex gap-4 items-center">
			<p class="border-text border px-6 py-2 rounded-xl select-none cursor-pointer">
				Log in
			</p>
			<p class="border-primary-500 border bg-primary-500 px-4 py-2 rounded-xl text-background select-none cursor-pointer">
				Register
			</p>
		</div>
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

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		color: var(--color-theme-1);
	}
</style>
