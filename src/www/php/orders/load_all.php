<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT id, clubid, clubname, firstname, lastname, status, created FROM orders", NULL);
$results = $db->fetchAll($stmt);

$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT status, price, flockingName, flockingLogo, flockingPriceName, flockingPriceLogo FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $row['clubid'],
                                                                                                                                                                        "orderid" => $row['id']]);
  $cresults = $db->fetchAll($cstmt);
  $total = 0;
  $orderDone = true;
  foreach($cresults as $crow) {
    $total += $crow["price"];
    if($crow["flockingName"] != null && strlen($crow["flockingName"]) > 0) {
      $total += $crow["flockingPriceName"];
    }
    if($crow["flockingLogo"] != null && $crow["flockingLogo"]) {
      $total += $crow["flockingPriceLogo"];
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
