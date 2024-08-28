<?php

Flight::route("GET /users", function(){
    Flight::json(Flight::user_service()->get_all());
 });

 Flight::route("POST /addUser", function(){
    $request_data = Flight::request()->data->getData();

    // Instantiate UserService
    $userService = new UserService();

    // Add the User using UserService
    $result = $userService->addUser($request_data);

    // Check if the User was added successfully
    if ($result) {
        Flight::json(['message' => "User added successfully", 'user' => $result]);
    } else {
        Flight::json(['message' => "Failed to add user"]);
    }
});

Flight::route('GET /connection-check', function(){
    /** TODO
    * This endpoint prints the message from constructor within MidtermDao class
    * Goal is to check whether connection is successfully established or not
    * This endpoint does not have to return output in JSON format
    */
    $dao = new BaseDao("users");
});
?>