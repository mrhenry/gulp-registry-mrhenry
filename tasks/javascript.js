const gulp = require('gulp');

const buffer = require('vinyl-buffer');
const rename = require('gulp-rename');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const terser = require('rollup-plugin-terser').terser;
const rollup = require('gulp-better-rollup');
// const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');

module.exports = (config) => {
  const {
    src,
    dest,
    browsers,
  } = config;

  const pipeline = (targets, suffix) => {
    const step1 = gulp.src(src)
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(rollup({
        plugins: [
          resolve({
            browser: true
          }),
          commonjs({
            sourceMap: true
          }),
          babel({
            babelrc: false,
            exclude: [
              'node_modules/@babel/**',
              'node_modules/core-js/**',
              'node_modules/regenerator-runtime/**',
            ],
            presets: [

              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  ignoreBrowserslistConfig: true,
                  targets: targets,
                }
              ],

            ]
          }),
          terser(),
        ],
      }, {
        format: 'iife',
      }));

    const step2 = suffix ? step1.pipe(rename({
      suffix: suffix
    })) : step1;

    return step2
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(dest));
  };

  const modern = () => {
    const selector = require('./targets').modern;
    return pipeline(toBrowserList(selector), '.es6');
  }

  const legacy = () => {
    return pipeline(browsers);
  }

  return {
    modern,
    legacy
  };
};

function toBrowserList(target) {
  let l = [];

  if (target.chrome) {
    l.push(`chrome >= ${target.chrome}`);
    l.push(`and_chr >= ${target.chrome}`);
  }

  if (target.ff) {
    l.push(`ff >= ${target.ff}`);
    l.push(`and_ff >= ${target.ff}`);
  }

  if (target.safari) {
    l.push(`safari >= ${target.safari}`);
    l.push(`ios_saf >= ${target.safari}`);
  }

  if (target.opera) {
    l.push(`opera >= ${target.opera}`);
  }

  if (target.samsung) {
    l.push(`Samsung >= ${target.samsung}`);
  }

  if (target.uc) {
    l.push(`and_uc >= ${target.uc}`);
  }

  return l.join(', ');
}
