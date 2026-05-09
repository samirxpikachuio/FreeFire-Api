
# FreeFire API

<p align="center"> <img src="https://img.shields.io/badge/Bun-powered-black?logo=bun" /> <img src="https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript" /> <img src="https://img.shields.io/badge/Elysia-framework-purple" /> <img src="https://img.shields.io/badge/License-MIT-green" /> <img src="https://img.shields.io/badge/Status-Active-success" /> </p> <p align="center"> <b>High-performance Free Fire SDK + Proxy API built for speed, scale, and clean integration.</b> </p>

---

## Overview



A **TypeScript-based Free Fire API SDK + Proxy Server** built with **Bun + Elysia**, designed for high-performance server-side integration, automation, and data proxying.

---

## Architecture Overview

This project provides two core layers:

* **SDK Layer (Library Mode)**
  Type-safe service wrappers for Free Fire endpoints (Auth, Player, etc.)

* **Proxy Layer (Server Mode)**
  Lightweight HTTP gateway exposing REST endpoints for external usage

Built with:

* ⚡ Bun runtime (high-performance execution)
* 🧩 Elysia framework (fast HTTP routing)
* 🟦 TypeScript (strict typing)
* 🔐 Session-based authentication flow

---

## Features

* **Dual Mode Operation**

  * Use as an npm/jsr SDK
  * Or run as a standalone REST proxy server

* **Service-Oriented SDK**

  * `AuthService` for session/token generation
  * `PlayerService` for player lookup and stats
  * Extensible service layer design

* **High Performance Proxy**

  * Minimal overhead API gateway
  * Stateless request handling
  * Session caching support (optional)

* **Configurable Runtime**

  * Environment-driven configuration
  * Region-based authentication switching

* **Fully Typed**

  * Strict TypeScript definitions
  * Predictable response contracts

---

## Installation

### JSR (Recommended for Bun / Deno / modern runtimes)

```bash
bunx jsr add @samirxpikachu/free-fire
```

```bash
npx jsr add @samirxpikachu/free-fire
```

```bash
yarn dlx jsr add @samirxpikachu/free-fire
```

```bash
pnpm dlx jsr add @samirxpikachu/free-fire
```

```bash
deno add jsr:@samirxpikachu/free-fire
```

---

### NPM

```bash
npm install @samir.oe70/freefire-api
```

---

## SDK Usage (Library Mode)

### Authentication Flow

```ts
import { AuthService, PlayerService } from "@samirxpikachu/free-fire";

const session = await AuthService.loginForRegion("BD");
```

### Player Search

```ts
const result = await PlayerService.searchPlayers(
  session.serverUrl,
  session.token,
  "PlayerName"
);

console.log(result);
```

### Player Profile

```ts
const profile = await PlayerService.getProfile(
  session.serverUrl,
  session.token,
  "UID"
);
```

---

## Proxy Server Usage

### Start via CLI

```bash
freefire-api
```

---

### Start via Node Scripts

```bash
npm run start
```

---

## Environment Configuration

| Variable          | Description                     | Default |
| ----------------- | ------------------------------- | ------- |
| `PORT`            | HTTP server port                | `5000`  |
| `RELEASE_VERSION` | Game version identifier         | `OB53`  |
| `DEBUG`           | Enable debug logs               | `false` |
| `GARENA_AUTH_URL` | Custom auth endpoint override   | auto    |
| `LOGIN_BP_URL`    | Login gateway endpoint override | auto    |

---

## REST API Reference

### Player Endpoints

#### Search Player

```
GET /api/player/search?keyword={name}
```

#### Player Stats

```
GET /api/player/stats?uid={uid}
```

#### Player Profile

```
GET /api/player/profile?uid={uid}
```

---

## Internal Design

### Core Modules

* `AuthService`

  * Handles region-based login
  * Generates session tokens
  * Resolves server routing

* `PlayerService`

  * Player search indexing
  * UID-based profile fetch
  * Stats aggregation

* `Proxy Layer`

  * Stateless request forwarding
  * Session injection middleware
  * Error normalization layer

---

## Performance Notes

* Built on **Bun runtime** for low-latency execution
* Minimal serialization overhead
* No persistent DB dependency
* Optimized for concurrent requests

---

