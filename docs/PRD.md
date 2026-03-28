# Product Requirements Document
## Category Image Generator

**Version:** 1.0
**Date:** 2026-03-28
**Status:** Draft
**Client:** Deliveroo Grocery

---

## 1. Overview

Category Image Generator is an internal web tool that lets Deliveroo designers and product managers generate on-brand grocery category images by describing what they need in plain language. All images follow the Deliveroo Grocery Imagery Brand Guide (see `BRAND_GUIDE.md`). Generated images are stored directly in a dedicated Figma file for team access and exported as PNG with transparent backgrounds.

---

## 2. Problem Statement

Creating category images (for product catalogs, content sections, navigation tiles, etc.) is a repetitive, time-consuming task that requires designer involvement for every new category. There is no scalable, self-serve way for PMs and designers to produce consistent, on-brand visuals quickly.

---

## 3. Goals

- Allow non-technical users (designers, PMs) to generate category images via natural language descriptions
- Produce consistent, on-brand visuals at scale without manual design work for every request
- Store all generated images in a central Figma file for visibility and reuse
- Export images as PNG with transparent background, ready for web and mobile use
- Support multiple AI image generation providers (starting with fal.ai, extensible to others)

---

## 4. Non-Goals (v1)

- Public-facing product (internal tool only)
- Video or animated image generation
- Bulk/batch generation (more than one image per request)
- Fine-tuned or custom-trained models
- Billing or usage quota management per user

---

## 5. Users

| Persona | Role | Need |
|---|---|---|
| Designer | Creates and maintains visual assets | Self-serve image generation without full design workflow |
| Product Manager | Defines categories and content | Generate placeholder or final images for new categories quickly |

Both personas are non-developers. The UI must be simple and require no technical knowledge.

---

## 6. Authentication

**Recommendation: Google OAuth (SSO)**

Rationale:
- Team likely already uses Google Workspace — zero friction, no password management
- Secure, no custom credential storage required
- Easy to restrict to company domain (e.g. `@yourcompany.com`)

Implementation: OAuth 2.0 via Google Identity, JWT session tokens, short-lived with refresh.

---

## 7. Core Features

### 7.1 Image Generation

- User inputs a **category name** (e.g. "Fresh Fruit & Veg") and a **natural language description** of the desired image
- User selects a **camera angle**: `45-degree`, `top-down`, `side-on`, `POV` (per brand guide)
- User optionally specifies **key texture highlight** (e.g. "crispy golden coating", "visible juiciness") to sharpen the prompt
- System builds a structured prompt using the Deliveroo brand prompt template (see `BRAND_GUIDE.md` §11) and sends to the AI provider
- Negative prompt is always appended automatically (brand guide §11.2)
- Generated image is returned and previewed in the UI

**Prompt engineering rules baked in:**
- Always: flat teal background, left-to-right lighting, soft shadows, imperfect/delicious food, no keylines, no overlapping dishes
- Never: fine dining, white tablecloths, surreal colours, rotated food, competitor logos

**AI Provider:** fal.ai as default (FLUX.1 model via `@fal-ai/client` SDK). The provider layer must be abstracted so other providers (e.g. Stability AI, Replicate, NanoBanana) can be swapped in via config with no code change.

### 7.2 Figma Storage

- After generation, the image is automatically uploaded to a dedicated Figma file
- Images are organized by category name (each category = one frame or section)
- The Figma node URL is returned and stored so users can jump directly to the asset
- The Figma file acts as the single source of truth for all generated images

### 7.3 Image Export

- Export format: **PNG with transparent background**
- Dimensions: to be defined (suggest starting with 1200×800px as default, configurable)
- Download available directly from the UI after generation

### 7.4 Image History & Gallery

- Users can browse previously generated images
- Filter by category, style, or date
- Re-download or regenerate any past image

---

## 8. Technical Architecture

```
Frontend (React/Next.js)
    │
    ▼
Backend API (Node.js / Express)        ← Already scaffolded
    ├── Auth module (Google OAuth)
    ├── Prompt builder
    ├── AI Provider abstraction layer
    │     ├── OpenAI (DALL-E 3)        ← Default
    │     ├── Stability AI             ← Future
    │     └── Replicate / others       ← Future
    ├── Figma API client (upload + organize)
    └── Storage / DB (image metadata, user sessions)
```

**Environment variables required:**
- `PORT` — server port
- `IMAGE_API_KEY` — AI provider API key
- `ALLOWED_ORIGINS` — CORS origins
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — OAuth
- `FIGMA_ACCESS_TOKEN` — Figma API
- `FIGMA_FILE_KEY` — target Figma file for image storage
- `SESSION_SECRET` — JWT/session signing key

---

## 9. API Endpoints (Backend)

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/auth/google` | Initiate Google OAuth flow |
| `GET` | `/api/auth/callback` | OAuth callback, issue session |
| `POST` | `/api/auth/logout` | Invalidate session |
| `POST` | `/api/generate` | Generate an image (authenticated) |
| `GET` | `/api/images` | List past generated images |
| `GET` | `/api/images/:id` | Get single image metadata + Figma URL |

---

## 10. User Flow

```
1. User logs in via Google OAuth
2. User fills in: category name, description, style
3. User clicks "Generate"
4. Backend builds prompt → calls AI provider → receives image
5. Backend uploads image to Figma file → gets Figma URL
6. Frontend shows preview + Figma link + download button
7. User downloads PNG or copies Figma link
```

---

## 11. Out-of-Scope Flags

- **JPG with transparent background is not possible** — JPG does not support alpha channel. PNG is used instead.
- CORS origins should be restricted to the deployed frontend domain in production.

---

## 12. Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Which company domain to restrict Google OAuth to? | Team | Open |
| 2 | Default image dimensions (width × height)? | Design | Open |
| 3 | How many images to show in history? Pagination strategy? | Product | Open |
| 4 | Should failed generations be logged/retried? | Eng | Open |
| 5 | Who manages the Figma file permissions? | Design | Open |

---

## 13. Success Metrics (v1)

- A designer or PM can generate and export a category image in under 2 minutes
- Generated images are accessible in Figma within 30 seconds of generation
- Zero manual designer intervention needed for standard category image requests

---

## 14. Milestones

| Milestone | Scope |
|---|---|
| M1 — Backend Core | Auth, prompt builder, OpenAI integration, Figma upload |
| M2 — Frontend MVP | Generate form, preview, download, login |
| M3 — History & Gallery | Browse, filter, re-download past images |
| M4 — Provider Abstraction | Swap AI providers via config, test with second provider |
