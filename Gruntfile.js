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
    }

  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');
};