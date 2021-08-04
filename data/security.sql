--
-- Create these seucrity functions in public so our public functions can use them.
--

CREATE OR REPLACE FUNCTION public.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting('request.jwt.claim.email', true), '')::text;
$$;
ALTER FUNCTION public.email() OWNER TO postgres;
CREATE OR REPLACE FUNCTION public.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting('request.jwt.claim.role', true), '')::text;
$$;
ALTER FUNCTION public.role() OWNER TO postgres;
CREATE OR REPLACE FUNCTION public.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid;
$$;
ALTER FUNCTION public.uid() OWNER TO postgres;

-- Javascript PLV8 versions of the above functions.
CREATE OR REPLACE FUNCTION public.get_email() RETURNS text
    LANGUAGE plv8 STABLE
    AS $$
    return sql("select current_setting('request.jwt.claim.email', true)")[0].current_setting || '';
$$;
ALTER FUNCTION public.get_email() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.get_role() RETURNS text
    LANGUAGE plv8 STABLE
    AS $$
    return sql("select current_setting('request.jwt.claim.role', true)")[0].current_setting || '';
$$;
ALTER FUNCTION public.get_role() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.get_uid() RETURNS text
    LANGUAGE plv8 STABLE
    AS $$
    return sql("select current_setting('request.jwt.claim.sub', true)")[0].current_setting || '';
$$;
ALTER FUNCTION public.get_uid() OWNER TO postgres;

CREATE OR REPLACE FUNCTION public.get_current_user() RETURNS text
    LANGUAGE plv8 STABLE
    AS $$
    return sql('select CURRENT_USER')[0].current_user || '';
$$;
ALTER FUNCTION public.get_current_user() OWNER TO postgres;




