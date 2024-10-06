
import Home from '~/pages/Home';
import Schedule from '~/pages/Schedule';
import Profile from '~/pages/Profile';
import ChooseCinema from '~/pages/ChooseCinema';
import Signup from '~/pages/Signup';
import Signin from '~/pages/Signin';
// Không cần đăng nhập vẫn xem được
const publicRoutes = [
    { path: '/', component:Home },
    { path: '/schedule', component:Schedule },
    { path: '/profile', component:Profile },
    { path: '/chooseCinema', component:ChooseCinema},
    { path: '/signUp', component:Signup, layout:null},
    { path: '/signIn', component:Signin, layout:null},

]
//Ngược lại
const privateRoutes = [
    
]

export {publicRoutes, privateRoutes}