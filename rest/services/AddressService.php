<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/AddressDao.class.php';

class AddressService extends BaseService{
    protected $dao;
    public function __construct(){
        parent::__construct(new AddressDao);
    } 

    public function addAddress($data){
        // Set default values for address fields if they are not present
        $address = [
            'street_address' => isset($data['street_address']) ? $data['street_address'] : null,
            'city' => isset($data['city']) ? $data['city'] : null,
            'country' => isset($data['country']) ? $data['country'] : null,
            'postal_code' => isset($data['postal_code']) ? $data['postal_code'] : null
        ];
    
        $addressId = $this->add($address); // Assuming this method returns the ID of the inserted address
        error_log("Address ID: " . json_encode($addressId));

        return $addressId;
    }

    
    

    

    
    
}