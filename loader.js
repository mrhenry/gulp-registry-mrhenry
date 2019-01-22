var browserVersion=function(){"use strict";function a(a,b){var c=function(a){return a.init&&a.init(),a},d=a[a.length-1];if(!b||!b.version)return c(d);for(var h in a){var e=a[h],f=e.browsers;if(f&&f[b.name]){var g=f[b.name];if(+g<=+b.version)return c(e)}}return c(d)}var b,c=/version\/(\d+)/i,d=null,e=function(a){return a.test(g)},f=function(){return RegExp.$1||""},g=navigator.userAgent,h=function(a){return e(a),f()},i=function(a,c){return b={name:a,version:c},d};e(/googlebot\/(\d+)/i)?i("googlebot",f()||h(c)):e(/opera/i)?i("opera",h(c)||h(/(?:opera)[\s/](\d+)/i)):e(/(?:opr|opios)(?:[\s/](\d+))?/i)?i("opera",f()||h(c)):e(/SamsungBrowser/i)?i("samsung",h(c)||h(/(?:SamsungBrowser)[\s/](\d+)/i)):e(/Whale|MZBrowser|focus|swing|coast|yabrowser/i)?d:e(/ucbrowser/i)?i("uc",h(c)||h(/(?:ucbrowser)[\s/](\d+)/i)):e(/Maxthon|mxios|epiphany|puffin|sleipnir|k-meleon|micromessenger|msie|trident/i)?d:e(/edg([ea]|ios)\/(\d+)/i)?i("edge",RegExp.$2||""):e(/vivaldi|seamonkey|sailfish|silk|phantom|slimerjs|blackberry|\bbb\d+|rim\stablet|(web|hpw)[o0]s|bada|tizen|qupzilla/i)?d:e(/(?:firefox|iceweasel|fxios)[\s/](\d+)/i)?i("ff",f()):e(/chromium/i)?d:e(/(?:chrome|crios|crmo)\/(\d+)/i)?i("chrome",f()):!e(/like android/i)&&e(/android/i)?d:e(/safari|applewebkit/i)?i("safari",h(c)):d;var j=function(c){return a(c,b)},k={current:b,select:j};return k}();


(function(w, d) {
  // Mustard Cutting.
  // Bye, bye, IE9 & 10
  if (('MutationObserver' in w)) {
    d.documentElement.classList.remove('no-js');

    function loadScript(src, async, defer) {
      async = typeof async ==='undefined' ? true : !!async;
      defer = typeof defer === 'undefined' ? true : !!defer;

      var s = d.createElement('script');
      s.async = async;
      s.defer = defer;
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
    }])

    target.init();
  }
})(window, document);
