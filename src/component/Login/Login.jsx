import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const data = { userName, password }; // Use the correct field names
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login/user",
        data
      );

      // Check if the response contains a token and userId
      if (response.data.token) {
        const { token, userId } = response.data; // Assuming userId is returned in the response

        // Store token and user ID in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId); // Store userId directly

        setSuccess("Đăng nhập thành công!");
        setTimeout(() => {
          navigate("/home");
          window.location.reload(); // Reload to fetch user data or reset app state
        }, 500);
      } else {
        setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } catch (error) {
      // Check for errors from the server
      if (error.response && error.response.data) {
        setError(
          error.response.data.error || "Đã có lỗi xảy ra. Vui lòng thử lại."
        );
      } else {
        setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 relative">
      {/* Success Notification */}
      {success && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded shadow-lg z-50">
          <p className="text-center">{success}</p>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng Nhập
        </h2>

        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}

        <form onSubmit={login}>
          <div className="mb-4">
            <label htmlFor="userName" className="block text-gray-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Mật khẩu
            </label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-600 focus:outline-none">
                {showPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600"
            disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-orange-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
