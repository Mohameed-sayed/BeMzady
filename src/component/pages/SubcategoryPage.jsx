// import React, { useState, useEffect } from "react"
// import { useParams, Link } from "react-router-dom"
// import { subcategoryService, auctionService } from "../services/api"
// import { ArrowRight, X, Search, Plus } from "lucide-react"
// import AuctionCard from "../auctions/AuctionCard"
// import RelatedAuctions from "../auctions/RelatedAuctions"

// const SubcategoryPage = () => {
//     const { id } = useParams()
//     const [subcategory, setSubcategory] = useState(null)
//     const [auctions, setAuctions] = useState([])
//     const [selectedAuction, setSelectedAuction] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch subcategory with auctions in one request
//                 const subcategoryResponse = await subcategoryService.getSubcategoryWithAuctions(id)
//                 console.log("Subcategory with auctions response:", subcategoryResponse.data)

//                 // Set subcategory data
//                 setSubcategory(subcategoryResponse.data.data)

//                 // Set auctions if available in the response
//                 console.log("Subcategory data structure:", subcategoryResponse.data)

//                 // Check different possible structures of the response
//                 let auctionsFromResponse = null;

//                 if (subcategoryResponse.data.data && Array.isArray(subcategoryResponse.data.data.auctions)) {
//                     console.log("Found auctions array in data.data.auctions")
//                     auctionsFromResponse = subcategoryResponse.data.data.auctions;
//                 } else if (subcategoryResponse.data.auctions && Array.isArray(subcategoryResponse.data.auctions)) {
//                     console.log("Found auctions array in data.auctions")
//                     auctionsFromResponse = subcategoryResponse.data.auctions;
//                 } else if (subcategoryResponse.data.data && Array.isArray(subcategoryResponse.data.data)) {
//                     // Maybe the data itself is the auctions array
//                     console.log("Checking if data.data is an array of auctions")
//                     const possibleAuctions = subcategoryResponse.data.data;
//                     if (possibleAuctions.length > 0 && possibleAuctions[0].title) {
//                         console.log("data.data appears to be an array of auctions")
//                         auctionsFromResponse = possibleAuctions;
//                     }
//                 }

//                 if (auctionsFromResponse) {
//                     console.log("Setting auctions from response:", auctionsFromResponse)
//                     setAuctions(auctionsFromResponse)
//                 } else {
//                     // If auctions are not included in the subcategory response, fetch them separately
//                     try {
//                         console.log("Fetching auctions separately for subcategory:", id)
//                         const auctionsResponse = await auctionService.getAuctions({
//                             subcategory: id,
//                             limit: 8
//                         })
//                         console.log("Auctions response:", auctionsResponse.data)

//                         // Check the structure of the response
//                         let auctionsData = [];
//                         if (auctionsResponse.data.data && Array.isArray(auctionsResponse.data.data)) {
//                             auctionsData = auctionsResponse.data.data;
//                         } else if (auctionsResponse.data.auctions && Array.isArray(auctionsResponse.data.auctions)) {
//                             auctionsData = auctionsResponse.data.auctions;
//                         } else if (Array.isArray(auctionsResponse.data)) {
//                             auctionsData = auctionsResponse.data;
//                         }

//                         console.log("Auctions data to be set:", auctionsData)
//                         setAuctions(auctionsData)
//                     } catch (auctionError) {
//                         console.error("Error fetching auctions for subcategory:", auctionError)
//                     }
//                 }
//             } catch (error) {
//                 console.error("Error fetching subcategory page data:", error)
//                 setError("Failed to load subcategory page. Please try again later.")
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchData()
//     }, [id])

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
//             </div>
//         )
//     }

//     if (error) {
//         return <div className="text-center py-12">{error}</div>
//     }

//     // Function to handle auction selection for showing related auctions
//     const handleAuctionSelect = (auction) => {
//         setSelectedAuction(auction)

//         // Scroll to related auctions section after a short delay to allow rendering
//         setTimeout(() => {
//             const relatedSection = document.getElementById('related-auctions')
//             if (relatedSection) {
//                 relatedSection.scrollIntoView({ behavior: 'smooth' })
//             }
//         }, 100)
//     }

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <h1 className="text-3xl font-bold mb-4">{subcategory?.name}</h1>

//             {subcategory?.description && (
//                 <div className="mb-6 text-gray-600 dark:text-gray-300">
//                     <p>{subcategory.description}</p>
//                 </div>
//             )}

//             {subcategory?.parentCategory && (
//                 <div className="mb-6">
//                     <Link
//                         to={`/category/${subcategory.parentCategory._id}`}
//                         className="inline-flex items-center text-rose-600 hover:text-rose-700"
//                     >
//                         <ArrowRight size={16} className="mr-1 transform rotate-180" />
//                         Back to {subcategory.parentCategory.name}
//                     </Link>
//                 </div>
//             )}

//             {/* Auctions in this subcategory */}
//             <section>
//                 <div className="flex justify-between items-center mb-8">
//                     <h2 className="text-2xl font-bold">Auctions</h2>
//                     <Link
//                         to={`/auctions?subcategory=${id}`}
//                         className="flex items-center text-rose-600 hover:text-rose-700 transition-colors"
//                     >
//                         View All <ArrowRight size={16} className="ml-1" />
//                     </Link>
//                 </div>

//                 {auctions.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {auctions.map((auction) => (
//                             <div key={auction._id} className="relative group">
//                                 <AuctionCard auction={auction} />
//                                 <button
//                                     onClick={(e) => {
//                                         e.stopPropagation();
//                                         handleAuctionSelect(auction);
//                                     }}
//                                     className="absolute bottom-4 right-4 bg-rose-100 text-rose-600 hover:bg-rose-200 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
//                                     title="Show related auctions"
//                                 >
//                                     <Search size={16} />
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
//                         <p className="text-gray-500 dark:text-gray-400">No auctions found in this subcategory.</p>
//                         <Link
//                             to="/create-auction"
//                             className="mt-4 inline-flex items-center px-6 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
//                         >
//                             <Plus size={16} className="mr-2" />
//                             Create an Auction
//                         </Link>
//                     </div>
//                 )}
//             </section>

//             {/* Related Auctions Section */}
//             {selectedAuction && (
//                 <section id="related-auctions" className="mt-12">
//                     <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg relative">
//                         <button
//                             onClick={() => setSelectedAuction(null)}
//                             className="absolute top-4 right-4 p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//                             aria-label="Close related auctions"
//                         >
//                             <X size={18} />
//                         </button>
//                         <h2 className="text-2xl font-bold mb-4">Related to "{selectedAuction.title}"</h2>
//                         <RelatedAuctions
//                             categoryId={subcategory?.parentCategory?._id}
//                             currentAuctionId={selectedAuction._id}
//                         />
//                     </div>
//                 </section>
//             )}
//         </div>
//     )
// }

// export default SubcategoryPage
