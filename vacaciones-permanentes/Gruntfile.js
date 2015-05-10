module.exports = function(grunt) {

  grunt.initConfig({

    compile: {
      ejs: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    },

    compile: {
      css: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    },

    wiredep: {
      task: {
        src: ['views/*.ejs']
      },
      options : {
       ignorePath : "../public" 
      }
    }

  });

  grunt.loadNpmTasks('grunt-wiredep');
};