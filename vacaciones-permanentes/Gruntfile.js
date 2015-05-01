module.exports = function(grunt) {

  grunt.initConfig({

    compile: {
      html: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    },

    wiredep: {
      task: {
        src: ['target/**/*.html']
      }
    }

  });

  grunt.loadNpmTasks('grunt-wiredep');
};