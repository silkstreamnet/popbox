# Popbox 3

# How to use

Typical use:

```javascript
var popbox = new $.Popbox({
    content:'Content for popbox.'
});

$('.open-popbox').on('click',function() {
    popbox.open();
});
```

## Options

See `src/constants/default-settings.js` for options.

## Events

### open

### after_open

### ready

### update_dom

### after_update_dom

### adjust

### after_adjust

### close

### after_close

### reset

### after_reset

### image_load

### image_error

## Methods

### .update(options:{})

### .adjust(animate:true)

### .on(event_name:'',handler:function(){})

### .off(event_name:'',handler:function(){})

### .trigger(event_name:'',handler:function(){},params:[])

# Development

## Dependencies
- jQuery 1.7+

## NPM Scripts

### Dev
Build development files for testing.

`npm run dev`

### Serve
Build development files for testing and start up a testing server.

`npm run serve`

### Build
Build production files in obtuse and minimised form.

`npm run build`
