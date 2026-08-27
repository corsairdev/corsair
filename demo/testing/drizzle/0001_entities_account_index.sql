CREATE INDEX `corsair_accounts_tenant_integration_idx` ON `corsair_accounts` (`tenant_id`,`integration_id`);--> statement-breakpoint
CREATE INDEX `corsair_entities_account_type_entity_idx` ON `corsair_entities` (`account_id`,`entity_type`,`entity_id`);
