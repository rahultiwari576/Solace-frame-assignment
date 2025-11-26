<?php
// Router script for PHP built-in server
if (file_exists(__DIR__ . $_SERVER['REQUEST_URI'])) {
    return false; // serve the requested resource as-is.
} else {
    // Redirect to index.php for root requests
    if ($_SERVER['REQUEST_URI'] === '/') {
        include __DIR__ . '/index.php';
    } else {
        return false;
    }
}
