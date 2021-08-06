create or replace function get_bio_text(name text)
returns text as $$
    const http = require('http');
    const res = http.get(`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(name)}`);
    if (res.status === 200) {
      const j = JSON.parse(res.content);
      if (j.query.pages) {
          for (const k in j.query.pages) {
              if (j.query.pages[k].extract) {
                  const block = j.query.pages[k].extract;
                  return block.substr(0,(block+'\n').indexOf('\n')).trim();
              }
          }
      }
      return null;
    } else {
      return null;
    }
$$ language plv8;
