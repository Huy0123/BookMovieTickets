
import Home from '~/pages/Home';
import Schedule from '~/pages/Schedule';
import Profile from '~/pages/Profile';
import ChooseCinema from '~/pages/ChooseCinema';
// Không cần đăng nhập vẫn xem được
const publicRoutes = [
    { path: '/', component:Home },
    { path: '/schedule', component:Schedule },
    { path: '/profile', component:Profile },
    { path: '/chooseCinema', component:ChooseCinema},

]
//Ngược lại
const privateRoutes = [
    
]

export {publicRoutes, privateRoutes}