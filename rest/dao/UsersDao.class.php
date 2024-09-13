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

    public function updateUserNameAndEmail($userId, $username = null, $email = null) {
        // Validate email format
        if ($email !== null && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Invalid email format.");
        }
    
        // Check for unique username and email
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE (username = :username OR email = :email) AND id != :userId");
        $stmt->execute([':username' => $username, ':email' => $email, ':userId' => $userId]);
        if ($stmt->rowCount() > 0) {
            throw new Exception("Username or email already exists.");
        }
    
        // If validations pass, proceed to update
        $updates = [];
        $params = [':userId' => $userId];
    
        if ($username !== null) {
            $updates[] = "username = :username";
            $params[':username'] = $username;
        }
        if ($email !== null) {
            $updates[] = "email = :email";
            $params[':email'] = $email;
        }
    
        if (empty($updates)) {
            return false; // No update to perform
        }
    
        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = :userId";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($params); // returns true if the update was successful
    }
    
    
    
    
    
    
}
?>