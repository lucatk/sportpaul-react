<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();
$db->execute("DELETE FROM customers WHERE id=:customerid", ["customerid" => $_POST["id"]]);
$db->execute("DELETE orders, items FROM orders INNER JOIN items ON (items.clubid = orders.clubid AND items.orderid = orders.id) WHERE orders.customerid=:customerid", ["customerid" => $_POST["id"]]);

?>
