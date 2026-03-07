"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import {
  deleteArtist,
  fetchArtists,
} from "@/app/lib/store/features/artistSlice";
import ArtistForm from "../../components/artistForm";
import { Trash2, Edit3, Plus, User, Star, Check, X } from "lucide-react";
import { getImageUrl } from "@/app/utils/getImageUrl";

const ArtistList = () => {
  const dispatch = useAppDispatch();
  const { artists, status } = useAppSelector((state) => state.artist);
  const [showForm, setShowForm] = useState(false);
  const [editArtist, setEditArtist] = useState<any | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchArtists());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteArtist(id));
    setDeleteConfirm(null);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Artists
              </h1>
              <p className="text-slate-600">Manage your artist collection</p>
            </div>
            <button
              onClick={() => {
                setEditArtist(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span>Add Artist</span>
            </button>
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Artist Image */}
              <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200">
                {artist.image ? (
                  <img
                    src={getImageUrl(artist.image)}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <User size={64} className="text-slate-400" />
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2">
                  {artist.isFeatured && (
                    <div className="bg-amber-500 text-white px-2 py-1 rounded-lg flex items-center space-x-1 text-xs font-semibold">
                      <Star size={12} fill="currentColor" />
                      <span>Featured</span>
                    </div>
                  )}
                  <div
                    className={`px-2 py-1 rounded-lg flex items-center space-x-1 text-xs font-semibold ${
                      artist.isActive
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-500 text-white"
                    }`}
                  >
                    {artist.isActive ? <Check size={12} /> : <X size={12} />}
                    <span>{artist.isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
              </div>

              {/* Artist Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2 truncate">
                  {artist.name}
                </h3>

                {artist.genre && (
                  <p className="text-slate-600 text-sm mb-4">{artist.genre}</p>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditArtist(artist);
                      setShowForm(true);
                    }}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
                  >
                    <Edit3 size={16} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirm(artist.id)}
                    className="bg-red-50 hover:bg-red-100 text-green-700 px-4 py-2 rounded-lg font-semibold flex items-center justify-center transition-colors duration-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {artists.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <User size={64} className="text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No artists yet
            </h3>
            <p className="text-slate-500 mb-6">
              Get started by adding your first artist
            </p>
            <button
              onClick={() => {
                setEditArtist(null);
                setShowForm(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
            >
              <Plus size={20} />
              <span>Add Your First Artist</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-green-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Delete Artist
              </h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this artist? This action cannot
                be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 bg-green-700 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Artist Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-slate-900">
                  {editArtist ? "Edit Artist" : "Add New Artist"}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <ArtistForm
                artist={editArtist || undefined}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistList;
