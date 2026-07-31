# Testing Strategy

## Unit Tests (Jest)

Location: `__tests__/`

Run with:
```bash
npm test
```

### What's tested
| File | Tests |
|---|---|
| `calculations.test.ts` | stepsToDistanceM, metersToKm, metersToMiles, stepsToCalories, progressPercent |
| `dateHelpers.test.ts` | todayString, dateString, last7Days, shortDayLabel, isToday |

### Add more tests here (Phase 2)
- `streak.test.ts` — recalculateStreak logic with mock DB data
- `todayStore.test.ts` — Zustand store actions (addSteps, setGoal, reset)
- `database.test.ts` — SQLite queries against an in-memory DB

### Running tests
```bash
npm test                  # run all tests
npm test -- --watch       # watch mode
npm test -- --coverage    # coverage report
```

---

## Integration / Manual Tests

See [TESTING.md](TESTING.md) for device testing checklist.

Key scenarios:
1. Walk with phone → steps increment
2. Goal reached → celebration fires once, not on every render
3. Day rollover at midnight → steps reset, history records previous day
4. Phone reboot → today's steps start fresh, history preserved

---

## Postman Collections

Location: `postman/`

> **v1 has no backend — collections are stubs for Phase 3 cloud sync.**

| Collection | Purpose |
|---|---|
| `steps-counter-api.postman_collection.json` | Auth + Steps sync endpoints (Phase 3 placeholder) |

### Import into Postman
1. Open Postman
2. File → Import → select `postman/steps-counter-api.postman_collection.json`
3. Update `base_url` variable when backend is running

### When we add a backend (Phase 3)
We will add:
- `POST /auth/register` + `POST /auth/login`
- `GET/POST /steps/sync` — upload/download daily records
- `GET /goals` — fetch user goal history
- Tests tab in each request with assertion scripts (status 200, response schema)
