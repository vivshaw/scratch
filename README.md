# Scratch

Scratch is my submission for Osmind's programming assessment, based on the app from the [Serverless Stack Guide](http://serverless-stack.com).

A [live production instance](https://vivshaw-scratch-prod.netlify.app/) is available on Netlify.

## Getting Started

```
npm install
npm start
```

## Features

### 1: Searching Notes

We can now search notes on the Home screen. We simply take the search term as an input, then filter our loaded Notes for ones whose `content` field contains that search term.

### 2: Find & Replace

We can now find and replace notes on the Home screen. We display a Find & Replace panel, in which the user can enter their find and replace term. When the Find & Replace is executed, the app maps over the selected notes with `API.put` calls, turning them into an array of Promises. Then we can return a `Promise.all()` so we know when all replacements are done. After the `Promise.all()` resolves, we simply reload the notes from the API.

### 3: Loading States

I went with a keep-it-simple approach, using a modification of the existing `isLoading` hooks for the business logic, and a React Bootstrap spinner for the loading UI.

### 4: Potential areas of improvement

- State management could be better- would strongly consider a `useReducer` approach or Redux.
- The rest of the app could be reimplemented in Typescript, and better types provided
- Find & Replace could use an optimistic update approach instead of reloading all notes from the API.

## Testing and CI/CD

The app uses a modern React testing stack, including:

- `TypeScript` for static type analysis.
- `jest` and `React Testing Library` for unit and integration tests.
- `Mock Service Worker` to intercept AWS API calls- this we, we don't have to mock out Amplify in our tests! We simply use amplify as usual, then fake the desired API responses with MSW.
- `cypress` and `Cypress Testing Library` for e2e tests.

The app is deployed via a simple CI/CD pipeline built with `Github Actions`. There's a test phase, and two deployment phases (staging and production).

The app is deployed to Netlify, first to [the staging instance](https://vivshaw-scratch-staging.netlify.app/), then after review and merging to `master`, to [the production instance](https://vivshaw-scratch-prod.netlify.app/).
