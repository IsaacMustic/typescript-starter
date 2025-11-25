# Implementation Plan - SSE, Blog, Sitemap, Robots, i18n

This plan outlines the steps to add Server-Sent Events (SSE), a Blog (MDX), Sitemap, Robots.txt, and Internationalization (i18n) to the Next.js application.

## 1. Dependencies
Install necessary packages:
- `next-intl`: For internationalization.
- `next-mdx-remote`: For rendering MDX blog posts.
- `gray-matter`: For parsing MDX frontmatter.

## 2. Internationalization (i18n)
We will use `next-intl` with the App Router.

### Configuration
- Create `messages/en.json` for English translations.
- Create `src/i18n/request.ts` (or `lib/i18n/request.ts`) to load messages.
- Update `next.config.ts` to use `createNextIntlPlugin`.

### Middleware
- Update `middleware.ts` to combine `better-auth` logic with `next-intl` middleware.
- The middleware will first check for locale, then handle auth redirects.

### Structure Refactor
- Create `app/[locale]` directory.
- Move `(auth)`, `(dashboard)`, `(marketing)` into `app/[locale]`.
- Move `app/layout.tsx` to `app/[locale]/layout.tsx` and update it to:
    - Accept `params: { locale: string }`.
    - Set `<html lang={locale}>`.
    - Initialize `NextIntlClientProvider`.

## 3. Blog
We will use a file-system based approach with MDX.

### Content
- Create `content/posts` directory.
- Add a sample post `hello-world.mdx`.

### Logic
- Create `lib/blog.ts` to read and parse MDX files using `fs` and `gray-matter`.

### UI
- Create `app/[locale]/blog/page.tsx`: List all posts.
- Create `app/[locale]/blog/[slug]/page.tsx`: Render a single post using `MDXRemote`.

## 4. Server-Sent Events (SSE)
- Create `app/api/sse/route.ts`.
- Implement a GET handler that returns a `ReadableStream` with `Content-Type: text/event-stream`.
- Add a demo component `components/sse-demo.tsx` to subscribe to the stream.

## 5. SEO (Sitemap & Robots)
- Create `app/sitemap.ts`: Generate sitemap dynamically (including blog posts).
- Create `app/robots.ts`: Generate robots.txt.

## 6. Verification
- Run `pnpm type-check`.
- Run `pnpm lint`.
- Verify functionality manually (or via test script if possible).
