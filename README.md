# TusaMap

Карта событий Астаны — Telegram Web App. Бот: [@tusa_astana_bot](https://t.me/tusa_astana_bot).

**Токен бота** хранится только на бэкенде (переменные окружения), в репозитории его нет.

## Revenue plan and first-money target

The project is designed to start with organizer monetization, not a visitor subscription.

Priority path:
- sell visibility and ticket conversion to local organizers
- support first 5–10 organizers with low-friction launch offers
- validate 20 real events and 10 paid ticket sales
- transition to a commission and featured-placement model

Primary early revenue streams:
- 5–10% commission on successful ticket sales
- paid featured placement in discovery rankings
- organizer toolkit: analytics, guest list, QR check-in

The commercial roadmap is documented in [docs/MONETIZATION_PLAN.md](docs/MONETIZATION_PLAN.md) and the outreach motion is in [docs/SALES_PLAYBOOK.md](docs/SALES_PLAYBOOK.md).
The first-organizer prospecting workflow and lead tracker are in [docs/CLIENT_PROSPECTING.md](docs/CLIENT_PROSPECTING.md).

## GitHub Pages

Сайт публикуется на **https://yessken.github.io/** через GitHub Actions при пуше в `main`. В репозитории должны быть в корне: `package.json`, `angular.json`, `src/`, `.github/workflows/deploy-pages.yml`. В настройках репозитории: **Settings → Pages → Source**: GitHub Actions.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Use this project as a Telegram Mini App starter

This repository is currently the TUSA application, not a generic app generator. Developers can fork/clone it as a starter, replace TUSA branding and event-specific logic, and configure their own Telegram bot and API.

### 1. Create and configure your bot

1. Create a bot with [@BotFather](https://t.me/BotFather) and keep its bot token private.
2. Host the Angular app on an HTTPS origin.
3. Set the bot's Web App domain/menu URL to that HTTPS origin in BotFather. The backend calls `setChatMenuButton` on startup when `Telegram:WebAppUrl` is configured.
4. Set an HTTPS webhook URL that reaches the API and create a separate webhook secret. Do not reuse the bot token as the webhook secret.

### 2. Configure API secrets

In the backend project folder, configure the bot token, public Mini App URL, webhook URL, webhook secret, and numeric admin Telegram ID with .NET User Secrets for local Development. For deployment, use the hosting provider's secret/environment-variable store. Environment variable names use double underscores, for example `Telegram__BotToken`, `Telegram__WebAppUrl`, `Telegram__WebhookUrl`, `Telegram__WebhookSecret`, and `Telegram__AdminUserIds__0`.

Never put bot tokens, payment-provider tokens, or webhook secrets in Angular source, `environment*.ts`, committed `appsettings*.json`, screenshots, or public chat. Rotate a credential immediately if it was exposed.

### 3. Point the frontend to your API

- Local development: set `apiUrl` in [src/environments/environment.ts](src/environments/environment.ts) to the local API origin.
- Production: set `apiUrl` in [src/environments/environment.prod.ts](src/environments/environment.prod.ts) to the stable HTTPS API origin, then build and deploy the frontend.
- For Telegram testing, the frontend and webhook must use the current public HTTPS tunnel/domain. Cloudflare Quick Tunnels generate temporary hostnames; use a named tunnel or stable hosting outside short tests.

### 4. Telegram authentication model

The Mini App sends the raw `Telegram.WebApp.initData` string in the `X-Telegram-Init-Data` HTTP header. The API validates Telegram's HMAC signature and `auth_date` using the bot token, then derives the user ID from the verified payload.

Do not authorize a request using `initDataUnsafe`, a client-supplied Telegram ID, username, or role: these do not prove identity. Keep authorization decisions on the API. Admin endpoints require valid `initData` and a user ID listed in `Telegram:AdminUserIds`.

Organizer submissions stay unpublished until an administrator reviews them in `/admin/event-review`. When the bot token and admin allowlist are configured, new submissions also trigger a Telegram notification. The browser-accessible demo submission endpoint is still anonymous and only has a basic request-rate cap; add captcha/anti-spam controls or restrict it before inviting unrestricted public submissions.

### Starter-specific pieces to replace

- `Tusa2026EventSeeder` and TUSA-specific event IDs, prices, and copy;
- TUSA event UI and brand assets;
- organizer/admin policies and the current physical-ticket payment configuration.

Payment providers depend on merchant, product, region, and contract. Do not enable live payments by copying a token alone: first confirm provider availability and permitted use, configure server-side secrets, and test invoice, success, failure, cancellation, refund, and webhook delivery.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
