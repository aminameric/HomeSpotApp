<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/PropertyDao.class.php';

class PropertyService extends BaseService{
    private $dao;
    protected $propertyDao;
    public function __construct(){
        parent::__construct(new PropertyDao);
    } 
    function addProperty($data) {
        // Debug: Log the contents of the received $data
        error_log(print_r($data, true));
        
        // Create an instance of AddressService
        $addressService = new AddressService();
        
        // Retrieve the last address ID or any other logic
        $addressData = $addressService->get_all();
        if (!empty($addressData)) {
            $lastAddress = end($addressData);
            $last_address_id = $lastAddress['id'];
        }
        
        if (!isset($data['users_id'])) {
            throw new Exception("User ID not provided");
        }
    
        // Prepare property data
        $property = [
            'name' => $data['name'],
            'description' => $data['description'],
            'price' => $data['price'],
            'area' => $data['area'],
            'bedrooms' => $data['bedrooms'],
            'bathrooms' => $data['bathrooms'],
            'property_type' => $data['property_type'],
            'address_id' => $last_address_id, // Or use the address ID from data if passed
            'users_id' => $data['users_id']
        ];
    
        // Handle image upload
        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
            $property['image_url'] = $_FILES['image']['name'];
            move_uploaded_file($_FILES['image']['tmp_name'], __DIR__ . "/../storage/" . $_FILES['image']['name']);
        }
    
        // Handle floor image upload
        if (isset($_FILES['floor_image']) && $_FILES['floor_image']['error'] === UPLOAD_ERR_OK) {
            $property['floor_image'] = $_FILES['floor_image']['name'];
            move_uploaded_file($_FILES['floor_image']['tmp_name'], __DIR__ . "/../storage/" . $_FILES['floor_image']['name']);
        }
    
        // Add property to the database
        return $this->add($property);
    }
    
    

    
    
    
        
}
?>