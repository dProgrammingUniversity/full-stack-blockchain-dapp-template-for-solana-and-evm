// /app/auth/login/page.tsx
import Login from "@/components/auth/Login";

const LoginPage = ({ searchParams }: { searchParams: { message: string } }) => {
  return (
    <>
    <Login searchParams={searchParams} />
    </>
  );
};

export default LoginPage;
