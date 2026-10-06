# Finish pending TacPredict work

## Step 1 — Fix what's broken now
- Fix remaining type errors on Home and the market page, confirm the site opens without the 404, and check the Up/Down page and category logos on a phone-size screen.

## Step 2 — Secure TAC Points (needs sign-in)
- Add email + Google sign-in.
- Store balance, predictions and point history in the backend; every prediction is checked on the server (logged in, market open, enough balance, no double entry) before points are deducted.
- New users start with 10,000 TAC Points.

## Step 3 — Rewards and Profile
- Daily check-in and streak saved per account, leaderboard inside Rewards.
- Profile shows active, resolved and full prediction history from the backend.

## Step 4 — Admin markets
- Admin-only role; admins can create, close, resolve or cancel markets, recording who resolved, when, outcome and source. Winning predictions get paid out in TAC.

## Step 5 — Sports and News
- Sports and News sections pulled from Polymarket's live categories with source links and rules (no made-up events).

## Step 6 — Speed and full check
- Lighter lists, fewer re-renders, production build, console and 360–414px layout checks on every page.

## Technical details
- Tables: profiles, user_roles (separate, has_role function), markets, market_outcomes, predictions, points_transactions, with RLS + grants.
- Prediction placement via an authenticated server function running a single database transaction with an idempotency key.
- Local preview wallet replaced by the backend-backed wallet provider.
