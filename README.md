# Project : asgmt6_gardening_tips_and_advice_api

## Live link server

https://asgmt6-gardening-tips-and-advice-api.vercel.app

## Github link server

https://github.com/aburaihan8715/asgmt6_gardening_tips_and_advice_api

## Admin

- email: admin@gmail.com
- password: test1234

## User

- email: user@gmail.com
- password: test1234

## Technologies used:

1. Typescript
2. Node js
3. Express js
4. Mongodb

## Packages used:

1. cors
2. mongoose
3. zod
4. jwt
5. eslint
6. stripe

## API Endpoints

## Auth:

- /api/v1/auth/login(POST)
- /api/v1/auth/register(POST)
- /api/v1/auth/change-password(PATCH)
- /api/v1/auth/refresh-token(POST)
- /api/v1/auth/forget-password(POST)
- /api/v1/auth/reset-password(PATCH)
- /api/v1/auth/settings-profile(PATCH)

## User:

- /api/v1/users/top-5-users(GET)
- /api/v1/users(GET)
- /api/v1/users/admins(GET)
- /api/v1/users/me(GET)
- /api/v1/users/:id/follow(PATCH)
- /api/v1/users/:id/unfollow(PATCH)
- /api/v1/users/:postId/add-favourites(PATCH)
- /api/v1/users/:postId/:postId/remove-favourites(PATCH)
- /api/v1/users/:postId/check-premium-status(GET)
- /api/v1/users/:postId/favourite-posts(GET)
- /api/v1/users/:postId/user-stats(GET)
- /api/v1/users/:postId/:id(GET)
- /api/v1/users/:postId/:id(DELETE)
- /api/v1/users/:postId/revenue(GET)

## Category:

## Comment:

## Payment:

## Post:

## Scripts

```js
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "start": "node ./dist/server.js",
  "build": "tsc",
  "lint": "npx eslint src --ignore-pattern .ts",
  "lint:fix": "npx eslint src --fix",
  "prettier": "prettier --ignore-path .gitignore --write \"./src/**/*.+(js|ts|json)\"",
  "prettier:fix": "npx prettier --write \"src/**/*.+(js|ts|json)\""
```

<p>======end=======</p>
