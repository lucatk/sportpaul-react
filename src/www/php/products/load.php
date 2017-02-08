<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM products WHERE clubid=:clubid", ["clubid" => $_POST["id"]]);
$results = $db->fetchAllMethod(PDO::FETCH_UNIQUE, $stmt);

die(json_encode($results));

?>
