#!/usr/bin/env python3
"""
NEUROS HEALTH — SUPABASE DATA LOADER
Uploads the processed JSON files to your Supabase database.

Setup:
  pip install supabase

Usage:
  Set your Supabase URL and key below, then run:
  python3 supabase_loader.py
"""

import json, os, time
from supabase import create_client

# ─── CONFIG — fill these in ────────────────────────────────────
SUPABASE_URL = os.getenv("SUPABASE_URL", "YOUR_SUPABASE_URL_HERE")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "YOUR_SERVICE_ROLE_KEY_HERE")
# Use SERVICE ROLE key (not anon key) — needed for bulk inserts
# Found in: Supabase dashboard > Settings > API > service_role (secret)
# ──────────────────────────────────────────────────────────────

BATCH_SIZE = 100  # Records per batch insert
DELAY = 0.3       # Seconds between batches (rate limiting)

def load_json(filename):
    with open(filename, encoding="utf-8") as f:
        return json.load(f)

def upsert_batch(client, table, records, key_col="slug"):
    """Insert records, update on conflict"""
    result = client.table(table).upsert(records, on_conflict=key_col).execute()
    return len(records)

def load_table(client, table, data, label):
    print(f"\n📤 Loading {label} ({len(data)} records)...")
    total = 0
    batches = [data[i:i+BATCH_SIZE] for i in range(0, len(data), BATCH_SIZE)]
    for i, batch in enumerate(batches):
        try:
            count = upsert_batch(client, table, batch)
            total += count
            print(f"   Batch {i+1}/{len(batches)} — {total}/{len(data)} ✓")
        except Exception as e:
            print(f"   ✗ Batch {i+1} failed: {e}")
            # Retry individual records
            for rec in batch:
                try:
                    upsert_batch(client, table, [rec])
                    total += 1
                except Exception as e2:
                    print(f"     Skipped {rec.get('slug', '?')} — {str(e2)[:60]}")
        time.sleep(DELAY)
    print(f"   ✓ {label} complete: {total}/{len(data)} loaded")
    return total

def main():
    print("🚀 Neuros Health Database Loader")
    print("=" * 50)

    if "YOUR_SUPABASE" in SUPABASE_URL:
        print("❌ Please set SUPABASE_URL and SUPABASE_SERVICE_KEY")
        print("   Either edit this file or set environment variables:")
        print("   export SUPABASE_URL=https://xxx.supabase.co")
        print("   export SUPABASE_SERVICE_KEY=eyJ...")
        return

    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print(f"✓ Connected to Supabase")

    # Load medicines
    if os.path.exists("neuros_medicines.json"):
        medicines = load_json("neuros_medicines.json")
        load_table(client, "medicines", medicines, "Medicines")
    else:
        print("⚠️  neuros_medicines.json not found — run build_neuros_db.py first")

    # Load conditions
    if os.path.exists("neuros_conditions.json"):
        conditions = load_json("neuros_conditions.json")
        load_table(client, "health_conditions", conditions, "Health Conditions")
    else:
        print("⚠️  neuros_conditions.json not found")

    # Load wellbeing
    if os.path.exists("neuros_wellbeing.json"):
        wellbeing = load_json("neuros_wellbeing.json")
        load_table(client, "wellbeing_topics", wellbeing, "Wellbeing Topics")
    else:
        print("⚠️  neuros_wellbeing.json not found")

    print("\n" + "=" * 50)
    print("✅ Database loading complete!")
    print()
    print("Verify in Supabase SQL Editor:")
    print("  select")
    print("    (select count(*) from medicines) as medicines,")
    print("    (select count(*) from health_conditions) as conditions,")
    print("    (select count(*) from wellbeing_topics) as wellbeing;")

if __name__ == "__main__":
    main()
