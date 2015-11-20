//'use strict';
//
//// # Globbing
//// for performance reasons we're only matching one level down:
//// 'test/spec/{,*/}*.js'
//// use this if you want to recursively match all subfolders:
//// 'test/spec/**/*.js'
//
//module.exports = function (grunt) {
//
//    // Load grunt tasks automatically
//    require('load-grunt-tasks')(grunt);
//
//    // Time how long tasks take. Can help when optimizing build times
//    require('time-grunt')(grunt);
//
//    // Configurable paths for the application
//    var grapheConfig = {
//        appPath: require('./bower.json').appPath || 'src',
//        distPath: 'dist'
//    };
//
//    // Define the configuration for all the tasks
//    grunt.initConfig({
//
//        // Project settings
//        grapheConfig: grapheConfig,
//
//        // Watches files for changes and runs tasks based on the changed files
//        watch: {
//            options: {
//               // spawn: false,
//                reload: true
//            },
//            bower: {
//                files: ['bower.json'],
//                tasks: ['wiredep']
//            },
//            js: {
//                files: ['!<%= grapheConfig.appPath %>/**/*_test.js',
//                    '<%= grapheConfig.appPath %>/app/**/*.js',
//                    '<%= grapheConfig.appPath %>/components/**/*.js'
//                    ],
//                //tasks: ['newer:jshint:all'],
//                options: {
//                    livereload: '<%= connect.options.livereload %>'
//                }
//            },
//            jsTest: {
//                files: ['**/*_test.js'],
//                tasks: [
//                    //'newer:jshint:test',
//                    'karma']
//            },
//            styles: {
//                files: ['<%= grapheConfig.appPath %>/**/*.css'],
//                tasks: ['newer:copy:styles', 'autoprefixer']
//            },
//            gruntfile: {
//                files: ['Gruntfile.js']
//            },
//            livereload: {
//                options: {
//                    livereload: '<%= connect.options.livereload %>'
//                },
//                files: [
//                    '<%= grapheConfig.appPath %>/**/*.html',
//                    '.tmp/styles/{,*/}*.css',
//                    '<%= grapheConfig.appPath %>/content/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
//                ]
//            }
//        },
//
//        // The actual grunt server settings
//        connect: {
//            options: {
//                port: 9000,
//                // Change this to '0.0.0.0' to access the server from outside.
//                hostname: 'localhost',
//                livereload: 35729
//            },
//            livereload: {
//                options: {
//                    open: true,
//                    middleware: function (connect) {
//                        return [
//                            connect.static('.tmp'),
//                            connect().use(
//                                '/bower_components',
//                                connect.static('./bower_components')
//                            ),
//                            connect().use(
//                                '/assets/styles',
//                                connect.static('./assets/styles')
//                            ),
//                            connect.static(grapheConfig.appPath)
//                        ];
//                    }
//                }
//            },
//            test: {
//                options: {
//                    port: 9001,
//                    middleware: function (connect) {
//                        return [
//                            connect.static('.tmp'),
//                            connect.static('test'),
//                            connect().use(
//                                '/bower_components',
//                                connect.static('./bower_components')
//                            ),
//                            connect.static(grapheConfig.appPath)
//                        ];
//                    }
//                }
//            },
//            dist: {
//                options: {
//                    open: true,
//                    base: '<%= grapheConfig.distPath %>'
//                }
//            }
//        },
//
//        //Make sure code styles are up to par and there are no obvious mistakes
//        jshint: {
//            options: {
//                jshintrc: '.jshintrc',
//                reporter: require('jshint-stylish')
//            },
//            all: {
//                src: [
//                    'Gruntfile.js',
//                    '<%= grapheConfig.appPath %>/**/*.js'
//                ]
//            },
//            test: {
//                options: {
//                    jshintrc: '.jshintrc'
//                },
//                src: ['**/*_test.js']
//            }
//        },
//
//        // Empties folders to start fresh
//        clean: {
//            dist: {
//                files: [{
//                    dot: true,
//                    src: [
//                        '!<%= grapheConfig.distPath %>/.git{,*/}*',
//                        '.tmp',
//                        '<%= grapheConfig.distPath %>/{,*/}*'
//
//                    ]
//                }]
//            },
//            server: '.tmp'
//        },
//
//        // Add vendor prefixed styles
//        autoprefixer: {
//            options: {
//                browsers: ['last 1 version']
//            },
//            server: {
//                options: {
//                    map: true
//                },
//                files: [{
//                    expand: true,
//                    cwd: '.tmp/styles/',
//                    src: '{,*/}*.css',
//                    dest: '.tmp/styles/'
//                }]
//            },
//            dist: {
//                files: [{
//                    expand: true,
//                    cwd: '.tmp/styles/',
//                    src: '{,*/}*.css',
//                    dest: '.tmp/styles/'
//                }]
//            }
//        },
//
//        // Automatically inject Bower components into the app
//        wiredep: {
//            app: {
//                src: ['<%= grapheConfig.appPath %>/index.html'],
//                ignorePath:  /\.\.\//
//            },
//            test: {
//                devDependencies: true,
//                src: '<%= karma.unit.configFile %>',
//                ignorePath:  /\.\.\//,
//                fileTypes:{
//                    js: {
//                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
//                        detect: {
//                            js: /'(.*\.js)'/gi
//                        },
//                        replace: {
//                            js: '\'{{filePath}}\','
//                        }
//                    }
//                }
//            }
//        },
//
//        // Renames files for browser caching purposes
//        filerev: {
//            dist: {
//                src: [
//                    '<%= grapheConfig.distPath %>/scripts/{,*/}*.js',
//                    '<%= grapheConfig.distPath %>/styles/{,*/}*.css',
//                    '<%= grapheConfig.distPath %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
//                    '<%= grapheConfig.distPath %>/styles/fonts/*'
//                ]
//            }
//        },
//
//        // Reads HTML for usemin blocks to enable smart builds that automatically
//        // concat, minify and revision files. Creates configurations in memory so
//        // additional tasks can operate on them
//        useminPrepare: {
//            html: '<%= grapheConfig.appPath %>/index.html',
//            options: {
//                dest: '<%= grapheConfig.distPath %>',
//                flow: {
//                    html: {
//                        steps: {
//                            js: ['concat', 'uglifyjs'],
//                            css: ['cssmin']
//                        },
//                        post: {}
//                    }
//                }
//            }
//        },
//
//        // Performs rewrites based on filerev and the useminPrepare configuration
//        usemin: {
//            html: ['<%= grapheConfig.distPath %>/{,*/}*.html'],
//            css: ['<%= grapheConfig.distPath %>/styles/{,*/}*.css'],
//            options: {
//                assetsDirs: [
//                    '<%= grapheConfig.distPath %>',
//                    '<%= grapheConfig.distPath %>/images',
//                    '<%= grapheConfig.distPath %>/styles'
//                ]
//            }
//        },
//
//        //The following *-min tasks will produce minified files in the dist folder
//        //By default, your `index.html`'s <!-- Usemin block --> will take care of
//        //minification. These next options are pre-configured if you do not wish
//        //to use the Usemin blocks.
//        cssmin: {
//            dist: {
//                files: {
//                    '<%= grapheConfig.distPath %>/styles/main.css': [
//                        '.tmp/styles/{,*/}*.css'
//                    ]
//                }
//            }
//        },
//        uglify: {
//            dist: {
//                files: {
//                    '<%= grapheConfig.distPath %>/scripts/scripts.js': [
//                        '<%= grapheConfig.distPath %>/scripts/scripts.js'
//                    ]
//                }
//            }
//        },
//        concat: {
//            dist: {}
//        },
//
//        imagemin: {
//            dist: {
//                files: [{
//                    expand: true,
//                    cwd: '<%= grapheConfig.appPath %>/images',
//                    src: '{,*/}*.{png,jpg,jpeg,gif}',
//                    dest: '<%= grapheConfig.distPath %>/images'
//                }]
//            }
//        },
//
//        svgmin: {
//            dist: {
//                files: [{
//                    expand: true,
//                    cwd: '<%= grapheConfig.appPath %>/images',
//                    src: '{,*/}*.svg',
//                    dest: '<%= grapheConfig.distPath %>/images'
//                }]
//            }
//        },
//
//        htmlmin: {
//            dist: {
//                options: {
//                    collapseWhitespace: true,
//                    conservativeCollapse: true,
//                    collapseBooleanAttributes: true,
//                    removeCommentsFromCDATA: true,
//                    removeOptionalTags: true
//                },
//                files: [{
//                    expand: true,
//                    cwd: '<%= grapheConfig.distPath %>',
//                    src: ['**/*.html'],
//                    dest: '<%= grapheConfig.distPath %>'
//                }]
//            }
//        },
//
//        // ng-annotate tries to make the code safe for minification automatically
//        // by using the Angular long form for dependency injection.
//        ngAnnotate: {
//            dist: {
//                files: [{
//                    expand: true,
//                    cwd: '.tmp/concat/scripts',
//                    src: '*.js',
//                    dest: '.tmp/concat/scripts'
//                }]
//            }
//        },
//
//        // Replace Google CDN references
//        cdnify: {
//            dist: {
//                html: ['<%= grapheConfig.distPath %>/*.html']
//            }
//        },
//
//        // Copies remaining files to places other tasks can use
//        copy: {
//            dist: {
//                files: [{
//                    expand: true,
//                    dot: true,
//                    cwd: '<%= grapheConfig.appPath %>',
//                    dest: '<%= grapheConfig.distPath %>',
//                    src: [
//                        '*.{ico,png,txt}',
//                        '.htaccess',
//                        '*.html',
//                        '**/*.html',
//                        'images/{,*/}*.{webp}',
//                        'styles/fonts/{,*/}*.*'
//                    ]
//                }, {
//                    expand: true,
//                    cwd: '.tmp/images',
//                    dest: '<%= grapheConfig.distPath %>/images',
//                    src: ['generated/*']
//                },{
//                    // material design icons
//                    expand: true,
//                    cwd: 'bower_components/material-design-icons/iconfont',
//                    src: ['*.eot', '*.ttf','*.woff','*.woff2'],
//                    dest: '<%= grapheConfig.distPath %>/styles/fonts'
//                },{
//                    // font-awesome
//                    expand: true,
//                    cwd: 'bower_components/fontawesome/fonts',
//                    src: ['*.eot', '*.ttf','*.woff','*.woff2'],
//                    dest: '<%= grapheConfig.distPath %>/styles/fonts'
//                },{
//                    //roboto
//                    expand: true,
//                    cwd: 'bower_components/roboto-fontface/fonts',
//                    src: ['*.eot', '*.ttf','*.woff','*.woff2'],
//                    dest: '<%= grapheConfig.distPath %>/styles/fonts'
//                }]
//            },
//            styles: {
//                expand: true,
//                cwd: '<%= grapheConfig.appPath %>/styles',
//                dest: '.tmp/styles/',
//                src: '**/*.css'
//            }
//        },
//
//        // Run some tasks in parallel to speed up the build process
//        concurrent: {
//            server: [
//                'copy:styles'
//            ],
//            test: [
//                'copy:styles'
//            ],
//            dist: [
//                'copy:styles',
//                'imagemin',
//                'svgmin'
//            ]
//        },
//
//        // Test settings
//        karma: {
//            unit: {
//                configFile: 'karma/karma.conf.js',
//                singleRun: true
//            }
//        }
//    });
//
//
//    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
//        if (target === 'dist') {
//            return grunt.task.run([
//                'build',
//                'connect:dist:keepalive'
//            ]);
//        }
//
//        grunt.task.run([
//            'clean:server',
//            'wiredep',
//            'concurrent:server',
//            'autoprefixer:server',
//            'connect:livereload',
//            'watch'
//        ]);
//    });
//
//    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
//        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
//        grunt.task.run(['serve:' + target]);
//    });
//
//    grunt.registerTask('test', [
//        'clean:server',
//        'wiredep',
//        'concurrent:test',
//        'autoprefixer',
//        'connect:test',
//        'karma'
//    ]);
//
//    grunt.registerTask('build', [
//        'clean:dist',
//        'wiredep',
//        'useminPrepare',
//        'concat',
//        'concurrent:dist',
//        'autoprefixer',
//        'ngAnnotate',
//        'copy:dist',
//        'cdnify',
//        'cssmin',
//        'uglify',
//        'filerev',
//        'usemin',
//        'htmlmin'
//    ]);
//
//    grunt.registerTask('default', [
//        'newer:jshint',
//        'test',
//        'build'
//    ]);
//};
