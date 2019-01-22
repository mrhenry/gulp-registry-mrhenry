## What is this?

This registry holds Gulp 4 tasks for a Progressive Enhancement-based front-end workflow with the 2018 tools and standards in mind. It is heavily opinionated by the [@mrhenry](https://mrhenry.be) development team.

## Installation

First of all, install these third party dependencies.

```brew install graphicsmagick```

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
**postcss-preset-env** provides CSS4 compliance & runs Autoprefixer. Find [the docs here](https://preset-env.cssdb.org/).  
**postcss-nested** enables `&` behaviour and nested `@media`-queries much like SCSS.  

A `.min.css` version of every `.css` file in the source path also gets built (powered by `clean-css`).

### Favicons

Add a `favicon.png` 512×512 and a no color, single path, 16×16 `favicon.svg` to your `gulp/assets/favicons` folder and a variety of sizes for all modern devices will be generated.

There are two options that you can add to `config.js`:

 - `backgroundColor`: specify the background color for the non-transparent icons
 - `padding`: the resize ratio to render some padding (a number between 0 and 1)

*Having trouble running this task? Make sure `graphicsmagick` is installed on your computer.*

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
var browserVersion=function(){"use strict";function a(a,b){var c=function(a){return a.init&&a.init(),a},d=a[a.length-1];if(!b||!b.version)return c(d);for(var h in a){var e=a[h],f=e.browsers;if(f&&f[b.name]){var g=f[b.name];if(+g<=+b.version)return c(e)}}return c(d)}var b,c=/version\/(\d+)/i,d=null,e=function(a){return a.test(g)},f=function(){return RegExp.$1||""},g=navigator.userAgent,h=function(a){return e(a),f()},i=function(a,c){return b={name:a,version:c},d};e(/googlebot\/(\d+)/i)?i("googlebot",f()||h(c)):e(/opera/i)?i("opera",h(c)||h(/(?:opera)[\s/](\d+)/i)):e(/(?:opr|opios)(?:[\s/](\d+))?/i)?i("opera",f()||h(c)):e(/SamsungBrowser/i)?i("samsung",h(c)||h(/(?:SamsungBrowser)[\s/](\d+)/i)):e(/Whale|MZBrowser|focus|swing|coast|yabrowser/i)?d:e(/ucbrowser/i)?i("uc",h(c)||h(/(?:ucbrowser)[\s/](\d+)/i)):e(/Maxthon|mxios|epiphany|puffin|sleipnir|k-meleon|micromessenger|msie|trident/i)?d:e(/edg([ea]|ios)\/(\d+)/i)?i("edge",RegExp.$2||""):e(/vivaldi|seamonkey|sailfish|silk|phantom|slimerjs|blackberry|\bbb\d+|rim\stablet|(web|hpw)[o0]s|bada|tizen|qupzilla/i)?d:e(/(?:firefox|iceweasel|fxios)[\s/](\d+)/i)?i("ff",f()):e(/chromium/i)?d:e(/(?:chrome|crios|crmo)\/(\d+)/i)?i("chrome",f()):!e(/like android/i)&&e(/android/i)?d:e(/safari|applewebkit/i)?i("safari",h(c)):d;var j=function(c){return a(c,b)},k={current:b,select:j};return k}();

(function(w, d) {
  // Mustard Cutting.
  // Bye, bye, IE9 & 10
  if (('MutationObserver' in w)) {
    d.documentElement.classList.remove('no-js');

    function loadScript(src, _async, _defer) {
      var s = d.createElement('script');
      s.async = _async === undefined ? true : !!_async;
      s.defer = _defer === undefined ? true : !!_defer;
      s.src = src;
      var f = d.getElementsByTagName('script')[0];
      f.parentNode.insertBefore(s, f);
    };

    function loadCustomElements() {
      if ('customElements' in w) {
        return;
      }
      loadScript('https://cdn.rawgit.com/webcomponents/custom-elements/6ad99939/custom-elements.min.js', false, true);
    }

    const target = browserVersion.select([{
      browsers: {
        'chrome': '70',
        'ff': '63',
        'safari': '12',
        'opera': '56',
        'samsung': '7',
        'uc': '11'
      },
      init: function() {
        loadCustomElements();
        loadScript('{{ asset_url }}/assets/js/app.es6.min.js', true, false);
      }
    }, {
      init: function() {
        loadScript('https://cdn.polyfill.io/v2/polyfill.min.js?features=default-3.6,Symbol,fetch,Array.prototype.includes,Array.prototype.find,Object.entries&flags=gated&version=latest&unknown=polyfill', false, true);
        loadCustomElements();
        loadScript('{{ asset_url }}/assets/js/app.min.js', false, true);
      }
    }]);
  }
})(window, document);
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
