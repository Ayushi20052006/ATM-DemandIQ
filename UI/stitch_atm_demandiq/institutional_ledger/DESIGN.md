---
name: Institutional Ledger
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#00496b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00628d'
  on-tertiary-container: '#abdaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: 1.25rem
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.125rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an institutional-grade, data-dense fintech environment engineered for executive oversight, cash logistics forecasting, and real-time network telemetry. The brand aesthetic merges modern enterprise B2B precision with the visual rigor of mission-critical financial terminals. 

Targeting treasury directors, cash operations managers, and algorithm logistics leads, the interface instills confidence, surgical accuracy, and absolute clarity. The design language avoids non-essential decoration in favor of structural clarity, high information density, and rapid status triage. Through subtle surface layering, disciplined high-contrast micro-typography, and unmistakable semantic alerts, operators can instantly parse complex predictive matrices, cash-out thresholds, and route-optimization parameters under tight operational deadlines.

## Colors

The color system is calibrated for sustained analytical workflows under bright enterprise monitors and tablets. 

- **Primary Canvas & Surfaces**: The base application shell operates on a calibrated neutral tint (`#F8FAFC`), while primary analytical cards, tabular modules, and modals use pure white (`#FFFFFF`) to produce separation without visual weight. Micro-dividers and structural borders leverage `#E2E8F0` and `#CBD5E1`.
- **Primary & Accent Scales**: `#1D4ED8` serves as the primary anchor for committed actions, key metrics, active tab states, and baseline time-series graphs. Complementary analytics rely on Deep Indigo (`#4F46E5`) for model-confidence indicators and Cyan (`#0EA5E9`) for dynamic rolling projections.
- **Typographic Hierarchy**: The primary neutral `#0F172A` delivers high-contrast clarity for headers and raw tabular figures. Secondary text shifts to Slate (`#334155`), with metadata, captions, and structural labels settling at `#64748B`.
- **Operational Semantic Palette**: 
  - **Critical / Cash-Out Risk**: `#DC2626` (base) with `#FEF2F2` (soft tint) and `#991B1B` (deep text).
  - **Warning / Surge Volatility**: `#D97706` (base) with `#FFFBEB` (soft tint) and `#92400E` (deep text).
  - **Healthy / Optimal Float**: `#059669` (base) with `#ECFDF5` (soft tint) and `#065F46` (deep text).
  - **Telemetry / In-Transit**: `#2563EB` (base) with `#EFF6FF` (soft tint) and `#1E40AF` (deep text).

## Typography

Inter serves as the primary typographic engine across all headings, analytical tables, and interactive modules. Its tall x-height, distinct aperture designs, and comprehensive OpenType feature support provide exceptional scanning velocity.

- **Tabular Figures & OpenType**: For all currency displays, float volumes, predictive metrics, and chronological timestamps, enable `font-feature-settings: "tnum" 1, "cv05" 1, "cv11" 1`. This aligns numerical columns along clean vertical axes, preventing horizontal jitter during real-time data streaming.
- **Hierarchy Management**: Large display sizes are reserved exclusively for macro portfolio summaries and primary operational metrics. Compact text sizes (`0.875rem` and `0.75rem`) are the system workhorses, ensuring dense grid tables display up to 20 visible metrics per viewport without vertical truncation.
- **Micro-Labels**: Micro-headers and status chips apply uppercase styling with `0.04em` tracking to provide distinct structure at small sizes.

## Layout & Spacing

The layout model is anchored on an 8pt architectural rhythm, with a supplementary 4pt micro-step utilized for tight component internals, data cell padding, and status badges.

- **Grid Architecture**:
  - **Desktop (1280px+)**: 12-column layout with 24px (`1.5rem`) gutters and a fixed 280px left rail for primary network navigation and fleet health summaries.
  - **Tablet (768px - 1279px)**: 8-column layout with 16px (`1rem`) gutters and collapsible icon-only navigation. 
  - **Mobile (Below 768px)**: 4-column layout with 16px (`1rem`) page margins. Complex analytical tables switch to horizontal card-swipe patterns or sticky freeze-pane layouts.
- **Spacing Application Rules**:
  - `space-xs` (4px): Internal metric badge padding, icon-to-label separation, micro data indicators.
  - `space-sm` (8px): Gaps between inline buttons, filter pill groups, tight table cell vertical padding.
  - `space-md` (16px): Standard card interior padding, input field block spacing, modular stack gaps.
  - `space-lg` (24px): Metric group separation, container divisions, panel sectioning.
  - `space-xl` (32px): Primary dashboard row separation and major module boundaries.

## Elevation & Depth

Visual hierarchy relies on crisp borders and minimal ambient shadows, preventing interface fatigue during extended analytical sessions.

- **Level 0 (Flat Canvas)**: Hex `#F8FAFC`. Un-elevated base container holding dashboards, global controls, and outer layouts.
- **Level 1 (Card & Module Surface)**: Pure white (`#FFFFFF`) backed by a 1px perimeter border (`#E2E8F0`) and an ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`. Used for metric summary panels, time-series chart wrappers, and dense table views.
- **Level 2 (Hover & Active States)**: Applied when hovering interactive cards, table rows, or segmented controls. Uses a crisp outline shift (`#CBD5E1`) and elevated ambient shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Popovers, Filter Menus & Flyouts)**: Retains `#FFFFFF` background with border `#E2E8F0` and sharp floating shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.03)`.
- **Level 4 (Critical Modals & Replenishment Overlays)**: High-prominence surface with an ambient scrim (`rgba(15, 23, 42, 0.45)`) and depth shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The geometric framework follows a controlled soft structure (`roundedness: 1`). This setup balances institutional authority with modern software conventions.

- **Base Radii (`0.25rem` / 4px)**: Standard form inputs, segmented control buttons, data grid selection cells, drop-down menus, and micro-metric containers.
- **Container Radii (`0.5rem` / 8px)**: Primary module surfaces, KPI summary cards, tabular viewport outer containers, sliding draw-out panels, and system modal dialogs.
- **Pill Exception**: Dedicated status pills, badge counts, and health flags employ full rounded ends (`9999px`) to immediately signal categorical states and differentiate meta-tags from actionable buttons.

## Components

- **Buttons**:
  - *Primary*: Background `#1D4ED8`, text `#FFFFFF`, radius 4px, height 36px (desktop) / 40px (touch). Focused with a 2px offset ring (`#93C5FD`).
  - *Secondary / Outlined*: Background `#FFFFFF`, border 1px `#E2E8F0`, text `#334155`. Hover shifts border to `#CBD5E1` and surface to `#F8FAFC`.
  - *Destructive / Emergency Stop*: Background `#DC2626`, text `#FFFFFF`, radius 4px.
  - *Compact Table Actions*: Icon-only or minimal text at 28px height, padded with 8px horizontal clearance.

- **Status Badges & Chips**:
  - Pill geometry (`border-radius: 9999px`) with padding `2px 8px`.
  - *Critical (Cash Out Imminent)*: Background `#FEF2F2`, border 1px `#FCA5A5`, text `#991B1B`. Includes an animated pulsing 6px dot for real-time incidents.
  - *Warning (Surge / High Variance)*: Background `#FFFBEB`, border 1px `#FCD34D`, text `#92400E`.
  - *Optimal (Normal Float)*: Background `#ECFDF5`, border 1px `#6EE7B7`, text `#065F46`.
  - *Replenishment Dispatched*: Background `#EFF6FF`, border 1px `#93C5FD`, text `#1E40AF`.

- **Tables & Tabular Grids**:
  - Cell padding: 8px vertical, 12px horizontal for high-density analysis.
  - Header: `#F8FAFC` background, text `#475569`, 11px font size, uppercase, tracking `0.04em`, 1px solid bottom border (`#E2E8F0`).
  - Typography: `Inter` with tabular figures enabled. Right-align all currency, load percentage, and variance columns. Left-align ATM identity and route IDs. Center-align status badges.

- **Input Fields & Date Selectors**:
  - Height: 36px. Border: 1px `#CBD5E1`. Background: `#FFFFFF`. Font: 13px Inter.
  - Active/Focus: Border `#1D4ED8`, subtle shadow ring `0 0 0 3px rgba(29, 78, 216, 0.12)`.
  - Prefix/Suffix: Crisp icons or static labels (e.g., currency symbols or terminal codes) in neutral slate (`#64748B`).

- **Cards & Data Modules**:
  - Pure white background, 1px border `#E2E8F0`, rounded 8px (`0.5rem`).
  - Card Header: Separated by a 1px border `#F1F5F9`, holding the analytical title, time interval filter, and action trigger.
  - KPI Stat Panels: Displays raw number (24px, 700 weight), mini sparkline or delta pill (+/- percentage), and micro-description (11px, `#64748B`).

- **Data Visualization Elements**:
  - Chart grid lines: `#F1F5F9` dashed (2px dash, 2px space).
  - Primary time-series: `#1D4ED8` (stroke width 2px).
  - Predictive AI demand cone: Gradient fill transitioning from `rgba(29, 78, 216, 0.12)` down to `rgba(29, 78, 216, 0.01)`.
  - Tooltip: `#0F172A` background, white text, 4px radius, displaying high-precision values with timestamps.