<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT name, value FROM settings", NULL);
$results = $db->fetchAllPairs($stmt);

array_walk($results, function(&$s, $key){if(gettype($s) === "string") {$s = utf8_encode($s);}});

die(json_encode($results));

?>
