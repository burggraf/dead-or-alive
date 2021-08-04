drop function get_random_person();
create or replace function public.get_random_person()
   returns jsonb
   language plpgsql
  as
$$
declare 
retval record;
begin
  select * from people 
  where id not in (select person_id from game_data where game_data.user_id = uid())
  and id >= extensions.uuid_generate_v4() order by id limit 1 into retval;
  return to_jsonb(retval);  
end;
$$
