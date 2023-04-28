import { RouterOptions, createRouter, createWebHistory } from 'vue-router'
const Login = () => import('../pages/login.vue')
const Register = () => import('../pages/register.vue')
const HomePage = () => import('@/pages/homePage.vue')
const ClubSquare = () => import('@/pages/clubSquare.vue')
const personalCenter = () => import(('@/pages/personalCenter.vue'))
const ManageClubMember = () => import('@/pages/manageClubMember.vue')
const PublishActivity = () => import('@/pages/publishActivity.vue')


const routes: RouterOptions['routes'] = [
    {
        path: '/',
        component: HomePage,
        children: [
            {
                path: 'clubSquare',
                component: ClubSquare
            },
            {
                path: 'personalCenter',
                component: personalCenter
            },
            {
                path: 'manageClubMember',
                component: ManageClubMember
            },
            {
                path: 'publishActivity',
                component: PublishActivity
            }
        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/register',
        component: Register
    }
]


export const router = createRouter({
    routes,
    history: createWebHistory('')
})

// router.beforeEach((to, from) => {
//     console.log('to', to)
//     console.log('from', from)
// })


