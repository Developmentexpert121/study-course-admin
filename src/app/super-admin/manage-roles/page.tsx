"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Save,
  X,
  Search,
  Users,
  Lock,
} from "lucide-react";
import { useApiClient } from "@/lib/api";
import { toasterError, toasterSuccess } from "@/components/core/Toaster";

interface Permission {
  [key: string]: boolean;
}

interface Role {
  id: number;
  name: string;
  permissions: Permission;
  createdAt: string;
  users: Array<{ id: number; username: string; email: string }>;
}

interface AvailablePermission {
  key: string;
  label: string;
  description: string;
}

export default function RolesManagementPage() {
  const api = useApiClient();
  const [roles, setRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    AvailablePermission[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [processing, setProcessing] = useState(false);
  const [userCounts, setUserCounts] = useState<{ [key: number]: number }>({});

  const [roleForm, setRoleForm] = useState({
    name: "",
    permissions: {} as Permission,
  });

  // Define protected roles that cannot be edited or deleted
  const PROTECTED_ROLES = ["Super-Admin", "Teacher", "Student"];

  const loadRoles = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("roles");
      if (response && response.success) {
        const rolesData = response.data.data;
        if (Array.isArray(rolesData)) {
          setRoles(rolesData);
          const counts: { [key: number]: number } = {};
          rolesData.forEach((role: Role) => {
            counts[role.id] = role.users?.length || 0;
          });
          setUserCounts(counts);

          extractPermissionsFromRoles(rolesData);
        } else {
          setError("Invalid data format received from server");
          setRoles([]);
        }
      } else {
        setError(response?.error?.message || "Failed to load roles");
        setRoles([]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load roles");
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const extractPermissionsFromRoles = (rolesData: Role[]) => {
    const allPermissions = new Set<string>();
    rolesData.forEach((role) => {
      Object.keys(role.permissions || {}).forEach((permission) => {
        allPermissions.add(permission);
      });
    });

    const permissionsList: AvailablePermission[] = Array.from(
      allPermissions,
    ).map((perm) => ({
      key: perm,
      label:
        perm.charAt(0).toUpperCase() + perm.slice(1).replace(/([A-Z])/g, " $1"),
      description: `Access to ${perm} features`,
    }));
    setAvailablePermissions(permissionsList);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const filteredRoles = Array.isArray(roles)
    ? roles &&
      roles?.filter((role) => {
        if (!role || !role.name) return false;
        return role.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    : [];

  const resetForm = () => {
    setRoleForm({
      name: "",
      permissions: {},
    });
    setSelectedRole(null);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    // Check if role is protected
    if (PROTECTED_ROLES.includes(role.name)) {
      toasterError(`Cannot edit default role: ${role.name}`);
      return;
    }

    setSelectedRole(role);
    setRoleForm({
      name: role.name,
      permissions: { ...role.permissions },
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    // Check if role is protected
    if (PROTECTED_ROLES.includes(role.name)) {
      toasterError(`Cannot delete default role: ${role.name}`);
      return;
    }

    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handlePermissionToggle = (permissionKey: string) => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionKey]: !prev.permissions[permissionKey],
      },
    }));
  };

  const handleSelectAll = () => {
    const allPermissions: Permission = {};
    availablePermissions.forEach((perm) => {
      allPermissions[perm.key] = true;
    });
    setRoleForm((prev) => ({
      ...prev,
      permissions: allPermissions,
    }));
  };

  const handleDeselectAll = () => {
    setRoleForm((prev) => ({
      ...prev,
      permissions: {},
    }));
  };

  const handleCreateRole = async () => {
    if (!roleForm.name.trim()) {
      toasterError("Please enter a role name");
      return;
    }

    setProcessing(true);
    try {
      const response = await api.post("roles", {
        name: roleForm.name.trim(),
        permissions: roleForm.permissions,
      });

      if (response.success) {
        await loadRoles();
        toasterSuccess("Role created successfully!", 2000);
        setIsCreateModalOpen(false);
        resetForm();
      } else {
        toasterError(response.error?.message || "Failed to create role");
      }
    } catch (err: any) {
      toasterError(err.message || "Failed to create role");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole || !roleForm.name.trim()) {
      toasterError("Please enter a role name");
      return;
    }

    if (Object.keys(roleForm.permissions).length === 0) {
      toasterError("Please select at least one permission");
      return;
    }

    setProcessing(true);
    try {
      const response = await api.put(`roles/${selectedRole.id}`, {
        name: roleForm.name.trim(),
        permissions: roleForm.permissions,
      });

      if (response.success) {
        await loadRoles();
        toasterSuccess("Role Updated Successfully!", 2000);
        setIsEditModalOpen(false);
        resetForm();
      } else {
        toasterError(response.error?.message || "Failed to update role");
      }
    } catch (err: any) {
      toasterError(err.message || "Failed to update role");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;

    // Double check protection (should already be handled in handleDelete)
    if (PROTECTED_ROLES.includes(selectedRole.name)) {
      toasterError(`Cannot delete default role: ${selectedRole.name}`);
      setIsDeleteModalOpen(false);
      return;
    }

    if (userCounts[selectedRole.id] > 0) {
      toasterError(
        `Cannot delete role "${selectedRole.name}" because it has ${userCounts[selectedRole.id]} user(s) assigned. Please reassign users first.`,
      );
      setIsDeleteModalOpen(false);
      return;
    }

    setProcessing(true);
    try {
      const response = await api.delete(`roles/${selectedRole.id}`);

      if (response.success) {
        await loadRoles();
        toasterSuccess("Role Deleted Successfully!", 2000);
        setIsDeleteModalOpen(false);
        resetForm();
      } else {
        const errorMessage = response.error?.message || "Failed to delete role";
        toasterError(errorMessage);
      }
    } catch (err: any) {
      const errorMessage =
        err.message || err.error?.message || "Failed to delete role";
      toasterError(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-[#02517b] dark:border-[#43bf79]"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
          <div>
            <h1 className="flex items-center text-3xl font-bold text-gray-900 dark:text-white">
              <Shield className="mr-3 h-8 w-8 text-[#02517b] dark:text-[#43bf79]" />
              Roles Management
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Create and manage user roles and permissions
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2.5 text-white shadow-sm transition-colors hover:bg-[#02517b99] dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Role
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b]/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]/20"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-500/30 dark:bg-red-900/20">
            <p className="text-red-800 dark:text-red-400">{error}</p>
            <button
              onClick={loadRoles}
              className="mt-2 text-sm text-red-600 hover:underline dark:text-red-400"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Roles Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRoles.map((role) => {
            const isProtected = PROTECTED_ROLES.includes(role.name);

            return (
              <div
                key={role.id}
                className={`rounded-xl border bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800 ${
                  isProtected
                    ? "border-blue-200 ring-2 ring-blue-200 dark:border-blue-800 dark:ring-blue-800"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="p-6">
                  {/* Role Header */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {role.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Created {formatDate(role.createdAt)}
                        </p>
                      </div>
                      {isProtected && (
                        <Lock className="mt-1 h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(role)}
                        disabled={isProtected}
                        className={`rounded-lg p-2 transition-colors ${
                          isProtected
                            ? "cursor-not-allowed text-gray-300 dark:text-gray-600"
                            : "text-gray-500 hover:bg-gray-100 hover:text-[#02517b] dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-[#43bf79]"
                        }`}
                        title={
                          isProtected
                            ? "System role cannot be edited"
                            : "Edit role"
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!isProtected && (
                        <button
                          onClick={() => handleDelete(role)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-red-400"
                          title="Delete role"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* User Count */}
                  <div className="mb-4 flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {userCounts[role.id] || 0} user(s) assigned
                    </span>
                  </div>

                  {/* Protected Role Badge */}
                  {isProtected && (
                    <div className="mb-3">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        <Lock className="mr-1 h-3 w-3" />
                        System Role
                      </span>
                    </div>
                  )}

                  {/* Permissions Preview */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Permissions:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(role.permissions || {})
                        .filter(([_, value]) => value)
                        .slice(0, 4)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          >
                            {key}
                          </span>
                        ))}
                      {Object.keys(role.permissions || {}).filter(
                        (key) => role.permissions[key],
                      ).length > 4 && (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          +
                          {Object.keys(role.permissions || {}).filter(
                            (key) => role.permissions[key],
                          ).length - 4}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRoles.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-12 dark:border-gray-600 dark:bg-gray-800">
            <Shield className="mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              {roles.length === 0 ? "No roles found" : "No matching roles"}
            </h3>
            <p className="mb-4 text-gray-500 dark:text-gray-400">
              {searchTerm
                ? "Try adjusting your search"
                : "Get started by creating your first role"}
            </p>
            {!searchTerm && (
              <button
                onClick={handleCreate}
                className="inline-flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white hover:bg-[#02517b99] dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <RoleModal
          title="Create New Role"
          roleForm={roleForm}
          onFormChange={setRoleForm}
          onPermissionToggle={handlePermissionToggle}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          processing={processing}
          onSave={handleCreateRole}
          onClose={() => {
            setIsCreateModalOpen(false);
            resetForm();
          }}
          availablePermissions={availablePermissions}
          selectedRole={null}
        />
      )}
      {isEditModalOpen && selectedRole && (
        <RoleModal
          title="Edit Role"
          roleForm={roleForm}
          onFormChange={setRoleForm}
          onPermissionToggle={handlePermissionToggle}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          processing={processing}
          onSave={handleUpdateRole}
          onClose={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
          availablePermissions={availablePermissions}
          selectedRole={selectedRole}
        />
      )}
      {isDeleteModalOpen && selectedRole && (
        <DeleteModal
          role={selectedRole}
          userCount={userCounts[selectedRole.id] || 0}
          processing={processing}
          onConfirm={handleDeleteRole}
          onClose={() => {
            setIsDeleteModalOpen(false);
            resetForm();
          }}
        />
      )}
    </div>
  );
}

const RoleModal: React.FC<{
  title: string;
  roleForm: any;
  onFormChange: (form: any) => void;
  onPermissionToggle: (permissionKey: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  processing: boolean;
  onSave: () => void;
  onClose: () => void;
  availablePermissions: AvailablePermission[];
  selectedRole?: Role | null;
}> = ({
  title,
  roleForm,
  onFormChange,
  onPermissionToggle,
  onSelectAll,
  onDeselectAll,
  processing,
  onSave,
  onClose,
  availablePermissions,
  selectedRole,
}) => {
  const isDefaultRole = selectedRole
    ? ["Teacher", "Student", "Super-Admin"].includes(selectedRole.name)
    : false;
  const isEditing = title === "Edit Role";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Role Name */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role Name *
              </label>
              {isEditing && isDefaultRole && (
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  System Role
                </span>
              )}
            </div>

            {isEditing && isDefaultRole ? (
              // Display as read-only for default roles
              <div className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-2.5 dark:border-gray-600 dark:bg-gray-600">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {roleForm.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Read-only
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  System role names cannot be modified
                </p>
              </div>
            ) : (
              // Editable input for custom roles and create mode
              <input
                type="text"
                value={roleForm.name}
                onChange={(e) =>
                  onFormChange({ ...roleForm, name: e.target.value })
                }
                placeholder="Enter role name"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-black focus:border-[#02517b] focus:outline-none focus:ring-2 focus:ring-[#02517b] dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-[#43bf79] dark:focus:ring-[#43bf79]"
              />
            )}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Permissions *
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onSelectAll}
                className="text-xs text-[#02517b] hover:underline dark:text-[#43bf79]"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={onDeselectAll}
                className="text-xs text-gray-500 hover:underline dark:text-gray-400"
              >
                Deselect All
              </button>
            </div>
          </div>

          {/* Permissions Grid */}
          {availablePermissions.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {availablePermissions.map((permission) => (
                <div
                  key={permission.key}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-600"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {permission.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {permission.description}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPermissionToggle(permission.key)}
                    className={`flex h-6 w-11 items-center rounded-full p-1 transition-colors ${
                      roleForm.permissions[permission.key]
                        ? "bg-[#02517b] dark:bg-[#43bf79]"
                        : "bg-gray-200 dark:bg-gray-600"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                        roleForm.permissions[permission.key]
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-700">
              <p className="text-gray-600 dark:text-gray-300">
                Loading permissions...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 p-6 dark:border-gray-700">
          <button
            onClick={onClose}
            disabled={processing}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={processing || availablePermissions.length === 0}
            className="flex items-center rounded-lg bg-[#02517b] px-4 py-2 text-white transition-colors hover:bg-[#02517b99] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#43bf79] dark:hover:bg-[#43bf7999]"
          >
            {processing ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {processing ? "Saving..." : "Save Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal: React.FC<{
  role: Role;
  userCount: number;
  processing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}> = ({ role, userCount, processing, onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
        <div className="text-center">
          <Trash2 className="mx-auto mb-4 h-12 w-12 text-red-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Delete Role
          </h3>
          <p className="mb-4 text-gray-600 dark:text-gray-300">
            Are you sure you want to delete the role{" "}
            <strong>"{role.name}"</strong>?
          </p>

          {userCount > 0 && (
            <div className="mb-4 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              <strong>Warning:</strong> This role has {userCount} user(s)
              assigned. Deleting it will affect these users.
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={onClose}
              disabled={processing}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={processing}
              className="flex items-center rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              {processing ? "Deleting..." : "Delete Role"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
