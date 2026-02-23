import React , {createContext,useContext,useState,useEffect} from "react";

const authContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
       throw new Error("useAuth must be used with an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(null);
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    useEffect(()=>{
        checkAuthStatus();
    },[]);

    const checkAuthStatus = async () => {
        try{
           const token = localStorage.getItem('token');
           const userStr = localStorage.getItem('user');

           if(token && userStr){
            const userData = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
           }
        }catch(error){
            console.error('Auth check failed:',error);
            logout();
        }finally{
            setLoading(false);
        }
    };


    const login  = (userData,token) => {
        localStorage.setItem('token',token);
        localStorage.setItem('user',JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    const updateUser = (updatedUserData) => {
        const newUserData = {...user,...updatedUserData};
        localStorage.setItem('user',JSON.stringify(newUserData));
        setUser(newUserData);
    };

    const value = {
        user,loading,isAuthenticated,login,logout,updateUser,checkAuthStatus,
    };
    
    return <AuthProvider value={value}>{children}</AuthProvider>
};