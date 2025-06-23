import {React, useEffect } from 'react';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { signoutScuccess, signinSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

export default function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const [imageFile,setImageFile] = useState(null);
  const [imageFileUrl,setImageFileUrl] = useState(null);
  const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError,setImageFileUploadError] = useState(null);  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);  const [showModal, setShowModal] = useState(false);  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });  // Initialize form data with current user data
  useEffect(() => {
    if (currentUser) {
      console.log('Current User Data:', currentUser); // Debug log
      const newFormData = {
        username: currentUser.username || '',
        password: ''
      };
      console.log('Setting form data:', newFormData); // Debug log
      setFormData(newFormData);
    }
  }, [currentUser]);

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for authentication
      });
      const data = await res.json();
      if (!res.ok) {
        setUpdateUserError(data.message);
      } else {
        dispatch(signoutScuccess());
        navigate('/signin');
      }
    } catch (error) {
      setUpdateUserError(error.message);
    }
  };
  console.log(imageFileUploadProgress, imageFileUploadError);
  const filePickerRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Safety check for currentUser
  if (!currentUser) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white mb-4'>Loading Profile...</h2>
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }
    const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert to MB
      if (fileSize > 2) {
        setImageFileUploadError('File size must be less than 2MB');
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageFileUploadError('Please select a valid image file (JPEG, PNG, WebP)');
        return;
      }
      
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
      setImageFileUploadError(null);
    }
  }
  
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // Clear messages after a few seconds
  useEffect(() => {
    if (updateUserSuccess) {
      const timer = setTimeout(() => {
        setUpdateUserSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [updateUserSuccess]);

  useEffect(() => {
    if (updateUserError) {
      const timer = setTimeout(() => {
        setUpdateUserError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [updateUserError]);  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    setImageFileUploadProgress(0);
    
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
        setImageFileUploadError('Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData(prevData => ({ ...prevData, profilePicture: downloadURL }));
          setImageFileUploading(false);
          setImageFileUploadProgress(null);
        });
      }
    );
  }
  const handleSignout = async () => {
    try {      const res = await fetch('/api/user/signout', {
        method: 'POST',
        credentials: 'include', // Include cookies for authentication
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutScuccess());
        navigate('/signin');
      }
    } catch (error) {
      console.log(error.message);
    }
  };  const handleChange = (e) => {
    const { id, value } = e.target;
    console.log('Input change:', id, value); // Debug log
    // Only allow changes to username and password, not email
    if (id === 'username' || id === 'password') {
      setFormData(prevData => {
        const newData = { ...prevData, [id]: value };
        console.log('Updated formData:', newData); // Debug log
        return newData;
      });
    }
  };const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    
    console.log('Form submission started'); // Debug log
    console.log('Current formData:', formData); // Debug log
    console.log('Current user:', currentUser); // Debug log
    
    // Create submitData with only changed fields (exclude email)
    const submitData = {};
    if (formData.username && formData.username.trim() !== currentUser?.username) {
      submitData.username = formData.username.trim();
    }
    if (formData.password && formData.password.trim()) {
      submitData.password = formData.password.trim();
    }
    if (formData.profilePicture) {
      submitData.profilePicture = formData.profilePicture;
    }
    
    console.log('Submit data:', submitData); // Debug log
    
    if (Object.keys(submitData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }
    
    try {
      console.log('Making API request...'); // Debug log
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(submitData),
      });
      
      console.log('Response status:', res.status); // Debug log
      console.log('Response headers:', res.headers.get('content-type')); // Debug log
      
      // Check if response is HTML (error page) instead of JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await res.text();
        console.log('Non-JSON response received:', textResponse.substring(0, 200)); // Debug log
        setUpdateUserError('Server error: API endpoint not found or returning HTML instead of JSON');
        return;
      }
      
      const data = await res.json();
      console.log('API response:', data); // Debug log
      if (!res.ok) {
        console.log('API error:', data.message); // Debug log
        setUpdateUserError(data.message || 'Update failed');
        return;
      } else {
        console.log('Update successful, dispatching signinSuccess'); // Debug log
        dispatch(signinSuccess(data));        setUpdateUserSuccess("Profile updated successfully!");
        // Update form data with new user data
        setFormData({
          username: data.username || currentUser.username,
          password: '' // Clear password field
        });
      }
    } catch (error) {
      console.log('Catch error:', error.message); // Debug log
      if (error.message.includes('Unexpected token')) {
        setUpdateUserError('Server error: API returned invalid response format');
      } else {
        setUpdateUserError(error.message);
      }
    }
  };return (
    <div className='py-12 px-6 w-full'>
      <div className='max-w-6xl mx-auto w-full'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            My{' '}
            <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
              Profile
            </span>
          </h1>
          <p className='text-gray-300 text-lg'>Manage your account settings and preferences</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Profile Picture Card */}
          <div className='lg:col-span-1'>
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600 h-fit'>
              <div className='flex flex-col items-center space-y-6'>
                <h2 className='text-2xl font-semibold text-white'>Profile Picture</h2>
                <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
                <div className='w-40 h-40 relative'>
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
                          stroke: `rgba(139, 92, 246, ${imageFileUploadProgress / 100})`,
                        },
                        text: {
                          fill: '#e879f9',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                  )}                  <div className='relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform rotate-3'></div>
                    <img 
                      src={imageFileUrl || currentUser?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
                      alt="user"
                      className='relative rounded-full w-full h-full object-cover border-4 border-slate-600 cursor-pointer hover:scale-105 transition-all duration-300 shadow-2xl transform -rotate-3' 
                      onClick={() => filePickerRef.current.click()}
                      onError={(e) => {
                        e.target.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
                      }}
                    />
                  </div>
                </div>
                <p className='text-gray-300 text-center font-medium'>
                  Click on image to change
                </p>
                {imageFileUploadError && (
                  <div className='w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4'>
                    <p className='text-red-400 text-center'>{imageFileUploadError}</p>
                  </div>
                )}
              </div>
            </div>
          </div>          {/* Profile Information Card */}
          <div className='lg:col-span-2'>
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600'>
              <div className='space-y-6'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-2xl font-bold text-white'>Profile Information</h2>                  <div className='flex items-center space-x-2'>
                    {currentUser?.isAdmin && (
                      <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium px-3 py-1 rounded-full shadow-lg'>
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                  <form className='space-y-6' onSubmit={handleSubmit}>
                  {updateUserError && (
                    <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-4'>
                      <p className='text-red-400 text-center'>{updateUserError}</p>
                    </div>
                  )}
                  {updateUserSuccess && (
                    <div className='bg-green-500/10 border border-green-500/20 rounded-xl p-4'>
                      <p className='text-green-400 text-center'>{updateUserSuccess}</p>
                    </div>
                  )}                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>                    <div>
                      <label htmlFor='username' className='block text-sm font-medium text-gray-300 mb-2'>
                        Username
                      </label>                      <input
                        type='text' 
                        id='username' 
                        placeholder='Enter username' 
                        value={formData.username || ''}
                        onChange={handleChange}
                        className='w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-black font-medium placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
                      />
                    </div>
                    <div>
                      <label htmlFor='email' className='block text-sm font-medium text-gray-300 mb-2'>
                        Email Address
                        <span className='text-xs text-gray-400 ml-2'>(Read Only)</span>
                      </label>
                      <input
                        type='email' 
                        id='email' 
                        placeholder='Email address' 
                        value={currentUser?.email || ''}
                        readOnly
                        disabled
                        className='w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-black font-medium placeholder-gray-500 cursor-not-allowed opacity-75'
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-300 mb-2'>
                      New Password
                      <span className='text-xs text-gray-400 ml-2'>(Leave blank to keep current)</span>
                    </label>
                    <input
                      type='password' 
                      id='password' 
                      placeholder='Enter new password' 
                      value={formData.password || ''}
                      onChange={handleChange}
                      className='w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-black font-medium placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
                    />
                  </div>                  <div className='flex flex-col sm:flex-row gap-4 pt-6'>
                    <button
                      type='submit' 
                      disabled={imageFileUploading}
                      className='flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                    >
                      {imageFileUploading ? 'Uploading...' : 'Update Profile'}
                    </button>                    {currentUser?.isAdmin && (
                      <div className='flex flex-col sm:flex-row gap-3 flex-1'>
                        <Link to={'/create-post'} className='flex-1'>
                          <button
                            type='button'
                            className='w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                          >
                            Create Article
                          </button>
                        </Link>
                        <Link to={'/dashboard?tab=posts'} className='flex-1'>
                          <button
                            type='button'
                            className='w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                          >
                            Manage Posts
                          </button>
                        </Link>
                        <Link to={'/dashboard?tab=pyqs'} className='flex-1'>
                          <button
                            type='button'
                            className='w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                          >
                            Manage PYQs
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Account Stats Card */}
          <div className='lg:col-span-3'>
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600'>
              <div className='space-y-6'>
                <h2 className='text-2xl font-semibold text-white'>Account Overview</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                  <div className='bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-center'>
                    <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-3 flex items-center justify-center'>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>                    <h3 className='text-white font-semibold mb-1'>Member Since</h3>
                    <p className='text-gray-300 text-sm'>
                      {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className='bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 text-center'>
                    <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center'>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>                    <h3 className='text-white font-semibold mb-1'>Account Type</h3>
                    <p className='text-gray-300 text-sm'>
                      {currentUser?.isAdmin ? 'Administrator' : 'User'}
                    </p>
                  </div>
                  <div className='bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-2xl p-6 text-center'>
                    <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl mx-auto mb-3 flex items-center justify-center'>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className='text-white font-semibold mb-1'>Status</h3>
                    <p className='text-gray-300 text-sm'>Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className='lg:col-span-3'>
            <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600'>
              <div className='space-y-6'>
                <h2 className='text-2xl font-semibold text-white'>Account Actions</h2>
                <div className='flex flex-wrap gap-4'>
                  <button
                    onClick={handleSignout}
                    className='bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg'
                  >
                    Sign Out
                  </button>                  <button
                    onClick={() => setShowModal(true)}
                    className='bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 max-w-md mx-4 border border-slate-600 shadow-2xl'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>Delete Account</h3>
              <p className='text-gray-300 mb-6'>
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className='flex gap-4'>
                <button
                  onClick={() => setShowModal(false)}
                  className='flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  className='flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300'
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
