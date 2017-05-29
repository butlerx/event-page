# Events Page

Static event page generator using handlebar.js

## Installation

    yarn add event-page

## Usage

To build your page, from Command line run:

    event-gen

or from node

```javascript
const event = ('event-page');

event({
  title: "Amazing event",
  source: "source",
  output: {
    dir: "public",
    css: "main.css",
  }
  schema: "./schema.json",
  menu: [{
    title: "Home",
    url: ""
  }, {
    "title": "Speaker List",
    "url": "Speakers"
  }, {
    "title": "Call For Talks",
    "url": "CFT"
  }],
  theme: 'theme',
  helper: 'helpers',
  templates: 'templates',
  css: 'main.scss',
  static: [ 'js', 'fonts', 'images'],
});
```
