---
title: Travelling
tags: general
description: "For the last couple of years, I've been fortunate enough to travel to quite a few beautiful places on this planet. Here are some of them."
---

<p class="lead">
  For the last couple of years, I've been fortunate enough to see quite a few beautiful places on this planet. 
</p>

Most of these pictures were shot by my girlfriend, Tina.

{% for img in photos %}
<figure>
    <img 
      src="{{ img.src | media(page) }}"
      alt=""
    >
    <figcaption>{{ img.caption }}</figcaption>
</figure>
{% endfor %}