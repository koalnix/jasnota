/* Jasnota — the two origins and the share-link helper (shared by the site build, og.mjs and instagram/tools).

   SITE_URL    canonical origin: <link rel="canonical">, sitemap, robots, JSON-LD.          default https://jasnota.mk/
   PUBLIC_URL  where the pages can actually be fetched today: og:url, og:image, twitter:image and the links
               the social channels share. Facebook follows og:url and downloads og:image, so both must resolve.
               default: SITE_URL when SITE_URL is set explicitly, otherwise the current live host
               https://koalnix.github.io/jasnota/website/  (jasnota.mk does not resolve yet).

     node website/tools/build.mjs                                   # canonical jasnota.mk, previews on the live host
     SITE_URL=https://jasnota.mk/ PUBLIC_URL=https://jasnota.mk/ node website/tools/build.mjs   # after the domain is live

   Share links: every channel links to the article with UTM tags, so a future (cookie-free) analytics tool or the
   host's referrer report can tell the channels apart. The canonical URL never carries them. */

const slash = (u) => String(u).replace(/\/?$/, '/');
export const LIVE_HOST = 'https://koalnix.github.io/jasnota/website/';
export const SITE_URL = slash(process.env.SITE_URL || 'https://jasnota.mk/');
export const PUBLIC_URL = slash(process.env.PUBLIC_URL || (process.env.SITE_URL ? SITE_URL : LIVE_HOST));

export const CHANNELS = ['instagram', 'facebook'];

/* …/articles/<slug>/?utm_source=instagram|facebook&utm_medium=social&utm_campaign=<slug> */
export function shareUrl(slug, source, base = PUBLIC_URL) {
  if (!CHANNELS.includes(source)) throw new Error(`shareUrl: unknown channel "${source}"`);
  const u = new URL(`articles/${slug}/`, slash(base));
  u.searchParams.set('utm_source', source);
  u.searchParams.set('utm_medium', 'social');
  u.searchParams.set('utm_campaign', slug);
  return u.href;
}
export const articleUrl = (slug, base = PUBLIC_URL) => `${slash(base)}articles/${slug}/`;
