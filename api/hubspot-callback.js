// api/hubspot-callback.js
//
// HubSpot OAuth callback — handles redirect after user authorizes.
// GET /api/hubspot-callback?code=...&state=...
//
// No JWT auth here — user is returning from HubSpot redirect.
// The signed state parameter provides authentication (contains userId).

import {
  isConfigured, verifyState, exchangeCodeForTokens,
  getPortalInfo, saveTokenForUser,
} from "./_hubspot.js";

const APP_URL = process.env.VITE_APP_URL || "https://www.cambriancatalyst.ai";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!isConfigured()) return res.redirect(302, `${APP_URL}?hubspot=error&reason=not_configured`);

  const { code, state } = req.query || {};

  // Validate state param (HMAC-signed, contains userId)
  if (!state || !code) {
    return res.redirect(302, `${APP_URL}?hubspot=error&reason=missing_params`);
  }

  const statePayload = verifyState(state);
  if (!statePayload?.userId) {
    return res.redirect(302, `${APP_URL}?hubspot=error&reason=invalid_state`);
  }

  // Check timestamp — reject if older than 10 minutes (prevents replay)
  if (statePayload.ts && Date.now() - statePayload.ts > 600_000) {
    return res.redirect(302, `${APP_URL}?hubspot=error&reason=expired`);
  }

  const userId = statePayload.userId;
  const redirectUri = `${APP_URL}/api/hubspot-callback`;

  try {
    // Exchange authorization code for tokens
    const tokenData = await exchangeCodeForTokens(code, redirectUri);
    if (!tokenData?.access_token) {
      console.error("[hubspot-callback] Token exchange failed");
      return res.redirect(302, `${APP_URL}?hubspot=error&reason=token_exchange`);
    }

    // Get portal info (hub_id) from the access token
    const portalInfo = await getPortalInfo(tokenData.access_token);

    // Store encrypted tokens
    await saveTokenForUser(userId, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      portalId: portalInfo?.portalId || null,
      scopes: portalInfo?.scopes || null,
    });

    console.log(`[hubspot] Connected user ${userId} to portal ${portalInfo?.portalId}`);
    return res.redirect(302, `${APP_URL}?hubspot=connected`);
  } catch (e) {
    console.error("[hubspot-callback] Error:", e.message);
    return res.redirect(302, `${APP_URL}?hubspot=error&reason=server_error`);
  }
}
