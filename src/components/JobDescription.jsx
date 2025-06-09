import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Chatbot from './Chatbot';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
    const [showReferralModal, setShowReferralModal] = useState(false); // <-- required for modal

    const [referralDetails, setReferralDetails] = useState({
        name: '',
        email: '',
        phone: ''
    });



    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        try {
            const res = await axios.post(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                {
                    referral: referralDetails  // include referral details
                }, // Send referral data
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...singleJob.applications, { applicant: user?._id }]
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
                setShowReferralModal(false); // Close modal
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to apply.');
        }
    };

    const withdrawApplicationHandler = async () => {
        try {
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/withdraw/${jobId}`, {
                withCredentials: true,
            });

            if (res.data.success) {
                // Update UI to reflect withdrawal
                setIsApplied(false);
                const updatedApplications = singleJob.applications.filter(
                    (app) => app.applicant !== user._id
                );
                const updatedJob = { ...singleJob, applications: updatedApplications };
                dispatch(setSingleJob(updatedJob));
                toast.success(res.data.message || 'Application withdrawn successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to withdraw application');
        }
    };



    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id)) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div>
            <Navbar />

            <div className='max-w-7xl mx-auto my-10'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                        <div className='flex items-center gap-2 mt-4'>
                            <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.postion} Positions</Badge>
                            <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                            <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary}LPA</Badge>
                        </div>
                    </div>
                    {isApplied ? (
                        <Button
                            onClick={() => setShowWithdrawConfirm(true)}
                            className="bg-red-600 hover:bg-red-700 rounded-lg"
                        >
                            Withdraw Application
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setShowReferralModal(true)}
                            className="bg-[#7209b7] hover:bg-[#5f32ad] rounded-lg"
                        >
                            Apply Now
                        </Button>
                    )}



                </div>
                <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
                <div className='my-4'>
                    <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                    <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                    <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                    <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                    <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary}LPA</span></h1>
                    <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                    <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt.split("T")[0]}</span></h1>
                </div>
            </div>

            {showReferralModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Referral Details (Optional)</h2>
                        <input
                            type="text"
                            value={referralDetails.name}
                            onChange={(e) => setReferralDetails({ ...referralDetails, name: e.target.value })}
                            placeholder="Referral Name"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                        />
                        <input
                            type="email"
                            value={referralDetails.email}
                            onChange={(e) => setReferralDetails({ ...referralDetails, email: e.target.value })}
                            placeholder="Referral Email"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                        />
                        <input
                            type="tel"
                            value={referralDetails.phone}
                            onChange={(e) => setReferralDetails({ ...referralDetails, phone: e.target.value })}
                            placeholder="Referral Phone"
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                        />
                        <div className="flex justify-end space-x-3">
                            <Button
                                className="bg-gray-400 hover:bg-gray-500"
                                onClick={() => setShowReferralModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-[#7209b7] hover:bg-[#5f32ad]"
                                onClick={applyJobHandler}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {showWithdrawConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Withdraw Application</h2>
                        <p className="text-gray-700 mb-6">Are you sure you want to withdraw your application?</p>
                        <div className="flex justify-end space-x-3">
                            <Button
                                className="bg-gray-400 hover:bg-gray-500"
                                onClick={() => setShowWithdrawConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => {
                                    withdrawApplicationHandler();
                                    setShowWithdrawConfirm(false);
                                }}
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            )}



            <Chatbot />

        </div>
    )
}

export default JobDescription

