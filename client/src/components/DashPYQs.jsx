import { Modal, Table, Button, Badge, Alert, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiDownload, HiEye, HiTrash, HiPencil, HiCheck, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function DashPYQs() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPyqs, setUserPyqs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [pyqIdToDelete, setPyqIdToDelete] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchPyqs = async () => {
      try {
        setLoading(true);
        // Fetch all PYQ papers for admin, not just user's own
        const res = await fetch('/api/pyq/getpyqs');
        const data = await res.json();
        if (res.ok) {
          setUserPyqs(data.pyqs);
          if (data.pyqs.length < 9) {
            setShowMore(false);
          }
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError('Failed to fetch PYQ papers');
      } finally {
        setLoading(false);
      }
    };
    if (currentUser?.isAdmin) {
      fetchPyqs();
    }
  }, [currentUser]);
  const handleShowMore = async () => {
    const startIndex = userPyqs.length;
    try {
      const res = await fetch(
        `/api/pyq/getpyqs?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPyqs((prev) => [...prev, ...data.pyqs]);
        if (data.pyqs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeletePyq = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/pyq/delete/${pyqIdToDelete}`,
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setUserPyqs((prev) =>
          prev.filter((pyq) => pyq._id !== pyqIdToDelete)
        );
      }    } catch (error) {      setError('Failed to delete PYQ paper');
    }
  };

  const getStatusBadge = (isApproved) => {
    return (
      <Badge color={isApproved ? 'success' : 'warning'}>
        {isApproved ? (
          <>
            <HiCheck className='w-3 h-3 mr-1' />
            Approved
          </>
        ) : (
          <>
            <HiX className='w-3 h-3 mr-1' />
            Pending
          </>
        )}
      </Badge>
    );
  };

  const handleApprovePyq = async (pyqId) => {
    try {
      const res = await fetch(`/api/pyq/approve/${pyqId}`, {
        method: 'PUT',
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message);
      } else {
        setUserPyqs((prev) =>
          prev.map((pyq) =>
            pyq._id === pyqId ? { ...pyq, isApproved: true, approvedBy: currentUser._id, approvedAt: new Date() } : pyq
          )
        );
      }
    } catch (error) {
      setError('Failed to approve PYQ paper');
    }
  };

  const handleDownload = async (pyqId, fileUrl, viewUrl) => {
    try {
      await fetch(`/api/pyq/download/${pyqId}`, {
        method: 'PUT',
      });
      // For Google Drive links, use viewUrl if available
      if (viewUrl) {
        window.open(viewUrl, '_blank');
      } else {
        window.open(fileUrl, '_blank');
      }
    } catch (error) {
      console.log('Download failed:', error);
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
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-semibold'>All PYQ Papers</h1>
        <Link to='/create-pyq'>
          <Button gradientDuoTone='purpleToPink'>
            Upload New PYQ
          </Button>
        </Link>
      </div>

      {error && <Alert color='failure' className='mb-4'>{error}</Alert>}

      {currentUser && userPyqs.length > 0 ? (
        <>          <Table hoverable className='shadow-md'>            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Title</Table.HeadCell>
              <Table.HeadCell>Subject</Table.HeadCell>
              <Table.HeadCell>Course/Sem</Table.HeadCell>
              <Table.HeadCell>Year</Table.HeadCell>
              <Table.HeadCell>Uploader</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Downloads</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            {userPyqs.map((pyq) => (
              <Table.Body className='divide-y' key={pyq._id}>
                <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>
                    {new Date(pyq.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className='max-w-xs'>
                      <p className='font-medium text-gray-900 dark:text-white truncate'>
                        {pyq.title}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {pyq.examType}
                      </p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>{pyq.subject}</Table.Cell>                  <Table.Cell>
                    {pyq.course} / Sem {pyq.semester}
                  </Table.Cell>
                  <Table.Cell>{pyq.year}</Table.Cell>                  <Table.Cell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {pyq.userId.substring(0, 8)}...
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {getStatusBadge(pyq.isApproved)}
                  </Table.Cell>
                  <Table.Cell>{pyq.downloadCount}</Table.Cell><Table.Cell>                    <div className='flex gap-2'>                      <Button
                        size='xs'
                        color='blue'
                        onClick={() => handleDownload(pyq._id, pyq.fileUrl, pyq.viewUrl)}
                      >
                        <HiDownload className='w-3 h-3' />
                      </Button>
                      {!pyq.isApproved && (
                        <Button
                          size='xs'
                          color='green'
                          onClick={() => handleApprovePyq(pyq._id)}
                        >
                          <HiCheck className='w-3 h-3' />
                        </Button>
                      )}
                      <Link to={`/update-pyq/${pyq._id}`}>
                        <Button size='xs' color='gray'>
                          <HiPencil className='w-3 h-3' />
                        </Button>
                      </Link>
                      <Button
                        size='xs'
                        color='red'
                        onClick={() => {
                          setShowModal(true);
                          setPyqIdToDelete(pyq._id);
                        }}
                      >
                        <HiTrash className='w-3 h-3' />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <Button
              onClick={handleShowMore}
              className='w-full text-teal-500 self-center text-sm py-7 mt-4'
              color='gray'
            >
              Show more
            </Button>
          )}
        </>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg mb-4'>You haven't uploaded any PYQ papers yet.</p>
          <Link to='/create-pyq'>
            <Button gradientDuoTone='purpleToPink'>
              Upload your first PYQ paper
            </Button>
          </Link>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this PYQ paper?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePyq}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
