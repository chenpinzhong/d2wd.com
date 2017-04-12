<?php
namespace app\index\controller;
use think\Controller;
use think\Db;//引入数据库
Class Index extends Controller
{
    public function index(){
		return $this->fetch('index');
	}
	public function ajax(){
		
		$data = Db::name('login')->find();
        $this->assign('result',$data);
		return $this->fetch();
    }
	
	
}
