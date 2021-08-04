CREATE TABLE public.people (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text,
    category text,
    famous_as text,
    birthdate text,
    birthplace text,
    died text,
    notes text,
    photo_info jsonb,
    alt_name text
);
ALTER TABLE public.people OWNER TO supabase_admin;
ALTER TABLE ONLY public.people
    ADD CONSTRAINT people_pkey PRIMARY KEY (id);
GRANT ALL ON TABLE public.people TO postgres;
GRANT ALL ON TABLE public.people TO anon;
GRANT ALL ON TABLE public.people TO authenticated;
GRANT ALL ON TABLE public.people TO service_role;

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public can view people" ON public.people FOR SELECT USING (true);

