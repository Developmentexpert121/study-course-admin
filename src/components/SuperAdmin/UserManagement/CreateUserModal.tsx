import React, { useState, useEffect } from "react";
import { XCircle, Loader2, Users, BookOpen, Shield } from "lucide-react";
import { useApiClient } from "@/lib/api";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
  userRole: any;
  roleName: string;
  // New props for Admin page
  availableRoles?: any[];
  selectedRoleId?: string | null;
  onRoleChange?: (roleId: string) => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onUserCreated,
  userRole,
  roleName,
  availableRoles = [],
  selectedRoleId,
  onRoleChange,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(userRole);
  const api = useApiClient();

  // Update selectedRole when userRole or selectedRoleId changes
  useEffect(() => {
    if (roleName === "Admin" && availableRoles.length > 0) {
      if (selectedRoleId) {
        const role = availableRoles.find((r) => r.id === selectedRoleId);
        if (role) {
          setSelectedRole(role);
        }
      } else if (availableRoles.length > 0) {
        // Default to first available role
        setSelectedRole(availableRoles[0]);
      }
    } else {
      // For Student/Teacher, use the userRole prop
      setSelectedRole(userRole);
    }
  }, [userRole, selectedRoleId, availableRoles, roleName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const roleId = e.target.value;
    if (roleId) {
      const role = availableRoles.find((r) => r.id === roleId);
      if (role) {
        setSelectedRole(role);
        onRoleChange?.(roleId);
      }
    }
  };

  const generateRandomPassword = () => {
    const length = 12;
    const charset =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData((prev) => ({
      ...prev,
      password,
      confirmPassword: password,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("=== CREATE USER DEBUG ===");
    console.log("Form Data:", formData);
    console.log("Selected Role:", selectedRole);
    console.log("Role Name:", roleName);

    if (!formData.username || !formData.email || !selectedRole) {
      console.log("Validation failed - missing fields or role");
      alert(`Please fill all required fields and ensure role is selected`);
      return;
    }

    if (formData.password.length < 6) {
      console.log("Validation failed - password too short");
      alert("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Validation failed - passwords don't match");
      alert("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending API request with role_id:", selectedRole.id);

      const response = await api.post(`user/create`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: selectedRole.id,
        send_credentials: true,
      });

      console.log("API Response:", response);

      if (response.success) {
        const createdRoleName = selectedRole.name;
        console.log("User created successfully!");
        alert(
          `${createdRoleName} created successfully! Login credentials sent to email.`,
        );
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        onUserCreated();
        onClose();
      } else {
        console.error("API returned error:", response);
        alert(
          response.data?.message ||
            response.error?.message ||
            `Failed to create user`,
        );
      }
    } catch (error: any) {
      console.error(`Create user error:`, error);
      console.error("Error details:", error.response?.data || error.message);
      alert(error.message || `Failed to create user`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const getRoleIcon = () => {
    switch (roleName) {
      case "Student":
        return <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "Teacher":
        return (
          <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        );
      case "Admin":
        return (
          <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
        );
      default:
        return <Shield className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getRoleColor = () => {
    switch (roleName) {
      case "Student":
        return "bg-blue-50 dark:bg-blue-900/20";
      case "Teacher":
        return "bg-purple-50 dark:bg-purple-900/20";
      case "Admin":
        return "bg-green-50 dark:bg-green-900/20";
      default:
        return "bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getRoleTextColor = () => {
    switch (roleName) {
      case "Student":
        return "text-blue-800 dark:text-blue-300";
      case "Teacher":
        return "text-purple-800 dark:text-purple-300";
      case "Admin":
        return "text-green-800 dark:text-green-300";
      default:
        return "text-gray-800 dark:text-gray-300";
    }
  };

  const getRoleDescription = (role: any) => {
    if (roleName === "Admin" && role) {
      return `This user will be created as a ${role.name} with administrative permissions.`;
    }

    switch (roleName) {
      case "Student":
        return "This user will be created as a Student with course enrollment and learning permissions.";
      case "Teacher":
        return "This user will be created as a Teacher with course creation and management permissions.";
      default:
        return "This user will be created with the selected role permissions.";
    }
  };

  const modalTitle =
    roleName === "Admin"
      ? `Create New ${selectedRole?.name || "Admin"}`
      : `Create New ${roleName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection for Admin Page */}
          {roleName === "Admin" && availableRoles.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Role *
              </label>
              <select
                value={selectedRole?.id || ""}
                onChange={handleRoleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a role</option>
                {availableRoles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {selectedRole?.name || roleName} Name *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder={`Enter ${selectedRole?.name?.toLowerCase() || roleName.toLowerCase()} name`}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
              >
                Generate Random
              </button>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {selectedRole && (
            <div className={`rounded-lg p-3 ${getRoleColor()}`}>
              <div className="flex items-center gap-2">
                {getRoleIcon()}
                <span className={`text-sm font-medium ${getRoleTextColor()}`}>
                  Role: {selectedRole.name}
                </span>
              </div>
              <p
                className={`mt-1 text-xs ${getRoleTextColor().replace("800", "700").replace("300", "400")}`}
              >
                {getRoleDescription(selectedRole)}
              </p>
              <p
                className={`mt-1 text-xs ${getRoleTextColor().replace("800", "600").replace("300", "300")}`}
              >
                Role ID: {selectedRole.id}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="flex-1 rounded-lg bg-[#02517b] px-4 py-2 text-white transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
            >
              {isLoading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                `Create ${selectedRole?.name || roleName}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
