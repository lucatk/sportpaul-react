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
if(strlen($_POST["flockingPrice"]) < 1 || $_POST["flockingPrice"] == "null")
  $_POST["flockingPrice"] = null;

if(isset($_FILES["picture"])) {
  $stmt = $db->execute("SELECT picture FROM products WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                        "clubid" => $_POST["clubid"]]);
  $results = $db->fetchAssoc($stmt, 1);
  if($results["picture"] !== null && strlen($results["picture"]) > 0) {
    unlink("../../productpics/" . $results["picture"]);
  }

  $fileName = time() . "-" . $_FILES["picture"]["name"];
  if(move_uploaded_file($_FILES["picture"]["tmp_name"], "../../productpics/" . $fileName)) {
    $image = new Imagick();
    $image->readImage("../../productpics/" . $fileName);
    $image->resizeImage(400, 400, Imagick::FILTER_CUBIC, 1, true);
    $image->writeImage("../../productpics/" . $fileName);
    $image->clear();
  }

  // $cstmt = $db->execute("SELECT colours FROM products WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
  //                                                                                       "clubid" => $_POST["clubid"]]);
  // $cresults = $db->fetchAssoc($cstmt, 1);
  $colours = $_POST["colours"];
  $coloursUpdated = $colours;
  // if($cresults["colours"] !== null && strlen($cresults["colours"]) > 0) {
    // $colours = json_decode($cresults["colours"]);
    foreach($colours as $i => $colour) {
      if(isset($colour->picture) && is_string($colour->picture)) {
        unlink("../../productpics/" . $colour->picture);
        unset($colour->picture);
      }
      $coloursUpdated[$i] = $colour;
    }
  // }

  $stmt = $db->execute("UPDATE products SET internalid=:internalid, name=:name, colours=:colours, pricegroups=:pricegroups, flockingPrice=:flockingPrice, defaultFlocking=:defaultFlocking, defaultFlockingInfo=:defaultFlockingInfo, picture=:picture WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                                                                                                                                                                                                                          "clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                                                          "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                                                          "name" => $_POST["name"],
                                                                                                                                                                                                                                                                                          "colours" => $coloursUpdated,
                                                                                                                                                                                                                                                                                          "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                                                          "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                                                                                                                          "defaultFlocking" => $_POST["defaultFlocking"],
                                                                                                                                                                                                                                                                                          "defaultFlockingInfo" => $_POST["defaultFlockingInfo"],
                                                                                                                                                                                                                                                                                          "picture" => $fileName]);
} else {
  if(isset($_FILES) && count($_FILES) > 0) {
    $colours = json_decode($_POST["colours"]);
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

    $cstmt = $db->execute("SELECT colours FROM products WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                          "clubid" => $_POST["clubid"]]);
    $cresults = $db->fetchAssoc($cstmt, 1);
    $oldColours = null;
    if($cresults["colours"] !== null && strlen($cresults["colours"]) > 0) {
      $oldColours = json_decode($cresults["colours"]);
    }
    $coloursUpdated = $colours;
    foreach($colours as $i => $colour) {
      if(isset($colour->picture) && is_object($colour->picture)) {
        if($oldColours != null && isset($oldColours[$i]->picture) && is_string($oldColours[$i]->picture)) {
          unlink("../../productpics/" . $oldColours[$i]->picture);
        }
        if(isset($savedFiles[$i])) {
          $colour->picture = $savedFiles[$i];
        } else {
          unset($colour->picture);
        }
      }
      $coloursUpdated[$i] = $colour;
    }
    $coloursUpdated = json_encode($coloursUpdated, JSON_UNESCAPED_UNICODE);
    $stmt = $db->execute("UPDATE products SET internalid=:internalid, name=:name, colours=:colours, pricegroups=:pricegroups, flockingPrice=:flockingPrice, defaultFlocking=:defaultFlocking, defaultFlockingInfo=:defaultFlockingInfo WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                                                                                                                                                                                        "clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                        "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                        "name" => $_POST["name"],
                                                                                                                                                                                                                                                        "colours" => $coloursUpdated,
                                                                                                                                                                                                                                                        "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                        "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                                                                                        "defaultFlocking" => $_POST["defaultFlocking"],
                                                                                                                                                                                                                                                        "defaultFlockingInfo" => $_POST["defaultFlockingInfo"]]);
  } else {
    $cstmt = $db->execute("SELECT colours FROM products WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                          "clubid" => $_POST["clubid"]]);
    $cresults = $db->fetchAssoc($cstmt, 1);
    $colours = $_POST["colours"];
    if($cresults["colours"] !== null && strlen($cresults["colours"]) > 0) {
      $newPics = [];
      $coloursDecoded = json_decode($colours);
      foreach($coloursDecoded as $i => $colour) {
        if(isset($colour->picture) && is_string($colour->picture)) {
          $newPics[] = $colour->picture;
        }
      }

      $oldColours = json_decode($cresults["colours"]);
      foreach($oldColours as $i => $colour) {
        if(isset($colour->picture) && is_string($colour->picture)) {
          if(!in_array($colour->picture, $newPics)) {
            unlink("../../productpics/" . $colour->picture);
          }
        }
      }
    }
    $stmt = $db->execute("UPDATE products SET internalid=:internalid, name=:name, colours=:colours, pricegroups=:pricegroups, flockingPrice=:flockingPrice, defaultFlocking=:defaultFlocking, defaultFlockingInfo=:defaultFlockingInfo WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                                                                                                                                                                                        "clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                        "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                        "name" => $_POST["name"],
                                                                                                                                                                                                                                                        "colours" => $colours,
                                                                                                                                                                                                                                                        "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                        "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                                                                                        "defaultFlocking" => $_POST["defaultFlocking"],
                                                                                                                                                                                                                                                        "defaultFlockingInfo" => $_POST["defaultFlockingInfo"]]);
  }
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
