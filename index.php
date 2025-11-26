<!DOCTYPE html>
<!-- HTML5 document declaration for the photo frame editor application --BY Rahul Kumar--26/11 -->
<html>
	<head>
		<!-- Setting the page title for the browser tab --BY Rahul Kumar--26/11 -->
		<title>Rahul-Task</title>
		<!-- Including Bootstrap CSS framework for responsive styling and UI components --BY Rahul Kumar--26/11 -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<style>
			/* Setting HTML element to full width and height for full viewport coverage --BY Rahul Kumar--26/11 */
			html{
				width:100%;
				height:100%;
			}
			/* Removing default margins and padding, setting body to full viewport dimensions with white background --BY Rahul Kumar--26/11 */
			body{
				margin:0;
				padding:0;
				width:100%;
				height:100%;
				background:#fff;
			}
			/* Styling the canvas element to be centered, full width/height with minimum dimensions and pointer cursor --BY Rahul Kumar--26/11 */
			canvas#testCanvas{
				display:block;
				margin:0 auto;
				width:100%;
				min-width:60px;
				height:100%;
				min-height:60px;
				cursor:pointer;
			}
		/* Adding border and margin to all images for visual separation --BY Rahul Kumar--26/11 */
		img{border:solid 1px; margin:10px;}
		/* Adding shadow effect to selected elements for visual feedback --BY Rahul Kumar--26/11 */
		.selected{
		box-shadow:0px 12px 22px 1px #333;
		}
		/* Styling for frame options to show selection state --BY Rahul Kumar--26/11 */
		.frame-option.selected{
			border:2px solid #007bff !important;
			box-shadow:0px 4px 8px rgba(0,123,255,0.5);
		}
		/* Styling for sample and uploaded photos when selected --BY Rahul Kumar--26/11 */
		.sample-photo.selected, .uploaded-photo.selected{
			border:2px solid #007bff !important;
			box-shadow:0px 4px 8px rgba(0,123,255,0.5);
		}
		/* Styling for tab navigation to improve visibility --BY Rahul Kumar--26/11 */
		.nav-tabs {
			border-bottom: 2px solid #ddd;
			margin-bottom: 15px;
		}
		.nav-tabs > li > a{
			color: #333;
			cursor: pointer;
			padding: 10px 15px;
		}
		.nav-tabs > li > a:hover{
			background-color: #f5f5f5;
			border-color: #ddd #ddd transparent;
		}
		.nav-tabs > li.active > a{
			color: #007bff;
			font-weight: bold;
			background-color: #fff;
			border: 1px solid #ddd;
			border-bottom-color: transparent;
		}
		/* Ensuring tab panes are properly hidden/shown --BY Rahul Kumar--26/11 */
		.tab-pane {
			display: none;
		}
		.tab-pane.active {
			display: block;
		}
		</style>
		<!-- Including canvas to PNG conversion library for image export functionality --BY Rahul Kumar--26/11 -->
		<script src="js/flashcanvas/canvas2png.js"></script>
		<!-- Including jQuery library for DOM manipulation and event handling --BY Rahul Kumar--26/11 -->
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<!-- Including Bootstrap JavaScript for tab functionality and UI components --BY Rahul Kumar--26/11 -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<!-- Including custom frame.js library for canvas frame rendering functionality --BY Rahul Kumar--26/11 -->
		<script src="js/frame.js"></script>
		<!-- Including context menu CSS for right-click menu styling --BY Rahul Kumar--26/11 -->
		<link rel="stylesheet" href="resources/jquery.contextmenu/jquery.contextMenu.css" media="screen">
		<!-- Including context menu JavaScript for right-click menu functionality --BY Rahul Kumar--26/11 -->
		<script src="resources/jquery.contextmenu/jquery.contextMenu.js"></script>
	</head>
	<body>
		<?php
		// Disabling error reporting to prevent error messages from displaying to users --BY Rahul Kumar--26/11
		error_reporting(0);
		// Starting PHP session to store user data across page requests --BY Rahul Kumar--26/11
		session_start();
		// Retrieving the uploaded picture path from session storage --BY Rahul Kumar--26/11
		$session_picture = $_SESSION['picture'];
		// Setting default canvas dimensions if no picture is uploaded, otherwise getting actual image dimensions --BY Rahul Kumar--26/11
		if(empty($session_picture)){
			 $width='200';  // Default width when no image is selected --BY Rahul Kumar--26/11
			 $height='200'; // Default height when no image is selected --BY Rahul Kumar--26/11
		}else{
		// Extracting width and height from the uploaded image file using getimagesize function --BY Rahul Kumar--26/11
		list($width, $height) = getimagesize($session_picture);
		}

		?>
		<!-- Bootstrap container for responsive layout and content centering --BY Rahul Kumar--26/11 -->
		<div class="container">
			<br>
			<br>
			<!-- Displaying error message from session if any error occurred during image upload/processing --BY Rahul Kumar--26/11 -->
			<?php if(isset($_SESSION['error'])): ?>
				<div class="alert alert-danger alert-dismissible" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<!-- Outputting error message and removing it from session after display --BY Rahul Kumar--26/11 -->
					<?php echo $_SESSION['error']; unset($_SESSION['error']); ?>
				</div>
			<?php endif; ?>
			<!-- Main content row with border and padding for visual separation --BY Rahul Kumar--26/11 -->
			<div class="row" style="border:1px solid #000;padding: 50px 20px 50px 20px;">
				
				<!-- Left column for canvas display area (5 out of 12 columns) --BY Rahul Kumar--26/11 -->
				<div class="col-md-5">
					<!-- Canvas element where the framed photo will be rendered and displayed --BY Rahul Kumar--26/11 -->
					<canvas id="testCanvas"></canvas>
				</div>
				<!-- Right column for form controls and options (7 out of 12 columns) --BY Rahul Kumar--26/11 -->
				<div class="col-md-7">
					<!-- Layer Management Tabs for switching between different layer configurations --BY Rahul Kumar--26/11 -->
					<div class="col-md-12">
						<ul class="nav nav-tabs" id="layerTabs" role="tablist">
							<li role="presentation" class="active"><a href="#sizeLayer" aria-controls="sizeLayer" role="tab" data-toggle="tab">Size Layer</a></li>
							<li role="presentation"><a href="#photoLayer" aria-controls="photoLayer" role="tab" data-toggle="tab">Photo Layer</a></li>
							<li role="presentation"><a href="#frameLayer" aria-controls="frameLayer" role="tab" data-toggle="tab">Frame Layer</a></li>
						</ul>
					</div>
					<br>
					<!-- Tab content container for different layer configurations --BY Rahul Kumar--26/11 -->
					<div class="tab-content">
						<!-- Size Layer Tab: For entering photo dimensions --BY Rahul Kumar--26/11 -->
						<div role="tabpanel" class="tab-pane active" id="sizeLayer">
							<div class="col-md-12">
								<!-- Step 1 heading for user guidance --BY Rahul Kumar--26/11 -->
								<h4>Step 1: Enter your photo width and height</h4>
								<br>
								<!-- Form for submitting image upload with POST method and multipart encoding for file uploads --BY Rahul Kumar--26/11 -->
								<form action="action.php" method="post" enctype="multipart/form-data" id="uploadForm">
								<div class="col-md-4">
									<!-- Height input field with number type, minimum value 1, and required validation --BY Rahul Kumar--26/11 -->
									<label>Height *</label>
									<input type="number" id="inputHeight" name="height" min="1" placeholder="Enter Height" value="<?= $height; ?>" required />
								</div>
								<div class="col-md-4">
									<!-- Width input field with number type, minimum value 1, and required validation --BY Rahul Kumar--26/11 -->
									<label>Width *</label>
									<input type="number" id="inputWidth" name="width" min="1" placeholder="Enter Width" value="<?= $width; ?>" required/>
								</div>
								<div class="col-md-4">
									<!-- Preview update button to apply size changes without form submission --BY Rahul Kumar--26/11 -->
									<label>&nbsp;</label><br>
									<button type="button" id="updatePreviewBtn" class="btn btn-primary">Update Preview</button>
								</div>
							</div>
						</div>
						
						<!-- Photo Layer Tab: For selecting or uploading photos --BY Rahul Kumar--26/11 -->
						<div role="tabpanel" class="tab-pane" id="photoLayer">
							<div class="col-md-12">
								<!-- Step 2 heading for photo selection/upload --BY Rahul Kumar--26/11 -->
								<h4>Step 2: Choose your photo or upload your own photo</h4>
								<br>
								
								<!-- Sample Images Gallery Section --BY Rahul Kumar--26/11 -->
								<div class="col-md-12">
									<h5>Sample Images (Nature & Landscapes):</h5>
									<!-- Container for displaying sample images in a flex layout --BY Rahul Kumar--26/11 -->
									<div id="samplePhotos" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
										<!-- Sample image 1: Nature landscape from samples folder --BY Rahul Kumar--26/11 -->
										<img src="samples/Nature_Landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Nature_Landscape.webp')" title="Nature Landscape">
										<!-- Sample image 2: Mountain landscape from samples folder --BY Rahul Kumar--26/11 -->
										<img src="samples/mountain_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/mountain_landscape.webp')" title="Mountain Landscape">
										<!-- Sample image 3: Forest scene from samples folder --BY Rahul Kumar--26/11 -->
										<img src="samples/Forest_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Forest_landscape.webp')" title="Forest Landscape">
										<!-- Sample image 4: Ocean view from samples folder --BY Rahul Kumar--26/11 -->
										<img src="samples/Ocean_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Ocean_landscape.webp')" title="Ocean Landscape">
										<!-- Sample image 5: Sunset scene from samples folder --BY Rahul Kumar--26/11 -->
										<img src="samples/Sunset_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Sunset_landscape.webp')" title="Sunset Landscape">
										<!-- Sample image 6: Desert landscape from samples folder --BY Rahul Kumar--26/11 -->
										<img src="samples/Desert_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Desert_landscape.webp')" title="Desert Landscape">
									</div>
								</div>
								
								<!-- Previously Uploaded Photos Section --BY Rahul Kumar--26/11 -->
								<div class="col-md-12">
									<h5>Your Uploaded Photos:</h5>
									<!-- Container for displaying previously uploaded photos in a flex layout --BY Rahul Kumar--26/11 -->
									<div id="uploadedPhotos" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
										<?php
										// Finding all previously uploaded thumbnail files in the upload directory --BY Rahul Kumar--26/11
										$uploadedFiles = glob('upload/*_thump.*');
										// Looping through each uploaded file and displaying as clickable thumbnail images --BY Rahul Kumar--26/11
										foreach($uploadedFiles as $file) {
											// Creating clickable image thumbnails with styling and onclick handler to select photo --BY Rahul Kumar--26/11
											echo '<img src="'.$file.'" class="uploaded-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto(\''.$file.'\')">';
										}
										?>
									</div>
								</div>
								
								<!-- File Upload Section --BY Rahul Kumar--26/11 -->
								<div class="col-md-12">
									<h5>Upload Your Own Photo:</h5>
									<!-- File input for uploading new images with validation for jpg, jpeg, png formats --BY Rahul Kumar--26/11 -->
									<input type="file" name="image" id="fileInput" onchange='single_attachment(this,"jpg","jpeg","png","PNG","JPG","JPEG",")' accept="image/x-png,image/jpeg" />
									<br><br>
									<!-- Submit button to process the form and upload the image --BY Rahul Kumar--26/11 -->
									<input type="submit" name="submit" value="Upload & Process Image" class="btn btn-success" />
								</div>
							</div>
						</div>
						
						<!-- Frame Layer Tab: For selecting frame styles --BY Rahul Kumar--26/11 -->
						<div role="tabpanel" class="tab-pane" id="frameLayer">
							<div class="col-md-12">
								<!-- Step 3 heading for frame selection --BY Rahul Kumar--26/11 -->
								<h4>Step 3: Choose your photo frame</h4>
								<br>
								<!-- Container for frame selection options in a grid layout --BY Rahul Kumar--26/11 -->
								<div style="display:flex; flex-wrap:wrap; gap:15px;">
									<div>
										<!-- First frame option with click handler to set frame --BY Rahul Kumar--26/11 -->
										<a id="frame1"><img id="fselect" class="img frame-option" src="fr1.png" onclick="setFrame(this);" style="height:80px;width:80px;cursor:pointer;border:2px solid #ccc;padding:5px;" title="Frame Style 1"></a>
									</div>
									<div>
										<!-- Second frame option with click handler to set frame --BY Rahul Kumar--26/11 -->
										<a id="frame2"><img class="img frame-option" src="fr2.png" onclick="setFrame(this);" style="height:80px;width:80px;cursor:pointer;border:2px solid #ccc;padding:5px;" title="Frame Style 2"></a>
									</div>
									<div>
										<!-- Third frame option with click handler to set frame --BY Rahul Kumar--26/11 -->
										<a id="frame3"><img class="img frame-option" src="fr3.png" onclick="setFrame(this);" style="height:80px;width:80px;cursor:pointer;border:2px solid #ccc;padding:5px;" title="Frame Style 3"></a>
									</div>
								</div>
							</div>
						</div>
					</div>
					</form>
			</div>
		</div>
	</div>
<script>
	// Initializing selected photo variable with session picture value from PHP --BY Rahul Kumar--26/11
	var selectedPhoto = '<?= $session_picture;?>';
	// Setting default frame to first frame option --BY Rahul Kumar--26/11
	var selectedFrame = 'fr1.png';
	// Storing current canvas dimensions for real-time preview updates --BY Rahul Kumar--26/11
	var currentWidth = <?= $width; ?>;
	var currentHeight = <?= $height; ?>;

	// Function to set the selected frame and update canvas display --BY Rahul Kumar--26/11
	function setFrame(value) {
		// Setting default frame if no value is provided --BY Rahul Kumar--26/11
		if (value == null) {
			value = 'fr1.png';
		}
		// Extracting frame source path from either string or image element object --BY Rahul Kumar--26/11
		selectedFrame = (typeof value === 'string') ? value : value.src;
		// Re-rendering canvas with new frame selection --BY Rahul Kumar--26/11
		renderCanvas();
		// Removing selected class from all frame images to reset highlighting --BY Rahul Kumar--26/11
		$('.frame-option').removeClass('selected');
		// Adding selected class to the clicked frame image for visual feedback --BY Rahul Kumar--26/11
		if (typeof value !== 'string') $(value).addClass('selected');
	}

	// Function to select a photo from uploaded photos, sample photos, or uploaded images and update canvas display --BY Rahul Kumar--26/11
	function selectPhoto(photo) {
		// Setting the selected photo path to the clicked photo --BY Rahul Kumar--26/11
		selectedPhoto = photo;
		// Re-rendering canvas with newly selected photo --BY Rahul Kumar--26/11
		renderCanvas();
		// Resetting border and selection state of all photos to default --BY Rahul Kumar--26/11
		$('.uploaded-photo, .sample-photo').removeClass('selected').css('border', '2px solid #ccc');
		// Highlighting the selected photo with blue border and selected class for visual feedback --BY Rahul Kumar--26/11
		$("img[src='"+photo+"']").addClass('selected').css('border', '2px solid #007bff');
	}

	// Function to render the canvas with selected photo and frame using Frame library --BY Rahul Kumar--26/11
	function renderCanvas() {
		// Getting the canvas element directly for proper dimension setting --BY Rahul Kumar--26/11
		var canvas = document.getElementById('testCanvas');
		// Setting canvas CSS dimensions for display --BY Rahul Kumar--26/11
		$('#testCanvas').css({
			'width': currentWidth + 'px',
			'height': currentHeight + 'px'
		});
		// Setting canvas actual width and height properties (required for proper rendering) --BY Rahul Kumar--26/11
		if (canvas) {
			canvas.width = currentWidth;
			canvas.height = currentHeight;
		}
		// Creating new Frame instance with canvas, frame settings, mount settings, and photo array --BY Rahul Kumar--26/11
		var myFrame = new Frame({
			canvas: $('#testCanvas'),  // Target canvas element for rendering --BY Rahul Kumar--26/11
			frame: {
				file: selectedFrame,  // Frame image file path --BY Rahul Kumar--26/11
				thickness: 15  // Frame border thickness in pixels --BY Rahul Kumar--26/11
			},
			mount: {
				imagePadding: { row: 50, column: 75 },  // Padding around image within frame --BY Rahul Kumar--26/11
				sections: [
					[
						{
							width: 100,  // Section width percentage --BY Rahul Kumar--26/11
							height: 100  // Section height percentage --BY Rahul Kumar--26/11
						}
					]
				]
			},
			photos: [selectedPhoto]  // Array of photos to display in frame --BY Rahul Kumar--26/11
		});
	}

	// Function to update preview with new dimensions without form submission (real-time preview) --BY Rahul Kumar--26/11
	function updatePreview() {
		// Getting width value from input field and validating it --BY Rahul Kumar--26/11
		var newWidth = parseInt($('#inputWidth').val());
		// Getting height value from input field and validating it --BY Rahul Kumar--26/11
		var newHeight = parseInt($('#inputHeight').val());
		
		// Validating that both width and height are valid numbers greater than 0 --BY Rahul Kumar--26/11
		if (newWidth > 0 && newHeight > 0 && !isNaN(newWidth) && !isNaN(newHeight)) {
			// Updating current width and height variables for canvas rendering --BY Rahul Kumar--26/11
			currentWidth = newWidth;
			currentHeight = newHeight;
			// Re-rendering canvas with new dimensions --BY Rahul Kumar--26/11
			renderCanvas();
			// Providing user feedback that preview was updated --BY Rahul Kumar--26/11
			console.log('Preview updated: ' + currentWidth + 'x' + currentHeight);
		} else {
			// Displaying alert if invalid dimensions are entered --BY Rahul Kumar--26/11
			alert('Please enter valid width and height values (greater than 0)');
		}
	}

	// Function to manually switch tabs if Bootstrap tabs don't work --BY Rahul Kumar--26/11
	function switchTab(tabId) {
		// Hiding all tab panes --BY Rahul Kumar--26/11
		$('.tab-pane').removeClass('active');
		// Removing active class from all tab links --BY Rahul Kumar--26/11
		$('.nav-tabs li').removeClass('active');
		// Showing the selected tab pane --BY Rahul Kumar--26/11
		$('#' + tabId).addClass('active');
		// Adding active class to the clicked tab link --BY Rahul Kumar--26/11
		$('.nav-tabs a[href="#' + tabId + '"]').parent().addClass('active');
	}

	// Event handler for window load to initialize default selections and render canvas --BY Rahul Kumar--26/11
	$(window).on('load', function () {
		// Adding selected class to default frame image for initial highlighting --BY Rahul Kumar--26/11
		$('#fselect').addClass('selected');
		// Highlighting default photo with blue border and selected class if a photo is already selected --BY Rahul Kumar--26/11
		if (selectedPhoto) {
			$("img[src='"+selectedPhoto+"']").addClass('selected').css('border', '2px solid #007bff');
		}
		// Rendering canvas on page load with default or selected values --BY Rahul Kumar--26/11
		renderCanvas();
		
		// Adding click event handler to tab links for manual tab switching (fallback if Bootstrap fails) --BY Rahul Kumar--26/11
		$('.nav-tabs a').on('click', function(e) {
			e.preventDefault();  // Preventing default anchor behavior --BY Rahul Kumar--26/11
			var targetTab = $(this).attr('href').substring(1);  // Getting target tab ID from href --BY Rahul Kumar--26/11
			switchTab(targetTab);  // Switching to the selected tab --BY Rahul Kumar--26/11
		});
		
		// Adding click event handler to update preview button for real-time size updates --BY Rahul Kumar--26/11
		$('#updatePreviewBtn').on('click', function() {
			updatePreview();
		});
		
		// Adding real-time preview update on Enter key press in width/height inputs --BY Rahul Kumar--26/11
		$('#inputWidth, #inputHeight').on('keypress', function(e) {
			// Checking if Enter key was pressed (keyCode 13) --BY Rahul Kumar--26/11
			if (e.which === 13) {
				// Preventing form submission and updating preview instead --BY Rahul Kumar--26/11
				e.preventDefault();
				updatePreview();
			}
		});
		
		// Adding real-time preview update on input change with debounce for better performance --BY Rahul Kumar--26/11
		var previewTimeout;
		$('#inputWidth, #inputHeight').on('input', function() {
			// Clearing previous timeout to debounce rapid input changes --BY Rahul Kumar--26/11
			clearTimeout(previewTimeout);
			// Setting new timeout to update preview after 500ms of no input --BY Rahul Kumar--26/11
			previewTimeout = setTimeout(function() {
				updatePreview();
			}, 500);
		});
	});
	
	// Document ready handler to ensure tabs work even if window load hasn't fired --BY Rahul Kumar--26/11
	$(document).ready(function() {
		// Adding click event handler to tab links for manual tab switching --BY Rahul Kumar--26/11
		$('.nav-tabs a').on('click', function(e) {
			e.preventDefault();  // Preventing default anchor behavior --BY Rahul Kumar--26/11
			var targetTab = $(this).attr('href').substring(1);  // Getting target tab ID from href --BY Rahul Kumar--26/11
			switchTab(targetTab);  // Switching to the selected tab --BY Rahul Kumar--26/11
		});
		
		// Adding click event handler to update preview button in document ready (ensures it's attached early) --BY Rahul Kumar--26/11
		$('#updatePreviewBtn').on('click', function(e) {
			e.preventDefault();  // Preventing any default button behavior --BY Rahul Kumar--26/11
			updatePreview();  // Calling update preview function --BY Rahul Kumar--26/11
		});
	});

	// Function to validate file extension before allowing file selection and preview selected image --BY Rahul Kumar--26/11
	function single_attachment(input, ext) {
		var validExtensions = ext; // Array of valid file extensions --BY Rahul Kumar--26/11
		// Checking if file was selected before processing --BY Rahul Kumar--26/11
		if (!input.files || !input.files[0]) {
			return;
		}
		// Extracting file name from input element --BY Rahul Kumar--26/11
		var fileName = input.files[0].name;
		// Extracting file extension from file name by finding last dot position --BY Rahul Kumar--26/11
		var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
		// Checking if file extension is in the valid extensions array --BY Rahul Kumar--26/11
		if ($.inArray(fileNameExt, validExtensions) == -1) {
			// Resetting file input to clear invalid file selection --BY Rahul Kumar--26/11
			input.type = ''
			input.type = 'file'
			// Displaying alert message with list of accepted file types --BY Rahul Kumar--26/11
			alert("Only these file types are accepted : " + validExtensions.join(', '));
		} else {
			// If file is valid, reading file as data URL for immediate preview --BY Rahul Kumar--26/11
			if (input.files && input.files[0]) {
				var filerdr = new FileReader();
				filerdr.onload = function (e) {
					// Setting selected photo to the uploaded file's data URL for immediate preview --BY Rahul Kumar--26/11
					selectedPhoto = e.target.result;
					// Re-rendering canvas with newly uploaded photo for instant preview --BY Rahul Kumar--26/11
					renderCanvas();
				}
				// Reading file as data URL string for immediate preview functionality --BY Rahul Kumar--26/11
				filerdr.readAsDataURL(input.files[0]);
			}
		}
	}
</script>
</body>
</html>