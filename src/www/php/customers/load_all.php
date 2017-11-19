<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM customers", NULL);
$results = $db->fetchAll($stmt);

// $i = 0;
// foreach($results as $row) {
//   $cstmt = $db->execute("SELECT COUNT(*) FROM orders WHERE customerid=:customerid AND NOT status = -1", ["customerid" => $row["id"]]);
//   $ordersAmount = $db->fetchNum($cstmt, 1)[0];
//   $results[$i]["ordersAmount"] = $ordersAmount;
//
//   $i++;
// }

die(json_encode($results));

?>
