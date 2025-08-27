<script lang="ts">
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import type { Event } from '$lib/models/Event';
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';

	const { data }: PageProps = $props();
	const event: Event = $derived(data.event!);

	let title = $derived(event.title);
	let description = $derived(event.description);
	let location = $derived(event.location);
	let date = $derived(dayjs(event.datetime).format('YYYY-MM-DD'));
	let time = $derived(dayjs(event.datetime).format('HH:mm'));
	let image: File | null = $state(null);

	$effect(() => {
		if (date && time) {
			const now = dayjs();
			const selectedDatetime = dayjs(`${date} ${time}`);

			if (selectedDatetime.isBefore(now)) {
				date = now.format('YYYY-MM-DD');
				time = now.format('HH:mm');
			}
		}
	});

	let isError = $derived.by(() => {
		if (title === '' || description === '' || location === '' || date === '' || time === '') {
			return true;
		}

		return false;
	});
</script>

<form
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			await update({ reset: false, invalidateAll: false });
			goto(`/event/${event.id}`);
		};
	}}
	class="mx-auto max-w-xl space-y-4 rounded-xl p-6 shadow-md"
	enctype="multipart/form-data"
>
	<h1 class="text-center text-2xl font-bold">Edit Event</h1>

	<input
		type="text"
		name="title"
		bind:value={title}
		placeholder="Event Title"
		class="bg-background w-full rounded border p-2 placeholder-gray-400"
		required
	/>

	<textarea
		name="description"
		bind:value={description}
		placeholder="Description"
		rows="4"
		class="bg-background w-full rounded border p-2 placeholder-gray-400"
		required
	></textarea>

	<input
		type="text"
		name="location"
		bind:value={location}
		placeholder="Location"
		class="bg-background w-full rounded border p-2 placeholder-gray-400"
		required
	/>

	<div class="flex space-x-2">
		<input
			type="date"
			name="date"
			bind:value={date}
			min={dayjs().format('YYYY-MM-DD')}
			class="bg-background rounded border p-2 placeholder-gray-400"
			required
		/>

		<input
			type="time"
			name="time"
			bind:value={time}
			class="bg-background rounded border p-2 placeholder-gray-400"
			required
		/>
		<label
			class="bg-primary-500 hover:bg-primary-600 text-background flex flex-1 cursor-pointer items-center justify-center gap-2 truncate rounded p-2"
		>
			<input
				type="file"
				name="image"
				accept="image/*"
				class="hidden"
				onchange={(e) => {
					const target = e.target as HTMLInputElement;
					image = target.files?.[0] ?? null;
				}}
			/>
			<span class="max-w-full truncate text-center">
				{#if image}
					Selected: {image.name}
				{:else}
					Choose an image
				{/if}
			</span>
		</label>
	</div>

	<div class="pt-4">
		<h2 class="mb-2 text-center text-2xl font-semibold">You cannot change the tickets.</h2>
	</div>

	<button
		type="submit"
		class="{isError
			? 'bg-primary-800 cursor-not-allowed'
			: 'bg-primary-500 hover:bg-primary-600 cursor-pointer'} text-background w-full flex-1 rounded py-2"
		disabled={isError}
	>
		Edit Event
	</button>
</form>
