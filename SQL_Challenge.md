# SQL Challenge: Streaks

After the 1.0.0 release of "Dead or Alive" I realized the game was missing a key feature:  streaks.

Total score and average score are nice and all, but without some frame of reference, those numbers are meaningless.  Is 10 a good score?  Or 100?  Or 100,000?  Who knows?  Who cares?

But if you told me you got 20 right answers in a row, I'd be instantly impressed.  That's quite a streak.  I decided to implement this as 2 different values, a `Major Streak`, which is "how many 15-point turns in a row (correct answers with no helps)" and a `Minor Streak`, which is simply "how many correct answers in a row".

## The Problem

This is pretty difficult SQL.  Not advanced by any means, but still something that requires a little work.  Let's start by looking at the `game_data` table.

### The Game Data (`game_data` table)

The game data looks something like this (with irrelevant columns redacted here):

| id                                   | user_id                              | score | created_at               |
| ------------------------------------ | ------------------------------------ | ----- | ------------------------ |
| 0f5f8ff9-7733-4269-a31d-f0d2993f3b89 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 15    | 2021-08-07T21:48:11.292Z |
| ae5f608d-9aef-4063-bf5d-aacbcea84e56 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 15    | 2021-08-07T21:48:05.539Z |
| 67aa6369-36b9-4e53-9684-1b50f5460f32 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 15    | 2021-08-07T21:47:42.731Z |
| f5804193-9405-4c8b-8667-c23b3b7d5382 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 12    | 2021-08-07T21:47:31.752Z |
| 99a65ac5-9db5-4f1c-856f-d374434611e6 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 10    | 2021-08-07T21:47:17.694Z |
| 98fbba8b-fb00-4330-bdb2-d460d6fd9d67 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 15    | 2021-08-07T21:47:12.214Z |
| 34406c67-15f9-43a6-8f9d-7b682363a2b1 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 0     | 2021-08-07T21:46:10.307Z |
| f302fadb-0640-4c40-9693-b53b130e3639 | d4b52297-ab00-45e5-a79b-109e9f69feb4 | 15    | 2021-08-07T21:44:38.484Z |

Here you see I have a `Major Streak` of 3 and a `Minor Streak` of 6 going.  One wrong answer and I'm back to 0 and 0!

How do I write a SQL function to calculate the major and minor streaks?

## The Solution

I'll start by showing you the final function I used, then we'll break it down.

```sql
create or replace function public.get_streak(min_score integer)
   returns integer
   language PLPGSQL
  as
$$
declare 
retval record;
begin

    select count(*) as streak from 
    (
        select score from game_data where user_id = auth.uid()
        and created_at >
        (
            select created_at from game_data where 
            user_id = auth.uid()
            and score < min_score
            order by created_at desc limit 1
        ) 
        order by created_at desc
    ) as streak into retval;

    return (retval.streak::integer);  

end;
$$
```

### Ignore the fact that this is a PostgreSQL function

If you don't know anything about `PostgreSQL functions` or the `PLPGSQL` lanaguage, don't worry.  Just skip the beginning and the end and look at the SQL code in between `begin` and `end`.  The only thing you really need to know is that we're passing a value called `min_score` to this function and using that value in the SQL query.

### Writing Difficult SQL INSIDE-OUT

When I approach difficult SQL problems like this, I solve it by breaking things down into smaller, easier problems, and solving those problems individually, then I just chain everything together.  The first step is to figure out exactly what it is you're looking for, and what pieces you're going to need to find it.

In plain English, what I'm saying here is this:

`Major Streak`:
> How many rows exist in this table for user X where the score = 15 since the last time the user's score was less than 15, where the scores are sorted in reverse chronological order.

`Minor Streak`:
> How many rows exist in this table for user X where the score > 0 since the last time the user's score was 0, where the scores are sorted in reverse chronological order.

Let's start by just doing the `Minor Streak`.

#### Problem 1:  Find the timestamp (`created_at`) of the last FAIL (where score = 0)

This is pretty easy:

```sql
select created_at from game_data where 
user_id = uid()
and score = 0 /* later we just change this to score < min_score so we can handle both types of streaks */
order by created_at desc limit 1
```

NOTE:  `auth.uid()` returns the id of the user who is currently logged in.  You can use this in any of your functions as well as `auth.email()` and `auth.role()`.

Ok, now that we know the timestamp of the last record where the user failed, we just need to count all the records AFTER that point in time.

#### Problem 2:  List all rows from `game_data` for user X since the last FAIL time

``` sql
select score from game_data where user_id = auth.uid()
and created_at >
    LAST_FAIL_TIME
order by created_at desc
```

But hey -- we already know the LAST_FAIL_TIME because we figured that out in step 1.  So we'll just throw some parenthesis around that and insert it as a sub-query:

```sql
select score from game_data where user_id = auth.uid()
and created_at >
(
    select created_at from game_data where 
    user_id = uid()
    and score = 0 /* later we just change this to score < min_score so we can handle both types of streaks */
    order by created_at desc limit 1
) 
order by created_at desc
```

#### Problem 3:  Count up the results and return the answer back to our app

Now it's getting easier.  We just wrap everything we've done so far in a set of parenthesis and do a simple `select count(*)`.

```sql
    select count(*) as streak from 
    (
        THAT_LIST_OF_RECORDS_WE_JUST_FOUND
    ) as streak into retval;
```

So now we have:

```sql
    select count(*) as streak from 
    (
        select score from game_data where user_id = auth.uid()
        and created_at >
        (
            select created_at from game_data where 
            user_id = auth.uid()
            and score = 0 /* later we just change this to score < min_score so we can handle both types of streaks */
            order by created_at desc limit 1
        ) 
        order by created_at desc
    ) as streak into retval;

    return (retval.streak::integer);  
```

NOTES:  

At the top of our function we declared a variable of type `record` to hold the result row:

```sql
declare 
retval record;
```

Since we have this variable (or bucket, per se) we can dump the `record` (row) we got into this `retval` bucket.  Now that our `retval` variable contains a row that's the result of our query, we can use `return (retval.streak::integer)` to return it to our app.  The `::integer` part just converts the column to an integer, because that's what we really want here -- an integer (or null is fine, too).

#### Problem 4:  Making it work for Major Streak or Minor Streak

If you've been reading the `/* comments */` in the SQL, you know we've been using `score = 0` to keep things simple so far, but now we can just go back and change it to `score < min_score`, and since `min_score` is passed to our function, we can now use this function to get `Major Streak` (where score = 15), and `Minor Streak` (where score > 0);

## Calling it from our app

We're going to call this twice, once to get `Major Streak` and once to get `Minor Streak`:

Major Streak:
```js
  const { data, error } = await supabase
  .rpc('get_streak', {"min_score": 15});
```

Minor Streak:
```js
  const { data, error } = await supabase
  .rpc('get_streak', {"min_score": 1});
```

Could this be made cleaner?  Sure.  Could it be more efficient?  You bet.  But now, at least, we have a working solution and you're a little bit farther on your SQL journey!
