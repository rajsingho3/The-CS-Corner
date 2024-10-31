import { Button } from 'flowbite-react';
import React from 'react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signinSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL
                }),
            });
            
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Server Error:', errorText);
                alert(`Server Error: ${errorText}`);
                navigate('/signin');
                return;
            }
            
            try {
                const data = await res.json();
                dispatch(signinSuccess(data));
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                alert('Error parsing server response. Please try again.');
                navigate('/signin');
            }
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            alert('Error during Google sign-in. Please try again.');
            navigate('/signin');
        }
    };

    return (
        <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
        <AiFillGoogleCircle className='w-6 h-6 mr-2'  />
        Continue with Google
    </Button>
    );
}
