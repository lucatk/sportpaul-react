<?php
include('database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM clubs", NULL);
$results = $db->fetchAll($stmt);

die(json_encode($results));

?>
