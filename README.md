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
