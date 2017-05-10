module.exports = function(grunt){

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options:{
                banner: '',
                footer: ''
            },
            dist: {
                src: ['src/js/*.js'],
                dest: 'dist/js/popbox-development.js'
            }
        },
        uglify: {
            options: {
                banner: '',
                footer: '',
                mangle:true
            },
            files: {
                expand:true,
                src: ['**/*.js','!**/*.min.js'],
                cwd: 'dist/js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('js', ['concat', 'uglify']);

};