<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

//getting a property by id
Flight::route('GET /property_by_id', function(){ //here we don't have variable as parameter
    $id = Flight::request()->query['id'];
    Flight::json(Flight::propertyreservation_service()->get_by_id($id)); // to return results in json format

  });

/**
     * @OA\Get(
     *      path="/propreservations/{id}",
     *      tags={"Property reservations"},
     *      summary="Get property reservation by id.",
     *      security={
     *          {"ApiKey": {}}   
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Get property reservation by id, or false if property reservation does not exist."
     *      ),
     *      @OA\Parameter(@OA\Schema(type="number"), in="path", name="id", example="1", description="Property Reservation ID")
     * )
     */

Flight::route('GET /propreservations/@id', function($id){ //with parameter
  try {
    $reservations = Flight::propertyreservation_service()->get_by_id($id);    // Respond with the decoded JWT and user information
    Flight::json([
        'reservations' => $reservations
    ]);
} catch (\Exception $e) {
    // Handle any exceptions and respond with an error message
    Flight::halt(401, $e->getMessage());
}   

});


/**
     * @OA\Post(
     *      path="/addPropertyReservation",
     *      tags={"Property reservations"},
     *      summary="Add property reservation to the database",
     *      security={
     *          {"ApiKey": {}}   
     *      },
     *      @OA\Response(
     *           response=200,
     *           description="Reserved proprty, or exception if property's reservation is not added properly"
     *      ),
     *      @OA\RequestBody(
     *          description="Property data payload",
     *          @OA\JsonContent(
     *              required={"date","additional_comment"},
     *              @OA\Property(property="date", type="datetime", example="2024-05-10", description="Date of reserving rporperty"),
     *              @OA\Property(property="additional_comment", type="string", example="I want to see property next week", description="Comment by user")
     *          )
     *      )
     * )
     */
Flight::route("POST /addPropertyReservation", function(){
  try {
    
    $request_data = Flight::request()->data->getData();
    $propertyReservationService = new PropertyReservationService();
    $result = $propertyReservationService->add($request_data);

    // Respond with the decoded JWT and user information
    Flight::json([
        'add_reservation' =>[
            'message' => "Property reservation added successfully",
            'property' =>$result
        ]
    ]);
} catch (\Exception $e) {
    // Handle any exceptions and respond with an error message
    Flight::halt(401, $e->getMessage());
}
  
});

