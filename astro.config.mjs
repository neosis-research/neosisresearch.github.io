import { defineConfig } from 'astro/config';
import { resolveDeployment } from './site.config.ts';
const { origin, base } = resolveDeployment(process.env);
export default defineConfig({ site: origin, base, output: 'static', trailingSlash: 'always' });
