<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture decisions

- The public product uses a shared prediction-first shell with Home, Markets, Rewards, and Profile because legacy features must not define primary navigation.
- Market data contracts live under `src/domain/markets` because all categories and binary or multi-outcome markets share one category-independent model.
- External market-price credentials and requests must stay behind server functions because provider keys cannot ship to browsers.
- CoinGecko market snapshots use a shared server cache and request deduplication because live cards must not create duplicate provider calls.
- The visible product uses the compact World Graphite design system with Space Grotesk headings and DM Sans body text because mobile market scanning is the primary interaction.
