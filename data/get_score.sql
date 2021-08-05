create or replace function public.get_score()
   returns jsonb
   language plpgsql
  as
$$
declare 
retval record;
begin
    select sum(score) as total_score, 
    count(*) as turns,
    abs(sum(help_category)) as times_used_category,
    abs(sum(help_famous_as))/ 2 as times_used_famous_as,
    abs(sum(help_birthdate)) / 3 as times_used_birthdate,
    abs(sum(help_birthplace)) as times_used_birthplace,
    abs(sum(help_notes)) / 4 as times_used_notes,
    abs(sum(help_photo)) / 2 as times_used_photo
    from game_data where game_data.user_id = uid() into retval;

    return to_jsonb(retval);  
end;
$$
