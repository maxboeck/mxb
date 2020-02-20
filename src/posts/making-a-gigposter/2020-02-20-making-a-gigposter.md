---
title: Making a Gigposter
tags: design
image: cover.jpg
slug: making-a-gigposter
description: How to create a custom print design for a Rage against the Machine show using Illustrator, Photoshop and zero drawing skills.
---

<p class="lead">Long before I wrote my first line of code, all I wanted to do was make music. I went to a music-focused high school, played in a couple of bands, and I loved it.</p>

I also loved making flyers, posters and CD artwork for local bands - It's actually what got me started in design and ultimately led me to build for the web. You see I can't really draw, so my only option to create the images in my head was with the help of computers, which I was able to use. Creating posters became a hobby of mine.

These days, I'm usually too busy to find time for that hobby. But I keep a collection of my favourite gigposters and once in a while, when an occasion arises, I get to do one myself.

I still do vocals in one band, and so fortunately that occasion comes once a year in the form of a _Rage Against the Machine_ cover gig we play in my hometown. The event is called "Rage/Aid" because all of the proceeds are donated to charity.

__TL;DR:__ [Here's the poster](#h-final-result) I did for that show, and how I made it.

## Concept

The hardest part for me is coming up with a good idea. Much like a website, a gigposter is a mixture of information and art - and should be tailored to the general vibe of the band/show. That being said, there really are no rules as to which motives fit which genre. You get to freely explore different ideas and concepts.

I usually start with a few crudely-drawn pencil sketches of possible motives. Just shoot these out real quick and let your mind wander - you can care about making them look good later. You can get inspiration from anywhere: art, nature, architecture, movies... whatever captures your attention. 

<figure class="extend">
    <img src="{{ 'sketch.jpg' | media(page) }}" width="752" height="475" alt="initial pencil sketches on a notepad" style="border: 1px solid #BBB" />
    <figcaption>some initial sketches</figcaption>
</figure>

For this one, I liked the idea of referencing a famous painting, ["The Son of Man"](https://en.wikipedia.org/wiki/The_Son_of_Man) by René Magritte. It's the one with the apple in front of a man's face - you might know it.

I thought I could take the concept of the faceless, anonymous person and put a twist on it. I also knew I wanted fire in there somehow to symbolize Rage against the Machine's anger and spirit of revolution, so I drew a lit match instead of the apple.

_It really doesn't have to be clever or deep or anything though, it's a fucking poster, not an arts degree. 🧐 I just liked the visual and thought it would go well with the vibe, so that's what I used._

## Illustration

As I mentioned earlier, I can't draw for shit. There are some [insanely talented poster artists](/blog/the-lost-art-of-the-gigposter/) out there that do it all by hand and I greatly admire their skill - but I have to rely on digital trickery to make my stuff look good. 

So I took to a stock photo site to find something I could base my illustration on. After some searching, I came across [this series of backlit faces](https://www.shutterstock.com/de/g/GlebShabash?searchterm=schattenri%C3%9F) that seemed like a nice fit. 

I like to have the main motive as a vector drawing because that's just easier to work with. I can tweak certain parts or recolor it later without too much trouble. Plus if I need it on the side of a bus someday, I can always scale it up. So my first step is usually to get the motive vectorized.

<figure class="extend">
    <img src="{{ 'vectorize.jpg' | media(page) }}" width="752" height="606" alt="a split screen view of the used photo (left) and the color-separated vector (right)" />
    <figcaption>the stock photo is vectorized and color-separated</figcaption>  
</figure>

I opened the stock photo in Illustrator and began tracing the outline with the pen tool. I also separated the colors into three layers, from dark to light. This sort of thing is common in stencil or screenprint artwork, and I wanted to recreate that style. It works best on high-contrast images like this.

I played around with different filters and effects to give the silhouette shape more detail. The one I chose is the [halftone filter](https://en.wikipedia.org/wiki/Halftone): it transforms the shapes into thousands of "print dots". The size and density of these dots then determine the lightness. 

<figure class="extend">
    <img src="{{ 'halftone.jpg' | media(page) }}" width="752" height="584" alt="view of the halftone effect, a portion of the image is zoomed to show resulting print dots" loading="lazy" />
    <figcaption>halftone blends the colors together as print dots</figcaption>
</figure>

This breaks a bit with the stencil style, but I like how it blends the edges of the three color layers together, and it reminds me of old newspapers and billboards.

<figure class="extend">
    <img src="{{ 'match.jpg' | media(page) }}" width="752" height="475" alt="a matchstick, its vectorized version, and a vector outline of a flame"  loading="lazy" />
    <figcaption>match original and with treshold applied; flame vector</figcaption>
</figure>

For the match, I googled for a random picture as a base, applied a [treshold](https://en.wikipedia.org/wiki/Thresholding_(image_processing)) and vectorized it in Illustrator. The flame is just a doodle I made with the pen tool, with a few extra points and distortion added to make the edges more jagged. The zigzag filter can help with that.

<figure class="extend">
    <img src="{{ 'motive.jpg' | media(page) }}" width="752" height="653" alt="the motive put together, match in front of a black silhouette"  loading="lazy" />
    <figcaption>putting the main motive together</figcaption>
</figure>

Putting the main motive together already looks cool; the flame fits nicely inside the silhouette shape. Good enough for now - I'll let that sit for a while and work on other stuff.

## Background

For the background, I switched to Photoshop as it will be pixel-based. It's important to work in CMYK colors here and make sure the document is at least 300dpi, large enough for the intended poster size - it's a pain to scale pixel artwork up later on.

<figure class="extend">
    <img src="{{ 'background.jpg' | media(page) }}" width="752" height="414" alt="a red background with multiple layers of detail applied" loading="lazy" />
    <figcaption>background with multiple layers of detail</figcaption>
</figure>

I started with a flat color and then progressively layered other stuff on top to give it more detail. The base here was a bright red. 

I then used a [watercolor texture](https://lostandtaken.com/downloads/category/paint/watercolor-texture/), a bit of speckle/noise and a grunge brush to make it look a bit eroded. I was going for a screenprint-like style, where the color often doesn't distribute evenly across the paper and has these interesting imperfections. The nice thing about blending these layers together in Photoshop is that you can still easily tweak the base color afterwards and try out different color schemes.

Another trick I like is to give the artwork a "frame", again to make it look a bit more handmade:

<figure class="extend">
    <img src="{{ 'frame.jpg' | media(page) }}" width="752" height="564" alt="the red frame now has a frame around it" loading="lazy" />
    <figcaption>outer frame has rough edges to make it look more like a screenprint</figcaption>
</figure>

This is just an extra mask layer, where the sides are drawn with a [paintroller brush](https://www.brusheezy.com/free/paint-roller) that gives you these nice rough edges. These are small details, but they all add to the general look and feel of the poster.

## Typography

Gigposters let you get really creative with type. There are some awesome pieces that use crazy custom letterforms and make them a part of the artwork itself. For my poster, I just wanted something simple that matched the illustration style. 

I found this nice big brush font called "Generous" by Danish type foundry [PizzaDude](http://pizzadude.dk/). It has broad strokes and rough edges that go well with the background, and work nicely as the display font. I paired it with the clean sans-serif [Brandon Grotesque](https://www.fonts.com/font/hvd-fonts/brandon-grotesque) for the body copy.

<img src="{{ 'fonts.jpg' | media(page) }}" width="640" height="268" alt="type sample of two fonts, one grungy, one clean" loading="lazy" />

There are some other pieces of information that just have to be on there, like the date and venue. Rather than doing one big text block though, I like to break these up a bit and play with ways to integrate them into the artwork. 

I put the supporting act in a separate badge to make it stand out more, and I made a little cutaway in the frame to hold the venue logo.

<div class="extend">
    <img src="{{ 'typo-details.jpg' | media(page) }}" width="752" height="564" alt="two zoomed sections of the poster show a badge and a small detail vor the venue logo" loading="lazy" />
</div>

## Getting to Print

Colors always look different on screen than in print. A piece of paper doesn't glow, so they are usually a bit darker and less saturated in CMYK. To make sure they turn out right, you can [proof](https://en.wikipedia.org/wiki/Prepress_proofing) your work before you send it off. If you know your color profile, Photoshop can simulate how colors will look in print.

A color profile is a bit of data that sets things like the color space, maximum ink application and other instructions for the printer. My local printer for example uses one called "ISO Coated v2 300%" (print companies will usually tell you which profile to use on their website). You can [download and install](http://www.eci.org/en/downloads#icc_profiles_from_eci) these for free.

After everything is ready, I import the poster without all the type and vector elements into InDesign, then add them back in there. That way they'll actually end up in the final PDF as vectors and are guaranteed to look sharp. InDesign also lets you set things like [bleed](https://en.wikipedia.org/wiki/Bleed_(printing)) and crop marks, which are sometimes required by the printer.

## Final Result

And here's the whole thing put together (click for full PDF):

<div class="extend">
    <a href="https://drive.google.com/file/d/1N_9SAstwos4O77pU5YKCRY8p_fZiVZDs/view" target="_blank" rel="noopener noreferrer">
        <img src="{{ 'poster.jpg' | media(page) }}" alt="the finished poster: a dark silhouette with a lit match in front of its face, against a bright red background. The title reads 'Rage Aid'." loading="lazy" style="border: 1px solid #DDD; box-shadow: 0 6px 12px 0 rgba(0, 0, 0, 0.15)" />
    </a>
</div>