<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT id, clubid, firstname, lastname, status, updated FROM orders", NULL);
$results = $db->fetchAll($stmt);

$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT price FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $row['clubid'],
                                                                                              "orderid" => $row['id']]);
  $cresults = $db->fetchAll($cstmt);
  $total = 0;
  foreach($cresults as $crow) {
    $total += $crow["price"];
  }
  $results[$i]["total"] = $total;
  $results[$i]["itemCount"] = $cstmt->rowCount();

  $cstmt = $db->execute("SELECT name FROM clubs WHERE id=:clubid", ["clubid" => $row['clubid']]);
  $cresults = $db->fetchAssoc($cstmt, 1);
  $results[$i]["clubname"] = $cresults["name"];

  $i++;
}

die(json_encode($results));

?>
