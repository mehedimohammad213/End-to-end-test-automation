# Conduit Playwright Test Framework

End-to-end test automation framework for [Conduit](https://conduit.bondaracademy.com/) built with Playwright and TypeScript.

## Features

- Page Object Model architecture
- Session reuse via authenticated storage state
- API helpers for test pre-conditions (create/delete articles)
- Dynamic test data with Faker
- Positive and negative test coverage
- Cross-browser support (Chromium, Firefox, WebKit)
- Parallel execution
- HTML + Allure reporting
- Traces, screenshots, and video on failure
- GitHub Actions CI/CD pipeline

## Test Scenarios

| Scenario | Positive | Negative |
|---|---|---|
| Create Article | Publish valid article | Submit empty form |
| Edit Article | Update title/body (API pre-condition) | Clear required title |
| Delete Article | Confirm deletion (API pre-condition) | Cancel delete dialog |
| Filter by Tag | Filter feed by tag (API pre-condition) | Non-existent tag shows empty feed |
| Update Settings | Update bio | Invalid email validation |

## Setup

```bash
npm install
npx playwright install
cp .env.example .env
```

## Run Tests

```bash
# All browsers (headless)
npm test

# Chromium only
npm run test:chromium

# Visible browser (headed)
npm run test:headed

# Interactive UI mode
npm run test:ui

# View HTML report
npm run report
```

## Docker

```bash
cp .env.example .env   # configure credentials first

# Build image
npm run docker:build

# Run all tests in container
npm run docker:test

# Chromium only
npm run docker:test:chromium
```

Reports are written to `playwright-report/`, `allure-results/`, and `test-results/` on the host via volume mounts.

## Environment Variables

| Variable | Description |
|---|---|
| `BASE_URL` | Conduit frontend URL |
| `API_URL` | Conduit API base URL |
| `USER_EMAIL` | Test user email |
| `USER_PASSWORD` | Test user password |

## Project Structure

```
src/
  api/          # API client for pre-conditions
  data/         # Dynamic test data generators
  pages/        # Page Object classes
tests/          # Test specifications
.auth/          # Persisted session storage (generated)
```

## CI/CD

GitHub Actions (`.github/workflows/playwright.yml`) runs on push/PR to `main`/`master` and on manual dispatch. Tests execute inside Docker for a reproducible environment, with a browser matrix (Chromium, Firefox, WebKit).

Configure repository secrets:

- `USER_EMAIL`
- `USER_PASSWORD`

Artifacts uploaded on each run: Playwright HTML report, Allure results, merged Allure report, and test traces on failure.

# End-to-end-test-automation
