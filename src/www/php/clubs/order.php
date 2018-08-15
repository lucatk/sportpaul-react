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
$count = 0;
$input = [];
foreach($data as $id => $order) {
  $input[] = $id;
  $input[] = $order;
  $count++;
}
$vals = str_repeat("(?,?),", $count - 1) . "(?,?)";
echo $vals;
print_r($input);
$stmt = $db->execute("INSERT INTO clubs(id, displayorder) VALUES $vals ON DUPLICATE KEY UPDATE displayorder = VALUES(displayorder);", $input);

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $stmt->rowCount()
]));
?>
