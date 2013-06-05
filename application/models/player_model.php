<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
  
class Player_model extends CI_Model
{
	
	// return all players
	public function get_all()
	{
		$this->db->order_by('score desc, name');
		return $this->db->get('player')->result_array();
	}
	
	/**
	* Increase the score of $name by $increment
	* 
	* @param mixed $name The name of the player to increment
	* @param mixed $increment The exact number of points to increment by
	*/
	public function increase_score($name, $increment=5)
	{
		$increment = (integer)$increment;
		
		
		$this->db->where('name', $name);
		$this->db->set('score', 'score+'.$increment, FALSE);
		$this->db->update('player');
	}
	
}