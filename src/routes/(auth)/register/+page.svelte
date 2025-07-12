<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';

	let showPassword: boolean = false;
	let showConfirmPassword: boolean = false;

	export let form: ActionData;
</script>

<div class="flex w-full grow flex-col items-center justify-center gap-4 p-10">
	<div class="flex flex-col items-center gap-2">
		<p class="text-primary-500 text-3xl">Create New Account</p>
	</div>

	<form
		action="?/register"
		method="POST"
		use:enhance
		class="flex w-full max-w-96 flex-col gap-4 rounded-md p-4"
	>
		<div class="flex w-full flex-col">
			<input
				class="text-background w-full rounded-lg border px-4 py-2 pr-10"
				type="email"
				name="email"
				placeholder="Enter your email address"
				required
			/>
		</div>

		<div class="relative w-full">
			<input
				name="password"
				type={showPassword ? 'text' : 'password'}
				placeholder="Enter password"
				class="text-background w-full rounded-lg border px-4 py-2 pr-10"
				required
			/>

			<button
				type="button"
				class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800"
				on:click={() => (showPassword = !showPassword)}
				aria-label="Toggle password visibility"
			>
				{#if showPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 cursor-pointer"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 cursor-pointer"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.584-4.133M6.223 6.223A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.961 9.961 0 01-4.221 5.172M3 3l18 18"
						/>
					</svg>
				{/if}
			</button>
		</div>

		<div class="relative w-full">
			<input
				name="repeatPassword"
				type={showConfirmPassword ? 'text' : 'password'}
				placeholder="Confirm password"
				class="text-background w-full rounded-lg border px-4 py-2 pr-10"
				required
			/>

			<button
				type="button"
				class="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-800"
				on:click={() => (showConfirmPassword = !showConfirmPassword)}
				aria-label="Toggle confirm password visibility"
			>
				{#if showConfirmPassword}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 cursor-pointer"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 cursor-pointer"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.964 9.964 0 012.584-4.133M6.223 6.223A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.961 9.961 0 01-4.221 5.172M3 3l18 18"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#if form?.invalid}
			<p class="text-center text-red-500">Something went wrong. Please try again.</p>
		{/if}

		{#if form?.email}
			<p class="text-center text-red-500">Email is already taken.</p>
		{/if}

		{#if form?.repeatPassword}
			<p class="text-center text-red-500">Passwords must match.</p>
		{/if}

		<button
			type="submit"
			class="border-primary-500 bg-primary-500 text-background cursor-pointer rounded-lg border px-4 py-2 select-none"
			>Register</button
		>
	</form>
	<p class="mt-4 text-center">
		Already have an account? <a class="text-primary-500" href="/login">Log in.</a>
	</p>
</div>
