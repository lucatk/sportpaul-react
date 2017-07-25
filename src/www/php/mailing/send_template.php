<?php
require('../lib/phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;

include('../database.php');
$db = new Database();
$stmt = $db->execute("SELECT name, value FROM settings WHERE name IN ('mail_host', 'mail_username', 'mail_password', 'mail_port', 'mail_address', 'mail_from')", null);
$settings = $db->fetchAllPairs($stmt);

$mail->CharSet = 'utf-8';
ini_set('default_charset', 'UTF-8');
$mail->isSMTP();
$mail->SMTPDebug = 2;
$mail->Host = $settings["mail_host"];
$mail->SMTPAuth = true;
$mail->Username = $settings["mail_username"];
$mail->Password = $settings["mail_password"];
$mail->SMTPSecure = 'tls';
$mail->Port = intval($settings["mail_port"]);

$mail->setFrom($settings["mail_address"], $settings["mail_from"]);
$mail->addAddress($_POST["email"], $_POST["firstname"] . " " . $_POST["lastname"]);

$mail->isHTML(true);

$mail->Subject = $_POST["subject"];

ob_start();
include("templates/" . $_POST["template"] . ".php");
$mail->msgHTML(ob_get_clean(), dirname(__FILE__));

if(!$mail->send()) {
  die(json_encode([
    "error" => $mail->ErrorInfo
  ]));
}

?>
