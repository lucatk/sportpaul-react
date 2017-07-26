<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM orders WHERE clubid=:clubid AND id=:orderid", ["orderid" => $_POST["id"],
                                                                                    "clubid" => $_POST["clubid"]]);
$results = $db->fetchAssoc($stmt, 1);

$cstmt = $db->execute("SELECT status, flocking, flockingPrice, price FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $_POST["clubid"],
                                                                                                                             "orderid" => $_POST["id"]]);
$cresults = $db->fetchAll($cstmt);
$total = 0;
$orderDone = true;
foreach($cresults as $crow) {
  $total += $crow["price"];
  if($crow["flocking"] != null && strlen($crow["flocking"]) > 0) {
    $total += $crow["flockingPrice"];
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
