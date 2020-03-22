---
title: Emergency Website Kit
tags: code
image: cover.jpg
demo: https://emergency-site.dev/
---

In cases of emergency, many organizations need a quick way to publish critical information. But exisiting (CMS) websites are often unable to handle sudden spikes in traffic.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Just received a shelter-in-place emergency alert with a web address for more information. Clicked the link. The site is down. All emergency sites should be static.</p>&mdash; Nicholas C. Zakas (@slicknet) <a href="https://twitter.com/slicknet/status/1239972949819404291?ref_src=twsrc%5Etfw">March 17, 2020</a></blockquote>

To make things worse, natural desasters can damage local network infrastructure, sometimes leaving people with very poor mobile connections.

I've [written about](/blog/hurricane-web/) the practice of publishing minimal "text-only" versions of critical news websites before and I think it makes a lot of sense to rely on the [rule of least power](https://en.wikipedia.org/wiki/Rule_of_least_power) for these things. When it comes to resilience, you just can't beat static HTML.

## An Emergency Website Kit

Like so many others, I'm currently in voluntary quarantine at home - and I used some time this weekend to put a small [boilerplate](https://github.com/maxboeck/emergency-site) together for this exact usecase.

Here's the main idea:  

* generate a static site with [Eleventy](https://11ty.dev)
* minimal markup, inlined CSS
* aim to transmit everything in the first connection roundtrip (~14KB)
* progressively enable offline-support w/ Service Worker
* set up Netlify CMS for easy content editing
* one-click deployment via Netlify to get off the ground quickly

It's basically just a small, ultra-lean blog focused on maximum resilience and accessibility.

You can find the [project source on Github](https://github.com/maxboeck/emergency-site) as well as a [demo site here](https://emergency-site.dev/)
