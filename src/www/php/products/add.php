<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die(json_encode([
    "error" => -99,
    "rowsAffected" => 0
  ]));
}

include('../database.php');

$db = new Database();
$stmt = $db->execute("SELECT COALESCE(MAX(displayorder), -1)+1 FROM products WHERE clubid = ?", [$_POST["clubid"]]);
$displayorder = $db->fetchNum($stmt, 1)[0];

if(strlen($_POST["flockingPrice"]) < 1 || $_POST["flockingPrice"] == "null")
  $_POST["flockingPrice"] = null;

if(isset($_POST["picture"]) && strlen($_POST["picture"]) > 0) {
  $params = ["clubid" => $_POST["clubid"],
              "displayorder" => $displayorder,
              "internalid" => $_POST["internalid"],
              "colours" => $_POST["colours"],
              "name" => $_POST["name"],
              "pricegroups" => $_POST["pricegroups"],
              "flockings" => $_POST["flockings"],
              "includedFlockingInfo" => $_POST["includedFlockingInfo"],
              "picture" => $_POST["picture"]];
  $stmt = $db->execute("INSERT INTO products(clubid, displayorder, internalid, name, colours, pricegroups, flockings, includedFlockingInfo, picture) VALUES(:clubid, :displayorder, :internalid, :name, :colours, :pricegroups, :flockings, :includedFlockingInfo, :picture)", $params);
} else if(isset($_FILES["picture"])) {
  $fileName = time() . "-" . $_FILES["picture"]["name"];
  if(move_uploaded_file($_FILES["picture"]["tmp_name"], "../../productpics/" . $fileName)) {
    $image = new Imagick();
    $image->readImage("../../productpics/" . $fileName);
    $image->resizeImage(0, 400, Imagick::FILTER_CUBIC, 1);
    $image->writeImage("../../productpics/" . $fileName);
    $image->clear();
  }

  $params = ["clubid" => $_POST["clubid"],
              "displayorder" => $displayorder,
              "internalid" => $_POST["internalid"],
              "colours" => $_POST["colours"],
              "name" => $_POST["name"],
              "pricegroups" => $_POST["pricegroups"],
              "flockings" => $_POST["flockings"],
              "includedFlockingInfo" => $_POST["includedFlockingInfo"],
              "picture" => $fileName];
  $stmt = $db->execute("INSERT INTO products(clubid, displayorder, internalid, name, colours, pricegroups, flockings, includedFlockingInfo, picture) VALUES(:clubid, :displayorder, :internalid, :name, :colours, :pricegroups, :flockings, :includedFlockingInfo, :picture)", $params);
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
  } else {
    if(isset($_POST["0"])) {
      foreach($colours as $i => $colour) {
        if(isset($_POST[$i])) {
          $colour->picture = $_POST[$i];
        } else {
          if(isset($colour->picture)) {
            unset($colour->picture);
          }
        }
        $coloursUpdated[$i] = $colour;
      }
    }
  }
  $coloursUpdated = json_encode($coloursUpdated, JSON_UNESCAPED_UNICODE);
  $stmt = $db->execute("INSERT INTO products(clubid, displayorder, internalid, name, colours, pricegroups, flockings, includedFlockingInfo) VALUES(:clubid, :displayorder, :internalid, :name, :colours, :pricegroups, :flockings, :includedFlockingInfo)", ["clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                             "displayorder" => $displayorder,
                                                                                                                                                                                                                                                             "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                             "name" => $_POST["name"],
                                                                                                                                                                                                                                                             "colours" => $coloursUpdated,
                                                                                                                                                                                                                                                             "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                             "flockings" => $_POST["flockings"],
                                                                                                                                                                                                                                                             "includedFlockingInfo" => $_POST["includedFlockingInfo"]]);
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
