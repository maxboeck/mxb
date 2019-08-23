---
title: IndieWeb Link Sharing
tags: code
image: cover.jpg
description: "A pain point of the IndieWeb is that it's sometimes not as convenient to share content as it is on the common social media platforms. Let's improve that."
---

<p class="lead">A pain point of the IndieWeb is that it's sometimes not as convenient to share content as it is on the common social media platforms.</p>

Posting a new short ["note"](/notes) on my site currently requires me to commit a new markdown file to the repository on Github. That's doable (for a developer), but not really convenient, especially when you're on the go and just want to share a quick link. Twitter and other social media platforms literally make this as easy as clicking a single button, which makes it tempting to just post stuff straight to them. That's why I wanted to improve this process for my site.

A quick Google search revealed that smarter people have already solved that problem. I came across this [blog post by Tim Kadlec](https://timkadlec.com/remembers/2018-02-06-saving-links-to-my-site-with-a-bookmarklet/) who describes adapting someone else's link sharing technique for his (Hugo-powered) blog. That just left me the task of adapting it for my setup (Eleventy, Netlify) and customizing a few details.

The new link sharing basically has three main parts:

* a small Javascript bookmarklet to act as a "share button"
* a form that collects and sends the shared link data, and
* a serverless function to process it and create a new file.

Here's how they work together:

## The Bookmarklet

The button to kick things off is just a small bit of Javascript that takes the current page's title, URL and optionally a piece of selected text you may want to quote along with the link.

It then sends these things as GET parameters to `mxb.dev/share` by opening a new window to it.

```js
function(){
    // get link title
    var title = document.getElementsByTagName('title')[0].innerHTML;
    title = encodeURIComponent(title);

    // get optional text selection
    var selection = '';
    if (window.getSelection) {
        selection = window.getSelection().toString();
    } else if (document.selection && document.selection.type != 'Control') {
        selection = document.selection.createRange().text;
    }
    selection = encodeURIComponent(selection);

    // generate share URL
    var url = 'https://mxb.dev/share/?title='+title+'&body='+selection+'&url'+encodeURIComponent(document.location.href)

    // open popup window to sharing form
    window.open(url,'Sharer','resizable,scrollbars,status=0,toolbar=0,menubar=0,titlebar=0,width=680,height=700,location=0');
})()
```
The bookmarklet looks like this: 
<a class="bookmarklet" href="javascript:(function(){var title = document.getElementsByTagName('title')[0].innerHTML;title = encodeURIComponent(title);var selection = '';if (window.getSelection) {selection = window.getSelection().toString();} else if (document.selection &amp;&amp; document.selection.type != 'Control') {selection = document.selection.createRange().text;}selection = encodeURIComponent(selection);new_window=window.open('https://mxb.dev/share/?title='+title+'&amp;body='+selection+'&amp;url='+encodeURIComponent(document.location.href),'Sharer','resizable,scrollbars,status=0,toolbar=0,menubar=0,titlebar=0,width=680,height=700,location=0');})();">Share on MXB</a> 

...and can then be dragged to the bookmarks bar for quick access.

## The Sharing Form

At [mxb.dev/share](https://mxb.dev/share/), I've created a small preact app. It will take the GET params passed in via the URL and generate a live preview of the resulting note, so I know what the end product will look like. 

There's also a form that will be pre-populated with the values, which lets me include additional information and edit everything before posting.

The form also has fields for the Github username and security token, necessary for authentification. My password manager will fill those in automatically.

<img src="{{ 'sharer.png' | media(page) }}" style="box-shadow:0 0 24px rgba(0,0,0,0.2)" alt="The sharing form with a live preview of the note">

## The Handler Script

When I hit the submit button, the form will send the data along to another endpoint. I've built a serverless function to handle the processing, so I could theoretically send data from other sources there too and keep the posting logic in one place. [Netlify Functions](https://www.netlify.com/docs/functions/) seemed to be a nice fit for this.

Here's the [full script](https://github.com/maxboeck/mxb/blob/master/_lambda/share.js) if you're interested. It reads the posted data and generates a new markdown file from it, called something like `2019-08-11-amphora-ethan-marcotte.md`:

```markdown
---
title: "Amphora - Ethan Marcotte"
date: "2019-08-11T16:57:13.104Z"
syndicate: false
tags: link
---

...we've reached a point where AMP may "solve" the web's 
performance issues by supercharging the web’s accessibility problem. 
(via [@beep](https://twitter.com/beep))

[ethanmarcotte.com/wrote/amphora](https://ethanmarcotte.com/wrote/amphora/)
```

It will then use the [Github API](https://developer.github.com/v3/) to post that file as a base64-encoded string to a predetermined location in the site's repository (in my case the folder where I keep all my notes).

Here's the core function responsible for that:

```js
const postFile = async data => {
    const { title, token } = data
    const fileName = getFileName(title)
    const fileContent = getFileContent(data)
    const url = API_FILE_TARGET + fileName

    const payload = {
        message: 'new shared link',
        content: Buffer.from(fileContent).toString('base64'),
        committer: {
            name: 'Max Böck',
            email: 'hello@mxb.dev'
        }
    }

    const options = {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/vnd.github.v3+json',
            Authorization: `token ${token}`
        }
    }

    return await fetch(url, options)
}
```

That's pretty much it! After the file is committed, Netlify will kick in and re-build the static site with the new content. If I have marked the "syndicate to Twitter" flag, another script will then cross-post the link there. (More on that in [Static Indieweb pt1: Syndicating Content](https://mxb.dev/blog/syndicating-content-to-twitter-with-netlify-functions/)).

## Mobile Share Target

A caveat of this technique is the use on mobile. Javascript bookmarklets are not as easily available in mobile browsers, which complicates the process again. 

Thankfully Aaron Gustafson recently pointed out that it's possible to [define a "Share Target"](https://www.aaron-gustafson.com/notebook/my-own-personal-pwa/) for Progressive Web Apps. That means if your site is a PWA (it probably should be), you can add an entry like this to its manifest file:

```json
// site.webmanifest
{
    ...,
    "share_target": {
        "action": "/share/",
        "method": "GET",
        "enctype": "application/x-www-form-urlencoded",
        "params": {
            "title": "title",
            "text": "text",
            "url": "url"
        }
    }
}
```

That little bit of JSON registers your site as an application that can share things, just like Twitter, WhatsApp and the others. So after I "install" my PWA (read: create a shortcut link on my device home screen), it shows up as an option in the native Android "share" dialog:

<figure>
    <img src="{{ 'sharesheet.jpg' | media(page) }}" alt="PWA Share Sheet on Android" width="350" />
    <figcaption>The "Max Böck" share option is available after installing the PWA.</figcaption> 
</figure>

Selecting the "MXB" option will grab the current page title and URL and send them as GET args to my sharing form, just like the bookmarklet would on desktop. There's still a small bug in there where the URL will be sent as the `text` parameter, but that can be corrected with a bit of Javascript in the form app.

I'm quite happy with how this turned out, as it feels really simple and straightforward. One step closer to IndieWeb bliss!

## One more thing...

`<shameless-plug>`  
If you're interested in this and other IndieWeb topics, you might want to check out my talk at the [webclerks conference](https://webclerks.at) on November 25th in Vienna, Austria. There's a fantastic lineup of speakers including Jeremy Keith, Rachel Andrew and Heydon Pickering. I'm very excited about it. Tickets are limited, so get yours early!  
`</shameless-plug>`

[![webclerks conference, November 25, Vienna](https://webclerks.at/assets/images/og-image-default.jpg)](https://webclerks.at)