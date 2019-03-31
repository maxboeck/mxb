# mxb.dev

[![Netlify Status](https://api.netlify.com/api/v1/badges/57999461-2350-4da3-8788-ca4e0e6dcb30/deploy-status)](https://app.netlify.com/sites/mxb/deploys)  

Source code from [mxb.dev](https://mxb.dev)

This version is built with [Eleventy](https://www.11ty.io).

## Features

* Static Files
* BEM-flavoured Sass (w/ Embedded Critical CSS)
* Vanilla JS (ES6 / Babel)
* System Fonts & FOUT
* Offline Support w/ Service Worker
* Webmention.io Support
* Auto-publish notes on twitter via AWS Lambda Function
* Focus on Speed and Accessibility

## Installation

Eleventy is a static site generator based on Javascript, so you will need node and npm/yarn to run it.
Inside the project root, run `npm install` or `yarn` to install the dependencies.

## Getting Started

The local development environment uses gulp to process various stuff for the site.
The most important commands can be run as npm scripts:

`npm start`: make a development build and serve the site through browsersync  
`npm run build`: make a production build  
`npm run serve`: serve the current build `dist` directory  
`npm run debug`: start Eleventy in debug mode and serve the site  
`npm run serve:lambda`: serve lambda functions with netlify-lambda  
`npm run build:lambda`: compile lambda functions for production  
