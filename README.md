# Telegram Mini App Starter Kit

> Production-tested boilerplate for building Telegram Mini Apps with Node.js, Express, React, and Telegram Stars payments.

**Extracted from [WhisprMe](https://whisprme.app)** — an anonymous messaging app running as a Telegram Mini App.

[![Try WhisprMe Bot](https://img.shields.io/badge/Try%20it-@WhisprMe__bot-blue?logo=telegram)](https://t.me/WhisprMe_bot)

## What's Inside

This starter kit covers the hardest parts of building a Telegram Mini App:

### 1. initData Authentication (HMAC-SHA256)
- No passwords, no OAuth — Telegram handles identity
- Two-step HMAC validation using your bot token
- Express middleware for protecting API routes
- Auth expiry checking

### 2. Telegram Stars Payments
- Complete payment flow: invoice creation → pre-checkout → success
- XTR currency (Telegram Stars) — no external payment provider
- Database transaction recording
- Works with @twa-dev/sdk on the frontend

### 3. Frontend Integration
- Sending initData with every API request
- Haptic feedback for native feel
- Opening invoice URLs with WebApp.openInvoice()

## Quick Start

1. Clone the repo
2. npm install
3. Copy .env.example to .env and add your BOT_TOKEN from @BotFather
4. node server.js

## Tech Stack

- **Backend**: Node.js + Express
- **Bot**: Telegraf
- **Frontend**: React + @twa-dev/sdk
- **Database**: PostgreSQL
- **Payments**: Telegram Stars (XTR)
- **Auth**: Telegram initData (HMAC-SHA256)

## Key Files

- telegram-miniapp-auth-and-payments.js — Complete auth + payment code
- See the [full gist](https://gist.github.com/haskellthurber/d8ebe613c8bb9ec4164a07be6370726b) for documented code

## Production Example

**[WhisprMe](https://whisprme.app)** uses this exact code in production:
- [Try the bot](https://t.me/WhisprMe_bot)
- Anonymous messaging inside Telegram
- Unlock messages with Stars micropayments
- i18n support (English + Russian)

Running on a single Hetzner VPS with PM2. Total infra cost: ~$5/month.

## Resources

- [How to Accept Payments in a Telegram Mini App Using Stars](https://dev.to/haskelldev/how-to-accept-payments-in-a-telegram-mini-app-using-stars-step-by-step-guide-46je) — Step-by-step guide
- [5 Things That Surprised Me Building a Telegram Mini App](https://dev.to/haskelldev/5-things-that-surprised-me-building-a-telegram-mini-app-real-production-lessons-4bmk) — Production lessons
- [How Telegram Stars Changed Micropayments](https://medium.com/@pastureubhaskell/how-telegram-stars-changed-micropayments-for-mini-app-developers-d61a04867f45) — Medium article

## License

MIT — use this code however you want. If it helps you build something, drop a star on this repo!

---

Built by [@haskellthurber](https://github.com/haskellthurber) | [WhisprMe](https://whisprme.app) | [Dev.to](https://dev.to/haskelldev)
