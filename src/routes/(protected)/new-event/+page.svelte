<script lang="ts">
	import { enhance } from '$app/forms';
	import type { NewTicket } from '$lib/models/Ticket';

	let title = $state('');
	let description = $state('');
	let location = $state('');
	let date = $state('');
	let time = $state('');
	let tickets: NewTicket[] = $state([]);

	function addTicket() {
		tickets.push({ name: '', count: 0, price: 0 });
	}

	function removeTicket(index: number) {
		tickets.splice(index, 1);
	}
</script>

<form method="POST" use:enhance class="mx-auto max-w-xl space-y-4 rounded-xl p-6 shadow-md">
	<h1 class="text-center text-2xl font-bold">Create Event</h1>

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
		<button
			type="button"
			onclick={() => {}}
			class="bg-primary-500 hover:bg-primary-600 text-background flex-1 cursor-pointer rounded"
		>
			Upload Image
		</button>
	</div>

	<input type="hidden" name="ticketsJson" value={JSON.stringify(tickets)} />

	<div class="pt-4">
		<h2 class="text-center text-2xl font-semibold">Tickets</h2>
		{#each tickets as ticket, i}
			<div class="flex space-x-2">
				<input
					type="text"
					bind:value={ticket.name}
					placeholder="Ticket Name"
					class="bg-background flex-1 rounded border p-2 placeholder-gray-400"
				/>
				<input
					type="number"
					inputmode="numeric"
					bind:value={ticket.count}
					placeholder="Count"
					class="bg-background w-24 rounded border p-2 placeholder-gray-400"
				/>
				<input
					type="number"
					inputmode="numeric"
					bind:value={ticket.price}
					placeholder="Price"
					class="bg-background w-24 rounded border p-2 placeholder-gray-400"
				/>
				<button type="button" onclick={() => removeTicket(i)} class="px-2 text-red-500">✕</button>
			</div>
		{/each}
		<button
			type="button"
			onclick={addTicket}
			class="text-primary-500 hover:text-primary-600 mt-2 cursor-pointer">+ Add Ticket</button
		>
	</div>

	<button
		type="submit"
		class="bg-primary-500 hover:bg-primary-600 text-background w-full flex-1 cursor-pointer rounded py-2"
	>
		Create Event
	</button>
</form>
