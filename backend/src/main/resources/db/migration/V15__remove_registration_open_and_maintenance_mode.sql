-- Flyway Migration V15: Remove deprecated REGISTRATION_OPEN and MAINTENANCE_MODE configs
DELETE FROM system_configs 
WHERE config_key IN ('REGISTRATION_OPEN', 'MAINTENANCE_MODE');
