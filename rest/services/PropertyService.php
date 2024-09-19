<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/PropertyDao.class.php';

class PropertyService extends BaseService{
    
    protected $propertyDao;

    public function __construct() {
        // Initialize PropertyDao and pass it to the BaseService constructor
        parent::__construct(new PropertyDao('property'));
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

    function listProp(){
        $ch = curl_init();
        $url = "https://olx.ba/api/search?=&attr=373031322850726f64616a6129&attr_encoded=1&category_id=23";
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, false);

        $response = curl_exec($ch);

        header("Access-Control-Allow-Origin: *");

        curl_close($ch);
        flush();
        return json_decode($response, true);
    }
    
    public function deleteProperty($propertyId) {
        try {
            // Use the new transaction methods provided by PropertyDao
            $this->dao->beginTransaction();
    
            // Only delete reservations if they exist
            if ($this->dao->hasReservations($propertyId)) {
                $this->dao->deletePropertyReservations($propertyId);
            }
    
            // Only delete buyings if they exist
            if ($this->dao->hasBuyings($propertyId)) {
                $this->dao->deletePropertyBuyings($propertyId);
            }
    
            // Always delete the property itself
            $this->dao->deleteProperty($propertyId);
    
            $this->dao->commit();
            
            return true; // Indicate success after the transaction is committed
        } catch (Exception $e) {
            $this->dao->rollBack();
            throw $e;  // Re-throw the exception to be handled or logged by the caller
        }
    }
    
    
    

    
    public function getPropPrice($id){
        return $this->dao->getPropPrice($id); // Return the data from DAO layer
    }

    public function updatePropertyStatus($propertyId) {
        return $this->dao->updatePropertyStatus($propertyId);
    }
    
    
}
      
function getExchangeRateFromAPI($fromCurrency, $toCurrency) {
    // Example using a generic API endpoint
    $apiUrl = "https://api.exchangerate-api.com/v4/latest/{$fromCurrency}";
    $response = file_get_contents($apiUrl);
    $data = json_decode($response, true);

    if (!$data || !isset($data['rates'][$toCurrency])) {
        throw new Exception("Failed to fetch exchange rate");
    }

    return (float) $data['rates'][$toCurrency];
}
