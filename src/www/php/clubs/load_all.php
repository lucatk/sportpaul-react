<?php
session_start();
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM clubs" . (isset($_SESSION["loggedIn"]) ? "" : " WHERE NOT displaymode = 0"), NULL);
$results = $db->fetchAll($stmt);

$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT id FROM orders WHERE clubid=:clubid AND NOT status=3 AND NOT status=-1", ["clubid" => $row['id']]);
  $results[$i]["orderCount"] = $cstmt->rowCount();

  $cstmt = $db->execute("SELECT id FROM products WHERE clubid=:clubid", ["clubid" => $row['id']]);
  $results[$i]["productCount"] = $cstmt->rowCount();

  if(isset($_GET["load_products"]) && $_GET["load_products"] === "true") {
    $cstmt = $db->execute("SELECT * FROM products WHERE clubid=:clubid", ["clubid" => $row['id']]);
    $cresults = $db->fetchAll($cstmt);
    $results[$i]["products"] = $cresults;
  }

  $i++;
}

die(json_encode($results));

?>
