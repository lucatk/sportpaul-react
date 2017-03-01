<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT logodata FROM clubs WHERE id=:clubid", ["clubid" => $_POST["id"]]);
$results = $db->fetchAssoc($stmt, 1);
if($results["logodata"] !== null && strlen($results["logodata"]) > 0) {
  unlink("../../clublogos/" . $results["logodata"]);
}

$db->execute("DELETE FROM clubs WHERE id=:clubid", ["clubid" => $_POST["id"]]);
$db->execute("DELETE FROM products WHERE clubid=:clubid", ["clubid" => $_POST["id"]]);

?>
