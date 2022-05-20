import HomeEn from "./HomeEn";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import server from "./ServerURL";
import './Login.css';

const LoginEn = ({ loading, userData, login, logged_in, toggleLogged}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorFlag, setErrorFlag] = useState(false);
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();
        login(email, password, navigate);
    }
    return (
        <div className="login">
            <HomeEn userData={userData} logged_in={logged_in} toggleLogged={toggleLogged}/>
            <Link style={{cursor: 'default'}} to='/en'><div className="modal__bg"></div></Link>
            <div className="login__modal">
                <h1>My Account</h1>
                <form onSubmit={onSubmit}>
                    <label>EMAIL</label>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email" 
                        required
                    />
                    <label>PASSWORD</label>
                    <input 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password" 
                        required
                    />
                    {loading && <p style={{textAlign: 'center'}}>Loading...</p>}
                    <p id="login_error" style={{ display: 'none', marginBottom: '30px', color: 'red', textAlign:"center", fontSize: '12px'}} className="error_message">*Invalid Credentials</p>
                    <p>New customer? <span><Link to='/en/register'>register here</Link></span></p>
                    <button id="login__submit" type="submit">Login</button>
                </form>
                
            </div>
        </div>
    );
}

export default LoginEn;