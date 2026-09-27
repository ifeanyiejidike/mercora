import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// eslint-config-next (v16) ships native flat-config arrays, so we import
// them directly rather than bridging the old .eslintrc-style
// "next/core-web-vitals" preset names through FlatCompat — the compat
// bridge hits a real config-schema incompatibility with this version.
const eslintConfig = [
  ...coreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
