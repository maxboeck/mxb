---
title: Color Theme Switcher
tags: code, design
image: cover.jpg
demo: https://mxb.dev
---

<p class="lead">Last year, the design gods decided that dark modes where the new hotness. "Light colors are for suckers", they laughed, drinking matcha tea on their fixie bikes or whatever.</p>

And so every operating system, app and even some websites (mine included) suddenly had to come up with a dark mode. Fortunately though, this coincided nicely with widespread support for CSS [custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) and the introduction of a new `prefers-color-scheme` media query.

There's lots of tutorials on [how to build dark modes](https://css-tricks.com/dark-modes-with-css/) already, but why limit yourself to light and dark? Only a Sith deals in absolutes. 

That's why I decided to build a new feature on my site: 
__dynamic color themes!__ Yes, instead of two color schemes, I now have ten! That's eight better than the previous website! 

Go ahead and try it, hit that __paintroller-button__ in the header. 
I'll wait.

*If you're reading this somewhere else, the effect would look something like this:*

<div class="extend">
  <video poster="{{ 'theme-switcher-still.png' | media(page) }}" width="752" height="452" preload="metadata" style="border: 1px solid var(--color-border)" muted controls>
    <source src="{{ 'theme-switcher.webm' | media(page) }}" type="video/webm" />
    <source src="{{ 'theme-switcher.mp4' | media(page) }}" type="video/mp4" />
  </video>
</div>

Nice, right? Let's look at how to do that!

## Define Color Schemes

First up, we need some data. We need to define our themes in a central location, so they're easy to access and edit. My site uses [Eleventy](https://www.11ty.dev/), which lets me create a simple JSON file for that purpose:

```json
// themes.json
[
    {
        "id": "bowser",
        "name": "Bowser's Castle",
        "colors": {
            "primary": "#7f5af0",
            "secondary": "#2cb67d",
            "text": "#fffffe",
            "border": "#383a61",
            "background": "#16161a",
            "primaryOffset": "#e068fd",
            "textOffset": "#94a1b2",
            "backgroundOffset": "#29293e"
        }
    },
    {...}
]
```

Our color schemes are objects in an array, which is now available during build. Each theme gets a `name`, `id` and a couple of color definitions. The parts of a color scheme depend on your specific design; In my case, I assigned each theme eight properties. 

It's a good idea to give these properties logical names instead of visual onces like "light" or "muted", as colors vary from theme to theme. I've also found it helpful to define a couple of "offset" colors - these are used to adjust i.e. the primary color on interactions like hover and such. 

In addition to the "default" and "dark" themes I already had before, I created eight more themes this way. I used a couple of different sources for inspiration; the ones I liked best are [Adobe Color](https://color.adobe.com/explore) and [happyhues](https://www.happyhues.co/).

*(All my themes are named after Mario Kart 64 race tracks by the way, because why not.)*

## Transform to Custom CSS Properties

To actually use our colors in CSS, we need them in a different format. Let's create a stylesheet and make custom properties out of them. Using Eleventy's template rendering, we can do that by generating a `theme.css` file from the data, looping over all themes. We'll use a macro to output the color definitions for each.

I wrote this in Nunjucks, the templating engine of my choice - but you can do it in any other language as well.

```css{% raw %}
/* theme.css.njk */
---
permalink: '/assets/css/theme.css'
excludeFromSitemap: true
---
/*
  this macro will transform the colors in the JSON data
  into custom properties to use in CSS.
*/
{% macro colorscheme(colors) %}
    --color-bg: {{ colors.background }};
    --color-bg-offset: {{ colors.backgroundOffset }};
    --color-text: {{ colors.text }};
    --color-text-offset: {{ colors.textOffset }};
    --color-border: {{ colors.border }};
    --color-primary: {{ colors.primary }};
    --color-primary-offset: {{ colors.primaryOffset }};
    --color-secondary: {{ colors.secondary }};
{% endmacro %}

/* 
  get the "default" light and dark color schemes
  to use if no other theme was selected
*/
{%- set default = themes|getTheme('default') -%}
{%- set dark = themes|getTheme('dark') -%}

/*
  the basic setup will just use the light scheme
*/
:root {
    {{ colorscheme(default.colors) }}
}
/*
  if the user has a system preference for dark schemes,
  we'll use the dark theme as default instead
*/
@media(prefers-color-scheme: dark) {
    :root {
        {{ colorscheme(dark.colors) }}
    }
}

/*
  finally, each theme is selectable through a 
  data-attribute on the document. E.g:
  <html data-theme="bowser">
*/
{% for theme in themes %}
html[data-theme='{{ theme.id }}'] {
    {{ colorscheme(theme.colors) }}
}
{% endfor %}
{% endraw %}
```

## Using colors on the website

Now for the tedious part - we need to go through all of the site's styles and replace every color definition with the corresponding custom property. This is different for every site - but your code might look like this if it's written in SCSS:

```scss
body {
    font-family: sans-serif;
    line-height: $line-height;
    color: $gray-dark;
}
```

Replace the static SCSS variable with the theme's custom property:

```scss
body {
    font-family: sans-serif;
    line-height: $line-height;
    color: var(--color-text);
}
```

👉 __Attention:__ Custom Properties are supported in [all modern browsers](https://caniuse.com/#search=custom%20properties), but if you need to support IE11 or Opera Mini, be sure to provide a fallback.

It's fine to mix static preprocessor variables and custom properties by the way - they do different things. Our line height is not going to change dynamically.

Now do this for every instance of `color`, `background`, `border`, `fill` ... you get the idea. Told you it was gonna be tedious.

## Building the Theme Switcher

If you made it this far, congratulations! Your website is now themeable (in theory). We still need a way for people to switch themes without manually editing the markup though, that's not very user-friendly. We need some sort of UI component for this - a theme switcher.

### Generating the Markup

The switcher structure is pretty straightforward: it's essentially a list of buttons, one for each theme. When a button is pressed, we'll switch colors. Let's give the user an idea what to expect by showing the theme colors as little swatches on the button:

<figure class="extend">
    <img src="{{ 'theme-buttons.jpg' | media(page) }}" loading="lazy" alt="a row of buttons, showing the theme name and color swatches">
    <figcaption>Fact: All good design is inspired by Mario Kart</figcaption>
</figure>

Here's the template to generate that markup. We'll use inline style attributes here to display the background, text and accent colors. The button also holds its `id` in a `data-theme-id` attribute, we will pick that up via Javascript later.

```html{% raw %}
<ul class="themeswitcher">
{% for theme in themes %}
    <li class="themeswitcher__item">
        <button class="themeswitcher__btn" data-theme-id="{{ theme.id }}" style="background-color: {{ theme.colors.background }}">
            <span class="themeswitcher__name" style="color: {{ theme.colors.text }}">{{ theme.name }}</span>
            <span class="themeswitcher__palette">
                <span class="themeswitcher__hue" style="background-color: {{ theme.colors.primary }}">{{ theme.colors.primary }}</span>
                <span class="themeswitcher__hue" style="background-color: {{ theme.colors.secondary }}">{{ theme.colors.secondary }}</span>
                <span class="themeswitcher__hue" style="background-color: {{ theme.colors.border }}">{{ theme.colors.border }}</span>
                <span class="themeswitcher__hue" style="background-color: {{ theme.colors.text }}">{{ theme.colors.text }}</span>
                <span class="themeswitcher__hue" style="background-color: {{ theme.colors.textOffset }}">{{ theme.colors.textOffset }}</span>
            </span>
        </button>
    </li>
{% endfor %}
</ul>
{% endraw %}
```

There's some styling involved as well, but I'll leave that out for brevity here. If you're interested in the extended version, you can find all the code in [my site's github repo](https://github.com/maxboeck/mxb).

### Setting the Theme

The last missing piece is some Javascript to handle the switcher functionality.

```js
// let's make this a new class
class ThemeSwitcher {
    constructor() {
        // define some state variables
        this.activeTheme = 'default'
        this.hasLocalStorage = typeof Storage !== 'undefined'

        // get all the theme buttons from before
        this.themeSelectBtns = document.querySelectorAll('button[data-theme-id]')
        // when clicked, get the theme id and pass it to a function
        Array.from(this.themeSelectBtns).forEach((btn) => {
            const id = btn.dataset.themeId
            btn.addEventListener('click', () => this.setTheme(id))
        })
    }
}

// this whole thing only makes sense if custom properties are supported -
// so let's check for that before initializing our switcher.
if (window.CSS && CSS.supports('color', 'var(--fake-var)')) {
    new ThemeSwitcher()
}
```

When somebody switches themes, we'll take the theme id and set is as the `data-theme` attribute on the document. That will trigger the corresponding selector in our `theme.css` file, and the chosen color scheme will be applied.

Since we want the theme to persist even when the user reloads the page or navigates away, we'll save the selected id in `localStorage`.

```js
setTheme(id) {
    // set the theme id on the <html> element...
    this.activeTheme = id
    document.documentElement.setAttribute('data-theme', id)

    // and save the selection in localStorage for later
    if (this.hasLocalStorage) {
        localStorage.setItem("theme", id)
    }
}
```

On a server-rendered site, we could store that piece of data in a cookie instead and apply the theme id to the html element before serving the page. Since we're dealing with a static site here though, there is no server-side processing - so we have to do a small workaround.

We'll retrieve the theme from `localStorage` in a tiny additional script in the head, right after the stylesheet is loaded. Contrary to the rest of the Javascript, we want this to execute as early as possible to avoid a FODT ("flash of default theme"). 

OK that's not actually a real term. I made that up.

```html
<head>
    <link rel="stylesheet" href="/assets/css/main.css">
    <script>
        // if there's a theme id in localstorage, use it on the <html>
        localStorage.getItem('theme') && 
        document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'))
    </script>
</head>
```

If no stored theme is found, the site uses the default color scheme (either light or dark, depending on the users [system preference](https://web.dev/prefers-color-scheme/)).

## Get creative

You can have an unlimited number of themes this way, and they're not limited to flat colors either - with some extra effort you can have patterns, gradients or even GIFs in your design. Although arguably just because you can doesn't mean you should, as evidenced by my site's new *Rainbow Road* theme.

Please don't use that.

