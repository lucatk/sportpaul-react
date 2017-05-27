<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM items WHERE clubid=:clubid AND orderid=:orderid", ["orderid" => $_POST["orderid"],
                                                                                    "clubid" => $_POST["clubid"]]);
$results = $db->fetchAll($stmt);

$assoc = array();
$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT internalid, name, pricegroups FROM products WHERE clubid=:clubid AND id=:productid", ["clubid" => $row['clubid'],
                                                                                              "productid" => $row['id']]);
  $cresults = $db->fetchAssoc($cstmt, 1);
  $results[$i]["internalid"] = $cresults["internalid"];
  $results[$i]["name"] = $cresults["name"];
  $results[$i]["pricegroups"] = $cresults["pricegroups"];

  $assoc[$row["id"]] = $results[$i];
  $i++;
}
array_walk_recursive($assoc, function(&$s){$s = utf8_decode($s);});
die(json_encode($assoc));

?>
