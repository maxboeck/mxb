---
title: "Indieweb pt2: Using Webmentions in Eleventy"
slug: "using-webmentions-on-static-sites"
tags: code
description: "How to pull interactions from social media platforms like Twitter back to your own site, using Webmentions, webmention.io and Bridgy."
demo: https://github.com/maxboeck/eleventy-webmentions
image: cover.jpg
featured: true
featuredImage: chat.jpg
featuredImageColor: "#FFC754"
---

<p class="lead">In last week's post, I talked about syndicating content from a static site to Twitter. But getting content out is only half the challenge.</p>

The real value of social media (apart from the massive ad revenue and dystopian data mining) is in the reactions we get from other people. The likes, reposts and replies - they're what makes it "social". To gain control over our own content, we need to capture these interactions as well and pull them back to our sites. In indieweb terms, that's known as ["backfeed"](https://indieweb.org/backfeed).

## Hello Webmentions

A [Webmention](https://indieweb.org/Webmention) is an open standard for a reaction to something on the web. It's currently in W3C recommendation status. When you link to a website, you can send it a Webmention to notify it. 

It's comparable to pingbacks, except that webmentions contain a lot more information than a simple "ping". They can be used to express likes, reposts, comments or other things. 

To make a site support webmentions, it needs to declare an endpoint to accept them. That endpoint can be a script hosted on your own server, or in the case of static sites, a third-party service like [webmention.io](https://webmention.io).

Webmention.io is a free service made by indieweb pioneer Aaron Parecki that does most of the groundwork of receiving, storing and organizing incoming webmentions for you. It's awesome!

To use it, sign up for a free account there using the [IndieAuth](https://indieauth.com/) process, then include a link tag in the `head` of your site:

```html
<link rel="pingback" href="https://webmention.io/mxb.dev/xmlrpc">
<link rel="webmention" href="https://webmention.io/mxb.dev/webmention">
```

### Turning social media interactions into webmentions

Cool. So that's all very nice, but the real party is still over at *[currently hip social network]*, you say. Nobody ever sends me any webmentions.

Well, while your platform of choice is still around, you can use a tool to automatically turn social media interactions into beautiful open webmentions. [Bridgy](https://brid.gy/) is another free service that can monitor your Twitter, Facebook or Instagram activity and send a webmention for every like, reply or repost you receive.

So if you were to publish a tweet that contains a link back to your site, and somebody writes a comment on it, Bridgy will pick that up and send it as a webmention to your endpoint!

The resulting entry on webmention.io then looks something like this:

```json
    {
      "type": "entry",
      "author": {
        "type": "card",
        "name": "Sara Soueidan",
        "photo": "https://webmention.io/avatar/pbs.twimg.com/579a474c9b858845a9e64693067e12858642fa71059d542dce6285aed5e10767.jpg",
        "url": "https://sarasoueidan.com"
      },
      "url": "https://twitter.com/SaraSoueidan/status/1022009419926839296",
      "published": "2018-07-25T06:43:28+00:00",
      "wm-received": "2018-07-25T07:01:17Z",
      "wm-id": 537028,
      "wm-source": "https://brid-gy.appspot.com/comment/twitter/mxbck/1022001729389383680/1022009419926839296",
      "wm-target": "https://mxb.dev/blog/layouts-of-tomorrow/",
      "content": {
        "content-type": "text/plain",
        "value": "This looks great!",
        "text": "This looks great!"
      },
      "in-reply-to": "https://mxb.dev/blog/layouts-of-tomorrow/",
      "wm-property": "in-reply-to",
      "wm-private": false
    }
```

### But wait, there's more!

The beauty of webmentions is that unlike with regular social media, reactions to your content are not limited to users of one site. You can combine comments from Facebook and Twitter with replies people posted on their own blogs. You can mix retweets and shares with mentions of your content in newsletters or forum threads. 

You also have complete control over who and what is allowed in your mentions. Content silos often only allow muting or blocking on your own timeline, everyone else can still see unwanted or abusive @-replies. With webmentions, you're free to moderate reactions however you see fit. Fuck off, Nazis!

## Including webmentions in static sites

Once the webmention endpoint is in place, we still need to pull the aggregated data down to our site and display it in a meaningful way.

The way to do this depends on your setup. Webmention.io offers an [API](https://github.com/aaronpk/webmention.io#api) that provides data as a JSON feed, for example. You can query mentions for a specific URL, or get everything associated with a particular domain (allthough the latter is only available to site owners.)

My site uses [Eleventy](https://11ty.io), which has a conventient way to pull in external data at build time. By providing a [custom function](https://www.11ty.io/docs/data-js/#using-js-data-files) that queries the API, Eleventy will fetch my webmentions and expose them to the templates when generating the site.

```js
// data/webmentions.js
const API_ORIGIN = 'https://webmention.io/api/mentions.jf2'

module.exports = async function() {
    const domain = 'mxb.dev'
    const token = process.env.WEBMENTION_IO_TOKEN
    const url = `${API_ORIGIN}?domain=${domain}&token=${token}`

    try {
        const response = await fetch(url)
        if (response.ok) {
            const feed = await response.json()
            return feed
        }
    } catch (err) {
        console.error(err)
        return null
    }
}
```
{% raw %}*The feed can now be accessed in the {{ webmentions }} variable.*{% endraw %}

Here's [the complete function](https://github.com/maxboeck/mxb/blob/master/src/data/webmentions.js) if you're interested. Other static site generators offer similiar methods to fetch external data.

## Parsing and Filtering

Now that the raw data is available, we can mold it into any shape we'd like. For my site, the processing steps look like this:

* Filter the raw data for each post, only include mentions targeting that URL.
* Only allow "mentions" and "replies" in the comment section. Likes and Reposts go somewhere else.
* Remove entries that dont have any content to display.
* Sanitize the output - strip HTML tags, truncate long content, etc.

```js
// filters.js
const sanitizeHTML = require('sanitize-html')

function getWebmentionsForUrl(webmentions, url) {
    const allowedTypes = ['mention-of', 'in-reply-to']

    const hasRequiredFields = entry => {
        const { author, published, content } = entry
        return author.name && published && content
    }
    const sanitize = entry => {
        const { content } = entry
        if (content['content-type'] === 'text/html') {
            content.value = sanitizeHTML(content.value)
        }
        return entry
    }

    return webmentions
        .filter(entry => entry['wm-target'] === url)
        .filter(entry => allowedTypes.includes(entry['wm-property']))
        .filter(hasRequiredFields)
        .map(sanitize)
}
```

In Eleventy's case, I can set that function as a custom filter to use in my post templates.
Each post will then loop over its webmentions and output them underneath.

{% raw %}
```html
<!-- webmentions.njk -->
{% set mentions = webmentions | getWebmentionsForUrl(absoluteUrl) %}
<ol id="webmentions">
{% for webmention in mentions %}
    <li class="webmentions__item">
        {% include 'webmention.njk' %}
    </li>
{% endfor %}
</ol>
```
{% endraw %}

You can see the result by scrolling down to the [end of this post](#webmentions) (if there are any replies 😉).

{% signup "By the way..." %}
I'm running an email list for people interested in personal websites and the IndieWeb.
If you enjoy that kind of stuff, you can join here and I'll notify you whenever I publish a new post. No strings attached, unsubscribe anytime.
{% endsignup %}

## Client-Side Rendering

Because static sites are, well, static - it's possible that new mentions have happened since the last build. To keep the webmention section up-to-date, there's an extra step we can take: client side rendering.

Remember I said the webmention.io API can be used to only fetch mentions for a specific URL? That comes in handy now. After the page has loaded, we can fetch the latest mentions for the current URL and re-render the static webmention section with them.

On my site, I used [Preact](https://preactjs.com/) to do just that. It has a very small (~3kB) footprint and lets me use React's mental model and JSX syntax. It would probably also have been possible to re-use the existing `nunjucks` templates, but this solution was the easiest and most lightweight for me.

I essentially used the same logic here as I did in the static build, to ensure matching results. The rendering only starts after the API call returned valid data though - if anything goes wrong or the API is unavailable, there will still be the static content as a fallback.

```js
// webmentions/index.js
import { h, render } from 'preact'
import App from './App'

...
const rootElement = document.getElementById('webmentions')
if (rootElement) {
    fetchMentions()
        .then(data => {
            if (data.length) {
                render(<App webmentions={data} />, rootElement)
            }
        })
        .catch(err => {
            console.error(err)
        })
}
```

And that's it! There are of course still some missing pieces, most notably the ability to send outgoing webmentions to URLs linked to in your own blog posts. ~~I might have to look into that.~~

## Update: Outgoing Webmentions!

[Remy Sharp](https://remysharp.com/) has recently published a very useful new tool that takes care of handling **outgoing** webmentions for you. [Webmention.app](https://webmention.app/) is a platform agnostic service that will check a given URL for links to other sites, discover if they support webmentions, then send a webmention to the target. 

You can use that service in a number of ways, including your own command line. If you host your site on Netlify though, it's also very straightforward to integrate it [using deployment webhooks](https://webmention.app/docs#how-to-integrate-with-netlify)!

## Eleventy Starter

I made an [Eleventy Starter Template](https://github.com/maxboeck/eleventy-webmentions) with basic webmention support, using some of the techniques in this post. Check it out!

## Jekyll Plugin

My implementation was heavily inspired by Aaron Gustafson's excellent Jekyll Plugin (link below), which goes even further with customization and caching options. If you're running a Jekyll site, use that for almost instant webmention support 👍.

## Further Resources

* [W3C Recommendation](https://www.w3.org/TR/webmention/) for the Webmention Standard
* [Webmention.io Jekyll Plugin](https://github.com/aarongustafson/jekyll-webmention_io) by Aaron Gustafson
* [Indieweb Examples](https://indieweb.org/Webmention-developer#IndieWeb_Examples) of people using Webmentions on their sites
