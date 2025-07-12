import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 

const ProductDetail = () => {
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userReview, setUserReview] = useState({ rating: 0, comment: '' });
    const [userRole, setUserRole] = useState(null);

  const navigate = useNavigate();

    // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('https://goudhan.com/admin/api/user', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          console.log('Role ID', data);
          // if (data.success) {
             setUserRole(data.role_id);
          // }
        } catch (error) {
          console.error('Failed to fetch user role:', error);
        }
      }
    };
    fetchUserRole();
  }, []);
  
  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://goudhan.com/admin/api/product/${slug}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
          fetchRelatedProducts(data.product.category_id);
          fetchReviews(data.product.id);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [slug]);

  // Fetch related products
  const fetchRelatedProducts = async (categoryId) => {
    try {
        const response = await fetch(`https://goudhan.com/admin/api/products/category/${categoryId}?limit=4`);
        const data = await response.json();
        console.log('Related Products API Response:', data); // Debug log
        if (data.success) {
            const filteredProducts = data.products.filter(p => p.slug !== slug);
            console.log('Filtered Related Products:', filteredProducts);
            setRelatedProducts(filteredProducts);
        }
    } catch (error) {
        console.error('Failed to fetch related products:', error);
    }
};

  // Fetch reviews
  const fetchReviews = async (productId) => {
    try {
      const response = await fetch(`https://goudhan.com/admin/api/reviews/${productId}`);
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  // Handle quantity increment/decrement
  const increment = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    handleUpdateQuantity(newQty);
  };
  const decrement = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      handleUpdateQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to add products to your cart.',
        confirmButtonColor: '#f97316',
      });
      return;
    }
    if (userRole == 2) {
      Swal.fire({
        icon: 'error',
        title: 'Action Not Allowed',
        text: 'Sellers cannot add products to cart. Please create a buyer account to proceed.',
        confirmButtonColor: '#f97316',
      });
      return;
    }
    if (!product || quantity < 1) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Invalid product or quantity.',
        confirmButtonColor: '#f97316',
      });
      return;
    }
    const total_price = (parseFloat(product.selling_price) * quantity).toFixed(2);
    const cartData = {
      product_id: product.id,
      quantity: quantity,
      total_price: total_price,
    };
    try {
      const response = await fetch('https://goudhan.com/admin/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartData),
      });
      const data = await response.json();
      if (data.success) {
        navigate('/cart');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message || 'Failed to add product to cart',
          confirmButtonColor: '#f97316',
        });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An error occurred. Please try again.',
        confirmButtonColor: '#f97316',
      });
    }
  };

  // Handle quantity update
  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to update your cart.');
      return;
    }
    try {
      const response = await fetch(`https://goudhan.com/admin/api/cart/update/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      const data = await response.json();
      if (response.ok && data.message === 'Cart updated successfully') {
        console.log('Cart updated successfully:', data);
      } else {
        console.log('Failed to update cart:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // Handle review submission
 const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please log in to submit a review.');
        return;
    }
    if (userReview.rating < 1 || userReview.rating > 5) {
        alert('Please select a valid rating (1-5).');
        return;
    }
    try {
        const response = await fetch(`https://goudhan.com/admin/api/reviews/${product.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userReview),
        });
        const data = await response.json();
        if (data.success) {
            setReviews([...reviews, { ...userReview, created_at: new Date().toISOString() }]);
            setUserReview({ rating: 0, comment: '' });
            alert('Review submitted successfully!');
        } else {
            alert(data.message || 'Failed to submit review');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('An error occurred. Please try again.');
    }
};

  if (!product) return <div className="text-center py-20 text-gray-600 text-xl">Loading product...</div>;

  return (
    <section className="bg-gray-50 min-h-screen py-10">
      {/* Breadcrumb */}
      <div className="border-t border-gray-200">
        <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="text-lg text-gray-800 hover:text-orange-500 transition">Home</a>
          <span className="text-lg text-gray-400">/</span>
          <span className="text-lg text-gray-500">{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex justify-center items-center">
            <img
              src={`https://goudhan.com/admin/storage/app/public/${product.images[0]?.image_path}`}
              alt={product.name}
              className="w-full max-w-md object-contain rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {product.discount}% Off
              </span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-semibold ${
                  product.quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{product.name}</h2>

            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold text-gray-900">₹{parseFloat(product.selling_price).toFixed(2)}</p>
              <p className="text-xl text-gray-500 line-through">₹{parseFloat(product.admin_mrp_price).toFixed(2)}</p>
            </div>

            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium text-gray-800">Quantity:</span>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={decrement}
                  className="px-4 py-2 text-xl text-gray-700 hover:bg-orange-50 transition"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-2 text-lg text-gray-800">{quantity}</span>
                <button
                  onClick={increment}
                  className="px-4 py-2 text-xl text-gray-700 hover:bg-orange-50 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-shadow hover:shadow-lg"
              disabled={product.quantity === 0}
            >
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Product Description</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        </div>

 <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  
  {relatedProducts.length > 0 ? (
    relatedProducts.map((related) => (
      <div
        key={related.id}
        className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer"
        onClick={() => navigate(`/product/${related.slug}`)}
      >
        {related.images && related.images.length > 0 ? (
          <img
            src={related.images[0]} // Use direct URL from API
            alt={related.name}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-gray-500">No Image Available</span>
          </div>
        )}
        <h4 className="text-lg font-semibold text-gray-800">{related.name}</h4>
        <p className="text-gray-600">₹{parseFloat(related.selling_price).toFixed(2)}</p>
      </div>
    ))
  ) : (
    <p className="text-gray-500">No related products found.</p>
  )}
</div>
</div>
        {/* User Reviews */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Customer Reviews</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

        {/* Review Form */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserReview({ ...userReview, rating: star })}
                    className={`text-2xl ${star <= userReview.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Your Review</label>
              <textarea
                value={userReview.comment}
                onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
                placeholder="Share your thoughts about the product..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;