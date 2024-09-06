<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route("POST /addProperty", function(){
    try {
        // Call the service method to add property
        $request_data = Flight::request()->data->getData();
        $propertyService = new PropertyService();
        $result = $propertyService->addProperty($request_data);
        
        // Return the JSON response
        Flight::json([
            'status' => 'success',
            'message' => 'Property added successfully!',
            'property' => $result
        ], 200); // Ensure 200 OK response
    } catch (\Exception $e) {
        // Handle any exceptions
        Flight::halt(400, $e->getMessage());  // 400 for client errors, 500 for server errors
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

Flight::route('GET /propname/@id', function($id){
    try {
        // Fetch the property description using the service layer
        $property = Flight::property_service()->get_property_name($id);

        // Return the description or handle a case where it's not found
        if ($property !== null) {
            Flight::json(['result' => $property], 200);
        } else {
            Flight::halt(404, "Property not found");
        }
    } catch (Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(500, $e->getMessage());
    }
});

Flight::route('GET /propaddinfo/@id', function($id){
    try {
        // Fetch the property description using the service layer
        $property = Flight::property_service()->get_property_info($id);

        // Return the description or handle a case where it's not found
        if ($property !== null) {
            Flight::json(['result' => $property], 200);
        } else {
            Flight::halt(404, "Property not found");
        }
    } catch (Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(500, $e->getMessage());
    }
});

// Route for getting agent's first name by property ID
// Route to get agent's name and image by property ID
Flight::route('GET /agentname/@property_id', function($property_id){
    try {
        // Call the service to get agent's name and image
        $agent = Flight::property_service()->get_agent_by_property($property_id);

        // Check if the agent was found
        if ($agent) {
            Flight::json([
                'result' => $agent
            ], 200);
        } else {
            Flight::halt(404, "Agent not found for this property.");
        }
    } catch (Exception $e) {
        // Handle any exceptions and respond with an error message
        Flight::halt(500, $e->getMessage());
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

Flight::route("GET /olxprop", function(){
    Flight::json(Flight::property_service()->listProp());
 });

?>