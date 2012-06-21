(function( $ ){
	
	/* 	
		This seems to be global namespace which is a good thing. This means that validations setup against one form 
		can be reused on another this may need chaning to I encouter problems.
	*/
	var validations = {
		
		// The only default validation at the momment must return either true or false.
		empty : function(value) {
			if(value === '') {
				return false;
			} else {
				return true;
			}
		}
	}
	
	/* TOOO: Refactor this section. This is a global setting not sure if this should be stored in an object */
	var defaultSuccess = function(e) {
		if($(e).parent().hasClass('postman-error')) {
			$(e).unwrap();
		}
	}
	var defaultFailure = function(e) {
		if(!$(e).parent().hasClass('postman-error')) {
			$(e).wrap('<span class="postman-error"></span>');
		}
	}
	
	
	var methods = {
		init : function( options ) {
			
			// Creates the empties and defaults for form submission.
			var data = {};
			var defaults = {
				formSuccess: function(e){
					return true;
				},
				formFailure: function(e){
					e.preventDefault();
				}
			}
			
			
			// TODO: Refactor this ugly check.
			if(options.success !== undefined) {
				$.extend(defaults, {
					formSuccess: options.success
				});
			}
			if(options.failure !== undefined) {
				$.extend(defaults, {
					formFailure: options.failure
				});
				
			}
			
			this.bind('submit', function(evt){
				var globalError = false;
				
				for(element in data) {
					
					/*
					Absolute Joke of coding
					*/
					
					var elementCache = $(element);
					var dataCache = data[element];
					
					var validation = validations[dataCache.validation];
					if(validation(elementCache.val()) && elementCache.val() !== dataCache.placeholder) {
						dataCache.success(elementCache);
						data[element].error = false;
					} else {
						dataCache.failure(elementCache);
						data[element].error = true;
						globalError = true;
					}
				}
				
				if(!globalError) {
					defaults.formSuccess(evt);
				} else {
					defaults.formFailure(evt);
				}
				
			});
			
			// Saving the postman to the element to resolve the global scope issue.
			this.data('postman-data', data)
			//console.log(this.data('postman-data'));
			
		},
		
		validate : function( options ) {
			
			// WHAT IS THIS
			
			var data = this.data('postman-data');
			
			var success = defaultSuccess;
			var failure = defaultFailure;
			var cache = $(options.element);
			var temp = {}
			
			if(options.success !== undefined) {
				success = options.success;
			}
			if(options.failure !== undefined) {
				failure = options.failure;
			}
			
			temp[options.element] = {
				validation: cache.data('validation'),
				placeholder: cache.data('placeholder'),
				success: success,
				failure: failure,
				error: false
			};
			$.extend(data, temp);
			
			cache.data('postman', options.element); 
			
			cache.focus(function(){
				var local = data[$(this).data('postman')];
				
				if($(this).val() == local.placeholder) {
					$(this).val('')
				}
					
			});
			
			cache.blur(function(){
				var local = data[$(this).data('postman')];
		
				if($(this).val() === '') {
					$(this).val(local.placeholder)
				}
					
					
				var validation = validations[local.validation];
				if(validation($(this).val()) && $(this).val() !== local.placeholder) {
					local.success($(this));
					data[$(this).data('postman')].error = false;
				} else {
					local.failure($(this));
					data[$(this).data('postman')].error = true;
				}
				
					
			})
		
			this.data('postman-data', data);
			
		},
		
		add_validation : function( options ) {
			
			// TOOD: Refactor make nicer other than that nice.
			if(options.name !== undefined) {
				validations[options.name] = options.method;
			}
		}
		
	};
	
	$.fn.postman = function( method ) {
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.postman' );
		}
	};
})( jQuery );