---
title: Prototyping an App in Static HTML
slug: prototyping-app-with-static-html
category: code
image: /blog/prototyping-app-with-static-html/laptop-files.jpg
---

<p class="lead">I recently worked on a larger new web app. The product was in its early stages, so one of the first big tasks was to come up with a prototype for the UI design.</p>

I started doing some pen-and-paper mockups and some concepts in Sketch, but the project details weren't clearly defined yet, and things would change very frequently. I had to redo a lot of components or modify them often to reflect changes I've made somewhere else. It didn't feel efficient.

Essentially, I was just drawing pictures of an interface. A pixel canvas simply wasn't the right medium for this.

So I decided to design in the browser and make a clickable dummy that I could use to rapidly prototype the UI. I wanted a way to try new directions and change stuff quickly, without having to do the same tasks over and over again. 

I opted for simple static HTML.

Since the end product was going to be built in React, I though about how to best get into a workflow that matched a component-based architecture, and design elements accordingly right from the start. This approach also had some other benefits that I discovered while refining [my setup](https://github.com/maxboeck/static-prototype-kit):

* __Thinking in Components__
<br>Prototyping an application as sort of a LEGO set of individual chunks of HTML forces you to think about the building blocks early on. As every component has to be self-contained, you start to see patterns and abstractions in an interface clearer.
<br><br>
* __Design with real data__
<br>[Using mockup data](#using-realistic-data-for-ui-design) gives you the ability to see your work in "real life" conditions, rather than in a pixel-perfect dreamland. This helps to spot problematic elements that could break the design.
<br><br>
* __Version Control__
<br>Another real advantage of static files is the ability to check them into version control. Branching off to try something new or reverting back to an older design is as easy as finding the appropriate git command.
<br><br>
* __Test and Iterate__
<br>Testing responsive features on different devices works effortlessly through [BrowserSync](https://browsersync.io/), and clients can try the look and feel of things on their own laptops and iPhones - they love that 😍.

Sound good so far? Cool.<br>
So how can we best go about doing this?

---------

## Generating the Files

To build our static prototype, first we need a good templating language. My tool of choice here is [Nunjucks](https://mozilla.github.io/nunjucks/), a powerful engine built by Mozilla. It integrates nicely with node-based build setups and is crazy extensible. But, you could just as easily do this with [Liquid](http://shopify.github.io/liquid/), [Handlebars](http://handlebarsjs.com/), or the like. The only important thing to remember is that your choice of templating language shouldn't impose a particular structure on you and is flexible enough to handle anything you throw at it. 

Most of these work in a very similar way: You define templates that contain "blocks", which are dedicated areas in the markup that can then be extended by other templates, or populated with content. 

The folder structure in my setup has three main parts:

📂 __1) layout__ contains the basic templates. There is usually a base template that just holds the outermost html elements like `<head>` and `<body>` and loads the CSS and Javascript. You can then extend this base template to create other, more complex reusable layouts.

{% raw %}
```html
<!-- base.html (simplified) -->
<html>
  <head>
    <title>My Template</title>
  </head>
  <body>
    {% block content %}{% endblock %}
  </body>
</html>
```

See that `{% block %}` thing? That's where you can inject other templates to get more refined:

```html
<!-- layout-2col.html -->
{% extends "base.html" %}

{% block content %}
  <div class="container">
    <div class="row">

      <div class="col-md-9">
        {% block main %}{% endblock %}
      </div>

      <div class="col-md-3">
        {% block sidebar %}{% endblock %}
      </div>

    </div>
  </div>
{% endblock %}
```
{% endraw %}

📂 __2) components__ is the folder for all the building blocks of your application. Basically anything that can be isolated and reused goes in here. This can be stuff like headers, menus, posts, user avatars ... you get the idea. Files should be self-contained and named like the root class of the component. 

{% raw %}
```html
<!-- post.html -->
<article class="post">
  <h2 class="post__title">{{ post.title }}</h2>
  <div class="post__excerpt">{{ post.content | truncate(50) }}</div>
</article>
```

The <abbr title="Block-Element-Modifier">BEM</abbr> naming scheme really comes in handy here, because you can properly namespace your components to avoid conflicts with other ones. It's also good practice to have a separate SCSS partial for every component (`_post.scss`, `_avatar.scss`...). 

Include your new component in other templates with `{% include post.html %}`.
You can of course also have things like [loops and if statements](https://mozilla.github.io/nunjucks/templating.html#tags), and pass data to your components:

```html
<!-- variable {{post}} will be available inside post.html -->
{% for post in data %}
  {% include post.html %}
{% endfor %}
```
{% endraw %}

📂 __3) views__ is where all the different sub-pages of your app are defined. This could be stuff like `index`, `detail` or `settings`.
The templating system will look at the files in this folder and generate a matching HTML document for each of them, looking up all its dependencies (components and layouts) recursively.

The view files should ideally only arrange different components, and have very little to no markup of their own, to keep everything nice and <abbr title="Dont repeat yourself">DRY</abbr>.

## Using realistic data for UI design

Designers (myself included), sometimes tend to make things "too pretty" to produce nice-looking mockups for the client.

<figure class="extend">
  <img src="apple-watch.jpg" alt="Apple Watch Models">
  <figcaption>Look at all my cool model friends with four-letter names.</figcaption>
</figure>

In the real world however, things don't always work that way. People will have long names with non-english characters. People will upload low-resolution or no images. People will break your carefully balanced typography rules. 

And that's OK - a good design should anticipate such problems and be flexible enough to handle them. By using more realistic data right from the start, it's easier to think about these things.

Here's where static HTML prototypes shine. One of their big benefits is the ability to easily incorporate any kind of mockup data into the UI. This means you can design your application with "real life" content in mind. 

Mockup data generators like [Mockaroo](https://www.mockaroo.com/) give you a simple interface to quickly produce demo data in any structure you like. Say you needed some sample users for your app:

<figure class="extend">
  <img src="mockaroo.png" alt="The Mockaroo UI, different field types define the structure of a data ressource">
</figure>

Mockaroo lets you define your data as a collecton of fields and it has a field type for almost anything you can think of. You can generate text, images, bitcoin addresses - you name it. It can also give you a predefined percentage of random blank fields.
When you're done, save your schema (in case it changes later), and download the mock data as a JSON file.

Finally, plug that into your prototyping setup like so:

```js
//tasks/nunjucks.js
var demoUsers = require('app/data/DEMO_USERS.json');
...
gulp.task('nunjucks', function(){
  gulp.src('app/views/**/*.html')
    //this makes the data available to the templating engine
    .pipe(data(function(){
      return {
        users: demoUsers
      }
    }))
    .pipe(nunjucks())
    .pipe(gulp.dest('dist'));
});
```

Whenever your data structure changes, just update the JSON. Your demo users are now available inside all components like this:

{% raw %}
```html
<!-- user.html -->
{% set user = users | random %}
<span class="user">
  <img class="user__avatar" src="{{ user.image }}" />
  <span class="user__name">{{ user.first_name }}</span>
</span>
```
{% endraw %}

## Migrating to React

When the time comes to move things over to the final development environment, it's fairly simple to convert your components from static HTML to React. You can see by the variables contained in a file which props a component needs to receive. In many cases, you can simply copy-paste the HTML into a `render()` function as JSX. (Be sure to replace instances of `class` with `className` though).

👉🏾 In most React Setups, it's possible to colocate styles with their corresponding component, and have them in their own folder. I think it's more convenient that way. By scoping styles strictly to their own partial, reusing the `.scss` files from your static prototype is also very straightforward.

## Free Static Prototype Kit 3000™

I made a custom boilerplate based on Gulp using this approach (plus a few other goodies). It's [available on Github](https://github.com/maxboeck/static-prototype-kit), feel free to use/extend it anyway you want.