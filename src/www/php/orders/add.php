<?php
session_start();

include('../database.php');
$db = new Database();

if(!isset($_SESSION["loggedIn"])) {
  if(isset($_POST["captcha"])) {
    $stmt = $db->execute("SELECT name, value FROM settings WHERE name=?", ["general_recaptcha_secret"]);
    $captchaSecret = $db->fetchAllPairs($stmt)["general_recaptcha_secret"];

    $post_data = http_build_query(
      array(
        'secret' => $captchaSecret,
        'response' => $_POST['captcha'],
        'remoteip' => $_SERVER['REMOTE_ADDR']
      )
    );
    $opts = array('http' =>
      array(
        'method'  => 'POST',
        'header'  => 'Content-type: application/x-www-form-urlencoded',
        'content' => $post_data
      )
    );
    $context  = stream_context_create($opts);
    $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    $result = json_decode($response);
    if(!$result->success) {
      die(json_encode([
        "error" => -100,
        "rowsAffected" => 0
      ]));
    }
  } else {
    die(json_encode([
      "error" => -100,
      "rowsAffected" => 0
    ]));
  }
}

if(!isset($_POST["cart"])) {
  die(json_encode([
    "error" => -1,
    "rowsAffected" => 0
  ]));
}
$rowsAffected = 0;

$stmt = $db->execute("SELECT name, displaymode FROM clubs WHERE id=:clubid", ["clubid" => $_POST["clubid"]]);
$results = $db->fetchAssoc($stmt, 1);

if($results["displaymode"] < 2) {
  if(!isset($_SESSION["loggedIn"])) {
    die(json_encode([
      "error" => -99,
      "rowsAffected" => 0
    ]));
  }
}

$stmt = $db->execute("INSERT INTO orders(clubid, clubname, firstname, lastname, address, postcode, town, email, phone, created, updated) VALUES(:clubid, :clubname, :firstname, :lastname, :address, :postcode, :town, :email, :phone, NOW(), NOW())",
                    ["clubid" => $_POST["clubid"],
                     "clubname" => $results["name"],
                     "firstname" => $_POST["firstname"],
                     "lastname" => $_POST["lastname"],
                     "address" => $_POST["address"],
                     "postcode" => $_POST["postcode"],
                     "town" => $_POST["town"],
                     "email" => $_POST["email"],
                     "phone" => $_POST["phone"]]);

$rowsAffected += $stmt->rowCount();
$id = -1;

if($stmt->errorCode() !== "00000") {
  die(json_encode([
    "error" => $stmt->errorCode(),
    "rowsAffected" => $rowsAffected
  ]));
} else {
  $id = $db->lastInsertId();
  $cart = json_decode($_POST["cart"]);
  foreach($cart as $key => $item) {
    if($item->flockingPriceName == null || $item->flockingName === null || strlen($item->flockingName) < 1) {
      $item->flockingPriceName = 0;
    }
    if($item->flockingPriceLogo == null || !$item->flockingLogo) {
      $item->flockingPriceLogo = 0;
    }
    $stmt2 = $db->execute("INSERT INTO items(clubid, orderid, productid, internalid, name, colour, flockingName, flockingLogo, size, price, flockingPriceName, flockingPriceLogo) VALUES(:clubid, :orderid, :productid, :internalid, :name, :colour, :flockingName, :flockingLogo, :size, :price, :flockingPriceName, :flockingPriceLogo)",
                          ["clubid" => $_POST["clubid"],
                           "orderid" => $id,
                           "productid" => $item->id,
                           "internalid" => $item->internalid,
                           "name" => $item->name,
                           "colour" => $item->colour,
                           "flockingName" => $item->flockingName,
                           "flockingLogo" => $item->flockingLogo,
                           "size" => $item->size,
                           "price" => $item->price,
                           "flockingPriceName" => $item->flockingPriceName,
                           "flockingPriceLogo" => $item->flockingPriceLogo]);
    $rowsAffected += $stmt2->rowCount();
    if($stmt2->errorCode() !== "00000") {
      die(json_encode([
        "error" => $stmt2->errorCode(),
        "errorInfo" => $stmt2->errorInfo(),
        "rowsAffected" => $rowsAffected
      ]));
    }
  }
}

die(json_encode([
  "error" => $stmt->errorCode(),
  "rowsAffected" => $rowsAffected,
  "newid" => $id
]));

?>
