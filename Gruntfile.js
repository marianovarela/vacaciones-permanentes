module.exports = function(grunt) {

  grunt.initConfig({

    compile: {
      ejs: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    },

    // compile: {
    //   css: ['jade', 'wiredep'],
    //   styles: ['concat:styles', 'sass', 'clean:compile'],
    //   js: ['concat:js']
    // },

    wiredep: {
      task: {
        src: ['views/*.ejs']
      },
      options : {
       ignorePath : "../public" 
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'hello.js', 'app.js', 'models/*.js', 'routes/*.js']
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.registerTask('default', 'jshint');
  grunt.registerTask('test', ['karma']);
};