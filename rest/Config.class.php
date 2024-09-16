<?php

class Config {
    public static function DB_HOST(){
        return Config::get_env("DB_HOST", "mysql-3c6a4f9-aminameric7-d2a2.d.aivencloud.com");
    }

    public static function DB_USERNAME(){
        return Config::get_env("DB_USERNAME", "avnadmin");
    }

    public static function DB_PASSWORD(){
        return Config::get_env("DB_PASSWORD", "AVNS_bWDUkgw2Jwf2tlAnn44");
    }

    public static function DB_SCHEMA(){
        return Config::get_env("DB_SCHEMA", "defaultdb");
    }

    public static function DB_PORT(){
        return Config::get_env("DB_PORT", "18381");
    }

    public static function get_env($name, $default){
        return isset($_ENV[$name]) && trim($_ENV[$name]) != '' ? $_ENV[$name] : $default;
    }
    
}
// JWT Secret
define('JWT_SECRET', '#WW/Y]cJ5$(d:%jPzhP+[@aw2$a.v9');
?>