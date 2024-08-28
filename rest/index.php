<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require './vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

Flight::route('/', function(){
    echo 'Hello';
});


require './dao/BaseDao.class.php';
require "./services/BaseService.php";
require "./services/UserService.php";



Flight::register('base_service', "BaseService");
Flight::register('user_service', "UserService");


require "./routes/UserRoutes.php";



Flight::start();

?>

