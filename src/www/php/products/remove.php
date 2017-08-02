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
$stmt = $db->execute("DELETE FROM products WHERE id=:id AND clubid=:clubid", $_POST);

// TODO: Bilder entfernen

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
