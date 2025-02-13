import { LATEST_API_VERSION } from "@shopify/shopify-api";
import type { CodegenConfig } from "@graphql-codegen/cli";

const config = {
  overwrite: true,
  emitLegacyCommonJSImports: false,
};

const plugins = [
  "fragment-matcher",
  "typescript",
  "typescript-operations",
  "typescript-graphql-request",
  {
    add: {
      content: "/* eslint-disable */\n// @ts-nocheck",
    },
  },
];

const adminConfig: CodegenConfig = {
  ...config,
  schema: `https://shopify.dev/admin-graphql-direct-proxy/${LATEST_API_VERSION}`,
  documents: "graphql-codegen/admin/*.graphql",
  generates: {
    "graphql-codegen/dist/sdk_admin.ts": {
      plugins: [...plugins],
    },
  },
};

export default adminConfig;
