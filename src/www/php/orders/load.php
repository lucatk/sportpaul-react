<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM orders WHERE clubid=:clubid AND id=:orderid", ["orderid" => $_POST["id"],
                                                                                    "clubid" => $_POST["clubid"]]);
$results = $db->fetchAssoc($stmt, 1);

$cstmt = $db->execute("SELECT name FROM clubs WHERE id=:clubid", ["clubid" => $results['clubid']]);
$cresults = $db->fetchAssoc($cstmt, 1);
$results["clubname"] = $cresults["name"];

array_walk($results, function(&$s, $key){$s = utf8_encode($s);});
die(json_encode($results));

?>
