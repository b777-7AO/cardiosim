# CardioSim: Higgsfield prompt library

Prompts for CardioSim product visuals. The real product is the source of truth: Higgsfield changes the setting and the light, never the object.

## Rules before you generate

1. **Always attach the real photographs** in `creative/product-photos/` as image references (front: `03-front-table.jpg` and `01-front-workshop.jpg`, back: `04-back-table.jpg`). Never generate from text alone.
2. **Stills first, video second.** Approve a still, then animate that exact still as the start frame.
3. **Compare every result with the photographs** before it goes on the site. Reject it if the shape was smoothed, idealised or given extra anatomy.

Models used for the assets in this repo: GPT Image 2.6 for stills. Check the README for which image-to-3D model produced the GLB. For video, use an image-to-video model with a start frame (Seedance or Kling).

## Product block (paste into every prompt)

> Exactly the object in the reference photos: a bright vivid red moulded silicone heart-shaped suturing training model. Reproduce its real geometry, silhouette and proportions exactly: simplified heart body, a short wide hollow white silicone cylinder (open tube with a thick wall) standing in the top centre, one solid red cylindrical stub on the top left, one red cylindrical stub on the top right with a small side nub, a diagonal ridge running across the front, and one thin white line inlaid vertically on the front right side. The back is flatter, entirely red, with raised rectangular bands and a round opening at the top. Keep the visible moulded, layered surface texture and the slightly handmade character.

## Negative block (paste into every prompt)

> Do not add vessels, veins, branches, an aortic arch or any anatomical detail that is not in the reference. Do not smooth or idealise the shape. No blue or purple, no extra colours, no labels or text, no stand, no glow, no particles, no smoke, no lens flare, no wet gloss, no deformation, no change of shape between frames.

---

## 1. Hero product shot on white

Still, 1:1. In repo: `creative/reference/front-01.png`. Placement: hero poster while the 3D model loads, practice-areas picture, purchase section, cart thumbnail.

> Professional studio product photograph of [Product block], from the same front three-quarter angle as the first reference. Only change the setting: seamless pure white studio background, soft even professional lighting, gentle soft contact shadow beneath, whole object in frame with generous margin, sharp focus, true-to-life vivid red. [Negative block]

**Back view** (`creative/reference/back-01.png`): same prompt with the back photograph as the only reference and "seen from the same back angle as the reference. Entirely red from this side, no white parts visible."

## 2. Slow rotating model

Video, image-to-video, 8 s, 1:1. Start frame and end frame: the approved hero still. Placement: fallback for the 3D viewer, social posts.

> [Product block] The model stands centred against a seamless pure white background and turns exactly 360 degrees around its vertical axis at constant speed, like an object on a turntable, showing the front with the white line, then the flatter red back with the raised bands, then the front again. Locked-off camera, 85mm lens, whole object in frame with generous margin. Soft even studio light that stays fixed while the object turns, soft shadow beneath. The last frame is identical to the first. The object stays rigid. [Negative block]

**Note:** attach the back still as an additional reference. If the model invents a back, record the loop from the 3D viewer on the site instead.

## 3. Macro close-up of the silicone surface

Still, 4:3 (optional 5 s push-in, 16:9). In repo: `creative/reference/macro-01.png`. Placement: inset picture in the product section.

> Macro studio product photograph of [Product block]. Close-up on the front right side where the thin white line is inlaid vertically in the red silicone, with the edge of the white hollow cylinder softly out of focus in the upper left corner. Show the real moulded, layered, slightly rough surface texture exactly as in the reference. 100mm macro lens, shallow depth of field, soft directional studio light raking from the left, clean white background at the edges, true-to-life vivid red. No hands, no tools, no thread. [Negative block]

Video variant: "The camera pushes in very slowly by about 10 percent. Nothing else moves."

## 4. Minimal training scene with gloved hands

Still, 3:2. **Not on the site yet.** Use only once it is confirmed where on the model stitches are placed and with which instruments.

> [Product block] The model stands on a plain white training surface. Two hands in plain light-blue nitrile gloves practise suturing on it: one hand holds a needle holder with a small curved needle, the other steadies the model. A short neat row of dark suture thread is being placed at **[CONFIRMED AREA]**. Tight, calm close-up from slightly above, 90mm lens, soft overhead light, clean pale background, no faces. Controlled, precise, unhurried. No blood, no fluids, no operating theatre, no dramatic lighting, no glowing thread. [Negative block]

## 5. Product ad stills

**Presentation, standing** (4:3). In repo: `creative/reference/presentation-01.png`. Placement: main picture in the product section.

> Professional commercial product photograph of [Product block], standing on a seamless matte white laboratory surface exactly as it stands in the references. Slightly lower camera than the reference, 85mm lens, object in the right half of a wide frame with calm empty white space on the left, pale grey-white background, soft directional key light from the upper left, gentle contact shadow, very subtle reflection. No props, no hands. [Negative block]

**From above** (1:1), for a detail of the open top:

> Studio product photograph of [Product block] seen from directly above at a slight angle, looking into the open white cylinder between the two red stubs. Seamless white background, soft even light, soft shadow. [Negative block]

## 6. Mobile vertical composition

Step 1, still (9:16):

> [Product block] standing in the upper two thirds of a tall vertical frame against a seamless pure white background, front three-quarter view, clear space above the white cylinder, the lower third of the frame empty white for text. Soft directional studio light from the upper left, soft shadow beneath. [Negative block]

Step 2, video from that still (5 s, 9:16):

> The camera rises very slowly from the base of the model to the white cylinder, a smooth vertical move of about 15 percent of the frame height, while the model turns 15 degrees toward the viewer. The light stays fixed. The model stays rigid. [Negative block]

---

## Checklist for every asset

- Bright red body, simplified heart shape.
- One hollow white cylinder at the top centre.
- One thin white line on the front right.
- Red stubs at the top, nothing else added.
- Moulded surface texture kept.
- Nothing that shows a procedure or practice area that has not been confirmed.

## Web delivery

- Video: WebM plus MP4, muted, `playsinline`, `preload="none"` below the fold, poster in WebP/AVIF.
- No autoplay when `prefers-reduced-motion: reduce` is set: show the poster.
- Never load a hero video and the 3D model at the same time on phones.
- Stills: run `node scripts/build-images.mjs` to produce the WebP/AVIF files in `public/images`.
