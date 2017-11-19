<?php
error_reporting(-1);
ini_set('display_errors', 'On');
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die(json_encode(["error"=>"0"]));
}
if(!isset($_POST["id"])) {
  die(json_encode(["error"=>"1"]));
}
$url = "https://flyer.uhlsportcompany.com/de/uhlsport/media/product/" . $_POST["id"];

$fileName = time() . "-" . $_POST["id"] . ".png";
$out = fopen("../../productpics/" . $fileName, "wb");
if($out == false) {
  die(json_encode(["error"=>"2"]));
}

$resource = curl_init();
curl_setopt($resource, CURLOPT_URL, $url);
curl_setopt($resource, CURLOPT_HEADER, 0);
curl_setopt($resource, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($resource, CURLOPT_BINARYTRANSFER, 1);
curl_setopt($resource, CURLOPT_FILE, $out);
curl_exec($resource);

if(strlen(curl_error($resource)) > 0) {
  die(json_encode(["error"=>curl_error($resource)]));
}

curl_close($resource);

die(json_encode(["url"=>$fileName]));
?>
