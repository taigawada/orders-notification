import "dotenv/config";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import { GraphQLClient } from "graphql-request";
import type { Sdk as adminSdk } from "./dist/sdk_admin";
import { getSdk as getAdminSdk } from "./dist/sdk_admin";
export type { Sdk as adminSdk } from "./dist/sdk_admin";

export class Graphql {
  admin: adminSdk;
  constructor(apiVersion: string = LATEST_API_VERSION) {
    const accessToken = process.env.ADMIN_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("Invalid access token");
    }
    const shop = "chocolatlumiere.myshopify.com";
    this.admin = getAdminSdk(
      new GraphQLClient(
        `https://${shop}/admin/api/${apiVersion}/graphql.json`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken,
          },
        },
      ),
    );
  }
}
