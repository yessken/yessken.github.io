# Founder sprint: first paid organizer and first paid ticket

## Mission

Turn the app from a prototype into a small revenue engine for Astana event organizers.

The next milestone is not “complete app.” The next milestone is:
- 5 organizers onboarded
- 20 real events live
- 10 paid tickets sold
- 1 repeat organizer
- first revenue generated

## Success metric

We only continue if the product proves one simple truth:

“Events sell through this flow.”

## Work streams

### 1. Sales stream

Goal: secure the first 3–5 organizer pilots.

Activities:
- identify 20 organizers and promoters
- reach out manually
- offer a free launch listing or discounted pilot campaign
- collect event assets and audience links
- publish the first real events
- measure conversion and attendance interest

Output:
- 3 pilot organizers confirmed
- at least 5 events launched

### 2. Product stream

Goal: make the app sales-ready.

Implemented: event discovery/search, event details, organizer submissions, admin moderation queue and alerts, ticket capacity/order tracking, organizer sales view, Telegram ticket delivery, and basic conversion analytics.

Release blockers (do not describe these as complete):
1. The production API needs a stable HTTPS host; a Cloudflare Quick Tunnel is temporary and points at a developer machine.
2. Ticket sales stay disabled until Robokassa approves the merchant account, the Kazakhstan integration is implemented and verified, and a real test payment/refund cycle passes.
3. A real organizer and live event are needed to validate the end-to-end purchase and support flow.

Output:
- one real organizer submission is reviewed and published;
- after payment activation, a test buyer can pay, receive a ticket, and request support;
- the organizer can see the resulting order and sales status.

### 3. Measurement stream

Goal: prove conversion.

Track:
- event views
- detail page visits
- checkout starts
- successful payments
- tickets sold
- organizer repeat behavior

Output:
- a simple weekly revenue and conversion report

## Weekly plan

### Gate 1: get real supply
- finish merchant activation paperwork and choose a stable backend host;
- contact organizers and confirm one pilot event with permission to list it;
- submit, review, and publish it through the new moderation flow.

### Gate 2: prove payment safely
- implement the approved Kazakhstan provider flow after merchant activation;
- test success, cancellation, duplicate notifications, expiry, and refund handling;
- do not turn on live ticket sales until the test cycle and support process pass.

### Gate 3: prove demand
- invite the organizer's audience to the listing;
- track listing views, checkout starts, completed sales, and support requests;
- review actual net revenue and organizer feedback before adding paid promotion or subscriptions.

## Founder rules

- no broad UI polish before the first sale
- no premium user plan before organizer revenue
- no extra features without a sales use case
- no claiming success without conversion data

## Minimum evidence required before expansion

We continue scaling only if we have:
- real organizer demand
- real event sales
- measurable checkout conversion
- repeat organizer willingness to pay

## Immediate next actions

1. Complete Robokassa merchant activation and obtain the official Kazakhstan integration requirements.
2. Choose and configure a stable HTTPS backend host; replace the temporary tunnel in both the API webhook and frontend configuration.
3. Contact the first 10 organizers and secure one real pilot event.
4. Run the pilot through submission, moderation, publication, and audience sharing.
5. Enable checkout only after provider test payments, duplicate-callback protection, cancellation, and refund procedures are verified.
6. Measure the funnel every 48 hours and report gross and net revenue separately.

This sprint is designed to produce the first real business signal: a paying organizer and a sold ticket.
