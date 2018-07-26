<?php
date_default_timezone_set("Europe/Berlin");
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

include('../database.php');
require('../lib/vendor/autoload.php');
use Spipu\Html2Pdf\Html2Pdf;

$db = new Database();

$stmt = $db->execute("SELECT orders.id, orders.clubname, customers.firstname, customers.lastname, customers.address, customers.postcode, customers.town, customers.email, orders.created FROM orders LEFT JOIN customers ON orders.customerid = customers.id WHERE orders.clubid=:clubid AND orders.id=:orderid", ["clubid" => $_GET["clubid"],
                                                                                                                                                                                                                                                                                                                   "orderid" => $_GET["id"]]);
$order = $db->fetchAssoc($stmt, 1);
$cstmt = $db->execute("SELECT internalid, name, colour, flockings, size, price FROM items WHERE clubid=:clubid AND orderid=:orderid ORDER BY id ASC", ["clubid" => $_GET["clubid"],
                                                                                                                                                       "orderid" => $_GET["id"]]);
$order["items"] = $db->fetchAll($cstmt);
$cstmt = $db->execute("SELECT logodata FROM clubs WHERE id=:clubid", ["clubid" => $_GET["clubid"]]);
$order["clublogo"] = $db->fetchAssoc($cstmt, 1)["logodata"];

$pdfCreator = new Html2Pdf("P", "A4", "de", true, "UTF-8", [15, 15, 10, 20]);

include "pdf_template.php";
?>
