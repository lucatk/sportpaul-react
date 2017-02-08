<?php
include('../database.php');

$db = new Database();
if(strlen($_POST["flockingPrice"]) < 1)
  $_POST["flockingPrice"] = null;
$stmt = $db->execute("UPDATE products SET internalid=:internalid, name=:name, pricegroups=:pricegroups, flockingPrice=:flockingPrice WHERE id=:id AND clubid=:clubid", $_POST);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
