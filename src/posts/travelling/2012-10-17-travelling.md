---
title: Travelling
tags: general
---

<p class="lead">
  For the last couple of years, I've been fortunate enough to see quite a few beautiful places on this planet. <a href="#copyright"><sup>*</sup></a> 
</p>

{% for img in photos %}
<figure>
    <img 
      src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" 
      data-src={{ img.src | media(page) }} 
      class="lazyload" 
      alt=""
    >
    <figcaption>{{ img.caption }}</figcaption>
</figure>
{% endfor %}

<p id="copyright"><sup style="color:#fc6767;">*</sup> Most of these pictures were shot by my girlfriend, Tina.</p>