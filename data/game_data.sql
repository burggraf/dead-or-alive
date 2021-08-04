CREATE TABLE game_data (
    id UUID DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id UUID REFERENCES auth.users NOT NULL,
    person_id UUID REFERENCES public.people NOT NULL,
    help_category INTEGER DEFAULT 0 NOT NULL,
    help_famous_as INTEGER DEFAULT 0 NOT NULL,
    help_birthdate INTEGER DEFAULT 0 NOT NULL,
    help_notes INTEGER DEFAULT 0 NOT NULL,
    help_photo INTEGER DEFAULT 0 NOT NULL,
    score INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.game_data OWNER TO supabase_admin;
ALTER TABLE ONLY public.game_data
    ADD CONSTRAINT game_data_pkey PRIMARY KEY (id);
GRANT ALL ON TABLE public.game_data TO postgres;
GRANT ALL ON TABLE public.game_data TO anon;
GRANT ALL ON TABLE public.game_data TO authenticated;
GRANT ALL ON TABLE public.game_data TO service_role;

ALTER TABLE public.game_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can view their own data" ON public.game_data FOR SELECT USING ((auth.uid() = user_id));
CREATE POLICY "users can create their own data" ON public.game_data FOR INSERT WITH CHECK ((auth.uid() = user_id));
