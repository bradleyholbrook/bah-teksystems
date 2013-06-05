<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
  
class Player extends CI_Controller
{
	
	public function index($selected = false)
	{
		//get list of players and their scores
		$this->load->library('parser');
		$this->load->model('player_model');
		
		$data['players'] = $this->player_model->get_all();
		
		
		if($selected) $selected = urldecode($selected);
		foreach($data['players'] as $key=>$player)
		{
			$data['players'][$key]['selected'] = ($selected == $player['name']) ? 'selected' : '';
		}
		
		$this->parser->parse('player', $data);
		
	}
	
	public function score($name,$count=1)
	{
		$this->load->model('player_model');
		do { $this->player_model->increase_score($name); } while (--$count > 0);
	}
	
}

/* End of file leaderboard.php */
/* Location: ./application/controllers/leaderboard.php */
