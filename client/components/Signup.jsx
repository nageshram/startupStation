import { Framer } from "lucide-react";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_API_URL;

export const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    phno: "",
    aadhar: "",
    designation: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [usernameStatus, setUsernameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const validate = () => {
    const newErrors = {};

    if (!/^[a-z0-9._]+$/.test(formData.username)) {
      newErrors.username = "Username must contain only lowercase letters, numbers, dots, or underscores.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }

    if (!/^\d{10}$/.test(formData.phno)) {
      newErrors.phno = "Phone number must be 10 digits.";
    }

    if (!/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = "Aadhar must be 12 digits.";
    }

    if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least 1 number, 1 uppercase, 1 lowercase letter and be at least 8 characters.";
    }

    if (!formData.designation) {
      newErrors.designation = "Select a role.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix form errors.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 409) {
        toast.error("Username or email already exists.");
      } else if (!res.ok) {
        toast.error("Signup failed. Try again.");
      } else {
        toast.success("Signup successful!");
        navigate("/home");
      }
    } catch (error) {
      toast.error("Server error.");
    }
  };

  const checkUsername = async () => {
    const username = formData.username.trim();
    if (!username) return;
    const res = await fetch(`${BASE_URL}/api/users/check-username`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    const data = await res.json();
    setUsernameStatus(data.available ? "Available ✅" : "Already taken ❌");
  };

  const checkEmail = async () => {
    const email = formData.email.trim();
    if (!email) return;
    const res = await fetch(`${BASE_URL}/api/users/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setEmailStatus(data.available ? "Available ✅" : "Already exists ❌");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <>
    <section className="login1 bg-violet-500">
    <div className="w-full min-h-screen bg-purple-100 login flex justify-center items-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-pink-600 flex items-center justify-center gap-2 mb-2">
            <Framer /> <Link to="/" >Startup Stn.</Link>
          </h1>
          <p className="text-gray-600 mb-6">Signup to build your dream</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Username", name: "username", type: "text", note: usernameStatus, onBlur: checkUsername },
            { label: "Email", name: "email", type: "email", note: emailStatus, onBlur: checkEmail },
            { label: "Phone", name: "phno", type: "text" },
            { label: "Password", name: "password", type: "password", ref: passwordRef },
            { label: "Address", name: "address", type: "text" },
            { label: "Aadhar", name: "aadhar", type: "text" },
          ].map(({ label, name, type, note, onBlur, ref }) => (
            <div key={name}>
              <label className="block font-medium text-gray-700">
                {label}
                <input
                  type={type}
                  name={name}
                  ref={ref}
                  value={formData[name]}
                  onChange={handleChange}
                  onBlur={onBlur}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                    errors[name] ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
                />
                {note && <p className="text-sm text-gray-600 mt-1">{note}</p>}
                {errors[name] && <p className="text-sm text-red-500">{errors[name]}</p>}
              </label>
            </div>
          ))}

          <div>
            <label className="block font-medium text-gray-700">
              Designation
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md ${
                  errors.designation ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-pink-500 focus:border-pink-500`}
              >
                <option value="">Select a role</option>
                <option value="Dev">Developer/Others</option>
                <option value="Founder">Founder</option>
                <option value="Investor">Investor</option>
              </select>
              {errors.designation && <p className="text-sm text-red-500">{errors.designation}</p>}
            </label>
          </div>

          <div className="col-span-full">
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    </section>
    </>
  );
};
