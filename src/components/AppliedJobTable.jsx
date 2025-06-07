import React, { useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setAllAppliedJobs } from '@/redux/applicationSlice';

const AppliedJobTable = () => {
  const dispatch = useDispatch();
  const { allAppliedJobs } = useSelector(store => store.application);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/application/get', {
          withCredentials: true
        });

        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.appliedJobs));
        }
      } catch (error) {
        console.error("Error fetching applied jobs", error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch]); // ✅ Added dispatch as dependency

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            !Array.isArray(allAppliedJobs) || allAppliedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan="4" className="text-center text-gray-500">
                  You haven't applied for any job yet.
                </TableCell>
              </TableRow>
            ) : (
              allAppliedJobs.map((appliedJob) => (
                <TableRow key={appliedJob._id}>
                  <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                  <TableCell>{appliedJob.job?.title}</TableCell>
                  <TableCell>{appliedJob.job?.company?.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                      {appliedJob.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )
          }
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;
