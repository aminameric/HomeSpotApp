<?php

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

Flight::route('/*', function() {
    if(
        strpos(Flight::request()->url, '/loginUser') === 0 ||
        strpos(Flight::request()->url, '/addUser') === 0 ||
        strpos(Flight::request()->url, '/addAgent') === 0 ||
        strpos(Flight::request()->url, '/connection-check') === 0
    ) {
        return TRUE;
    } else {
        try {
            $headers = getallheaders();
            $token = isset($headers['Authentication']) ? $headers['Authentication'] : null;

            if(!$token) {
                Flight::halt(401, "Missing authentication header");
            }

            $decoded_token = JWT::decode($token, new Key(JWT_SECRET, 'HS256'));

            Flight::set('user', $decoded_token->user);
            Flight::set('jwt_token', $token);
            return TRUE;
        } catch (\Exception $e) {
            Flight::halt(401, $e->getMessage());
        }
    }
});

Flight::map('error', function($e){
    // We want to log every error that happens
    file_put_contents('logs.txt', $e . PHP_EOL, FILE_APPEND | LOCK_EX);

    Flight::halt($e->getCode(), $e->getMessage());
    Flight::stop($e->getCode());
});