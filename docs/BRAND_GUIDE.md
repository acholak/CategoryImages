# Deliveroo Grocery Imagery Generation Rules
## Brief for AI image tools – categories & merchandising

---

## 1. Purpose & Scope

These rules define exactly how AI‑generated images for Deliveroo grocery categories must look and feel, so that:

- They are on‑brand for Deliveroo.
- They are consistent across all categories and surfaces.
- They do not hallucinate incorrect objects, colours, lighting, or moods.

Use this as the single source of truth for prompts, negative prompts, and any configuration when generating grocery category imagery.

---

## 2. Brand Imagery Summary

All imagery must express:

- **Love of food first** – the food should look so tasty you "want to lick the screen" and think "Ooh, I fancy a bit of that."
- **Bright, bold visuals** – bright photography that pops against Deliveroo's minimal teal palette.
- **Takeaway at home** – everyday, in‑home eating, not fancy restaurant dining.
- **Real, imperfect, delicious** – a little messy, tactile, and appetising.

---

## 3. Global Look & Feel

### 3.1 Colour & Background

**Primary background:**
- Use flat teal backgrounds that match the Deliveroo brand teal.
- If teal isn't used, use a simple, clean, light-coloured background (e.g., warm off‑white or very pale neutral) that does not compete with the teal system elsewhere in UI.

**Colour rules:**
- Food and packaging should introduce "pops of colour" against the teal or light background.
- Colours must look natural and edible (no neon or surreal colours on food itself).
- Avoid dull, desaturated, or muddy colour palettes. Images should feel bright and fresh, not dark or moody.

**Never:**
- Don't use complex illustrated or patterned backgrounds behind food.
- Don't use gradients or textures that distract from the food unless explicitly art‑directed later.
- Don't tint food with teal; teal is for background and brand elements, not the food itself.

---

## 4. Core Photography Principles

Everything the AI generates must follow these three absolute principles:

### 4.1 Be Takeaway
- Show food as you'd eat it at home after ordering takeaway or grocery items, not plated like fine dining.
- **Allow:** Delivery or grocery cues like paper bags, simple containers, cardboard boxes, trays. Takeaway props: ripped sauce packets, wooden chopsticks, disposable paper napkins, simple paper cups, etc.
- **Avoid:** White tablecloths, silver cloches, multi‑course restaurant settings, fine china, overly stylised table setups.

### 4.2 Be Imperfect
- Food must look relatable and a bit messy, not pristine and sterile.
- **Allow:** Slightly wonky burger buns. Pastry flakes scattered around. Sauce dripping down sides or onto fingers. Crumbs, small spills, or a few scattered herbs.
- **Avoid:** Perfectly symmetrical, overly polished or plastic‑looking food. Unrealistic geometric arrangements of ingredients.

### 4.3 Be Delicious
- Hero details that trigger appetite: Bubbling cheese on pizza. Extra‑crispy golden coating on fried chicken. Glossy, saucy burgers. Fresh fruit with visible juiciness.
- **Litmus test:** Ask: Would this image make someone's stomach rumble? If not, it's not done.

---

## 5. Composition & Layout

### 5.1 Single Image Compositions
- Show one hero item or a small, related group of items that instantly signals the category.
- Place items centrally or slightly off‑centre with comfortable negative space around them.
- Ensure the main food object is clearly readable at small sizes (app tiles, category icons).

### 5.2 Multi‑Image Compositions
- Use images shot from the same angle only (see Angles section).
- Treat each item as a separate "tile" — do not overlap food images, keep a consistent gap between items.
- **Safe layouts:** Staggered (items offset diagonally). Grouped together but not touching, all on the same background.

### 5.3 Views & Scales
Use the following view types:
- **Full view** – entire meal or grocery group is visible.
- **Mid view** – cropped but still shows most of the dish or container.
- **Close‑up** – tight crop highlighting textures (e.g., crispy skin, bubbles, seeds).
- **Repeated** – repeating a single item or small set in a neat pattern for variety.

Ensure scale is realistic – no giant strawberries bigger than a wine bottle, for example.

---

## 6. People & Hands

### 6.1 Interaction
- Prioritise hands interacting with food: hands holding burgers, chopsticks, slices of pizza, snack bags, etc.
- Hands should look natural and mid‑motion: lifting, dipping, tearing, taking a bite (but usually before the bite is taken).

### 6.2 Focus
- The food remains the hero; hands are supporting elements.
- **Avoid:** Full‑body people shots dominating the frame. Strong emotional narratives (e.g., families at a table) unless explicitly briefed.

---

## 7. Camera Angles

The AI must only use these four official angles:

| Angle | Description | Best for |
|---|---|---|
| 45‑degree | Slightly above and to the front of the food | Most dishes |
| Side‑on | Camera at same height as food, from the side | Burgers, sandwiches, drinks |
| Top‑down (flat lay) | Camera directly above at 90° | Spreads, category overviews |
| POV | What a person sees as they're about to eat | Handheld food |

**Rules:**
- Choose one angle per composition.
- If combining multiple images, all must share the same angle.
- Never mix angles in one composition.

---

## 8. Lighting & Shadows

### 8.1 Direction & Quality
- **Light direction:** always from left to right.
- **Light quality:** bright, soft‑to‑medium shadows — no harsh spotlighting, feels like soft daylight.

### 8.2 Shadows
- Shadows must be present under and slightly to the right of objects (gives depth and realism).
- Shadow direction, softness, and intensity must match across all elements in the composition.

### 8.3 Avoid
- No flat, shadow‑less images (they look fake / cut out).
- No conflicting or multiple strong light sources.
- No dramatic high‑contrast noir lighting.

---

## 9. Category‑Specific Guidance (Groceries)

| Category | Key rules |
|---|---|
| Fruit & Veg | Bright, fresh items with visible moisture/freshness. Close‑ups for texture. Avoid dirt or overly rustic presentation. |
| Dairy & Eggs | Smooth textures, soft highlights, fresh surfaces. Avoid condensation that looks like alcohol. |
| Bakery | Lean into crumbs, flakes, crust detail. Slight mess is good; avoid chaotic spills. |
| Meat & Fish | Prefer cooked/prepared items. If raw, clean and bright. Avoid blood, gore, or unappetising presentation. |
| Snacks & Confectionery | Bright packaging and fun, but hero food clearly readable. |
| Drinks | Bottles/cans upright, label/front face clearly visible. Condensation fine but realistic. |

---

## 10. Hard Constraints — The AI Must Never Do

- **No keylines** – Do not draw outlines or strokes around food or objects.
- **No stretching or distortion** – Keep correct aspect ratio for all items.
- **No rotating food for effect** – Food should stay in natural orientations.
- **No overlapping food photography** – Maintain visible separation between dishes.
- **No inconsistent shadows** – Never mix different shadow directions or intensities. No floating objects without shadows.
- **No heavy editing or surreal effects** – No patterns, stripes, or unrealistic alterations to food.
- **No off‑brand scenes** – Avoid restaurant white‑tablecloth setups, fine dining, bars, night‑club vibes, cluttered/dirty kitchens.
- **No brand collisions** – Do not show recognisable competitor logos or branded packaging. Use generic yet realistic packaging.

---

## 11. Prompt Templates

### 11.1 Positive Prompt Template

```
Bright, high‑resolution food photograph in Deliveroo's brand style. A [CATEGORY HERO FOOD ITEM] shown as takeaway at home, on a flat teal background. The food looks imperfect and delicious, with small crumbs and sauce drips that feel natural. Shot from a [ONE OF: 45‑degree angle / top‑down / side‑on / POV] view. Hands may be interacting with the food, holding it naturally. Lighting comes from left to right with soft, realistic shadows on the right side of the food. Colours are bright and natural, with appetising highlights on the [KEY TEXTURE – e.g., crispy golden coating, juicy fruit, bubbling cheese]. No text, no logos, no keylines, no overlapping dishes.
```

### 11.2 Negative Prompt Template

```
no illustration, no cartoons, no 3D render, no surreal colours, no dark or moody lighting, no restaurant tablecloths, no fine dining plates, no messy kitchen background, no people's faces, no overlapping food items, no outlines or keylines around objects, no stretched or distorted food, no rotated plates or bowls, no shadows from multiple directions, no missing shadows, no unrealistic editing or patterns on food, no competitor logos.
```

---

## 12. Implementation Notes

- Always choose one approved angle and stick to it for a given composition.
- Always explicitly mention "teal background" and "lighting from left to right with soft shadows" in prompts.
- Always add a short category‑specific description of the hero items to avoid hallucinated mismatched foods.
- Keep prompts consistent across categories — only swap the hero items and angle — to ensure a unified visual system.
