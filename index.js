'use strict'

let gulp = require("gulp");
let babel = require("gulp-babel");
let gutil = require("gulp-util");
let isProduction = () => {
	return (gutil.env.type == "production") || process.env['NODE_ENV'] == '__production';
}

let uglify;
let minify;
let del;

let uglifyjs = require('uglify-js');
let minifier = require('gulp-uglify/minifier');

if (isProduction()) {
	del = require("del");
	uglify = require("gulp-uglify");
	minify = require("gulp-minify");
}

gulp.task("es6-js", function () {
	let production = isProduction();
	console.log("PROD:", production);
	let src = ["src/**/*.js"];
	let plg = ["transform-strict-mode"];

	if (!production) {
		src.push("tests/**/*.js");
	}

	return gulp.src(src)
		.pipe(babel({
			"presets": ["es2015"],
			"babelrc": false,
			"plugins": plg
		}))
		.pipe(production ? minifier({}, uglifyjs) : gutil.noop())
		.pipe(gulp.dest("build"))
		.on('end', function () {
			console.log('end build');
			if (!production) return;
			console.log("Deleting sources...");

			return del(["src", "tests"]);
		});
});

gulp.task("json", function () {
	return gulp.src(["src/**/*.json"])
		.pipe(gulp.dest("build"));
});

gulp.task('default', ['es6-js', 'json']);
