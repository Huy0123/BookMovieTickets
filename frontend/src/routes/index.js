
// import CinemaManeger from '~/pages/CinemaManeger';
import Home from '~/pages/Home';
import Schedule from '~/pages/Schedule';
import Profile from '~/pages/Profile';
import History from '~/pages/History';
import Voucher from '~/pages/Voucher';
import ChooseCinema from '~/pages/ChooseCinema';
import Signup from '~/pages/Signup';
import Signin from '~/pages/Signin';
import ForgotPassword from '~/pages/Forgot';
import ResetPassword from '~/pages/ResetPassword';
import BookTicket from '~/pages/BookTicket';
import Payment from '~/pages/Payment';
import Test from '~/pages/Test';
import ProfileLayout from '~/Components/Layout/ProfileLayout';
// Không cần đăng nhập vẫn xem được
const publicRoutes = [
    { path: '/', component:Home },
    { path: '/schedule', component:Schedule },
    { path: '/profile', component:Profile ,layout: ProfileLayout},
    { path: '/history', component:History ,layout: ProfileLayout},
    { path: '/voucher', component:Voucher ,layout: ProfileLayout},
    { path: '/chooseCinema/:id', component:ChooseCinema},
    { path: '/bookTicket/:id', component:BookTicket},
    { path: '/test/:id', component:Test},
    { path: '/signUp', component:Signup, layout:null},
    { path: '/signIn', component:Signin, layout:null},
    { path: '/forgot', component:ForgotPassword, layout:null},
    { path: '/reset-password/:token', component: ResetPassword, layout: null }, 
    { path: '/payment', component:Payment},
    // { path: '/CinemaManeger', component:CinemaManeger},
]
//Ngược lại
const privateRoutes = [
    
]

export {publicRoutes, privateRoutes}