create or replace function get_photo_info(name text)
returns json as $$
    const http = require('http');
    const res = http.get(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=300`);
    if (res.status === 200) {
      const j = JSON.parse(res.content);
      if (j.query.pages) {
          for (const k in j.query.pages) {
              if (j.query.pages[k].thumbnail) {
                  return j.query.pages[k].thumbnail;
              }
          }
      }
      return null;
    } else {
      return null;
    }
$$ language plv8;
