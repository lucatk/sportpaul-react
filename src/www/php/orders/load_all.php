<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT orders.id, orders.clubid, orders.clubname, orders.customerid, customers.firstname, customers.lastname, orders.status, orders.created FROM orders LEFT JOIN customers ON orders.customerid = customers.id", NULL);
$results = $db->fetchAll($stmt);

$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT status, price, flockings FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $row['clubid'],
                                                                                                                 "orderid" => $row['id']]);
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
    if($row["status"] === 2) {
      if($crow["status"] < 3) $orderDone = false;
    } else {
      $orderDone = false;
      $crow["status"] = -1;
    }
  }
  if($row["status"] >= 1 && $orderDone) $results[$i]["status"] = 3;
  $results[$i]["total"] = $total;
  $results[$i]["itemCount"] = $cstmt->rowCount();

  $i++;
}

die(json_encode($results));

?>
