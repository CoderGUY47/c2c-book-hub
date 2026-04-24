// backend/config/validateEnv.ts

  /* eslint-disable no-console */

  export function validateBkashEnv(): void {
    const required = [
      "BKASH_USERNAME",
      "BKASH_PASSWORD",
      "BKASH_APP_KEY",
      "BKASH_APP_SECRET",
      "BKASH_CALLBACK_URL",
    ] as const;

    const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === "");
    if (missing.length) {
      const list = missing.join(", ");
      const example = [
        "BKASH_USERNAME=your_merchant_username",
        "BKASH_PASSWORD=your_merchant_password",
        "BKASH_APP_KEY=your_app_key",
        "BKASH_APP_SECRET=your_app_secret",
        "BKASH_IS_SANDBOX=true",
        "BKASH_CALLBACK_URL=http://localhost:8000/api/payments/bkash/callback",
      ].join("\n");
      throw new Error(
        `Missing bKash .env variables: ${list}\n` +
        `Please add them to backend/.env. Example:\n${example}`
      );
    }

    const callback = String(process.env.BKASH_CALLBACK_URL);
    if (!/^https?:\/\//i.test(callback)) {
      throw new Error(`BKASH_CALLBACK_URL must be an absolute URL (http/https). Got: ${callback}`);
    }

    // Optional: log info to confirm environment selection
    const isSandbox = String(process.env.BKASH_IS_SANDBOX ?? "true").toLowerCase() === "true";
    const baseURL =
      process.env.BKASH_BASE_URL ||
      (isSandbox ? "https://tokenized.sandbox.bka.sh" : "https://tokenized.pay.bka.sh");

    console.log(
      `[bKash] Environment: ${isSandbox ? "SANDBOX" : "PRODUCTION"} | Base URL: ${baseURL}`
    );
  }