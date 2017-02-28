<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM items WHERE clubid=:clubid AND orderid=:orderid", ["orderid" => $_POST["orderid"],
                                                                                    "clubid" => $_POST["clubid"]]);
$results = $db->fetchAll($stmt);

$assoc = array();
$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT name FROM products WHERE clubid=:clubid AND id=:productid", ["clubid" => $row['clubid'],
                                                                                              "productid" => $row['id']]);
  $cresults = $db->fetchAssoc($cstmt, 1);
  $results[$i]["name"] = $cresults["name"];

  array_walk($results[$i], function(&$s, $key){$s = utf8_encode($s);});
  $assoc[$row["id"]] = $results[$i];
  $i++;
}

die(json_encode($assoc));

?>
