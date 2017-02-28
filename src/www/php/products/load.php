<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM products WHERE clubid=:clubid", ["clubid" => $_POST["id"]]);
$results = $db->fetchAll($stmt);
array_walk($results, function(&$ar, $key){array_walk($ar, function(&$s, $key){$s = utf8_encode($s);});});

$assoc = array();
foreach($results as $row) {
  $assoc[$row["id"]] = $row;
}

die(json_encode($assoc));

?>
