interface Browser {
  name: string;
  version?: string;
}


const commonVersionIdentifier = /version\/(\d+)/i;
const blank = null;

const test = (re: RegExp) => re.test(ua);
const m1 = () => RegExp.$1 || '';
const ua = navigator.userAgent;

let browser: Browser | null;

/**
 * Get first matched item for a string
 */
const getFirstMatch = (regexp: RegExp): string => {
  test(regexp);
  return m1();
}

const build = (n: string, v: string | undefined): null => {
  browser = { name: n, version: v };
  return blank;
}

let dummy = blank;

/* Googlebot */
if (test(/googlebot\/(\d+)/i)) {
  dummy = build(
    'googlebot',
    m1() || getFirstMatch(commonVersionIdentifier)
  );
}

/* Opera < 13.0 */
else if (test(/opera/i)) {
  dummy = build(
    'opera',
    getFirstMatch(commonVersionIdentifier) || getFirstMatch(/(?:opera)[\s/](\d+)/i),
  );
}

/* Opera > 13.0 */
else if (test(/(?:opr|opios)(?:[\s/](\d+))?/i)) {
  dummy = build(
    'opera',
    m1() || getFirstMatch(commonVersionIdentifier),
  );
}

else if (test(/SamsungBrowser/i)) {
  dummy = build(
    'samsung',
    getFirstMatch(commonVersionIdentifier) || getFirstMatch(/(?:SamsungBrowser)[\s/](\d+)/i),
  );
}

else if (test(/Whale|MZBrowser|focus|swing|coast|yabrowser/i)) {
  dummy = blank;
}

else if (test(/ucbrowser/i)) {
  dummy = build(
    'uc',
    getFirstMatch(commonVersionIdentifier) || getFirstMatch(/(?:ucbrowser)[\s/](\d+)/i),
  );
}

else if (test(/Maxthon|mxios|epiphany|puffin|sleipnir|k-meleon|micromessenger|msie|trident/i)) {
  dummy = blank;
}

else if (test(/edg([ea]|ios)\/(\d+)/i)) {
  dummy = build(
    'edge',
    RegExp.$2 || '',
  );
}

else if (test(/vivaldi|seamonkey|sailfish|silk|phantom|slimerjs|blackberry|\bbb\d+|rim\stablet|(web|hpw)[o0]s|bada|tizen|qupzilla/i)) {
  dummy = blank;
}

else if (test(/(?:firefox|iceweasel|fxios)[\s/](\d+)/i)) {
  dummy = build(
    'ff',
    m1(),
  );
}

else if (test(/chromium/i)) {
  dummy = blank;
}

else if (test(/(?:chrome|crios|crmo)\/(\d+)/i)) {
  dummy = build(
    'chrome',
    m1(),
  );
}

/* Android Browser */
else if (!test(/like android/i) && test(/android/i)) {
  dummy = blank;
}

/* Safari */
else if (test(/safari|applewebkit/i)) {
  dummy = build(
    'safari',
    getFirstMatch(commonVersionIdentifier),
  );
}

/* Something else */
else {
  dummy = blank;
}

export default browser!;
