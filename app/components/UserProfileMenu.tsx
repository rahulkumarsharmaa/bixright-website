// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { useAuth } from "@/app/context/AuthContext";
// import { FiUser } from "react-icons/fi";
// import { m, AnimatePresence } from "framer-motion";

// export default function UserProfileMenu() {
//   const { user, logout } = useAuth();
//   const [open, setOpen] = useState(false);

//   if (!user) {
//     return (
//       <button
//         onClick={() => (window.location.href = "/user/login")}
//         className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-sm"
//       >
//         Login
//       </button>
//     );
//   }

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setOpen((v) => !v)}
//         className="flex items-center gap-2"
//       >
//         <div className="w-9 h-9 rounded-full overflow-hidden">
//           {user.image ? (
//             <Image
//               src={user.image}
//               width={40}
//               height={40}
//               alt="User"
//               className="object-cover object-top"
//             />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700">
//               {user.name.charAt(0).toUpperCase()}
//             </div>
//           )}
//         </div>
//       </button>

//       <AnimatePresence>
//         {open && (
//           <m.div
//             initial={{ opacity: 0, y: 6 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 6 }}
//             transition={{ duration: 0.18 }}
//             className="absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-xl border p-2 z-50"
//           >
//             <button
//               onClick={() => (window.location.href = "/profile")}
//               className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100  text-sm"
//             >
//               My Profile
//             </button>

//             <button
//               onClick={() => (window.location.href = "/orders")}
//               className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
//             >
//               My Orders
//             </button>

//             <button
//               onClick={logout}
//               className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-red-600"
//             >
//               Logout
//             </button>
//           </m.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
