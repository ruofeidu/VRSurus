<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
		header("Cache-Control: no-cache");
		if (!empty($_REQUEST["setInput"])) {
			return $this->setInput($_REQUEST["setInput"]); 
		} else
		if (!empty($_REQUEST["setOutput"])) {
			return $this->setOutput($_REQUEST["setOutput"]); 
		} else
		if (!empty($_REQUEST["setSlapLeft"])) {
			return $this->setSlapLeft($_REQUEST["setSlapLeft"]); 
		} else
		if (!empty($_REQUEST["setSlapRight"])) {
			return $this->setSlapRight($_REQUEST["setSlapRight"]); 
		} else
		if (!empty($_REQUEST["setSpray"])) {
			return $this->setSpray($_REQUEST["setSpray"]); 
		} else
		if (!empty($_REQUEST["setThrust"])) {
			return $this->setThrust($_REQUEST["setThrust"]); 
		} else 
		if (!empty($_REQUEST["getInput"])) {
			return $this->getInput(); 
		} else
		if (!empty($_REQUEST["getOutput"])) {
			return $this->getOutput(); 
		}
		echo 'Wrong Command';
		return; 
    }
	
	public function setInput($str) {
		M('data')->where('id=0')->setField('data', strval($str)); echo 'Y'; return; 
	}
	
	public function setOutput($str) {
		M('data')->where('id=1')->setField('data', strval($str)); echo 'Y'; return; 
	}
	
	public function setSlapLeft($val) {
		M('data')->where('id=0')->setField('data', 'L'.$val); echo 'Y'; return; 
	}
	
	public function setSlapRight($val) {
		M('data')->where('id=0')->setField('data', 'R'.$val); echo 'Y'; return; 
	}
	
	public function setSpray($val) {
		M('data')->where('id=0')->setField('data', 'S'.$val); echo 'Y'; return; 
	}
	
	public function setThrust($val) {
		M('data')->where('id=0')->setField('data', 'T'.$val); echo 'Y'; return; 
	}
	
	public function getInput() {
		$ans = M('data')->where('id=0')->select(); 
		echo $ans[0]['data']; 
		M('data')->where('id=0')->setField('data', 'I'); 
		return; 
	}
	
	public function getOutput() {
		$ans = M('data')->where('id=1')->select(); 
		echo $ans[0]['data']; 
		M('data')->where('id=1')->setField('data', 'I'); 
		return; 
	}
}