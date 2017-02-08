<?php
include('../database.php');

$db = new Database();
if(strlen($_POST["flockingPrice"]) < 1)
  $_POST["flockingPrice"] = null;
$stmt = $db->execute("INSERT INTO products(clubid, internalid, name, pricegroups, flockingPrice) VALUES(:clubid, :internalid, :name, :pricegroups, :flockingPrice)", $_POST);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
