<?php
require_once "BaseDao.class.php";

class UsersDao extends BaseDao {
    

    public function __construct(){
        parent::__construct("users");
    }

    public function getUsersNameAndEmail($userId) {
        $stmt = $this->conn->prepare("SELECT u.username, u.email FROM users u WHERE u.id = :userId");
        $stmt->execute([':userId' => $userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC); // fetch all properties as associative array
    }
    
    
    
}
?>