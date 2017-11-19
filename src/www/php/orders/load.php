<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT customers.*, customers.id AS customerid, orders.* FROM orders LEFT JOIN customers ON orders.customerid = customers.id WHERE orders.clubid=:clubid AND orders.id=:orderid", ["orderid" => $_POST["id"],
                                                                                                                                                          "clubid" => $_POST["clubid"]]);
$results = $db->fetchAssoc($stmt, 1);

$cstmt = $db->execute("SELECT status, flockings, price FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $_POST["clubid"],
                                                                                                               "orderid" => $_POST["id"]]);
$cresults = $db->fetchAll($cstmt);
$total = 0;
$orderDone = true;
foreach($cresults as $crow) {
  $total += $crow["price"];
  if($crow["flockings"] != null && strlen($crow["flockings"]) > 0) {
    $flockings = json_decode($crow["flockings"]);
    foreach($flockings as $flocking) {
      $total += $flocking->price;
    }
  }
  if($results["status"] === 2) {
    if($crow["status"] < 3) $orderDone = false;
  } else {
    $orderDone = false;
  }
}
if($results["status"] >= 1 && $orderDone) $results["status"] = 3;
$results["total"] = $total;

die(json_encode($results));

?>
