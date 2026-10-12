// import React from 'react'
// import {ArrowLeftIcon} from "lucide-react";
// import {Link, useNavigate} from "react-router";
// import toast from "react-hot-toast";
// import axios from "axios";
//
// const CreateNotePage = () => {
//     const [title, setTitle] = React.useState('');
//     const [description, setDescription] = React.useState('');
//     const [loading, setLoading] = React.useState(false);
//     const navigate = useNavigate();
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if(!title.trim() || !description.trim()){
//             toast.error("All fields are required");
//             return;
//         }
//         setLoading(true);
//         try{
//             await axios.post("http://localhost:6001/api/notes", {
//                 title,
//                 description,
//             })
//             toast.success("Successfully created new note");
//             navigate("/");
//         }catch(err){
//             toast.error("Something went wrong");
//             console.log(err);
//         }finally {
//             setLoading(false);
//         }
//     }
//     return (
//         <div className="min-h-screen bg-base-200">
//             <div className="container mx-auto px-4 py-8">
//             <div className="max-w-2xl mx-auto">
//                 <Link to={"/"} className="btn btn-ghost mb-6">
//                     <ArrowLeftIcon className="size-5"/>
//                     Back to Notes
//                 </Link>
//                 <div className="card bg-base-100">
//                     <div className="card-body ">
//                         <h2 className="card-title text-2xl mb-4">Create New Note</h2>
//                         <form onSubmit={handleSubmit}>
//                             <div className="flex flex-col mb-5 w-full">
//                                 <label className="label mb-2">
//                                     <span className="label-text">Title</span>
//                                 </label>
//                                 <input
//                                     type="text"
//                                     placeholder="Note title"
//                                     className="input input-bordered w-full"
//                                     value={title}
//                                     onChange={(e) => setTitle(e.target.value)}
//                                 />
//                             </div>
//                             <div className="flex flex-col mb-5 w-full">
//                                 <label className="label mb-2">
//                                     <span className="label-text">Content</span>
//                                 </label>
//                                 <textarea
//                                     placeholder="Write your note here..."
//                                     className="textarea textarea-bordered h-32 w-full"
//                                     value={description}
//                                     onChange={(e) => setDescription(e.target.value)}
//                                 />
//                             </div>
//                             <div className="card-actions justify-end">
//                                 <button type="submit" className="btn btn-primary" disabled={loading}>
//                                     {loading? "Creating Note..." : "Create Note"}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//             </div>
//         </div>
//     )
// }
// export default CreateNotePage


import React from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../lib/axios.js";

const CreateNotePage = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error("All fields are required");
            return;
        }

        setLoading(true);

        try {
            await api.post("/notes", {
                title: title.trim(),
                description: description.trim(),
            });

            toast.success("Successfully created new note");
            navigate("/");
        } catch (err) {
            console.error("Create note error:", err.response?.data || err);
            toast.error(
                err.response?.data?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100">
            <div className="container mx-auto px-4 py-8 ">
                <div className="max-w-2xl mx-auto">
                    <Link to="/" className="btn btn-ghost mb-6">
                        <ArrowLeftIcon className="size-5" />
                        Back to Notes
                    </Link>

                    <div className="card bg-base-200">
                        <div className="card-body">
                            <h2 className="card-title text-2xl mb-4 ">
                                Create New Note
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col mb-5 w-full">
                                    <label className="label mb-2">
                                        <span className="label-text">Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Note title"
                                        className="input input-bordered w-full"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col mb-5 w-full">
                                    <label className="label mb-2">
                                        <span className="label-text">Content</span>
                                    </label>
                                    <textarea
                                        placeholder="Write your note here..."
                                        className="textarea textarea-bordered h-32 w-full"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <div className="card-actions justify-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? "Creating Note..." : "Create Note"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNotePage;
