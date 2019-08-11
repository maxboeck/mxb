---
title: Indie Link Sharer
tags: code
image: cover.jpg
draft: true
---

<p class="lead">A pain point of the IndieWeb is that it's sometimes not as convenient to share content as it is on the common social media platforms.</p>

Posting a new short "note" on my site currently requires me to commit a new markdown file to the repository on Github. That's doable (for a developer), but not really convenient, especially when you're on the go and just want to share a quick link. Eventually I would then fall back to posting on Twitter et al. That's why I wanted to improve the process.

A quick Google search revealed that smarter people have already solved that problem. I came across this [blog post by Tim Kadlec](https://timkadlec.com/remembers/2018-02-06-saving-links-to-my-site-with-a-bookmarklet/) who describes adapting someone else's link sharing technique for his (Hugo-powered) blog.

That just left me the task of adapting it for my setup (Eleventy, Netlify) and customizing a few details.

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
<a class="bookmarklet" href="javascript:(function(){var title = document.getElementsByTagName('title')[0].innerHTML;title = encodeURIComponent(title);var selection = '';if (window.getSelection) {selection = window.getSelection().toString();} else if (document.selection &amp;&amp; document.selection.type != 'Control') {selection = document.selection.createRange().text;}selection = encodeURIComponent(selection);new_window=window.open('{{ page.url | url | absoluteUrl(site.url) }}?title='+title+'&amp;body='+selection+'&amp;url='+encodeURIComponent(document.location.href),'Sharer','resizable,scrollbars,status=0,toolbar=0,menubar=0,titlebar=0,width=680,height=700,location=0');})();">Share on MXB</a> 

...and can then be dragged to the bookmarks bar for quick access.

## The Sharing Form

At [mxb.dev/share](https://mxb.dev/share/), I've created a small preact app. It will take the GET params passed in via the URL and generate a live preview of the resulting note, so I know what the end product will look like. 

There's also a form that will be pre-populated with the values, which lets me include additional information and edit everything before posting.

<img src="{{ 'sharer.png' | media(page) }}" style="box-shadow:0 0 24px rgba(0,0,0,0.2)" alt="The sharing form with a live preview of the note">

## The Handler Script

When I hit the submit button, the form will send the data along to another endpoint. I've built a serverless function to handle the processing, so I could theoretically send data from other sources there too in the future. Plus I wanted to give [netlify functions]() another whirl.

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

## Mobile Share Sheet

https://www.aaron-gustafson.com/notebook/my-own-personal-pwa/

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

<figure>
<img src="{{ 'sharesheet.jpg' | media(page) }}" alt="PWA Share Sheet on Android" style="max-width: 350px">
<figcaption>The "Max Böck" share option is available after installing the PWA.</figcaption> 
</figure>