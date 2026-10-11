/** The only place to set company identity and production destinations. */
export const site = {
  name: 'Neosis Research',
  shortName: 'Neosis',
  tagline: 'Complex questions. Clearer understanding.',
  description:
    'Neosis Research is a multidisciplinary research and consulting firm connecting computational expertise, rigorous evaluation, and evidence for better decisions.',
  domain: null as string | null, // Future origin, e.g. https://your-purchased-domain.org (no path).
  contactEmail: null as string | null, // Set a real monitored address to enable email inquiries.
  linkedIn: null as string | null,
  githubPages: {
    origin: 'https://neosis-research.github.io',
    base: '/neosisresearch.github.io', // This repository is a project site, not the organization site.
  },
};

export function resolveDeployment(env: Record<string, string | undefined> = {}) {
  const origin = env.SITE_URL || site.domain || site.githubPages.origin;
  const parsed = new URL(origin);
  if (
    !['https:', 'http:'].includes(parsed.protocol) ||
    parsed.pathname !== '/' ||
    parsed.search ||
    parsed.hash
  ) {
    throw new Error(
      'SITE_URL / site.domain must be an HTTP(S) origin without a path, query, or fragment. Set BASE_PATH separately.',
    );
  }
  const requestedBase =
    env.BASE_PATH ?? (site.domain || env.SITE_URL ? '/' : site.githubPages.base);
  const base = '/' + requestedBase.split('/').filter(Boolean).join('/');
  return { origin: parsed.origin, base: base === '/' ? '/' : base + '/' };
}
export const contactEmail =
  site.contactEmail && !site.contactEmail.endsWith('.example') ? site.contactEmail : null;
