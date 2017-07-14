<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM products WHERE clubid=:clubid", ["clubid" => $_POST["id"]]);
$results = $db->fetchAll($stmt);

$assoc = array();
foreach($results as $row) {
  $assoc[$row["id"]] = $row;
}

die(json_encode($assoc));

?>
