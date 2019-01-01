---
title: The Relaunch Post
tags: code
image: screenshot.jpg
description: 'Two weeks into 2017, I used some spare time to relaunch this website. I do this as a way for me to try new things and catch up on latest techniques.'
---

<p class="lead">Two weeks into 2017, I used some spare time to relaunch my website.</p>

I do this almost every year - not (only) because of my neverending quest to optimize the shit out of it, but because it's a great way for me to try new things I want to learn on a "real life" project.

Altough it's a fairly simple site - basically just a small portfolio section, a blog and a contact form, it's still a good exercise to see how different modern workflows can come into play.

So here is the way I did it in 2017. This might get a bit lenghy and technical, but hang in there. 

__TL; DR:__ 

* Jekyll Static Files
* BEM-flavoured CSS (w/ Critical Path Inlining)
* Vanilla JS (ES6 / Babel)
* System Fonts & FontFaceObserver
* Offline Support w/ Service Worker
* Focus on Speed and Accessibility

All source files are [available on Github](https://github.com/maxboeck/mxb), if you're interested.

## Going Static

While previous versions of this site were all built on WordPress, this year I finally decided to switch to a static file generator, [Jekyll](https://jekyllrb.com/).

Jekyll blogs are typically run by developers or other tech-savvy people, as they require a bit of knowledge about tooling and setup, and posts are usually written in Markdown. It's definitely harder to get started than with a 1-minute WordPress install, but it's worth it:

Static files are faster, safer and more resilient than a database-driven site.
Plus using any sort of CMS always restricts you to doing things a certain way - and I wanted full control over the barebones HTML.

The out-of-the box Jekyll setup includes a development server and support for SCSS preprocessing.
However, I wanted a little more - so my first step was to build a [custom boilerplate with Jekyll and Gulp](https://github.com/maxboeck/jekyll-gulp) to do the heavy lifting.

## Design

Design-wise, I've always been a fan of minimalism - so it's no surprise that this year's iteration turned out to look very clean and reduced again.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Content precedes design. Design in the absence of content is not design, it&#39;s decoration.</p>&mdash; Jeffrey Zeldman (@zeldman) <a href="https://twitter.com/zeldman/status/804159148">March 5, 2008</a></blockquote>

Keeping true to this premise, I focused more on the content, on good typography and readability; and I think it turned out nice. While I dont think that every site should look as "boring" as this one - cause I really enjoy the crazy creative things others come up with - for me, it was a good fit.

## Accessibility

I read a lot about accessibility last year, most recently the highly recommended ["Inclusive Design Patterns"](https://www.smashingmagazine.com/inclusive-design-patterns/) by Heydon Pickering. It gave me some very valuable practical advice on the subject. 

The biggest takeaway for me was to not treat accessibility as an add-on to further improve an exisiting website, but to design websites "inclusive" right from the start. Trying to think of all the use cases outside of your own bubble first, to make a site __everyone__ can use. 

I believe that a good website should be able to handle almost any scenario you can throw at it, and still manage to provide content in a usable form. So for the relaunch, I wanted to incorporate this knowledge and push for a really flexible, accommodating design.

A few of those features include:

* semantic, structured HTML & microformats
* landmark roles and WAI-ARIA attributes for screen readers
* UI doesn't rely on color perception
* content can be navigated by keyboard in a logical way
* entire site scales in relation to default font size (rem-based)
* top level pages are cached by Service Worker for offline use

## Javascript

I have to admit that I had become a bit lazy with jQuery. Relying too much on the framework to do basic tasks made me dependent on it, and using jQuery for everything adds unnecessary bloat.
So as part of my ongoing effort to _really_ get better at Javascript, I wrote everything in plain vanilla ES6 this time. 

I found a few select microservices to handle things like lazy loading or basic ajax requests, making sure to include just the absolute minimum. All of them were available via `npm install` and can be consumed as modules, first thing in the main file:

```js
import FontFaceObserver from 'fontfaceobserver'; //font loading
import Blazy from 'blazy'; // lazy images
import NanoAjax from 'nanoajax'; //ajax
import Util from './lib/util'; //custom helpers
```

For some of the stuff that is usually provided by jQuery, I created a separate `Utils.js` file to import. Things like serializing form data or getting the parent DOM node of an element can easily be recreated as simple functions, and then called like `Util.serialize()`.

I also made an effort not to use a third-party plugin for the [contact form](/contact), but to build as much as possible from scratch.

The final minified and gzipped JS file weighs in at just __8.4KB__, quite small compared to the hefty 68KB I had before. Feels good 😎.

### Defer all the things!

Since the site basically works fine without Javascript too, there's really no reason to have it block the rendering. The webpack-generated main JS file `bundle.js` can therefore be defered quite easily.

For a few ressources that are not related to the function of the site itself, I've taken it a step further still. I used my favourite [defering snippet](https://mxb.at/blog/javascript-defering-snippet/) to make sure stuff like analytics, polyfills or the twitter API are loaded last, when the site is already done and rendered.

## Fonts

Taking a page out of Github's playbook, I used system fonts for the body copy (and emoji) 🍺.
They look great, support all languages and fit in nicely with the rest of the device UI. And best of all, they're available without a single network request.
Here's the full body font stack:

```sass
$body-font: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", 
"Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", 
"Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
```

Titles are set in Playfair Display, a font availabe on Google Fonts. I chose to self-host it, and provide fonts only in woff and woff2 formats. That's not totally bulletproof, but more future-friendly.

And besides, [no font-face syntax will ever be bulletproof, nor should it be](https://calendar.perfplanet.com/2016/no-font-face-bulletproof-syntax/).

For `@font-face` loading, I used Bram Stein's [FontFaceObserver](https://github.com/bramstein/fontfaceobserver) to make sure users wouldn't see a <abbr title="Flash of Invisible Text">FOIT</abbr> on page load. Titles fall back to the similiar looking _Times New Roman_ until the font is ready.

A couple of additional tweaks here:

### Preload the font as early as possible

```html
  <link rel="preload" href="playfair-display-regular.woff2" as="font" type="font/woff2">
```

### Optimize for repeat visits

Once the font is cached, we can use it straight away. There's no reliable way to detect this though - I settled on a cookie-like solution (I say "like", because it actually uses session storage). The length of a browser session is a reasonable timespan to assume for a valid cache, so I set a flag when the font is first loaded.

The whole fontface observer code looks like this:

```js
function loadFonts(){
  if(sessionStorage.getItem('fontsLoaded')){
    return;
  }
  
  const playfairObserver = new FontFaceObserver('Playfair Display', {});
  playfairObserver.load().then(() => {
    document.documentElement.classList.add('fonts-loaded');
    sessionStorage.setItem('fontsLoaded', true);
  }, () => {
    document.documentElement.classList.remove('fonts-loaded');
  });
}
```

## Performance

Speed was a major factor in the relaunch process. It's not that my blog is particulary heavy or gets that much traffic, but I'm super interested in performance optimization and wanted to see how far I could take things.

I tested using Webpagetest, Google PageSpeed and Lighthouse, looking especially at three metrics:

* time to first meaningful paint
* speed index
* total # of requests

### Let's get critical

A good method to improve page performance is to try and render the initial view within the first network request (the first 14KB or so). To achieve this, a subset of the full CSS is inlined in the page head.

Determining exactly which styles are necessary to render the page at a given viewport is a little tricky and would be quite cumbersome, if one were to do it manually. Thankfully, the smart people of the internet (namely Google's Addy Osmani) have developed a tool for that:

[Critical](https://github.com/addyosmani/critical) is a gulp plugin that takes in a set of pages and a viewport width/height, then looks at these pages, extracts all applied styles and injects them into the `<head>`.

Configuration is very simple:

```js
const config = {
  inline:   true, 
  base:     '_site',
  minify:   true,
  width:    1280,
  height:   800,
  ignore:   ['@font-face']
};

gulp.task('critical', () => {
  return gulp.src('index.html')
    .pipe(critical.stream(config))
    .pipe(gulp.dest('_site'));
});
```

The task inserts the extracted styles in a `<style>` tag and includes a tiny script to load the main CSS after the page is done:

<figure class="extend">
  <img alt="Inserted inline CSS in head" src="{{ 'critical-css.jpg' | media(page) }}" />
</figure>

### Offline is the new black

To establish offline support, there's no way around __Service Worker__.
A Service Worker is essentially a piece of Javascript that sits between the client and the network,
to intercept requests and deliver assets, even without an internet connection. It's a powerful thing.

A few requirements for this to work though:

* The Browser has to [support service workers](http://caniuse.com/#feat=serviceworkers)
* Only secure connections over HTTPS are allowed

There are different methods of letting SW handle network requests, you can find a great outline in [The Offline Cookbook](https://jakearchibald.com/2014/offline-cookbook), written by Jake Archibald.

On my site, I opted for a pretty simple approach. Since it's all static files, I can pre-cache the most important assets and top-level pages in a Service Worker to drastically reduce the amount of data and network requests necessary. When a client first hits the site, the SW installs itself and caches a list of ressources with it, after the page has loaded:

<figure class="extend">
  <img alt="network requests made by Service Worker" src="{{ 'sw-install.jpg' | media(page) }}" />
  <figcaption>See the small Cog Icon? That's the ServiceWorker doing its thing.</figcaption>
</figure>

Now, once it is active, the SW can intercept all requests to files in its cache, providing them instantly on the next call.
Here's what happens when the client navigates to another page:

<figure class="extend">
  <img alt="cached assets delivered by the service worker" src="{{ 'sw-active.jpg' | media(page) }}" />
</figure>

Everything important is instantly available. Even when offline, these assets can be accessed.

Managing the Service Worker of course also means keeping track of what has changed, to replace deprecated assets with new versions.
To make this easy, I used a tool provided by the Chrome team called [sw-precache](https://github.com/GoogleChrome/sw-precache).
It can be integrated in the build process to check for changes everytime the site is deployed. 

When it finds something has changed, it generates a new `sw.js` Service Worker file, which will replace the old one [as soon as no one's looking](https://www.youtube.com/watch?v=TF4AB75PyIc). You can simply pass it a set of files to watch, and never have to worry about cache invalidation again.

### The Results 🎉 

Here's how it turned out. I'm pretty happy with it!

#### WebpageTest
<figure class="extend">
  <img src="{{ 'webpagetest.png' | media(page) }}" alt="webpagetest results" />
  <figcaption>SpeedIndex under 1000! also note the improvement on repeat views due to service worker.</figcaption>
</figure>

#### Google PageSpeed
<figure class="extend">
  <img src="{{ 'pagespeed.jpg' | media(page) }}" alt="pagespeed results" />
  <figcaption>analytics is not properly cached - oh the irony <span style="font-style:normal">😒</span></figcaption>
</figure>

#### Google Lighthouse
<figure class="extend">
  <img src="{{ 'lighthouse.jpg' | media(page) }}" alt="lighthouse results" />
</figure>

Alright, that's it! Let's see how much of this still holds up in 2018. See you then!
