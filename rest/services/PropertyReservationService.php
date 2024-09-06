<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/PropertyReservationDao.class.php';

class PropertyReservationService extends BaseService{
    private $dao;
    public function __construct(){
        parent::__construct(new PropertyReservationDao);
    } 
   
}