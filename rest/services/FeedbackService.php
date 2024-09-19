<?php
require_once 'BaseService.php';
require_once __DIR__ . '/../dao/FeedbackDao.class.php';

class FeedbackService extends BaseService{
    
    protected $feedbackDao;

    public function __construct() {
        
        parent::__construct(new FeedbackDao('user_messages'));
    }
    public function addFeedback($feedback) {
        return $this->dao->addFeedback($feedback);
    }

    public function getAllFeedbacks() {
        return $this->dao->getAllFeedbacks();
    }
    

}