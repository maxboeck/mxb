---
title: You're Offline
tags: code
slug: youre-offline
image: cover.jpg
description: "A truly responsive website should adapt to all kinds of situations. Besides different viewport sizes, there are other factors to consider. A change in connectivity is one of them."
---

<figure>
  <img src="{{ 'notification-sample.jpg' | media(page) }}" alt="" />
</figure>

<p class="lead">A truly responsive website should adapt to all kinds of situations. Besides different viewport sizes, there are other factors to consider. A change in connectivity is one of them.</p>

Earlier this week, I was sitting in a train on my way to speak at a local meetup. InterCity trains in Austria all have WIFI now, so I was doing some last-minute work on my slides online. Train WIFI being what it is though, the network wasn't exactly reliable. The connection kept dropping everytime we went through a tunnel or too many passengers were logged on.

This is quite a common scenario. People are on the move, network coverage can be poor, internet connections fail. Luckily, we can prepare our websites for this and make them more resilient by [building them offline-first](https://bitsofco.de/bitsofcode-pwa-part-1-offline-first-with-service-worker/).

Offline support is awesome, however your users might not be aware of these capabilites - and they shouldn't have to be. In some cases they might not even know that they've gone offline. That's why it's important to communicate what's going on.

Chances are not **every** part of your site will work offline. Certain things may not be cached, others may require server interaction. This is fine of course, but the interface should reflect that. Just like a responsive layout adapts to changes in viewport size, your offline-optimized site should adapt to changes in connectivity.

## Checking for Offline

The key ingredients here are the `offline` event and the `navigator.onLine` property. By combining them, we can check for network changes and react accordingly.  

Here's an example of a simple connectivity check:

```js
let isOffline = false;
window.addEventListener('load', checkConnectivity);

// when the page has finished loading,
// listen for future changes in connection
function checkConnectivity() {
  updateStatus();
  window.addEventListener('online', updateStatus);
  window.addEventListener('offline', updateStatus);
}

// check if we're online, set a class on <html> if not
function updateStatus() {
  if (typeof navigator.onLine !== 'undefined'){
    isOffline = !navigator.onLine;
    document.documentElement.classList.toggle('is-offline', isOffline);
    ...
  }
}
```

⚠️ Note: With the `online` event, there's a slight possibility of false positives: A user might be connected to a network (which is interpreted as being online), but something higher up might block actual internet access. The `offline` event is a bit more reliable, in the sense that an "offline" user can be expected **NOT** to have access.

## Get Notified

Now we want to display some kind of notification to offline users, so they know what's going on. This can be done in a number of ways; however I would recommend using `aria-live` regions to make it accessible and have screen readers announce the connection change as well.

Using such a notification bar is pretty straightforward. First, define an element to display messages on your page:

```html
<!-- notification container -->
<div 
  class="notification" 
  id="notification" 
  aria-live="assertive" 
  aria-relevant="text" 
  hidden
></div>
```

The `aria-live` attribute tells screen readers to announce changes to this element. "assertive" means it will interrupt whatever it is currently announcing at the time and prioritize the new message. The `aria-relevant` tells it to listen for changes in the text content of the element.

You can extend the handler function from before to populate the notification area whenever you detect that a user has gone offline:

```js
function updateStatus() {
  ...
  const notification = document.querySelector('#notification');
  if (isOffline) {
    notification.textContent = 'You appear to be offline right now.';
    notification.removeAttribute('hidden');
  } else {
    notification.textContent = '';
    notification.setAttribute('hidden');
  }
}
```

This is a very simple implementation - you can of course always get a bit fancier with an animated notification bar (or "toast message"). There are also some nice [pre-made components](https://getmdl.io/components/index.html#snackbar-section) for this.

If you're reading this on [my site](https://mxb.at/), you can see a version of these notifications in action if you simply switch off your WIFI for a second. 
Go ahead, I'll wait. 

If you're somewhere else or your browser doesn't support service worker / offline events, here's how this could look:

<div class="extend" style="margin-top:2rem;">
  <video poster="{{ 'offline-notification.png' | media(page) }}" width="944" height="528" alt="Offline Notification" controls>
    <source src="{{ 'offline-notification.webm' | media(page) }}" type="video/webm" />
    <source src="{{ 'offline-notification.mp4' | media(page) }}" type="video/mp4" />
  </video>
</div>

## Telling the User what's available

Notifications are a good start, but it would be even nicer if we could give the user some visual indication of which parts they can actually use offline, and which not.

To do this, we can loop over all the links on page load and check their `href` against the cache. If they point to a cached resource (e.g. will work offline), they get a special class.

```js
const links = document.querySelectorAll('a[href]');
Array.from(links).forEach((link) => {
  caches.match(link.href, { ignoreSearch: true }).then((response) => {
    if (response) {
      link.classList.add('is-cached');
    }
  });
});
```

Once the `offline` event fires, we toggle a class on the body and visually disable all links that aren't cached. This should only apply to URLs, so we can ignore `tel:`, `mailto:` and anchor links.

```scss
.is-offline {
  /* disable all links to uncached pages */
  a:not(.is-cached) {
    cursor:not-allowed;
    pointer-events: none;
    opacity:.5;
  }
  /* ignore anchors, email and phone links */
  a[href^="#"],
  a[href^="mailto"],
  a[href^="tel"] {
    cursor:auto;
    pointer-events: auto;
    opacity:1;
  }
}
```

## Offline Forms

Another way we might use this is to prevent users from filling out forms. Most forms pass data to the server and require a connection to work, so they won't be very useful when offline. 

What's worse is that users might not know there is a problem until it's too late: imagine filling out a lengthy form and finally hitting the submit button, only to find a network connection error page and all your inputs gone. That's frustrating.

```scss
/* Disable Forms when offline */
.is-offline form {
  position:relative;
  opacity:.65;
  cursor:not-allowed;
  pointer-events:none;
  
  &::after {
    content: 'Sorry, you\'re offline.';
    display:block;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%, -50%);
    color:#FFFFFF;
    background-color:#2D2D2D;
    padding:1rem 2rem;
  }
}
```

<figure>
  <img src="{{ 'form-offline.jpg' | media(page) }}" alt="a disabled form with the words 'sorry, youre offline' in a box on top" />
  <figcaption>No contact forms in offline country.</figcaption>
</figure>

That effectively disables every form on the page, indicating that this functionality is currently not available. Depending on what your form does, you might also consider applying these styles just to the submit button - that way a user could pre-fill the form (possibly even have it validated in JS), and then submit it once they come back online.

If you're doing this, remember to suppress "submit on enter" as well, and make sure the user knows why submitting won't work at the moment.

__UPDATE:__ I found a better way to handle this - by storing form submissions in `localStorage` and then checking for them once the connection comes back online. Read about it in ["Offline-Friendly Forms"](https://mxb.at/blog/offline-forms/).

## Further Reading

* Intro: [OfflineFirst.org](http://offlinefirst.org/)
* Google Developers: [Offline Storage](https://developers.google.com/web/fundamentals/instant-and-offline/web-storage/offline-for-pwa)
* Jake Archibald at I/O 2016: [Building offline-first PWAs](https://www.youtube.com/watch?v=cmGr0RszHc8) (Video)