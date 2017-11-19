<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();
$db->execute("DELETE FROM customers WHERE id=:customerid", ["customerid" => $_POST["id"]]);

?>
