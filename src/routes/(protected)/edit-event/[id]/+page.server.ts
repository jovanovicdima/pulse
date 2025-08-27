import { error, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { EventRepository } from '$lib/repositories/EventRepository';
import type { Event } from '$lib/models/Event';
import dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

export const load = async ({ params, locals }) => {
	if (!locals.userEmail) {
		throw error(400, 'Missing user authentication');
	}

	const event = await EventRepository.getEvent(params.id);

	if (event == null) {
		throw error(404, 'Event not found');
	}

	if (event!.postedBy !== locals.userEmail) {
		throw error(403, 'Forbidden: You are not the owner of this event');
	}

	return {
		event: event!
	};
};

function getStringField(form: FormData, key: string): string | null {
	const value = form.get(key);
	return typeof value === 'string' && value.trim() ? value.trim() : null;
}

export const actions: Actions = {
	default: async ({ params, request, locals }) => {
		if (!locals.userEmail) {
			return fail(400);
		}

		const event = await EventRepository.getEvent(params.id);
		if (event?.postedBy !== locals.userEmail) {
			return fail(403);
		}

		const form = await request.formData();

		const title = getStringField(form, 'title');
		const description = getStringField(form, 'description');
		const location = getStringField(form, 'location');
		const date = getStringField(form, 'date');
		const time = getStringField(form, 'time');

		const rawImage = form.get('image');
		let image: File | null = null;

		if (rawImage instanceof File) {
			image = rawImage;
		}

		if (!title || !description || !location || !date || !time) {
			return fail(400, { invalidInfo: true });
		}

		const updatedEvent: Event = {
			id: params.id,
			title: title,
			description: description,
			datetime: dayjs(`${date}T${time}:00`).toISOString(),
			location: location,
			postedBy: locals.userEmail,
			postedAt: event.postedAt,
			image: event.image
		};

		if (image && image.size > 0 && image.name !== '') {
			if (event.image) {
				const oldImagePath = path.join('static', 'eventImages', event.image);
				if (fs.existsSync(oldImagePath)) {
					try {
						fs.unlinkSync(oldImagePath);
					} catch (err) {
						console.error(`Failed to delete old image: ${event.image}`, err);
					}
				}
			}

			const ext = image.name.split('.').pop();
			const filename = randomUUID() + '.' + ext;

			const uploadDir = path.join('static', 'eventImages');
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}

			const buffer = Buffer.from(await image.arrayBuffer());
			const filePath = path.join(uploadDir, filename);
			fs.writeFileSync(filePath, buffer);
			updatedEvent.image = filename;
		}

		await EventRepository.updateEvent(updatedEvent);

		return { success: true };
	}
};
