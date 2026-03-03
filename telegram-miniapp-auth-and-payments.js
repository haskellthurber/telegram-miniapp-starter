/**
 * Telegram Mini App — Auth & Payments Boilerplate
 * Production-tested code extracted from WhisprMe (https://whisprme.app)
 * 
 * This file contains two critical pieces for any Telegram Mini App:
 * 1. initData validation (HMAC-SHA256) for secure authentication
 * 2. Telegram Stars payment flow (invoice → pre_checkout → success)
 *
 * Try the live app: https://t.me/WhisprMe_bot
 * More details: https://dev.to/haskelldev
 */

const crypto = require('crypto');

// ============================================
// PART 1: initData Validation (Authentication)
// ============================================

function validateInitData(initData, botToken) {
  if (!initData) return null;
  
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  
  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => key + '=' + val)
    .join('\n');
  
  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(botToken)
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  if (calculatedHash !== hash) return null;
  
  try {
    const user = JSON.parse(params.get('user'));
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name || '',
      username: user.username || '',
      language_code: user.language_code || 'en',
      is_premium: user.is_premium || false,
      auth_date: parseInt(params.get('auth_date')),
      start_param: params.get('start_param') || null
    };
  } catch (e) {
    return null;
  }
}

function telegramAuth(botToken) {
  return (req, res, next) => {
    const initData = req.headers['x-telegram-init-data'];
    const user = validateInitData(initData, botToken);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid Telegram auth' });
    }
    
    const age = Math.floor(Date.now() / 1000) - user.auth_date;
    if (age > 3600) {
      return res.status(401).json({ error: 'Auth expired' });
    }
    
    req.telegramUser = user;
    next();
  };
}

// ============================================
// PART 2: Telegram Stars Payment Flow
// ============================================

async function createStarsInvoice(bot, title, description, amount) {
  return bot.telegram.createInvoiceLink({
    title,
    description,
    payload: JSON.stringify({ type: 'unlock', timestamp: Date.now() }),
    provider_token: '',
    currency: 'XTR',
    prices: [{ label: title, amount }]
  });
}

function setupPreCheckout(bot) {
  bot.on('pre_checkout_query', async (ctx) => {
    try {
      await ctx.answerPreCheckoutQuery(true);
    } catch (error) {
      await ctx.answerPreCheckoutQuery(false, 'Validation failed');
    }
  });
}

function setupSuccessfulPayment(bot, db) {
  bot.on('message', async (ctx) => {
    if (!ctx.message.successful_payment) return;
    const payment = ctx.message.successful_payment;
    const payload = JSON.parse(payment.invoice_payload);
    await db.query(
      'INSERT INTO transactions (telegram_id, type, stars) VALUES ($1, $2, $3)',
      [ctx.from.id, payload.type, payment.total_amount]
    );
    await ctx.reply('Payment successful!');
  });
}

module.exports = { validateInitData, telegramAuth, createStarsInvoice, setupPreCheckout, setupSuccessfulPayment };

// Built with love — https://whisprme.app | https://t.me/WhisprMe_bot
