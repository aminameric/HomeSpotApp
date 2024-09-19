<?php
require_once "BaseDao.class.php";

class AddressDao extends BaseDao {
    protected $conn;
    protected $table_name = 'address';

    public function __construct(){
        parent::__construct("address");
    }

    public function get_address_ids_by_city($city) {
        // Prepare SQL query to fetch address IDs by city
        $stmt = $this->conn->prepare("SELECT id FROM " . $this->table_name . " WHERE city = :city");
        $stmt->bindParam(':city', $city);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    
    
    
}