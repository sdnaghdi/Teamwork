/**
 * jGrowl 1.2.4
 *
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Written by Stan Lemon <stosh1985@gmail.com>
 * Last updated: 2009.12.13
 *
 * jGrowl is a jQuery plugin implementing unobtrusive userland notifications.  These 
 * notifications function similarly to the Growl Framework available for
 * Mac OS X (http://growl.info).
 *
 * To Do:
 * - Move library settings to containers and allow them to be changed per container
 *
 * Changes in 1.2.4
 * - Fixed IE bug with the close-all button
 * - Fixed IE bug with the filter CSS attribute (special thanks to gotwic)
 * - Update IE opacity CSS
 * - Changed font sizes to use "em", and only set the base style
 *
 * Changes in 1.2.3
 * - The callbacks no longer use the container as context, instead they use the actual notification
 * - The callbacks now receive the container as a parameter after the options parameter
 * - beforeOpen and beforeClose now check the return value, if it's false - the notification does
 *   not continue.  The open callback will also halt execution if it returns false.
 * - Fixed bug where containers would get confused
 * - Expanded the pause functionality to pause an entire container.
 *
 * Changes in 1.2.2
 * - Notification can now be theme rolled for jQuery UI, special thanks to Jeff Chan!
 *
 * Changes in 1.2.1
 * - Fixed instance where the interval would fire the close method multiple times.
 * - Added CSS to hide from print media
 * - Fixed issue with closer button when div { position: relative } is set
 * - Fixed leaking issue with multiple containers.  Special thanks to Matthew Hanlon!
 *
 * Changes in 1.2.0
 * - Added message pooling to limit the number of messages appearing at a given time.
 * - Closing a notification is now bound to the notification object and triggered by the close button.
 *
 * Changes in 1.1.2
 * - Added iPhone styled example
 * - Fixed possible IE7 bug when determining if the ie6 class shoudl be applied.
 * - Added template for the close button, so that it's content could be customized.
 *
 * Changes in 1.1.1
 * - Fixed CSS styling bug for ie6 caused by a mispelling
 * - Changes height restriction on default notifications to min-height
 * - Added skinned examples using a variety of images
 * - Added the ability to customize the content of the [close all] box
 * - Added jTweet, an example of using jGrowl + Twitter
 *
 * Changes in 1.1.0
 * - Multiple container and instances.
 * - Standard jQuery.jGrowl() now wraps jQuery.fn.jGrowl() by first establishing a generic jGrowl container.
 * - Instance methods of a jGrowl container can be called by jQuery.fn.jGrowl(methodName)
 * - Added glue preferenced, which allows notifications to be inserted before or after nodes in the container
 * - Added new log callback which is called before anything is done for the notification
 * - Corner's attribute are now applied on an individual notification basis.
 *
 * Changes in 1.0.4
 * - Various CSS fixes so that jGrowl renders correctly in IE6.
 *
 * Changes in 1.0.3
 * - Fixed bug with options persisting across notifications
 * - Fixed theme application bug
 * - Simplified some selectors and manipulations.
 * - Added beforeOpen and beforeClose callbacks
 * - Reorganized some lines of code to be more readable
 * - Removed unnecessary this.defaults context
 * - If corners plugin is present, it's now customizable.
 * - Customizable open animation.
 * - Customizable close animation.
 * - Customizable animation easing.
 * - Added customizable positioning (top-left, top-right, bottom-left, bottom-right, center)
 *
 * Changes in 1.0.2
 * - All CSS styling is now external.
 * - Added a theme parameter which specifies a secondary class for styling, such
 *   that notifications can be customized in appearance on a per message basis.
 * - Notification life span is now customizable on a per message basis.
 * - Added the ability to disable the global closer, enabled by default.
 * - Added callbacks for when a notification is opened or closed.
 * - Added callback for the global closer.
 * - Customizable animation speed.
 * - jGrowl now set itself up and tears itself down.
 *
 * Changes in 1.0.1:
 * - Removed dependency on metadata plugin in favor of .data()
 * - Namespaced all events
 */
(function(jQuery) {

	/** jGrowl Wrapper - Establish a base jGrowl Container for compatibility with older releases. **/
	jQuery.jGrowl = function( m , o ) {
		// To maintain compatibility with older version that only supported one instance we'll create the base container.
		if ( jQuery('#jGrowl').size() == 0 ) 
			jQuery('<div id="jGrowl"></div>').addClass(jQuery.jGrowl.defaults.position).appendTo('body');

		// Create a notification on the container.
		jQuery('#jGrowl').jGrowl(m,o);
	};


	/** Raise jGrowl Notification on a jGrowl Container **/
	jQuery.fn.jGrowl = function( m , o ) {
		if ( jQuery.isFunction(this.each) ) {
			var args = arguments;

			return this.each(function() {
				var self = this;

				/** Create a jGrowl Instance on the Container if it does not exist **/
				if ( jQuery(this).data('jGrowl.instance') == undefined ) {
					jQuery(this).data('jGrowl.instance', jQuery.extend( new jQuery.fn.jGrowl(), { notifications: [], element: null, interval: null } ));
					jQuery(this).data('jGrowl.instance').startup( this );
				}

				/** Optionally call jGrowl instance methods, or just raise a normal notification **/
				if ( jQuery.isFunction(jQuery(this).data('jGrowl.instance')[m]) ) {
					jQuery(this).data('jGrowl.instance')[m].apply( jQuery(this).data('jGrowl.instance') , jQuery.makeArray(args).slice(1) );
				} else {
					jQuery(this).data('jGrowl.instance').create( m , o );
				}
			});
		};
	};

	jQuery.extend( jQuery.fn.jGrowl.prototype , {

		/** Default JGrowl Settings **/
		defaults: {
			pool: 			0,
			header: 		'',
			group: 			'',
			sticky: 		false,
			position: 		'top-right', // Is this still needed?
			glue: 			'after',
			theme: 			'default',
			corners: 		'10px',
			check: 			250,
			life: 			3000,
			speed: 			'normal',
			easing: 		'swing',
			closer: 		true,
			closeTemplate: '&times;',
			closerTemplate: '<div>[ close all ]</div>',
			log: 			function(e,m,o) {},
			beforeOpen: 	function(e,m,o) {},
			open: 			function(e,m,o) {},
			beforeClose: 	function(e,m,o) {},
			close: 			function(e,m,o) {},
			animateOpen: 	{
				opacity: 	'show'
			},
			animateClose: 	{
				opacity: 	'hide'
			}
		},
		
		notifications: [],
		
		/** jGrowl Container Node **/
		element: 	null,
	
		/** Interval Function **/
		interval:   null,
		
		/** Create a Notification **/
		create: 	function( message , o ) {
			var o = jQuery.extend({}, this.defaults, o);

			this.notifications.push({ message: message , options: o });
			
			o.log.apply( this.element , [this.element,message,o] );
		},
		
		render: 		function( notification ) {
			var self = this;
			var message = notification.message;
			var o = notification.options;

			var notification = jQuery(
				'<div class="jGrowl-notification ui-state-highlight ui-corner-all' + 
				((o.group != undefined && o.group != '') ? ' ' + o.group : '') + '">' +
				'<div class="close">' + o.closeTemplate + '</div>' +
				'<div class="header">' + o.header + '</div>' +
				'<div class="message">' + message + '</div></div>'
			).data("jGrowl", o).addClass(o.theme).children('div.close').bind("click.jGrowl", function() {
				jQuery(this).parent().trigger('jGrowl.close');
			}).parent();


			/** Notification Actions **/
			jQuery(notification).bind("mouseover.jGrowl", function() {
				jQuery('div.jGrowl-notification', self.element).data("jGrowl.pause", true);
			}).bind("mouseout.jGrowl", function() {
				jQuery('div.jGrowl-notification', self.element).data("jGrowl.pause", false);
			}).bind('jGrowl.beforeOpen', function() {
				if ( o.beforeOpen.apply( notification , [notification,message,o,self.element] ) != false ) {
					jQuery(this).trigger('jGrowl.open');
				}
			}).bind('jGrowl.open', function() {
				if ( o.open.apply( notification , [notification,message,o,self.element] ) != false ) {
					if ( o.glue == 'after' ) {
						jQuery('div.jGrowl-notification:last', self.element).after(notification);
					} else {
						jQuery('div.jGrowl-notification:first', self.element).before(notification);
					}
					
					jQuery(this).animate(o.animateOpen, o.speed, o.easing, function() {
						// Fixes some anti-aliasing issues with IE filters.
						if (jQuery.browser.msie && (parseInt(jQuery(this).css('opacity'), 10) === 1 || parseInt(jQuery(this).css('opacity'), 10) === 0))
							this.style.removeAttribute('filter');

						jQuery(this).data("jGrowl").created = new Date();
					});
				}
			}).bind('jGrowl.beforeClose', function() {
				if ( o.beforeClose.apply( notification , [notification,message,o,self.element] ) != false )
					jQuery(this).trigger('jGrowl.close');
			}).bind('jGrowl.close', function() {
				// Pause the notification, lest during the course of animation another close event gets called.
				jQuery(this).data('jGrowl.pause', true);
				jQuery(this).animate(o.animateClose, o.speed, o.easing, function() {
					jQuery(this).remove();
					var close = o.close.apply( notification , [notification,message,o,self.element] );

					if ( jQuery.isFunction(close) )
						close.apply( notification , [notification,message,o,self.element] );
				});
			}).trigger('jGrowl.beforeOpen');
		
			/** Optional Corners Plugin **/
			if ( jQuery.fn.corner != undefined ) jQuery(notification).corner( o.corners );

			/** Add a Global Closer if more than one notification exists **/
			if ( jQuery('div.jGrowl-notification:parent', self.element).size() > 1 && 
				 jQuery('div.jGrowl-closer', self.element).size() == 0 && this.defaults.closer != false ) {
				jQuery(this.defaults.closerTemplate).addClass('jGrowl-closer ui-state-highlight ui-corner-all').addClass(this.defaults.theme)
					.appendTo(self.element).animate(this.defaults.animateOpen, this.defaults.speed, this.defaults.easing)
					.bind("click.jGrowl", function() {
						jQuery(this).siblings().children('div.close').trigger("click.jGrowl");

						if ( jQuery.isFunction( self.defaults.closer ) ) {
							self.defaults.closer.apply( jQuery(this).parent()[0] , [jQuery(this).parent()[0]] );
						}
					});
			};
		},

		/** Update the jGrowl Container, removing old jGrowl notifications **/
		update:	 function() {
			jQuery(this.element).find('div.jGrowl-notification:parent').each( function() {
				if ( jQuery(this).data("jGrowl") != undefined && jQuery(this).data("jGrowl").created != undefined && 
					 (jQuery(this).data("jGrowl").created.getTime() + jQuery(this).data("jGrowl").life)  < (new Date()).getTime() && 
					 jQuery(this).data("jGrowl").sticky != true && 
					 (jQuery(this).data("jGrowl.pause") == undefined || jQuery(this).data("jGrowl.pause") != true) ) {

					// Pause the notification, lest during the course of animation another close event gets called.
					jQuery(this).trigger('jGrowl.beforeClose');
				}
			});

			if ( this.notifications.length > 0 && 
				 (this.defaults.pool == 0 || jQuery(this.element).find('div.jGrowl-notification:parent').size() < this.defaults.pool) )
				this.render( this.notifications.shift() );

			if ( jQuery(this.element).find('div.jGrowl-notification:parent').size() < 2 ) {
				jQuery(this.element).find('div.jGrowl-closer').animate(this.defaults.animateClose, this.defaults.speed, this.defaults.easing, function() {
					jQuery(this).remove();
				});
			}
		},

		/** Setup the jGrowl Notification Container **/
		startup:	function(e) {
			this.element = jQuery(e).addClass('jGrowl').append('<div class="jGrowl-notification"></div>');
			this.interval = setInterval( function() { 
				jQuery(e).data('jGrowl.instance').update(); 
			}, this.defaults.check);
			
			if (jQuery.browser.msie && parseInt(jQuery.browser.version) < 7 && !window["XMLHttpRequest"]) {
				jQuery(this.element).addClass('ie6');
			}
		},

		/** Shutdown jGrowl, removing it and clearing the interval **/
		shutdown:   function() {
			jQuery(this.element).removeClass('jGrowl').find('div.jGrowl-notification').remove();
			clearInterval( this.interval );
		},
		
		close: 	function() {
			jQuery(this.element).find('div.jGrowl-notification').each(function(){
				jQuery(this).trigger('jGrowl.beforeClose');
			});
		}
	});
	
	/** Reference the Defaults Object for compatibility with older versions of jGrowl **/
	jQuery.jGrowl.defaults = jQuery.fn.jGrowl.prototype.defaults;

})(jQuery);