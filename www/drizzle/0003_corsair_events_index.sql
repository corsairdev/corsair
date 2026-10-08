CREATE INDEX IF NOT EXISTS "corsair_events_account_type_created_idx" ON "corsair_events" USING btree ("account_id","event_type","created_at");
