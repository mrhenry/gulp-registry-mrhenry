## What is this?

This registry holds Gulp 4 tasks for a Progressive Enhancement-based front-end workflow with the 2018 tools and standards in mind. It is heavily opinionated by the [@mrhenry](https://mrhenry.be) development team.

## Installation

Install the registry through NPM or Yarn:

```yarn add gulp gulp-registry-mrhenry --dev```

Use it as your Gulp registry in your `gulpfile.js`

```js
const gulp = require('gulp');
const MrHenry = require('gulp-registry-mrhenry');
const config = require('./gulp/config');

const tasks = new MrHenry(config);

gulp.registry(tasks);
```

Find an example config file in our [Gulp Starter](https://github.com/mrhenry/gulp-starter/blob/master/template/gulp/config.js) repository.

## Usage

Run a one-time build: `gulp`

Start the watcher `gulp watch`

### Adding custom tasks

Extending the registry with custom tasks is easy:

```js
tasks.set('my-task', myTask());
```

You can pass two options:

```js
tasks.set('my-task', myTask(), { default: true, watch: 'glob' })
```

- `default` (default: true) - should run when `gulp` or `gulp default` is run
- `watch` (mixed: string or array of strings) - glob (or array of globs) to watch for changes when `gulp watch` is run

## Docs

### CSS

CSS is being transpiled some PostCSS plugins to a final single CSS files. The processors that the source files are run through are:

**postcss-import** inlines all `@import` statements into a single CSS file.  
**cssnext** provides CSS4 compliance & runs Autoprefixer. Find [the docs here](http://cssnext.io/features/).  
**postcss-nested** enables `&` behaviour and nested `@media`-queries much like SCSS.  

A `.min.css` version of every `.css` file in the source path also gets built (powered by `cssnano`).

### Fonts

Use only in case of self-hosted fonts.

Fonts are not being modified by the `gulp fonts` task. They simply are being copied over from the source path to the destination path.

*Ask @pieterbeulque for loading approach, consider [Web Font Loader](https://github.com/typekit/webfontloader).*

### Icons

Using an external SVG with `<symbol>` definitions. External SVG means no Internet Explorer support. If you want to support icons in IE too, include [svg4everybody](https://jonathantneal.github.io/svg4everybody/) in your primary scripts.

### Images

Images are run through [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin), which is capable of optimizing GIF, JPG, PNG & SVG assets. Try to use SVG as much as possible, and always question if inlining the SVG is not a better option.

### Javascript

We are trying out a progressive enhancement approach through [Custom Elements v1](https://developers.google.com/web/fundamentals/getting-started/primers/customelements). Benefits include a 100% compatibility with the resilient approach we base a lot of our stuff on (if the browser doesn't support it, it behaves like a simple div), a clear syntax & an upcoming standard (so future-proof) without locking into any framework.

Running `gulp javascript` triggers both an ES6 and Babel task.  
The `gulp javascript:es6` task uses [Rollup](https://github.com/rollup/rollup) to bundle all `import` statements and tree-shake dead code.  
The `gulp javascript:babel` task runs Browserify to create an ES5 compatible bundle with module management etc.

Both tasks also include a minified file (through `babel-minify` for the ES6 bundle & `uglify` for the ES5 bundle).

This leaves us with four files: `app.es6.js`, `app.es6.min.js`, `app.js` & `app.min.js`.

In our website we can do some easy mustard-cutting on Custom Elements support to load the ES6 bundle, or choose for the neccessary polyfills and the ES5 bundle.  

```html
<script>
  // Mustard Cutting. If we support native Custom Elements (v1)
  // we assume decent ES2015 support & load in the Rollup bundle
  // Else, we load a fallback & run the transpiled bundle from Babel
  if ('customElements' in window) {
    document.write('<script src="assets/js/app.es6.js" defer><\/script>');
  } else {
    if (!('MutationObserver' in window)) {
      // Don't even try to polyfill
      return;
    }

    document.write('<script src="assets/js/custom-elements.js" defer><\/script>');
    document.write('<script src="assets/js/app.js" defer><\/script>');
  }
</script>
```

This is mandatory because using the Custom Elements native implementation (in e.g. Chrome) needs to be done in an ES6 way (using `new`), which is impossible with the ES5 bundle (that does something like `FooBar.prototype.constructor.call(this)`).

## Roadmap

### Fonts

- Figure out an easy way to split a font in a base64-encoded basic subset (a-zA-Z0-9) & full Western font ([Chinese plugin for 'reference'](https://github.com/aui/gulp-font-spider))

## Troubleshooting

### Upgrading to Gulp 4 broke things for me!

Re-install Gulp globally, your older projects should still work (using the node_modules installed Gulp 3)

```
npm rm -g gulp
rm /usr/local/share/man/man1/gulp.1
npm i -g gulp-cli
```

### Node & Yarn setup

When you install Yarn through Homebrew, it also pulls in the latest Node.js version (through Homebrew). This causes some issues when you already run a version of Node.js that has not been installed with Homebrew.

The easiest way I made this work was [follow these instructions to uninstall Node.js](http://stackoverflow.com/questions/11177954/how-do-i-completely-uninstall-node-js-and-reinstall-from-beginning-mac-os-x/11178106#11178106) & then simply run `$ brew install yarn`. It sets up everything for you. You will still have to install Gulp globally either through Yarn or NPM.

### Other questions

Get in touch with [@pieterbeulque](https://github.com/pieterbeulque).
