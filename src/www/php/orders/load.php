<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM orders WHERE clubid=:clubid AND id=:orderid", ["orderid" => $_POST["id"],
                                                                                    "clubid" => $_POST["clubid"]]);
$results = $db->fetchAssoc($stmt, 1);

$cstmt = $db->execute("SELECT name FROM clubs WHERE id=:clubid", ["clubid" => $_POST["clubid"]]);
$cresults = $db->fetchAssoc($cstmt, 1);
$results["clubname"] = $cresults["name"];

$cstmt = $db->execute("SELECT status FROM items WHERE clubid=:clubid AND orderid=:orderid", ["clubid" => $_POST["clubid"],
                                                                                            "orderid" => $_POST["id"]]);
$cresults = $db->fetchAll($cstmt);
$orderDone = true;
foreach($cresults as $crow) {
  if($results["status"] === 2) {
    if($crow["status"] < 3) $orderDone = false;
  } else {
    $orderDone = false;
  }
}
if($results["status"] >= 1 && $orderDone) $results["status"] = 3;

array_walk($results, function(&$s, $key){$s = utf8_encode($s);});
die(json_encode($results));

?>
