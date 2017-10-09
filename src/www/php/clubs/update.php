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

if(isset($_FILES["logodata"])) {
  $stmt = $db->execute("SELECT logodata FROM clubs WHERE id=:clubid", ["clubid" => $_POST["id"]]);
  $results = $db->fetchAssoc($stmt, 1);

  if($results["logodata"] !== null && strlen($results["logodata"]) > 0) {
    @unlink("../../clublogos/" . $results["logodata"]);
  }

  $fileName = iconv("utf-8", "ascii//TRANSLIT", time() . "-" . $_FILES["logodata"]["name"]);
  if(move_uploaded_file($_FILES["logodata"]["tmp_name"], "../../clublogos/" . $fileName)) {
    $image = new Imagick();
    $image->readImage("../../clublogos/" . $fileName);
    $image->resizeImage(0, 350, Imagick::FILTER_CUBIC, 1);
    $image->writeImage("../../clublogos/" . $fileName);
    $image->clear();
  }

  $stmt = $db->execute("UPDATE clubs SET name=:name, logodata=:logodata, displaymode=:displaymode WHERE id=:clubid", ["clubid" => $_POST["id"],
                                                                                            "name" => $_POST["name"],
                                                                                            "logodata" => $fileName,
                                                                                            "displaymode" => $_POST["displaymode"]]);
} else {
  $stmt = $db->execute("UPDATE clubs SET name=:name, displaymode=:displaymode WHERE id=:clubid", ["clubid" => $_POST["id"],
                                                                                                  "name" => $_POST["name"],
                                                                                                  "displaymode" => $_POST["displaymode"]]);
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
