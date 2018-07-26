<?php

error_reporting(E_ALL);
ini_set('display_errors', 'on');

include('database.php');
$db = new Database();

$schemes = [];

$files = scandir("sql_defaults/");
foreach($files as $file) {
  if(substr_compare($file, ".sql", strlen($file)-4, 4) === 0) {
    $schemes[] = $file;
  }
}

foreach($schemes as $scheme) {
  $table = substr($scheme, 0, -4);
  $stmt = $db->execute("SELECT * FROM " . $table, []);
  $results = $db->fetchAll($stmt);
  if(count($results) > 0) {
    $db->execute_raw("DROP TABLE " . $table . "_old");
    $db->execute_raw("CREATE TABLE " . $table . "_old LIKE " . $table);
    $db->execute_raw("INSERT INTO " . $table . "_old SELECT * FROM " . $table);
    $db->execute_raw("DROP TABLE " . $table);
  }
  $db->execute_raw(file_get_contents("sql_defaults/" . $scheme));

  if(count($results) > 0) {
    $stmt = $db->execute("SHOW COLUMNS FROM " . $table, []);
    $newc = $db->fetchAll($stmt);
    $newColumns = [];
    foreach($newc as $column) {
      $newColumns[] = $column["Field"];
    }

    foreach($results as $row) {
      $columns = "";
      $values = "";
      $updateClause = "";
      foreach(array_keys($row) as $column) {
        if(in_array($column, $newColumns)) {
          $columns .= "`" . $column . "`, ";
          $values .= "'" . $row[$column]. "', ";
          $updateClause .= "`" . $column . "`='" . $row[$column] . "', ";
        }
      }
      if(strlen($columns)>2) $columns = substr($columns, 0, -2);
      if(strlen($values)>2) $values = substr($values, 0, -2);
      if(strlen($updateClause)>2) $updateClause = substr($updateClause, 0, -2);

      $query = "INSERT INTO " . $table . "(" . $columns . ") VALUES(" . $values . ") ON DUPLICATE KEY UPDATE " . $updateClause;
      $cres = $db->execute($query, []);
      echo $query . " - ";
      echo $cres->errorCode() . "<br />";
    }
    // $db->execute_raw("INSERT INTO " . $table . " SELECT * FROM " . $table . "_old");
  }
}

?>
