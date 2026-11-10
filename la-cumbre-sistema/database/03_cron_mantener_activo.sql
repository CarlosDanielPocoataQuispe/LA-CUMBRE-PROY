-- YA APLICADO en tu proyecto de Supabase. Se deja aquí solo como respaldo/documentación.
-- Cada 6 días a las 00:00 hora de La Paz (04:00 UTC) hace una consulta simple a la base.
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('mantener-activo-la-cumbre', '0 4 */6 * *', $$ SELECT count(*) FROM public.roles $$);
