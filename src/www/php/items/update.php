<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("UPDATE items SET flocking=:flocking, size=:size, price=:price, flockingPrice=:flockingPrice, status=:status WHERE clubid=:clubid AND orderid=:orderid AND id=:id",
                      ["clubid" => $_POST["clubid"],
                       "orderid" => $_POST["orderid"],
                       "id" => $_POST["id"],
                       "flocking" => $_POST["flocking"],
                       "size" => $_POST["size"],
                       "price" => $_POST["price"],
                       "flockingPrice" => $_POST["flockingPrice"],
                       "status" => $_POST["status"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
