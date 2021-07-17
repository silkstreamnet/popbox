import Popbox from "../src/popbox"

var popbox1 = new $.Popbox({
    max_width:800,
    content:'<p>test masses of content</p>',
    title:'chicken',
    animation:'slide_up',
    animation_speed:1000,
    cache:true,
    loading_text:'<img src="dist/images/loading.gif" width="32" height="32" alt="" />'
});

$('.click-me-1').on('click',function(e){
    e.preventDefault();
    popbox1.update({
        content:'<p>test masses of content</p>'
    });
    popbox1.open();
    setTimeout(function(){
        popbox1.update({
            content:'<p>Extra content to fill up even more space goes here.</p><p>Extra content to fill up even more space goes here.</p><p>Extra content to fill up even more space goes here.</p><p>Extra content to fill up even more space goes here.</p><p>Extra content to fill up even more space goes here.</p><p>Extra content to fill up even more space goes here.</p><p>Extra content to fill up even more space goes here.</p>'
        });
        /*setTimeout(function(){
            popbox1.update({
                content:'<p>Speedy revert.</p>'
            });
        },800);*/
    },3000);
});

var popbox2 = new $.Popbox({
    max_width:800,
    content:'<p>test masses of content</p><img src="dist/images/test-image-2.jpg" />',
    title:'test 2',
    animation:'zoom',
    max_height:true,
    loading_text:'<img src="dist/images/loading.gif" width="32" height="32" alt="" />'
});

$('.click-me-2').on('click',function(e){
    e.preventDefault();
    popbox2.open();
});

var popbox3 = new $.Popbox({
    max_width:700,
    //max_height:true,
    aspect_fit:true,
    content:'<p>test more content</p>',
    animation:'zoom',
    cache:true,
    min_width:100,
    min_height:100,
    loading_text:'<img src="dist/images/loading.gif" width="32" height="32" alt="" />'
});

$('.click-me-3').on('click',function(e){
    e.preventDefault();
    popbox3.update({
        content:'<img src="dist/images/test-image.jpg" />'
    });
    popbox3.open();
});

var popbox4 = new $.Popbox({
    content:'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p><img src="dist/images/test-image-2.jpg" /></p>',
    //max_height:true,
    loading_text:'',
    absolute:true
});

$('.click-me-4').on('click',function(e){
    e.preventDefault();
    popbox4.open();
});

var long_text = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas aliquet elit eu felis mattis venenatis. Nullam euismod nulla ac quam sodales dapibus. Aenean id nisi eu nunc consectetur adipiscing. Etiam a arcu in purus ultrices adipiscing id ut diam. Nullam dignissim tristique neque, eget ornare erat pharetra quis.</p>';

var popbox5 = new $.Popbox({
    max_width:800,
    content:long_text,
    title:'chicken',
    animation:'zoom',
    animation_speed:500,
    overlay_animation_speed:500,
    cache:false,
    loading_text:'<img src="dist/images/loading.gif" width="32" height="32" alt="" />'
});

popbox5.on('on_open',function(){
    console.log("on_open event listener test");
});

$('.click-me-5').on('click',function(e){
    e.preventDefault();
    popbox5.update({
        content:long_text
    });
    popbox5.open();
    setTimeout(function(){
        popbox5.update({
            content:long_text
        });
    },2000);
});

var popbox6 = new $.Popbox({
    content:'<iframe src="//player.vimeo.com/video/99528701" width="840" height="470" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
    animation:'zoom',
    aspect_fit:true,
    loading_text:'<img src="dist/images/loading.gif" width="32" height="32" alt="" />'
});

$('.click-me-6').on('click',function(e){
    e.preventDefault();
    popbox6.open();
});

$('.click-me-7').Popbox({
    content:long_text,
    animation:'fold',
    animation_speed:500
});

var popbox_gallery1 = new $.Popbox({
    mode:'gallery',
    loading_text:'',
    gallery:{
        selector:'.click-me-gallery-1'
    }
});

$('.click-me-gallery-1').on('click',function(e){
    e.preventDefault();
    //popbox_gallery1.open();
});

var popbox_delayed_loading = new $.Popbox({
    loading_text:'<img src="dist/images/loading.gif" width="32" height="32" alt="" />',
    content:'preload'
});

$('.delayed-loading').on('click',function(e){
    e.preventDefault();
    popbox_delayed_loading.on('open',function(){
        setTimeout(function(){
            popbox_delayed_loading.showLoading(function(){
                setTimeout(function(){
                    popbox_delayed_loading.update({
                        content:'Flying Goat<br/>Free the content<br/>Chicken<br/>Turkey'
                    });
                },2000);
            });
        },1000);
    });
    popbox_delayed_loading.open();
});

var popbox_insertcoin_test = new $.Popbox({
    loading_text:'',
    content:$('.content-insertcoin-test').html()
});

$('.click-me-insertcoin-test').on('click',function(e){
    e.preventDefault();
    popbox_insertcoin_test.open();
});

var popbox_breakage = new $.Popbox({
    mode:'gallery',
    gallery:{
        selector:'.break-img'
    }
});

popbox_breakage.open();
