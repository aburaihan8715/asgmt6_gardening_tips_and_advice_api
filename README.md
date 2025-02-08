# Project : asgmt6_gardening_tips_and_advice_api

## Live link server:

https://asgmt6-gardening-tips-and-advice-api.vercel.app

## Github link server:

https://github.com/aburaihan8715/asgmt6_gardening_tips_and_advice_api

## Live link client:

https://asgmt6-gardening-tips-and-advice-client.vercel.app

## Github link client:

https://github.com/aburaihan8715/asgmt6_gardening_tips_and_advice_client

## Overview video link:

https://drive.google.com/file/d/15O-LW3DjDBaJ2u9oGfeR-CHuxuB-nMmR/view?usp=sharing

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
- /api/v1/users/me(GET)
- /api/v1/users/:id/follow(PATCH)
- /api/v1/users/:id/unfollow(PATCH)
- /api/v1/users/:postId/add-favourites(PATCH)
- /api/v1/users/:postId/:postId/remove-favourites(PATCH)
- /api/v1/users/check-has-upvote-for-post(GET)
- /api/v1/users/:postId/favourite-posts(GET)
- /api/v1/users/:postId/user-stats(GET)
- /api/v1/users/:postId/:id(GET)
- /api/v1/users/:postId/:id(DELETE)
- /api/v1/users/:postId/revenue(GET)

## Category:

- /api/v1/categories(POST)
- /api/v1/categories(GET)
- /api/v1/categories/:id(GET)
- /api/v1/categories/:id(PATCH)
- /api/v1/categories/:id(DELETE)

## Comment:

- /api/v1/comments(POST)
- /api/v1/comments(GET)
- /api/v1/comments/:id(GET)
- /api/v1/comments/:id(PATCH)
- /api/v1/comments/:id(DELETE)

## Post:

- /api/v1/posts(POST)
- /api/v1/posts(GET)
- /api/v1/posts/top-5-posts(GET)
- /api/v1/posts/my-posts(GET)
- /api/v1/posts/:id(GET)
- /api/v1/posts/post-stats(GET)
- /api/v1/posts/:id(PATCH)
- /api/v1/posts/:id/make-premium(PATCH)
- /api/v1/posts/:id/upvote(PATCH)
- /api/v1/posts/:id/upvote-remove(PATCH)
- /api/v1/posts/:id/downvote(PATCH)
- /api/v1/posts/:id/downvote-remove(PATCH)
- /api/v1/posts/:id(DELETE)

- /api/v1/posts/:id/comments(POST)
- /api/v1/posts/:id/comments(GET)

## Payment:

- /api/v1/payments/create-payment(POST)
- /api/v1/payments(GET)
- /api/v1/payments/payment-stats(GET)
- /api/v1/payments/create-payment-intent(GET)

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
