import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { auth } from '../firebase/firebase.config';
import { Heart, MapPin, BedDouble, CircleDollarSign, UserCircle, Phone, Mail, ShieldCheck, AlertCircle, Dog, Cigarette, Moon } from 'lucide-react';

const RoomDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useContext(AuthContext);

    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likeLoading, setLikeLoading] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            toast.error("Please log in to view room details.");
            navigate('/login');
            return;
        }

        const fetchRoomData = async () => {
            try {
                setLoading(true);
                const token = await auth.currentUser.getIdToken();
                const endpoint = `https://room-mate-finder-server-zeta.vercel.app/rooms/${id}`;

                const [roomRes, likeStatusRes] = await Promise.all([
                    fetch(endpoint, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${endpoint}/like-status`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);
                
                if (!roomRes.ok) throw new Error('Room not found or has been removed.');
                
                const roomData = await roomRes.json();
                setRoom(roomData);
                
                if (likeStatusRes.ok) {
                    const likeStatusData = await likeStatusRes.json();
                    setLikeCount(likeStatusData.likeCount);
                    setHasLiked(likeStatusData.hasLiked);
                } else {
                    setLikeCount(roomData.likeCount || 0);
                }

            } catch (err) {
                toast.error(err.message);
                if(err.message.includes('not found')) {
                    setTimeout(() => navigate('/browse'), 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoomData();
    }, [id, user, authLoading, navigate]);

    const handleLikeToggle = async () => {
        if (!user || !room || likeLoading) return;
        if (user.uid === room.userUid) {
            toast.error("You cannot show interest in your own post.");
            return;
        }

        setLikeLoading(true);
        try {
            const token = await auth.currentUser.getIdToken(true);
            const endpoint = `https://room-mate-finder-server-zeta.vercel.app/rooms/${id}/like`;
            const method = hasLiked ? 'DELETE' : 'POST';

            const response = await fetch(endpoint, {
                method,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error((await response.json()).message || 'Failed to update interest.');

            const result = await response.json();
            setLikeCount(result.likeCount);
            setHasLiked(result.hasLiked);

            toast.success(result.hasLiked ? 'Thank you for your interest!' : 'Your interest has been removed.');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLikeLoading(false);
        }
    };
    
    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <h2 className="text-xl font-semibold text-base-content/80 mt-4">Loading Room Details...</h2>
            </div>
        );
    }
    
    if (!room) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 p-4 text-center">
                <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Room Not Found</h2>
                <p className="my-4">The listing you are looking for does not exist or has been removed.</p>
                <Link to="/browse" className="btn btn-primary">Browse Other Rooms</Link>
            </div>
        );
    }
    
    return (
        <div className="bg-base-200/40 pt-20">
            <Toaster position="top-right" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                
                <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-lg mb-8">
                    <div className="card-body p-6 md:p-8">
                        <h1 className="card-title text-3xl md:text-4xl font-extrabold">{room.title}</h1>
                        <div className="flex items-center text-lg mt-2 opacity-90">
                            <MapPin size={20} className="mr-2" />
                            <span>{room.location}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column: Room Details --- */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card bg-base-100 shadow-xl rounded-2xl p-6 md:p-8">
                            <h2 className="card-title text-2xl mb-4">Description</h2>
                            <p className="text-base-content/80 whitespace-pre-wrap leading-relaxed">{room.description}</p>
                        </div>
                        
                        <div className="card bg-base-100 shadow-xl rounded-2xl p-6 md:p-8">
                            <h3 className="card-title text-xl mb-4">Key Information</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                               <div className="p-4 bg-base-200/60 rounded-lg">
                                    <div className="font-semibold text-base-content/70 flex items-center mb-1"><CircleDollarSign size={16} className="mr-2" /> Monthly Rent</div>
                                    <div className="text-2xl font-bold text-success">৳{room.rentAmount}</div>
                               </div>
                               <div className="p-4 bg-base-200/60 rounded-lg">
                                    <div className="font-semibold text-base-content/70 flex items-center mb-1"><BedDouble size={16} className="mr-2" /> Room Type</div>
                                    <div className="text-xl font-bold text-base-content">{room.roomType}</div>
                               </div>
                               <div className="p-4 bg-base-200/60 rounded-lg">
                                    <div className="font-semibold text-base-content/70 flex items-center mb-1">Availability</div>
                                    <div className={`badge badge-lg ${room.availability ? 'badge-success' : 'badge-error'}`}>{room.availability ? 'Available' : 'Taken'}</div>
                               </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl rounded-2xl p-6 md:p-8">
                            <h3 className="card-title text-xl mb-4">Lifestyle Preferences</h3>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className={`flex items-center p-3 rounded-lg ${room.lifestylePrefs?.pets ? 'bg-success/10 text-success-content' : 'bg-base-200 text-base-content/60'}`}><Dog size={18} className="mr-3" /> Pets {room.lifestylePrefs?.pets ? 'Allowed' : 'Not Allowed'}</div>
                                <div className={`flex items-center p-3 rounded-lg ${room.lifestylePrefs?.smoking ? 'bg-success/10 text-success-content' : 'bg-base-200 text-base-content/60'}`}><Cigarette size={18} className="mr-3" /> Smoking {room.lifestylePrefs?.smoking ? 'Allowed' : 'Not Allowed'}</div>
                                <div className={`flex items-center p-3 rounded-lg ${room.lifestylePrefs?.nightOwl ? 'bg-success/10 text-success-content' : 'bg-base-200 text-base-content/60'}`}><Moon size={18} className="mr-3" /> Night Owl {room.lifestylePrefs?.nightOwl ? 'Friendly' : 'Not Preferred'}</div>
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: Actions and Owner Details --- */}
                    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
                         <div className="card bg-base-100 shadow-xl rounded-2xl p-6 text-center">
                            <p className="text-base-content/70 mb-2">{likeCount} people are interested</p>
                            <button
                                onClick={handleLikeToggle}
                                disabled={likeLoading}
                                className={`btn btn-lg w-full ${hasLiked ? 'btn-secondary' : 'btn-primary'}`}
                            >
                                <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} className="mr-2" />
                                {likeLoading ? 'Processing...' : hasLiked ? 'You are Interested' : 'Show Interest'}
                            </button>
                            {hasLiked && (
                                <div className="mt-4 p-4 bg-success/10 text-success rounded-lg text-left">
                                    <h3 className="font-bold mb-2 flex items-center"><ShieldCheck size={18} className="mr-2" />Contact Info Revealed</h3>
                                    <p className="flex items-center break-all"><Mail size={14} className="mr-2 flex-shrink-0" /> {room.contactInfo || room.userEmail}</p>
                                    <p className="flex items-center mt-1"><Phone size={14} className="mr-2" /> {room.contactNumber || 'Not provided'}</p>
                                </div>
                            )}
                        </div>

                         <div className="card bg-base-100 shadow-xl rounded-2xl p-6">
                            <h3 className="card-title text-xl mb-4">Posted By</h3>
                            <div className="flex items-center">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                                        <span>{room.userName?.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="font-semibold text-base-content">{room.userName}</p>
                                    <p className="text-sm text-base-content/60">Room Owner</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetails;