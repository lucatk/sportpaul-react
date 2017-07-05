<?php
include('../database.php');

$db = new Database();

array_walk_recursive($_POST, function(&$entry){$entry=utf8_encode($entry);});
$stmt = $db->execute("UPDATE orders SET firstname=:firstName, lastname=:lastName, address=:address, postcode=:postCode, town=:town, email=:email, phone=:phone, status=:status, updated=NOW() WHERE clubid=:clubid AND id=:orderid",
                      ["clubid" => $_POST["clubid"],
                       "orderid" => $_POST["orderid"],
                       "firstName" => $_POST["firstName"],
                       "lastName" => $_POST["lastName"],
                       "address" => $_POST["address"],
                       "postCode" => $_POST["postCode"],
                       "town" => $_POST["town"],
                       "email" => $_POST["email"],
                       "phone" => $_POST["phone"],
                       "status" => $_POST["status"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
