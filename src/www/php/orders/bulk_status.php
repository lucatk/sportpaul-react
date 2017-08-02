<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die(json_encode([
    "error" => -99,
    "rowsAffected" => 0
  ]));
}

error_reporting(E_ALL);
ini_set('display_errors', 'On');

include('../database.php');

$db = new Database();

$data = json_decode($_POST["data"]);
$input = [];
foreach($data as $d) {
  $input[] = $d->clubid;
  $input[] = $d->id;
}
$in = str_repeat("(?,?),", count($data) - 1) . "(?,?)";
$stmt = $db->execute("UPDATE orders SET status=?, updated=NOW() WHERE (clubid, id) IN($in)", array_merge([$_POST["status"]], $input));

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
