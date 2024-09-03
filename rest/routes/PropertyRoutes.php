<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route("POST /addProperty", function(){
    try {
    
    
    // Call the service method to fetch properties by city
    $request_data = Flight::request()->data->getData();
    
    // Log the contents of $request_data to ensure users_id is present
    error_log(print_r($request_data, true));
        
    // Instantiate PropertyService
    $propertyService = new PropertyService();
    
    // Add the property with the retrieved data
    $result = $propertyService->addProperty($request_data);
    
    // Return the combined response
    Flight::json([
        'property' => $result
    ]);
    
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    }
});
    



//to list specific property by it's city
Flight::route('GET /properties/city/@city', function($city) {
    try {
        // Call the service method to fetch properties by city
        $properties = Flight::property_service()->get_properties_by_city($city);

        // Return the combined response
        Flight::json([
            'properties' => $properties
        ]);

    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    }
});


Flight::route("GET /properties", function(){
    Flight::json(Flight::property_service()->get_all());
 });


//getting a property by id
Flight::route('GET /prop/@id', function($id){ //with parameter
    try {

        $property = Flight::property_service()->get_by_id($id);

        // Return the combined response
        Flight::json([
            'result' => $property
        ], 200);
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    }

});


//for updating property 
Flight::route('PUT /property/@id' , function($id){ 
    try {
        $Property = Flight::request()->data->getData(); // kada dodamo u postmanu json, ovdje trazimo request da vidimo
        
        $response = [
            'property_edit' => [
                'message' => "Property edit successfully",
                'data' => Flight::property_service()->update($Property, $id)
            ]
        ];
        
        Flight::json($response);
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    } 
});


//deleting a property
Flight::route('DELETE /deleteproperty/@id', function($id){ 
    try {
        $deleteProperty =  Flight::property_service()->delete($id);
        // Respond with the decoded JWT and user information
        Flight::json([
            'property_deleted' => [
                'message' => "Property deleted successfully",
                'data' => $deleteProperty
            ]
        ]);
    } catch (\Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(401, $e->getMessage());
    }
 
});

?>