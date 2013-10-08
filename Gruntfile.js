'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var config = {
  app: 'app',
  dist: 'dist',
  assets: 'assets',
  bower: '_components'
};

if(typeof config.assets === 'string' && config.assets.length > 0) {
  config.assetsPath = config.app + '/' + config.assets;
}

/**
 *
 * Directory reference
 * ======================
 *
 * assets: assets
 * bower: _components
 * css: css
 * compass: _scss
 * javascript: js
 * images: image
 * fonts: fonts
 *
 */

module.exports = function (grunt) {

  // Configuration
  grunt.initConfig({
    jpress: config,
    pkg: grunt.file.readJSON('package.json'),
    tag: {
      banner: '/*!\n' +
              ' * <%= pkg.name %>\n' +
              ' * <%= pkg.title %>\n' +
              ' * <%= pkg.url %>\n' +
              ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
              ' * @version <%= pkg.version %>\n' +
              ' * Copyright <%= pkg.copyright %>. <%= pkg.license %> licensed.\n' +
              ' */\n'
    },
    watch: {
      compass: {
        files: ['<%= jpress.app %>/<%= jpress.assets %>/_scss/**/*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer:server']
      },
      prefixCss: {
        files: ['<%= jpress.app %>/<%= jpress.assets %>/css/**/*.css'],
        tasks: ['copy:stageCss', 'autoprefixer:server']
      },
      jekyll: {
        files: ['<%= jpress.app %>/**/*.{html,yml,md,mkd,markdown}',
                '_config.yml',
                '!<%= jpress.app %>/<%= jpress.assets %>/<%= jpress.bower %>'],
        tasks: ['jekyll:server']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '{.tmp,<%= jpress.app %>}/**/*.{html,css,js,gif,jpg,jpeg,png,svg,webp}'
        ]
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change hostname to null to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, '.jekyll'),
              mountFolder(connect, config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, config.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    // Running Jekyll also cleans all non-git files from the target directory
    // If you've added anything to Jekyll's 'keep_files', add them here as well.
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= jpress.dist %>/*',
            '!<%= jpress.dist %>/.git*'
          ]
        }]
      },
      server: ['.tmp', '.jekyll']
    },
    compass: {
      options: {
        // If you're using global Sass gems, require them here, e.g.:
        // require: ['singularity', 'jacket'],
        bundleExec: true,
        sassDir: '<%= jpress.app %>/<%= jpress.assets %>/_scss',
        cssDir: '.tmp/<%= jpress.assets %>/css',
        imagesDir: '<%= jpress.app %>/<%= jpress.assets %>/image',
        fontsDir: '<%= jpress.app %>/<%= jpress.assets %>/fonts',
        javascriptsDir: '<%= jpress.app %>/<%= jpress.assets %>/js',
        relativeAssets: false,
        httpImagesPath: '<%= jpress.app %>/<%= jpress.assets %>/image',
        httpGeneratedImagesPath: '<%= jpress.app %>/<%= jpress.assets %>/image/generated',
        outputStyle: 'expanded',
        raw: 'asset_cache_buster :none \nextensions_dir = "<%= jpress.app %>/<%= jpress.assets %>/<%= jpress.bower %>"\n'
      },
      dist: {
        options: {
          environment: 'production',
          noLineComments: true,
          outputStyle: 'compressed',
          generatedImagesDir: '<%= jpress.dist %>/<%= jpress.assets %>/image/generated'
        }
      },
      server: {
        options: {
          trace: true,
          debugInfo: true,
          generatedImagesDir: '.tmp/<%= jpress.assets %>/image/generated'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 version', 'ie 8', "> 1%"]
      },
      dist: {
        expand: true,
        flatten: true,
        src: '<%= jpress.dist %>/<%= jpress.assets %>/css/**/*.css',
        dest: '<%= jpress.dist %>/<%= jpress.assets %>/css'
      },
      server: {
        expand: true,
        cwd: '.tmp/<%= jpress.assets %>/css',
        src: '.tmp/<%= jpress.assets %>/css/**/*.css',
        dest: '.tmp/<%= jpress.assets %>/css'
      }
    },
    jekyll: {
      options: {
        bundleExec: true,
        src : '<%= jpress.app %>'
      },
      dist: {
        options: {
          dest: '<%= jpress.dist %>',
          config: '_config.yml,_config.build.yml'
        }
      },
      server: {
        options: {
          dest: '.jekyll',
          config: '_config.yml'
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '{.tmp,<%= jpress.app %>}/<%= jpress.assets %>/js/**/*.js',
        '!<%= jpress.app %>/<%= jpress.assets %>/<%= jpress.bower %>/**/*'
      ],
      report: [
        '{.tmp,<%= jpress.app %>}/<%= jpress.assets %>/js/**/*.js'
      ]
    },
    csscss: {
      options: {
        bundleExec: true,
        minMatch: 2,
        ignoreSassMixins: false,
        compass: true,
        colorize: true,
        shorthand: false,
        verbose: true
      },
      // Add files to be tested here
      report: {
       src: ['<%= jpress.app %>/<%= jpress.assets %>/css/**/*.css',
             '<%= jpress.app %>/<%= jpress.assets %>/_scss/**/*.{scss,sass}']
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      report: {
        src: ['{.tmp,<%= jpress.app %>}/<%= jpress.assets %>/css/**/*.css']
      }
    },
    // UseminPrepare will only scan one page for usemin blocks. If you have
    // usemin blocks that aren't used in index.html, create a usemin manifest
    // page (hackery!) and point this task there.
    useminPrepare: {
      options: {
        dest: '<%= jpress.dist %>'
      },
      html: '<%= jpress.dist %>/index.html'
    },
    usemin: {
      options: {
          basedir: '<%= jpress.dist %>',
          dirs: ['<%= jpress.dist %>/**/*']
      },
      html: ['<%= jpress.dist %>/**/*.html'],
      css: ['<%= jpress.dist %>/<%= jpress.assets %>/css/**/*.css']
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= jpress.dist %>',
          src: '**/*.html',
          dest: '<%= jpress.dist %>'
        }]
      }
    },
    // Usemin adds files to concat
    concat: {
      options: {
        stripBanners: true,
        nonull: true,
        banner: '<%= tag.banner %>'
      }
    },
    // Usemin adds files to uglify
    uglify: {
      options: {
        banner: '<%= tag.banner %>'
      }
    },
    // Usemin adds files to cssmin
    cssmin: {
      dist: {
        options: {
          anner: '<%= tag.banner %>',
          report: 'gzip'
        }
      }
    },
    imagemin: {
      dist: {
        options: {
          progressive: true
        },
        files: [{
          expand: true,
          cwd: '<%= jpress.dist %>',
          src: '**/*.{jpg,jpeg,png}',
          dest: '<%= jpress.dist %>'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= jpress.dist %>',
          src: '**/*.svg',
          dest: '<%= jpress.dist %>'
        }]
      }
    },
    compress: {
      dist: {
        options: {
          mode: 'gzip'
        },
        expand: true,
        cwd: '<%= jpress.dist %>',
        src: ['**/*.{svg,js,css}'],
        dest: '<%= jpress.dist %>'
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= jpress.app %>',
          src: [
            // Jekyll moves all html and text files. Usemin moves css and js
            // files with concat. Add other files and patterns your site
            // reqires for distrobution here, e.g., Bower components that
            // aren't in a usemin block.
            '<%= jpress.assets %>/<%= jpress.bower %>/jquery.min.js',
            // Copy moves asset files and directories
            '*.{ico,png}',
            '<%= jpress.assets %>/image/**/*',
            '<%= jpress.assets %>/fonts/**/*'
          ],
          dest: '<%= jpress.dist %>'
        }]
      },
      // Copy css into .tmp directory for processing
      stageCss: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= jpress.app %>/<%= jpress.assets %>/css',
          src: '**/*.css',
          dest: '.tmp/<%= jpress.assets %>/css'
        }]
      }
    },
    rev: {
      options: {
        length: 4
      },
      dist: {
        files: {
          src: [
            '<%= jpress.dist %>/<%= jpress.assets %>/js/**/*.js',
            '<%= jpress.dist %>/<%= jpress.assets %>/css/**/*.css',
            '<%= jpress.dist %>/<%= jpress.assets %>/image/**/*.{gif,jpg,jpeg,png,svg,webp}',
            '<%= jpress.dist %>/<%= jpress.assets %>/fonts/**/*.{eot*,svg,ttf,woff}'
          ]
        }
      }
    },
    concurrent: {
      server: [
        'compass:server',
        'copy:stageCss',
        'jekyll:server'
      ],
      dist: [
        'compass:dist',
        'copy:dist'
      ]
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Define Tasks
  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'open', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('report', [
    'clean:server',
    'compass:server',
    'jshint:report',
    'csscss:report',
    'csslint:report'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    // Jekyll cleans all non-git files from the target directory, so must run first
    'jekyll:dist',
    'concurrent:dist',
    'useminPrepare',
    'concat',
    'autoprefixer:dist',
    'cssmin',
    'uglify',
    'imagemin',
    'svgmin',
    'rev',
    'usemin',
    'htmlmin',
    'compress'
    ]);

  grunt.registerTask('default', [
    'report',
    'build'
  ]);
};
