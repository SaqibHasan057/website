# mohammadsaqibhasan.github.io

Personal academic homepage for Mohammad Saqib Hasan — Ph.D. candidate in Computer Science at
Stony Brook University.

## Structure

```
index.html                      the whole page
css/main.css                    design tokens + all styling (light & dark)
js/site.js                      mobile menu, theme toggle, scrollspy — no dependencies
img/dp.jpg                      profile photo
cv/Mohammad_Saqib_Hasan_CV.pdf  CV linked from the CV section
```

No build step. The only external dependency is Google Fonts (Newsreader + Inter).

## Local preview

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Updating content

- **Publications** — add a `<li class="pub">` inside the matching `<section class="pub-year">`
  in `index.html`, newest year first. Wrap your own name in `<strong>` in the author list.
- **CV** — replace `cv/Mohammad_Saqib_Hasan_CV.pdf` and update the "Last updated" date in the
  CV section.

## License

[MIT](LICENSE)
