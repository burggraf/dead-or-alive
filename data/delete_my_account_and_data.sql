create or replace function public.delete_my_account_and_data()
   returns text
   language plpgsql
   security definer
  as
$$
declare 
retval record;
begin
  if uid() is NULL then
    return 'failed: not logged in';
  else
    delete from device_log where userid = uid();
    delete from game_data where user_id = uid();
    delete from auth.users where id = uid();
    return 'success';
  end if;
end;
$$
