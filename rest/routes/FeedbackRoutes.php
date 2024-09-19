<?php

Flight::route("POST /addFeedback", function(){
    try {
        // Fetch the request data (name, email, subject, message, and optionally users_id)
        $request_data = Flight::request()->data->getData();

        // Initialize the feedback service
        $feedbackService = new FeedbackService();

        // Add the feedback using the service method
        $result = $feedbackService->addFeedback($request_data);

        // Return the JSON response with the result
        Flight::json([
            'status' => 'success',
            'message' => 'Feedback added successfully!',
            'feedback_id' => $result
        ], 200); // HTTP 200 OK
    } catch (\Exception $e) {
        // Handle any exceptions and return an error response
        Flight::halt(400, ['status' => 'error', 'message' => $e->getMessage()]);
    }
});

// Route to get feedback messages
Flight::route("GET /feedback", function(){
    $feedbackService = new FeedbackService();
    $feedbacks = $feedbackService->getAllFeedbacks();  // A new function to get all feedbacks

    Flight::json($feedbacks);
});


