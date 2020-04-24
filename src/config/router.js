import Vue from 'vue';
import VueRouter from 'vue-router';
import Logout from '../views/Logout.vue';
import Quizzes from '../views/Quizzes.vue';
import Evaluation from '../views/Evaluation.vue';

// code splitting
const Login = () => import(/* webpackChunkName: "login" */ '../views/Login.vue');
const Registration = () => import(/* webpackChunkName: "registration" */ '../views/Registration.vue');
const Profile = () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue');
const Result = () => import(/* webpackChunkName: "result" */ '../views/Result.vue');
const PasswordReset = () => import(/* webpackChunkName: "pass_reset" */ '../views/PasswordReset.vue');
const ForgotPassword = () => import(/* webpackChunkName: "pass_forgot" */ '../views/ForgotPassword.vue');

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Quizzes,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
  },
  {
    path: '/quizzes',
    name: 'Quizzes',
    component: Quizzes,
  },
  {
    path: '/evaluation/:pin',
    name: 'Evaluation',
    component: Evaluation,
    props: true,
  },
  {
    path: '/result/:score',
    name: 'Result',
    component: Result,
    props: true,
  },
  {
    path: '/user/profile',
    name: 'Profile',
    component: Profile,
  },
  {
    path: '/password_reset/:token',
    name: 'password_reset',
    component: PasswordReset,
    props: true,
  },
  {
    path: '/forgot_password',
    name: 'forgot_password',
    component: ForgotPassword,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/license',
    name: 'License',
    component: () => import(/* webpackChunkName: "license" */ '../views/License.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
