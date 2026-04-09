# BloomHer — UX/UI Design Prompt Engineering Log

> All UI/UX design decisions were made through structured AI prompt engineering,
> demonstrating how prompt design can drive professional-grade product development.

---

## 1. Designer Persona Panel (8 Experts)

```
Create 8 UX/UI designer personas and have them discuss 
the best design approach for BloomHer — an AI-powered 
growth discovery app for women.

Personas should cover:
- Women-targeted app UX (Calm, Flo experience)
- Gamification UI (Duolingo, Habitica experience)
- Accessibility design (Apple Accessibility)
- Emotional design (Pinterest, Canva)
- Journaling app UX (Notion, Day One)
- Mobile-first UI (Instagram, TikTok)
- Global/multicultural UX (Google i18n)
- Korean market UX (Kakao, Toss)

Discuss: color palette, layout, interaction patterns,
gamification, and emotional tone.
```

**Result:** 6 design topics debated → consensus on lavender+cream+mint palette, chat-style UI, emoji calendar, Spotify Wrapped weekly reports.

---

## 2. Color System — International Women's Day Theme

```
The app is for AI Skills 4 Women program.
Use International Women's Day colors:
- Purple (justice, dignity)
- White (hope)  
- Green (growth)

Create a cohesive color system with 
purple-to-pink gradient instead of purple-to-green.
Keep it warm, not corporate.
```

**Result:**
```css
--bloom-purple: #7B2D8E;
--bloom-pink: #D946A8;
--bloom-lavender: #F3E8FF;
--bloom-white: #FEFEFE;
--bloom-green: #4CAF50;
--gradient: linear-gradient(135deg, #7B2D8E, #D946A8);
```

---

## 3. Chat Interface Design

```
Build a KakaoTalk-style chat interface for BloomHer.
- User messages on right (purple bubbles)
- AI responses on left (lavender bubbles)
- Skill cards appear inline in conversation
- Typing indicator with animated dots
- Bottom input bar with send button
- Growth streak counter at top
- Mobile-first, warm and encouraging
```

**Design Decisions:**
- Chat-style chosen over form-style (Korean users familiar with KakaoTalk)
- Skill cards embedded in chat flow (not separate page)
- Typing dots create anticipation

---

## 4. Growth Garden Visualization

```
Design a Growth Garden page with:
- Character growth: Seed 🌱 → Sprout 🌿 → Flower 🌷 → Tree 🌳 → Garden 🌸
- Monthly calendar with cute emoji instead of dots
  - Logged days: rotating 🌷🌸🌱💜✨
  - Unlogged days: grey number
- "Rest days are growth too" positive message
- Never make users feel guilty for missing days
```

**Design Decision:** Emojis > dots (warmer, more personal, less "tracking app" feel)

---

## 5. Skills Collection — Radar Chart

```
Replace the bar chart with a pentagon/radar chart 
for skill categories (Analytical, Communication, 
Leadership, Creativity, Empathy).

Use soft pastel colors instead of primary colors:
- Analytical: #9B6BB0 (soft purple)
- Communication: #6BB0A0 (soft teal)
- Leadership: #C084B0 (soft pink)
- Creativity: #B08DC0 (soft violet)
- Empathy: #8BBAD0 (soft blue)
```

**Design Decision:** Radar chart shows skill balance at a glance (vs bar chart = just ranking)

---

## 6. Weekly Report — Spotify Wrapped Style

```
Design weekly report as Spotify Wrapped-style cards:
- 4 swipeable cards with purple gradient backgrounds
- Card 1: "This week you grew in..." with animated skill list
- Card 2: "Your hidden strength..." with reveal animation
- Card 3: "Growth trend" with animated bar chart
- Card 4: "Next week's opportunity"
- Remove decorative background circles (cleaner)
- Purple-to-pink gradient (not purple-to-green)
```

**Design Decision:** Wrapped style creates excitement + shareability

---

## 7. STAR(L) — Auto-Structure UX

```
STAR(L) should NOT be a 5-step manual wizard.
Instead: single text input → AI automatically structures 
into STAR(L) format.

Show example prompts as clickable chips:
- "I led a team project at school"
- "I helped my friend through a tough time"

Result shows: structured STAR(L) card + skills + one-sentence summary
with purple-to-pink gradient accent.
```

**Design Decision:** Single input = lower friction. Users don't know what S/T/A/R/L means — AI handles it.

---

## 8. Iterative Design Refinements

| Iteration | User Feedback | Prompt | Result |
|-----------|--------------|--------|--------|
| v1 → v2 | "Colors too corporate" | "Use Women's Day purple, warm not corporate" | Lavender + pink gradient |
| v2 → v3 | "Background circles ugly" | "Remove decorative circles from Weekly cards" | Clean gradient backgrounds |
| v3 → v4 | "Calendar dots creepy" | "Replace dots with cute emojis 🌷🌸🌱💜✨" | Emoji calendar |
| v4 → v5 | "Bar chart boring" | "Pentagon radar chart for skill categories" | SVG radar chart |
| v5 → v6 | "STAR(L) too complex" | "Single input auto-structure, not 5-step wizard" | One-input UX |
| v6 → v7 | "Flower emoji wrong" | "Use tulip 🌷 but keep label as Flower" | 🌷 + "Flower" |
| v7 → v8 | "Skill colors too bright" | "Soft pastel colors for categories" | Muted palette |

---

## 9. Design Tools & Skills Used

| Tool/Skill | Purpose |
|------------|---------|
| **Supanova taste-skill** | Agency-grade design principles |
| **Supanova output-skill** | Clean HTML output |
| **Supanova soft-skill** | Premium aesthetics |
| **awesome-design-md** | Airbnb/Notion design system reference |
| **UI UX Pro Max** | Industry-specific design intelligence |

---

## 10. Key Design Principles (from persona debate)

1. **No guilt design** — Missing days show "Rest is growth too 💜" not red X
2. **Instant reward** — Every input = immediate skill discovery + sticker
3. **Mobile-first** — Thumb-reachable, one-hand operation
4. **Chat over forms** — Familiar KakaoTalk-style, not corporate survey
5. **Celebrate, don't track** — Growth garden, not habit tracker
6. **Purple = empowerment** — International Women's Day colors throughout

---

*Every design decision in BloomHer was driven by AI prompt engineering — 
from persona creation to color selection to interaction patterns.
This demonstrates how prompt engineering can be applied beyond text generation
to full product design and UX decision-making.*
