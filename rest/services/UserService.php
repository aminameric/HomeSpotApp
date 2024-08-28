<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/UsersDao.class.php';

class UserService extends BaseService{
    private $dao;
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

    

    
    /*public function registerUser($username, $email, $password, $name, $surname) {
        // You can perform any necessary validation here before adding the user
        // For example, check if the username or email already exists in the database

        // Add the user using the UsersDao
        $this->dao->addUser($username, $email, $password, $name, $surname);

        // Optionally, you can perform additional actions after adding the user, such as sending a confirmation email
    }*/
}
?>