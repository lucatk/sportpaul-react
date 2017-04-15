<?php
class Database {
  private $host = "localhost";
  private $dbname = "sportpaul";
  private $username = "root";
  private $password = "root";

  public $conn;

  public function __construct() {
    try {
      $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->dbname, $this->username, $this->password, array(
        PDO::ATTR_PERSISTENT => true
      ));
      $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch(PDOException $exception) {
      echo "Connection error: " . $exception->getMessage();
      $this->conn = null;
    }
  }

  public function execute($query, $params) {
    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    return $stmt;
  }

  public function lastInsertId() {
    return $this->conn->lastInsertId();
  }

  public function fetch($method, $stmt, $length) {
    if($length == 1) {
      return $stmt->fetch($method);
    } else {
      $result = array();
      while($length > 0 && ($row = $stmt->fetch($method))) {
        $result[] = $row;
      }
      return $result;
    }
  }

  public function fetchNum($stmt, $length) {
    return $this->fetch(PDO::FETCH_NUM, $stmt, $length);
  }

  public function fetchAssoc($stmt, $length) {
    return $this->fetch(PDO::FETCH_ASSOC, $stmt, $length);
  }

  public function fetchObject($stmt, $length) {
    return $this->fetch(PDO::FETCH_OBJ, $stmt, $length);
  }

  public function fetchAll($stmt) {
    return $stmt->fetchAll();
  }

  public function fetchAllMethod($method, $stmt) {
    return $stmt->fetchAll($method);
  }

  public function fetchAllPairs($stmt) {
    return $this->fetchAllMethod(PDO::FETCH_KEY_PAIR, $stmt);
  }

  public function fetchAllColumns($stmt) {
    return $this->fetchAllMethod(PDO::FETCH_COLUMN, $stmt);
  }
}
?>
