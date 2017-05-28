<?php
include('../database.php');

$db = new Database();

array_walk_recursive($_POST, function(&$entry){$entry=utf8_encode($entry);});
$stmt = $db->execute("UPDATE orders SET firstname=:firstName, lastname=:lastName, street=:street, housenr=:housenr, postcode=:postCode, town=:town, email=:email, telephone=:telephone, status=:status, updated=NOW() WHERE clubid=:clubid AND id=:orderid",
                      ["clubid" => $_POST["clubid"],
                       "orderid" => $_POST["orderid"],
                       "firstName" => $_POST["firstName"],
                       "lastName" => $_POST["lastName"],
                       "street" => $_POST["street"],
                       "housenr" => $_POST["housenr"],
                       "postCode" => $_POST["postCode"],
                       "town" => $_POST["town"],
                       "email" => $_POST["email"],
                       "telephone" => $_POST["telephone"],
                       "status" => $_POST["status"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
