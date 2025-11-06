// import React, { useEffect, useId, useRef, useState } from "react";
// import { AnimatePresence, motion } from "motion/react";
// import { useOutsideClick } from "../hooks/use-outside-click";
// import { useSelector } from "react-redux";

// export function ExpandableCardDemo() {
//   const [active, setActive] = useState(null);
//   const { userRoadmaps, fetch_loading } = useSelector(state => state.roadmap);
//   const ref = useRef(null);
//   const id = useId();

//   const cards = userRoadmaps.map((roadmap) => ({
//   description: roadmap.roadmapData?.difficulty,
//   title: roadmap.roadmapData?.title,
//   src: "/images/code.png",
//   ctaText: "Learn",
//   ctaLink: "/roadmap/" + roadmap?._id,
//   content: () => {
//     return <p>{roadmap.roadmapData?.description}</p>;
//   },
// }));
//   useEffect(() => {
//     function onKeyDown(event) {
//       if (event.key === "Escape") {
//         setActive(false);
//       }
//     }

//     if (active && typeof active === "object") {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }

//     window.addEventListener("keydown", onKeyDown);
//     return () => window.removeEventListener("keydown", onKeyDown);
//   }, [active]);

//   useOutsideClick(ref, () => setActive(null));

//   return (
//     <>
//       <AnimatePresence>
//         {active && typeof active === "object" && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 h-full w-full z-10" />
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {active && typeof active === "object" ? (
//           <div className="fixed inset-0  grid place-items-center z-[100]">
//             <motion.button
//               key={`button-${active.title}-${id}`}
//               layout
//               initial={{
//                 opacity: 0,
//               }}
//               animate={{
//                 opacity: 1,
//               }}
//               exit={{
//                 opacity: 0,
//                 transition: {
//                   duration: 0.05,
//                 },
//               }}
//               className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
//               onClick={() => setActive(null)}>
//               <CloseIcon />
//             </motion.button>
//             <motion.div
//               layoutId={`card-${active.title}-${id}`}
//               ref={ref}
//               className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden">
//               <motion.div layoutId={`image-${active.title}-${id}`}>
//                 <img
//                   width={200}
//                   height={200}
//                   src={active.src}
//                   alt={active.title}
//                   className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center" />
//               </motion.div>

//               <div>
//                 <div className="flex justify-between items-start p-4">
//                   <div className="">
//                     <motion.h3
//                       layoutId={`title-${active.title}-${id}`}
//                       className="font-bold text-neutral-700 dark:text-neutral-200">
//                       {active.title}
//                     </motion.h3>
//                     <motion.p
//                       layoutId={`description-${active.description}-${id}`}
//                       className="text-neutral-600 dark:text-neutral-400">
//                       {active.description}
//                     </motion.p>
//                   </div>

//                   <motion.a
//                     layoutId={`button-${active.title}-${id}`}
//                     href={active.ctaLink}
//                     target="_blank"
//                     className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white">
//                     {active.ctaText}
//                   </motion.a>
//                 </div>
//                 <div className="pt-4 relative px-4">
//                   <motion.div
//                     layout
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
//                     {typeof active.content === "function"
//                       ? active.content()
//                       : active.content}
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         ) : null}
//       </AnimatePresence>
//       <ul className="max-w-2xl mx-auto w-full gap-4">
//         {cards.map((card, index) => (
//           <motion.div
//             layoutId={`card-${card.title}-${id}`}
//             key={`card-${card.title}-${id}`}
//             onClick={() => setActive(card)}
//             className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer">
//             <div className="flex gap-4 flex-col md:flex-row ">
//               <motion.div layoutId={`image-${card.title}-${id}`}>
//                 <img
//                   width={100}
//                   height={100}
//                   src={card.src}
//                   alt={card.title}
//                   className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top" />
//               </motion.div>
//               <div className="">
//                 <motion.h3
//                   layoutId={`title-${card.title}-${id}`}
//                   className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left">
//                   {card.title}
//                 </motion.h3>
//                 <motion.p
//                   layoutId={`description-${card.description}-${id}`}
//                   className="text-neutral-600 dark:text-neutral-400 text-center md:text-left">
//                   {card.description}
//                 </motion.p>
//               </div>
//             </div>
//             <motion.button
//               layoutId={`button-${card.title}-${id}`}
//               className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0">
//               {card.ctaText}
//             </motion.button>
//           </motion.div>
//         ))}
//       </ul>
//     </>
//   );
// }

// export const CloseIcon = () => {
//   return (
//     <motion.svg
//       initial={{
//         opacity: 0,
//       }}
//       animate={{
//         opacity: 1,
//       }}
//       exit={{
//         opacity: 0,
//         transition: {
//           duration: 0.05,
//         },
//       }}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="h-4 w-4 text-black">
//       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//       <path d="M18 6l-12 12" />
//       <path d="M6 6l12 12" />
//     </motion.svg>
//   );
// };



// import { useEffect, useId, useRef, useState } from "react"
// import { AnimatePresence, motion } from "motion/react"
// import { useOutsideClick } from "../hooks/use-outside-click"
// import { useSelector } from "react-redux"

// export function ExpandableCardDemo() {
//   const [active, setActive] = useState(null)
//   const { userRoadmaps, fetch_loading } = useSelector((state) => state.roadmap)
//   const ref = useRef(null)
//   const id = useId()

//   const cards = userRoadmaps.map((roadmap) => ({
//     description: roadmap.roadmapData?.difficulty,
//     title: roadmap.roadmapData?.title,
//     src: "/images/code.png",
//     ctaText: "Learn",
//     ctaLink: "/roadmap/" + roadmap?._id,
//     content: () => {
//       return <p>{roadmap.roadmapData?.description}</p>
//     },
//   }))

//   useEffect(() => {
//     function onKeyDown(event) {
//       if (event.key === "Escape") {
//         setActive(false)
//       }
//     }

//     if (active && typeof active === "object") {
//       document.body.style.overflow = "hidden"
//     } else {
//       document.body.style.overflow = "auto"
//     }

//     window.addEventListener("keydown", onKeyDown)
//     return () => window.removeEventListener("keydown", onKeyDown)
//   }, [active])

//   useOutsideClick(ref, () => setActive(null))

//   return (
//     <>
//       <AnimatePresence>
//         {active && typeof active === "object" && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/20 h-full w-full z-10"
//           />
//         )}
//       </AnimatePresence>
//       <AnimatePresence>
//         {active && typeof active === "object" ? (
//           <div className="fixed inset-0 grid place-items-center z-[100] p-4">
//             <motion.button
//               key={`button-${active.title}-${id}`}
//               layout
//               initial={{
//                 opacity: 0,
//               }}
//               animate={{
//                 opacity: 1,
//               }}
//               exit={{
//                 opacity: 0,
//                 transition: {
//                   duration: 0.05,
//                 },
//               }}
//               className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
//               onClick={() => setActive(null)}
//             >
//               <CloseIcon />
//             </motion.button>
//             <motion.div
//               layoutId={`card-${active.title}-${id}`}
//               ref={ref}
//               className="w-full max-w-2xl h-full md:h-fit md:max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
//             >
//               <motion.div layoutId={`image-${active.title}-${id}`}>
//                 <img
//                   width={200}
//                   height={200}
//                   src={active.src || "/placeholder.svg"}
//                   alt={active.title}
//                   className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
//                 />
//               </motion.div>

//               <div>
//                 <div className="flex justify-between items-start p-4">
//                   <div className="">
//                     <motion.h3
//                       layoutId={`title-${active.title}-${id}`}
//                       className="font-bold text-neutral-700 dark:text-neutral-200"
//                     >
//                       {active.title}
//                     </motion.h3>
//                     <motion.p
//                       layoutId={`description-${active.description}-${id}`}
//                       className="text-neutral-600 dark:text-neutral-400"
//                     >
//                       {active.description}
//                     </motion.p>
//                   </div>

//                   <motion.a
//                     layoutId={`button-${active.title}-${id}`}
//                     href={active.ctaLink}
//                     target="_blank"
//                     className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
//                     rel="noreferrer"
//                   >
//                     {active.ctaText}
//                   </motion.a>
//                 </div>
//                 <div className="pt-4 relative px-4">
//                   <motion.div
//                     layout
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     exit={{ opacity: 0 }}
//                     className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
//                   >
//                     {typeof active.content === "function" ? active.content() : active.content}
//                   </motion.div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         ) : null}
//       </AnimatePresence>
//       <div className="w-full min-h-screen bg-background p-4 md:p-8 lg:p-12">
//         <div className="mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
//             {cards.map((card, index) => (
//               <motion.div
//                 layoutId={`card-${card.title}-${id}`}
//                 key={`card-${card.title}-${id}`}
//                 onClick={() => setActive(card)}
//                 className="group flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-800"
//               >
//                 <motion.div
//                   layoutId={`image-${card.title}-${id}`}
//                   className="overflow-hidden h-48 md:h-40 bg-neutral-100 dark:bg-neutral-800"
//                 >
//                   <img
//                     width={300}
//                     height={200}
//                     src={card.src || "/placeholder.svg"}
//                     alt={card.title}
//                     className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
//                   />
//                 </motion.div>

//                 <div className="flex flex-col flex-1 p-4 md:p-5">
//                   <motion.h3
//                     layoutId={`title-${card.title}-${id}`}
//                     className="font-bold text-lg text-neutral-800 dark:text-neutral-200 line-clamp-2"
//                   >
//                     {card.title}
//                   </motion.h3>
//                   <motion.p
//                     layoutId={`description-${card.description}-${id}`}
//                     className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-1"
//                   >
//                     {card.description}
//                   </motion.p>

//                   <motion.button
//                     layoutId={`button-${card.title}-${id}`}
//                     className="mt-auto pt-4 px-4 py-2 text-sm rounded-full font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-green-500 hover:text-white text-black dark:text-white transition-colors w-full"
//                   >
//                     {card.ctaText}
//                   </motion.button>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export const CloseIcon = () => {
//   return (
//     <motion.svg
//       initial={{
//         opacity: 0,
//       }}
//       animate={{
//         opacity: 1,
//       }}
//       exit={{
//         opacity: 0,
//         transition: {
//           duration: 0.05,
//         },
//       }}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       className="h-4 w-4 text-black"
//     >
//       <path stroke="none" d="M0 0h24v24H0z" fill="none" />
//       <path d="M18 6l-12 12" />
//       <path d="M6 6l12 12" />
//     </motion.svg>
//   )
// }


import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useOutsideClick } from "../hooks/use-outside-click"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

function DeleteConfirmationModal({ isOpen, onConfirm, onCancel, title }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[200]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[201] p-4"
          >
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-sm w-full p-6 border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Delete Roadmap?</h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{title}"</span>? This action cannot be
                undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function ExpandableCardDemo() {
  const [active, setActive] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, title: "" })
  const { userRoadmaps, fetch_loading } = useSelector((state) => state.roadmap)
  const ref = useRef(null)
  const id = useId()

  const cards = userRoadmaps.map((roadmap) => ({
    _id: roadmap._id,
    description: roadmap.roadmapData?.difficulty,
    title: roadmap.roadmapData?.title,
    src: "/images/code.png",
    ctaText: "Learn",
    ctaLink: "/roadmap/" + roadmap?._id,
    content: () => {
      return <p>{roadmap.roadmapData?.description}</p>
    },
  }))

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(false)
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [active])

  useOutsideClick(ref, () => setActive(null))

  const handleDeleteClick = (e, cardId, cardTitle) => {
    e.stopPropagation()
    setDeleteConfirm({ isOpen: true, id: cardId, title: cardTitle })
  }

  const handleConfirmDelete = () => {
    console.log("Delete roadmap with ID:", deleteConfirm.id)
    // Replace with: dispatch(deleteRoadmap(deleteConfirm.id))
    setDeleteConfirm({ isOpen: false, id: null, title: "" })
  }

  return (
    <>
      <DeleteConfirmationModal
        isOpen={deleteConfirm.isOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, id: null, title: "" })}
        title={deleteConfirm.title}
      />
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-2xl h-full md:h-fit md:max-h-[90vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src || "/placeholder.svg"}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-center"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4 gap-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleDeleteClick(e, active._id, active.title)}
                      className="px-3 py-3 text-sm rounded-full font-bold bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center"
                      title="Delete roadmap"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                    
                    <Link
                    className="px-4 py-3 text-sm rounded-full font-bold bg-slate-500 hover:bg-slate-600 text-white transition-colors"
                    to={active.ctaLink}
                    >
                    
                    <motion.div
                      layoutId={`button-${active.title}-${id}`}
                      rel="noreferrer"
                    >
                      {active.ctaText}
                    </motion.div>
                    </Link>
                  </div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function" ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <div className="w-full min-h-screen bg-background p-4 md:p-8 lg:p-12">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {cards.map((card, index) => (
              <motion.div
                layoutId={`card-${card.title}-${id}`}
                key={`card-${card.title}-${id}`}
                onClick={() => setActive(card)}
                className="group flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-neutral-200 dark:border-neutral-800 relative"
              >
                <motion.button
                  onClick={(e) => handleDeleteClick(e, card._id, card.title)}
                  className="absolute top-2 right-2 z-20 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  title="Delete roadmap"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                </motion.button>
                <motion.div
                  layoutId={`image-${card.title}-${id}`}
                  className="overflow-hidden h-48 md:h-40 bg-neutral-100 dark:bg-neutral-800"
                >
                  <img
                    width={300}
                    height={200}
                    src={card.src || "/placeholder.svg"}
                    alt={card.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </motion.div>

                <div className="flex flex-col flex-1 p-4 md:p-5">
                  <motion.h3
                    layoutId={`title-${card.title}-${id}`}
                    className="font-bold text-lg text-neutral-800 dark:text-neutral-200 line-clamp-2"
                  >
                    {card.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${card.description}-${id}`}
                    className="text-sm text-neutral-600 dark:text-neutral-400 pb-5 pt-1 line-clamp-1"
                  >
                    {card.description}
                  </motion.p>

                  <Link
                  className="mt-auto cursor-pointer text-center px-4 py-3 text-sm rounded-full font-bold bg-slate-700 text-white transition-all duration-200 shadow-sm hover:shadow-md w-full"
                  to={`${card.ctaLink}`}>
                  <button
                    layoutId={`button-${card.title}-${id}`}
                    
                  >
                      {card.ctaText}
                  </button>
                    </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  )
}
