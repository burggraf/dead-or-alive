# Dead or Alive

## Background

We love to watch reruns of the 1970's / 80's TV show "The Love Boat".  Our favorite part of the show is the opening segment, where they display a short video of all the guest stars for that epsisode.  The game here is to figure out:

1.  Which stars you recocognize?
2.  What they're famous for (what TV Shows or Movies were they in)?
3.  Is that person dead or alive?

So therein lies the game.  Pretty simple -- try to determine who's alive, and who's dead.

The game give you 15 points for a right answer, 0 points for a wrong answer, and you can "cheat" by getting a little extra information, but it'll cost you some points.  Fun!

## Why Bother Writing This?

This project was written over 3 days as part of a [Supabase Hackathon](https://supabase.io).  Supabase is and Open Source application hosting tool that's taking over the world, one app at a time.  This is just one of those apps, like an army of ants soon to take over your picnic.  Little known fact:  did you know ants make up as much biomass on earth as humans?  They may be small, but there's so many of them that if they got organized, they could wipe us all out.  Be nice to the ants.

## Technical Features

Here's what this little program can do:

- Securely authenticates users using 11 different authentication options:
    - Email signup with password (inluding a secure password reset option)
    - Password-less login using a secure email link (Magic Link)
    - Google OAuth
    - Facebook OAuth
    - Github OAuth
    - Twitter OAuth
    - Bitbucket OAuth
    - Gitlab OAuth
    - Apple OAuth
    - Discord OAuth
    - Twitch OAuth
- Randomly select Famous People from a database of over 1,000, stored in a PostgreSQL database.  (This was originally over 500,000, but getting the data down to a reasonable set of recognizable famous names is incredibly difficult.  It still needs a lot of work.)
- Saves your data back to PostgreSQL, and gives you running stats about your game performance.
- Runs as a PWA (Progressive Web App) on mobile and desktop systems.
- Can be compiled as a native app for IOS and Android using the existing code base.
- UI automatically respects the light or dark mode setting of your desktop or mobile device operating system.
- Compiles basic analytics of the user environment: operating system and version, browser type, user agent, IP address, etc.

### Authentication

How long did it take to get 11 authentication options up and running?  About 2 hours, total.  An hour to set it all up in the app, and another hour or so to create all the OAuth keys for each individual provider.  I already had developer accounts set up at all the providers, otherwise it may have taken another hour.

Supabase really shines for doing user auth.  Real easy to set up, very straightforward to use, real fun to work with.

### Data and the Database

This project took 2 days to program and 1 full day to collect the data and get it "right".  Two of the most difficult parts of gathering the data were the pictures and notes/biographies for the famous people.

#### Pictures

To get pictures, we go out to the Wikipedia API, grab some JSON, and store that JSON in our database.  The app then uses that stored data to show you the photo.  Normally, this means writing a server app in something like Node JS and running it and debugging it, having this server app talk to the database, etc.  

`PostgreSQL`, however, has super powers.  Using the `HTTP` extension, I wrote a `PostgreSQL Function` that went out to Wikipedia, grabbed what I needed, and put it into the `People` table.  All from inside `PostgreSQL`.  So a single SQL command can do all the work:

```
UPDATE PEOPLE SET photo_info = get_photo_info(name) where photo_info is null;
```

Preety cool stuff.  Plus, it's storing `JSON` data inside the `People` table, which is sent directly to the app (no translating things from text to `JSON`, then using `JSON.parse` and `JSON.stringify`).  Just store `JSON` in the database, get it out and use it in the app.  PostgreSQL is awesome.

#### Biographies / Notes

THe same process was used to get any missing (short) bios for people in the database.  Basically we pick up the first paragraph of the person's Wikipedia article.

```
UPDATE PEOPLE SET notes = get_bio_text(name) where notes is null;
```


