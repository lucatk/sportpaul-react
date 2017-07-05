<?php
include('../database.php');

$db = new Database();

// $ids = array();
// $byclub = explode(";", $_GET["ids"]);
// foreach($byclub as $clubstr) {
//   $split = explode(":", $clubstr);
//   $clubids = array();
//   $byid = explode(",", $split[1]);
//   foreach($byid as $id) {
//     $clubids[] = intval($id);
//   }
//   $ids[intval($split[0])] = $clubids;
// }

$clubid = $_GET["clubid"];
$ids = array();

$split = explode(",", $_GET["ids"]);
foreach($split as $id) {
  $ids[] = intval($id);
}

$in = str_repeat("?,", count($ids) - 1) . "?";
$stmt = $db->execute("SELECT id, clubname, firstname, lastname FROM orders WHERE clubid=? AND id IN($in) ORDER BY id ASC", array_merge([$clubid], $ids));
$results = $db->fetchAll($stmt);
$orders = array();
foreach($results as $row) {
  $cstmt = $db->execute("SELECT internalid, name, flocking, size FROM items WHERE clubid=:clubid AND orderid=:orderid ORDER BY id ASC", ["clubid" => $clubid,
                                                                                                                                         "orderid" => $row["id"]]);
  $cresults = $db->fetchAll($cstmt);
  $row["items"] = $cresults;
  $orders[] = $row;
}

header("Content-Disposition: attachment; filename=\"" . $orders[0]["clubname"] . ".csv\"");
header("Content-Type: text/csv");

$out = fopen("php://output", 'w');
fputcsv($out, ["Bestellung", "Kunde", "Artikelnummer", "Artikel", "Beflockung", "Größe"], ',', '"');
foreach($orders as $order) {
  $orderdata = [$order["id"], $order["firstname"] . " " . $order["lastname"]];
  foreach($order["items"] as $item) {
    fputcsv($out, array_merge($orderdata, $item), ',', '"');
  }
}
fclose($out);

?>
