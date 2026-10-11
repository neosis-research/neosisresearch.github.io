import { getCollection } from 'astro:content';
export async function publishedInsights() {
  return (
    await getCollection('insights', ({ data }) => !data.draft && data.publishedAt <= new Date())
  ).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
