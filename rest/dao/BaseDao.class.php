<?php
require_once __DIR__."/../Config.class.php";
 class BaseDao {
    protected $conn; 

    private $table_name;

    /**
    * Class constructor used to establish connection to db
    */
    public function __construct($table_name){
        try {
          $this->table_name = $table_name;
          $servername = Config::DB_HOST();
          $username = Config::DB_USERNAME();
          $password = Config::DB_PASSWORD();
          $schema = Config::DB_SCHEMA();
          $port = Config::DB_PORT();
          $this->conn = new PDO("mysql:host=$servername;dbname=$schema;port:$port", $username, $password);
          // set the PDO error mode to exception
          $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
         echo "Connected successfully";
        } catch(PDOException $e) {
          echo "Connection failed: " . $e->getMessage();
        }
    }
   /* public function __construct($table_name){
        try {
          $this->table_name = $table_name;
          $db_info = array(
            'host' => Config::DB_HOST(),
            'port' => Config::DB_PORT(),
            'name' => Config::DB_SCHEMA(),
            'user' => Config::DB_USERNAME(),
            'pass' => Config::DB_PASSWORD()
            );
  
            $options = array(
              //PDO::MYSQL_ATTR_SSL_CA => 'https://drive.google.com/file/d/14KNi7xgWLKqNnmpGA2iM6vfH368W9ZKP/view?usp=drive_link',
              //PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
    
            );
            $this->conn = new PDO( 'mysql:host=' . $db_info['host'] . ';port=' . $db_info['port'] . ';dbname=' . $db_info['name'], $db_info['user'], $db_info['pass'], $options );
          // set the PDO error mode to exception
          $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
          //echo "Connected successfully";
        } catch(PDOException $e) {
          echo "Connection failed: " . $e->getMessage();
        }
    }*/

    /**
    * Method used to get all entities from database
    */
    public function get_all(){
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
    * Method used to get entity by id from database
    */
    public function get_by_id($id) {
        try {
            $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE id = :id");
            $stmt->execute(['id' => $id]);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            // Log or handle the exception
            error_log("Error executing SQL query: " . $e->getMessage());
            // Optionally, rethrow the exception or return a default value
            throw $e;
        }
    }

    // DAO method
    public function get_by_ids(array $ids){
        // Prepare the SQL query with IN clause for multiple IDs
        $placeholders = implode(',', array_fill(0, count($ids), '?'));
    
        $sql = "SELECT * FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
    
        // Bind the array of IDs directly
        foreach ($ids as $i => $id) {
            $stmt->bindValue($i + 1, $id);
        }
    
        // Execute the query
        $stmt->execute();
    
        // Fetch and return the result
        return $stmt->fetchAll();
    }

    public function get_by_city($city) {
        $sql = "SELECT * 
                FROM property
                JOIN address ON address.id = property.address_id
                WHERE address.city = :city";

        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':city', $city);
        $stmt->execute();

        return $stmt->fetchAll();
    }
    
    

    
    

    

    /**
    * Method used to get add entity to database
    * string $first_name: First name is the first name of the course
    */
    public function add($entity){
        $query = "INSERT INTO " . $this->table_name . " (";
        foreach($entity as $column => $value){
            $query.= $column . ', ';
        }
        $query = substr($query, 0, -2);
        $query.= ") VALUES (";
        foreach($entity as $column => $value){
            $query.= ":" . $column . ', ';
        }
        $query = substr($query, 0, -2);
        $query.= ")";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute($entity);
        $entity['id'] = $this->conn->lastInsertId();
        return $entity;
    }

    
    /**
    * Method used to update entity in database
    */
    public function update($entity, $id, $id_column = "id"){
        $query = "UPDATE " . $this->table_name . " SET ";
        foreach($entity as $column => $value){
            $query.= $column . "=:" . $column . ", ";
        }
        $query = substr($query, 0, -2);
        $query.= " WHERE ${id_column} = :id";
        $stmt = $this->conn->prepare($query);
        $entity['id'] = $id;
        $stmt->execute($entity);
        return $entity;
    }


    /**
    * Method used to delete entity from database
    */
    public function delete($id){
        $stmt = $this->conn->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id");
        $stmt->bindParam(':id', $id); #prevent SQL injection
        $stmt->execute();
    }
    public function get_user_by_username($username){
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE username = :username");
        $stmt->execute(['username' => $username]);
        return $stmt->fetchAll();
    }
    public function get_city($city){
        $stmt = $this->conn->prepare("SELECT * FROM " . $this->table_name . " WHERE city=:city");
        $stmt->execute(['city' => $city]);
        return $stmt->fetchAll();
    }
    protected function query($query, $params){
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
  
      protected function query_unique($query, $params){
        $results = $this->query($query, $params);
        return reset($results);
      }
 }

?>