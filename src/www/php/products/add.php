<?php
include('../database.php');

$db = new Database();
if(strlen($_POST["flockingPrice"]) < 1 || $_POST["flockingPrice"] == "null")
  $_POST["flockingPrice"] = null;

if(isset($_FILES["picture"])) {
  $fileName = time() . "-" . $_FILES["picture"]["name"];
  if(move_uploaded_file($_FILES["picture"]["tmp_name"], "../../productpics/" . $fileName)) {
    $image = new Imagick();
    $image->readImage("../../productpics/" . $fileName);
    $image->resizeImage(400, 400, Imagick::FILTER_CUBIC, 1, true);
    $image->writeImage("../../productpics/" . $fileName);
    $image->clear();
  }

  $stmt = $db->execute("INSERT INTO products(clubid, internalid, name, colours, pricegroups, flockingPrice, defaultFlocking, defaultFlockingInfo, picture) VALUES(:clubid, :internalid, :name, :pricegroups, :flockingPrice, :defaultFlocking, :defaultFlockingInfo, :picture)", ["clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                                                  "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                                                  "colours" => $_POST["colours"],
                                                                                                                                                                                                                                                                                  "name" => $_POST["name"],
                                                                                                                                                                                                                                                                                  "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                                                  "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                                                                                                                  "defaultFlocking" => $_POST["defaultFlocking"],
                                                                                                                                                                                                                                                                                  "defaultFlockingInfo" => $_POST["defaultFlockingInfo"],
                                                                                                                                                                                                                                                                                  "picture" => $fileName]);
} else {
  $colours = json_decode($_POST["colours"]);
  $coloursUpdated = $colours;
  if(isset($_FILES) && count($_FILES) > 0) {
    $savedFiles = [];
    foreach($_FILES as $i => $file) {
      $fileName = time() . "-" . $i . "-" . $file["name"];
      if(move_uploaded_file($file["tmp_name"], "../../productpics/" . $fileName)) {
        $image = new Imagick();
        $image->readImage("../../productpics/" . $fileName);
        $image->resizeImage(400, 400, Imagick::FILTER_CUBIC, 1, true);
        $image->writeImage("../../productpics/" . $fileName);
        $image->clear();
        $savedFiles[$i] = $fileName;
      }
    }
    foreach($colours as $i => $colour) {
      if(isset($colour->picture) && is_object($colour->picture)) {
        if(isset($savedFiles[$i])) {
          $colour->picture = $savedFiles[$i];
        } else {
          unset($colour->picture);
        }
      }
      $coloursUpdated[$i] = $colour;
    }
  }
  $coloursUpdated = json_encode($coloursUpdated, JSON_UNESCAPED_UNICODE);
  $stmt = $db->execute("INSERT INTO products(clubid, internalid, name, colours, pricegroups, flockingPrice, defaultFlocking, defaultFlockingInfo) VALUES(:clubid, :internalid, :name, :pricegroups, :flockingPrice, :defaultFlocking, :defaultFlockingInfo)", ["clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                               "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                               "name" => $_POST["name"],
                                                                                                                                                                                                                                                               "colours" => $coloursUpdated,
                                                                                                                                                                                                                                                               "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                               "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                                                                                               "defaultFlocking" => $_POST["defaultFlocking"],
                                                                                                                                                                                                                                                               "defaultFlockingInfo" => $_POST["defaultFlockingInfo"]]);
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
