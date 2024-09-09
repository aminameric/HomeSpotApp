<?php
require_once "BaseDao.class.php";

class FeedbackDao extends BaseDao {

    public function __construct() {
        parent::__construct("user_messages");
    }

    public function addFeedback($feedback) {
        // Prepare an SQL query to insert feedback data
        $sql = "INSERT INTO user_messages (users_id, name, email, subject, message) 
                VALUES (:users_id, :name, :email, :subject, :message)";

        // Bind the values from the feedback array to the query
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':users_id', $feedback['users_id']);
        $stmt->bindParam(':name', $feedback['name']);
        $stmt->bindParam(':email', $feedback['email']);
        $stmt->bindParam(':subject', $feedback['subject']);
        $stmt->bindParam(':message', $feedback['message']);
        
        // Execute the query
        $stmt->execute();

        // Return the inserted feedback (or just its ID if needed)
        return $this->conn->lastInsertId();
    }

    public function getAllFeedbacks() {
        $stmt = $this->conn->prepare("SELECT name, message FROM user_messages");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    


}
?>