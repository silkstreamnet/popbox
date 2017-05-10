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
                src: ['src/js/popbox.js','src/js/popbox-ajax.js','src/js/popbox-animations.js','src/js/popbox-gallery.js','src/js/popbox-selector.js'],
                dest: 'www/dist/js/popbox-development.js'
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
                //src: ['www/dist/js/**/*.js','!www/dist/js/**/*.min.js','!www/dist/js/popbox-development.js'],
                src: ['www/dist/js/popbox-release/popbox3/**/*.js','!www/dist/js/popbox-release/popbox3/**/*.min.js'],
                rename:function(dst,src){
                    return src.replace('.js','.min.js');
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('js', ['concat']);
    grunt.registerTask('scss', ['uglify']);

};