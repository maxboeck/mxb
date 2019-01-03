# mxb.at

Source code for [mxb.at](https://mxb.at), my personal website.  

This version is built with [Eleventy](https://www.11ty.io). If you're looking for the previous Jekyll-based site, that repo has moved to [https://github.com/maxboeck/mxb-jekyll](https://github.com/maxboeck/mxb-jekyll)

## Features

* Static Files
* BEM-flavoured SCSS (w/ Critical Path Inlining)
* Vanilla JS (ES6 / Babel)
* System Fonts & FontFaceObserver
* Offline Support w/ Service Worker
* Focus on Speed and Accessibility

## Installation

Eleventy is a static site generator based on Javascript, so you will need node and npm/yarn to run it.
Inside the project root, run `npm install` or `yarn` to install the dependencies.

## Getting Started

The local development environment uses gulp to process various stuff for the site. 
The most important commands can be run as npm scripts:

`npm start`: does a development build and serves the site through browsersync  
`npm run build`: produces a production build  
`npm run serve`: serves the current build `dist` directory  
`npm run debug`: start Eleventy in debug mode and serves the site  
