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

$cnstmt = $db->execute("SELECT name FROM clubs WHERE id=:clubid", ["clubid" => $_POST["clubid"]]);
$cnresults = $db->fetchAssoc($cnstmt, 1);

$stmt = $db->execute("UPDATE customers SET clubid=:clubid, clubname=:clubname, firstname=:firstName, lastname=:lastName, address=:address, postcode=:postCode, town=:town, email=:email, phone=:phone WHERE id=:customerid",
                    ["customerid" => $_POST["id"],
                     "clubid" => $_POST["clubid"],
                     "clubname" => $cnresults["name"],
                     "firstName" => $_POST["firstName"],
                     "lastName" => $_POST["lastName"],
                     "address" => $_POST["address"],
                     "postCode" => $_POST["postCode"],
                     "town" => $_POST["town"],
                     "email" => $_POST["email"],
                     "phone" => $_POST["phone"]]);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
