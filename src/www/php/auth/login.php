<?php
  error_reporting(E_ALL);
  ini_set('display_errors', 'on');

  include('../database.php');

  $db = new Database();
  session_start();

  $stmt = $db->execute("SELECT value FROM settings WHERE name='general_adminpassword'", []);
  $results = $db->fetchNum($stmt, 1);
  if(isset($_POST["password"])) {
    if($_POST["password"] === $results[0]) {
      $_SESSION["loggedIn"] = true;
    } else {
      session_destroy();
    }
  } else {
    session_destroy();
  }

?>
