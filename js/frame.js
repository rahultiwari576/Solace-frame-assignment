/**
 * Author: Lee Langley
 * Date Created: 18/09/2012 10:05
 * @version 1
 */

// Frame constructor function that creates a frame rendering system for canvas elements --BY Rahul Kumar--26/11
Frame = function(userOptions){
	// Checking if FlashCanvas library is available for older browser support --BY Rahul Kumar--26/11
	if(typeof FlashCanvas != 'undefined'){
		// Disabling right-click context menu for flashcanvas to prevent browser menu interference --BY Rahul Kumar--26/11
		window.FlashCanvasOptions = {
			disableContextMenu:true
		};
	}

	// Initializing variables for jQuery reference, Frame instance, canvas element, and 2D context --BY Rahul Kumar--26/11
	var $ = jQuery,  // Storing jQuery reference for convenience --BY Rahul Kumar--26/11
		Frame = this,  // Storing reference to current Frame instance --BY Rahul Kumar--26/11
		canvas = null,  // Canvas DOM element that will be used for rendering --BY Rahul Kumar--26/11
		ctx = null,  // 2D rendering context for drawing operations on canvas --BY Rahul Kumar--26/11
		// Frame object to store frame image, dimensions, and thickness information --BY Rahul Kumar--26/11
		frame = {		
			file:null,				// Frame image file path or image object --BY Rahul Kumar--26/11
			thickness:0,			// Frame width/thickness in millimeters --BY Rahul Kumar--26/11
			thicknessPx:0,			// Frame width/thickness converted to pixels --BY Rahul Kumar--26/11
			width:0,				// The total frame width in pixels --BY Rahul Kumar--26/11
			height:0				// The total frame height in pixels --BY Rahul Kumar--26/11
		},
		// Slip object to store slip (inner border) image and thickness information --BY Rahul Kumar--26/11
		slip = {		
			file:null,				// Slip image file path or image object --BY Rahul Kumar--26/11
			thickness:0,			// Slip width/thickness in millimeters --BY Rahul Kumar--26/11
			thicknessPx:0			// Slip width/thickness converted to pixels --BY Rahul Kumar--26/11
		},
		// Mount object to store mount (mat) layers, padding, and section information --BY Rahul Kumar--26/11
		mount = {		
			lineColor:'#efefef',	// The color of the lines separating mount layers --BY Rahul Kumar--26/11
			layers:[],				// Array of mount layer objects with padding and styling --BY Rahul Kumar--26/11

			imagePadding:50,		// Padding between photos in millimeters (can be number or object) --BY Rahul Kumar--26/11
			imagePaddingPx:{		// Padding between photos in pixels (always an object) --BY Rahul Kumar--26/11
				row:0,  // Vertical padding between photo rows in pixels --BY Rahul Kumar--26/11
				column:0  // Horizontal padding between photo columns in pixels --BY Rahul Kumar--26/11
			},

			sections:[				// Array of mount photo sections defining layout grid --BY Rahul Kumar--26/11
				[
					{
						width:0,		// Image width in millimeters --BY Rahul Kumar--26/11
						height:0,		// Image height in millimeters --BY Rahul Kumar--26/11
						widthPx:0,		// Image width converted to pixels --BY Rahul Kumar--26/11
						heightPx:0		// Image height converted to pixels --BY Rahul Kumar--26/11
					}
				]
			]
		},
		photos = [],	// Array of photo image objects or paths to be displayed in frame --BY Rahul Kumar--26/11
		centerPoint = {	// Object storing the center coordinates of the canvas --BY Rahul Kumar--26/11
			x:0,  // X coordinate of canvas center point --BY Rahul Kumar--26/11
			y:0  // Y coordinate of canvas center point --BY Rahul Kumar--26/11
		},
		// Default configuration options for frame rendering behavior --BY Rahul Kumar--26/11
		defaultOptions = {
			pxPerMM:1,				// Conversion factor: how many pixels per millimeter --BY Rahul Kumar--26/11
			allowZoom:true,			// Whether to allow click-to-zoom functionality on canvas --BY Rahul Kumar--26/11
			allowSave:true,			// Whether to allow saving canvas as PNG image --BY Rahul Kumar--26/11
			autoResize:true,		// Whether to auto-resize frame to fit canvas (prevents cropping) --BY Rahul Kumar--26/11
			fileLoadTries:1			// Number of retry attempts for loading images if they fail (404 errors) --BY Rahul Kumar--26/11
		},
		options = {};  // User-provided options that will override defaults --BY Rahul Kumar--26/11

	// Image loading tracking variables --BY Rahul Kumar--26/11
	var loaded = 0,  // Counter for number of images successfully loaded --BY Rahul Kumar--26/11
		imageCount;  // Total number of images that need to be loaded --BY Rahul Kumar--26/11


	/**
	 * Initialises the frame with user options and sets up canvas for rendering --BY Rahul Kumar--26/11
	 */
	this.init = function(userOptions){
		var i = 0;

		// Deep copying user-defined options to prevent modifying original object --BY Rahul Kumar--26/11
		options = $.extend(true, {}, userOptions || {});
		// Merging user frame options with default frame object --BY Rahul Kumar--26/11
		$.extend(frame, options.frame || {});
		// Merging user slip options with default slip object --BY Rahul Kumar--26/11
		$.extend(slip, options.slip || {});
		// Merging user mount options with default mount object --BY Rahul Kumar--26/11
		$.extend(mount, options.mount || {});
		// Merging user photos array with default photos array --BY Rahul Kumar--26/11
		$.extend(photos, options.photos || []);

		// Defining the canvas object from user options if not already set --BY Rahul Kumar--26/11
		if(canvas == null){
			if(jQuery){
				// jQuery exists - using jQuery to get canvas element (handles both jQuery object and selector) --BY Rahul Kumar--26/11
				canvas = ((options.canvas instanceof jQuery) ? options.canvas : $(options.canvas)).get(0);
			}else{
				// jQuery doesn't exist - assuming canvas is an element ID string --BY Rahul Kumar--26/11
				canvas = document.getElementById(options.canvas);
			}

			// Validating that canvas element was found, returning false if not found --BY Rahul Kumar--26/11
			if(typeof canvas === 'undefined'){
				canvas = null;
				return false;
			}else{
				// Getting 2D rendering context from canvas for drawing operations --BY Rahul Kumar--26/11
				ctx = canvas.getContext('2d');
			}
		}

		// Setting canvas width and height to match its displayed dimensions (offsetWidth/offsetHeight) --BY Rahul Kumar--26/11
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		// Calculating center point coordinates based on canvas dimensions --BY Rahul Kumar--26/11
		centerPoint = {
			x:canvas.width / 2,  // X coordinate of canvas center --BY Rahul Kumar--26/11
			y:canvas.height / 2  // Y coordinate of canvas center --BY Rahul Kumar--26/11
		};

		// Translating canvas coordinate system so center point becomes (0,0) for easier positioning --BY Rahul Kumar--26/11
		ctx.translate(centerPoint.x, centerPoint.y);

		// remove any unwanted option variables
		delete options.frame;
		delete options.slip;
		delete options.mount;
		delete options.photos;
		delete options.canvas;
		// set the options
		options = $.extend(true, defaultOptions, options);


		// if allowSave and jquery.contextMenu and canvas2png is included, add our context menu
		if(options.allowSave && jQuery && $.fn.contextMenu && (typeof canvas2png != 'undefined')){
			// only add the context menu if it doesn't already exist
			if($('#canvasMenu').length == 0){
				// add the context menu
				$('body').append('<ul id="canvasMenu" class="contextMenu">' +
									'<li class="save"><a href="#save">Save Image</a></li>' +
								'</ul>');
				// set up the functionality
				$(canvas)
						// ensure that canvas doesn't already have contextMenu
						.destroyContextMenu()
						// add contextMenu
						.contextMenu(
							{
								menu:'canvasMenu'
							},
							function(action, el, pos){
								if(action == 'save'){
									Frame.save();
								}
							}
						);
			}
		}else{
			// ensure that save functionality is disabled
			$('#canvasMenu').remove();
			$(canvas).destroyContextMenu();
		}

		// if allowZoom we need to add zoom functionality
		if(options.allowZoom){
			// TODO - add click handler to the canvas to show larger/zoomed version of the canvas
		}


		// store a collection of all images
		var imageName = '',	// temporary storage for image name
			hasFrame = (typeof frame.file == 'string') && (frame.file != ''),
			hasSlip = (typeof slip.file == 'string') && (slip.file != '');

		// count images we need to load
		//imageCount = (hasFrame ? 1 : 0) + (hasSlip ? 1 : 0) + mount.layers.length + photos.length;
		imageCount = (hasFrame ? 1 : 0) + (hasSlip ? 1 : 0);
		if(mount.layers.length > 0){
			$.each(mount.layers, function(){
				imageCount += ((typeof this.file == 'string') && (this.file != '')) ? 1 : 0;
			});
		}
		$.each(photos, function(i, photo){
			imageCount += ((typeof photo == 'string') && (photo != '')) ? 1 : 0;
		});


		if(imageCount <= 0){
			postLoadInit();
			return;
		}


		// count images that have been loaded
		loaded = 0;

		// check for a frame image
		if(hasFrame){
			imageName = frame.file;
			frame.file = new Image();
			frame.file.loadCount = 0;

			// error handler
			frame.file.onerror = function(){
				imageErrorCallback(frame);
			};

			if(typeof FlashCanvas != 'undefined'){
				frame.file.src = imageName;
				ctx.loadImage(frame.file, imageLoadCallback());
			}else{
				frame.file.onload = imageLoadCallback;
				frame.file.src = imageName;
			}
		}

		// check for a slip image
		if(hasSlip){
			imageName = slip.file;
			slip.file = new Image();
			slip.file.loadCount = 0;

			// error handler
			slip.file.onerror = function(){
				imageErrorCallback(slip);
			};

			if(typeof FlashCanvas != 'undefined'){
				slip.file.src = imageName;
				ctx.loadImage(slip.file, imageLoadCallback());
			}else{
				slip.file.onload = imageLoadCallback;
				slip.file.src = imageName;
			}
		}

		// check for a mount image
		if(mount.layers.length > 0){
			$.each(mount.layers, function(i, layer){
				if((typeof layer.file == 'string') && (layer.file != '')){
					imageName = layer.file;
					layer.file = new Image();
					layer.file.loadCount = 0;

					// error handler
					layer.file.onerror = function(){
						imageErrorCallback(layer);
					};

					if(typeof FlashCanvas != 'undefined'){
						layer.file.src = imageName;
						ctx.loadImage(layer.file, imageLoadCallback());
					}else{
						layer.file.onload = imageLoadCallback;
						layer.file.src = imageName;
					}
				}
			});
		}

		// check for photos
		$.each(photos, function(i, photo){
			if((typeof photo == 'string') && (photo != '')){
				imageName = photo;

				// photo is a string, so convert original reference to object
				photos[i] = new Image();
				photos[i].loadCount = 0;

				// error handler
				photos[i].onerror = function(){
					imageErrorCallback({file:photos[i],photoNum:i});
				};

				if(typeof FlashCanvas != 'undefined'){
					photos[i].src = imageName;
					ctx.loadImage(photos[i], imageLoadCallback());
				}else{
					photos[i].onload = imageLoadCallback;
					photos[i].src = imageName;
				}
			}
		});
	};

	/**
	 * Starts the actual drawing process after all images are loaded and calculates frame size --BY Rahul Kumar--26/11
	 */
	var postLoadInit = function(){
		// Calculating all frame dimensions, padding, and section sizes in pixels --BY Rahul Kumar--26/11
		calculateSizes();
		// Drawing the complete frame with all components (frame, mount, photos) --BY Rahul Kumar--26/11
		Frame.draw();
	};

	/**
	 * Callback function executed when an image successfully loads --BY Rahul Kumar--26/11
	 */
	var imageLoadCallback = function(){
		// Incrementing loaded image counter --BY Rahul Kumar--26/11
		loaded++;
		// Checking if all required images have finished loading --BY Rahul Kumar--26/11
		if(loaded == imageCount){
			// All images have been loaded - proceed with frame initialization and drawing --BY Rahul Kumar--26/11
			postLoadInit();
		}
	};

	/**
	 * Callback function executed when an image fails to load --BY Rahul Kumar--26/11
	 *
	 * @param file - Object containing file information and load count
	 * @return {Boolean} - Returns false if retry limit reached
	 */
	var imageErrorCallback = function(file){
		// Checking if file is null or maximum retry attempts have been reached --BY Rahul Kumar--26/11
		if((file.file === null) || (file.file.loadCount >= options.fileLoadTries)){
			// Maximum failed attempts reached - marking image as null and continuing without it --BY Rahul Kumar--26/11
			file.file = null;
			// If this was a photo, marking the photo array position as null --BY Rahul Kumar--26/11
			if(!isNaN(file.photoNum)){
				photos[file.photoNum] = null;
			}
			// Calling load callback to continue initialization process --BY Rahul Kumar--26/11
			imageLoadCallback();
			return false;
		}

		// Re-defining the image src to force a reload attempt --BY Rahul Kumar--26/11
		file.file.src = file.file.src;
		// Incrementing the load count to track retry attempts --BY Rahul Kumar--26/11
		file.file.loadCount++;
	};

	/**
	 * calculate the frame sizes
	 */
	var calculateSizes = function(){
		var i = 0, j = 0;

		// this defines how much padding is around each image - it is made up of the mount layer padding
		var imagePadding = {
			x:0,
			y:0
		};

		// set frame with and height to 0
		frame.width = 0;
		frame.height = 0;

		// we need to calculate the size of the frame, in pixels, from the size in mm
		frame.thicknessPx = frame.thickness*options.pxPerMM;
		slip.thicknessPx = slip.thickness*options.pxPerMM;

		// add the frame/slip thickness to the overall frame size
		frame.width += (frame.thicknessPx*2) + (slip.thicknessPx*2);
		frame.height += (frame.thicknessPx*2) + (slip.thicknessPx*2);

		// check the mount layers
		if(mount.layers.length > 0){
			// the frame has mounts - loop through them
			$.each(mount.layers, function(i, layer){
				// ensure that its padding is defined as an object
				layer.padding = (typeof layer.padding == 'object') ?
									$.extend({top:0, bottom:0, left:0, right:0}, layer.padding)
									:
									{top:layer.padding, bottom:layer.padding, left:layer.padding, right:layer.padding};

				layer.paddingPx = {
					top:layer.padding.top * options.pxPerMM,
					bottom:layer.padding.bottom * options.pxPerMM,
					left:layer.padding.left * options.pxPerMM,
					right:layer.padding.right * options.pxPerMM
				};

				if(i == 0){
					// this is the first layer - add the padding to the overall frame dimensions
					frame.width += layer.paddingPx.left + layer.paddingPx.right;
					frame.height += layer.paddingPx.top + layer.paddingPx.bottom;
				}else{
					// inner layer - add the padding to the image padding
					imagePadding.x += layer.paddingPx.left + layer.paddingPx.right;
					imagePadding.y += layer.paddingPx.top + layer.paddingPx.bottom;
				}
			});
		}

		// check the image padding (this is the gap between images)
		mount.imagePadding = (typeof mount.imagePadding == 'object') ? mount.imagePadding : {row:mount.imagePadding, column:mount.imagePadding};
		mount.imagePaddingPx = {
			row:mount.imagePadding.row*options.pxPerMM,
			column:mount.imagePadding.column*options.pxPerMM
		};

		// store the row widths
		var rowWidths = [];
		// loop through each section row
		$.each(mount.sections, function(i, row){
			// start the row widths count, for this row
			rowWidths[i] = 0;

			// defines the row height
			var rowHeight = 0;

			// loop through each section in the row
			$.each(row, function(j, column){
				// convert the image width/heights into pixels
				column.widthPx = column.width*options.pxPerMM;
				column.heightPx = column.height*options.pxPerMM;

				// add the photo width to the row width
				rowWidths[i] += column.widthPx + imagePadding.x;
				// if the photo height is larger than the previous photo (for this row) set it as the row height
				rowHeight = (column.heightPx+imagePadding.y > rowHeight) ? column.heightPx+imagePadding.y : rowHeight;

				// if we are not on the first section of the row add some right padding
				if(j > 0){
					rowWidths[i] += mount.imagePaddingPx.column;
				}
			});

			// add the row height
			frame.height += rowHeight + ((i > 0) ? mount.imagePaddingPx.row : 0);
		});

		// add the width of the widest row to the frame width
		frame.width += (rowWidths.length > 0) ? Math.max.apply(Math, rowWidths) : 0;

		// now that we have the dimensions, we need to increase/decrease them to fit as closely as possible to the canvas size
		if((frame.width <= 0) || (frame.height <= 0)){
			return false;
		}else if(options.autoResize){
			var widthDifference = canvas.width - Math.round(frame.width),
				heightDifference = canvas.height - Math.round(frame.height),
				allowableDifference = 5;
			if((widthDifference < -allowableDifference) || (heightDifference < -allowableDifference)){
				// the frame output size is larger than the canvas - calculate a resize ratio

				// calculate the highest percent decrease (width|height) for the frame to fit within the canvas
				var percent = Math.max((frame.width - canvas.width) / frame.width, (frame.height - canvas.height) / frame.height);

				// now resize every element by the percent
				frame.thickness -= frame.thickness*percent;
				slip.thickness -= slip.thickness*percent;

				if(mount.layers.length > 0){
					// the frame has mounts - loop through them
					$.each(mount.layers, function(i, layer){
						layer.padding.top -= layer.padding.top*percent;
						layer.padding.bottom -= layer.padding.bottom*percent;
						layer.padding.left -= layer.padding.left*percent;
						layer.padding.right -= layer.padding.right*percent;

						if(layer.file != null){
							// mount file exists
							layer.file.width -= Math.round(layer.file.width*percent);
							layer.file.height -= Math.round(layer.file.height*percent);
						}
					});
				}

				mount.imagePadding.row -= mount.imagePadding.row*percent;
				mount.imagePadding.column -= mount.imagePadding.column*percent;

				// loop through each section row
				$.each(mount.sections, function(i, row){
					// loop through each section in the row
					$.each(row, function(j, column){
						column.width -= column.width*percent;
						column.height -= column.height*percent;
					});
				});

				// force a re-calculation of the frame sizes
				calculateSizes();
			}else if((widthDifference > allowableDifference) && (heightDifference > allowableDifference)){
				// the frame output size is smaller than the canvas - calculate the resize ratio

				// calculate the lowest percent increase (width|height) for the frame to fit within the canvas
				var percent = Math.min((canvas.width - frame.width) / frame.width, (canvas.height - frame.height) / frame.height);

				// now resize every element by the percent
				frame.thickness += frame.thickness*percent;
				slip.thickness += slip.thickness*percent;

				if(mount.layers.length > 0){
					// the frame has mounts - loop through them
					$.each(mount.layers, function(i, layer){
						layer.padding.top += layer.padding.top*percent;
						layer.padding.bottom += layer.padding.bottom*percent;
						layer.padding.left += layer.padding.left*percent;
						layer.padding.right += layer.padding.right*percent;

						if(layer.file != null){
							// mount file exists
							layer.file.width += Math.round(layer.file.width*percent);
							layer.file.height += Math.round(layer.file.height*percent);
						}
					});
				}

				mount.imagePadding.row += mount.imagePadding.row*percent;
				mount.imagePadding.column += mount.imagePadding.column*percent;

				// loop through each section row
				$.each(mount.sections, function(i, row){
					// loop through each section in the row
					$.each(row, function(j, column){
						column.width += column.width*percent;
						column.height += column.height*percent;
					});
				});

				// force a re-calculation of the frame sizes
				calculateSizes();
			}
		}
	};

	/**
	 * Handle function for drawing frames (rims & slips)
	 *
	 * @param x1
	 * @param y1
	 * @param x2
	 * @param y2
	 * @param thickness
	 * @param file
	 * @param fillColor
	 * @param shadow
	 */
	var drawFrame = function(x1, y1, x2, y2, thickness, file, fillColor, shadow){
		thickness = parseInt(thickness) || 0;

		// draw the drop shadow
		if(shadow !== false){
			var offset = (Math.min(frame.width, frame.height) > 300) ? 2 : 1;
			ctx.shadowOffsetX = offset;				// Sets the shadow offset x
			ctx.shadowOffsetY = offset;				// Sets the shadow offset y
			ctx.shadowBlur = 4;						// Sets the shadow blur size
			ctx.shadowColor = 'rgba(0, 0, 0, 1)';	// Sets the shadow color
			ctx.lineWidth = 1;
			ctx.strokeStyle = 'rgba(255,255,255,1)';

			ctx.beginPath();
			offset = thickness/2
			ctx.moveTo(x1+offset, y1+offset);
			ctx.lineTo(x2-offset, y1+offset);
			ctx.lineTo(x2-thickness-2, y1+thickness-2);
			ctx.lineTo(x1+thickness-2, y1+thickness-2);
			ctx.lineTo(x1+thickness-2, y2-thickness-2);
			ctx.lineTo(x1+offset, y2-offset);
			ctx.lineTo(x1+offset, y1+offset);
			ctx.closePath();
			ctx.stroke();

			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
		}


		// draw the frame
		if(file && (file.width > 0) && (file.height > 0)){
			var length = 0,	// tracks the current output length of a frame side
				count = 0,
				aspectRatio = file.width / file.height,
				frameHeight = Math.floor(thickness / aspectRatio);
			frameHeight = (frameHeight <= 1) ? 2 : frameHeight;

			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y1);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x1, y2);
			ctx.closePath();
			ctx.clip();
			// repeat the frame down the left-hand side
			for(count = 0; length < frame.height; count++){
				ctx.drawImage(file, x1, Math.floor(y1 + ((frameHeight-1)*count)), thickness, frameHeight);
				length += frameHeight-1;
			}

			// right
			var degrees = (Math.PI/180) * 180;
			ctx.rotate(degrees);
			length = 0;
			for(count = 0; length < frame.height; count++){
				ctx.drawImage(file, x1, Math.floor(y1 + ((frameHeight-1)*count)), thickness, frameHeight);
				length += frameHeight-1;
			}
			ctx.rotate(-degrees);
			ctx.restore();


			ctx.save();
			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y1);
			ctx.lineTo(x2-thickness, y1 + thickness);
			ctx.lineTo(x2-thickness, y2-thickness);
			ctx.lineTo(x2, y2);
			ctx.lineTo(x1, y2);
			ctx.lineTo(x1+thickness, y2-thickness);
			ctx.lineTo(x1+thickness, y1+thickness);
			ctx.closePath();
			ctx.clip();

			degrees = (Math.PI/180) * 90;
			ctx.rotate(degrees);
			// top
			length = 0;
			for(count = 0; length < frame.width; count++){
				ctx.drawImage(file, y1, Math.floor(x1 + ((frameHeight-1)*count)), thickness, frameHeight);
				length += frameHeight-1;
			}
			ctx.rotate(-degrees*2);
			// bottom
			length = 0;
			for(count = 0; length < frame.width; count++){
				ctx.drawImage(file, y1, Math.floor(x1 + ((frameHeight-1)*count)), thickness, frameHeight);
				length += frameHeight-1;
			}
			ctx.rotate(degrees);
			ctx.restore();
		}else{
			// frame image doesn't exist - use a colour fill

			// define the fill colour
			ctx.fillStyle = fillColor || '#eaeaea';

			// top
			ctx.fillRect(x1, y1, x2-x1, thickness);
			// bottom
			ctx.fillRect(x1, y2-thickness, x2-x1, thickness);
			// left
			ctx.fillRect(x1, y1, thickness, y2-y1);
			// right
			ctx.fillRect(x2-thickness, y1, thickness, y2-y1);
		}
	};

	/**
	 * Draw the backing mount (not including
	 * any photo sections or photos)
	 */
	var drawMount = function(mountLayer, coords, border, padding){
		if(mountLayer){
			if(mountLayer.color){
				ctx.fillStyle = mountLayer.color;
				ctx.fillRect(coords.x1, coords.y1, coords.x2-coords.x1, coords.y2-coords.y1);
			}

			if((mountLayer.file != null) && (mountLayer.file.width > 0) && (mountLayer.file.height > 0)){
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(coords.x1, coords.y1);
				ctx.lineTo(coords.x1, coords.y2);
				ctx.lineTo(coords.x2, coords.y2);
				ctx.lineTo(coords.x2, coords.y1);
				ctx.lineTo(coords.x1, coords.y1);
				ctx.closePath();
				ctx.clip();

				var height = 0;
				for(var i = 0; height < frame.height; i++){
					var width = 0;
					for(var j = 0; width < frame.width; j++){
						ctx.drawImage(mountLayer.file, Math.floor(coords.x1 + ((mountLayer.file.width-1)*j)), Math.floor(coords.y1 + ((mountLayer.file.height-1)*i)), mountLayer.file.width, mountLayer.file.height);
						width += mountLayer.file.width-1;
					}
					height += mountLayer.file.height-1;
				}

				ctx.restore();
			}

			if(border){
				// determine the padding
				if(typeof padding == 'object'){
					padding = Math.min(padding.top, padding.top, padding.bottom, padding.left, padding.right);
				}else{
					padding = parseInt(padding);
					if(isNaN(padding)){
						padding = 0;
					}
				}

				// set the line colours
				var lineColorLight = mount.lineColor,
					lineColorDark = shadeColor(mount.lineColor, -10);	// determine the shadow/dark colour from the light colour

				// outer line
				ctx.lineWidth = 1;
				// if padding is too small to have the inner line, set the top section to use the darker colour so we still have shading
				ctx.strokeStyle = (padding >= 5) ? lineColorLight : lineColorDark;
				ctx.beginPath();
				ctx.moveTo(coords.x2, coords.y1);
				ctx.lineTo(coords.x1, coords.y1);
				ctx.lineTo(coords.x1, coords.y2);
				ctx.stroke();
				ctx.closePath();
				ctx.strokeStyle = lineColorLight;
				ctx.beginPath();
				ctx.moveTo(coords.x1, coords.y2);
				ctx.lineTo(coords.x2, coords.y2);
				ctx.lineTo(coords.x2, coords.y1);
				ctx.stroke();
				ctx.closePath();

				// only output the inner line if padding space is greater than 5px, otherwise the lines take up too much space
				if(padding >= 5){
					// inner line
					ctx.strokeStyle = lineColorDark;
					ctx.beginPath();
					ctx.moveTo(coords.x2-1, coords.y1+1);
					ctx.lineTo(coords.x1+1, coords.y1+1);
					ctx.lineTo(coords.x1+1, coords.y2-1);
					ctx.stroke();
					ctx.closePath();
				}
			}
		}
	};

	/**
	 * Draw the actual frame rim
	 */
	var drawRim = function(){
		if(frame.thickness > 0){
			var frameCoords = {
				x1:Math.floor(-(frame.width/2)),
				x2:Math.ceil(-(frame.width/2) + frame.width),
				y1:Math.floor(-(frame.height/2)),
				y2:Math.ceil(-(frame.height/2)+frame.height)
			};
			drawFrame(frameCoords.x1, frameCoords.y1, frameCoords.x2, frameCoords.y2, frame.thickness, frame.file, null, slip.thickness > 0);
		}
	};

	/**
	 * Draw the frame slip
	 */
	var drawSlip = function(){
		if(slip.thickness > 0){
			var frameCoords = {
				x1:Math.floor(-(frame.width/2)+frame.thickness),
				x2:Math.ceil(-(frame.width/2) + frame.width - frame.thickness),
				y1:Math.floor(-(frame.height/2) + frame.thickness),
				y2:Math.ceil(-(frame.height/2) + frame.height - frame.thickness)
			};
			drawFrame(frameCoords.x1, frameCoords.y1, frameCoords.x2, frameCoords.y2, slip.thickness, slip.file, '#ddd');
		}
	};

	/**
	 * draw a mount picture section with the specified
	 * width and height and originating from the center
	 * of the frame.
	 *
	 * If image is defined, then it will also draw that.
	 *
	 * @param width
	 * @param height
	 * @param image
	 */
	var drawImageBlock = function(width, height, x, y, image){
		// calculate the starting x/y coordinates
		var x1 = (typeof x == 'number') ? x : -(width/2),
			y1 = (typeof y == 'number') ? y : -(height/2),
			x2 = x1 + width,
			y2 = y1 + height;

		// output the frame layers, around the image
		if(mount.layers.length > 1){
			var i = 0,
				paddingX = 0,
				paddingY = 0;
			$.each(mount.layers, function(i, layer){
				if(i > 0){
					paddingX += layer.paddingPx.left;
					paddingY += layer.paddingPx.top;
				}
			});


			x2 += paddingX + mount.layers[1].paddingPx.right;
			y2 += paddingY + mount.layers[1].paddingPx.bottom;

			$.each(mount.layers, function(i, layer){
				if(i > 0){
					layer.color = layer.color || '#fff';
					drawMount(layer, {x1:x1,x2:x2,y1:y1,y2:y2}, true, layer.paddingPx);

					x1 += layer.paddingPx.left;
					x2 -= layer.paddingPx.right;
					y1 += layer.paddingPx.top;
					y2 -= layer.paddingPx.bottom;
				}
			});
		}

		// fill the image section
		ctx.fillStyle = '#efefef';
		ctx.fillRect(x1, y1, width, height);

		// draw the image (if one exists)
		if((image !== null) && (typeof image == 'object')){
			ctx.drawImage(image, x1, y1, width, height);
		}
	};

	/**
	 * Draws all of the frame components;
	 * Frame, mount, slide, images etc
	 */
	this.draw = function(){
		// draw the mount
		if(mount.layers.length > 0){
			var x1 = -(frame.width/2),
				x2 = x1 + frame.width,
				y1 = -(frame.height/2),
				y2 = y1 + frame.height;
			mount.layers[0].color = mount.layers[0].color || ((mount.layers.length >  1) ? '#fff' : null);
			drawMount(mount.layers[0], {x1:x1,x2:x2,y1:y1,y2:y2});
		}


		// ensure that the mount layer exists
		var mountLayer = mount.layers[0] || {paddingPx:{top:0,bottom:0,left:0,right:0}};

		// calculate the inner frame dimensions
		var width = frame.width - (frame.thicknessPx*2) - (slip.thickness*2),
			height = frame.height - (frame.thicknessPx*2) - (slip.thickness*2);

		// calculate the padding around each image (for the mount layers)
		var i = 0,
			imagePadding = {
				top:0,
				bottom:0,
				left:0,
				right:0
			};
		// loop through each mount layer and calculate its padding
		$.each(mount.layers, function(i, layer){
			if(i > 0){
				imagePadding.left += layer.paddingPx.left;
				imagePadding.right += layer.paddingPx.right;
				imagePadding.top += layer.paddingPx.top;
				imagePadding.bottom += layer.paddingPx.bottom;
			}
		});

		// loop through and output the photos
		var count = 0,	// the image count (for referencing photos)
			yOffset = -(height/2) + mountLayer.paddingPx.top;
		$.each(mount.sections, function(i, row){
			var rowHeight = 0,
				xOffset = 0;
			if(row.length == 1){
				// only one picture in this row - horizontally center it

				// get the width of the row
				var rowWidth = width - mountLayer.paddingPx.left - mountLayer.paddingPx.right;
				xOffset = -(width/2) + mountLayer.paddingPx.left + ((rowWidth/2) - ((row[0].widthPx)/2)) - imagePadding.left;
			}else{
				// more than one image on the row
				xOffset = -(width/2) + mountLayer.paddingPx.left;
			}

			$.each(row, function(j, column){
				drawImageBlock(column.widthPx, column.heightPx, xOffset, yOffset, photos[count]);

				xOffset += column.widthPx + mount.imagePaddingPx.column + imagePadding.left + imagePadding.right;
				count++;

				rowHeight = (column.heightPx > rowHeight) ? column.heightPx : rowHeight;
			});

			yOffset += rowHeight + mount.imagePaddingPx.row + imagePadding.top + imagePadding.bottom;
		});


		// draw the frame rim
		drawRim();

		// draw the frame slip
		drawSlip();
	};

	/**
	 * Saves the rendered frame canvas as a PNG image file --BY Rahul Kumar--26/11
	 */
	this.save = function(){
		// Checking if canvas2png function is available for image saving --BY Rahul Kumar--26/11
		if(typeof canvas2png != 'undefined'){
			try{
				// Attempting to save canvas as PNG image with filename 'frame' --BY Rahul Kumar--26/11
				canvas2png(canvas, {name:'frame'});
			}catch(e){
				// Displaying error alert if save operation fails --BY Rahul Kumar--26/11
				alert('Error saving image, please try again');
			}
		}else{
			// No image save functionality exists - displaying alert to inform user --BY Rahul Kumar--26/11
			alert('No method for saving the image exists');
		}
	};


	// Running jQuery-specific functionality for window resize handling --BY Rahul Kumar--26/11
	if(jQuery){
		// If FlashCanvas is not being used, adding window resize handler to reinitialize frame --BY Rahul Kumar--26/11
		// FlashCanvas can't handle resize as it makes browser unresponsive and doesn't resize properly --BY Rahul Kumar--26/11
		if(typeof FlashCanvas == 'undefined'){
			// Binding window resize event to reinitialize frame when window size changes --BY Rahul Kumar--26/11
			$(window).resize(function(){
				Frame.init();
			});
		}
	}

	/**
	 * Takes a hexadecimal or RGB color and returns a color that is different by the specified shade --BY Rahul Kumar--26/11
	 *
	 *
	 * colour can be defined as a Hexdecimal value:
	 * #f5dd66, f04eaa (with or without the hash)
	 *
	 * An array of RGB values:
	 * [0, 245, 67] (R,G,B)
	 *
	 * Or an object with the variables 'r', 'g', and 'b':
	 * {
	 *     r:0,
	 *     g:245,
	 *     b:67
	 * }
	 *
	 * The returned value will be of the same type as the given colour
	 *
	 * @param colour
	 * @param shade
	 * @return {String}|{object}
	 */
	var shadeColor = function(colour, shade){
		var R = 0, G = 0, B = 0;

		var type = (colour.constructor == Array) ? 'array' : ((typeof colour == 'object') ? 'object' : 'hex');

		if(type == 'hex'){
			// the colour is a string - assume HEX value

			// remove the hash and ensure that the colour is 6 characters long
			colour = colour.replace('#', '');
			while(colour.length < 6){
				// substring the colour to 3 characters
				colour = colour.substring(0, 3);
				// add the 3 characters on again, to make it 6 characters long
				colour += colour;
			}

			// convert string to int (radix 16)
			colour = parseInt(colour, 16);

			// get the RGB values
			R = (colour & 0xFF0000) >> 16;
			G = (colour & 0x00FF00) >> 8;
			B = (colour & 0x0000FF) >> 0;
		}else{
			// colour is an object|array - get the RGB values
			R = colour.r || colour[0] || 0;
			G = colour.g || colour[1] || 0;
			B = colour.b || colour[2] || 0;
		}

		// get the shade difference
		R += Math.floor((shade/255)*R);
		G += Math.floor((shade/255)*G);
		B += Math.floor((shade/255)*B);

		// ensure that the values aren't over 255 or under 0
		R = (R > 255) ? 255 : ((R < 0) ? 0 : R);
		G = (G > 255) ? 255 : ((G < 0) ? 0 : G);
		B = (B > 255) ? 255 : ((B < 0) ? 0 : B);

		if(type == 'hex'){
			// convert the RGB values back to HEX
			var newColour = (R<<16) + (G<<8) + (B);
			newColour = newColour.toString(16);

			// if the string is less than 6 characters long pad it out
			// we need this, otherwise we loose any leading zeros
			while(newColour.length < 6){
				newColour = '0' + newColour;
			}

			return '#' + newColour;
		}else if(type == 'array'){
			// return an array
			return [R,G,B];
		}else{
			// return an object
			return {r:R,g:G,b:B};
		}
	};


	// Initializing the Frame plugin with user-provided options to start rendering process --BY Rahul Kumar--26/11
	this.init(userOptions);
};