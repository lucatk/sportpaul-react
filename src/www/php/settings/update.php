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

$stmt = $db->execute("UPDATE settings SET value=:value WHERE name=:name", ["name" => $_POST["name"],
                                                                           "value" => $_POST["value"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
