# Postman

I want Postman to be the minimal abstraction over basic validation. Whist still providing a great platform for customisation. Postman will make default choices you can override them this is a key concept.

## Basic Usage

```javascript
$('#form').postman();
```

The postman command initially sets up sensible default for form submission any errors encountered and the form will not submit, no errors and it will.

You can override this behaviour by passing an object to the postman method

``` Javascript
$('#form').postman({
	success: function(e){
		// Custom Success
	},
	failure: function(e){
		Custom Failure
	}
})
```

An example would be overriding these methods to post the form via ajax for example. These methods will be called based on the validations you provide.

## Validation Syntax

``` Javascript
$('#form').postman('process', {
	element: '#email'
});
```

The process string is the method being called. The options hash is used to override defaults. The process name is being considered for replacement with something lilke __'validate'__ 

Most of the setup for the process method is done in HTML

``` HTML
<input type="text" id="email" name="email" data-validation="empty" data-placeholder="Email or Username" />
```

These data attributes tell postman to use the built in empty validation. The place holder attribute provides a default state if nothing is provided. An example of usage would be if a user tabbed into a field that field would clear if nothing is entered the placeholder text would be reinstated.

The process method also contains a success and failure state.

``` Javascript 
$('#form').postman('process', {
	element: '#email',
	success: function(e){
		// Custom Success
	},
	failure: function(e){
		// Custom Failure
	},
});
```
Postman has a default behaviour to wrap the form field with a span with a class postman-error

``` HTML
<span class="postman-error">
	<input type="text" id="email" name="email" data-validation="empty" 
	data-placeholder="Email or Username" />
</span>
```
Again this default can be overriden by providing a (success/failure) option.

## Custom Validation Syntax

This seems like a complicated concept but it really isn't. Postman contains a few default validations such as empty, numeric, email etc which should see most people ok. When you need it you can start to use custom validators. The syntax is easy.

``` Javascript
$('#form').postman('add_validation', {
	name: 'creditcard',
	method: function(){
		if(valid) {
			return true;
		} else {
			return false;
		}
	}
})
$('#form').postman('process', {
	element: '#creditcard'
});
```

Thats it syntax for custom validations please note that the validation must return a true of false you can guess which is which. To use this validation use the validation name in the form field data-validation attribute like so.

``` HTML
<input type="text" id="creditcard" name="creditcard" 
data-validation="creditcard" data-placeholder="Credit Card Number" />
```

We tie everything together. If you think your custom validation should be included as default send us a pull request and we will look at adding it as a default.

## Version History

* __Version 0__: We are currently at Version 0 as in nothing implemented. This readme is a roadmap for development. Somethings will change, be dropped or added.



