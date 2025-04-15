// Real authentication API implementation

export interface LoginCredentials {
    email: string // Changed from username to name to match the API
    password: string
  }
  
  export interface LoginResponse {
    message: string
    token: string
    user: {
      id: string
      email: string
      name: string
      role: "admin" | "user"
      created_at: string
    }
  }
  
  export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await fetch("https://ye887syarg.execute-api.ap-southeast-1.amazonaws.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
  
      // Check if response is empty
      const text = await response.text()
      if (!text) {
        throw new Error("Máy chủ không trả về dữ liệu. Vui lòng thử lại sau.")
      }
  
      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error("Invalid JSON response:", e)
        throw new Error("Định dạng phản hồi không hợp lệ từ máy chủ")
      }
  
      // Check if the response indicates an error
      if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại")
      }
  
      return data
    } catch (error) {
      console.error("Login error:", error)
      throw error instanceof Error ? error : new Error("Đã xảy ra lỗi khi đăng nhập")
    }
  }
  
  export const logoutUser = async (): Promise<void> => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
  
      // Only try to parse JSON if there's content
      if (response.headers.get("content-length") !== "0") {
        const text = await response.text()
        if (text) {
          try {
            const data = JSON.parse(text)
            if (!response.ok) {
              throw new Error(data.message || "Đăng xuất thất bại")
            }
          } catch (e) {
            console.error("Invalid JSON in logout response:", e)
          }
        }
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error)
    } finally {
      // Always remove the token from localStorage
      localStorage.removeItem("token")
    }
  }
  

  