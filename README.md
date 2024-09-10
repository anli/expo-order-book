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

## Folder structure

The app is built with a modular architecture following [feature sliced design](https://feature-sliced.design/). The app is divided into the following:

- `__tests__`: Test files for routes. Contains sample test scenarios for `/sign-in` route

- `app`: App-wide matters, contains technical (providers) and business configurations (expo-router file based routing), error boundary, and layout configurations

- `entities\order-book`: Business uses on order book from external API

- `entities\session`: Business uses around authentication

- `shared/api`: Isolated (react query) hooks to interact with the external APIs (kucoin)

- `shared/lib`: Isolated utils functions

- `shared/testing`: Isolated testing related functions

We have skipped `pages`, `widgets` and `features` layers in this demo.

## Testing

We have added some tests to the `sign in` route .

Run `yarn test` to run the tests.

Test scenarios are created with `jest` and `@testing-library/react-native` described in gherkin syntax.

```gherkin
Background: Given I am at Sign In route

Scenario: page load
  Then I should see correct UI

Scenario: validation
  When I press Sign In
  Then I should see validation errors

Scenario: authentication
  When I update form with correct input
  And I press Sign In
  Then I should be authenticated

Scenario: authentication fail
  When I update form with incorrect pin
  And I press Sign In
  Then I should see error message
```

## Notable Third-Party Libraries

- `expo`: Framework for building React Native apps. Introduces a higher-level abstraction for configuring native app properties through the app.json file.

- `expo-router`: Routing and navigation. Simplifies the implementation of navigation in Expo-based React Native apps, offering a file-system based routing for more maintainable navigation structures.

- `@tanstack/react-query`: API state management. Provides a robust solution for fetching, caching, and updating asynchronous data in React applications, improving performance with caching.

- `react-hook-form`: Form state management. Offers a performant, flexible, and reduces the complexity of form management.

- `yup`: Schema validation. Enables declarative and composable object schema validation.

- `bignumber.js`: Precise numerical calculations. Addresses limitations in handling large numbers and floating-point arithmetic, ensuring accurate calculations.

- `react-native-paper`: UI component library. Provides a comprehensive set of customizable, pre-built UI components following Material Design guidelines

- `react-use-websocket`: WebSocket support. Simplifies the initialization of WebSockets, reconnecting, pinging, and sending messages.

- `tiny-invariant`: Invariant checking. Enhances code reliability by providing runtime checks for impossible states.

- `twrnc`: Tailwind CSS support for React Native. Enables the use of Tailwind CSS utility classes in React Native projects with optimized performance.
