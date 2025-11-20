Whack-a-mole

Ett spel som är byggt med ES-moduler.

Kort:
- Brädet genereras i JavaScript (3×3 knappar).
- Mullvadar skapas/ tas bort dynamiskt av `Mole`-klassen i `modules/mole.js`.
- Spel-logiken finns i `modules/game.js` och startas från `src/main.js`.

Så spelar du:
- Klicka `Starta` för att börja.
- Klicka på mullvadar för poäng.
- Klicka fel = miss.
- Klicka `Återställ` för att nollställa spelet.
- Du kan också tabba till en cell och använda `Enter` eller `Space` för att träffa.
- Mullvadar kommer att försvinna snabbare desto mer tid som har gått.

Filer:
- `index.html` — Huvudsida.
- `style.css` — Layout och fokus-stil.
- `src/main.js` — DOM-anslutning.
- `modules/game.js` — Huvudspelet (spawn, timer, HUD, event-handling).
- `modules/mole.js` — `Mole`-Klass som lägger till/byter ut mullvads-nod i en cell.
