---
title: The CSS Mindset
tags: code
image: cover.jpg
draft: true
---

The declarative nature of CSS makes it difficult to grasp if you think about it in terms of a programming language. programming is about predictable code: a function should always receive arguments X and Y, and always return Z.

CSS on the other hand deals with an almost infinite amount of variables: screen size, dynamic content, different constraints. 

[post by Keith J. Grant](https://keithjgrant.com/posts/2019/01/css-mental-model/)

[post by rachel andrews](https://www.smashingmagazine.com/2019/01/how-to-learn-css/)

[post by robin rendle](https://css-tricks.com/the-secret-weapon-to-learning-css/) 

Don't think about it as programming the rendering of a website. CSS is more about translating a design into a set of rules that tells the browser about the designer's intention. Your goal is to write a set of instructions that is comprehensive enough to describe what you want to achieve, yet flexible enough for the browser to figure out exactly __how__ to do it.


<!--
It's a bit like a conversation between an architect and a home-owner.

You might tell the architect: "I want a house with enough space for me and my family, and I want to be able to sit outside and have BBQs in the summer." Then the architect goes to work: They look at the size of the property, how many children you have, how the rooms might fit together in the floor plan, where to put the back porch and so on, until they come up with a solution that matches your needs.

Whereas if you tell them: "build me a 217m2 house with exactly 5 rooms, a 8x10m2 garden and a shed that will contain my signature George Foreman Grill". What if you ever need to fit more people? What if you want to use the shed for something else? -->


### Everything is a Box

Think about the box. `outline: 1px dotted hotpink`

### Inheritance

Write the least amount of CSS possible. know what to declare globally and what belongs in component scope. know the defaults.

### Context

Think in parents/children. For a lot of concepts like positioning, flexbox, grid, it's imperative to understand the relationship between elements and their container. 

### Consider Different Screens

Always be aware that what you see on your dev screen is one state in a bigger spectrum. Don't style the thing on your screen, style the abstract idea of a component. Screen Sizes vary, content is dynamic. The number one mistake by designers and developers alike is assuming the thing will always look like it does in the mockup. it will not. Map out the states?

--- Image: Different Resp. States of a Header ---

### Consider Dynamic Content

Strings may be longer, Images have weird dimensions...

--- Example: Searchform with Icon, Long Search String --- 

### Find Patterns

analyse a design and take note of any concept that occurs more than once. Might be small (typographic style) or large (layout pattern) encapsulate pieces in logical groups, so they're easier to reason about (components)

--- Example: Mockup with highlighted patterns ---

### Delegate Responsibilites

Separate Layout from content in some cases: Bento Box - define a thing that just controls the spacing/alignment, then drop any element into those spaces.

--- Example Card Grid ---

### Avoid Hard Values

Magic numbers are rarely the solution. Think about what you actually want to achieve. Aspect Ratio? Equal amounts of space? Relative to Text? When you find yourself tapping the arrow key in devtools, adjusting a pixel value, that's a magic number.

--- Example Avatar Alignment ---