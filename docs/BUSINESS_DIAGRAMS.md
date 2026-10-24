# TUSA Astana — Business Diagrams

## Business plans

- [Бизнес-план на русском языке](TUSA_BUSINESS_PLAN_RU.md)
- [Қазақ тіліндегі бизнес-жоспар](TUSA_BUSINESS_PLAN_KZ.md)

## Diagrams by language

- English: [business model image](../presentation-screenshots/tusa-business-model.svg)
- Русский: [схема бизнес-модели](../presentation-screenshots/tusa-business-model-ru.svg)
- Қазақша: [бизнес-модель сызбасы](../presentation-screenshots/tusa-business-model-kz.svg)

## Image version

![TUSA Astana business model diagram](../presentation-screenshots/tusa-business-model.svg)

Use the SVG directly in presentation software or export it to PNG at the required slide size.

## 1) Platform value loop

```mermaid
flowchart LR
    A[Visitor] --> B[Discover event]
    B --> C[Choose by mood / budget / location]
    C --> D[Buy ticket]
    D --> E[Go to event]
    E --> F[Share photos / review]
    F --> G[More users join]
    G --> H[Event organizers publish more events]
    H --> B

    I[Organizer] --> J[Submit event]
    J --> K[Moderation & approval]
    K --> L[Ticket sales & exposure]
    L --> M[Revenue + community growth]
    M --> I
```

## 2) Core business model

```mermaid
flowchart TB
    U[Users] --> A[Find events]
    U --> B[Buy tickets]
    U --> C[Join communities]

    O[Organizers] --> D[Create event listings]
    D --> E[Moderation / verification]
    E --> F[Promotion in app]
    F --> G[Ticket sales]
    G --> H[Commission / service fee]
    H --> P[Platform revenue]

    P --> R[Marketing / acquisition]
    P --> S[Platform operations]
    P --> T[Product development]

    C --> V[Engagement and retention]
    V --> P
```

## 3) Event lifecycle

```mermaid
sequenceDiagram
    participant Org as Organizer
    participant App as TUSA App
    participant Admin as Moderator
    participant User as Visitor
    participant Pay as Payment

    Org->>App: Submit event form
    App->>Admin: Review request
    Admin-->>App: Approve / reject
    App-->>Org: Confirmation + status
    App->>User: Show event in catalog
    User->>App: Open event / buy ticket
    App->>Pay: Start payment flow
    Pay-->>User: Payment confirmation
    App-->>User: Ticket + QR / access info
    User->>App: Check in / join event
```

## 4) Growth and retention funnel

```mermaid
flowchart TD
    A[Awareness: social / Telegram / city channels] --> B[Discovery: event catalog]
    B --> C[Engagement: save / share / RSVP]
    C --> D[Checkout: buy ticket]
    D --> E[Activation: event attendance]
    E --> F[Retention: return visits]
    F --> G[Advocacy: share with friends]
    G --> H[Organizer growth: new events]
    H --> B

    subgraph Monetization
      D --> M1[Commission on ticket sales]
      H --> M2[Organizer subscriptions]
      H --> M3[Promoted placements]
      M1 --> M4[Platform revenue]
      M2 --> M4
      M3 --> M4
    end
```

## 5) Business opportunity summary

```mermaid
mindmap
  root((TUSA Astana))
    Demand
      Event discovery
      Local nightlife
      Community-based trust
    Supply
      Organizers
      Venues
      Community groups
    Monetization
      Ticket fee
      Organizer plan
      Sponsored placements
    Differentiation
      Telegram-native UX
      Local city focus
      Trust and curation
    Growth
      Events data
      Retention loops
      Referral network
```

## Presentation narrative

- TUSA solves a local discovery problem: people do not know what is happening in Astana this evening.
- It creates a strong organizer funnel: submit event -> moderate -> publish -> sell tickets -> collect revenue.
- Each sold ticket improves engagement, creates social proof, and brings more organizers and visitors into the ecosystem.
- The most scalable revenue model is a combination of ticket commissions, organizer subscriptions, and sponsored placements.
- The product is especially attractive because it is integrated into Telegram and built around local events, which lowers the friction of both discovery and payment.
