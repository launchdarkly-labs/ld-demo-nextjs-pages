# LaunchDarkly Feature Flag Demo

This project demonstrates the integration of LaunchDarkly feature flags with a NextJS application. This demo is setup to A/B test the configuration of a email signup banner at 2 locations on the screen. It uses the react client SDK to pull feature flag information in.

## LaunchDarkly Setup

1. Environment Variables:
   - Create a `.env` file in the root directory with the following content:
     ```
     NEXT_PUBLIC_LD_CLIENT_KEY='your_client_side_sdk_key'
     LAUNCHDARKLY_SERVER_KEY='your_server_side_sdk_key'
     ```
   - Replace `your_client_side_sdk_key` and `your_server_side_sdk_key` with your actual LaunchDarkly SDK keys.

2. LaunchDarkly Provider:
   - The `LDProvider` component in `src/components/ldprovider.tsx` initializes the LaunchDarkly SDK.
   - It sets up a default user context and wraps the application to provide feature flag functionality.

3. Using Feature Flags:
   - In `src/pages/index.tsx`, feature flags are accessed using the `useFlags` hook from the LaunchDarkly React SDK.
   - Example usage:
     ```typescript
     const { storeColors, emailFormLocation } = useFlags();
     ```

4. Tracking Events:
   - The LaunchDarkly client is accessed using the `useLDClient` hook.
   - Custom events can be tracked, e.g., when an email is submitted:
     ```typescript
     await client?.track("emailSubmitted", { email });
     ```

5. User Identification:
   - When a user logs in, they are identified to LaunchDarkly using the `identify` method:
     ```typescript
     await client?.identify(newUser);
     ```

For more information on setting up and using LaunchDarkly, refer to the [LaunchDarkly documentation](https://docs.launchdarkly.com/).