# Over Time Stats: Grouping & Range Filter Design

**Date:** 2026-03-08

## Summary

Simplify the Over Time stats page by grouping early reading years into named life-chapter bars ("Childhood" and "Uni"), and add a "From" dropdown so the user can choose how far back the chart reaches.

## Grouping Rules

| Label      | Date Range              |
|------------|-------------------------|
| Childhood  | 1 Jan 2010 – 31 Dec 2012 |
| Uni        | 1 Jan 2013 – 31 Dec 2018 |
| Individual | 2019 onwards (one bar per year) |

Books with a read date outside these ranges (pre-2010) are excluded.

## Dropdown ("From" selector)

- Options: **Childhood, Uni, 2019, 2020, …, [current year]**
- Default: Childhood (shows everything)
- Selecting a label causes all bars from that label onwards to be shown; earlier labels are hidden
- The dropdown sits above the chart

### Visibility rules

| Selection  | Bars shown |
|------------|------------|
| Childhood  | Childhood + Uni + all individual years |
| Uni        | Uni + all individual years |
| 2019       | 2019, 2020, … [current year] |
| 2022       | 2022, 2023, … [current year] |

## Chart

- Childhood and Uni bars are aggregated across their full date ranges (books, pages, avg rating)
- Individual year bars behave exactly as today
- Tooltip shows group name / year, book count, page count, avg rating
- Bar colours follow the existing scheme (gold for all but the most recent bar, which is burgundy)

## Table

- The data table below the chart respects the same filter — only rows matching the current selection are shown
- Childhood and Uni each appear as a single row
