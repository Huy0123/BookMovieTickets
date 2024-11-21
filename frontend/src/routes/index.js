
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
import ProfileLayout from '~/Components/Layout/ProfileLayout';
import Thanks from '~/pages/Thanks';
import AdminLayout from '~/Components/Layout/AdminLayout';
import MemberList from '~/Admin/MemberList';
import CinemaList from '~/Admin/CinemaList';
import MovieList from '~/Admin/MovieList';
import FnDList from '~/Admin/FnDList';
import VoucherList from '~/Admin/VoucherList';
import Moderator from '~/pages/Moderator';
import DashBoard from '~/Admin/DashBoard';
// Không cần đăng nhập vẫn xem được
const publicRoutes = [
    { path: '/', component:Home },
    { path: '/schedule', component:Schedule },
    { path: '/chooseCinema/:id', component:ChooseCinema},
    { path: '/bookTicket/:id', component:BookTicket},
    { path: '/thanks', component:Thanks},
    { path: '/signUp', component:Signup, layout:null},
    { path: '/signIn', component:Signin, layout:null},
    { path: '/forgot', component:ForgotPassword, layout:null},
    { path: '/reset-password/:token', component: ResetPassword, layout: null }, 

    
   

    
    // { path: '/CinemaManeger', component:CinemaManeger},
]
//Ngược lại
const privateRoutes = [
    { path: '/payment', component:Payment},
    { path: '/profile', component: Profile, layout: ProfileLayout },
    { path: '/history', component: History, layout: ProfileLayout },
    { path: '/voucher', component: Voucher, layout: ProfileLayout },
    { path: '/admin/cinemalist', component: CinemaList, layout: AdminLayout, adminOnly: true },
    { path: '/admin/movielist', component: MovieList, layout: AdminLayout, adminOnly: true },
    { path: '/admin/memberlist', component: MemberList, layout: AdminLayout, adminOnly: true },
    { path: '/admin/voucherlist', component: VoucherList, layout: AdminLayout, adminOnly: true },
    { path: '/admin/FnDlist', component: FnDList, layout: AdminLayout, adminOnly: true },
    { path: '/admin/dashboard', component: DashBoard, layout: AdminLayout, adminOnly: true },
    { path: '/moderator/*', component: Moderator, cinemaOnly: true, layout:null }, 
];



export {publicRoutes, privateRoutes}