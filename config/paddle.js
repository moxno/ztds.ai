/**
 * ZTDS.ai — Paddle Billing v2 Configuration SSOT
 * 
 * Central registry for Paddle Merchant of Record (MoR) credentials,
 * product pricing tiers (Developer Pro, TEAMS), and environment settings.
 */

'use strict';

const PADDLE_CONFIG = {
  defaultEnvironment: process.env.PADDLE_ENVIRONMENT || 'sandbox',

  environments: {
    sandbox: {
      name: 'sandbox',
      apiBaseUrl: 'https://sandbox-api.paddle.com',
      checkoutBaseUrl: 'https://sandbox-buy.paddle.com',
      clientToken: process.env.PADDLE_CLIENT_TOKEN || 'test_c0384ff8a02a7ea414436eb81b5',
      prices: {
        developer_pro: {
          annual: process.env.PADDLE_PRICE_DEV_ANNUAL || 'pri_01hrztds_dev_annual_1990',
          monthly: process.env.PADDLE_PRICE_DEV_MONTHLY || 'pri_01hrztds_dev_monthly_199',
          amountAnnualUsd: 1990,
          amountMonthlyUsd: 199
        },
        teams: {
          annual: process.env.PADDLE_PRICE_TEAMS_ANNUAL || 'pri_01hrztds_teams_annual_990',
          monthly: process.env.PADDLE_PRICE_TEAMS_MONTHLY || 'pri_01hrztds_teams_monthly_99',
          amountAnnualUsd: 990,
          amountMonthlyUsd: 99
        }
      }
    },
    production: {
      name: 'production',
      apiBaseUrl: 'https://api.paddle.com',
      checkoutBaseUrl: 'https://buy.paddle.com',
      clientToken: process.env.PADDLE_CLIENT_TOKEN_PROD || process.env.PADDLE_CLIENT_TOKEN || 'live_7a94b8e391fbc238510842e4d91',
      prices: {
        developer_pro: {
          annual: process.env.PADDLE_PRICE_DEV_ANNUAL_PROD || 'pri_01j7ztds_dev_annual_1990',
          monthly: process.env.PADDLE_PRICE_DEV_MONTHLY_PROD || 'pri_01j7ztds_dev_monthly_199',
          amountAnnualUsd: 1990,
          amountMonthlyUsd: 199
        },
        teams: {
          annual: process.env.PADDLE_PRICE_TEAMS_ANNUAL_PROD || 'pri_01j7ztds_teams_annual_990',
          monthly: process.env.PADDLE_PRICE_TEAMS_MONTHLY_PROD || 'pri_01j7ztds_teams_monthly_99',
          amountAnnualUsd: 990,
          amountMonthlyUsd: 99
        }
      }
    }
  },

  tierMetadata: {
    developer_pro: {
      title: 'Developer Pro SDK',
      nodes: 5,
      gracePeriodDays: 30,
      description: 'Headless SDK & MCP stdio server with air-gapped node licenses for enterprise AI pipelines.',
      features: [
        'Headless @privacyscrubber/sdk for Node.js & Python',
        'Cursor & Claude Code MCP stdio server',
        'LangChain & LlamaIndex memory connectors',
        'Unlimited backend microservice executions',
        'Cryptographic Ed25519 offline license verification'
      ]
    },
    teams: {
      title: 'ZTDS TEAMS',
      nodes: 10,
      gracePeriodDays: 30,
      description: 'Collaborative zero-cloud sanitization for up to 5 engineers or analyst workstations.',
      features: [
        '5 Workstation / Browser Extension Seats',
        '100% In-RAM local sanitization',
        'Cloud-free local team rule synchronization',
        'Shared custom Regex & entity masking sets',
        'Reverse-charge B2B VAT compliance invoicing'
      ]
    }
  }
};

/**
 * Helper to resolve price ID given tier, interval, and environment
 */
function getPriceId(tier = 'developer_pro', interval = 'annual', environment = null) {
  const env = environment || PADDLE_CONFIG.defaultEnvironment;
  const envConfig = PADDLE_CONFIG.environments[env] || PADDLE_CONFIG.environments.sandbox;
  const tierPrices = envConfig.prices[tier] || envConfig.prices.developer_pro;
  return interval === 'monthly' ? tierPrices.monthly : tierPrices.annual;
}

module.exports = {
  PADDLE_CONFIG,
  getPriceId
};
