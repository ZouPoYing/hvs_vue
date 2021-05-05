import Vue from 'vue'
import Router from 'vue-router'
import Login from "../views/LoginAndRegist/Login";
import Regist from "../views/LoginAndRegist/Regist";
import ForgetPassword from "../views/LoginAndRegist/ForgetPassword";
import Setting from "../views/LoginAndRegist/Setting";
import Home from "../views/home";
import UserInfoManagement from "../views/Router/UserInfoManagement";
import Registration from "../views/Router/Registration";
import Reception from "../views/Router/Reception";
import PInfoManagement from "../views/Router/PInfoManagement";
import ReceptionManagement from "../views/Router/ReceptionManagement";
import BookConfig from "../views/Router/BookConfig";
import MediManagement from "../views/Router/MediManagement";
import PayAndVform from "../views/Router/PayAndVform";
import GiveMedi from "../views/Router/GiveMedi";
import Statistics from "../views/Router/Statistics";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/regist',
      name: 'Regist',
      component: Regist
    },
    {
      path: '/forgetPassword',
      name: 'ForgetPassword',
      component: ForgetPassword
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/userInfoManagement',
      name: 'UserInfoManagement',
      component: UserInfoManagement
    },
    {
      path: '/registration',
      name: 'Registration',
      component: Registration
    },
    {
      path: '/reception',
      name: 'Reception',
      component: Reception
    },
    {
      path: '/pInfoManagement',
      name: 'PInfoManagement',
      component: PInfoManagement
    },
    {
      path: '/receptionManagement',
      name: 'ReceptionManagement',
      component: ReceptionManagement
    },
    {
      path: '/bookConfig',
      name: 'BookConfig',
      component: BookConfig
    },
    {
      path: '/mediManagement',
      name: 'MediManagement',
      component: MediManagement
    },
    {
      path: '/payAndVform',
      name: 'PayAndVform',
      component: PayAndVform
    },
    {
      path: '/giveMedi',
      name: 'GiveMedi',
      component: GiveMedi
    },
    {
      path: '/statistics',
      name: 'Statistics',
      component: Statistics
    }
  ]
})
