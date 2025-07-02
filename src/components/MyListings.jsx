import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase/firebase.config';
import Swal from 'sweetalert2';
import { 
    Home, List, CheckCircle, XCircle, Heart, Edit, Trash2, PlusCircle, 
    ThumbsUp, MapPin, Calendar, Eye, User, DollarSign, Star 
} from 'lucide-react';

const MyListings = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [myListings, setMyListings] = useState([]);
    const [likedListings, setLikedListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [activeTab, setActiveTab] = useState('myListings');

    useEffect(() => {
        if (authLoading || !user) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = await auth.currentUser.getIdToken();
                const userEmail = user.email;
                const [myListingsRes, likedListingsRes] = await Promise.all([
                    fetch(`https://room-mate-finder-server-zeta.vercel.app/rooms?email=${userEmail}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`https://room-mate-finder-server-zeta.vercel.app/user/likes/${userEmail}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);
                if (!myListingsRes.ok) throw new Error('Failed to fetch your listings.');
                const myListingsData = await myListingsRes.json();
                setMyListings(myListingsData);
                if (likedListingsRes.ok) {
                    const likedListingsData = await likedListingsRes.json();
                    setLikedListings(likedListingsData);
                } else {
                    console.warn('Could not fetch liked listings.');
                    setLikedListings([]);
                }
            } catch (err) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user, authLoading]);

    const handleDelete = (id, title) => {
        const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
        Swal.fire({
            title: 'Are you sure?',
            html: `You want to delete "<strong>${title}</strong>"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            background: isDarkTheme ? '#1f2937' : '#ffffff',
            color: isDarkTheme ? '#f3f4f6' : '#111827',
        }).then(async (result) => {
            if (result.isConfirmed) {
                setDeleteLoading(id);
                try {
                    const token = await auth.currentUser.getIdToken();
                    const res = await fetch(`https://room-mate-finder-server-zeta.vercel.app/rooms/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (!res.ok) throw new Error('Delete failed.');
                    setMyListings(prev => prev.filter(item => item._id !== id));
                    toast.success('Listing deleted successfully!');
                } catch {
                    toast.error('Failed to delete listing.');
                } finally {
                    setDeleteLoading(null);
                }
            }
        });
    };

    const stats = {
        totalListings: myListings.length,
        available: myListings.filter(item => item.availability).length,
        totalLikes: myListings.reduce((acc, item) => acc + (item.likeCount || 0), 0),
        likedItems: likedListings.length
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-base-content/70">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-base-200/50 to-base-300/30 pt-20 min-h-screen">
            <Toaster position="top-right" toastOptions={{
                duration: 4000,
                style: {
                    background: 'var(--fallback-b1,oklch(var(--b1)))',
                    color: 'var(--fallback-bc,oklch(var(--bc)))',
                }
            }} />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Header Section */}
                <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 shadow-xl mb-8">
                    <div className="card-body">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex items-center space-x-4">
                                <div className="avatar">
                                    <div className="w-16 h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                        {user.photoURL ? (
                                            <img src={user.photoURL} alt={user.displayName || 'User'} />
                                        ) : (
                                            <div className="bg-primary text-primary-content rounded-full w-16 h-16 flex items-center justify-center">
                                                <span className="text-2xl font-bold">
                                                    {(user.displayName || user.email).charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        My Dashboard
                                    </h1>
                                    <p className="text-base-content/70 mt-1 flex items-center">
                                        <User size={16} className="mr-2" />
                                        Welcome back, {user.displayName || user.email}!
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/add-listing" 
                                className="btn btn-primary btn-lg mt-4 sm:mt-0 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <PlusCircle size={20} className="mr-2" />
                                Add New Listing
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stat bg-base-200 border-l-4 border-primary rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="stat-figure text-primary">
                            <List size={32}/>
                        </div>
                        <div className="stat-title text-base-content/70">My Listings</div>
                        <div className="stat-value text-primary">{stats.totalListings}</div>
                        <div className="stat-desc text-base-content/50">Total properties</div>
                    </div>
                    
                    <div className="stat bg-base-200 border-l-4 border-success rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="stat-figure text-success">
                            <CheckCircle size={32}/>
                        </div>
                        <div className="stat-title text-base-content/70">Available</div>
                        <div className="stat-value text-success">{stats.available}</div>
                        <div className="stat-desc text-base-content/50">Ready to rent</div>
                    </div>
                    
                    <div className="stat bg-base-200 border-l-4 border-error rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="stat-figure text-error">
                            <Heart size={32}/>
                        </div>
                        <div className="stat-title text-base-content/70">Total Likes</div>
                        <div className="stat-value text-error">{stats.totalLikes}</div>
                        <div className="stat-desc text-base-content/50">Likes received</div>
                    </div>
                    
                    <div className="stat bg-base-200 border-l-4 border-info rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="stat-figure text-info">
                            <ThumbsUp size={32}/>
                        </div>
                        <div className="stat-title text-base-content/70">Interested In</div>
                        <div className="stat-value text-info">{stats.likedItems}</div>
                        <div className="stat-desc text-base-content/50">Your favorites</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed bg-base-100 shadow-lg p-2 mb-6 rounded-2xl">
                    <a 
                        role="tab" 
                        className={`tab tab-lg font-semibold transition-all duration-300 ${
                            activeTab === 'myListings' 
                                ? 'tab-active bg-primary text-primary-content shadow-lg' 
                                : 'hover:bg-base-200'
                        }`} 
                        onClick={() => setActiveTab('myListings')}
                    >
                        <List size={18} className="mr-2" />
                        My Listings ({stats.totalListings})
                    </a>
                    <a 
                        role="tab" 
                        className={`tab tab-lg font-semibold transition-all duration-300 ${
                            activeTab === 'likedListings' 
                                ? 'tab-active bg-primary text-primary-content shadow-lg' 
                                : 'hover:bg-base-200'
                        }`} 
                        onClick={() => setActiveTab('likedListings')}
                    >
                        <Heart size={18} className="mr-2" />
                        My Interests ({stats.likedItems})
                    </a>
                </div>

                {/* Content */}
                <div className="card bg-base-100 shadow-xl rounded-2xl border border-base-300">
                    <div className="card-body">
                        {activeTab === 'myListings' && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="card-title text-2xl text-primary">
                                        <List className="mr-2" />
                                        Manage My Listings
                                    </h2>
                                    <div className="badge badge-primary badge-lg">
                                        {stats.totalListings} Total
                                    </div>
                                </div>
                                
                                {myListings.length === 0 ? (
                                    <div className="text-center py-16 bg-gradient-to-br from-base-200/50 to-base-300/30 rounded-2xl">
                                        <div className="bg-primary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                            <Home size={48} className="text-primary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-base-content mb-2">No Listings Yet</h3>
                                        <p className="text-base-content/60 mb-8 max-w-md mx-auto">
                                            Start your journey by creating your first property listing. 
                                            It's easy and takes just a few minutes!
                                        </p>
                                        <Link to="/add-listing" className="btn btn-primary btn-lg shadow-lg">
                                            <PlusCircle size={20} className="mr-2" />
                                            Create First Listing
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {myListings.map(item => (
                                            <div key={item._id} className="card bg-gradient-to-r from-base-100 to-base-200/50 border border-base-300 shadow-lg hover:shadow-xl transition-all duration-300">
                                                <div className="card-body">
                                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div>
                                                                    <h3 className="card-title text-xl mb-2">{item.title}</h3>
                                                                    <div className="flex items-center text-base-content/70 mb-2">
                                                                        <MapPin size={16} className="mr-1" />
                                                                        <span>{item.location}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-success mb-1">
                                                                        ৳{item.rentAmount}
                                                                    </div>
                                                                    <div className="text-sm text-base-content/60">per month</div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-wrap gap-3 mb-4">
                                                                <div className={`badge ${item.availability ? 'badge-success' : 'badge-error'} badge-lg`}>
                                                                    {item.availability ? (
                                                                        <>
                                                                            <CheckCircle size={14} className="mr-1" />
                                                                            Available
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <XCircle size={14} className="mr-1" />
                                                                            Taken
                                                                        </>
                                                                    )}
                                                                </div>
                                                                
                                                                <div className="badge badge-primary badge-lg">
                                                                    <Heart size={14} className="mr-1" />
                                                                    {item.likeCount || 0} Likes
                                                                </div>
                                                                
                                                                {item.createdAt && (
                                                                    <div className="badge badge-ghost badge-lg">
                                                                        <Calendar size={14} className="mr-1" />
                                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                            <Link 
                                                                to={`/details/${item._id}`} 
                                                                className="btn btn-outline btn-info btn-sm"
                                                            >
                                                                <Eye size={14} className="mr-1" />
                                                                View
                                                            </Link>
                                                            <Link 
                                                                to={`/update-listing/${item._id}`} 
                                                                className="btn btn-outline btn-primary btn-sm"
                                                            >
                                                                <Edit size={14} className="mr-1" />
                                                                Edit
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(item._id, item.title)} 
                                                                className="btn btn-outline btn-error btn-sm" 
                                                                disabled={deleteLoading === item._id}
                                                            >
                                                                {deleteLoading === item._id ? (
                                                                    <span className="loading loading-spinner loading-xs"></span>
                                                                ) : (
                                                                    <>
                                                                        <Trash2 size={14} className="mr-1" />
                                                                        Delete
                                                                    </>
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'likedListings' && (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="card-title text-2xl text-primary">
                                        <Heart className="mr-2" />
                                        My Interest Listings
                                    </h2>
                                    <div className="badge badge-secondary badge-lg">
                                        {stats.likedItems} Interested
                                    </div>
                                </div>
                                
                                {likedListings.length === 0 ? (
                                    <div className="text-center py-16 bg-gradient-to-br from-base-200/50 to-base-300/30 rounded-2xl">
                                        <div className="bg-secondary/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                                            <Heart size={48} className="text-secondary" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-base-content mb-2">No Interested Listings</h3>
                                        <p className="text-base-content/60 mb-8 max-w-md mx-auto">
                                            Browse through available properties and show interest in the ones you like. 
                                            They'll appear here for easy access!
                                        </p>
                                        <Link to="/browse" className="btn btn-secondary btn-lg shadow-lg">
                                            <Star size={20} className="mr-2" />
                                            Browse Listings
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="grid gap-6">
                                        {likedListings.map(item => (
                                            <div key={item._id} className="card bg-gradient-to-r from-base-100 to-secondary/5 border border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300">
                                                <div className="card-body">
                                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <div>
                                                                    <h3 className="card-title text-xl mb-2">{item.title}</h3>
                                                                    <div className="flex items-center text-base-content/70 mb-2">
                                                                        <MapPin size={16} className="mr-1" />
                                                                        <span>{item.location}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="text-2xl font-bold text-success mb-1">
                                                                        ৳{item.rentAmount}
                                                                    </div>
                                                                    <div className="text-sm text-base-content/60">per month</div>
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-wrap gap-3 mb-4">
                                                                <div className="badge badge-secondary badge-lg">
                                                                    <Heart size={14} className="mr-1" />
                                                                    Interested
                                                                </div>
                                                                
                                                                <div className="badge badge-ghost badge-lg">
                                                                    <User size={14} className="mr-1" />
                                                                    Posted by {item.userName}
                                                                </div>
                                                                
                                                                {item.likeCount && (
                                                                    <div className="badge badge-primary badge-lg">
                                                                        <ThumbsUp size={14} className="mr-1" />
                                                                        {item.likeCount} Total Likes
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex flex-col sm:flex-row gap-2">
                                                            <Link 
                                                                to={`/details/${item._id}`} 
                                                                className="btn btn-primary btn-lg shadow-lg"
                                                            >
                                                                <Eye size={16} className="mr-2" />
                                                                View Details
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyListings;