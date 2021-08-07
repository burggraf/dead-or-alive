create or replace function public.get_streak(min_score integer)
   returns integer
   language plpgsql
  as
$$
declare 
retval record;
begin

    select count(*) as streak from 
    (
        select score from game_data where user_id = uid()
        and created_at >
        (
            select created_at from game_data where 
            user_id = uid()
            and score < min_score
            order by created_at desc limit 1
        ) 
        order by created_at desc
    ) as streak into retval;

    return (retval.streak::integer);  
end;
$$
