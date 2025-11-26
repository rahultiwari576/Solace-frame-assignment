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
// Wrapping plugin code in jQuery check to ensure jQuery is loaded before execution --BY Rahul Kumar--26/11
if(jQuery)( function() {
	// Extending jQuery prototype with custom context menu methods --BY Rahul Kumar--26/11
	$.extend($.fn, {
		
		// Main function to attach context menu to selected elements --BY Rahul Kumar--26/11
		contextMenu: function(o, callback) {
			// Validating that menu option is provided, returning false if undefined --BY Rahul Kumar--26/11
			if( o.menu == undefined ) return false;
			// Setting default fade-in speed to 150ms if not specified --BY Rahul Kumar--26/11
			if( o.inSpeed == undefined ) o.inSpeed = 150;
			// Setting default fade-out speed to 75ms if not specified --BY Rahul Kumar--26/11
			if( o.outSpeed == undefined ) o.outSpeed = 75;
			// Converting 0 speed to -1 for expected results (no fade animation) --BY Rahul Kumar--26/11
			if( o.inSpeed == 0 ) o.inSpeed = -1;
			if( o.outSpeed == 0 ) o.outSpeed = -1;
			// Looping through each selected element to attach context menu --BY Rahul Kumar--26/11
			$(this).each( function() {
				var el = $(this);  // Storing reference to current element --BY Rahul Kumar--26/11
				var offset = $(el).offset();  // Getting element's position offset for coordinate calculations --BY Rahul Kumar--26/11
				// Adding contextMenu class to menu element for styling and identification --BY Rahul Kumar--26/11
				$('#' + o.menu).addClass('contextMenu');
				// Simulating a true right-click by handling mousedown and mouseup events --BY Rahul Kumar--26/11
				$(this).mousedown( function(e) {
					var evt = e;  // Storing event object for later use --BY Rahul Kumar--26/11
					evt.stopPropagation();  // Preventing event from bubbling up the DOM tree --BY Rahul Kumar--26/11
					$(this).mouseup( function(e) {
						e.stopPropagation();  // Stopping event propagation on mouseup --BY Rahul Kumar--26/11
						var srcElement = $(this);  // Storing source element reference --BY Rahul Kumar--26/11
						$(this).unbind('mouseup');  // Removing mouseup handler to prevent multiple triggers --BY Rahul Kumar--26/11
						// Checking if right mouse button was clicked (button == 2) --BY Rahul Kumar--26/11
						if( evt.button == 2 ) {
							// Hiding any context menus that may already be showing --BY Rahul Kumar--26/11
							$(".contextMenu").hide();
							// Getting the context menu element by ID from options --BY Rahul Kumar--26/11
							var menu = $('#' + o.menu);
							
							// Checking if element is disabled, returning early if so --BY Rahul Kumar--26/11
							if( $(el).hasClass('disabled') ) return false;
							
							// Detecting mouse position using cross-browser compatible methods --BY Rahul Kumar--26/11
							var d = {}, x, y;  // Object to store viewport dimensions and scroll positions --BY Rahul Kumar--26/11
							// Checking for window.innerHeight (older browsers) --BY Rahul Kumar--26/11
							if( self.innerHeight ) {
								d.pageYOffset = self.pageYOffset;  // Vertical scroll position --BY Rahul Kumar--26/11
								d.pageXOffset = self.pageXOffset;  // Horizontal scroll position --BY Rahul Kumar--26/11
								d.innerHeight = self.innerHeight;  // Viewport height --BY Rahul Kumar--26/11
								d.innerWidth = self.innerWidth;  // Viewport width --BY Rahul Kumar--26/11
							} else if( document.documentElement &&
								document.documentElement.clientHeight ) {
								// Using documentElement for modern browsers --BY Rahul Kumar--26/11
								d.pageYOffset = document.documentElement.scrollTop;
								d.pageXOffset = document.documentElement.scrollLeft;
								d.innerHeight = document.documentElement.clientHeight;
								d.innerWidth = document.documentElement.clientWidth;
							} else if( document.body ) {
								// Fallback to document.body for older browsers --BY Rahul Kumar--26/11
								d.pageYOffset = document.body.scrollTop;
								d.pageXOffset = document.body.scrollLeft;
								d.innerHeight = document.body.clientHeight;
								d.innerWidth = document.body.clientWidth;
							}
							// Calculating X coordinate: using pageX if available, otherwise clientX + scroll --BY Rahul Kumar--26/11
							(e.pageX) ? x = e.pageX : x = e.clientX + d.scrollLeft;
							// Calculating Y coordinate: using pageY if available, otherwise clientY + scroll --BY Rahul Kumar--26/11
							(e.pageY) ? y = e.pageY : y = e.clientY + d.scrollTop;
							
							// Showing the context menu at calculated mouse position --BY Rahul Kumar--26/11
							$(document).unbind('click');  // Removing previous click handlers --BY Rahul Kumar--26/11
							$(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);  // Positioning and fading in menu --BY Rahul Kumar--26/11
							// Adding hover events to menu items for visual feedback --BY Rahul Kumar--26/11
							$(menu).find('A').mouseover( function() {
								// Removing hover class from all menu items --BY Rahul Kumar--26/11
								$(menu).find('LI.hover').removeClass('hover');
								// Adding hover class to current menu item's parent LI --BY Rahul Kumar--26/11
								$(this).parent().addClass('hover');
							}).mouseout( function() {
								// Removing hover class when mouse leaves menu item --BY Rahul Kumar--26/11
								$(menu).find('LI.hover').removeClass('hover');
							});
							
							// Adding keyboard navigation support for context menu --BY Rahul Kumar--26/11
							$(document).keypress( function(e) {
								switch( e.keyCode ) {
									case 38: // Up arrow key --BY Rahul Kumar--26/11
										// If no item is hovered, select last item --BY Rahul Kumar--26/11
										if( $(menu).find('LI.hover').size() == 0 ) {
											$(menu).find('LI:last').addClass('hover');
										} else {
											// Moving hover to previous enabled item --BY Rahul Kumar--26/11
											$(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
											// If no previous item found, wrap to last item --BY Rahul Kumar--26/11
											if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:last').addClass('hover');
										}
									break;
									case 40: // Down arrow key --BY Rahul Kumar--26/11
										// If no item is hovered, select first item --BY Rahul Kumar--26/11
										if( $(menu).find('LI.hover').size() == 0 ) {
											$(menu).find('LI:first').addClass('hover');
										} else {
											// Moving hover to next enabled item --BY Rahul Kumar--26/11
											$(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
											// If no next item found, wrap to first item --BY Rahul Kumar--26/11
											if( $(menu).find('LI.hover').size() == 0 ) $(menu).find('LI:first').addClass('hover');
										}
									break;
									case 13: // Enter key to activate selected menu item --BY Rahul Kumar--26/11
										$(menu).find('LI.hover A').trigger('click');
									break;
									case 27: // Escape key to close menu --BY Rahul Kumar--26/11
										$(document).trigger('click');
									break
								}
							});
							
							// Handling menu item selection when clicked --BY Rahul Kumar--26/11
							$('#' + o.menu).find('A').unbind('click');  // Removing previous click handlers --BY Rahul Kumar--26/11
							$('#' + o.menu).find('LI:not(.disabled) A').click( function() {
								// Unbinding document click and keypress handlers --BY Rahul Kumar--26/11
								$(document).unbind('click').unbind('keypress');
								// Hiding all context menus --BY Rahul Kumar--26/11
								$(".contextMenu").hide();
								// Executing callback function with action, source element, and position data --BY Rahul Kumar--26/11
								if( callback ) callback( $(this).attr('href').substr(1), $(srcElement), {x: x - offset.left, y: y - offset.top, docX: x, docY: y} );
								return false;  // Preventing default link behavior --BY Rahul Kumar--26/11
							});
							
							// Adding click handler to hide menu when clicking outside (with delay for Mozilla compatibility) --BY Rahul Kumar--26/11
							setTimeout( function() { // Delay for Mozilla browser compatibility --BY Rahul Kumar--26/11
								$(document).click( function() {
									// Unbinding click and keypress handlers when menu is closed --BY Rahul Kumar--26/11
									$(document).unbind('click').unbind('keypress');
									// Fading out the context menu --BY Rahul Kumar--26/11
									$(menu).fadeOut(o.outSpeed);
									return false;  // Preventing event propagation --BY Rahul Kumar--26/11
								});
							}, 0);
						}
					});
				});
				
				// Disabling text selection on context menu for better user experience --BY Rahul Kumar--26/11
				// Using feature detection instead of browser detection for better compatibility --BY Rahul Kumar--26/11
				var isMozilla = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
				var isIE = navigator.userAgent.toLowerCase().indexOf('msie') > -1 || navigator.userAgent.toLowerCase().indexOf('trident') > -1;
				
				if( isMozilla ) {
					// Mozilla/Firefox specific text selection disable --BY Rahul Kumar--26/11
					$('#' + o.menu).each( function() { $(this).css({ 'MozUserSelect' : 'none' }); });
				} else if( isIE ) {
					// Internet Explorer specific text selection disable --BY Rahul Kumar--26/11
					$('#' + o.menu).each( function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
				} else {
					// Other browsers text selection disable --BY Rahul Kumar--26/11
					$('#' + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
				}
				// Disabling browser's default context menu on element and menu (works in IE/Safari + FF/Chrome) --BY Rahul Kumar--26/11
				$(el).add($('UL.contextMenu')).bind('contextmenu', function() { return false; });
				
			});
			return $(this);  // Returning jQuery object for method chaining --BY Rahul Kumar--26/11
		},
		
		// Function to disable specific context menu items dynamically --BY Rahul Kumar--26/11
		disableContextMenuItems: function(o) {
			// If no parameter provided, disable all menu items --BY Rahul Kumar--26/11
			if( o == undefined ) {
				// Adding disabled class to all LI elements in menu --BY Rahul Kumar--26/11
				$(this).find('LI').addClass('disabled');
				return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
			}
			// Looping through each selected element --BY Rahul Kumar--26/11
			$(this).each( function() {
				if( o != undefined ) {
					// Splitting comma-separated list of menu item hrefs to disable --BY Rahul Kumar--26/11
					var d = o.split(',');
					// Looping through each href and disabling corresponding menu item --BY Rahul Kumar--26/11
					for( var i = 0; i < d.length; i++ ) {
						// Finding anchor with matching href and adding disabled class to parent LI --BY Rahul Kumar--26/11
						$(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');
						
					}
				}
			});
			return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
		},
		
		// Function to enable specific context menu items dynamically --BY Rahul Kumar--26/11
		enableContextMenuItems: function(o) {
			// If no parameter provided, enable all disabled menu items --BY Rahul Kumar--26/11
			if( o == undefined ) {
				// Removing disabled class from all LI elements in menu --BY Rahul Kumar--26/11
				$(this).find('LI.disabled').removeClass('disabled');
				return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
			}
			// Looping through each selected element --BY Rahul Kumar--26/11
			$(this).each( function() {
				if( o != undefined ) {
					// Splitting comma-separated list of menu item hrefs to enable --BY Rahul Kumar--26/11
					var d = o.split(',');
					// Looping through each href and enabling corresponding menu item --BY Rahul Kumar--26/11
					for( var i = 0; i < d.length; i++ ) {
						// Finding anchor with matching href and removing disabled class from parent LI --BY Rahul Kumar--26/11
						$(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');
						
					}
				}
			});
			return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
		},
		
		// Function to disable entire context menu(s) on selected elements --BY Rahul Kumar--26/11
		disableContextMenu: function() {
			// Looping through each selected element and adding disabled class --BY Rahul Kumar--26/11
			$(this).each( function() {
				$(this).addClass('disabled');  // Adding disabled class to prevent menu from showing --BY Rahul Kumar--26/11
			});
			return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
		},
		
		// Function to enable context menu(s) on selected elements --BY Rahul Kumar--26/11
		enableContextMenu: function() {
			// Looping through each selected element and removing disabled class --BY Rahul Kumar--26/11
			$(this).each( function() {
				$(this).removeClass('disabled');  // Removing disabled class to allow menu to show --BY Rahul Kumar--26/11
			});
			return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
		},
		
		// Function to completely destroy context menu(s) and remove all event handlers --BY Rahul Kumar--26/11
		destroyContextMenu: function() {
			// Looping through each selected element to remove context menu functionality --BY Rahul Kumar--26/11
			$(this).each( function() {
				// Unbinding mousedown and mouseup event handlers to remove context menu behavior --BY Rahul Kumar--26/11
				$(this).unbind('mousedown').unbind('mouseup');
			});
			return( $(this) );  // Returning jQuery object for chaining --BY Rahul Kumar--26/11
		}
		
	});
})(jQuery);