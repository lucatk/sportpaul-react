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

  $stmt = $db->execute("INSERT INTO products(clubid, internalid, name, pricegroups, flockingPrice, picture) VALUES(:clubid, :internalid, :name, :pricegroups, :flockingPrice, :picture)", ["clubid" => $_POST["clubid"],
                                                                                                                                                                                            "internalid" => $_POST["internalid"],
                                                                                                                                                                                            "name" => $_POST["name"],
                                                                                                                                                                                            "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                                            "flockingPrice" => $_POST["flockingPrice"],
                                                                                                                                                                                            "picture" => $fileName]);
} else {
  $stmt = $db->execute("INSERT INTO products(clubid, internalid, name, pricegroups, flockingPrice) VALUES(:clubid, :internalid, :name, :pricegroups, :flockingPrice)", ["clubid" => $_POST["clubid"],
                                                                                                                                                                        "internalid" => $_POST["internalid"],
                                                                                                                                                                        "name" => $_POST["name"],
                                                                                                                                                                        "pricegroups" => $_POST["pricegroups"],
                                                                                                                                                                        "flockingPrice" => $_POST["flockingPrice"]]);
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
