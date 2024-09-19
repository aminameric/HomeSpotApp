<?php

Flight::route('GET /myProperties/@userId', function($userId) {
    $properties = Flight::propertybuying_service()->getUserProperties($userId);
    if ($properties) {
        Flight::json(['success' => true, 'properties' => $properties]);
    } else {
        Flight::json(['success' => false, 'message' => 'No properties found for this user']);
    }
});

Flight::route('POST /buyProperty', function() {
    $data = Flight::request()->data->getData();  // This depends on how you parse JSON in Flight
    $userId = $data['users_id'];
    $propertyId = $data['property_id'];

    error_log("Received userId: $userId and propertyId: $propertyId");

    // Assuming you have a service method set up to handle the database insertion
    $result = Flight::propertybuying_service()->buyProperty($userId, $propertyId);
    if ($result) {
        Flight::json(['success' => true, 'message' => 'Property bought successfully']);
    } else {
        Flight::json(['success' => false, 'message' => 'Failed to buy property']);
    }
});

