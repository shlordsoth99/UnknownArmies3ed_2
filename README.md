# Unknown Armies 3rd Edition for Foundry VTT

A complete game system implementation for **Unknown Armies 3rd Edition** on Foundry Virtual Tabletop v13.

## Overview

Unknown Armies is a roleplaying game of power and consequences. Humanity is the only measure of reality, and your obsession is your weapon. This system brings the gritty, occult horror of UA3E to Foundry VTT with full automation of the percentile-based mechanics, stress checks, hardened notches, and trauma system.

## Features

### Character Management
- **Full Character Sheet** with all UA3E attributes (Body, Speed, Mind, Soul)
- **Identity System** — create and manage identities with scores, substitutions, and obsession marking
- **Passions** — Fear, Rage, Noble, and Obsession with hardened tracking
- **Abilities** — Connect, Knowledge, Lie, Notice, Pursuit, Struggle
- **Relationships** — track connections to NPCs and organizations
- **Equipment** — weapons, armor, and gear with damage/armor values

### Stress & Trauma System
- **5 Stress Gauges**: Violence, Helplessness, The Unnatural, Isolation, Self
- **Interactive Hardened Notches** — click to toggle, visual feedback
- **Automated Stress Checks** — roll d% against Stability minus hardened penalties
- **Automatic Trauma Application** — matched failures and critical failures add trauma
- **Broken Status** — visual warning when any gauge reaches 9 hardened notches

### NPC & Antagonist Support
- **NPC Sheet** with threat levels, special powers, weaknesses, motivation, and tactics
- **Pre-generated Content** — 5 characters and 8 enemies included
- **Custom Powers System** — add unique abilities to any NPC

### Dice System
- **Percentile Rolls (d%)** for all ability and identity checks
- **Matched Results** — automatic detection of doubles (11, 22, 33...)
- **Critical Success/Failure** — top 10% and bottom 10% handling
- **Stress Check Rolls** — specialized rolls with automatic outcome calculation
- **Chat Integration** — beautiful roll cards with color-coded results

### Visual Design
- **Dark Occult Theme** — gritty, atmospheric UI fitting the game's tone
- **Color-Coded Gauges** — each stress gauge has its own color
- **Responsive Layout** — works on various screen sizes
- **Custom Token Bars** — Health and Stability bars with gradient styling

## Installation

### Method 1: Manifest URL (Recommended)
1. Open Foundry VTT
2. Go to **Game Systems** → **Install System**
3. Paste the manifest URL:
   ```
   https://raw.githubusercontent.com/shlordsoth99/UnknownArmies3ed_2/main/system.json
   ```
4. Click **Install**

### Method 2: Manual Installation
1. Download the latest release
2. Extract to `Data/systems/unknown-armies-3e/`
3. Restart Foundry VTT

## Usage

### Creating a Character
1. Create a new Actor, select **Character** type
2. Fill in identity information (name, aliases, obsession)
3. Set attributes (Body, Speed, Mind, Soul)
4. Add identities via the Identity tab
5. Mark one identity as your **Obsession**
6. Fill in passions and abilities

### Rolling Checks
- **Ability Checks**: Click the dice icon next to any ability
- **Identity Checks**: Click the dice icon on any identity card
- **Stress Checks**: Click "Roll Stress Check" on any gauge, or use the Stress Check button in token controls (GM only)

### Stress & Trauma
When encountering horror, the GM may call for a Stress Check:
1. Click the Stress Check button for the appropriate gauge
2. The system calculates target number (Stability - Hardened × 10)
3. Roll d% — success adds a hardened notch, failure reduces Stability
4. Matched/Critical results apply additional effects automatically

### Managing NPCs
1. Create a new Actor, select **NPC** type
2. Set threat level and category
3. Add special powers and weaknesses
4. Fill in motivation and tactics for GM reference

## Pre-generated Content

### Characters (5)
- **Maya Chen** — The Cataloguer (Librarian/Conspiracy Blogger)
- **Darius "Deke" Jackson** — The Locksmith (Criminal/Locksmith)
- **Dr. Sarah Voss** — The Coroner (Medical Examiner/Spiritualist)
- **Tommy "The Tomahawk" Blackwood** — Mercenary Veteran
- **Jin-Soo Park** — The Empty Canvas (Street Artist/Visionary)

### Enemies (8)
- **The Empty Man** — Urban Legend Made Flesh (High Threat)
- **The Sleepers (Cell 7)** — Government Conspiracy (Medium-High Threat)
- **The Last Librarian** — Ascended Inhuman (Very High Threat)
- **The Flock** — Cult of the Ascending Bird (Medium Threat)
- **Mr. Friendly** — Demon/Urban Predator (Medium Threat)
- **The Number Station** — Sentient Radio Phenomenon (Very High Threat)
- **The Choir** — Composite Entity/Number Station Vessel (Extreme Threat)
- **The Street Prophet** — Entropomancer Adept (Medium Threat)

## System Settings

- **Automatic Stress Tracking** — Auto-apply stress results
- **Stress Check Dialog** — Confirmation before rolling
- **Initiative Formula** — Customizable (default: 1d10 + Speed)
- **Show Wound Threshold** — Display on tokens
- **Highlight Obsession Rolls** — Visual emphasis
- **Dark Mode Sheets** — Toggle dark theme
- **Trauma Visibility** — Control who sees trauma details

## Localization

- English (en)
- Russian (ru)

## Compatibility

- **Foundry VTT**: v13.341+
- **Recommended Modules**: Dice So Nice!, Chat Portrait, Token Action HUD

## Credits

- **Game Design**: Greg Stolze, John Tynes, and the UA team
- **System Development**: Based on the work of patrickbuck1988 and the Foundry community
- **Inspiration**: The occult horror RPG community

## License

This system is released under the MIT License. Unknown Armies is copyright Atlas Games.

## Support
---

*"Humanity is the only measure of reality."*
