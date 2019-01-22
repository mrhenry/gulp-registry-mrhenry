import { Browser } from "./index";

export interface Target {
  browsers?: { [key: string]: string };
  init?: () => void;
}

export function select(targets: Target[], browser: Browser | null): Target {
  const init = (t: Target) => {
    if (t.init) { t.init(); }
    return t;
  };

  const fallback = targets[targets.length - 1];
  if (!browser || !browser.version) {
    return init(fallback);
  }

  for (let i in targets) {
    let target = targets[i];
    let browsers = target.browsers;

    if (!browsers || !browsers[browser.name]) {
      continue;
    }

    let minVersion = browsers[browser.name];
    if (Number(minVersion) <= Number(browser.version)) {
      return init(target);
    }
  }

  return init(fallback);
}
