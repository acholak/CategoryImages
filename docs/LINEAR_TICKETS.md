# Linear Tickets
## Project: Category Image Generator
## Workspace: categoryimages

> Paste each ticket into Linear under the "Category Image Generator" project.
> Epics are listed first, then their child tickets.

---

## EPICS

| ID | Epic Title |
|---|---|
| E1 | Project Setup & Infrastructure |
| E2 | Authentication (Google OAuth) |
| E3 | AI Image Generation — Backend |
| E4 | Figma Storage Integration |
| E5 | Frontend UI |
| E6 | Image History & Gallery |
| E7 | AI Provider Abstraction |

---

## E1 — Project Setup & Infrastructure

---

### CAT-1
**Title:** Initialize monorepo structure (backend + frontend)
**Epic:** E1 — Project Setup & Infrastructure
**Priority:** Urgent
**Type:** Task

**Description:**
Set up the project as a monorepo with two packages: `apps/api` (existing Node/Express backend) and `apps/web` (new Next.js frontend). Configure shared tooling.

**Acceptance Criteria:**
- [ ] Monorepo structure with `apps/api` and `apps/web`
- [ ] Root `package.json` with workspace scripts (`dev`, `build`, `lint`)
- [ ] Shared ESLint + Prettier config
- [ ] Both apps boot locally with a single `npm run dev` from root

---

### CAT-2
**Title:** Set up environment configuration and secrets management
**Epic:** E1 — Project Setup & Infrastructure
**Priority:** Urgent
**Type:** Task

**Description:**
Define all required env vars, add to `.env.schema`, and document in README. Required vars: `PORT`, `IMAGE_API_KEY`, `ALLOWED_ORIGINS`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `FIGMA_ACCESS_TOKEN`, `FIGMA_FILE_KEY`, `SESSION_SECRET`.

**Acceptance Criteria:**
- [ ] `.env.schema` updated with all required vars, annotations, and examples
- [ ] `.env.example` file added (no real secrets)
- [ ] `.env` added to `.gitignore`
- [ ] Startup fails fast with a clear error if any required var is missing

---

### CAT-3
**Title:** Set up CI pipeline (lint, test, build)
**Epic:** E1 — Project Setup & Infrastructure
**Priority:** High
**Type:** Task

**Description:**
Add a GitHub Actions workflow that runs on every PR: lint, unit tests, and build for both `apps/api` and `apps/web`.

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` created
- [ ] Runs on `pull_request` to `main`
- [ ] Lint step passes
- [ ] Build step passes
- [ ] Status check required before merge

---

### CAT-4
**Title:** Add Docker Compose for local development
**Epic:** E1 — Project Setup & Infrastructure
**Priority:** Medium
**Type:** Task

**Description:**
Add `docker-compose.yml` to run the full stack locally (API + frontend + any needed services like a DB for sessions).

**Acceptance Criteria:**
- [ ] `docker-compose up` starts API and frontend
- [ ] Hot reload works for both services
- [ ] Environment variables loaded from `.env`

---

## E2 — Authentication (Google OAuth)

---

### CAT-5
**Title:** Implement Google OAuth on the backend
**Epic:** E2 — Authentication
**Priority:** Urgent
**Type:** Task

**Description:**
Add Google OAuth 2.0 to the Express API using Passport.js or a lightweight OAuth library. Issue a signed JWT session token on successful login. Restrict sign-in to the company Google domain.

**Acceptance Criteria:**
- [ ] `GET /api/auth/google` redirects to Google consent screen
- [ ] `GET /api/auth/callback` exchanges code for token, issues JWT
- [ ] `POST /api/auth/logout` clears session
- [ ] Only `@[company-domain].com` emails accepted (configurable via env)
- [ ] JWT is short-lived (1h) with refresh token support

---

### CAT-6
**Title:** Add authentication middleware to protect API routes
**Epic:** E2 — Authentication
**Priority:** Urgent
**Type:** Task

**Description:**
All `/api/generate` and `/api/images` routes must require a valid JWT. Return 401 if missing or expired.

**Acceptance Criteria:**
- [ ] Unauthenticated requests to protected routes return `401`
- [ ] Expired tokens return `401` with a clear error message
- [ ] `/health` and auth routes remain public

---

### CAT-7
**Title:** Build login page in frontend
**Epic:** E2 — Authentication
**Priority:** High
**Type:** Task

**Description:**
Create a simple login page with a "Sign in with Google" button. Redirect to the generate page after successful auth. Redirect unauthenticated users back to login.

**Acceptance Criteria:**
- [ ] Login page at `/login`
- [ ] "Sign in with Google" button initiates OAuth flow
- [ ] Successful auth redirects to `/generate`
- [ ] Protected routes redirect to `/login` if no session
- [ ] Session persisted in `httpOnly` cookie

---

## E3 — AI Image Generation — Backend

---

### CAT-8
**Title:** Build Deliveroo-brand prompt engineering module
**Epic:** E3 — AI Image Generation — Backend
**Priority:** Urgent
**Type:** Task

**Description:**
Create a `promptBuilder` module that takes `{ category, description, angle, keyTexture }` and returns a fully structured positive + negative prompt pair following the Deliveroo Grocery Imagery Brand Guide (`BRAND_GUIDE.md`).

Positive prompt must always include: flat teal background, left-to-right lighting, soft shadows, imperfect/appetising food, the chosen camera angle, the hero food item description, and the key texture highlight.

Negative prompt must always include the full brand guide negative list (no keylines, no fine dining, no surreal colours, no overlapping food, no competitor logos, etc.).

**Acceptance Criteria:**
- [ ] `buildPrompt({ category, description, angle, keyTexture })` exported from `src/lib/promptBuilder.js`
- [ ] Positive prompt follows brand guide §11.1 template exactly
- [ ] Negative prompt follows brand guide §11.2 exactly and is always appended
- [ ] `angle` must be one of: `45-degree`, `top-down`, `side-on`, `POV` — validation error otherwise
- [ ] Unit tests for each camera angle variation
- [ ] Prompt length stays under OpenAI's 4000-char limit

---

### CAT-9
**Title:** Integrate OpenAI DALL-E 3 for image generation
**Epic:** E3 — AI Image Generation — Backend
**Priority:** Urgent
**Type:** Task

**Description:**
Wire up the OpenAI SDK to the `/api/generate` endpoint. Use DALL-E 3 with `response_format: b64_json` and `size: 1024x1024`. Return the image as a base64 PNG.

**Acceptance Criteria:**
- [ ] `POST /api/generate` calls OpenAI and returns a generated image
- [ ] Image returned as base64-encoded PNG
- [ ] API errors (quota, timeout) handled gracefully with user-facing message
- [ ] API key never logged or exposed in responses

---

### CAT-10
**Title:** Add image metadata persistence
**Epic:** E3 — AI Image Generation — Backend
**Priority:** High
**Type:** Task

**Description:**
After each successful generation, save metadata to a database (SQLite for MVP, PostgreSQL for production): `id`, `userId`, `category`, `style`, `prompt`, `figmaUrl`, `createdAt`.

**Acceptance Criteria:**
- [ ] DB schema defined and migrated
- [ ] Record created on every successful generation
- [ ] `GET /api/images` returns paginated list of user's images
- [ ] `GET /api/images/:id` returns single image metadata

---

## E4 — Figma Storage Integration

---

### CAT-11
**Title:** Set up Figma API client
**Epic:** E4 — Figma Storage Integration
**Priority:** Urgent
**Type:** Task

**Description:**
Create a `figmaClient` module that wraps the Figma REST API. Authenticate with a personal access token from env. Expose methods: `uploadImage`, `getFileFrames`.

**Acceptance Criteria:**
- [ ] `figmaClient.js` module created in `src/lib/`
- [ ] Authenticated with `FIGMA_ACCESS_TOKEN` env var
- [ ] `uploadImage(base64, filename)` uploads to the file at `FIGMA_FILE_KEY`
- [ ] Returns the Figma node URL of the uploaded image
- [ ] Connection errors handled with clear log output

---

### CAT-12
**Title:** Organize generated images by category in Figma file
**Epic:** E4 — Figma Storage Integration
**Priority:** High
**Type:** Task

**Description:**
When uploading a generated image, place it inside a frame named after the category. If the frame doesn't exist, create it. This keeps the Figma file organized.

**Acceptance Criteria:**
- [ ] Each category gets its own top-level frame in the Figma file
- [ ] New images appended to the correct category frame
- [ ] Frame and image named: `[category] - [timestamp]`
- [ ] Figma node URL stored in image metadata DB record

---

### CAT-13
**Title:** Return Figma URL after generation
**Epic:** E4 — Figma Storage Integration
**Priority:** High
**Type:** Task

**Description:**
The `POST /api/generate` response must include the Figma node URL so the frontend can display a direct link to the asset in Figma.

**Acceptance Criteria:**
- [ ] Response includes `figmaUrl` field
- [ ] URL opens the correct node in the Figma file
- [ ] If Figma upload fails, generation still succeeds (graceful degradation) and error is logged

---

## E5 — Frontend UI

---

### CAT-14
**Title:** Initialize Next.js frontend app
**Epic:** E5 — Frontend UI
**Priority:** Urgent
**Type:** Task

**Description:**
Bootstrap `apps/web` with Next.js (App Router), TypeScript, and Tailwind CSS. Set up base layout, fonts, and theme tokens consistent with brand.

**Acceptance Criteria:**
- [ ] `apps/web` boots with `npm run dev`
- [ ] Tailwind configured with base design tokens (colors, fonts)
- [ ] Base layout component with nav/header
- [ ] Linting passes

---

### CAT-15
**Title:** Build image generation form
**Epic:** E5 — Frontend UI
**Priority:** Urgent
**Type:** Task

**Description:**
Main page at `/generate`. Form with: category name (text input), description (textarea, natural language), camera angle selector (45-degree / top-down / side-on / POV), optional key texture field, and a "Generate" button. Tooltip/help text explains the angle options with examples so non-technical users can choose correctly.

**Acceptance Criteria:**
- [ ] All fields validated before submit (category required, description required, angle required)
- [ ] "Generate" button shows loading state during API call
- [ ] Error messages shown inline if API returns validation errors
- [ ] Form is accessible (labels, keyboard navigation, ARIA)

---

### CAT-16
**Title:** Build image preview and result panel
**Epic:** E5 — Frontend UI
**Priority:** Urgent
**Type:** Task

**Description:**
After generation, display the generated image alongside action buttons: Download PNG, Open in Figma (link to `figmaUrl`), and Generate Again.

**Acceptance Criteria:**
- [ ] Generated image displayed at full quality in preview
- [ ] "Download PNG" triggers browser download of the PNG file
- [ ] "Open in Figma" opens `figmaUrl` in a new tab
- [ ] "Generate Again" resets form for a new generation
- [ ] Preview is shown without page reload

---

### CAT-17
**Title:** Add loading states and error handling to UI
**Epic:** E5 — Frontend UI
**Priority:** High
**Type:** Task

**Description:**
The generation step takes several seconds. Add a skeleton/spinner loading state, and display user-friendly error messages for all failure modes (API error, network error, validation error).

**Acceptance Criteria:**
- [ ] Loading spinner/skeleton shown during generation
- [ ] Error toast or inline message for API/network failures
- [ ] No raw error messages or stack traces shown to the user
- [ ] User can retry after an error without refreshing

---

## E6 — Image History & Gallery

---

### CAT-18
**Title:** Build image history page
**Epic:** E6 — Image History & Gallery
**Priority:** Medium
**Type:** Task

**Description:**
Page at `/history` showing a grid of previously generated images for the logged-in user. Each card shows: image thumbnail, category, style, date, and action buttons (Download, Open in Figma).

**Acceptance Criteria:**
- [ ] Grid layout with image thumbnails
- [ ] Shows category name, style tag, and formatted date
- [ ] "Download" and "Open in Figma" actions on each card
- [ ] Paginated (20 images per page)
- [ ] Empty state when no images yet

---

### CAT-19
**Title:** Add filter and search to history page
**Epic:** E6 — Image History & Gallery
**Priority:** Low
**Type:** Task

**Description:**
Allow users to filter the history by category name, style, or date range.

**Acceptance Criteria:**
- [ ] Filter by style (dropdown)
- [ ] Search by category name (text input)
- [ ] Filter by date range (date picker)
- [ ] Filters stack (can combine)
- [ ] URL reflects active filters (shareable link)

---

## E7 — AI Provider Abstraction

---

### CAT-20
**Title:** Design and implement pluggable AI provider interface
**Epic:** E7 — AI Provider Abstraction
**Priority:** Medium
**Type:** Task

**Description:**
Refactor the image generation layer so that any AI provider can be swapped in via a config value (`AI_PROVIDER=openai`). Each provider implements the same interface: `generateImage(prompt, options) → base64PNG`.

**Acceptance Criteria:**
- [ ] `src/lib/providers/` directory with one file per provider
- [ ] Each provider exports `{ name, generateImage }`
- [ ] Active provider selected via `AI_PROVIDER` env var
- [ ] Fallback to `openai` if env var not set
- [ ] Switching providers requires only an env change, no code change

---

### CAT-21
**Title:** Add second AI provider (TBD — Stability AI or Replicate)
**Epic:** E7 — AI Provider Abstraction
**Priority:** Low
**Type:** Task

**Description:**
Implement a second provider using the interface from CAT-20. Provider to be confirmed (candidates: Stability AI, Replicate/Flux, NanoBanana). Validate that provider switching works end-to-end.

**Acceptance Criteria:**
- [ ] Second provider implemented following the same interface
- [ ] Switching via `AI_PROVIDER` env var works without any other changes
- [ ] Output quality compared and documented
- [ ] Provider name added to image metadata record

---

## TICKET SUMMARY

| Ticket | Title | Epic | Priority |
|---|---|---|---|
| CAT-1 | Initialize monorepo structure | E1 | Urgent |
| CAT-2 | Environment config and secrets | E1 | Urgent |
| CAT-3 | CI pipeline | E1 | High |
| CAT-4 | Docker Compose for local dev | E1 | Medium |
| CAT-5 | Google OAuth backend | E2 | Urgent |
| CAT-6 | Auth middleware for API routes | E2 | Urgent |
| CAT-7 | Login page in frontend | E2 | High |
| CAT-8 | Prompt engineering module | E3 | Urgent |
| CAT-9 | OpenAI DALL-E 3 integration | E3 | Urgent |
| CAT-10 | Image metadata persistence (DB) | E3 | High |
| CAT-11 | Figma API client | E4 | Urgent |
| CAT-12 | Organize images by category in Figma | E4 | High |
| CAT-13 | Return Figma URL after generation | E4 | High |
| CAT-14 | Initialize Next.js frontend | E5 | Urgent |
| CAT-15 | Image generation form | E5 | Urgent |
| CAT-16 | Image preview and result panel | E5 | Urgent |
| CAT-17 | Loading states and error handling | E5 | High |
| CAT-18 | Image history page | E6 | Medium |
| CAT-19 | Filter and search on history | E6 | Low |
| CAT-20 | Pluggable AI provider interface | E7 | Medium |
| CAT-21 | Add second AI provider | E7 | Low |

---

## MILESTONE MAP

### M1 — Backend Core (Urgent tickets)
CAT-1, CAT-2, CAT-5, CAT-6, CAT-8, CAT-9, CAT-11

### M2 — Frontend MVP
CAT-14, CAT-15, CAT-16, CAT-7, CAT-12, CAT-13, CAT-17

### M3 — History & Gallery
CAT-10, CAT-18, CAT-19

### M4 — Provider Abstraction
CAT-20, CAT-21

### Infrastructure (parallel)
CAT-3, CAT-4
