# TacPredict Markets

STOP.



The previous implementation direction is NOT what I want.



I do NOT want to preserve the current TacPredict app structure as the main UI.



I want a FULL FRONTEND PRODUCT REDESIGN.

prediction market pro motion animations shmoothness+ coingeco API use koro: https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin&x_cg_demo_api_key=CG-Zemk4y3vZSbbYuyQ3q8JjZi6



Also kaj complete hole npm run build same to same World.xyz er moto hote hobe



The current app should be transformed from the existing multi-feature Web3 mini app into a dedicated prediction-market application.



Do NOT treat this as an incremental redesign of the current Home/Predict/Trade/Games structure.



This is a complete prediction-market-focused rebuild of the user-facing app.



IMPORTANT:

The safe Git branch/checkpoint you already created MUST remain.

All work must continue ONLY on the development branch.

Do not touch main or the checkpoint branch.



--------------------------------------------------

1. PRODUCT DIRECTION

--------------------------------------------------



TacPredict should become a professional prediction-market application.



The prediction market is now the PRIMARY and CENTRAL purpose of the entire app.



Think of the product experience as:



World prediction-market style UX

+

Polymarket-style market discovery

+

TacPredict branding

+

TAC Points instead of real-money deposits



The entire application should be redesigned around discovering and participating in prediction markets.



--------------------------------------------------

2. REMOVE / HIDE THE OLD STRUCTURE

--------------------------------------------------



Do NOT keep the current navigation structure:



Home

Games

Predict

Trade

Profile



as the main navigation.



Do NOT keep the old Trade tab visible.



Do NOT keep the old Leaderboard tab visible.



Do NOT keep the old standalone Predict page visible as the current implementation.



Do NOT keep the old Games-first structure visible.



Do NOT keep the old crypto predictor UI as the main product.



These existing features can remain in the codebase temporarily for safety/backward compatibility, but they must NOT appear in the new primary user interface.



If necessary, move old pages/components behind an internal/legacy route or leave them unused.



DO NOT delete them blindly.



--------------------------------------------------

3. NEW APP STRUCTURE

--------------------------------------------------



Create a completely new prediction-market-first application shell.



The main experience should be centered around:



MARKETS



A suggested structure:



Home

Markets

Rewards

Profile



Bottom navigation should be simple and prediction-focused.



Home = prediction discovery



Markets = full market explorer



Rewards = TAC Points / rewards



Profile = user account + prediction history



Do NOT expose Trade as a primary tab.



Do NOT expose Leaderboard as a primary tab.



If leaderboard functionality is retained, place it inside Rewards or Profile.



Games should not be part of the primary navigation.



Existing Games/Trade code can remain hidden for now.



--------------------------------------------------

4. HOME PAGE MUST BE COMPLETELY REDESIGNED

--------------------------------------------------



The current TacPredict Home page should NOT remain.



Build a new prediction-market Home page from scratch.



The Home page should immediately feel like a modern prediction platform.



Structure should include sections such as:



Featured Markets



Trending



Ending Soon



New Markets



Crypto



Sports



News



Technology



Business



Other



Use compact prediction-market cards.



The user should open the app and immediately see prediction markets.



The old:



NFT teaser

Game cards

Trade cards

old check-in layout

old generic banners

old mini-app dashboard



should NOT dominate the Home page.



Prediction markets must dominate the screen.



--------------------------------------------------

5. MARKETS PAGE

--------------------------------------------------



Create a completely new Markets page.



Top area:



Markets



Search



Category filters



Suggested categories:



All

Crypto

Sports

News

Technology

Business

Culture

Other



Then sections:



Trending

Most Active

Ending Soon

New

Popular



Users should be able to browse many markets quickly.



The interface should be optimized for mobile.



--------------------------------------------------

6. MARKET CARD

--------------------------------------------------



Create a reusable professional MarketCard component.



Each card can display:



Market title



Category



Market image/icon



Closing time



Outcomes



Probability/percentage



Participation information



Prediction CTA



Example:



Will BTC reach $120,000 before December?



YES 64%

NO 36%



Ends in 2d



Predict



Cards must look clean and compact.



Do not make them oversized.



--------------------------------------------------

7. MARKET DETAIL

--------------------------------------------------



Clicking a market opens a dedicated market detail screen.



Structure:



Back



Category



Market title



Description



Source



Source URL



Closing time



Current outcomes



Probability



Prediction amount



Current TAC Points balance



Potential reward



Confirm Prediction



Activity



User's Position



Resolution status



Example:



Will BTC reach $120,000 before December?



YES

64%



NO

36%



Your balance:

10,000 TAC Points



Prediction amount:

500 TAC Points



[ Confirm Prediction ]



--------------------------------------------------

8. TAC POINTS ONLY

--------------------------------------------------



This is NOT a real-money prediction market.



Users do NOT deposit money.



Users do NOT deposit USDC.



Users do NOT fund predictions with crypto.



Users only use TAC Points.



Example:



Balance:

10,000 TAC Points



User predicts:

500 TAC Points



After successful prediction:



9,500 TAC Points



Record the prediction.



Prepare the architecture for future reward distribution.



--------------------------------------------------

9. DO NOT MAKE FAKE REAL-MONEY UX

--------------------------------------------------



Do not show:



Deposit

Withdraw

Buy USDC

Crypto funding

Fiat funding



for prediction positions.



The prediction economy is:



TAC Points → Prediction → Result → Reward



--------------------------------------------------

10. MARKET TYPES

--------------------------------------------------



The new system must support:



Binary markets



YES / NO



and multi-outcome markets.



Examples:



YES / NO



BTC / ETH / SOL



Team A / Team B



Multiple possible outcomes.



Do not hard-code the UI for only BTC UP/DOWN.



--------------------------------------------------

11. CRYPTO MARKETS

--------------------------------------------------



Crypto is only ONE category.



Build support for markets such as:



Will BTC reach $120,000?



Will ETH reach $5,000?



Will BTC close above $110,000 today?



Will SOL outperform ETH this week?



Use real market data where appropriate.



Keep the existing Binance/CoinGecko infrastructure where useful, but adapt it to the new market architecture.



Do NOT allow the old 5m/15m/30m predictor UI to define the entire product.



It should become one possible market type inside the new market engine.



--------------------------------------------------

12. NEWS MARKETS

--------------------------------------------------



Create a News category.



Architecture must support prediction markets based on verifiable news/events.



Examples:



Will X happen before date Y?



Will company X announce Y?



Will event X happen this month?



Every market must have:



source

sourceUrl

resolution criteria



Do not generate fake news.



--------------------------------------------------

13. SPORTS MARKETS

--------------------------------------------------



Create a Sports category.



Support architecture for:



Football

Basketball

Tennis

Cricket



Market examples:



Who will win?



Will Team A win?



Total goals



Tournament winner



Player performance



Use provider abstractions so real APIs can be connected.



Do not hard-code fake live results.



--------------------------------------------------

14. MORE CATEGORIES

--------------------------------------------------



Prepare the system for:



Technology



Business



Culture



Entertainment



Community



and future categories.



The market engine must be category-independent.



--------------------------------------------------

15. MARKET ENGINE

--------------------------------------------------



Create a proper market domain architecture.



Example:



src/domain/markets/



Market

Outcome

Category

MarketStatus

MarketType

Resolution



Create reusable services:



src/services/markets/

src/services/predictions/

src/services/points/



Do not put the entire prediction system inside one giant React component.



--------------------------------------------------

16. POINTS SECURITY

--------------------------------------------------



The existing client-side points system must NOT be trusted for production prediction transactions.



Create a server-authoritative prediction flow.



When the user predicts:



Client

→ API

→ validate user

→ validate market

→ validate balance

→ validate amount

→ validate market status

→ deduct TAC Points

→ create prediction transaction

→ return success

→ update UI



Prevent:



double submission

negative balance

insufficient balance

expired market

resolved market

duplicate transaction

client balance manipulation



--------------------------------------------------

17. DATA MODEL

--------------------------------------------------



Create scalable structures for:



markets



market outcomes



predictions



prediction transactions



market resolution



points transactions



Example:



markets/{marketId}



predictions/{predictionId}



pointsTransactions/{transactionId}



Do not unnecessarily destroy the existing user data.



Migrate carefully where required.



--------------------------------------------------

18. ADMIN MARKET MANAGEMENT

--------------------------------------------------



The new system needs a proper admin market architecture.



Admin should eventually be able to:



Create market

Edit market

Publish market

Close market

Resolve market

Cancel market



Resolution must record:



resolvedBy

resolvedAt

resolution

source

sourceUrl



Normal users must never have access to these controls.



--------------------------------------------------

19. REWARDS

--------------------------------------------------



Create a dedicated Rewards page.



It should become the home for:



TAC Points



Daily Check-in



Streaks



Prediction rewards



Tasks



Campaign rewards



Future rewards



The old Leaderboard should NOT be a primary navigation item.



If leaderboard is kept, put it inside Rewards.



--------------------------------------------------

20. PROFILE

--------------------------------------------------



Create a clean prediction-focused Profile.



Show:



Wallet/account



TAC Points balance



Active Predictions



Prediction History



Resolved Predictions



Rewards



Settings



NFT collection if still relevant



Do not make Profile look like the old dashboard.



--------------------------------------------------

21. VISUAL DIRECTION

--------------------------------------------------



Research the current World prediction-market experience and modern prediction-market products before implementing.



Use their information architecture and UX patterns as inspiration.



Do NOT copy:



World logo

World branding

World assets

Polymarket branding

Polymarket logo

copyrighted images

exact proprietary text

exact visual identity



TacPredict must have its own visual identity.



The goal is:



"Feels like a professional prediction market app"



NOT:



"Looks like a copied World website."



--------------------------------------------------

22. MOBILE FIRST

--------------------------------------------------



This is a mini app.



Mobile is the primary platform.



Optimize for:



360px

375px

390px

414px



Then:



768px

1024px

1440px



No horizontal overflow.



No oversized desktop-style cards.



Navigation should feel natural on mobile.



--------------------------------------------------

23. COINGECKO

--------------------------------------------------



Keep:



COINGECKO_API_KEY



server-side.



Do NOT expose it through:



VITE_COINGECKO_API_KEY



Use:



.env



or secure server environment variables.



Create a reusable CoinGecko service.



Use:



caching

deduplication

rate-limit protection

error handling



Do not call CoinGecko independently from every card.



--------------------------------------------------

24. PERFORMANCE

--------------------------------------------------



The new application must be smooth.



Fix the current performance problems identified during the audit:



- excessive 250ms timers

- unnecessary React renders

- duplicate API calls

- heavy TokenPredictPage

- excessive animation

- unnecessary Firestore reads

- large lists rendering everything



Use:



shared timers

memoization where useful

lazy loading

pagination

caching

request deduplication

debounced search

optimized images



Do not over-engineer.



--------------------------------------------------

25. OLD FEATURES

--------------------------------------------------



DO NOT DELETE old features immediately.



Keep existing code safely available on the development branch.



But hide the old UI from the main product.



Old:



Trade

Games

Leaderboard

old Predict interface

old dashboard sections



should not define the new application.



This is a FRONTEND PRODUCT TRANSFORMATION.



--------------------------------------------------

26. IMPORTANT

--------------------------------------------------



Do NOT simply modify the current Home page.



Do NOT simply rename Predict to Markets.



Do NOT simply add News and Sports tabs to the existing UI.



Do NOT keep the old dashboard and add prediction cards underneath it.



The entire visible application structure must be redesigned around prediction markets.



--------------------------------------------------

27. IMPLEMENTATION ORDER

--------------------------------------------------



Phase 1:



Create the new application shell and navigation.



Phase 2:



Completely redesign Home.



Phase 3:



Create Markets page.



Phase 4:



Create MarketCard.



Phase 5:



Create MarketDetail.



Phase 6:



Create TAC Points prediction flow.



Phase 7:



Integrate existing crypto market data.



Phase 8:



Add News architecture.



Phase 9:



Add Sports architecture.



Phase 10:



Create Rewards.



Phase 11:



Create Profile.



Phase 12:



Admin market management.



Phase 13:



Performance optimization.



Phase 14:



Full QA.



--------------------------------------------------

28. IMPORTANT WORKING RULE

--------------------------------------------------



Do NOT implement everything in one giant change.



Work phase-by-phase.



After each phase:



run the app

check console

check build

check mobile layout

fix errors



Do not claim something works unless you tested it.



--------------------------------------------------

29. START NOW

--------------------------------------------------



You already completed the audit and created:



checkpoint/pre-prediction-redesign-20260928



develop/prediction-first-redesign



Continue ONLY on:



develop/prediction-first-redesign



Do NOT touch main.



Start with Phase 1:



BUILD THE NEW PREDICTION-MARKET APPLICATION SHELL.



Then Phase 2:



REBUILD THE HOME PAGE COMPLETELY AROUND PREDICTION MARKETS.



Do not stop after creating a plan.



Actually implement Phase 1 and Phase 2.



The current Home page should be replaced by the new prediction-market Home experience.



Old Trade, Games, Leaderboard and old Predict UI should be hidden from the primary user experience.



Keep their code safely available in the branch so nothing is permanently lost.



After Phase 1 + Phase 2:



run the app

run production build

check console

check responsive layout



Then report exactly what changed and continue to Phase 3.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://scope-cast.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b2b92f82-d177-4ecf-a436-bdc110dd6d3f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
