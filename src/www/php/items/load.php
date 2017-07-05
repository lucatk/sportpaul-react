<?php
include('../database.php');

$db = new Database();

$stmt = $db->execute("SELECT * FROM items WHERE clubid=:clubid AND orderid=:orderid", ["orderid" => $_POST["orderid"],
                                                                                    "clubid" => $_POST["clubid"]]);
$results = $db->fetchAll($stmt);

$assoc = array();
$i = 0;
foreach($results as $row) {
  $cstmt = $db->execute("SELECT pricegroups FROM products WHERE clubid=:clubid AND id=:productid", ["clubid" => $row['clubid'],
                                                                                                    "productid" => $row['id']]);
  $cresults = $db->fetchAssoc($cstmt, 1);
  if(!$cresults) {
    $row["pricegroups"] = "";
  } else {
    $row["pricegroups"] = $cresults["pricegroups"];
  }

  // array_walk($row, function(&$s, $key){$s = iconv("LATIN-1", "UTF-8", $s);});
  $assoc[$row["id"]] = $row;
  $i++;
}

die(json_encode($assoc));

?>
