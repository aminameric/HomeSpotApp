<?php
require_once "BaseDao.class.php"; 

class PropertyBuyingDao extends BaseDao {
    

    public function __construct() {
        parent::__construct("user_properties_buying");
    }

    public function recordPropertyPurchase($userId, $propertyId) {
        $sql = "INSERT INTO user_properties_buying (users_id, property_id) VALUES (:userId, :propertyId)";
        $stmt = $this->conn->prepare($sql);
        try {
            $stmt->execute([
                ':userId' => $userId,   // Ensure these placeholders match exactly
                ':propertyId' => $propertyId
            ]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Failed to record property purchase: " . $e->getMessage());
            return false;
        }
    }

    public function beginTransaction() {
        $this->conn->beginTransaction();
    }
    
    public function commit() {
        $this->conn->commit();
    }
    
    public function rollBack() {
        $this->conn->rollBack();
    }
    
    
    

    public function getPropertiesByUser($userId) {
        $stmt = $this->conn->prepare("SELECT p.* FROM property p INNER JOIN user_properties_buying up ON p.id = up.property_id WHERE up.users_id = :users_id AND p.status = 1");
        $stmt->execute([':users_id' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // fetch all properties as associative array
    }
    
}
