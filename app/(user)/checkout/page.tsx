"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Truck,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Check,
  Home,
  Building2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  selectCart,
  clearCart,
  selectCartItemsCount,
} from "@/app/lib/store/features/cartSlice";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/lib/store/store";
import Link from "next/link";
import { getImageUrl } from "@/app/utils/getImageUrl";
import {
  addUserAddress,
} from "@/app/lib/store/features/authSlice";
import Loader from "@/app/commonComponents/loader";
import { Address } from "@/app/types/auth.types";
import { states } from "@/app/utils/indianStates";
import { placeOrder } from "@/app/lib/store/features/orderSlice";
import { orderService } from "@/app/sercices/user/order.service";
import { toast } from "sonner";
declare global {
  interface Window {
    Razorpay: any;
  }
}
interface FormData {
  email: string;
  fullname: string;
  phone: string;
  selectedAddressId: string;
  newAddress: {
    type: "home" | "work" | "other";
    // name: string; // optional (not in backend yet, but fine to keep as label)
    address1: string; // ✅ should be address1
    address2: string;
    landmark: string;
    city: string;
    state: string;
    zipCode: string;
  };
  cardNumber: string;
  cardName: string;
  secondaryNumber: string;
  expiryDate: string;
  cvv: string;
  saveInfo: boolean;
  paymentMethods: string;
}

interface FormErrors {
  [key: string]: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useSelector(selectCart);
  const totalItems = useSelector(selectCartItemsCount);
  const { isAuthenticated, status, user, addressStatus } = useAppSelector(
    (state: RootState) => state.auth,
  );

  // Mock addresses - In real app, fetch from profile slice
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const isLoading = status === "loading";
  const addressLoading = addressStatus == "loading";
  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  useEffect(() => {
    if (user && user.addresses) {
      setSavedAddresses(
        user.addresses.map((addr: any) => ({
          id: addr.id,
          addressType: addr.addressType,
          name: addr.addressType, // or addr.label if you add one
          address1: addr.address1,
          address2: addr.address2,
          landmark: addr.landmark,
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          isDefault: false, // you can add a flag in backend later
        })),
      );
    }
  }, [user]);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    fullname: "",
    phone: "",
    secondaryNumber: "",
    selectedAddressId:
      savedAddresses.find((addr) => addr.addressType === "home")?.id || "",
    newAddress: {
      type: "home",
      address1: "",
      address2: "",
      landmark: "",
      city: "",
      state: "",
      zipCode: "",
    },
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    paymentMethods: "",
    saveInfo: false,
  });
  // 🔥 Hydrate from Redux user whenever it becomes available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        fullname: user.fullname || "",
        phone: user.phoneNumber || "",
        secondaryNumber: user.secondaryNumber || "",
      }));
    }
  }, [user]);

  const [errors, setErrors] = useState<FormErrors>({});

  // Calculate order totals
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  // const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  // const total = subtotal + shipping + tax;
  const total = subtotal;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    if (name.startsWith("newAddress.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        newAddress: {
          ...formData.newAddress,
          [addressField]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";

      if (!formData.fullname) newErrors.fullname = "First name is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      if (formData.phone && formData.phone.length < 10)
        newErrors.phone = "Phone number must be 10 digits";
    }

    if (step === 2) {
      if (!showAddressForm && !formData.selectedAddressId) {
        newErrors.address = "Please select an address or add a new one";
      }
      if (showAddressForm) {
        if (!formData.newAddress.address1)
          newErrors["newAddress.address1"] = "Street Address is required";
        if (!formData.newAddress.address2)
          newErrors["newAddress.address2"] = "Address2 is required";
        if (!formData.newAddress.city)
          newErrors["newAddress.city"] = "City is required";
        if (!formData.newAddress.state)
          newErrors["newAddress.state"] = "State is required";
        if (!formData.newAddress.zipCode)
          newErrors["newAddress.zipCode"] = "ZIP code is required";
      }
    }

    // if (step === 3) {
    //   if (!formData.cardNumber)
    //     newErrors.cardNumber = "Card number is required";
    //   else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
    //     newErrors.cardNumber = "Card number must be 16 digits";
    //   }

    //   if (!formData.cardName) newErrors.cardName = "Name on card is required";

    //   if (!formData.expiryDate)
    //     newErrors.expiryDate = "Expiry date is required";
    //   else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
    //     newErrors.expiryDate = "Format must be MM/YY";
    //   }

    //   if (!formData.cvv) newErrors.cvv = "CVV is required";
    //   else if (!/^\d{3,4}$/.test(formData.cvv))
    //     newErrors.cvv = "CVV must be 3 or 4 digits";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setActiveStep(activeStep - 1);
  };
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.querySelector("#razorpay-sdk")) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const generateOrderId = async (): Promise<string | null> => {
    try {
      // load script first
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay SDK failed to load. Check your network.");
      }

      const orderData = {
        amount: total * 100,
        currency: "INR",
        receipt: `receipt_${total * 100}_${user.id}_${Date.now()}`,
      };

      const response = await orderService.createRazorPayOrder(orderData);
      if (!response.success) {
        throw new Error(response.error || "Failed to create order");
      }

      const options = {
        key: response.razorPayKey,
        amount: response.amount,
        currency: response.currency,
        name: "Testing",
        description: "Order Payment",
        order_id: response.orderId, // ✅ make sure you use response.orderId
        handler: async function (res: any) {
          console.log("Payment success:", res);

          try {
            // Now place order in backend / Redux
            let newres = await dispatch(
              placeOrder({
                userId: user.id,
                addressId: formData.selectedAddressId,
                items: items.map((i) => ({
                  productId: i.id,
                  quantity: i.quantity,
                  variantId: i.variantId,
                  variantName: i.variantName,
                })),
                paymentMethod: "online",
                transactionId: res.razorpay_payment_id,
              }),
            ).unwrap();
            setOrderId(newres?.orderId);
            setOrderSuccess(true);
            dispatch(clearCart());
            // clear cart etc.
          } catch (err) {
            console.error(err);
            toast.error("Error verifying payment");
          }
        },

        prefill: {
          name: formData.fullname || user?.fullname || "Customer",
          email: formData.email || user?.email || "customer@example.com",
          contact: formData.phone || user?.phoneNumber || "9999999999",
        },
        theme: { color: "#d97706" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      return response.orderId;
    } catch (error) {
      console.error("Order creation failed:", error);
      throw error;
    }
  };

  const handlePlaceOrderCOD = async () => {
    console.log("handlePlaceOrder");
    // if (validateStep(3)) {
    setIsProcessing(true);

    try {
      await dispatch(
        placeOrder({
          userId: user.id,
          addressId: formData.selectedAddressId,
          items: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            variantId: i.variantId,
            variantName: i.variantName,
          })),
          paymentMethod: formData.paymentMethods,
        }),
      ).unwrap();

      setOrderSuccess(true);
      dispatch(clearCart());
      toast.success("Order placed successfully!");
    } catch (error: any) {
      console.error("Order placement failed:", error);
      toast.error(error?.message || "Order placement failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
    // }
  };
  const handlePlaceOrderOnline = async () => {
    console.log("handlePlaceOrder");
    setIsProcessing(true);

    try {
      const orderId = await generateOrderId();

      if (!orderId) {
        throw new Error("Failed to generate order ID");
      }

      // ❌ REMOVE this part:
      // await dispatch(
      //   placeOrder({...})
      // ).unwrap();

      // ✅ Order will now be placed only after payment success
    } catch (error: any) {
      console.error("Order placement failed:", error);
      toast.error(error?.message || "Order placement failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNewAddress = async () => {
    if (validateStep(2)) {
      try {
        await dispatch(
          addUserAddress({
            addressType: formData.newAddress.type,
            address1: formData.newAddress.address1,
            address2: formData.newAddress.address2,
            landmark: formData.newAddress.landmark,
            city: formData.newAddress.city,
            state: formData.newAddress.state,
            zipCode: formData.newAddress.zipCode,
          }),
        ).unwrap();

        setShowAddressForm(false);
        toast.success("New address added successfully!");
      } catch (err: any) {
        console.error("Failed to add address:", err);
        toast.error(err?.message || "Failed to add address. Please try again.");
      }
    }
  };

  if (isLoading || addressLoading) {
    return <Loader />;
  }

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-amber-100/80 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-200/60">
            <AlertCircle className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add items to your cart before proceeding to checkout.
          </p>
          <Link href="/">
            <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-300">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/40 via-white to-neutral-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full border border-amber-100/80 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-amber-200/60">
            <CheckCircle className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-2">
            Your order ID is:{" "}
            <span className="font-bold text-amber-600">{orderId}</span>
          </p>
          <p className="text-gray-600 mb-8">
            You will receive a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-300">
                Continue Shopping
              </button>
            </Link>
            <Link href="/orderhistory">
              <button className="bg-white text-amber-700 border-2 border-amber-300 px-8 py-4 rounded-2xl font-semibold hover:bg-amber-50 transition-all duration-300 shadow-sm">
                View Order Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-neutral-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <Link href="/cart">
            <button className="flex items-center text-amber-700 font-semibold hover:text-amber-800 transition-colors bg-white border border-amber-200/60 px-6 py-3 rounded-2xl shadow-sm hover:shadow-md">
              <ArrowLeft className="w-5 h-5 mr-2 text-amber-600" />
              Back to Cart
            </button>
          </Link>
          <div className="text-sm text-gray-700 bg-white border border-amber-200/60 px-6 py-3 rounded-2xl shadow-sm">
            <Lock className="w-4 h-4 inline mr-2 text-amber-600" />
            Secure SSL Encrypted Checkout
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600">
            Secure checkout in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            {/* Enhanced Progress Steps */}
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                {[
                  { step: 1, title: "Contact", icon: User },
                  { step: 2, title: "Shipping", icon: MapPin },
                  { step: 3, title: "Payment", icon: CreditCard },
                ].map(({ step, title, icon: Icon }, index) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                          activeStep >= step
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {activeStep > step ? (
                          <Check className="w-6 h-6 stroke-[2.5]" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`mt-3 text-sm font-semibold ${
                          activeStep === step
                            ? "text-amber-700 font-bold"
                            : activeStep > step
                              ? "text-gray-900"
                              : "text-gray-400"
                        }`}
                      >
                        {title}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className="flex-1 mx-4">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            activeStep > step
                              ? "bg-gradient-to-r from-amber-500 to-amber-600"
                              : "bg-gray-200"
                          }`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Step 1: Contact Information */}
            {activeStep === 1 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-amber-200/50">
                    <User className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                        errors.fullname
                          ? "border-red-400 bg-red-50/40"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullname && (
                      <p className="mt-2 text-sm text-red-500 font-medium">
                        {errors.fullname}
                      </p>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                        errors.email
                          ? "border-red-400 bg-red-50/40"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Primary Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                      errors.phone
                        ? "border-red-400 bg-red-50/40"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    placeholder="Enter your primary phone number"
                  />
                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-500 font-medium">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Secondary Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    name="secondaryNumber"
                    value={formData.secondaryNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 hover:border-gray-300 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200"
                    placeholder="Enter secondary phone number"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (isAuthenticated) {
                        handleNextStep(); // proceed
                      } else {
                        router.push("/authentication/login"); // go to login if not logged in
                      }
                    }}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Continue to Shipping
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Address */}
            {activeStep === 2 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-amber-200/50">
                    <MapPin className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Shipping Address
                  </h2>
                </div>

                {!showAddressForm && (
                  <>
                    {/* Saved Addresses */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Choose from saved addresses
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedAddresses.map((address) => (
                          <div
                            key={address.id}
                            className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                              formData.selectedAddressId === address.id
                                ? "border-amber-500 bg-amber-50/40 shadow-md ring-1 ring-amber-500"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                            }`}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                selectedAddressId: address.id,
                              })
                            }
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {address.addressType === "home" ? (
                                  <Home className="w-5 h-5 mr-2 text-amber-600" />
                                ) : address.addressType === "work" ? (
                                  <Building2 className="w-5 h-5 mr-2 text-amber-600" />
                                ) : (
                                  <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                                )}
                                <span className="font-semibold text-gray-800 capitalize">
                                  {address.addressType}
                                </span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm">
                              {address.address1}
                              {address.address2 && `, ${address.address2}`}
                              <br />
                              {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-center mb-8">
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="bg-white text-amber-700 border-2 border-amber-300 px-6 py-3 rounded-2xl font-semibold hover:bg-amber-50 transition-all duration-200 flex items-center mx-auto shadow-sm"
                      >
                        <Plus className="w-5 h-5 mr-2 text-amber-600" />
                        Add New Address
                      </button>
                    </div>
                  </>
                )}

                {/* New Address Form */}
                {showAddressForm && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Add New Address
                      </h3>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="text-gray-500 hover:text-gray-700 font-medium"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-0">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Address Type *
                        </label>
                        <select
                          name="newAddress.type"
                          value={formData.newAddress.type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200"
                        >
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                          <option value="other">Other</option>
                        </select>
                      </div>{" "}
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="newAddress.address1"
                          value={formData.newAddress.address1}
                          onChange={handleInputChange}
                          placeholder="Enter your street address"
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                            errors["newAddress.address1"]
                              ? "border-red-400 bg-red-50/40"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        />

                        {errors["newAddress.address1"] && (
                          <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors["newAddress.address1"]}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rest of the address form fields */}

                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Landmark
                      </label>
                      <input
                        type="text"
                        name="newAddress.landmark"
                        required
                        value={formData.newAddress.landmark}
                        onChange={handleInputChange}
                        placeholder="Landmark"
                        className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                          errors["newAddress.landmark"]
                            ? "border-red-400 bg-red-50/40"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />{" "}
                      {errors["newAddress.landmark"] && (
                        <p className="mt-2 text-sm text-red-500 font-medium">
                          {errors["newAddress.landmark"]}
                        </p>
                      )}
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Apartment, Suite, etc. (optional)
                      </label>
                      <input
                        type="text"
                        name="newAddress.address2"
                        value={formData.newAddress.address2}
                        onChange={handleInputChange}
                        placeholder="Apartment, suite, floor, etc."
                        className="w-full px-4 py-4 border-2 border-gray-200 hover:border-gray-300 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          City *
                        </label>
                        <input
                          type="text"
                          name="newAddress.city"
                          value={formData.newAddress.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                            errors["newAddress.city"]
                              ? "border-red-400 bg-red-50/40"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="City"
                        />
                        {errors["newAddress.city"] && (
                          <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors["newAddress.city"]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          State *
                        </label>
                        <select
                          name="newAddress.state"
                          value={formData.newAddress.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                            errors["newAddress.state"]
                              ? "border-red-400 bg-red-50/40"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <option value="">Select State</option>
                          {states.map((state) => (
                            <option key={state.code} value={state.code}>
                              {state.name}
                            </option>
                          ))}
                        </select>
                        {errors["newAddress.state"] && (
                          <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors["newAddress.state"]}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          name="newAddress.zipCode"
                          value={formData.newAddress.zipCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 outline-none transition-all duration-200 ${
                            errors["newAddress.zipCode"]
                              ? "border-red-400 bg-red-50/40"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          placeholder="ZIP Code"
                        />
                        {errors["newAddress.zipCode"] && (
                          <p className="mt-2 text-sm text-red-500 font-medium">
                            {errors["newAddress.zipCode"]}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleAddNewAddress}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-md shadow-amber-500/20 transform hover:scale-[1.02] transition-all duration-200"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={handlePrevStep}
                    className="text-amber-700 hover:text-amber-800 font-semibold transition-colors flex items-center bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 px-6 py-3 rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 text-amber-600" />
                    Back to Contact
                  </button>
                  {!showAddressForm && (
                    <button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-300"
                    >
                      Continue to Payment
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Payment Information */}
            {activeStep === 3 && (
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-amber-200/50">
                    <CreditCard className="w-6 h-6 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Select Payment Method
                  </h2>
                </div>

                {/* Determine allowed payment methods */}
                {(() => {
                  const allCod = items.every(
                    (item) =>
                      item.paymentMethods === "cod" ||
                      item.paymentMethods === "both",
                  );
                  const allOnline = items.every(
                    (item) =>
                      item.paymentMethods === "online" ||
                      item.paymentMethods === "both",
                  );
                  return (
                    <div className="flex flex-col gap-4 mb-8">
                      {allCod && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, paymentMethods: "cod" })
                          }
                          className={`w-full text-left p-4 border rounded-2xl transition-all ${
                            formData.paymentMethods === "cod"
                              ? "border-amber-500 bg-amber-50/40 ring-1 ring-amber-500"
                              : "border-gray-200 hover:border-amber-400"
                          }`}
                        >
                          <span className="text-gray-800 font-semibold">
                            Cash on Delivery
                          </span>
                        </button>
                      )}

                      {allOnline && (
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              paymentMethods: "online",
                            })
                          }
                          className={`w-full text-left p-4 border rounded-2xl transition-all ${
                            formData.paymentMethods === "online"
                              ? "border-amber-500 bg-amber-50/40 ring-1 ring-amber-500"
                              : "border-gray-200 hover:border-amber-400"
                          }`}
                        >
                          <span className="text-gray-800 font-semibold">
                            Online Payment (UPI, Cards, NetBanking)
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })()}

                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="text-amber-700 hover:text-amber-800 font-semibold transition-colors flex items-center bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 px-6 py-3 rounded-2xl"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2 text-amber-600" />
                    Back to Shipping
                  </button>

                  <button
                    onClick={() =>
                      formData.paymentMethods == "cod"
                        ? handlePlaceOrderCOD()
                        : handlePlaceOrderOnline()
                    }
                    disabled={isProcessing || !formData.paymentMethods}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-amber-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Place Order • ₹${total.toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mr-3 border border-amber-200/50">
                  <CheckCircle className="w-5 h-5 text-amber-600" />
                </div>
                Order Summary
              </h2>

              <div className="mb-8 max-h-96 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center py-4 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-200/50">
                      <img
                        src={getImageUrl(item.imageUrl)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-gray-900 font-bold text-lg">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-gray-900 text-xl">
                    <span>Total</span>
                    <span className="text-amber-600 font-extrabold">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Security Badges */}
              <div className="border-t-2 border-gray-200 pt-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mb-2 border border-amber-200/50">
                      <Shield className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      Secure Payment
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mb-2 border border-amber-200/50">
                      <Lock className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      SSL Encrypted
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center mb-2 border border-amber-200/50">
                      <Truck className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">
                      Fast Delivery
                    </p>
                  </div>
                </div>
              </div>

              {/* Free shipping notice */}
              {/* {subtotal < 100 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium text-center">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
