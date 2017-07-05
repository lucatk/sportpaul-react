<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM products WHERE clubid=:clubid", ["clubid" => $_POST["id"]]);
$results = $db->fetchAll($stmt);

$assoc = array();
foreach($results as $row) {
  array_walk($row, function(&$s, $key){$s = iconv("LATIN-1", "UTF-8", $s);});
  $assoc[$row["id"]] = $row;
}

die(json_encode($assoc));

?>
