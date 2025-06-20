import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useState, useRef, useEffect } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Add CSS styles at the top of the file
const pdfControlStyles = `
  .pdf-controls {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    justify-content: center;
  }
  .pdf-button {
    padding: 8px 16px;
    background-color: #4F46E5;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;
  }
  .pdf-button:hover {
    background-color: #4338CA;
  }
`;

// Custom styles for dark theme ReactQuill
const darkQuillStyles = `
  .ql-editor {
    color: #ffffff !important;
    background-color: #475569 !important;
  }
  .ql-editor.ql-blank::before {
    color: #9ca3af !important;
  }
  .ql-toolbar {
    border-top: 1px solid #64748b !important;
    border-left: 1px solid #64748b !important;
    border-right: 1px solid #64748b !important;
    background-color: #64748b !important;
  }
  .ql-container {
    border-bottom: 1px solid #64748b !important;
    border-left: 1px solid #64748b !important;
    border-right: 1px solid #64748b !important;
    background-color: #475569 !important;
  }
  .ql-toolbar .ql-stroke {
    fill: none;
    stroke: #ffffff !important;
  }
  .ql-toolbar .ql-fill {
    fill: #ffffff !important;
    stroke: none;
  }
  .ql-toolbar .ql-picker-label {
    color: #ffffff !important;
  }
  .ql-toolbar .ql-picker-options {
    background-color: #64748b !important;
    border: 1px solid #475569 !important;
  }
  .ql-toolbar .ql-picker-item {
    color: #ffffff !important;
  }
  .ql-toolbar .ql-picker-item:hover {
    background-color: #475569 !important;
  }
  .ql-toolbar button:hover {
    background-color: #475569 !important;
  }
  .ql-toolbar button.ql-active {
    background-color: #8b5cf6 !important;
  }
  .ql-snow .ql-tooltip {
    background-color: #374151 !important;
    border: 1px solid #64748b !important;
    color: #ffffff !important;
  }
  .ql-snow .ql-tooltip input[type=text] {
    background-color: #475569 !important;
    border: 1px solid #64748b !important;
    color: #ffffff !important;
  }
`;

// Add custom CSS for the PDF button
const additionalStyles = `
  ${pdfControlStyles}
  ${darkQuillStyles}
  .ql-pdf {
    width: 28px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ql-pdf svg {
    width: 18px;
    height: 18px;
  }
`;

// Add style tag to document
const styleTag = document.createElement('style');
styleTag.textContent = additionalStyles;
document.head.appendChild(styleTag);

// Add this helper function before the modules definition
const formatPdfUrl = (url) => {
  // Handle Google Drive URLs
  if (url.includes('drive.google.com')) {
    const fileId = url.match(/[-\w]{25,}/);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId[0]}/preview`;
    }
  }
  // Handle direct PDF URLs
  if (url.endsWith('.pdf')) {
    return url;
  }
  return null;
};

// Add custom icons for Quill
const icons = Quill.import('ui/icons');
icons['pdf'] = `<svg viewBox="0 0 24 24" width="24" height="24">
  <path fill="currentColor" d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
</svg>`;

// Add Quill toolbar configuration
const modules = {
  toolbar: {
    container: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['pdf'], // Separate PDF button for better visibility
      [{ 'align': [] }], // Add alignment options
      [{ 'color': [] }, { 'background': [] }], // Add color and background options
      ['code-block'], // Add code block option
      ['clean'], // Add clean option
      ['emoji'], // Add emoji option
      ['table'], // Add table option
      ['formula'] // Add formula option
    ],
    handlers: {
      pdf: function() {
        const value = prompt('Enter PDF URL (Direct link or Google Drive share link)');
        if (value) {
          const formattedUrl = formatPdfUrl(value);
          if (formattedUrl) {
            this.quill.insertEmbed(this.quill.getSelection().index, 'pdf', formattedUrl, 'user');
          } else {
            alert('Please provide a valid PDF URL or Google Drive share link');
          }
        }
      },
      // Add custom handler for emoji
      emoji: function() {
        // Custom handler logic for emoji
      },
      // Add custom handler for table
      table: function() {
        // Custom handler logic for table
      },
      // Add custom handler for formula
      formula: function() {
        // Custom handler logic for formula
      }
    }
  }
};

const formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video', 'pdf', // Add 'pdf' here
  'align', 'color', 'background', 'formula' // Add new formats here
];

// Register custom PDF embed module
const Embed = Quill.import('blots/block/embed');

class PdfBlot extends Embed {
  static create(value) {
    const container = document.createElement('div');
    const iframe = document.createElement('iframe');
    const controls = document.createElement('div');
    
    // Configure iframe
    iframe.setAttribute('src', value);
    iframe.setAttribute('type', 'application/pdf');
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '500px');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-forms');
    
    // Configure controls
    controls.className = 'pdf-controls';
    
    // Download button
    const downloadBtn = document.createElement('a');
    downloadBtn.innerHTML = '⬇️ Download';
    downloadBtn.className = 'pdf-button';
    downloadBtn.href = value.replace('/preview', '/view');
    downloadBtn.setAttribute('download', '');
    downloadBtn.setAttribute('target', '_blank');
    
    // Full page view button
    const fullViewBtn = document.createElement('a');
    fullViewBtn.innerHTML = '🔍 Full View';
    fullViewBtn.className = 'pdf-button';
    fullViewBtn.href = value;
    fullViewBtn.setAttribute('target', '_blank');
    
    // Append elements
    controls.appendChild(downloadBtn);
    controls.appendChild(fullViewBtn);
    container.appendChild(iframe);
    container.appendChild(controls);
    
    return container;
  }

  static value(node) {
    return node.querySelector('iframe').getAttribute('src');
  }
}

PdfBlot.blotName = 'pdf';
PdfBlot.tagName = 'iframe';
Quill.register(PdfBlot);

export default function CreatePost() {
  const { currentUser } = useSelector(state => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'uncategorized',
    content: '',
    image: ''
  });
  const [publishError, setPublishError] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [seoScore, setSeoScore] = useState(0);
  const [showWritingAssistant, setShowWritingAssistant] = useState(false);
  const [writingTips, setWritingTips] = useState([]);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);

  const navigate = useNavigate();
  // Calculate word count, reading time, and other metrics
  useEffect(() => {
    if (formData.content) {
      const text = formData.content.replace(/<[^>]*>/g, '');
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const count = words.length;
      const chars = text.length;
      const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0).length;
      
      setWordCount(count);
      setCharacterCount(chars);
      setParagraphCount(paragraphs);
      setReadingTime(Math.ceil(count / 200)); // Average reading speed: 200 words per minute
      
      // Calculate SEO score
      calculateSEOScore(formData.title, text, count);
      
      // Generate writing tips
      generateWritingTips(formData.title, text, count);
    } else {
      setWordCount(0);
      setCharacterCount(0);
      setParagraphCount(0);
      setReadingTime(0);
      setSeoScore(0);
      setWritingTips([]);
    }
  }, [formData.content, formData.title]);

  // Calculate SEO score based on various factors
  const calculateSEOScore = (title, content, wordCount) => {
    let score = 0;
    
    // Title length (ideal: 30-60 characters)
    if (title && title.length >= 30 && title.length <= 60) score += 20;
    else if (title && title.length > 0) score += 10;
    
    // Content length (ideal: 300+ words)
    if (wordCount >= 1000) score += 30;
    else if (wordCount >= 500) score += 20;
    else if (wordCount >= 300) score += 15;
    else if (wordCount >= 150) score += 10;
    
    // Readability check
    if (content) {
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const avgWordsPerSentence = wordCount / sentences.length;
      if (avgWordsPerSentence <= 20) score += 15; // Good readability
      else if (avgWordsPerSentence <= 25) score += 10;
    }
    
    // Structure check (headers, lists)
    if (content.includes('<h1>') || content.includes('<h2>') || content.includes('<h3>')) score += 10;
    if (content.includes('<ul>') || content.includes('<ol>')) score += 10;
    
    // Image inclusion
    if (formData.image) score += 15;
    
    setSeoScore(Math.min(score, 100));
  };

  // Generate dynamic writing tips
  const generateWritingTips = (title, content, wordCount) => {
    const tips = [];
    
    if (!title || title.length < 30) {
      tips.push({ type: 'warning', text: 'Consider a longer, more descriptive title (30-60 characters)' });
    }
    
    if (wordCount < 300) {
      tips.push({ type: 'info', text: 'Articles with 300+ words tend to perform better in search' });
    }
    
    if (!content.includes('<h')) {
      tips.push({ type: 'tip', text: 'Add headers (H1, H2, H3) to improve readability and SEO' });
    }
    
    if (!formData.image) {
      tips.push({ type: 'tip', text: 'Adding a featured image can increase engagement' });
    }
    
    if (wordCount > 100 && !content.includes('<ul>') && !content.includes('<ol>')) {
      tips.push({ type: 'tip', text: 'Consider using bullet points or numbered lists for better readability' });
    }
    
    setWritingTips(tips.slice(0, 3)); // Show max 3 tips
  };

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.content) {
        localStorage.setItem('createPost_draft', JSON.stringify(formData));
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [formData]);

  // Load draft on component mount
  useEffect(() => {
    const draft = localStorage.getItem('createPost_draft');
    if (draft) {
      setFormData(JSON.parse(draft));
    }
  }, []);

  const clearDraft = () => {
    localStorage.removeItem('createPost_draft');
    setFormData({
      title: '',
      category: 'uncategorized',
      content: '',
      image: ''
    });
  };
  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please select an image');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageUploadError('Image must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageUploadError('Please select a valid image file (JPEG, PNG, WebP)');
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
          setImageUploadError('Image upload failed: ' + error.message);
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
      setImageUploadError('Image upload failed: ' + error.message);
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title?.trim()) {
      setPublishError('Title is required');
      return;
    }
    
    if (!formData.content?.trim() || formData.content === '<p><br></p>') {
      setPublishError('Content is required');
      return;
    }

    if (formData.title.length > 100) {
      setPublishError('Title must be less than 100 characters');
      return;
    }

    try {
      setIsPublishing(true);
      setPublishError(null);
      
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          wordCount,
          readingTime
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setPublishError(data.message || 'Failed to publish post');
        return;
      }

      if (res.ok) {
        setPublishError(null);
        clearDraft(); // Clear saved draft
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Network error: ' + error.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const saveDraft = () => {
    localStorage.setItem('createPost_draft', JSON.stringify(formData));
    // Show temporary success message
    const originalError = publishError;
    setPublishError('Draft saved successfully!');
    setTimeout(() => setPublishError(originalError), 2000);
  };  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header Section */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Create{' '}
            <span className='bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent'>
              Article
            </span>
          </h1>
          <p className='text-gray-300 text-lg'>Share your knowledge with the community</p>
        </div>        {/* Enhanced Stats Bar */}
        <div className='mb-8 grid grid-cols-2 md:grid-cols-6 gap-4'>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600 text-center'>
            <div className='text-2xl font-bold text-purple-400'>{wordCount}</div>
            <div className='text-sm text-gray-300'>Words</div>
          </div>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600 text-center'>
            <div className='text-2xl font-bold text-blue-400'>{readingTime}</div>
            <div className='text-sm text-gray-300'>Min Read</div>
          </div>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600 text-center'>
            <div className='text-2xl font-bold text-green-400'>{characterCount}</div>
            <div className='text-sm text-gray-300'>Characters</div>
          </div>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600 text-center'>
            <div className='text-2xl font-bold text-yellow-400'>{paragraphCount}</div>
            <div className='text-sm text-gray-300'>Paragraphs</div>
          </div>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600 text-center'>
            <div className={`text-2xl font-bold ${seoScore >= 80 ? 'text-green-400' : seoScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
              {seoScore}%
            </div>
            <div className='text-sm text-gray-300'>SEO Score</div>
          </div>
          <div className='bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-4 border border-slate-600 text-center'>
            <div className='text-2xl font-bold text-pink-400'>{formData.category !== 'uncategorized' ? '✓' : '○'}</div>
            <div className='text-sm text-gray-300'>Category</div>
          </div>
        </div>

        {/* Writing Assistant */}
        {writingTips.length > 0 && (
          <div className='mb-8 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-white font-semibold flex items-center'>
                <svg className="w-5 h-5 mr-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Writing Assistant
              </h3>
              <button
                type='button'
                onClick={() => setShowWritingAssistant(!showWritingAssistant)}
                className='text-amber-400 hover:text-amber-300 transition-colors'
              >
                {showWritingAssistant ? 'Hide' : 'Show'}
              </button>
            </div>
            {showWritingAssistant && (
              <div className='space-y-3'>
                {writingTips.map((tip, index) => (
                  <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    tip.type === 'warning' ? 'bg-red-500/10 border border-red-500/20' :
                    tip.type === 'info' ? 'bg-blue-500/10 border border-blue-500/20' :
                    'bg-green-500/10 border border-green-500/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      tip.type === 'warning' ? 'bg-red-400' :
                      tip.type === 'info' ? 'bg-blue-400' :
                      'bg-green-400'
                    }`}></div>
                    <p className='text-gray-300 text-sm'>{tip.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className='w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-black font-medium placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300'
                  maxLength={100}
                />
                <div className='mt-2 text-xs text-gray-400'>
                  {formData.title?.length || 0}/100 characters
                </div>
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-3'>
                  Branch/Category <span className='text-red-400'>*</span>
                </label>
                <select
                  value={formData.category}
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
                <span className='text-xs text-gray-400 ml-2'>(Optional - Max 5MB)</span>
              </label>
              
              <div className='border-2 border-dashed border-purple-500/30 rounded-xl p-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 hover:border-purple-500/50 transition-all duration-300'>
                <div className='flex flex-col items-center space-y-4'>
                  {!formData.image ? (
                    <>
                      <div className='w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className='text-center'>
                        <p className='text-gray-300 font-medium mb-2'>Upload a featured image</p>
                        <p className='text-gray-400 text-sm'>PNG, JPG, WebP up to 5MB</p>
                      </div>
                      <div className='flex gap-4'>
                        <input
                          ref={fileInputRef}
                          type='file'
                          accept='image/*'
                          onChange={(e) => setFile(e.target.files[0])}
                          className='hidden'
                        />
                        <button
                          type='button'
                          onClick={() => fileInputRef.current?.click()}
                          className='bg-slate-600 hover:bg-slate-500 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300'
                        >
                          Choose File
                        </button>
                        {file && (
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
                              'Upload'
                            )}
                          </button>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className='relative w-full'>
                      <img
                        src={formData.image}
                        alt='Featured'
                        className='w-full h-64 object-cover rounded-xl'
                      />
                      <button
                        type='button'
                        onClick={removeImage}
                        className='absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-300'
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {imageUploadError && (
                <div className='bg-red-500/10 border border-red-500/20 rounded-xl p-4'>
                  <p className='text-red-400 text-center'>{imageUploadError}</p>
                </div>
              )}
            </div>

            {/* Content Editor Section */}
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='block text-sm font-medium text-gray-300'>
                  Article Content <span className='text-red-400'>*</span>
                </label>
                <div className='flex space-x-2'>
                  <button
                    type='button'
                    onClick={() => setPreviewMode(!previewMode)}
                    className='bg-slate-600 hover:bg-slate-500 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-300'
                  >
                    {previewMode ? 'Edit' : 'Preview'}
                  </button>
                </div>
              </div>
              
              {!previewMode ? (
                <div className='bg-slate-700 rounded-xl overflow-hidden border border-slate-600'>
                  <ReactQuill
                    ref={quillRef}
                    theme='snow'
                    placeholder='Start writing your article...'
                    className='h-96 text-white'
                    required
                    modules={modules}
                    formats={formats}
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    style={{
                      backgroundColor: '#334155',
                      color: 'white'
                    }}
                  />
                </div>
              ) : (
                <div className='bg-slate-700 rounded-xl p-6 border border-slate-600 min-h-96 max-h-96 overflow-y-auto'>
                  <div 
                    className='prose prose-invert max-w-none'
                    dangerouslySetInnerHTML={{ __html: formData.content || '<p class="text-gray-400">No content to preview</p>' }}
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col sm:flex-row gap-4 pt-6'>
              <button
                type='button'
                onClick={saveDraft}
                className='flex-1 bg-slate-600 hover:bg-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
              >
                Save Draft
              </button>
              
              <button
                type='button'
                onClick={clearDraft}
                className='flex-1 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
              >
                Clear All
              </button>
              
              <button
                type='submit'
                disabled={isPublishing || !formData.title?.trim() || !formData.content?.trim()}
                className='flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105'
              >
                {isPublishing ? (
                  <div className='flex items-center justify-center space-x-2'>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing...</span>
                  </div>
                ) : (
                  'Publish Article'
                )}
              </button>
            </div>

            {/* Error/Success Messages */}
            {publishError && (
              <div className={`rounded-xl p-4 ${
                publishError.includes('Draft saved') 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <p className={`text-center ${
                  publishError.includes('Draft saved') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {publishError}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Tips Section */}
        <div className='mt-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6'>
          <h3 className='text-white font-semibold mb-3 flex items-center'>
            <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Writing Tips
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300'>
            <div>• Use clear, descriptive headlines</div>
            <div>• Include relevant images to enhance content</div>
            <div>• Break up text with headers and bullet points</div>
            <div>• Write for your target audience</div>
            <div>• Proofread before publishing</div>
            <div>• Add value with actionable insights</div>
          </div>
        </div>
      </div>
    </div>
  );
}