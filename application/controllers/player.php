<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
  
class Player extends CI_Controller
{
	
	/**
	* Outputs an HTML list of players.
	* 
	* @param mixed $selected The name of the selected
	*/
	public function index($selected = false)
	{
		
		$this->load->library('parser');
		$this->load->model('player_model');
		
		// get list of players and their scores
		$data['players'] = $this->player_model->get_all();
		
		// add selected keyword to selected array element
		if($selected) $selected = urldecode($selected);
		foreach($data['players'] as $key=>$player)
		{
			$data['players'][$key]['selected'] = ($selected == $player['name']) ? 'selected' : '';
		}
		
		$this->parser->parse('player', $data);
		
	}
	
	/**
	* Record a score increase for $name
	* 
	* @param mixed $name The name of the player
	* @param mixed $count The number of iterations to apply
	*/
	public function score($name,$count=1)
	{
		$name = urldecode($name);
		$increment = $count * 5;
		$this->load->model('player_model');
		$this->player_model->increase_score($name, $increment);
	}
	
}

/* End of file leaderboard.php */
/* Location: ./application/controllers/leaderboard.php */
