const Login = () => import('./components/Login_component.vue');
const Home = () => import('./components/Home_page.vue');
const Index = () => import('./components/Home_page_selector.vue');
const Books = () => import('./components/Books_page.vue');
const Editor = () => import('./components/Editor_page.vue');
const Events = () => import('./components/Events_page.vue');
const Users = () => import('./components/Users_page.vue');
const Orders = () => import('./components/Orders_page.vue');
const Admins = () => import('./components/Admins_page.vue');

const routes = [
    {
        path: '/adminpannel/login',
        name: 'login',
        alias: '/index.php/adminpannel/login',
        component: Login, //resolve => require(['./components/Login_component.vue'], resolve),
    },
    {
        path: '/adminpannel',
        name: 'home',
        alias: '/index.php/adminpannel',
        meta: { requiresAuth: true },
        component: Home, //resolve => require(['./components/Home_page.vue',], resolve), 
        children: [
            {  
                path: 'index',
                name: 'index',
                alias: '',
                meta: { requiresAuth: true },
                component: Index, //resolve => require(['./components/Home_page_selector.vue',], resolve)
            },
            {
                path: 'books',
                name: 'books',
                meta: { requiresAuth: true },
                component: Books, //resolve => require(['./components/Books_page.vue',], resolve)
            },
            {
                path: 'editor/:id',
                name: 'editor',
                meta: { requiresAuth: true },
                component: Editor, //resolve => require(['./components/Editor_page.vue',], resolve)
            },
            {
                path: 'events',
                name: 'events',
                meta: { requiresAuth: true },
                component: Events, //resolve => require(['./components/Events_page.vue',], resolve)
            },
            {
                path: 'orders',
                name: 'orders',
                meta: { requiresAuth: true },
                component: Orders, //resolve => require(['./components/Orders_page.vue',], resolve)
            },
            {
                path: 'users',
                name: 'users',
                meta: { requiresAuth: true },
                component: Users //resolve => require(['./components/Users_page.vue',], resolve)
            },
            {
                path: 'admins',
                name: 'admins',
                meta: { requiresAuth: true, requiresSuper: true},
                component: Admins, //resolve => require(['./components/Admins_page.vue',], resolve)
            }
        ]
    }
]
export default routes

