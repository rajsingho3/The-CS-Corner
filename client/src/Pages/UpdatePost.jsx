import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import NotionEditor from '../components/NotionEditor';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Update{' '}
            <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
              Article
            </span>
          </h1>
          <p className='text-gray-300 text-lg'>Make your changes and update your post</p>
        </div>

        {/* Main Content */}
        <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-3xl p-8 shadow-2xl border border-slate-600'>
          <form className='space-y-8' onSubmit={handleSubmit}>
            
            {/* Title and Category Row */}
            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
              <div className='lg:col-span-2'>
                <label className='block text-sm font-medium text-gray-300 mb-3'>
                  Article Title <span className='text-red-400'>*</span>
                </label>
                <input
                  type='text'
                  placeholder='Enter an engaging title...'
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className='w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white font-medium placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-3'>
                  Branch/Category <span className='text-red-400'>*</span>
                </label>
                <select
                  value={formData.category || 'uncategorized'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className='w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white font-medium focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
                >
                  <option value='uncategorized'>Select a Branch</option>
                  <option value='B.Tech Common'>B.Tech Common</option>
                  <option value='B.Tech CSE'>B.Tech CSE</option>
                  <option value='B.Tech CIVIL'>B.Tech CIVIL</option>
                  <option value='B.Tech ME'>B.Tech ME</option>
                  <option value='B.Tech ECE'>B.Tech ECE</option>
                  <option value='Other Branches'>Other Branches</option>
                </select>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className='space-y-4'>
              <label className='block text-sm font-medium text-gray-300'>
                Featured Image
                <span className='text-xs text-gray-400 ml-2'>(Optional)</span>
              </label>
              
              <div className='border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:border-purple-500/50 transition-all duration-300'>
                <div className='flex flex-col items-center space-y-4'>
                  <div className='flex gap-4'>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={(e) => setFile(e.target.files[0])}
                      className='block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-slate-600 file:text-white hover:file:bg-slate-500'
                    />
                    <button
                      type='button'
                      onClick={handleUpdloadImage}
                      disabled={imageUploadProgress}
                      className='bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 px-6 rounded-xl transition-all duration-300'
                    >
                      {imageUploadProgress ? (
                        <div className='flex items-center space-x-2'>
                          <div className='w-4 h-4'>
                            <CircularProgressbar
                              value={imageUploadProgress}
                              styles={{
                                path: { stroke: '#ffffff' },
                                text: { fill: '#ffffff', fontSize: '24px' }
                              }}
                            />
                          </div>
                          <span>{imageUploadProgress}%</span>
                        </div>
                      ) : (
                        'Upload Image'
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {imageUploadError && (
                <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-4'>
                  <p className='text-red-400 text-center'>{imageUploadError}</p>
                </div>
              )}

              {formData.image && (
                <div className='relative'>
                  <img
                    src={formData.image}
                    alt='Featured'
                    className='w-full h-64 object-cover rounded-xl'
                  />
                </div>
              )}
            </div>

            {/* Content Editor Section */}
            <div className='space-y-4'>
              <label className='block text-sm font-medium text-gray-300'>
                Article Content <span className='text-red-400'>*</span>
              </label>
              
              <div className='bg-slate-700 rounded-xl overflow-hidden border border-slate-600'>
                <NotionEditor
                  content={formData.content || ''}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Update your article content... Type '/' for commands"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 pt-6'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
              >
                Cancel
              </button>
              
              <button
                type='submit'
                className='flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
              >
                Update Article
              </button>
            </div>

            {/* Error Messages */}
            {publishError && (
              <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-4'>
                <p className='text-red-400 text-center'>{publishError}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}