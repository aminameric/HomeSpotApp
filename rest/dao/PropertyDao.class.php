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
    public function beginTransaction() {
        $this->conn->beginTransaction();
    }

    public function commit() {
        $this->conn->commit();
    }

    public function rollBack() {
        $this->conn->rollBack();
    }
    //update property status when bought 
    public function updatePropertyStatus($propertyId, $newStatus) {
        $stmt = $this->conn->prepare("UPDATE property SET status = :status WHERE id = :id");
        $stmt->bindParam(':status', $newStatus);
        $stmt->bindParam(':id', $propertyId);
        return $stmt->execute();
    }

    public function getPropPrice($id) {
        $stmt = $this->conn->prepare("SELECT price FROM property WHERE id = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->fetch(); // Use fetch() instead of fetchAll()
    }
    
}
?>