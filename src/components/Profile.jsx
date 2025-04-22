import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText, Briefcase, Trophy, Code, Users, Plus } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import Chatbot from './Chatbot';
import UpdateProfileData from './UpdateProfileData';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [openWorkExperienceDialog, setOpenWorkExperienceDialog] = useState(false);

    const { user } = useSelector(store => store.auth);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-4xl mx-auto mt-8 p-6">
                {/* Profile Card */}
                <div className="bg-white shadow-md border border-gray-200 rounded-2xl p-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-28 w-28 border border-gray-300 shadow-sm">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                                    alt="profile"
                                />
                            </Avatar>
                            <div>
                                <h1 className="text-2xl font-semibold">{user?.fullname}</h1>
                                <p className="text-gray-600">{user?.profile?.bio || "No bio available"}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="border border-gray-300 hover:bg-gray-100" variant="outline">
                            <Pen className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className='mt-4'>
                        <button
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 ml-2"
                            onClick={() => window.open(user?.profile?.linkedin, "_blank")}
                            disabled={!user?.profile?.linkedin}
                        >
                            LinkedIn
                        </button>

                        <button
                            className='px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2'
                            onClick={() => window.open(user?.profile?.portfolio, "_blank")}
                            disabled={!user?.profile?.portfolio}
                        >
                            Portfolio
                        </button>

                        <button
                            className='px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 ml-2'
                            onClick={() => window.open(user?.profile?.leetcode, "_blank")}
                            disabled={!user?.profile?.leetcode}
                        >
                            LeetCode
                        </button>
                    </div>

                    <div className='my-5'>
                        {/* Skills Section */}
                        <div className="mt-6">
                            <h2 className="text-lg font-semibold mb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {user?.profile?.skills?.length > 0
                                    ? user?.profile?.skills.flatMap(skill => skill.split(" ")).map((skill, index) =>
                                        <Badge key={index} className="px-3 py-1">{skill}</Badge>
                                    )
                                    : <span className="text-gray-500">No skills added</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label className="text-md font-bold">Resume</Label>
                        {
                            isResume ? <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                        }
                    </div>
                </div>

                {/* Work Experience */}
                <div className="bg-white shadow-md border border-gray-200 rounded-2xl mt-8 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="text-gray-600" />
                            <h1 className="text-lg font-semibold">Work Experience</h1>
                        </div>
                        <Button
                            onClick={() => setOpenWorkExperienceDialog(true)}
                            variant="outline"
                            className="border border-gray-300 hover:bg-gray-100"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>

                    {user?.profile?.workExperience?.length > 0 ? (
                        user.profile.workExperience.map((exp, index) => (
                            <div key={index} className='bg-gray-100 rounded-2xl p-4 mb-4'>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className='text-lg font-semibold'>{exp.title}</h2>
                                        <p className="text-gray-600">{exp.company}</p>
                                        {exp.link && (
                                            <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                {exp.link}
                                            </a>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(exp.startDate).toLocaleDateString()} - {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                                    </div>

                                </div>
                                <p className="mt-2 text-gray-700">{exp.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No Work Experience Added</p>
                    )}
                </div>

                {/* Projects Section */}
                <div className="bg-white shadow-md border border-gray-200 rounded-2xl mt-8 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Code className="text-gray-600" />
                            <h1 className="text-lg font-semibold">Projects</h1>
                        </div>
                        <Button
                            onClick={() => setOpenProjectsDialog(true)}
                            variant="outline"
                            className="border border-gray-300 hover:bg-gray-100"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                    {user?.profile?.projects?.length > 0 ? (
                        user.profile.projects.map((project, index) => (
                            <div key={index} className='bg-gray-100 rounded-2xl p-4 mb-4'>
                                <h2 className='text-lg font-semibold'>{project.title}</h2>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {project.link}
                                    </a>
                                )}
                                <p className="mt-2 text-gray-700">{project.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No Projects Added</p>
                    )}
                </div>

                {/* Achievements Section */}
                <div className="bg-white shadow-md border border-gray-200 rounded-2xl mt-8 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-yellow-500" />
                            <h1 className="text-lg font-semibold">Achievements</h1>
                        </div>
                        <Button
                            onClick={() => setOpenAchievementsDialog(true)}
                            variant="outline"
                            className="border border-gray-300 hover:bg-gray-100"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                    </div>
                    {user?.profile?.achievements?.length > 0 ? (
                        user.profile.achievements.map((achievement, index) => (
                            <div key={index} className='bg-gray-100 rounded-2xl p-4 mb-4'>
                                <h2 className='text-lg font-semibold'>{achievement.title}</h2>
                                <p className="mt-2 text-gray-700">{achievement.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No Achievements Added</p>
                    )}
                </div>
                {/* Applied Jobs Section */}
                <div className="bg-white shadow-md border border-gray-200 rounded-2xl mt-8 p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="text-gray-600" />
                        <h1 className="text-lg font-semibold">Applied Jobs</h1>
                    </div>
                    <AppliedJobTable />
                </div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
            <UpdateProfileData open={openWorkExperienceDialog} setOpen={setOpenWorkExperienceDialog} />

            <Chatbot />
        </div>
    );
};

export default Profile;
