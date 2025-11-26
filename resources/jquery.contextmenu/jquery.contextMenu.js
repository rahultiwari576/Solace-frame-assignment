// jQuery Context Menu Plugin
//
// Version 1.01
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
//
// More info: http://abeautifulsite.net/2008/09/jquery-context-menu-plugin/
//
// Terms of Use
//
// This plugin is dual-licensed under the GNU General Public License
//   and the MIT License and is copyright A Beautiful Site, LLC.
//
// Wrapping plugin code in jQuery check to ensure jQuery is loaded before execution if(jQuery)( function() {
	// Extending jQuery prototype with custom context menu methods 	$.extend($.fn, {
		
		// Main function to attach context menu to selected elements 		contextMenu: function(o, callback) {
			// Validating that menu option is provided, returning false if undefined 			if( o.menu == undefined ) return false;
			// Setting default fade-in speed to 150ms if not specified 			if( o.inSpeed == undefined ) o.inSpeed = 150;
			// Setting default fade-out speed to 75ms if not specified 			if( o.outSpeed == undefined ) o.outSpeed = 75;
			// Converting 0 speed to -1 for expected results (no fade animation) 			if( o.inSpeed == 0 ) o.inSpeed = -1;
			if( o.outSpeed == 0 ) o.outSpeed = -1;
			// Looping through each selected element to attach context menu 			$(this).each( function() {
				var el = $(this);  // Storing reference to current element 				var offset = $(el).offset();  // Getting element's position offset for coordinate calculations 				// Adding contextMenu class to menu element for styling and identification 				$('#' + o.menu).addClass('contextMenu');
				// Simulating a true right-click by handling mousedown and mouseup events 				$(this).mousedown( function(e) {
					var evt = e;  // Storing event object for later use 					evt.stopPropagation();  // Preventing event from bubbling up the DOM tree 					$(this).mouseup( function(e) {
						e.stopPropagation();  // Stopping event propagation on mouseup 						var srcElement = $(this);  // Storing source element reference 						$(this).unbind('mouseup');  // Removing mouseup handler to prevent multiple triggers 						// Checking if right mouse button was clicked (button == 2) 						if( evt.button == 2 ) {
							// Hiding any context menus that may already be showing 							$(".contextMenu").hide();
							// Getting the context menu element by ID from options 							var menu = $('#' + o.menu);
							
							// Checking if element is disabled, returning early if so 							if( $(el).hasClass('disabled') ) return false;
							
							// Detecting mouse position using cross-browser compatible methods 							var d = {}, x, y;  // Object to store viewport dimensions and scroll positions 							// Checking for window.innerHeight (older browsers) 							if( self.innerHeight ) {
								d.pageYOffset = self.pageYOffset;  // Vertical scroll position 								d.pageXOffset = self.pageXOffset;  // Horizontal scroll position 								d.innerHeight = self.innerHeight;  // Viewport height 								d.innerWidth = self.innerWidth;  // Viewport width 							} else if( document.documentElement &&
								document.documentElement.clientHeight ) {
								// Using documentElement for modern browsers 								d.pageYOffset = document.documentElement.scrollTop;
								d.pageXOffset = document.documentElement.scrollLeft;
								d.innerHeight = document.documentElement.clientHeight;
								d.innerWidth = document.documentElement.clientWidth;
							} else if( document.body ) {
								// Fallback to document.body for older browsers 								d.pageYOffset = document.body.scrollTop;
								d.pageXOffset = document.body.scrollLeft;
								d.innerHeight = document.body.clientHeight;
								d.innerWidth = document.body.clientWidth;
							}
							// Calculating X coordinate: using pageX if available, otherwise clientX + scroll 							(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
							// Calculating Y coordinate: using pageY if available, otherwise clientY + scroll 							(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;
							
							// Showing the context menu at calculated mouse position 							$(document).unbind('click');  // Removing previous click handlers 							$(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);  // Positioning and fading in menu 							// Adding hover events to menu items for visual feedback 							$(menu).find('A').mouseover( function() {
								// Removing hover class from all menu items 								$(menu).find('LI.hover').removeClass('hover');
								// Adding hover class to current menu item's parent LI 								$(this).parent().addClass('hover');
							}).mouseout( function() {
								// Removing hover class when mouse leaves menu item 								$(menu).find('LI.hover').removeClass('hover');
							});
							
							// Adding keyboard navigation support for context menu 							$(document).keypress( function(e) {
								switch( e.keyCode ) {
									case 38: // Up arrow key 										// If no item is hovered, select last item 										if( $(menu).find('LI.hover').size() == 0 ) {
											$(menu).find('LI:last').addClass('hover');
										} else {
											// Moving hover to previous enabled item 											$(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
											// If no previous item found, wrap to last item 											if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:last').addClass('hover');
										}
									break;
									case 40: // Down arrow key 										// If no item is hovered, select first item 										if( $(menu).find('LI.hover').size() == 0 ) {
											$(menu).find('LI:first').addClass('hover');
										} else {
											// Moving hover to next enabled item 											$(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
											// If no next item found, wrap to first item 											if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:first').addClass('hover');
										}
									break;
									case 13: // Enter key to activate selected menu item 										$(menu).find('LI.hover A').trigger('click');
									break;
									case 27: // Escape key to close menu 										$(document).trigger('click');
									break
								}
							});
							
							// Handling menu item selection when clicked 							$('#' + o.menu).find('A').unbind('click');  // Removing previous click handlers 							$('#' + o.menu).find('LI:not(.disabled) A').click( function() {
								// Unbinding document click and keypress handlers 								$(document).unbind('click').unbind('keypress');
								// Hiding all context menus 								$(".contextMenu").hide();
								// Executing callback function with action, source element, and position data 								if( callback ) callback( $(this).attr('href').substr(1), $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y} );
								return false;  // Preventing default link behavior 							});
							
							// Adding click handler to hide menu when clicking outside (with delay for Mozilla compatibility) 							setTimeout( function() { // Delay for Mozilla browser compatibility 								$(document).click( function() {
									// Unbinding click and keypress handlers when menu is closed 									$(document).unbind('click').unbind('keypress');
									// Fading out the context menu 									$(menu).fadeOut(o.outSpeed);
									return false;  // Preventing event propagation 								});
							}, 0);
						}
					});
				});
				
				// Disabling text selection on context menu for better user experience 				// Using feature detection instead of browser detection for better compatibility 				var isMozilla = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
				var isIE = navigator.userAgent.toLowerCase().indexOf('msie') > -1 || navigator.userAgent.toLowerCase().indexOf('trident') > -1;
				
				if( isMozilla ) {
					// Mozilla/Firefox specific text selection disable 					$('#' + o.menu).each( function() { $(this).css({ 'MozUserSelect' : 'none' }); });
				} else if( isIE ) {
					// Internet Explorer specific text selection disable 					$('#' + o.menu).each( function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
				} else {
					// Other browsers text selection disable 					$('#' + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
				}
				// Disabling browser's default context menu on element and menu (works in IE/Safari + FF/Chrome) 				$(el).add($('UL.contextMenu')).bind('contextmenu', function() { return false; });
				
			});
			return $(this);  // Returning jQuery object for method chaining 		},
		
		// Function to disable specific context menu items dynamically 		disableContextMenuItems: function(o) {
			// If no parameter provided, disable all menu items 			if( o == undefined ) {
				// Adding disabled class to all LI elements in menu 				$(this).find('LI').addClass('disabled');
				return( $(this) );  // Returning jQuery object for chaining 			}
			// Looping through each selected element 			$(this).each( function() {
				if( o != undefined ) {
					// Splitting comma-separated list of menu item hrefs to disable 					var d = o.split(',');
					// Looping through each href and disabling corresponding menu item 					for( var i = 0; i < d.length; i++ ) {
						// Finding anchor with matching href and adding disabled class to parent LI 						$(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');
						
					}
				}
			});
			return( $(this) );  // Returning jQuery object for chaining 		},
		
		// Function to enable specific context menu items dynamically 		enableContextMenuItems: function(o) {
			// If no parameter provided, enable all disabled menu items 			if( o == undefined ) {
				// Removing disabled class from all LI elements in menu 				$(this).find('LI.disabled').removeClass('disabled');
				return( $(this) );  // Returning jQuery object for chaining 			}
			// Looping through each selected element 			$(this).each( function() {
				if( o != undefined ) {
					// Splitting comma-separated list of menu item hrefs to enable 					var d = o.split(',');
					// Looping through each href and enabling corresponding menu item 					for( var i = 0; i < d.length; i++ ) {
						// Finding anchor with matching href and removing disabled class from parent LI 						$(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
						
					}
				}
			});
			return( $(this) );  // Returning jQuery object for chaining 		},
		
		// Function to disable entire context menu(s) on selected elements 		disableContextMenu: function() {
			// Looping through each selected element and adding disabled class 			$(this).each( function() {
				$(this).addClass('disabled');  // Adding disabled class to prevent menu from showing 			});
			return( $(this) );  // Returning jQuery object for chaining 		},
		
		// Function to enable context menu(s) on selected elements 		enableContextMenu: function() {
			// Looping through each selected element and removing disabled class 			$(this).each( function() {
				$(this).removeClass('disabled');  // Removing disabled class to allow menu to show 			});
			return( $(this) );  // Returning jQuery object for chaining 		},
		
		// Function to completely destroy context menu(s) and remove all event handlers 		destroyContextMenu: function() {
			// Looping through each selected element to remove context menu functionality 			$(this).each( function() {
				// Unbinding mousedown and mouseup event handlers to remove context menu behavior 				$(this).unbind('mousedown').unbind('mouseup');
			});
			return( $(this) );  // Returning jQuery object for chaining 		}
		
	});
})(jQuery);

