"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { deleteUser, fetchUsers } from "@/app/lib/store/features/userSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { toast } from "react-hot-toast";
import SidebarForm from "../../components/SidebarForm";
import AddUsers from "../../components/addUser";
import EditUser from "../../components/editUser";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, status, totalUsers, currentPage, totalPages } = useAppSelector(
    (state) => state.users,
  );

  const [filters, setFilters] = useState({
    role: "", // admin, user
    search: "",
    page: 1,
    limit: 10,
  });
  const [editing, setEditing] = useState(null);

  const handleClose = () => setEditing(null);

  // Fetch users whenever filters change
  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  // Pagination handlers
  const handlePrev = () => {
    if (filters.page > 1) setFilters({ ...filters, page: filters.page - 1 });
  };

  const handleNext = () => {
    if (filters.page < totalPages)
      setFilters({ ...filters, page: filters.page + 1 });
  };

  // const handleUserAction = (action, userId) => {
  //   console.log(`${action} user with ID: ${userId}`);
  //   // Implement actions like edit, delete, toggle status
  // };

  const getRoleBadgeColor = (role) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800 border-purple-200"
      : role == "driver"
        ? "bg-green-100 text-white-800 border-green-200"
        : "bg-blue-100 text-blue-800 border-blue-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                User Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage and monitor your platform users ({totalUsers} total)
              </p>
            </div>{" "}
            <SidebarForm
              title="Add User"
              trigger={
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add User
                </button>
              }
            >
              <AddUsers onSuccess={handleClose} />
            </SidebarForm>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: 1 })
                }
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
            <select
              value={filters.role}
              onChange={(e) =>
                setFilters({ ...filters, role: e.target.value, page: 1 })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={filters.limit}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  limit: parseInt(e.target.value),
                  page: 1,
                })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 bg-white"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>
        </div>

        {/* Status Messages */}
        {status === "loading" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-6">
            <div className="inline-flex items-center gap-3">
              <svg
                className="animate-spin w-5 h-5 text-indigo-600"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-gray-600">Loading users...</span>
            </div>
          </div>
        )}

        {status === "failed" && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-green-800 font-medium">
                Failed to load users. Please try again.
              </span>
            </div>
          </div>
        )}

        {/* Users Table */}
        {status === "succeeded" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`${getImageUrl(u.avatar)}`}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-medium text-gray-900">
                              {u.fullname}
                            </p>
                            <p className="text-sm text-gray-500">ID: {u.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-900">{u.email}</p>
                          <p className="text-sm text-gray-500">
                            {u.phoneNumber || "No phone"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                            u.role,
                          )}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.addresses && u.addresses.length > 0 ? (
                          <div className="space-y-1">
                            {u.addresses.slice(0, 2).map((a) => (
                              <div key={a.id} className="text-sm">
                                <span className="font-medium text-gray-700">
                                  {a.addressType}:
                                </span>
                                <p className="text-gray-600">
                                  {a.address1}, {a.city} {a.zipCode}
                                </p>
                              </div>
                            ))}
                            {u.addresses.length > 2 && (
                              <p className="text-xs text-gray-500">
                                +{u.addresses.length - 2} more
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            No address
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(u.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {/* <button
                            // onClick={() => handleUserAction("view", u.id)}
                            className="text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 p-2 rounded-lg transition-colors duration-200"
                            title="View Details"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button> */}
                          <SidebarForm
                            title={`Edit ${u.fullname}`}
                            trigger={
                              <button
                                className="text-amber-600 hover:text-amber-900 hover:bg-amber-50 p-2 rounded-lg transition-colors duration-200"
                                title="Edit User"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                              </button>
                            }
                          >
                            <EditUser user={u} onSuccess={handleClose} />
                          </SidebarForm>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this user?",
                                )
                              ) {
                                try {
                                  await dispatch(deleteUser(u.id)).unwrap();
                                  toast.success("User deleted successfully!");
                                } catch (error: any) {
                                  console.error("Failed to delete user:", error);
                                  toast.error(error?.message || error?.data?.message || "Failed to delete user");
                                }
                              }
                            }}
                            className="text-green-700 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-colors duration-200"
                            title="Delete User"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * filters.limit + 1} to{" "}
                  {Math.min(currentPage * filters.limit, totalUsers)} of{" "}
                  {totalUsers} users
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    disabled={filters.page === 1}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>

                  <span className="text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    onClick={handleNext}
                    disabled={filters.page === totalPages}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {status === "succeeded" && users.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
