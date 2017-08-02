<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');

$db = new Database();
$db->execute("DELETE FROM orders WHERE id=:orderid AND clubid=:clubid", ["orderid" => $_POST["id"],
                                                                         "clubid" => $_POST["clubid"]]);
$db->execute("DELETE FROM items WHERE orderid=:orderid AND clubid=:clubid", ["orderid" => $_POST["id"],
                                                                             "clubid" => $_POST["clubid"]]);

?>
