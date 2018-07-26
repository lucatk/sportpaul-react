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

$stmt = $db->execute("UPDATE orders SET status=:status, updated=NOW() WHERE clubid=:clubid AND id=:orderid",
                      ["clubid" => $_POST["clubid"],
                       "orderid" => $_POST["orderid"],
                       "status" => $_POST["status"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
