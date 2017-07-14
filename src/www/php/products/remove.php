<?php
include('../database.php');

$db = new Database();
$stmt = $db->execute("DELETE FROM products WHERE id=:id AND clubid=:clubid", $_POST);

// TODO: Bilder entfernen

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
