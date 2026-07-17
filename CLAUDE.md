# Project instructions

## About this project

Static site (no build step, no framework) for a Qiscus Omnichannel
"custom channel menu" widget, plus a dashboard showcase for demoing
widget customization cases to clients. See README.md for structure.

- `widget/index.html` — widget entry point, loaded standalone or in the
  dashboard's iframe preview.
- `index.html` (root) — dashboard showcase with case picker + live iframe
  preview of the real widget.
- `js/cases.js` — case/category registry, must load before `config.js`.
- `js/config.js` — all widget config (menu items, Qiscus app id/channel,
  custom CSS for the Qiscus iframe), resolves the active case from
  `?case=`.
- `js/app.js` — widget runtime: renders menu, loads Qiscus SDK
  (`qismo-v5.js`), pushes custom CSS into Qiscus's iframes via
  `postMessage`.
- `js/dashboard.js` — dashboard runtime: renders case picker, reloads the
  iframe preview when a case is selected.

No test suite, no bundler. Plain vanilla JS (IIFEs, `var`), served as-is.

## Commits

After every code change in this repo, automatically commit the change using
the `smart-conventional-commits` skill — do not ask for confirmation first.
This applies to every session, not just when explicitly requested.

## Deployment (Coolify)

The site is deployed on Coolify as app **live-custom-widget**
(uuid `qk7k8h7g0w8g5ba1tjfsds57`), served from the `main` branch of
`git@github.com:Qiscus-Integration/custom-live-widget-example.git`, live at
`https://live-custom-widget-d1bfc6.coolify.qiscus.io`. There is no GitHub
Action for deployment — it was removed after a Coolify auto-deploy bug, so
redeploys must be triggered manually.

When the user says "redeploy" (or equivalent), run this workflow immediately,
without asking for confirmation first:

1. If there are uncommitted changes, commit them first via
   `smart-conventional-commits`.
2. `git push origin main` (redeploy always pulls from `main` — make sure it's
   up to date first).
3. Call `mcp__claude_ai_coolify_qiscus__deploy_app` with
   `uuid: "qk7k8h7g0w8g5ba1tjfsds57"` (use `force: true` only if the user
   asks for a clean/no-cache rebuild).
4. Poll `mcp__claude_ai_coolify_qiscus__list_deployments_for_app` (same uuid)
   or use the Monitor tool to poll
   `curl -s -o /dev/null -w "%{http_code}" https://live-custom-widget-d1bfc6.coolify.qiscus.io/`
   until it returns `200`.
5. Report back that the redeploy finished and the site is live.

Note: right after a deploy, `get_app` may report the container as
`exited:unhealthy` even though it's actually serving fine (a known Coolify
status-reporting bug) — trust the `200` from curl / the finished deployment
status over that field, don't treat it as a real outage.
