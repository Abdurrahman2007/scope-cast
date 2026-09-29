# iOS-style market polish and working TAC predictions

## What will change
- Enlarge and refine the mobile-first feed and market screens with clearer iOS-style spacing, typography, grouped surfaces, and smoother press/navigation feedback.
- Add locally bundled, recognizable crypto marks and sport category symbols to market cards and detail views.
- Rebuild Profile as a polished account hub with balance, prediction stats, and working expandable sections instead of dead rows.
- Make market entries functional: validate amount and outcome, prevent duplicate submissions, deduct TAC Points, record the position, and reflect the new balance throughout the app.
- Wire currently visible actions to a real screen, panel, or clear disabled state; remove misleading controls that do nothing.

## Technical details
- Keep CoinGecko requests and credentials server-side and reuse the existing shared cache.
- Add a shared prediction wallet/state layer for immediate UI updates and persistence, while keeping transaction logic isolated for migration to the server-authoritative backend flow.
- Use reusable semantic design tokens and existing button components; preserve Home, Markets, Rewards, and Profile navigation.
- Verify the latest build signal plus Home, market entry, balance update, Profile interactions, and 360–414px layouts in the live preview.
