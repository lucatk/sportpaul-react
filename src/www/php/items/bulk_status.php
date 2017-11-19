<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die(json_encode([
    "error" => -99,
    "rowsAffected" => 0
  ]));
}

include('../database.php');

$db = new Database();

$data = json_decode($_POST["data"]);
$input = [];
foreach($data as $d) {
  $input[] = $d->clubid;
  $input[] = $d->orderid;
  $input[] = $d->id;
}
$in = str_repeat("(?,?,?),", count($data) - 1) . "(?,?,?)";
$stmt = $db->execute("UPDATE items SET status=? WHERE (clubid, orderid, id) IN($in)", array_merge([$_POST["status"]], $input));

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
