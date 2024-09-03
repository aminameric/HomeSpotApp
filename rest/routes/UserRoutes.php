<?php
use Firebase\JWT\JWT;


Flight::route("GET /users", function(){
    Flight::json(Flight::user_service()->get_all());
});

Flight::route("GET /agentusers", function() {
    Flight::json(Flight::user_service()->get_agent('Agent'));  // Pass 'Agent' directly
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

Flight::route('POST /addAgent', function() {
    $request = Flight::request();
    
    // Retrieve form data
    $data = $request->data->getData(); // This gets JSON data sent with the request
    
    // Retrieve files
    $files = $_FILES; // This gets uploaded files
    
    // Instantiate UserService
    $userService = new UserService();

    try {
        // Pass both data and files to the addAgent method
        $result = $userService->addAgent($data, $files);

        // Respond with success message and agent details
        Flight::json(['message' => "Agent added successfully", 'agent' => $result]);
    } catch (Exception $e) {
        // Respond with error message
        Flight::json(['message' => $e->getMessage()], 500);
    }
});



Flight::route('POST /loginUser', function(){

    $payload=Flight::request()->data->getData();

    if($payload['username']==""){
        Flight::halt(500, 'Username is missing');
    }
    if($payload['password']==""){
        Flight::halt(500, 'Password is missing');
    }

    $userService = new UserService();
    $user = $userService->login($payload);
    if($user){
        $jwt_payload = [
            'user' => $user,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)  //valid for 24 hours
        ];

        $token = JWT::encode(
            $jwt_payload,
            JWT_SECRET,
            'HS256'
        );

        Flight::json(['message' => 'You have successfully logged in', 'user' => $user, 'token' => $token]);
    }else{
        Flight::halt(500, 'Credentials are not valid');
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