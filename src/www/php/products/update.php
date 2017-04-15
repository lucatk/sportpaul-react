<?php
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

  $stmt = $db->execute("UPDATE products SET internalid=:internalid, name=:name, pricegroups=:pricegroups, flockingPrice=:flockingPrice, defaultFlocking=:defaultFlocking, defaultFlockingInfo=:defaultFlockingInfo, picture=:picture WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                                                                                                                                                                                                        "clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                                        "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                                        "name" => $_POST["name"],
                                                                                                                                                                                                                                                                        "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                                                                                                        "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                                                                                                        "defaultFlocking" => $_POST["defaultFlocking"],
                                                                                                                                                                                                                                                                        "defaultFlockingInfo" => $_POST["defaultFlockingInfo"],
                                                                                                                                                                                                                                                                        "picture" => $fileName]);
} else {
  $stmt = $db->execute("UPDATE products SET internalid=:internalid, name=:name, pricegroups=:pricegroups, flockingPrice=:flockingPrice, defaultFlocking=:defaultFlocking, defaultFlockingInfo=:defaultFlockingInfo WHERE id=:id AND clubid=:clubid", ["id" => $_POST["id"],
                                                                                                                                                                                                                                                      "clubid" => $_POST["clubid"],
                                                                                                                                                                                                                                                      "internalid" => $_POST["internalid"],
                                                                                                                                                                                                                                                      "name" => $_POST["name"],
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
