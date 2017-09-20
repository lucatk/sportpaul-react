<?php
session_start();

include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT name, value FROM settings" . (isset($_SESSION["loggedIn"])? "" : " WHERE private=0"), NULL);
$results = $db->fetchAllPairs($stmt);

// array_walk($results, function(&$s, $key){if(gettype($s) === "string") {$s = utf8_encode($s);}});

die(json_encode($results));

?>
