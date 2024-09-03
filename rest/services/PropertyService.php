<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/PropertyDao.class.php';

class PropertyService extends BaseService{
    private $dao;
    protected $propertyDao;
    public function __construct(){
        parent::__construct(new PropertyDao);
    } 
    public function addProperty($data) {
        // Debug: Log the contents of the $_FILES array
        error_log(print_r($_FILES, true));
        //error_log("Address ID: " . $address_id);


        // Create an instance of AddressService
        $addressService = new AddressService();

        // Retrieve all address data
        $addressData = $addressService->get_all();
    
        if(!empty($addressData)){
            print_r($addressData);
            $lastAddress = end($addressData);
            $last_address_id = $lastAddress['id'];
        }

        if (!isset($data['users_id'])) {
            throw new Exception("User ID not provided");
        }
        $property = [
            'description' => $data['description'],
            'price' => $data['price'],
            'area' => $data['area'],
            'bedrooms' => $data['bedrooms'],
            'bathrooms' => $data['bathrooms'],
            'property_type' =>$data['property_type'],
            'address_id' => $last_address_id,
            'users_id' => $data['users_id']
        ];
    
        // Check if the 'image' file was uploaded
        if (isset($_FILES['image']) && isset($_FILES['image']['name'])) {
            $property['image_url'] = $_FILES['image']['name'];
    
            // Move the uploaded file to the storage directory
            move_uploaded_file($_FILES['image']['tmp_name'], __DIR__ . "/../storage/" . $_FILES['image']['name']);
        }
    
        // Add property to the database
        $result = $this->add($property);
    
        return $result;
    }

    

    
    
    
        
}
?>