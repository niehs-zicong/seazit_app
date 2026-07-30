# Changelog

All notable changes to NTP SEAZIT are documented in this file. Versions are date-based (`YYYY-MM-DD`), newest first.

---

## [2026-07-23] — Current

- Redrafted `README.md` with comprehensive installation, database setup, dev server, testing, and troubleshooting documentation
- Added `spec.md` covering technical architecture, directory structure, backend/frontend stack, database configuration, auxiliary services (RServe), scientific libraries, and environment configuration
- Added `CHANGELOG.md` to track project version history going forward

---

## [2026-06-23]

- Project baseline at this date
- Django upgraded to 4.2.18; Django REST Framework 3.14.0 in place
- React 16 frontend bundled via Webpack 5 with `django-webpack-loader`
- Local development database via Docker PostgreSQL on port 5433
- Optional RServe container (port 6311) available for R-based analytics
- Conda environment `seazit` pinned to Python 3.8, Node 22.5.1, Yarn 4.3.1
- Core scientific stack in place: numpy 1.23.5, pandas 1.3.5, scipy 1.10.1, matplotlib 3.7.3, plotly 5.24.1, seaborn 0.13.2
