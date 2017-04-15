<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM clubs", NULL);
$results = $db->fetchAll($stmt);

$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT id FROM orders WHERE clubid=:clubid AND NOT status='done'", ["clubid" => $row['id']]);
  $results[$i]["orderCount"] = $cstmt->rowCount();

  $cstmt = $db->execute("SELECT id FROM products WHERE clubid=:clubid", ["clubid" => $row['id']]);
  $results[$i]["productCount"] = $cstmt->rowCount();

  if(isset($_GET["load_products"]) && $_GET["load_products"] === "true") {
    $cstmt = $db->execute("SELECT * FROM products WHERE clubid=:clubid", ["clubid" => $row['id']]);
    $cresults = $db->fetchAll($cstmt);
    $results[$i]["products"] = $cresults;
  }

  array_walk($results[$i], function(&$s, $key){if(gettype($s) === "string") {$s = utf8_encode($s);}});
  $i++;
}

die(json_encode($results));

?>
