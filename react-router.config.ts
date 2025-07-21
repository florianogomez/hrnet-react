/**
 * React Router configuration for the HRnet application.
 *
 * @remarks
 * Enables SSR (Server-Side Rendering) mode for React Router.
 * Redux Persist is not used, so there are no related limitations.
 *
 * @see {@link https://reactrouter.com/}
 *
 * @satisfies {Config}
 */
import type { Config } from "@react-router/dev/config";

export default {
  /**
   * Enable Server-Side Rendering (SSR) for React Router.
   */
  ssr: true,
} satisfies Config;
