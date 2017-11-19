<?php
if (!function_exists('boolval')) {
  function boolval($val) {
    return (bool) $val;
  }
}
function convertToWindowsCharset($string) {
  $charset =  mb_detect_encoding(
    $string,
    "UTF-8, ISO-8859-1, ISO-8859-15",
    true
  );

  $string =  mb_convert_encoding($string, "Windows-1252", $charset);
  return $string;
}
date_default_timezone_set("Europe/Berlin");

session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

error_reporting(E_ALL);
ini_set('display_errors', 'on');

include('../database.php');

$db = new Database();

$multipleClubs = boolval(isset($_GET["multipleclubs"]) ? $_GET["multipleclubs"] : 0);

$results = [];
if($multipleClubs) {
  $clubs = explode(";", $_GET["request"]);
  foreach($clubs as $club) {
    $clubSplit = explode(":", $club);
    $clubid = $clubSplit[0];
    $ids = explode(",", $clubSplit[1]);

    $in = str_repeat("?,", count($ids) - 1) . "?";
    $stmt = $db->execute("SELECT id, clubname, firstname, lastname, address, postcode, town, email, phone FROM customers WHERE id IN($in) ORDER BY id ASC", $ids);
    $results[] = ["clubid" => $clubid, "customers" => $db->fetchAll($stmt)];
  }
} else {
  $clubid = $_GET["clubid"];
  $ids = explode(",", $_GET["request"]);
  $in = str_repeat("?,", count($ids) - 1) . "?";
  $stmt = $db->execute("SELECT id, clubname, firstname, lastname, address, postcode, town, email, phone FROM customers WHERE id IN($in) ORDER BY id ASC", $ids);
  $results[] = ["clubid" => $clubid, "customers" => $db->fetchAll($stmt)];
}

$customers = array();
foreach($results as $club) {
  foreach($club["customers"] as $row) {
    $cstmt = $db->execute("SELECT COUNT(*) FROM orders WHERE customerid=:customerid AND NOT status = -1", ["customerid" => $row["id"]]);
    $ordersAmount = $db->fetchNum($cstmt, 1)[0];
    $row["amountOrders"] = $ordersAmount;
    $customers[] = $row;
  }
}

if(count($customers) < 1) {
  die("<script>window.close();</script>");
}

$name = "customers_" . $customers[0]["clubname"];
if($multipleClubs)
  $name = "customers_" . date("d-m-Y_h-i");
header("Content-Disposition: attachment; filename=\"" . $name . ".csv\"");
header("Content-Type: text/csv");

$out = fopen("php://output", 'w');
fwrite($out, convertToWindowsCharset("sep=,\n"));

$headers = explode(",", convertToWindowsCharset($_GET["columnnames"]));
fputcsv($out, $headers, ',', '"');

$columns = explode(",", $_GET["columns"]);
foreach($customers as $customer) {
  $data = [];
  foreach($columns as $column) {
    switch($column) {
      case "postcode":
      case "phone":
        $data[] = convertToWindowsCharset('="' . $customer[$column] . '"');
        break;
      default:
        $data[] = convertToWindowsCharset($customer[$column]);
    }
  }
  fputcsv($out, $data, ',', '"');
}
fclose($out);

?>
