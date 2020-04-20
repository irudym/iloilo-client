import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Registration from '../views/Registration.vue';
import Quizzes from '../views/Quizzes.vue';
import Evaluation from '../views/Evaluation.vue';
import Result from '../views/Result.vue';
import Profile from '../views/Profile.vue';

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
