<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT id, clubid, firstname, lastname, status, created, updated FROM orders", NULL);
$results = $db->fetchAll($stmt);

$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT status, price, flocking, flockingPrice FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $row['clubid'],
                                                                                              "orderid" => $row['id']]);
  $cresults = $db->fetchAll($cstmt);
  $total = 0;
  $orderDone = true;
  foreach($cresults as $crow) {
    $total += $crow["price"];
    if($crow["flocking"] != null && strlen($crow["flocking"]) > 0) {
      $total += $crow["flockingPrice"];
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

  $cstmt = $db->execute("SELECT name FROM clubs WHERE id=:clubid", ["clubid" => $row['clubid']]);
  $cresults = $db->fetchAssoc($cstmt, 1);
  $results[$i]["clubname"] = $cresults["name"];

  array_walk($results[$i], function(&$s, $key){$s = utf8_encode($s);});
  $i++;
}

die(json_encode($results));

?>
