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

// $ids = array();
// $byclub = explode(";", $_GET["ids"]);
// foreach($byclub as $clubstr) {
//   $split = explode(":", $clubstr);
//   $clubids = array();
//   $byid = explode(",", $split[1]);
//   foreach($byid as $id) {
//     $clubids[] = intval($id);
//   }
//   $ids[intval($split[0])] = $clubids;
// }

$multipleClubs = boolval(isset($_GET["multipleclubs"]) ? $_GET["multipleclubs"] : 0);
$skipOrdered = boolval(isset($_GET["skipordered"]) ? $_GET["skipordered"] : 1);

$results = [];
if($multipleClubs) {
  $clubs = explode(";", $_GET["request"]);
  foreach($clubs as $club) {
    $clubSplit = explode(":", $club);
    $clubid = $clubSplit[0];
    $ids = explode(",", $clubSplit[1]);

    $in = str_repeat("?,", count($ids) - 1) . "?";
    $stmt = $db->execute("SELECT id, clubname, firstname, lastname FROM orders WHERE clubid=? AND id IN($in) ORDER BY id ASC", array_merge([$clubid], $ids));
    $results[] = ["clubid" => $clubid, "orders" => $db->fetchAll($stmt)];
  }
} else {
  $clubid = $_GET["clubid"];
  $ids = explode(",", $_GET["request"]);
  $in = str_repeat("?,", count($ids) - 1) . "?";
  $stmt = $db->execute("SELECT id, clubname, firstname, lastname FROM orders WHERE clubid=? AND id IN($in) ORDER BY id ASC", array_merge([$clubid], $ids));
  $results[] = ["clubid" => $clubid, "orders" => $db->fetchAll($stmt)];
}

$orders = array();
foreach($results as $club) {
  foreach($club["orders"] as $row) {
    $cstmt = $db->execute("SELECT internalid, name, colour, flockingName, flockingLogo, size, status FROM items WHERE clubid=:clubid AND orderid=:orderid ORDER BY id ASC", ["clubid" => $clubid,
                                                                                                                                                                             "orderid" => $row["id"]]);
    $cresults = $db->fetchAll($cstmt);
    if($skipOrdered)
      $cresults = array_filter($cresults, function($var) { return intval($var["status"]) < 0; });
    if(count($cresults) > 0) {
      $row["items"] = $cresults;
      $orders[] = $row;
    }
  }
}

if(count($orders) < 1) {
  die("<script>window.close();</script>");
}

$name = $orders[0]["clubname"];
if($multipleClubs)
  $name = "export_" . date("d-m-Y_h-i");
header("Content-Disposition: attachment; filename=\"" . $name . ".csv\"");
header("Content-Type: text/csv");

$out = fopen("php://output", 'w');
fwrite($out, convertToWindowsCharset("sep=,\n"));

// $headers = ["Bestellung", "Kunde", "Artikelnummer", "Artikel", "Farbe", "Beflockung", "Größe"];
// if($multipleClubs)
//   array_unshift($headers, "Verein");
$headers = explode(",", convertToWindowsCharset($_GET["columnnames"]));
fputcsv($out, $headers, ',', '"');

$columns = explode(",", $_GET["columns"]);
foreach($orders as $order) {
  // $orderdata = [$order["id"], $order["firstname"] . " " . $order["lastname"]];
  // if($multipleClubs)
  //   array_unshift($orderdata, $order["clubname"]);
  foreach($order["items"] as $item) {
    // unset($item["status"]);
    // if(strlen($item["colour"]) > 0) {
    //   $jsonColour = json_decode($item["colour"]);
    //   $item["colour"] = $jsonColour->id . " " . $jsonColour->name;
    // }
    // fputcsv($out, array_merge($orderdata, $item), ',', '"');
    $data = [];
    foreach($columns as $column) {
      switch($column) {
        case "clubname":
        case "id":
          $data[] = convertToWindowsCharset($order[$column]);
          break;
        case "customer":
          $data[] = convertToWindowsCharset($order["firstname"] . " " . $order["lastname"]);
          break;
        case "colour":
          if(strlen($item["colour"]) > 0) {
            $colour = json_decode($item["colour"]);
            $data[] = convertToWindowsCharset($colour->id . " " . $colour->name);
          } else {
            $data[] = "";
          }
          break;
        case "flockingLogo":
          $data[] = convertToWindowsCharset($item["flockingLogo"]==1?"ja":"nein");
          break;
        case "internalid":
          $data[] = convertToWindowsCharset('="' . $item["internalid"] . '"');
          break;
        case "name":
        case "flockingName":
        case "size":
          $data[] = convertToWindowsCharset($item[$column]);
          break;
      }
    }
    fputcsv($out, $data, ',', '"');
  }
}
fclose($out);

?>
