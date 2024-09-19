<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/UsersDao.class.php';

class UserService extends BaseService{
    protected $dao;
    public function __construct(){
        parent::__construct(new UsersDao);
    } 

    public function addUser($data) {
    $hash =password_hash($data['password'], PASSWORD_DEFAULT);
        $user = [
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => $hash,
            'first_name' => $data['first_name'] ,
            'last_name' => $data['last_name'],
            'type_of_user' => $data['type_of_user']
        ];

        return $this->add($user);
    }

    public function addAgent($data, $files) {
        // Log for debugging
        error_log(print_r($files, true));
    
        // Check if user data is provided
        if (!isset($data['username'])) {
            throw new Exception("Username not provided");
        }
    
        // Prepare agent data to be inserted
        $agent = [
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_BCRYPT), // Ensure passwords are securely hashed
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'type_of_user' => $data['type_of_user']
        ];
    
        // Check if the image file was uploaded for the agent
        if (isset($files['file']) && isset($files['file']['name'])) {
            $agent['user_image'] = $files['file']['name']; // Use the correct column name
    
            // Move the uploaded image file to the storage directory
            $storagePath = __DIR__ . "/../storage/" . $files['file']['name'];
            if (move_uploaded_file($files['file']['tmp_name'], $storagePath)) {
                error_log("File uploaded successfully: " . $storagePath);
            } else {
                error_log("Failed to upload file.");
                throw new Exception("Image upload failed.");
            }
        }
    
        // Add agent to the database
        $result = $this->add($agent);
    
        // Return the result (you can also include the agent data in the response)
        return $result;
    }
    
    

    public function login($data){
        $username= $data['username'];
        $password= $data['password'];

        //fetch user
        $user = $this->get_user_by_username($username);

        if (!empty($user)) {
            $user = $user[0];
            if (password_verify($password, $user['password'])) {
                return $user;
            }
        }
        if (empty($user) || !password_verify($password, $user['password'])) {
            return false;
        }        

    }

    public function getUsersNameAndEmail($userId){
        return $this->dao->getUsersNameAndEmail($userId);
    }

    public function updateUserNameAndEmail($userId, $username, $email){
        return $this->dao->updateUserNameAndEmail($userId, $username, $email);
    }
    

    

    
    /*public function registerUser($username, $email, $password, $name, $surname) {
        // You can perform any necessary validation here before adding the user
        // For example, check if the username or email already exists in the database

        // Add the user using the UsersDao
        $this->dao->addUser($username, $email, $password, $name, $surname);

        // Optionally, you can perform additional actions after adding the user, such as sending a confirmation email
    }*/
}
