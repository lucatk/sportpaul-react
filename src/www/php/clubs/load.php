<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM clubs WHERE id=:clubid", ["clubid" => $_POST["id"]]);
$results = $db->fetchAssoc($stmt, 1);

array_walk($results, function(&$s, $key){$s = utf8_encode($s);});
die(json_encode($results));

?>
