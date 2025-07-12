# 🏞️ Ph-tour-management-backend

Backend API for the Ph Tour Management System. It manages authentication, user roles, tour packages, bookings, and admin functionalities using Node.js, Express, and MongoDB.

---

## 🚀 Installation

Install all required dependencies:

```bash
npm init -y
```

```bash
npm install -D typescript
```

```bash
tsc --init
```

## dependencies

```bash
npm install express mongoose zod jsonwebtoken cors dotenv
```

## devDependencies

```bash
npm install -D ts-node-dev @types/express @types/cors @types/dotenv @types/jsonwebtoken
```

## Run Script Add

```bash
 "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
```

## Eslint Install

```bash
 npm install --save-dev eslint @eslint/js typescript typescript-eslint
```

## Run Script Add

```bash
 npx eslint ./src
```

## eslint.config.mjs

```bash
// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
//   tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules:{
        "no-console":"warn"
    }
  }
);
```

## Http status code add

```bash
 npm install http-status-codes
```

## Password Hashing

```bash
npm i bcryptjs
```

```bash
npm i -D @types/bcryptjs
```

## cookie-parser

```bash
npm install cookie-parser
```

```bash
npm i -D @types/cookie-parser
```
