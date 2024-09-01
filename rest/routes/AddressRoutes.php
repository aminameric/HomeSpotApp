<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route("GET /addresses", function(){
    try {
    
        $addressess = Flight::address_service()->get_all();
        // Respond with the decoded JWT and user information
        Flight::json([
            'addresses' => $addressess
        ]);
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    } 
  
});


Flight::route('GET /addressbyid/@id', function($id){ //with parameter
    try {
    
        $address = Flight::address_service()->get_by_id($id);
        // Respond with the decoded JWT and user information
        Flight::json([
            'address' => $address
        ]);
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    }    

});


 

//to get city values from adddress tabel
Flight::route('GET /address/@city', function($city){ //with parameter
    try {
    
        $propaddress=  Flight::address_service()->get_city($city);
        // Respond with the decoded JWT and user information
        Flight::json([
            'property' => $propaddress
        ], 200);
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    } 
    

});



     Flight::route("POST /addAddress", function(){
        try {
        
            // Get the request data
            $request_data = Flight::request()->data->getData();
    
            // Instantiate AddressService
            $addressService = new AddressService();
    
            // Add the address using AddressService
            $address_id = $addressService->addAddress($request_data);
    
            Flight::json([
                'address_added' => [
                    'message' => "Address added successfully",
                    'address_id' => $address_id
                ]
            ]);
        } catch (\Exception $e) {
            // Handle any exceptions and respond with an error message
            Flight::halt(401, $e->getMessage());
        }
    });
    











?>