<?php

class BaseService {
    private $dao;
   
    public function __construct($dao){
        $this->dao = $dao;
    }

    public function get_all(){
        return $this->dao->get_all();
    }

    public function get_by_id($id){
        return $this->dao->get_by_id($id);
    }
    public function get_by_ids(array $ids){
        return $this->dao->get_by_ids($ids);
    }
    
    public function add($entity){
        return $this->dao->add($entity);
    }

    public function update($entity, $id){
        return $this->dao->update($entity, $id);
    }
    
    public function delete($id){
        return $this->dao->delete($id);
    }
    public function get_user_by_username($username){
        return $this->dao->get_user_by_username($username);
    }
    public function get_city($city){
        return $this->dao->get_city($city);
    }
    public function get_agent($type_of_user){
        return $this->dao->get_agent($type_of_user);
    }
    public function get_property_name($id){
        return $this->dao->get_property_name($id);
    }
    public function get_property_info($id){
        return $this->dao->get_property_info($id);
    }
    public function get_agent_by_property($property_id) {
        return $this->dao->get_agent_by_property($property_id);
    }
    public function get_properties_by_city($city) {
        return $this->dao->get_by_city($city);
    }
    
    
}

?>