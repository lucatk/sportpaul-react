<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM customers WHERE id=:customerid", ["customerid" => $_POST["id"]]);
$results = $db->fetchAssoc($stmt, 1);

$cstmt = $db->execute("SELECT COUNT(*) FROM orders WHERE customerid=:customerid AND NOT status = -1", ["customerid" => $_POST["id"]]);
$ordersAmount = $db->fetchNum($cstmt, 1)[0];
$results["ordersAmount"] = $ordersAmount;

die(json_encode($results));

?>
