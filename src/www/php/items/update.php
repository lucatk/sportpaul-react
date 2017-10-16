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

$stmt = $db->execute("UPDATE items SET size=:size, price=:price, flockings=:flockings, status=:status WHERE clubid=:clubid AND orderid=:orderid AND id=:id",
                      ["clubid" => $_POST["clubid"],
                       "orderid" => $_POST["orderid"],
                       "id" => $_POST["id"],
                       "size" => $_POST["size"],
                       "flockings" => $_POST["flockings"],
                       "price" => $_POST["price"],
                       "status" => $_POST["status"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
