<?php
session_start();
if(!isset($_SESSION["loggedIn"])) {
  die;
}

require('../lib/phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer();

include('../database.php');
$db = new Database();
$stmt = $db->execute("SELECT name, value FROM settings WHERE name IN ('mail_host', 'mail_username', 'mail_password', 'mail_port', 'mail_address', 'mail_from')", null);
$settings = $db->fetchAllPairs($stmt);

$customers = json_decode($_POST["customers"]);

$mail->CharSet = 'utf-8';
ini_set('default_charset', 'UTF-8');
$mail->isSMTP();
// $mail->SMTPDebug = 2;
$mail->Host = $settings["mail_host"];
$mail->SMTPAuth = true;
$mail->Username = $settings["mail_username"];
$mail->Password = $settings["mail_password"];
$mail->SMTPSecure = 'tls';
$mail->Port = intval($settings["mail_port"]);

$mail->setFrom($settings["mail_address"], $settings["mail_from"]);

$textLines = explode("\n", $_POST["text"]);
$replaceSearch = array(
  "%clubname%",
  "%firstname%",
  "%lastname%",
  "%address%",
  "%postcode%",
  "%town%",
  "%email%",
  "%phone%"
);

$errorCount = 0;
$successCount = 0;
foreach($customers as $customer) {
  $mail->addAddress($customer->email, $customer->firstname . " " . $customer->lastname);

  $replacements = array(
    $customer->clubname,
    $customer->firstname,
    $customer->lastname,
    $customer->address,
    $customer->postcode,
    $customer->town,
    $customer->email,
    $customer->phone
  );
  $message = str_replace($replaceSearch, $replacements, $textLines);
  $subject = str_replace($replaceSearch, $replacements, $_POST["subject"]);

  $mail->isHTML(true);
  $mail->Subject = $subject;

  ob_start();
  include("templates/" . $_POST["template"] . ".php");
  $mail->msgHTML(ob_get_clean(), dirname(__FILE__));

  if(!$mail->send()) {
    $errorCount++;
  } else {
    $successCount++;
  }
  $mail->clearAddresses();
}

die(json_encode([
  "errors" => $errorCount,
  "sent" => $successCount
]));

?>
