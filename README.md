# Web Romana Mudry

Statický web (čisté HTML/CSS/JS, žádný build krok) — přesně ve stylu, ve kterém teď na GitHubu pracuješ. Stačí nahrát celou složku tak, jak je.

## Struktura souborů

```
index.html                 → rozcestník (hlavní stránka)
tvorba-webu.html            → podstránka „Tvorba webových stránek"
elektrikarske-prace.html    → podstránka „Elektrikářské práce"
css/style.css                → veškerý vzhled, sdílený všemi stránkami
js/main.js                   → mobilní menu, animace při scrollu, odeslání formuláře
```

Díky sdílenému CSS/JS stačí barvu, font nebo styl tlačítka změnit **na jednom místě** (`css/style.css`) a projeví se to na všech třech stránkách.

## Co ještě musíš doplnit, než web zveřejníš

Hledej v souborech tato místa:

1. **E-mail a telefon** — teď je všude jako ukázka `info@romanmudra.cz` a `+420 000 000 000` (v patičce všech stránek i v `js/main.js` v proměnné `CONTACT_EMAIL`). Nahraď svým skutečným kontaktem.
2. **Logo** — zmínil jsi, že už máš vlastní logo a brand. Teď na jeho místě je jednoduché textové „Roman **Mudra**" + jednoduchá značka blesku. Pošli mi soubor s logem (ideálně `.svg`, případně `.png` s průhledným pozadím) a rád ho do hlavičky i patičky doplním.
3. **Sociální sítě** — ikony GitHub/LinkedIn/Instagram v patičce zatím vedou nikam (`href="#"`). Doplň odkazy, nebo mi napiš, které sítě používáš.
4. **Ceny** — záměrně jsem nikam nevymýšlel konkrétní částky (u webů jsou jen balíčky podle rozsahu, u elektriky žádný ceník) — cena se u obou řemesel odvíjí od konkrétní zakázky a to je jen na tobě. Pokud chceš uvádět orientační ceny nebo hodinovou sazbu, klidně mi řekni a doplním to.
5. **Elektrikářská kvalifikace** — sekci o mně jsem záměrně nechal obecnou a nabídku služeb bez „revizí", protože revize elektrických zařízení vyžadují samostatné oprávnění (jiné než běžná elektrikářská práce). Pokud revize děláš nebo máš konkrétní oprávnění/certifikace, které chceš uvádět, napiš mi je a doplním je přesně.

## Poptávkový formulář — jak teď funguje

Web zatím nemá hosting ani žádný backend, takže formulář po odeslání otevře uživateli **e-mailového klienta** s předvyplněnou zprávou (adresát, předmět i všechny vyplněné údaje) — stačí ji už jen poslat. Řeší to `js/main.js`.

Je to nejjednodušší řešení, které funguje úplně bez serveru, ale má to i mouchu: pokud uživatel nemá v prohlížeči/počítači nastavený žádný e-mailový program, nic se mu neotevře. Jakmile budeš mít vlastní hosting a doménu, doporučuju to nahradit službou jako [Formspree](https://formspree.io) nebo [EmailJS](https://www.emailjs.com/) (obě mají zdarma fungující tarif a odešlou ti e-mail rovnou ze statického webu bez nutnosti vlastního serveru) — rád ti s tím napojením pak pomůžu.

## Jak nahrát na GitHub Pages

1. Na GitHubu vytvoř (nebo použij stávající) repozitář, např. `romanmudra.github.io` — pokud repozitář pojmenuješ přesně `TVOJE-UZIVATELSKE-JMENO.github.io`, poběží web rovnou na této adrese.
2. Nahraj do repozitáře **celou tuto složku** — tedy `index.html`, `tvorba-webu.html`, `elektrikarske-prace.html` a **i podsložky `css/` a `js/`** (přes „Add file → Upload files" jde v prohlížeči nahrát více souborů i s podsložkami najednou).
3. V repozitáři jdi do **Settings → Pages**, jako zdroj vyber větev `main` a složku `/ (root)`.
4. Po chvíli se web objeví na `https://TVOJE-UZIVATELSKE-JMENO.github.io/NAZEV-REPOZITARE/` (případně přímo na `https://TVOJE-UZIVATELSKE-JMENO.github.io/`, pokud jsi zvolil ten speciální název repozitáře v bodě 1).

## Drobnosti, které stojí za zmínku

- Web je celý v tmavém režimu — bez přepínače na světlý vzhled, to je záměr.
- Barevné schéma vychází ze skutečného barevného značení vodičů (modrá / měděná) — modrá větev = weby, měděná větev = elektro, obě vycházejí ze stejného zdroje na úvodní stránce. Je to malá schválnost, která dává smysl jen tobě a lidem od řemesla :)
- Než web zveřejníš „naostro", zvaž přidání stránky se zásadami ochrany osobních údajů (GDPR) — formulář sbírá jméno, kontakt a popis zakázky, takže by měla u odkazu na patě webu časem přibýt. Ráda ji s tebou připravím, až budeš mít vyřešené ostatní věci výše.
