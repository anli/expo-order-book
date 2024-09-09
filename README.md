# Orderbook

Orderbook is a mobile application that allows users to search for cryptocurrencies and see their order book.

## Development

### Prerequisites

- Node.js
- Expo CLI
- Git
- Watchman
- Flow
- Yarn
- React Native CLI
- Xcode
- Android Studio

### Installation

Run `yarn install --frozen-lockfile` to install the dependencies.

### Building the App

We skipped the authentication server for the demo and instead swap the `useLogin` with a API mock that returns a static token with the appropriate PIN validation rules.

Run `yarn ios` to build the app for iOS.

Run `yarn android` to build the app for Android.

### Running the Tests

Run `yarn test` to run the tests.
