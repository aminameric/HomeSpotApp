<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
require './vendor/autoload.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);



require './dao/BaseDao.class.php';
require "./services/BaseService.php";



Flight::register('base_service', "BaseService");


require "./routes/UserRoutes.php";



Flight::start();

?>