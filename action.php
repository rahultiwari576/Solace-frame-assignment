<?php
// Enabling all error reporting for debugging purposes during development --BY Rahul Kumar--26/11
error_reporting(E_ALL);
// Displaying errors on screen for immediate feedback during development --BY Rahul Kumar--26/11
ini_set('display_errors', 1);

// Checking if GD extension is loaded, which is required for image manipulation functions --BY Rahul Kumar--26/11
if (!extension_loaded('gd')) {
    // Terminating script execution with error message if GD extension is not available --BY Rahul Kumar--26/11
    die("Error: GD extension is not enabled. Please enable the GD extension in your php.ini file.");
}

// Function to resize image to specified dimensions while maintaining aspect ratio --BY Rahul Kumar--26/11
function imageResize($imageResourceId,$width,$height) {
    // Getting target width from POST data submitted by user --BY Rahul Kumar--26/11
    $targetWidth = $_POST['width'];
    // Getting target height from POST data submitted by user --BY Rahul Kumar--26/11
    $targetHeight = $_POST['height'];

    // Creating a new true color image resource with target dimensions --BY Rahul Kumar--26/11
    $targetLayer = imagecreatetruecolor($targetWidth,$targetHeight);
    
    // Disabling alpha blending to preserve transparency in PNG images --BY Rahul Kumar--26/11
    imagealphablending($targetLayer, false);
    // Saving alpha channel information for transparent PNG images --BY Rahul Kumar--26/11
    imagesavealpha($targetLayer, true);
    
    // Resampling and copying source image to target with specified dimensions and coordinates --BY Rahul Kumar--26/11
    imagecopyresampled($targetLayer,$imageResourceId,0,0,0,0,$targetWidth,$targetHeight, $width,$height);

    // Returning the resized image resource for further processing --BY Rahul Kumar--26/11
    return $targetLayer;
}

// Checking if form was submitted with submit button --BY Rahul Kumar--26/11
if(isset($_POST["submit"])) {
    // Verifying that files array exists and image file was uploaded --BY Rahul Kumar--26/11
    if(is_array($_FILES) && isset($_FILES['image'])) {
        // Starting session to store and retrieve user data across requests --BY Rahul Kumar--26/11
        session_start();

        // Validating that both width and height values are provided by user --BY Rahul Kumar--26/11
        if(empty($_POST['width']) || empty($_POST['height'])) {
            // Storing error message in session for display on index page --BY Rahul Kumar--26/11
            $_SESSION['error'] = "Please enter both width and height.";
            // Redirecting back to index page to display error message --BY Rahul Kumar--26/11
            header('location:index.php');
            exit;
        }

        // Getting temporary file path of uploaded image from server --BY Rahul Kumar--26/11
        $file = $_FILES['image']['tmp_name'];
        
        // Checking if uploaded file exists in temporary location --BY Rahul Kumar--26/11
        if(!file_exists($file)) {
            // Storing error message if file upload failed --BY Rahul Kumar--26/11
            $_SESSION['error'] = "File upload failed.";
            // Redirecting to index page with error message --BY Rahul Kumar--26/11
            header('location:index.php');
            exit;
        }
        
        // Getting image properties including width, height, and type from uploaded file --BY Rahul Kumar--26/11
        $sourceProperties = getimagesize($file);
        // Validating that file is a valid image format --BY Rahul Kumar--26/11
        if($sourceProperties === false) {
            // Storing error message for invalid image file --BY Rahul Kumar--26/11
            $_SESSION['error'] = "Invalid image file.";
            // Redirecting to index page with error message --BY Rahul Kumar--26/11
            header('location:index.php');
            exit;
        }
        
        // Generating unique filename using current timestamp to avoid naming conflicts --BY Rahul Kumar--26/11
        $fileNewName = time();
        // Setting upload directory path for storing processed images --BY Rahul Kumar--26/11
        $folderPath = "upload/";
        
        // Creating upload directory with proper permissions if it doesn't exist --BY Rahul Kumar--26/11
        if(!is_dir($folderPath)) {
            mkdir($folderPath, 0755, true);  // 0755 permissions: owner read/write/execute, group/others read/execute --BY Rahul Kumar--26/11
        }
        
        // Extracting file extension from original filename and converting to lowercase --BY Rahul Kumar--26/11
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        // Getting image type constant (IMAGETYPE_PNG, IMAGETYPE_JPEG, etc.) from image properties --BY Rahul Kumar--26/11
        $imageType = $sourceProperties[2];

        // Initializing variables for image resources and output file path --BY Rahul Kumar--26/11
        $imageResourceId = false;
        $targetLayer = false;
        // Constructing output file path with folder, timestamp, thumbnail suffix, and extension --BY Rahul Kumar--26/11
        $outputFile = $folderPath . $fileNewName . "_thump." . $ext;

        // Processing different image types using switch statement based on image type constant --BY Rahul Kumar--26/11
        switch ($imageType) {
            // Handling PNG image format processing --BY Rahul Kumar--26/11
            case IMAGETYPE_PNG:
                // Creating image resource from PNG file for manipulation --BY Rahul Kumar--26/11
                $imageResourceId = imagecreatefrompng($file);
                // Checking if PNG image creation was successful --BY Rahul Kumar--26/11
                if($imageResourceId === false) {
                    // Storing error message if PNG processing failed --BY Rahul Kumar--26/11
                    $_SESSION['error'] = "Failed to process PNG image.";
                    // Redirecting to index page with error message --BY Rahul Kumar--26/11
                    header('location:index.php');
                    exit;
                }
                // Resizing image to user-specified dimensions using custom resize function --BY Rahul Kumar--26/11
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                // Saving resized PNG image to output file path --BY Rahul Kumar--26/11
                imagepng($targetLayer, $outputFile);
                // Storing processed image path in session for display on index page --BY Rahul Kumar--26/11
                $_SESSION['picture'] = $outputFile;
                break;

            // Handling GIF image format processing --BY Rahul Kumar--26/11
            case IMAGETYPE_GIF:
                // Creating image resource from GIF file for manipulation --BY Rahul Kumar--26/11
                $imageResourceId = imagecreatefromgif($file);
                // Checking if GIF image creation was successful --BY Rahul Kumar--26/11
                if($imageResourceId === false) {
                    // Storing error message if GIF processing failed --BY Rahul Kumar--26/11
                    $_SESSION['error'] = "Failed to process GIF image.";
                    // Redirecting to index page with error message --BY Rahul Kumar--26/11
                    header('location:index.php');
                    exit;
                }
                // Resizing image to user-specified dimensions using custom resize function --BY Rahul Kumar--26/11
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                // Saving resized GIF image to output file path --BY Rahul Kumar--26/11
                imagegif($targetLayer, $outputFile);
                // Storing processed image path in session for display on index page --BY Rahul Kumar--26/11
                $_SESSION['picture'] = $outputFile;
                break;

            // Handling JPEG image format processing --BY Rahul Kumar--26/11
            case IMAGETYPE_JPEG:
                // Creating image resource from JPEG file for manipulation --BY Rahul Kumar--26/11
                $imageResourceId = imagecreatefromjpeg($file);
                // Checking if JPEG image creation was successful --BY Rahul Kumar--26/11
                if($imageResourceId === false) {
                    // Storing error message if JPEG processing failed --BY Rahul Kumar--26/11
                    $_SESSION['error'] = "Failed to process JPEG image.";
                    // Redirecting to index page with error message --BY Rahul Kumar--26/11
                    header('location:index.php');
                    exit;
                }
                // Resizing image to user-specified dimensions using custom resize function --BY Rahul Kumar--26/11
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                // Saving resized JPEG image to output file path --BY Rahul Kumar--26/11
                imagejpeg($targetLayer, $outputFile);
                // Storing processed image path in session for display on index page --BY Rahul Kumar--26/11
                $_SESSION['picture'] = $outputFile;
                break;

            // Handling unsupported image formats --BY Rahul Kumar--26/11
            default:
                // Storing error message for unsupported image types --BY Rahul Kumar--26/11
                $_SESSION['error'] = "Invalid image type. Only PNG, JPEG, and GIF are supported.";
                // Redirecting to index page with error message --BY Rahul Kumar--26/11
                header('location:index.php');
                exit;
        }

        // Freeing memory by destroying image resources to prevent memory leaks --BY Rahul Kumar--26/11
        if($imageResourceId) imagedestroy($imageResourceId);
        if($targetLayer) imagedestroy($targetLayer);

        // Redirecting to index page after successful image processing --BY Rahul Kumar--26/11
        header('location:index.php');
        exit;
    } else {
        // Handling case where no file was uploaded with form submission --BY Rahul Kumar--26/11
        $_SESSION['error'] = "No file was uploaded.";
        // Redirecting to index page with error message --BY Rahul Kumar--26/11
        header('location:index.php');
        exit;
    }
}
?>