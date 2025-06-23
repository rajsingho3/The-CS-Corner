import { useEffect, useState } from 'react';
import { Button, Select, Card, Badge, Spinner, Alert } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiDownload, HiCalendar, HiAcademicCap } from 'react-icons/hi';

export default function PYQBrowser() {
  const { currentUser } = useSelector((state) => state.user);
  const [pyqs, setPyqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('BCA');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [stats, setStats] = useState({});
  useEffect(() => {
    fetchPYQs();
    fetchStats();
  }, [selectedCourse, selectedSemester, selectedYear]);  const fetchPYQs = async () => {
    try {
      setLoading(true);
      let url = '/api/pyq/getpyqs';
      
      // List view with filters
      if (selectedCourse) url += `?course=${selectedCourse}`;
      if (selectedSemester) url += `${url.includes('?') ? '&' : '?'}semester=${selectedSemester}`;
      if (selectedYear) url += `${url.includes('?') ? '&' : '?'}year=${selectedYear}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setPyqs(data.pyqs);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to fetch PYQ papers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/pyq/stats');
      const data = await res.json();
      if (res.ok) {
        setStats(data);
      }
    } catch (error) {
      console.log('Failed to fetch stats:', error);
    }
  };
  const handleDownload = async (pyqId, fileUrl, fileName, viewUrl) => {
    try {
      // Increment download count
      await fetch(`/api/pyq/download/${pyqId}`, {
        method: 'PUT',
      });
      
      // For Google Drive links, open the view URL instead of direct download
      if (viewUrl) {
        window.open(viewUrl, '_blank');
      } else {
        // Open file in new tab
        window.open(fileUrl, '_blank');
      }
    } catch (error) {
      console.log('Download failed:', error);
    }
  };
  const getExamTypeColor = (examType) => {
    switch (examType) {
      case 'End-Semester': return 'purple';
      case 'Mid-Semester': return 'blue';
      case 'Internal': return 'green';
      case 'External': return 'red';
      case 'Quiz': return 'yellow';
      case 'Assignment': return 'indigo';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl' />
      </div>
    );
  }

  return (
    <div className='min-h-screen max-w-6xl mx-auto p-3'>      <div className='flex flex-col md:flex-row justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-700 dark:text-white mb-4 md:mb-0'>
          PYQ Papers Library
        </h1>
      </div>

          {/* Filters */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
        <Select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value='BCA'>BCA</option>
          <option value='MCA'>MCA</option>
          <option value='BTech'>BTech</option>
          <option value='MTech'>MTech</option>
          <option value='BSc'>BSc</option>
          <option value='MSc'>MSc</option>
          <option value='Other'>Other</option>
        </Select>

        <Select
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
        >
          <option value=''>All Semesters</option>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </Select>

        <Select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value=''>All Years</option>
          {Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => 
            new Date().getFullYear() - i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>

        {currentUser?.isAdmin && (
          <Link to='/create-pyq'>
            <Button gradientDuoTone='purpleToPink' className='w-full'>
              Upload PYQ
            </Button>
          </Link>
        )}
      </div>      {error && <Alert color='failure'>{error}</Alert>}

      {/* PYQ Papers Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {pyqs.map((paper) => (
            <Card key={paper._id} className='hover:shadow-lg transition-shadow'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white line-clamp-2'>
                  {paper.title}
                </h3>
              </div>
              
              <div className='space-y-2 mb-4'>
                <div className='flex items-center gap-2'>
                  <HiAcademicCap className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {paper.subject} | Sem {paper.semester}
                  </span>
                </div>
                
                <div className='flex items-center gap-2'>
                  <HiCalendar className='w-4 h-4 text-gray-500' />
                  <span className='text-sm text-gray-600 dark:text-gray-400'>
                    {paper.university} | {paper.year}
                  </span>
                </div>
                
                <div className='flex gap-2'>
                  <Badge color={getExamTypeColor(paper.examType)}>
                    {paper.examType}
                  </Badge>
                  <Badge color='gray'>{paper.fileType.toUpperCase()}</Badge>
                </div>
              </div>
                <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-500'>
                  {paper.downloadCount} downloads
                </span>
                
                <div className='flex gap-2'>
                  <Button
                    size='sm'
                    color='blue'
                    onClick={() => handleDownload(paper._id, paper.fileUrl, paper.fileName, paper.viewUrl)}
                  >
                    <HiDownload className='w-4 h-4 mr-1' />
                    Download
                  </Button>
                </div>
              </div>            </Card>
          ))}
        </div>
      
      {pyqs.length === 0 && !loading && (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>No PYQ papers found for the selected filters.</p>
          {currentUser?.isAdmin && (
            <Link to='/create-pyq'>
              <Button gradientDuoTone='purpleToPink' className='mt-4'>
                Upload the first PYQ paper
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
