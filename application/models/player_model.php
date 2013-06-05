<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
  
class Player_model extends CI_Model
{
	
	public function get_all()
	{
		$this->db->order_by('score desc, name');
		return $this->db->get('player')->result_array();
	}
	
	public function increase_score($name)
	{
		$name = urldecode($name);
		$this->db->where('name', $name);
		$this->db->set('score', 'score+5', FALSE);
		$this->db->update('player');
	}
	
}