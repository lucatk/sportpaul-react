<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}
if(!isset($_GET["id"])) {
  die;
}
$url = "https://flyer.uhlsportcompany.com/de/uhlsport/media/product/" . $_GET["id"];

$resource = curl_init();
curl_setopt($resource, CURLOPT_URL, $url);
curl_setopt($resource, CURLOPT_HEADER, 1);
curl_setopt($resource, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($resource, CURLOPT_BINARYTRANSFER, 1);
$file = curl_exec($resource);
curl_close($resource);

$file_array = explode("\n\r", $file, 2);
$header_array = explode("\n", $file_array[0]);
foreach($header_array as $header_value) {
    $header_pieces = explode(':', $header_value);
    if(count($header_pieces) == 2) {
        $headers[$header_pieces[0]] = trim($header_pieces[1]);
    }
}

header('Content-type: ' . $headers['Content-Type']);
header('Content-Disposition: ' . $headers['Content-Disposition']);
header('Cache-Control: max-age=86400');
echo substr($file_array[1], 1);
?>
