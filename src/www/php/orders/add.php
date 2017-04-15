<?php
include('../database.php');

if(!isset($_POST["cart"])) {
  die(json_encode([
    "error" => -1,
    "rowsAffected" => 0
  ]));
}

$db = new Database();
$rowsAffected = 0;

$stmt = $db->execute("INSERT INTO orders(clubid, firstname, lastname, street, housenr, postcode, town, email, telephone, created, updated) VALUES(:clubid, :firstname, :lastname, :street, :housenr, :postcode, :town, :email, :telephone, NOW(), NOW())",
                    ["clubid" => $_POST["clubid"],
                     "firstname" => $_POST["firstname"],
                     "lastname" => $_POST["lastname"],
                     "street" => $_POST["street"],
                     "housenr" => $_POST["housenr"],
                     "postcode" => $_POST["postcode"],
                     "town" => $_POST["town"],
                     "email" => $_POST["email"],
                     "telephone" => $_POST["phone"]]);

$rowsAffected += $stmt->rowCount();

if($stmt->errorCode() !== "00000") {
  die(json_encode([
    "error" => $stmt->errorCode(),
    "rowsAffected" => $rowsAffected
  ]));
} else {
  $id = $db->lastInsertId();
  $cart = json_decode($_POST["cart"]);
  foreach($cart as $key => $item) {
    $stmt2 = $db->execute("INSERT INTO items(clubid, orderid, productid, flocking, size, price, flockingPrice) VALUES(:clubid, :orderid, :productid, :flocking, :size, :price, :flockingPrice)",
                          ["clubid" => $_POST["clubid"],
                           "orderid" => $id,
                           "productid" => $item->id,
                           "flocking" => $item->flocking,
                           "size" => $item->size,
                           "price" => $item->price,
                           "flockingPrice" => $item->flockingPrice]);
    $rowsAffected += $stmt->rowCount();
    if($stmt2->errorCode() !== "00000") {
      die(json_encode([
        "error" => $stmt2->errorCode(),
        "rowsAffected" => $rowsAffected
      ]));
    }
  }
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $rowsAffected
]));

?>
