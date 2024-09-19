<?php
require_once "BaseDao.class.php";

class PropertyDao extends BaseDao {

    public function __construct() {
        parent::__construct("property");
    }

    public function deletePropertyReservations($propertyId) {
        $sql = "DELETE FROM property_reservation WHERE property_id = :propertyId";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['propertyId' => $propertyId]);
    }

    public function deletePropertyBuyings($propertyId) {
        $sql = "DELETE FROM property_buying WHERE property_id = :propertyId";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['propertyId' => $propertyId]);
    }

    public function deleteProperty($propertyId) {
        $sql = "DELETE FROM property WHERE id = :propertyId";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['propertyId' => $propertyId]);
    }
    public function hasReservations($propertyId) {
        $sql = "SELECT COUNT(*) FROM property_reservation WHERE property_id = :propertyId";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['propertyId' => $propertyId]);
        return $stmt->fetchColumn() > 0;
    }
    
    public function hasBuyings($propertyId) {
        $sql = "SELECT COUNT(*) FROM user_properties_buying WHERE property_id = :propertyId";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute(['propertyId' => $propertyId]);
        return $stmt->fetchColumn() > 0;
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


    public function getPropPrice($id) {
        $stmt = $this->conn->prepare("SELECT price FROM property WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(); // Use fetch() instead of fetchAll()
    }

    public function updatePropertyStatus($propertyId) {
        try {
            $sql = "UPDATE property SET status = 1 WHERE id = :propertyId";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([
                ':propertyId' => $propertyId
            ]);

            return $stmt->rowCount() > 0; // Return true if rows were updated
        } catch (PDOException $e) {
            error_log("Error updating property status: " . $e->getMessage());
            return false;
        }
    }

    
    
}
