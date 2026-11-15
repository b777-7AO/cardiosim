# CardioSim: Higgsfield prompt library

Production prompts for the CardioSim campaign assets. Every prompt describes the same object. Do not vary the product block.

## Before you generate

1. **Always attach a reference.** Use `creative/reference/heart-ref-01.png` (or, once it exists, a photograph of the manufactured product) as the image reference for every still, and as the start frame for every video. Text-only generation drifts in geometry between shots.
2. **Stills first, video second.** Generate and approve the still, then animate that exact still. This is what keeps the heart identical across scenes.
3. **Check each result against the product rules** at the end of this file before it goes on the site.

Models used for the assets already in this repo: GPT Image 2.6 for stills, Tripo H3.1 image-to-3D for the GLB. For video, use an image-to-video model with a start frame (Seedance or Kling).

## Product block (paste into every prompt)

> A single anatomical silicone human heart surgical training model, complete and uncut. The entire heart body (ventricles, atria, auricles, surface vessels, pulmonary trunk and vein stubs) is one uniform deep natural medical red matte silicone. Only one element has a different colour: the large central aorta with its arch and three short branch stubs is clean matte white silicone. Realistic manufactured cast silicone with fine surface texture and natural anatomical folds. Same geometry as the reference image.

## Negative block (paste into every prompt)

> No blue or purple vessels, no yellow fat, no additional colours, no labels or text, no stand, no extra components, no glow, no particles, no smoke, no lens flare, no wet gloss, no cartoon or stylised anatomy, no deformation, no change of shape between frames.

---

## 1. Cinematic hero product reveal

| | |
|---|---|
| Type | Video, image-to-video from the approved hero still |
| Duration / ratio | 6 s, 16:9 (crop-safe to 3:2) |
| Placement | Optional intro above the hero. Plays once, then the page shows the interactive 3D heart in the same front three-quarter pose. |

**Prompt**

> [Product block] The heart is suspended in a pristine, nearly white studio. It begins almost lost in soft white light and gradually resolves as the light settles. The camera makes one slow, perfectly smooth arc of about 30 degrees around the heart at a constant distance, ending on a front three-quarter view with the white aorta clearly visible at the top. Macro product cinematography, 85mm lens, shallow but sufficient depth of field, soft directional key light from the upper left, gentle fill, faint soft shadow below. The heart itself does not move, beat or deform. [Negative block]

**Notes:** End frame must match `heart-ref-01.png` so the cut to the 3D viewer is not visible. Export WebM (VP9) and MP4 (H.264), under 2 MB each, with a WebP poster of the last frame.

## 2. Seamless rotating heart loop

| | |
|---|---|
| Type | Video, image-to-video with identical start and end frame |
| Duration / ratio | 8 s, 1:1 |
| Placement | Fallback for the 3D viewer on devices without WebGL, and for social posts. |

**Prompt**

> [Product block] The heart floats centred against a seamless pure white background and rotates exactly 360 degrees around its vertical axis at constant speed, like an object on a turntable. Locked-off camera, 85mm lens, whole object in frame with generous margin. Soft even studio light that stays fixed while the object turns, very soft faint shadow below. The last frame is identical to the first frame. The object stays rigid. [Negative block]

**Notes:** Supply the same still as both start frame and end frame. If the model cannot hold the back of the heart consistent, render the loop from the GLB instead (it is the same object by construction).

## 3. Macro silicone surface close-up

| | |
|---|---|
| Type | Still (optional 5 s slow push-in) |
| Ratio | 4:3 still, 16:9 video |
| Placement | Inset image in "Designed for deliberate practice". In repo: `creative/reference/macro-01.png`. |

**Prompt**

> Extreme macro product photograph of the exact silicone heart from the reference image. Close-up on the front ventricular surface where the raised red surface vessels branch, with the edge of the white silicone aorta meeting the red body in the upper corner of the frame, softly out of focus. Deep red matte cast silicone with fine surface texture, subtle mould grain and soft anatomical folds clearly visible. 100mm macro lens, shallow depth of field, soft directional studio light raking from the left to reveal texture, clean white background visible at the edge. [Negative block] No hands, no tools, no sutures.

**Video variant:** "The camera pushes in very slowly by about 10 percent. Nothing else moves."

## 4. Medical suturing practice imagery

| | |
|---|---|
| Type | Still |
| Ratio | 3:2 |
| Placement | **Not on the site yet.** Use only after the product team has confirmed which area is stitched and which technique is shown. |

**Prompt**

> [Product block] The heart rests on a plain white training surface. Two hands in plain light-blue nitrile gloves practise suturing on it: one hand holds a needle holder with a small curved suture needle, the other steadies the model with forceps. A single neat row of dark suture thread is being placed on **[CONFIRMED AREA]**. Tight, calm close-up from slightly above, 90mm lens, soft overhead training-room light, clean pale background, no faces. Controlled, precise, unhurried. [Negative block] No blood, no fluids, no operating theatre, no dramatic lighting, no glowing thread, no cut-open tissue.

**Gate:** replace `[CONFIRMED AREA]` with the validated practice zone. Do not publish with a guessed location.

## 5. Premium product photography

Two stills. Both are in the repo.

**5a. Hero, floating** (`creative/reference/heart-ref-01.png`, 1:1). Placement: hero poster while the 3D model loads, order section, cart thumbnail, social preview.

> Studio product photograph of [Product block] floating centred against a seamless pure white background. Front three-quarter view, whole object in frame with generous margin. Soft even diffuse studio lighting, very soft faint shadow, high detail, sharp focus across the whole object. [Negative block]

**5b. Presentation, resting** (`creative/reference/presentation-01.png`, 4:3). Placement: main image in "Designed for deliberate practice".

> The exact silicone heart from the reference image, unchanged geometry and colours, resting naturally on its side on a seamless matte white laboratory surface, pale grey-white studio background, no visible horizon. Professional commercial product photography, 85mm lens, soft directional key light from the upper left, gentle contact shadow, very subtle surface reflection. Calm empty space on the left of the frame. [Negative block] No props, no hands.

## 6. Mobile vertical cinematic composition

| | |
|---|---|
| Type | Video, image-to-video from a 9:16 still |
| Duration / ratio | 5 s, 9:16 |
| Placement | Phone-only intro or social story. On the site, show it only below 640 px and only if the 3D viewer is not used there. |

**Step 1, still (9:16):**

> [Product block] floating in the upper two thirds of a tall vertical frame against a seamless pure white background, front three-quarter view, the white aorta near the top with clear space above it, the lower third of the frame empty white for text. Soft directional studio light from the upper left, faint soft shadow. [Negative block]

**Step 2, video from that still:**

> The camera rises very slowly from the apex of the heart to the white aorta, a smooth vertical move of about 15 percent of the frame height, while the heart turns 15 degrees toward the viewer. Soft studio light stays fixed. The heart stays rigid. [Negative block]

---

## Product rules (check every asset)

- Red anatomical heart body.
- One white central vessel. No other coloured vessels.
- No components that are not part of the product.
- Same geometry in every shot.
- No stylised anatomy, no glowing sutures, no implausible deformation.
- Nothing that shows a procedure or practice area the product team has not confirmed.

## Web delivery

- Video: WebM plus MP4, muted, `playsinline`, `preload="none"` below the fold, poster in WebP/AVIF.
- No autoplay when `prefers-reduced-motion: reduce` is set: show the poster.
- Never load a hero video and the 3D model at the same time on phones: pick one.
- Stills: run `node scripts/build-images.mjs` to produce the WebP/AVIF files in `public/images`.
