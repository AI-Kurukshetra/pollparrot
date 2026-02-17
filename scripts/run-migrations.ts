/**
 * Database Migration Runner
 *
 * Runs all SQL migrations against Supabase using the REST API.
 * Uses NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 *
 * Usage: npx tsx scripts/run-migrations.ts
 */

import { config } from "dotenv";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

// Load environment variables from .env.local
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL
const PROJECT_REF = SUPABASE_URL?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

async function executeSql(sql: string): Promise<{ success: boolean; error?: string }> {
  // Try Management API first
  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: sql }),
      }
    );

    if (response.ok) {
      return { success: true };
    }

    // If Management API fails, try the direct SQL endpoint
    const errorText = await response.text();
    if (response.status === 401 || response.status === 403) {
      // Try alternative: Supabase Edge Function or pg_net extension
      return await executeSqlViaRpc(sql);
    }

    return { success: false, error: errorText };
  } catch (error) {
    return await executeSqlViaRpc(sql);
  }
}

async function executeSqlViaRpc(sql: string): Promise<{ success: boolean; error?: string }> {
  // Try using the PostgREST query endpoint (some Supabase instances have this)
  try {
    // Method 1: Try the /pg endpoint
    const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (pgResponse.ok) {
      return { success: true };
    }
  } catch {
    // Continue to next method
  }

  // Method 2: Try executing via SQL over HTTP (newer Supabase feature)
  try {
    const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.pgrst.plan",
        apikey: SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        Prefer: "params=single-object",
      },
      body: sql,
    });

    if (sqlResponse.ok) {
      return { success: true };
    }
  } catch {
    // Continue to next method
  }

  return {
    success: false,
    error: "All SQL execution methods failed. Manual execution required.",
  };
}

async function runMigrations() {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error("❌ Missing environment variables");
    console.error("   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  console.log(`🔌 Connecting to Supabase project: ${PROJECT_REF}`);
  console.log(`   URL: ${SUPABASE_URL}\n`);

  // Get migration files
  const migrationsDir = join(process.cwd(), "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`📁 Found ${files.length} migration files\n`);

  let successCount = 0;
  let failCount = 0;
  const failedMigrations: string[] = [];

  // Run each migration
  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, "utf8");

    process.stdout.write(`⏳ Running: ${file}... `);

    const result = await executeSql(sql);

    if (result.success) {
      console.log("✅");
      successCount++;
    } else {
      // Check if it's an "already exists" error
      if (
        result.error?.includes("already exists") ||
        result.error?.includes("42P07") ||
        result.error?.includes("42710")
      ) {
        console.log("⚠️  (already exists)");
        successCount++;
      } else {
        console.log("❌");
        if (result.error) {
          console.log(`   Error: ${result.error.substring(0, 200)}`);
        }
        failCount++;
        failedMigrations.push(file);
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  if (failCount > 0) {
    console.log(`❌ Failed: ${failCount}`);
    console.log("\nFailed migrations:");
    failedMigrations.forEach((f) => console.log(`   - ${f}`));
    console.log("\n📋 To run failed migrations manually:");
    console.log(`   1. Go to: ${SUPABASE_URL.replace(".supabase.co", ".supabase.co/project/default/sql")}`);
    console.log("   2. Copy and paste each failed migration SQL");
    process.exit(1);
  } else {
    console.log("\n🎉 All migrations completed successfully!");
  }
}

runMigrations();
