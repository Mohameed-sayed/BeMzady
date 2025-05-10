import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { categoryService, itemService } from "./services/api"
import { AuthContext } from "./contexts/AuthContext"
import { toast } from "react-toastify"

const AddItem = () => {
    const navigate = useNavigate()
    const { user } = useContext(AuthContext)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        quantity: "",
        category: "",
        seller: user?._id || localStorage.getItem("user_id") || "",
        itemImage: null,
    })

    useEffect(() => {
        // Fetch categories when component mounts
        const fetchCategories = async () => {
            try {
                const response = await categoryService.getCategories({ limit: 100 })
                // Make sure we're accessing the correct data structure
                setCategories(response.data.data || [])
                console.log("Categories fetched:", response.data)
            } catch (error) {
                console.error("Error fetching categories:", error)
                toast.error("Failed to fetch categories")
                // Initialize with empty array to prevent map errors
                setCategories([])
            }
        }
        fetchCategories()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setFormData(prev => ({
            ...prev,
            itemImage: file
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const formDataToSend = new FormData()

            // Add all the text fields
            formDataToSend.append("title", formData.title)
            formDataToSend.append("description", formData.description)
            formDataToSend.append("price", formData.price)
            formDataToSend.append("quantity", formData.quantity)
            formDataToSend.append("category", formData.category)

            // Add the seller ID
            const sellerId = user?._id || localStorage.getItem("user_id")
            formDataToSend.append("seller", sellerId)

            // Add the image if it exists
            if (formData.itemImage) {
                formDataToSend.append("itemImage", formData.itemImage)
            }

            // Use the itemService to create the item
            const response = await itemService.createItem(formDataToSend)

            console.log("Item created:", response.data)
            toast.success("Item added successfully!")
            navigate("/items")
        } catch (error) {
            console.error("Error creating item:", error)
            toast.error(error.response?.data?.message || "Failed to add item")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="1"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                        <option value="">Select a category</option>
                        {Array.isArray(categories) && categories.map(category => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Item Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="mt-1 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Item"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddItem