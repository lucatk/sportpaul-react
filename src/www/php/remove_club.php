<?php
include('database.php');

$db = new Database();
$db->execute("DELETE FROM clubs WHERE id=:clubid", ["clubid" => $_POST["id"]]);
$db->execute("DELETE FROM products WHERE clubid=:clubid", ["clubid" => $_POST["id"]]);

?>
