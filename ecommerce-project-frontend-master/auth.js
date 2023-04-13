import { globals } from "./globals";

const USER_ID_KEY = 'userId';

async function signUp(details=
    {
        email,
        password
    }) {

    return await fetch(`${globals.BACKEND_ROOT}/signup.php`, {
        method: 'POST',
        body: JSON.stringify(details)
    });

}

async function login(details={username, password}) {

    let response = await fetch(`${globals.BACKEND_ROOT}/login.php`, {
        method: 'POST',
        body: JSON.stringify(details)
    });

    if(response.ok){
        sessionStorage.setItem(USER_ID_KEY, await response.text());
    }
    return response;

}

function getCurrentUser() {

    if(isUserSignedIn()){
        return sessionStorage.getItem(USER_ID_KEY);
    }else{
        console.warn('No logged in user');
        return -1;
    }

}

function isUserSignedIn() {

    if(sessionStorage.getItem(USER_ID_KEY)){
        return true;
    }
    return false;
}

// Gets user ID to use for database insertion/extraction
export function getUserID() {
    if(sessionStorage.getItem(USER_ID_KEY)){
        return sessionStorage.getItem(USER_ID_KEY);
    }
}


function signOut() {

    sessionStorage.clear();

}

export { signUp, login, isUserSignedIn, signOut, getCurrentUser };