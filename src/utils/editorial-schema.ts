import { z } from 'astro/zod';
import { CATEGORIES } from './posts';

export const editorialSchema = z.object({
	category: z.enum(CATEGORIES).default('Race Analysis'),
	tags: z.array(z.string().min(1)).default([]),
	draft: z.boolean().default(false),
	featured: z.boolean().default(false),
	heroAlt: z.string().min(1).optional(),
	imageCredit: z.string().min(1).optional(),
	imageSource: z.url().optional(),
	articleType: z.enum(['Analysis', 'Reported rumour', 'Explainer']).default('Analysis'),
	reportingCutoff: z.coerce.date().optional(),
});