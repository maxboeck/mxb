---
title: Indie Link Sharer
tags: code
image: cover.jpg
draft: true
---

https://timkadlec.com/remembers/2018-02-06-saving-links-to-my-site-with-a-bookmarklet/

## The Bookmarklet

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

<a class="bookmarklet" href="javascript:(function(){var title = document.getElementsByTagName('title')[0].innerHTML;title = encodeURIComponent(title);var selection = '';if (window.getSelection) {selection = window.getSelection().toString();} else if (document.selection &amp;&amp; document.selection.type != 'Control') {selection = document.selection.createRange().text;}selection = encodeURIComponent(selection);new_window=window.open('{{ page.url | url | absoluteUrl(site.url) }}?title='+title+'&amp;body='+selection+'&amp;url='+encodeURIComponent(document.location.href),'Sharer','resizable,scrollbars,status=0,toolbar=0,menubar=0,titlebar=0,width=680,height=700,location=0');})();">Share on MXB</a>

## The Sharing Form

<img src="{{ 'sharer.png' | media(page) }}" style="box-shadow:0 0 24px rgba(0,0,0,0.2)" alt="The sharing form with a live preview of the note">

## The Handler Script

https://github.com/maxboeck/mxb/blob/master/_lambda/share.js

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

`2019-08-11-amphora-ethan-marcotte.md`

```js
const postFile = async data => {
    const { title, token } = data
    const fileName = getFileName(title)
    const fileContent = getFileContent(data)
    const url = API_FILE_TARGET + fileName

    const payload = {
        message: 'new shared note',
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

<img src="{{ 'sharesheet.jpg' | media(page) }}" alt="PWA Share Sheet on Android">