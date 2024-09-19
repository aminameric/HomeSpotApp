<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/PropertyBuyingDao.class.php';

class PropertyBuyingService extends BaseService {
    protected $propertyBuyingDao;

    public function __construct() {
        // Initialize PropertyDao and pass it to the BaseService constructor
        parent::__construct(new PropertyBuyingDao('user_properties_buying'));
    }
    public function buyProperty($userId, $propertyId) {
        return $this->dao->recordPropertyPurchase($userId, $propertyId);
    }
    public function getUserProperties($userId) {
        return $this->dao->getPropertiesByUser($userId);
    }
}
