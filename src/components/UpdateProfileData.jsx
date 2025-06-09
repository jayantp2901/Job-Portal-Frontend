import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const UpdateProfileData = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    // Create deep clones of the user data to avoid read-only issues
    const [input, setInput] = useState(() => {
        const createInitialState = (field, defaultItem) => {
            if (!user?.profile?.[field]?.length) return [defaultItem];
            return user.profile[field].map(item => ({ ...item }));
        };

        return {
            workExperience: createInitialState('workExperience', 
                { title: '', company: '', description: '', link: '', startDate: '', endDate: '' }),
            projects: createInitialState('projects', 
                { title: '', description: '', link: '' }),
            achievements: createInitialState('achievements', 
                { title: '', description: '' }),
        };
    });

    const handleEntryChange = (e, index, field) => {
        const { name, value } = e.target;
        setInput(prev => {
            const updated = [...prev[field]];
            updated[index] = { ...updated[index], [name]: value };
            return { ...prev, [field]: updated };
        });
    };

    const handleAddEntry = (field) => {
        const newEntry =
            field === 'workExperience'
                ? { title: '', company: '', description: '', link: '', startDate: '', endDate: '' }
                : field === 'projects'
                    ? { title: '', description: '', link: '' }
                    : { title: '', description: '' };

        setInput(prev => ({
            ...prev,
            [field]: [...prev[field], newEntry]
        }));
    };

    const handleRemoveEntry = (index, field) => {
        setInput(prev => {
            const updated = [...prev[field]];
            updated.splice(index, 1);
            return { 
                ...prev, 
                [field]: updated.length ? updated : [
                    field === 'projects' 
                        ? { title: '', description: '', link: '' } 
                        : { title: '', description: '' }
                ] 
            };
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/addData`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success('Profile updated successfully!');
                setOpen(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl" onInteractOutside={() => setOpen(false)}>
                <DialogHeader>
                    <DialogTitle>Update Detailed Profile Info</DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-6 max-h-[80vh] overflow-y-auto px-2">
                    {/* Work Experience */}
                    <div className="border p-4 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">Work Experience</h2>
                        {input.workExperience.map((exp, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <Input
                                    placeholder="Title"
                                    name="title"
                                    value={exp.title}
                                    onChange={(e) => handleEntryChange(e, index, 'workExperience')}
                                />
                                <Input
                                    placeholder="Company"
                                    name="company"
                                    value={exp.company}
                                    onChange={(e) => handleEntryChange(e, index, 'workExperience')}
                                />
                                <Input
                                    placeholder="Description"
                                    name="description"
                                    value={exp.description}
                                    onChange={(e) => handleEntryChange(e, index, 'workExperience')}
                                />
                                <Input
                                    placeholder="Link"
                                    name="link"
                                    value={exp.link}
                                    onChange={(e) => handleEntryChange(e, index, 'workExperience')}
                                />
                                <Input
                                    type="date"
                                    placeholder="Start Date"
                                    name="startDate"
                                    value={exp.startDate}
                                    onChange={(e) => handleEntryChange(e, index, 'workExperience')}
                                />
                                <Input
                                    type="date"
                                    placeholder="End Date"
                                    name="endDate"
                                    value={exp.endDate}
                                    onChange={(e) => handleEntryChange(e, index, 'workExperience')}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveEntry(index, 'workExperience')}
                                    className="col-span-full w-fit"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => handleAddEntry('workExperience')}>
                            Add Experience
                        </Button>
                    </div>

                    {/* Projects */}
                    <div className="border p-4 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">Projects</h2>
                        {input.projects.map((proj, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                <Input
                                    placeholder="Title"
                                    name="title"
                                    value={proj.title}
                                    onChange={(e) => handleEntryChange(e, index, 'projects')}
                                />
                                <Input
                                    placeholder="Project Link"
                                    name="link"
                                    value={proj.link}
                                    onChange={(e) => handleEntryChange(e, index, 'projects')}
                                />
                                <Input
                                    placeholder="Description"
                                    name="description"
                                    value={proj.description}
                                    onChange={(e) => handleEntryChange(e, index, 'projects')}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveEntry(index, 'projects')}
                                    className="col-span-full w-fit"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => handleAddEntry('projects')}>Add Project</Button>
                    </div>

                    {/* Achievements */}
                    <div className="border p-4 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold mb-2">Achievements</h2>
                        {input.achievements.map((ach, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <Input
                                    placeholder="Title"
                                    name="title"
                                    value={ach.title}
                                    onChange={(e) => handleEntryChange(e, index, 'achievements')}
                                />
                                <Input
                                    placeholder="Description"
                                    name="description"
                                    value={ach.description}
                                    onChange={(e) => handleEntryChange(e, index, 'achievements')}
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveEntry(index, 'achievements')}
                                    className="col-span-full w-fit"
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                        <Button type="button" onClick={() => handleAddEntry('achievements')}>Add Achievement</Button>
                    </div>

                    <DialogFooter>
                        {loading ? (
                            <Button className="w-full my-4" disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Update</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileData;