import React, { useState, useEffect, useCallback, useMemo } from "react";
import { XCircle, Loader2, Users, BookOpen, Shield } from "lucide-react";
import { useApiClient } from "@/lib/api";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserCreated: () => void;
  userRole: any;
  roleName: string;
  availableRoles?: any[];
  selectedRoleId?: string | null;
  onRoleChange?: (roleId: string) => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Constants
const PASSWORD_CONFIG = {
  length: 12,
  charset:
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*",
};

// Role configuration
const ROLE_CONFIG = {
  Student: {
    icon: Users,
    color: "blue",
    description:
      "This user will be created as a Student with course enrollment and learning permissions.",
  },
  Teacher: {
    icon: BookOpen,
    color: "purple",
    description:
      "This user will be created as a Teacher with course creation and management permissions.",
  },
  Admin: {
    icon: Shield,
    color: "green",
    description: (role: any) =>
      `This user will be created as a ${role?.name || "Admin"} with administrative permissions.`,
  },
} as const;

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
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(userRole);
  const api = useApiClient();
  // Memoized role configuration
  const roleConfig = useMemo(
    () =>
      ROLE_CONFIG[roleName as keyof typeof ROLE_CONFIG] || ROLE_CONFIG.Admin,
    [roleName],
  );

  // Update selectedRole when dependencies change
  useEffect(() => {
    if (roleName === "Admin" && availableRoles.length > 0) {
      const role = selectedRoleId
        ? availableRoles.find((r) => r.id == selectedRoleId)
        : availableRoles[0];

      setSelectedRole(role || availableRoles[0]);
    } else {
      setSelectedRole(userRole);
    }
  }, [userRole, selectedRoleId, availableRoles, roleName]);

  // Handlers
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const generateRandomPassword = useCallback(() => {
    let password = "";
    for (let i = 0; i < PASSWORD_CONFIG.length; i++) {
      password += PASSWORD_CONFIG.charset.charAt(
        Math.floor(Math.random() * PASSWORD_CONFIG.charset.length),
      );
    }
    setFormData((prev) => ({
      ...prev,
      password,
      confirmPassword: password,
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!formData.username || !formData.email || !selectedRole) {
      alert("Please fill all required fields and ensure role is selected");
      return false;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return false;
    }

    return true;
  }, [formData, selectedRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post(`user/create`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role_id: selectedRole.id,
        send_credentials: true,
      });

      if (response.success) {
        const createdRoleName = selectedRole.name;
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
        alert(
          response.data?.message ||
            response.error?.message ||
            "Failed to create user",
        );
      }
    } catch (error: any) {
      console.error("Create user error:", error);
      alert(error.message || "Failed to create user");
    } finally {
      setIsLoading(false);
    }
  };
  // Memoized computed values
  const modalTitle = useMemo(
    () =>
      roleName == "Admin"
        ? `Create New ${selectedRole?.name}`
        : `Create New ${roleName}`,
    [roleName, selectedRole],
  );

  const roleDescription = useMemo(
    () =>
      typeof roleConfig.description === "function"
        ? roleConfig.description(selectedRole)
        : roleConfig.description,
    [roleConfig.description, selectedRole],
  );

  const RoleIcon = roleConfig.icon;

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {modalTitle}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
            disabled={isLoading}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection for Admin Page */}
          {roleName === "Admin" && availableRoles.length > 0 && (
            <div className="mb-4">
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Select Role *
              </label>
              <select
                id="role"
                value={selectedRoleId || ""}
                onChange={(e) => onRoleChange?.(e.target.value)}
                className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                required
                disabled={true}
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
          {/* Username Field */}
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
              disabled={isLoading}
            />
          </div>

          {/* Email Field */}
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
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <button
                type="button"
                onClick={generateRandomPassword}
                className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                disabled={isLoading}
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
              disabled={isLoading}
              minLength={6}
            />
          </div>

          {/* Confirm Password Field */}
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
              disabled={isLoading}
            />
          </div>

          {/* Role Info Card */}
          {selectedRole && (
            <div
              className={`rounded-lg p-3 bg-${roleConfig.color}-50 dark:bg-${roleConfig.color}-900/20`}
            >
              <div className="flex items-center gap-2">
                <RoleIcon
                  className={`h-4 w-4 text-${roleConfig.color}-600 dark:text-${roleConfig.color}-400`}
                />
                <span
                  className={`text-sm font-medium text-${roleConfig.color}-800 dark:text-${roleConfig.color}-300`}
                >
                  Role: {selectedRole.name}
                </span>
              </div>
              <p
                className={`mt-1 text-xs text-${roleConfig.color}-700 dark:text-${roleConfig.color}-400`}
              >
                {roleDescription}
              </p>
              <p
                className={`mt-1 text-xs text-${roleConfig.color}-600 dark:text-${roleConfig.color}-300`}
              >
                Role ID: {selectedRole.id}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
              disabled={isLoading}
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
