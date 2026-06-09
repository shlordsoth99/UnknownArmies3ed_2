# Changelog

## [1.0.0] - 2026-06-09

### Added
- Initial release of Unknown Armies 3rd Edition system for Foundry VTT v13
- Full character sheet with attributes, abilities, identities, passions
- NPC sheet with threat levels, powers, weaknesses, motivation, tactics
- Stress check system with 5 gauges (Violence, Helplessness, Unnatural, Isolation, Self)
- Interactive hardened notches with click-to-toggle
- Automated trauma application on matched/critical failures
- Percentile dice system with matched results and criticals
- Dark occult-themed UI with color-coded gauges
- 5 pre-generated player characters
- 8 pre-generated enemies/antagonists
- Equipment, relationship, trauma, and power item types
- Identity system with obsession marking and substitution
- Full English and Russian localization
- System settings for automation preferences
- Custom token bars for Health and Stability

### Features
- d% roll mechanics with automatic success/failure calculation
- Flip-flop support for obsession identity rolls
- Wound threshold calculation based on Body attribute
- Initiative formula: 1d10 + Speed/10
- Drag-and-drop item management
- Inline editing for NPC powers and weaknesses
- Responsive design for various screen sizes

### Technical
- ES Module architecture for Foundry VTT v13
- Handlebars templates with custom helpers
- CSS custom properties for theming
- Actor and Item document class extensions
- Custom dice classes (PercentileRoll, StressRoll)
- Chat message integration with styled roll cards