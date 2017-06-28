<?php
include('../database.php');

$db = new Database();

if(isset($_POST["names"])) {
  $names = json_decode($_POST["names"]);
  $in = str_repeat("?,", count($names) - 1) . "?";
  $stmt = $db->execute("SELECT name, value FROM settings WHERE name IN($in)", $names);
} else {
  $stmt = $db->execute("SELECT name, value FROM settings WHERE name = ?", [$_POST["name"]]);
}
$results = $db->fetchAllPairs($stmt);

array_walk($results, function(&$s, $key){if(gettype($s) === "string") {$s = utf8_encode($s);}});

die(json_encode($results));

?>
