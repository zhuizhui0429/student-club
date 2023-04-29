import { RouterOptions, createRouter, createWebHistory } from 'vue-router'
const Login = () => import(('../pages/login'))
const Register = () => import(('../pages/register'))
const HomePage = () => import(('@/pages/homePage'))
const ClubSquare = () => import(('@/pages/clubSquare'))
const personalCenter = () => import(('@/pages/personalCenter'))
const ManageClubMember = () => import(('@/pages/manageClubMember'))
const PublishActivity = () => import(('@/pages/publishActivity'))
const ActivityHistory = () => import(('@/pages/activityHistory'))
const CreateClub = () => import(('@/pages/createClub'))



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
            },
            {
                path: 'activityHistory',
                component: ActivityHistory
            },
            {
                path: 'createClub',
                component: CreateClub
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


