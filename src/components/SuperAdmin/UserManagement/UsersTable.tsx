import React from "react";
import {
  CheckCircle,
  XCircle,
  User,
  Mail,
  Calendar,
  RefreshCw,
  UserX,
  UserCheck,
  Eye,
  Users,
  BookOpen,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // Adjust import path based on your structure

interface UsersTableProps {
  users: any[];
  loading: boolean;
  roleName: string;
  searchTerm?: string;
  processingUserId: string | null;
  onDeactivateUser: (e: React.MouseEvent, userId: string) => void;
  onActivateUser: (e: React.MouseEvent, userId: string) => void;
  onViewDetails: (userId: string) => void;
  onClearSearch: () => void;
  formatDate: (dateString: any) => string;
  currentRole?: any;
}

export default function UsersTable({
  users,
  loading,
  roleName,
  searchTerm,
  processingUserId,
  onDeactivateUser,
  onActivateUser,
  onViewDetails,
  onClearSearch,
  formatDate,
}: UsersTableProps) {
  const getRoleIcon = () => {
    return roleName === "Student" ? (
      <Users className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
    ) : (
      <BookOpen className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
    );
  };

  const getRoleColor = () => {
    return roleName === "Student"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
  };

  const getAvatarGradient = () => {
    return roleName === "Student"
      ? "from-blue-500 to-blue-700 border-blue-300 dark:border-blue-400"
      : "from-purple-500 to-purple-700 border-purple-300 dark:border-purple-400";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{roleName} Details</TableHead>
          <TableHead>Email Address</TableHead>
          <TableHead>Verification Status</TableHead>
          <TableHead>Account Created</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={5} className="px-6 py-12 text-center">
              <RefreshCw className="mx-auto mb-3 h-8 w-8 animate-spin text-gray-400" />
              <p className="font-medium text-gray-500 dark:text-white">
                Loading {roleName.toLowerCase()}s...
              </p>
            </TableCell>
          </TableRow>
        ) : users && users.length > 0 ? (
          users.map((user: any) => (
            <TableRow key={user.id} onClick={() => onViewDetails(user.id)}>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        className="h-12 w-12 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                        src={user.profileImage}
                        alt={user.username}
                      />
                    ) : (
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 bg-gradient-to-br ${getAvatarGradient()}`}
                      >
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user.username}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-700">
                        ID: {user.id}
                      </span>

                      <span className={`rounded px-2 py-0.5 ${getRoleColor()}`}>
                        {user.role?.name || roleName}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center text-sm text-gray-900 dark:text-gray-300">
                  <Mail className="mr-2 h-4 w-4 flex-shrink-0 text-gray-400 dark:text-white" />
                  <span className="truncate">{user.email}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {user.verifyUser ? (
                  <span className="inline-flex items-center rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-800 dark:border-green-500/30 dark:bg-green-500/20 dark:text-green-400">
                    <CheckCircle className="mr-1.5 h-4 w-4" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-red-200 bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 dark:border-red-500/30 dark:bg-red-500/20 dark:text-red-400">
                    <XCircle className="mr-1.5 h-4 w-4" />
                    Unverified
                  </span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-gray-600 dark:text-white">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <span>{formatDate(user.createdAt)}</span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {user.status === "active" ? (
                    <button
                      onClick={(e) => onDeactivateUser(e, user.id)}
                      disabled={processingUserId === user.id}
                      className="inline-flex items-center rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingUserId === user.id ? (
                        <>
                          <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserX className="mr-1 h-3.5 w-3.5" />
                          Deactivate
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={(e) => onActivateUser(e, user.id)}
                      disabled={processingUserId === user.id}
                      className="inline-flex items-center rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {processingUserId === user.id ? (
                        <>
                          <RefreshCw className="mr-1 h-3.5 w-3.5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserCheck className="mr-1 h-3.5 w-3.5" />
                          Activate
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(user.id);
                    }}
                    className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                  >
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    View
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="px-6 py-12 text-center">
              {getRoleIcon()}
              <p className="font-medium text-gray-500 dark:text-white">
                {searchTerm
                  ? `No ${roleName.toLowerCase()}s found matching your search`
                  : `No ${roleName.toLowerCase()}s found`}
              </p>
              {searchTerm && (
                <button
                  onClick={onClearSearch}
                  className="mt-2 text-sm text-[#02517b] hover:underline dark:text-[#43bf79]"
                >
                  Clear search
                </button>
              )}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
