import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RadioGroup } from '../ui/radio-group';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';

const ForgotPass = () => {
    const [input, setInput] = useState({
        email: "",
        newPassword: "",
        confirmPassword: "",
        role: "" // Added role selection
    });

    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.email || !input.newPassword || !input.confirmPassword || !input.role) {
            toast.error("All fields are required!");
            return;
        }

        if (input.newPassword !== input.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/forgotpassword`, {
                email: input.email,
                newPassword: input.newPassword,
                role: input.role // Send role to the backend
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/login');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong!");
        }
    }

    return (
        <>
        <Navbar/>
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={submitHandler} className="w-1/3 border border-gray-200 rounded-md p-4">
                <h1 className="font-bold text-xl mb-5">Reset Password</h1>

                <div className="my-2">
                    <Label>Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="my-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        name="newPassword"
                        value={input.newPassword}
                        onChange={changeEventHandler}
                        placeholder="Enter new password"
                        required
                    />
                </div>

                <div className="my-2">
                    <Label>Confirm Password</Label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={input.confirmPassword}
                        onChange={changeEventHandler}
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                {/* Role Selection */}
                <div className="my-4">
                    <Label>Role</Label>
                    <RadioGroup className="flex items-center gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                id="student"
                                name="role"
                                value="student"
                                checked={input.role === 'student'}
                                onChange={changeEventHandler}
                                className="cursor-pointer"
                            />
                            <Label htmlFor="student">Student</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Input
                                type="radio"
                                id="recruiter"
                                name="role"
                                value="recruiter"
                                checked={input.role === 'recruiter'}
                                onChange={changeEventHandler}
                                className="cursor-pointer"
                            />
                            <Label htmlFor="recruiter">Recruiter</Label>
                        </div>
                    </RadioGroup>
                </div>

                <Button type="submit" className="w-full mt-4">Reset Password</Button>
            </form>
        </div>
        <Footer/>
        </>
    );
}

export default ForgotPass;
