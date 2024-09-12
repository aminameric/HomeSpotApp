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
require "./services/PropertyService.php";
require "./services/AddressService.php";
require "./services/PropertyReservationService.php";
require "./services/FeedbackService.php";
require "./services/PropertyBuyingService.php";



Flight::register('base_service', "BaseService");
Flight::register('user_service', "UserService");
Flight::register('property_service', 'PropertyService');
Flight::register('address_service', "AddressService");
Flight::register('propertyreservation_service', "PropertyReservationService");
Flight::register('feedback_service', "FeedbackService");
Flight::register('propertybuying_service', 'PropertyBuyingService');
Flight::register('propertyDao', 'PropertyDao');
Flight::register('propertyBuyingDao', 'PropertyBuyingDao');


require "./routes/UserRoutes.php";
require "./routes/PropertyRoutes.php";
require "./routes/AddressRoutes.php";
require "./routes/PropertyReservationRoutes.php";
require "./routes/FeedbackRoutes.php";
require "./routes/PropertyBuyingRoutes.php";



Flight::start();

?>

