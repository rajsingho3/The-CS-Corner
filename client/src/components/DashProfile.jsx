import { Alert, Button, TextInput } from 'flowbite-react';
import { set } from 'mongoose';
import {React, useEffect } from 'react';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { signoutScuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

export default function DashProfile() {
  const currentUser = useSelector(state => state.user.currentUser);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError,setImageFileUploadError] = useState(null);
  console.log(imageFileUploadProgress, imageFileUploadError);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      
      
    }
  }
  useEffect(() => {
    if (imageFile) {
      uploadImage();
      
    }
  }, [imageFile]);
  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
        
      },
      (error) => {
        // Handle unsuccessful uploads
        setImageFileUploadError(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploadProgress(null); // Reset progress after successful upload
        });
      }
    );

  }

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutScuccess());
        navigate('/login'); // Redirect to login page after signout
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile </h1>
      <form className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
        <div className='w-32 h-32 self-center relative'>
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
                text: {
                  fill: '#f88',
                  fontSize: '16px',
                },
              }}
            />
          )}
          <img src={imageFileUrl || currentUser.profilePicture} alt="user"
            className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' onClick={() => filePickerRef.current.click()} />
        </div>

        {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
        <TextInput type='emailt' id='email' placeholder='email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='Password' />

        <Button type='submit' gradientDuoTone='purpleToPink' outline>Update</Button>
        {currentUser.isAdmin && (
          <Link to={'/create-post'}>
            <Button
              type='button'
              gradientDuoTone='purpleToPink'
              className='w-full'
            >
              Write an article 
            </Button>
          </Link>
        )}
      </form>
      
    </div>
  )
}
