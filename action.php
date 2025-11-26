<?php

error_reporting(E_ALL);

ini_set('display_errors', 1);


if (!extension_loaded('gd')) {
  
    die("Error: GD extension is not enabled. Please enable the GD extension in your php.ini file.");
}

// Function to resize image to specified dimensions while maintaining aspect ratio --BY Rahul Kumar--26/11
function imageResize($imageResourceId,$width,$height) {
   
    $targetWidth = $_POST['width'];
    
    $targetHeight = $_POST['height'];

    // Creating a new true color image resource with target dimensions --BY Rahul Kumar--26/11
    $targetLayer = imagecreatetruecolor($targetWidth,$targetHeight);
    
    
    imagealphablending($targetLayer, false);
    
    imagesavealpha($targetLayer, true);
    
    // Resampling and copying source image to target with specified dimensions and coordinates --BY Rahul Kumar--26/11
    imagecopyresampled($targetLayer,$imageResourceId,0,0,0,0,$targetWidth,$targetHeight, $width,$height);

    // Returning the resized image --BY Rahul Kumar--26/11
    return $targetLayer;
}

// Checking if form was submitted with submit button --BY Rahul Kumar--26/11
if(isset($_POST["submit"])) {
   
    if(is_array($_FILES) && isset($_FILES['image'])) {
       
        session_start();

        // Validation of fields --BY Rahul Kumar--26/11
        if(empty($_POST['width']) || empty($_POST['height'])) {
         
            $_SESSION['error'] = "Please enter both width and height.";
           
            header('location:index.php');
            exit;
        }

        // Getting temporary file path of uploaded image from server --BY Rahul Kumar--26/11
        $file = $_FILES['image']['tmp_name'];
        
        // Checking if uploaded file exists in temporary location --BY Rahul Kumar--26/11
        if(!file_exists($file)) {
           
            $_SESSION['error'] = "File upload failed.";
           
            header('location:index.php');
            exit;
        }
        
        // Getting image properties including width, height, and type from uploaded file --BY Rahul Kumar--26/11
        $sourceProperties = getimagesize($file);
        // Validating that file is a valid image format --BY Rahul Kumar--26/11
        if($sourceProperties === false) {
           
            $_SESSION['error'] = "Invalid image file.";
            
            header('location:index.php');
            exit;
        }
        
        // Generating unique filename using current timestamp --BY Rahul Kumar--26/11
        $fileNewName = time();
        
        $folderPath = "upload/";
        
        
        if(!is_dir($folderPath)) {
            mkdir($folderPath, 0755, true);
        }
        
      
        $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
       
        $imageType = $sourceProperties[2];

        
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
                
                if($imageResourceId === false) {
                   
                    $_SESSION['error'] = "Failed to process PNG image.";
                   
                    header('location:index.php');
                    exit;
                }
                // Resizing image to user-specified dimensions using custom resize function --BY Rahul Kumar--26/11
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                
                imagepng($targetLayer, $outputFile);
                
                $_SESSION['picture'] = $outputFile;
                break;

            // Handling GIF image format processing --BY Rahul Kumar--26/11
            case IMAGETYPE_GIF:
                
                $imageResourceId = imagecreatefromgif($file);
               
                if($imageResourceId === false) {
                    
                    $_SESSION['error'] = "Failed to process GIF image.";
                   
                    header('location:index.php');
                    exit;
                }
               
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
                // Saving resized GIF image to output file path --BY Rahul Kumar--26/11
                imagegif($targetLayer, $outputFile);
               
                $_SESSION['picture'] = $outputFile;
                break;

            // Handling JPEG image format processing --BY Rahul Kumar--26/11
            case IMAGETYPE_JPEG:
                // Creating image resource from JPEG file for manipulation --BY Rahul Kumar--26/11
                $imageResourceId = imagecreatefromjpeg($file);
                
                if($imageResourceId === false) {
                   
                    $_SESSION['error'] = "Failed to process JPEG image.";
                    
                    header('location:index.php');
                    exit;
                }
                // Resizing image to user-specified dimensions using custom resize function --BY Rahul Kumar--26/11
                $targetLayer = imageResize($imageResourceId,$sourceProperties[0],$sourceProperties[1]);
               
                imagejpeg($targetLayer, $outputFile);
               
                $_SESSION['picture'] = $outputFile;
                break;

          
            default:
                
                $_SESSION['error'] = "Invalid image type. Only PNG, JPEG, and GIF are supported.";
             
                header('location:index.php');
                exit;
        }

        
        if($imageResourceId) imagedestroy($imageResourceId);
        if($targetLayer) imagedestroy($targetLayer);

        
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