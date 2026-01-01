import React, { useEffect, useState } from 'react';
import { X, User, Mail, Lock, Briefcase, Phone, Calendar } from 'lucide-react';

const AddEmployeeModal = ({ onClose }) => {
  // 🔹 Dark mode state (persisted)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // 🔹 Form and other states
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    designation: '',
    job_title: '',
    department: '',
    phone: '',
    date_of_joining: '',
    role: 'Employee',
    employee_id: '',
    status: 'ACTIVE'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Apply dark class + persist
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  // 🔹 Early return if dark mode is OFF
  if (!darkMode) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add employee');

      alert("Employee added successfully");
      onClose?.(); // close modal after adding
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Add New Employee
          </h2>
          <button
            onClick={onClose || (() => setDarkMode(false))}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Input label="Full Name" icon={<User />} name="fullname" value={formData.fullname} onChange={handleChange} />
            <Input label="Email" icon={<Mail />} name="email" value={formData.email} onChange={handleChange} />
            <Input label="Password" icon={<Lock />} type="password" name="password" value={formData.password} onChange={handleChange} />
            <Input label="Designation" icon={<Briefcase />} name="designation" value={formData.designation} onChange={handleChange} />
            <Input label="Department" name="department" value={formData.department} onChange={handleChange} />
            <Input label="Employee ID" name="employee_id" value={formData.employee_id} onChange={handleChange} />
            <Input label="Phone" icon={<Phone />} name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Date of Joining" icon={<Calendar />} type="date" name="date_of_joining" value={formData.date_of_joining} onChange={handleChange} />

            {/* 🔹 Role Dropdown */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* 🔹 Status Dropdown */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full py-2 px-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose || (() => setDarkMode(false))}
              className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-xl font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold"
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 🔹 Reusable input */
const Input = ({ label, icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-gray-100"
      />
    </div>
  </div>
);

export default AddEmployeeModal;
