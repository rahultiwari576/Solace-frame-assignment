/*
 * canvas2png.js
 *
 * Copyright (c) 2010-2011 Shinya Muramatsu
 * Released under the MIT License
 * http://flashcanvas.net/
 */

// Immediately Invoked Function Expression (IIFE) to create isolated scope and prevent global namespace pollution --BY Rahul Kumar--26/11
(function(doc) {

// Getting all script elements from the document to find the current script's location --BY Rahul Kumar--26/11
var scripts = doc.getElementsByTagName("script");
// Getting the last script element which should be this current script file --BY Rahul Kumar--26/11
var script  = scripts[scripts.length - 1];
// Extracting the save.php URL path by replacing the script filename with save.php --BY Rahul Kumar--26/11
var url     = script.getAttribute("src").replace(/[^\/]+$/, "save.php");

// Global function to convert canvas element to PNG image and save it --BY Rahul Kumar--26/11
window.canvas2png = function(canvas, options) {
    // Getting the tag name of the element in lowercase for comparison --BY Rahul Kumar--26/11
    var tagName = canvas.tagName.toLowerCase();
    // Validating that the element is a canvas element, returning early if not --BY Rahul Kumar--26/11
    if (tagName !== "canvas") {
        return;
    }

    // Checking if FlashCanvas library is available for older browser support --BY Rahul Kumar--26/11
    if (typeof FlashCanvas !== "undefined") {
        // Using FlashCanvas save method if available for IE compatibility --BY Rahul Kumar--26/11
        FlashCanvas.saveImage(canvas);
    } else {
        // Creating a form element to submit canvas data to server for saving --BY Rahul Kumar--26/11
        var form  = doc.createElement("form");
        // Creating an input element to store canvas data URL --BY Rahul Kumar--26/11
        var input = doc.createElement("input");

        // Setting form action attribute to the save.php URL for server-side processing --BY Rahul Kumar--26/11
        form.setAttribute("action", url);
        // Setting form method to POST for secure data transmission --BY Rahul Kumar--26/11
        form.setAttribute("method", "post");

        // Setting input type as hidden to store data without displaying it --BY Rahul Kumar--26/11
        input.setAttribute("type",  "hidden");
        // Setting input name to dataurl for server-side identification --BY Rahul Kumar--26/11
        input.setAttribute("name",  "dataurl");
        // Converting canvas to data URL (base64 encoded image) and storing in input value --BY Rahul Kumar--26/11
        input.setAttribute("value", canvas.toDataURL());

		// Appending form to document body to make it part of the DOM --BY Rahul Kumar--26/11
		doc.body.appendChild(form);
        // Appending input element to form to include canvas data in submission --BY Rahul Kumar--26/11
        form.appendChild(input);

		// Checking if custom filename is provided in options --BY Rahul Kumar--26/11
		if(options.name){
			// Creating additional input element for custom filename --BY Rahul Kumar--26/11
			var inputName = doc.createElement("input");
			// Setting input type as hidden for filename data --BY Rahul Kumar--26/11
			inputName.setAttribute("type",  "hidden");
			// Setting input name to name for server-side filename identification --BY Rahul Kumar--26/11
			inputName.setAttribute("name",  "name");
			// Setting input value to the provided filename from options --BY Rahul Kumar--26/11
			inputName.setAttribute("value", options.name);
			// Appending filename input to form for submission --BY Rahul Kumar--26/11
			form.appendChild(inputName);
		}

        // Submitting the form to send canvas data to server for PNG file creation --BY Rahul Kumar--26/11
        form.submit();
        // Removing input element from form after submission (cleanup) --BY Rahul Kumar--26/11
        form.removeChild(input);
        // Removing form element from document body after submission (cleanup) --BY Rahul Kumar--26/11
        doc.body.removeChild(form);
    }
}

// Passing document object to the IIFE function for DOM manipulation --BY Rahul Kumar--26/11
})(document);
