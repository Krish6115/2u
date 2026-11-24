# 2u

A birthday page for a friend. You fill a form once and get a link. The link opens a 10 step surprise:
letter, claw game, story book, wish jar, photo booth, places, date, song, candles and a final wish.

No build step, no backend. All the text and photos you enter are packed into the link itself.

## Run locally

    python -m http.server 8000

Then open http://localhost:8000. The song needs http or https, so opening index.html straight
from the folder will not play it.

## Host

Push to GitHub and turn on Pages for the main branch. Create the link from the hosted page so it
points to the hosted address.

## Song

Either paste a YouTube link, or drop an mp3 next to index.html and type its name in the form.
Some YouTube videos do not allow embedding, an mp3 always works.

Try it without filling the form: index.html#demo
