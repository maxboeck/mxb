'use strict'

import gulp from 'gulp'
import gutil from 'gulp-util'
import swPrecache from 'sw-precache'
import path from 'path'

function writeServiceWorkerFile(rootDir, handleFetch, callback) {
    const config = {
        cacheId: 'mxb',
        handleFetch,
        logger: gutil.log,
        staticFileGlobs: [
            `${rootDir}/index.html`,
            `${rootDir}/{blog,about,contact}/*.html`,
            `${rootDir}/assets/{css,js,icons,fonts}/*`,
            `${rootDir}/assets/images/featured/*`
        ],
        stripPrefix: `${rootDir}/`,
        verbose: true
    }

    swPrecache.write(path.join(rootDir, 'sw.js'), config, callback)
}

gulp.task('precache', cb => {
    writeServiceWorkerFile('_site', false, cb)
})

gulp.task('precache:prod', cb => {
    writeServiceWorkerFile('_site', true, cb)
})
