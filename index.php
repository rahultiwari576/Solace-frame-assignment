<!DOCTYPE html>
<html>
	<head>
		<title>Rahul-Task</title>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
		<style>
			html{
				width:100%;
				height:100%;
			}
			body{
				margin:0;
				padding:0;
				width:100%;
				height:100%;
				background:#fff;
			}
			canvas#testCanvas{
				display:block;
				margin:0 auto;
				width:100%;
				min-width:60px;
				height:100%;
				min-height:60px;
				cursor:pointer;
			}
			img{border:solid 1px; margin:10px;}
			.selected{
				box-shadow:0px 12px 22px 1px #333;
			}
			.frame-option.selected{
				border:2px solid #007bff !important;
				box-shadow:0px 4px 8px rgba(0,123,255,0.5);
			}
			.sample-photo.selected, .uploaded-photo.selected{
				border:2px solid #007bff !important;
				box-shadow:0px 4px 8px rgba(0,123,255,0.5);
			}
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
			.tab-pane {
				display: none;
			}
			.tab-pane.active {
				display: block;
			}
		</style>
		<script src="js/flashcanvas/canvas2png.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
		<script src="js/frame.js"></script>
		<link rel="stylesheet" href="resources/jquery.contextmenu/jquery.contextMenu.css" media="screen">
		<script src="resources/jquery.contextmenu/jquery.contextMenu.js"></script>
	</head>
	<body>
		<?php
		error_reporting(0);
		session_start();
		$session_picture = $_SESSION['picture'];
		if(empty($session_picture)){
			 $width='200';
			 $height='200';
		}else{
			list($width, $height) = getimagesize($session_picture);
		}
		?>
		<div class="container">
			<br><br>
			<?php if(isset($_SESSION['error'])): ?>
				<div class="alert alert-danger alert-dismissible" role="alert">
					<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
					<?php echo $_SESSION['error']; unset($_SESSION['error']); ?>
				</div>
			<?php endif; ?>
			<div class="row" style="border:1px solid #000;padding: 50px 20px 50px 20px;">
				<div class="col-md-5">
					<canvas id="testCanvas"></canvas>
				</div>
				<div class="col-md-7">
					<div class="col-md-12">
						<ul class="nav nav-tabs" id="layerTabs" role="tablist">
							<li role="presentation" class="active"><a href="#sizeLayer" aria-controls="sizeLayer" role="tab" data-toggle="tab">Size Layer</a></li>
							<li role="presentation"><a href="#photoLayer" aria-controls="photoLayer" role="tab" data-toggle="tab">Photo Layer</a></li>
							<li role="presentation"><a href="#frameLayer" aria-controls="frameLayer" role="tab" data-toggle="tab">Frame Layer</a></li>
						</ul>
					</div>
					<br>
					<div class="tab-content">
						<div role="tabpanel" class="tab-pane active" id="sizeLayer">
							<div class="col-md-12">
								<h4>Step 1: Enter your photo width and height</h4>
								<br>
								<form action="action.php" method="post" enctype="multipart/form-data" id="uploadForm">
								<div class="col-md-4">
									<label>Height *</label>
									<input type="number" id="inputHeight" name="height" min="1" placeholder="Enter Height" value="<?= $height; ?>" required />
								</div>
								<div class="col-md-4">
									<label>Width *</label>
									<input type="number" id="inputWidth" name="width" min="1" placeholder="Enter Width" value="<?= $width; ?>" required/>
								</div>
								<div class="col-md-4">
									<label>&nbsp;</label><br>
									<button type="button" id="updatePreviewBtn" class="btn btn-primary">Update Preview</button>
								</div>
							</div>
						</div>
						
						<div role="tabpanel" class="tab-pane" id="photoLayer">
							<div class="col-md-12">
								<h4>Step 2: Choose your photo or upload your own photo</h4>
								<br>
								
								<div class="col-md-12">
									<h5>Sample Images (Nature & Landscapes):</h5>
									<div id="samplePhotos" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
										<img src="samples/Nature_Landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Nature_Landscape.webp')" title="Nature Landscape">
										<img src="samples/mountain_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/mountain_landscape.webp')" title="Mountain Landscape">
										<img src="samples/Forest_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Forest_landscape.webp')" title="Forest Landscape">
										<img src="samples/Ocean_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Ocean_landscape.webp')" title="Ocean Landscape">
										<img src="samples/Sunset_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Sunset_landscape.webp')" title="Sunset Landscape">
										<img src="samples/Desert_landscape.webp" class="sample-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto('samples/Desert_landscape.webp')" title="Desert Landscape">
									</div>
								</div>
								
								<div class="col-md-12">
									<h5>Your Uploaded Photos:</h5>
									<div id="uploadedPhotos" style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:15px;">
										<?php
										$uploadedFiles = glob('upload/*_thump.*');
										foreach($uploadedFiles as $file) {
											echo '<img src="'.$file.'" class="uploaded-photo" style="height:60px;width:60px;object-fit:cover;cursor:pointer;border:2px solid #ccc;" onclick="selectPhoto(\''.$file.'\')">';
										}
										?>
									</div>
								</div>
								
								<div class="col-md-12">
									<h5>Upload Your Own Photo:</h5>
									<input type="file" name="image" id="fileInput" onchange='single_attachment(this,"jpg","jpeg","png","PNG","JPG","JPEG",")' accept="image/x-png,image/jpeg" />
									<br><br>
									<input type="submit" name="submit" value="Upload & Process Image" class="btn btn-success" />
								</div>
							</div>
						</div>
						
						<div role="tabpanel" class="tab-pane" id="frameLayer">
							<div class="col-md-12">
								<h4>Step 3: Choose your photo frame</h4>
								<br>
								<div style="display:flex; flex-wrap:wrap; gap:15px;">
									<div>
										<a id="frame1"><img id="fselect" class="img frame-option" src="fr1.png" onclick="setFrame(this);" style="height:80px;width:80px;cursor:pointer;border:2px solid #ccc;padding:5px;" title="Frame Style 1"></a>
									</div>
									<div>
										<a id="frame2"><img class="img frame-option" src="fr2.png" onclick="setFrame(this);" style="height:80px;width:80px;cursor:pointer;border:2px solid #ccc;padding:5px;" title="Frame Style 2"></a>
									</div>
									<div>
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
	var selectedPhoto = '<?= $session_picture;?>';
	var selectedFrame = 'fr1.png';
	var currentWidth = <?= $width; ?>;
	var currentHeight = <?= $height; ?>;

	function setFrame(value) {
		if (value == null) {
			value = 'fr1.png';
		}
		selectedFrame = (typeof value === 'string') ? value : value.src;
		renderCanvas();
		$('.frame-option').removeClass('selected');
		if (typeof value !== 'string') $(value).addClass('selected');
	}

	function selectPhoto(photo) {
		selectedPhoto = photo;
		renderCanvas();
		$('.uploaded-photo, .sample-photo').removeClass('selected').css('border', '2px solid #ccc');
		$("img[src='"+photo+"']").addClass('selected').css('border', '2px solid #007bff');
	}

	function renderCanvas() {
		var canvas = document.getElementById('testCanvas');
		$('#testCanvas').css({
			'width': currentWidth + 'px',
			'height': currentHeight + 'px'
		});
		if (canvas) {
			canvas.width = currentWidth;
			canvas.height = currentHeight;
		}
		var myFrame = new Frame({
			canvas: $('#testCanvas'),
			frame: {
				file: selectedFrame,
				thickness: 15
			},
			mount: {
				imagePadding: { row: 50, column: 75 },
				sections: [
					[
						{
							width: 100,
							height: 100
						}
					]
				]
			},
			photos: [selectedPhoto]
		});
	}

	function updatePreview() {
		var newWidth = parseInt($('#inputWidth').val());
		var newHeight = parseInt($('#inputHeight').val());
		
		if (newWidth > 0 && newHeight > 0 && !isNaN(newWidth) && !isNaN(newHeight)) {
			currentWidth = newWidth;
			currentHeight = newHeight;
			renderCanvas();
			console.log('Preview updated: ' + currentWidth + 'x' + currentHeight);
		} else {
			alert('Please enter valid width and height values (greater than 0)');
		}
	}

	function switchTab(tabId) {
		$('.tab-pane').removeClass('active');
		$('.nav-tabs li').removeClass('active');
		$('#' + tabId).addClass('active');
		$('.nav-tabs a[href="#' + tabId + '"]').parent().addClass('active');
	}

	$(window).on('load', function () {
		$('#fselect').addClass('selected');
		if (selectedPhoto) {
			$("img[src='"+selectedPhoto+"']").addClass('selected').css('border', '2px solid #007bff');
		}
		renderCanvas();
		
		$('.nav-tabs a').on('click', function(e) {
			e.preventDefault();
			var targetTab = $(this).attr('href').substring(1);
			switchTab(targetTab);
		});
		
		$('#updatePreviewBtn').on('click', function() {
			updatePreview();
		});
		
		$('#inputWidth, #inputHeight').on('keypress', function(e) {
			if (e.which === 13) {
				e.preventDefault();
				updatePreview();
			}
		});
		
		var previewTimeout;
		$('#inputWidth, #inputHeight').on('input', function() {
			clearTimeout(previewTimeout);
			previewTimeout = setTimeout(function() {
				updatePreview();
			}, 500);
		});
	});
	
	$(document).ready(function() {
		$('.nav-tabs a').on('click', function(e) {
			e.preventDefault();
			var targetTab = $(this).attr('href').substring(1);
			switchTab(targetTab);
		});
		
		$('#updatePreviewBtn').on('click', function(e) {
			e.preventDefault();
			updatePreview();
		});
	});

	function single_attachment(input, ext) {
		var validExtensions = ext;
		if (!input.files || !input.files[0]) {
			return;
		}
		var fileName = input.files[0].name;
		var fileNameExt = fileName.substr(fileName.lastIndexOf('.') + 1);
		if ($.inArray(fileNameExt, validExtensions) == -1) {
			input.type = ''
			input.type = 'file'
			alert("Only these file types are accepted : " + validExtensions.join(', '));
		} else {
			if (input.files && input.files[0]) {
				var filerdr = new FileReader();
				filerdr.onload = function (e) {
					selectedPhoto = e.target.result;
					renderCanvas();
				}
				filerdr.readAsDataURL(input.files[0]);
			}
		}
	}
</script>
</body>
</html>